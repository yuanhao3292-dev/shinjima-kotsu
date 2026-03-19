/**
 * AEMC Pipeline 持久化模块
 *
 * 将 AI 调用记录和仲裁结果写入数据库。
 * 用途：审计追溯 + 成本分析 + 安全监控
 *
 * 设计原则：
 * - 持久化失败 **绝不** 阻断主流程（fire-and-forget + 错误日志）
 * - 使用 service role 客户端（绕过 RLS）
 * - 批量插入 AI runs 以减少 DB 往返
 */

import { getSupabaseAdmin } from '@/lib/supabase/api';
import type { AEMCPipelineResult, AIRunRecord, StructuredCase } from './types';
import { aemcLog } from './logger';

// ============================================================
// 主入口：一次性持久化整个 Pipeline 结果
// ============================================================

/**
 * 持久化完整 pipeline 结果（AI runs + 仲裁记录 + 医院匹配）
 *
 * 调用方无需 await（fire-and-forget），但建议 await 以确保审计完整性。
 * 任何持久化错误都只会 aemcLog.warn，不会 throw。
 */
export async function persistPipelineResults(
  pipelineResult: AEMCPipelineResult,
  screeningType: 'authenticated' | 'whitelabel'
): Promise<void> {
  // 并行执行持久化操作
  await Promise.all([
    persistAIRuns(pipelineResult.ai_runs, screeningType),
    persistAdjudication(pipelineResult, screeningType),
    persistHospitalMatches(pipelineResult, screeningType),
    persistStructuredCase(pipelineResult, screeningType),
  ]);
}

// ============================================================
// AI 调用记录持久化
// ============================================================

/**
 * 批量插入所有 AI 调用记录到 screening_ai_runs
 */
