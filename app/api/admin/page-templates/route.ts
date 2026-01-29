import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { TemplateActionSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 管理员页面模板管理 API
 *
 * GET /api/admin/page-templates - 获取模板列表
 * GET /api/admin/page-templates?id=xxx - 获取单个模板详情
 * POST /api/admin/page-templates - 创建/更新/删除模板
 */

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/page-templates:GET`,
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
  const templateId = searchParams.get('id');
  const moduleType = searchParams.get('type');

  try {
    if (templateId) {
      const { data: template, error } = await supabase
        .from('page_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error || !template) {
        return createErrorResponse(Errors.notFound('模板不存在'));
      }

      return NextResponse.json(template);
    } else {
      let query = supabase
        .from('page_templates')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (moduleType) {
        query = query.eq('module_type', moduleType);
      }

      const { data: templates, error } = await query;

      if (error) {
        logError(normalizeError(error), { path: '/api/admin/page-templates', method: 'GET' });
        return createErrorResponse(Errors.internal('获取模板列表失败'));
      }

      return NextResponse.json({
        templates: templates || [],
        stats: {
          total: templates?.length || 0,
          bio: templates?.filter(t => t.module_type === 'bio').length || 0,
          vehicle: templates?.filter(t => t.module_type === 'vehicle').length || 0,
        },
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/page-templates', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/page-templates`,
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

    const validation = await validateBody(request, TemplateActionSchema);
    if (!validation.success) return validation.error;
    const { action, templateId, templateData } = validation.data;

    const supabase = getSupabaseAdmin();

    switch (action) {
      case 'create': {
        // 检查 templateKey 是否唯一
        const { data: existing } = await supabase
          .from('page_templates')
          .select('id')
          .eq('template_key', templateData!.templateKey)
          .single();

        if (existing) {
          return createErrorResponse(Errors.validation('模板标识已存在'));
        }

        const insertData = {
          module_type: templateData!.moduleType,
          template_key: templateData!.templateKey,
          name: templateData!.name,
          name_ja: templateData!.nameJa || null,
          name_zh: templateData!.nameZh || null,
          preview_image_url: templateData!.previewImageUrl || null,
          template_config: templateData!.templateConfig || {},
          is_default: templateData!.isDefault || false,
          display_order: templateData!.displayOrder || 0,
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('page_templates').insert(insertData);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/page-templates', method: 'POST' });
          return createErrorResponse(Errors.internal('创建模板失败'));
        }

        await logAuditAction(supabase, 'template_create', 'page_template', 'new', authResult, { templateData });

        return NextResponse.json({ success: true, message: '模板已创建' });
      }

      case 'update': {
        const updateData: Record<string, unknown> = {};

        if (templateData!.name !== undefined) updateData.name = templateData!.name;
        if (templateData!.nameJa !== undefined) updateData.name_ja = templateData!.nameJa;
        if (templateData!.nameZh !== undefined) updateData.name_zh = templateData!.nameZh;
        if (templateData!.previewImageUrl !== undefined) updateData.preview_image_url = templateData!.previewImageUrl;
        if (templateData!.templateConfig !== undefined) updateData.template_config = templateData!.templateConfig;
        if (templateData!.isDefault !== undefined) updateData.is_default = templateData!.isDefault;
        if (templateData!.displayOrder !== undefined) updateData.display_order = templateData!.displayOrder;

        const { error } = await supabase
          .from('page_templates')
          .update(updateData)
          .eq('id', templateId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/page-templates', method: 'POST' });
          return createErrorResponse(Errors.internal('更新模板失败'));
        }

        await logAuditAction(supabase, 'template_update', 'page_template', templateId!, authResult, { templateData });

        return NextResponse.json({ success: true, message: '模板已更新' });
      }

      case 'delete': {
        // 检查是否有导游在使用此模板
        const { count: usageCount } = await supabase
          .from('guide_white_label')
          .select('*', { count: 'exact', head: true })
          .or(`bio_template_id.eq.${templateId},vehicle_template_id.eq.${templateId}`);

        if (usageCount && usageCount > 0) {
          return createErrorResponse(Errors.business(`该模板正被 ${usageCount} 个导游使用，无法删除`, 'TEMPLATE_IN_USE'));
        }

        const { error } = await supabase
          .from('page_templates')
          .delete()
          .eq('id', templateId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/page-templates', method: 'POST' });
          return createErrorResponse(Errors.internal('删除模板失败'));
        }

        await logAuditAction(supabase, 'template_delete', 'page_template', templateId!, authResult, {});

        return NextResponse.json({ success: true, message: '模板已删除' });
      }

      default:
        return createErrorResponse(Errors.validation('无效的操作'));
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/page-templates', method: 'POST' });
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
