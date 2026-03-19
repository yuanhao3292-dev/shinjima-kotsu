/**
 * AI-5 LLM-as-Judge (Claude Sonnet)
 *
 * 职责：验证 AI-2 分诊 + AI-4 仲裁输出的逻辑一致性
 * 模型：Anthropic Claude Sonnet (via OpenRouter)
 *
 * 设计原则：
 * - 非阻断性：失败时降级（不影响主流程）
 * - 只做验证，不做诊断
 * - 发现逻辑不一致 → 安全闸门升级
 *
 * 警告：此模块的输出会影响安全闸门决策。
 */

import OpenAI from 'openai';
import type {
  StructuredCase,
  TriageAssessment,
  AdjudicatedAssessment,
  JudgeVerdict,
  AIRunRecord,
} from './types';
import { withRetry } from './ai-retry';
import { aemcLog } from './logger';
import {
  getJudgeSystemPrompt,
  buildJudgeUserPrompt,
  JUDGE_PROMPT_VERSION,
} from './prompts/judge-v1';

// ============================================================
// 配置
// ============================================================

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'anthropic/claude-sonnet-4.5';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.1; // 低温度确保一致性
const TIMEOUT_MS = 15_000; // 15s（AI-4 刚用完同模型，OpenRouter 并发限制需要更多余量）

// ============================================================
// 主入口
// ============================================================

export interface JudgeResult {
  judgeVerdict: JudgeVerdict;
  runRecord: AIRunRecord;
}

/**
 * 调用 Claude Sonnet 验证管线输出的逻辑一致性
 */
export async function judgeCase(
  structuredCase: StructuredCase,
  triageAssessment: TriageAssessment,
  adjudicatedAssessment: AdjudicatedAssessment
): Promise<JudgeResult> {
  const startTime = Date.now();
  const structuredJson = JSON.stringify(structuredCase, null, 2);
  const triageJson = JSON.stringify(triageAssessment, null, 2);
  const adjudicatedJson = JSON.stringify(adjudicatedAssessment, null, 2);
  const inputHash = simpleHash(structuredJson + triageJson + adjudicatedJson);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('[AI-5 Judge] OPENROUTER_API_KEY not configured');
  }

  const client = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    timeout: TIMEOUT_MS,
  });

  const systemPrompt = getJudgeSystemPrompt(structuredCase.language);
  const userPrompt = buildJudgeUserPrompt(structuredJson, triageJson, adjudicatedJson);

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
      { maxRetries: 2, baseDelayMs: 1500, label: 'AI-5 Judge' }
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('[AI-5 Judge] Empty response from Claude');
    }

    const cleanedContent = content
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    let parsed: JudgeVerdict;
    try {
      parsed = JSON.parse(cleanedContent) as JudgeVerdict;
    } catch (parseError) {
      throw new Error(
        `[AI-5 Judge] Invalid JSON: ${cleanedContent.slice(0, 200)}`
      );
    }

    validateJudgeVerdict(parsed, structuredCase.case_id);

    const latencyMs = Date.now() - startTime;

    return {
      judgeVerdict: parsed,
      runRecord: {
        screening_id: structuredCase.case_id,
        model_vendor: 'anthropic',
        model_name: MODEL_NAME,
        role: 'judge',
        prompt_version: JUDGE_PROMPT_VERSION,
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
      role: 'judge',
      prompt_version: JUDGE_PROMPT_VERSION,
      input_hash: inputHash,
      output_json: {},
      latency_ms: latencyMs,
      error: errorMsg,
    };

    throw new JudgeError(errorMsg, failedRecord);
  }
}

// ============================================================
// 输出验证
// ============================================================

function validateJudgeVerdict(result: JudgeVerdict, caseId: string): void {
  if (!result.case_id || result.case_id !== caseId) {
    aemcLog.warn('judge', `case_id mismatch: expected=${caseId}, got=${result.case_id || 'missing'}`);
    result.case_id = caseId;
  }

  if (typeof result.is_logically_consistent !== 'boolean') {
    result.is_logically_consistent = false; // fail-safe
  }

  if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
    result.confidence = 0.5;
  }

  if (typeof result.should_escalate !== 'boolean') {
    // fail-safe: if inconsistencies exist, escalate
    result.should_escalate = !result.is_logically_consistent;
  }

  result.inconsistencies = result.inconsistencies || [];
}

// ============================================================
// 错误类型
// ============================================================

export class JudgeError extends Error {
  public readonly runRecord: AIRunRecord;

  constructor(message: string, runRecord: AIRunRecord) {
    super(message);
    this.name = 'JudgeError';
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
