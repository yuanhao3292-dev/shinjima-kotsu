/**
 * 分销订单 API
 * ============================================
 * POST /api/whitelabel/orders - 创建分销订单（客户提交咨询）
 * GET /api/whitelabel/orders - 获取订单列表（导游查看自己的订单）
 *
 * 安全特性：
 * - 客户 PII 数据加密存储
 * - 速率限制防止滥用
 * - 输入验证防止注入
 *
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
  createRateLimitHeaders,
} from '@/lib/utils/rate-limiter';
import {
  normalizeError,
  logError,
  createErrorResponse,
  Errors,
} from '@/lib/utils/api-errors';
import { validateBody } from '@/lib/validations/validate';
import { CreateDistributionOrderSchema, PaginationSchema } from '@/lib/validations/api-schemas';
import { encryptCustomerPII } from '@/lib/utils/encryption';

// ============================================
// Supabase 客户端
// ============================================

const getSupabase = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error('Supabase configuration is missing');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// ============================================
// POST - 创建分销订单
// ============================================

/**
 * 创建分销订单
 *
 * 请求体:
 * {
 *   guideWhiteLabelId: string,  // 导游白标配置 ID
 *   moduleId: string,           // 服务模块 ID
 *   customer: {
 *     name: string,
 *     email?: string,
 *     phone?: string,
 *     wechat?: string
 *   },
 *   orderDetails?: object,
 *   inquiryMessage?: string,
 *   preferredDate?: string,     // YYYY-MM-DD
 *   tracking?: {
 *     utm_source?: string,
 *     utm_medium?: string,
 *     utm_campaign?: string,
 *     referrer?: string,
 *     source_page_path?: string
 *   }
 * }
 *
 * 响应:
 * {
 *   success: true,
 *   orderId: string,
 *   message: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 速率限制检查
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/whitelabel/orders`,
      RATE_LIMITS.standard
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const supabase = getSupabase();

    // 2. 验证请求体
    const validation = await validateBody(request, CreateDistributionOrderSchema);
    if (!validation.success) return validation.error;

    const {
      guideWhiteLabelId,
      moduleId,
      customer,
      orderDetails,
      inquiryMessage,
      preferredDate,
      tracking,
    } = validation.data;

    // 3. 验证白标配置存在且有效
    const { data: whiteLabelConfig, error: configError } = await supabase
      .from('guide_white_label')
      .select(`
        id,
        guide_id,
        is_published,
        guides!inner (
          id,
          name,
          subscription_status,
          subscription_tier,
          commission_tier_code
        )
      `)
      .eq('id', guideWhiteLabelId)
      .single();

    if (configError || !whiteLabelConfig) {
      console.error('[Orders] White label config not found:', guideWhiteLabelId);
      return NextResponse.json(
        { error: '页面配置不存在' },
        { status: 404 }
      );
    }

    // 4. 验证导游订阅状态
    const guide = whiteLabelConfig.guides as any;
    if (guide.subscription_status !== 'active') {
      console.warn('[Orders] Guide subscription not active:', guide.id);
      return NextResponse.json(
        { error: '该页面暂时无法接受咨询' },
        { status: 400 }
      );
    }

    // 5. 验证模块存在
    const { data: pageModule, error: moduleError } = await supabase
      .from('page_modules')
      .select('id, name, status')
      .eq('id', moduleId)
      .single();

    if (moduleError || !pageModule) {
      console.error('[Orders] Module not found:', moduleId);
      return NextResponse.json(
        { error: '服务模块不存在' },
        { status: 404 }
      );
    }

    // 6. 获取导游佣金比例
    let commissionRate = 0.10; // 默认 10%
    if (guide.subscription_tier === 'partner') {
      commissionRate = 0.20; // 合伙人固定 20%
    } else if (guide.commission_tier_code) {
      // 查询成长版的佣金等级
      const { data: tier } = await supabase
        .from('commission_tiers')
        .select('commission_rate')
        .eq('tier_code', guide.commission_tier_code)
        .single();
      if (tier) {
        commissionRate = tier.commission_rate;
      }
    }

    // 7. 加密客户 PII
    const encryptedPII = encryptCustomerPII({
      name: customer.name,
      email: customer.email || undefined,
      phone: customer.phone || undefined,
      wechat: customer.wechat || undefined,
    });

    // 8. 构建订单数据
    const orderData = {
      guide_white_label_id: guideWhiteLabelId,
      module_id: moduleId,
      // 客户信息（加密）
      ...encryptedPII,
      // 订单详情
      order_details: orderDetails || {},
      inquiry_message: inquiryMessage,
      preferred_date: preferredDate,
      // 状态
      status: 'inquiry',
      inquiry_at: new Date().toISOString(),
      // 佣金信息
      commission_rate: commissionRate,
      commission_status: 'pending',
      // UTM 追踪
      utm_source: tracking?.utm_source,
      utm_medium: tracking?.utm_medium,
      utm_campaign: tracking?.utm_campaign,
      referrer: tracking?.referrer,
      source_page_path: tracking?.source_page_path,
    };

    // 9. 插入订单
    const { data: newOrder, error: insertError } = await supabase
      .from('white_label_orders')
      .insert(orderData)
      .select('id')
      .single();

    if (insertError) {
      console.error('[Orders] Insert error:', insertError);
      logError(normalizeError(insertError), {
        path: '/api/whitelabel/orders',
        method: 'POST',
        context: 'insert_order',
      });
      return NextResponse.json(
        { error: '创建订单失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 10. 更新导游转化统计（异步，不阻塞主流程）
    try {
      const { error: rpcError } = await supabase.rpc('increment_guide_conversion', {
        p_guide_id: guide.id,
      });
      if (rpcError) {
        console.warn('[Orders] Failed to increment conversion:', rpcError);
      } else {
        console.log('[Orders] Guide conversion incremented');
      }
    } catch (err) {
      // 统计更新失败不影响主流程
      console.warn('[Orders] Failed to increment conversion:', err);
    }

    console.log(`[Orders] ✅ Order created: ${newOrder.id} for guide ${guide.id}`);

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      message: '咨询已提交，导游将尽快与您联系',
    });

  } catch (error: unknown) {
    const apiError = normalizeError(error);
    console.error('[Orders] POST error:', apiError);
    logError(apiError, { path: '/api/whitelabel/orders', method: 'POST' });
    return createErrorResponse(apiError);
  }
}

// ============================================
// GET - 获取订单列表（导游端）
// ============================================

/**
 * 获取导游的分销订单列表
 *
 * 查询参数:
 * - guideId: string (必填) - 导游 ID
 * - status?: string - 筛选状态
 * - page?: number - 页码（默认 1）
 * - limit?: number - 每页数量（默认 20，最大 100）
 *
 * 响应:
 * {
 *   orders: OrderSummary[],
 *   pagination: { page, limit, total, totalPages }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // 1. 速率限制
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/whitelabel/orders:get`,
      RATE_LIMITS.standard
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);

    // 2. 验证 guideId
    const guideId = searchParams.get('guideId');
    if (!guideId) {
      return NextResponse.json(
        { error: 'guideId is required' },
        { status: 400 }
      );
    }

    // 3. 解析分页参数
    const paginationResult = PaginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });
    const { page, limit } = paginationResult.success
      ? paginationResult.data
      : { page: 1, limit: 20 };

    const offset = (page - 1) * limit;

    // 4. 获取状态筛选
    const status = searchParams.get('status');
    const validStatuses = ['inquiry', 'quoted', 'deposit_pending', 'deposit_paid', 'in_progress', 'completed', 'cancelled', 'refunded'];
    const statusFilter = status && validStatuses.includes(status) ? status : null;

    // 5. 查询订单（通过 guide_white_label 关联）
    let query = supabase
      .from('white_label_orders')
      .select(`
        id,
        customer_name,
        status,
        inquiry_at,
        quoted_at,
        quoted_amount,
        deposit_amount,
        final_amount,
        commission_amount,
        commission_status,
        preferred_date,
        created_at,
        guide_white_label!inner (
          id,
          guide_id
        ),
        page_modules (
          id,
          name
        )
      `, { count: 'exact' })
      .eq('guide_white_label.guide_id', guideId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data: orders, count, error: queryError } = await query;

    if (queryError) {
      console.error('[Orders] Query error:', queryError);
      return NextResponse.json(
        { error: '获取订单失败' },
        { status: 500 }
      );
    }

    // 6. 转换数据格式
    const orderSummaries = orders?.map((order: any) => ({
      id: order.id,
      customerName: order.customer_name,
      status: order.status,
      moduleName: order.page_modules?.name,
      preferredDate: order.preferred_date,
      quotedAmount: order.quoted_amount,
      depositAmount: order.deposit_amount,
      finalAmount: order.final_amount,
      commissionAmount: order.commission_amount,
      commissionStatus: order.commission_status,
      inquiryAt: order.inquiry_at,
      quotedAt: order.quoted_at,
      createdAt: order.created_at,
    })) || [];

    return NextResponse.json({
      orders: orderSummaries,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error: unknown) {
    const apiError = normalizeError(error);
    console.error('[Orders] GET error:', apiError);
    logError(apiError, { path: '/api/whitelabel/orders', method: 'GET' });
    return createErrorResponse(apiError);
  }
}
