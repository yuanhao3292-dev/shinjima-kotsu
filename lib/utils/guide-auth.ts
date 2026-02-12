/**
 * 导游认证工具
 * ============================================
 * 统一的导游身份验证和授权中间件
 *
 * 功能：
 * - 验证 Bearer Token
 * - 获取导游配置文件
 * - 检查订阅状态
 * - 提供类型安全的导游上下文
 *
 * 使用方式：
 * 1. 直接调用: const auth = await verifyGuideAuth(request);
 * 2. 高阶函数: withGuideAuth(handler)
 *
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

// ============================================
// 类型定义
// ============================================

/**
 * 导游订阅等级
 */
export type GuideSubscriptionTier = 'growth' | 'partner';

/**
 * 导游订阅状态
 */
export type GuideSubscriptionStatus = 'active' | 'inactive' | 'past_due' | 'canceled';

/**
 * 导游认证上下文
 */
export interface GuideAuthContext {
  /** Supabase 用户 ID */
  userId: string;
  /** 用户邮箱 */
  email: string;
  /** 导游 ID */
  guideId: string;
  /** 导游姓名 */
  guideName: string;
  /** 订阅等级 */
  subscriptionTier: GuideSubscriptionTier;
  /** 订阅状态 */
  subscriptionStatus: GuideSubscriptionStatus;
  /** 佣金等级代码 */
  commissionTierCode: string | null;
  /** 当前佣金比例 */
  commissionRate: number;
  /** 白标配置 ID（如果有） */
  whiteLabelId: string | null;
  /** Supabase 客户端（Service Role） */
  supabase: SupabaseClient;
}

/**
 * 认证结果
 */
export interface GuideAuthResult {
  success: boolean;
  context?: GuideAuthContext;
  error?: string;
  statusCode?: number;
}

/**
 * 认证选项
 */
export interface GuideAuthOptions {
  /** 是否需要活跃订阅 */
  requireActiveSubscription?: boolean;
  /** 允许的订阅等级 */
  allowedTiers?: GuideSubscriptionTier[];
  /** 是否需要白标配置 */
  requireWhiteLabel?: boolean;
}

// ============================================
// Supabase 客户端
// ============================================

function getSupabase(): SupabaseClient {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error('Supabase configuration is missing');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// ============================================
// 佣金比例计算
// ============================================

/**
 * 根据订阅等级获取当前佣金比例
 * 金牌合伙人 = 20%，初期合伙人 = 10%
 */
async function getCommissionRate(
  _supabase: SupabaseClient,
  subscriptionTier: GuideSubscriptionTier,
  _commissionTierCode: string | null
): Promise<number> {
  return subscriptionTier === 'partner' ? 0.20 : 0.10;
}

// ============================================
// 核心认证函数
// ============================================

/**
 * 验证导游身份
 *
 * @param request Next.js 请求对象
 * @param options 认证选项
 * @returns 认证结果
 *
 * @example
 * const auth = await verifyGuideAuth(request);
 * if (!auth.success) {
 *   return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
 * }
 * const { guideId, subscriptionTier } = auth.context;
 */
export async function verifyGuideAuth(
  request: NextRequest,
  options: GuideAuthOptions = {}
): Promise<GuideAuthResult> {
  const {
    requireActiveSubscription = false,
    allowedTiers,
    requireWhiteLabel = false,
  } = options;

  try {
    // 1. 获取 Authorization Header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        success: false,
        error: '请先登录',
        statusCode: 401,
      };
    }

    const token = authHeader.substring(7);
    const supabase = getSupabase();

    // 2. 验证 Token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.warn('[GuideAuth] Token validation failed:', authError?.message);
      return {
        success: false,
        error: '登录已过期，请重新登录',
        statusCode: 401,
      };
    }

    // 3. 获取导游资料
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select(`
        id,
        name,
        email,
        auth_user_id,
        subscription_tier,
        subscription_status,
        commission_tier_code,
        guide_white_label (
          id
        )
      `)
      .eq('auth_user_id', user.id)
      .single();

    if (guideError || !guide) {
      console.warn('[GuideAuth] Guide not found for user:', user.id);
      return {
        success: false,
        error: '导游资料不存在，请先注册成为导游',
        statusCode: 403,
      };
    }

    // 4. 检查订阅状态
    const subscriptionStatus = (guide.subscription_status || 'inactive') as GuideSubscriptionStatus;
    const subscriptionTier = (guide.subscription_tier || 'growth') as GuideSubscriptionTier;

    if (requireActiveSubscription && subscriptionStatus !== 'active') {
      return {
        success: false,
        error: '您的订阅已过期，请续费后继续使用',
        statusCode: 403,
      };
    }

    // 5. 检查订阅等级
    if (allowedTiers && !allowedTiers.includes(subscriptionTier)) {
      return {
        success: false,
        error: `此功能需要 ${allowedTiers.join(' 或 ')} 等级`,
        statusCode: 403,
      };
    }

    // 6. 检查白标配置
    const whiteLabelConfig = guide.guide_white_label as any;
    const whiteLabelId = whiteLabelConfig?.id || null;

    if (requireWhiteLabel && !whiteLabelId) {
      return {
        success: false,
        error: '请先创建白标页面',
        statusCode: 403,
      };
    }

    // 7. 获取佣金比例
    const commissionRate = await getCommissionRate(
      supabase,
      subscriptionTier,
      guide.commission_tier_code
    );

    // 8. 构建认证上下文
    const context: GuideAuthContext = {
      userId: user.id,
      email: user.email || '',
      guideId: guide.id,
      guideName: guide.name || '',
      subscriptionTier,
      subscriptionStatus,
      commissionTierCode: guide.commission_tier_code,
      commissionRate,
      whiteLabelId,
      supabase,
    };

    return {
      success: true,
      context,
    };

  } catch (error) {
    console.error('[GuideAuth] Unexpected error:', error);
    logError(normalizeError(error), { path: 'guide-auth', method: 'verify' });
    return {
      success: false,
      error: '认证服务异常，请稍后重试',
      statusCode: 500,
    };
  }
}

