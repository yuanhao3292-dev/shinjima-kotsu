import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { GuideSelectedVehicleActionSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 导游已选车辆管理 API
 *
 * POST /api/guide/selected-vehicles - 添加/更新/移除车辆
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
    `${clientIp}:/api/guide/selected-vehicles`,
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

  const validation = await validateBody(request, GuideSelectedVehicleActionSchema);
  if (!validation.success) return validation.error;
  const { action, vehicleId, customName, customDescription, customImageUrl, isActive, displayOrder } = validation.data;

  try {
    // 验证车辆存在且可用
    const { data: vehicle } = await supabase
      .from('vehicle_library')
      .select('id, brand, model, is_active')
      .eq('id', vehicleId)
      .single();

    if (!vehicle) {
      return createErrorResponse(Errors.notFound('车辆不存在'));
    }

    if (!vehicle.is_active) {
      return createErrorResponse(Errors.business('该车辆当前不可用', 'VEHICLE_INACTIVE'));
    }

    const vehicleName = `${vehicle.brand} ${vehicle.model}`;

    switch (action) {
      case 'add': {
        // 检查是否已添加
        const { data: existing } = await supabase
          .from('guide_selected_vehicles')
          .select('id')
          .eq('guide_white_label_id', config.id)
          .eq('vehicle_id', vehicleId)
          .maybeSingle();

        if (existing) {
          return createErrorResponse(Errors.validation('该车辆已添加'));
        }

        // 获取当前最大 display_order
        const { data: maxOrder } = await supabase
          .from('guide_selected_vehicles')
          .select('display_order')
          .eq('guide_white_label_id', config.id)
          .order('display_order', { ascending: false })
          .limit(1)
          .maybeSingle();

        const newOrder = displayOrder ?? ((maxOrder?.display_order ?? -1) + 1);

        const { error: insertError } = await supabase
          .from('guide_selected_vehicles')
          .insert({
            guide_white_label_id: config.id,
            vehicle_id: vehicleId,
            custom_name: customName || null,
            custom_description: customDescription || null,
            custom_image_url: customImageUrl || null,
            is_active: isActive !== false,
            display_order: newOrder,
            created_at: new Date().toISOString(),
          });

        if (insertError) {
          logError(normalizeError(insertError), { path: '/api/guide/selected-vehicles', method: 'POST' });
          return createErrorResponse(Errors.internal('添加车辆失败'));
        }

        return NextResponse.json({
          success: true,
          message: `已添加车辆：${vehicleName}`,
        });
      }

      case 'update': {
        const updateData: Record<string, unknown> = {};

        if (customName !== undefined) updateData.custom_name = customName;
        if (customDescription !== undefined) updateData.custom_description = customDescription;
        if (customImageUrl !== undefined) updateData.custom_image_url = customImageUrl;
        if (isActive !== undefined) updateData.is_active = isActive;
        if (displayOrder !== undefined) updateData.display_order = displayOrder;

        const { error: updateError } = await supabase
          .from('guide_selected_vehicles')
          .update(updateData)
          .eq('guide_white_label_id', config.id)
          .eq('vehicle_id', vehicleId);

        if (updateError) {
          logError(normalizeError(updateError), { path: '/api/guide/selected-vehicles', method: 'POST' });
          return createErrorResponse(Errors.internal('更新车辆配置失败'));
        }

        return NextResponse.json({
          success: true,
          message: '车辆配置已更新',
        });
      }

      case 'remove': {
        const { error: deleteError } = await supabase
          .from('guide_selected_vehicles')
          .delete()
          .eq('guide_white_label_id', config.id)
          .eq('vehicle_id', vehicleId);

        if (deleteError) {
          logError(normalizeError(deleteError), { path: '/api/guide/selected-vehicles', method: 'POST' });
          return createErrorResponse(Errors.internal('移除车辆失败'));
        }

        return NextResponse.json({
          success: true,
          message: `已移除车辆：${vehicleName}`,
        });
      }

      default:
        return createErrorResponse(Errors.validation('无效的操作'));
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/selected-vehicles', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
