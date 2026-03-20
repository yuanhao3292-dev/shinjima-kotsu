/**
 * Admin Enterprise Audit Log API
 *
 * GET /api/admin/enterprises/[id]/audit-log — Query audit log (paginated)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id: enterpriseId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/audit-log:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(Errors.rateLimit(rateLimitResult.retryAfter), createRateLimitHeaders(rateLimitResult));
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10), 1), 200);
  const action = searchParams.get('action');

  try {
    let query = supabase
      .from('enterprise_audit_log')
      .select('*', { count: 'exact' })
      .eq('enterprise_id', enterpriseId);

    if (action) {
      query = query.eq('action', action);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      logError(normalizeError(error), { path: `/api/admin/enterprises/${enterpriseId}/audit-log`, method: 'GET' });
      return createErrorResponse(Errors.internal('Failed to fetch audit log'));
    }

    return NextResponse.json({
      logs: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/audit-log`, method: 'GET' });
    return createErrorResponse(apiError);
  }
}
