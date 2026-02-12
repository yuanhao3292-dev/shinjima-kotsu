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

// 合伙人入场费
const PARTNER_ENTRY_FEE = 200000; // 日元（20万）
// 合伙人月费
const PARTNER_MONTHLY_FEE = 4980; // 日元
// 合伙人月费 Stripe Price ID（需要在 Stripe Dashboard 创建）
const PARTNER_MONTHLY_PRICE_ID = process.env.STRIPE_PARTNER_MONTHLY_PRICE_ID;

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
    const { guideId, paymentMethod = "full", successUrl, cancelUrl } = body;

    if (!guideId) {
      return NextResponse.json({ error: "guideId is required" }, { status: 400 });
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

    // 检查是否已经是合伙人
    if (guide.subscription_tier === "partner") {
      return NextResponse.json(
        { error: "您已经是导游合伙人，无需重复升级" },
        { status: 400 }
      );
    }

    // 检查是否已支付入场费
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

    // 构建结账项目
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // 1. 入场费（一次性）
    lineItems.push({
      price_data: {
        currency: "jpy",
        product_data: {
          name: "导游合伙人 - 入场费",
          description: "一次性支付，终身有效。享受 20% 固定分成、优先资源对接、合伙人专属群",
        },
        unit_amount: paymentMethod === "installment"
          ? Math.ceil(PARTNER_ENTRY_FEE * 1.2 / 3) // 分期总价上浮 20%，分3期
          : PARTNER_ENTRY_FEE,
      },
      quantity: 1,
    });

    // 创建 Checkout Session（先支付入场费）
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      mode: "payment", // 一次性支付入场费
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/dashboard?partner=success`,
      cancel_url:
        cancelUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/subscription?partner=cancelled`,
      metadata: {
        guide_id: guideId,
        type: "partner_entry_fee",
        payment_method: paymentMethod,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    // 创建待处理的入场费记录
    await supabase.from("partner_entry_fees").insert({
      guide_id: guideId,
      amount: PARTNER_ENTRY_FEE,
      status: "pending",
      installment_plan: paymentMethod === "installment" ? "installment_3" : "full",
      installment_number: 1,
      total_installments: paymentMethod === "installment" ? 3 : 1,
      notes: `Checkout Session: ${session.id}`,
    });

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
