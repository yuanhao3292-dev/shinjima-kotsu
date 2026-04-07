import { describe, it, expect } from 'vitest';
import {
  STOREFRONT_PAGES,
  PAGE_IDS,
  DEFAULT_SELECTED_PAGES,
  getPageById,
  getPageByHref,
  validatePageIds,
  filterValidPageIds,
} from '@/lib/whitelabel-pages';

// ============================================================
// STOREFRONT_PAGES data integrity
// ============================================================

describe('STOREFRONT_PAGES', () => {
  it('has pages', () => {
    expect(STOREFRONT_PAGES.length).toBeGreaterThan(0);
  });

  it('all pages have required fields', () => {
    for (const page of STOREFRONT_PAGES) {
      expect(page.id).toBeTruthy();
      expect(page.name).toBeTruthy();
      expect(page.nameJa).toBeTruthy();
      expect(page.nameEn).toBeTruthy();
      expect(page.description).toBeTruthy();
      expect(page.icon).toBeTruthy();
      expect(page.href).toMatch(/^\//);
      expect(['medical', 'leisure', 'business', 'service']).toContain(page.category);
      expect(typeof page.isDefault).toBe('boolean');
    }
  });

  it('has unique IDs', () => {
    const ids = STOREFRONT_PAGES.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ============================================================
// PAGE_IDS
// ============================================================

describe('PAGE_IDS', () => {
  it('matches STOREFRONT_PAGES IDs', () => {
    expect(PAGE_IDS).toEqual(STOREFRONT_PAGES.map(p => p.id));
  });
});

// ============================================================
// DEFAULT_SELECTED_PAGES
// ============================================================

describe('DEFAULT_SELECTED_PAGES', () => {
  it('contains only default pages', () => {
    const defaultPages = STOREFRONT_PAGES.filter(p => p.isDefault).map(p => p.id);
    expect(DEFAULT_SELECTED_PAGES).toEqual(defaultPages);
  });

  it('all default IDs exist in PAGE_IDS', () => {
    for (const id of DEFAULT_SELECTED_PAGES) {
      expect(PAGE_IDS).toContain(id);
    }
  });
});

// ============================================================
// getPageById
// ============================================================

describe('getPageById', () => {
  it('returns page for valid ID', () => {
    const page = getPageById('timc-medical');
    expect(page).toBeDefined();
    expect(page!.id).toBe('timc-medical');
  });

  it('returns undefined for unknown ID', () => {
    expect(getPageById('nonexistent')).toBeUndefined();
  });

  it('finds all pages', () => {
    for (const page of STOREFRONT_PAGES) {
      expect(getPageById(page.id)).toBeDefined();
    }
  });
});

// ============================================================
// getPageByHref
// ============================================================

describe('getPageByHref', () => {
  it('returns page for valid href', () => {
    const page = getPageByHref('/medical');
    expect(page).toBeDefined();
    expect(page!.href).toBe('/medical');
  });

  it('returns undefined for unknown href', () => {
    expect(getPageByHref('/nonexistent')).toBeUndefined();
  });
});

// ============================================================
// validatePageIds
// ============================================================

describe('validatePageIds', () => {
  it('returns true for all valid IDs', () => {
    expect(validatePageIds(['timc-medical', 'premium-golf'])).toBe(true);
  });

  it('returns false when any ID is invalid', () => {
    expect(validatePageIds(['timc-medical', 'invalid'])).toBe(false);
  });

  it('returns true for empty array', () => {
    expect(validatePageIds([])).toBe(true);
  });
});

// ============================================================
// filterValidPageIds
// ============================================================

describe('filterValidPageIds', () => {
  it('keeps only valid IDs', () => {
    const result = filterValidPageIds(['timc-medical', 'invalid', 'premium-golf']);
    expect(result).toEqual(['timc-medical', 'premium-golf']);
  });

  it('returns empty for all invalid', () => {
    expect(filterValidPageIds(['invalid1', 'invalid2'])).toEqual([]);
  });

  it('returns all for all valid', () => {
    const allIds = PAGE_IDS;
    expect(filterValidPageIds([...allIds])).toEqual(allIds);
  });
});
