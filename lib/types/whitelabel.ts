/**
 * 白标系统类型定义
 * White-Label System Type Definitions
 */

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

// Cookie 名称常量
export const WHITELABEL_COOKIE_NAME = "wl_guide";
export const WHITELABEL_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30天

// 域名配置
export const DOMAINS = {
  official: "niijima-koutsu.jp",
  whitelabel: "bespoketrip.jp",
} as const;

// 默认品牌信息
export const DEFAULT_OFFICIAL_BRANDING = {
  name: "NIIJIMA",
  subName: "新島交通株式会社",
  color: "#2563eb",
  logoUrl: null,
};

// ============================================
// 白标分销系统类型 (White-Label Distribution System)
// ============================================

/** 模块类型 */
export type ModuleType = "bio" | "vehicle" | "medical";

/** 模块状态 */
export type ModuleStatus = "active" | "inactive";

/** 页面模块（产品中心的可选模块） */
export interface PageModule {
  id: string;
  moduleType: ModuleType;
  name: string;
  nameJa: string | null;
  nameZh: string | null;
  description: string | null;
  descriptionJa: string | null;
  descriptionZh: string | null;
  iconUrl: string | null;
  isRequired: boolean;
  commissionRateMin: number;
  commissionRateMax: number;
  status: ModuleStatus;
  displayOrder: number;
  config: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

/** 页面模板（自我介绍和车辆介绍的风格模板） */
export interface PageTemplate {
  id: string;
  moduleType: ModuleType;
  templateKey: string;
  name: string;
  nameJa: string | null;
  nameZh: string | null;
  previewImageUrl: string | null;
  templateConfig: Record<string, unknown>;
  isDefault: boolean;
  displayOrder: number;
  createdAt: string;
}

/** 车辆库（系统提供的车辆数据） */
export interface VehicleLibrary {
  id: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number | null;
  seatCapacity: number;
  luggageCapacity: number;
  imageUrl: string | null;
  features: string[];
  description: string | null;
  descriptionJa: string | null;
  descriptionZh: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

/** 导游白标页面配置 */
export interface GuideWhiteLabelPage {
  id: string;
  guideId: string;
  slug: string;
  isPublished: boolean;
  bioTemplateId: string | null;
  vehicleTemplateId: string | null;
  bioContent: Record<string, unknown> | null;
  vehicleContent: Record<string, unknown> | null;
  customCss: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

/** 导游选择的模块 */
export interface GuideSelectedModule {
  id: string;
  guideWhiteLabelId: string;
  moduleId: string;
  isEnabled: boolean;
  customConfig: Record<string, unknown> | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** 导游选择的车辆 */
export interface GuideSelectedVehicle {
  id: string;
  guideWhiteLabelId: string;
  vehicleId: string;
  customName: string | null;
  customDescription: string | null;
  customImageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

/** 白标订单状态 */
export type WhiteLabelOrderStatus =
  | "pending_payment"
  | "paid"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded";

/** 佣金状态 */
export type CommissionStatus = "pending" | "calculated" | "paid";

/** 白标订单（通过导游页面产生的订单） */
export interface WhiteLabelDistributionOrder {
  id: string;
  guideWhiteLabelId: string;
  moduleId: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  orderDetails: Record<string, unknown> | null;
  totalAmount: number;
  currency: string;
  status: WhiteLabelOrderStatus;
  stripePaymentIntentId: string | null;
  stripePaymentStatus: string | null;
  commissionRate: number;
  commissionAmount: number;
  commissionStatus: CommissionStatus;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  completedAt: string | null;
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
  moduleType?: ModuleType;
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
