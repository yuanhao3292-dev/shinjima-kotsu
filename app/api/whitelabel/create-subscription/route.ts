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

// 白标订阅价格 ID（需要在 Stripe Dashboard 创建）
const WHITELABEL_PRICE_ID = process.env.STRIPE_WHITELABEL_PRICE_ID;
const WHITELABEL_MONTHLY_PRICE = 1980; // 日元

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查（支付敏感端点）
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(
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

    // 获取导游信息
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("id, name, email, phone, stripe_customer_id")
      .eq("id", guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json(
        { error: "Guide not found" },
        { status: 404 }
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

    // 创建 Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: WHITELABEL_PRICE_ID
        ? [
            {
              price: WHITELABEL_PRICE_ID,
              quantity: 1,
            },
          ]
        : [
            {
              price_data: {
                currency: "jpy",
                product_data: {
                  name: "白标页面订阅 - 月度",
                  description: "每月 ¥1,980，享受专属白标页面服务",
                },
                unit_amount: WHITELABEL_MONTHLY_PRICE,
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
