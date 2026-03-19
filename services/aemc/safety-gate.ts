/**
 * 确定性安全闸门 (Deterministic Safety Gate)
 *
 * 此模块是 AEMC 系统的最后一道防线。
 * 它是纯确定性逻辑，不依赖任何 AI 模型。
 *
 * 职责：
 * 1. 扫描红旗词典，检测危险信号
 * 2. 检查 AI 模型输出的一致性和置信度
 * 3. 检查高危人群标志
 * 4. 输出安全分类：A（自动展示）/ B（展示+补问）/ C（人工审核）/ D（紧急提示）
 *
 * 设计原则：
 * - 宁可多拦，不可漏判
 * - 所有判断必须可追溯（记录触发的具体规则）
 * - 不依赖 AI，纯代码逻辑
 *
 * 警告：此文件的修改直接影响患者安全，必须经过严格审计。
 */

import {
  type SafetyGateResult,
  type SafetyGateClass,
  type TriggeredRule,
  type CasePacket,
  type StructuredCase,
  type TriageAssessment,
  type ChallengeReview,
  type AdjudicatedAssessment,
  type JudgeVerdict,
} from './types';

import {
  ALL_RED_FLAG_RULES,
  type RedFlagRule,
} from './red-flags';

import { type AEMCLang } from './hospital-knowledge-base';

// ============================================================
// 多语言标签
// ============================================================

