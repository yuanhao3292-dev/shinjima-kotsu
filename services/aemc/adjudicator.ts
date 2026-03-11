/**
 * AI-4 质控仲裁官 (Claude Sonnet)
 *
 * 职责：全链路一致性审查 + 最终裁决
 * 模型：Anthropic Claude Sonnet (via OpenRouter)
 * 核心原则：有疑问就升级人工
 *
 * 警告：仲裁官是 AI 链的最后一环，输出直接影响安全闸门
 */

import OpenAI from 'openai';
import type {
  StructuredCase,
  TriageAssessment,
  ChallengeReview,
  AdjudicatedAssessment,
  AIRunRecord,
} from './types';
import {
  getAdjudicatorSystemPrompt,
  buildAdjudicatorUserPrompt,
  ADJUDICATOR_PROMPT_VERSION,
} from './prompts/adjudicator-v1';

// ============================================================
// 配置
// ============================================================

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'anthropic/claude-sonnet-4.5';
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.2;
const TIMEOUT_MS = 12_000; // 12s — 4 AI sequential, must fit in Vercel 60s limit

// ============================================================
// 主入口
// ============================================================

export interface AdjudicatorResult {
  adjudicatedAssessment: AdjudicatedAssessment;
  runRecord: AIRunRecord;
}

/**
 * 调用 Claude Sonnet 进行质控仲裁
 */
export async function adjudicateCase(
  structuredCase: StructuredCase,
  triageAssessment: TriageAssessment,
  challengeReview?: ChallengeReview
): Promise<AdjudicatorResult> {
  const startTime = Date.now();
  const structuredJson = JSON.stringify(structuredCase, null, 2);
  const triageJson = JSON.stringify(triageAssessment, null, 2);
  const challengeJson = challengeReview
    ? JSON.stringify(challengeReview, null, 2)
    : undefined;
  const inputHash = simpleHash(structuredJson + triageJson + (challengeJson || ''));

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('[AI-4 Adjudicator] OPENROUTER_API_KEY not configured');
  }

  const client = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    timeout: TIMEOUT_MS,
  });

  const systemPrompt = getAdjudicatorSystemPrompt(structuredCase.language);
  const userPrompt = buildAdjudicatorUserPrompt(
    structuredJson,
    triageJson,
    challengeJson
  );

  try {
    const response = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('[AI-4 Adjudicator] Empty response from Claude');
    }

    // Claude 可能返回 markdown 包裹的 JSON
    const cleanedContent = content
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    let parsed: AdjudicatedAssessment;
    try {
      parsed = JSON.parse(cleanedContent) as AdjudicatedAssessment;
    } catch (parseError) {
      throw new Error(
        `[AI-4 Adjudicator] Invalid JSON from ${MODEL_NAME}: ${cleanedContent.slice(0, 200)}`
      );
    }

    // 验证关键字段
    validateAdjudicatedAssessment(parsed, structuredCase.case_id);

    const latencyMs = Date.now() - startTime;

    return {
      adjudicatedAssessment: parsed,
      runRecord: {
        screening_id: structuredCase.case_id,
        model_vendor: 'anthropic',
        model_name: MODEL_NAME,
        role: 'adjudicator',
        prompt_version: ADJUDICATOR_PROMPT_VERSION,
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
      model_vendor: 'anthropic',
      model_name: MODEL_NAME,
      role: 'adjudicator',
      prompt_version: ADJUDICATOR_PROMPT_VERSION,
      input_hash: inputHash,
      output_json: {},
      latency_ms: latencyMs,
      error: errorMsg,
    };

    throw new AdjudicatorError(errorMsg, failedRecord);
  }
}

// ============================================================
// 输出验证
// ============================================================

function validateAdjudicatedAssessment(
  result: AdjudicatedAssessment,
  caseId: string
): void {
  if (!result.case_id || result.case_id !== caseId) {
    console.warn(`[AI-4 Adjudicator] case_id mismatch: expected=${caseId}, got=${result.case_id || 'missing'}`);
    result.case_id = caseId;
  }

  // 验证 final_risk_level
  const validLevels = ['low', 'medium', 'high', 'emergency'];
  if (!validLevels.includes(result.final_risk_level)) {
    // fail-safe: 未知等级视为 high
    result.final_risk_level = 'high';
  }

  // 确保 confidence 在 0-1 范围
  if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
    console.warn(`[AI-4 Adjudicator] Invalid confidence (type=${typeof result.confidence}, value=${result.confidence}), defaulting to 0.5`);
    result.confidence = 0.5;
  }

  // fail-safe: 布尔字段默认偏向保守
  result.safe_to_auto_display = result.safe_to_auto_display ?? false;
  result.escalate_to_human = result.escalate_to_human ?? true;

  // 确保字符串字段不为 undefined
  result.final_summary = result.final_summary || '仲裁官未能生成摘要';
  result.escalation_reason = result.escalation_reason || '';

  // 确保数组字段不为 undefined
  result.final_departments = result.final_departments || [];
  result.critical_reasons = result.critical_reasons || [];
  result.must_ask_followups = result.must_ask_followups || [];
  result.conflict_notes = result.conflict_notes || [];
}

// ============================================================
// 错误类型
// ============================================================

export class AdjudicatorError extends Error {
  public readonly runRecord: AIRunRecord;

  constructor(message: string, runRecord: AIRunRecord) {
    super(message);
    this.name = 'AdjudicatorError';
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
