import { describe, it, expect } from 'vitest';
import {
  WHITELABEL_COOKIE_NAME,
  WHITELABEL_COOKIE_MAX_AGE,
  DOMAINS,
  DEV_WHITELABEL_PORT,
  SUBSCRIPTION_PLANS,
  DEFAULT_CONTACT,
  SLUG_REGEX,
  DEFAULT_SELECTED_PAGES,
  COOKIE_OPTIONS,
  getPlanPageLimit,
  isWithinPlanLimit,
  isValidSlug,
  sanitizeSlug,
} from '@/lib/whitelabel-config';

// ============================================================
// Constants
// ============================================================

describe('whitelabel-config constants', () => {
  it('WHITELABEL_COOKIE_NAME is a non-empty string', () => {
    expect(WHITELABEL_COOKIE_NAME).toBeTruthy();
    expect(typeof WHITELABEL_COOKIE_NAME).toBe('string');
  });

  it('WHITELABEL_COOKIE_MAX_AGE is 7 days in seconds', () => {
    expect(WHITELABEL_COOKIE_MAX_AGE).toBe(7 * 24 * 60 * 60);
  });

  it('DOMAINS has official and whitelabel entries', () => {
    expect(DOMAINS.official).toBeTruthy();
    expect(DOMAINS.whitelabel).toBeTruthy();
  });

  it('DEV_WHITELABEL_PORT is a number', () => {
    expect(typeof DEV_WHITELABEL_PORT).toBe('number');
  });

  it('SUBSCRIPTION_PLANS has professional plan', () => {
    expect(SUBSCRIPTION_PLANS.professional).toBeDefined();
    expect(SUBSCRIPTION_PLANS.professional.id).toBe('professional');
    expect(SUBSCRIPTION_PLANS.professional.maxPages).toBe(-1);
  });

  it('DEFAULT_CONTACT has all fields', () => {
    expect(DEFAULT_CONTACT.PHONE).toBeTruthy();
    expect(DEFAULT_CONTACT.EMAIL).toContain('@');
    expect(DEFAULT_CONTACT.LINE_URL).toContain('line.me');
    expect(DEFAULT_CONTACT.WECHAT_QR_URL).toBeTruthy();
  });

  it('DEFAULT_SELECTED_PAGES is a non-empty array', () => {
    expect(Array.isArray(DEFAULT_SELECTED_PAGES)).toBe(true);
    expect(DEFAULT_SELECTED_PAGES.length).toBeGreaterThan(0);
  });

  it('COOKIE_OPTIONS has required security settings', () => {
    expect(COOKIE_OPTIONS.maxAge).toBe(WHITELABEL_COOKIE_MAX_AGE);
    expect(COOKIE_OPTIONS.path).toBe('/');
    expect(COOKIE_OPTIONS.httpOnly).toBe(true);
    expect(COOKIE_OPTIONS.sameSite).toBe('lax');
  });
});

// ============================================================
// getPlanPageLimit
// ============================================================

describe('getPlanPageLimit', () => {
  it('returns -1 for professional plan', () => {
    expect(getPlanPageLimit('professional')).toBe(-1);
  });

  it('returns -1 for monthly plan', () => {
    expect(getPlanPageLimit('monthly')).toBe(-1);
  });

  it('returns -1 for null', () => {
    expect(getPlanPageLimit(null)).toBe(-1);
  });

  it('returns -1 for unknown plan', () => {
    expect(getPlanPageLimit('unknown')).toBe(-1);
  });
});

// ============================================================
// isWithinPlanLimit
// ============================================================

describe('isWithinPlanLimit', () => {
  it('returns true for unlimited plan (-1)', () => {
    expect(isWithinPlanLimit('professional', 100)).toBe(true);
  });

  it('returns true for null plan (defaults to unlimited)', () => {
    expect(isWithinPlanLimit(null, 50)).toBe(true);
  });
});

// ============================================================
// isValidSlug
// ============================================================

describe('isValidSlug', () => {
  it('returns true for valid slugs', () => {
    expect(isValidSlug('test-guide')).toBe(true);
    expect(isValidSlug('abc')).toBe(true);
    expect(isValidSlug('guide-123')).toBe(true);
    expect(isValidSlug('a-b-c-d-e-f')).toBe(true);
  });

  it('returns false for too short', () => {
    expect(isValidSlug('ab')).toBe(false);
    expect(isValidSlug('')).toBe(false);
  });

  it('returns false for uppercase', () => {
    expect(isValidSlug('TestGuide')).toBe(false);
  });

  it('returns false for special characters', () => {
    expect(isValidSlug('test_guide')).toBe(false);
    expect(isValidSlug('test guide')).toBe(false);
    expect(isValidSlug('test@guide')).toBe(false);
  });

  it('returns false for too long (>50 chars)', () => {
    expect(isValidSlug('a'.repeat(51))).toBe(false);
  });

  it('returns true for exactly 50 chars', () => {
    expect(isValidSlug('a'.repeat(50))).toBe(true);
  });

  it('returns true for exactly 3 chars', () => {
    expect(isValidSlug('abc')).toBe(true);
  });
});

// ============================================================
// sanitizeSlug
// ============================================================

describe('sanitizeSlug', () => {
  it('converts to lowercase', () => {
    expect(sanitizeSlug('TestGuide')).toBe('testguide');
  });

  it('replaces special chars with hyphens', () => {
    expect(sanitizeSlug('test guide')).toBe('test-guide');
    expect(sanitizeSlug('test@guide!')).toBe('test-guide');
  });

  it('collapses multiple hyphens', () => {
    expect(sanitizeSlug('test---guide')).toBe('test-guide');
  });

  it('trims leading and trailing hyphens', () => {
    expect(sanitizeSlug('-test-')).toBe('test');
  });

  it('truncates to 50 characters', () => {
    const long = 'a'.repeat(100);
    expect(sanitizeSlug(long).length).toBeLessThanOrEqual(50);
  });

  it('handles Chinese characters', () => {
    const result = sanitizeSlug('导游小王');
    expect(typeof result).toBe('string');
  });
});
