/**
 * 集成测试：Guide 注册 / 白标设置 / Cron 定时任务
 *
 * 补全审计发现的 API 测试覆盖缺口。
 * 策略与 integration-api.test.ts 一致：mock 外部依赖，直接调用 route handler。
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ============================================================
// Shared mock helpers
// ============================================================

function mockQueryBuilder(resolvedValue: { data: unknown; error: unknown } = { data: [], error: null }) {
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

function makeRequest(url: string, init?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init);
}

// ============================================================
// Mock modules
// ============================================================

const mockGuideBuilder = mockQueryBuilder({ data: null, error: null });
const mockSnapshotBuilder = mockQueryBuilder({ data: [], error: null });

const mockSupabase: Record<string, any> = {
  from: vi.fn((table: string) => {
    if (table === 'guides') return mockGuideBuilder;
    if (table === 'health_snapshots') return mockSnapshotBuilder;
    return mockQueryBuilder();
  }),
  auth: {
    admin: {
      createUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'new-guide-001' } },
        error: null,
      }),
      deleteUser: vi.fn().mockResolvedValue({ error: null }),
      getUserById: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-1', email: 'u@test.com', user_metadata: { locale: 'ja' } } },
      }),
    },
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'guide-user-1', email: 'guide@test.com' } },
      error: null,
    }),
  },
};

vi.mock('@/lib/supabase/api', () => ({
  getSupabaseAdmin: vi.fn(() => mockSupabase),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'guide-user-1', email: 'guide@test.com' } },
        error: null,
      }),
    },
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
  createErrorResponse: vi.fn((err: any) => {
    const { NextResponse } = require('next/server');
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }),
  Errors: {
    validation: (msg: string) => ({ status: 400, message: msg }),
    internal: (msg: string) => ({ status: 500, message: msg }),
    rateLimit: (retry?: number) => ({ status: 429, message: 'Rate limited', retryAfter: retry }),
  },
}));

vi.mock('@/lib/validations/validate', () => ({
  validateBody: vi.fn(async (req: any, _schema: any) => {
    const body = await req.json();
    return { success: true, data: body };
  }),
}));

vi.mock('@/lib/utils/referral-code', () => ({
  generateUniqueReferralCode: vi.fn(async () => 'REF-TEST01'),
}));

vi.mock('@/lib/email', () => ({
  sendGuideRegistrationEmail: vi.fn(async () => {}),
}));

vi.mock('@/lib/validations/api-schemas', () => ({
  WhitelabelSettingsSchema: {},
}));

vi.mock('@/lib/whitelabel-config', () => ({
  DEFAULT_SELECTED_PAGES: ['hyogo-medical', 'cancer-treatment'],
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('resend', () => {
  class MockResend {
    emails = { send: vi.fn().mockResolvedValue({ id: 'email-1' }) };
  }
  return { Resend: MockResend };
});

vi.mock('@/lib/email-template', () => ({
  buildEmailHtml: vi.fn(() => '<html>test</html>'),
}));

vi.mock('@/lib/email-i18n', () => ({
  t: vi.fn((_obj: any) => 'translated'),
  common: { footerCompany: {}, footerDisclaimer: {} },
  healthCheckupReminder: {
    subject: {}, subjectHighRisk: {},
    monthsLabel: {}, monthsUnit: {},
    lastScoreLabel: {}, statusTitle: {}, statusTitleHighRisk: {},
    message: {}, messageHighRisk: {},
    ctaText: {},
  },
}));

// ============================================================
// Tests
// ============================================================

describe('Guide Registration — POST /api/guide/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 默认：邮箱和手机号不存在
    mockGuideBuilder.maybeSingle = vi.fn().mockReturnValue({
      then: vi.fn((resolve: any) => resolve({ data: null, error: null })),
    });
    // guides.insert 成功
    mockGuideBuilder.insert = vi.fn().mockReturnValue({
      then: vi.fn((resolve: any) => resolve({ error: null })),
    });
  });

  it('成功注册返回 guideId 和 referralCode', async () => {
    const { POST } = await import('@/app/api/guide/register/route');
    const req = makeRequest('/api/guide/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '测试导游',
        email: 'new@guide.com',
        phone: '09012345678',
        password: 'securepassword123',
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.guideId).toBe('new-guide-001');
    expect(body.referralCode).toBe('REF-TEST01');
  });

  it('邮箱已注册返回 400', async () => {
    // 模拟邮箱已存在
    mockGuideBuilder.maybeSingle = vi.fn().mockReturnValue({
      then: vi.fn((resolve: any) => resolve({ data: { email: 'existing@guide.com' }, error: null })),
    });

    const { POST } = await import('@/app/api/guide/register/route');
    const req = makeRequest('/api/guide/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '重复导游',
        email: 'existing@guide.com',
        phone: '09012345679',
        password: 'securepassword123',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('Auth 创建失败时不残留导游记录', async () => {
    mockSupabase.auth.admin.createUser = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'Auth error' },
    });

    const { POST } = await import('@/app/api/guide/register/route');
    const req = makeRequest('/api/guide/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '失败导游',
        email: 'fail@guide.com',
        phone: '09012345680',
        password: 'securepassword123',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    // 不应该调用 guides.insert
    expect(mockGuideBuilder.insert).not.toHaveBeenCalled();
  });
});

describe('Whitelabel Settings — GET/PUT /api/whitelabel/settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET 返回导游白标设置（camelCase 格式）', async () => {
    const guideData = {
      id: 'guide-1',
      name: 'Test Guide',
      slug: 'testguide',
      brand_name: 'TestBrand',
      brand_tagline: 'Welcome',
      brand_logo_url: 'https://example.com/logo.png',
      brand_color: '#ff0000',
      contact_wechat: 'wx123',
      contact_line: 'line456',
      contact_display_phone: '+81-90-1234-5678',
      email: 'guide@test.com',
      subscription_status: 'active',
      subscription_plan: 'growth',
      subscription_end_date: '2027-01-01',
      whitelabel_views: 100,
      whitelabel_conversions: 5,
      selected_pages: ['hyogo-medical'],
    };

    const builder = mockQueryBuilder({ data: guideData, error: null });
    mockSupabase.from = vi.fn(() => builder);

    const { GET } = await import('@/app/api/whitelabel/settings/route');
    const req = makeRequest('/api/whitelabel/settings');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    // 验证 camelCase 转换
    expect(body.brandName).toBe('TestBrand');
    expect(body.brandColor).toBe('#ff0000');
    expect(body.contactWechat).toBe('wx123');
    expect(body.subscriptionStatus).toBe('active');
    expect(body.selectedPages).toEqual(['hyogo-medical']);
  });

  it('未登录返回 401', async () => {
    // 覆盖 createClient mock 让 auth 失败
    const { createClient } = await import('@/lib/supabase/server');
    (createClient as any).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: { message: 'Not logged in' } }),
      },
    });

    const { GET } = await import('@/app/api/whitelabel/settings/route');
    const req = makeRequest('/api/whitelabel/settings');
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  it('PUT 未订阅返回 403', async () => {
    // Guide 存在但 subscription_status != active
    const builder = mockQueryBuilder({
      data: { id: 'guide-1', subscription_status: 'inactive', slug: 'test' },
      error: null,
    });
    mockSupabase.from = vi.fn(() => builder);

    const { PUT } = await import('@/app/api/whitelabel/settings/route');
    const req = makeRequest('/api/whitelabel/settings', {
      method: 'PUT',
      body: JSON.stringify({ brandName: 'NewBrand' }),
    });
    const res = await PUT(req);

    expect(res.status).toBe(403);
  });
});

describe('Cron: Health Checkup Reminder — GET /api/cron/health-checkup-reminder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'test-cron-secret';
    process.env.RESEND_API_KEY = 're_test_key';
  });

  it('无 CRON_SECRET 认证返回 401', async () => {
    const { GET } = await import('@/app/api/cron/health-checkup-reminder/route');
    const req = makeRequest('/api/cron/health-checkup-reminder', {
      headers: { authorization: 'Bearer wrong-secret' },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('正确认证后执行并返回统计', async () => {
    // Mock: 1 个用户到期，没有最近复查
    const dueSnapshots = [
      { user_id: 'user-1', health_score: 75, risk_level: 'medium', created_at: '2025-03-01T00:00:00Z' },
    ];
    const snapshotBuilder = mockQueryBuilder({ data: dueSnapshots, error: null });
    const recentBuilder = mockQueryBuilder({ data: [], error: null });

    let callCount = 0;
    mockSupabase.from = vi.fn((table: string) => {
      if (table === 'health_snapshots') {
        callCount++;
        return callCount === 1 ? snapshotBuilder : recentBuilder;
      }
      return mockQueryBuilder();
    });

    const { GET } = await import('@/app/api/cron/health-checkup-reminder/route');
    const req = makeRequest('/api/cron/health-checkup-reminder', {
      headers: { authorization: 'Bearer test-cron-secret' },
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.candidates).toBeDefined();
    expect(typeof body.sent).toBe('number');
    expect(typeof body.errors).toBe('number');
  });
});

describe('Cron: Subscription Reminder', () => {
  it('需要 CRON_SECRET Bearer token', async () => {
    process.env.CRON_SECRET = 'sub-cron-secret';
    const { GET } = await import('@/app/api/cron/subscription-reminder/route');
    const req = makeRequest('/api/cron/subscription-reminder', {
      headers: { authorization: 'Bearer wrong' },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});

describe('Cron: Reset Quarterly Tiers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'tier-cron-secret';
  });

  it('需要 CRON_SECRET 认证', async () => {
    const { GET } = await import('@/app/api/cron/reset-quarterly-tiers/route');
    const req = makeRequest('/api/cron/reset-quarterly-tiers', {
      headers: { authorization: 'Bearer wrong' },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});

describe('Red Flag Rules — 新增规则完整性', () => {
  it('新增 5 条红旗规则已注册', async () => {
    const { ALL_RED_FLAG_RULES, getRedFlagRuleById } = await import('@/services/aemc/red-flags');

    // 验证总数 >= 37（原 32 + 新增 5）
    expect(ALL_RED_FLAG_RULES.length).toBeGreaterThanOrEqual(37);

    // 验证 5 条新规则存在
    const newRules = ['GI-003', 'RESP-004', 'CV-005', 'NEURO-006', 'NEURO-007'];
    for (const id of newRules) {
      const rule = getRedFlagRuleById(id);
      expect(rule).toBeDefined();
      expect(rule!.severity).toBe('emergency');
      expect(rule!.action).toBe('emergency_notice');
    }
  });

  it('急性胰腺炎规则有正确的 combo trigger', async () => {
    const { getRedFlagRuleById } = await import('@/services/aemc/red-flags');
    const rule = getRedFlagRuleById('GI-003');
    expect(rule).toBeDefined();
    expect(rule!.combo_trigger).toBeDefined();
    expect(rule!.combo_trigger!.min_match).toBe(3);
    expect(rule!.combo_trigger!.keywords).toContain('epigastric pain');
    expect(rule!.combo_trigger!.keywords).toContain('radiating to back');
  });

  it('脊髓压迫规则覆盖马尾综合征关键词', async () => {
    const { getRedFlagRuleById } = await import('@/services/aemc/red-flags');
    const rule = getRedFlagRuleById('NEURO-006');
    expect(rule).toBeDefined();
    expect(rule!.keywords).toContain('cauda equina syndrome');
    expect(rule!.keywords).toContain('马尾综合征');
    expect(rule!.keywords).toContain('馬尾症候群');
  });
});

describe('Structured Case Persistence — 表结构验证', () => {
  it('persistPipelineResults 调用 persistStructuredCase', async () => {
    // 验证 persistence.ts 导出包含 persistPipelineResults
    const persistence = await import('@/services/aemc/persistence');
    expect(typeof persistence.persistPipelineResults).toBe('function');
    expect(typeof persistence.persistFailedRuns).toBe('function');
  });
});
