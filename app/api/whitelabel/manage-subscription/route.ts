import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/api";
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { getStripeServer as getStripe } from '@/lib/stripe-server';

// 验证 returnUrl 必须是同域
const ALLOWED_HOSTS = ['niijima-koutsu.jp', 'www.niijima-koutsu.jp', 'localhost:3000'];

function isValidReturnUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_HOSTS.some(host => parsed.host === host || parsed.host.endsWith('.' + host));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 速率限制
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/whitelabel/manage-subscription`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const stripe = getStripe();
    const supabase = getSupabaseAdmin();

    const { guideId, returnUrl } = await request.json();

    if (!guideId) {
      return NextResponse.json({ error: "Missing guideId" }, { status: 400 });
    }

    // 身份验证：使用 Supabase SSR 客户端正确解析 chunked cookies
    const serverSupabase = await createServerClient();
    const { data: { user }, error: authError } = await serverSupabase.auth.getUser();
    const currentUserId = (!authError && user) ? user.id : null;

    // 获取导游信息（包含 auth_user_id 用于验证）
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("stripe_customer_id, auth_user_id")
      .eq("id", guideId)
      .single();

    if (guideError || !guide?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // 权限验证：确保当前用户是该导游
    if (!currentUserId || guide.auth_user_id !== currentUserId) {
      console.warn(`[manage-subscription] 权限拒绝 - 用户 ${currentUserId} 尝试访问导游 ${guideId}`);
      return createErrorResponse(Errors.forbidden('无权限管理此订阅'));
    }

    // 验证 returnUrl
    const safeReturnUrl = (returnUrl && isValidReturnUrl(returnUrl))
      ? returnUrl
      : `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/whitelabel`;

    // 创建 Customer Portal Session
    const session = await stripe.billingPortal.sessions.create({
      customer: guide.stripe_customer_id,
      return_url: safeReturnUrl,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/whitelabel/manage-subscription', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
