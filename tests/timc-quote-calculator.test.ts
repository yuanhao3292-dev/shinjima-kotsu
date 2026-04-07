import { describe, it, expect } from 'vitest';
import {
  calculateTIMCQuote,
  formatPrice,
  TIMC_PACKAGES,
  ADDON_PRICES,
  HOTEL_RATES,
  MARGIN_RATE,
  type TIMCQuoteRequest,
} from '@/services/timcQuoteCalculator';

// ============================================================
// Factory
// ============================================================

function makeRequest(overrides: Partial<TIMCQuoteRequest> = {}): TIMCQuoteRequest {
  return {
    packageId: 'basic',
    guestCount: 1,
    addOns: {
      airportTransfer: false,
      airportTransferRoundTrip: false,
      translator: false,
      translatorDays: 0,
      reportTranslation: false,
    },
    agencyInfo: {
      companyName: 'Test Corp',
      contactName: 'Taro',
      contactMethod: 'email',
      email: 'taro@test.com',
    },
    preferredDate: '2024-09-15',
    ...overrides,
  };
}

// ============================================================
// Constants
// ============================================================

describe('TIMC_PACKAGES', () => {
  it('has 6 packages', () => {
    expect(TIMC_PACKAGES).toHaveLength(6);
  });

  it('all packages have required fields', () => {
    for (const pkg of TIMC_PACKAGES) {
      expect(pkg.id).toBeDefined();
      expect(pkg.name).toBeDefined();
      expect(pkg.nameZh).toBeDefined();
      expect(pkg.price).toBeGreaterThan(0);
    }
  });

  it('has unique IDs', () => {
    const ids = TIMC_PACKAGES.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('ADDON_PRICES', () => {
  it('has positive prices', () => {
    expect(ADDON_PRICES.airportTransfer).toBeGreaterThan(0);
    expect(ADDON_PRICES.translatorDaily).toBeGreaterThan(0);
    expect(ADDON_PRICES.reportTranslation).toBeGreaterThan(0);
  });
});

describe('HOTEL_RATES', () => {
  it('has rates for Osaka, Tokyo, Kyoto', () => {
    expect(HOTEL_RATES).toHaveProperty('Osaka');
    expect(HOTEL_RATES).toHaveProperty('Tokyo');
    expect(HOTEL_RATES).toHaveProperty('Kyoto');
  });

  it('each location has 3-star, 4-star, and 5-star rates', () => {
    for (const location of ['Osaka', 'Tokyo', 'Kyoto']) {
      expect(HOTEL_RATES[location][3]).toBeGreaterThan(0);
      expect(HOTEL_RATES[location][4]).toBeGreaterThan(0);
      expect(HOTEL_RATES[location][5]).toBeGreaterThan(0);
    }
  });

  it('5-star > 4-star > 3-star for each location', () => {
    for (const location of ['Osaka', 'Tokyo', 'Kyoto']) {
      expect(HOTEL_RATES[location][5]).toBeGreaterThan(HOTEL_RATES[location][4]);
      expect(HOTEL_RATES[location][4]).toBeGreaterThan(HOTEL_RATES[location][3]);
    }
  });
});

describe('MARGIN_RATE', () => {
  it('is 15%', () => {
    expect(MARGIN_RATE).toBe(0.15);
  });
});

// ============================================================
// calculateTIMCQuote — basic
// ============================================================

describe('calculateTIMCQuote', () => {
  it('calculates basic package for 1 guest with no addons', () => {
    const result = calculateTIMCQuote(makeRequest());
    const pkg = TIMC_PACKAGES.find(p => p.id === 'basic')!;

    expect(result.packageId).toBe('basic');
    expect(result.packageName).toBe('BASIC');
    expect(result.packageNameZh).toBe('基礎套餐');
    expect(result.packagePrice).toBe(pkg.price);
    expect(result.guestCount).toBe(1);
    expect(result.packageTotal).toBe(pkg.price);

    expect(result.airportTransferPrice).toBe(0);
    expect(result.translatorPrice).toBe(0);
    expect(result.reportTranslationPrice).toBe(0);
    expect(result.hotelPrice).toBe(0);

    expect(result.subtotal).toBe(pkg.price);
    expect(result.margin).toBe(Math.ceil(pkg.price * MARGIN_RATE));
    expect(result.finalPrice).toBe(pkg.price + Math.ceil(pkg.price * MARGIN_RATE));
    expect(result.pricePerPerson).toBe(result.finalPrice);
  });

  it('multiplies package price by guest count', () => {
    const result = calculateTIMCQuote(makeRequest({ guestCount: 3 }));
    const pkg = TIMC_PACKAGES.find(p => p.id === 'basic')!;
    expect(result.packageTotal).toBe(pkg.price * 3);
  });

  it('throws for invalid package ID', () => {
    expect(() => calculateTIMCQuote(makeRequest({ packageId: 'nonexistent' }))).toThrow(
      'Invalid package ID: nonexistent'
    );
  });

  // ---- airport transfer ----
  it('calculates one-way airport transfer', () => {
    const result = calculateTIMCQuote(makeRequest({
      addOns: {
        airportTransfer: true,
        airportTransferRoundTrip: false,
        translator: false,
        translatorDays: 0,
        reportTranslation: false,
      },
    }));
    expect(result.airportTransferPrice).toBe(ADDON_PRICES.airportTransfer);
  });

  it('calculates round-trip airport transfer', () => {
    const result = calculateTIMCQuote(makeRequest({
      addOns: {
        airportTransfer: true,
        airportTransferRoundTrip: true,
        translator: false,
        translatorDays: 0,
        reportTranslation: false,
      },
    }));
    expect(result.airportTransferPrice).toBe(ADDON_PRICES.airportTransfer * 2);
  });

  it('no airport transfer price when not selected', () => {
    const result = calculateTIMCQuote(makeRequest({
      addOns: {
        airportTransfer: false,
        airportTransferRoundTrip: true, // ignored since airportTransfer is false
        translator: false,
        translatorDays: 0,
        reportTranslation: false,
      },
    }));
    expect(result.airportTransferPrice).toBe(0);
  });

  // ---- translator ----
  it('calculates translator cost per day', () => {
    const result = calculateTIMCQuote(makeRequest({
      addOns: {
        airportTransfer: false,
        airportTransferRoundTrip: false,
        translator: true,
        translatorDays: 3,
        reportTranslation: false,
      },
    }));
    expect(result.translatorPrice).toBe(ADDON_PRICES.translatorDaily * 3);
    expect(result.translatorDays).toBe(3);
  });

  it('zero translator cost when translator=false', () => {
    const result = calculateTIMCQuote(makeRequest({
      addOns: {
        airportTransfer: false,
        airportTransferRoundTrip: false,
        translator: false,
        translatorDays: 5,
        reportTranslation: false,
      },
    }));
    expect(result.translatorPrice).toBe(0);
  });

  // ---- report translation ----
  it('multiplies report translation by guest count', () => {
    const result = calculateTIMCQuote(makeRequest({
      guestCount: 2,
      addOns: {
        airportTransfer: false,
        airportTransferRoundTrip: false,
        translator: false,
        translatorDays: 0,
        reportTranslation: true,
      },
    }));
    expect(result.reportTranslationPrice).toBe(ADDON_PRICES.reportTranslation * 2);
  });

  // ---- hotel ----
  it('calculates hotel cost correctly', () => {
    const result = calculateTIMCQuote(makeRequest({
      hotel: {
        nights: 2,
        rooms: 1,
        stars: 4,
        location: 'Tokyo',
      },
    }));
    const expectedPerNight = HOTEL_RATES['Tokyo'][4];
    expect(result.hotelPrice).toBe(expectedPerNight * 1 * 2);
    expect(result.hotelDetails).toBeDefined();
    expect(result.hotelDetails!.pricePerNight).toBe(expectedPerNight);
    expect(result.hotelDetails!.location).toBe('Tokyo');
    expect(result.hotelDetails!.stars).toBe(4);
  });

  it('falls back to Osaka rates for unknown location', () => {
    const result = calculateTIMCQuote(makeRequest({
      hotel: {
        nights: 1,
        rooms: 1,
        stars: 3,
        location: 'UnknownCity',
      },
    }));
    expect(result.hotelPrice).toBe(HOTEL_RATES['Osaka'][3]);
  });

  it('multiplies hotel by rooms × nights', () => {
    const result = calculateTIMCQuote(makeRequest({
      hotel: {
        nights: 3,
        rooms: 2,
        stars: 5,
        location: 'Kyoto',
      },
    }));
    expect(result.hotelPrice).toBe(HOTEL_RATES['Kyoto'][5] * 2 * 3);
  });

  // ---- subtotal and margin ----
  it('subtotal = package + addons + hotel', () => {
    const result = calculateTIMCQuote(makeRequest({
      guestCount: 2,
      addOns: {
        airportTransfer: true,
        airportTransferRoundTrip: true,
        translator: true,
        translatorDays: 2,
        reportTranslation: true,
      },
      hotel: {
        nights: 2,
        rooms: 1,
        stars: 4,
        location: 'Osaka',
      },
    }));

    const expectedSubtotal =
      result.packageTotal +
      result.airportTransferPrice +
      result.translatorPrice +
      result.reportTranslationPrice +
      result.hotelPrice;

    expect(result.subtotal).toBe(expectedSubtotal);
    expect(result.margin).toBe(Math.ceil(expectedSubtotal * MARGIN_RATE));
    expect(result.finalPrice).toBe(expectedSubtotal + result.margin);
  });

  it('pricePerPerson = ceil(finalPrice / guestCount)', () => {
    const result = calculateTIMCQuote(makeRequest({ guestCount: 3 }));
    expect(result.pricePerPerson).toBe(Math.ceil(result.finalPrice / 3));
  });

  // ---- metadata ----
  it('generates quoteNumber with TIMC-Q prefix', () => {
    const result = calculateTIMCQuote(makeRequest());
    expect(result.quoteNumber).toMatch(/^TIMC-Q\d{6}-\d{3}$/);
  });

  it('sets quoteDate to today', () => {
    const result = calculateTIMCQuote(makeRequest());
    const today = new Date().toISOString().slice(0, 10);
    expect(result.quoteDate).toBe(today);
  });

  it('sets validUntil to 30 days from now', () => {
    const result = calculateTIMCQuote(makeRequest());
    const expected = new Date();
    expected.setDate(expected.getDate() + 30);
    expect(result.validUntil).toBe(expected.toISOString().slice(0, 10));
  });

  it('passes through agencyInfo and dates', () => {
    const result = calculateTIMCQuote(makeRequest({
      alternateDate: '2024-09-20',
      notes: 'VIP client',
    }));
    expect(result.agencyInfo.companyName).toBe('Test Corp');
    expect(result.preferredDate).toBe('2024-09-15');
    expect(result.alternateDate).toBe('2024-09-20');
    expect(result.notes).toBe('VIP client');
  });

  // ---- all packages ----
  it('accepts all 6 valid package IDs', () => {
    for (const pkg of TIMC_PACKAGES) {
      expect(() => calculateTIMCQuote(makeRequest({ packageId: pkg.id }))).not.toThrow();
    }
  });
});

// ============================================================
// formatPrice
// ============================================================

describe('formatPrice', () => {
  it('prepends yen sign', () => {
    expect(formatPrice(1000)).toMatch(/^¥/);
  });

  it('formats with locale separators', () => {
    const result = formatPrice(1500000);
    expect(result).toContain('¥');
    // Should have some form of thousands separator
    expect(result.length).toBeGreaterThan(4);
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('¥0');
  });
});
