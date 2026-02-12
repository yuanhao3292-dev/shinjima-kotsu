import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { validateBody } from '@/lib/validations/validate';
import { WhitelabelSubscriptionSchema } from '@/lib/validations/api-schemas';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getSupabase = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error("Supabase configuration is missing");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// Stripe Price IDs（需要在 Stripe Dashboard 创建）
const GROWTH_PRICE_ID = process.env.STRIPE_WHITELABEL_PRICE_ID; // 初期合伙人 ¥1,980/月
const PARTNER_PRICE_ID = process.env.STRIPE_PARTNER_MONTHLY_PRICE_ID; // 金牌合伙人 ¥4,980/月

// 按订阅等级的月费
const TIER_PRICING: Record<string, { amount: number; name: string; description: string }> = {
  growth: { amount: 1980, name: '初期合伙人 - 月度订阅', description: '每月 ¥1,980，享受10%固定分成' },
  partner: { amount: 4980, name: '金牌合伙人 - 月度订阅', description: '每月 ¥4,980，享受20%固定分成' },
};

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查（支付敏感端点）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/whitelabel/create-subscription`,
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

    // 使用 Zod Schema 验证输入
    const validation = await validateBody(request, WhitelabelSubscriptionSchema);
    if (!validation.success) return validation.error;
    const { guideId, successUrl, cancelUrl } = validation.data;

    // 获取导游信息（包含订阅状态和当前等级）
    console.log(`[create-subscription] 查询导游 ID: ${guideId}`);
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("id, name, email, phone, stripe_customer_id, subscription_status, subscription_id, subscription_tier")
      .eq("id", guideId)
      .single();

    console.log(`[create-subscription] 查询结果:`, { guide, guideError });

    if (guideError || !guide) {
      console.error(`[create-subscription] 导游未找到 - ID: ${guideId}, 错误:`, guideError);
      return NextResponse.json(
        { error: "Guide not found", guideId, dbError: guideError?.message },
        { status: 404 }
      );
    }

    // ⚠️ 重复付款防护：检查是否已有活跃订阅
    if (guide.subscription_status === 'active') {
      console.log(`[create-subscription] 导游 ${guideId} 已有活跃订阅，拒绝创建新订阅`);
      return NextResponse.json(
        { error: "您已有活跃的订阅，无需重复订阅。如需管理订阅，请使用「管理订阅」功能。" },
        { status: 400 }
      );
    }

    // 如果导游还没有 Stripe Customer ID，创建一个
    let stripeCustomerId = guide.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: guide.name,
        email: guide.email || undefined,
        phone: guide.phone || undefined,
        metadata: {
          guide_id: guide.id,
          source: "whitelabel_subscription",
        },
      });

      stripeCustomerId = customer.id;

      // 保存到数据库
      await supabase
        .from("guides")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", guideId);
    }

    // 根据导游当前等级选择价格
    const tier = (guide.subscription_tier === 'partner') ? 'partner' : 'growth';
    const pricing = TIER_PRICING[tier];
    const stripePriceId = tier === 'partner' ? PARTNER_PRICE_ID : GROWTH_PRICE_ID;

    // 创建 Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: stripePriceId
        ? [
            {
              price: stripePriceId,
              quantity: 1,
            },
          ]
        : [
            {
              price_data: {
                currency: "jpy",
                product_data: {
                  name: pricing.name,
                  description: pricing.description,
                },
                unit_amount: pricing.amount,
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            },
          ],
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/dashboard?subscription=success`,
      cancel_url:
        cancelUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/dashboard?subscription=cancelled`,
      metadata: {
        guide_id: guideId,
        type: "whitelabel_subscription",
      },
      subscription_data: {
        metadata: {
          guide_id: guideId,
          type: "whitelabel_subscription",
        },
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/whitelabel/create-subscription', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
