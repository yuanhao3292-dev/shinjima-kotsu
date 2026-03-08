/**
 * 管理员 — 人工审核工作台 API
 *
 * GET  /api/admin/reviews - 获取需要人工审核的筛查案例
 * POST /api/admin/reviews - 提交审核决定
 *
 * Class C 安全闸门 → 需要人工医疗协调员审核后才能向患者展示。
 * 审核结果会更新 screening 状态，释放或拦截分析报告。
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * GET /api/admin/reviews - 获取需要人工审核的案例列表
 *
 * 数据源：screening_adjudications 中 escalate_to_human = true 或
 *         safety_gate_class = 'C' 的记录
 */
export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/reviews:GET`,
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
  const status = searchParams.get('status') || 'pending';
  const gateClass = searchParams.get('gate_class');

  // 验证 status 参数
  const validStatuses = ['pending', 'all'];
  if (!validStatuses.includes(status)) {
    return createErrorResponse(
      Errors.validation(`status 必须是: ${validStatuses.join(', ')}`)
    );
  }

  // 验证 gate_class 参数
  const validGateClasses = ['A', 'B', 'C', 'D'];
  if (gateClass && !validGateClasses.includes(gateClass)) {
    return createErrorResponse(
      Errors.validation(`gate_class 必须是: ${validGateClasses.join(', ')}`)
    );
  }

  try {
    // 获取仲裁记录
    let query = supabase
      .from('screening_adjudications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (status === 'pending') {
      // 待审核 = escalate_to_human = true
      query = query.eq('escalate_to_human', true);
    }
    // status === 'all' → 不加 escalate_to_human 过滤

    if (gateClass) {
      query = query.eq('safety_gate_class', gateClass);
    }

    const { data: adjudications, error } = await query;

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/reviews', method: 'GET' });
      return createErrorResponse(Errors.internal('获取审核列表失败'));
    }

    // 获取统计数据（并行查询）
    const [pendingRes, classCRes, classDRes] = await Promise.all([
      supabase
        .from('screening_adjudications')
        .select('*', { count: 'exact', head: true })
        .eq('escalate_to_human', true),
      supabase
        .from('screening_adjudications')
        .select('*', { count: 'exact', head: true })
        .eq('safety_gate_class', 'C')
        .eq('escalate_to_human', true),
      supabase
        .from('screening_adjudications')
        .select('*', { count: 'exact', head: true })
        .eq('safety_gate_class', 'D')
        .eq('escalate_to_human', true),
    ]);

    return NextResponse.json({
      adjudications: adjudications || [],
      stats: {
        pendingReview: pendingRes.count ?? 0,
        classC: classCRes.count ?? 0,
        classD: classDRes.count ?? 0,
      },
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/reviews', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

/**
 * POST /api/admin/reviews - 提交人工审核决定
 *
 * action: 'approve' (释放报告给用户) | 'reject' (拦截报告) | 'escalate' (转给更高级别审核)
 */
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/reviews`,
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
    const { adjudicationId, screeningId, screeningType, action, reviewNote } = body as {
      adjudicationId?: string;
      screeningId?: string;
      screeningType?: string;
      action?: string;
      reviewNote?: string;
    };

    // 输入验证
    if (!adjudicationId || !screeningId || !screeningType || !action) {
      return createErrorResponse(
        Errors.validation('adjudicationId, screeningId, screeningType, action 必填')
      );
    }

    const validActions = ['approve', 'reject', 'escalate'];
    if (!validActions.includes(action)) {
      return createErrorResponse(
        Errors.validation(`action 必须是: ${validActions.join(', ')}`)
      );
    }

    const validTypes = ['authenticated', 'whitelabel'];
    if (!validTypes.includes(screeningType)) {
      return createErrorResponse(
        Errors.validation(`screeningType 必须是: ${validTypes.join(', ')}`)
      );
    }

    const supabase = getSupabaseAdmin();

    // 幂等性检查：确认该案例仍在待审核状态
    const { data: existing, error: fetchErr } = await supabase
      .from('screening_adjudications')
      .select('escalate_to_human')
      .eq('id', adjudicationId)
      .single();

    if (fetchErr || !existing) {
      return createErrorResponse(Errors.validation('未找到该仲裁记录'));
    }

    if (!existing.escalate_to_human) {
      return createErrorResponse(Errors.validation('此案例已被审核，无法重复操作'));
    }

    // 构建仲裁记录更新字段
    const adjUpdate: Record<string, unknown> = {
      escalate_to_human: action === 'escalate', // approve/reject → false, escalate → true
      escalation_reason: reviewNote || null,
      // 记录审核决定，用于审计追溯（存入 escalation_reason 字段前缀区分）
      safe_to_auto_display: action === 'approve', // 批准 → 可展示
    };

    const { error: adjError } = await supabase
      .from('screening_adjudications')
      .update(adjUpdate)
      .eq('id', adjudicationId);

    if (adjError) {
      logError(normalizeError(adjError), { path: '/api/admin/reviews', method: 'POST' });
      return createErrorResponse(Errors.internal('更新审核状态失败'));
    }

    // 根据审核决定更新筛查状态
    const table = screeningType === 'whitelabel' ? 'whitelabel_screenings' : 'health_screenings';

    if (action === 'approve') {
      const { error: screeningErr } = await supabase
        .from(table)
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', screeningId);

      if (screeningErr) {
        logError(normalizeError(screeningErr), {
          path: '/api/admin/reviews',
          method: 'POST',
          detail: 'approve screening update failed',
        });
        return createErrorResponse(Errors.internal('释放报告失败，请重试'));
      }
    } else if (action === 'reject') {
      // 明确将筛查标记为已拒绝，防止进入 limbo 状态
      const { error: screeningErr } = await supabase
        .from(table)
        .update({ status: 'rejected' })
        .eq('id', screeningId);

      if (screeningErr) {
        logError(normalizeError(screeningErr), {
          path: '/api/admin/reviews',
          method: 'POST',
          detail: 'reject screening update failed',
        });
        // 非阻塞：拒绝状态更新失败不影响主流程（adjudication 已标记）
        console.error('[WARN] 筛查拒绝状态更新失败:', screeningErr);
      }
    }

    // 审计日志
    const { error: auditErr } = await supabase.from('audit_logs').insert({
      action: `review_${action}`,
      entity_type: 'screening_adjudication',
      entity_id: adjudicationId,
      admin_id: authResult.userId,
      admin_email: authResult.email,
      details: {
        screeningId,
        screeningType,
        reviewNote,
        decision: action,
      },
    });
    if (auditErr) {
      console.error('[CRITICAL] 审计日志写入失败:', auditErr);
    }

    const messages: Record<string, string> = {
      approve: '审核通过，报告已释放',
      reject: '审核拒绝，报告已拦截',
      escalate: '已转交更高级别审核',
    };

    return NextResponse.json({
      success: true,
      message: messages[action],
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/reviews', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
