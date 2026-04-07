import { describe, it, expect } from 'vitest';
import { traditionalToSimplified, localizeText, localizeTexts } from '@/lib/utils/text-converter';

// ============================================================
// traditionalToSimplified
// ============================================================

describe('traditionalToSimplified', () => {
  it('returns empty string for null', () => {
    expect(traditionalToSimplified(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(traditionalToSimplified(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(traditionalToSimplified('')).toBe('');
  });

  it('returns unchanged text when no traditional characters exist', () => {
    expect(traditionalToSimplified('hello world 123')).toBe('hello world 123');
  });

  it('converts common traditional characters to simplified', () => {
    expect(traditionalToSimplified('體檢')).toBe('体检');
    expect(traditionalToSimplified('醫療')).toBe('医疗');
    expect(traditionalToSimplified('國際')).toBe('国际');
  });

  it('converts mixed traditional/simplified/ASCII text', () => {
    expect(traditionalToSimplified('新島交通株式會社')).toBe('新岛交通株式会社');
  });

  it('handles Japanese characters that are not in the mapping', () => {
    expect(traditionalToSimplified('東京都')).toBe('东京都');
  });

  it('preserves characters not in the mapping table', () => {
    const text = 'abc 123 ！？。';
    expect(traditionalToSimplified(text)).toBe(text);
  });

  it('returns consistent results (cache hit)', () => {
    const text = '精密體檢套餐';
    const first = traditionalToSimplified(text);
    const second = traditionalToSimplified(text);
    expect(first).toBe(second);
    expect(first).toBe('精密体检套餐');
  });

  it('handles long text correctly', () => {
    const traditional = '國際醫療機構認證標準規範指導';
    const result = traditionalToSimplified(traditional);
    expect(result).toContain('国');
    expect(result).toContain('医');
    expect(result).toContain('机');
    expect(result).toContain('标');
    expect(result).not.toContain('國');
    expect(result).not.toContain('醫');
  });
});

// ============================================================
// localizeText
// ============================================================

describe('localizeText', () => {
  it('converts traditional to simplified for zh-CN', () => {
    expect(localizeText('體檢', 'zh-CN')).toBe('体检');
  });

  it('returns original text for ja', () => {
    expect(localizeText('體檢', 'ja')).toBe('體檢');
  });

  it('returns original text for en', () => {
    expect(localizeText('體檢', 'en')).toBe('體檢');
  });

  it('returns original text for zh-TW', () => {
    expect(localizeText('體檢', 'zh-TW')).toBe('體檢');
  });

  it('returns empty string for null input', () => {
    expect(localizeText(null, 'zh-CN')).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(localizeText(undefined, 'ja')).toBe('');
  });
});

// ============================================================
// localizeTexts
// ============================================================

describe('localizeTexts', () => {
  it('converts all texts for zh-CN', () => {
    const result = localizeTexts(['體檢', '醫療'], 'zh-CN');
    expect(result).toEqual(['体检', '医疗']);
  });

  it('returns originals (or empty string for null) for non-zh-CN', () => {
    const result = localizeTexts(['體檢', null, undefined], 'ja');
    expect(result).toEqual(['體檢', '', '']);
  });

  it('handles null/undefined items for zh-CN', () => {
    const result = localizeTexts([null, undefined, '體檢'], 'zh-CN');
    expect(result).toEqual(['', '', '体检']);
  });

  it('returns empty array for empty input', () => {
    expect(localizeTexts([], 'zh-CN')).toEqual([]);
  });
});
