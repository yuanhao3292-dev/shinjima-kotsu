/**
 * Tests for useCommissionTiers.ts pure functions
 * (Hook testing requires React test utils — we test the pure utility functions)
 */
import { describe, it, expect } from 'vitest';
import {
  formatCommissionRate,
  formatSalesThreshold,
  getCurrentQuarterInfo,
  formatQuarter,
} from '@/lib/hooks/useCommissionTiers';

// ============================================================
// formatCommissionRate
// ============================================================

describe('formatCommissionRate', () => {
  it('formats rate with % sign', () => {
    expect(formatCommissionRate(10)).toBe('10%');
    expect(formatCommissionRate(20)).toBe('20%');
    expect(formatCommissionRate(0)).toBe('0%');
  });
});

// ============================================================
// formatSalesThreshold
// ============================================================

describe('formatSalesThreshold', () => {
  it('formats small amounts with yen sign', () => {
    expect(formatSalesThreshold(5000)).toContain('¥');
    expect(formatSalesThreshold(5000)).toContain('5,000');
  });

  it('formats large amounts in 万 units', () => {
    expect(formatSalesThreshold(50000)).toContain('5万');
    expect(formatSalesThreshold(100000)).toContain('10万');
  });

  it('includes /季度 by default', () => {
    expect(formatSalesThreshold(50000)).toContain('季度');
    expect(formatSalesThreshold(5000)).toContain('季度');
  });

  it('omits unit when includeUnit is false', () => {
    expect(formatSalesThreshold(50000, false)).not.toContain('季度');
    expect(formatSalesThreshold(5000, false)).not.toContain('季度');
  });
});

// ============================================================
// getCurrentQuarterInfo
// ============================================================

describe('getCurrentQuarterInfo', () => {
  it('returns quarter between 1 and 4', () => {
    const info = getCurrentQuarterInfo();
    expect(info.quarter).toBeGreaterThanOrEqual(1);
    expect(info.quarter).toBeLessThanOrEqual(4);
  });

  it('returns current year', () => {
    const info = getCurrentQuarterInfo();
    expect(info.year).toBe(new Date().getFullYear());
  });

  it('start and end months are valid', () => {
    const info = getCurrentQuarterInfo();
    expect(info.startMonth).toBeGreaterThanOrEqual(1);
    expect(info.startMonth).toBeLessThanOrEqual(12);
    expect(info.endMonth).toBeGreaterThanOrEqual(1);
    expect(info.endMonth).toBeLessThanOrEqual(12);
    expect(info.endMonth - info.startMonth).toBe(2);
  });
});

// ============================================================
// formatQuarter
// ============================================================

describe('formatQuarter', () => {
  it('formats quarter string', () => {
    expect(formatQuarter(1, 2025)).toBe('2025年第1季度');
    expect(formatQuarter(4, 2026)).toBe('2026年第4季度');
  });
});
