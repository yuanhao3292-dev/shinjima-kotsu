import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { WHITELABEL_COOKIE_NAME } from '@/lib/types/whitelabel';
import { validateBody } from '@/lib/validations/validate';
import { CreateCheckoutSessionSchema } from '@/lib/validations/api-schemas';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

// 延迟初始化，避免构建时报错
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getSupabase = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase configuration is missing');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查（敏感端点：每分钟 10 次）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/create-checkout-session`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const stripe = getStripe();
    const supabase = getSupabase();

    // 使用 Zod 验证输入
    const validation = await validateBody(request, CreateCheckoutSessionSchema);
    if (!validation.success) return validation.error;
    const { packageSlug, customerInfo, preferredDate, preferredTime, notes } = validation.data;

    // 获取白标导游归属（从 Cookie）
    let guideSlug = request.cookies.get(WHITELABEL_COOKIE_NAME)?.value || null;
    let guideId: string | null = null;
    let guideCommissionRate: number | null = null;

    if (guideSlug) {
      // 查询导游信息和佣金率
      const { data: guideData, error: guideError } = await supabase
        .from('guides')
        .select(`
          id,
          commission_tier_id,
          commission_tiers!inner(commission_rate)
        `)
        .eq('slug', guideSlug)
        .eq('status', 'approved')
        .eq('subscription_status', 'active')
        .single();

      if (guideData) {
        guideId = guideData.id;
        // commission_tiers 可能是数组或对象
        const tierData = Array.isArray(guideData.commission_tiers)
          ? guideData.commission_tiers[0]
          : guideData.commission_tiers;
        guideCommissionRate = tierData?.commission_rate || 10;
      } else {
        // 无效的 guide_slug，清空以防止记录到订单中
        console.warn(`[Security] Invalid guide_slug in cookie: ${guideSlug}`, guideError);
        guideSlug = null;
      }
    }

    // 1. 从数据库获取套餐信息
    const { data: packageData, error: packageError } = await supabase
      .from('medical_packages')
      .select('*')
      .eq('slug', packageSlug)
      .single();

    if (packageError || !packageData) {
      return createErrorResponse(Errors.notFound('套餐不存在'));
    }

    if (!packageData.stripe_price_id) {
      return createErrorResponse(Errors.business('套餐尚未配置 Stripe 价格', 'PACKAGE_NOT_CONFIGURED'));
    }

    // 价格验证：防止前端价格篡改
    const EXPECTED_PRICES: Record<string, number> = {
      'cancer-initial-consultation': 221000,
      'cancer-remote-consultation': 243000,
    };

    if (EXPECTED_PRICES[packageSlug] && packageData.price_jpy !== EXPECTED_PRICES[packageSlug]) {
      console.error(`[Security] Price mismatch for package ${packageSlug}: expected ${EXPECTED_PRICES[packageSlug]}, got ${packageData.price_jpy}`);
      logError(normalizeError(new Error('Price mismatch')), {
        path: '/api/create-checkout-session',
        method: 'POST',
        context: 'price_verification',
        packageSlug,
        expected: String(EXPECTED_PRICES[packageSlug]),
        actual: String(packageData.price_jpy)
      });
      return createErrorResponse(Errors.internal('套餐价格异常，请联系管理员'));
    }

    // 2. 创建或获取客户记录
    let customerId: string;
    let existingCustomer = null;

    // 只在有 email 时尝试查找现有客户（避免匹配多个无 email 的客户）
    if (customerInfo.email && customerInfo.email.trim() !== '') {
      const { data } = await supabase
        .from('customers')
        .select('id, stripe_customer_id')
        .eq('email', customerInfo.email)
        .single();
      existingCustomer = data;
    }

    if (existingCustomer) {
      customerId = existingCustomer.id;
      // 更新现有客户的社交媒体联系方式（如果有新值）
      const updateData: Record<string, string | null> = {};
      if (customerInfo.line) updateData.line = customerInfo.line;
      if (customerInfo.wechat) updateData.wechat = customerInfo.wechat;
      if (customerInfo.whatsapp) updateData.whatsapp = customerInfo.whatsapp;
      if (Object.keys(updateData).length > 0) {
        await supabase.from('customers').update(updateData).eq('id', customerId);
      }
    } else {
      // 创建新客户（包含社交媒体联系字段）
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: customerInfo.email || null,
          name: customerInfo.name,
          phone: customerInfo.phone || null,
          company: customerInfo.company || null,
          country: customerInfo.country || 'TW',
          line: customerInfo.line || null,
          wechat: customerInfo.wechat || null,
          whatsapp: customerInfo.whatsapp || null,
        })
        .select()
        .single();

      if (customerError || !newCustomer) {
        logError(normalizeError(customerError), { path: '/api/create-checkout-session', method: 'POST', context: 'create_customer' });
        return createErrorResponse(Errors.internal('创建客户失败'));
      }

      customerId = newCustomer.id;
    }

    // 3. 创建订单记录（状态为 pending）
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        package_id: packageData.id,
        quantity: 1,
        total_amount_jpy: packageData.price_jpy,
        status: 'pending',
        customer_snapshot: customerInfo,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        notes: notes || null,
        // 白标归属字段
        referred_by_guide_id: guideId,
        referred_by_guide_slug: guideSlug,
        commission_rate: guideCommissionRate,
      })
      .select()
      .single();

    if (orderError || !order) {
      // 输出详细的 Supabase 错误信息
      console.error('[create-checkout-session] Order creation failed:', JSON.stringify(orderError, null, 2));
      logError(normalizeError(orderError), { path: '/api/create-checkout-session', method: 'POST', context: 'create_order' });
      return createErrorResponse(Errors.internal('创建订单失败'));
    }

    // 4. 创建 Stripe Checkout Session
    const sessionMetadata: Record<string, string> = {
      order_id: order.id,
      package_slug: packageSlug,
      order_type: 'medical', // 订单类型
    };

    // 如果有导游归属，添加到 metadata
    if (guideId) {
      sessionMetadata.guide_id = guideId;
      sessionMetadata.guide_slug = guideSlug!;
      sessionMetadata.commission_rate = String(guideCommissionRate);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: packageData.stripe_price_id,
          quantity: 1,
        },
      ],
      // email 现在是可选的，如果没有填写则让 Stripe checkout 页面收集
      ...(customerInfo.email && { customer_email: customerInfo.email }),
      metadata: sessionMetadata,
      success_url: `${request.nextUrl.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/payment/cancel?order_id=${order.id}`,
    });

    // 5. 更新订单的 checkout_session_id
    await supabase
      .from('orders')
      .update({ checkout_session_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url, // 返回 Checkout URL
      orderId: order.id,
    });

  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/create-checkout-session', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
