/**
 * AI 输出挽救层（Zod）
 *
 * 背景：extractor / triage / adjudicator / lite-analyzer 原本各自用
 * `x = x || []`、`x = x ?? true` 式手工兜底。这能防「字段缺失」，
 * 防不住「类型错误」——例如 AI 把 red_flags 返回成一个字符串，
 * `|| []` 会原样放行，下游的安全闸门（最后一道防线）随即崩溃或误判。
 *
 * 原则（与既有兜底约定完全一致，只是升级为类型安全）：
 * - 宁可挽救，不可丢弃：字符串 → 单元素数组；对象数组里的字符串项 → 包装成对象
 * - fail-safe 偏保守：无效风险等级 → 'high'（沿用全管线既有约定）；
 *   safe_to_auto_display → false；escalate_to_human / doctor_review_required → true
 * - 布尔字段先做 "true"/"yes"/1 等宽松归一，再判布尔 ——
 *   直接 .catch(false) 会把 AI 返回的字符串 "true" 吞成 false，丢失急症升级信号
 * - case_id / language 一律以服务端上下文为准，不信 AI 回显
 */

import { z } from 'zod';
import type {
  StructuredCase,
  TriageAssessment,
  AdjudicatedAssessment,
} from './types';
import { aemcLog } from './logger';

// ============================================================
// 基础挽救原语
// ============================================================

/** 任意值 → string[]。字符串包装为单元素；数组内非字符串项转 JSON 保留信息。 */
function coerceStringArray(v: unknown): string[] {
  if (typeof v === 'string') return v.trim() ? [v.trim()] : [];
  if (Array.isArray(v)) {
    return v
      .map((x) => {
        if (typeof x === 'string') return x;
        if (x == null) return '';
        if (typeof x === 'object') {
          // AI 偶尔把 string[] 升格成 {name, ...}[] —— 取常见文本字段，否则整体序列化
          const o = x as Record<string, unknown>;
          const text = o.name ?? o.description ?? o.text ?? o.item;
          return typeof text === 'string' ? text : JSON.stringify(x);
        }
        return String(x);
      })
      .filter(Boolean);
  }
  return [];
}
const zStrArray = z.preprocess(coerceStringArray, z.array(z.string()));

const zStr = (fallback = '') => z.preprocess(
  (v) => (typeof v === 'string' ? v : v == null ? undefined : String(v)),
  z.string()
).catch(fallback);

/** 宽松布尔："true"/"yes"/"1"/非零数字 → true；无法判定 → def（按保守方向选） */
const zBool = (def: boolean) => z.preprocess((v) => {
  if (typeof v === 'string') {
    const s = v.toLowerCase().trim();
    if (['true', 'yes', 'y', '1'].includes(s)) return true;
    if (['false', 'no', 'n', '0'].includes(s)) return false;
  }
  if (typeof v === 'number') return v !== 0;
  return v;
}, z.boolean()).catch(def);

const zConfidence = z.number().min(0).max(1).catch(0.5);

/** 风险等级：先小写归一（"HIGH"/"Emergency " 可被救回），无效 → 'high'（沿用既有 fail-safe） */
const zUrgency = z.preprocess(
  (v) => (typeof v === 'string' ? v.toLowerCase().trim() : v),
  z.enum(['low', 'medium', 'high', 'emergency'])
).catch('high');

// ============================================================
// StructuredCase
// ============================================================

const zSymptom = z.preprocess(
  // AI 偶尔把症状数组返回成 string[]
  (v) => (typeof v === 'string' ? { name: v } : v),
  z.object({
    name: zStr(),
    duration: zStr(),
    severity: zStr(),
    certainty: z.preprocess(
      (v) => (typeof v === 'string' ? v.toLowerCase().trim() : v),
      z.enum(['explicit', 'inferred', 'unknown'])
    ).catch('unknown'),
    evidence: zStr(),
  })
);

const zInferredItem = z.preprocess(
  (v) => (typeof v === 'string' ? { item: v, reason: '' } : v),
  z.object({ item: zStr(), reason: zStr() })
);

