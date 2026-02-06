import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/api";
import { validateBody } from "@/lib/validations/validate";
import { WhitelabelSettingsSchema } from "@/lib/validations/api-schemas";
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
import { DEFAULT_SELECTED_PAGES } from "@/lib/whitelabel-pages";

/**
 * GET - 获取当前导游的白标设置
 */
export async function GET(request: NextRequest) {
  try {
    // 1. 验证用户身份
    const serverSupabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await serverSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "未登录或登录已过期" },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 2. 获取导游白标设置
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select(
        `
        id, name, slug, brand_name, brand_logo_url, brand_color,
        contact_wechat, contact_line, contact_display_phone, email,
        subscription_status, subscription_plan, subscription_end_date,
        whitelabel_views, whitelabel_conversions, selected_pages
      `
      )
      .eq("auth_user_id", user.id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: "导游信息不存在" }, { status: 404 });
    }

    // 解析 selected_pages，如果为空则使用默认值
    let selectedPages: string[] = DEFAULT_SELECTED_PAGES;
    if (guide.selected_pages) {
      try {
        const parsed = typeof guide.selected_pages === 'string'
          ? JSON.parse(guide.selected_pages)
          : guide.selected_pages;
        if (Array.isArray(parsed) && parsed.length > 0) {
          selectedPages = parsed;
        }
      } catch {
        // 解析失败，使用默认值
      }
    }

    return NextResponse.json({
      id: guide.id,
      name: guide.name,
      slug: guide.slug,
      brandName: guide.brand_name,
      brandLogoUrl: guide.brand_logo_url,
      brandColor: guide.brand_color || "#2563eb",
      contactWechat: guide.contact_wechat,
      contactLine: guide.contact_line,
      contactDisplayPhone: guide.contact_display_phone,
      email: guide.email,
      subscriptionStatus: guide.subscription_status || "inactive",
      subscriptionPlan: guide.subscription_plan,
      subscriptionEndDate: guide.subscription_end_date,
      whiteLabelViews: guide.whitelabel_views || 0,
      whiteLabelConversions: guide.whitelabel_conversions || 0,
      selectedPages,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: "/api/whitelabel/settings", method: "GET" });
    return createErrorResponse(apiError);
  }
}

/**
 * PUT - 更新导游的白标设置
 */
export async function PUT(request: NextRequest) {
  try {
    // 1. 速率限制检查
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(
      `${clientIp}:/api/whitelabel/settings`,
      RATE_LIMITS.standard
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    // 2. 验证用户身份
    const serverSupabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await serverSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "未登录或登录已过期" },
        { status: 401 }
      );
    }

    // 3. 验证请求体
    const validation = await validateBody(request, WhitelabelSettingsSchema);
    if (!validation.success) return validation.error;
    const settings = validation.data;

    const supabase = getSupabaseAdmin();

    // 4. 获取当前导游信息
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("id, subscription_status")
      .eq("auth_user_id", user.id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: "导游信息不存在" }, { status: 404 });
    }

    // 5. 检查订阅状态（只有订阅用户才能修改设置）
    if (guide.subscription_status !== "active") {
      return NextResponse.json(
        { error: "请先订阅白标服务" },
        { status: 403 }
      );
    }

    // 6. 如果要更新 slug，检查是否已被占用
    if (settings.slug) {
      const { data: existingGuide } = await supabase
        .from("guides")
        .select("id")
        .eq("slug", settings.slug.toLowerCase())
        .neq("id", guide.id)
        .single();

      if (existingGuide) {
        return NextResponse.json(
          { error: "此 URL 标识已被使用，请选择其他名称" },
          { status: 409 }
        );
      }
    }

    // 7. 构建更新数据
    const updateData: Record<string, string | string[] | null | undefined> = {
      updated_at: new Date().toISOString(),
    };

    if (settings.slug !== undefined) {
      updateData.slug = settings.slug ? settings.slug.toLowerCase() : null;
    }
    if (settings.brandName !== undefined) {
      updateData.brand_name = settings.brandName || null;
    }
    if (settings.brandLogoUrl !== undefined) {
      updateData.brand_logo_url = settings.brandLogoUrl || null;
    }
    if (settings.brandColor !== undefined) {
      updateData.brand_color = settings.brandColor;
    }
    if (settings.contactWechat !== undefined) {
      updateData.contact_wechat = settings.contactWechat || null;
    }
    if (settings.contactLine !== undefined) {
      updateData.contact_line = settings.contactLine || null;
    }
    if (settings.contactDisplayPhone !== undefined) {
      updateData.contact_display_phone = settings.contactDisplayPhone || null;
    }
    // 更新选择的商城页面
    if (settings.selectedPages !== undefined) {
      updateData.selected_pages = settings.selectedPages;
    }

    // 8. 执行更新
    const { error: updateError } = await supabase
      .from("guides")
      .update(updateData)
      .eq("id", guide.id);

    if (updateError) {
      console.error("Failed to update whitelabel settings:", updateError);
      return NextResponse.json(
        { error: "保存失败，请稍后重试" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "设置已保存",
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: "/api/whitelabel/settings", method: "PUT" });
    return createErrorResponse(apiError);
  }
}
