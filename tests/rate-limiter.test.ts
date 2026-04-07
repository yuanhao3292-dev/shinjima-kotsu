import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkRateLimit,
  getClientIp,
  buildRateLimitKey,
  createRateLimitHeaders,
  RATE_LIMITS,
} from '@/lib/utils/rate-limiter';
import type { RateLimitResult } from '@/lib/utils/rate-limiter';

// Ensure Redis is not configured → forces memory mode
beforeEach(() => {
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
});

// ============================================================
// RATE_LIMITS constants
// ============================================================

describe('RATE_LIMITS', () => {
  it('has search, standard, sensitive, and auth presets', () => {
    expect(RATE_LIMITS.search).toBeDefined();
    expect(RATE_LIMITS.standard).toBeDefined();
    expect(RATE_LIMITS.sensitive).toBeDefined();
    expect(RATE_LIMITS.auth).toBeDefined();
  });

  it('search allows more requests than sensitive', () => {
    expect(RATE_LIMITS.search.maxRequests).toBeGreaterThan(RATE_LIMITS.sensitive.maxRequests);
  });

  it('auth has longest window', () => {
    expect(RATE_LIMITS.auth.windowMs).toBeGreaterThan(RATE_LIMITS.standard.windowMs);
  });
});

// ============================================================
// checkRateLimit (memory mode)
// ============================================================

describe('checkRateLimit (memory mode)', () => {
  it('allows first request', async () => {
    const result = await checkRateLimit('test-unique-1', { windowMs: 60000, maxRequests: 5 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('tracks request count within window', async () => {
    const config = { windowMs: 60000, maxRequests: 3 };
    const key = 'test-count-' + Date.now();

    const r1 = await checkRateLimit(key, config);
    expect(r1.remaining).toBe(2);

    const r2 = await checkRateLimit(key, config);
    expect(r2.remaining).toBe(1);

    const r3 = await checkRateLimit(key, config);
    expect(r3.remaining).toBe(0);
  });

  it('rejects when limit exceeded', async () => {
    const config = { windowMs: 60000, maxRequests: 2 };
    const key = 'test-exceed-' + Date.now();

    await checkRateLimit(key, config);
    await checkRateLimit(key, config);
    const r3 = await checkRateLimit(key, config);

    expect(r3.success).toBe(false);
    expect(r3.remaining).toBe(0);
    expect(r3.retryAfter).toBeDefined();
    expect(r3.retryAfter!).toBeGreaterThan(0);
  });

  it('returns resetTime in the future', async () => {
    const now = Date.now();
    const result = await checkRateLimit('test-reset-' + now, { windowMs: 60000, maxRequests: 10 });
    expect(result.resetTime).toBeGreaterThan(now);
  });

  it('different keys track independently', async () => {
    const config = { windowMs: 60000, maxRequests: 1 };
    const key1 = 'test-independent-a-' + Date.now();
    const key2 = 'test-independent-b-' + Date.now();

    await checkRateLimit(key1, config);
    const r2 = await checkRateLimit(key2, config);

    expect(r2.success).toBe(true);
  });
});

// ============================================================
// getClientIp
// ============================================================

describe('getClientIp', () => {
  it('returns x-forwarded-for first IP', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('returns x-real-ip when x-forwarded-for is absent', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '10.0.0.1' },
    });
    expect(getClientIp(req)).toBe('10.0.0.1');
  });

  it('returns "unknown" when no IP headers present', () => {
    const req = new Request('http://localhost');
    expect(getClientIp(req)).toBe('unknown');
  });

  it('trims whitespace from forwarded IP', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '  1.2.3.4  ' },
    });
    expect(getClientIp(req)).toBe('1.2.3.4');
  });
});

// ============================================================
// buildRateLimitKey
// ============================================================

describe('buildRateLimitKey', () => {
  it('uses userId when provided', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4' },
    });
    const key = buildRateLimitKey(req, '/api/test', 'user-123');
    expect(key).toBe('user:user-123:/api/test');
  });

  it('falls back to IP when userId is null', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4' },
    });
    const key = buildRateLimitKey(req, '/api/test', null);
    expect(key).toBe('1.2.3.4:/api/test');
  });

  it('falls back to IP when userId is undefined', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4' },
    });
    const key = buildRateLimitKey(req, '/api/test');
    expect(key).toBe('1.2.3.4:/api/test');
  });
});

// ============================================================
// createRateLimitHeaders
// ============================================================

describe('createRateLimitHeaders', () => {
  it('sets remaining and reset headers', () => {
    const result: RateLimitResult = { success: true, remaining: 5, resetTime: 1700000000 };
    const headers = createRateLimitHeaders(result);
    expect(headers.get('X-RateLimit-Remaining')).toBe('5');
    expect(headers.get('X-RateLimit-Reset')).toBe('1700000000');
  });

  it('sets Retry-After when retryAfter is present', () => {
    const result: RateLimitResult = { success: false, remaining: 0, resetTime: 1700000000, retryAfter: 60 };
    const headers = createRateLimitHeaders(result);
    expect(headers.get('Retry-After')).toBe('60');
  });

  it('does not set Retry-After when not present', () => {
    const result: RateLimitResult = { success: true, remaining: 5, resetTime: 1700000000 };
    const headers = createRateLimitHeaders(result);
    expect(headers.get('Retry-After')).toBeNull();
  });
});