type GL = Record<AEMCLang, string>;
const GATE_I18N: Record<string, GL> = {
  pediatric: { 'zh-CN': '儿童患者 ({age}岁)，需专业儿科评估', 'zh-TW': '兒童患者 ({age}歲)，需專業兒科評估', en: 'Pediatric patient (age {age}), requires specialist pediatric evaluation', ja: '小児患者（{age}歳）、専門的な小児科評価が必要' },
  elderly: { 'zh-CN': '高龄患者 ({age}岁)，需考虑多病共存和药物相互作用', 'zh-TW': '高齡患者 ({age}歲)，需考慮多病共存和藥物交互作用', en: 'Elderly patient (age {age}), consider multimorbidity and drug interactions', ja: '高齢患者（{age}歳）、複数疾患併存と薬物相互作用の考慮が必要' },
  lowConfidence: { 'zh-CN': '仲裁置信度过低 ({val} < {thr})', 'zh-TW': '仲裁置信度過低 ({val} < {thr})', en: 'Adjudication confidence too low ({val} < {thr})', ja: '裁定信頼度が低すぎます（{val} < {thr}）' },
  escalateHuman: { 'zh-CN': '仲裁官要求人工升级: {reason}', 'zh-TW': '仲裁官要求人工升級: {reason}', en: 'Adjudicator requested human escalation: {reason}', ja: '裁定者がヒューマンエスカレーションを要求: {reason}' },
  underTriage: { 'zh-CN': '挑战官检测到分诊不足风险 (under-triage)', 'zh-TW': '挑戰官檢測到分診不足風險 (under-triage)', en: 'Challenger detected under-triage risk', ja: 'チャレンジャーがアンダートリアージリスクを検出' },
  challengerEscalate: { 'zh-CN': '挑战官建议升级人工审核', 'zh-TW': '挑戰官建議升級人工審核', en: 'Challenger recommends human review escalation', ja: 'チャレンジャーがヒューマンレビューへのエスカレーションを推奨' },
  challengerLowConf: { 'zh-CN': '挑战官置信度过低 ({val})', 'zh-TW': '挑戰官置信度過低 ({val})', en: 'Challenger confidence too low ({val})', ja: 'チャレンジャー信頼度が低すぎます（{val}）' },
  emergencyEval: { 'zh-CN': '分诊官建议急诊评估', 'zh-TW': '分診官建議急診評估', en: 'Triage recommends emergency evaluation', ja: 'トリアージが緊急評価を推奨' },
  doctorReview: { 'zh-CN': '分诊官认为需要医生审查', 'zh-TW': '分診官認為需要醫生審查', en: 'Triage recommends doctor review', ja: 'トリアージが医師レビューを推奨' },
  riskMismatch: { 'zh-CN': '分诊({triage})与仲裁({adj})风险等级差异过大', 'zh-TW': '分診({triage})與仲裁({adj})風險等級差異過大', en: 'Risk level mismatch between triage ({triage}) and adjudication ({adj})', ja: 'トリアージ（{triage}）と裁定（{adj}）のリスクレベルの差が大きい' },
  uncoveredFlags: { 'zh-CN': 'AI-1 提取的 {count} 个红旗未被 AI-2 鉴别诊断覆盖: {flags}', 'zh-TW': 'AI-1 提取的 {count} 個紅旗未被 AI-2 鑑別診斷覆蓋: {flags}', en: '{count} red flag(s) from AI-1 not covered by AI-2 differential diagnosis: {flags}', ja: 'AI-1が抽出した {count} 件のレッドフラグがAI-2の鑑別診断でカバーされていません: {flags}' },
  tumorNoWorkup: { 'zh-CN': '肿瘤标志物升高但 AI-2 未推荐肿瘤排查检查（PET-CT/专科转诊/活检等）', 'zh-TW': '腫瘤標誌物升高但 AI-2 未推薦腫瘤排查檢查（PET-CT/專科轉診/活檢等）', en: 'Elevated tumor markers but AI-2 did not recommend oncology workup (PET-CT/referral/biopsy)', ja: '腫瘍マーカー上昇だがAI-2が腫瘍精査（PET-CT/専門科紹介/生検等）を推奨していない' },
  cardiacNoWorkup: { 'zh-CN': '心功能异常指标存在但 AI-2 未推荐 BNP 检测或心内科随访', 'zh-TW': '心功能異常指標存在但 AI-2 未推薦 BNP 檢測或心內科隨訪', en: 'Cardiac dysfunction indicators present but AI-2 did not recommend BNP testing or cardiology follow-up', ja: '心機能異常指標が存在するがAI-2がBNP検査または循環器科フォローアップを推奨していない' },
  multiSystem: { 'zh-CN': '多系统累及 ({systems}={count}系统) 但分诊等级仅为 {level}，可能低估复合风险', 'zh-TW': '多系統累及 ({systems}={count}系統) 但分診等級僅為 {level}，可能低估複合風險', en: 'Multi-system involvement ({systems}={count} systems) but triage level only {level}, may underestimate composite risk', ja: '多系統関与（{systems}={count}系統）だがトリアージレベルは{level}のみ、複合リスクを過小評価の可能性' },
  hepatitisNoScreen: { 'zh-CN': '肝脏病变但未推荐 HBV/HCV 筛查（东亚 HBV 是肝癌首要病因，必须排查）', 'zh-TW': '肝臟病變但未推薦 HBV/HCV 篩查（東亞 HBV 是肝癌首要病因，必須排查）', en: 'Liver lesion detected but HBV/HCV screening not recommended (HBV is leading cause of HCC in East Asia)', ja: '肝病変が存在するがHBV/HCVスクリーニングが推奨されていない（東アジアではHBVが肝癌の主要原因）' },
  mdtNotRecommended: { 'zh-CN': '疑似恶性肿瘤/转移但未推荐 MDT 多学科会诊（肿瘤治疗决策需多科协作）', 'zh-TW': '疑似惡性腫瘤/轉移但未推薦 MDT 多學科會診（腫瘤治療決策需多科協作）', en: 'Suspected malignancy/metastasis but MDT multidisciplinary consultation not recommended', ja: '悪性腫瘍/転移の疑いがあるがMDT多診療科カンファレンスが推奨されていない' },
  missingInfo: { 'zh-CN': '缺失关键信息过多 ({count} 项)，影响分诊准确性', 'zh-TW': '缺失關鍵資訊過多 ({count} 項)，影響分診準確性', en: 'Too many missing critical items ({count}), affecting triage accuracy', ja: '重要な情報の欠落が多すぎます（{count}件）、トリアージ精度に影響' },
  aiRedFlag: { 'zh-CN': 'AI 识别红旗: {flag}', 'zh-TW': 'AI 識別紅旗: {flag}', en: 'AI-identified red flag: {flag}', ja: 'AIが特定したレッドフラグ: {flag}' },
  noRisk: { 'zh-CN': '未检测到安全风险，结果可自动展示。', 'zh-TW': '未檢測到安全風險，結果可自動展示。', en: 'No safety risks detected. Results can be displayed automatically.', ja: '安全リスクは検出されませんでした。結果は自動表示可能です。' },
  gateA: { 'zh-CN': '低风险，结果可自动展示。', 'zh-TW': '低風險，結果可自動展示。', en: 'Low risk. Results can be displayed automatically.', ja: '低リスク。結果は自動表示可能です。' },
  gateB: { 'zh-CN': '存在信息缺失，建议展示结果同时引导用户补充关键信息。', 'zh-TW': '存在資訊缺失，建議展示結果同時引導用戶補充關鍵資訊。', en: 'Missing information detected. Results shown with prompt to provide additional key information.', ja: '情報の欠落があります。結果を表示しつつ、重要な情報の補足を案内します。' },
  gateC: { 'zh-CN': '检测到潜在风险信号，结果需人工医疗顾问审核后再展示。', 'zh-TW': '檢測到潛在風險信號，結果需人工醫療顧問審核後再展示。', en: 'Potential risk signals detected. Results require review by a medical advisor before display.', ja: '潜在的なリスクシグナルが検出されました。結果は医療アドバイザーの審査後に表示されます。' },
  gateD: { 'zh-CN': '检测到疑似急症信号，需立即提示用户就近急诊就医。', 'zh-TW': '檢測到疑似急症信號，需立即提示用戶就近急診就醫。', en: 'Suspected emergency signals detected. User must be advised to seek immediate emergency care.', ja: '緊急性の高い所見が検出されました。直ちに最寄りの救急外来の受診を促す必要があります。' },
  triggeredRules: { 'zh-CN': '触发规则：', 'zh-TW': '觸發規則：', en: 'Triggered rules: ', ja: 'トリガーされたルール：' },
  judgeInconsistency: { 'zh-CN': 'AI Judge 检测到逻辑不一致: {desc}', 'zh-TW': 'AI Judge 檢測到邏輯不一致: {desc}', en: 'AI Judge detected logical inconsistency: {desc}', ja: 'AIジャッジが論理的な不整合を検出: {desc}' },
  judgeEscalate: { 'zh-CN': 'AI Judge 建议升级人工审核 ({count} 个不一致)', 'zh-TW': 'AI Judge 建議升級人工審核 ({count} 個不一致)', en: 'AI Judge recommends escalation ({count} inconsistencies)', ja: 'AIジャッジがエスカレーションを推奨（{count}件の不整合）' },
  // System names for XVAL-004
  cardiovascular: { 'zh-CN': '心血管', 'zh-TW': '心血管', en: 'cardiovascular', ja: '心血管' },
  renal: { 'zh-CN': '肾脏', 'zh-TW': '腎臟', en: 'renal', ja: '腎臓' },
  metabolic: { 'zh-CN': '代谢', 'zh-TW': '代謝', en: 'metabolic', ja: '代謝' },
};

function SL(key: string, lang: AEMCLang): string {
  return GATE_I18N[key]?.[lang] || GATE_I18N[key]?.['zh-CN'] || key;
}

