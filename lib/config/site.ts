/**
 * 站点规范地址
 * ============================================
 * 认证邮件的回跳地址必须与 Supabase 后台
 * Authentication → URL Configuration → Redirect URLs 白名单**逐字匹配**，
 * 否则 Supabase 会拒绝该地址，并在回跳时带上 error_code=otp_expired ——
 * 一个极具误导性的错误码，看起来像令牌过期，实际是地址没过白名单。
 *
 * 因此这里**不能**用 window.location.origin：
 * www 与非 www 两个域名都直接可访问（没有互相跳转），用户从哪个进来，
 * origin 就是哪个。白名单里只登记了 www 版本，从非 www 进来的用户
 * 拿到的邮件链接必然失效。
 *
 * 新增需要回跳的页面时，**必须同步把完整地址加进 Supabase 白名单**。
 */

/** 认证回跳统一使用的规范源，与 Supabase 的 Site URL 保持一致 */
export const CANONICAL_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.niijima-koutsu.jp';

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
