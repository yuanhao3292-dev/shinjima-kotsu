/**
 * Tests for lib/hooks/useLanguage.ts helper functions
 * (Hook testing requires React test utils — we test the pure utility functions)
 */
import { describe, it, expect } from 'vitest';
import { getLanguageName, getLanguageFlag } from '@/lib/hooks/useLanguage';

// ============================================================
// getLanguageName
// ============================================================

describe('getLanguageName', () => {
  it('returns Japanese for ja', () => {
    expect(getLanguageName('ja')).toBe('日本語');
  });

  it('returns Traditional Chinese for zh-TW', () => {
    expect(getLanguageName('zh-TW')).toBe('繁體中文');
  });

  it('returns Simplified Chinese for zh-CN', () => {
    expect(getLanguageName('zh-CN')).toBe('简体中文');
  });

  it('returns English for en', () => {
    expect(getLanguageName('en')).toBe('English');
  });
});

// ============================================================
// getLanguageFlag
// ============================================================

describe('getLanguageFlag', () => {
  it('returns flag for each language', () => {
    expect(getLanguageFlag('ja')).toBeTruthy();
    expect(getLanguageFlag('zh-TW')).toBeTruthy();
    expect(getLanguageFlag('zh-CN')).toBeTruthy();
    expect(getLanguageFlag('en')).toBeTruthy();
  });

  it('all flags are different', () => {
    const flags = (['ja', 'zh-TW', 'zh-CN', 'en'] as const).map(l => getLanguageFlag(l));
    expect(new Set(flags).size).toBe(4);
  });
});