// ============================================================
// 安全闸门配置常量
// ============================================================

/** AI-4 仲裁置信度低于此阈值触发人工升级 */
const CONFIDENCE_THRESHOLD = 0.7;

/** 缺失关键信息超过此数量触发补问 */
const MISSING_INFO_THRESHOLD = 3;

/** 年龄阈值 */
const PEDIATRIC_AGE = 14;
const ELDERLY_AGE = 75;

// ============================================================
// 主入口：评估安全等级
// ============================================================

export interface SafetyGateInput {
  case_packet: CasePacket;
  structured_case: StructuredCase;
  triage_assessment: TriageAssessment;
  challenge_review?: ChallengeReview;
  adjudicated_assessment: AdjudicatedAssessment;
  judge_verdict?: JudgeVerdict;
}

/**
 * 执行安全闸门评估
 *
 * 按优先级从高到低检查：
 * 1. D类（紧急）→ 2. C类（人工审核）→ 3. B类（补问）→ 4. A类（自动展示）
 *
 * 一旦命中高优先级规则，不会降级到低优先级。
 */
export function evaluateSafetyGate(input: SafetyGateInput): SafetyGateResult {
  const lang = (input.case_packet.language || 'zh-CN') as AEMCLang;
  const triggeredRules: TriggeredRule[] = [];

  // Step 1: 扫描红旗词典（基于原始文本和结构化数据）
  const redFlagTriggers = scanRedFlags(input.case_packet, input.structured_case, lang);
  triggeredRules.push(...redFlagTriggers);

  // Step 2: 检查年龄相关的高危人群
  const ageTriggers = checkAgeRisks(input.case_packet, lang);
  triggeredRules.push(...ageTriggers);

  // Step 3: 检查 AI 模型输出的一致性
  const modelTriggers = checkModelConsistency(
    input.triage_assessment,
    input.challenge_review,
    input.adjudicated_assessment,
    lang
  );
  triggeredRules.push(...modelTriggers);

  // Step 3b: LLM-as-Judge 逻辑一致性验证结果
  if (input.judge_verdict) {
    const judgeTriggers = checkJudgeVerdict(input.judge_verdict, lang);
    triggeredRules.push(...judgeTriggers);
  }

  // Step 4: 交叉验证（AI-1 红旗 vs AI-2 鉴别诊断覆盖度）
  const crossValidationTriggers = crossValidateRedFlagsVsDifferentials(
    input.structured_case,
    input.triage_assessment,
    lang
  );
  triggeredRules.push(...crossValidationTriggers);

  // Step 4b: 肿瘤标志物交叉验证 (XVAL-002)
  const tumorMarkerTriggers = crossValidateTumorMarkers(
    input.structured_case,
    input.triage_assessment,
    lang
  );
  triggeredRules.push(...tumorMarkerTriggers);

  // Step 4c: 心功能交叉验证 (XVAL-003)
  const cardiacTriggers = crossValidateCardiacFunction(
    input.structured_case,
    input.triage_assessment,
    lang
  );
  triggeredRules.push(...cardiacTriggers);

  // Step 4d: 多系统累及交叉验证 (XVAL-004)
  const multiSystemTriggers = crossValidateMultiSystem(
    input.structured_case,
    input.triage_assessment,
    lang
  );
  triggeredRules.push(...multiSystemTriggers);

  // Step 4e: 肝脏病变 + 乙肝/丙肝筛查交叉验证 (XVAL-005)
  const hepatitisTriggers = crossValidateHepatitisScreening(
    input.structured_case,
    input.triage_assessment,
    lang
  );
  triggeredRules.push(...hepatitisTriggers);

  // Step 4f: 疑似恶性肿瘤 + MDT 推荐交叉验证 (XVAL-006)
  const mdtTriggers = crossValidateMDTRecommendation(
    input.structured_case,
    input.triage_assessment,
    input.adjudicated_assessment,
    lang
  );
  triggeredRules.push(...mdtTriggers);

  // Step 5: 检查缺失信息量
  const missingInfoTriggers = checkMissingInfo(
    input.structured_case,
    input.adjudicated_assessment,
    lang
  );
  triggeredRules.push(...missingInfoTriggers);

  // Step 6: 确定最终安全分类
  const gateClass = determineGateClass(triggeredRules, input.adjudicated_assessment);

  return {
    gate_class: gateClass,
    triggered_rules: triggeredRules,
    allow_auto_display: gateClass === 'A',
    require_human_review: gateClass === 'C' || gateClass === 'D',
    require_emergency_notice: gateClass === 'D',
    require_followup_questions: gateClass === 'B',
    explanation: generateExplanation(gateClass, triggeredRules, lang),
  };
}

// ============================================================
// Step 1: 红旗词典扫描
// ============================================================

/**
 * 扫描所有文本内容，匹配红旗词典中的关键词
 * 同时检查结构化数据中的 red_flags 字段
 */