// ============================================
// 高阶函数包装器
// ============================================

/**
 * 导游认证处理器类型
 */
type GuideAuthHandler = (
  request: NextRequest,
  context: GuideAuthContext
) => Promise<NextResponse>;

/**
 * 带参数的导游认证处理器类型
 */
type GuideAuthHandlerWithParams<P extends Record<string, string>> = (
  request: NextRequest,
  context: GuideAuthContext,
  params: P
) => Promise<NextResponse>;

/**
 * 高阶函数：为 API 路由添加导游认证
 *
 * @param handler 路由处理函数
 * @param options 认证选项
 * @returns 包装后的路由处理函数
 *
 * @example
 * // 简单用法
 * export const GET = withGuideAuth(async (request, ctx) => {
 *   const { guideId } = ctx;
 *   // ... 业务逻辑
 *   return NextResponse.json({ data });
 * });
 *
 * @example
 * // 带选项
 * export const POST = withGuideAuth(
 *   async (request, ctx) => {
 *     // 只有合伙人可以访问
 *     return NextResponse.json({ data });
 *   },
 *   { allowedTiers: ['partner'], requireActiveSubscription: true }
 * );
 */
export function withGuideAuth(
  handler: GuideAuthHandler,
  options: GuideAuthOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const auth = await verifyGuideAuth(request, options);

    if (!auth.success || !auth.context) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.statusCode || 401 }
      );
    }

    return handler(request, auth.context);
  };
}

/**
 * 高阶函数：为带参数的 API 路由添加导游认证
 *
 * @example
 * // 用于动态路由 /api/guide/orders/[id]/route.ts
 * export const GET = withGuideAuthParams<{ id: string }>(
 *   async (request, ctx, { id }) => {
 *     // ctx 包含导游上下文，id 是 URL 参数
 *     return NextResponse.json({ orderId: id });
 *   }
 * );
 */
export function withGuideAuthParams<P extends Record<string, string>>(
  handler: GuideAuthHandlerWithParams<P>,
  options: GuideAuthOptions = {}
) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<P> }
  ): Promise<NextResponse> => {
    const auth = await verifyGuideAuth(request, options);

    if (!auth.success || !auth.context) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.statusCode || 401 }
      );
    }

    const resolvedParams = await params;
    return handler(request, auth.context, resolvedParams);
  };
}

// ============================================
// 辅助函数
// ============================================

/**
 * 从请求中提取导游 ID（用于不需要完整认证的场景）
 * 仅验证 token 有效性和导游存在
 */
export async function extractGuideId(request: NextRequest): Promise<string | null> {
  const auth = await verifyGuideAuth(request);
  return auth.context?.guideId || null;
}

/**
 * 检查用户是否是指定导游
 * 用于验证资源所有权
 */
export async function isGuideOwner(
  request: NextRequest,
  resourceGuideId: string
): Promise<boolean> {
  const auth = await verifyGuideAuth(request);
  return auth.context?.guideId === resourceGuideId;
}

/**
 * 获取导游的佣金比例
 */
export async function getGuideCommissionRate(guideId: string): Promise<number> {
  const supabase = getSupabase();

  const { data: guide } = await supabase
    .from('guides')
    .select('subscription_tier, commission_tier_code')
    .eq('id', guideId)
    .single();

  if (!guide) return 0.10;

  return getCommissionRate(
    supabase,
    (guide.subscription_tier || 'growth') as GuideSubscriptionTier,
    guide.commission_tier_code
  );
}
