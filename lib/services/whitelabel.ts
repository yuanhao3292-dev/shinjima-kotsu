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

  // 计算分成比例
  const isPartner = data.subscription_tier === "partner";
  const commissionRate = isPartner ? 0.20 : 0.10; // 合伙人固定20%，成长版默认10%

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

  // 计算分成比例
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
    bioContent: Record<string, unknown> | null;
    vehicleContent: Record<string, unknown> | null;
    seoTitle: string | null;
    seoDescription: string | null;
  };
  bioTemplate: {
    id: string;
    name: string;
    templateKey: string;
    templateConfig: Record<string, unknown>;
  } | null;
  vehicleTemplate: {
    id: string;
    name: string;
    templateKey: string;
    templateConfig: Record<string, unknown>;
  } | null;
  selectedModules: Array<{
    id: string;
    moduleId: string;
    isEnabled: boolean;
    displayOrder: number;
    module: {
      id: string;
      moduleType: string;
      name: string;
      nameZh: string | null;
      description: string | null;
      descriptionZh: string | null;
      iconUrl: string | null;
      commissionRateMin: number;
      commissionRateMax: number;
      config: Record<string, unknown> | null;
    };
  }>;
  selectedVehicles: Array<{
    id: string;
    vehicleId: string;
    customName: string | null;
    customDescription: string | null;
    customImageUrl: string | null;
    isActive: boolean;
    displayOrder: number;
    vehicle: {
      id: string;
      vehicleType: string;
      brand: string;
      model: string;
      year: number | null;
      seatCapacity: number;
      luggageCapacity: number;
      imageUrl: string | null;
      features: string[];
      descriptionZh: string | null;
    };
  }>;
}

/**
 * 获取导游分销页面完整数据（用于渲染 /g/[slug]）
 */
export async function getGuideDistributionPage(
  slug: string
): Promise<GuideDistributionPage | null> {
  const supabase = getServiceClient();

  // 1. 获取白标配置
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
      bio_content,
      vehicle_content,
      seo_title,
      seo_description
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (configError || !config) {
    return null;
  }

  // 2. 获取导游基本信息
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

  // 3. 并行获取模板、已选模块、已选车辆
  const [bioTemplateResult, vehicleTemplateResult, modulesResult, vehiclesResult] =
    await Promise.all([
      config.bio_template_id
        ? supabase
            .from("page_templates")
            .select("id, name, template_key, template_config")
            .eq("id", config.bio_template_id)
            .single()
        : Promise.resolve({ data: null, error: null }),
      config.vehicle_template_id
        ? supabase
            .from("page_templates")
            .select("id, name, template_key, template_config")
            .eq("id", config.vehicle_template_id)
            .single()
        : Promise.resolve({ data: null, error: null }),
      supabase
        .from("guide_selected_modules")
        .select(
          `
          id,
          module_id,
          is_enabled,
          display_order,
          page_modules (
            id,
            module_type,
            name,
            name_zh,
            description,
            description_zh,
            icon_url,
            commission_rate_min,
            commission_rate_max,
            config
          )
        `
        )
        .eq("guide_white_label_id", config.id)
        .eq("is_enabled", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("guide_selected_vehicles")
        .select(
          `
          id,
          vehicle_id,
          custom_name,
          custom_description,
          custom_image_url,
          is_active,
          display_order,
          vehicle_library (
            id,
            vehicle_type,
            brand,
            model,
            year,
            seat_capacity,
            luggage_capacity,
            image_url,
            features,
            description_zh
          )
        `
        )
        .eq("guide_white_label_id", config.id)
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
    ]);

  // 转换数据格式
  const selectedModules = (modulesResult.data || []).map((m: Record<string, unknown>) => ({
    id: m.id as string,
    moduleId: m.module_id as string,
    isEnabled: m.is_enabled as boolean,
    displayOrder: m.display_order as number,
    module: {
      id: (m.page_modules as Record<string, unknown>)?.id as string,
      moduleType: (m.page_modules as Record<string, unknown>)?.module_type as string,
      name: (m.page_modules as Record<string, unknown>)?.name as string,
      nameZh: (m.page_modules as Record<string, unknown>)?.name_zh as string | null,
      description: (m.page_modules as Record<string, unknown>)?.description as string | null,
      descriptionZh: (m.page_modules as Record<string, unknown>)?.description_zh as string | null,
      iconUrl: (m.page_modules as Record<string, unknown>)?.icon_url as string | null,
      commissionRateMin: (m.page_modules as Record<string, unknown>)?.commission_rate_min as number,
      commissionRateMax: (m.page_modules as Record<string, unknown>)?.commission_rate_max as number,
      config: (m.page_modules as Record<string, unknown>)?.config as Record<string, unknown> | null,
    },
  }));

  const selectedVehicles = (vehiclesResult.data || []).map((v: Record<string, unknown>) => ({
    id: v.id as string,
    vehicleId: v.vehicle_id as string,
    customName: v.custom_name as string | null,
    customDescription: v.custom_description as string | null,
    customImageUrl: v.custom_image_url as string | null,
    isActive: v.is_active as boolean,
    displayOrder: v.display_order as number,
    vehicle: {
      id: (v.vehicle_library as Record<string, unknown>)?.id as string,
      vehicleType: (v.vehicle_library as Record<string, unknown>)?.vehicle_type as string,
      brand: (v.vehicle_library as Record<string, unknown>)?.brand as string,
      model: (v.vehicle_library as Record<string, unknown>)?.model as string,
      year: (v.vehicle_library as Record<string, unknown>)?.year as number | null,
      seatCapacity: (v.vehicle_library as Record<string, unknown>)?.seat_capacity as number,
      luggageCapacity: (v.vehicle_library as Record<string, unknown>)?.luggage_capacity as number,
      imageUrl: (v.vehicle_library as Record<string, unknown>)?.image_url as string | null,
      features: (v.vehicle_library as Record<string, unknown>)?.features as string[],
      descriptionZh: (v.vehicle_library as Record<string, unknown>)?.description_zh as string | null,
    },
  }));

  return {
    guide: {
      id: guide.id,
      name: guide.name,
      brandName: guide.brand_name,
      brandLogoUrl: guide.brand_logo_url,
      brandColor: guide.brand_color || "#2563eb",
      contactWechat: guide.contact_wechat,
      contactLine: guide.contact_line,
      contactDisplayPhone: guide.contact_display_phone,
      email: guide.email,
    },
    config: {
      id: config.id,
      slug: config.slug,
      isPublished: config.is_published,
      bioTemplateId: config.bio_template_id,
      vehicleTemplateId: config.vehicle_template_id,
      bioContent: config.bio_content,
      vehicleContent: config.vehicle_content,
      seoTitle: config.seo_title,
      seoDescription: config.seo_description,
    },
    bioTemplate: bioTemplateResult.data
      ? {
          id: bioTemplateResult.data.id,
          name: bioTemplateResult.data.name,
          templateKey: bioTemplateResult.data.template_key,
          templateConfig: bioTemplateResult.data.template_config,
        }
      : null,
    vehicleTemplate: vehicleTemplateResult.data
      ? {
          id: vehicleTemplateResult.data.id,
          name: vehicleTemplateResult.data.name,
          templateKey: vehicleTemplateResult.data.template_key,
          templateConfig: vehicleTemplateResult.data.template_config,
        }
      : null,
    selectedModules,
    selectedVehicles,
  };
}
