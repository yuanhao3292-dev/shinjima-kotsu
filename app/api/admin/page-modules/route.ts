import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { ModuleActionSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 管理员页面模块管理 API
 *
 * GET /api/admin/page-modules - 获取模块列表
 * GET /api/admin/page-modules?id=xxx - 获取单个模块详情
 * POST /api/admin/page-modules - 创建/更新/删除模块
 */

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/page-modules:GET`,
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
  const moduleId = searchParams.get('id');
  const moduleType = searchParams.get('type');
  const status = searchParams.get('status');

  try {
    if (moduleId) {
      const { data: module, error } = await supabase
        .from('page_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error || !module) {
        return createErrorResponse(Errors.notFound('模块不存在'));
      }

      return NextResponse.json(module);
    } else {
      let query = supabase
        .from('page_modules')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (moduleType) {
        query = query.eq('category', moduleType);
      }
      if (status) {
        query = query.eq('is_active', status === 'active');
      }

      const { data: modules, error } = await query;

      if (error) {
        logError(normalizeError(error), { path: '/api/admin/page-modules', method: 'GET' });
        return createErrorResponse(Errors.internal('获取模块列表失败'));
      }

      // 统计
      const { count: total } = await supabase
        .from('page_modules')
        .select('*', { count: 'exact', head: true });

      const { count: activeCount } = await supabase
        .from('page_modules')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      return NextResponse.json({
        modules: modules || [],
        stats: {
          total: total || 0,
          active: activeCount || 0,
          inactive: (total || 0) - (activeCount || 0),
        },
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/page-modules', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/page-modules`,
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

    const validation = await validateBody(request, ModuleActionSchema);
    if (!validation.success) return validation.error;
    const { action, moduleId, moduleData } = validation.data;

    const supabase = getSupabaseAdmin();

    switch (action) {
      case 'create': {
        const insertData = {
          category: moduleData!.category,
          name: moduleData!.name,
          name_ja: moduleData!.nameJa || null,
          slug: moduleData!.slug || null,
          description: moduleData!.description || null,
          thumbnail_url: moduleData!.thumbnailUrl || null,
          commission_rate: moduleData!.commissionRate || 0,
          is_required: moduleData!.isRequired || false,
          sort_order: moduleData!.sortOrder || 0,
          component_key: moduleData!.componentKey || null,
          is_active: moduleData!.isActive !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('page_modules').insert(insertData);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/page-modules', method: 'POST' });
          return createErrorResponse(Errors.internal('创建模块失败'));
        }

        await logAuditAction(supabase, 'module_create', 'page_module', 'new', authResult, { moduleData });

        return NextResponse.json({ success: true, message: '模块已创建' });
      }

      case 'update': {
        const updateData: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };

        if (moduleData!.category !== undefined) updateData.category = moduleData!.category;
        if (moduleData!.name !== undefined) updateData.name = moduleData!.name;
        if (moduleData!.nameJa !== undefined) updateData.name_ja = moduleData!.nameJa;
        if (moduleData!.slug !== undefined) updateData.slug = moduleData!.slug;
        if (moduleData!.description !== undefined) updateData.description = moduleData!.description;
        if (moduleData!.thumbnailUrl !== undefined) updateData.thumbnail_url = moduleData!.thumbnailUrl;
        if (moduleData!.commissionRate !== undefined) updateData.commission_rate = moduleData!.commissionRate;
        if (moduleData!.isRequired !== undefined) updateData.is_required = moduleData!.isRequired;
        if (moduleData!.sortOrder !== undefined) updateData.sort_order = moduleData!.sortOrder;
        if (moduleData!.componentKey !== undefined) updateData.component_key = moduleData!.componentKey;
        if (moduleData!.isActive !== undefined) updateData.is_active = moduleData!.isActive;

        const { error } = await supabase
          .from('page_modules')
          .update(updateData)
          .eq('id', moduleId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/page-modules', method: 'POST' });
          return createErrorResponse(Errors.internal('更新模块失败'));
        }

        await logAuditAction(supabase, 'module_update', 'page_module', moduleId!, authResult, { moduleData });

        return NextResponse.json({ success: true, message: '模块已更新' });
      }

      case 'toggle_status': {
        const { data: module } = await supabase
          .from('page_modules')
          .select('is_active')
          .eq('id', moduleId)
          .single();

        if (!module) {
          return createErrorResponse(Errors.notFound('模块不存在'));
        }

        const newIsActive = !module.is_active;

        const { error } = await supabase
          .from('page_modules')
          .update({
            is_active: newIsActive,
            updated_at: new Date().toISOString(),
          })
          .eq('id', moduleId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/page-modules', method: 'POST' });
          return createErrorResponse(Errors.internal('切换模块状态失败'));
        }

        await logAuditAction(supabase, 'module_toggle_status', 'page_module', moduleId!, authResult, {
          previousState: module.is_active,
          newState: newIsActive,
        });

        return NextResponse.json({
          success: true,
          message: newIsActive ? '模块已启用' : '模块已禁用',
        });
      }

      case 'delete': {
        const { error } = await supabase
          .from('page_modules')
          .delete()
          .eq('id', moduleId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/page-modules', method: 'POST' });
          return createErrorResponse(Errors.internal('删除模块失败'));
        }

        await logAuditAction(supabase, 'module_delete', 'page_module', moduleId!, authResult, {});

        return NextResponse.json({ success: true, message: '模块已删除' });
      }

      default:
        return createErrorResponse(Errors.validation('无效的操作'));
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/page-modules', method: 'POST' });
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