const zObjArray = <T extends z.ZodTypeAny>(item: T) => z.preprocess(
  (v) => (Array.isArray(v) ? v : v == null ? [] : [v]),
  z.array(item.catch(undefined as never)).transform((a) => a.filter((x) => x !== undefined))
);

const CHIEF_COMPLAINT_FALLBACK: Record<string, string> = {
  'zh-CN': '未能提取主诉', 'zh-TW': '未能提取主訴',
  ja: '主訴を抽出できませんでした', en: 'Unable to extract chief complaint',
};

const StructuredCaseSchema = z.object({
  demographics: z.object({
    age: z.coerce.number().int().min(0).max(130).optional().catch(undefined),
    sex: z.preprocess(
      (v) => (typeof v === 'string' ? v.toLowerCase().trim() : v),
      z.enum(['male', 'female'])
    ).optional().catch(undefined),
    country: z.string().optional().catch(undefined),
  }).catch({}),
  chief_complaint: zStr(),
  present_illness: z.object({
    symptoms: zObjArray(zSymptom).catch([]),
    aggravating_factors: zStrArray,
    relieving_factors: zStrArray,
    associated_symptoms: zStrArray,
  }).catch({ symptoms: [], aggravating_factors: [], relieving_factors: [], associated_symptoms: [] }),
  past_history: zStrArray,
  medication_history: zStrArray,
  allergy_history: zStrArray,
  known_diagnoses: zStrArray,
  exam_findings: zStrArray,
  red_flags: zStrArray,
  missing_critical_info: zStrArray,
  inferred_items: zObjArray(zInferredItem).catch([]),
  unknown_items: zStrArray,
});

export function salvageStructuredCase(
  raw: unknown,
  caseId: string,
  language: StructuredCase['language']
): StructuredCase {
  const rawCaseId = (raw as Record<string, unknown> | null)?.case_id;
  if (rawCaseId !== caseId) {
    aemcLog.warn('ai-output-schema', `StructuredCase case_id mismatch: expected=${caseId}, got=${String(rawCaseId ?? 'missing')}`);
  }
  const parsed = StructuredCaseSchema.parse(raw ?? {});
  return {
    ...parsed,
    case_id: caseId,
    language,
    chief_complaint: parsed.chief_complaint || CHIEF_COMPLAINT_FALLBACK[language] || CHIEF_COMPLAINT_FALLBACK['zh-CN'],
  };
}

// ============================================================
// TriageAssessment
// ============================================================

const zDifferential = z.preprocess(
  (v) => (typeof v === 'string' ? { name: v, likelihood: '', reason: '' } : v),
  z.object({ name: zStr(), likelihood: zStr(), reason: zStr() })
);

const TriageAssessmentSchema = z.object({
  urgency_level: zUrgency,
  recommended_departments: zStrArray,
  differential_directions: zObjArray(zDifferential).catch([]),
  suggested_tests: zStrArray,
  needs_emergency_evaluation: zBool(false),
  doctor_review_required: zBool(true),
  confidence: zConfidence,
  reasoning_summary: zStr('无法生成推理摘要'),
  do_not_miss_conditions: zStrArray,
  missing_information_impact: zStrArray,
});

export function salvageTriageAssessment(raw: unknown, caseId: string): TriageAssessment {
  const parsed = TriageAssessmentSchema.parse(raw ?? {});
  return { ...parsed, case_id: caseId };
}

// ============================================================
// AdjudicatedAssessment
// ============================================================

const AdjudicatedAssessmentSchema = z.object({
  final_risk_level: zUrgency,
  final_departments: zStrArray,
  final_summary: zStr('仲裁官未能生成摘要'),
  critical_reasons: zStrArray,
  must_ask_followups: zStrArray,
  safe_to_auto_display: zBool(false),
  escalate_to_human: zBool(true),
  escalation_reason: zStr(),
  confidence: zConfidence,
  conflict_notes: zStrArray,
});

export function salvageAdjudicatedAssessment(raw: unknown, caseId: string): AdjudicatedAssessment {
  const parsed = AdjudicatedAssessmentSchema.parse(raw ?? {});
  return { ...parsed, case_id: caseId };
}
