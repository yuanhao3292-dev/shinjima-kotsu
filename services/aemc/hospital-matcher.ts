/**
 * AEMC Hospital Matcher
 *
 * 确定性规则引擎：根据 AI 分诊结果匹配最合适的合作医院。
 * 不调用任何 AI API，纯本地计算。
 *
 * 匹配逻辑：
 * 1. 科室匹配（权重最高）
 * 2. 症状/疾病关键词匹配
 * 3. 急症能力匹配
 * 4. 风险等级适配
 * 5. 优先级加权
 *
 * 输出 top-N 推荐，附带匹配理由和注意事项。
 */

import type {
  StructuredCase,
  TriageAssessment,
  AdjudicatedAssessment,
  HospitalRecommendation,
  HospitalMatch,
} from './types';

import {
  HOSPITAL_KNOWLEDGE_BASE,
  normalizeDepartment,
  getLocalizedHospitalInfo,
  getLocalizedDepartment,
  type HospitalKnowledge,
  type AEMCLang,
} from './hospital-knowledge-base';

// ============================================================
// 配置
// ============================================================

/** 最多推荐医院数量 */
const MAX_RECOMMENDATIONS = 3;

/** 最低匹配分数阈值（低于此分的医院不推荐） */
const MIN_MATCH_SCORE = 0.15;

/** 匹配权重 */
const WEIGHTS = {
  /** 科室直接匹配（最高权重） */
  departmentMatch: 0.40,
  /** 专科/治疗方向匹配 */
  specialtyMatch: 0.25,
  /** 症状/疾病关键词匹配 */
  conditionMatch: 0.15,
  /** 急症能力匹配 */
  emergencyMatch: 0.10,
  /** 机构优先级（规模/综合性） */
  priorityBonus: 0.10,
};

// ============================================================
// 多语言标签
// ============================================================

const MATCHER_LABELS: Record<string, Record<AEMCLang, string>> = {
  deptMatch: {
    'zh-CN': '科室匹配', 'zh-TW': '科室匹配', en: 'Department match', ja: '診療科一致',
  },
  deptRelated: {
    'zh-CN': '科室相关', 'zh-TW': '科室相關', en: 'Related department', ja: '関連診療科',
  },
  deptNeeded: {
    'zh-CN': '需求', 'zh-TW': '需求', en: 'needed', ja: '必要',
  },
  specialtyMatch: {
    'zh-CN': '专科匹配', 'zh-TW': '專科匹配', en: 'Specialty match', ja: '専門分野一致',
  },
  conditionMatch: {
    'zh-CN': '个症状/疾病关键词匹配', 'zh-TW': '個症狀/疾病關鍵詞匹配',
    en: ' symptom/condition keyword match(es)', ja: '件の症状/疾患キーワード一致',
  },
  hasEmergency: {
    'zh-CN': '具备急诊处理能力', 'zh-TW': '具備急診處理能力',
    en: 'Emergency care capability', ja: '救急対応可能',
  },
  noEmergency: {
    'zh-CN': '该机构不具备急诊能力，紧急情况请就近就医',
    'zh-TW': '該機構不具備急診能力，緊急情況請就近就醫',
    en: 'This facility does not have emergency capability. In emergencies, please seek nearby medical care.',
    ja: 'この施設には救急対応能力がありません。緊急時は最寄りの医療機関を受診してください。',
  },
  clinicCaution: {
    'zh-CN': '该机构为诊所（无住院床位），高风险患者可能需要综合医院',
    'zh-TW': '該機構為診所（無住院床位），高風險患者可能需要綜合醫院',
    en: 'This is a clinic (no inpatient beds). High-risk patients may require a general hospital.',
    ja: 'この施設はクリニック（入院ベッドなし）です。高リスク患者は総合病院が必要な場合があります。',
  },
  noRemote: {
    'zh-CN': '该机构暂不提供线上会诊', 'zh-TW': '該機構暫不提供線上會診',
    en: 'Remote consultation not currently available', ja: 'オンライン診療は現在対応していません',
  },
  noMatch: {
    'zh-CN': '未找到匹配的合作机构，建议联系人工客服进行分诊协调。',
    'zh-TW': '未找到匹配的合作機構，建議聯繫人工客服進行分診協調。',
    en: 'No matching partner facility found. Please contact our team for triage coordination.',
    ja: '該当する提携施設が見つかりませんでした。トリアージのコーディネートについてはスタッフにお問い合わせください。',
  },
  emergencyRouting: {
    'zh-CN': '⚠️ 检测到紧急情况，建议立即就近急诊。如需后续专科治疗，可联系我们协调转诊。',
    'zh-TW': '⚠️ 檢測到緊急情況，建議立即就近急診。如需後續專科治療，可聯繫我們協調轉診。',
    en: '⚠️ Emergency detected. Please seek immediate medical care at the nearest facility. Contact us for specialist referral coordination.',
    ja: '⚠️ 緊急事態が検出されました。最寄りの医療機関で直ちに受診してください。専門的な治療の手配はスタッフにご連絡ください。',
  },
  highMatchRouting: {
    'zh-CN': '推荐优先联系「{name}」的{dept}进行咨询。',
    'zh-TW': '推薦優先聯繫「{name}」的{dept}進行諮詢。',
    en: 'We recommend contacting {dept} at "{name}" for consultation.',
    ja: '「{name}」の{dept}への相談をお勧めします。',
  },
  defaultRouting: {
    'zh-CN': '根据您的症状，建议咨询「{name}」。具体科室安排以医院回复为准。',
    'zh-TW': '根據您的症狀，建議諮詢「{name}」。具體科室安排以醫院回覆為準。',
    en: 'Based on your symptoms, we suggest consulting "{name}". Specific department arrangements are subject to the hospital\'s response.',
    ja: '症状に基づき、「{name}」への相談をお勧めします。具体的な診療科は病院の回答に基づきます。',
  },
};

