import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 重要: 不要在这里运行 supabase.auth.getSession()
  // 因为它不会读取 cookies, 可能导致安全问题
  // 使用 getUser() 代替
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 保护路由 - 如果用户未登录且访问受保护页面，重定向到登录
  const protectedPaths = ['/my-account', '/my-orders', '/health-screening'];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Guide Partner 受保护路径（排除公开页面：登录、注册、条款、首页）
  const guidePartnerPublicPaths = ['/guide-partner/login', '/guide-partner/register', '/guide-partner/terms'];
  const isGuidePartnerProtected =
    request.nextUrl.pathname.startsWith('/guide-partner/') &&
    !guidePartnerPublicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // Admin 受保护路径
  const isAdminProtected = request.nextUrl.pathname.startsWith('/admin');

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isGuidePartnerProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/guide-partner/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 如果已登录用户访问登录/注册页面，重定向到会员中心
  const authPaths = ['/login', '/register'];
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAuthPath && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/my-account';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
