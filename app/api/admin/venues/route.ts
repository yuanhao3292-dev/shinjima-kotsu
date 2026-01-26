import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { VenueActionSchema, sanitizeSearchInput } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 管理员店铺管理 API
 *
 * GET /api/admin/venues - 获取店铺列表
 * GET /api/admin/venues?id=xxx - 获取单个店铺详情
 * POST /api/admin/venues - 创建/更新/删除店铺
 */

export async function GET(request: NextRequest) {
  // 速率限制
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/venues:GET`,
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
  const venueId = searchParams.get('id');
  const category = searchParams.get('category');
  const city = searchParams.get('city');
  const active = searchParams.get('active');
  const searchRaw = searchParams.get('search');
  const search = searchRaw ? sanitizeSearchInput(searchRaw) : null;

  // 分页参数
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const offset = (page - 1) * limit;

  try {
    if (venueId) {
      // 获取单个店铺详情
      const { data: venue, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single();

      if (error || !venue) {
        return createErrorResponse(Errors.notFound('店铺不存在'));
      }

      return NextResponse.json(venue);
    } else {
      // 获取店铺列表（带分页）
      let query = supabase
        .from('venues')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (city && city !== '全部') {
        query = query.eq('city', city);
      }
      if (active === 'true') {
        query = query.eq('is_active', true);
      } else if (active === 'false') {
        query = query.eq('is_active', false);
      }
      // 搜索（已消毒的输入）
      if (search) {
        query = query.or(`name.ilike.%${search}%,name_ja.ilike.%${search}%,brand.ilike.%${search}%`);
      }

      const { data: venues, error, count } = await query;

      if (error) {
        logError(normalizeError(error), { path: '/api/admin/venues', method: 'GET' });
        return createErrorResponse(Errors.internal('获取店铺列表失败'));
      }

      // 统计
      const { count: total } = await supabase
        .from('venues')
        .select('*', { count: 'exact', head: true });

      const { count: activeCount } = await supabase
        .from('venues')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      return NextResponse.json({
        venues: venues || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
        stats: {
          total: total || 0,
          active: activeCount || 0,
          inactive: (total || 0) - (activeCount || 0),
        },
      });
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/venues', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 速率限制
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/venues`,
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

    // 使用 Zod 验证输入
    const validation = await validateBody(request, VenueActionSchema);
    if (!validation.success) return validation.error;
    const { action, venueId, venueData } = validation.data;

    const supabase = getSupabaseAdmin();

    switch (action) {
      case 'create': {
        const { error } = await supabase
          .from('venues')
          .insert({
            ...venueData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/venues', method: 'POST' });
          return createErrorResponse(Errors.internal('创建店铺失败'));
        }

        // 记录审计日志
        await logAuditAction(supabase, 'venue_create', 'venue', 'new', authResult, { venueData });

        return NextResponse.json({ success: true, message: '店铺已创建' });
      }

      case 'update': {
        const { error } = await supabase
          .from('venues')
          .update({
            ...venueData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', venueId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/venues', method: 'POST' });
          return createErrorResponse(Errors.internal('更新店铺失败'));
        }

        await logAuditAction(supabase, 'venue_update', 'venue', venueId!, authResult, { venueData });

        return NextResponse.json({ success: true, message: '店铺已更新' });
      }

      case 'toggle_active': {
        // 获取当前状态
        const { data: venue } = await supabase
          .from('venues')
          .select('is_active')
          .eq('id', venueId)
          .single();

        if (!venue) {
          return createErrorResponse(Errors.notFound('店铺不存在'));
        }

        const { error } = await supabase
          .from('venues')
          .update({
            is_active: !venue.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', venueId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/venues', method: 'POST' });
          return createErrorResponse(Errors.internal('切换店铺状态失败'));
        }

        await logAuditAction(supabase, 'venue_toggle_active', 'venue', venueId!, authResult, {
          previousState: venue.is_active,
          newState: !venue.is_active,
        });

        return NextResponse.json({
          success: true,
          message: venue.is_active ? '店铺已下架' : '店铺已上架',
        });
      }

      case 'delete': {
        const { error } = await supabase
          .from('venues')
          .delete()
          .eq('id', venueId);

        if (error) {
          logError(normalizeError(error), { path: '/api/admin/venues', method: 'POST' });
          return createErrorResponse(Errors.internal('删除店铺失败'));
        }

        await logAuditAction(supabase, 'venue_delete', 'venue', venueId!, authResult, {});

        return NextResponse.json({ success: true, message: '店铺已删除' });
      }

      default:
        return createErrorResponse(Errors.validation('无效的操作'));
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/venues', method: 'POST' });
    return createErrorResponse(apiError);
  }
}

/**
 * 记录审计日志（封装，失败时打印告警但不阻断主流程）
 */
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
