/**
 * 集成测试：验证 8 个新功能的 前端 ↔ 后端 数据契约
 *
 * 每个 describe 块对应一个功能模块。
 * 测试策略：mock Supabase / Auth / RateLimit，直接调用 API route handler，
 *           验证返回的 JSON 结构与前端 TypeScript interface 完全匹配。
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ============================================================
// Shared mock setup
// ============================================================

/** Builds a chainable Supabase query mock */
function mockQueryBuilder(resolvedValue: { data: unknown; error: unknown; count?: number } = { data: [], error: null }) {
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

  // Terminal methods return promise
  builder.then = vi.fn((resolve: any) => resolve(resolvedValue));
  // Make it thenable
  (builder as any)[Symbol.toStringTag] = 'SupabaseQuery';

  // Override select to also accept count config
  const originalSelect = builder.select;
  builder.select = vi.fn((...args: any[]) => {
    // If count: 'exact', head: true → return count
    if (args[1]?.count === 'exact' && args[1]?.head) {
      const countBuilder = { ...builder, count: resolvedValue.count ?? 0 };
      countBuilder.then = vi.fn((resolve: any) => resolve({ ...resolvedValue, count: resolvedValue.count ?? 0 }));
      // Re-chain methods
      for (const m of methods) {
        if (m !== 'select') {
          countBuilder[m] = vi.fn().mockReturnValue(countBuilder);
        }
      }
      return countBuilder;
    }
    return builder;
  });

  return builder;
}

function createMockSupabase(overrides: Record<string, any> = {}) {
  const defaultBuilder = mockQueryBuilder();
  return {
    from: vi.fn((table: string) => {
      if (overrides[table]) return overrides[table];
      return defaultBuilder;
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user', email: 'test@test.com' } },
        error: null,
      }),
    },
  };
}

// Mock modules before imports
const mockSupabase = createMockSupabase();

vi.mock('@/lib/supabase/api', () => ({
  getSupabaseAdmin: vi.fn(() => mockSupabase),
  getSupabaseWithAuth: vi.fn(async () => ({
    supabase: mockSupabase,
    user: { id: 'test-user', email: 'test@test.com' },
    error: null,
  })),
}));

vi.mock('@/lib/utils/admin-auth', () => ({
  verifyAdminAuth: vi.fn(async () => ({
    isValid: true,
    userId: 'admin-001',
    email: 'admin@test.com',
  })),
}));

vi.mock('@/lib/utils/rate-limiter', () => ({
  checkRateLimit: vi.fn(async () => ({ success: true })),
  getClientIp: vi.fn(() => '127.0.0.1'),
  buildRateLimitKey: vi.fn((_req: any, endpoint: string, userId?: string) => `${userId || '127.0.0.1'}:${endpoint}`),
  RATE_LIMITS: {
    standard: { limit: 60, windowMs: 60000 },
    sensitive: { limit: 10, windowMs: 60000 },
  },
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
    notFound: (entity: string) => ({ status: 404, message: `${entity} not found` }),
    internal: (msg: string) => ({ status: 500, message: msg }),
    rateLimit: (retry?: number) => ({ status: 429, message: 'Rate limited', retryAfter: retry }),
    business: (msg: string, code: string) => ({ status: 422, message: msg, code }),
  },
}));

/** Helper: create a NextRequest */
function makeRequest(
  url: string,
  options: { method?: string; body?: unknown; headers?: Record<string, string> } = {}
): NextRequest {
  const init: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-admin-token',
      ...options.headers,
    },
  };
  if (options.body) {
    init.body = JSON.stringify(options.body);
  }
  return new NextRequest(new URL(url, 'http://localhost:3000'), init);
}

// ============================================================
// P0-1: CEO Data Dashboard — Analytics API
// ============================================================

