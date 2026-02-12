import { createClient } from "@supabase/supabase-js";
import {
  GuideWhiteLabelConfig,
  GuideDistributionPage,
  SelectedModuleWithDetails,
} from "@/lib/types/whitelabel";
import { DEFAULT_SELECTED_PAGES } from "@/lib/whitelabel-config";

// Re-export types for consumers
export type { GuideDistributionPage } from "@/lib/types/whitelabel";

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
    .select("*")
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

  // 使用 select("*") 获取所有字段
  const { data, error } = await supabase
    .from("guides")
    .select("*")
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
 * 获取导游分销页面完整数据
 * 包含导游信息、配置、选中的模块和车辆
 */
export async function getGuideDistributionPage(
  slug: string
): Promise<GuideDistributionPage | null> {
  const supabase = getServiceClient();

  // 1. 获取导游基本配置
  const guideConfig = await getGuideBySlug(slug);
  if (!guideConfig) {
    return null;
  }

  // 2. 获取导游白标页面配置（SEO等）
  const { data: pageConfig } = await supabase
    .from("guide_white_label")
    .select("site_title, site_description")
    .eq("guide_id", guideConfig.id)
    .single();

  // 3. 获取导游选择的模块（带模块详情）
  const { data: selectedModulesData, error: modulesError } = await supabase
    .from("guide_selected_modules")
    .select(`
      id,
      sort_order,
      is_enabled,
      custom_title,
      custom_description,
      page_modules (
        id,
        category,
        name,
        name_ja,
        slug,
        description,
        thumbnail_url,
        commission_rate,
        is_required,
        sort_order,
        is_active,
        component_key,
        display_config,
        created_at,
        updated_at
      )
    `)
    .eq("guide_id", guideConfig.id)
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  // 4. 转换模块数据格式
  const selectedModules: SelectedModuleWithDetails[] = (selectedModulesData || [])
    .filter((sm) => sm.page_modules)
    .map((sm) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = sm.page_modules as any;
      return {
        id: sm.id,
        sortOrder: sm.sort_order,
        isEnabled: sm.is_enabled,
        customTitle: sm.custom_title,
        customDescription: sm.custom_description,
        module: {
          id: mod.id,
          category: mod.category,
          name: mod.name,
          nameJa: mod.name_ja,
          slug: mod.slug,
          description: mod.description,
          thumbnailUrl: mod.thumbnail_url,
          commissionRate: mod.commission_rate,
          isRequired: mod.is_required,
          sortOrder: mod.sort_order,
          isActive: mod.is_active,
          componentKey: mod.component_key,
          displayConfig: mod.display_config || null,
          createdAt: mod.created_at,
          updatedAt: mod.updated_at,
        },
      };
    });

  return {
    guide: guideConfig,
    config: {
      seoTitle: pageConfig?.site_title || null,
      seoDescription: pageConfig?.site_description || null,
    },
    selectedModules,
  };
}

/**
 * 根据导游 slug 和模块 component_key 获取模块详情
 * 用于 /g/[slug]/[moduleSlug] 子路由
 */
export async function getGuideModuleByComponentKey(
  guideSlug: string,
  componentKey: string
): Promise<{ guide: GuideWhiteLabelConfig; module: SelectedModuleWithDetails } | null> {
  const pageData = await getGuideDistributionPage(guideSlug);
  if (!pageData) return null;

  const matchingModule = pageData.selectedModules.find(
    (m) => m.module.componentKey === componentKey
  );

  if (!matchingModule) return null;

  return {
    guide: pageData.guide,
    module: matchingModule,
  };
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

/**
 * 记录页面访问（别名 trackPageView）
 */
export const recordPageView = trackPageView;
