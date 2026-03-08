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
} from './types';

import {
  ALL_RED_FLAG_RULES,
  type RedFlagRule,
} from './red-flags';

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
  const triggeredRules: TriggeredRule[] = [];

  // Step 1: 扫描红旗词典（基于原始文本和结构化数据）
  const redFlagTriggers = scanRedFlags(input.case_packet, input.structured_case);
  triggeredRules.push(...redFlagTriggers);

  // Step 2: 检查年龄相关的高危人群
  const ageTriggers = checkAgeRisks(input.case_packet);
  triggeredRules.push(...ageTriggers);

  // Step 3: 检查 AI 模型输出的一致性
  const modelTriggers = checkModelConsistency(
    input.triage_assessment,
    input.challenge_review,
    input.adjudicated_assessment
  );
  triggeredRules.push(...modelTriggers);

  // Step 4: 检查缺失信息量
  const missingInfoTriggers = checkMissingInfo(
    input.structured_case,
    input.adjudicated_assessment
  );
  triggeredRules.push(...missingInfoTriggers);

  // Step 5: 确定最终安全分类
  const gateClass = determineGateClass(triggeredRules, input.adjudicated_assessment);

  return {
    gate_class: gateClass,
    triggered_rules: triggeredRules,
    allow_auto_display: gateClass === 'A',
    require_human_review: gateClass === 'C' || gateClass === 'D',
    require_emergency_notice: gateClass === 'D',
    require_followup_questions: gateClass === 'B',
    explanation: generateExplanation(gateClass, triggeredRules),
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
  structuredCase: StructuredCase
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
        // [AUDIT-FIX] 添加 severity: 'high'（保守策略，AI-only 红旗默认 high）
        triggers.push({
          rule_id: `AI-FLAG-${triggers.length}`,
          category: 'emergency',
          severity: 'high',
          description: `AI 识别红旗: ${aiFlag}`,
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

function checkAgeRisks(casePacket: CasePacket): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];
  const age = casePacket.demographics.age;

  if (age !== undefined && age !== null) {
    if (age < PEDIATRIC_AGE) {
      triggers.push({
        rule_id: 'AGE-001',
        category: 'high_risk_population',
        // [AUDIT-FIX] 添加 severity 字段
        severity: 'high',
        description: `儿童患者 (${age}岁)，需专业儿科评估`,
        source: 'red_flag_lexicon',
      });
    }

    if (age > ELDERLY_AGE) {
      triggers.push({
        rule_id: 'AGE-002',
        category: 'high_risk_population',
        // [AUDIT-FIX] 添加 severity 字段
        severity: 'high',
        description: `高龄患者 (${age}岁)，需考虑多病共存和药物相互作用`,
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
  adjudication: AdjudicatedAssessment
): TriggeredRule[] {
  const triggers: TriggeredRule[] = [];

  // 3a. 检查仲裁置信度
  // [AUDIT-FIX] 空值安全：confidence 为 undefined 时视为 0（fail-safe）
  if ((adjudication.confidence ?? 0) < CONFIDENCE_THRESHOLD) {
    triggers.push({
      rule_id: 'MODEL-001',
      category: 'low_confidence',
      severity: 'high',
      description: `仲裁置信度过低 (${(adjudication.confidence ?? 0).toFixed(2)} < ${CONFIDENCE_THRESHOLD})`,
      source: 'adjudication',
    });
  }

  // 3b. 检查仲裁官是否主动要求升级
  if (adjudication.escalate_to_human) {
    triggers.push({
      rule_id: 'MODEL-002',
      category: 'model_conflict',
      severity: 'high',
      description: `仲裁官要求人工升级: ${adjudication.escalation_reason}`,
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
        description: '挑战官检测到分诊不足风险 (under-triage)',
        source: 'model_comparison',
      });
    }

    // 挑战官建议升级
    if (challenge.recommended_escalation) {
      triggers.push({
        rule_id: 'MODEL-004',
        category: 'model_conflict',
        severity: 'high',
        description: '挑战官建议升级人工审核',
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
        description: `挑战官置信度过低 (${(challenge.confidence ?? 0).toFixed(2)})`,
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
      description: '分诊官建议急诊评估',
      source: 'adjudication',
    });
  }

  // [AUDIT-FIX] 新增 3d-2: 分诊官认为需要医生审查
  if (triage.doctor_review_required) {
    triggers.push({
      rule_id: 'MODEL-008',
      category: 'model_conflict',
      severity: 'high',
      description: '分诊官认为需要医生审查',
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
      description: `分诊(${triage.urgency_level})与仲裁(${adjudication.final_risk_level})风险等级差异过大`,
      source: 'model_comparison',
    });
  }

  return triggers;
}

// ============================================================
// Step 4: 缺失信息检查
// ============================================================

function checkMissingInfo(
  structuredCase: StructuredCase,
  adjudication: AdjudicatedAssessment
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
      description: `缺失关键信息过多 (${allMissing.size} 项)，影响分诊准确性`,
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
  triggers: TriggeredRule[]
): string {
  if (triggers.length === 0) {
    return '未检测到安全风险，结果可自动展示。';
  }

  const classDescriptions: Record<SafetyGateClass, string> = {
    A: '低风险，结果可自动展示。',
    B: '存在信息缺失，建议展示结果同时引导用户补充关键信息。',
    C: '检测到潜在风险信号，结果需人工医疗顾问审核后再展示。',
    D: '检测到疑似急症信号，需立即提示用户就近急诊就医。',
  };

  const triggerSummary = triggers
    .map((t) => `[${t.rule_id}] ${t.description}`)
    .join('；');

  return `${classDescriptions[gateClass]} 触发规则：${triggerSummary}`;
}
