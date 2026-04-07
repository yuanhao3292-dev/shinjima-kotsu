import { describe, it, expect } from 'vitest';
import {
  matchPackages,
  formatPriceJPY,
  PACKAGE_HIGHLIGHTS,
  PACKAGE_URLS,
} from '@/lib/screening-package-matcher';
import type { AnalysisResult } from '@/services/aemc/types';

// ============================================================
// Factory
// ============================================================

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
// matchPackages
// ============================================================

describe('matchPackages', () => {
  it('returns empty for emergency (Gate D)', () => {
    const result = matchPackages(makeResult({
      requiresEmergencyNotice: true,
      safetyGateClass: 'D',
    }));
    expect(result).toEqual([]);
  });

  it('returns empty for safetyGateClass D alone', () => {
    const result = matchPackages(makeResult({ safetyGateClass: 'D' }));
    expect(result).toEqual([]);
  });

  it('returns cancer packages for cancer keywords in riskSummary', () => {
    const result = matchPackages(makeResult({
      riskSummary: 'Possible cancer detected',
    }));
    expect(result.some(r => r.slug === 'cancer-initial-consultation')).toBe(true);
    expect(result.some(r => r.slug === 'dwibs-cancer-screening')).toBe(true);
  });

  it('returns cancer packages for 腫瘍 in departments', () => {
    const result = matchPackages(makeResult({
      recommendedDepartments: ['腫瘍科'],
    }));
    expect(result.some(r => r.slug === 'cancer-initial-consultation')).toBe(true);
  });

  it('returns cardiac course for cardiology department', () => {
    const result = matchPackages(makeResult({
      recommendedDepartments: ['Cardiology'],
    }));
    expect(result.some(r => r.slug === 'premium-cardiac-course')).toBe(true);
  });

  it('returns gastro course for gastroenterology department', () => {
    const result = matchPackages(makeResult({
      recommendedDepartments: ['Gastroenterology'],
    }));
    expect(result.some(r => r.slug === 'select-gastro-colonoscopy')).toBe(true);
  });

  it('returns gastroscopy for liver department', () => {
    const result = matchPackages(makeResult({
      recommendedDepartments: ['肝脏科'],
    }));
    expect(result.some(r => r.slug === 'select-gastroscopy')).toBe(true);
  });

  it('returns VIP course for high risk', () => {
    const result = matchPackages(makeResult({ riskLevel: 'high' }));
    expect(result.some(r => r.slug === 'vip-member-course')).toBe(true);
  });

  it('returns basic checkup for medium risk', () => {
    const result = matchPackages(makeResult({ riskLevel: 'medium' }));
    expect(result.some(r => r.slug === 'basic-checkup')).toBe(true);
  });

  it('returns basic + DWIBS for low risk with no department match', () => {
    const result = matchPackages(makeResult({ riskLevel: 'low' }));
    expect(result.some(r => r.slug === 'basic-checkup')).toBe(true);
    expect(result.some(r => r.slug === 'dwibs-cancer-screening')).toBe(true);
  });

  it('limits results to max 3', () => {
    const result = matchPackages(makeResult({
      riskLevel: 'high',
      riskSummary: 'cancer detected',
      recommendedDepartments: ['Cardiology', 'Gastroenterology'],
    }));
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('results are sorted by score descending', () => {
    const result = matchPackages(makeResult({
      riskSummary: 'cancer',
      riskLevel: 'high',
    }));
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
    }
  });

  it('does not contain duplicate slugs', () => {
    const result = matchPackages(makeResult({
      riskSummary: 'cancer tumor malignant',
      recommendedDepartments: ['Oncology'],
      treatmentSuggestions: ['Cancer treatment recommended'],
    }));
    const slugs = result.map(r => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

// ============================================================
// formatPriceJPY
// ============================================================

describe('formatPriceJPY', () => {
  it('formats with yen sign and thousands separator', () => {
    expect(formatPriceJPY(221000)).toBe('¥221,000');
  });

  it('formats zero', () => {
    expect(formatPriceJPY(0)).toBe('¥0');
  });
});

// ============================================================
// PACKAGE_HIGHLIGHTS structure
// ============================================================

describe('PACKAGE_HIGHLIGHTS', () => {
  it('has entries for all known package slugs', () => {
    const expectedSlugs = [
      'vip-member-course', 'premium-cardiac-course',
      'select-gastro-colonoscopy', 'select-gastroscopy',
      'dwibs-cancer-screening', 'basic-checkup',
      'cancer-initial-consultation',
    ];
    expectedSlugs.forEach(slug => {
      expect(PACKAGE_HIGHLIGHTS[slug]).toBeDefined();
    });
  });

  it('each entry has 4 language variants with 3 highlights each', () => {
    for (const [, highlights] of Object.entries(PACKAGE_HIGHLIGHTS)) {
      expect(highlights['zh-CN']).toHaveLength(3);
      expect(highlights['zh-TW']).toHaveLength(3);
      expect(highlights['ja']).toHaveLength(3);
      expect(highlights['en']).toHaveLength(3);
    }
  });
});

// ============================================================
// PACKAGE_URLS structure
// ============================================================

describe('PACKAGE_URLS', () => {
  it('all URLs start with /', () => {
    for (const [, url] of Object.entries(PACKAGE_URLS)) {
      expect(url.startsWith('/')).toBe(true);
    }
  });
});
