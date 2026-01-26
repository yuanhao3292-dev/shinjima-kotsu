import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { normalizeError, logError } from '@/lib/utils/api-errors';
import { sendWhitelabelSubscriptionEmail } from '@/lib/email';

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

    // ⚠️ 检查 Webhook Secret 配置
    if (!WEBHOOK_SECRET) {
      console.error('[Webhook] ⚠️ STRIPE_WEBHOOK_SECRET 未配置！Webhook 将无法验证签名');
      logError(normalizeError(new Error('STRIPE_WEBHOOK_SECRET is not configured')), {
        path: '/api/stripe/webhook-subscription',
        method: 'POST',
      });
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

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
      console.log('[Webhook] ✅ 签名验证通过');
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
          console.log(`[Webhook] Session metadata:`, JSON.stringify(session.metadata));

          if (!guideId) {
            console.error('[Webhook] ⚠️ guide_id 为空！无法更新订阅状态');
            logError(normalizeError(new Error('guide_id is empty in webhook metadata')), {
              path: '/api/stripe/webhook-subscription',
              context: `event: ${event.type}, session_id: ${session.id}`,
            });
            break;
          }

          // 先检查导游是否存在
          const { data: existingGuide, error: findError } = await supabase
            .from('guides')
            .select('id, name, subscription_status')
            .eq('id', guideId)
            .single();

          if (findError || !existingGuide) {
            console.error(`[Webhook] ⚠️ 导游 ${guideId} 不存在！`, findError);
            logError(normalizeError(findError || new Error('Guide not found')), {
              path: '/api/stripe/webhook-subscription',
              context: `event: ${event.type}, guideId: ${guideId}`,
            });
            break;
          }

          console.log(`[Webhook] 找到导游: ${existingGuide.name}, 当前状态: ${existingGuide.subscription_status}`);

          // 更新导游的订阅状态
          const { data: updatedGuide, error: updateError } = await supabase
            .from('guides')
            .update({
              subscription_id: subscriptionId,
              subscription_status: 'active',
              subscription_current_period_end: null, // 将在 subscription.updated 事件中更新
              updated_at: new Date().toISOString(),
            })
            .eq('id', guideId)
            .select('id, name, subscription_status')
            .single();

          if (updateError) {
            console.error('[Webhook] 更新导游订阅状态失败:', updateError);
            logError(normalizeError(updateError), {
              path: '/api/stripe/webhook-subscription',
              context: `event: ${event.type}, guideId: ${guideId}`,
            });
          } else if (!updatedGuide) {
            console.error(`[Webhook] ⚠️ 更新返回空数据，可能未匹配到导游 ${guideId}`);
            logError(normalizeError(new Error('Update returned no data')), {
              path: '/api/stripe/webhook-subscription',
              context: `event: ${event.type}, guideId: ${guideId}`,
            });
          } else {
            console.log(`[Webhook] ✅ 导游 ${updatedGuide.name} (${guideId}) 订阅状态已更新为 ${updatedGuide.subscription_status}`);

            // 获取导游信息并发送订阅成功邮件
            const { data: guideData } = await supabase
              .from('guides')
              .select('name, email, slug')
              .eq('id', guideId)
              .single();

            if (guideData?.email) {
              const whitelabelUrl = guideData.slug
                ? `https://bespoketrip.jp/p/${guideData.slug}`
                : undefined;

              // 异步发送邮件，不阻塞 Webhook 响应（避免超时）
              sendWhitelabelSubscriptionEmail({
                guideEmail: guideData.email,
                guideName: guideData.name || '导游',
                subscriptionPlan: '白标页面 - 月度',
                monthlyPrice: 1980,
                whitelabelUrl,
              })
                .then(() => console.log(`[Webhook] 已发送订阅成功邮件给 ${guideData.email}`))
                .catch((err) => console.error(`[Webhook] 发送邮件失败（不影响订阅）:`, err));
            }
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
          // Stripe API 返回 current_period_end，但 SDK 类型定义可能不完整，使用类型扩展
          type SubscriptionWithPeriod = Stripe.Subscription & { current_period_end?: number };
          const periodEnd = (subscription as SubscriptionWithPeriod).current_period_end;
          const currentPeriodEnd = periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : new Date().toISOString();

          console.log(`[Webhook] 订阅更新 - 导游: ${guideId}, 状态: ${status}`);
          console.log(`[Webhook] Subscription metadata:`, JSON.stringify(subscription.metadata));

          if (!guideId) {
            console.error('[Webhook] ⚠️ guide_id 为空！无法更新订阅状态');
            break;
          }

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

          const { data: updatedGuide, error: updateError } = await supabase
            .from('guides')
            .update({
              subscription_id: subscription.id,
              subscription_status: dbStatus,
              subscription_current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString(),
            })
            .eq('id', guideId)
            .select('id, name, subscription_status')
            .single();

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
          } else if (!updatedGuide) {
            console.error(`[Webhook] ⚠️ 订阅更新未匹配到导游 ${guideId}`);
          } else {
            console.log(`[Webhook] ✅ 导游 ${updatedGuide.name} (${guideId}) 订阅状态已更新为 ${dbStatus}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.metadata?.type === 'whitelabel_subscription') {
          const guideId = subscription.metadata.guide_id;

          console.log(`[Webhook] 订阅取消 - 导游: ${guideId}`);

          if (!guideId) {
            console.error('[Webhook] ⚠️ guide_id 为空！无法更新订阅状态');
            break;
          }

          const { data: updatedGuide, error: updateError } = await supabase
            .from('guides')
            .update({
              subscription_status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', guideId)
            .select('id, name, subscription_status')
            .single();

          if (updateError) {
            console.error('[Webhook] 更新导游订阅状态失败:', updateError);
            logError(normalizeError(updateError), {
              path: '/api/stripe/webhook-subscription',
              context: `event: ${event.type}, guideId: ${guideId}`,
            });
          } else if (!updatedGuide) {
            console.error(`[Webhook] ⚠️ 取消订阅未匹配到导游 ${guideId}`);
          } else {
            console.log(`[Webhook] ✅ 导游 ${updatedGuide.name} (${guideId}) 订阅已取消`);
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
