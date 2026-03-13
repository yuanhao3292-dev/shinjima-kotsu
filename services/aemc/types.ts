/**
 * AEMC (AI Expert Medical Consultation) 类型定义
 *
 * 此文件定义了 4 AI 联合会诊系统的所有数据对象。
 * 每个 AI 阶段的输入/输出都基于这些类型，确保全链路类型安全。
 *
 * 警告：修改这些类型时必须同步更新所有相关的 prompt 和 parser。
 */

// ============================================================
// 1. case_packet — 原始输入标准包
//    所有 AI 的唯一入口，避免各模型各看各的文本
// ============================================================

export interface CasePacket {
  case_id: string;
  source_type: SourceType[];
  user_type: 'authenticated' | 'whitelabel';
  language: 'zh-CN' | 'zh-TW' | 'en' | 'ja';
  demographics: Demographics;
  body_regions: string[];
  selected_symptoms: CaseSymptom[];
  questionnaire_answers: Record<string, string | string[]>;
  uploaded_report_text?: string;
  timeline: TimelineEvent[];
  raw_text_bundle: RawTextEntry[];
  metadata: CaseMetadata;
}

export type SourceType = 'questionnaire' | 'free_text' | 'medical_report' | 'ocr';

export interface Demographics {
  age?: number;
  sex?: 'male' | 'female';
  country?: string;
}

export interface CaseSymptom {
  symptom_id: string;
  body_part_id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  follow_up_answers: Record<string, string | string[]>;
}

export interface TimelineEvent {
  time: string;
  event: string;
}

export interface RawTextEntry {
  source: string;
  text: string;
}

export interface CaseMetadata {
  session_id?: string;
  screening_id: string;
  user_id?: string;
  created_at: string;
}

// ============================================================
// 2. structured_case — AI-1 (GPT-4o) 病历抽取输出
//    后续所有模型基于此对象工作，不允许随意改病史
// ============================================================

export interface StructuredCase {
  case_id: string;
  language: 'zh-CN' | 'zh-TW' | 'en' | 'ja';
  demographics: Demographics;
  chief_complaint: string;
  present_illness: PresentIllness;
  past_history: string[];
  medication_history: string[];
  allergy_history: string[];
  known_diagnoses: string[];
  exam_findings: string[];
  red_flags: string[];
  missing_critical_info: string[];
  inferred_items: InferredItem[];
  unknown_items: string[];
}

export interface PresentIllness {
  symptoms: ExtractedSymptom[];
  aggravating_factors: string[];
  relieving_factors: string[];
  associated_symptoms: string[];
}

export interface ExtractedSymptom {
  name: string;
  duration: string;
  severity: string;
  certainty: 'explicit' | 'inferred' | 'unknown';
  evidence: string; // 原文证据片段
}

export interface InferredItem {
  item: string;
  reason: string;
}

// ============================================================
// 3. triage_assessment — AI-2 (Gemini) 分诊判断输出
// ============================================================

export interface TriageAssessment {
  case_id: string;
  urgency_level: UrgencyLevel;
  recommended_departments: string[];
  differential_directions: DifferentialDirection[];
  suggested_tests: string[];
  needs_emergency_evaluation: boolean;
  doctor_review_required: boolean;
  confidence: number; // 0-1
  reasoning_summary: string;
  do_not_miss_conditions: string[];
  missing_information_impact: string[];
}

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export interface DifferentialDirection {
  name: string;
  likelihood: string;
  reason: string;
}

// ============================================================
// 4. challenge_review — AI-3 (Grok) 反方挑战输出
// ============================================================

export interface ChallengeReview {
  case_id: string;
  main_concerns: string[];
  alternative_risks: AlternativeRisk[];
  under_triage_risk: boolean;
  over_triage_risk: boolean;
  recommended_escalation: boolean;
  missing_high_impact_data: string[];
  confidence: number; // 0-1
}

export interface AlternativeRisk {
  name: string;
  reason: string;
}

// ============================================================
// 5. adjudicated_assessment — AI-4 (Claude) 质控仲裁输出
// ============================================================

export interface AdjudicatedAssessment {
  case_id: string;
  final_risk_level: UrgencyLevel;
  final_departments: string[];
  final_summary: string;
  critical_reasons: string[];
  must_ask_followups: string[];
  safe_to_auto_display: boolean;
  escalate_to_human: boolean;
  escalation_reason: string;
  confidence: number; // 0-1
  conflict_notes: string[];
}

// ============================================================
// 6. hospital_recommendation — 医院匹配输出
// ============================================================

export interface HospitalRecommendation {
  recommended_hospitals: HospitalMatch[];
  routing_suggestion: string;
  requires_manual_coordinator_review: boolean;
}

export interface HospitalMatch {
  hospital_id: string;
  hospital_name: string;
  department: string;
  match_score: number; // 0-1
  match_reasons: string[];
  cautions: string[];
}

// ============================================================
// 7. safety_gate_result — 安全闸门输出
// ============================================================

export type SafetyGateClass = 'A' | 'B' | 'C' | 'D';

export interface SafetyGateResult {
  gate_class: SafetyGateClass;
  triggered_rules: TriggeredRule[];
  allow_auto_display: boolean;
  require_human_review: boolean;
  require_emergency_notice: boolean;
  require_followup_questions: boolean;
  explanation: string;
}

export interface TriggeredRule {
  rule_id: string;
  category: 'cardiovascular' | 'neurological' | 'gastrointestinal' | 'respiratory' | 'oncology' | 'systemic' | 'trauma' | 'high_risk_population' | 'emergency' | 'model_conflict' | 'low_confidence' | 'missing_info';
  /** 触发规则的严重程度。安全闸门用此字段（而非 category）判断 D 类紧急 */
  severity: 'high' | 'emergency';
  description: string;
  source: 'red_flag_lexicon' | 'adjudication' | 'model_comparison';
}

