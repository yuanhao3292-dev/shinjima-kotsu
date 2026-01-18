import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================
// 简单的内存速率限制器（防止暴力枚举）
// 生产环境建议使用 Redis 或 Upstash
// ============================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分钟
const RATE_LIMIT_MAX_REQUESTS = 5; // 每分钟最多 5 次请求

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // 清理过期记录（简单实现，生产环境需要更好的清理策略）
  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    // 新记录或已过期
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // 超过限制
  }

  record.count++;
  return true;
}

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

// GET: 通过 session_id 查询订单 ID
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const sessionId = request.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: '缺少 session_id 参数' },
        { status: 400 }
      );
    }

    // 通过 checkout_session_id 查询订单
    const { data: order, error } = await supabase
      .from('orders')
      .select('id')
      .eq('checkout_session_id', sessionId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: '未找到订单' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
    });

  } catch (error: any) {
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
    // 获取客户端 IP 用于速率限制
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    // 检查速率限制
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429 }
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

  } catch (error: any) {
    console.error('Order lookup error:', error);
    return NextResponse.json(
      { error: '系統錯誤，請稍後重試' },
      { status: 500 }
    );
  }
}
