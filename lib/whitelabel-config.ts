/**
 * 白标系统统一配置文件
 * 所有白标相关的常量和配置都应该从这里导入
 */

// ============================================
// Cookie 配置
// ============================================
export const WHITELABEL_COOKIE_NAME = 'wl_guide';
export const WHITELABEL_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30天

// ============================================
// 域名配置
// ============================================
export const DOMAINS = {
  official: 'niijima-koutsu.jp',
  whitelabel: 'bespoketrip.jp',
} as const;

// 本地开发端口
export const DEV_WHITELABEL_PORT = 3001;

// ============================================
// 订阅配置
// ============================================
export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: '基础版',
    nameEn: 'Basic',
    priceJpy: 980,
    maxPages: 2,
    hasSubdomain: false,
    features: ['最多选择 2 个页面', '品牌名称替换', '联系方式展示'],
  },
  professional: {
    id: 'professional',
    name: '专业版',
    nameEn: 'Professional',
    priceJpy: 1980,
    maxPages: -1, // -1 表示无限制
    hasSubdomain: true,
    features: ['全部页面', '专属子域名', '品牌名称替换', '联系方式展示', '访问统计'],
  },
} as const;

export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS;

// 获取订阅计划的页面限制
export function getPlanPageLimit(plan: string | null): number {
  if (plan === 'professional') return -1;
  if (plan === 'basic') return 2;
  // 默认专业版（兼容旧数据 'monthly'）
  if (plan === 'monthly') return -1;
  return 2;
}

// 检查页面数量是否在计划限制内
export function isWithinPlanLimit(plan: string | null, pageCount: number): boolean {
  const limit = getPlanPageLimit(plan);
  if (limit === -1) return true;
  return pageCount <= limit;
}

// 旧配置（保留向后兼容）
export const SUBSCRIPTION = {
  MONTHLY_PRICE_JPY: 1980,
  PLAN_NAME: 'monthly',
} as const;

// ============================================
// 默认联系方式（官方）
// ============================================
export const DEFAULT_CONTACT = {
  PHONE: '06-6632-8807',
  EMAIL: 'haoyuan@niijima-koutsu.jp',
  LINE_URL: 'https://line.me/ti/p/j3XxBP50j9',
  WECHAT_QR_URL: '/wechat-qr.png',
} as const;

// ============================================
// Slug 验证规则
// ============================================
export const SLUG_REGEX = /^[a-z0-9-]{3,50}$/;

/**
 * 验证 slug 格式是否有效
 * @param slug 待验证的 slug
 * @returns 是否有效
 */
export function isValidSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

/**
 * 清理 slug（移除非法字符并转小写）
 * @param input 原始输入
 * @returns 清理后的 slug
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

// ============================================
// Cookie 安全配置
// ============================================
export const COOKIE_OPTIONS = {
  maxAge: WHITELABEL_COOKIE_MAX_AGE,
  path: '/',
  httpOnly: true,      // 服务端 Cookie，客户端无法通过 JS 访问
  secure: process.env.NODE_ENV === 'production', // 生产环境仅 HTTPS
  sameSite: 'lax' as const,
} as const;
