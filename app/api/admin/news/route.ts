import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { z } from 'zod';

/**
 * 管理员新闻管理 API
 *
 * GET /api/admin/news - 获取新闻列表（包括未发布的）
 * GET /api/admin/news?id=xxx - 获取单条新闻详情
 * POST /api/admin/news - 创建/更新/删除/发布新闻
 */

// 新闻操作 Schema
const NewsActionSchema = z.object({
  action: z.enum(['create', 'update', 'delete', 'toggle_publish', 'toggle_featured']),
  newsId: z.string().uuid().optional(),
  newsData: z.object({
    title: z.string().min(1).max(200).optional(),
    summary: z.string().max(500).optional(),
    content: z.string().optional(),
    category: z.enum(['announcement', 'press', 'service']).optional(),
    image_url: z.string().url().nullable().optional(),
    is_published: z.boolean().optional(),
    is_featured: z.boolean().optional(),
    published_at: z.string().optional(), // ISO date string
  }).optional(),
});

export async function GET(request: NextRequest) {
  // 速率限制
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(
    `${clientIp}:/api/admin/news:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const newsId = searchParams.get('id');
  const category = searchParams.get('category');
  const published = searchParams.get('published');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');

  // 分页参数
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const offset = (page - 1) * limit;

  try {
    if (newsId) {
      // 获取单条新闻详情
      const { data: news, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();

      if (error || !news) {
        return createErrorResponse(Errors.notFound('新闻不存在'));
      }

      return NextResponse.json(news);
    } else {
      // 获取新闻列表（带分页）
      let query = supabase
        .from('news')
        .select('*', { count: 'exact' })
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (published === 'true') {
        query = query.eq('is_published', true);
      } else if (published === 'false') {
        query = query.eq('is_published', false);
      }
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }
      // 搜索
      if (search) {
        query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
      }

      const { data: newsList, error, count } = await query;

      if (error) {
        logError(normalizeError(error), { path: '/api/admin/news', method: 'GET' });
        return createErrorResponse(Errors.internal('获取新闻列表失败'));
      }

      // 统计
      const { count: total } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true });

      const { count: publishedCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      const { count: featuredCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true);

      return NextResponse.json({
        news: newsList || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
        stats: {
          total: total || 0,
          published: publishedCount || 0,
          draft: (total || 0) - (publishedCount || 0),
          featured: featuredCount || 0,
        },
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/news', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 速率限制
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(
      `${clientIp}:/api/admin/news`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    // 解析和验证请求体
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse(Errors.validation('无效的 JSON 格式'));
    }

    const validation = NewsActionSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(Errors.validation(validation.error.issues[0]?.message || '参数验证失败'));
    }

    const { action, newsId, newsData } = validation.data;
    const supabase = getSupabaseAdmin();

    switch (action) {
      case 'create': {
        if (!newsData?.title || !newsData?.category) {
          return createErrorResponse(Errors.validation('标题和分类为必填项'));
        }

        const { data: newNews, error } = await supabase
          .from('news')
          .insert({
            title: newsData.title,
            summary: newsData.summary || null,
            content: newsData.content || null,
            category: newsData.category,
            image_url: newsData.image_url || null,
            is_published: newsData.is_published ?? false,
            is_featured: newsData.is_featured ?? false,
            published_at: newsData.published_at || (newsData.is_published ? new Date().toISOString() : null),
            created_by: authResult.userId,
            updated_by: authResult.userId,
          })
          .select()
          .single();

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/news', method: 'POST', action: 'create' });
          return createErrorResponse(Errors.internal('创建新闻失败'));
        }

        // 记录审计日志
        await logAuditAction(supabase, 'news_create', 'news', newNews.id, authResult, { title: newsData.title });

        return NextResponse.json({ success: true, message: '新闻已创建', news: newNews });
      }

      case 'update': {
        if (!newsId) {
          return createErrorResponse(Errors.validation('缺少新闻 ID'));
        }

        const updateData: Record<string, unknown> = {
          updated_by: authResult.userId,
        };

        // 只更新提供的字段
        if (newsData?.title !== undefined) updateData.title = newsData.title;
        if (newsData?.summary !== undefined) updateData.summary = newsData.summary;
        if (newsData?.content !== undefined) updateData.content = newsData.content;
        if (newsData?.category !== undefined) updateData.category = newsData.category;
        if (newsData?.image_url !== undefined) updateData.image_url = newsData.image_url;
        if (newsData?.is_published !== undefined) updateData.is_published = newsData.is_published;
        if (newsData?.is_featured !== undefined) updateData.is_featured = newsData.is_featured;
        if (newsData?.published_at !== undefined) updateData.published_at = newsData.published_at;

        const { data: updatedNews, error } = await supabase
          .from('news')
          .update(updateData)
          .eq('id', newsId)
          .select()
          .single();

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/news', method: 'POST', action: 'update' });
          return createErrorResponse(Errors.internal('更新新闻失败'));
        }

        await logAuditAction(supabase, 'news_update', 'news', newsId, authResult, { updateData });

        return NextResponse.json({ success: true, message: '新闻已更新', news: updatedNews });
      }

      case 'toggle_publish': {
        if (!newsId) {
          return createErrorResponse(Errors.validation('缺少新闻 ID'));
        }

        // 获取当前状态
        const { data: news } = await supabase
          .from('news')
          .select('is_published, published_at')
          .eq('id', newsId)
          .single();

        if (!news) {
          return createErrorResponse(Errors.notFound('新闻不存在'));
        }

        const newPublishedState = !news.is_published;
        const { error } = await supabase
          .from('news')
          .update({
            is_published: newPublishedState,
            published_at: newPublishedState && !news.published_at ? new Date().toISOString() : news.published_at,
            updated_by: authResult.userId,
          })
          .eq('id', newsId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/news', method: 'POST', action: 'toggle_publish' });
          return createErrorResponse(Errors.internal('切换发布状态失败'));
        }

        await logAuditAction(supabase, 'news_toggle_publish', 'news', newsId, authResult, {
          previousState: news.is_published,
          newState: newPublishedState,
        });

        return NextResponse.json({
          success: true,
          message: newPublishedState ? '新闻已发布' : '新闻已取消发布',
        });
      }

      case 'toggle_featured': {
        if (!newsId) {
          return createErrorResponse(Errors.validation('缺少新闻 ID'));
        }

        // 获取当前状态
        const { data: news } = await supabase
          .from('news')
          .select('is_featured')
          .eq('id', newsId)
          .single();

        if (!news) {
          return createErrorResponse(Errors.notFound('新闻不存在'));
        }

        const newFeaturedState = !news.is_featured;
        const { error } = await supabase
          .from('news')
          .update({
            is_featured: newFeaturedState,
            updated_by: authResult.userId,
          })
          .eq('id', newsId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/news', method: 'POST', action: 'toggle_featured' });
          return createErrorResponse(Errors.internal('切换精选状态失败'));
        }

        await logAuditAction(supabase, 'news_toggle_featured', 'news', newsId, authResult, {
          previousState: news.is_featured,
          newState: newFeaturedState,
        });

        return NextResponse.json({
          success: true,
          message: newFeaturedState ? '已设为精选' : '已取消精选',
        });
      }

      case 'delete': {
        if (!newsId) {
          return createErrorResponse(Errors.validation('缺少新闻 ID'));
        }

        const { error } = await supabase
          .from('news')
          .delete()
          .eq('id', newsId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/news', method: 'POST', action: 'delete' });
          return createErrorResponse(Errors.internal('删除新闻失败'));
        }

        await logAuditAction(supabase, 'news_delete', 'news', newsId, authResult, {});

        return NextResponse.json({ success: true, message: '新闻已删除' });
      }

      default:
        return createErrorResponse(Errors.validation('无效的操作'));
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/news', method: 'POST' });
    return createErrorResponse(apiError);
  }
}

/**
 * 记录审计日志（封装，失败时打印告警但不阻断主流程）
 */
async function logAuditAction(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  action: string,
  entityType: string,
  entityId: string,
  authResult: { userId?: string; email?: string },
  details: Record<string, unknown>
) {
  const { error } = await supabase.from('audit_logs').insert({
    action,
    entity_type: entityType,
    entity_id: entityId,
    admin_id: authResult.userId,
    admin_email: authResult.email,
    details,
  });

  if (error) {
    console.error('[CRITICAL] 审计日志写入失败:', error);
  }
}
