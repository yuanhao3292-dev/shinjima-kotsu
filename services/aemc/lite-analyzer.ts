/**
 * AEMC V3 Lite — 单次 AI 调用快速分析
 *
 * 用于 Vercel Hobby 计划（10秒超时）环境。
 * 将抽取、分诊、仲裁合并为一次 GPT-4o-mini 调用，
 * 输出与完整管线兼容的 StructuredCase + TriageAssessment + AdjudicatedAssessment。
 *
 * 耗时：约 3-6 秒（单次 API 调用）
 */

import OpenAI from 'openai';
import type {
  CasePacket,
  StructuredCase,
  TriageAssessment,
  AdjudicatedAssessment,
  AIRunRecord,
} from './types';
import { withRetry } from './ai-retry';
import { aemcLog } from './logger';
import { salvageStructuredCase, salvageTriageAssessment, salvageAdjudicatedAssessment } from './ai-output-schemas';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';
const MODEL_NAME = 'openai/gpt-4o-mini';
const FALLBACK_MODEL_NAME = 'deepseek-chat';
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.2;
const TIMEOUT_MS = 9_000; // Vercel Hobby 10s 限制，留 1s 给其他逻辑
const FALLBACK_TIMEOUT_MS = 8_000;

export const LITE_PROMPT_VERSION = 'lite-v1.0';

export interface LiteAnalysisResult {
  structuredCase: StructuredCase;
  triageAssessment: TriageAssessment;
  adjudicatedAssessment: AdjudicatedAssessment;
  runRecord: AIRunRecord;
}

function getSystemPrompt(language: string): string {
  return `You are a medical screening AI performing a combined extraction, triage, and assessment in a single pass.

## YOUR TASK
Given patient questionnaire data, produce a structured JSON with THREE sections:
1. "structured_case" — Extract patient symptoms, history, demographics from the raw data
2. "triage_assessment" — Risk-stratify and recommend departments/tests
3. "adjudicated_assessment" — Final risk level and summary

## CRITICAL RULES
- "宁可漏，不可编" — Never fabricate medical data. Mark unknowns honestly.
- Identify ALL red flags (dangerous symptom patterns)
- Default to conservative risk assessment (err on the side of caution)
- All output text must be in: ${language}

## OUTPUT FORMAT (JSON only, no markdown):

{
  "structured_case": {
    "case_id": "<from input>",
    "language": "${language}",
    "demographics": { "age": null, "sex": null, "country": null },
    "chief_complaint": "<one-sentence main concern>",
    "present_illness": {
      "symptoms": [{ "name": "", "duration": "", "severity": "", "certainty": "explicit|inferred|unknown", "evidence": "" }],
      "aggravating_factors": [],
      "relieving_factors": [],
      "associated_symptoms": []
    },
    "past_history": [],
    "medication_history": [],
    "allergy_history": [],
    "known_diagnoses": [],
    "exam_findings": [],
    "red_flags": [],
    "missing_critical_info": [],
    "inferred_items": [{ "item": "", "reason": "" }],
    "unknown_items": []
  },
  "triage_assessment": {
    "case_id": "<from input>",
    "urgency_level": "low|medium|high|emergency",
    "recommended_departments": [],
    "differential_directions": [{ "name": "", "likelihood": "low|medium|high", "reason": "" }],
    "suggested_tests": [],
    "needs_emergency_evaluation": false,
    "doctor_review_required": true,
    "confidence": 0.7,
    "reasoning_summary": "",
    "do_not_miss_conditions": [],
    "missing_information_impact": []
  },
  "adjudicated_assessment": {
    "case_id": "<from input>",
    "final_risk_level": "low|medium|high|emergency",
    "final_departments": [],
    "final_summary": "<2-4 sentence medical summary>",
    "critical_reasons": [],
    "must_ask_followups": [],
    "safe_to_auto_display": true,
    "escalate_to_human": false,
    "escalation_reason": "",
    "confidence": 0.7,
    "conflict_notes": []
  }
}`;
}

