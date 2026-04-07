import { describe, it, expect } from 'vitest';
import {
  calculateHealthScore,
  calculateHealthScoreWithBreakdown,
  extractSnapshot,
  compareTrend,
} from '@/lib/health-score';
import type { AnalysisResult } from '@/services/aemc/types';

function makeResult(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    riskLevel: 'low',
    riskSummary: '',
    recommendedDepartments: [],
    recommendedTests: [],
    treatmentSuggestions: [],
    recommendedHospitals: [],
    nextSteps: [],
    rawContent: '',
    disclaimer: '',
    ...overrides,
  };
}

// ============================================================
// Edge cases for calculateHealthScore
// ============================================================

describe('calculateHealthScore — edge cases', () => {
  it('handles Japanese department names correctly', () => {
    // 循環器 = Tier 1 (8)
    const score = calculateHealthScore(makeResult({
      recommendedDepartments: ['循環器科'],
    }));
    expect(score).toBe(92);
  });

  it('handles Chinese department names', () => {
    // 心脏 = Tier 1 (8)
    const score = calculateHealthScore(makeResult({
      recommendedDepartments: ['心脏内科'],
    }));
    expect(score).toBe(92);
  });

  it('multiple Tier 2 departments accumulate correctly', () => {
    // 呼吸(6) + 消化(6) + 腎(6) = 18
    const score = calculateHealthScore(makeResult({
      recommendedDepartments: ['Pulmonology', 'Gastroenterology', 'Nephrology'],
    }));
    expect(score).toBe(100 - 18);
  });

  it('mixed Tier 1 + Tier 2 + default departments cap at 30', () => {
    // Cardiology(8) + Oncology(8) + Gastro(6) + Respiratory(6) + Dermatology(4) = 32 → capped at 30
    const breakdown = calculateHealthScoreWithBreakdown(makeResult({
      recommendedDepartments: ['Cardiology', 'Oncology', 'Gastroenterology', 'Respiratory', 'Dermatology'],
    }));
    const deptDeduction = breakdown.items
      .filter(i => i.category === 'department')
      .reduce((sum, i) => sum + i.deduction, 0);
    expect(deptDeduction).toBe(30);
  });

  it('departments with empty/whitespace-only names are skipped', () => {
    const score = calculateHealthScore(makeResult({
      recommendedDepartments: ['', '  ', '   '],
    }));
    expect(score).toBe(100);
  });

  it('exactly 5 tests = deduction of 10 (= cap)', () => {
    const tests = Array.from({ length: 5 }, (_, i) => `Test ${i}`);
    expect(calculateHealthScore(makeResult({ recommendedTests: tests }))).toBe(90);
  });

  it('0 tests = no deduction', () => {
    expect(calculateHealthScore(makeResult({ recommendedTests: [] }))).toBe(100);
  });

  it('1 test = deduction of 2', () => {
    expect(calculateHealthScore(makeResult({ recommendedTests: ['MRI'] }))).toBe(98);
  });

  it('cancer keywords in Japanese (がん) trigger deduction', () => {
    expect(calculateHealthScore(makeResult({
      riskSummary: 'がんの可能性あり',
    }))).toBe(92);
  });

  it('cancer keywords in Chinese simplified (肿瘤) trigger deduction', () => {
    expect(calculateHealthScore(makeResult({
      treatmentSuggestions: ['建议进行肿瘤筛查'],
    }))).toBe(92);
  });

  it('worst case scenario stays at minimum 20', () => {
    const score = calculateHealthScore(makeResult({
      riskLevel: 'high',           // -30
      recommendedDepartments: ['Cardiology', 'Oncology', 'Neurosurgery', 'Gastro', 'Renal', 'Endo'], // -30 (cap)
      recommendedTests: Array(20).fill('Test'), // -10 (cap)
      safetyGateClass: 'D',       // -25
      requiresHumanReview: true,   // -5
      riskSummary: 'cancer risk',  // -8
    }));
    // Total deduction = 108, but clamped to 20
    expect(score).toBe(20);
  });

  it('exactly at boundary: total deduction = 80 → score = 20', () => {
    const score = calculateHealthScore(makeResult({
      riskLevel: 'high',           // -30
      recommendedDepartments: ['Cardiology', 'Oncology', 'Neurosurgery'], // -24
      recommendedTests: Array(5).fill('Test'), // -10
      safetyGateClass: 'C',       // -10
      requiresHumanReview: true,   // -5
      riskSummary: 'Cancer suspected', // -8 = total 87 → clamp 20
    }));
    expect(score).toBe(20);
  });
});

