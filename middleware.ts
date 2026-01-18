import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import {
  DOMAINS,
  WHITELABEL_COOKIE_NAME,
  DEV_WHITELABEL_PORT,
  COOKIE_OPTIONS,
  isValidSlug,
} from '@/lib/whitelabel-config';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 1. 检测是否为白标域名
  const isWhiteLabelDomain =
    hostname.includes(DOMAINS.whitelabel) ||
    hostname.includes(`localhost:${DEV_WHITELABEL_PORT}`);

  // 2. 处理 /p/[slug] 路由 - 设置导游 Cookie
  if (pathname.startsWith('/p/')) {
    const slug = pathname.split('/')[2];

    // 验证 slug 格式（防止注入攻击）
    if (slug && isValidSlug(slug)) {
      const response = await updateSession(request);

      // 设置白标 Cookie（使用安全配置）
      response.cookies.set(WHITELABEL_COOKIE_NAME, slug, COOKIE_OPTIONS);

      // 重定向到首页（保留 Cookie）
      const redirectUrl = new URL('/', request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      // 复制 Cookie 到重定向响应
      redirectResponse.cookies.set(WHITELABEL_COOKIE_NAME, slug, COOKIE_OPTIONS);

      return redirectResponse;
    } else if (slug) {
      // slug 格式无效，记录警告并重定向到首页
      console.warn(`[WhiteLabel] Invalid slug format rejected: ${slug.substring(0, 20)}`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 3. 白标模式下隐藏导游合伙人页面
  if (isWhiteLabelDomain && pathname.startsWith('/guide-partner')) {
    // 重定向到首页
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

  // 4. 添加白标模式标识到请求头
  const response = await updateSession(request);

  if (isWhiteLabelDomain) {
    response.headers.set('x-whitelabel-mode', 'true');

    // 从 Cookie 获取当前绑定的导游 slug（再次验证格式）
    const guideSlug = request.cookies.get(WHITELABEL_COOKIE_NAME)?.value;
    if (guideSlug && isValidSlug(guideSlug)) {
      response.headers.set('x-whitelabel-slug', guideSlug);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - API routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/(?!protected)).*)',
  ],
};
