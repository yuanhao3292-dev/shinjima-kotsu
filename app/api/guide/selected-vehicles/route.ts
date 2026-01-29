import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { z } from 'zod';

/**
 * 导游已选车辆管理 API
 *
 * POST /api/guide/selected-vehicles - 添加/移除车辆
 */

const ActionSchema = z.object({
  action: z.enum(['add', 'remove']),
  vehicleId: z.string().uuid(),
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
    `${clientIp}:/api/guide/selected-vehicles`,
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

  const { action, vehicleId } = parseResult.data;

  try {
    // 验证车辆存在且可用
    const { data: vehicle } = await supabase
      .from('vehicle_library')
      .select('id, name, is_active')
      .eq('id', vehicleId)
      .single();

    if (!vehicle) {
      return createErrorResponse(Errors.notFound('车辆不存在'));
    }

    if (!vehicle.is_active) {
      return createErrorResponse(Errors.business('该车辆当前不可用', 'VEHICLE_INACTIVE'));
    }

    if (action === 'add') {
      // 检查是否已添加
      const { data: existing } = await supabase
        .from('guide_selected_vehicles')
        .select('id')
        .eq('guide_id', guideId)
        .eq('vehicle_id', vehicleId)
        .maybeSingle();

      if (existing) {
        return createErrorResponse(Errors.validation('该车辆已添加'));
      }

      // 获取当前最大 sort_order
      const { data: maxOrder } = await supabase
        .from('guide_selected_vehicles')
        .select('sort_order')
        .eq('guide_id', guideId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      const newOrder = (maxOrder?.sort_order ?? -1) + 1;

      const { error: insertError } = await supabase
        .from('guide_selected_vehicles')
        .insert({
          guide_id: guideId,
          vehicle_id: vehicleId,
          sort_order: newOrder,
          is_enabled: true,
        });

      if (insertError) {
        logError(normalizeError(insertError), { path: '/api/guide/selected-vehicles', method: 'POST' });
        return createErrorResponse(Errors.internal('添加车辆失败'));
      }

      return NextResponse.json({
        success: true,
        message: `已添加车辆：${vehicle.name}`,
      });
    } else {
      // remove
      const { error: deleteError } = await supabase
        .from('guide_selected_vehicles')
        .delete()
        .eq('guide_id', guideId)
        .eq('vehicle_id', vehicleId);

      if (deleteError) {
        logError(normalizeError(deleteError), { path: '/api/guide/selected-vehicles', method: 'POST' });
        return createErrorResponse(Errors.internal('移除车辆失败'));
      }

      return NextResponse.json({
        success: true,
        message: `已移除车辆：${vehicle.name}`,
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/selected-vehicles', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
