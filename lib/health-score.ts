/**
 * Health Passport — 加权健康评分 + 评分详情 + 快照提取 + 趋势分析
 *
 * 纯确定性函数，零 AI 调用。
 * 从 AnalysisResult 计算加权健康评分（0-100），提供透明的评分详情，
 * 提取结构化快照，并对比历次快照生成趋势指标。
 */

import type { AnalysisResult } from '@/services/aemc/types';

// ============================================================
// Types
// ============================================================

export interface SnapshotData {
  healthScore: number;
  riskLevel: string;
  safetyGate: string | null;
  departmentCount: number;
  testCount: number;
  departments: string[];
  topFindings: string[];
}

export interface TrendData {
  scoreDelta: number | null;
  trend: 'improving' | 'stable' | 'worsening';
  newDepartments: string[];
  resolvedDepartments: string[];
}

/** DB row shape (snake_case, matches health_snapshots table) */
export interface HealthSnapshotRow {
  id: string;
  screening_id: string;
  user_id: string;
  health_score: number;
  risk_level: string;
  safety_gate: string | null;
  department_count: number;
  test_count: number;
  departments: string[];
  top_findings: string[];
  score_delta: number | null;
  prev_snapshot_id: string | null;
  trend: 'improving' | 'stable' | 'worsening';
  new_departments: string[];
  resolved_departments: string[];
  created_at: string;
}

/** 评分详情中的每一条扣分项 */
export interface ScoreBreakdownItem {
  category: 'risk_level' | 'department' | 'test' | 'safety_gate' | 'human_review' | 'cancer_keyword';
  label: string;
  deduction: number;
}

/** 完整评分详情 */
export interface ScoreBreakdownResult {
  baseScore: 100;
  totalDeduction: number;
  finalScore: number;
  items: ScoreBreakdownItem[];
}

// ============================================================
// 科室权重常量
// ============================================================

/**
 * 科室权重映射（关键词 → 扣分权重）
 * Tier 1 (8): 生命攸关科室（心脏/肿瘤/脑神经）
 * Tier 2 (6): 重要但非即刻致命（呼吸/消化/肾脏/内分泌）
 * Default (4): 其他科室
 */
const DEPT_WEIGHT_KEYWORDS: [string[], number][] = [
  // Tier 1 — weight 8
  [['cardiology', 'cardiac', '循環器', '心臓', '心脏', '心血管'], 8],
  [['oncology', '腫瘍', '肿瘤', 'がん'], 8],
  [['neurosurgery', 'neurology', '脳神経', '脑神经', '神経内科', '神经内科'], 8],
  // Tier 2 — weight 6
  [['pulmonology', 'respiratory', '呼吸器', '呼吸'], 6],
  [['gastroenterology', 'gastro', '消化器', '消化', '胃腸', '胃肠'], 6],
  [['nephrology', 'renal', '腎臓', '肾脏', '腎'], 6],
  [['endocrinology', '内分泌'], 6],
];

const DEFAULT_DEPT_WEIGHT = 4;

/** 癌症关键词（中日英），用于文本扫描 */
const CANCER_KEYWORDS = [
  'cancer', 'tumor', 'tumour', 'malignant', 'carcinoma',
  'lymphoma', 'leukemia', 'metastasis', 'neoplasm', 'sarcoma',
  '癌', '腫瘍', '腫瘤', '肿瘤', '悪性', '恶性', '転移', '轉移',
  'がん', '白血病', 'リンパ腫',
];

// ============================================================
// 科室权重查找
// ============================================================

function getDeptWeight(deptName: string): number {
  const lower = deptName.toLowerCase();
  for (const [keywords, weight] of DEPT_WEIGHT_KEYWORDS) {
    if (keywords.some(kw => lower.includes(kw))) return weight;
  }
  return DEFAULT_DEPT_WEIGHT;
}

// ============================================================
// 1. 加权健康评分算法（带评分详情）
// ============================================================

/**
 * 从 AnalysisResult 计算加权健康评分，返回完整评分详情。
 *
 * 算法：
 * - 基础分 = 100
 * - 风险等级：high -30, medium -15
 * - 科室加权扣分（Tier1=-8, Tier2=-6, 默认=-4，总上限 -30）
 * - 检查项 -2/个（上限 -10）
 * - 安全闸门：D -25, C -10
 * - 人工审核 -5
 * - 癌症关键词（文本扫描）-8（一次性）
 * - clamp(20, 100)
 */
