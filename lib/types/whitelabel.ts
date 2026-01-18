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
  subscriptionEndDate: string | null;

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
