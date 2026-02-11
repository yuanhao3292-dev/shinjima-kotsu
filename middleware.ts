import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import {
  DOMAINS,
  WHITELABEL_COOKIE_NAME,
  DEV_WHITELABEL_PORT,
  COOKIE_OPTIONS,
  isValidSlug,
} from '@/lib/whitelabel-config';

/**
 * 从主机名中提取子域名（导游 slug）
 * 例如：xiaowang.bespoketrip.jp -> xiaowang
 */
function extractSubdomain(hostname: string): string | null {
  // 生产环境：xiaowang.bespoketrip.jp
  if (hostname.endsWith(`.${DOMAINS.whitelabel}`)) {
    const subdomain = hostname.replace(`.${DOMAINS.whitelabel}`, '');
    // 排除 www 和空子域名
    if (subdomain && subdomain !== 'www' && isValidSlug(subdomain)) {
      return subdomain;
    }
  }

  // 本地开发：xiaowang.localhost:3001
  const devPattern = new RegExp(`^(.+)\\.localhost:${DEV_WHITELABEL_PORT}$`);
  const match = hostname.match(devPattern);
  if (match && match[1] && match[1] !== 'www' && isValidSlug(match[1])) {
    return match[1];
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 1. 检测是否为白标域名（主域名或子域名）
  const isWhiteLabelDomain =
    hostname.includes(DOMAINS.whitelabel) ||
    hostname.includes(`localhost:${DEV_WHITELABEL_PORT}`);

  // 2. 提取子域名作为导游 slug（优先级最高）
  const subdomainSlug = extractSubdomain(hostname);

  // 3. 处理子域名访问 - 设置导游 Cookie
  if (subdomainSlug) {
    const response = await updateSession(request);

    // 设置/更新白标 Cookie
    response.cookies.set(WHITELABEL_COOKIE_NAME, subdomainSlug, COOKIE_OPTIONS);

    // 设置白标模式标识
    response.headers.set('x-whitelabel-mode', 'true');
    response.headers.set('x-whitelabel-slug', subdomainSlug);

    // 隐藏导游合伙人页面
    if (pathname.startsWith('/guide-partner')) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }

    return response;
  }

  // 4. 处理 /g/[slug] 路由 - 设置导游 Cookie（分销页面及子页面）
  if (pathname.startsWith('/g/')) {
    const slug = pathname.split('/')[2];
    if (slug && isValidSlug(slug)) {
      const response = await updateSession(request);
      response.cookies.set(WHITELABEL_COOKIE_NAME, slug, COOKIE_OPTIONS);
      return response;
    }
  }

  // 5. 处理 /p/[slug] 路由 - 重定向到子域名
  if (pathname.startsWith('/p/')) {
    const slug = pathname.split('/')[2];

    if (slug && isValidSlug(slug)) {
      // 重定向到子域名（生产环境）
      if (process.env.NODE_ENV === 'production') {
        const subdomainUrl = `https://${slug}.${DOMAINS.whitelabel}`;
        return NextResponse.redirect(subdomainUrl);
      }

      // 开发环境：设置 Cookie 并重定向到首页
      const response = await updateSession(request);
      response.cookies.set(WHITELABEL_COOKIE_NAME, slug, COOKIE_OPTIONS);

      const redirectUrl = new URL('/', request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      redirectResponse.cookies.set(WHITELABEL_COOKIE_NAME, slug, COOKIE_OPTIONS);

      return redirectResponse;
    } else if (slug) {
      console.warn(`[WhiteLabel] Invalid slug format rejected: ${slug.substring(0, 20)}`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 6. 白标主域名（无子域名）- 仍然隐藏导游合伙人页面
  if (isWhiteLabelDomain && pathname.startsWith('/guide-partner')) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

  // 7. 添加白标模式标识到请求头
  const response = await updateSession(request);

  if (isWhiteLabelDomain) {
    response.headers.set('x-whitelabel-mode', 'true');

    // 从 Cookie 获取当前绑定的导游 slug
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