export function calculateHealthScoreWithBreakdown(result: AnalysisResult): ScoreBreakdownResult {
  const items: ScoreBreakdownItem[] = [];

  // 1. Risk level
  if (result.riskLevel === 'high') {
    items.push({ category: 'risk_level', label: 'High Risk', deduction: 30 });
  } else if (result.riskLevel === 'medium') {
    items.push({ category: 'risk_level', label: 'Medium Risk', deduction: 15 });
  }

  // 2. Departments (weighted, max total -30)
  let deptTotal = 0;
  for (const dept of result.recommendedDepartments ?? []) {
    const name = dept.trim();
    if (!name) continue;
    const weight = getDeptWeight(name);
    const deduction = Math.min(weight, 30 - deptTotal);
    if (deduction <= 0) break;
    deptTotal += deduction;
    items.push({ category: 'department', label: name, deduction });
  }

  // 3. Tests (-2 each, max -10)
  const tests = result.recommendedTests ?? [];
  const testDeduction = Math.min(tests.length * 2, 10);
  if (testDeduction > 0) {
    items.push({ category: 'test', label: `${tests.length} tests`, deduction: testDeduction });
  }

  // 4. Safety gate
  if (result.safetyGateClass === 'D') {
    items.push({ category: 'safety_gate', label: 'Emergency Gate', deduction: 25 });
  } else if (result.safetyGateClass === 'C') {
    items.push({ category: 'safety_gate', label: 'Review Gate', deduction: 10 });
  }

  // 5. Human review
  if (result.requiresHumanReview) {
    items.push({ category: 'human_review', label: 'Human Review', deduction: 5 });
  }

  // 6. Cancer keyword scan (one-time -8)
  const textToScan = [
    result.riskSummary ?? '',
    ...(result.recommendedDepartments ?? []),
    ...(result.treatmentSuggestions ?? []),
  ].join(' ').toLowerCase();

  if (CANCER_KEYWORDS.some(kw => textToScan.includes(kw.toLowerCase()))) {
    items.push({ category: 'cancer_keyword', label: 'Cancer Risk', deduction: 8 });
  }

  const totalDeduction = items.reduce((sum, item) => sum + item.deduction, 0);
  const finalScore = Math.max(20, Math.min(100, 100 - totalDeduction));

  return { baseScore: 100, totalDeduction, finalScore, items };
}

/**
 * 简化版：仅返回最终分数（向后兼容）
 */
export function calculateHealthScore(result: AnalysisResult): number {
  return calculateHealthScoreWithBreakdown(result).finalScore;
}

// ============================================================
// 2. 快照提取
// ============================================================

/**
 * 从 AnalysisResult 提取结构化快照数据。
 * topFindings 取 riskSummary 首句 + 前 4 个 recommendedTests。
 */
export function extractSnapshot(result: AnalysisResult): SnapshotData {
  const departments = (result.recommendedDepartments ?? []).map(d => d.trim()).filter(Boolean);
  const tests = result.recommendedTests ?? [];

  // topFindings: riskSummary 首句 + 前 4 个 tests（共最多 5 个）
  const topFindings: string[] = [];
  if (result.riskSummary) {
    const firstSentence = result.riskSummary.split(/[。.！!？?\n]/)[0]?.trim();
    if (firstSentence) topFindings.push(firstSentence);
  }
  for (const t of tests.slice(0, 4)) {
    if (topFindings.length >= 5) break;
    topFindings.push(t);
  }

  return {
    healthScore: calculateHealthScore(result),
    riskLevel: result.riskLevel,
    safetyGate: result.safetyGateClass ?? null,
    departmentCount: departments.length,
    testCount: tests.length,
    departments,
    topFindings,
  };
}

// ============================================================
// 3. 趋势分析
// ============================================================

/**
 * 对比当前快照与前一次快照，生成趋势指标。
 * 如果 previous 为 null（首次筛查），趋势为 'stable'。
 */
export function compareTrend(
  current: SnapshotData,
  previous: Pick<SnapshotData, 'healthScore' | 'departments'> | null,
): TrendData {
  if (!previous) {
    return {
      scoreDelta: null,
      trend: 'stable',
      newDepartments: [],
      resolvedDepartments: [],
    };
  }

  const scoreDelta = current.healthScore - previous.healthScore;

  // Trend: ≥ +5 improving, ≤ -5 worsening, else stable
  let trend: TrendData['trend'] = 'stable';
  if (scoreDelta >= 5) trend = 'improving';
  else if (scoreDelta <= -5) trend = 'worsening';

  const prevDeptSet = new Set(previous.departments.map(d => d.toLowerCase()));
  const currDeptSet = new Set(current.departments.map(d => d.toLowerCase()));

  const newDepartments = current.departments.filter(
    d => !prevDeptSet.has(d.toLowerCase()),
  );
  const resolvedDepartments = previous.departments.filter(
    d => !currDeptSet.has(d.toLowerCase()),
  );

  return { scoreDelta, trend, newDepartments, resolvedDepartments };
}
