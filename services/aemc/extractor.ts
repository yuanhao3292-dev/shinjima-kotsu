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
const TIMEOUT_MS = 60_000;

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
      throw new Error('[AI-1 Extractor] Empty response from GPT-4o');
    }

    // 清理可能的 markdown 包裹
    const cleanedContent = content
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();
    const parsed = JSON.parse(cleanedContent) as StructuredCase;

    // 验证关键字段存在
    validateStructuredCase(parsed, casePacket.case_id);

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
// 输出验证
// ============================================================

function validateStructuredCase(result: StructuredCase, caseId: string): void {
  // 确保 case_id 一致
  if (!result.case_id) {
    result.case_id = caseId;
  }

  // 确保关键数组字段不为 undefined
  result.red_flags = result.red_flags || [];
  result.missing_critical_info = result.missing_critical_info || [];
  result.past_history = result.past_history || [];
  result.medication_history = result.medication_history || [];
  result.allergy_history = result.allergy_history || [];
  result.known_diagnoses = result.known_diagnoses || [];
  result.exam_findings = result.exam_findings || [];
  result.inferred_items = result.inferred_items || [];
  result.unknown_items = result.unknown_items || [];

  // 确保 present_illness 结构完整
  if (!result.present_illness) {
    result.present_illness = {
      symptoms: [],
      aggravating_factors: [],
      relieving_factors: [],
      associated_symptoms: [],
    };
  }
  result.present_illness.symptoms = result.present_illness.symptoms || [];
  result.present_illness.aggravating_factors = result.present_illness.aggravating_factors || [];
  result.present_illness.relieving_factors = result.present_illness.relieving_factors || [];
  result.present_illness.associated_symptoms = result.present_illness.associated_symptoms || [];

  if (!result.chief_complaint) {
    result.chief_complaint = '未能提取主诉';
  }

  // 确保 demographics 存在
  result.demographics = result.demographics || {};
  result.language = result.language || 'zh-CN';
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
