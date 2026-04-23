// @vitest-environment node
/**
 * create-checkout-session API 回归测试
 *
 * 覆盖支付流程的所有关键路径，防止代码修改导致支付中断。
 * Mock Supabase + Stripe，验证：
 * - 正常下单流程
 * - 套餐验证（不存在、未配置、价格异常、已停用）
 * - 客户去重（email / phone+country fallback）
 * - Zod 输入验证
 * - 白标导游归属
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Route 内部 getSupabase() 会检查这些环境变量
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

// ============================================================
// Mock helpers
// ============================================================

/**
 * 创建可链式调用的 Supabase query builder mock
 * 单一 builder 在所有链式调用 (.select/.eq/.single/...) 中返回相同结果
 */
function mockQueryBuilder(resolvedValue: { data: unknown; error: unknown } = { data: null, error: null }) {
  const builder: Record<string, any> = {};
  const methods = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'in', 'gte', 'lte', 'gt', 'lt',
    'not', 'is', 'like', 'ilike',
    'order', 'limit', 'range', 'single', 'maybeSingle',
    'filter', 'match', 'or', 'and',
  ];
  for (const m of methods) {
    builder[m] = vi.fn().mockReturnValue(builder);
  }
  builder.then = vi.fn((resolve: any) => resolve(resolvedValue));
  return builder;
}

// 动态 per-table mock 映射
let tableBuilders: Record<string, any> = {};

const mockSupabase = {
  from: vi.fn((table: string) => {
    if (tableBuilders[table]) return tableBuilders[table];
    return mockQueryBuilder();
  }),
  rpc: vi.fn().mockResolvedValue({ data: 0, error: null }),
};

// Stripe mock
const mockStripeSession = {
  id: 'cs_test_123',
  url: 'https://checkout.stripe.com/pay/cs_test_123',
  status: 'open',
};

const mockStripe = {
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue(mockStripeSession),
      retrieve: vi.fn().mockResolvedValue(mockStripeSession),
    },
  },
};

// ============================================================
// Module mocks (必须在 import 之前)
// ============================================================

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabase),
}));

vi.mock('@/lib/stripe-server', () => ({
  getStripeServer: vi.fn(() => mockStripe),
}));

vi.mock('@/lib/utils/rate-limiter', () => ({
  checkRateLimit: vi.fn(async () => ({ success: true })),
  getClientIp: vi.fn(() => '127.0.0.1'),
  RATE_LIMITS: { sensitive: { limit: 10, windowMs: 60000 } },
  createRateLimitHeaders: vi.fn(() => ({})),
}));

vi.mock('@/lib/utils/api-errors', () => ({
  normalizeError: vi.fn((e: any) => ({ status: 500, message: e?.message || 'Error' })),
  logError: vi.fn(),
  createErrorResponse: vi.fn((err: any, headers?: any) => {
    const { NextResponse } = require('next/server');
    return NextResponse.json(
      { error: err.message || 'Error' },
      { status: err.status || 500, headers }
    );
  }),
  Errors: {
    auth: (msg?: string) => ({ status: 401, message: msg || 'Unauthorized' }),
    validation: (msg: string) => ({ status: 400, message: msg }),
    notFound: (entity: string) => ({ status: 404, message: `${entity}\u4E0D\u5B58\u5728` }),
    internal: (msg: string) => ({ status: 500, message: msg }),
    rateLimit: (retry?: number) => ({ status: 429, message: 'Rate limited', retryAfter: retry }),
    business: (msg: string, code: string) => ({ status: 422, message: msg, code }),
  },
}));

vi.mock('@/lib/whitelabel-config', () => ({
  isValidSlug: vi.fn((slug: string) => /^[a-z0-9-]{3,50}$/.test(slug)),
}));

// ============================================================
// Import route handler AFTER mocks
// ============================================================

import { POST } from '@/app/api/create-checkout-session/route';

// ============================================================
// Test data
// ============================================================

const VALID_PACKAGE = {
  id: 'pkg-001',
  slug: 'basic-checkup',
  stripe_price_id: 'price_test_123',
  price_jpy: 550000,
  is_active: true,
  module_id: null,
};

