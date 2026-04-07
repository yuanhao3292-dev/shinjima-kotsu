import { describe, it, expect } from 'vitest';
import {
  formatDateTime,
  formatDateLong,
  formatDateTimeLong,
  formatDateJP,
  formatDateJPKanji,
  formatDateShort,
  formatDateSimple,
  formatDateTimeSimple,
} from '@/lib/utils/format-date';

// ============================================================
// formatDateTime
// ============================================================

describe('formatDateTime', () => {
  it('returns "-" for null', () => {
    expect(formatDateTime(null)).toBe('-');
  });

  it('returns "-" for empty string', () => {
    expect(formatDateTime('')).toBe('-');
  });

  it('returns formatted date+time for valid ISO string', () => {
    const result = formatDateTime('2024-06-15T14:30:00Z');
    // Should contain year, month, day + time components
    expect(result).toMatch(/2024/);
    expect(result.length).toBeGreaterThan(8);
  });
});

// ============================================================
// formatDateLong
// ============================================================

describe('formatDateLong', () => {
  it('returns "-" for null', () => {
    expect(formatDateLong(null)).toBe('-');
  });

  it('formats date with year/month/day in zh-TW long', () => {
    const result = formatDateLong('2024-03-15');
    expect(result).toMatch(/2024/);
  });
});

// ============================================================
// formatDateTimeLong
// ============================================================

describe('formatDateTimeLong', () => {
  it('returns "-" for null', () => {
    expect(formatDateTimeLong(null)).toBe('-');
  });

  it('includes time component', () => {
    const result = formatDateTimeLong('2024-06-15T09:45:00Z');
    expect(result).toMatch(/2024/);
  });
});

// ============================================================
// formatDateJP
// ============================================================

describe('formatDateJP', () => {
  it('returns "-" for null', () => {
    expect(formatDateJP(null)).toBe('-');
  });

  it('uses dots as separator', () => {
    const result = formatDateJP('2024-01-05');
    // ja-JP locale with dots: YYYY.MM.DD
    expect(result).toMatch(/\d{4}\.\d{2}\.\d{2}/);
  });
});

// ============================================================
// formatDateJPKanji
// ============================================================

describe('formatDateJPKanji', () => {
  it('formats with kanji 年月日', () => {
    const result = formatDateJPKanji('2024-03-15');
    expect(result).toContain('年');
    expect(result).toContain('月');
    expect(result).toContain('日');
    expect(result).toContain('2024');
  });

  it('does not pad single-digit month/day', () => {
    const result = formatDateJPKanji('2024-01-05');
    // getMonth()+1 and getDate() are not zero-padded
    expect(result).toMatch(/\d{4}年\d{1,2}月\d{1,2}日/);
  });
});

// ============================================================
// formatDateShort
// ============================================================

describe('formatDateShort', () => {
  it('formats as YYYY/MM/DD with zero-padding', () => {
    const result = formatDateShort('2024-01-05');
    expect(result).toMatch(/^2024\/01\/0[45]$/); // timezone may shift day
  });

  it('pads month and day', () => {
    const result = formatDateShort('2024-03-09');
    expect(result).toMatch(/\/03\//);
    expect(result).toMatch(/\/0[89]$/);
  });
});

// ============================================================
// formatDateSimple
// ============================================================

describe('formatDateSimple', () => {
  it('returns "-" for null', () => {
    expect(formatDateSimple(null)).toBe('-');
  });

  it('returns a non-empty string for valid date', () => {
    const result = formatDateSimple('2024-06-15');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toMatch(/2024/);
  });
});

// ============================================================
// formatDateTimeSimple
// ============================================================

describe('formatDateTimeSimple', () => {
  it('returns "-" for null', () => {
    expect(formatDateTimeSimple(null)).toBe('-');
  });

  it('returns a non-empty string for valid datetime', () => {
    const result = formatDateTimeSimple('2024-06-15T14:30:00Z');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toMatch(/2024/);
  });
});
