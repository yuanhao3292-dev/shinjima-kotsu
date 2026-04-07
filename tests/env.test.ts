import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to test the env module which uses a module-level cache.
// To test both success and failure paths, we use dynamic imports.

describe('getServerEnv', () => {
  const validEnv = {
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    STRIPE_SECRET_KEY: 'sk_test_123',
    STRIPE_WEBHOOK_SECRET: 'whsec_123',
    OPENROUTER_API_KEY: 'test-openrouter-key',
    RESEND_API_KEY: 'test-resend-key',
    ADMIN_EMAILS: 'admin@test.com',
    ENCRYPTION_KEY: 'a-very-secure-key-1234',
  };

  it('throws on missing required vars', async () => {
    // Save original env
    const origEnv = { ...process.env };

    // Clear required vars
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.STRIPE_SECRET_KEY;

    // Reset module cache to force re-evaluation
    vi.resetModules();

    try {
      const { getServerEnv } = await import('@/lib/env');
      expect(() => getServerEnv()).toThrow('Missing or invalid environment variables');
    } finally {
      // Restore env
      Object.assign(process.env, origEnv);
    }
  });

  it('parses valid env and returns ServerEnv', async () => {
    // Set all required vars
    Object.assign(process.env, validEnv);

    vi.resetModules();
    const { getServerEnv } = await import('@/lib/env');
    const env = getServerEnv();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe(validEnv.NEXT_PUBLIC_SUPABASE_URL);
    expect(env.STRIPE_SECRET_KEY).toBe(validEnv.STRIPE_SECRET_KEY);
    expect(env.ADMIN_EMAILS).toBe(validEnv.ADMIN_EMAILS);
  });

  it('caches result on second call', async () => {
    Object.assign(process.env, validEnv);

    vi.resetModules();
    const { getServerEnv } = await import('@/lib/env');
    const first = getServerEnv();
    const second = getServerEnv();
    expect(first).toBe(second); // Same reference = cached
  });
});
