import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
const mockGetUser = vi.fn();
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

// Set ADMIN_EMAILS env before import
process.env.ADMIN_EMAILS = 'admin1@test.com,admin2@test.com';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

import { isAdmin, verifyAdminAuth } from '@/lib/utils/admin-auth';

// ============================================================
// isAdmin
// ============================================================

describe('isAdmin', () => {
  it('returns true for admin email', () => {
    expect(isAdmin('admin1@test.com')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isAdmin('ADMIN1@TEST.COM')).toBe(true);
    expect(isAdmin('Admin2@Test.Com')).toBe(true);
  });

  it('returns false for non-admin', () => {
    expect(isAdmin('user@test.com')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isAdmin('')).toBe(false);
  });
});

// ============================================================
// verifyAdminAuth
// ============================================================

describe('verifyAdminAuth', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
  });

  it('rejects null auth header', async () => {
    const result = await verifyAdminAuth(null);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('rejects non-Bearer header', async () => {
    const result = await verifyAdminAuth('Basic abc123');
    expect(result.isValid).toBe(false);
  });

  it('rejects when Supabase returns error', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Invalid token' },
    });
    const result = await verifyAdminAuth('Bearer invalid-token');
    expect(result.isValid).toBe(false);
  });

  it('rejects when user has no email', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: 'user-1', email: null } },
      error: null,
    });
    const result = await verifyAdminAuth('Bearer token-123');
    expect(result.isValid).toBe(false);
  });

  it('rejects non-admin user', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: 'user-1', email: 'user@test.com' } },
      error: null,
    });
    const result = await verifyAdminAuth('Bearer token-123');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('管理员');
  });

  it('accepts valid admin user', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: 'admin-1', email: 'admin1@test.com' } },
      error: null,
    });
    const result = await verifyAdminAuth('Bearer valid-token');
    expect(result.isValid).toBe(true);
    expect(result.userId).toBe('admin-1');
    expect(result.email).toBe('admin1@test.com');
  });
});
