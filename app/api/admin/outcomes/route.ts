/**
 * 管理员 — 就诊结果回流 API
 *
 * GET  /api/admin/outcomes - 获取就诊结果列表
 * POST /api/admin/outcomes - 记录真实就诊结果
 *
 * 此数据是 AI 分诊准确性的核心度量来源。
 * outcome_label: accurate / under_triage / over_triage / missed
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * GET /api/admin/outcomes - 获取就诊结果列表
 */
export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/outcomes:GET`,
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
  const label = searchParams.get('label');
  const parsedLimit = parseInt(searchParams.get('limit') || '50');
  const limit = Math.min(Number.isNaN(parsedLimit) ? 50 : parsedLimit, 100);

  // 验证 label 枚举值
  const validLabels = ['accurate', 'under_triage', 'over_triage', 'missed'];
  if (label && !validLabels.includes(label)) {
    return createErrorResponse(
      Errors.validation(`label 必须是: ${validLabels.join(', ')}`)
    );
  }

  try {
    let query = supabase
      .from('screening_outcomes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (label) {
      query = query.eq('outcome_label', label);
    }

    const { data, error } = await query;

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/outcomes', method: 'GET' });
      return createErrorResponse(Errors.internal('获取就诊结果列表失败'));
    }

    // 统计各标签数量（并行 count 查询，避免全表扫描）
    const [accurateRes, underRes, overRes, missedRes] = await Promise.all(
      validLabels.map((l) =>
        supabase
          .from('screening_outcomes')
          .select('*', { count: 'exact', head: true })
          .eq('outcome_label', l)
      )
    );

    const labelCounts: Record<string, number> = {
      accurate: accurateRes.count ?? 0,
      under_triage: underRes.count ?? 0,
      over_triage: overRes.count ?? 0,
      missed: missedRes.count ?? 0,
    };

    return NextResponse.json({
      outcomes: data || [],
      stats: labelCounts,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/outcomes', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

/**
 * POST /api/admin/outcomes - 记录真实就诊结果
 */
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/outcomes`,
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

    const body = await request.json();
    const {
      screeningId,
      screeningType,
      contactedHospitalId,
      actualDepartment,
      doctorFeedback,
      finalClinicalDirection,
      wasAdmitted,
      surgeryPerformed,
      urgencyConfirmed,
      outcomeLabel,
      notes,
    } = body as {
      screeningId?: string;
      screeningType?: string;
      contactedHospitalId?: string;
      actualDepartment?: string;
      doctorFeedback?: string;
      finalClinicalDirection?: string;
      wasAdmitted?: boolean;
      surgeryPerformed?: boolean;
      urgencyConfirmed?: boolean;
      outcomeLabel?: string;
      notes?: string;
    };

    if (!screeningId) {
      return createErrorResponse(Errors.validation('screeningId 必填'));
    }

    const validLabels = ['accurate', 'under_triage', 'over_triage', 'missed'];
    if (outcomeLabel && !validLabels.includes(outcomeLabel)) {
      return createErrorResponse(
        Errors.validation(`outcome_label 必须是: ${validLabels.join(', ')}`)
      );
    }

    const validTypes = ['authenticated', 'whitelabel'];
    if (screeningType && !validTypes.includes(screeningType)) {
      return createErrorResponse(
        Errors.validation(`screeningType 必须是: ${validTypes.join(', ')}`)
      );
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from('screening_outcomes').insert({
      screening_id: screeningId,
      screening_type: screeningType || 'authenticated',
      contacted_hospital_id: contactedHospitalId || null,
      actual_department: actualDepartment || null,
      doctor_feedback: doctorFeedback || null,
      final_clinical_direction: finalClinicalDirection || null,
      was_admitted: wasAdmitted ?? null,
      surgery_performed: surgeryPerformed ?? null,
      urgency_confirmed: urgencyConfirmed ?? null,
      outcome_label: outcomeLabel || null,
      notes: notes || null,
    });

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/outcomes', method: 'POST' });
      return createErrorResponse(Errors.internal('记录就诊结果失败'));
    }

    // 审计日志（非阻塞）
    const { error: auditErr } = await supabase.from('audit_logs').insert({
      action: 'outcome_recorded',
      entity_type: 'screening_outcome',
      entity_id: screeningId,
      admin_id: authResult.userId,
      admin_email: authResult.email,
      details: { outcomeLabel, screeningType },
    });
    if (auditErr) {
      console.error('[CRITICAL] 审计日志写入失败:', auditErr);
    }

    return NextResponse.json({
      success: true,
      message: '就诊结果已记录',
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/outcomes', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
