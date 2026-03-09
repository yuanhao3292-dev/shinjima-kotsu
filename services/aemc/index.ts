/**
 * AEMC Pipeline 编排入口 (AI Expert Medical Consultation)
 *
 * 此文件是 4 AI 联合会诊系统的主入口。
 * 编排流程：输入标准化 → 病历抽取 → 分诊判断 → [挑战] → 质控仲裁 → 安全闸门 → 医院匹配
 *
 * V2 Pipeline（含 Grok 挑战官，OPENROUTER_API_KEY 配置时启用）:
 * CasePacket → AI-1 GPT-4o → AI-2 Gemini → AI-3 Grok → AI-4 Claude → Safety Gate → Hospital Match
 * V1 Fallback（无挑战官 或 挑战官失败）:
 * CasePacket → AI-1 GPT-4o → AI-2 Gemini → AI-4 Claude → Safety Gate → Hospital Match
 *
 * 设计原则：
 * - 任何 AI 失败都会触发错误通知并向用户返回友好错误
 * - 所有 AI 调用记录都保存为 AIRunRecord
 * - 安全闸门是最后一道防线，永远执行
 *
 * 警告：此文件的修改直接影响患者安全。
 */

import type { ScreeningAnswer } from '@/lib/screening-questions';
import type {
  AEMCPipelineResult,
  AIRunRecord,
  CasePacket,
  HospitalRecommendation,
  SafetyGateResult,
} from './types';
import type { AnalysisResult, LegacyRecommendedHospital } from './types';
import { MEDICAL_DISCLAIMER } from './types';

import { normalizeToCasePacket, type NormalizerInput } from './input-normalizer';
import { extractCase, ExtractorError } from './extractor';
import { triageCase, TriageError } from './triage';
import { challengeCase, ChallengerError } from './challenger';
import { adjudicateCase, AdjudicatorError } from './adjudicator';
import { evaluateSafetyGate, type SafetyGateInput } from './safety-gate';
import { matchHospitals } from './hospital-matcher';
import { HOSPITAL_KNOWLEDGE_BASE } from './hospital-knowledge-base';

// ============================================================
// Pipeline 配置
// ============================================================

const PIPELINE_VERSION_V1 = 'aemc-v1.0';
const PIPELINE_VERSION_V2 = 'aemc-v2.0';

// ============================================================
// 主入口
// ============================================================

export interface AEMCInput {
  screeningId: string;
  answers: ScreeningAnswer[];
  bodyMapData?: NormalizerInput['bodyMapData'];
  userType: 'authenticated' | 'whitelabel';
  userId?: string;
  sessionId?: string;
  language?: string;
  phase: 1 | 2;
  uploadedReportText?: string;
}

export interface AEMCOutput {
  /** 完整 pipeline 结果（存入 DB 做审计） */
  pipelineResult: AEMCPipelineResult;
  /** 向后兼容的旧版 AnalysisResult（前端渲染用） */
  legacyResult: AnalysisResult;
  /** 安全闸门输出 */
  safetyGate: SafetyGateResult;
}

/**
 * 执行 AEMC 4 AI 联合会诊 Pipeline
 *
 * 流程：
 * 1. Input Normalizer → CasePacket
 * 2. AI-1 (GPT-4o) → StructuredCase
 * 3. AI-2 (Gemini) → TriageAssessment
 * 3.5. AI-3 (Grok) → ChallengeReview [V2, 可选，失败降级到V1]
 * 4. AI-4 (Claude) → AdjudicatedAssessment
 * 5. Safety Gate → SafetyGateResult
 * 6. Hospital Matcher → HospitalRecommendation
 * 7. Convert → AnalysisResult (backward compat)
 */