async function persistAIRuns(
  runs: AIRunRecord[],
  screeningType: 'authenticated' | 'whitelabel'
): Promise<void> {
  if (runs.length === 0) return;

  try {
    const supabase = getSupabaseAdmin();

    const rows = runs.map((run) => ({
      screening_id: run.screening_id,
      screening_type: screeningType,
      model_vendor: run.model_vendor,
      model_name: run.model_name,
      role: run.role,
      prompt_version: run.prompt_version,
      input_hash: run.input_hash,
      output_json: run.output_json,
      latency_ms: run.latency_ms,
      input_tokens: run.input_tokens ?? null,
      output_tokens: run.output_tokens ?? null,
      error: run.error ?? null,
    }));

    const { error } = await supabase
      .from('screening_ai_runs')
      .insert(rows);

    if (error) {
      aemcLog.warn('persistence', 'Failed to insert AI runs', { error: error.message });
    }
  } catch (err) {
    aemcLog.warn('persistence', 'AI runs persistence error', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// ============================================================
// 仲裁结果持久化
// ============================================================

/**
 * 插入一条仲裁记录到 screening_adjudications
 */
async function persistAdjudication(
  pipeline: AEMCPipelineResult,
  screeningType: 'authenticated' | 'whitelabel'
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const adj = pipeline.adjudicated_assessment;
    const gate = pipeline.safety_gate;

    const row = {
      screening_id: pipeline.case_id,
      screening_type: screeningType,
      pipeline_version: pipeline.pipeline_version,
      // 仲裁结果
      final_risk_level: adj.final_risk_level,
      final_departments: adj.final_departments,
      final_summary: adj.final_summary,
      critical_reasons: adj.critical_reasons,         // [AUDIT-FIX] 仲裁关键推理
      must_ask_followups: adj.must_ask_followups,     // [AUDIT-FIX] 建议追问
      conflict_notes: adj.conflict_notes,             // [AUDIT-FIX] AI 分歧记录
      safe_to_auto_display: adj.safe_to_auto_display,
      escalate_to_human: adj.escalate_to_human,
      escalation_reason: adj.escalation_reason || null,
      confidence: adj.confidence,
      // 安全闸门结果
      safety_gate_class: gate.gate_class,
      safety_gate_triggers: gate.triggered_rules,
      safety_gate_explanation: gate.explanation,
      // 性能
      total_latency_ms: pipeline.total_latency_ms,
    };

    const { error } = await supabase
      .from('screening_adjudications')
      .insert(row);

    if (error) {
      aemcLog.warn('persistence', 'Failed to insert adjudication', { error: error.message });
    }
  } catch (err) {
    aemcLog.warn('persistence', 'Adjudication persistence error', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// ============================================================
// 医院匹配结果持久化
// ============================================================

/**
 * 插入医院匹配记录到 screening_hospital_matches
 */
async function persistHospitalMatches(
  pipeline: AEMCPipelineResult,
  screeningType: 'authenticated' | 'whitelabel'
): Promise<void> {
  const rec = pipeline.hospital_recommendation;
  if (!rec || rec.recommended_hospitals.length === 0) return;

  try {
    const supabase = getSupabaseAdmin();

    const rows = rec.recommended_hospitals.map((h, idx) => ({
      screening_id: pipeline.case_id,
      screening_type: screeningType,
      hospital_id: h.hospital_id,
      hospital_name: h.hospital_name,
      department: h.department,
      match_score: h.match_score,
      match_reasons: h.match_reasons,
      cautions: h.cautions,
      ranked_order: idx + 1,
    }));

    const { error } = await supabase
      .from('screening_hospital_matches')
      .insert(rows);

    if (error) {
      aemcLog.warn('persistence', 'Failed to insert hospital matches', { error: error.message });
    }
  } catch (err) {
    aemcLog.warn('persistence', 'Hospital matches persistence error', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// ============================================================
// 结构化病历持久化（训练数据积累）
// ============================================================

/**
 * 插入 AI-1 Extractor 的结构化输出到 screening_structured_cases
 * 用途：prompt 改善 / 知识库构建 / Safety Gate 阈值校正
 */
async function persistStructuredCase(
  pipeline: AEMCPipelineResult,
  screeningType: 'authenticated' | 'whitelabel'
): Promise<void> {
  const sc = pipeline.structured_case;
  if (!sc) return;

  try {
    const supabase = getSupabaseAdmin();

    // 从 AI runs 中提取 extractor 元数据
    const extractorRun = pipeline.ai_runs.find((r) => r.role === 'extractor');

    const row = {
      screening_id: pipeline.case_id,
      screening_type: screeningType,
      language: sc.language,
      // Demographics
      patient_age: sc.demographics.age ?? null,
      patient_sex: sc.demographics.sex ?? null,
      patient_country: sc.demographics.country ?? null,
      // Chief complaint
      chief_complaint: sc.chief_complaint,
      // Present illness
      symptoms: sc.present_illness.symptoms,
      aggravating_factors: sc.present_illness.aggravating_factors,
      relieving_factors: sc.present_illness.relieving_factors,
      associated_symptoms: sc.present_illness.associated_symptoms,
      // History
      past_history: sc.past_history,
      medication_history: sc.medication_history,
      allergy_history: sc.allergy_history,
      known_diagnoses: sc.known_diagnoses,
      exam_findings: sc.exam_findings,
      // Red flags
      red_flags: sc.red_flags,
      // Gaps
      missing_critical_info: sc.missing_critical_info,
      unknown_items: sc.unknown_items,
      inferred_items: sc.inferred_items,
      // AI metadata
      extractor_model: extractorRun
        ? `${extractorRun.model_vendor}/${extractorRun.model_name}`
        : null,
      extractor_prompt_version: extractorRun?.prompt_version ?? null,
      extraction_latency_ms: extractorRun?.latency_ms ?? null,
    };

    const { error } = await supabase
      .from('screening_structured_cases')
      .insert(row);

    if (error) {
      aemcLog.warn('persistence', 'Failed to insert structured case', { error: error.message });
    }
  } catch (err) {
    aemcLog.warn('persistence', 'Structured case persistence error', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// ============================================================
// 失败 Pipeline 的部分持久化
// ============================================================

/**
 * Pipeline 失败时，仍然持久化已完成的 AI runs
 * 用于故障分析和成本统计
 */
export async function persistFailedRuns(
  runs: AIRunRecord[],
  screeningType: 'authenticated' | 'whitelabel'
): Promise<void> {
  await persistAIRuns(runs, screeningType);
}
