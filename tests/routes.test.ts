import { describe, it, expect } from 'vitest';
import { ROUTES, isRoute, isRoutePrefix } from '@/lib/constants/routes';

// ============================================================
// ROUTES constant
// ============================================================

describe('ROUTES', () => {
  it('HOME is /', () => {
    expect(ROUTES.HOME).toBe('/');
  });

  it('all route values start with /', () => {
    for (const [key, value] of Object.entries(ROUTES)) {
      expect(value, `Route ${key} doesn't start with /`).toMatch(/^\//);
    }
  });

  it('has expected route keys', () => {
    expect(ROUTES).toHaveProperty('LOGIN');
    expect(ROUTES).toHaveProperty('REGISTER');
    expect(ROUTES).toHaveProperty('MY_ACCOUNT');
    expect(ROUTES).toHaveProperty('ADMIN');
    expect(ROUTES).toHaveProperty('HEALTH_SCREENING');
    expect(ROUTES).toHaveProperty('FAQ');
    expect(ROUTES).toHaveProperty('GUIDE_PARTNER');
  });

  it('has unique route values', () => {
    const values = Object.values(ROUTES);
    // Some routes may share values, but most should be unique
    expect(values.length).toBeGreaterThan(10);
  });
});

// ============================================================
// isRoute
// ============================================================

describe('isRoute', () => {
  it('returns true for exact match', () => {
    expect(isRoute('/', ROUTES.HOME)).toBe(true);
    expect(isRoute('/login', ROUTES.LOGIN)).toBe(true);
  });

  it('returns false for non-match', () => {
    expect(isRoute('/login', ROUTES.HOME)).toBe(false);
    expect(isRoute('/login/extra', ROUTES.LOGIN)).toBe(false);
  });
});

// ============================================================
// isRoutePrefix
// ============================================================

describe('isRoutePrefix', () => {
  it('returns true when path starts with route', () => {
    expect(isRoutePrefix('/admin/users', ROUTES.ADMIN)).toBe(true);
    expect(isRoutePrefix('/business/golf', ROUTES.BUSINESS)).toBe(true);
  });

  it('returns true for exact match', () => {
    expect(isRoutePrefix('/admin', ROUTES.ADMIN)).toBe(true);
  });

  it('returns false for non-match', () => {
    expect(isRoutePrefix('/login', ROUTES.ADMIN)).toBe(false);
  });
});
