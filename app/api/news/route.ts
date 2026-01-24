import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 公开新闻 API（无需认证）
 *
 * GET /api/news - 获取已发布的新闻列表
 * GET /api/news?id=xxx - 获取单条新闻详情
 * GET /api/news?featured=true - 获取精选新闻
 * GET /api/news?lang=ja - 返回指定语言版本（支持 ja, zh-TW, zh-CN, en）
 */

type SupportedLang = 'ja' | 'zh-TW' | 'zh-CN' | 'en';
const SUPPORTED_LANGS: SupportedLang[] = ['ja', 'zh-TW', 'zh-CN', 'en'];

/**
 * 解析多语言字段
 * 如果字段值是 JSON 格式（含语言键），返回对应语言版本
 * 否则原样返回（视为 zh-TW 默认内容）
 */
function resolveI18nField(value: string | null, lang: SupportedLang): string | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      // 优先返回请求的语言，fallback: zh-TW → zh-CN → ja → en → 第一个可用值
      return parsed[lang] || parsed['zh-TW'] || parsed['zh-CN'] || parsed['ja'] || parsed['en'] || value;
    }
  } catch {
    // 不是 JSON，原样返回
  }
  return value;
}

/**
 * 对新闻对象应用多语言解析
 */
function localizeNews(news: Record<string, unknown>, lang: SupportedLang): Record<string, unknown> {
  return {
    ...news,
    title: resolveI18nField(news.title as string | null, lang),
    summary: resolveI18nField(news.summary as string | null, lang),
    ...(news.content !== undefined ? { content: resolveI18nField(news.content as string | null, lang) } : {}),
  };
}

export async function GET(request: NextRequest) {
  // 速率限制（稍宽松，因为是公开 API）
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(
    `${clientIp}:/api/news:GET`,
    { windowMs: 60_000, maxRequests: 60 } // 每分钟 60 次
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const newsId = searchParams.get('id');
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const langParam = searchParams.get('lang');
  const lang: SupportedLang = SUPPORTED_LANGS.includes(langParam as SupportedLang) ? (langParam as SupportedLang) : 'zh-TW';

  // 分页参数
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const offset = (page - 1) * limit;

  try {
    if (newsId) {
      // 获取单条新闻详情（必须是已发布的）
      const { data: news, error } = await supabase
        .from('news')
        .select('id, title, summary, content, category, image_url, is_featured, published_at, created_at')
        .eq('id', newsId)
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString())
        .single();

      if (error || !news) {
        return createErrorResponse(Errors.notFound('新闻不存在'));
      }

      return NextResponse.json(localizeNews(news, lang));
    } else {
      // 获取新闻列表（只返回已发布且发布时间已到的）
      let query = supabase
        .from('news')
        .select('id, title, summary, category, image_url, is_featured, published_at', { count: 'exact' })
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }

      const { data: newsList, error, count } = await query;

      if (error) {
        logError(normalizeError(error), { path: '/api/news', method: 'GET' });
        return createErrorResponse(Errors.internal('获取新闻列表失败'));
      }

      // 统计各分类数量（用于前端筛选器显示）
      const { count: totalCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString());

      const { count: announcementCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .eq('category', 'announcement')
        .lte('published_at', new Date().toISOString());

      const { count: pressCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .eq('category', 'press')
        .lte('published_at', new Date().toISOString());

      const { count: serviceCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .eq('category', 'service')
        .lte('published_at', new Date().toISOString());

      return NextResponse.json({
        news: (newsList || []).map(item => localizeNews(item, lang)),
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
        stats: {
          all: totalCount || 0,
          announcement: announcementCount || 0,
          press: pressCount || 0,
          service: serviceCount || 0,
        },
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/news', method: 'GET' });
    return createErrorResponse(apiError);
  }
}
