import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashAPIKey, generateAPIKey, validateAPIKey } from '@/lib/utils/api-key-auth';

// Mock Supabase for validateAPIKey
vi.mock('@/lib/supabase/api', () => ({
  getSupabaseAdmin: () => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  }),
}));

// ============================================================
// hashAPIKey
// ============================================================

describe('hashAPIKey', () => {
  it('returns a 64-character hex string (SHA-256)', () => {
    const hash = hashAPIKey('nk_live_test123');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns consistent hash for same input', () => {
    const h1 = hashAPIKey('nk_live_abc');
    const h2 = hashAPIKey('nk_live_abc');
    expect(h1).toBe(h2);
  });

  it('returns different hash for different input', () => {
    const h1 = hashAPIKey('nk_live_key1');
    const h2 = hashAPIKey('nk_live_key2');
    expect(h1).not.toBe(h2);
  });
});

// ============================================================
// generateAPIKey
// ============================================================

describe('generateAPIKey', () => {
  it('generates key with nk_live_ prefix by default', () => {
    const { key, hash, prefix } = generateAPIKey();
    expect(key).toMatch(/^nk_live_/);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(prefix).toBe(key.slice(0, 12));
  });

  it('generates key with nk_test_ prefix for test env', () => {
    const { key } = generateAPIKey('test');
    expect(key).toMatch(/^nk_test_/);
  });

  it('generates unique keys each time', () => {
    const k1 = generateAPIKey();
    const k2 = generateAPIKey();
    expect(k1.key).not.toBe(k2.key);
    expect(k1.hash).not.toBe(k2.hash);
  });

  it('hash matches hashAPIKey of generated key', () => {
    const { key, hash } = generateAPIKey();
    expect(hashAPIKey(key)).toBe(hash);
  });

  it('prefix is first 12 characters of key', () => {
    const { key, prefix } = generateAPIKey();
    expect(prefix).toBe(key.slice(0, 12));
    expect(prefix.length).toBe(12);
  });
});

// ============================================================
// validateAPIKey
// ============================================================

describe('validateAPIKey', () => {
  it('rejects null auth header', async () => {
    const result = await validateAPIKey(null);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Missing');
  });

  it('rejects non-Bearer auth header', async () => {
    const result = await validateAPIKey('Basic abc123');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Missing');
  });

  it('rejects key without nk_ prefix', async () => {
    const result = await validateAPIKey('Bearer sk_live_abc123');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid API key format');
  });

  it('rejects unknown key (mocked Supabase returns null)', async () => {
    const result = await validateAPIKey('Bearer nk_live_unknown123');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid or inactive');
  });
});
