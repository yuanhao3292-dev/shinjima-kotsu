import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { GuideWhiteLabelPageSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 导游白标页面配置 API
 *
 * GET /api/guide/whitelabel-page - 获取当前导游的白标页面配置
 * POST /api/guide/whitelabel-page - 创建或更新白标页面配置
 */

async function verifyGuide(request: NextRequest) {
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
    .select('id, name, email, status')
    .eq('auth_user_id', user.id)
    .single();

  if (guideError || !guide) {
    return { error: Errors.auth('导游账户不存在') };
  }

  if (guide.status !== 'approved') {
    return { error: Errors.business('导游账户未通过审核', 'GUIDE_NOT_APPROVED') };
  }

  return { guide, supabase };
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/guide/whitelabel-page:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyGuide(request);
  if ('error' in authResult) {
    return createErrorResponse(authResult.error);
  }

  const { guide, supabase } = authResult;

  try {
    // 获取白标配置及关联数据
    const { data: config, error } = await supabase
      .from('guide_white_label')
      .select(`
        *,
        bio_template:page_templates!guide_white_label_bio_template_id_fkey(*),
        vehicle_template:page_templates!guide_white_label_vehicle_template_id_fkey(*)
      `)
      .eq('guide_id', guide.id)
      .maybeSingle();

    if (error) {
      logError(normalizeError(error), { path: '/api/guide/whitelabel-page', method: 'GET' });
      return createErrorResponse(Errors.internal('获取配置失败'));
    }

    if (!config) {
      return NextResponse.json({
        exists: false,
        config: null,
        message: '尚未创建白标页面',
      });
    }

    // 获取已选择的模块
    const { data: selectedModules } = await supabase
      .from('guide_selected_modules')
      .select('*, module:page_modules(*)')
      .eq('guide_white_label_id', config.id)
      .order('display_order', { ascending: true });

    // 获取已选择的车辆
    const { data: selectedVehicles } = await supabase
      .from('guide_selected_vehicles')
      .select('*, vehicle:vehicle_library(*)')
      .eq('guide_white_label_id', config.id)
      .order('display_order', { ascending: true });

    return NextResponse.json({
      exists: true,
      config: {
        ...config,
        selectedModules: selectedModules || [],
        selectedVehicles: selectedVehicles || [],
      },
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/whitelabel-page', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/guide/whitelabel-page`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyGuide(request);
  if ('error' in authResult) {
    return createErrorResponse(authResult.error);
  }

  const { guide, supabase } = authResult;

  const validation = await validateBody(request, GuideWhiteLabelPageSchema);
  if (!validation.success) return validation.error;
  const data = validation.data;

  try {
    // 检查 slug 是否已被其他导游使用
    if (data.slug) {
      const { data: existingSlug } = await supabase
        .from('guide_white_label')
        .select('id, guide_id')
        .eq('slug', data.slug)
        .maybeSingle();

      if (existingSlug && existingSlug.guide_id !== guide.id) {
        return createErrorResponse(Errors.validation('该 URL 标识已被其他导游使用'));
      }
    }

    // 检查是否已有配置
    const { data: existing } = await supabase
      .from('guide_white_label')
      .select('id')
      .eq('guide_id', guide.id)
      .maybeSingle();

    if (existing) {
      // 更新现有配置
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.isPublished !== undefined) {
        updateData.is_published = data.isPublished;
        if (data.isPublished) {
          updateData.published_at = new Date().toISOString();
        }
      }
      if (data.bioTemplateId !== undefined) updateData.bio_template_id = data.bioTemplateId;
      if (data.vehicleTemplateId !== undefined) updateData.vehicle_template_id = data.vehicleTemplateId;
      if (data.bioContent !== undefined) updateData.bio_content = data.bioContent;
      if (data.vehicleContent !== undefined) updateData.vehicle_content = data.vehicleContent;
      if (data.customCss !== undefined) updateData.custom_css = data.customCss;
      if (data.seoTitle !== undefined) updateData.seo_title = data.seoTitle;
      if (data.seoDescription !== undefined) updateData.seo_description = data.seoDescription;

      const { error: updateError } = await supabase
        .from('guide_white_label')
        .update(updateData)
        .eq('id', existing.id);

      if (updateError) {
        logError(normalizeError(updateError), { path: '/api/guide/whitelabel-page', method: 'POST' });
        return createErrorResponse(Errors.internal('更新配置失败'));
      }

      return NextResponse.json({
        success: true,
        message: '白标页面配置已更新',
        configId: existing.id,
      });
    } else {
      // 创建新配置
      if (!data.slug) {
        return createErrorResponse(Errors.validation('创建白标页面时必须提供 URL 标识'));
      }

      const { data: newConfig, error: insertError } = await supabase
        .from('guide_white_label')
        .insert({
          guide_id: guide.id,
          slug: data.slug,
          is_published: data.isPublished || false,
          bio_template_id: data.bioTemplateId || null,
          vehicle_template_id: data.vehicleTemplateId || null,
          bio_content: data.bioContent || null,
          vehicle_content: data.vehicleContent || null,
          custom_css: data.customCss || null,
          seo_title: data.seoTitle || null,
          seo_description: data.seoDescription || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (insertError) {
        logError(normalizeError(insertError), { path: '/api/guide/whitelabel-page', method: 'POST' });
        return createErrorResponse(Errors.internal('创建配置失败'));
      }

      // 自动添加必选模块（bio 和 vehicle）
      const { data: requiredModules } = await supabase
        .from('page_modules')
        .select('id')
        .eq('is_required', true)
        .eq('status', 'active');

      if (requiredModules && requiredModules.length > 0) {
        const moduleInserts = requiredModules.map((m, index) => ({
          guide_white_label_id: newConfig.id,
          module_id: m.id,
          is_enabled: true,
          display_order: index,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        await supabase.from('guide_selected_modules').insert(moduleInserts);
      }

      return NextResponse.json({
        success: true,
        message: '白标页面配置已创建',
        configId: newConfig.id,
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide/whitelabel-page', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
