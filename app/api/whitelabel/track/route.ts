import { NextRequest, NextResponse } from "next/server";
import { WHITELABEL_COOKIE_NAME, isValidSlug } from "@/lib/whitelabel-config";
import { getSupabaseAdmin } from "@/lib/supabase/api";
import { createClient as createServerClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
  createRateLimitHeaders,
} from "@/lib/utils/rate-limiter";

// 记录页面访问
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    // 从 Cookie 获取导游 slug
    const guideSlug = request.cookies.get(WHITELABEL_COOKIE_NAME)?.value;

    if (!guideSlug) {
      return NextResponse.json(
        { error: "No guide context" },
        { status: 400 }
      );
    }

    // 验证 slug 格式
    if (!isValidSlug(guideSlug)) {
      console.warn(`[Track] Invalid slug format: ${guideSlug.substring(0, 20)}`);
      return NextResponse.json(
        { error: "Invalid guide context" },
        { status: 400 }
      );
    }

    // 获取导游 ID
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("id, subscription_status")
      .eq("slug", guideSlug)
      .single();

    if (guideError || !guide) {
      return NextResponse.json(
        { error: "Guide not found" },
        { status: 404 }
      );
    }

    // 只为有效订阅的导游记录统计
    if (guide.subscription_status !== "active") {
      return NextResponse.json({ tracked: false, reason: "inactive_subscription" });
    }

    const body = await request.json();
    const { pagePath, sessionId } = body;

    // 速率限制检查（使用 sessionId 或 IP 地址）
    const rateLimitKey = sessionId
      ? `session:${sessionId}:/api/whitelabel/track`
      : `${getClientIp(request)}:/api/whitelabel/track`;
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.standard);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // 获取请求信息
    const userAgent = request.headers.get("user-agent") || undefined;
    const referer = request.headers.get("referer") || undefined;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || undefined;

    // 记录页面访问
    const { error: insertError } = await supabase
      .from("whitelabel_page_views")
      .insert({
        guide_id: guide.id,
        page_path: pagePath,
        referrer: referer,
        user_agent: userAgent,
        session_id: sessionId,
        ip_address: ipAddress,
      });

    if (insertError) {
      console.error("Failed to record page view:", insertError);
      return NextResponse.json(
        { error: "Failed to record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tracked: true });
  } catch (error: unknown) {
    console.error("Track error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to track: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// 获取导游统计数据（需要身份验证）
export async function GET(request: NextRequest) {
  try {
    // 1. 验证用户身份
    const serverSupabase = await createServerClient();
    const { data: { user }, error: authError } = await serverSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "未登录或登录已过期" },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { searchParams } = new URL(request.url);
    const guideId = searchParams.get("guideId");

    if (!guideId) {
      return NextResponse.json(
        { error: "Missing guideId" },
        { status: 400 }
      );
    }

    // 2. 验证请求的 guideId 属于当前登录用户
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("id, auth_user_id")
      .eq("id", guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json(
        { error: "导游不存在" },
        { status: 404 }
      );
    }

    // 确保只能查询自己的数据
    if (guide.auth_user_id !== user.id) {
      return NextResponse.json(
        { error: "无权访问该数据" },
        { status: 403 }
      );
    }

    // 获取今日访问量
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: todayViews } = await supabase
      .from("whitelabel_page_views")
      .select("id", { count: "exact" })
      .eq("guide_id", guideId)
      .gte("viewed_at", today.toISOString());

    // 获取本周访问量
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count: weekViews } = await supabase
      .from("whitelabel_page_views")
      .select("id", { count: "exact" })
      .eq("guide_id", guideId)
      .gte("viewed_at", weekAgo.toISOString());

    // 获取本月订单数
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const { count: monthOrders } = await supabase
      .from("whitelabel_orders")
      .select("id", { count: "exact" })
      .eq("guide_id", guideId)
      .gte("created_at", monthAgo.toISOString());

    // 获取累计数据
    const { data: guideStats } = await supabase
      .from("guides")
      .select("whitelabel_views, whitelabel_conversions")
      .eq("id", guideId)
      .single();

    return NextResponse.json({
      todayViews: todayViews || 0,
      weekViews: weekViews || 0,
      monthOrders: monthOrders || 0,
      totalViews: guideStats?.whitelabel_views || 0,
      totalConversions: guideStats?.whitelabel_conversions || 0,
    });
  } catch (error: unknown) {
    console.error("Stats error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to get stats: ${errorMessage}` },
      { status: 500 }
    );
  }
}