function scanRedFlags(
  casePacket: CasePacket,
  structuredCase: StructuredCase,
  lang: AEMCLang
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  // 收集所有需要扫描的文本
  const textCorpus = buildTextCorpus(casePacket, structuredCase);
  const normalizedText = normalizeText(textCorpus);

  // 逐条检查红旗规则
  for (const rule of ALL_RED_FLAG_RULES) {
    if (matchesRedFlagRule(rule, normalizedText)) {
      triggers.push({
        rule_id: rule.id,
        category: rule.category,
        // [AUDIT-FIX] 传递红旗规则自身的 severity，而非丢弃
        severity: rule.severity,
        description: `${rule.name_cn} (${rule.name_en})`,
        source: 'red_flag_lexicon',
      });
    }
  }

  // 同时检查 AI-1 提取的 red_flags（结构化数据中的红旗）
  // [AUDIT-FIX] 空值安全：red_flags 可能为 undefined
  if (structuredCase.red_flags && structuredCase.red_flags.length > 0) {
    // 将 AI 识别的红旗与词典交叉验证
    for (const aiFlag of structuredCase.red_flags) {
      const normalizedFlag = normalizeText(aiFlag);

      // [AUDIT-FIX] 修复交叉验证逻辑：
      // 旧代码检查 normalizedFlag.includes(t.rule_id) — 永远为 false
      // 新逻辑：检查已触发规则的描述中是否包含 AI flag 的关键内容
      const alreadyTriggered = triggers.some((t) =>
        normalizeText(t.description).includes(normalizedFlag) ||
        normalizedFlag.includes(normalizeText(t.description))
      );

      if (!alreadyTriggered) {
        // AI 发现了词典没覆盖的红旗，也记录下来
        // severity 设为 'emergency'：AI 标记的红旗应当触发 D 类安全闸门
        triggers.push({
          rule_id: `AI-FLAG-${triggers.length}`,
          category: 'emergency',
          severity: 'emergency',
          description: SL('aiRedFlag', lang).replace('{flag}', aiFlag),
          source: 'adjudication',
        });
      }
    }
  }

  return triggers;
}

/**
 * 汇集所有文本来源，构成完整的扫描语料
 *
 * [AUDIT-FIX] 补充了多个缺失的文本来源：
 * - follow_up_answers（症状追问答案）
 * - timeline events（时间线事件）
 * - allergy_history（过敏史）
 * - aggravating_factors / relieving_factors（加重/缓解因素）
 */
function buildTextCorpus(
  casePacket: CasePacket,
  structuredCase: StructuredCase
): string {
  const parts: string[] = [];

  // 原始文本
  for (const entry of casePacket.raw_text_bundle) {
    parts.push(entry.text);
  }

  // 上传的报告
  if (casePacket.uploaded_report_text) {
    parts.push(casePacket.uploaded_report_text);
  }

  // 症状名称 + 追问答案
  for (const symptom of casePacket.selected_symptoms) {
    parts.push(symptom.name);
    // [AUDIT-FIX] 新增：症状追问答案也纳入扫描
    for (const answer of Object.values(symptom.follow_up_answers)) {
      if (typeof answer === 'string') {
        parts.push(answer);
      } else if (Array.isArray(answer)) {
        parts.push(answer.join(' '));
      }
    }
  }

  // 问卷答案
  for (const answer of Object.values(casePacket.questionnaire_answers)) {
    if (typeof answer === 'string') {
      parts.push(answer);
    } else if (Array.isArray(answer)) {
      parts.push(answer.join(' '));
    }
  }

  // [AUDIT-FIX] 新增：时间线事件
  for (const event of casePacket.timeline) {
    parts.push(event.event);
  }

  // 结构化病历的关键字段
  parts.push(structuredCase.chief_complaint);
  for (const s of structuredCase.present_illness.symptoms) {
    parts.push(s.name);
    parts.push(s.evidence);
  }
  parts.push(...structuredCase.present_illness.associated_symptoms);
  // [AUDIT-FIX] 新增：加重/缓解因素
  parts.push(...structuredCase.present_illness.aggravating_factors);
  parts.push(...structuredCase.present_illness.relieving_factors);
  parts.push(...structuredCase.past_history);
  parts.push(...structuredCase.medication_history);
  // [AUDIT-FIX] 新增：过敏史
  parts.push(...structuredCase.allergy_history);
  parts.push(...structuredCase.known_diagnoses);
  parts.push(...structuredCase.exam_findings);

  return parts.join(' ');
}

/**
 * 文本标准化：转小写、去除多余空白
 */
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * 检查单条红旗规则是否命中
 */
function matchesRedFlagRule(rule: RedFlagRule, normalizedText: string): boolean {
  // 1. 检查直接关键词匹配
  if (rule.keywords.length > 0) {
    for (const keyword of rule.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        return true;
      }
    }
  }

  // 2. 检查组合触发条件
  if (rule.combo_trigger) {
    let matchCount = 0;
    for (const keyword of rule.combo_trigger.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    if (matchCount >= rule.combo_trigger.min_match) {
      return true;
    }
  }

  return false;
}

// ============================================================
// Step 2: 年龄风险检查
// ============================================================

function checkAgeRisks(casePacket: CasePacket, lang: AEMCLang): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];
  const age = casePacket.demographics.age;

  if (age !== undefined && age !== null) {
    if (age < PEDIATRIC_AGE) {
      triggers.push({
        rule_id: 'AGE-001',
        category: 'high_risk_population',
        // [AUDIT-FIX] 添加 severity 字段
        severity: 'high',
        description: SL('pediatric', lang).replace('{age}', String(age)),
        source: 'red_flag_lexicon',
      });
    }

    if (age > ELDERLY_AGE) {
      triggers.push({
        rule_id: 'AGE-002',
        category: 'high_risk_population',
        // [AUDIT-FIX] 添加 severity 字段
        severity: 'high',
        description: SL('elderly', lang).replace('{age}', String(age)),
        source: 'red_flag_lexicon',
      });
    }
  }

  return triggers;
}

// ============================================================
// Step 3: AI 模型输出一致性检查
// ============================================================

