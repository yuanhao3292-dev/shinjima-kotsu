import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { WHITELABEL_COOKIE_NAME, isValidSlug } from "@/lib/whitelabel-config";

// 速率限制配置
const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1分钟窗口
  MAX_REQUESTS: 30, // 每分钟最多30次请求
};

// 简单的内存速率限制（生产环境应使用 Redis）
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(sessionId);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(sessionId, { count: 1, resetAt: now + RATE_LIMIT.WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT.MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// 定期清理过期记录（每5分钟）
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

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

// 记录页面访问
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();

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

    // 速率限制检查
    if (sessionId && !checkRateLimit(sessionId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
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

// 获取导游统计数据
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();

    const { searchParams } = new URL(request.url);
    const guideId = searchParams.get("guideId");

    if (!guideId) {
      return NextResponse.json(
        { error: "Missing guideId" },
        { status: 400 }
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
    const { data: guide } = await supabase
      .from("guides")
      .select("whitelabel_views, whitelabel_conversions")
      .eq("id", guideId)
      .single();

    return NextResponse.json({
      todayViews: todayViews || 0,
      weekViews: weekViews || 0,
      monthOrders: monthOrders || 0,
      totalViews: guide?.whitelabel_views || 0,
      totalConversions: guide?.whitelabel_conversions || 0,
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