function ML(key: string, lang: AEMCLang): string {
  return MATCHER_LABELS[key]?.[lang] || MATCHER_LABELS[key]?.['zh-CN'] || key;
}

// ============================================================
// 主入口
// ============================================================

/**
 * 根据分诊结果匹配合适的医院
 *
 * @param structuredCase AI-1 抽取的病历
 * @param triageAssessment AI-2 分诊判断
 * @param adjudicatedAssessment AI-4 仲裁结果
 * @param language 输出语言
 * @returns HospitalRecommendation
 */
export function matchHospitals(
  structuredCase: StructuredCase,
  triageAssessment: TriageAssessment,
  adjudicatedAssessment: AdjudicatedAssessment,
  language?: string
): HospitalRecommendation {
  const lang = (language || 'zh-CN') as AEMCLang;

  // 提取匹配特征
  const features = extractMatchingFeatures(
    structuredCase,
    triageAssessment,
    adjudicatedAssessment
  );

  // 对每个医院计算匹配分数
  const scoredHospitals: ScoredHospital[] = HOSPITAL_KNOWLEDGE_BASE.map((hospital) => {
    const scoreResult = calculateMatchScore(hospital, features, lang);
    return {
      hospital,
      score: scoreResult.score,
      matchReasons: scoreResult.matchReasons,
      cautions: scoreResult.cautions,
      departmentMatched: scoreResult.departmentMatched,
    };
  });

  // 排序：分数降序 → 优先级降序 → ID 字母序（确保完全确定性）
  scoredHospitals.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.hospital.priority !== b.hospital.priority) return b.hospital.priority - a.hospital.priority;
    return a.hospital.id.localeCompare(b.hospital.id);
  });

  // 过滤低于阈值的
  const qualified = scoredHospitals.filter((s) => s.score >= MIN_MATCH_SCORE);

  // 取 top-N
  const topN = qualified.slice(0, MAX_RECOMMENDATIONS);

  // 构建输出（使用本地化名称）
  const recommendedHospitals: HospitalMatch[] = topN.map((s) => {
    const localized = getLocalizedHospitalInfo(s.hospital, lang);
    return {
      hospital_id: s.hospital.id,
      hospital_name: localized.name,
      department: getLocalizedDepartment(s.departmentMatched || s.hospital.departments[0], lang),
      match_score: Math.round(s.score * 100) / 100,
      match_reasons: s.matchReasons,
      cautions: s.cautions,
    };
  });

  // 路由建议
  const routingSuggestion = generateRoutingSuggestion(topN, features, lang);

  // 是否需要人工协调员介入
  const requiresManualReview =
    features.isEmergency ||
    features.riskLevel === 'emergency' ||
    features.normalizedDepartments.length === 0 ||
    qualified.length === 0;

  return {
    recommended_hospitals: recommendedHospitals,
    routing_suggestion: routingSuggestion,
    requires_manual_coordinator_review: requiresManualReview,
  };
}