function checkModelConsistency(
  triage: TriageAssessment,
  challenge: ChallengeReview | undefined,
  adjudication: AdjudicatedAssessment,
  lang: AEMCLang
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  // 3a. 检查仲裁置信度
  // [AUDIT-FIX] 空值安全：confidence 为 undefined 时视为 0（fail-safe）
  if ((adjudication.confidence ?? 0) < CONFIDENCE_THRESHOLD) {
    triggers.push({
      rule_id: 'MODEL-001',
      category: 'low_confidence',
      severity: 'high',
      description: SL('lowConfidence', lang).replace('{val}', (adjudication.confidence ?? 0).toFixed(2)).replace('{thr}', String(CONFIDENCE_THRESHOLD)),
      source: 'adjudication',
    });
  }

  // 3b. 检查仲裁官是否主动要求升级
  if (adjudication.escalate_to_human) {
    triggers.push({
      rule_id: 'MODEL-002',
      category: 'model_conflict',
      severity: 'high',
      description: SL('escalateHuman', lang).replace('{reason}', adjudication.escalation_reason || ''),
      source: 'adjudication',
    });
  }

  // 3c. 检查分诊与挑战之间的关键冲突（V2 有挑战官时）
  if (challenge) {
    // 挑战官认为存在分诊不足风险
    if (challenge.under_triage_risk) {
      triggers.push({
        rule_id: 'MODEL-003',
        category: 'model_conflict',
        severity: 'high',
        description: SL('underTriage', lang),
        source: 'model_comparison',
      });
    }

    // 挑战官建议升级
    if (challenge.recommended_escalation) {
      triggers.push({
        rule_id: 'MODEL-004',
        category: 'model_conflict',
        severity: 'high',
        description: SL('challengerEscalate', lang),
        source: 'model_comparison',
      });
    }

    // 挑战官置信度也很低
    // [AUDIT-FIX] 空值安全
    if ((challenge.confidence ?? 0) < CONFIDENCE_THRESHOLD) {
      triggers.push({
        rule_id: 'MODEL-005',
        category: 'low_confidence',
        severity: 'high',
        description: SL('challengerLowConf', lang).replace('{val}', (challenge.confidence ?? 0).toFixed(2)),
        source: 'model_comparison',
      });
    }
  }

  // 3d. 分诊官认为需要急诊评估
  if (triage.needs_emergency_evaluation) {
    triggers.push({
      rule_id: 'MODEL-006',
      category: 'emergency',
      // [AUDIT-FIX] 急诊评估 = emergency 级别
      severity: 'emergency',
      description: SL('emergencyEval', lang),
      source: 'adjudication',
    });
  }

  // [AUDIT-FIX] 新增 3d-2: 分诊官认为需要医生审查
  if (triage.doctor_review_required) {
    triggers.push({
      rule_id: 'MODEL-008',
      category: 'model_conflict',
      severity: 'high',
      description: SL('doctorReview', lang),
      source: 'adjudication',
    });
  }

  // 3e. 分诊官与仲裁官的风险等级不一致
  const urgencyOrder: Record<string, number> = { low: 0, medium: 1, high: 2, emergency: 3 };
  // [AUDIT-FIX] 默认值从 0 改为 3（fail-safe: 未知等级视为最高风险）
  const triageLevel = urgencyOrder[triage.urgency_level] ?? 3;
  const adjudicationLevel = urgencyOrder[adjudication.final_risk_level] ?? 3;
  if (Math.abs(triageLevel - adjudicationLevel) >= 2) {
    triggers.push({
      rule_id: 'MODEL-007',
      category: 'model_conflict',
      severity: 'high',
      description: SL('riskMismatch', lang).replace('{triage}', triage.urgency_level).replace('{adj}', adjudication.final_risk_level),
      source: 'model_comparison',
    });
  }

  return triggers;
}

// ============================================================
// Step 4: 红旗 vs 鉴别诊断交叉验证
// ============================================================

/**
 * 检查 AI-1 提取的 red_flags 是否被 AI-2 的鉴别诊断覆盖。
 * 如果 AI-1 发现红旗但 AI-2 的 differential_directions 和
 * do_not_miss_conditions 中都未提及，则说明分诊可能遗漏了危险信号。
 */
function crossValidateRedFlagsVsDifferentials(
  structuredCase: StructuredCase,
  triage: TriageAssessment,
  lang: AEMCLang
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  if (!structuredCase.red_flags || structuredCase.red_flags.length === 0) {
    return triggers;
  }

  // 收集 AI-2 已覆盖的所有条目文本
  const triageCoverage = [
    ...triage.differential_directions.map((d) => d.name + ' ' + d.reason),
    ...triage.do_not_miss_conditions,
    triage.reasoning_summary,
  ]
    .join(' ')
    .toLowerCase();

  // 检查每个红旗是否被覆盖
  const uncoveredFlags: string[] = [];
  for (const flag of structuredCase.red_flags) {
    const flagLower = flag.toLowerCase();
    // 提取关键词（取前3个字符以容许部分匹配）
    const flagKeywords = flagLower
      .split(/[,，、\s/]+/)
      .filter((k) => k.length >= 2);

    const isCovered = flagKeywords.some((keyword) =>
      triageCoverage.includes(keyword)
    );

    if (!isCovered) {
      uncoveredFlags.push(flag);
    }
  }

  if (uncoveredFlags.length > 0) {
    triggers.push({
      rule_id: 'XVAL-001',
      category: 'model_conflict',
      severity: 'high',
      description: SL('uncoveredFlags', lang).replace('{count}', String(uncoveredFlags.length)).replace('{flags}', uncoveredFlags.join('、')),
      source: 'model_comparison',
    });
  }

  return triggers;
}

// ============================================================
// Step 4b: 肿瘤标志物交叉验证 (XVAL-002)
// ============================================================

/**
 * 检查 AI-1 提取的 exam_findings 中是否有升高的肿瘤标志物，
 * 但 AI-2 的 suggested_tests 中没有相应的肿瘤排查检查。
 */