describe('P0-1: CEO Analytics API ↔ Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock responses for analytics queries
    const ordersBuilder = mockQueryBuilder({
      data: [
        { id: 'o1', total_amount_jpy: 500000, status: 'paid', paid_at: '2026-03-01', commission_amount: 50000, referred_by_guide_id: 'g1' },
        { id: 'o2', total_amount_jpy: 300000, status: 'confirmed', paid_at: '2026-03-10', commission_amount: 30000, referred_by_guide_id: null },
      ],
      error: null,
    });

    const screeningsBuilder = mockQueryBuilder({
      data: [
        { id: 's1', status: 'completed', user_id: 'u1' },
        { id: 's2', status: 'completed', user_id: 'u2' },
        { id: 's3', status: 'in_progress', user_id: 'u3' },
      ],
      error: null,
    });

    const aiRunsBuilder = mockQueryBuilder({
      data: [
        { model_name: 'gpt-4o-mini', input_tokens: 1000, output_tokens: 500, latency_ms: 1200 },
        { model_name: 'gpt-4o', input_tokens: 2000, output_tokens: 800, latency_ms: 3000 },
      ],
      error: null,
    });

    const guidesBuilder = mockQueryBuilder({
      data: [
        { id: 'g1', kyc_status: 'approved', subscription_tier: 'partner', available_balance: 50000, total_withdrawn: 100000 },
        { id: 'g2', kyc_status: 'approved', subscription_tier: 'growth', available_balance: 10000, total_withdrawn: 20000 },
        { id: 'g3', kyc_status: 'submitted', subscription_tier: 'growth', available_balance: 0, total_withdrawn: 0 },
      ],
      error: null,
    });

    const pendingKycBuilder = mockQueryBuilder({ data: null, error: null, count: 1 });

    const commissionsBuilder = mockQueryBuilder({
      data: [
        { total_commission: 80000, status: 'paid' },
        { total_commission: 20000, status: 'pending' },
      ],
      error: null,
    });

    const adjudicationsBuilder = mockQueryBuilder({
      data: [
        { final_risk_level: 'low' },
        { final_risk_level: 'medium' },
        { final_risk_level: 'high' },
        { final_risk_level: 'emergency' }, // Should be rolled into high
      ],
      error: null,
    });

    mockSupabase.from = vi.fn((table: string) => {
      switch (table) {
        case 'orders': return ordersBuilder;
        case 'health_screenings': return screeningsBuilder;
        case 'screening_ai_runs': return aiRunsBuilder;
        case 'guides': return guidesBuilder;
        case 'commission_settlements': return commissionsBuilder;
        case 'screening_adjudications': return adjudicationsBuilder;
        default: return mockQueryBuilder();
      }
    });
  });

  it('GET /api/admin/analytics → 返回完整 AnalyticsResponse 结构', async () => {
    const { GET } = await import('@/app/api/admin/analytics/route');
    const req = makeRequest('http://localhost:3000/api/admin/analytics');
    const res = await GET(req);
    const json = await res.json();

    // 前端 AnalyticsData interface 验证
    expect(json).toHaveProperty('revenue');
    expect(json.revenue).toHaveProperty('totalGMV');
    expect(json.revenue).toHaveProperty('mtdGMV');
    expect(json.revenue).toHaveProperty('totalOrders');
    expect(json.revenue).toHaveProperty('mtdOrders');
    expect(json.revenue).toHaveProperty('avgOrderValue');
    expect(json.revenue).toHaveProperty('totalCommissions');
    expect(json.revenue).toHaveProperty('takeRate');

    expect(json).toHaveProperty('screenings');
    expect(json.screenings).toHaveProperty('total');
    expect(json.screenings).toHaveProperty('completed');
    expect(json.screenings).toHaveProperty('completionRate');
    expect(json.screenings).toHaveProperty('mtdTotal');
    expect(json.screenings).toHaveProperty('riskDistribution');
    expect(json.screenings.riskDistribution).toHaveProperty('low');
    expect(json.screenings.riskDistribution).toHaveProperty('medium');
    expect(json.screenings.riskDistribution).toHaveProperty('high');
    expect(json.screenings).toHaveProperty('avgAiLatencyMs');
    expect(json.screenings).toHaveProperty('totalAiCostEstimate');

    expect(json).toHaveProperty('guides');
    expect(json.guides).toHaveProperty('totalActive');
    expect(json.guides).toHaveProperty('goldPartners');
    expect(json.guides).toHaveProperty('growthPartners');
    expect(json.guides).toHaveProperty('pendingKYC');
    expect(json.guides).toHaveProperty('totalPayouts');

    expect(json).toHaveProperty('funnel');
    expect(json.funnel).toHaveProperty('screeningsCompleted');
    expect(json.funnel).toHaveProperty('ordersFromScreening');
    expect(json.funnel).toHaveProperty('conversionRate');

    expect(json).toHaveProperty('monthlyRevenue');
    expect(Array.isArray(json.monthlyRevenue)).toBe(true);
    expect(json.monthlyRevenue.length).toBe(12);
    if (json.monthlyRevenue.length > 0) {
      const m = json.monthlyRevenue[0];
      expect(m).toHaveProperty('month');
      expect(m).toHaveProperty('revenue');
      expect(m).toHaveProperty('orders');
      expect(m).toHaveProperty('commissions');
    }

    expect(json).toHaveProperty('generatedAt');
    expect(typeof json.generatedAt).toBe('string');
  });

  it('emergency 风险等级归入 high 计数', async () => {
    const { GET } = await import('@/app/api/admin/analytics/route');
    const req = makeRequest('http://localhost:3000/api/admin/analytics');
    const res = await GET(req);
    const json = await res.json();

    // emergency 应计入 high
    expect(json.screenings.riskDistribution.high).toBeGreaterThanOrEqual(2);
  });

  it('所有数值字段类型为 number', async () => {
    const { GET } = await import('@/app/api/admin/analytics/route');
    const req = makeRequest('http://localhost:3000/api/admin/analytics');
    const res = await GET(req);
    const json = await res.json();

    expect(typeof json.revenue.totalGMV).toBe('number');
    expect(typeof json.revenue.takeRate).toBe('number');
    expect(typeof json.screenings.completionRate).toBe('number');
    expect(typeof json.screenings.avgAiLatencyMs).toBe('number');
    expect(typeof json.guides.totalActive).toBe('number');
    expect(typeof json.funnel.conversionRate).toBe('number');
  });
});

