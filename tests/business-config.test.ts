import { describe, it, expect } from 'vitest';
import {
  pageTranslations,
  BUSINESS_ITEMS,
} from '@/lib/constants/business-config';

const LANGUAGES = ['ja', 'zh-TW', 'zh-CN', 'en'] as const;

// ============================================================
// pageTranslations
// ============================================================

describe('pageTranslations', () => {
  it('has intro key', () => {
    expect(pageTranslations.intro).toBeDefined();
  });

  it('intro has all 4 languages', () => {
    for (const lang of LANGUAGES) {
      expect(pageTranslations.intro[lang]).toBeTruthy();
    }
  });
});

// ============================================================
// BUSINESS_ITEMS
// ============================================================

describe('BUSINESS_ITEMS', () => {
  it('has 4 items', () => {
    expect(BUSINESS_ITEMS).toHaveLength(4);
  });

  it('all items have required fields', () => {
    for (const item of BUSINESS_ITEMS) {
      expect(item.id).toBeTruthy();
      expect(item.titleEn).toBeTruthy();
      expect(item.link).toMatch(/^\//);
      expect(item.image).toBeTruthy();
      expect(item.icon).toBeDefined();

      // Check translations for all languages
      for (const lang of LANGUAGES) {
        expect(item.title[lang], `Missing title.${lang} for ${item.id}`).toBeTruthy();
        expect(item.description[lang], `Missing description.${lang} for ${item.id}`).toBeTruthy();
        expect(item.stats[lang].length, `Empty stats.${lang} for ${item.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('has unique IDs', () => {
    const ids = BUSINESS_ITEMS.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes expected business areas', () => {
    const ids = BUSINESS_ITEMS.map(i => i.id);
    expect(ids).toContain('medical');
    expect(ids).toContain('golf');
    expect(ids).toContain('inspection');
    expect(ids).toContain('partner');
  });
});