function crossValidateTumorMarkers(
  structuredCase: StructuredCase,
  triage: TriageAssessment,
  lang: AEMCLang
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  const tumorMarkerKeywords = [
    'scc', 'cyfra', 'cea', 'afp', 'ca19-9', 'ca 19-9', 'ca125', 'ca 125',
    'psa', 'nse', 'progrp', '肿瘤标志物', '腫瘍マーカー',
    '鳞状细胞癌', '癌胚抗原', '甲胎蛋白',
  ];

  const findingsText = structuredCase.exam_findings.join(' ').toLowerCase();
  const diagnosesText = structuredCase.known_diagnoses.join(' ').toLowerCase();
  const redFlagsText = structuredCase.red_flags.join(' ').toLowerCase();
  const combinedPatient = findingsText + ' ' + diagnosesText + ' ' + redFlagsText;

  // 检查是否有升高的肿瘤标志物
  const hasTumorMarkers = tumorMarkerKeywords.some((kw) =>
    combinedPatient.includes(kw)
  );
  // 额外检查：异常标记
  const hasAbnormalMarker =
    combinedPatient.includes('升高') ||
    combinedPatient.includes('异常') ||
    combinedPatient.includes('高值') ||
    combinedPatient.includes('上昇') ||
    combinedPatient.includes('elevated') ||
    combinedPatient.includes('abnormal');

  if (!hasTumorMarkers || !hasAbnormalMarker) {
    return triggers;
  }

  // 检查 AI-2 是否包含肿瘤排查
  const triageCoverage = [
    ...triage.suggested_tests,
    ...triage.differential_directions.map((d) => d.name + ' ' + d.reason),
    ...triage.do_not_miss_conditions,
  ]
    .join(' ')
    .toLowerCase();

  const oncologyKeywords = [
    'pet', 'ct', '腫瘍', '腫瘍科', 'oncolog', '癌', 'cancer', 'malignancy',
    '悪性', '精查', '生検', 'biopsy', '腫瘤', '肿瘤',
  ];

  const hasOncologyWorkup = oncologyKeywords.some((kw) =>
    triageCoverage.includes(kw)
  );

  if (!hasOncologyWorkup) {
    triggers.push({
      rule_id: 'XVAL-002',
      category: 'oncology',
      severity: 'high',
      description: SL('tumorNoWorkup', lang),
      source: 'model_comparison',
    });
  }

  return triggers;
}

// ============================================================
// Step 4c: 心功能交叉验证 (XVAL-003)
// ============================================================

/**
 * 检查 AI-1 提取的心功能异常指标（低 EF、Strain↓、TAPSE↓），
 * 但 AI-2 未推荐 BNP/NT-proBNP 或心内科随访。
 */
function crossValidateCardiacFunction(
  structuredCase: StructuredCase,
  triage: TriageAssessment,
  lang: AEMCLang
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  const cardiacAbnormalityKeywords = [
    'lvef', 'ef ', 'ef:', 'ef=', 'ef<', '射血分数', '駆出率',
    'strain', 'tapse', 'wall motion', '壁運動', '壁运动',
    '心機能低下', '心功能低下', '心不全', '心力衰竭',
  ];

  const findingsText = structuredCase.exam_findings.join(' ').toLowerCase();
  const diagnosesText = structuredCase.known_diagnoses.join(' ').toLowerCase();
  const combinedPatient = findingsText + ' ' + diagnosesText;

  const hasCardiacAbnormality = cardiacAbnormalityKeywords.some((kw) =>
    combinedPatient.includes(kw)
  );

  if (!hasCardiacAbnormality) {
    return triggers;
  }

  // 检查 AI-2 是否包含心功能相关检查/随访
  const triageCoverage = [
    ...triage.suggested_tests,
    ...triage.recommended_departments,
    ...triage.differential_directions.map((d) => d.name),
  ]
    .join(' ')
    .toLowerCase();

  const cardiacWorkupKeywords = [
    'bnp', 'nt-probnp', 'ntprobnp', '心不全', 'heart failure',
    '循環器', '心臓', '心内科', 'cardiol', '心エコー', '心超',
  ];

  const hasCardiacWorkup = cardiacWorkupKeywords.some((kw) =>
    triageCoverage.includes(kw)
  );

  if (!hasCardiacWorkup) {
    triggers.push({
      rule_id: 'XVAL-003',
      category: 'cardiovascular',
      severity: 'high',
      description: SL('cardiacNoWorkup', lang),
      source: 'model_comparison',
    });
  }

  return triggers;
}

// ============================================================
// Step 4d: 多系统累及交叉验证 (XVAL-004)
// ============================================================

/**
 * 检查是否存在多系统同时受累（心血管+肾脏+代谢），
 * 但 AI-2 的 urgency_level 仍为 low 或 medium。
 * 多系统疾病通常表示更高风险。
 */
