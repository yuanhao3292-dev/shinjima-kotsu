import { describe, it, expect } from 'vitest';
import { calculateQuote } from '@/services/pricingEngine';
import {
  VEHICLE_RATES,
  VEHICLE_LABELS,
  GUIDE_RATES,
  HOTEL_RATES,
  MARGIN_RATE,
  LOCATIONS,
  STARS,
} from '../constants';

// ============================================================
// Constants integrity
// ============================================================

describe('pricing constants', () => {
  it('VEHICLE_RATES has 5 vehicle types', () => {
    expect(Object.keys(VEHICLE_RATES)).toHaveLength(5);
  });

  it('VEHICLE_LABELS matches VEHICLE_RATES keys', () => {
    expect(Object.keys(VEHICLE_LABELS).sort()).toEqual(Object.keys(VEHICLE_RATES).sort());
  });

  it('GUIDE_RATES has zh and en', () => {
    expect(GUIDE_RATES.zh).toBeGreaterThan(0);
    expect(GUIDE_RATES.en).toBeGreaterThan(0);
  });

  it('HOTEL_RATES has 5 locations with 3 star tiers', () => {
    expect(Object.keys(HOTEL_RATES)).toHaveLength(5);
    for (const [loc, rates] of Object.entries(HOTEL_RATES)) {
      expect(Object.keys(rates)).toHaveLength(3);
      expect(rates[3]).toBeGreaterThan(0);
      expect(rates[4]).toBeGreaterThan(rates[3]);
      expect(rates[5]).toBeGreaterThan(rates[4]);
    }
  });

  it('MARGIN_RATE is 15%', () => {
    expect(MARGIN_RATE).toBe(0.15);
  });

  it('LOCATIONS has 5 entries', () => {
    expect(LOCATIONS).toHaveLength(5);
  });

  it('STARS has 3 entries', () => {
    expect(STARS).toHaveLength(3);
  });
});

// ============================================================
// calculateQuote
// ============================================================

describe('calculateQuote', () => {
  const baseRequest = {
    pax: 4,
    travel_days: 3,
    need_bus: true,
    bus_type: 'alphard' as const,
    guide_language: 'zh' as const,
    hotel_req: {
      location: 'Osaka',
      stars: 4,
      rooms: 2,
      nights: 2,
    },
  };

  it('returns a valid quote response', async () => {
    const result = await calculateQuote(baseRequest);
    expect(result.id).toMatch(/^Q\d+$/);
    expect(result.status).toBe('success');
    expect(result.estimated_total_jpy).toBeGreaterThan(0);
    expect(result.per_person_jpy).toBeGreaterThan(0);
    expect(result.breakdown).toBeDefined();
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it('calculates transport cost correctly', async () => {
    const result = await calculateQuote(baseRequest);
    const expectedTransport = VEHICLE_RATES.alphard * 3; // 45000 * 3
    expect(result.breakdown.transport).toBe(expectedTransport);
  });

  it('calculates guide cost correctly', async () => {
    const result = await calculateQuote(baseRequest);
    const expectedGuide = GUIDE_RATES.zh * 3; // 25000 * 3
    expect(result.breakdown.guide).toBe(expectedGuide);
  });

  it('calculates hotel cost correctly', async () => {
    const result = await calculateQuote(baseRequest);
    const roomRate = HOTEL_RATES['Osaka'][4]; // 28000
    const expectedHotel = roomRate * 2 * 2; // rate * rooms * nights
    expect(result.breakdown.hotel_cost_basis).toBe(expectedHotel);
  });

  it('applies margin correctly', async () => {
    const result = await calculateQuote(baseRequest);
    const costBasis = result.breakdown.transport + result.breakdown.guide + result.breakdown.hotel_cost_basis;
    expect(result.breakdown.margin).toBe(Math.ceil(costBasis * MARGIN_RATE));
  });

  it('per_person_jpy = total / pax', async () => {
    const result = await calculateQuote(baseRequest);
    expect(result.per_person_jpy).toBe(Math.floor(result.estimated_total_jpy / 4));
  });

  it('sets transport to 0 when need_bus is false', async () => {
    const result = await calculateQuote({ ...baseRequest, need_bus: false });
    expect(result.breakdown.transport).toBe(0);
  });

  it('includes sourcing strategy in breakdown', async () => {
    const result = await calculateQuote(baseRequest);
    expect(result.breakdown.sourcing_strategy).toContain('Alphard');
    expect(result.breakdown.sourcing_strategy).toContain('中文');
  });

  it('uses English guide text for en language', async () => {
    const result = await calculateQuote({ ...baseRequest, guide_language: 'en' as any });
    expect(result.breakdown.sourcing_strategy).toContain('英文');
  });
});
