import { describe, it, expect } from 'vitest';
import {
  pricingTerms,
  timePeriods,
  formatCurrency,
  translateTerm,
  generatePricingText,
  localeDisplayNames,
  localeFlags,
  type PricingLocale,
} from '@/lib/utils/venue-pricing-i18n';

const LOCALES: PricingLocale[] = ['ja', 'zh-TW', 'zh-CN', 'en'];

// ============================================================
// pricingTerms data integrity
// ============================================================

describe('pricingTerms', () => {
  it('has entries', () => {
    expect(Object.keys(pricingTerms).length).toBeGreaterThan(20);
  });

  it('every entry has all 4 locales', () => {
    for (const [key, translations] of Object.entries(pricingTerms)) {
      for (const locale of LOCALES) {
        expect(translations[locale], `Missing ${locale} for ${key}`).toBeDefined();
        expect(translations[locale].length).toBeGreaterThan(0);
      }
    }
  });

  it('includes common terms', () => {
    expect(pricingTerms.business_hours).toBeDefined();
    expect(pricingTerms.service_charge).toBeDefined();
    expect(pricingTerms.tax_included).toBeDefined();
    expect(pricingTerms.nomination).toBeDefined();
    expect(pricingTerms.vip_room).toBeDefined();
  });
});

// ============================================================
// timePeriods data integrity
// ============================================================

describe('timePeriods', () => {
  it('has entries', () => {
    expect(Object.keys(timePeriods).length).toBeGreaterThan(5);
  });

  it('every entry has all 4 locales', () => {
    for (const [key, translations] of Object.entries(timePeriods)) {
      for (const locale of LOCALES) {
        expect(translations[locale], `Missing ${locale} for ${key}`).toBeDefined();
      }
    }
  });
});

// ============================================================
// formatCurrency
// ============================================================

describe('formatCurrency', () => {
  it('formats number with yen sign', () => {
    expect(formatCurrency(5500, 'ja')).toBe('¥5,500');
  });

  it('translates 無料 to each locale', () => {
    expect(formatCurrency('無料', 'ja')).toBe('無料');
    expect(formatCurrency('無料', 'zh-TW')).toBe('免費');
    expect(formatCurrency('無料', 'zh-CN')).toBe('免费');
    expect(formatCurrency('無料', 'en')).toBe('Free');
  });

  it('returns non-無料 strings as-is', () => {
    expect(formatCurrency('要確認', 'ja')).toBe('要確認');
  });

  it('formats zero', () => {
    expect(formatCurrency(0, 'en')).toBe('¥0');
  });
});

// ============================================================
// translateTerm
// ============================================================

describe('translateTerm', () => {
  it('translates pricingTerms', () => {
    expect(translateTerm('business_hours', 'ja')).toBe('営業時間');
    expect(translateTerm('business_hours', 'en')).toBe('Business Hours');
  });

  it('translates timePeriods', () => {
    expect(translateTerm('〜20時', 'en')).toBe('Until 20:00');
    expect(translateTerm('ALL TIME', 'zh-CN')).toBe('全时段');
  });

  it('returns original for unknown term', () => {
    expect(translateTerm('unknown_xyz', 'ja')).toBe('unknown_xyz');
  });
});

// ============================================================
// generatePricingText
// ============================================================

describe('generatePricingText', () => {
  it('includes venue name in header', () => {
    const text = generatePricingText({ name: 'Club ABC' }, 'ja');
    expect(text).toContain('【Club ABC】');
  });

  it('includes business hours when provided', () => {
    const text = generatePricingText({
      name: 'Test',
      business_hours: '20:00-01:00',
    }, 'ja');
    expect(text).toContain('営業時間');
    expect(text).toContain('20:00-01:00');
  });

  it('includes closed days', () => {
    const text = generatePricingText({
      name: 'Test',
      closed_days: '日曜日',
    }, 'zh-TW');
    expect(text).toContain('公休日');
  });

  it('includes service charge', () => {
    const text = generatePricingText({
      name: 'Test',
      service_charge: '20%',
    }, 'en');
    expect(text).toContain('Service Charge');
    expect(text).toContain('20%');
  });

  it('includes website', () => {
    const text = generatePricingText({
      name: 'Test',
      website: 'https://example.com',
    }, 'en');
    expect(text).toContain('Website');
    expect(text).toContain('https://example.com');
  });

  it('includes footer disclaimer', () => {
    const text = generatePricingText({ name: 'Test' }, 'en');
    expect(text).toContain('Prices include tax');
  });

  it('uses locale-specific footer', () => {
    const ja = generatePricingText({ name: 'Test' }, 'ja');
    expect(ja).toContain('税込価格');

    const zhCN = generatePricingText({ name: 'Test' }, 'zh-CN');
    expect(zhCN).toContain('含税价格');
  });

  it('handles pricing_info with extension', () => {
    const text = generatePricingText({
      name: 'Test',
      pricing_info: {
        extension: { '30min': 3000 },
      },
    }, 'ja');
    expect(text).toContain('延長料金');
  });

  it('handles pricing_info with nomination', () => {
    const text = generatePricingText({
      name: 'Test',
      pricing_info: {
        nomination: 2200,
      },
    }, 'en');
    expect(text).toContain('Nomination Fee');
  });

  it('handles pricing_info with dohan (number)', () => {
    const text = generatePricingText({
      name: 'Test',
      pricing_info: {
        dohan: 5500,
      },
    }, 'ja');
    expect(text).toContain('同伴料金');
  });

  it('handles pricing_info with dohan (無料)', () => {
    const text = generatePricingText({
      name: 'Test',
      pricing_info: {
        dohan: '無料',
      },
    }, 'zh-TW');
    expect(text).toContain('同伴費');
    expect(text).toContain('免費');
  });

  it('handles pricing_info with vip rooms', () => {
    const text = generatePricingText({
      name: 'Test',
      pricing_info: {
        vip_room: { 'Room A': 11000, 'Room B': 22000 },
      },
    }, 'ja');
    expect(text).toContain('VIPルーム');
    expect(text).toContain('Room A');
  });

  it('handles pricing_info with house_bottle', () => {
    const text = generatePricingText({
      name: 'Test',
      pricing_info: {
        house_bottle: 5000,
      },
    }, 'en');
    expect(text).toContain('¥5,000');
  });

  it('handles pricing_info with remarks', () => {
    const text = generatePricingText({
      name: 'Test',
      pricing_info: {
        remarks: 'Special note here',
      },
    }, 'ja');
    expect(text).toContain('備考');
    expect(text).toContain('Special note here');
  });

  it('handles pricing_info with system pricing', () => {
    const text = generatePricingText({
      name: 'Test',
      pricing_info: {
        system_60min: {
          '〜20時': 5500,
          '20時以降': 6600,
        },
      },
    }, 'en');
    expect(text).toContain('Pricing System');
    expect(text).toContain('Until 20:00');
    expect(text).toContain('After 20:00');
  });
});

// ============================================================
// localeDisplayNames / localeFlags
// ============================================================

describe('localeDisplayNames', () => {
  it('has all 4 locales', () => {
    for (const locale of LOCALES) {
      expect(localeDisplayNames[locale]).toBeDefined();
    }
  });

  it('has correct values', () => {
    expect(localeDisplayNames.ja).toBe('日本語');
    expect(localeDisplayNames.en).toBe('English');
  });
});

describe('localeFlags', () => {
  it('has all 4 locales', () => {
    for (const locale of LOCALES) {
      expect(localeFlags[locale]).toBeDefined();
    }
  });
});
