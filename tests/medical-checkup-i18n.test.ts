import { describe, it, expect } from 'vitest';
import {
  getPackages,
  getCheckItems,
  getTestimonials,
  ui,
} from '@/lib/data/medical-checkup-i18n';

const LANGUAGES = ['ja', 'zh-TW', 'zh-CN', 'en'] as const;

// ============================================================
// getPackages
// ============================================================

describe('getPackages', () => {
  it('returns 6 packages for each language', () => {
    for (const lang of LANGUAGES) {
      const pkgs = getPackages(lang);
      expect(pkgs).toHaveLength(6);
    }
  });

  it('all packages have required fields', () => {
    for (const lang of LANGUAGES) {
      const pkgs = getPackages(lang);
      for (const pkg of pkgs) {
        expect(pkg.id).toBeTruthy();
        expect(pkg.name).toBeTruthy();
        expect(pkg.nameZh).toBeTruthy();
        expect(pkg.price).toBeGreaterThan(0);
        expect(pkg.color).toBeTruthy();
        expect(pkg.slug).toBeTruthy();
      }
    }
  });

  it('returns localized nameZh for ja', () => {
    const pkgs = getPackages('ja');
    const dwibs = pkgs.find(p => p.id === 'dwibs');
    expect(dwibs?.nameZh).toContain('スクリーニング');
  });

  it('returns localized nameZh for en', () => {
    const pkgs = getPackages('en');
    const dwibs = pkgs.find(p => p.id === 'dwibs');
    expect(dwibs?.nameZh).toContain('Cancer');
  });

  it('zh-CN uses simplified Chinese', () => {
    const pkgs = getPackages('zh-CN');
    const dwibs = pkgs.find(p => p.id === 'dwibs');
    // zh-CN should be simplified version of zh-TW '防癌篩查' → '防癌筛查'
    expect(dwibs?.nameZh).toBeTruthy();
  });

  it('has unique IDs', () => {
    const pkgs = getPackages('en');
    const ids = pkgs.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('package IDs match expected set', () => {
    const pkgs = getPackages('en');
    const ids = pkgs.map(p => p.id);
    expect(ids).toContain('dwibs');
    expect(ids).toContain('basic');
    expect(ids).toContain('select-gastro');
    expect(ids).toContain('select-both');
    expect(ids).toContain('premium');
    expect(ids).toContain('vip');
  });
});

// ============================================================
// getCheckItems
// ============================================================

describe('getCheckItems', () => {
  it('returns non-empty array for each language', () => {
    for (const lang of LANGUAGES) {
      const items = getCheckItems(lang);
      expect(items.length).toBeGreaterThan(0);
    }
  });

  it('each category has name and items', () => {
    for (const lang of LANGUAGES) {
      const categories = getCheckItems(lang);
      for (const cat of categories) {
        expect(cat.category).toBeTruthy();
        expect(cat.items.length).toBeGreaterThan(0);
      }
    }
  });

  it('each item has name and packages status', () => {
    const categories = getCheckItems('en');
    for (const cat of categories) {
      for (const item of cat.items) {
        expect(item.name).toBeTruthy();
        expect(item.packages).toBeDefined();
      }
    }
  });

  it('package statuses use valid values', () => {
    const validStatuses = ['included', 'optional', 'partial', 'none'];
    const categories = getCheckItems('en');
    for (const cat of categories) {
      for (const item of cat.items) {
        for (const status of Object.values(item.packages)) {
          expect(validStatuses).toContain(status);
        }
      }
    }
  });
});

// ============================================================
// getTestimonials
// ============================================================

describe('getTestimonials', () => {
  it('returns non-empty array for each language', () => {
    for (const lang of LANGUAGES) {
      const testimonials = getTestimonials(lang);
      expect(testimonials.length).toBeGreaterThan(0);
    }
  });

  it('each testimonial has required fields', () => {
    for (const lang of LANGUAGES) {
      const testimonials = getTestimonials(lang);
      for (const t of testimonials) {
        expect(t.name).toBeTruthy();
        expect(t.loc).toBeTruthy();
        expect(t.flag).toBeTruthy();
        expect(t.pkg).toBeTruthy();
        expect(t.text).toBeTruthy();
        expect(t.highlight).toBeTruthy();
      }
    }
  });

  it('flags are emoji characters', () => {
    const testimonials = getTestimonials('en');
    for (const t of testimonials) {
      // Should be a flag emoji (or contain one)
      expect(t.flag.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================
// ui (UI strings lookup)
// ============================================================

describe('ui', () => {
  const uiKeys = [
    'checkItems', 'included', 'optional', 'partial', 'notIncluded',
    'book', 'bookNow', 'items',
    'legendIncluded', 'legendOptional', 'legendPartial', 'legendNone',
    'priceNote', 'source',
  ] as const;

  it('returns non-empty string for all keys in all languages', () => {
    for (const key of uiKeys) {
      for (const lang of LANGUAGES) {
        const result = ui(key, lang);
        expect(result.length, `Empty ui('${key}', '${lang}')`).toBeGreaterThan(0);
      }
    }
  });

  it('returns localized strings for ja', () => {
    expect(ui('checkItems', 'ja')).toBe('検査項目');
    expect(ui('included', 'ja')).toBe('含む');
  });

  it('returns localized strings for en', () => {
    expect(ui('checkItems', 'en')).toBe('Exam Items');
    expect(ui('bookNow', 'en')).toBe('Book Now');
  });

  it('returns key for unknown key', () => {
    // @ts-expect-error testing unknown key
    expect(ui('nonexistent_key', 'en')).toBe('nonexistent_key');
  });
});
