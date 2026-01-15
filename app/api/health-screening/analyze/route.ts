/**
 * Health Screening Analysis API v3.0
 * POST: 触发 AI 分析并保存结果
 *
 * 支持两阶段问诊系统：
 * - phase: 1 = 快速筛查（10题）→ 初步建议
 * - phase: 2 = 深度问诊（全部20题）→ 完整报告
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeHealthScreening } from '@/services/deepseekService';
import {
  PHASE_1_QUESTIONS,
  getPhase2QuestionsByBodyParts,
} from '@/lib/screening-questions';

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

    const body = await request.json();
    const { screeningId, phase = 2 } = body; // 默认 phase 2 完整分析

    if (!screeningId) {
      return NextResponse.json(
        { error: '請提供筛查記錄 ID' },
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
      console.error('Error fetching usage:', usageError);
    }

    if (usage && usage.free_remaining <= 0) {
      return NextResponse.json(
        { error: '您的免費筛查次數已用完' },
        { status: 403 }
      );
    }

    // 调用 DeepSeek API 分析
    // 传递 phase 参数让 AI 知道这是快速筛查还是完整分析
    let analysisResult;
    try {
      analysisResult = await analyzeHealthScreening(answers, phase);
    } catch (aiError: any) {
      console.error('AI analysis error:', aiError);
      return NextResponse.json(
        { error: 'AI 分析失敗，請稍後重試' },
        { status: 500 }
      );
    }

    // 更新筛查记录
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
      console.error('Error updating screening:', updateError);
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
      message: phase === 1 ? '快速篩查分析完成' : '完整分析完成',
    });
  } catch (error: any) {
    console.error('Health screening analyze error:', error);
    return NextResponse.json({ error: '系統錯誤，請稍後重試' }, { status: 500 });
  }
}