// ============================================================
// 内部类型
// ============================================================

interface MatchingFeatures {
  /** 标准化后的推荐科室 */
  normalizedDepartments: string[];
  /** 原始科室名称 */
  rawDepartments: string[];
  /** 症状名称列表 */
  symptoms: string[];
  /** 鉴别方向 */
  differentialNames: string[];
  /** 建议检查 */
  suggestedTests: string[];
  /** 红旗标志 */
  redFlags: string[];
  /** 是否需要急诊 */
  isEmergency: boolean;
  /** 最终风险等级 */
  riskLevel: string;
  /** 主诉文本 */
  chiefComplaint: string;
}

interface ScoredHospital {
  hospital: HospitalKnowledge;
  score: number;
  matchReasons: string[];
  cautions: string[];
  departmentMatched: string;
}

interface ScoreResult {
  score: number;
  matchReasons: string[];
  cautions: string[];
  departmentMatched: string;
}

// ============================================================
// 特征提取
// ============================================================

function extractMatchingFeatures(
  structuredCase: StructuredCase,
  triageAssessment: TriageAssessment,
  adjudicatedAssessment: AdjudicatedAssessment
): MatchingFeatures {
  const rawDepartments = adjudicatedAssessment.final_departments;
  const normalizedDepartments = rawDepartments.map(normalizeDepartment);

  const symptoms = structuredCase.present_illness.symptoms.map((s) => s.name);

  const differentialNames = triageAssessment.differential_directions.map((d) => d.name);

  return {
    normalizedDepartments,
    rawDepartments,
    symptoms,
    differentialNames,
    suggestedTests: triageAssessment.suggested_tests,
    redFlags: structuredCase.red_flags,
    isEmergency: triageAssessment.needs_emergency_evaluation,
    riskLevel: adjudicatedAssessment.final_risk_level,
    chiefComplaint: structuredCase.chief_complaint,
  };
}

// ============================================================
// 分数计算
// ============================================================

