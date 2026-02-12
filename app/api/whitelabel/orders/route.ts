/**
 * 白标订单 API
 * ============================================
 * POST /api/whitelabel/orders - 创建订单（客户提交咨询）
 * GET /api/whitelabel/orders - 获取订单列表（导游查看自己的订单）
 *
 * DB 表: white_label_orders (058_white_label_system.sql)
 * 列: guide_id, module_id, customer_name, customer_phone, customer_email,
 *     customer_wechat, customer_line, customer_notes, service_type, service_name,
 *     service_date, service_time, total_amount, commission_rate, commission_amount,
 *     payment_status, status(pending/confirmed/completed/cancelled), ...
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
import { z } from 'zod';

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

// 内联 Zod schema，匹配实际 DB 列
const CreateOrderSchema = z.object({
  guideId: z.string().uuid(),
  moduleId: z.string().uuid().optional(),
  customer: z.object({
    name: z.string().min(1).max(100),
    phone: z.string().max(30).optional(),
    email: z.string().email().max(200).optional(),
    wechat: z.string().max(100).optional(),
    line: z.string().max(100).optional(),
    notes: z.string().max(2000).optional(),
  }),
  serviceType: z.string().max(50).optional(),
  serviceName: z.string().max(200).optional(),
  serviceDate: z.string().optional(),
  serviceTime: z.string().max(20).optional(),
  totalAmount: z.number().int().min(0).optional(),
});

// ============================================
// POST - 创建订单
// ============================================

export async function POST(request: NextRequest) {
  try {
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse(Errors.validation('无效的请求体'));
    }

    const parseResult = CreateOrderSchema.safeParse(body);
    if (!parseResult.success) {
      return createErrorResponse(Errors.validation('参数错误'));
    }

    const { guideId, moduleId, customer, serviceType, serviceName, serviceDate, serviceTime, totalAmount } = parseResult.data;

    // 验证导游存在且订阅有效
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, name, subscription_status, subscription_tier, commission_tier_code')
      .eq('id', guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: '导游不存在' }, { status: 404 });
    }

    if (guide.subscription_status !== 'active') {
      return NextResponse.json({ error: '该页面暂时无法接受咨询' }, { status: 400 });
    }

    // 验证模块存在且导游已选择该模块
    let moduleName = serviceName || '咨询服务';
    let moduleCategory = serviceType || 'medical';
    if (moduleId) {
      const { data: pageModule } = await supabase
        .from('page_modules')
        .select('id, name, category, is_active')
        .eq('id', moduleId)
        .single();

      if (!pageModule || !pageModule.is_active) {
        return NextResponse.json({ error: '该服务模块不存在或已下架' }, { status: 404 });
      }

      // 验证导游已选择该模块
      const { data: guideModule } = await supabase
        .from('guide_selected_modules')
        .select('id')
        .eq('guide_id', guideId)
        .eq('module_id', moduleId)
        .eq('is_enabled', true)
        .maybeSingle();

      if (!guideModule) {
        return NextResponse.json({ error: '该导游未提供此服务' }, { status: 403 });
      }

      moduleName = pageModule.name;
      moduleCategory = pageModule.category;
    }

    // 获取佣金比例：金牌合伙人 20%，初期合伙人 10%
    const commissionRate = guide.subscription_tier === 'partner' ? 0.20 : 0.10;

    // 插入订单（匹配 white_label_orders 实际列）
    const { data: newOrder, error: insertError } = await supabase
      .from('white_label_orders')
      .insert({
        guide_id: guideId,
        module_id: moduleId || null,
        customer_name: customer.name,
        customer_phone: customer.phone || null,
        customer_email: customer.email || null,
        customer_wechat: customer.wechat || null,
        customer_line: customer.line || null,
        customer_notes: customer.notes || null,
        service_type: moduleCategory,
        service_name: moduleName,
        service_date: serviceDate || null,
        service_time: serviceTime || null,
        total_amount: totalAmount || 0,
        commission_rate: commissionRate,
        status: 'pending',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('[Orders] Insert error:', insertError);
      logError(normalizeError(insertError), {
        path: '/api/whitelabel/orders',
        method: 'POST',
      });
      return NextResponse.json({ error: '创建订单失败，请稍后重试' }, { status: 500 });
    }

    console.log(`[Orders] Order created: ${newOrder.id} for guide ${guideId}`);

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

export async function GET(request: NextRequest) {
  try {
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

    const guideId = searchParams.get('guideId');
    if (!guideId) {
      return NextResponse.json({ error: 'guideId is required' }, { status: 400 });
    }

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    const status = searchParams.get('status');
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const statusFilter = status && validStatuses.includes(status) ? status : null;

    // 直接通过 guide_id 查询（white_label_orders.guide_id -> guides.id）
    let query = supabase
      .from('white_label_orders')
      .select(`
        id,
        customer_name,
        status,
        payment_status,
        service_type,
        service_name,
        service_date,
        total_amount,
        commission_rate,
        commission_amount,
        created_at,
        confirmed_at,
        completed_at,
        page_modules (
          id,
          name,
          category
        )
      `, { count: 'exact' })
      .eq('guide_id', guideId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data: orders, count, error: queryError } = await query;

    if (queryError) {
      console.error('[Orders] Query error:', queryError);
      return NextResponse.json({ error: '获取订单失败' }, { status: 500 });
    }

    const orderSummaries = (orders || []).map((order: Record<string, unknown>) => ({
      id: order.id,
      customerName: order.customer_name,
      status: order.status,
      paymentStatus: order.payment_status,
      serviceType: order.service_type,
      serviceName: order.service_name,
      serviceDate: order.service_date,
      totalAmount: order.total_amount,
      commissionRate: order.commission_rate,
      commissionAmount: order.commission_amount,
      moduleName: (order.page_modules as Record<string, unknown> | null)?.name,
      moduleCategory: (order.page_modules as Record<string, unknown> | null)?.category,
      createdAt: order.created_at,
      confirmedAt: order.confirmed_at,
      completedAt: order.completed_at,
    }));

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
