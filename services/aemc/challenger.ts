/**
 * AI-3 反方挑战官 (Grok-3)
 *
 * 职责：Devil's Advocate — 专门找 AI-2 分诊的漏洞
 * 模型：xAI Grok-3 (via OpenRouter)
 * 核心原则：宁可多疑，不可遗漏
 *
 * 警告：挑战官的输出直接影响仲裁官的最终裁决
 */

import OpenAI from 'openai';
import type {
  StructuredCase,
  TriageAssessment,
  ChallengeReview,
  AIRunRecord,
} from './types';
import { withRetry } from './ai-retry';
import { aemcLog } from './logger';
import {
  getChallengerSystemPrompt,
  buildChallengerUserPrompt,
  CHALLENGER_PROMPT_VERSION,
} from './prompts/challenger-v1';

// ============================================================
// 配置
// ============================================================

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'x-ai/grok-3';
const MAX_TOKENS = 3000;
const TEMPERATURE = 0.4; // 稍高温度 = 更发散的挑战思维
const TIMEOUT_MS = 12_000; // 12s — 4 AI sequential, must fit in Vercel 60s limit

// ============================================================
// 主入口
// ============================================================

export interface ChallengerResult {
  challengeReview: ChallengeReview;
  runRecord: AIRunRecord;
}

/**
 * 调用 Grok-3 进行反方挑战
 */
export async function challengeCase(
  structuredCase: StructuredCase,
  triageAssessment?: TriageAssessment
): Promise<ChallengerResult> {
  const startTime = Date.now();
  const structuredJson = JSON.stringify(structuredCase, null, 2);
  const triageJson = triageAssessment
    ? JSON.stringify(triageAssessment, null, 2)
    : undefined;
  const inputHash = simpleHash(structuredJson + (triageJson || ''));

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('[AI-3 Challenger] OPENROUTER_API_KEY not configured');
  }

  const client = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    timeout: TIMEOUT_MS,
  });

  const systemPrompt = getChallengerSystemPrompt(structuredCase.language);
  const userPrompt = triageJson
    ? buildChallengerUserPrompt(structuredJson, triageJson)
    : buildChallengerUserPrompt(structuredJson);

  try {
    const response = await withRetry(
      () => client.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        response_format: { type: 'json_object' },
      }),
      { maxRetries: 1, baseDelayMs: 1000, label: 'AI-3 Challenger' }
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('[AI-3 Challenger] Empty response from Grok-3');
    }

    // 清理可能的 markdown 包裹
    const cleanedContent = content
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();
    let parsed: ChallengeReview;
    try {
      parsed = JSON.parse(cleanedContent) as ChallengeReview;
    } catch (parseError) {
      throw new Error(
        `[AI-3 Challenger] Invalid JSON from ${MODEL_NAME}: ${cleanedContent.slice(0, 200)}`
      );
    }

    // 验证关键字段
    validateChallengeReview(parsed, structuredCase.case_id);

    const latencyMs = Date.now() - startTime;

    return {
      challengeReview: parsed,
      runRecord: {
        screening_id: structuredCase.case_id,
        model_vendor: 'xai',
        model_name: MODEL_NAME,
        role: 'challenger',
        prompt_version: CHALLENGER_PROMPT_VERSION,
        input_hash: inputHash,
        output_json: parsed as unknown as Record<string, unknown>,
        latency_ms: latencyMs,
        input_tokens: response.usage?.prompt_tokens,
        output_tokens: response.usage?.completion_tokens,
      },
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : String(error);

    const failedRecord: AIRunRecord = {
      screening_id: structuredCase.case_id,
      model_vendor: 'xai',
      model_name: MODEL_NAME,
      role: 'challenger',
      prompt_version: CHALLENGER_PROMPT_VERSION,
      input_hash: inputHash,
      output_json: {},
      latency_ms: latencyMs,
      error: errorMsg,
    };

    throw new ChallengerError(errorMsg, failedRecord);
  }
}

// ============================================================
// 输出验证
// ============================================================

function validateChallengeReview(
  result: ChallengeReview,
  caseId: string
): void {
  if (!result.case_id || result.case_id !== caseId) {
    aemcLog.warn('challenger', `case_id mismatch: expected=${caseId}, got=${result.case_id || 'missing'}`);
    result.case_id = caseId;
  }

  // 确保 confidence 在 0-1 范围
  if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
    aemcLog.warn('challenger', `Invalid confidence (type=${typeof result.confidence}, value=${result.confidence}), defaulting to 0.5`);
    result.confidence = 0.5;
  }

  // fail-safe: 布尔字段默认偏向保守（有疑问 = under-triage）
  result.under_triage_risk = result.under_triage_risk ?? true;
  result.over_triage_risk = result.over_triage_risk ?? false;
  result.recommended_escalation = result.recommended_escalation ?? false;

  // 确保数组字段不为 undefined
  result.main_concerns = result.main_concerns || [];
  result.alternative_risks = (result.alternative_risks || []).filter(
    (r) => r && typeof r.name === 'string' && typeof r.reason === 'string'
  );
  result.missing_high_impact_data = result.missing_high_impact_data || [];
}

// ============================================================
// 错误类型
// ============================================================

export class ChallengerError extends Error {
  public readonly runRecord: AIRunRecord;

  constructor(message: string, runRecord: AIRunRecord) {
    super(message);
    this.name = 'ChallengerError';
    this.runRecord = runRecord;
  }
}

// ============================================================
// 工具函数
// ============================================================

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