export async function runAEMCPipeline(input: AEMCInput): Promise<AEMCOutput> {
  const pipelineStartTime = Date.now();
  const aiRuns: AIRunRecord[] = [];

  // === Step 1: 输入标准化 ===
  const casePacket = normalizeToCasePacket({
    screeningId: input.screeningId,
    answers: input.answers,
    bodyMapData: input.bodyMapData,
    userType: input.userType,
    userId: input.userId,
    sessionId: input.sessionId,
    language: input.language,
    uploadedReportText: input.uploadedReportText,
  });

  console.info(`[AEMC] Pipeline started for case ${casePacket.case_id}`);

  // === Step 2: AI-1 病历抽取 ===
  let structuredCase;
  try {
    const extractResult = await extractCase(casePacket);
    structuredCase = extractResult.structuredCase;
    aiRuns.push(extractResult.runRecord);
    console.info(`[AEMC] AI-1 (GPT-4o) completed in ${extractResult.runRecord.latency_ms}ms`);
  } catch (error) {
    if (error instanceof ExtractorError) {
      aiRuns.push(error.runRecord);
    }
    console.error('[AEMC] AI-1 (GPT-4o) failed:', error instanceof Error ? error.message : error);
    throw new PipelineError('AI-1 Extractor failed', aiRuns, casePacket);
  }

  // === Step 3: AI-2 分诊判断 ===
  let triageAssessment;
  try {
    const triageResult = await triageCase(structuredCase);
    triageAssessment = triageResult.triageAssessment;
    aiRuns.push(triageResult.runRecord);
    console.info(`[AEMC] AI-2 (Gemini) completed in ${triageResult.runRecord.latency_ms}ms`);
  } catch (error) {
    if (error instanceof TriageError) {
      aiRuns.push(error.runRecord);
    }
    console.error('[AEMC] AI-2 (Gemini) failed:', error instanceof Error ? error.message : error);
    throw new PipelineError('AI-2 Triage failed', aiRuns, casePacket);
  }

  // === Step 3.5: AI-3 反方挑战（V2，可选，失败降级到 V1） ===
  let challengeReview;
  const challengerEnabled = !!process.env.OPENROUTER_API_KEY;
  if (challengerEnabled) {
    try {
      const challengerResult = await challengeCase(structuredCase, triageAssessment);
      challengeReview = challengerResult.challengeReview;
      aiRuns.push(challengerResult.runRecord);
      console.info(`[AEMC] AI-3 (Grok) completed in ${challengerResult.runRecord.latency_ms}ms`);
    } catch (error) {
      // 挑战官失败不阻断 pipeline → 降级到 V1（无挑战）
      if (error instanceof ChallengerError) {
        aiRuns.push(error.runRecord);
      }
      console.warn(
        '[AEMC] AI-3 (Grok) failed, continuing without challenger:',
        error instanceof Error ? error.message : error
      );
    }
  }

  // === Step 4: AI-4 质控仲裁 ===
  let adjudicatedAssessment;
  try {
    const adjudicatorResult = await adjudicateCase(
      structuredCase,
      triageAssessment,
      challengeReview // V2: 传入挑战结果; V1/降级: undefined
    );
    adjudicatedAssessment = adjudicatorResult.adjudicatedAssessment;
    aiRuns.push(adjudicatorResult.runRecord);
    console.info(`[AEMC] AI-4 (Claude) completed in ${adjudicatorResult.runRecord.latency_ms}ms`);
  } catch (error) {
    if (error instanceof AdjudicatorError) {
      aiRuns.push(error.runRecord);
    }
    console.error('[AEMC] AI-4 (Claude) failed:', error instanceof Error ? error.message : error);
    throw new PipelineError('AI-4 Adjudicator failed', aiRuns, casePacket);
  }

  // === Step 5: 安全闸门（确定性逻辑，永远执行） ===
  const safetyGateInput: SafetyGateInput = {
    case_packet: casePacket,
    structured_case: structuredCase,
    triage_assessment: triageAssessment,
    adjudicated_assessment: adjudicatedAssessment,
  };
  const safetyGate = evaluateSafetyGate(safetyGateInput);

  // === Step 6: 医院匹配（确定性逻辑，无 AI 调用，失败不阻断主流程） ===
  let hospitalRecommendation: HospitalRecommendation | undefined;
  try {
    hospitalRecommendation = matchHospitals(
      structuredCase,
      triageAssessment,
      adjudicatedAssessment
    );
    console.info(
      `[AEMC] Hospital matcher: ${hospitalRecommendation.recommended_hospitals.length} matches`
    );
  } catch (matchError) {
    console.error(
      '[AEMC] Hospital matcher failed (non-critical):',
      matchError instanceof Error ? matchError.message : matchError
    );
  }

  const totalLatencyMs = Date.now() - pipelineStartTime;
  console.info(
    `[AEMC] Pipeline completed: gate=${safetyGate.gate_class}, ` +
    `risk=${adjudicatedAssessment.final_risk_level}, ` +
    `total=${totalLatencyMs}ms, ` +
    `triggers=${safetyGate.triggered_rules.length}`
  );

  // === 组装完整结果 ===
  const pipelineVersion = challengeReview ? PIPELINE_VERSION_V2 : PIPELINE_VERSION_V1;
  const pipelineResult: AEMCPipelineResult = {
    case_id: casePacket.case_id,
    structured_case: structuredCase,
    triage_assessment: triageAssessment,
    challenge_review: challengeReview, // V2: present; V1/degraded: undefined
    adjudicated_assessment: adjudicatedAssessment,
    hospital_recommendation: hospitalRecommendation,
    safety_gate: safetyGate,
    ai_runs: aiRuns,
    total_latency_ms: totalLatencyMs,
    pipeline_version: pipelineVersion,
  };

  // === Step 7: 向后兼容转换 ===
  const legacyResult = convertToLegacyResult(pipelineResult);

  return {
    pipelineResult,
    legacyResult,
    safetyGate,
  };
}

