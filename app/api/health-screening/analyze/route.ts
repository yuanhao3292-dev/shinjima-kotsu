/**
 * Health Screening Analysis API v4.0
 * POST: 触发 AI 分析并保存结果
 *
 * 安全特性：
 * - 答案哈希缓存（避免重复分析）
 * - AI 故障降级
 * - 安全日志（不记录敏感信息）
 *
 * 支持两阶段问诊系统：
 * - phase: 1 = 快速筛查（10题）→ 初步建议
 * - phase: 2 = 深度问诊（全部20题）→ 完整报告
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeHealthScreening, generateAnswersHash } from '@/services/deepseekService';
import {
  PHASE_1_QUESTIONS,
  getPhase2QuestionsByBodyParts,
} from '@/lib/screening-questions';
import { validateBody } from '@/lib/validations/validate';
import { HealthScreeningAnalyzeSchema } from '@/lib/validations/api-schemas';

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
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '請先登入後再使用此功能' },
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
      return NextResponse.json({ error: '找不到該筛查記錄' }, { status: 404 });
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

    // 检查答案数量
    const answers = screening.answers || [];
    const bodyMapData = screening.body_map_data;
    const requiredQuestionCount = calculateRequiredQuestionCount(phase, bodyMapData);

    if (answers.length < requiredQuestionCount) {
      return NextResponse.json(
        {
          error: `請完成所有問題後再提交分析（已回答 ${answers.length}/${requiredQuestionCount} 題）`,
        },
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
        { error: '您的免費筛查次數已用完' },
        { status: 403 }
      );
    }

    // 生成答案哈希用于缓存
    const answersHash = generateAnswersHash(answers);

    // 检查是否有相同答案的缓存分析结果
    const { data: cachedResult } = await supabase
      .from('health_screenings')
      .select('analysis_result')
      .eq('answers_hash', answersHash)
      .eq('status', 'completed')
      .not('analysis_result', 'is', null)
      .limit(1)
      .single();

    let analysisResult;

    if (cachedResult?.analysis_result) {
      // 使用缓存的分析结果
      console.info('Using cached analysis result');
      analysisResult = cachedResult.analysis_result;
    } else {
      // 调用 AI 分析（内置降级策略）
      // analyzeHealthScreening 已包含：
      // - Prompt 注入防护
      // - 请求超时处理
      // - AI 故障降级（规则引擎）
      // - 输出验证
      analysisResult = await analyzeHealthScreening(answers, phase);
    }

    // 更新筛查记录
    const { error: updateError } = await supabase
      .from('health_screenings')
      .update({
        status: 'completed',
        analysis_result: analysisResult,
        answers_hash: answersHash,
        completed_at: new Date().toISOString(),
      })
      .eq('id', screeningId)
      .eq('user_id', user.id);

    if (updateError) {
      console.warn('Screening update failed');
      return NextResponse.json({ error: '保存分析結果失敗' }, { status: 500 });
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
      analysisResult,
      phase,
      isCached: !!cachedResult?.analysis_result,
      isFallback: analysisResult.isFallback || false,
      message: phase === 1 ? '快速篩查分析完成' : '完整分析完成',
    });
  } catch (error: unknown) {
    // 安全日志：不记录详细错误信息
    console.warn('Health screening analysis request failed');
    return NextResponse.json({ error: '系統錯誤，請稍後重試' }, { status: 500 });
  }
}
