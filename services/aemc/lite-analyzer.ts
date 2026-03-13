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

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'openai/gpt-4o-mini';
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.2;
const TIMEOUT_MS = 9_000; // Vercel Hobby 10s 限制，留 1s 给其他逻辑

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

  const client = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    timeout: TIMEOUT_MS,
  });

  const response = await client.chat.completions.create({
    model: MODEL_NAME,
    messages: [
      { role: 'system', content: getSystemPrompt(casePacket.language) },
      {
        role: 'user',
        content: `Analyze this patient case:\n\n---PATIENT DATA START---\n${inputJson}\n---PATIENT DATA END---\n\nReturn ONLY the JSON object.`,
      },
    ],
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('[Lite Analyzer] Empty response');
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

  // 确保 case_id 一致
  const caseId = casePacket.case_id;
  const sc = parsed.structured_case;
  const ta = parsed.triage_assessment;
  const aa = parsed.adjudicated_assessment;

  sc.case_id = caseId;
  sc.language = sc.language || casePacket.language;
  sc.red_flags = sc.red_flags || [];
  sc.missing_critical_info = sc.missing_critical_info || [];
  sc.past_history = sc.past_history || [];
  sc.medication_history = sc.medication_history || [];
  sc.allergy_history = sc.allergy_history || [];
  sc.known_diagnoses = sc.known_diagnoses || [];
  sc.exam_findings = sc.exam_findings || [];
  sc.inferred_items = sc.inferred_items || [];
  sc.unknown_items = sc.unknown_items || [];
  sc.demographics = sc.demographics || {};
  if (!sc.present_illness) {
    sc.present_illness = { symptoms: [], aggravating_factors: [], relieving_factors: [], associated_symptoms: [] };
  }
  sc.present_illness.symptoms = sc.present_illness.symptoms || [];
  if (!sc.chief_complaint) {
    const fallbacks: Record<string, string> = {
      'zh-CN': '未能提取主诉', 'zh-TW': '未能提取主訴',
      ja: '主訴を抽出できませんでした', en: 'Unable to extract chief complaint',
    };
    sc.chief_complaint = fallbacks[casePacket.language] || fallbacks['zh-CN'];
  }

  ta.case_id = caseId;
  ta.recommended_departments = ta.recommended_departments || [];
  ta.differential_directions = ta.differential_directions || [];
  ta.suggested_tests = ta.suggested_tests || [];
  ta.do_not_miss_conditions = ta.do_not_miss_conditions || [];
  ta.missing_information_impact = ta.missing_information_impact || [];
  ta.needs_emergency_evaluation = ta.needs_emergency_evaluation ?? false;
  ta.doctor_review_required = ta.doctor_review_required ?? true;
  if (typeof ta.confidence !== 'number' || ta.confidence < 0 || ta.confidence > 1) ta.confidence = 0.5;

  aa.case_id = caseId;
  aa.final_departments = aa.final_departments || [];
  aa.critical_reasons = aa.critical_reasons || [];
  aa.must_ask_followups = aa.must_ask_followups || [];
  aa.conflict_notes = aa.conflict_notes || [];
  aa.safe_to_auto_display = aa.safe_to_auto_display ?? false;
  aa.escalate_to_human = aa.escalate_to_human ?? true;
  if (typeof aa.confidence !== 'number' || aa.confidence < 0 || aa.confidence > 1) aa.confidence = 0.5;

  const latencyMs = Date.now() - startTime;

  return {
    structuredCase: sc,
    triageAssessment: ta,
    adjudicatedAssessment: aa,
    runRecord: {
      screening_id: casePacket.metadata.screening_id,
      model_vendor: 'openai',
      model_name: MODEL_NAME,
      role: 'adjudicator', // 一站式角色，记录为 adjudicator
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
