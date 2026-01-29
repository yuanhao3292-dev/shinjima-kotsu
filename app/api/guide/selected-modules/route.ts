import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { z } from 'zod';

/**
 * 导游已选模块管理 API
 *
 * POST /api/guide/selected-modules - 添加/移除模块
 */

const ActionSchema = z.object({
  action: z.enum(['add', 'remove']),
  moduleId: z.string().uuid(),
});

async function verifyGuideAndGetId(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: Errors.auth('未授权') };
  }

  const token = authHeader.substring(7);
  const supabase = getSupabaseAdmin();

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return { error: Errors.auth('无效的认证令牌') };
  }

  const { data: guide, error: guideError } = await supabase
    .from('guides')
    .select('id, status')
    .eq('auth_user_id', user.id)
    .single();

  if (guideError || !guide) {
    return { error: Errors.auth('导游账户不存在') };
  }

  if (guide.status !== 'approved') {
    return { error: Errors.business('导游账户未通过审核', 'GUIDE_NOT_APPROVED') };
  }

  // 检查是否有白标配置
  const { data: config } = await supabase
    .from('guide_white_label')
    .select('id')
    .eq('guide_id', guide.id)
    .maybeSingle();

  if (!config) {
    return { error: Errors.business('请先创建白标页面配置', 'CONFIG_NOT_FOUND') };
  }

  return { guideId: guide.id, supabase };
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/guide/selected-modules`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyGuideAndGetId(request);
  if ('error' in authResult) {
    return createErrorResponse(authResult.error);
  }

  const { guideId, supabase } = authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse(Errors.validation('无效的请求体'));
  }

  const parseResult = ActionSchema.safeParse(body);
  if (!parseResult.success) {
    return createErrorResponse(Errors.validation('参数错误'));
  }

  const { action, moduleId } = parseResult.data;

  try {
    // 验证模块存在且可用
    const { data: module } = await supabase
      .from('page_modules')
      .select('id, name, is_required, is_active')
      .eq('id', moduleId)
      .single();

    if (!module) {
      return createErrorResponse(Errors.notFound('模块不存在'));
    }

    if (!module.is_active) {
      return createErrorResponse(Errors.business('该模块当前不可用', 'MODULE_INACTIVE'));
    }

    if (action === 'add') {
      // 检查是否已添加
      const { data: existing } = await supabase
        .from('guide_selected_modules')
        .select('id')
        .eq('guide_id', guideId)
        .eq('module_id', moduleId)
        .maybeSingle();

      if (existing) {
        return createErrorResponse(Errors.validation('该模块已添加'));
      }

      // 获取当前最大 sort_order
      const { data: maxOrder } = await supabase
        .from('guide_selected_modules')
        .select('sort_order')
        .eq('guide_id', guideId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      const newOrder = (maxOrder?.sort_order ?? -1) + 1;

      const { error: insertError } = await supabase
        .from('guide_selected_modules')
        .insert({
          guide_id: guideId,
          module_id: moduleId,
          sort_order: newOrder,
          is_enabled: true,
        });

      if (insertError) {
        logError(normalizeError(insertError), { path: '/api/guide/selected-modules', method: 'POST' });
        return createErrorResponse(Errors.internal('添加模块失败'));
      }

      return NextResponse.json({
        success: true,
        message: `已添加模块：${module.name}`,
      });
    } else {
      // remove
      if (module.is_required) {
        return createErrorResponse(Errors.business('必选模块无法移除', 'MODULE_REQUIRED'));
      }

      const { error: deleteError } = await supabase
        .from('guide_selected_modules')
        .delete()
        .eq('guide_id', guideId)
        .eq('module_id', moduleId);

      if (deleteError) {
        logError(normalizeError(deleteError), { path: '/api/guide/selected-modules', method: 'POST' });
        return createErrorResponse(Errors.internal('移除模块失败'));
      }

      return NextResponse.json({
        success: true,
        message: `已移除模块：${module.name}`,
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/selected-modules', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
