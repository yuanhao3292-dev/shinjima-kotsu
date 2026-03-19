import { describe, it, expect } from 'vitest';
import {
  calculateHealthScore,
  calculateHealthScoreWithBreakdown,
  extractSnapshot,
  compareTrend,
} from '@/lib/health-score';
import type { AnalysisResult } from '@/services/aemc/types';

// ============================================================
// Factory
// ============================================================

function makeResult(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    riskLevel: 'low',
    riskSummary: 'All indicators are normal.',
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
// calculateHealthScore
// ============================================================

describe('calculateHealthScore', () => {
  it('returns 100 for low-risk with no departments/tests', () => {
    expect(calculateHealthScore(makeResult())).toBe(100);
  });

  it('deducts 30 for high risk', () => {
    expect(calculateHealthScore(makeResult({ riskLevel: 'high' }))).toBe(70);
  });

  it('deducts 15 for medium risk', () => {
    expect(calculateHealthScore(makeResult({ riskLevel: 'medium' }))).toBe(85);
  });

  it('applies Tier 1 weight (8) for cardiology', () => {
    const score = calculateHealthScore(makeResult({
      recommendedDepartments: ['Cardiology'],
    }));
    expect(score).toBe(100 - 8);
  });

  it('applies Tier 1 weight (8) for 循環器科', () => {
    const score = calculateHealthScore(makeResult({
      recommendedDepartments: ['循環器科'],
    }));
    expect(score).toBe(100 - 8);
  });

  it('applies Tier 2 weight (6) for gastroenterology', () => {
    const score = calculateHealthScore(makeResult({
      recommendedDepartments: ['Gastroenterology'],
    }));
    expect(score).toBe(100 - 6);
  });

  it('applies default weight (4) for unknown departments', () => {
    const score = calculateHealthScore(makeResult({
      recommendedDepartments: ['Dermatology'],
    }));
    expect(score).toBe(100 - 4);
  });

  it('caps total department deduction at 30', () => {
    const score = calculateHealthScore(makeResult({
      recommendedDepartments: [
        'Cardiology', 'Oncology', 'Neurosurgery', // 8+8+8=24
        'Gastroenterology', // +6 → 30 (capped)
        'Dermatology', // would be +4 but already at cap
      ],
    }));
    expect(score).toBe(100 - 30);
  });

  it('deducts 2 per test, max 10', () => {
    const tests = Array.from({ length: 3 }, (_, i) => `Test ${i + 1}`);
    expect(calculateHealthScore(makeResult({ recommendedTests: tests }))).toBe(100 - 6);
  });

  it('caps test deduction at 10', () => {
    const tests = Array.from({ length: 8 }, (_, i) => `Test ${i + 1}`);
    expect(calculateHealthScore(makeResult({ recommendedTests: tests }))).toBe(100 - 10);
  });

  it('deducts 25 for safety gate D', () => {
    expect(calculateHealthScore(makeResult({ safetyGateClass: 'D' }))).toBe(75);
  });

  it('deducts 10 for safety gate C', () => {
    expect(calculateHealthScore(makeResult({ safetyGateClass: 'C' }))).toBe(90);
  });

  it('no deduction for safety gate A or B', () => {
    expect(calculateHealthScore(makeResult({ safetyGateClass: 'A' }))).toBe(100);
    expect(calculateHealthScore(makeResult({ safetyGateClass: 'B' }))).toBe(100);
  });

  it('deducts 5 for human review', () => {
    expect(calculateHealthScore(makeResult({ requiresHumanReview: true }))).toBe(95);
  });

  it('deducts 8 for cancer keywords in riskSummary', () => {
    expect(calculateHealthScore(makeResult({
      riskSummary: 'Possible cancer risk detected.',
    }))).toBe(100 - 8);
  });

  it('deducts 8 for cancer keywords in departments', () => {
    expect(calculateHealthScore(makeResult({
      recommendedDepartments: ['腫瘍科'],
    }))).toBe(100 - 8 - 8); // 8 for dept weight (Tier 1) + 8 for cancer keyword
  });

  it('deducts 8 for cancer keywords in treatmentSuggestions', () => {
    expect(calculateHealthScore(makeResult({
      treatmentSuggestions: ['Consider cancer screening.'],
    }))).toBe(100 - 8);
  });

  it('cancer keyword deduction is one-time only', () => {
    const score = calculateHealthScore(makeResult({
      riskSummary: 'Cancer detected, tumor found, malignant cells.',
      treatmentSuggestions: ['Cancer treatment recommended.'],
    }));
    // Only -8 once, not -8 per keyword
    expect(score).toBe(100 - 8);
  });

  it('clamps at minimum 20 for worst case', () => {
    const score = calculateHealthScore(makeResult({
      riskLevel: 'high',           // -30
      recommendedDepartments: ['Cardiology', 'Oncology', 'Neurosurgery', 'Gastro'], // -30
      recommendedTests: Array(10).fill('Test'), // -10 (capped)
      safetyGateClass: 'D',       // -25
      requiresHumanReview: true,   // -5
      riskSummary: 'Cancer risk',  // -8
    }));
    expect(score).toBe(20);
  });

  it('handles undefined optional fields gracefully', () => {
    const result: AnalysisResult = {
      riskLevel: 'low',
      riskSummary: '',
      recommendedTests: [],
      treatmentSuggestions: [],
      recommendedHospitals: [],
      nextSteps: [],
      rawContent: '',
      disclaimer: '',
      // recommendedDepartments is undefined
      // safetyGateClass is undefined
      // requiresHumanReview is undefined
    };
    expect(calculateHealthScore(result)).toBe(100);
  });
});

// ============================================================
// calculateHealthScoreWithBreakdown
// ============================================================

describe('calculateHealthScoreWithBreakdown', () => {
  it('returns correct breakdown items for multi-factor result', () => {
    const breakdown = calculateHealthScoreWithBreakdown(makeResult({
      riskLevel: 'high',
      recommendedDepartments: ['Cardiology'],
      recommendedTests: ['ECG', 'Blood Panel'],
      requiresHumanReview: true,
    }));

    expect(breakdown.baseScore).toBe(100);
    expect(breakdown.items).toHaveLength(4); // risk + dept + test + human_review
    expect(breakdown.items[0]).toMatchObject({ category: 'risk_level', deduction: 30 });
    expect(breakdown.items[1]).toMatchObject({ category: 'department', label: 'Cardiology', deduction: 8 });
    expect(breakdown.items[2]).toMatchObject({ category: 'test', deduction: 4 });
    expect(breakdown.items[3]).toMatchObject({ category: 'human_review', deduction: 5 });
  });

  it('totalDeduction equals sum of item deductions', () => {
    const breakdown = calculateHealthScoreWithBreakdown(makeResult({
      riskLevel: 'medium',
      recommendedDepartments: ['Gastroenterology'],
      recommendedTests: ['Endoscopy'],
    }));

    const sum = breakdown.items.reduce((s, i) => s + i.deduction, 0);
    expect(breakdown.totalDeduction).toBe(sum);
  });

  it('finalScore equals clamp(100 - totalDeduction, 20, 100)', () => {
    const breakdown = calculateHealthScoreWithBreakdown(makeResult({
      riskLevel: 'medium',
    }));
    expect(breakdown.finalScore).toBe(100 - breakdown.totalDeduction);
  });

  it('returns empty items for perfect score', () => {
    const breakdown = calculateHealthScoreWithBreakdown(makeResult());
    expect(breakdown.items).toHaveLength(0);
    expect(breakdown.totalDeduction).toBe(0);
    expect(breakdown.finalScore).toBe(100);
  });

  it('includes cancer_keyword category when cancer keywords found', () => {
    const breakdown = calculateHealthScoreWithBreakdown(makeResult({
      riskSummary: 'Possible がん risk.',
    }));
    const cancerItem = breakdown.items.find(i => i.category === 'cancer_keyword');
    expect(cancerItem).toBeDefined();
    expect(cancerItem!.deduction).toBe(8);
  });
});

// ============================================================
// extractSnapshot
// ============================================================

describe('extractSnapshot', () => {
  it('extracts correct healthScore from AnalysisResult', () => {
    const snap = extractSnapshot(makeResult({ riskLevel: 'medium' }));
    expect(snap.healthScore).toBe(calculateHealthScore(makeResult({ riskLevel: 'medium' })));
  });

  it('extracts departments trimmed and filtered', () => {
    const snap = extractSnapshot(makeResult({
      recommendedDepartments: [' Cardiology ', '', '  Neurology  '],
    }));
    expect(snap.departments).toEqual(['Cardiology', 'Neurology']);
    expect(snap.departmentCount).toBe(2);
  });

  it('extracts topFindings from riskSummary first sentence + tests', () => {
    const snap = extractSnapshot(makeResult({
      riskSummary: 'First sentence。Second sentence.',
      recommendedTests: ['Test A', 'Test B', 'Test C', 'Test D', 'Test E'],
    }));
    expect(snap.topFindings[0]).toBe('First sentence');
    expect(snap.topFindings).toHaveLength(5); // 1 summary + 4 tests
  });

  it('limits topFindings to 5 items', () => {
    const snap = extractSnapshot(makeResult({
      riskSummary: 'Summary.',
      recommendedTests: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    }));
    expect(snap.topFindings.length).toBeLessThanOrEqual(5);
  });

  it('handles empty riskSummary', () => {
    const snap = extractSnapshot(makeResult({ riskSummary: '' }));
    expect(snap.topFindings).toEqual([]);
  });

  it('handles empty tests', () => {
    const snap = extractSnapshot(makeResult({
      riskSummary: 'Summary.',
      recommendedTests: [],
    }));
    expect(snap.topFindings).toEqual(['Summary']);
  });

  it('handles missing optional fields', () => {
    const snap = extractSnapshot({
      riskLevel: 'low',
      riskSummary: '',
      recommendedTests: [],
      treatmentSuggestions: [],
      recommendedHospitals: [],
      nextSteps: [],
      rawContent: '',
      disclaimer: '',
    } as AnalysisResult);
    expect(snap.healthScore).toBe(100);
    expect(snap.departments).toEqual([]);
  });
});

// ============================================================
// compareTrend
// ============================================================

describe('compareTrend', () => {
  const makeSnap = (score: number, depts: string[] = []) => ({
    healthScore: score,
    riskLevel: 'low',
    safetyGate: null,
    departmentCount: depts.length,
    testCount: 0,
    departments: depts,
    topFindings: [],
  });

  it('returns stable with null scoreDelta for first screening', () => {
    const trend = compareTrend(makeSnap(80), null);
    expect(trend.trend).toBe('stable');
    expect(trend.scoreDelta).toBeNull();
    expect(trend.newDepartments).toEqual([]);
    expect(trend.resolvedDepartments).toEqual([]);
  });

  it('returns improving when delta >= 5', () => {
    const trend = compareTrend(makeSnap(85), { healthScore: 80, departments: [] });
    expect(trend.trend).toBe('improving');
    expect(trend.scoreDelta).toBe(5);
  });

  it('returns worsening when delta <= -5', () => {
    const trend = compareTrend(makeSnap(70), { healthScore: 75, departments: [] });
    expect(trend.trend).toBe('worsening');
    expect(trend.scoreDelta).toBe(-5);
  });

  it('returns stable for delta between -4 and +4', () => {
    expect(compareTrend(makeSnap(82), { healthScore: 80, departments: [] }).trend).toBe('stable');
    expect(compareTrend(makeSnap(78), { healthScore: 80, departments: [] }).trend).toBe('stable');
    expect(compareTrend(makeSnap(80), { healthScore: 80, departments: [] }).trend).toBe('stable');
  });

  it('correctly identifies new departments', () => {
    const trend = compareTrend(
      makeSnap(80, ['Cardiology', 'Neurology']),
      { healthScore: 85, departments: ['Cardiology'] },
    );
    expect(trend.newDepartments).toEqual(['Neurology']);
  });

  it('correctly identifies resolved departments', () => {
    const trend = compareTrend(
      makeSnap(85, ['Cardiology']),
      { healthScore: 80, departments: ['Cardiology', 'Oncology'] },
    );
    expect(trend.resolvedDepartments).toEqual(['Oncology']);
  });

  it('handles case-insensitive department comparison', () => {
    const trend = compareTrend(
      makeSnap(80, ['CARDIOLOGY']),
      { healthScore: 80, departments: ['cardiology'] },
    );
    expect(trend.newDepartments).toEqual([]);
    expect(trend.resolvedDepartments).toEqual([]);
  });

  it('handles empty department arrays', () => {
    const trend = compareTrend(makeSnap(80, []), { healthScore: 80, departments: [] });
    expect(trend.newDepartments).toEqual([]);
    expect(trend.resolvedDepartments).toEqual([]);
  });
});
