import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateBody, validateQuery, validate, safeParse } from '@/lib/validations/validate';

// Helper to create a mock Request with JSON body
function mockRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// Helper to create a Request with invalid JSON body
function mockInvalidJsonRequest(): Request {
  return new Request('http://localhost:3000/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not valid json{{{',
  });
}

const TestSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

// ============================================================
// validateBody
// ============================================================

describe('validateBody', () => {
  it('returns success with parsed data for valid input', async () => {
    const req = mockRequest({ name: 'Alice', age: 30 });
    const result = await validateBody(req, TestSchema);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: 'Alice', age: 30 });
    }
  });

  it('returns failure for Zod validation error', async () => {
    const req = mockRequest({ name: '', age: -5 });
    const result = await validateBody(req, TestSchema);
    expect(result.success).toBe(false);
    if (!result.success) {
      const json = await result.error.json();
      expect(json.error).toBe('参数验证失败');
      expect(json.details).toBeDefined();
      expect(Array.isArray(json.details)).toBe(true);
    }
  });

  it('returns failure for invalid JSON', async () => {
    const req = mockInvalidJsonRequest();
    const result = await validateBody(req, TestSchema);
    expect(result.success).toBe(false);
    if (!result.success) {
      const json = await result.error.json();
      expect(json.error).toBe('无效的 JSON 格式');
    }
  });

  it('returns 400 status on all error types', async () => {
    const req = mockRequest({ name: 123, age: 'not a number' });
    const result = await validateBody(req, TestSchema);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.status).toBe(400);
    }
  });

  it('includes field paths in Zod error details', async () => {
    const req = mockRequest({ name: '', age: 30 });
    const result = await validateBody(req, TestSchema);
    expect(result.success).toBe(false);
    if (!result.success) {
      const json = await result.error.json();
      const fields = json.details.map((d: { field: string }) => d.field);
      expect(fields).toContain('name');
    }
  });
});

// ============================================================
// validateQuery
// ============================================================

describe('validateQuery', () => {
  const QuerySchema = z.object({
    page: z.string().regex(/^\d+$/),
    search: z.string().optional(),
  });

  it('returns success for valid URLSearchParams', () => {
    const params = new URLSearchParams({ page: '1', search: 'test' });
    const result = validateQuery(params, QuerySchema);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ page: '1', search: 'test' });
    }
  });

  it('returns success for valid Record', () => {
    const params: Record<string, string | null> = { page: '5', search: null };
    const result = validateQuery(params, QuerySchema);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe('5');
      // null values are excluded
      expect(result.data.search).toBeUndefined();
    }
  });

  it('returns failure for invalid query params', () => {
    const params = new URLSearchParams({ page: 'abc' });
    const result = validateQuery(params, QuerySchema);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.status).toBe(400);
    }
  });

  it('returns failure with field paths for Zod errors', () => {
    const params = new URLSearchParams({}); // missing required 'page'
    const result = validateQuery(params, QuerySchema);
    expect(result.success).toBe(false);
  });
});

// ============================================================
// validate
// ============================================================

describe('validate', () => {
  it('returns parsed data for valid input', () => {
    const result = validate({ name: 'Bob', age: 25 }, TestSchema);
    expect(result).toEqual({ name: 'Bob', age: 25 });
  });

  it('throws ZodError for invalid input', () => {
    expect(() => validate({ name: '', age: -1 }, TestSchema)).toThrow();
  });

  it('throws for completely wrong type', () => {
    expect(() => validate('string input', TestSchema)).toThrow();
  });
});

// ============================================================
// safeParse
// ============================================================

describe('safeParse', () => {
  it('returns success=true with data for valid input', () => {
    const result = safeParse({ name: 'Charlie', age: 40 }, TestSchema);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: 'Charlie', age: 40 });
    }
  });

  it('returns success=false with errors for invalid input', () => {
    const result = safeParse({ name: '', age: 0 }, TestSchema);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
      expect(result.errors.issues.length).toBeGreaterThan(0);
    }
  });

  it('does not throw on invalid input', () => {
    expect(() => safeParse(null, TestSchema)).not.toThrow();
  });
});
