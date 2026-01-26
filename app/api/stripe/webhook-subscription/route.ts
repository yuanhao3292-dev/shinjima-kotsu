import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { normalizeError, logError } from '@/lib/utils/api-errors';

/**
 * Stripe Webhook - 订阅状态同步
 *
 * POST /api/stripe/webhook-subscription
 *
 * 处理事件：
 * - customer.subscription.created - 订阅创建
 * - customer.subscription.updated - 订阅更新
 * - customer.subscription.deleted - 订阅取消
 * - checkout.session.completed - 支付完成
 *
 * ⚠️ 安全要点：
 * - 必须验证 Stripe 签名
 * - 使用 Service Role Key 更新数据库
 * - 记录所有订阅状态变化
 */

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const supabase = getSupabaseAdmin();

    // 1. 验证 Stripe 签名
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('[Webhook] 缺少 stripe-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('[Webhook] 签名验证失败:', err.message);
      return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
    }

    console.log(`[Webhook] 收到事件: ${event.type}`);

    // 2. 处理订阅相关事件
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // 只处理订阅类型的 checkout
        if (session.mode === 'subscription' && session.metadata?.type === 'whitelabel_subscription') {
          const guideId = session.metadata.guide_id;
          const subscriptionId = session.subscription as string;

          console.log(`[Webhook] Checkout 完成 - 导游: ${guideId}, 订阅: ${subscriptionId}`);

          // 更新导游的订阅状态
          const { error: updateError } = await supabase
            .from('guides')
            .update({
              subscription_id: subscriptionId,
              subscription_status: 'active',
              subscription_current_period_end: null, // 将在 subscription.updated 事件中更新
              updated_at: new Date().toISOString(),
            })
            .eq('id', guideId);

          if (updateError) {
            console.error('[Webhook] 更新导游订阅状态失败:', updateError);
            logError(normalizeError(updateError), {
              path: '/api/stripe/webhook-subscription',
              context: `event: ${event.type}, guideId: ${guideId}`,
            });
          } else {
            console.log(`[Webhook] 导游 ${guideId} 订阅状态已更新为 active`);
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        // 只处理白标订阅
        if (subscription.metadata?.type === 'whitelabel_subscription') {
          const guideId = subscription.metadata.guide_id;
          const status = subscription.status; // active, past_due, canceled, etc.
          // TypeScript 类型问题：使用 any 断言访问 current_period_end
          const periodEnd = (subscription as any).current_period_end as number | undefined;
          const currentPeriodEnd = periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : new Date().toISOString();

          console.log(`[Webhook] 订阅更新 - 导游: ${guideId}, 状态: ${status}`);

          // 映射 Stripe 订阅状态到我们的枚举
          let dbStatus: 'active' | 'inactive' | 'past_due' | 'canceled';
          switch (status) {
            case 'active':
              dbStatus = 'active';
              break;
            case 'past_due':
              dbStatus = 'past_due';
              break;
            case 'canceled':
            case 'unpaid':
              dbStatus = 'canceled';
              break;
            default:
              dbStatus = 'inactive';
          }

          const { error: updateError } = await supabase
            .from('guides')
            .update({
              subscription_id: subscription.id,
              subscription_status: dbStatus,
              subscription_current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString(),
            })
            .eq('id', guideId);

          if (updateError) {
            console.error('[Webhook] 更新导游订阅状态失败:', updateError);
            logError(normalizeError(updateError), {
              path: '/api/stripe/webhook-subscription',
              method: 'POST',
              context: 'subscription_update',
              event_type: event.type,
              guide_id: guideId,
              subscription_status: status,
            });
          } else {
            console.log(`[Webhook] 导游 ${guideId} 订阅状态已更新为 ${dbStatus}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.metadata?.type === 'whitelabel_subscription') {
          const guideId = subscription.metadata.guide_id;

          console.log(`[Webhook] 订阅取消 - 导游: ${guideId}`);

          const { error: updateError } = await supabase
            .from('guides')
            .update({
              subscription_status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', guideId);

          if (updateError) {
            console.error('[Webhook] 更新导游订阅状态失败:', updateError);
            logError(normalizeError(updateError), {
              path: '/api/stripe/webhook-subscription',
              context: `event: ${event.type}, guideId: ${guideId}`,
            });
          } else {
            console.log(`[Webhook] 导游 ${guideId} 订阅已取消`);
          }
        }
        break;
      }

      default:
        console.log(`[Webhook] 未处理的事件类型: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    console.error('[Webhook] 处理失败:', apiError);
    logError(apiError, { path: '/api/stripe/webhook-subscription', method: 'POST' });
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
