import { describe, it, expect } from 'vitest';
import {
  MEDICAL_DISCLAIMERS,
  MEDICAL_DISCLAIMER,
} from '@/services/aemc/types';

const LANGUAGES = ['zh-CN', 'zh-TW', 'ja', 'en'] as const;

describe('MEDICAL_DISCLAIMERS', () => {
  it('has disclaimers for all 4 languages', () => {
    for (const lang of LANGUAGES) {
      expect(MEDICAL_DISCLAIMERS[lang]).toBeTruthy();
    }
  });

  it('all disclaimers contain warning emoji', () => {
    for (const lang of LANGUAGES) {
      expect(MEDICAL_DISCLAIMERS[lang]).toContain('⚠️');
    }
  });

  it('all disclaimers mention Niijima Kotsu', () => {
    expect(MEDICAL_DISCLAIMERS['zh-CN']).toContain('新岛交通');
    expect(MEDICAL_DISCLAIMERS['zh-TW']).toContain('新島交通');
    expect(MEDICAL_DISCLAIMERS.ja).toContain('新島交通');
    expect(MEDICAL_DISCLAIMERS.en).toContain('Niijima Kotsu');
  });

  it('all disclaimers are multi-line (at least 6 points)', () => {
    for (const lang of LANGUAGES) {
      const lines = MEDICAL_DISCLAIMERS[lang].split('\n').filter(l => l.trim());
      expect(lines.length).toBeGreaterThan(5);
    }
  });
});

describe('MEDICAL_DISCLAIMER (legacy)', () => {
  it('equals zh-TW disclaimer', () => {
    expect(MEDICAL_DISCLAIMER).toBe(MEDICAL_DISCLAIMERS['zh-TW']);
  });
});
