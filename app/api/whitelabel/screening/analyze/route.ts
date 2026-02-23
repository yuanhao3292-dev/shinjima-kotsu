import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { analyzeHealthScreening, generateAnswersHash } from '@/services/deepseekService';
import {
  PHASE_1_QUESTIONS,
  getPhase2QuestionsByBodyParts,
} from '@/lib/screening-questions';

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

    // 检查是否有相同答案的缓存分析结果（从白标表和登录版表都查）
    const { data: cachedResult } = await supabase
      .from('whitelabel_screenings')
      .select('analysis_result')
      .eq('answers_hash', answersHash)
      .eq('status', 'completed')
      .not('analysis_result', 'is', null)
      .limit(1)
      .single();

    let analysisResult;

    if (cachedResult?.analysis_result) {
      console.info('Using cached whitelabel analysis result');
      analysisResult = cachedResult.analysis_result;
    } else {
      // 调用 AI 分析（内置降级策略）
      analysisResult = await analyzeHealthScreening(answers, phase);
    }

    // 更新筛查记录
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
