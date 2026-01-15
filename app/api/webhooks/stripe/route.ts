import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail, sendNewOrderNotificationToMerchant } from '@/lib/email';

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
  const stripe = getStripe();
  const supabase = getSupabase();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // 验证 Webhook 签名
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook 签名验证失败: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // 处理不同的事件类型
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(supabase, session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(supabase, paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(supabase, paymentIntent);
        break;
      }

      default:
        console.log(`未处理的事件类型: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('处理 Webhook 事件失败:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// 处理支付完成
async function handleCheckoutSessionCompleted(supabase: SupabaseClient, session: Stripe.Checkout.Session) {
  console.log('✅ Checkout session completed:', session.id);
  console.log('Session metadata:', JSON.stringify(session.metadata));

  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.error('订单 ID 缺失, metadata:', JSON.stringify(session.metadata));
    return;
  }
  console.log('Order ID found:', orderId);

  // 更新订单状态为 paid
  const { error: orderError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_intent_id: session.payment_intent as string,
      paid_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (orderError) {
    console.error('更新订单状态失败:', orderError);
    return;
  }

  // 如果有 Stripe Customer ID，更新客户记录
  if (session.customer) {
    const { data: order } = await supabase
      .from('orders')
      .select('customer_id')
      .eq('id', orderId)
      .single();

    if (order) {
      await supabase
        .from('customers')
        .update({ stripe_customer_id: session.customer as string })
        .eq('id', order.customer_id);
    }
  }

  // 获取订单详情
  const { data: orderDetails, error: detailsError } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount_jpy,
      customer_snapshot,
      preferred_date,
      preferred_time,
      notes,
      package_id
    `)
    .eq('id', orderId)
    .single();

  console.log('Order details query result:', JSON.stringify({ orderDetails, detailsError }));

  if (orderDetails && orderDetails.customer_snapshot) {
    const customerSnapshot = orderDetails.customer_snapshot as { name: string; email: string };

    // 单独查询套餐名称
    let packageName = '體檢套餐';
    if (orderDetails.package_id) {
      const { data: packageData } = await supabase
        .from('medical_packages')
        .select('name_zh_tw')
        .eq('id', orderDetails.package_id)
        .single();
      if (packageData?.name_zh_tw) {
        packageName = packageData.name_zh_tw;
      }
    }
    console.log('Package name:', packageName);

    // 发送客户确认邮件
    await sendOrderConfirmationEmail({
      customerName: customerSnapshot.name,
      customerEmail: customerSnapshot.email,
      packageName: packageName,
      packagePrice: orderDetails.total_amount_jpy,
      orderId: orderId,
      preferredDate: orderDetails.preferred_date || undefined,
      preferredTime: orderDetails.preferred_time || undefined,
      notes: orderDetails.notes || undefined,
    });

    // 发送商家通知
    await sendNewOrderNotificationToMerchant({
      customerName: customerSnapshot.name,
      customerEmail: customerSnapshot.email,
      packageName: packageName,
      packagePrice: orderDetails.total_amount_jpy,
      orderId: orderId,
      preferredDate: orderDetails.preferred_date || undefined,
      preferredTime: orderDetails.preferred_time || undefined,
      notes: orderDetails.notes || undefined,
    });

    console.log(`📧 确认邮件已发送给 ${customerSnapshot.email}`);
  }

  console.log(`订单 ${orderId} 状态已更新为 paid`);
}

// 处理支付成功
async function handlePaymentIntentSucceeded(supabase: SupabaseClient, paymentIntent: Stripe.PaymentIntent) {
  console.log('💰 Payment succeeded:', paymentIntent.id);

  // 查找对应的订单
  const { data: order } = await supabase
    .from('orders')
    .select('id, customer_id')
    .eq('payment_intent_id', paymentIntent.id)
    .single();

  if (!order) {
    console.error('未找到对应的订单');
    return;
  }

  // 创建支付记录
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      order_id: order.id,
      stripe_payment_intent_id: paymentIntent.id,
      amount_jpy: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'succeeded',
      payment_method: paymentIntent.payment_method_types[0],
      stripe_charge_id: paymentIntent.latest_charge as string,
      receipt_url: (paymentIntent as any).charges?.data[0]?.receipt_url,
      metadata: paymentIntent.metadata,
    });

  if (paymentError) {
    console.error('创建支付记录失败:', paymentError);
  }
}

// 处理支付失败
async function handlePaymentIntentFailed(supabase: SupabaseClient, paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);

  // 查找对应的订单
  const { data: order } = await supabase
    .from('orders')
    .select('id')
    .eq('payment_intent_id', paymentIntent.id)
    .single();

  if (!order) {
    console.error('未找到对应的订单');
    return;
  }

  // 创建失败的支付记录
  await supabase
    .from('payments')
    .insert({
      order_id: order.id,
      stripe_payment_intent_id: paymentIntent.id,
      amount_jpy: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'failed',
      payment_method: paymentIntent.payment_method_types[0],
      failure_message: paymentIntent.last_payment_error?.message || '支付失败',
      metadata: paymentIntent.metadata,
    });
}