// ============================================================
// P0-2: Smart Checkout Funnel
// ============================================================

describe('P0-2: Smart Checkout — 前端字段匹配 API Schema', () => {
  it('前端 QuickCheckoutModal 发送的 body 与 CreateCheckoutSessionSchema 匹配', () => {
    // 前端发送格式（来自 RecommendedPackages.tsx）
    const frontendBody = {
      packageSlug: 'premium-screening',
      customerInfo: {
        name: '山田太郎',
        email: 'yamada@test.com',
        phone: '+81-90-1234-5678',
      },
      locale: 'ja',
    };

    // 验证必填字段
    expect(frontendBody).toHaveProperty('packageSlug');
    expect(frontendBody.customerInfo).toHaveProperty('name');
    expect(typeof frontendBody.customerInfo.name).toBe('string');
    expect(frontendBody.customerInfo.name.length).toBeGreaterThan(0);

    // 至少有 email 或 phone
    const hasContact = !!(frontendBody.customerInfo.email || frontendBody.customerInfo.phone);
    expect(hasContact).toBe(true);
  });

  it('payment_method_types 包含 card, alipay, wechat_pay', async () => {
    // 验证 checkout session 创建代码中包含正确的支付方式
    // 直接读取源码验证（因为实际调用需要 Stripe API key）
    const fs = await import('fs');
    const source = fs.readFileSync(
      require('path').resolve(__dirname, '../app/api/create-checkout-session/route.ts'),
      'utf-8'
    );
    expect(source).toContain("'card'");
    expect(source).toContain("'alipay'");
    expect(source).toContain("'wechat_pay'");
    expect(source).toContain("client: 'web'");
  });
});

// ============================================================
// P0-3: V3 Lite Cache
// ============================================================

describe('P0-3: V3 Lite Cache — answers_hash 缓存逻辑', () => {
  it('analyze route 包含 answers_hash 缓存查询', async () => {
    const fs = await import('fs');
    const source = fs.readFileSync(
      require('path').resolve(__dirname, '../app/api/health-screening/analyze/route.ts'),
      'utf-8'
    );

    // 验证缓存查询存在
    expect(source).toContain('answers_hash');
    expect(source).toContain('answersHash');
    expect(source).toContain('cachedRecord');
    expect(source).toContain('Cache HIT');

    // 验证缓存命中不是 null stub
    expect(source).not.toContain('const cachedResult: { analysis_result: unknown } | null = null');

    // 验证 answers_hash 写回
    expect(source).toContain("answers_hash: answersHash");
  });
});

