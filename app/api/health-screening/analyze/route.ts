/**
 * Health Screening Analysis API v5.0 (AEMC Pipeline)
 * POST: 触发 AI 分析并保存结果
 *
 * 安全特性：
 * - AEMC 4 AI 联合会诊（环境变量 AEMC_ENABLED=true 开启）
 * - 答案哈希缓存（避免重复分析）
 * - AI 故障通知（AEMC 失败 → 管理员邮件通知 + 用户友好错误）
 * - 安全日志（不记录敏感信息）
 *
 * 支持两阶段问诊系统：
 * - phase: 1 = 快速筛查（10题）→ 初步建议
 * - phase: 2 = 深度问诊（全部20题）→ 完整报告
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateAnswersHash } from '@/lib/utils/answers-hash';
import { sendScreeningErrorNotification } from '@/lib/email';
import { runAEMCPipeline, PipelineError } from '@/services/aemc';
import type { AEMCOutput } from '@/services/aemc';
import { persistPipelineResults, persistFailedRuns } from '@/services/aemc/persistence';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';
import {
  PHASE_1_QUESTIONS,
  getPhase2QuestionsByBodyParts,
} from '@/lib/screening-questions';
import { validateBody } from '@/lib/validations/validate';
import { HealthScreeningAnalyzeSchema } from '@/lib/validations/api-schemas';

// Vercel Serverless 函数超时设置（秒）
// AEMC Pipeline 需要 3-4 次顺序 AI 调用，总计约 20-40 秒
// Hobby 计划上限 10s，Pro 计划上限 60s
export const maxDuration = 60;

// [Phase 3] 最多允许追问轮次（防止无限循环）
const MAX_FOLLOWUP_ROUNDS = 2;

// 计算所需问题数量
function calculateRequiredQuestionCount(phase: 1 | 2, bodyMapData: any): number {
  if (phase === 1) {
    return PHASE_1_QUESTIONS; // 10 题
  }

  // 第二阶段：第一阶段题数 + 第二阶段题数
  const bodyPartIds = bodyMapData?.selectedBodyParts || [];
  const phase2Questions = getPhase2QuestionsByBodyParts(bodyPartIds);
  return PHASE_1_QUESTIONS + phase2Questions.length;
}

// POST: 触发 AI 分析
export async function POST(request: NextRequest) {
  try {
    // 限速 — 防止 AI API 配额滥用
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/health-screening/analyze`,
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

    // 使用 Zod Schema 验证输入
    const validation = await validateBody(request, HealthScreeningAnalyzeSchema);
    if (!validation.success) return validation.error;
    const { screeningId, phase } = validation.data; // phase 默认为 2（完整分析）

    // 获取筛查记录（screeningId 已由 Schema 验证为有效 UUID）
    const { data: screening, error: fetchError } = await supabase
      .from('health_screenings')
      .select('*')
      .eq('id', screeningId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !screening) {
      return NextResponse.json({ error: '找不到该筛查记录' }, { status: 404 });
    }

    if (screening.status === 'completed') {
      return NextResponse.json(
        {
          error: '此筛查已完成',
          analysisResult: screening.analysis_result,
        },
        { status: 400 }
      );
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

    // 检查答案数量（纯文档模式下跳过问卷数量验证）
    const answers = screening.answers || [];
    const bodyMapData = screening.body_map_data;
    const documentText = screening.document_extracted_text as string | null;
    const inputMode = (screening.input_mode as string) || 'questionnaire';

    // hybrid 模式下用户可能只上传了文档未填问卷 → 视为 document-only
    const effectiveInputMode =
      inputMode === 'hybrid' && answers.length === 0 && documentText
        ? 'document'
        : inputMode;

    if (effectiveInputMode === 'questionnaire' || effectiveInputMode === 'hybrid') {
      const requiredQuestionCount = calculateRequiredQuestionCount(phase, bodyMapData);
      if (answers.length < requiredQuestionCount) {
        return NextResponse.json(
          {
            error: `请完成所有问题后再提交分析（已回答 ${answers.length}/${requiredQuestionCount} 题）`,
          },
          { status: 400 }
        );
      }
    }

    // 文档模式必须有提取的文本
    if (effectiveInputMode === 'document' && !documentText) {
      return NextResponse.json(
        { error: '请先上传诊断书/检查报告' },
        { status: 400 }
      );
    }

    // 检查用户的免费额度
    const { data: usage, error: usageError } = await supabase
      .from('screening_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (usageError && usageError.code !== 'PGRST116') {
      // 只记录错误类型，不记录详情
      console.warn('Usage fetch failed with code:', usageError.code);
    }

    if (usage && usage.free_remaining <= 0) {
      return NextResponse.json(
        { error: '您的免费筛查次数已用完' },
        { status: 403 }
      );
    }

    // 生成答案哈希用于缓存（目前仅用于日志，DB 列尚未创建）
    const answersHash = generateAnswersHash(answers);

    // 缓存查询：暂时跳过（answers_hash 列尚未添加到数据库）
    const cachedResult: { analysis_result: unknown } | null = null;

    let analysisResult;
    let aemcOutputRef: AEMCOutput | null = null; // [Phase 3] 保存 AEMC 输出用于 Class B 判断

    if (cachedResult?.analysis_result) {
      // 使用缓存的分析结果
      console.info('Using cached analysis result');
      analysisResult = cachedResult.analysis_result;
    } else {
      // AEMC 4 AI 联合会诊 Pipeline（唯一分析路径）
      try {
        const aemcOutput = await runAEMCPipeline({
          screeningId,
          answers,
          bodyMapData,
          userType: 'authenticated',
          userId: user.id,
          phase,
          uploadedReportText: documentText || undefined,
        });
        analysisResult = aemcOutput.legacyResult;
        aemcOutputRef = aemcOutput; // [Phase 3] 保存引用

        // [AUDIT-FIX] 将安全闸门元数据附加到 analysisResult，供前端结构化使用
        (analysisResult as Record<string, unknown>).safetyGateClass = aemcOutput.safetyGate.gate_class;
        (analysisResult as Record<string, unknown>).requiresHumanReview = aemcOutput.safetyGate.require_human_review;
        (analysisResult as Record<string, unknown>).requiresEmergencyNotice = aemcOutput.safetyGate.require_emergency_notice;

        // [Phase 2] 审计持久化（fire-and-forget，不阻断主流程）
        persistPipelineResults(aemcOutput.pipelineResult, 'authenticated').catch((e) => {
          console.warn('[AEMC] Persistence fire-and-forget error:', e instanceof Error ? e.message : e);
        });

        if (!aemcOutput.safetyGate.allow_auto_display) {
          console.warn(
            `[AEMC] Safety gate: ${aemcOutput.safetyGate.gate_class} for ${screeningId}`
          );
        }
      } catch (pipelineError) {
        // AEMC 失败 → 通知管理员 + 返回用户友好错误
        console.error('[AEMC] Pipeline failed for screening:', screeningId);
        if (pipelineError instanceof PipelineError) {
          console.warn(`[AEMC] Failed AI runs: ${pipelineError.aiRuns.length}`);
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
          endpoint: '/api/health-screening/analyze',
          failedAiRuns: pipelineError instanceof PipelineError ? pipelineError.aiRuns.length : undefined,
          timestamp: new Date().toISOString(),
        }).catch((e) => console.warn('[AEMC] Error notification failed:', e));

        return NextResponse.json(
          { error: 'AI 分析服务暂时不可用，请稍后重试。我们已通知技术团队处理。' },
          { status: 503 }
        );
      }
    }

    // [Phase 3] 检查是否需要追问（Class B + 未达追问上限）
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
        .from('health_screenings')
        .update({
          status: 'needs_followup',
          analysis_result: analysisResult,
        })
        .eq('id', screeningId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Screening followup update failed:', updateError.message, updateError.code);
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

    // 正常完成（Class A/C/D 或无 AEMC）
    const { error: updateError } = await supabase
      .from('health_screenings')
      .update({
        status: 'completed',
        analysis_result: analysisResult,
        completed_at: new Date().toISOString(),
      })
      .eq('id', screeningId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Screening update failed:', updateError.message, updateError.code, updateError.details);
      return NextResponse.json({ error: '保存分析结果失败' }, { status: 500 });
    }

    // 更新用户的使用量
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
      // 如果没有 usage 记录，创建一个
      await supabase.from('screening_usage').insert({
        user_id: user.id,
        free_remaining: 2, // 3 - 1 = 2
        total_used: 1,
        last_used_at: new Date().toISOString(),
      });
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
  } catch (error: unknown) {
    // 安全日志：不记录详细错误信息
    console.warn('Health screening analysis request failed');
    return NextResponse.json({ error: '系统錯误，请稍后重試' }, { status: 500 });
  }
}
