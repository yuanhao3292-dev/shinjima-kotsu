/**
 * 白标系统类型定义
 * White-Label System Type Definitions
 */

// 从配置文件重新导出常量，避免重复定义
export {
  WHITELABEL_COOKIE_NAME,
  WHITELABEL_COOKIE_MAX_AGE,
  DOMAINS,
  DEFAULT_CONTACT,
} from "@/lib/whitelabel-config";

export interface GuideWhiteLabelConfig {
  // 基本信息
  id: string;
  slug: string;
  name: string;

  // 品牌定制
  brandName: string | null;
  brandLogoUrl: string | null;
  brandColor: string;

  // 联系方式
  contactWechat: string | null;
  contactLine: string | null;
  contactDisplayPhone: string | null;
  email: string | null;

  // 订阅状态
  subscriptionStatus: "inactive" | "active" | "cancelled" | "past_due";
  subscriptionPlan: "none" | "monthly";
  subscriptionTier: "growth" | "partner"; // 订阅套餐等级
  subscriptionEndDate: string | null;

  // 分成信息
  commissionRate: number; // 当前分成比例
  commissionType: "tiered" | "fixed"; // 累计制 or 固定

  // 统计
  whiteLabelViews: number;
  whiteLabelConversions: number;

  // 导游选择的商城页面
  selectedPages: string[];
}

export interface WhiteLabelContextValue {
  // 模式
  isWhiteLabelMode: boolean;
  domain: "official" | "whitelabel";

  // 导游配置（白标模式下有值）
  guideConfig: GuideWhiteLabelConfig | null;

  // 当前访问的 slug（从 Cookie 或 URL 获取）
  currentSlug: string | null;

  // 订阅有效性
  isSubscriptionActive: boolean;

  // 品牌信息（合并后的最终值）
  branding: {
    name: string;
    logoUrl: string | null;
    color: string;
    showOfficialBranding: boolean;
  };

  // 联系方式（用于替换官方联系方式）
  contact: {
    wechat: string | null;
    line: string | null;
    phone: string | null;
    email: string | null;
  };

  // 导游选择的商城页面（用于过滤导航链接）
  selectedPages: string[];
}

export interface WhiteLabelOrder {
  id: string;
  guideId: string;
  orderType: "medical" | "treatment" | "golf" | "business" | "nightclub";
  orderAmount: number | null;
  orderCurrency: string;
  customerSessionId: string | null;
  status: "lead" | "inquiry" | "booked" | "completed" | "cancelled";
  attributedAt: string;
  commissionRate: number | null;
  commissionAmount: number | null;
  commissionStatus: "pending" | "calculated" | "paid";
  createdAt: string;
}

export interface WhiteLabelPageView {
  id: string;
  guideId: string;
  pagePath: string;
  referrer: string | null;
  sessionId: string | null;
  country: string | null;
  city: string | null;
  viewedAt: string;
}

// 默认品牌信息（这个是类型文件特有的，保留）
export const DEFAULT_OFFICIAL_BRANDING = {
  name: "NIIJIMA",
  subName: "新島交通株式会社",
  color: "#2563eb",
  logoUrl: null,
};

// ============================================
// 白标分销系统类型 (White-Label Distribution System)
// 匹配 058_white_label_system.sql 实际 DB 列
// ============================================

/** 模板模块类型（page_templates.module_type CHECK 约束） */
export type TemplateModuleType = "bio" | "vehicle";

/** 页面模块（产品中心的可选模块）— page_modules 表 */
export interface PageModule {
  id: string;
  category: string;
  name: string;
  nameJa: string | null;
  slug: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  commissionRate: number;
  isRequired: boolean;
  sortOrder: number;
  isActive: boolean;
  componentKey: string | null; // 映射到 whitelabel-modules/registry.ts 中的组件
  createdAt: string;
  updatedAt: string;
}

/** 页面模板（自我介绍和车辆介绍的风格模板）— page_templates 表 */
export interface PageTemplate {
  id: string;
  moduleType: TemplateModuleType;
  templateKey: string;
  name: string;
  nameJa: string | null;
  previewImageUrl: string | null;
  templateConfig: Record<string, unknown>;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
}

