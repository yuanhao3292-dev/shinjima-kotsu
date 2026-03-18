/**
 * Health Screening Report Translation API
 * POST: 将已完成的筛查报告翻译为指定语言
 *
 * 轻量级翻译：使用单次 AI 调用翻译已有分析结果，
 * 不重新运行完整的 AEMC 4-AI Pipeline。
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { HealthScreeningTranslateSchema } from '@/lib/validations/api-schemas';
import { MEDICAL_DISCLAIMERS, type AnalysisResult } from '@/services/aemc/types';

export const maxDuration = 30;

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'openai/gpt-4o-mini';
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.1; // 翻译需要高确定性

const LANGUAGE_NAMES: Record<string, string> = {
  'zh-CN': 'Simplified Chinese',
  'zh-TW': 'Traditional Chinese',
  en: 'English',
  ja: 'Japanese',
};

export async function POST(request: NextRequest) {
  try {
    // 限速
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/health-screening/translate`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '请先登入后再使用此功能' }, { status: 401 });
    }

    const validation = await validateBody(request, HealthScreeningTranslateSchema);
    if (!validation.success) return validation.error;
    const { screeningId, language } = validation.data;

    // 获取已完成的筛查记录
    const { data: screening, error: fetchError } = await supabase
      .from('health_screenings')
      .select('status, analysis_result')
      .eq('id', screeningId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !screening) {
      return NextResponse.json({ error: '找不到该筛查记录' }, { status: 404 });
    }

    if (screening.status !== 'completed') {
      return NextResponse.json({ error: '该筛查尚未完成分析' }, { status: 400 });
    }

    const analysisResult = screening.analysis_result as AnalysisResult;
    if (!analysisResult) {
      return NextResponse.json({ error: '分析结果不存在' }, { status: 404 });
    }

    // 如果目标语言与原报告语言相同，直接返回
    if (analysisResult.language === language) {
      return NextResponse.json({
        success: true,
        analysisResult,
        translated: false,
      });
    }

    // 提取需要翻译的文本
    const textsToTranslate = buildTranslationPayload(analysisResult);

    // 调用 AI 翻译
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('[Translate] OPENROUTER_API_KEY not configured');
      return NextResponse.json({ error: '翻译服务暂时不可用' }, { status: 503 });
    }

    const sourceLang = LANGUAGE_NAMES[analysisResult.language || 'zh-CN'] || 'Chinese';
    const targetLang = LANGUAGE_NAMES[language];

    const client = new OpenAI({
      apiKey,
      baseURL: OPENROUTER_BASE_URL,
      timeout: 20_000,
    });

    const response = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: `You are a medical document translator. Translate the following JSON from ${sourceLang} to ${targetLang}.

Rules:
- Translate ALL string values to ${targetLang}
- Keep JSON keys unchanged (they are in English)
- Preserve medical terminology accuracy
- Keep hospital names in their original language, but add ${targetLang} translation in parentheses if translating to a different language family
- For Japanese hospital names (e.g. "〇〇病院"), keep the original and add translation
- Return ONLY valid JSON, no extra text`,
        },
        {
          role: 'user',
          content: JSON.stringify(textsToTranslate, null, 2),
        },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('[Translate] Empty response from AI');
      return NextResponse.json({ error: '翻译失败，请稍后重试' }, { status: 503 });
    }

    let translatedTexts: Record<string, unknown>;
    try {
      translatedTexts = JSON.parse(content);
    } catch {
      console.error('[Translate] Failed to parse AI response');
      return NextResponse.json({ error: '翻译结果解析失败' }, { status: 503 });
    }

    // 重建翻译后的 analysisResult
    const translatedResult = rebuildAnalysisResult(
      analysisResult,
      translatedTexts,
      language
    );

    return NextResponse.json({
      success: true,
      analysisResult: translatedResult,
      translated: true,
      sourceLanguage: analysisResult.language || 'zh-CN',
      targetLanguage: language,
    });
  } catch (error: unknown) {
    console.warn('Health screening translation request failed');
    return NextResponse.json({ error: '翻译服务暂时不可用，请稍后重试' }, { status: 500 });
  }
}

/**
 * 从 AnalysisResult 中提取需要翻译的文本字段
 */
function buildTranslationPayload(result: AnalysisResult): Record<string, unknown> {
  return {
    riskSummary: result.riskSummary,
    riskFactors: result.riskFactors || [],
    recommendedDepartments: result.recommendedDepartments || [],
    recommendedTests: result.recommendedTests,
    treatmentSuggestions: result.treatmentSuggestions,
    nextSteps: result.nextSteps,
    hospitals: (result.recommendedHospitals || []).map((h) => ({
      name: h.name,
      location: h.location,
      features: h.features,
      suitableFor: h.suitableFor,
    })),
  };
}

/**
 * 用翻译后的文本重建 AnalysisResult
 */
function rebuildAnalysisResult(
  original: AnalysisResult,
  translated: Record<string, unknown>,
  language: string
): AnalysisResult {
  const hospitals = (translated.hospitals as Array<Record<string, unknown>>) || [];

  return {
    ...original,
    riskSummary: (translated.riskSummary as string) || original.riskSummary,
    riskFactors: (translated.riskFactors as string[]) || original.riskFactors,
    recommendedDepartments:
      (translated.recommendedDepartments as string[]) || original.recommendedDepartments,
    recommendedTests: (translated.recommendedTests as string[]) || original.recommendedTests,
    treatmentSuggestions:
      (translated.treatmentSuggestions as string[]) || original.treatmentSuggestions,
    nextSteps: (translated.nextSteps as string[]) || original.nextSteps,
    recommendedHospitals: original.recommendedHospitals.map((h, i) => ({
      ...h,
      name: (hospitals[i]?.name as string) || h.name,
      location: (hospitals[i]?.location as string) || h.location,
      features: (hospitals[i]?.features as string[]) || h.features,
      suitableFor: (hospitals[i]?.suitableFor as string) || h.suitableFor,
    })),
    disclaimer: MEDICAL_DISCLAIMERS[language] || MEDICAL_DISCLAIMERS['zh-CN'],
    language: language as AnalysisResult['language'],
  };
}
