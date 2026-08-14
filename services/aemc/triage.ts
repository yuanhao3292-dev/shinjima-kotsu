/**
 * AI-2 分诊判断官 (Gemini 1.5 Pro)
 *
 * 职责：风险分层 + 科室推荐 + 检查建议
 * 模型：Google Gemini 1.5 Pro (via OpenRouter)
 * 核心原则：Rule out worst first
 *
 * 警告：分诊结果直接影响安全闸门判定
 */

import OpenAI from 'openai';
import type { StructuredCase, TriageAssessment, AIRunRecord } from './types';
import { withRetry } from './ai-retry';
import { aemcLog } from './logger';
import { salvageTriageAssessment } from './ai-output-schemas';
import {
  getTriageSystemPrompt,
  buildTriageUserPrompt,
  TRIAGE_PROMPT_VERSION,
} from './prompts/triage-v1';

// ============================================================
// 配置
// ============================================================

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'google/gemini-2.5-flash';
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.3;
const TIMEOUT_MS = 12_000; // 12s — 4 AI sequential, must fit in Vercel 60s limit

// ============================================================
// 主入口
// ============================================================

export interface TriageResult {
  triageAssessment: TriageAssessment;
  runRecord: AIRunRecord;
}

/**
 * 调用 Gemini 1.5 Pro 进行分诊判断
 */
export async function triageCase(
  structuredCase: StructuredCase,
  additionalContext?: string
): Promise<TriageResult> {
  const startTime = Date.now();
  const inputJson = JSON.stringify(structuredCase, null, 2);
  const inputHash = simpleHash(inputJson);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('[AI-2 Triage] OPENROUTER_API_KEY not configured');
  }

  const client = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    timeout: TIMEOUT_MS,
  });

  const systemPrompt = getTriageSystemPrompt(structuredCase.language);
  // 将确定性临床评分注入用户 prompt，让 AI-2 基于客观分数做决策
  const baseUserPrompt = buildTriageUserPrompt(inputJson);
  const userPrompt = additionalContext
    ? baseUserPrompt + additionalContext
    : baseUserPrompt;

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
      { maxRetries: 2, baseDelayMs: 1000, label: 'AI-2 Triage' }
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('[AI-2 Triage] Empty response from Gemini');
    }

    // 某些模型可能返回 markdown 包裹的 JSON
    const cleanedContent = content
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    let parsed: TriageAssessment;
    try {
      parsed = JSON.parse(cleanedContent) as TriageAssessment;
    } catch (parseError) {
      throw new Error(
        `[AI-2 Triage] Invalid JSON from ${MODEL_NAME}: ${cleanedContent.slice(0, 200)}`
      );
    }

    // 验证关键字段
    parsed = salvageTriageAssessment(parsed, structuredCase.case_id);

    const latencyMs = Date.now() - startTime;

    return {
      triageAssessment: parsed,
      runRecord: {
        screening_id: structuredCase.case_id,
        model_vendor: 'google',
        model_name: MODEL_NAME,
        role: 'triage',
        prompt_version: TRIAGE_PROMPT_VERSION,
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
      model_vendor: 'google',
      model_name: MODEL_NAME,
      role: 'triage',
      prompt_version: TRIAGE_PROMPT_VERSION,
      input_hash: inputHash,
      output_json: {},
      latency_ms: latencyMs,
      error: errorMsg,
    };

    throw new TriageError(errorMsg, failedRecord);
  }
}

// ============================================================
// 输出验证
// ============================================================


// ============================================================
// 错误类型
// ============================================================

export class TriageError extends Error {
  public readonly runRecord: AIRunRecord;

  constructor(message: string, runRecord: AIRunRecord) {
    super(message);
    this.name = 'TriageError';
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
