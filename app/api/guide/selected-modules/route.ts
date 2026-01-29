import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { GuideSelectedModuleActionSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 导游已选模块管理 API
 *
 * POST /api/guide/selected-modules - 添加/更新/移除模块
 */

async function verifyGuideAndGetConfig(request: NextRequest) {
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

  // 获取白标配置
  const { data: config } = await supabase
    .from('guide_white_label')
    .select('id')
    .eq('guide_id', guide.id)
    .maybeSingle();

  if (!config) {
    return { error: Errors.business('请先创建白标页面配置', 'CONFIG_NOT_FOUND') };
  }

  return { guide, config, supabase };
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

  const authResult = await verifyGuideAndGetConfig(request);
  if ('error' in authResult) {
    return createErrorResponse(authResult.error);
  }

  const { config, supabase } = authResult;

  const validation = await validateBody(request, GuideSelectedModuleActionSchema);
  if (!validation.success) return validation.error;
  const { action, moduleId, isEnabled, customConfig, displayOrder } = validation.data;

  try {
    // 验证模块存在且可用
    const { data: module } = await supabase
      .from('page_modules')
      .select('id, name, is_required, status')
      .eq('id', moduleId)
      .single();

    if (!module) {
      return createErrorResponse(Errors.notFound('模块不存在'));
    }

    if (module.status !== 'active') {
      return createErrorResponse(Errors.business('该模块当前不可用', 'MODULE_INACTIVE'));
    }

    switch (action) {
      case 'add': {
        // 检查是否已添加
        const { data: existing } = await supabase
          .from('guide_selected_modules')
          .select('id')
          .eq('guide_white_label_id', config.id)
          .eq('module_id', moduleId)
          .maybeSingle();

        if (existing) {
          return createErrorResponse(Errors.validation('该模块已添加'));
        }

        // 获取当前最大 display_order
        const { data: maxOrder } = await supabase
          .from('guide_selected_modules')
          .select('display_order')
          .eq('guide_white_label_id', config.id)
          .order('display_order', { ascending: false })
          .limit(1)
          .maybeSingle();

        const newOrder = displayOrder ?? ((maxOrder?.display_order ?? -1) + 1);

        const { error: insertError } = await supabase
          .from('guide_selected_modules')
          .insert({
            guide_white_label_id: config.id,
            module_id: moduleId,
            is_enabled: isEnabled !== false,
            custom_config: customConfig || null,
            display_order: newOrder,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          logError(normalizeError(insertError), { path: '/api/guide/selected-modules', method: 'POST' });
          return createErrorResponse(Errors.internal('添加模块失败'));
        }

        return NextResponse.json({
          success: true,
          message: `已添加模块：${module.name}`,
        });
      }

      case 'update': {
        const updateData: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };

        if (isEnabled !== undefined) updateData.is_enabled = isEnabled;
        if (customConfig !== undefined) updateData.custom_config = customConfig;
        if (displayOrder !== undefined) updateData.display_order = displayOrder;

        const { error: updateError } = await supabase
          .from('guide_selected_modules')
          .update(updateData)
          .eq('guide_white_label_id', config.id)
          .eq('module_id', moduleId);

        if (updateError) {
          logError(normalizeError(updateError), { path: '/api/guide/selected-modules', method: 'POST' });
          return createErrorResponse(Errors.internal('更新模块配置失败'));
        }

        return NextResponse.json({
          success: true,
          message: '模块配置已更新',
        });
      }

      case 'remove': {
        // 检查是否为必选模块
        if (module.is_required) {
          return createErrorResponse(Errors.business('必选模块无法移除', 'MODULE_REQUIRED'));
        }

        const { error: deleteError } = await supabase
          .from('guide_selected_modules')
          .delete()
          .eq('guide_white_label_id', config.id)
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

      default:
        return createErrorResponse(Errors.validation('无效的操作'));
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/selected-modules', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
