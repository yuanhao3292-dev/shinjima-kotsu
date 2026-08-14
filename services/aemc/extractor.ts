/**
 * AI-1 病历抽取官 (GPT-4o)
 *
 * 职责：将 CasePacket 转为 StructuredCase
 * 模型：OpenAI GPT-4o (via OpenRouter)
 * 核心原则：宁可漏，不可编
 *
 * 警告：此模块的输出是后续所有 AI 的数据基础，准确性至关重要
 */

import OpenAI from 'openai';
import type { CasePacket, StructuredCase, AIRunRecord } from './types';
import { withRetry } from './ai-retry';
import { aemcLog } from './logger';
import { salvageStructuredCase } from './ai-output-schemas';
import {
  getExtractorSystemPrompt,
  buildExtractorUserPrompt,
  EXTRACTOR_PROMPT_VERSION,
} from './prompts/extractor-v1';

// ============================================================
// 配置
// ============================================================

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'openai/gpt-4o';
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.2; // 低温度 = 更精确的抽取
const TIMEOUT_MS = 12_000; // 12s — 4 AI sequential, must fit in Vercel 60s limit

// ============================================================
// 主入口
// ============================================================

export interface ExtractorResult {
  structuredCase: StructuredCase;
  runRecord: AIRunRecord;
}

/**
 * 调用 GPT-4o 进行病历抽取
 */
export async function extractCase(
  casePacket: CasePacket
): Promise<ExtractorResult> {
  const startTime = Date.now();
  const inputJson = JSON.stringify(casePacket, null, 2);
  const inputHash = simpleHash(inputJson);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('[AI-1 Extractor] OPENROUTER_API_KEY not configured');
  }

  const client = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    timeout: TIMEOUT_MS,
  });

  const systemPrompt = getExtractorSystemPrompt(casePacket.language);
  const userPrompt = buildExtractorUserPrompt(inputJson);

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
      { maxRetries: 2, baseDelayMs: 1000, label: 'AI-1 Extractor' }
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('[AI-1 Extractor] Empty response from GPT-4o');
    }

    // 清理可能的 markdown 包裹
    const cleanedContent = content
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();
    let parsed: StructuredCase;
    try {
      parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
      throw new Error(
        `[AI-1 Extractor] Invalid JSON from ${MODEL_NAME}: ${cleanedContent.slice(0, 200)}`
      );
    }

    // Zod 挽救层：类型安全兜底（替代旧 validateStructuredCase 的手工 || [] 默认）
    parsed = salvageStructuredCase(parsed, casePacket.case_id, casePacket.language);

    const latencyMs = Date.now() - startTime;

    return {
      structuredCase: parsed,
      runRecord: {
        screening_id: casePacket.metadata.screening_id,
        model_vendor: 'openai',
        model_name: MODEL_NAME,
        role: 'extractor',
        prompt_version: EXTRACTOR_PROMPT_VERSION,
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

    // 记录失败的 run
    const failedRecord: AIRunRecord = {
      screening_id: casePacket.metadata.screening_id,
      model_vendor: 'openai',
      model_name: MODEL_NAME,
      role: 'extractor',
      prompt_version: EXTRACTOR_PROMPT_VERSION,
      input_hash: inputHash,
      output_json: {},
      latency_ms: latencyMs,
      error: errorMsg,
    };

    throw new ExtractorError(errorMsg, failedRecord);
  }
}


// ============================================================
// 错误类型
// ============================================================

export class ExtractorError extends Error {
  public readonly runRecord: AIRunRecord;

  constructor(message: string, runRecord: AIRunRecord) {
    super(message);
    this.name = 'ExtractorError';
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
