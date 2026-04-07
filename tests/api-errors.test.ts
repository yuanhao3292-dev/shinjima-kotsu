import { describe, it, expect, vi } from 'vitest';
import {
  ErrorType,
  createErrorResponse,
  normalizeError,
  Errors,
  logError,
} from '@/lib/utils/api-errors';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

// ============================================================
// ErrorType enum
// ============================================================

describe('ErrorType', () => {
  it('has all expected error types', () => {
    expect(ErrorType.VALIDATION).toBe('VALIDATION_ERROR');
    expect(ErrorType.AUTH).toBe('AUTH_ERROR');
    expect(ErrorType.FORBIDDEN).toBe('FORBIDDEN');
    expect(ErrorType.NOT_FOUND).toBe('NOT_FOUND');
    expect(ErrorType.BUSINESS).toBe('BUSINESS_ERROR');
    expect(ErrorType.EXTERNAL_SERVICE).toBe('EXTERNAL_SERVICE_ERROR');
    expect(ErrorType.RATE_LIMIT).toBe('RATE_LIMIT');
    expect(ErrorType.INTERNAL).toBe('INTERNAL_ERROR');
  });
});

// ============================================================
// Errors factory functions
// ============================================================

describe('Errors factory', () => {
  it('validation with string message', () => {
    const err = Errors.validation('Invalid input');
    expect(err.type).toBe(ErrorType.VALIDATION);
    expect(err.message).toBe('Invalid input');
  });

  it('validation with field array', () => {
    const err = Errors.validation([
      { field: 'name', message: 'Required' },
      { field: 'email', message: 'Invalid' },
    ]);
    expect(err.type).toBe(ErrorType.VALIDATION);
    expect(err.message).toBe('Required');
    expect(err.details).toBeDefined();
  });

  it('validation with empty field array uses default message', () => {
    const err = Errors.validation([]);
    expect(err.message).toBe('参数验证失败');
  });

  it('auth with default message', () => {
    const err = Errors.auth();
    expect(err.type).toBe(ErrorType.AUTH);
    expect(err.message).toBe('请先登录');
  });

  it('auth with custom message', () => {
    const err = Errors.auth('Token expired');
    expect(err.message).toBe('Token expired');
  });

  it('forbidden with default message', () => {
    const err = Errors.forbidden();
    expect(err.message).toBe('权限不足');
  });

  it('notFound includes resource name', () => {
    const err = Errors.notFound('套餐');
    expect(err.type).toBe(ErrorType.NOT_FOUND);
    expect(err.message).toBe('套餐不存在');
  });

  it('business with code', () => {
    const err = Errors.business('Package inactive', 'PKG_INACTIVE');
    expect(err.type).toBe(ErrorType.BUSINESS);
    expect(err.code).toBe('PKG_INACTIVE');
  });

  it('rateLimit with retryAfter', () => {
    const err = Errors.rateLimit(60);
    expect(err.type).toBe(ErrorType.RATE_LIMIT);
    expect(err.details).toEqual({ retryAfter: 60 });
  });

  it('rateLimit without retryAfter', () => {
    const err = Errors.rateLimit();
    expect(err.details).toBeUndefined();
  });

  it('internal with default message', () => {
    const err = Errors.internal();
    expect(err.type).toBe(ErrorType.INTERNAL);
    expect(err.message).toBe('服务器内部错误');
  });

  it('internal with custom message', () => {
    const err = Errors.internal('Database down');
    expect(err.message).toBe('Database down');
  });
});

// ============================================================
// createErrorResponse
// ============================================================

describe('createErrorResponse', () => {
  it('returns correct status code for VALIDATION (400)', async () => {
    const res = createErrorResponse(Errors.validation('bad input'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('bad input');
    expect(body.type).toBe('VALIDATION_ERROR');
  });

  it('returns 401 for AUTH error', () => {
    const res = createErrorResponse(Errors.auth());
    expect(res.status).toBe(401);
  });

  it('returns 403 for FORBIDDEN error', () => {
    const res = createErrorResponse(Errors.forbidden());
    expect(res.status).toBe(403);
  });

  it('returns 404 for NOT_FOUND error', () => {
    const res = createErrorResponse(Errors.notFound('User'));
    expect(res.status).toBe(404);
  });

  it('returns 422 for BUSINESS error', () => {
    const res = createErrorResponse(Errors.business('Invalid operation'));
    expect(res.status).toBe(422);
  });

  it('returns 429 for RATE_LIMIT error', () => {
    const res = createErrorResponse(Errors.rateLimit(30));
    expect(res.status).toBe(429);
  });

  it('returns 500 for INTERNAL error', () => {
    const res = createErrorResponse(Errors.internal());
    expect(res.status).toBe(500);
  });

  it('returns 502 for EXTERNAL_SERVICE error', () => {
    const res = createErrorResponse({
      type: ErrorType.EXTERNAL_SERVICE,
      message: 'Service down',
    });
    expect(res.status).toBe(502);
  });

  it('includes code when present', async () => {
    const res = createErrorResponse(Errors.business('fail', 'BIZ_001'));
    const body = await res.json();
    expect(body.code).toBe('BIZ_001');
  });

  it('accepts additional headers', () => {
    const headers = new Headers();
    headers.set('Retry-After', '60');
    const res = createErrorResponse(Errors.rateLimit(60), headers);
    expect(res.headers.get('Retry-After')).toBe('60');
  });
});

// ============================================================
// normalizeError
// ============================================================

describe('normalizeError', () => {
  it('returns APIError as-is', () => {
    const original = Errors.validation('test');
    expect(normalizeError(original)).toBe(original);
  });

  it('wraps generic Error as INTERNAL', () => {
    const err = normalizeError(new Error('Something broke'));
    expect(err.type).toBe(ErrorType.INTERNAL);
    expect(err.message).toBe('服务器内部错误');
  });

  it('detects Stripe errors', () => {
    const stripeErr = new Error('Card declined');
    (stripeErr as any).type = 'StripeCardError';
    (stripeErr as any).code = 'card_declined';
    const err = normalizeError(stripeErr);
    expect(err.type).toBe(ErrorType.EXTERNAL_SERVICE);
    expect(err.code).toBe('card_declined');
  });

  it('detects Supabase auth errors', () => {
    const supaErr = new Error('Invalid token');
    (supaErr as any).code = 'PGRST301';
    const err = normalizeError(supaErr);
    expect(err.type).toBe(ErrorType.AUTH);
  });

  it('detects Supabase DB errors', () => {
    const supaErr = new Error('Connection error');
    (supaErr as any).code = 'CONNECT_FAIL';
    const err = normalizeError(supaErr);
    expect(err.type).toBe(ErrorType.EXTERNAL_SERVICE);
  });

  it('handles non-Error unknown types', () => {
    const err = normalizeError('string error');
    expect(err.type).toBe(ErrorType.INTERNAL);
    expect(err.message).toBe('未知错误');
  });

  it('handles null', () => {
    const err = normalizeError(null);
    expect(err.type).toBe(ErrorType.INTERNAL);
  });

  it('handles undefined', () => {
    const err = normalizeError(undefined);
    expect(err.type).toBe(ErrorType.INTERNAL);
  });
});

// ============================================================
// logError
// ============================================================

describe('logError', () => {
  it('logs INTERNAL error to console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logError(Errors.internal('test'));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('logs VALIDATION warning to console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logError(Errors.validation('test'));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('includes context in log', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logError(Errors.auth(), { path: '/api/test', method: 'POST' });
    expect(spy).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('/api/test'),
    );
    spy.mockRestore();
  });
});
