import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { analyzeHealthScreening, generateAnswersHash } from '@/services/deepseekService';
import { runAEMCPipeline, PipelineError } from '@/services/aemc';
import type { AEMCOutput } from '@/services/aemc';
import { persistPipelineResults, persistFailedRuns } from '@/services/aemc/persistence';
import {
  PHASE_1_QUESTIONS,
  getPhase2QuestionsByBodyParts,
} from '@/lib/screening-questions';

// [Phase 3] 最多允许追问轮次
const MAX_FOLLOWUP_ROUNDS = 2;

function calculateRequiredQuestionCount(phase: 1 | 2, bodyMapData: any): number {
  if (phase === 1) {
    return PHASE_1_QUESTIONS;
  }
  const bodyPartIds = bodyMapData?.selectedBodyParts || [];
  const phase2Questions = getPhase2QuestionsByBodyParts(bodyPartIds);
  return PHASE_1_QUESTIONS + phase2Questions.length;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { screeningId, sessionId, phase = 2 } = body;

    if (!screeningId || !sessionId) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    if (phase !== 1 && phase !== 2) {
      return NextResponse.json(
        { error: 'phase 必须为 1 或 2' },
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
      return NextResponse.json(
        { error: '筛查记录不存在' },
        { status: 404 }
      );
    }

    if (screening.status === 'completed') {
      return NextResponse.json({
        success: true,
        analysisResult: screening.analysis_result,
        phase,
        isCached: true,
        message: '此筛查已完成',
      });
    }

    // [Phase 3] needs_followup 状态由 /followup 端点处理
    if (screening.status === 'needs_followup') {
      return NextResponse.json(
        {
          error: '此筛查正在等待补充信息',
          needsFollowup: true,
          followupQuestions: screening.followup_questions,
        },
        { status: 400 }
      );
    }

    // 检查答案数量
    const answers = screening.answers || [];
    const bodyMapData = screening.body_map_data;
    const requiredQuestionCount = calculateRequiredQuestionCount(phase, bodyMapData);

    if (answers.length < requiredQuestionCount) {
      return NextResponse.json(
        {
          error: `请完成所有问题后再提交分析（已回答 ${answers.length}/${requiredQuestionCount} 题）`,
        },
        { status: 400 }
      );
    }

    // 生成答案哈希用于缓存
    const answersHash = generateAnswersHash(answers);

    // 检查是否有相同答案的缓存分析结果
    const { data: cachedResult } = await supabase
      .from('whitelabel_screenings')
      .select('analysis_result')
      .eq('answers_hash', answersHash)
      .eq('status', 'completed')
      .not('analysis_result', 'is', null)
      .limit(1)
      .single();

    let analysisResult;
    let aemcOutputRef: AEMCOutput | null = null;

    if (cachedResult?.analysis_result) {
      console.info('Using cached whitelabel analysis result');
      analysisResult = cachedResult.analysis_result;
    } else if (process.env.AEMC_ENABLED === 'true') {
      // AEMC 4 AI 联合会诊 Pipeline
      try {
        const aemcOutput = await runAEMCPipeline({
          screeningId,
          answers,
          bodyMapData,
          userType: 'whitelabel',
          sessionId,
          phase,
        });
        analysisResult = aemcOutput.legacyResult;
        aemcOutputRef = aemcOutput;

        // [AUDIT-FIX] 将安全闸门元数据附加到 analysisResult
        (analysisResult as Record<string, unknown>).safetyGateClass = aemcOutput.safetyGate.gate_class;
        (analysisResult as Record<string, unknown>).requiresHumanReview = aemcOutput.safetyGate.require_human_review;
        (analysisResult as Record<string, unknown>).requiresEmergencyNotice = aemcOutput.safetyGate.require_emergency_notice;

        // [Phase 2] 审计持久化（fire-and-forget，不阻断主流程）
        persistPipelineResults(aemcOutput.pipelineResult, 'whitelabel').catch((e) => {
          console.warn('[AEMC] Persistence fire-and-forget error:', e instanceof Error ? e.message : e);
        });

        if (!aemcOutput.safetyGate.allow_auto_display) {
          console.warn(
            `[AEMC] Safety gate: ${aemcOutput.safetyGate.gate_class} for ${screeningId}`
          );
        }
      } catch (pipelineError) {
        console.error('[AEMC] Pipeline failed, falling back to DeepSeek');
        if (pipelineError instanceof PipelineError) {
          console.warn(`[AEMC] Failed AI runs: ${pipelineError.aiRuns.length}`);
          // [Phase 2] 持久化失败的 AI runs
          persistFailedRuns(pipelineError.aiRuns, 'whitelabel').catch((e) => {
            console.warn('[AEMC] Failed runs persistence error:', e instanceof Error ? e.message : e);
          });
        } else {
          console.warn('[AEMC] Non-PipelineError, AI runs may be lost from audit trail');
        }
        analysisResult = await analyzeHealthScreening(answers, phase);
      }
    } else {
      // 旧版 DeepSeek 单模型分析
      analysisResult = await analyzeHealthScreening(answers, phase);
    }

    // [Phase 3] 检查是否需要追问
    const followupCount = screening.followup_count || 0;
    const needsFollowup =
      aemcOutputRef &&
      aemcOutputRef.safetyGate.gate_class === 'B' &&
      aemcOutputRef.safetyGate.require_followup_questions &&
      followupCount < MAX_FOLLOWUP_ROUNDS;

    const followupQuestions = needsFollowup
      ? aemcOutputRef.pipelineResult.adjudicated_assessment.must_ask_followups
      : null;

    if (needsFollowup && followupQuestions && followupQuestions.length > 0) {
      // Class B: 保存初步结果但标记为需要追问
      const { error: updateError } = await supabase
        .from('whitelabel_screenings')
        .update({
          status: 'needs_followup',
          analysis_result: analysisResult,
          answers_hash: answersHash,
          followup_questions: followupQuestions,
        })
        .eq('id', screeningId)
        .eq('session_id', sessionId);

      if (updateError) {
        console.warn('Whitelabel screening followup update failed');
        return NextResponse.json({ error: '保存分析结果失败' }, { status: 500 });
      }

      console.info(`[AEMC] Class B: ${followupQuestions.length} follow-up questions for ${screeningId}`);

      return NextResponse.json({
        success: true,
        needsFollowup: true,
        followupQuestions,
        analysisResult,
        phase,
        isCached: false,
        isFallback: false,
        message: 'AI 需要一些补充信息以提供更准确的分析',
      });
    }

    // 正常完成
    const { error: updateError } = await supabase
      .from('whitelabel_screenings')
      .update({
        status: 'completed',
        analysis_result: analysisResult,
        answers_hash: answersHash,
        completed_at: new Date().toISOString(),
      })
      .eq('id', screeningId)
      .eq('session_id', sessionId);

    if (updateError) {
      console.warn('Whitelabel screening update failed');
      return NextResponse.json(
        { error: '保存分析结果失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      needsFollowup: false,
      analysisResult,
      phase,
      isCached: !!cachedResult?.analysis_result,
      isFallback: analysisResult.isFallback || false,
      message: phase === 1 ? '快速筛查分析完成' : '完整分析完成',
    });
  } catch (error) {
    console.warn('Whitelabel screening analysis failed');
    return NextResponse.json(
      { error: '系统错误，请稍后重试' },
      { status: 500 }
    );
  }
}
