/**
 * Health Screening Follow-up API (Phase 3)
 * POST: 接收补问答案，重新运行 AEMC Pipeline
 *
 * 流程：
 * 1. 验证筛查记录状态为 'needs_followup'
 * 2. 将补问答案追加到原始 answers
 * 3. 重新运行 AEMC Pipeline（包含补问信息）
 * 4. 根据新的安全闸门结果决定完成或继续追问
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateAnswersHash } from '@/lib/utils/answers-hash';
import { sendScreeningErrorNotification } from '@/lib/email';
import { runAEMCPipeline, PipelineError } from '@/services/aemc';
import type { AEMCOutput } from '@/services/aemc';
import { persistPipelineResults, persistFailedRuns } from '@/services/aemc/persistence';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';
import { FREE_SCREENING_LIMIT } from '@/lib/screening-questions';

// Vercel Serverless 函数超时设置（秒）
export const maxDuration = 60;

// 最多允许追问轮次（防止无限循环）
const MAX_FOLLOWUP_ROUNDS = 2;

interface FollowupAnswer {
  question: string;
  answer: string;
}

export async function POST(request: NextRequest) {
  try {
    // 限速
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/health-screening/followup`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
    }

    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '请先登入后再使用此功能' },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { screeningId, followupAnswers } = body as {
      screeningId?: string;
      followupAnswers?: FollowupAnswer[];
    };

    if (!screeningId || !followupAnswers || !Array.isArray(followupAnswers)) {
      return NextResponse.json(
        { error: '缺少必填字段 (screeningId, followupAnswers)' },
        { status: 400 }
      );
    }

    if (followupAnswers.length === 0) {
      return NextResponse.json(
        { error: '请至少回答一个补充问题' },
        { status: 400 }
      );
    }

    // 获取筛查记录
    const { data: screening, error: fetchError } = await supabase
      .from('health_screenings')
      .select('*')
      .eq('id', screeningId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !screening) {
      return NextResponse.json({ error: '找不到该筛查记录' }, { status: 404 });
    }

    // 只有 'needs_followup' 状态才能提交补问
    if (screening.status !== 'needs_followup') {
      return NextResponse.json(
        { error: '此筛查不处于等待补充信息状态' },
        { status: 400 }
      );
    }

    // 检查追问轮次
    const followupCount = (screening.followup_count || 0) + 1;
    if (followupCount > MAX_FOLLOWUP_ROUNDS) {
      return NextResponse.json(
        { error: '已达到最大补充信息轮次' },
        { status: 400 }
      );
    }

    // 原始问卷答案 + 补问答案合并
    const originalAnswers = screening.answers || [];
    const bodyMapData = screening.body_map_data;

    // 将补问答案转换为 ScreeningAnswer 格式追加到原始答案
    const followupAsScreeningAnswers = followupAnswers.map((fa, idx) => ({
      questionId: 1000 + (followupCount - 1) * 100 + idx, // 避免与原始问题 ID 冲突
      question: fa.question,
      answer: fa.answer,
      note: `[补问第${followupCount}轮]`,
    }));

    // 合并所有历史补问答案
    const previousFollowupAnswers = screening.followup_answers || [];
    const allFollowupAnswers = [...previousFollowupAnswers, ...followupAsScreeningAnswers];
    const enrichedAnswers = [...originalAnswers, ...allFollowupAnswers];

    // 重新运行 AEMC Pipeline
    let analysisResult;
    let aemcOutputRef: AEMCOutput | null = null;

    // AEMC 4 AI 联合会诊 Pipeline（唯一分析路径）
    try {
      const aemcOutput = await runAEMCPipeline({
        screeningId,
        answers: enrichedAnswers,
        bodyMapData,
        userType: 'authenticated',
        userId: user.id,
        phase: 2, // 补问总是完整分析
      });
      analysisResult = aemcOutput.legacyResult;
      aemcOutputRef = aemcOutput;

      // 安全闸门元数据
      (analysisResult as Record<string, unknown>).safetyGateClass = aemcOutput.safetyGate.gate_class;
      (analysisResult as Record<string, unknown>).requiresHumanReview = aemcOutput.safetyGate.require_human_review;
      (analysisResult as Record<string, unknown>).requiresEmergencyNotice = aemcOutput.safetyGate.require_emergency_notice;

      // 审计持久化
      persistPipelineResults(aemcOutput.pipelineResult, 'authenticated').catch((e) => {
        console.warn('[AEMC] Followup persistence error:', e instanceof Error ? e.message : e);
      });
    } catch (pipelineError) {
      console.error('[AEMC] Followup pipeline failed for screening:', screeningId);
      if (pipelineError instanceof PipelineError) {
        persistFailedRuns(pipelineError.aiRuns, 'authenticated').catch((e) => {
          console.warn('[AEMC] Failed runs persistence error:', e instanceof Error ? e.message : e);
        });
      }

      // 发送管理员通知（fire-and-forget）
      sendScreeningErrorNotification({
        errorMessage: pipelineError instanceof Error ? pipelineError.message : String(pipelineError),
        screeningId,
        userType: 'authenticated',
        userId: user.id,
        endpoint: '/api/health-screening/followup',
        failedAiRuns: pipelineError instanceof PipelineError ? pipelineError.aiRuns.length : undefined,
        timestamp: new Date().toISOString(),
      }).catch((e) => console.warn('[AEMC] Error notification failed:', e));

      return NextResponse.json(
        { error: 'AI 分析服务暂时不可用，请稍后重试。我们已通知技术团队处理。' },
        { status: 503 }
      );
    }

    // 检查新的安全闸门结果：是否还需要追问
    const stillNeedsFollowup =
      aemcOutputRef &&
      aemcOutputRef.safetyGate.gate_class === 'B' &&
      aemcOutputRef.safetyGate.require_followup_questions &&
      followupCount < MAX_FOLLOWUP_ROUNDS;

    const newFollowupQuestions = stillNeedsFollowup
      ? aemcOutputRef.pipelineResult.adjudicated_assessment.must_ask_followups
      : null;

    if (stillNeedsFollowup && newFollowupQuestions && newFollowupQuestions.length > 0) {
      // 仍需追问
      const { error: updateError } = await supabase
        .from('health_screenings')
        .update({
          status: 'needs_followup',
          analysis_result: analysisResult,
          followup_questions: newFollowupQuestions,
          followup_answers: allFollowupAnswers,
          followup_count: followupCount,
        })
        .eq('id', screeningId)
        .eq('user_id', user.id)
        .eq('status', 'needs_followup');

      if (updateError) {
        console.warn('Screening followup update failed');
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

    // 完成：更新为最终结果
    const answersHash = generateAnswersHash(enrichedAnswers);
    const { error: updateError } = await supabase
      .from('health_screenings')
      .update({
        status: 'completed',
        analysis_result: analysisResult,
        answers_hash: answersHash,
        followup_answers: allFollowupAnswers,
        followup_count: followupCount,
        followup_questions: null, // 清除待答问题
        completed_at: new Date().toISOString(),
      })
      .eq('id', screeningId)
      .eq('user_id', user.id);

    if (updateError) {
      console.warn('Screening final update failed');
      return NextResponse.json({ error: '保存分析结果失败' }, { status: 500 });
    }

    // 更新用户使用量（首次 analyze 时未扣减，现在扣减）
    const { data: usage } = await supabase
      .from('screening_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (usage) {
      await supabase
        .from('screening_usage')
        .update({
          free_remaining: usage.free_remaining - 1,
          total_used: usage.total_used + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    } else {
      await supabase.from('screening_usage').insert({
        user_id: user.id,
        free_remaining: FREE_SCREENING_LIMIT - 1,
        total_used: 1,
        last_used_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      needsFollowup: false,
      analysisResult,
      followupRound: followupCount,
      message: '补充信息分析完成',
    });
  } catch (error: unknown) {
    console.warn('Health screening followup request failed');
    return NextResponse.json({ error: '系统错误，请稍后重试' }, { status: 500 });
  }
}
