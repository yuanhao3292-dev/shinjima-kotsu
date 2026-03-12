/**
 * AEMC Pipeline 编排入口 (AI Expert Medical Consultation)
 *
 * 此文件是 4 AI 联合会诊系统的主入口。
 * 编排流程：输入标准化 → 病历抽取 → [分诊‖挑战] 并行 → 质控仲裁 → 安全闸门 → 医院匹配
 *
 * V3 Lite（Vercel Hobby 兼容，单次 GPT-4o-mini 调用，≤10s）:
 * CasePacket → GPT-4o-mini (抽取+分诊+仲裁) → Safety Gate → Hospital Match
 * V2 Pipeline（含 Grok 挑战官，OPENROUTER_API_KEY 配置时启用）:
 * CasePacket → AI-1 GPT-4o → [AI-2 Gemini ‖ AI-3 Grok] → AI-4 Claude → Safety Gate → Hospital Match
 * V1 Fallback（无挑战官 或 挑战官失败）:
 * CasePacket → AI-1 GPT-4o → AI-2 Gemini → AI-4 Claude → Safety Gate → Hospital Match
 *
 * 默认使用 V3 Lite（AEMC_PIPELINE_MODE=full 启用完整管线）
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
import { validateExtraction } from './extraction-validator';
import { calculateClinicalScores } from './clinical-scores';
import { triageCase, TriageError } from './triage';
import { challengeCase, ChallengerError } from './challenger';
import { interceptUnsafeTests } from './test-safety';
import { matchClinicalGuidelines } from './clinical-guidelines';
import { checkDrugInteractions } from './drug-interaction-checker';
import { mapToICD10 } from './icd10-mapper';
import { adjudicateCase, AdjudicatorError } from './adjudicator';
import { evaluateSafetyGate, type SafetyGateInput } from './safety-gate';
import { matchHospitals } from './hospital-matcher';
import { HOSPITAL_KNOWLEDGE_BASE } from './hospital-knowledge-base';
import { runLiteAnalysis } from './lite-analyzer';

// ============================================================
// Pipeline 配置
// ============================================================

const PIPELINE_VERSION_V1 = 'aemc-v1.0';
const PIPELINE_VERSION_V2 = 'aemc-v2.0';
const PIPELINE_VERSION_V3_LITE = 'aemc-v3-lite';

// 默认使用 V3 Lite（单次 AI 调用，Vercel Hobby 兼容）
// 设置 AEMC_PIPELINE_MODE=full 启用完整 4-AI 管线（需要 Vercel Pro 60s 超时）
const USE_FULL_PIPELINE = process.env.AEMC_PIPELINE_MODE?.trim() === 'full';

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
 * 3. [AI-2 (Gemini) ‖ AI-3 (Grok)] → TriageAssessment + ChallengeReview [并行，AI-3 可选]
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

  // === V3 Lite: 单次 AI 快速路径（默认） ===
  if (!USE_FULL_PIPELINE) {
    return runLitePipeline(casePacket, pipelineStartTime);
  }

  // === 完整 4-AI 管线（需要 AEMC_PIPELINE_MODE=full） ===

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

  // === Step 2b: 提取验证（确定性逻辑，补漏 AI-1 遗漏的异常值） ===
  const validationResult = validateExtraction(casePacket, structuredCase);
  if (validationResult.addedFindings.length > 0 || validationResult.addedRedFlags.length > 0) {
    structuredCase = validationResult.enrichedCase;
    console.info(
      `[AEMC] ExtractionValidator: +${validationResult.addedFindings.length} findings, +${validationResult.addedRedFlags.length} red flags`
    );
  }

  // === Step 2c: 临床评分计算（确定性逻辑，注入 AI-2 输入） ===
  const clinicalScores = calculateClinicalScores(structuredCase);

  // === Step 2d: 临床指南匹配（确定性逻辑，注入 AI-2 + AI-4） ===
  const guidelineResult = matchClinicalGuidelines(structuredCase);

  // === Step 3: AI-2 分诊 + AI-3 挑战（并行执行） ===
  // AI-2 和 AI-3 都只需要 AI-1 的 StructuredCase，可以同时运行
  // AI-3 在并行模式下独立评估风险，不依赖 AI-2 的输出
  let triageAssessment;
  let challengeReview;
  const challengerEnabled = !!process.env.OPENROUTER_API_KEY;

  // 将临床评分 + 指南引用注入 AI-2 的输入
  const triageContext = clinicalScores.summaryForTriage + guidelineResult.guidelineContextForAI;
  const triagePromise = triageCase(structuredCase, triageContext);
  const challengerPromise = challengerEnabled
    ? challengeCase(structuredCase) // 并行模式：无 triageAssessment 参数
    : Promise.resolve(null);

  const [triageSettled, challengerSettled] = await Promise.allSettled([
    triagePromise,
    challengerPromise,
  ]);

  // 处理 AI-2 结果（阻断性：失败则终止）
  if (triageSettled.status === 'fulfilled') {
    triageAssessment = triageSettled.value.triageAssessment;
    aiRuns.push(triageSettled.value.runRecord);
    console.info(`[AEMC] AI-2 (Gemini) completed in ${triageSettled.value.runRecord.latency_ms}ms`);
  } else {
    const error = triageSettled.reason;
    if (error instanceof TriageError) {
      aiRuns.push(error.runRecord);
    }
    console.error('[AEMC] AI-2 (Gemini) failed:', error instanceof Error ? error.message : error);
    throw new PipelineError('AI-2 Triage failed', aiRuns, casePacket);
  }

  // 处理 AI-3 结果（非阻断性：失败降级到 V1）
  if (challengerSettled.status === 'fulfilled' && challengerSettled.value) {
    challengeReview = challengerSettled.value.challengeReview;
    aiRuns.push(challengerSettled.value.runRecord);
    console.info(`[AEMC] AI-3 (Grok) completed in ${challengerSettled.value.runRecord.latency_ms}ms`);
  } else if (challengerSettled.status === 'rejected') {
    const error = challengerSettled.reason;
    if (error instanceof ChallengerError) {
      aiRuns.push(error.runRecord);
    }
    console.warn(
      '[AEMC] AI-3 (Grok) failed, continuing without challenger:',
      error instanceof Error ? error.message : error
    );
  }

  // === Step 3b: 检查安全性拦截（确定性逻辑，替换危险检查推荐） ===
  const testSafetyResult = interceptUnsafeTests(structuredCase, triageAssessment);
  if (testSafetyResult.replacements.length > 0) {
    triageAssessment.suggested_tests = testSafetyResult.safeSuggestedTests;
    console.info(
      `[AEMC] TestSafety: ${testSafetyResult.replacements.length} unsafe tests intercepted`
    );
  }

  // === Step 3c: 药物相互作用检查（确定性逻辑，注入 AI-4） ===
  const ddiResult = checkDrugInteractions(structuredCase, triageAssessment);

  // === Step 4: AI-4 质控仲裁 ===
  let adjudicatedAssessment;
  try {
    // 汇集所有确定性分析结果注入仲裁官
    const adjudicatorContext =
      clinicalScores.summaryForTriage +
      testSafetyResult.safetyWarningsForAdjudicator +
      guidelineResult.guidelineContextForAI +
      ddiResult.ddiWarningsForAdjudicator;
    const adjudicatorResult = await adjudicateCase(
      structuredCase,
      triageAssessment,
      challengeReview, // V2: 传入挑战结果; V1/降级: undefined
      adjudicatorContext
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

  // === Step 4b: ICD-10 编码映射（确定性后处理，附加标准诊断编码） ===
  const icd10Result = mapToICD10(
    triageAssessment.differential_directions.map((d) => d.name),
    casePacket.language
  );

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
    `triggers=${safetyGate.triggered_rules.length}, ` +
    `guidelines=${guidelineResult.matchedGuidelines.length}, ` +
    `DDIs=${ddiResult.interactions.length}, ` +
    `ICD10=${icd10Result.matches.length}`
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
    // 确定性后处理结果
    icd10_mapping: icd10Result,
    guideline_matches: guidelineResult,
    ddi_check: ddiResult,
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
// V3 Lite Pipeline（单次 AI 调用）
// ============================================================

async function runLitePipeline(
  casePacket: CasePacket,
  pipelineStartTime: number
): Promise<AEMCOutput> {
  console.info(`[AEMC] V3 Lite mode for case ${casePacket.case_id}`);

  const liteResult = await runLiteAnalysis(casePacket);

  let { structuredCase, triageAssessment } = liteResult;
  const { adjudicatedAssessment, runRecord } = liteResult;

  // V3 Lite 也执行确定性后处理（提取验证 + 检查安全拦截）
  const validationResult = validateExtraction(casePacket, structuredCase);
  if (validationResult.addedFindings.length > 0 || validationResult.addedRedFlags.length > 0) {
    structuredCase = validationResult.enrichedCase;
    console.info(
      `[AEMC-Lite] ExtractionValidator: +${validationResult.addedFindings.length} findings, +${validationResult.addedRedFlags.length} red flags`
    );
  }

  const testSafetyResult = interceptUnsafeTests(structuredCase, triageAssessment);
  if (testSafetyResult.replacements.length > 0) {
    triageAssessment = { ...triageAssessment, suggested_tests: testSafetyResult.safeSuggestedTests };
    console.info(
      `[AEMC-Lite] TestSafety: ${testSafetyResult.replacements.length} unsafe tests intercepted`
    );
  }

  // 确定性后处理：临床指南 + DDI + ICD-10
  const guidelineResult = matchClinicalGuidelines(structuredCase);
  const ddiResult = checkDrugInteractions(structuredCase, triageAssessment);
  const icd10Result = mapToICD10(
    triageAssessment.differential_directions.map((d) => d.name),
    casePacket.language
  );

  // 安全闸门（确定性逻辑，永远执行）
  const safetyGateInput: SafetyGateInput = {
    case_packet: casePacket,
    structured_case: structuredCase,
    triage_assessment: triageAssessment,
    adjudicated_assessment: adjudicatedAssessment,
  };
  const safetyGate = evaluateSafetyGate(safetyGateInput);

  // 医院匹配
  let hospitalRecommendation: HospitalRecommendation | undefined;
  try {
    hospitalRecommendation = matchHospitals(structuredCase, triageAssessment, adjudicatedAssessment);
  } catch (matchError) {
    console.warn('[AEMC] Hospital matcher failed (non-critical):', matchError instanceof Error ? matchError.message : matchError);
  }

  const totalLatencyMs = Date.now() - pipelineStartTime;
  console.info(
    `[AEMC] V3 Lite completed: gate=${safetyGate.gate_class}, ` +
    `risk=${adjudicatedAssessment.final_risk_level}, ` +
    `total=${totalLatencyMs}ms, ` +
    `guidelines=${guidelineResult.matchedGuidelines.length}, ` +
    `DDIs=${ddiResult.interactions.length}, ` +
    `ICD10=${icd10Result.matches.length}`
  );

  const pipelineResult: AEMCPipelineResult = {
    case_id: casePacket.case_id,
    structured_case: structuredCase,
    triage_assessment: triageAssessment,
    adjudicated_assessment: adjudicatedAssessment,
    hospital_recommendation: hospitalRecommendation,
    safety_gate: safetyGate,
    ai_runs: [runRecord],
    total_latency_ms: totalLatencyMs,
    pipeline_version: PIPELINE_VERSION_V3_LITE,
    // 确定性后处理结果
    icd10_mapping: icd10Result,
    guideline_matches: guidelineResult,
    ddi_check: ddiResult,
  };

  const legacyResult = convertToLegacyResult(pipelineResult);

  return { pipelineResult, legacyResult, safetyGate };
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

  // 将鉴别方向转为治疗建议（旧版字段），附加 ICD-10 编码
  const treatmentSuggestions = triage.differential_directions.map((d) => {
    const icd10Match = pipeline.icd10_mapping?.matches.find(
      (m) => m.originalText === d.name
    );
    const codeTag = icd10Match ? ` [${icd10Match.code}]` : '';
    return `${d.name}${codeTag}（可能性: ${d.likelihood}）: ${d.reason}`;
  });

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
  // 药物相互作用警告
  if (pipeline.ddi_check && pipeline.ddi_check.interactions.length > 0) {
    const ddiWarnings = pipeline.ddi_check.interactions.map(
      (ddi) => `${ddi.drugA} + ${ddi.drugB}: ${ddi.recommendation}`
    );
    nextSteps.push(`⚠️ 药物相互作用提示: ${ddiWarnings.join('；')}`);
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
