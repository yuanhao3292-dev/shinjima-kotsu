/**
 * Admin Enterprise Members API
 *
 * GET    /api/admin/enterprises/[id]/members — List members (paginated)
 * POST   /api/admin/enterprises/[id]/members — Add member(s)
 * PATCH  /api/admin/enterprises/[id]/members — Update member (body.memberId required)
 * DELETE /api/admin/enterprises/[id]/members — Soft-delete member (body.memberId required)
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
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/members:GET`,
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
  const status = searchParams.get('status') || 'active';
  const search = searchParams.get('search') || '';

  try {
    let query = supabase
      .from('enterprise_members')
      .select('*', { count: 'exact' })
      .eq('enterprise_id', enterpriseId);

    if (status !== 'all') {
      query = query.eq('status', status);
    } else {
      query = query.neq('status', 'removed');
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,full_name_en.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      logError(normalizeError(error), { path: `/api/admin/enterprises/${enterpriseId}/members`, method: 'GET' });
      return createErrorResponse(Errors.internal('Failed to fetch members'));
    }

    return NextResponse.json({
      members: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/members`, method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id: enterpriseId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/members`,
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

    // Check enterprise exists and get member_limit
    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('id, member_limit, status')
      .eq('id', enterpriseId)
      .single();

    if (!enterprise) {
      return createErrorResponse(Errors.notFound('Enterprise'));
    }

    if (enterprise.status !== 'active') {
      return createErrorResponse(Errors.business('Enterprise is not active', 'ENTERPRISE_NOT_ACTIVE'));
    }

    // Check current count
    const { count: currentCount } = await supabase
      .from('enterprise_members')
      .select('*', { count: 'exact', head: true })
      .eq('enterprise_id', enterpriseId)
      .eq('status', 'active');

    // Support batch: { members: [...] } or single { fullName, ... }
    const membersToAdd = body.members || [body];

    if ((currentCount || 0) + membersToAdd.length > enterprise.member_limit) {
      return createErrorResponse(
        Errors.business(
          `Member limit exceeded. Current: ${currentCount}, Adding: ${membersToAdd.length}, Limit: ${enterprise.member_limit}`,
          'MEMBER_LIMIT_EXCEEDED'
        )
      );
    }

    const insertData = membersToAdd.map((m: any) => ({
      enterprise_id: enterpriseId,
      full_name: m.fullName || m.full_name,
      full_name_en: m.fullNameEn || m.full_name_en || null,
      title: m.title || null,
      email: m.email || null,
      phone: m.phone || null,
      gender: m.gender || null,
      date_of_birth: m.dateOfBirth || m.date_of_birth || null,
      nationality: m.nationality || null,
      passport_number: m.passportNumber || m.passport_number || null,
      preferred_language: m.preferredLanguage || m.preferred_language || 'zh-CN',
      allergies: m.allergies || null,
      medical_notes: m.medicalNotes || m.medical_notes || null,
    }));

    const invalid = insertData.filter((m: any) => !m.full_name);
    if (invalid.length > 0) {
      return createErrorResponse(Errors.validation(`${invalid.length} member(s) missing fullName`));
    }

    const { data, error } = await supabase
      .from('enterprise_members')
      .insert(insertData)
      .select('id, full_name');

    if (error) {
      logError(normalizeError(error), { path: `/api/admin/enterprises/${enterpriseId}/members`, method: 'POST' });
      return createErrorResponse(Errors.internal('Failed to add members'));
    }

    // Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: enterpriseId,
      actor_type: 'admin',
      actor_id: authResult.userId,
      action: 'members_added',
      details: {
        count: data?.length || 0,
        names: data?.map((m: any) => m.full_name),
        admin_email: authResult.email,
      },
    });

    return NextResponse.json({ success: true, added: data?.length || 0, members: data });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/members`, method: 'POST' });
    return createErrorResponse(apiError);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id: enterpriseId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/members:PATCH`,
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
    const { memberId, ...fields } = body;

    if (!memberId) {
      return createErrorResponse(Errors.validation('memberId is required'));
    }

    const supabase = getSupabaseAdmin();

    const allowedFields: Record<string, string> = {
      fullName: 'full_name',
      fullNameEn: 'full_name_en',
      title: 'title',
      email: 'email',
      phone: 'phone',
      gender: 'gender',
      dateOfBirth: 'date_of_birth',
      nationality: 'nationality',
      passportNumber: 'passport_number',
      preferredLanguage: 'preferred_language',
      medicalNotes: 'medical_notes',
      allergies: 'allergies',
      status: 'status',
    };

    const updateData: Record<string, unknown> = {};
    for (const [camelKey, snakeKey] of Object.entries(allowedFields)) {
      if (camelKey in fields) {
        updateData[snakeKey] = fields[camelKey];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return createErrorResponse(Errors.validation('No valid fields to update'));
    }

    const { data, error } = await supabase
      .from('enterprise_members')
      .update(updateData)
      .eq('id', memberId)
      .eq('enterprise_id', enterpriseId)
      .select()
      .single();

    if (error || !data) {
      return createErrorResponse(Errors.notFound('Member'));
    }

    // Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: enterpriseId,
      actor_type: 'admin',
      actor_id: authResult.userId,
      action: 'member_updated',
      details: { memberId, fields: Object.keys(updateData), admin_email: authResult.email },
    });

    return NextResponse.json({ success: true, member: data });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/members`, method: 'PATCH' });
    return createErrorResponse(apiError);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id: enterpriseId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/members:DELETE`,
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
    const { memberId } = body;

    if (!memberId) {
      return createErrorResponse(Errors.validation('memberId is required'));
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('enterprise_members')
      .update({ status: 'removed' })
      .eq('id', memberId)
      .eq('enterprise_id', enterpriseId)
      .select('id, full_name, status')
      .single();

    if (error || !data) {
      return createErrorResponse(Errors.notFound('Member'));
    }

    // Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: enterpriseId,
      actor_type: 'admin',
      actor_id: authResult.userId,
      action: 'member_removed',
      details: { memberId, memberName: data.full_name, admin_email: authResult.email },
    });

    return NextResponse.json({ success: true, member: data });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/members`, method: 'DELETE' });
    return createErrorResponse(apiError);
  }
}