export async function runLiteAnalysis(
  casePacket: CasePacket
): Promise<LiteAnalysisResult> {
  const startTime = Date.now();
  const inputJson = JSON.stringify(casePacket, null, 2);
  const inputHash = simpleHash(inputJson);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('[Lite Analyzer] OPENROUTER_API_KEY not configured');
  }

  const systemPrompt = getSystemPrompt(casePacket.language);
  const userPrompt = `Analyze this patient case:\n\n---PATIENT DATA START---\n${inputJson}\n---PATIENT DATA END---\n\nReturn ONLY the JSON object.`;
  const messages: { role: 'system' | 'user'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  // 是否有 DeepSeek 备选
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const hasFallback = !!deepseekKey;
  // 有 fallback 时缩短主调用超时，为 fallback 留时间
  const primaryTimeout = hasFallback ? 6_000 : TIMEOUT_MS;

  // Primary: OpenRouter GPT-4o-mini
  try {
    return await callAndParse(
      { apiKey, baseURL: OPENROUTER_BASE_URL, timeout: primaryTimeout },
      MODEL_NAME, messages, casePacket, inputHash, startTime, 'openai',
      { maxRetries: 1, baseDelayMs: 500, label: 'V3 Lite' }
    );
  } catch (primaryError) {
    if (!hasFallback) throw primaryError;

    aemcLog.warn('lite-analyzer', 'Primary (OpenRouter) failed, falling back to DeepSeek', {
      error: primaryError instanceof Error ? primaryError.message : String(primaryError),
    });

    // Fallback: DeepSeek V3 直连（不经 OpenRouter）
    try {
      return await callAndParse(
        { apiKey: deepseekKey!, baseURL: DEEPSEEK_BASE_URL, timeout: FALLBACK_TIMEOUT_MS },
        FALLBACK_MODEL_NAME, messages, casePacket, inputHash, startTime, 'deepseek',
        { maxRetries: 0, label: 'V3 Lite-Fallback' }
      );
    } catch {
      // Fallback 也失败，抛出原始错误（更有诊断价值）
      throw primaryError;
    }
  }
}

/**
 * 调用 LLM 并解析响应为 LiteAnalysisResult
 */
async function callAndParse(
  clientConfig: { apiKey: string; baseURL: string; timeout: number },
  modelName: string,
  messages: { role: 'system' | 'user'; content: string }[],
  casePacket: CasePacket,
  inputHash: string,
  startTime: number,
  vendor: AIRunRecord['model_vendor'],
  retryOptions: { maxRetries: number; baseDelayMs?: number; label: string }
): Promise<LiteAnalysisResult> {
  const client = new OpenAI({
    apiKey: clientConfig.apiKey,
    baseURL: clientConfig.baseURL,
    timeout: clientConfig.timeout,
  });

  const response = await withRetry(
    () => client.chat.completions.create({
      model: modelName,
      messages,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' },
    }),
    retryOptions
  );

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`[Lite Analyzer] Empty response from ${modelName}`);
  }

  const cleanedContent = content
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  const parsed = JSON.parse(cleanedContent) as {
    structured_case: StructuredCase;
    triage_assessment: TriageAssessment;
    adjudicated_assessment: AdjudicatedAssessment;
  };

  // Zod 挽救层：类型安全兜底（防字段缺失也防类型错误，
  // 旧手工 || [] 默认防不住 AI 把数组字段返回成字符串）
  const caseId = casePacket.case_id;
  const sc = salvageStructuredCase(parsed.structured_case, caseId, casePacket.language);
  const ta = salvageTriageAssessment(parsed.triage_assessment, caseId);
  const aa = salvageAdjudicatedAssessment(parsed.adjudicated_assessment, caseId);

  const latencyMs = Date.now() - startTime;

  return {
    structuredCase: sc,
    triageAssessment: ta,
    adjudicatedAssessment: aa,
    runRecord: {
      screening_id: casePacket.metadata.screening_id,
      model_vendor: vendor,
      model_name: modelName,
      role: 'adjudicator',
      prompt_version: LITE_PROMPT_VERSION,
      input_hash: inputHash,
      output_json: parsed as unknown as Record<string, unknown>,
      latency_ms: latencyMs,
      input_tokens: response.usage?.prompt_tokens,
      output_tokens: response.usage?.completion_tokens,
    },
  };
}

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
