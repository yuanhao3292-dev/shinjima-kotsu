/**
 * Enterprise Member Management API
 *
 * Authenticated by API key (B2B) or admin auth.
 *
 * GET  /api/enterprise/members?enterprise_id=XXX — List members
 * POST /api/enterprise/members — Add member(s) (single or batch)
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAPIKey } from '@/lib/utils/api-key-auth';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/** Authenticate either via API key or admin token */
async function authenticate(request: NextRequest): Promise<{
  valid: boolean;
  error?: string;
  enterpriseId?: string;
  isAdmin?: boolean;
}> {
  const authHeader = request.headers.get('authorization');

  // Try API key first (B2B access)
  if (authHeader?.startsWith('Bearer nk_')) {
    const apiAuth = await validateAPIKey(authHeader, 'enterprise_management');
    if (apiAuth.valid && apiAuth.key) {
      // Look up enterprise linked to this API key
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from('enterprises')
        .select('id')
        .eq('api_key_id', apiAuth.key.id)
        .eq('status', 'active')
        .single();

      if (!data) {
        return { valid: false, error: 'API key not linked to an active enterprise' };
      }
      return { valid: true, enterpriseId: data.id };
    }
    return { valid: false, error: apiAuth.error };
  }

  // Fall back to admin auth
  const adminAuth = await verifyAdminAuth(authHeader);
  if (adminAuth.isValid) {
    return { valid: true, isAdmin: true };
  }

  return { valid: false, error: 'Unauthorized' };
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/enterprise/members:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const auth = await authenticate(request);
  if (!auth.valid) {
    return createErrorResponse(Errors.auth(auth.error));
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const enterpriseId = auth.enterpriseId || searchParams.get('enterprise_id');

  if (!enterpriseId) {
    return createErrorResponse(Errors.validation('enterprise_id is required'));
  }

  try {
    const { data, error } = await supabase
      .from('enterprise_members')
      .select('id, full_name, full_name_en, title, email, phone, gender, date_of_birth, preferred_language, last_screening_date, last_health_score, screening_count, status, created_at')
      .eq('enterprise_id', enterpriseId)
      .neq('status', 'removed')
      .order('full_name');

    if (error) {
      logError(normalizeError(error), { path: '/api/enterprise/members', method: 'GET' });
      return createErrorResponse(Errors.internal('Failed to fetch members'));
    }

    return NextResponse.json({ members: data || [] });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/enterprise/members', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/enterprise/members`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const auth = await authenticate(request);
  if (!auth.valid) {
    return createErrorResponse(Errors.auth(auth.error));
  }

  try {
    const body = await request.json();
    const enterpriseId = auth.enterpriseId || body.enterpriseId;

    if (!enterpriseId) {
      return createErrorResponse(Errors.validation('enterpriseId is required'));
    }

    const supabase = getSupabaseAdmin();

    // Check enterprise member limit
    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('member_limit')
      .eq('id', enterpriseId)
      .single();

    if (!enterprise) {
      return createErrorResponse(Errors.notFound('Enterprise'));
    }

    const { count: currentCount } = await supabase
      .from('enterprise_members')
      .select('*', { count: 'exact', head: true })
      .eq('enterprise_id', enterpriseId)
      .eq('status', 'active');

    // Support batch add: { members: [...] } or single { fullName, ... }
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

    // Validate all have full_name
    const invalid = insertData.filter((m: any) => !m.full_name);
    if (invalid.length > 0) {
      return createErrorResponse(
        Errors.validation(`${invalid.length} member(s) missing fullName`)
      );
    }

    const { data, error } = await supabase
      .from('enterprise_members')
      .insert(insertData)
      .select('id, full_name');

    if (error) {
      logError(normalizeError(error), { path: '/api/enterprise/members', method: 'POST' });
      return createErrorResponse(Errors.internal('Failed to add members'));
    }

    return NextResponse.json({
      success: true,
      added: data?.length || 0,
      members: data,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/enterprise/members', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
