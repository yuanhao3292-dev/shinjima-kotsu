import { describe, it, expect } from 'vitest';
import { COUNTRY_CODES, DEFAULT_CODE_BY_LANG } from '@/lib/config/country-codes';

describe('COUNTRY_CODES', () => {
  it('has entries', () => {
    expect(COUNTRY_CODES.length).toBeGreaterThan(20);
  });

  it('all entries have code and label', () => {
    for (const entry of COUNTRY_CODES) {
      expect(entry.code).toBeTruthy();
      expect(entry.label).toBeTruthy();
    }
  });

  it('all codes start with +', () => {
    for (const entry of COUNTRY_CODES) {
      expect(entry.code).toMatch(/^\+\d+$/);
    }
  });

  it('includes common country codes', () => {
    const codes = COUNTRY_CODES.map(c => c.code);
    expect(codes).toContain('+86');  // China
    expect(codes).toContain('+81');  // Japan
    expect(codes).toContain('+1');   // US/CA
    expect(codes).toContain('+44');  // UK
  });

  it('has unique codes', () => {
    const codes = COUNTRY_CODES.map(c => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe('DEFAULT_CODE_BY_LANG', () => {
  it('has defaults for all 4 languages', () => {
    expect(DEFAULT_CODE_BY_LANG['zh-CN']).toBe('+86');
    expect(DEFAULT_CODE_BY_LANG['zh-TW']).toBe('+886');
    expect(DEFAULT_CODE_BY_LANG.ja).toBe('+81');
    expect(DEFAULT_CODE_BY_LANG.en).toBe('+1');
  });

  it('all default codes exist in COUNTRY_CODES', () => {
    const validCodes = new Set(COUNTRY_CODES.map(c => c.code));
    for (const code of Object.values(DEFAULT_CODE_BY_LANG)) {
      expect(validCodes.has(code)).toBe(true);
    }
  });
});
