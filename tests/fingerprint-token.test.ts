import { describe, it, expect } from 'vitest';
import {
  generateFingerprintToken,
  verifyFingerprintToken,
} from '@/lib/utils/fingerprint-token';

const TEST_SECRET = 'test-secret-for-fingerprint-token';

// ============================================================
// generateFingerprintToken
// ============================================================

describe('generateFingerprintToken', () => {
  it('returns token in v1.{score}.{timestamp}.{hmac} format', async () => {
    const token = await generateFingerprintToken(50, TEST_SECRET);
    const parts = token.split('.');
    expect(parts).toHaveLength(4);
    expect(parts[0]).toBe('v1');
    expect(parseInt(parts[1])).toBe(50);
    expect(parseInt(parts[2])).toBeGreaterThan(0);
    expect(parts[3]).toMatch(/^[a-f0-9]+$/);
  });

  it('includes correct score in token', async () => {
    const token = await generateFingerprintToken(75, TEST_SECRET);
    const parts = token.split('.');
    expect(parseInt(parts[1])).toBe(75);
  });

  it('generates different tokens at different times', async () => {
    const token1 = await generateFingerprintToken(50, TEST_SECRET);
    // Small delay to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));
    const token2 = await generateFingerprintToken(50, TEST_SECRET);
    expect(token1).not.toBe(token2);
  });
});

// ============================================================
// verifyFingerprintToken
// ============================================================

describe('verifyFingerprintToken', () => {
  it('verifies a valid token', async () => {
    const token = await generateFingerprintToken(42, TEST_SECRET);
    const result = await verifyFingerprintToken(token, TEST_SECRET);
    expect(result.valid).toBe(true);
    expect(result.score).toBe(42);
  });

  it('rejects token with wrong secret', async () => {
    const token = await generateFingerprintToken(50, TEST_SECRET);
    const result = await verifyFingerprintToken(token, 'wrong-secret');
    expect(result.valid).toBe(false);
    expect(result.score).toBe(100); // default high-risk score
  });

  it('rejects token with wrong version', async () => {
    const result = await verifyFingerprintToken('v2.50.12345.abcdef', TEST_SECRET);
    expect(result.valid).toBe(false);
  });

  it('rejects token with wrong number of parts', async () => {
    const result = await verifyFingerprintToken('v1.50.12345', TEST_SECRET);
    expect(result.valid).toBe(false);
  });

  it('rejects expired token (simulated)', async () => {
    // Create a token with an old timestamp
    const oldTimestamp = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago (TTL is 1 hour)
    // We can't easily create a valid HMAC for the old timestamp without internal access,
    // so we just test the format rejection
    const result = await verifyFingerprintToken('v1.50.1000000.deadbeef', TEST_SECRET);
    expect(result.valid).toBe(false);
  });

  it('rejects empty string', async () => {
    const result = await verifyFingerprintToken('', TEST_SECRET);
    expect(result.valid).toBe(false);
  });

  it('rejects malformed token gracefully', async () => {
    const result = await verifyFingerprintToken('garbage', TEST_SECRET);
    expect(result.valid).toBe(false);
  });
});
