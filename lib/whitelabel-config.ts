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
