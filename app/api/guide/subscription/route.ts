import { NextRequest, NextResponse } from "next/server";
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
import type { GuideSubscriptionDetails, SubscriptionBenefits } from "@/lib/types/whitelabel";

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

/**
 * GET /api/guide/subscription?guideId=xxx
 * 获取导游订阅详情
 */
export async function GET(request: NextRequest) {
  try {
    // 速率限制
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/guide/subscription`,
      RATE_LIMITS.standard
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const { searchParams } = new URL(request.url);
    const guideId = searchParams.get("guideId");

    if (!guideId) {
      return NextResponse.json({ error: "guideId is required" }, { status: 400 });
    }

    const supabase = getSupabase();

    // 获取导游基本信息
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select(`
        id,
        subscription_tier,
        subscription_status,
        commission_tier_code
      `)
      .eq("id", guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // 获取分成比例：金牌合伙人 20%，初期合伙人 10%
    const commissionRate = guide.subscription_tier === "partner" ? 0.20 : 0.10;

    // 检查入场费是否已支付
    const { data: entryFees } = await supabase
      .from("partner_entry_fees")
      .select("status")
      .eq("guide_id", guideId)
      .eq("status", "completed");

    const entryFeePaid = (entryFees && entryFees.length > 0) || false;

    // 构建权益信息
    const benefits: SubscriptionBenefits = guide.subscription_tier === "partner"
      ? {
          whitelabel: true,
          templates: 10,
          support: "priority",
          priorityResources: true,
          partnerCertificate: true,
          partnerGroup: true,
          description: "适合有野心、有客源的导游",
        }
      : {
          whitelabel: true,
          templates: 3,
          support: "standard",
          description: "适合刚起步的导游",
        };

    const details: GuideSubscriptionDetails = {
      subscriptionTier: guide.subscription_tier || "growth",
      subscriptionStatus: guide.subscription_status || "inactive",
      commissionRate,
      commissionType: "fixed",
      monthlyFee: guide.subscription_tier === "partner" ? 4980 : 1980,
      entryFeePaid,
      entryFeeAmount: entryFeePaid ? 200000 : 0,
      benefits,
    };

    return NextResponse.json(details);
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: "/api/guide/subscription", method: "GET" });
    return createErrorResponse(apiError);
  }
}
