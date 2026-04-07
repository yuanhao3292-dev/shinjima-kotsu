import { describe, it, expect } from 'vitest';
import {
  PRODUCT_CATEGORIES,
  MODULE_DETAIL_ROUTES,
  getActiveCategories,
} from '@/lib/config/product-categories';

// ============================================================
// MODULE_DETAIL_ROUTES
// ============================================================

describe('MODULE_DETAIL_ROUTES', () => {
  it('has entries', () => {
    expect(Object.keys(MODULE_DETAIL_ROUTES).length).toBeGreaterThan(5);
  });

  it('all routes start with /', () => {
    for (const [key, route] of Object.entries(MODULE_DETAIL_ROUTES)) {
      expect(route, `Route for ${key} doesn't start with /`).toMatch(/^\//);
    }
  });
});

// ============================================================
// PRODUCT_CATEGORIES
// ============================================================

describe('PRODUCT_CATEGORIES', () => {
  it('has 4 categories', () => {
    expect(PRODUCT_CATEGORIES).toHaveLength(4);
  });

  it('all categories have required fields', () => {
    for (const cat of PRODUCT_CATEGORIES) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.nameJa).toBeTruthy();
      expect(cat.description).toBeTruthy();
      expect(cat.iconName).toBeTruthy();
      expect(cat.gradient).toBeTruthy();
      expect(cat.textColor).toBeTruthy();
      expect(cat.moduleKeys.length).toBeGreaterThan(0);
      expect(cat.sortOrder).toBeGreaterThan(0);
    }
  });

  it('has unique IDs', () => {
    const ids = PRODUCT_CATEGORIES.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has ascending sort order', () => {
    for (let i = 1; i < PRODUCT_CATEGORIES.length; i++) {
      expect(PRODUCT_CATEGORIES[i].sortOrder).toBeGreaterThan(PRODUCT_CATEGORIES[i - 1].sortOrder);
    }
  });
});

// ============================================================
// getActiveCategories
// ============================================================

describe('getActiveCategories', () => {
  it('returns categories matching module keys', () => {
    const active = getActiveCategories(['hyogo_medical', 'medical_packages']);
    expect(active.length).toBeGreaterThan(0);
    // All returned categories should have at least one matching key
    for (const cat of active) {
      const hasMatch = cat.moduleKeys.some(k =>
        ['hyogo_medical', 'medical_packages'].includes(k)
      );
      expect(hasMatch).toBe(true);
    }
  });

  it('returns empty for no matching keys', () => {
    expect(getActiveCategories(['nonexistent'])).toEqual([]);
  });

  it('returns empty for empty input', () => {
    expect(getActiveCategories([])).toEqual([]);
  });

  it('returns sorted by sortOrder', () => {
    const active = getActiveCategories(
      PRODUCT_CATEGORIES.flatMap(c => c.moduleKeys)
    );
    for (let i = 1; i < active.length; i++) {
      expect(active[i].sortOrder).toBeGreaterThanOrEqual(active[i - 1].sortOrder);
    }
  });

  it('returns all categories when all module keys present', () => {
    const allKeys = PRODUCT_CATEGORIES.flatMap(c => c.moduleKeys);
    const active = getActiveCategories(allKeys);
    expect(active).toHaveLength(PRODUCT_CATEGORIES.length);
  });
});
