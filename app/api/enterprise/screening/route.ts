/**
 * Enterprise Screening API
 *
 * POST /api/enterprise/screening — Submit screening for enterprise member
 *
 * Auth: API Key (Bearer nk_xxx) or Admin Bearer token
 * Calls the AEMC pipeline, tracks quota usage, updates member records.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAPIKey, logAPIUsage } from '@/lib/utils/api-key-auth';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { runAEMCPipeline, type AEMCInput } from '@/services/aemc';
import { persistPipelineResults } from '@/services/aemc/persistence';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

export const maxDuration = 300;

/** Authenticate via API key or admin token, return enterprise_id */
async function authenticate(request: NextRequest): Promise<{
  valid: boolean;
  error?: string;
  enterpriseId?: string;
  actorType: 'api_key' | 'admin';
  actorId?: string;
}> {
  const authHeader = request.headers.get('authorization');

  // Try API key first
  if (authHeader?.startsWith('Bearer nk_')) {
    const apiAuth = await validateAPIKey(authHeader, 'enterprise_screening');
    if (apiAuth.valid && apiAuth.key) {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from('enterprises')
        .select('id')
        .eq('api_key_id', apiAuth.key.id)
        .eq('status', 'active')
        .single();

      if (!data) {
        return { valid: false, error: 'API key not linked to an active enterprise', actorType: 'api_key' };
      }
      return { valid: true, enterpriseId: data.id, actorType: 'api_key', actorId: apiAuth.key.key_prefix };
    }
    return { valid: false, error: apiAuth.error, actorType: 'api_key' };
  }

  // Fall back to admin auth
  const adminAuth = await verifyAdminAuth(authHeader);
  if (adminAuth.isValid) {
    return { valid: true, actorType: 'admin', actorId: adminAuth.userId };
  }

  return { valid: false, error: 'Unauthorized', actorType: 'admin' };
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/enterprise/screening`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(Errors.rateLimit(rateLimitResult.retryAfter), createRateLimitHeaders(rateLimitResult));
  }

  const startTime = Date.now();
  const auth = await authenticate(request);
  if (!auth.valid) {
    return createErrorResponse(Errors.auth(auth.error));
  }

  try {
    const body = await request.json();
    const { enterpriseId: bodyEnterpriseId, memberId, answers, bodyMapData, language, phase } = body;

    const enterpriseId = auth.enterpriseId || bodyEnterpriseId;
    if (!enterpriseId) {
      return createErrorResponse(Errors.validation('enterpriseId is required'));
    }
    if (!memberId) {
      return createErrorResponse(Errors.validation('memberId is required'));
    }
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return createErrorResponse(Errors.validation('answers array is required'));
    }

    const supabase = getSupabaseAdmin();

    // 1. Verify enterprise is active and has quota
    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('id, status, screening_quota, screening_used, name')
      .eq('id', enterpriseId)
      .single();

    if (!enterprise) {
      return createErrorResponse(Errors.notFound('Enterprise'));
    }
    if (enterprise.status !== 'active') {
      return createErrorResponse(Errors.business('Enterprise is not active', 'ENTERPRISE_NOT_ACTIVE'));
    }
    if (enterprise.screening_used >= enterprise.screening_quota) {
      return createErrorResponse(Errors.business('Screening quota exceeded', 'QUOTA_EXCEEDED'));
    }

    // 2. Verify member exists and is active
    const { data: member } = await supabase
      .from('enterprise_members')
      .select('id, full_name, status')
      .eq('id', memberId)
      .eq('enterprise_id', enterpriseId)
      .single();

    if (!member) {
      return createErrorResponse(Errors.notFound('Member'));
    }
    if (member.status !== 'active') {
      return createErrorResponse(Errors.business('Member is not active', 'MEMBER_NOT_ACTIVE'));
    }

    // 3. Atomic quota increment BEFORE running AI pipeline (prevents wasting AI resources on over-quota)
    const { data: quotaResult, error: quotaError } = await supabase.rpc(
      'increment_enterprise_screening_quota',
      { p_enterprise_id: enterpriseId }
    );
    if (quotaError || quotaResult?.error) {
      return createErrorResponse(Errors.business('Screening quota exceeded', 'QUOTA_EXCEEDED'));
    }

    // 4. Create screening record
    const screeningId = crypto.randomUUID();

    // 5. Run AEMC pipeline
    const aemcInput: AEMCInput = {
      screeningId,
      answers,
      bodyMapData,
      userType: 'authenticated',
      language: language || 'zh-CN',
      phase: phase || 2,
    };

    const output = await runAEMCPipeline(aemcInput);

    // 6. Persist results (fire-and-forget pattern from existing code)
    persistPipelineResults(
      output.pipelineResult,
      'authenticated'
    ).catch(err => console.error('[EnterpriseScreening] Persist error:', err));

    // 7. Track usage
    await supabase.from('enterprise_screening_usage').insert({
      enterprise_id: enterpriseId,
      member_id: memberId,
      screening_id: screeningId,
      screening_type: 'ai_triage',
    });

    // 8. Update member screening stats
    const riskLevel = output.legacyResult?.riskLevel;
    await supabase
      .from('enterprise_members')
      .update({
        last_screening_id: screeningId,
        last_screening_date: new Date().toISOString(),
        last_health_score: null,
      })
      .eq('id', memberId);

    // 9. Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: enterpriseId,
      actor_type: auth.actorType,
      actor_id: auth.actorId || null,
      action: 'screening_completed',
      details: {
        memberId,
        memberName: member.full_name,
        screeningId,
        riskLevel,
        safetyGate: output.safetyGate?.gate_class,
      },
    });

    // 10. Log API usage if via API key
    if (auth.actorType === 'api_key' && auth.actorId) {
      logAPIUsage({
        apiKeyId: auth.actorId,
        endpoint: '/api/enterprise/screening',
        statusCode: 200,
        latencyMs: Date.now() - startTime,
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      screeningId,
      result: output.legacyResult,
      safetyGate: {
        gateClass: output.safetyGate?.gate_class,
        requiresHumanReview: output.safetyGate?.require_human_review,
      },
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/enterprise/screening', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
