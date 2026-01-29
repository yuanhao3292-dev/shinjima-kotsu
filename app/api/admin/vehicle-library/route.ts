import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { VehicleLibraryActionSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 管理员车辆库管理 API
 *
 * GET /api/admin/vehicle-library - 获取车辆列表
 * GET /api/admin/vehicle-library?id=xxx - 获取单个车辆详情
 * POST /api/admin/vehicle-library - 创建/更新/删除车辆
 */

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/vehicle-library:GET`,
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
  const vehicleId = searchParams.get('id');
  const vehicleType = searchParams.get('type');
  const active = searchParams.get('active');

  try {
    if (vehicleId) {
      const { data: vehicle, error } = await supabase
        .from('vehicle_library')
        .select('*')
        .eq('id', vehicleId)
        .single();

      if (error || !vehicle) {
        return createErrorResponse(Errors.notFound('车辆不存在'));
      }

      return NextResponse.json(vehicle);
    } else {
      let query = supabase
        .from('vehicle_library')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (vehicleType) {
        query = query.eq('vehicle_type', vehicleType);
      }
      if (active === 'true') {
        query = query.eq('is_active', true);
      } else if (active === 'false') {
        query = query.eq('is_active', false);
      }

      const { data: vehicles, error } = await query;

      if (error) {
        logError(normalizeError(error), { path: '/api/admin/vehicle-library', method: 'GET' });
        return createErrorResponse(Errors.internal('获取车辆列表失败'));
      }

      // 按车型分组统计
      const typeStats: Record<string, number> = {};
      vehicles?.forEach(v => {
        typeStats[v.vehicle_type] = (typeStats[v.vehicle_type] || 0) + 1;
      });

      return NextResponse.json({
        vehicles: vehicles || [],
        stats: {
          total: vehicles?.length || 0,
          active: vehicles?.filter(v => v.is_active).length || 0,
          inactive: vehicles?.filter(v => !v.is_active).length || 0,
          byType: typeStats,
        },
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/vehicle-library', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/vehicle-library`,
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

    const validation = await validateBody(request, VehicleLibraryActionSchema);
    if (!validation.success) return validation.error;
    const { action, vehicleId, vehicleData } = validation.data;

    const supabase = getSupabaseAdmin();

    switch (action) {
      case 'create': {
        const insertData = {
          vehicle_type: vehicleData!.vehicleType,
          brand: vehicleData!.brand,
          model: vehicleData!.model,
          year: vehicleData!.year || null,
          seat_capacity: vehicleData!.seatCapacity,
          luggage_capacity: vehicleData!.luggageCapacity || 0,
          image_url: vehicleData!.imageUrl || null,
          features: vehicleData!.features || [],
          description: vehicleData!.description || null,
          description_ja: vehicleData!.descriptionJa || null,
          description_zh: vehicleData!.descriptionZh || null,
          is_active: vehicleData!.isActive !== false,
          display_order: vehicleData!.displayOrder || 0,
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('vehicle_library').insert(insertData);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/vehicle-library', method: 'POST' });
          return createErrorResponse(Errors.internal('创建车辆失败'));
        }

        await logAuditAction(supabase, 'vehicle_create', 'vehicle_library', 'new', authResult, { vehicleData });

        return NextResponse.json({ success: true, message: '车辆已创建' });
      }

      case 'update': {
        const updateData: Record<string, unknown> = {};

        if (vehicleData!.vehicleType !== undefined) updateData.vehicle_type = vehicleData!.vehicleType;
        if (vehicleData!.brand !== undefined) updateData.brand = vehicleData!.brand;
        if (vehicleData!.model !== undefined) updateData.model = vehicleData!.model;
        if (vehicleData!.year !== undefined) updateData.year = vehicleData!.year;
        if (vehicleData!.seatCapacity !== undefined) updateData.seat_capacity = vehicleData!.seatCapacity;
        if (vehicleData!.luggageCapacity !== undefined) updateData.luggage_capacity = vehicleData!.luggageCapacity;
        if (vehicleData!.imageUrl !== undefined) updateData.image_url = vehicleData!.imageUrl;
        if (vehicleData!.features !== undefined) updateData.features = vehicleData!.features;
        if (vehicleData!.description !== undefined) updateData.description = vehicleData!.description;
        if (vehicleData!.descriptionJa !== undefined) updateData.description_ja = vehicleData!.descriptionJa;
        if (vehicleData!.descriptionZh !== undefined) updateData.description_zh = vehicleData!.descriptionZh;
        if (vehicleData!.isActive !== undefined) updateData.is_active = vehicleData!.isActive;
        if (vehicleData!.displayOrder !== undefined) updateData.display_order = vehicleData!.displayOrder;

        const { error } = await supabase
          .from('vehicle_library')
          .update(updateData)
          .eq('id', vehicleId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/vehicle-library', method: 'POST' });
          return createErrorResponse(Errors.internal('更新车辆失败'));
        }

        await logAuditAction(supabase, 'vehicle_update', 'vehicle_library', vehicleId!, authResult, { vehicleData });

        return NextResponse.json({ success: true, message: '车辆已更新' });
      }

      case 'toggle_active': {
        const { data: vehicle } = await supabase
          .from('vehicle_library')
          .select('is_active')
          .eq('id', vehicleId)
          .single();

        if (!vehicle) {
          return createErrorResponse(Errors.notFound('车辆不存在'));
        }

        const { error } = await supabase
          .from('vehicle_library')
          .update({ is_active: !vehicle.is_active })
          .eq('id', vehicleId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/vehicle-library', method: 'POST' });
          return createErrorResponse(Errors.internal('切换车辆状态失败'));
        }

        await logAuditAction(supabase, 'vehicle_toggle_active', 'vehicle_library', vehicleId!, authResult, {
          previousState: vehicle.is_active,
          newState: !vehicle.is_active,
        });

        return NextResponse.json({
          success: true,
          message: vehicle.is_active ? '车辆已下架' : '车辆已上架',
        });
      }

      case 'delete': {
        // 检查是否有导游选择了此车辆
        const { count: usageCount } = await supabase
          .from('guide_selected_vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('vehicle_id', vehicleId);

        if (usageCount && usageCount > 0) {
          return createErrorResponse(Errors.business(`该车辆正被 ${usageCount} 个导游使用，无法删除`, 'VEHICLE_IN_USE'));
        }

        const { error } = await supabase
          .from('vehicle_library')
          .delete()
          .eq('id', vehicleId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/vehicle-library', method: 'POST' });
          return createErrorResponse(Errors.internal('删除车辆失败'));
        }

        await logAuditAction(supabase, 'vehicle_delete', 'vehicle_library', vehicleId!, authResult, {});

        return NextResponse.json({ success: true, message: '车辆已删除' });
      }

      default:
        return createErrorResponse(Errors.validation('无效的操作'));
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/vehicle-library', method: 'POST' });
    return createErrorResponse(apiError);
  }
}

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
