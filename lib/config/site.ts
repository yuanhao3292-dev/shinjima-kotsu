/**
 * 站点规范地址（认证回跳专用入口）
 * ============================================
 * 认证邮件的回跳地址必须与 Supabase 后台
 * Authentication → URL Configuration → Redirect URLs 白名单匹配，
 * 否则 Supabase 会拒绝该地址，并在回跳时带上 error_code=otp_expired ——
 * 一个极具误导性的错误码，看起来像令牌过期，实际是地址没过白名单。
 *
 * 因此这里**不能**用 window.location.origin —— 用户从哪个 origin 进来
 * 就是哪个，无法保证在白名单里。
 *
 * ⚠️ 历史：这里曾独立读 NEXT_PUBLIC_SITE_URL、兜底 www 版，而 SEO 那边
 * （lib/seo）读 NEXT_PUBLIC_BASE_URL、兜底 apex 版 —— 同一个站两套"规范地址"，
 * canonical 指 apex、认证回跳指 www。2026-08-18 起统一：
 *   - Supabase Site URL 已改为 https://niijima-koutsu.jp
 *   - Redirect URLs 已加 https://niijima-koutsu.jp/**
 *   - next.config.js 把 www 永久跳转到 apex
 *   - 本文件不再自己读环境变量，只复用 lib/seo 的 SITE_URL
 *
 * 新增需要回跳的页面时，路径落在 https://niijima-koutsu.jp/** 通配内即可。
 */

import { SITE_URL } from '@/lib/seo';

/** 认证回跳统一使用的规范源，与 Supabase 的 Site URL 保持一致（= 主域） */
export const CANONICAL_SITE_URL = SITE_URL;

/**
 * 构造认证邮件的回跳地址。
 *
 * @param path 以 / 开头的路径，可带查询串
 */
export function authRedirectUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  // 本地开发保持用当前源，否则调试时会被打到生产站
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    return `${window.location.origin}${normalized}`;
  }

  return `${CANONICAL_SITE_URL}${normalized}`;
}
