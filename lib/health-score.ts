/**
 * Health Passport — 健康评分 + 快照提取 + 趋势分析
 *
 * 纯确定性函数，零 AI 调用。
 * 从 AnalysisResult 计算健康评分（0-100），提取结构化快照，
 * 并对比历次快照生成趋势指标。
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

// ============================================================
// 1. 健康评分算法
// ============================================================

/**
 * 从 AnalysisResult 确定性计算健康评分 0-100
 *
 * 基础分 = 100
 * - riskLevel === 'high'          → -30
 * - riskLevel === 'medium'        → -15
 * - 每个 recommendedDepartment    → -5（最多 -20）
 * - 每个 recommendedTest          → -2（最多 -10）
 * - safetyGateClass === 'C'       → -10
 * - safetyGateClass === 'D'       → -25
 * - requiresHumanReview           → -5
 * 最终分 = clamp(score, 20, 100)
 */
export function calculateHealthScore(result: AnalysisResult): number {
  let score = 100;

  // Risk level deduction
  if (result.riskLevel === 'high') score -= 30;
  else if (result.riskLevel === 'medium') score -= 15;

  // Department deduction: -5 each, max -20
  const deptCount = result.recommendedDepartments?.length ?? 0;
  score -= Math.min(deptCount * 5, 20);

  // Test deduction: -2 each, max -10
  const testCount = result.recommendedTests?.length ?? 0;
  score -= Math.min(testCount * 2, 10);

  // Safety gate deduction
  if (result.safetyGateClass === 'D') score -= 25;
  else if (result.safetyGateClass === 'C') score -= 10;

  // Human review flag
  if (result.requiresHumanReview) score -= 5;

  return Math.max(20, Math.min(100, score));
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