// ============================================================
// 向后兼容：AEMCPipelineResult → AnalysisResult
// ============================================================

/**
 * 将 AEMC pipeline 结果转换为旧版 AnalysisResult 格式
 * 确保现有前端组件 (ScreeningResult.tsx) 无需修改
 */
function convertToLegacyResult(pipeline: AEMCPipelineResult): AnalysisResult {
  const adj = pipeline.adjudicated_assessment;
  const triage = pipeline.triage_assessment;
  const gate = pipeline.safety_gate;

  // 风险等级映射（旧版没有 'emergency'）
  const riskLevelMap: Record<string, AnalysisResult['riskLevel']> = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    emergency: 'high', // emergency → high for backward compat
  };

  // 如果安全闸门判定为 D 类（紧急），强制 high
  const effectiveRiskLevel = gate.gate_class === 'D'
    ? 'high'
    : riskLevelMap[adj.final_risk_level] || 'medium';

  // 构建风险摘要（包含安全闸门信息）
  let riskSummary = adj.final_summary;
  if (gate.gate_class === 'D') {
    riskSummary = `⚠️ 检测到疑似急症信号，建议立即就近就医。\n\n${riskSummary}`;
  } else if (gate.gate_class === 'C') {
    riskSummary = `此报告需经人工医疗顾问审核后展示。\n\n${riskSummary}`;
  }

  // 将鉴别方向转为治疗建议（旧版字段）
  const treatmentSuggestions = triage.differential_directions.map(
    (d) => `${d.name}（可能性: ${d.likelihood}）: ${d.reason}`
  );

  // 下一步建议 = 仲裁官的追问 + 安全闸门的解释
  const nextSteps: string[] = [];
  if (adj.must_ask_followups.length > 0) {
    nextSteps.push(`建议补充信息: ${adj.must_ask_followups.join('、')}`);
  }
  if (adj.critical_reasons.length > 0) {
    nextSteps.push(`重点关注: ${adj.critical_reasons.join('、')}`);
  }
  if (gate.gate_class === 'D') {
    nextSteps.unshift('⚠️ 请立即前往最近的急诊室');
  }
  if (nextSteps.length === 0) {
    nextSteps.push('建议按照推荐科室进行详细检查');
  }

  // 推荐医院（从 hospital matcher 结果转换）
  const recommendedHospitals: LegacyRecommendedHospital[] =
    pipeline.hospital_recommendation
      ? pipeline.hospital_recommendation.recommended_hospitals.map((h) => {
          const kb = HOSPITAL_KNOWLEDGE_BASE.find((k) => k.id === h.hospital_id);
          return {
            name: h.hospital_name,
            nameJa: kb?.nameJa,
            location: kb?.location || '',
            features: h.match_reasons,
            suitableFor: h.department,
          };
        })
      : [];

  return {
    riskLevel: effectiveRiskLevel,
    riskSummary,
    recommendedTests: triage.suggested_tests,
    treatmentSuggestions,
    recommendedHospitals,
    nextSteps,
    rawContent: JSON.stringify(pipeline, null, 2),
    disclaimer: MEDICAL_DISCLAIMER,
    isFallback: false,
    analysisSource: 'ai',
    requestId: pipeline.case_id,
  };
}

// ============================================================
// Pipeline 错误类型
// ============================================================

export class PipelineError extends Error {
  public readonly aiRuns: AIRunRecord[];
  public readonly casePacket: CasePacket;

  constructor(message: string, aiRuns: AIRunRecord[], casePacket: CasePacket) {
    super(message);
    this.name = 'PipelineError';
    this.aiRuns = aiRuns;
    this.casePacket = casePacket;
  }
}