/** 车辆库（系统提供的车辆数据）— vehicle_library 表 */
export interface VehicleLibrary {
  id: string;
  name: string;
  nameJa: string | null;
  slug: string | null;
  vehicleType: string;
  seats: number;
  description: string | null;
  images: string[];
  features: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 导游白标页面配置 — guide_white_label 表 */
export interface GuideWhiteLabelPage {
  id: string;
  guideId: string;
  slug: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  contactWechat: string | null;
  contactLine: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  bioTemplateId: string | null;
  vehicleTemplateId: string | null;
  themeColor: string;
  siteTitle: string | null;
  siteDescription: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 导游选择的模块 — guide_selected_modules 表 */
export interface GuideSelectedModule {
  id: string;
  guideId: string;
  moduleId: string;
  sortOrder: number;
  isEnabled: boolean;
  customTitle: string | null;
  customDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 导游选择的车辆 — guide_selected_vehicles 表 */
export interface GuideSelectedVehicle {
  id: string;
  guideId: string;
  vehicleId: string;
  sortOrder: number;
  isEnabled: boolean;
  customPriceNote: string | null;
  createdAt: string;
}

/** 白标订单状态 — white_label_orders.status CHECK 约束 */
export type WhiteLabelOrderStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

/** 白标订单支付状态 */
export type WhiteLabelPaymentStatus = "pending" | "paid" | "refunded";

/** 白标订单（通过导游页面产生的订单）— white_label_orders 表 */
export interface WhiteLabelDistributionOrder {
  id: string;
  guideId: string;
  moduleId: string | null;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  customerWechat: string | null;
  customerLine: string | null;
  customerNotes: string | null;
  serviceType: string | null;
  serviceName: string | null;
  serviceDate: string | null;
  serviceTime: string | null;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number | null;
  paymentStatus: WhiteLabelPaymentStatus;
  stripePaymentIntentId: string | null;
  status: WhiteLabelOrderStatus;
  paidAt: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 模块带关联数据（用于产品中心展示） */
export interface PageModuleWithRelations extends PageModule {
  templates?: PageTemplate[];
  selectedByGuide?: boolean;
  guideModuleConfig?: GuideSelectedModule | null;
}

/** 导游白标页面完整配置（含所有关联数据） */
export interface GuideWhiteLabelPageFull extends GuideWhiteLabelPage {
  bioTemplate?: PageTemplate | null;
  vehicleTemplate?: PageTemplate | null;
  selectedModules?: (GuideSelectedModule & { module: PageModule })[];
  selectedVehicles?: (GuideSelectedVehicle & { vehicle: VehicleLibrary })[];
}

/** 产品中心筛选参数 */
export interface ProductCenterFilters {
  category?: string;
  search?: string;
}

/** 产品中心响应数据 */
export interface ProductCenterResponse {
  modules: PageModuleWithRelations[];
  templates: {
    bio: PageTemplate[];
    vehicle: PageTemplate[];
  };
  vehicles: VehicleLibrary[];
}

// ============================================
// 订阅套餐系统类型 (Subscription Tier System)
// ============================================

/** 订阅套餐等级 */
export type SubscriptionTier = "growth" | "partner";

/** 分成计算类型 */
export type CommissionType = "tiered" | "fixed";

/** 入场费支付状态 */
export type EntryFeeStatus = "pending" | "completed" | "refunded" | "failed";

/** 分期计划 */
export type InstallmentPlan = "full" | "installment_3";

/** 合伙人入场费记录 */
export interface PartnerEntryFee {
  id: string;
  guideId: string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  stripeReceiptUrl: string | null;
  status: EntryFeeStatus;
  installmentPlan: InstallmentPlan;
  installmentNumber: number;
  totalInstallments: number;
  createdAt: string;
  completedAt: string | null;
  notes: string | null;
}

/** 订阅套餐配置 */
export interface SubscriptionPlan {
  id: string;
  planCode: SubscriptionTier;
  planName: string;
  planNameZh: string | null;
  monthlyFee: number;
  entryFee: number;
  currency: string;
  commissionRate: number | null; // null 表示使用累计制
  commissionType: CommissionType;
  stripePriceId: string | null;
  stripeProductId: string | null;
  benefits: SubscriptionBenefits;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** 订阅套餐权益 */
export interface SubscriptionBenefits {
  whitelabel: boolean;
  templates: number;
  support: "standard" | "priority";
  priorityResources?: boolean;
  partnerCertificate?: boolean;
  partnerGroup?: boolean;
  description?: string;
}

/** 导游订阅详情 */
export interface GuideSubscriptionDetails {
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: "inactive" | "active" | "cancelled" | "past_due";
  commissionRate: number;
  commissionType: CommissionType;
  monthlyFee: number;
  entryFeePaid: boolean;
  entryFeeAmount: number;
  benefits: SubscriptionBenefits;
  // 成长版专用：累计销售额和进度
  quarterlySales?: number;
  nextTierThreshold?: number;
  progressPercent?: number;
}

/** 套餐对比信息（用于升级页面） */
export interface SubscriptionPlanComparison {
  growth: {
    name: string;
    monthlyFee: number;
    commission: string;
    features: string[];
  };
  partner: {
    name: string;
    monthlyFee: number;
    entryFee: number;
    commission: string;
    features: string[];
  };
}

/** 升级到合伙人请求 */
export interface UpgradeToPartnerRequest {
  guideId: string;
  paymentMethod: "full" | "installment";
}

/** 升级到合伙人响应 */
export interface UpgradeToPartnerResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

// ============================================
// 分销页面类型 (Distribution Page)
// ============================================

/** 分销页面配置（SEO等） */
export interface DistributionPageConfig {
  seoTitle: string | null;
  seoDescription: string | null;
}

/** 分销页面选中的模块（带模块详情） */
export interface SelectedModuleWithDetails {
  id: string;
  sortOrder: number;
  isEnabled: boolean;
  customTitle: string | null;
  customDescription: string | null;
  module: PageModule;
}

/** 分销页面选中的车辆（带车辆详情） */
export interface SelectedVehicleWithDetails {
  id: string;
  sortOrder: number;
  isEnabled: boolean;
  customPriceNote: string | null;
  vehicle: VehicleLibrary;
}

/** 完整的分销页面数据 */
export interface GuideDistributionPage {
  guide: GuideWhiteLabelConfig;
  config: DistributionPageConfig;
  selectedModules: SelectedModuleWithDetails[];
  selectedVehicles: SelectedVehicleWithDetails[];
}