const EXISTING_CUSTOMER = { id: 'cust-001', stripe_customer_id: 'cus_test_123' };

const VALID_BODY = {
  packageSlug: 'basic-checkup',
  customerInfo: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '09012345678',
    country: 'JP',
  },
  consents: { cancel: true, tokushoho: true, privacy: true },
};

function makeRequest(body: unknown, cookieMap: Record<string, string> = {}): NextRequest {
  const req = new NextRequest(
    new Request('http://localhost:3000/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  );
  // Next.js 16 的 @edge-runtime/cookies 在 Vitest 中 crash，
  // 直接用 mock cookies 对象替换
  Object.defineProperty(req, 'cookies', {
    value: {
      get: (name: string) => {
        const val = cookieMap[name];
        return val ? { name, value: val } : undefined;
      },
      getAll: () => Object.entries(cookieMap).map(([name, value]) => ({ name, value })),
    },
    writable: false,
  });
  return req;
}

// ============================================================
// Tests
// ============================================================

describe('POST /api/create-checkout-session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableBuilders = {};
  });

  /**
   * 设置标准成功流程的 mock。
   * 由于同一 table builder 用于所有查询（lookup + insert），
   * 默认总是返回已有客户（跳过 insert 分支）。
   */
  function setupSuccessFlow(overrides: { packageData?: any; noCustomer?: boolean } = {}) {
    const pkg = overrides.packageData ?? VALID_PACKAGE;

    tableBuilders['medical_packages'] = mockQueryBuilder({ data: pkg, error: null });

    // customers: 默认返回已有客户（同一 builder 用于 lookup + insert）
    tableBuilders['customers'] = mockQueryBuilder({
      data: overrides.noCustomer ? null : EXISTING_CUSTOMER,
      error: overrides.noCustomer ? { code: 'PGRST116' } : null,
    });

    // orders: insert 返回新订单
    tableBuilders['orders'] = mockQueryBuilder({
      data: { ...pkg, id: 'order-001' },
      error: null,
    });

    // guides: 默认无导游
    tableBuilders['guides'] = mockQueryBuilder({ data: null, error: { code: 'PGRST116' } });
  }

  // ============================================================
  // 1. Happy path: 正常下单
  // ============================================================

  it('creates checkout session for valid request', async () => {
    setupSuccessFlow();
    const res = await POST(makeRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.sessionId).toBe('cs_test_123');
    expect(json.checkoutUrl).toContain('checkout.stripe.com');
    expect(json.orderId).toBe('order-001');
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledTimes(1);
  });

  it('passes correct metadata to Stripe', async () => {
    setupSuccessFlow();
    await POST(makeRequest(VALID_BODY));

    const createCall = mockStripe.checkout.sessions.create.mock.calls[0][0];
    expect(createCall.metadata.package_slug).toBe('basic-checkup');
    expect(createCall.metadata.order_type).toBe('medical');
    expect(createCall.line_items[0].price).toBe('price_test_123');
    expect(createCall.success_url).toContain('/payment/success');
    expect(createCall.cancel_url).toContain('/payment/cancel');
  });

  it('sets customer_email when provided', async () => {
    setupSuccessFlow();
    await POST(makeRequest(VALID_BODY));

    const createCall = mockStripe.checkout.sessions.create.mock.calls[0][0];
    expect(createCall.customer_email).toBe('test@example.com');
  });

  it('omits customer_email when not provided', async () => {
    setupSuccessFlow();
    const body = {
      ...VALID_BODY,
      customerInfo: { name: 'Test', phone: '09012345678', country: 'JP' },
    };
    await POST(makeRequest(body));

    const createCall = mockStripe.checkout.sessions.create.mock.calls[0][0];
    expect(createCall.customer_email).toBeUndefined();
  });

  // ============================================================
  // 2. 套餐验证（Package validation）
  // ============================================================

  it('returns 404 when package does not exist', async () => {
    tableBuilders['medical_packages'] = mockQueryBuilder({ data: null, error: { code: 'PGRST116' } });
    tableBuilders['customers'] = mockQueryBuilder({ data: EXISTING_CUSTOMER, error: null });
    tableBuilders['guides'] = mockQueryBuilder({ data: null, error: null });

    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(404);
  });

  it('returns 422 when package has no stripe_price_id', async () => {
    setupSuccessFlow({ packageData: { ...VALID_PACKAGE, stripe_price_id: null } });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(422);
  });

  it('returns 500 when package price is zero', async () => {
    setupSuccessFlow({ packageData: { ...VALID_PACKAGE, price_jpy: 0 } });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(500);
  });

  it('returns 500 when package price is negative', async () => {
    setupSuccessFlow({ packageData: { ...VALID_PACKAGE, price_jpy: -100 } });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(500);
  });

  it('returns 422 when package is inactive', async () => {
    setupSuccessFlow({ packageData: { ...VALID_PACKAGE, is_active: false } });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(422);
  });

  // ============================================================
  // 3. 客户去重
  // ============================================================

  it('reuses existing customer when email matches', async () => {
    setupSuccessFlow();
    await POST(makeRequest(VALID_BODY));

    expect(mockSupabase.from).toHaveBeenCalledWith('customers');
    // Should proceed to create order (not fail on customer creation)
    expect(mockSupabase.from).toHaveBeenCalledWith('orders');
  });

  it('attempts phone+country fallback when no email provided', async () => {
    setupSuccessFlow();
    const body = {
      ...VALID_BODY,
      customerInfo: { name: 'Test', phone: '09012345678', country: 'JP' },
    };

    await POST(makeRequest(body));

    // Verify customers table was queried (phone fallback path)
    const customerCalls = mockSupabase.from.mock.calls.filter(
      (c: any[]) => c[0] === 'customers'
    );
    expect(customerCalls.length).toBeGreaterThan(0);
  });

  // ============================================================
  // 3b. Pending 订单冲突自动恢复（23505）
  // ============================================================

  it('cancels old pending order and retries on 23505 conflict', async () => {
    setupSuccessFlow();

    // 第一次 insert 返回 23505，模拟唯一约束冲突
    // 第二次 insert（重试）返回成功
    let insertCallCount = 0;
    const ordersBuilder = mockQueryBuilder({ data: null, error: null });
    const originalInsert = ordersBuilder.insert;
    ordersBuilder.insert = vi.fn((...args: any[]) => {
      insertCallCount++;
      if (insertCallCount === 1) {
        // 第一次：模拟 23505 冲突
        const errorBuilder = mockQueryBuilder({
          data: null,
          error: { code: '23505', message: 'duplicate key value violates unique constraint' },
        });
        return errorBuilder;
      }
      // 第二次：成功
      const successBuilder = mockQueryBuilder({
        data: { ...VALID_PACKAGE, id: 'order-002' },
        error: null,
      });
      return successBuilder;
    });
    // update（取消旧订单）也需要走 ordersBuilder
    tableBuilders['orders'] = ordersBuilder;

    const res = await POST(makeRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.orderId).toBe('order-002');
    // insert 被调用了 2 次（首次冲突 + 重试）
    expect(ordersBuilder.insert).toHaveBeenCalledTimes(2);
  });

  // ============================================================
  // 4. Zod 输入验证
  // ============================================================

  it('rejects missing consents', async () => {
    const body = {
      ...VALID_BODY,
      consents: { cancel: true, tokushoho: false, privacy: true },
    };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it('rejects empty packageSlug', async () => {
    const body = { ...VALID_BODY, packageSlug: '' };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it('rejects missing customerInfo.name', async () => {
    const body = {
      ...VALID_BODY,
      customerInfo: { email: 'test@example.com' },
    };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it('rejects customerInfo with no contact method', async () => {
    const body = {
      ...VALID_BODY,
      customerInfo: { name: 'Test', country: 'JP' },
    };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it('rejects invalid guideSlug format (uppercase)', async () => {
    const body = { ...VALID_BODY, guideSlug: 'INVALID SLUG!' };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it('rejects guideSlug shorter than 3 chars', async () => {
    const body = { ...VALID_BODY, guideSlug: 'ab' };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it('accepts valid guideSlug and proceeds', async () => {
    setupSuccessFlow();
    const body = { ...VALID_BODY, guideSlug: 'my-guide-123' };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(200);
  });

  it('defaults locale to ja', async () => {
    setupSuccessFlow();
    await POST(makeRequest(VALID_BODY));

    const createCall = mockStripe.checkout.sessions.create.mock.calls[0][0];
    expect(createCall.metadata.locale).toBe('ja');
  });

  it('passes explicit locale to metadata', async () => {
    setupSuccessFlow();
    const body = { ...VALID_BODY, locale: 'zh-TW' };
    await POST(makeRequest(body));

    const createCall = mockStripe.checkout.sessions.create.mock.calls[0][0];
    expect(createCall.metadata.locale).toBe('zh-TW');
  });

  it('rejects invalid locale', async () => {
    const body = { ...VALID_BODY, locale: 'fr' };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  // ============================================================
  // 5. 白标归属
  // ============================================================

  it('includes guide metadata when valid guide found', async () => {
    setupSuccessFlow();
    tableBuilders['guides'] = mockQueryBuilder({
      data: { id: 'guide-001', subscription_tier: 'partner' },
      error: null,
    });
    tableBuilders['page_modules'] = mockQueryBuilder({
      data: { commission_rate_a: 10, commission_rate_b: 20 },
      error: null,
    });

    const body = { ...VALID_BODY, guideSlug: 'my-guide' };
    await POST(makeRequest(body));

    const createCall = mockStripe.checkout.sessions.create.mock.calls[0][0];
    expect(createCall.metadata.guide_id).toBe('guide-001');
    expect(createCall.metadata.guide_slug).toBe('my-guide');
    expect(createCall.success_url).toContain('guide=my-guide');
  });

  it('clears invalid guideSlug and proceeds without guide attribution', async () => {
    setupSuccessFlow();
    tableBuilders['guides'] = mockQueryBuilder({ data: null, error: { code: 'PGRST116' } });

    const body = { ...VALID_BODY, guideSlug: 'nonexistent-guide' };
    const res = await POST(makeRequest(body));

    expect(res.status).toBe(200);
    const createCall = mockStripe.checkout.sessions.create.mock.calls[0][0];
    expect(createCall.metadata.guide_id).toBeUndefined();
  });

  // ============================================================
  // 6. 速率限制
  // ============================================================

  it('returns 429 when rate limited', async () => {
    const { checkRateLimit } = await import('@/lib/utils/rate-limiter');
    (checkRateLimit as any).mockResolvedValueOnce({ success: false, retryAfter: 30 });

    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(429);
  });

  // ============================================================
  // 7. provider 传递
  // ============================================================

  it('includes provider in metadata when provided', async () => {
    setupSuccessFlow();
    const body = { ...VALID_BODY, provider: 'stemcells-jp' };
    await POST(makeRequest(body));

    const createCall = mockStripe.checkout.sessions.create.mock.calls[0][0];
    expect(createCall.metadata.provider).toBe('stemcells-jp');
  });

  it('rejects provider with invalid characters', async () => {
    const body = { ...VALID_BODY, provider: 'INVALID PROVIDER!' };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  // ============================================================
  // 8. 响应格式契约（防止返回值结构被改坏）
  // ============================================================

  it('response always contains sessionId, checkoutUrl, orderId', async () => {
    setupSuccessFlow();
    const res = await POST(makeRequest(VALID_BODY));
    const json = await res.json();

    expect(json).toHaveProperty('sessionId');
    expect(json).toHaveProperty('checkoutUrl');
    expect(json).toHaveProperty('orderId');
    expect(typeof json.sessionId).toBe('string');
    expect(typeof json.checkoutUrl).toBe('string');
    expect(typeof json.orderId).toBe('string');
  });

  // ============================================================
  // 9. Stripe API 失败回退
  // ============================================================

  it('returns 500 when Stripe API throws', async () => {
    setupSuccessFlow();
    mockStripe.checkout.sessions.create.mockRejectedValueOnce(
      new Error('Stripe API error: Invalid price')
    );

    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(500);
  });

  // ============================================================
  // 10. consents 完全缺失
  // ============================================================

  it('rejects request without consents object', async () => {
    const { consents, ...bodyWithoutConsents } = VALID_BODY;
    const res = await POST(makeRequest(bodyWithoutConsents));
    expect(res.status).toBe(400);
  });
});
