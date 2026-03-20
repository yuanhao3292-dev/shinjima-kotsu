/**
 * Admin Enterprise Orders API
 *
 * GET   /api/admin/enterprises/[id]/orders — List orders
 * POST  /api/admin/enterprises/[id]/orders — Create order
 * PATCH /api/admin/enterprises/[id]/orders — Update order (body.orderId required)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function generateOrderNumber(): string {
  const date = new Date();
  const prefix = 'ENT';
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${dateStr}-${random}`;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id: enterpriseId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/orders:GET`,
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
    const { data, error } = await supabase
      .from('enterprise_orders')
      .select('*')
      .eq('enterprise_id', enterpriseId)
      .order('created_at', { ascending: false });

    if (error) {
      logError(normalizeError(error), { path: `/api/admin/enterprises/${enterpriseId}/orders`, method: 'GET' });
      return createErrorResponse(Errors.internal('Failed to fetch orders'));
    }

    return NextResponse.json({ orders: data || [] });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/orders`, method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id: enterpriseId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/orders`,
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
    const {
      packageId,
      memberIds,
      unitPriceJpy,
      discountRate,
      preferredDates,
      specialRequirements,
      adminNotes,
    } = body;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return createErrorResponse(Errors.validation('memberIds is required'));
    }

    if (!unitPriceJpy || unitPriceJpy <= 0) {
      return createErrorResponse(Errors.validation('unitPriceJpy must be positive'));
    }

    const discount = discountRate || 0;
    const totalAmount = Math.round(unitPriceJpy * memberIds.length * (1 - discount / 100));

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('enterprise_orders')
      .insert({
        enterprise_id: enterpriseId,
        order_number: generateOrderNumber(),
        package_id: packageId || null,
        member_ids: memberIds,
        member_count: memberIds.length,
        unit_price_jpy: unitPriceJpy,
        discount_rate: discount,
        total_amount_jpy: totalAmount,
        preferred_dates: preferredDates || null,
        special_requirements: specialRequirements || null,
        admin_notes: adminNotes || null,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      logError(normalizeError(error), { path: `/api/admin/enterprises/${enterpriseId}/orders`, method: 'POST' });
      return createErrorResponse(Errors.internal('Failed to create order'));
    }

    // Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: enterpriseId,
      actor_type: 'admin',
      actor_id: authResult.userId,
      action: 'order_created',
      details: {
        orderNumber: data?.order_number,
        memberCount: memberIds.length,
        totalAmount: totalAmount,
        admin_email: authResult.email,
      },
    });

    return NextResponse.json({ success: true, order: data });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/orders`, method: 'POST' });
    return createErrorResponse(apiError);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id: enterpriseId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/orders:PATCH`,
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
    const { orderId, ...fields } = body;

    if (!orderId) {
      return createErrorResponse(Errors.validation('orderId is required'));
    }

    const supabase = getSupabaseAdmin();

    const allowedFields: Record<string, string> = {
      status: 'status',
      paymentStatus: 'payment_status',
      invoiceNumber: 'invoice_number',
      confirmedDates: 'confirmed_dates',
      specialRequirements: 'special_requirements',
      adminNotes: 'admin_notes',
    };

    const updateData: Record<string, unknown> = {};
    for (const [camelKey, snakeKey] of Object.entries(allowedFields)) {
      if (camelKey in fields) {
        updateData[snakeKey] = fields[camelKey];
      }
    }

    // Handle payment
    if (fields.paymentStatus === 'paid' && !updateData.paid_at) {
      updateData.paid_at = new Date().toISOString();
    }

    if (Object.keys(updateData).length === 0) {
      return createErrorResponse(Errors.validation('No valid fields to update'));
    }

    const { data, error } = await supabase
      .from('enterprise_orders')
      .update(updateData)
      .eq('id', orderId)
      .eq('enterprise_id', enterpriseId)
      .select()
      .single();

    if (error || !data) {
      return createErrorResponse(Errors.notFound('Order'));
    }

    // Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: enterpriseId,
      actor_type: 'admin',
      actor_id: authResult.userId,
      action: 'order_updated',
      details: {
        orderId,
        orderNumber: data.order_number,
        fields: Object.keys(updateData),
        admin_email: authResult.email,
      },
    });

    return NextResponse.json({ success: true, order: data });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/orders`, method: 'PATCH' });
    return createErrorResponse(apiError);
  }
}