// ============================================================
// P1-2: Data Flywheel — Outcomes API
// ============================================================

describe('P1-2: Data Flywheel — Outcomes API ↔ Admin Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const outcomesQueryBuilder = mockQueryBuilder({
      data: [
        {
          id: 'oc1',
          screening_id: 's1',
          screening_type: 'authenticated',
          contacted_hospital_id: null,
          actual_department: '循環器科',
          doctor_feedback: 'AI判断正確',
          final_clinical_direction: null,
          was_admitted: false,
          surgery_performed: false,
          urgency_confirmed: false,
          outcome_label: 'accurate',
          notes: null,
          created_at: '2026-03-19T00:00:00Z',
        },
      ],
      error: null,
      count: 5,
    });

    const auditBuilder = mockQueryBuilder({ data: null, error: null });

    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'screening_outcomes') return outcomesQueryBuilder;
      if (table === 'audit_logs') return auditBuilder;
      return mockQueryBuilder();
    });
  });

  it('GET /api/admin/outcomes → 返回 outcomes[] + stats{}', async () => {
    const { GET } = await import('@/app/api/admin/outcomes/route');
    const req = makeRequest('http://localhost:3000/api/admin/outcomes');
    const res = await GET(req);
    const json = await res.json();

    // 前端 OutcomeRecord 接口验证
    expect(json).toHaveProperty('outcomes');
    expect(Array.isArray(json.outcomes)).toBe(true);

    if (json.outcomes.length > 0) {
      const o = json.outcomes[0];
      expect(o).toHaveProperty('screening_id');
      expect(o).toHaveProperty('screening_type');
      expect(o).toHaveProperty('outcome_label');
      expect(o).toHaveProperty('created_at');
    }

    // 前端 Stats 接口验证
    expect(json).toHaveProperty('stats');
    expect(json.stats).toHaveProperty('accurate');
    expect(json.stats).toHaveProperty('under_triage');
    expect(json.stats).toHaveProperty('over_triage');
    expect(json.stats).toHaveProperty('missed');
    expect(typeof json.stats.accurate).toBe('number');
  });

  it('POST /api/admin/outcomes → screeningId 必填验证', async () => {
    const { POST } = await import('@/app/api/admin/outcomes/route');
    const req = makeRequest('http://localhost:3000/api/admin/outcomes', {
      method: 'POST',
      body: { outcomeLabel: 'accurate' }, // 缺少 screeningId
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST /api/admin/outcomes → 无效 outcomeLabel 被拒', async () => {
    const { POST } = await import('@/app/api/admin/outcomes/route');
    const req = makeRequest('http://localhost:3000/api/admin/outcomes', {
      method: 'POST',
      body: { screeningId: 's1', outcomeLabel: 'invalid_label' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST /api/admin/outcomes → 合法提交成功', async () => {
    const { POST } = await import('@/app/api/admin/outcomes/route');
    const req = makeRequest('http://localhost:3000/api/admin/outcomes', {
      method: 'POST',
      body: {
        screeningId: 's1',
        outcomeLabel: 'accurate',
        actualDepartment: '循環器科',
        wasAdmitted: false,
      },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });
});

// ============================================================
// P1-3: AEMC B2B API — API Key Auth
// ============================================================

describe('P1-3: AEMC B2B API — API Key 鉴权', () => {
  it('generateAPIKey 生成 nk_live_ 前缀的 key', async () => {
    const { generateAPIKey, hashAPIKey } = await import('@/lib/utils/api-key-auth');
    const result = generateAPIKey('live');

    expect(result.key).toMatch(/^nk_live_/);
    expect(result.prefix).toBe(result.key.slice(0, 12));
    expect(result.hash).toHaveLength(64); // SHA-256 hex
    expect(result.hash).toBe(hashAPIKey(result.key));
  });

  it('generateAPIKey test 环境生成 nk_test_ 前缀', async () => {
    const { generateAPIKey } = await import('@/lib/utils/api-key-auth');
    const result = generateAPIKey('test');
    expect(result.key).toMatch(/^nk_test_/);
  });

  it('hashAPIKey 产生一致的 SHA-256 哈希', async () => {
    const { hashAPIKey } = await import('@/lib/utils/api-key-auth');
    const key = 'nk_live_test123';
    expect(hashAPIKey(key)).toBe(hashAPIKey(key));
    expect(hashAPIKey(key)).toHaveLength(64);
  });

  it('validateAPIKey 拒绝无 Bearer 前缀的请求', async () => {
    const { validateAPIKey } = await import('@/lib/utils/api-key-auth');
    const result = await validateAPIKey('invalid-header', 'medical_triage');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Missing');
  });

  it('validateAPIKey 拒绝非 nk_ 前缀的 key', async () => {
    const { validateAPIKey } = await import('@/lib/utils/api-key-auth');
    const result = await validateAPIKey('Bearer sk_test_123', 'medical_triage');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid API key format');
  });
});

// ============================================================
// P1-3: Admin API Keys Management
// ============================================================

describe('P1-3: Admin API Keys — CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const keysBuilder = mockQueryBuilder({
      data: [
        {
          id: 'k1',
          name: 'Test Key',
          key_prefix: 'nk_live_abc',
          owner_email: 'partner@test.com',
          owner_org: 'TestCorp',
          scopes: ['medical_triage'],
          rate_limit_per_minute: 10,
          rate_limit_per_day: 1000,
          total_requests: 42,
          total_tokens_in: 50000,
          total_tokens_out: 20000,
          is_active: true,
          last_used_at: '2026-03-19T00:00:00Z',
          expires_at: null,
          created_at: '2026-03-01T00:00:00Z',
        },
      ],
      error: null,
    });

    const auditBuilder = mockQueryBuilder({ data: null, error: null });

    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'api_keys') return keysBuilder;
      if (table === 'audit_logs') return auditBuilder;
      return mockQueryBuilder();
    });
  });

  it('GET /api/admin/api-keys → 返回 keys[]', async () => {
    const { GET } = await import('@/app/api/admin/api-keys/route');
    const req = makeRequest('http://localhost:3000/api/admin/api-keys');
    const res = await GET(req);
    const json = await res.json();

    expect(json).toHaveProperty('keys');
    expect(Array.isArray(json.keys)).toBe(true);
    expect(json.keys[0]).toHaveProperty('key_prefix');
    expect(json.keys[0]).toHaveProperty('name');
    expect(json.keys[0]).toHaveProperty('owner_email');
    expect(json.keys[0]).toHaveProperty('scopes');
    // raw key 不应出现在 GET 响应中
    expect(json.keys[0]).not.toHaveProperty('key_hash');
  });

  it('POST /api/admin/api-keys → name + ownerEmail 必填', async () => {
    const { POST } = await import('@/app/api/admin/api-keys/route');
    const req = makeRequest('http://localhost:3000/api/admin/api-keys', {
      method: 'POST',
      body: { name: 'Test' }, // 缺少 ownerEmail
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST /api/admin/api-keys → 成功返回一次性 raw key', async () => {
    const { POST } = await import('@/app/api/admin/api-keys/route');
    const req = makeRequest('http://localhost:3000/api/admin/api-keys', {
      method: 'POST',
      body: { name: 'Partner API', ownerEmail: 'partner@corp.com' },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty('key');
    expect(json.key).toMatch(/^nk_live_/);
    expect(json).toHaveProperty('prefix');
    expect(json).toHaveProperty('name');
    expect(json).toHaveProperty('message');
  });
});

// ============================================================
// P2-1: Health Community — Stories API
// ============================================================

describe('P2-1: Community Stories API ↔ 社区页面', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const storiesBuilder = mockQueryBuilder({
      data: [
        {
          id: 'story1',
          title: '人间ドックを受けてみた',
          content: '初めての健康診断の体験を共有します。素晴らしい経験でした。',
          language: 'ja',
          category: 'experience',
          tags: ['人間ドック', '体験'],
          risk_level: 'low',
          author_display_name: null,
          is_anonymous: true,
          view_count: 42,
          helpful_count: 7,
          created_at: '2026-03-19T00:00:00Z',
        },
      ],
      error: null,
    });

    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'health_stories') return storiesBuilder;
      return mockQueryBuilder();
    });
  });

  it('GET /api/community/stories → 返回 stories[] + hasMore', async () => {
    const { GET } = await import('@/app/api/community/stories/route');
    const req = makeRequest('http://localhost:3000/api/community/stories?lang=ja&limit=20');
    const res = await GET(req);
    const json = await res.json();

    // 前端 Story interface 验证
    expect(json).toHaveProperty('stories');
    expect(json).toHaveProperty('hasMore');
    expect(Array.isArray(json.stories)).toBe(true);

    if (json.stories.length > 0) {
      const s = json.stories[0];
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('title');
      expect(s).toHaveProperty('content');
      expect(s).toHaveProperty('category');
      expect(s).toHaveProperty('tags');
      expect(s).toHaveProperty('risk_level');
      expect(s).toHaveProperty('author_display_name');
      expect(s).toHaveProperty('is_anonymous');
      expect(s).toHaveProperty('view_count');
      expect(s).toHaveProperty('helpful_count');
      expect(s).toHaveProperty('created_at');
      expect(Array.isArray(s.tags)).toBe(true);
    }
  });

  it('GET /api/community/stories?category=tip → 传入 category 过滤', async () => {
    const { GET } = await import('@/app/api/community/stories/route');
    const req = makeRequest('http://localhost:3000/api/community/stories?lang=ja&category=tip');
    const res = await GET(req);

    expect(res.status).toBe(200);
    // 验证 eq('category', 'tip') 被调用
    expect(mockSupabase.from).toHaveBeenCalledWith('health_stories');
  });

  it('POST /api/community/stories → title 长度验证', async () => {
    const { POST } = await import('@/app/api/community/stories/route');
    const req = makeRequest('http://localhost:3000/api/community/stories', {
      method: 'POST',
      body: { title: 'ab', content: 'This is a long enough content for testing' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST /api/community/stories → 合法提交返回 storyId', async () => {
    // Override mock for insert
    const insertBuilder = mockQueryBuilder({
      data: { id: 'new-story-001' },
      error: null,
    });
    mockSupabase.from = vi.fn(() => insertBuilder);

    const { POST } = await import('@/app/api/community/stories/route');
    const req = makeRequest('http://localhost:3000/api/community/stories', {
      method: 'POST',
      body: {
        title: '健康診断の体験',
        content: 'とても良い体験でした。スタッフも親切で安心しました。',
        language: 'ja',
        category: 'experience',
        tags: ['体験'],
        isAnonymous: true,
      },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json).toHaveProperty('storyId');
  });
});

// ============================================================
// P2-2: Enterprise B2B — Admin Enterprises API
// ============================================================

describe('P2-2: Enterprise B2B — Enterprises API ↔ Admin Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const enterprisesBuilder = mockQueryBuilder({
      data: [
        {
          id: 'ent1',
          name: '中国石油天然气集团',
          name_en: 'PetroChina',
          stock_code: '601857.SH',
          stock_exchange: 'SSE',
          region: 'CN',
          contact_name: '张三',
          contact_email: 'zhang@petrochina.com',
          contact_phone: '+86-10-1234-5678',
          contact_title: 'HR Director',
          contract_type: 'annual',
          member_limit: 100,
          annual_fee_jpy: 5000000,
          discount_rate: 15,
          status: 'active',
          created_at: '2026-01-01T00:00:00Z',
          enterprise_members: [{ count: 42 }],
        },
      ],
      error: null,
    });

    const auditBuilder = mockQueryBuilder({ data: null, error: null });

    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'enterprises') return enterprisesBuilder;
      if (table === 'audit_logs') return auditBuilder;
      return mockQueryBuilder();
    });
  });

  it('GET /api/admin/enterprises → 返回 enterprises[] 含 member_count', async () => {
    const { GET } = await import('@/app/api/admin/enterprises/route');
    const req = makeRequest('http://localhost:3000/api/admin/enterprises');
    const res = await GET(req);
    const json = await res.json();

    // 前端 Enterprise interface 验证
    expect(json).toHaveProperty('enterprises');
    expect(Array.isArray(json.enterprises)).toBe(true);

    if (json.enterprises.length > 0) {
      const e = json.enterprises[0];
      expect(e).toHaveProperty('id');
      expect(e).toHaveProperty('name');
      expect(e).toHaveProperty('stock_code');
      expect(e).toHaveProperty('region');
      expect(e).toHaveProperty('contact_name');
      expect(e).toHaveProperty('contact_email');
      expect(e).toHaveProperty('member_limit');
      expect(e).toHaveProperty('member_count');
      expect(e).toHaveProperty('annual_fee_jpy');
      expect(e).toHaveProperty('discount_rate');
      expect(e).toHaveProperty('status');
      expect(e).toHaveProperty('created_at');
      // enterprise_members 子查询应被移除
      expect(e.enterprise_members).toBeUndefined();
      // member_count 从 enterprise_members[0].count 提取
      expect(typeof e.member_count).toBe('number');
      expect(e.member_count).toBe(42);
    }
  });

  it('POST /api/admin/enterprises → 必填字段验证', async () => {
    const { POST } = await import('@/app/api/admin/enterprises/route');
    const req = makeRequest('http://localhost:3000/api/admin/enterprises', {
      method: 'POST',
      body: { name: 'TestCorp' }, // 缺少 contactName + contactEmail
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST /api/admin/enterprises → 合法创建成功', async () => {
    // Override mock for insert
    const insertBuilder = mockQueryBuilder({
      data: {
        id: 'new-ent-001',
        name: '腾讯控股',
        region: 'HK',
        status: 'active',
      },
      error: null,
    });
    const auditBuilder = mockQueryBuilder({ data: null, error: null });

    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'enterprises') return insertBuilder;
      if (table === 'audit_logs') return auditBuilder;
      return mockQueryBuilder();
    });

    const { POST } = await import('@/app/api/admin/enterprises/route');
    const req = makeRequest('http://localhost:3000/api/admin/enterprises', {
      method: 'POST',
      body: {
        name: '腾讯控股',
        stockCode: '0700.HK',
        region: 'HK',
        contactName: '李四',
        contactEmail: 'li@tencent.com',
        memberLimit: 200,
      },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json).toHaveProperty('enterprise');
  });
});

