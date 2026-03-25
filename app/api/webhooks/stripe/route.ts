import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail, sendNewOrderNotificationToMerchant, sendGuideCommissionNotification } from '@/lib/email';
import { escapeHtml } from '@/lib/utils/html-escape';

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

// ============================================
// 幂等性检查辅助函数
// ============================================

/**
 * 检查事件是否已被处理
 * @returns true 如果事件已成功处理，false 如果是新事件或之前处理失败（允许重试）
 */
async function checkEventProcessed(supabase: SupabaseClient, eventId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('webhook_events')
      .select('id, result')
      .eq('event_id', eventId)
      .single();

    if (data && !error) {
      // 只有成功处理的事件才跳过，失败的事件允许 Stripe 重试
      if (data.result === 'success') {
        return true;
      }
      // 标记为重试中（保留记录用于审计追踪）
      await supabase
        .from('webhook_events')
        .update({ result: 'retrying' })
        .eq('event_id', eventId)
        .eq('result', 'failed');
      return false;
    }
    return false;
  } catch {
    // 表不存在或其他错误，允许继续处理
    return false;
  }
}

/**
 * 记录事件已被处理
 */
async function recordEventProcessed(
  supabase: SupabaseClient,
  eventId: string,
  eventType: string,
  result: 'success' | 'failed' | 'skipped',
  errorMessage?: string
): Promise<void> {
  try {
    await supabase
      .from('webhook_events')
      .insert({
        event_id: eventId,
        event_type: eventType,
        result,
        error_message: errorMessage,
      });
  } catch (err) {
    // 记录失败不应阻止主流程
    console.error('记录 webhook 事件失败:', err);
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const supabase = getSupabase();
  // 主 Webhook 使用独立的密钥，与订阅 Webhook 分开
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_MAIN || process.env.STRIPE_WEBHOOK_SECRET;

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

  // ============================================
  // 幂等性检查：防止重复处理同一事件
  // ============================================
  const isProcessed = await checkEventProcessed(supabase, event.id);
  if (isProcessed) {
    console.log(`⏭️ 事件已处理，跳过: ${event.id} (${event.type})`);
    return NextResponse.json({ received: true, skipped: true });
  }

  // 处理不同的事件类型
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // 区分不同类型的支付
        if (session.mode === 'subscription' && session.metadata?.type === 'whitelabel_subscription') {
          await handleWhiteLabelSubscriptionCreated(supabase, session);
        } else if (session.metadata?.type === 'partner_entry_fee') {
          await handlePartnerEntryFeePaid(stripe, supabase, session);
        } else if (session.metadata?.type === 'partner_subscription') {
          await handlePartnerSubscriptionCreated(supabase, session);
        } else if (session.metadata?.type === 'nightclub_deposit') {
          await handleNightclubDepositPaid(supabase, session);
        } else {
          await handleCheckoutSessionCompleted(supabase, session);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(supabase, invoice);
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
        await recordEventProcessed(supabase, event.id, event.type, 'skipped');
        return NextResponse.json({ received: true });
    }

    // 记录事件已成功处理
    await recordEventProcessed(supabase, event.id, event.type, 'success');
    return NextResponse.json({ received: true });

  } catch (error: unknown) {
    console.error('处理 Webhook 事件失败:', error);
    // 记录事件处理失败
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await recordEventProcessed(supabase, event.id, event.type, 'failed', errorMessage);
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

  // 订单级幂等性检查：避免重复处理
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (existingOrder?.status === 'paid' || existingOrder?.status === 'confirmed') {
    console.log(`订单已处理 (status=${existingOrder.status})，跳过: ${orderId}`);
    return;
  }

  // 提取白标归属信息
  const guideId = session.metadata?.guide_id || null;
  const guideSlug = session.metadata?.guide_slug || null;
  const commissionRate = session.metadata?.commission_rate
    ? parseFloat(session.metadata.commission_rate)
    : null;
  const orderType = session.metadata?.order_type || 'medical';
  const moduleId = session.metadata?.module_id || null;
  const locale = (session.metadata?.locale || 'ja') as 'ja' | 'zh-CN' | 'zh-TW' | 'en';
  const provider = session.metadata?.provider || undefined;

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

  // 如果有导游归属，计算并记录佣金
  if (guideId && commissionRate !== null && commissionRate !== undefined) {
    // 获取订单的客户 ID 和套餐 ID
    const { data: orderData } = await supabase
      .from('orders')
      .select('customer_id, package_id')
      .eq('id', orderId)
      .single();

    await calculateAndRecordCommission(supabase, {
      orderId,
      guideId,
      guideSlug,
      orderType,
      commissionRate,
      moduleId,
      sessionAmountTotal: session.amount_total || 0,
      customerId: orderData?.customer_id,
      packageId: orderData?.package_id,
    });
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

    // 单独查询套餐名称（根据 locale 选择对应语言）
    let packageName = locale === 'en' ? 'Medical Check-up' : locale === 'ja' ? '健診プラン' : '體檢套餐';
    if (orderDetails.package_id) {
      const nameColumn = locale === 'ja' ? 'name_ja' : locale === 'en' ? 'name_en' : 'name_zh_tw';
      const { data: packageData } = await supabase
        .from('medical_packages')
        .select(`${nameColumn}, name_zh_tw`)
        .eq('id', orderDetails.package_id)
        .single();
      if (packageData) {
        packageName = (packageData as Record<string, string>)[nameColumn] || packageData.name_zh_tw || packageName;
      }
    }
    console.log('Package name:', packageName, 'locale:', locale);

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
      locale,
      provider,
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

// ============================================
// 白标订阅相关处理函数
// ============================================

// 处理白标订阅创建成功
async function handleWhiteLabelSubscriptionCreated(supabase: SupabaseClient, session: Stripe.Checkout.Session) {
  console.log('🎉 WhiteLabel subscription created:', session.id);

  const guideId = session.metadata?.guide_id;
  if (!guideId) {
    console.error('导游 ID 缺失, metadata:', JSON.stringify(session.metadata));
    return;
  }

  // 更新导游订阅状态
  const { error } = await supabase
    .from('guides')
    .update({
      subscription_status: 'active',
      subscription_plan: 'monthly',
      subscription_start_date: new Date().toISOString(),
      stripe_subscription_id: session.subscription as string,
      updated_at: new Date().toISOString(),
    })
    .eq('id', guideId);

  if (error) {
    console.error('更新导游订阅状态失败:', error);
    return;
  }

  console.log(`✅ 导游 ${guideId} 白标订阅已激活`);
}

// ============================================
// 合伙人订阅相关处理函数
// ============================================

/**
 * 处理合伙人入场费支付成功
 * 入场费支付后，立即创建月费订阅
 */
async function handlePartnerEntryFeePaid(
  stripe: Stripe,
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session
) {
  console.log('💎 Partner entry fee paid:', session.id);

  const guideId = session.metadata?.guide_id;
  const planCode = session.metadata?.plan_code as 'growth' | 'partner';

  if (!guideId || !planCode) {
    console.error('导游 ID 或套餐代码缺失, metadata:', JSON.stringify(session.metadata));
    return;
  }

  // 1. 更新入场费记录状态
  const { error: entryFeeError } = await supabase
    .from('partner_entry_fees')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq('guide_id', guideId)
    .eq('status', 'pending');

  if (entryFeeError) {
    console.error('更新入场费记录失败:', entryFeeError);
    return;
  }

  // 2. 创建 Stripe Price（如果不存在）
  const PLANS = {
    growth: { monthlyFee: 1980, commission: 10 },
    partner: { monthlyFee: 4980, commission: 20 },
  };

  const plan = PLANS[planCode];
  const prices = await stripe.prices.list({ active: true, limit: 100 });
  let priceId = prices.data.find(
    (p) =>
      p.unit_amount === plan.monthlyFee &&
      p.currency === 'jpy' &&
      p.recurring?.interval === 'month' &&
      p.metadata?.plan_code === planCode
  )?.id;

  if (!priceId) {
    const product = await stripe.products.create({
      name: `导游合伙人 - ${planCode === 'partner' ? '金牌合伙人' : '初期合伙人'}`,
      metadata: { plan_code: planCode },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.monthlyFee,
      currency: 'jpy',
      recurring: { interval: 'month' },
      metadata: { plan_code: planCode },
    });
    priceId = price.id;
  }

  // 3. 获取并附加支付方法
  const customerId = session.customer as string;

  // 从 session 中获取 payment_intent 和 payment_method
  const paymentIntentId = session.payment_intent as string;
  if (paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const paymentMethodId = paymentIntent.payment_method as string;

      if (paymentMethodId) {
        // 将支付方法附加到客户（如果尚未附加）
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        }).catch((err) => {
          // 如果已经附加，忽略错误
          if (err.code !== 'resource_already_exists') {
            throw err;
          }
        });

        // 设置为默认支付方法
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });

        console.log('✅ 支付方法已设置为默认:', paymentMethodId);
      }
    } catch (error) {
      console.error('设置支付方法失败:', error);
      // 继续执行，让订阅创建失败并抛出更明确的错误
    }
  }

  // 4. 立即创建月费订阅
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata: {
      guide_id: guideId,
      type: 'partner_subscription',
      plan_code: planCode,
    },
  });

  // 5. 更新导游的订阅信息（同时更新 subscription_tier 和 commission_tier_code）
  const { error: updateError } = await supabase
    .from('guides')
    .update({
      subscription_tier: planCode,
      subscription_plan: 'monthly',
      commission_tier_code: planCode === 'partner' ? 'gold' : 'growth',
      subscription_status: 'active',
      stripe_subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', guideId);

  if (updateError) {
    console.error('更新导游订阅信息失败:', updateError);
    return;
  }

  console.log(`✅ 导游 ${guideId} 已升级为 ${planCode}，月费订阅已创建`);
}

/**
 * 处理合伙人订阅创建成功（初期合伙人直接订阅）
 */
async function handlePartnerSubscriptionCreated(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session
) {
  console.log('📦 Partner subscription created:', session.id);

  const guideId = session.metadata?.guide_id;
  const planCode = session.metadata?.plan_code as 'growth' | 'partner';

  if (!guideId || !planCode) {
    console.error('导游 ID 或套餐代码缺失, metadata:', JSON.stringify(session.metadata));
    return;
  }

  // 更新导游订阅状态（同时更新 subscription_tier 和 commission_tier_code）
  const { error } = await supabase
    .from('guides')
    .update({
      subscription_tier: planCode,
      subscription_plan: 'monthly',
      commission_tier_code: planCode === 'partner' ? 'gold' : 'growth',
      subscription_status: 'active',
      stripe_subscription_id: session.subscription as string,
      updated_at: new Date().toISOString(),
    })
    .eq('id', guideId);

  if (error) {
    console.error('更新导游订阅状态失败:', error);
    return;
  }

  console.log(`✅ 导游 ${guideId} 订阅已激活为 ${planCode}`);
}

// 处理订阅更新（续费成功、计划变更等）
async function handleSubscriptionUpdated(supabase: SupabaseClient, subscription: Stripe.Subscription) {
  console.log('📝 Subscription updated:', subscription.id, 'Status:', subscription.status);

  // 只处理白标订阅和合伙人订阅
  if (
    subscription.metadata?.type !== 'whitelabel_subscription' &&
    subscription.metadata?.type !== 'partner_subscription'
  ) {
    return;
  }

  const guideId = subscription.metadata?.guide_id;
  if (!guideId) {
    // 尝试通过 customer ID 查找
    const { data: guide } = await supabase
      .from('guides')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!guide) {
      console.error('未找到对应的导游');
      return;
    }
  }

  // 映射 Stripe 状态到我们的状态
  let subscriptionStatus: 'active' | 'cancelled' | 'past_due' | 'inactive';
  switch (subscription.status) {
    case 'active':
    case 'trialing':
      subscriptionStatus = 'active';
      break;
    case 'past_due':
      subscriptionStatus = 'past_due';
      break;
    case 'canceled':
    case 'unpaid':
      subscriptionStatus = 'cancelled';
      break;
    default:
      subscriptionStatus = 'inactive';
  }

  // 计算订阅结束日期
  const periodEnd = (subscription as any).current_period_end;
  const endDate = periodEnd
    ? new Date(periodEnd * 1000).toISOString()
    : null;

  await supabase
    .from('guides')
    .update({
      subscription_status: subscriptionStatus,
      subscription_end_date: endDate,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`✅ 订阅 ${subscription.id} 状态已更新为 ${subscriptionStatus}`);
}

// 处理订阅取消
async function handleSubscriptionDeleted(supabase: SupabaseClient, subscription: Stripe.Subscription) {
  console.log('🚫 Subscription deleted:', subscription.id);

  // 如果是合伙人订阅取消，需要降级处理
  if (subscription.metadata?.type === 'partner_subscription') {
    const planCode = subscription.metadata?.plan_code;

    // 金牌合伙人取消月费 → 降级为 growth（失去 20% 分成，需重新支付入场费才能再次升级）
    // 初期合伙人取消月费 → 订阅失效
    const updateData: Record<string, any> = {
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString(),
    };

    if (planCode === 'partner') {
      updateData.subscription_tier = 'growth'; // 降级为初期合伙人
      updateData.commission_tier_code = 'growth'; // 同时更新 commission_tier_code
      console.log(`⚠️ 金牌合伙人降级为初期合伙人（需重新支付入场费才能再升级）`);
    } else {
      updateData.subscription_tier = 'growth'; // 保持 growth，但 status 为 cancelled
      updateData.commission_tier_code = 'growth';
      console.log(`⚠️ 初期合伙人订阅已取消`);
    }

    await supabase
      .from('guides')
      .update(updateData)
      .eq('stripe_subscription_id', subscription.id);

  } else {
    // 其他订阅（白标等）
    await supabase
      .from('guides')
      .update({
        subscription_status: 'cancelled',
        subscription_plan: 'none',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  console.log(`✅ 订阅 ${subscription.id} 已标记为取消`);
}

// 处理发票支付失败
async function handleInvoicePaymentFailed(supabase: SupabaseClient, invoice: Stripe.Invoice) {
  console.log('⚠️ Invoice payment failed:', invoice.id);

  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) {
    return;
  }

  // 更新订阅状态为 past_due
  await supabase
    .from('guides')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  console.log(`⚠️ 订阅 ${subscriptionId} 已标记为逾期`);
}

// ============================================
// 白标佣金计算
// ============================================

interface CommissionParams {
  orderId: string;
  guideId: string;
  guideSlug: string | null;
  orderType: string;
  commissionRate: number;
  moduleId: string | null;
  sessionAmountTotal: number; // Stripe 金额（日元，单位为分）
  customerId?: string; // 客户 ID，用于判断是否新客首单
  packageId?: string; // 套餐 ID，用于查询个别消費税率
}

// 新客首单奖励率
const NEW_CUSTOMER_BONUS_RATE = 5; // +5%

/**
 * 源泉徴収額を計算
 * 居住者: 100万円以下 → 10.21%, 100万円超 → 20.42%
 * 非居住者: 一律 20.42%
 */
function calculateWithholdingTax(
  commission: number,
  isResident: boolean
): { withholdingAmount: number; withholdingRate: number } {
  if (commission <= 0) {
    return { withholdingAmount: 0, withholdingRate: 0 };
  }

  if (!isResident) {
    // 非居住者: 一律 20.42%
    const amount = Math.round(commission * 0.2042);
    return { withholdingAmount: amount, withholdingRate: 0.2042 };
  }

  // 居住者: 100万円以下 → 10.21%, 100万円超過分 → 20.42%
  const threshold = 1_000_000;
  if (commission <= threshold) {
    const amount = Math.round(commission * 0.1021);
    return { withholdingAmount: amount, withholdingRate: 0.1021 };
  } else {
    const amount = Math.round(threshold * 0.1021 + (commission - threshold) * 0.2042);
    // 加重平均レートを記録
    const effectiveRate = amount / commission;
    return { withholdingAmount: amount, withholdingRate: Math.round(effectiveRate * 10000) / 10000 };
  }
}

/**
 * 计算并记录白标订单的佣金
 * 佣金计算公式：(订単金額 / (1 + 税率)) × (佣金率 + 新客奖励)%
 * 税率根据套餐个別設定（默认10%）
 * 新客首单额外 +5% 奖励
 * 源泉徴収: 居住者10.21%/20.42%, 非居住者20.42%
 */
async function calculateAndRecordCommission(
  supabase: SupabaseClient,
  params: CommissionParams
) {
  const { orderId, guideId, guideSlug, orderType, commissionRate, moduleId, sessionAmountTotal, customerId, packageId } = params;

  // Stripe 日元金额不需要除以 100（日元是零小数货币）
  const orderAmount = sessionAmountTotal;

  // 查询套餐个別消費税率（默认 10%）
  let taxRate = 10;
  if (packageId) {
    const { data: pkgData } = await supabase
      .from('medical_packages')
      .select('tax_rate')
      .eq('id', packageId)
      .single();
    if (pkgData?.tax_rate !== null && pkgData?.tax_rate !== undefined) {
      taxRate = Number(pkgData.tax_rate);
    }
  }

  // 计算净额（扣除个別消費税率）
  const netAmount = taxRate > 0 ? Math.round(orderAmount / (1 + taxRate / 100)) : orderAmount;

  // 检查是否是新客户首单（该客户在该导游下的首次付款订单）
  let isNewCustomerFirstOrder = false;
  let bonusRate = 0;

  if (customerId) {
    // 查询该客户在该导游下是否有其他已付款订单
    const { data: previousOrders, error: queryError } = await supabase
      .from('orders')
      .select('id')
      .eq('customer_id', customerId)
      .eq('referred_by_guide_id', guideId)
      .eq('status', 'paid')
      .neq('id', orderId) // 排除当前订单
      .limit(1);

    if (!queryError && (!previousOrders || previousOrders.length === 0)) {
      isNewCustomerFirstOrder = true;
      bonusRate = NEW_CUSTOMER_BONUS_RATE;
      console.log(`🎁 新客首单奖励: 客户=${customerId}, 导游=${guideSlug}, 奖励率=+${bonusRate}%`);
    }
  }

  // 计算最终佣金率（基础佣金率 + 新客奖励）
  const finalCommissionRate = commissionRate + bonusRate;

  // 计算基础佣金和奖励佣金
  const baseCommission = Math.round(netAmount * commissionRate / 100);
  const bonusCommission = Math.round(netAmount * bonusRate / 100);
  const commissionAmount = baseCommission + bonusCommission;

  // 查询导游的税务居住地（用于源泉徴収計算）
  const { data: guideTaxInfo } = await supabase
    .from('guides')
    .select('tax_residency, invoice_registration_number')
    .eq('id', guideId)
    .single();

  const isResident = guideTaxInfo?.tax_residency === 'resident';
  const { withholdingAmount, withholdingRate } = calculateWithholdingTax(commissionAmount, isResident);
  const netCommissionAmount = commissionAmount - withholdingAmount;

  console.log(`💰 佣金计算: 订单金额=${orderAmount}, 税率=${taxRate}%, 净額=${netAmount}, 基础佣金率=${commissionRate}%, 新客奖励=${bonusRate}%, 总佣金率=${finalCommissionRate}%, 佣金=${commissionAmount}, 源泉徴収=${withholdingAmount}(${(withholdingRate * 100).toFixed(2)}%), 手取り=${netCommissionAmount}`);

  // 1. 更新 orders 表的佣金信息
  await supabase
    .from('orders')
    .update({
      commission_amount: commissionAmount,
      commission_status: 'calculated',
    })
    .eq('id', orderId);

  // 2. 计算佣金可提现时间（服务完成日 + 14天等待期）
  // 获取订单的预约日期，作为服务完成日的近似值
  const { data: orderForDate } = await supabase
    .from('orders')
    .select('preferred_date, paid_at')
    .eq('id', orderId)
    .single();

  let commissionAvailableAt: string;
  if (orderForDate?.preferred_date) {
    // 使用预约日期 + 14天
    const serviceDate = new Date(orderForDate.preferred_date);
    serviceDate.setDate(serviceDate.getDate() + 14);
    commissionAvailableAt = serviceDate.toISOString();
    console.log(`⏰ 佣金可提现时间: 预约日期=${orderForDate.preferred_date} + 14天 = ${commissionAvailableAt}`);
  } else {
    // 无预约日期，使用付款日期 + 14天
    const paidDate = orderForDate?.paid_at ? new Date(orderForDate.paid_at) : new Date();
    paidDate.setDate(paidDate.getDate() + 14);
    commissionAvailableAt = paidDate.toISOString();
    console.log(`⏰ 佣金可提现时间: 付款日期 + 14天 = ${commissionAvailableAt}（无预约日期）`);
  }

  // 3. 创建 whitelabel_orders 记录（包含新客奖励信息 + 等待期）
  const { error: wlOrderError } = await supabase
    .from('white_label_orders')
    .insert({
      guide_id: guideId,
      module_id: moduleId,
      order_type: orderType,
      order_amount: orderAmount,
      order_currency: 'JPY',
      status: 'completed',
      source_order_id: orderId,
      source_order_table: 'orders',
      commission_rate: commissionRate,
      applied_commission_rate: finalCommissionRate,
      commission_amount: commissionAmount,
      commission_status: 'calculated',
      commission_available_at: commissionAvailableAt,
      withholding_tax_amount: withholdingAmount,
      withholding_tax_rate: withholdingRate,
      // 新客首单奖励信息（存储在 metadata 中）
      metadata: {
        ...(isNewCustomerFirstOrder ? {
          new_customer_bonus: true,
          bonus_rate: bonusRate,
          bonus_amount: bonusCommission,
          base_commission: baseCommission,
        } : {}),
        tax_rate: taxRate,
        is_resident: isResident,
        has_invoice_number: !!guideTaxInfo?.invoice_registration_number,
        net_commission: netCommissionAmount,
      },
    });

  if (wlOrderError) {
    console.error('创建白标订单记录失败:', wlOrderError);
    throw new Error(`白标订单记录创建失败: ${wlOrderError.message}`);
  } else {
    const bonusInfo = isNewCustomerFirstOrder ? ` (含新客奖励 +${bonusRate}%)` : '';
    console.log(`✅ 白标订单记录已创建: 导游=${guideSlug}, 佣金=${commissionAmount}円${bonusInfo}`);
  }

  // 4. 原子递增导游累计佣金（防并发丢失更新）
  const { data: guideData } = await supabase
    .from('guides')
    .select('name, email, referrer_id')
    .eq('id', guideId)
    .single();

  // 原子递增 total_commission（不再 read-modify-write）
  const { data: newTotal } = await supabase.rpc('increment_guide_commission', {
    p_guide_id: guideId,
    p_amount: commissionAmount,
  });

  if (guideData) {
    console.log(`✅ 导游累计佣金已原子更新: ${newTotal}円`);

    // 5. 发送佣金通知邮件给导游
    if (guideData.email) {
      await sendGuideCommissionNotification({
        guideEmail: guideData.email,
        guideName: guideData.name || guideSlug || '合夥人',
        orderType,
        orderAmount,
        commissionAmount,
        commissionRate: finalCommissionRate,
        isNewCustomerBonus: isNewCustomerFirstOrder,
        bonusAmount: bonusCommission > 0 ? bonusCommission : undefined,
        withholdingAmount: withholdingAmount > 0 ? withholdingAmount : undefined,
        orderId,
        locale: 'ja',
      });
    }
  }

  // 6. 推荐奖励：如果该导游有推荐人，为推荐人创建 2% 奖励
  if (commissionAmount > 0 && guideData?.referrer_id) {
    const referralRewardAmount = Math.round(netCommissionAmount * 0.02);
    const { error: rewardError } = await supabase
      .from('referral_rewards')
      .upsert({
        referrer_id: guideData.referrer_id,
        referee_id: guideId,
        booking_id: orderId,
        reward_type: 'commission',
        reward_rate: 0.02,
        reward_amount: referralRewardAmount,
        status: 'pending',
      }, { onConflict: 'booking_id', ignoreDuplicates: true });

    if (rewardError) {
      console.error('推荐奖励创建失败:', rewardError);
    } else {
      console.log(`✅ 推荐奖励已创建: 推荐人=${guideData.referrer_id}, 奖励=${referralRewardAmount}円 (佣金${commissionAmount}円 × 2%)`);
    }
  }
}

// ============================================
// 夜总会预约定金支付处理
// ============================================
async function handleNightclubDepositPaid(supabase: SupabaseClient, session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.booking_id;
  const guideId = session.metadata?.guide_id;

  if (!bookingId) {
    console.error('[Nightclub Deposit] Missing booking_id in metadata');
    return;
  }

  // 更新预约状态：定金已支付
  const { data: booking, error: updateError } = await supabase
    .from('bookings')
    .update({
      deposit_status: 'paid',
      deposit_paid_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .eq('deposit_status', 'pending') // 幂等：只处理未支付的
    .select('*, venues(name)')
    .single();

  if (updateError) {
    console.error('[Nightclub Deposit] Failed to update booking:', updateError);
    return;
  }

  if (!booking) {
    // 已处理过（幂等）
    console.log(`[Nightclub Deposit] Booking ${bookingId} already processed`);
    return;
  }

  console.log(`✅ [Nightclub Deposit] Booking ${bookingId} deposit paid`);

  // 发送管理员邮件通知 (fire-and-forget)
  const venueData = booking.venues as Record<string, unknown> | Record<string, unknown>[] | null;
  const venueName = String(
    (Array.isArray(venueData) ? venueData[0]?.name : venueData?.name) || ''
  );

  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

  if (resendApiKey && adminEmail) {
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
        to: adminEmail,
        subject: `【新預約待確認】${escapeHtml(venueName)} - ${escapeHtml(String(booking.booking_date))}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 20px;">新預約定金已支付</h1>
            </div>
            <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 12px; font-weight: 600; color: #6b7280;">店鋪</td><td style="padding: 8px 12px;">${escapeHtml(venueName)}</td></tr>
                <tr style="background: #fff;"><td style="padding: 8px 12px; font-weight: 600; color: #6b7280;">預約日期</td><td style="padding: 8px 12px;">${escapeHtml(String(booking.booking_date))}</td></tr>
                <tr><td style="padding: 8px 12px; font-weight: 600; color: #6b7280;">客人數</td><td style="padding: 8px 12px;">${Number(booking.party_size)}人</td></tr>
                <tr style="background: #fff;"><td style="padding: 8px 12px; font-weight: 600; color: #6b7280;">客戶</td><td style="padding: 8px 12px;">${escapeHtml(String(booking.customer_name))}</td></tr>
                <tr><td style="padding: 8px 12px; font-weight: 600; color: #6b7280;">定金</td><td style="padding: 8px 12px; color: #4f46e5; font-weight: 700;">¥${Number(booking.deposit_amount)}</td></tr>
              </table>
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.niijima-koutsu.jp'}/admin/bookings"
                   style="display: inline-block; background: #4f46e5; color: white; padding: 10px 24px; text-decoration: none; border-radius: 6px;">
                  前往管理預約
                </a>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    }).then((res) => {
      if (!res.ok) console.error(`[Nightclub Deposit] Email notification failed: ${res.status}`);
    }).catch((err) => {
      console.error('[Nightclub Deposit] Failed to send email:', err);
    });
  }
}