function calculateMatchScore(
  hospital: HospitalKnowledge,
  features: MatchingFeatures,
  lang: AEMCLang
): ScoreResult {
  const matchReasons: string[] = [];
  const cautions: string[] = [];
  let departmentMatched = '';

  // --- 1. 科室匹配 ---
  let deptScore = 0;
  const hospitalNormalizedDepts = hospital.departments.map(normalizeDepartment);

  for (const reqDept of features.normalizedDepartments) {
    if (hospitalNormalizedDepts.includes(reqDept)) {
      deptScore = 1;
      departmentMatched = reqDept;
      matchReasons.push(`${ML('deptMatch', lang)}: ${getLocalizedDepartment(reqDept, lang)}`);
      break;
    }
  }

  // 部分匹配：科室名称包含关系
  if (deptScore === 0) {
    for (const reqDept of features.normalizedDepartments) {
      for (const hospDept of hospitalNormalizedDepts) {
        if (reqDept.includes(hospDept) || hospDept.includes(reqDept)) {
          deptScore = 0.6;
          departmentMatched = hospDept;
          matchReasons.push(`${ML('deptRelated', lang)}: ${getLocalizedDepartment(hospDept, lang)} (${ML('deptNeeded', lang)}: ${getLocalizedDepartment(reqDept, lang)})`);
          break;
        }
      }
      if (deptScore > 0) break;
    }
  }

  // --- 2. 专科匹配 ---
  let specialtyScore = 0;
  const allFeatureTexts = [
    ...features.differentialNames,
    ...features.suggestedTests,
    features.chiefComplaint,
  ].map((t) => t.toLowerCase());

  for (const specialty of hospital.specialties) {
    const specialtyLower = specialty.toLowerCase();
    if (allFeatureTexts.some((t) => t.includes(specialtyLower) || specialtyLower.includes(t))) {
      specialtyScore = Math.min(specialtyScore + 0.3, 1);
      matchReasons.push(`${ML('specialtyMatch', lang)}: ${specialty}`);
    }
  }

  // --- 3. 症状/疾病关键词匹配 ---
  let conditionScore = 0;
  const patientTexts = [
    ...features.symptoms,
    ...features.differentialNames,
    features.chiefComplaint,
    ...features.redFlags,
  ].map((t) => t.toLowerCase());

  let conditionMatches = 0;
  for (const keyword of hospital.conditionKeywords) {
    const keywordLower = keyword.toLowerCase();
    if (patientTexts.some((t) => t.includes(keywordLower) || keywordLower.includes(t))) {
      conditionMatches++;
    }
  }
  if (hospital.conditionKeywords.length > 0) {
    // 匹配比例，但最多到 1
    conditionScore = Math.min(conditionMatches / Math.min(hospital.conditionKeywords.length, 5), 1);
  }
  if (conditionMatches > 0) {
    matchReasons.push(`${conditionMatches} ${ML('conditionMatch', lang)}`);
  }

  // --- 4. 急症能力匹配 ---
  let emergencyScore = 0;
  if (features.isEmergency || features.riskLevel === 'emergency') {
    if (hospital.hasEmergency) {
      emergencyScore = 1;
      matchReasons.push(ML('hasEmergency', lang));
    } else {
      emergencyScore = 0;
      cautions.push(ML('noEmergency', lang));
    }
  } else {
    // 非急症时，急症能力不影响分数
    emergencyScore = 0.5;
  }

  // --- 5. 优先级加权 ---
  const priorityScore = hospital.priority / 10; // normalize to 0-1

  // --- 综合分数 ---
  let score =
    deptScore * WEIGHTS.departmentMatch +
    specialtyScore * WEIGHTS.specialtyMatch +
    conditionScore * WEIGHTS.conditionMatch +
    emergencyScore * WEIGHTS.emergencyMatch +
    priorityScore * WEIGHTS.priorityBonus;

  // 急症降级：非急诊机构在紧急情况下大幅降分，避免推荐到无急救能力的诊所
  if ((features.isEmergency || features.riskLevel === 'emergency') && !hospital.hasEmergency) {
    score *= 0.3;
  }

  // --- 注意事项 ---
  if (hospital.bedCount === 0 && features.riskLevel === 'high') {
    cautions.push(ML('clinicCaution', lang));
  }
  if (!hospital.hasRemoteConsultation) {
    cautions.push(ML('noRemote', lang));
  }

  return {
    score,
    matchReasons,
    cautions,
    departmentMatched,
  };
}

// ============================================================
// 路由建议生成
// ============================================================

function generateRoutingSuggestion(
  topHospitals: ScoredHospital[],
  features: MatchingFeatures,
  lang: AEMCLang
): string {
  if (topHospitals.length === 0) {
    return ML('noMatch', lang);
  }

  if (features.isEmergency || features.riskLevel === 'emergency') {
    return ML('emergencyRouting', lang);
  }

  const top = topHospitals[0];
  const localized = getLocalizedHospitalInfo(top.hospital, lang);
  const dept = getLocalizedDepartment(top.departmentMatched || top.hospital.departments[0], lang);

  if (top.score >= 0.6) {
    return ML('highMatchRouting', lang)
      .replace('{name}', localized.name)
      .replace('{dept}', dept);
  }

  return ML('defaultRouting', lang)
    .replace('{name}', localized.name);
}