function crossValidateMultiSystem(
  structuredCase: StructuredCase,
  triage: TriageAssessment,
  lang: AEMCLang
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  const combinedText = [
    ...structuredCase.exam_findings,
    ...structuredCase.known_diagnoses,
    ...structuredCase.past_history,
  ]
    .join(' ')
    .toLowerCase();

  // 计算受累系统数
  let systemCount = 0;
  const systems: string[] = [];

  // 心血管系统
  const cardioKeywords = [
    'agatston', '冠動脈', '冠动脉', 'coronary', '心筋', '心肌',
    '狭窄', 'stenosis', '心房細動', '房颤', 'atrial fibrillation',
    '高血圧', '高血压', 'hypertension', '動脈硬化', '动脉硬化',
  ];
  if (cardioKeywords.some((kw) => combinedText.includes(kw))) {
    systemCount++;
    systems.push(SL('cardiovascular', lang));
  }

  // 肾脏系统
  const renalKeywords = [
    'ckd', '慢性腎', '慢性肾', 'egfr', '肌酐', 'creatinine',
    'クレアチニン', '腎機能', '肾功能', '蛋白尿', 'proteinuria',
  ];
  if (renalKeywords.some((kw) => combinedText.includes(kw))) {
    systemCount++;
    systems.push(SL('renal', lang));
  }

  // 代谢系统
  const metabolicKeywords = [
    '糖尿病', 'diabetes', 'hba1c', '血脂', 'dyslipidemia',
    '脂質異常', '脂质异常', '高脂血', 'ldl', '肥満', '肥胖',
    'メタボリック', '代谢综合',
  ];
  if (metabolicKeywords.some((kw) => combinedText.includes(kw))) {
    systemCount++;
    systems.push(SL('metabolic', lang));
  }

  // 3个系统都受累 + urgency 仅 low/medium → 可能分诊不足
  if (
    systemCount >= 3 &&
    (triage.urgency_level === 'low' || triage.urgency_level === 'medium')
  ) {
    triggers.push({
      rule_id: 'XVAL-004',
      category: 'model_conflict',
      severity: 'high',
      description: SL('multiSystem', lang).replace('{systems}', systems.join('+')).replace('{count}', String(systemCount)).replace('{level}', triage.urgency_level),
      source: 'model_comparison',
    });
  }

  return triggers;
}

// ============================================================
// Step 4e: 肝脏病变 + 乙肝/丙肝筛查 (XVAL-005)
// ============================================================

/**
 * 中国/东亚患者的肝脏病变（肝占位/肝癌疑似/肝硬化等）
 * 必须包含 HBV/HCV 筛查。HBV 是中国肝细胞癌的首要病因（~85%）。
 */
function crossValidateHepatitisScreening(
  structuredCase: StructuredCase,
  triage: TriageAssessment,
  lang: AEMCLang
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  const combinedPatient = [
    ...structuredCase.exam_findings,
    ...structuredCase.known_diagnoses,
    ...structuredCase.red_flags,
    structuredCase.chief_complaint,
  ]
    .join(' ')
    .toLowerCase();

  // 检查是否存在肝脏病变
  const liverLesionKeywords = [
    '肝占位', '肝脏占位', '肝转移', '肝细胞癌', '肝癌', '肝硬化',
    '肝脏肿瘤', '肝脏肿块', '肝脏结节', '肝内', '门脉',
    'hepatocellular', 'liver mass', 'liver lesion', 'liver tumor',
    'liver metasta', 'hepatic', 'cirrhosis', 'portal',
    '肝腫瘍', '肝転移', '肝硬変', '門脈',
  ];

  const hasLiverLesion = liverLesionKeywords.some((kw) =>
    combinedPatient.includes(kw)
  );

  if (!hasLiverLesion) {
    return triggers;
  }

  // 检查 AI-2 是否推荐了 HBV/HCV 筛查
  const triageCoverage = [
    ...triage.suggested_tests,
    ...triage.differential_directions.map((d) => d.name + ' ' + d.reason),
    triage.reasoning_summary,
  ]
    .join(' ')
    .toLowerCase();

  const hepatitisScreeningKeywords = [
    'hbv', 'hcv', 'hbsag', '乙肝', '丙肝', 'hepatitis b', 'hepatitis c',
    'b型肝炎', 'c型肝炎', '肝炎ウイルス', '肝炎病毒',
  ];

  const hasHepatitisScreening = hepatitisScreeningKeywords.some((kw) =>
    triageCoverage.includes(kw)
  );

  if (!hasHepatitisScreening) {
    triggers.push({
      rule_id: 'XVAL-005',
      category: 'oncology',
      severity: 'high',
      description: SL('hepatitisNoScreen', lang),
      source: 'model_comparison',
    });
  }

  return triggers;
}

// ============================================================
// Step 4f: 疑似恶性肿瘤 + MDT 推荐 (XVAL-006)
// ============================================================

/**
 * 多系统肿瘤累及（如肝转移+淋巴结转移+骨转移）或高度疑似恶性肿瘤
 * 必须推荐 MDT（多学科会诊）。
 */
function crossValidateMDTRecommendation(
  structuredCase: StructuredCase,
  triage: TriageAssessment,
  adjudication: AdjudicatedAssessment,
  lang: AEMCLang
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  const combinedPatient = [
    ...structuredCase.exam_findings,
    ...structuredCase.known_diagnoses,
    ...structuredCase.red_flags,
  ]
    .join(' ')
    .toLowerCase();

  // 检查是否存在多部位转移或高度疑似恶性肿瘤
  const metastasisKeywords = [
    '转移', 'metasta', '転移', '浸润', 'invasion', '浸潤',
  ];
  const malignancyKeywords = [
    '恶性', '癌', 'cancer', 'malignancy', 'carcinoma', 'sarcoma',
    '悪性', '腫瘍', '肿瘤',
  ];

  const hasMetastasis = metastasisKeywords.some((kw) =>
    combinedPatient.includes(kw)
  );
  const hasMalignancy = malignancyKeywords.some((kw) =>
    combinedPatient.includes(kw)
  );

  // 需要 MDT 的条件：存在转移 OR (高度疑似恶性 + 高风险)
  const needsMDT =
    hasMetastasis ||
    (hasMalignancy &&
      (adjudication.final_risk_level === 'high' ||
        adjudication.final_risk_level === 'emergency'));

  if (!needsMDT) {
    return triggers;
  }

  // 检查是否已推荐 MDT
  const allOutput = [
    ...triage.suggested_tests,
    ...triage.recommended_departments,
    ...triage.differential_directions.map((d) => d.name + ' ' + d.reason),
    triage.reasoning_summary,
    adjudication.final_summary,
    ...adjudication.critical_reasons,
  ]
    .join(' ')
    .toLowerCase();

  const mdtKeywords = [
    'mdt', '多学科', '多科', 'multidisciplinary', 'tumor board',
    'カンファレンス', '集学的', '合同カンファ',
  ];

  const hasMDTRecommendation = mdtKeywords.some((kw) =>
    allOutput.includes(kw)
  );

  if (!hasMDTRecommendation) {
    triggers.push({
      rule_id: 'XVAL-006',
      category: 'oncology',
      severity: 'high',
      description: SL('mdtNotRecommended', lang),
      source: 'model_comparison',
    });
  }

  return triggers;
}

