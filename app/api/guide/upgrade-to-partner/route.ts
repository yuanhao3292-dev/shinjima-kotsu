import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
  createRateLimitHeaders,
} from "@/lib/utils/rate-limiter";
import {
  normalizeError,
  logError,
  createErrorResponse,
  Errors,
} from "@/lib/utils/api-errors";

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

// 套餐配置
const PLANS = {
  growth: {
    name: '初期合伙人',
    monthlyFee: 1980,
    entryFee: 0,
    commission: 10,
  },
  partner: {
    name: '金牌合伙人',
    monthlyFee: 4980,
    entryFee: 200000,
    commission: 20,
  },
};

/**
 * 创建或获取 Stripe Price ID（月费订阅）
 */
async function getOrCreateStripePriceId(
  stripe: Stripe,
  planCode: 'growth' | 'partner'
): Promise<string> {
  const plan = PLANS[planCode];
  const productName = `导游合伙人 - ${plan.name}`;

  // 先尝试查找现有 Price
  const prices = await stripe.prices.list({
    active: true,
    limit: 100,
  });

  const existingPrice = prices.data.find(
    (p) =>
      p.unit_amount === plan.monthlyFee &&
      p.currency === 'jpy' &&
      p.recurring?.interval === 'month' &&
      p.metadata?.plan_code === planCode
  );

  if (existingPrice) {
    return existingPrice.id;
  }

  // 不存在，创建新 Product 和 Price
  const product = await stripe.products.create({
    name: productName,
    description: `${plan.commission}% 固定分成`,
    metadata: { plan_code: planCode },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: plan.monthlyFee,
    currency: 'jpy',
    recurring: { interval: 'month' },
    metadata: { plan_code: planCode },
  });

  return price.id;
}

/**
 * POST /api/guide/upgrade-to-partner
 * 创建合伙人升级支付（入场费 + 订阅）
 */
export async function POST(request: NextRequest) {
  try {
    // 速率限制（支付敏感端点）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/guide/upgrade-to-partner`,
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

    const body = await request.json();
    const { guideId, planCode = 'growth', successUrl, cancelUrl } = body;

    if (!guideId) {
      return NextResponse.json({ error: "guideId is required" }, { status: 400 });
    }

    if (!['growth', 'partner'].includes(planCode)) {
      return NextResponse.json({ error: "Invalid planCode" }, { status: 400 });
    }

    // 获取导游信息
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select(`
        id,
        name,
        email,
        phone,
        stripe_customer_id,
        subscription_tier,
        subscription_status
      `)
      .eq("id", guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // 检查是否已经是该等级
    if (guide.subscription_tier === planCode) {
      return NextResponse.json(
        { error: `您已经是${PLANS[planCode].name}，无需重复订阅` },
        { status: 400 }
      );
    }

    // 如果是升级到 partner，检查是否已支付入场费
    if (planCode === 'partner') {
      const { data: existingEntryFee } = await supabase
        .from("partner_entry_fees")
        .select("id, status")
        .eq("guide_id", guideId)
        .eq("status", "completed")
        .single();

      if (existingEntryFee) {
        return NextResponse.json(
          { error: "您已支付入场费，请联系客服处理" },
          { status: 400 }
        );
      }
    }

    // 创建或获取 Stripe Customer
    let stripeCustomerId = guide.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: guide.name,
        email: guide.email || undefined,
        phone: guide.phone || undefined,
        metadata: {
          guide_id: guide.id,
          source: "partner_upgrade",
        },
      });
      stripeCustomerId = customer.id;

      await supabase
        .from("guides")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", guideId);
    }

    const plan = PLANS[planCode];
    let session: Stripe.Checkout.Session;

    // ========== 根据套餐类型创建不同的支付流程 ==========
    if (planCode === 'partner') {
      // 金牌合伙人：先支付入场费（一次性支付）
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        customer: stripeCustomerId,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "jpy",
              product_data: {
                name: `${plan.name} - 入场费`,
                description: "一次性支付，终身有效（需保持月会费续订）。享受 20% 固定分成、优先资源对接、合伙人专属群",
              },
              unit_amount: plan.entryFee,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          setup_future_usage: 'off_session', // 保存支付方法供将来订阅使用
        },
        success_url:
          successUrl ||
          `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/dashboard?upgrade=success`,
        cancel_url:
          cancelUrl ||
          `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/subscription?upgrade=cancelled`,
        metadata: {
          guide_id: guideId,
          type: "partner_entry_fee",
          plan_code: planCode,
        },
      };

      session = await stripe.checkout.sessions.create(sessionParams);

      // 创建待处理的入场费记录
      await supabase.from("partner_entry_fees").insert({
        guide_id: guideId,
        amount: plan.entryFee,
        status: "pending",
        installment_plan: "full",
        installment_number: 1,
        total_installments: 1,
        notes: `Checkout Session: ${session.id}`,
      });

    } else {
      // 初期合伙人：直接创建月费订阅
      const priceId = await getOrCreateStripePriceId(stripe, planCode);

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        customer: stripeCustomerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url:
          successUrl ||
          `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/dashboard?upgrade=success`,
        cancel_url:
          cancelUrl ||
          `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/subscription?upgrade=cancelled`,
        metadata: {
          guide_id: guideId,
          type: "partner_subscription",
          plan_code: planCode,
        },
      };

      session = await stripe.checkout.sessions.create(sessionParams);
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: "/api/guide/upgrade-to-partner", method: "POST" });
    return createErrorResponse(apiError);
  }
}

/**
 * GET /api/guide/upgrade-to-partner/plans
 * 获取升级套餐对比信息
 */
export async function GET(request: NextRequest) {
  try {
    const plans = {
      growth: {
        name: "成长版",
        monthlyFee: 1980,
        entryFee: 0,
        commission: "10% 固定",
        commissionDescription: "每月1,980日币会员费，固定10%分成",
        features: [
          "白标页面基础功能",
          "3 套模板可选",
          "标准客服支持",
          "基础数据统计",
        ],
      },
      partner: {
        name: "导游合伙人",
        monthlyFee: 4980,
        entryFee: 200000,
        commission: "20% 固定",
        commissionDescription: "一次支付20万日币入场费，固定享受 20% 分成",
        features: [
          "白标页面完整功能",
          "10 套高级模板可选",
          "专属客服通道",
          "优先资源对接",
          "合伙人专属群",
          "合伙人证书",
          "年度合伙人大会邀请",
        ],
        breakEvenAnalysis: {
          medicalCheckup: {
            name: "医疗体检",
            avgAmount: 1000000,
            commissionAt20Percent: 200000,
            dealsToRecoverEntryFee: 1,
          },
          treatment: {
            name: "治疗业务",
            avgAmount: 10000000,
            commissionAt20Percent: 2000000,
            dealsToRecoverEntryFee: 0.1,
          },
          nightclub: {
            name: "夜总会",
            avgAmount: 1000000,
            commissionAt20Percent: 200000,
            dealsToRecoverEntryFee: 1,
          },
        },
      },
    };

    return NextResponse.json(plans);
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: "/api/guide/upgrade-to-partner", method: "GET" });
    return createErrorResponse(apiError);
  }
}
