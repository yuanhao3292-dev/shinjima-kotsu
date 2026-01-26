import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * 订阅状态同步 API
 *
 * POST /api/whitelabel/sync-subscription
 *
 * 当 Webhook 未触发或延迟时，用户可以手动触发同步。
 * 也可在用户付款返回后自动调用，确保状态更新。
 *
 * ⚠️ 安全：需要用户身份验证，只能同步自己的订阅状态
 */

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const supabase = getSupabaseAdmin();

    // 🔐 身份验证：从 Authorization header 获取 token
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    // 如果没有 Bearer token，尝试从 cookie 获取（浏览器直接调用场景）
    if (!userId) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        // 解析 supabase auth token from cookie
        const cookies = Object.fromEntries(
          cookieHeader.split('; ').map(c => c.split('='))
        );
        const accessToken = cookies['sb-access-token'] || cookies['supabase-auth-token'];
        if (accessToken) {
          const { data: { user } } = await supabase.auth.getUser(accessToken);
          if (user) {
            userId = user.id;
          }
        }
      }
    }

    const body = await request.json();
    const { guideId } = body;

    if (!guideId) {
      return NextResponse.json({ error: "Guide ID is required" }, { status: 400 });
    }

    // 获取导游信息（包含 auth_user_id 用于权限验证）
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("id, auth_user_id, stripe_customer_id, subscription_id, subscription_status")
      .eq("id", guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // 🔐 权限验证：只能同步自己的订阅状态
    // 如果有 userId，验证是否为该导游的所有者
    if (userId && guide.auth_user_id !== userId) {
      console.warn(`[sync-subscription] 用户 ${userId} 尝试同步非自己的导游 ${guideId}`);
      return createErrorResponse(Errors.forbidden('无权限同步此订阅'));
    }

    // 如果没有 userId（未登录），记录警告但允许操作（兼容付款回调场景）
    // 这种情况下，用户刚从 Stripe 付款页面返回，可能 session 还未完全建立
    if (!userId) {
      console.warn(`[sync-subscription] 未登录用户同步导游 ${guideId} 的订阅状态`);
    }

    // 如果没有 Stripe Customer ID，无法同步
    if (!guide.stripe_customer_id) {
      return NextResponse.json({
        synced: false,
        message: "No Stripe customer linked",
        subscription_status: guide.subscription_status,
      });
    }

    // 从 Stripe 获取该客户的活跃订阅
    console.log(`[sync-subscription] 正在从 Stripe 获取客户 ${guide.stripe_customer_id} 的订阅`);
    const subscriptions = await stripe.subscriptions.list({
      customer: guide.stripe_customer_id,
      status: 'all',
      limit: 10, // 增加限制以确保能找到
    });

    console.log(`[sync-subscription] 找到 ${subscriptions.data.length} 个订阅`);
    subscriptions.data.forEach((sub, i) => {
      console.log(`[sync-subscription] 订阅 ${i + 1}: ${sub.id}, 状态: ${sub.status}, metadata:`, sub.metadata);
    });

    // 查找白标订阅（通过 metadata 识别）
    let whitelabelSub = subscriptions.data.find(
      (sub) => sub.metadata?.type === 'whitelabel_subscription'
    );

    // 如果通过 metadata 找不到，尝试找任何活跃的订阅（兼容旧数据）
    if (!whitelabelSub) {
      whitelabelSub = subscriptions.data.find(
        (sub) => sub.status === 'active'
      );
      if (whitelabelSub) {
        console.log(`[sync-subscription] 通过 metadata 未找到，但找到活跃订阅: ${whitelabelSub.id}`);
      }
    }

    if (!whitelabelSub) {
      // 没有找到订阅，可能还在处理中
      console.log(`[sync-subscription] 导游 ${guideId} 没有找到任何订阅`);
      return NextResponse.json({
        synced: false,
        message: "No subscription found",
        subscription_status: guide.subscription_status,
        stripe_customer_id: guide.stripe_customer_id,
        subscriptions_found: subscriptions.data.length,
      });
    }

    // 映射 Stripe 订阅状态
    let dbStatus: 'active' | 'inactive' | 'past_due' | 'canceled';
    switch (whitelabelSub.status) {
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

    // 获取订阅结束日期
    // Stripe API 返回 current_period_end，但 SDK 类型定义可能不完整，使用类型扩展
    type SubscriptionWithPeriod = Stripe.Subscription & { current_period_end?: number };
    const periodEnd = (whitelabelSub as SubscriptionWithPeriod).current_period_end;
    const currentPeriodEnd = periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null;

    // 更新数据库
    console.log(`[sync-subscription] 正在更新导游 ${guideId} 的订阅状态为 ${dbStatus}`);
    const { data: updatedGuide, error: updateError } = await supabase
      .from("guides")
      .update({
        subscription_id: whitelabelSub.id,
        subscription_status: dbStatus,
        subscription_current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString(),
      })
      .eq("id", guideId)
      .select('id, name, subscription_status')
      .single();

    if (updateError) {
      console.error(`[sync-subscription] 更新失败:`, updateError);
      return NextResponse.json({ error: "Failed to update subscription status", details: updateError.message }, { status: 500 });
    }

    if (!updatedGuide) {
      console.error(`[sync-subscription] ⚠️ 更新未匹配到导游 ${guideId}`);
      return NextResponse.json({ error: "Guide not found for update" }, { status: 404 });
    }

    console.log(`[sync-subscription] ✅ 导游 ${updatedGuide.name} (${guideId}) 订阅状态同步成功: ${dbStatus}`);

    return NextResponse.json({
      synced: true,
      subscription_status: dbStatus,
      subscription_id: whitelabelSub.id,
      current_period_end: currentPeriodEnd,
    });

  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/whitelabel/sync-subscription', method: 'POST' });
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
