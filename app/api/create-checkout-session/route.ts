import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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
    const stripe = getStripe();
    const supabase = getSupabase();

    const body = await request.json();
    const { packageSlug, customerInfo, preferredDate, preferredTime, notes } = body;

    // 1. 从数据库获取套餐信息
    const { data: packageData, error: packageError } = await supabase
      .from('medical_packages')
      .select('*')
      .eq('slug', packageSlug)
      .single();

    if (packageError || !packageData) {
      return NextResponse.json(
        { error: '套餐不存在' },
        { status: 404 }
      );
    }

    if (!packageData.stripe_price_id) {
      return NextResponse.json(
        { error: '套餐尚未配置 Stripe 价格' },
        { status: 400 }
      );
    }

    // 2. 创建或获取客户记录
    let customerId: string;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, stripe_customer_id')
      .eq('email', customerInfo.email)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // 创建新客户
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone,
          company: customerInfo.company,
          country: customerInfo.country || 'TW'
        })
        .select()
        .single();

      if (customerError || !newCustomer) {
        return NextResponse.json(
          { error: '创建客户失败' },
          { status: 500 }
        );
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
        notes: notes || null
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: '创建订单失败' },
        { status: 500 }
      );
    }

    // 4. 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: packageData.stripe_price_id,
          quantity: 1,
        },
      ],
      customer_email: customerInfo.email,
      metadata: {
        order_id: order.id,
        package_slug: packageSlug,
      },
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

  } catch (error: any) {
    console.error('创建 Checkout Session 失败:', error);
    return NextResponse.json(
      { error: error.message || '创建支付会话失败' },
      { status: 500 }
    );
  }
}