// ============================================================
// extractSnapshot — edge cases
// ============================================================

describe('extractSnapshot — edge cases', () => {
  it('handles riskSummary with multiple sentence terminators', () => {
    const snap = extractSnapshot(makeResult({
      riskSummary: 'First！Second？Third。Fourth.',
    }));
    expect(snap.topFindings[0]).toBe('First');
  });

  it('handles riskSummary with newline as delimiter', () => {
    const snap = extractSnapshot(makeResult({
      riskSummary: 'Line1\nLine2\nLine3',
    }));
    expect(snap.topFindings[0]).toBe('Line1');
  });

  it('safetyGate defaults to null when not provided', () => {
    const snap = extractSnapshot(makeResult());
    expect(snap.safetyGate).toBeNull();
  });

  it('safetyGate reflects provided value', () => {
    const snap = extractSnapshot(makeResult({ safetyGateClass: 'C' }));
    expect(snap.safetyGate).toBe('C');
  });

  it('testCount matches recommendedTests length', () => {
    const snap = extractSnapshot(makeResult({
      recommendedTests: ['A', 'B', 'C'],
    }));
    expect(snap.testCount).toBe(3);
  });
});

// ============================================================
// compareTrend — edge cases
// ============================================================

describe('compareTrend — edge cases', () => {
  const makeSnap = (score: number, depts: string[] = []) => ({
    healthScore: score,
    riskLevel: 'low',
    safetyGate: null,
    departmentCount: depts.length,
    testCount: 0,
    departments: depts,
    topFindings: [],
  });

  it('delta of exactly +4 is stable', () => {
    const trend = compareTrend(makeSnap(84), { healthScore: 80, departments: [] });
    expect(trend.trend).toBe('stable');
    expect(trend.scoreDelta).toBe(4);
  });

  it('delta of exactly -4 is stable', () => {
    const trend = compareTrend(makeSnap(76), { healthScore: 80, departments: [] });
    expect(trend.trend).toBe('stable');
    expect(trend.scoreDelta).toBe(-4);
  });

  it('delta of +5 is improving', () => {
    const trend = compareTrend(makeSnap(85), { healthScore: 80, departments: [] });
    expect(trend.trend).toBe('improving');
  });

  it('delta of -5 is worsening', () => {
    const trend = compareTrend(makeSnap(75), { healthScore: 80, departments: [] });
    expect(trend.trend).toBe('worsening');
  });

  it('large positive delta is improving', () => {
    const trend = compareTrend(makeSnap(100), { healthScore: 20, departments: [] });
    expect(trend.trend).toBe('improving');
    expect(trend.scoreDelta).toBe(80);
  });

  it('handles departments added and removed simultaneously', () => {
    const trend = compareTrend(
      makeSnap(80, ['Cardiology', 'Neurology']),
      { healthScore: 80, departments: ['Oncology', 'Neurology'] },
    );
    expect(trend.newDepartments).toEqual(['Cardiology']);
    expect(trend.resolvedDepartments).toEqual(['Oncology']);
  });

  it('all departments resolved (good improvement)', () => {
    const trend = compareTrend(
      makeSnap(95, []),
      { healthScore: 70, departments: ['Cardiology', 'Oncology'] },
    );
    expect(trend.resolvedDepartments).toHaveLength(2);
    expect(trend.newDepartments).toHaveLength(0);
  });
});
