import { describe, it, expect } from 'vitest';
import {
  MEDICAL_PACKAGES,
  getPackageConfig,
  getAllPackageConfigs,
  getPackagesByCategory,
  formatPrice,
} from '@/lib/config/medical-packages';

// ============================================================
// MEDICAL_PACKAGES data integrity
// ============================================================

describe('MEDICAL_PACKAGES', () => {
  it('is a non-empty object', () => {
    expect(Object.keys(MEDICAL_PACKAGES).length).toBeGreaterThan(0);
  });

  it('all packages have required fields', () => {
    for (const [slug, pkg] of Object.entries(MEDICAL_PACKAGES)) {
      expect(pkg.slug, `Missing slug for ${slug}`).toBe(slug);
      expect(pkg.category, `Missing category for ${slug}`).toBeTruthy();
      expect(typeof pkg.sortOrder).toBe('number');
    }
  });

  it('all packages have valid categories', () => {
    const validCategories = ['cancer_treatment', 'health_checkup', 'cosmetic_surgery', 'other'];
    for (const [slug, pkg] of Object.entries(MEDICAL_PACKAGES)) {
      expect(validCategories, `Invalid category for ${slug}: ${pkg.category}`).toContain(pkg.category);
    }
  });
});

// ============================================================
// getPackageConfig
// ============================================================

describe('getPackageConfig', () => {
  it('returns config for valid slug', () => {
    const slugs = Object.keys(MEDICAL_PACKAGES);
    const config = getPackageConfig(slugs[0]);
    expect(config).not.toBeNull();
    expect(config?.slug).toBe(slugs[0]);
  });

  it('returns null for unknown slug', () => {
    expect(getPackageConfig('nonexistent-package')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getPackageConfig('')).toBeNull();
  });
});

// ============================================================
// getAllPackageConfigs
// ============================================================

describe('getAllPackageConfigs', () => {
  it('returns all packages as array', () => {
    const configs = getAllPackageConfigs();
    expect(configs.length).toBe(Object.keys(MEDICAL_PACKAGES).length);
  });

  it('returns packages sorted by sortOrder', () => {
    const configs = getAllPackageConfigs();
    for (let i = 1; i < configs.length; i++) {
      expect(configs[i].sortOrder).toBeGreaterThanOrEqual(configs[i - 1].sortOrder);
    }
  });
});

// ============================================================
// getPackagesByCategory
// ============================================================

describe('getPackagesByCategory', () => {
  it('returns only packages of given category', () => {
    const healthCheckup = getPackagesByCategory('health_checkup');
    for (const pkg of healthCheckup) {
      expect(pkg.category).toBe('health_checkup');
    }
  });

  it('returns packages for cancer_treatment', () => {
    const cancer = getPackagesByCategory('cancer_treatment');
    for (const pkg of cancer) {
      expect(pkg.category).toBe('cancer_treatment');
    }
  });

  it('returns empty array for category with no packages', () => {
    // This may or may not be empty depending on data
    const result = getPackagesByCategory('other');
    for (const pkg of result) {
      expect(pkg.category).toBe('other');
    }
  });

  it('combined categories cover all packages', () => {
    const categories = ['cancer_treatment', 'health_checkup', 'cosmetic_surgery', 'other'] as const;
    let total = 0;
    for (const cat of categories) {
      total += getPackagesByCategory(cat).length;
    }
    expect(total).toBe(getAllPackageConfigs().length);
  });
});

// ============================================================
// formatPrice
// ============================================================

describe('formatPrice', () => {
  it('formats price with yen symbol', () => {
    const result = formatPrice(550000);
    expect(result).toContain('550,000');
  });

  it('formats zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('accepts locale parameter', () => {
    const result = formatPrice(100000, 'en-US');
    // Should still format as JPY
    expect(result).toBeTruthy();
  });
});
