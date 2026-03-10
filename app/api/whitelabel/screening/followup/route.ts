/**
 * Whitelabel Screening Follow-up API (Phase 3)
 * POST: 接收补问答案，重新运行 AEMC Pipeline（白标版）
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { generateAnswersHash } from '@/lib/utils/answers-hash';
import { sendScreeningErrorNotification } from '@/lib/email';
import { runAEMCPipeline, PipelineError } from '@/services/aemc';
import type { AEMCOutput } from '@/services/aemc';
import { persistPipelineResults, persistFailedRuns } from '@/services/aemc/persistence';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';

// Vercel Serverless 函数超时设置（秒）
export const maxDuration = 60;

const MAX_FOLLOWUP_ROUNDS = 2;

interface FollowupAnswer {
  question: string;
  answer: string;
}

export async function POST(request: NextRequest) {
  try {
    // [AUDIT-FIX] 限速 — 防止 AI API 配额滥用
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/whitelabel/screening/followup`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
    }

    const body = await request.json();
    const { screeningId, sessionId, followupAnswers } = body as {
      screeningId?: string;
      sessionId?: string;
      followupAnswers?: FollowupAnswer[];
    };

    if (!screeningId || !sessionId || !followupAnswers || !Array.isArray(followupAnswers)) {
      return NextResponse.json(
        { error: '缺少必填字段 (screeningId, sessionId, followupAnswers)' },
        { status: 400 }
      );
    }

    if (followupAnswers.length === 0) {
      return NextResponse.json(
        { error: '请至少回答一个补充问题' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 验证 session_id 所有权
    const { data: screening, error: fetchError } = await supabase
      .from('whitelabel_screenings')
      .select('*')
      .eq('id', screeningId)
      .eq('session_id', sessionId)
      .single();

    if (fetchError || !screening) {
      return NextResponse.json({ error: '筛查记录不存在' }, { status: 404 });
    }

    if (screening.status !== 'needs_followup') {
      return NextResponse.json(
        { error: '此筛查不处于等待补充信息状态' },
        { status: 400 }
      );
    }

    const followupCount = (screening.followup_count || 0) + 1;
    if (followupCount > MAX_FOLLOWUP_ROUNDS) {
      return NextResponse.json(
        { error: '已达到最大补充信息轮次' },
        { status: 400 }
      );
    }

    // 合并答案
    const originalAnswers = screening.answers || [];
    const bodyMapData = screening.body_map_data;

    const followupAsScreeningAnswers = followupAnswers.map((fa, idx) => ({
      questionId: 1000 + (followupCount - 1) * 100 + idx,
      question: fa.question,
      answer: fa.answer,
      note: `[补问第${followupCount}轮]`,
    }));

    const previousFollowupAnswers = screening.followup_answers || [];
    const allFollowupAnswers = [...previousFollowupAnswers, ...followupAsScreeningAnswers];
    const enrichedAnswers = [...originalAnswers, ...allFollowupAnswers];

    // 重新运行 Pipeline
    let analysisResult;
    let aemcOutputRef: AEMCOutput | null = null;

    // AEMC 4 AI 联合会诊 Pipeline（唯一分析路径）
    try {
      const aemcOutput = await runAEMCPipeline({
        screeningId,
        answers: enrichedAnswers,
        bodyMapData,
        userType: 'whitelabel',
        sessionId,
        phase: 2,
      });
      analysisResult = aemcOutput.legacyResult;
      aemcOutputRef = aemcOutput;

      (analysisResult as Record<string, unknown>).safetyGateClass = aemcOutput.safetyGate.gate_class;
      (analysisResult as Record<string, unknown>).requiresHumanReview = aemcOutput.safetyGate.require_human_review;
      (analysisResult as Record<string, unknown>).requiresEmergencyNotice = aemcOutput.safetyGate.require_emergency_notice;

      persistPipelineResults(aemcOutput.pipelineResult, 'whitelabel').catch((e) => {
        console.warn('[AEMC] Followup persistence error:', e instanceof Error ? e.message : e);
      });
    } catch (pipelineError) {
      console.error('[AEMC] Followup pipeline failed for whitelabel screening:', screeningId);
      if (pipelineError instanceof PipelineError) {
        persistFailedRuns(pipelineError.aiRuns, 'whitelabel').catch((e) => {
          console.warn('[AEMC] Failed runs persistence error:', e instanceof Error ? e.message : e);
        });
      }

      sendScreeningErrorNotification({
        errorMessage: pipelineError instanceof Error ? pipelineError.message : String(pipelineError),
        screeningId,
        userType: 'whitelabel',
        sessionId,
        endpoint: '/api/whitelabel/screening/followup',
        failedAiRuns: pipelineError instanceof PipelineError ? pipelineError.aiRuns.length : undefined,
        timestamp: new Date().toISOString(),
      }).catch((e) => console.warn('[AEMC] Error notification failed:', e));

      return NextResponse.json(
        { error: 'AI 分析服务暂时不可用，请稍后重试。我们已通知技术团队处理。' },
        { status: 503 }
      );
    }

    // 检查是否还需追问
    const stillNeedsFollowup =
      aemcOutputRef &&
      aemcOutputRef.safetyGate.gate_class === 'B' &&
      aemcOutputRef.safetyGate.require_followup_questions &&
      followupCount < MAX_FOLLOWUP_ROUNDS;

    const newFollowupQuestions = stillNeedsFollowup
      ? aemcOutputRef.pipelineResult.adjudicated_assessment.must_ask_followups
      : null;

    if (stillNeedsFollowup && newFollowupQuestions && newFollowupQuestions.length > 0) {
      const { error: updateError } = await supabase
        .from('whitelabel_screenings')
        .update({
          status: 'needs_followup',
          analysis_result: analysisResult,
          followup_questions: newFollowupQuestions,
          followup_answers: allFollowupAnswers,
          followup_count: followupCount,
        })
        .eq('id', screeningId)
        .eq('session_id', sessionId)
        .eq('status', 'needs_followup');

      if (updateError) {
        return NextResponse.json({ error: '保存分析结果失败' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        needsFollowup: true,
        followupQuestions: newFollowupQuestions,
        followupRound: followupCount,
        analysisResult,
        message: 'AI 需要更多补充信息',
      });
    }

    // 完成
    const answersHash = generateAnswersHash(enrichedAnswers);
    const { error: updateError } = await supabase
      .from('whitelabel_screenings')
      .update({
        status: 'completed',
        analysis_result: analysisResult,
        answers_hash: answersHash,
        followup_answers: allFollowupAnswers,
        followup_count: followupCount,
        followup_questions: null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', screeningId)
      .eq('session_id', sessionId);

    if (updateError) {
      return NextResponse.json({ error: '保存分析结果失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      needsFollowup: false,
      analysisResult,
      followupRound: followupCount,
      message: '补充信息分析完成',
    });
  } catch (error) {
    console.warn('Whitelabel screening followup failed');
    return NextResponse.json(
      { error: '系统错误，请稍后重试' },
      { status: 500 }
    );
  }
}