// ============================================================
// 8. AI 调用记录类型
// ============================================================

export type AIModelVendor = 'openai' | 'google' | 'xai' | 'anthropic' | 'deepseek';
export type AIRole = 'extractor' | 'triage' | 'challenger' | 'adjudicator' | 'hospital_matcher';

export interface AIRunRecord {
  screening_id: string;
  model_vendor: AIModelVendor;
  model_name: string;
  role: AIRole;
  prompt_version: string;
  input_hash: string;
  output_json: Record<string, unknown>;
  latency_ms: number;
  input_tokens?: number;
  output_tokens?: number;
  error?: string;
}

// ============================================================
// 9. Pipeline 完整结果
// ============================================================

export interface AEMCPipelineResult {
  case_id: string;
  structured_case: StructuredCase;
  triage_assessment: TriageAssessment;
  challenge_review?: ChallengeReview; // V2 才有
  adjudicated_assessment: AdjudicatedAssessment;
  hospital_recommendation?: HospitalRecommendation;
  safety_gate: SafetyGateResult;
  ai_runs: AIRunRecord[];
  total_latency_ms: number;
  pipeline_version: string;
  // 确定性后处理结果（V3 Lite / V2 Full 都会执行）
  icd10_mapping?: import('./icd10-mapper').ICD10MappingResult;
  guideline_matches?: import('./clinical-guidelines').GuidelineMatchResult;
  ddi_check?: import('./drug-interaction-checker').DDICheckResult;
}

// ============================================================
// 10. Legacy 兼容类型（原 deepseek/types.ts，前端渲染用）
// ============================================================

export interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskSummary: string;
  riskFactors?: string[];
  recommendedTests: string[];
  treatmentSuggestions: string[];
  recommendedHospitals: LegacyRecommendedHospital[];
  nextSteps: string[];
  rawContent: string;
  disclaimer: string;
  isFallback?: boolean;
  analysisSource?: 'ai' | 'rule-based';
  requestId?: string;
  language?: 'zh-CN' | 'zh-TW' | 'en' | 'ja';
}

export interface LegacyRecommendedHospital {
  name: string;
  nameJa?: string;
  location: string;
  features: string[];
  suitableFor: string;
}

export type RiskLevel = 'low' | 'medium' | 'high';

// ============================================================
// 11. 医疗免责声明
// ============================================================

export const MEDICAL_DISCLAIMERS: Record<string, string> = {
  'zh-CN': `⚠️ 重要医疗免责声明

1. 本 AI 健康评估系统仅供健康参考，不构成任何形式的医学诊断、治疗建议或处方。
2. AI 分析结果不能替代专业医疗人员的诊查、诊断和治疗建议。
3. 如您被评估为中度或高度健康风险，请尽速咨询专业医疗机构。
4. 任何健康决策请务必咨询持有执照的医疗专业人员。
5. 新岛交通株式会社对因使用本系统所做决策产生的任何后果不承担法律责任。
6. 紧急情况请立即拨打急救电话或前往最近医疗机构。

© 新岛交通株式会社 | 日本精密健检服务`,

  'zh-TW': `⚠️ 重要醫療免責聲明

1. 本 AI 健康評估系統僅供健康參考，不構成任何形式的醫學診斷、治療建議或處方。
2. AI 分析結果不能替代專業醫療人員的診查、診斷和治療建議。
3. 如您被評估為中度或高度健康風險，請儘速諮詢專業醫療機構。
4. 任何健康決策請務必諮詢持有執照的醫療專業人員。
5. 新島交通株式會社對因使用本系統所做決策產生的任何後果不承擔法律責任。
6. 緊急情況請立即撥打急救電話或前往最近醫療機構。

© 新島交通株式會社 | 日本精密健檢服務`,

  ja: `⚠️ 重要な医療に関する免責事項

1. 本AIヘルスアセスメントシステムは健康上の参考情報としてのみ提供されるものであり、医学的診断、治療の助言、処方を構成するものではありません。
2. AI分析結果は、医療専門家による診察、診断、治療の助言に代わるものではありません。
3. 中程度または高度の健康リスクと評価された場合は、速やかに専門医療機関にご相談ください。
4. 健康に関するすべての判断は、必ず有資格の医療専門家にご相談ください。
5. 新島交通株式会社は、本システムの利用に基づく判断から生じるいかなる結果についても法的責任を負いません。
6. 緊急時は、直ちに救急車を呼ぶか、最寄りの医療機関を受診してください。

© 新島交通株式会社 | 日本精密健診サービス`,

  en: `⚠️ Important Medical Disclaimer

1. This AI health assessment system is provided for health reference only and does not constitute medical diagnosis, treatment advice, or prescription.
2. AI analysis results cannot replace examination, diagnosis, and treatment advice from medical professionals.
3. If assessed as moderate or high health risk, please consult a professional medical institution promptly.
4. All health decisions should be made in consultation with licensed medical professionals.
5. Niijima Kotsu Co., Ltd. assumes no legal liability for any consequences arising from decisions made using this system.
6. In emergencies, please immediately call emergency services or go to the nearest medical facility.

© Niijima Kotsu Co., Ltd. | Japan Precision Health Screening Services`,
};

// 向后兼容：保留默认导出
export const MEDICAL_DISCLAIMER = MEDICAL_DISCLAIMERS['zh-TW'];
