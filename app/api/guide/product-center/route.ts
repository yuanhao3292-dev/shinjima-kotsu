import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 导游产品中心 API
 *
 * GET /api/guide/product-center - 获取所有可用的模块
 *
 * 返回：
 * - modules: 所有可用模块（包含导游已选择的标记）
 * - guideConfig: 导游当前的白标配置（如果有）
 */

interface DBModule {
  id: string;
  category: string;
  name: string;
  name_ja: string | null;
  description: string | null;
  description_ja: string | null;
  thumbnail_url: string | null;
  commission_rate: number;
  is_required: boolean;
  is_active: boolean;
  component_key: string | null;
}


export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/guide/product-center:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  // 验证导游身份
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createErrorResponse(Errors.auth('未授权'));
  }

  const token = authHeader.substring(7);
  const supabase = getSupabaseAdmin();

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return createErrorResponse(Errors.auth('无效的认证令牌'));
  }

  try {
    // 获取导游信息（包含 slug）
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, name, email, status, slug')
      .eq('auth_user_id', user.id)
      .single();

    if (guideError || !guide) {
      return createErrorResponse(Errors.auth('导游账户不存在'));
    }

    if (guide.status !== 'approved') {
      return createErrorResponse(Errors.business('导游账户未通过审核', 'GUIDE_NOT_APPROVED'));
    }

    // 并行获取所有数据
    const [
      modulesResult,
      guideConfigResult,
      selectedModulesResult,
    ] = await Promise.all([
      // 获取所有活跃模块
      supabase
        .from('page_modules')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),

      // 获取导游的白标配置
      supabase
        .from('guide_white_label')
        .select('*')
        .eq('guide_id', guide.id)
        .maybeSingle(),

      // 获取导游已选择的模块 (使用 guide_id)
      supabase
        .from('guide_selected_modules')
        .select('module_id')
        .eq('guide_id', guide.id),
    ]);

    if (modulesResult.error) {
      logError(normalizeError(modulesResult.error), { path: '/api/guide/product-center', method: 'GET' });
      return createErrorResponse(Errors.internal('获取模块列表失败'));
    }

    // 构建已选择的ID集合
    const selectedModuleIds = new Set(
      (selectedModulesResult.data || []).map((m: { module_id: string }) => m.module_id)
    );

    // 转换模块数据格式以匹配前端期望
    const modules = ((modulesResult.data || []) as DBModule[]).map(module => ({
      id: module.id,
      module_type: module.category, // category -> module_type
      name: module.name,
      name_ja: module.name_ja,
      name_zh: module.name, // 中文名就是 name
      description: module.description,
      description_zh: module.description,
      icon_url: module.thumbnail_url,
      is_required: module.is_required,
      commission_rate_min: module.commission_rate,
      commission_rate_max: module.commission_rate,
      component_key: module.component_key,
      selectedByGuide: selectedModuleIds.has(module.id),
    }));

    // 合并 guide_white_label 配置和 guides 表的 slug
    const guideConfig = guideConfigResult.data
      ? {
          ...guideConfigResult.data,
          slug: guide.slug, // 从 guides 表获取 slug
        }
      : guide.slug
        ? { slug: guide.slug } // 如果没有 white_label 配置但有 slug
        : null;

    return NextResponse.json({
      modules,
      guideConfig,
      guide: {
        id: guide.id,
        name: guide.name,
        email: guide.email,
        slug: guide.slug, // 也在 guide 对象中返回
      },
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/product-center', method: 'GET' });
    return createErrorResponse(apiError);
  }
}
