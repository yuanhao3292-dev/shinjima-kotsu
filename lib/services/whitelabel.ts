import { createClient } from "@supabase/supabase-js";
import { GuideWhiteLabelConfig } from "@/lib/types/whitelabel";

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
      subscription_end_date,
      whitelabel_views,
      whitelabel_conversions
    `
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (error || !data) {
    return null;
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
    subscriptionEndDate: data.subscription_end_date,
    whiteLabelViews: data.whitelabel_views || 0,
    whiteLabelConversions: data.whitelabel_conversions || 0,
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
      subscription_end_date,
      whitelabel_views,
      whitelabel_conversions
    `
    )
    .eq("id", guideId)
    .single();

  if (error || !data) {
    return null;
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
    subscriptionEndDate: data.subscription_end_date,
    whiteLabelViews: data.whitelabel_views || 0,
    whiteLabelConversions: data.whitelabel_conversions || 0,
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
  }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, string | undefined> = {};

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

  const { error } = await supabase
    .from("guides")
    .update(updateData)
    .eq("id", guideId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 记录白标页面访问
 */
export async function recordPageView(
  guideId: string,
  data: {
    pagePath: string;
    referrer?: string;
    userAgent?: string;
    sessionId?: string;
    ipAddress?: string;
  }
): Promise<void> {
  const supabase = getServiceClient();

  await supabase.from("whitelabel_page_views").insert({
    guide_id: guideId,
    page_path: data.pagePath,
    referrer: data.referrer,
    user_agent: data.userAgent,
    session_id: data.sessionId,
    ip_address: data.ipAddress,
  });
}

/**
 * 创建白标订单归属
 */
export async function createWhiteLabelOrder(
  guideId: string,
  data: {
    orderType: "medical" | "treatment" | "golf" | "business" | "nightclub";
    customerSessionId: string;
    orderAmount?: number;
  }
): Promise<string | null> {
  const supabase = getServiceClient();

  const { data: order, error } = await supabase
    .from("whitelabel_orders")
    .insert({
      guide_id: guideId,
      order_type: data.orderType,
      customer_session_id: data.customerSessionId,
      order_amount: data.orderAmount,
      status: "lead",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating whitelabel order:", error);
    return null;
  }

  return order?.id || null;
}

/**
 * 更新导游订阅状态（由 Stripe webhook 调用）
 */
export async function updateGuideSubscription(
  stripeCustomerId: string,
  data: {
    subscriptionId?: string;
    status: "active" | "cancelled" | "past_due" | "inactive";
    endDate?: string;
  }
): Promise<boolean> {
  const supabase = getServiceClient();

  const updateData: Record<string, string | undefined> = {
    subscription_status: data.status,
  };

  if (data.subscriptionId) {
    updateData.stripe_subscription_id = data.subscriptionId;
  }
  if (data.endDate) {
    updateData.subscription_end_date = data.endDate;
  }
  if (data.status === "active") {
    updateData.subscription_plan = "monthly";
    updateData.subscription_start_date = new Date().toISOString();
  }

  const { error } = await supabase
    .from("guides")
    .update(updateData)
    .eq("stripe_customer_id", stripeCustomerId);

  return !error;
}

/**
 * 检查 slug 是否可用
 */
export async function isSlugAvailable(
  slug: string,
  excludeGuideId?: string
): Promise<boolean> {
  const supabase = getServiceClient();

  let query = supabase
    .from("guides")
    .select("id")
    .eq("slug", slug.toLowerCase());

  if (excludeGuideId) {
    query = query.neq("id", excludeGuideId);
  }

  const { data } = await query;

  return !data || data.length === 0;
}
