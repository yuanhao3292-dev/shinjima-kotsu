/**
 * Admin Enterprise Management API
 *
 * GET  /api/admin/enterprises — List enterprises with member counts
 * POST /api/admin/enterprises — Create new enterprise account
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises:GET`,
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

  try {
    const { data, error } = await supabase
      .from('enterprises')
      .select('*, enterprise_members(count)')
      .order('created_at', { ascending: false });

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/enterprises', method: 'GET' });
      return createErrorResponse(Errors.internal('Failed to fetch enterprises'));
    }

    // Transform to include member_count
    const enterprises = (data || []).map((e: any) => ({
      ...e,
      member_count: e.enterprise_members?.[0]?.count ?? 0,
      enterprise_members: undefined,
    }));

    return NextResponse.json({ enterprises });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/enterprises', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises`,
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

  try {
    const body = await request.json();
    const {
      name,
      nameEn,
      stockCode,
      stockExchange,
      region,
      contactName,
      contactEmail,
      contactPhone,
      contactTitle,
      contractType,
      memberLimit,
      annualFeeJpy,
      discountRate,
      dedicatedCoordinator,
      priorityBooking,
      chineseInterpreter,
      airportTransfer,
    } = body;

    if (!name || !contactName || !contactEmail) {
      return createErrorResponse(
        Errors.validation('name, contactName, and contactEmail are required')
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('enterprises')
      .insert({
        name,
        name_en: nameEn || null,
        stock_code: stockCode || null,
        stock_exchange: stockExchange || null,
        region: region || 'CN',
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        contact_title: contactTitle || null,
        contract_type: contractType || 'annual',
        member_limit: memberLimit || 50,
        annual_fee_jpy: annualFeeJpy || null,
        discount_rate: discountRate || 0,
        dedicated_coordinator: dedicatedCoordinator || false,
        priority_booking: priorityBooking || false,
        chinese_interpreter: chineseInterpreter !== false,
        airport_transfer: airportTransfer || false,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/enterprises', method: 'POST' });
      return createErrorResponse(Errors.internal('Failed to create enterprise'));
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      action: 'enterprise_created',
      entity_type: 'enterprise',
      entity_id: data?.id,
      admin_id: authResult.userId,
      admin_email: authResult.email,
      details: { name, stockCode, region, contactEmail },
    });

    return NextResponse.json({
      success: true,
      enterprise: data,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/enterprises', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
