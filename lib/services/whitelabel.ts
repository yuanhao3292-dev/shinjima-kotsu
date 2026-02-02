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
      subscription_tier,
      subscription_end_date,
      whitelabel_views,
      whitelabel_conversions,
      commission_tier_code
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
      commission_tier_code
    `
    )
    .eq("id", guideId)
    .single();

  if (error || !data) {
    return null;
  }

  const isPartner = data.subscription_tier === "partner";
  const commissionRate = isPartner ? 0.20 : 0.10;

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

// ============================================
// 白标分销系统服务函数
// ============================================

export interface GuideDistributionPage {
  guide: {
    id: string;
    name: string;
    brandName: string | null;
    brandLogoUrl: string | null;
    brandColor: string;
    contactWechat: string | null;
    contactLine: string | null;
    contactDisplayPhone: string | null;
    email: string | null;
  };
  config: {
    id: string;
    slug: string;
    isPublished: boolean;
    bioTemplateId: string | null;
    vehicleTemplateId: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  };
  selectedModules: Array<{
    id: string;
    moduleId: string;
    module: {
      id: string;
      category: string;
      moduleType: string;
      name: string;
      description: string | null;
      thumbnailUrl: string | null;
      commissionRate: number;
      componentKey: string | null;
    };
  }>;
  selectedVehicles: Array<{
    id: string;
    vehicleId: string;
    vehicle: {
      id: string;
      name: string;
      vehicleType: string;
      seats: number;
      description: string | null;
      images: string[] | null;
      features: string[] | null;
    };
  }>;
}

/**
 * 获取导游分销页面完整数据（用于渲染 /g/[slug]）
 *
 * 数据源:
 * - guide_white_label: 页面配置（slug, 模板, SEO, 联系方式）
 * - guides: 核心身份（name, 订阅状态）+ 品牌展示（brand_name 等）
 * - guide_selected_modules: 已选模块（通过 guide_id 关联）
 * - guide_selected_vehicles: 已选车辆（通过 guide_id 关联）
 */
export async function getGuideDistributionPage(
  slug: string
): Promise<GuideDistributionPage | null> {
  const supabase = getServiceClient();

  // 1. 从 guide_white_label 获取页面配置
  const { data: config, error: configError } = await supabase
    .from("guide_white_label")
    .select(
      `
      id,
      guide_id,
      slug,
      is_published,
      bio_template_id,
      vehicle_template_id,
      site_title,
      site_description,
      display_name,
      avatar_url,
      theme_color,
      contact_wechat,
      contact_line,
      contact_phone,
      contact_email
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (configError || !config) {
    return null;
  }

  // 2. 从 guides 获取核心信息（name, 订阅状态, 品牌展示）
  const { data: guide, error: guideError } = await supabase
    .from("guides")
    .select(
      `
      id,
      name,
      brand_name,
      brand_logo_url,
      brand_color,
      contact_wechat,
      contact_line,
      contact_display_phone,
      email,
      subscription_status
    `
    )
    .eq("id", config.guide_id)
    .eq("status", "approved")
    .single();

  if (guideError || !guide) {
    return null;
  }

  // 检查订阅状态
  if (guide.subscription_status !== "active") {
    return null;
  }

  // 3. 并行获取已选模块和已选车辆（通过 guide_id 关联）
  const [modulesResult, vehiclesResult] = await Promise.all([
    supabase
      .from("guide_selected_modules")
      .select(
        `
        id,
        module_id,
        is_enabled,
        sort_order,
        page_modules (
          id,
          category,
          name,
          description,
          thumbnail_url,
          commission_rate,
          component_key
        )
      `
      )
      .eq("guide_id", guide.id)
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("guide_selected_vehicles")
      .select(
        `
        id,
        vehicle_id,
        is_enabled,
        sort_order,
        vehicle_library (
          id,
          name,
          vehicle_type,
          seats,
          description,
          images,
          features
        )
      `
      )
      .eq("guide_id", guide.id)
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true }),
  ]);

  // 转换模块数据
  const selectedModules = (modulesResult.data || [])
    .filter((m: Record<string, unknown>) => m.page_modules)
    .map((m: Record<string, unknown>) => {
      const mod = m.page_modules as Record<string, unknown>;
      return {
        id: m.id as string,
        moduleId: m.module_id as string,
        module: {
          id: mod.id as string,
          category: mod.category as string,
          moduleType: mod.category as string, // category 即 moduleType
          name: mod.name as string,
          description: mod.description as string | null,
          thumbnailUrl: mod.thumbnail_url as string | null,
          commissionRate: mod.commission_rate as number,
          componentKey: (mod.component_key as string | null) || null,
        },
      };
    });

  // 转换车辆数据
  const selectedVehicles = (vehiclesResult.data || [])
    .filter((v: Record<string, unknown>) => v.vehicle_library)
    .map((v: Record<string, unknown>) => {
      const veh = v.vehicle_library as Record<string, unknown>;
      return {
        id: v.id as string,
        vehicleId: v.vehicle_id as string,
        vehicle: {
          id: veh.id as string,
          name: veh.name as string,
          vehicleType: veh.vehicle_type as string,
          seats: veh.seats as number,
          description: veh.description as string | null,
          images: veh.images as string[] | null,
          features: veh.features as string[] | null,
        },
      };
    });

  // 合并数据源：guide_white_label 联系方式优先，fallback 到 guides 表
  return {
    guide: {
      id: guide.id,
      name: guide.name,
      brandName: config.display_name || guide.brand_name,
      brandLogoUrl: config.avatar_url || guide.brand_logo_url,
      brandColor: config.theme_color || guide.brand_color || "#2563eb",
      contactWechat: config.contact_wechat || guide.contact_wechat,
      contactLine: config.contact_line || guide.contact_line,
      contactDisplayPhone: config.contact_phone || guide.contact_display_phone,
      email: config.contact_email || guide.email,
    },
    config: {
      id: config.id,
      slug: config.slug,
      isPublished: config.is_published,
      bioTemplateId: config.bio_template_id,
      vehicleTemplateId: config.vehicle_template_id,
      seoTitle: config.site_title,
      seoDescription: config.site_description,
    },
    selectedModules,
    selectedVehicles,
  };
}