// ============================================================
// Step 3b: LLM-as-Judge 逻辑一致性验证
// ============================================================

/**
 * 检查 AI-5 Judge 的验证结果。
 * 如果 Judge 发现逻辑不一致且建议升级，触发 C 类规则。
 */
function checkJudgeVerdict(verdict: JudgeVerdict, lang: AEMCLang): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  if (verdict.is_logically_consistent) {
    return triggers;
  }

  // 有 high severity 不一致 → 触发 model_conflict
  const highSeverity = verdict.inconsistencies.filter((i) => i.severity === 'high');
  for (const inc of highSeverity) {
    triggers.push({
      rule_id: `JUDGE-${triggers.length + 1}`.padStart(10, '0').slice(-8),
      category: 'model_conflict',
      severity: 'high',
      description: SL('judgeInconsistency', lang).replace('{desc}', inc.description),
      source: 'model_comparison',
    });
  }

  // Judge 建议升级且有不一致（但无 high severity 单项）→ 整体触发
  if (verdict.should_escalate && highSeverity.length === 0) {
    triggers.push({
      rule_id: 'JUDGE-ESC',
      category: 'model_conflict',
      severity: 'high',
      description: SL('judgeEscalate', lang).replace('{count}', String(verdict.inconsistencies.length)),
      source: 'model_comparison',
    });
  }

  return triggers;
}

// ============================================================
// Step 5: 缺失信息检查
// ============================================================

function checkMissingInfo(
  structuredCase: StructuredCase,
  adjudication: AdjudicatedAssessment,
  lang: AEMCLang
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  // 合并 AI-1 和 AI-4 发现的缺失信息
  const allMissing = new Set([
    ...structuredCase.missing_critical_info,
    ...adjudication.must_ask_followups,
  ]);

  if (allMissing.size > MISSING_INFO_THRESHOLD) {
    triggers.push({
      rule_id: 'INFO-001',
      category: 'missing_info',
      severity: 'high',
      description: SL('missingInfo', lang).replace('{count}', String(allMissing.size)),
      source: 'adjudication',
    });
  }

  return triggers;
}

// ============================================================
// Step 5: 确定最终安全分类
// ============================================================

/**
 * 安全分类决策逻辑：
 *
 * [AUDIT-FIX] 关键修复：使用 severity 字段（而非 category）判断 D 类
 *
 * D类（紧急提示）：任何 severity === 'emergency' 的触发规则
 * C类（人工审核）：high 级别红旗 / 模型冲突 / 低置信度 / 仲裁官要求升级
 * B类（展示+补问）：缺失信息较多 但无紧急/高风险信号
 * A类（自动展示）：无触发规则 + 低风险 + 模型一致 + 信息完整
 */
function determineGateClass(
  triggers: TriggeredRule[],
  adjudication: AdjudicatedAssessment
): SafetyGateClass {
  // D类：有 severity === 'emergency' 的触发
  // [AUDIT-FIX] 旧代码用 category === 'emergency'，导致心梗/脑卒中/消化道出血
  // 等 cardiovascular/neurological/gastrointestinal 类的 emergency 级别规则
  // 永远不会触发 D 类紧急提示 — 这是致命 bug
  const hasEmergencyTrigger = triggers.some(
    (t) => t.severity === 'emergency'
  );
  if (hasEmergencyTrigger) {
    return 'D';
  }

  // C类：有高危人群 / 肿瘤红旗 / 模型冲突 / 低置信度 / 仲裁要求升级
  const hasCClassTrigger = triggers.some(
    (t) =>
      t.category === 'high_risk_population' ||
      t.category === 'oncology' ||
      t.category === 'model_conflict' ||
      t.category === 'low_confidence'
  );
  if (hasCClassTrigger) {
    return 'C';
  }

  // 仲裁结果本身是 high 或 emergency
  if (
    adjudication.final_risk_level === 'high' ||
    adjudication.final_risk_level === 'emergency'
  ) {
    return 'C';
  }

  // 仲裁官认为不安全直接展示
  if (!adjudication.safe_to_auto_display) {
    return 'C';
  }

  // B类：有缺失信息触发
  const hasMissingInfoTrigger = triggers.some(
    (t) => t.category === 'missing_info'
  );
  if (hasMissingInfoTrigger) {
    return 'B';
  }

  // A类：全部通过
  return 'A';
}

// ============================================================
// 生成人类可读的安全评估说明
// ============================================================

function generateExplanation(
  gateClass: SafetyGateClass,
  triggers: TriggeredRule[],
  lang: AEMCLang
): string {
  if (triggers.length === 0) {
    return SL('noRisk', lang);
  }

  const classDescriptions: Record<SafetyGateClass, string> = {
    A: SL('gateA', lang),
    B: SL('gateB', lang),
    C: SL('gateC', lang),
    D: SL('gateD', lang),
  };

  const triggerSummary = triggers
    .map((t) => `[${t.rule_id}] ${t.description}`)
    .join('；');

  return `${classDescriptions[gateClass]} ${SL('triggeredRules', lang)}${triggerSummary}`;
}
