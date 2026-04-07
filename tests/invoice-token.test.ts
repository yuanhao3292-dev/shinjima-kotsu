import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateInvoiceToken, verifyInvoiceToken } from '@/lib/invoice-token';

// Ensure a consistent secret for tests
beforeEach(() => {
  vi.stubEnv('INVOICE_SECRET', 'test-secret-key-for-testing');
});

describe('generateInvoiceToken', () => {
  it('returns a hex string', async () => {
    const token = await generateInvoiceToken('order-123', 'user@example.com');
    expect(token).toMatch(/^[0-9a-f]+$/);
  });

  it('returns same token for same inputs within same time bucket', async () => {
    const t1 = await generateInvoiceToken('order-123', 'user@example.com');
    const t2 = await generateInvoiceToken('order-123', 'user@example.com');
    expect(t1).toBe(t2);
  });

  it('returns different token for different orderId', async () => {
    const t1 = await generateInvoiceToken('order-123', 'user@example.com');
    const t2 = await generateInvoiceToken('order-456', 'user@example.com');
    expect(t1).not.toBe(t2);
  });

  it('returns different token for different email', async () => {
    const t1 = await generateInvoiceToken('order-123', 'a@example.com');
    const t2 = await generateInvoiceToken('order-123', 'b@example.com');
    expect(t1).not.toBe(t2);
  });
});

describe('verifyInvoiceToken', () => {
  it('verifies a freshly generated token', async () => {
    const token = await generateInvoiceToken('order-123', 'user@example.com');
    const valid = await verifyInvoiceToken(token, 'order-123', 'user@example.com');
    expect(valid).toBe(true);
  });

  it('rejects wrong orderId', async () => {
    const token = await generateInvoiceToken('order-123', 'user@example.com');
    const valid = await verifyInvoiceToken(token, 'order-wrong', 'user@example.com');
    expect(valid).toBe(false);
  });

  it('rejects wrong email', async () => {
    const token = await generateInvoiceToken('order-123', 'user@example.com');
    const valid = await verifyInvoiceToken(token, 'order-123', 'wrong@example.com');
    expect(valid).toBe(false);
  });

  it('normalizes email (case-insensitive + trimmed)', async () => {
    const token = await generateInvoiceToken('order-123', 'User@Example.COM');
    const valid = await verifyInvoiceToken(token, 'order-123', '  user@example.com  ');
    expect(valid).toBe(true);
  });

  it('rejects random garbage token', async () => {
    const valid = await verifyInvoiceToken('deadbeef', 'order-123', 'user@example.com');
    expect(valid).toBe(false);
  });

  it('rejects empty token', async () => {
    const valid = await verifyInvoiceToken('', 'order-123', 'user@example.com');
    expect(valid).toBe(false);
  });
});
