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
  type HospitalKnowledge,
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
// 主入口
// ============================================================

/**
 * 根据分诊结果匹配合适的医院
 *
 * @param structuredCase AI-1 抽取的病历
 * @param triageAssessment AI-2 分诊判断
 * @param adjudicatedAssessment AI-4 仲裁结果
 * @returns HospitalRecommendation
 */
export function matchHospitals(
  structuredCase: StructuredCase,
  triageAssessment: TriageAssessment,
  adjudicatedAssessment: AdjudicatedAssessment
): HospitalRecommendation {
  // 提取匹配特征
  const features = extractMatchingFeatures(
    structuredCase,
    triageAssessment,
    adjudicatedAssessment
  );

  // 对每个医院计算匹配分数
  const scoredHospitals: ScoredHospital[] = HOSPITAL_KNOWLEDGE_BASE.map((hospital) => {
    const scoreResult = calculateMatchScore(hospital, features);
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

  // 构建输出
  const recommendedHospitals: HospitalMatch[] = topN.map((s) => ({
    hospital_id: s.hospital.id,
    hospital_name: s.hospital.name,
    department: s.departmentMatched || s.hospital.departments[0],
    match_score: Math.round(s.score * 100) / 100,
    match_reasons: s.matchReasons,
    cautions: s.cautions,
  }));

  // 路由建议
  const routingSuggestion = generateRoutingSuggestion(
    topN,
    features
  );

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
  features: MatchingFeatures
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
      matchReasons.push(`科室匹配: ${reqDept}`);
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
          matchReasons.push(`科室相关: ${hospDept} (需求: ${reqDept})`);
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
      matchReasons.push(`专科匹配: ${specialty}`);
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
    matchReasons.push(`${conditionMatches} 个症状/疾病关键词匹配`);
  }

  // --- 4. 急症能力匹配 ---
  let emergencyScore = 0;
  if (features.isEmergency || features.riskLevel === 'emergency') {
    if (hospital.hasEmergency) {
      emergencyScore = 1;
      matchReasons.push('具备急诊处理能力');
    } else {
      emergencyScore = 0;
      cautions.push('该机构不具备急诊能力，紧急情况请就近就医');
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
    cautions.push('该机构为诊所（无住院床位），高风险患者可能需要综合医院');
  }
  if (!hospital.hasRemoteConsultation) {
    cautions.push('该机构暂不提供线上会诊');
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
  features: MatchingFeatures
): string {
  if (topHospitals.length === 0) {
    return '未找到匹配的合作机构，建议联系人工客服进行分诊协调。';
  }

  if (features.isEmergency || features.riskLevel === 'emergency') {
    return '⚠️ 检测到紧急情况，建议立即就近急诊。如需后续专科治疗，可联系我们协调转诊。';
  }

  const top = topHospitals[0];
  if (top.score >= 0.6) {
    return `推荐优先联系「${top.hospital.name}」的${top.departmentMatched || top.hospital.departments[0]}进行咨询。`;
  }

  return `根据您的症状，建议咨询「${top.hospital.name}」。具体科室安排以医院回复为准。`;
}