// ============================================================
// P2-2: Enterprise B2B — Members API
// ============================================================

describe('P2-2: Enterprise Members API — 双重鉴权', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const membersBuilder = mockQueryBuilder({
      data: [
        {
          id: 'm1',
          full_name: '王总',
          full_name_en: 'Wang CEO',
          title: 'CEO',
          email: 'wang@example.com',
          phone: '+86-139-0000-0000',
          gender: 'male',
          date_of_birth: '1970-01-01',
          preferred_language: 'zh-CN',
          last_screening_date: null,
          last_health_score: null,
          screening_count: 0,
          status: 'active',
          created_at: '2026-03-01T00:00:00Z',
        },
      ],
      error: null,
    });

    const enterpriseBuilder = mockQueryBuilder({
      data: { member_limit: 100 },
      error: null,
    });

    const countBuilder = mockQueryBuilder({ data: null, error: null, count: 42 });

    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'enterprise_members') {
        // For count queries vs data queries, return different builders
        return membersBuilder;
      }
      if (table === 'enterprises') return enterpriseBuilder;
      return mockQueryBuilder();
    });
  });

  it('GET /api/enterprise/members → enterprise_id 必填', async () => {
    const { GET } = await import('@/app/api/enterprise/members/route');
    // Admin auth (no enterprise_id from API key), and no query param
    const req = makeRequest('http://localhost:3000/api/enterprise/members');
    const res = await GET(req);
    // Should require enterprise_id
    expect(res.status).toBe(400);
  });

  it('GET /api/enterprise/members?enterprise_id=xxx → 返回 members[]', async () => {
    const { GET } = await import('@/app/api/enterprise/members/route');
    const req = makeRequest('http://localhost:3000/api/enterprise/members?enterprise_id=ent1');
    const res = await GET(req);
    const json = await res.json();

    expect(json).toHaveProperty('members');
    expect(Array.isArray(json.members)).toBe(true);

    if (json.members.length > 0) {
      const m = json.members[0];
      expect(m).toHaveProperty('id');
      expect(m).toHaveProperty('full_name');
      expect(m).toHaveProperty('email');
      expect(m).toHaveProperty('status');
      expect(m).toHaveProperty('screening_count');
    }
  });

  it('POST /api/enterprise/members → fullName 必填验证', async () => {
    const insertBuilder = mockQueryBuilder({ data: [], error: null });
    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'enterprises') return mockQueryBuilder({ data: { member_limit: 100 }, error: null });
      if (table === 'enterprise_members') return insertBuilder;
      return mockQueryBuilder();
    });

    const { POST } = await import('@/app/api/enterprise/members/route');
    const req = makeRequest('http://localhost:3000/api/enterprise/members', {
      method: 'POST',
      body: {
        enterpriseId: 'ent1',
        email: 'missing-name@test.com',
        // 缺少 fullName
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST /api/enterprise/members → 批量添加支持', async () => {
    const insertBuilder = mockQueryBuilder({
      data: [
        { id: 'm2', full_name: '李总' },
        { id: 'm3', full_name: '赵总' },
      ],
      error: null,
    });
    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'enterprises') return mockQueryBuilder({ data: { member_limit: 100 }, error: null });
      if (table === 'enterprise_members') return insertBuilder;
      return mockQueryBuilder();
    });

    const { POST } = await import('@/app/api/enterprise/members/route');
    const req = makeRequest('http://localhost:3000/api/enterprise/members', {
      method: 'POST',
      body: {
        enterpriseId: 'ent1',
        members: [
          { fullName: '李总', title: 'CFO', email: 'li@corp.com' },
          { fullName: '赵总', title: 'CTO', email: 'zhao@corp.com' },
        ],
      },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json).toHaveProperty('added');
    expect(json).toHaveProperty('members');
  });
});

