/**
 * Admin Enterprise Detail API
 *
 * GET    /api/admin/enterprises/[id] — Enterprise detail + members + orders + usage + audit log
 * PATCH  /api/admin/enterprises/[id] — Update enterprise fields
 * DELETE /api/admin/enterprises/[id] — Soft-delete (status → suspended)
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
  const { id } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${id}:GET`,
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

  try {
    // Enterprise detail
    const { data: enterprise, error } = await supabase
      .from('enterprises')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !enterprise) {
      return createErrorResponse(Errors.notFound('Enterprise'));
    }

    // Members (active + inactive)
    const { data: members } = await supabase
      .from('enterprise_members')
      .select('id, full_name, full_name_en, title, email, phone, gender, date_of_birth, preferred_language, last_screening_date, last_health_score, screening_count, status, created_at')
      .eq('enterprise_id', id)
      .neq('status', 'removed')
      .order('created_at', { ascending: false });

    // Orders
    const { data: orders } = await supabase
      .from('enterprise_orders')
      .select('*')
      .eq('enterprise_id', id)
      .order('created_at', { ascending: false });

    // Screening usage (recent 50)
    const { data: screeningUsage } = await supabase
      .from('enterprise_screening_usage')
      .select('id, member_id, screening_id, screening_type, created_at')
      .eq('enterprise_id', id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Audit log (recent 50)
    const { data: auditLog } = await supabase
      .from('enterprise_audit_log')
      .select('*')
      .eq('enterprise_id', id)
      .order('created_at', { ascending: false })
      .limit(50);

    // API Key info (if linked)
    let apiKey = null;
    if (enterprise.api_key_id) {
      const { data } = await supabase
        .from('api_keys')
        .select('id, name, key_prefix, scopes, rate_limit_per_minute, rate_limit_per_day, total_requests, total_tokens_in, total_tokens_out, is_active, last_used_at, expires_at, created_at')
        .eq('id', enterprise.api_key_id)
        .single();
      apiKey = data;
    }

    return NextResponse.json({
      enterprise,
      members: members || [],
      orders: orders || [],
      screeningUsage: screeningUsage || [],
      auditLog: auditLog || [],
      apiKey,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${id}`, method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${id}`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(Errors.rateLimit(rateLimitResult.retryAfter), createRateLimitHeaders(rateLimitResult));
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    // Build update object from allowed fields
    const allowedFields: Record<string, string> = {
      name: 'name',
      nameEn: 'name_en',
      stockCode: 'stock_code',
      stockExchange: 'stock_exchange',
      region: 'region',
      contactName: 'contact_name',
      contactEmail: 'contact_email',
      contactPhone: 'contact_phone',
      contactTitle: 'contact_title',
      contractType: 'contract_type',
      contractStart: 'contract_start',
      contractEnd: 'contract_end',
      memberLimit: 'member_limit',
      annualFeeJpy: 'annual_fee_jpy',
      perScreeningFeeJpy: 'per_screening_fee_jpy',
      discountRate: 'discount_rate',
      screeningQuota: 'screening_quota',
      dedicatedCoordinator: 'dedicated_coordinator',
      priorityBooking: 'priority_booking',
      chineseInterpreter: 'chinese_interpreter',
      airportTransfer: 'airport_transfer',
      status: 'status',
      notes: 'notes',
    };

    const updateData: Record<string, unknown> = {};
    for (const [camelKey, snakeKey] of Object.entries(allowedFields)) {
      if (camelKey in body) {
        updateData[snakeKey] = body[camelKey];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return createErrorResponse(Errors.validation('No valid fields to update'));
    }

    const { data, error } = await supabase
      .from('enterprises')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logError(normalizeError(error), { path: `/api/admin/enterprises/${id}`, method: 'PATCH' });
      return createErrorResponse(Errors.internal('Failed to update enterprise'));
    }

    if (!data) {
      return createErrorResponse(Errors.notFound('Enterprise'));
    }

    // Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: id,
      actor_type: 'admin',
      actor_id: authResult.userId,
      action: 'enterprise_updated',
      details: { fields: Object.keys(updateData), admin_email: authResult.email },
    });

    return NextResponse.json({ success: true, enterprise: data });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${id}`, method: 'PATCH' });
    return createErrorResponse(apiError);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${id}:DELETE`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(Errors.rateLimit(rateLimitResult.retryAfter), createRateLimitHeaders(rateLimitResult));
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  try {
    const supabase = getSupabaseAdmin();

    // Soft delete: set status to suspended
    const { data, error } = await supabase
      .from('enterprises')
      .update({ status: 'suspended' })
      .eq('id', id)
      .select('id, name, status')
      .single();

    if (error || !data) {
      return createErrorResponse(Errors.notFound('Enterprise'));
    }

    // Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: id,
      actor_type: 'admin',
      actor_id: authResult.userId,
      action: 'enterprise_suspended',
      details: { admin_email: authResult.email },
    });

    return NextResponse.json({ success: true, enterprise: data });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${id}`, method: 'DELETE' });
    return createErrorResponse(apiError);
  }
}
