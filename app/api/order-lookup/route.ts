import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { WHITELABEL_COOKIE_NAME, isValidSlug as isValidGuideSlug } from '@/lib/whitelabel-config';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { createErrorResponse, Errors } from '@/lib/utils/api-errors';

// 延迟初始化 Supabase 客户端
const getSupabase = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase configuration is missing');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// 简单的邮箱格式验证
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// GET: 通过 session_id 或 order_id 查询订单归属信息
export async function GET(request: NextRequest) {
  try {
    // 速率限制（防枚举，Upstash Redis 分布式限速）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/order-lookup:GET`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const supabase = getSupabase();
    const sessionId = request.nextUrl.searchParams.get('session_id');
    const orderId = request.nextUrl.searchParams.get('order_id');

    if (!sessionId && !orderId) {
      return NextResponse.json(
        { error: '缺少 session_id 或 order_id 参数' },
        { status: 400 }
      );
    }

    // 参数格式预校验：不符合直接 400，不进 DB（减少 DB 压力 + 降低枚举价值）
    // Stripe session ID 格式: cs_test_xxx 或 cs_live_xxx（至少 20 字符）
    // Order ID 格式: UUID（36 字符含连字符）
    if (sessionId && (sessionId.length < 20 || !sessionId.startsWith('cs_'))) {
      return NextResponse.json({ error: '无效的 session_id 格式' }, { status: 400 });
    }
    if (orderId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
      return NextResponse.json({ error: '无效的 order_id 格式' }, { status: 400 });
    }

    // 构建查询：支持 session_id 或 order_id
    let query = supabase
      .from('orders')
      .select('id, referred_by_guide_slug');

    if (sessionId) {
      query = query.eq('checkout_session_id', sessionId);
    } else {
      query = query.eq('id', orderId!);
    }

    const { data: order, error } = await query.single();

    if (error || !order) {
      return NextResponse.json(
        { error: '未找到订单' },
        { status: 404 }
      );
    }

    // 优先使用订单中的导游归属，fallback 到 cookie（确保白标用户跳转正确）
    let guideSlug = order.referred_by_guide_slug || null;
    if (!guideSlug) {
      const cookieSlug = request.cookies.get(WHITELABEL_COOKIE_NAME)?.value;
      if (cookieSlug && isValidGuideSlug(cookieSlug)) {
        guideSlug = cookieSlug;
      }
    }

    // Cache-Control: no-store 防止共享设备/代理缓存导游归属信息
    return NextResponse.json(
      { orderId: order.id, guideSlug },
      { headers: { 'Cache-Control': 'no-store' } }
    );

  } catch (error: unknown) {
    console.error('Order lookup by session error:', error);
    return NextResponse.json(
      { error: '系统错误' },
      { status: 500 }
    );
  }
}

// POST: 通过 email + orderId 查询订单详情
export async function POST(request: NextRequest) {
  try {
    // 速率限制（防暴力枚举，Upstash Redis 分布式限速）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/order-lookup:POST`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const supabase = getSupabase();
    const body = await request.json();
    const { email, orderId } = body;

    // 输入验证
    if (!email || !orderId) {
      return NextResponse.json(
        { error: '請提供電子郵箱和訂單編號' },
        { status: 400 }
      );
    }

    // 邮箱格式验证
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '請輸入有效的電子郵箱格式' },
        { status: 400 }
      );
    }

    // 订单号格式验证（至少4位）
    const normalizedOrderId = orderId.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (normalizedOrderId.length < 4) {
      return NextResponse.json(
        { error: '訂單編號格式不正確，請輸入至少4位字符' },
        { status: 400 }
      );
    }

    // 首先通过邮箱查找客户
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!customer) {
      return NextResponse.json(
        { error: '未找到符合條件的訂單，請確認輸入信息' },
        { status: 404 }
      );
    }

    // 查询该客户的订单（使用 orders 表，与 Stripe checkout 保持一致）
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        total_amount_jpy,
        preferred_date,
        preferred_time,
        paid_at,
        created_at,
        customer_snapshot,
        medical_packages (
          name_zh_tw,
          price_jpy
        )
      `)
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: '查詢失敗，請稍後重試' },
        { status: 500 }
      );
    }

    // 找到匹配订单号的订单
    const matchedOrder = orders?.find((order: any) => {
      const orderNum = order.order_number?.toUpperCase() || '';
      const orderIdUpper = order.id.toUpperCase();
      const orderIdLast8 = orderIdUpper.slice(-8);

      return orderNum === normalizedOrderId ||
             orderNum.includes(normalizedOrderId) ||
             orderIdUpper.includes(normalizedOrderId) ||
             orderIdLast8 === normalizedOrderId ||  // 精确匹配后8位
             normalizedOrderId.includes(orderIdLast8);  // 用户输入包含后8位
    });

    if (!matchedOrder) {
      return NextResponse.json(
        { error: '未找到符合條件的訂單，請確認輸入信息' },
        { status: 404 }
      );
    }

    // 处理套餐信息
    const pkgData = matchedOrder.medical_packages;
    const packageInfo = Array.isArray(pkgData) ? pkgData[0] : pkgData;

    // 从 customer_snapshot 获取客户信息
    const snapshot = matchedOrder.customer_snapshot as { name?: string; email?: string } | null;

    return NextResponse.json({
      order: {
        orderId: matchedOrder.order_number || matchedOrder.id,
        orderIdShort: matchedOrder.order_number || matchedOrder.id.slice(-8).toUpperCase(),
        status: matchedOrder.status || 'pending',
        packageName: packageInfo?.name_zh_tw || '體檢套餐',
        packagePrice: matchedOrder.total_amount_jpy || packageInfo?.price_jpy || 0,
        customerName: snapshot?.name || '',
        customerEmail: snapshot?.email || email,
        preferredDate: matchedOrder.preferred_date,
        createdAt: matchedOrder.created_at,
        paymentStatus: matchedOrder.paid_at ? 'paid' : 'pending',
      }
    });

  } catch (error: unknown) {
    console.error('Order lookup error:', error);
    return NextResponse.json(
      { error: '系統錯誤，請稍後重試' },
      { status: 500 }
    );
  }
}