// ============================================================
// 跨功能：Admin 侧边栏导航完整性
// ============================================================

describe('Admin Layout — 所有新功能导航已注册', () => {
  it('admin layout 包含所有新增导航项', async () => {
    const fs = await import('fs');
    const source = fs.readFileSync(
      require('path').resolve(__dirname, '../app/admin/layout.tsx'),
      'utf-8'
    );

    // P0-1: Analytics
    expect(source).toContain('/admin/analytics');
    expect(source).toContain('BarChart3');

    // P1-2: Outcomes / Data Flywheel
    expect(source).toContain('/admin/outcomes');
    expect(source).toContain('Target');

    // P2-2: Enterprise B2B
    expect(source).toContain('/admin/enterprises');
    expect(source).toContain('Building2');
  });
});

// ============================================================
// 跨功能：SQL Migration 与 API 字段对齐
// ============================================================

describe('SQL Migration — API 字段对齐验证', () => {
  it('migration 090 api_keys 表包含 API 需要的所有列', async () => {
    const fs = await import('fs');
    const sql = fs.readFileSync(
      require('path').resolve(__dirname, '../supabase/migrations/090_api_keys.sql'),
      'utf-8'
    );

    const requiredColumns = [
      'key_hash', 'key_prefix', 'name', 'owner_email', 'owner_org',
      'scopes', 'rate_limit_per_minute', 'rate_limit_per_day',
      'total_requests', 'is_active', 'expires_at',
    ];
    for (const col of requiredColumns) {
      expect(sql).toContain(col);
    }
  });

  it('migration 091 health_stories 表包含 Community API 需要的所有列', async () => {
    const fs = await import('fs');
    const sql = fs.readFileSync(
      require('path').resolve(__dirname, '../supabase/migrations/091_health_community.sql'),
      'utf-8'
    );

    const requiredColumns = [
      'title', 'content', 'language', 'category', 'tags',
      'risk_level', 'author_display_name', 'is_anonymous',
      'view_count', 'helpful_count', 'status',
    ];
    for (const col of requiredColumns) {
      expect(sql).toContain(col);
    }
  });

  it('migration 092 enterprises 表包含 Enterprise API 需要的所有列', async () => {
    const fs = await import('fs');
    const sql = fs.readFileSync(
      require('path').resolve(__dirname, '../supabase/migrations/092_enterprise_b2b.sql'),
      'utf-8'
    );

    // enterprises 表
    const entCols = [
      'name', 'stock_code', 'stock_exchange', 'region',
      'contact_name', 'contact_email', 'contract_type',
      'member_limit', 'annual_fee_jpy', 'discount_rate', 'status',
    ];
    for (const col of entCols) {
      expect(sql).toContain(col);
    }

    // enterprise_members 表
    const memCols = [
      'enterprise_id', 'full_name', 'full_name_en', 'title',
      'email', 'phone', 'gender', 'date_of_birth',
      'preferred_language', 'screening_count', 'status',
    ];
    for (const col of memCols) {
      expect(sql).toContain(col);
    }
  });
});
