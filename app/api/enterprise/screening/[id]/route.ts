/**
 * Enterprise Screening Result API
 *
 * GET /api/enterprise/screening/[id] — Get screening result
 *
 * Auth: API Key (enterprise_screening scope) or Admin token
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAPIKey } from '@/lib/utils/api-key-auth';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id: screeningId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/enterprise/screening/${screeningId}:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(Errors.rateLimit(rateLimitResult.retryAfter), createRateLimitHeaders(rateLimitResult));
  }

  const authHeader = request.headers.get('authorization');
  let enterpriseId: string | null = null;
  let isAdmin = false;

  // Try API key
  if (authHeader?.startsWith('Bearer nk_')) {
    const apiAuth = await validateAPIKey(authHeader, 'enterprise_screening');
    if (!apiAuth.valid || !apiAuth.key) {
      return createErrorResponse(Errors.auth(apiAuth.error));
    }
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from('enterprises')
      .select('id')
      .eq('api_key_id', apiAuth.key.id)
      .eq('status', 'active')
      .single();
    if (!data) {
      return createErrorResponse(Errors.auth('API key not linked to an active enterprise'));
    }
    enterpriseId = data.id;
  } else {
    const adminAuth = await verifyAdminAuth(authHeader);
    if (!adminAuth.isValid) {
      return createErrorResponse(Errors.auth(adminAuth.error));
    }
    isAdmin = true;
  }

  const supabase = getSupabaseAdmin();

  try {
    // Verify this screening belongs to the enterprise
    const { data: usage } = await supabase
      .from('enterprise_screening_usage')
      .select('enterprise_id, member_id')
      .eq('screening_id', screeningId)
      .single();

    if (!usage) {
      return createErrorResponse(Errors.notFound('Screening'));
    }

    // Non-admin API key can only access own enterprise's screenings
    if (!isAdmin && enterpriseId && usage.enterprise_id !== enterpriseId) {
      return createErrorResponse(Errors.forbidden('Access denied to this screening'));
    }

    // Get adjudication result
    const { data: adjudication } = await supabase
      .from('screening_adjudications')
      .select('*')
      .eq('screening_id', screeningId)
      .single();

    // Get member info
    const { data: member } = await supabase
      .from('enterprise_members')
      .select('id, full_name, full_name_en, title, email')
      .eq('id', usage.member_id)
      .single();

    return NextResponse.json({
      screeningId,
      member,
      adjudication: adjudication ? {
        riskLevel: adjudication.risk_level,
        safetyGateClass: adjudication.safety_gate_class,
        recommendedDepartments: adjudication.recommended_departments,
        recommendedTests: adjudication.recommended_tests,
        riskSummary: adjudication.risk_summary,
        treatmentSuggestions: adjudication.treatment_suggestions,
        pipelineVersion: adjudication.pipeline_version,
        totalLatencyMs: adjudication.total_latency_ms,
        createdAt: adjudication.created_at,
      } : null,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/enterprise/screening/${screeningId}`, method: 'GET' });
    return createErrorResponse(apiError);
  }
}
