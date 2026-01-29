import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 导游产品中心 API
 *
 * GET /api/guide/product-center - 获取所有可用的模块、模板和车辆
 *
 * 返回：
 * - modules: 所有可用模块（包含导游已选择的标记）
 * - templates: 所有可用模板（按类型分组）
 * - vehicles: 所有可用车辆
 * - guideConfig: 导游当前的白标配置（如果有）
 */

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
    // 获取导游信息
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, name, email, status')
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
      templatesResult,
      vehiclesResult,
      guideConfigResult,
      selectedModulesResult,
      selectedVehiclesResult,
    ] = await Promise.all([
      // 获取所有活跃模块
      supabase
        .from('page_modules')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),

      // 获取所有模板
      supabase
        .from('page_templates')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),

      // 获取所有活跃车辆
      supabase
        .from('vehicle_library')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),

      // 获取导游的白标配置
      supabase
        .from('guide_white_label')
        .select('*')
        .eq('guide_id', guide.id)
        .maybeSingle(),

      // 获取导游已选择的模块
      supabase
        .from('guide_selected_modules')
        .select('*, page_modules(*)')
        .eq('guide_white_label_id', guide.id), // 临时：之后需要根据实际的 guide_white_label_id 查询

      // 获取导游已选择的车辆
      supabase
        .from('guide_selected_vehicles')
        .select('*, vehicle_library(*)')
        .eq('guide_white_label_id', guide.id), // 临时
    ]);

    if (modulesResult.error) {
      logError(normalizeError(modulesResult.error), { path: '/api/guide/product-center', method: 'GET' });
      return createErrorResponse(Errors.internal('获取模块列表失败'));
    }

    // 如果导游有白标配置，重新查询已选择的模块和车辆
    let selectedModules: unknown[] = [];
    let selectedVehicles: unknown[] = [];

    if (guideConfigResult.data) {
      const [selModules, selVehicles] = await Promise.all([
        supabase
          .from('guide_selected_modules')
          .select('*, module:page_modules(*)')
          .eq('guide_white_label_id', guideConfigResult.data.id),
        supabase
          .from('guide_selected_vehicles')
          .select('*, vehicle:vehicle_library(*)')
          .eq('guide_white_label_id', guideConfigResult.data.id),
      ]);

      selectedModules = selModules.data || [];
      selectedVehicles = selVehicles.data || [];
    }

    // 构建模块列表（标记导游已选择的）
    const selectedModuleIds = new Set(
      (selectedModules as Array<{ module_id: string }>).map(m => m.module_id)
    );

    const modulesWithSelection = (modulesResult.data || []).map(module => ({
      ...module,
      selectedByGuide: selectedModuleIds.has(module.id),
      guideModuleConfig: (selectedModules as Array<{ module_id: string }>).find(
        m => m.module_id === module.id
      ) || null,
    }));

    // 按类型分组模板
    const templates = templatesResult.data || [];
    const templatesByType = {
      bio: templates.filter(t => t.module_type === 'bio'),
      vehicle: templates.filter(t => t.module_type === 'vehicle'),
    };

    // 构建车辆列表（标记导游已选择的）
    const selectedVehicleIds = new Set(
      (selectedVehicles as Array<{ vehicle_id: string }>).map(v => v.vehicle_id)
    );

    const vehiclesWithSelection = (vehiclesResult.data || []).map(vehicle => ({
      ...vehicle,
      selectedByGuide: selectedVehicleIds.has(vehicle.id),
      guideVehicleConfig: (selectedVehicles as Array<{ vehicle_id: string }>).find(
        v => v.vehicle_id === vehicle.id
      ) || null,
    }));

    return NextResponse.json({
      modules: modulesWithSelection,
      templates: templatesByType,
      vehicles: vehiclesWithSelection,
      guideConfig: guideConfigResult.data || null,
      selectedModules,
      selectedVehicles,
      guide: {
        id: guide.id,
        name: guide.name,
        email: guide.email,
      },
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/product-center', method: 'GET' });
    return createErrorResponse(apiError);
  }
}
