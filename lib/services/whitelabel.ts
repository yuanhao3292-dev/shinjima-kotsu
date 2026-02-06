import { createClient } from "@supabase/supabase-js";
import { GuideWhiteLabelConfig } from "@/lib/types/whitelabel";
import { DEFAULT_SELECTED_PAGES } from "@/lib/whitelabel-pages";

// 服务端 Supabase 客户端
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * 根据 slug 获取导游白标配置
 */
export async function getGuideBySlug(
  slug: string
): Promise<GuideWhiteLabelConfig | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("guides")
    .select(
      `
      id,
      slug,
      name,
      brand_name,
      brand_logo_url,
      brand_color,
      contact_wechat,
      contact_line,
      contact_display_phone,
      email,
      subscription_status,
      subscription_plan,
      subscription_tier,
      subscription_end_date,
      whitelabel_views,
      whitelabel_conversions,
      commission_tier_code,
      selected_pages
    `
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (error || !data) {
    return null;
  }

  const isPartner = data.subscription_tier === "partner";
  const commissionRate = isPartner ? 0.20 : 0.10;

  // 解析 selected_pages
  let selectedPages: string[] = DEFAULT_SELECTED_PAGES;
  if (data.selected_pages) {
    try {
      const parsed =
        typeof data.selected_pages === "string"
          ? JSON.parse(data.selected_pages)
          : data.selected_pages;
      if (Array.isArray(parsed) && parsed.length > 0) {
        selectedPages = parsed;
      }
    } catch {
      // 解析失败，使用默认值
    }
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    brandName: data.brand_name,
    brandLogoUrl: data.brand_logo_url,
    brandColor: data.brand_color || "#2563eb",
    contactWechat: data.contact_wechat,
    contactLine: data.contact_line,
    contactDisplayPhone: data.contact_display_phone,
    email: data.email,
    subscriptionStatus: data.subscription_status || "inactive",
    subscriptionPlan: data.subscription_plan || "none",
    subscriptionTier: data.subscription_tier || "growth",
    subscriptionEndDate: data.subscription_end_date,
    commissionRate,
    commissionType: isPartner ? "fixed" : "tiered",
    whiteLabelViews: data.whitelabel_views || 0,
    whiteLabelConversions: data.whitelabel_conversions || 0,
    selectedPages,
  };
}

/**
 * 根据导游 ID 获取白标配置
 */
export async function getGuideById(
  guideId: string
): Promise<GuideWhiteLabelConfig | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("guides")
    .select(
      `
      id,
      slug,
      name,
      brand_name,
      brand_logo_url,
      brand_color,
      contact_wechat,
      contact_line,
      contact_display_phone,
      email,
      subscription_status,
      subscription_plan,
      subscription_tier,
      subscription_end_date,
      whitelabel_views,
      whitelabel_conversions,
      commission_tier_code,
      selected_pages
    `
    )
    .eq("id", guideId)
    .single();

  if (error || !data) {
    return null;
  }

  const isPartner = data.subscription_tier === "partner";
  const commissionRate = isPartner ? 0.20 : 0.10;

  // 解析 selected_pages
  let selectedPages: string[] = DEFAULT_SELECTED_PAGES;
  if (data.selected_pages) {
    try {
      const parsed =
        typeof data.selected_pages === "string"
          ? JSON.parse(data.selected_pages)
          : data.selected_pages;
      if (Array.isArray(parsed) && parsed.length > 0) {
        selectedPages = parsed;
      }
    } catch {
      // 解析失败，使用默认值
    }
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    brandName: data.brand_name,
    brandLogoUrl: data.brand_logo_url,
    brandColor: data.brand_color || "#2563eb",
    contactWechat: data.contact_wechat,
    contactLine: data.contact_line,
    contactDisplayPhone: data.contact_display_phone,
    email: data.email,
    subscriptionStatus: data.subscription_status || "inactive",
    subscriptionPlan: data.subscription_plan || "none",
    subscriptionTier: data.subscription_tier || "growth",
    subscriptionEndDate: data.subscription_end_date,
    commissionRate,
    commissionType: isPartner ? "fixed" : "tiered",
    whiteLabelViews: data.whitelabel_views || 0,
    whiteLabelConversions: data.whitelabel_conversions || 0,
    selectedPages,
  };
}

/**
 * 更新导游白标设置
 */
export async function updateGuideWhiteLabelSettings(
  guideId: string,
  settings: Partial<{
    slug: string;
    brandName: string;
    brandLogoUrl: string;
    brandColor: string;
    contactWechat: string;
    contactLine: string;
    contactDisplayPhone: string;
    contactEmail: string;
    selectedPages: string[];
  }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (settings.slug !== undefined) updateData.slug = settings.slug;
  if (settings.brandName !== undefined)
    updateData.brand_name = settings.brandName;
  if (settings.brandLogoUrl !== undefined)
    updateData.brand_logo_url = settings.brandLogoUrl;
  if (settings.brandColor !== undefined)
    updateData.brand_color = settings.brandColor;
  if (settings.contactWechat !== undefined)
    updateData.contact_wechat = settings.contactWechat;
  if (settings.contactLine !== undefined)
    updateData.contact_line = settings.contactLine;
  if (settings.contactDisplayPhone !== undefined)
    updateData.contact_display_phone = settings.contactDisplayPhone;
  if (settings.contactEmail !== undefined)
    updateData.email = settings.contactEmail;
  if (settings.selectedPages !== undefined)
    updateData.selected_pages = settings.selectedPages;

  const { error } = await supabase
    .from("guides")
    .update(updateData)
    .eq("id", guideId);

  if (error) {
    console.error("[updateGuideWhiteLabelSettings] Error:", error);
    if (error.code === "23505") {
      return { success: false, error: "slug_conflict" };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 记录白标页面访问
 */
export async function trackPageView(
  guideId: string,
  pageData: {
    pagePath: string;
    referrer?: string;
    userAgent?: string;
    sessionId?: string;
    country?: string;
    city?: string;
  }
): Promise<void> {
  const supabase = getServiceClient();

  await supabase.from("whitelabel_page_views").insert({
    guide_id: guideId,
    page_path: pageData.pagePath,
    referrer: pageData.referrer,
    user_agent: pageData.userAgent,
    session_id: pageData.sessionId,
    country: pageData.country,
    city: pageData.city,
  });
}
