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
}

interface DBVehicle {
  id: string;
  name: string;
  name_ja: string | null;
  vehicle_type: string;
  seats: number;
  description: string | null;
  images: string[] | null;
  features: string[] | null;
  is_active: boolean;
}

interface DBTemplate {
  id: string;
  category: string;
  name: string;
  name_ja: string | null;
  preview_image: string | null;
  is_default: boolean;
  is_active: boolean;
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

      // 获取所有活跃模板
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

      // 获取导游已选择的模块 (使用 guide_id)
      supabase
        .from('guide_selected_modules')
        .select('module_id')
        .eq('guide_id', guide.id),

      // 获取导游已选择的车辆 (使用 guide_id)
      supabase
        .from('guide_selected_vehicles')
        .select('vehicle_id')
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
    const selectedVehicleIds = new Set(
      (selectedVehiclesResult.data || []).map((v: { vehicle_id: string }) => v.vehicle_id)
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
      selectedByGuide: selectedModuleIds.has(module.id),
    }));

    // 按类型分组模板
    const templates = (templatesResult.data || []) as DBTemplate[];
    const templatesByType = {
      bio: templates
        .filter(t => t.category === 'bio')
        .map(t => ({
          id: t.id,
          module_type: t.category,
          template_key: t.name.toLowerCase().replace(/\s+/g, '_'),
          name: t.name,
          name_zh: t.name,
          preview_image_url: t.preview_image,
          is_default: t.is_default,
        })),
      vehicle: templates
        .filter(t => t.category === 'vehicle')
        .map(t => ({
          id: t.id,
          module_type: t.category,
          template_key: t.name.toLowerCase().replace(/\s+/g, '_'),
          name: t.name,
          name_zh: t.name,
          preview_image_url: t.preview_image,
          is_default: t.is_default,
        })),
    };

    // 转换车辆数据格式
    const vehicles = ((vehiclesResult.data || []) as DBVehicle[]).map(vehicle => ({
      id: vehicle.id,
      vehicle_type: vehicle.vehicle_type,
      brand: vehicle.name.split(' ')[0] || vehicle.name, // 从 name 提取品牌
      model: vehicle.name.split(' ').slice(1).join(' ') || '', // 从 name 提取型号
      year: null,
      seat_capacity: vehicle.seats,
      luggage_capacity: Math.floor(vehicle.seats / 2), // 估算行李容量
      image_url: vehicle.images?.[0] || null,
      features: vehicle.features || [],
      description_zh: vehicle.description,
      selectedByGuide: selectedVehicleIds.has(vehicle.id),
    }));

    return NextResponse.json({
      modules,
      templates: templatesByType,
      vehicles,
      guideConfig: guideConfigResult.data || null,
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
