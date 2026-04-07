import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSigningToken } from '@/lib/utils/signing-token';

describe('generateSigningToken', () => {
  const originalEnv = process.env.ENCRYPTION_KEY;

  beforeEach(() => {
    process.env.ENCRYPTION_KEY = 'test-secret-key-for-signing-token';
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.ENCRYPTION_KEY = originalEnv;
    } else {
      delete process.env.ENCRYPTION_KEY;
    }
  });

  it('returns 32-character hex string', () => {
    const token = generateSigningToken('contract-123');
    expect(token).toMatch(/^[a-f0-9]{32}$/);
  });

  it('is deterministic for same input', () => {
    const token1 = generateSigningToken('contract-123');
    const token2 = generateSigningToken('contract-123');
    expect(token1).toBe(token2);
  });

  it('produces different tokens for different inputs', () => {
    const token1 = generateSigningToken('contract-1');
    const token2 = generateSigningToken('contract-2');
    expect(token1).not.toBe(token2);
  });

  it('throws when ENCRYPTION_KEY not set', () => {
    delete process.env.ENCRYPTION_KEY;
    expect(() => generateSigningToken('test')).toThrow('ENCRYPTION_KEY not configured');
  });
});
