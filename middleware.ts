import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import {
  DOMAINS,
  WHITELABEL_COOKIE_NAME,
  DEV_WHITELABEL_PORT,
  COOKIE_OPTIONS,
  isValidSlug,
} from '@/lib/whitelabel-config';
import { classifyUserAgent, type BotClassification } from '@/lib/utils/bot-detection';
import {
  checkRateLimit,
  getClientIp,
  type RateLimitConfig,
} from '@/lib/utils/rate-limiter';
import { verifyFingerprintToken } from '@/lib/utils/fingerprint-token';

/**
 * 429 友好页面（避免白屏）
 */
const RATE_LIMIT_HTML = `<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>请求过于频繁</title><style>body{font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb;color:#374151}div{text-align:center;max-width:400px;padding:2rem}h1{font-size:1.5rem;margin-bottom:.5rem}p{color:#6b7280;margin-bottom:1.5rem}button{background:#2563eb;color:#fff;border:none;padding:.6rem 1.5rem;border-radius:.375rem;cursor:pointer;font-size:.95rem}button:hover{background:#1d4ed8}</style></head><body><div><h1>请求过于频繁</h1><p>您的操作过快，请稍等片刻后重试。</p><button onclick="location.reload()">刷新页面</button></div></body></html>`;

/**
 * 页面请求速率限制配置
 * (API 路由有独立的 per-route 限速，不经过此 middleware)
 */
const PAGE_RATE_LIMITS: Record<string, RateLimitConfig> = {
  human: { windowMs: 60_000, maxRequests: 180 },
  sensitive: { windowMs: 60_000, maxRequests: 120 },
  suspicious_tool: { windowMs: 60_000, maxRequests: 60 },
  no_ua: { windowMs: 60_000, maxRequests: 15 },
};

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

  // ========== 跳过 Next.js 内部请求的限速 ==========
  // prefetch 和 RSC 客户端导航是框架自动发起的，不应消耗限速配额
  const isPrefetch = request.headers.get('next-router-prefetch') === '1'
    || request.headers.get('purpose') === 'prefetch';
  const isRSC = request.headers.get('rsc') === '1';

  // ========== Bot Detection & Page Rate Limiting ==========
  const ua = request.headers.get('user-agent');
  let botClass: BotClassification = classifyUserAgent(ua);

  // 直接拦截恶意爬虫
  if (botClass === 'blocked_bot') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ========== Browser Fingerprint Check ==========
  // UA 显示为 human 时，验证浏览器指纹 cookie 进一步确认
  // 公开入口页面跳过指纹检查：用户首次访问这些页面必然没有 cookie
  const PUBLIC_ENTRY_PATHS = ['/login', '/register', '/forgot-password'];
  const isPublicEntry = PUBLIC_ENTRY_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (botClass === 'human' && !isPublicEntry) {
    const fpCookie = request.cookies.get('__bfp');
    const fpSecret = process.env.NEXT_PUBLIC_FP_SECRET || 'fp-default-key';

    if (fpCookie?.value) {
      const fpResult = await verifyFingerprintToken(fpCookie.value, fpSecret);
      if (!fpResult.valid || fpResult.score > 70) {
        // 指纹无效或 bot 评分高 → 降级限速
        botClass = 'suspicious_tool';
      }
    } else {
      // 无指纹 cookie：检查该 IP 是否已请求多次仍无 cookie
      const clientIpForFp = getClientIp(request);
      const nofpKey = `nofp:${clientIpForFp}`;
      const nofpResult = await checkRateLimit(nofpKey, {
        windowMs: 300_000, // 5 分钟窗口
        maxRequests: 50,   // 超过 50 次无 cookie → 可疑
      });
      if (!nofpResult.success) {
        botClass = 'suspicious_tool';
      }
    }
  }

  // 合法搜索引擎和 Next.js 内部请求跳过限速
  if (botClass !== 'legitimate_bot' && !isPrefetch && !isRSC) {
    const clientIp = getClientIp(request);
    const isSensitivePath =
      pathname.startsWith('/admin') || pathname.startsWith('/guide-partner');

    let config: RateLimitConfig;
    let key: string;

    if (botClass === 'suspicious_tool') {
      config = PAGE_RATE_LIMITS.suspicious_tool;
      key = `page:sus:${clientIp}`;
    } else if (botClass === 'no_ua') {
      config = PAGE_RATE_LIMITS.no_ua;
      key = `page:noua:${clientIp}`;
    } else if (isSensitivePath) {
      config = PAGE_RATE_LIMITS.sensitive;
      key = `page-sensitive:${clientIp}`;
    } else {
      config = PAGE_RATE_LIMITS.human;
      key = `page:${clientIp}`;
    }

    const rateLimitResult = await checkRateLimit(key, config);
    if (!rateLimitResult.success) {
      return new NextResponse(RATE_LIMIT_HTML, {
        status: 429,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Retry-After': String(rateLimitResult.retryAfter || 60),
        },
      });
    }
  }

  // ========== Application-Level WAF ==========
  // 合法搜索引擎跳过 WAF 检查
  if (botClass !== 'legitimate_bot') {
    // 路径遍历 & 攻击模式检测
    const ATTACK_PATH_PATTERNS = [
      /\.\.\//,                      // 路径遍历 ../
      /etc\/passwd/i,                // Linux 文件读取
      /\.(env|git|svn|htaccess)/i,   // 敏感文件探测
      /\.(php|asp|jsp|cgi)/i,        // 非 Next.js 文件探测
      /wp-admin|wp-login|xmlrpc/i,   // WordPress 攻击
      /phpmyadmin|adminer/i,         // 数据库管理工具探测
    ];

    const fullPath = pathname + request.nextUrl.search;
    if (ATTACK_PATH_PATTERNS.some((p) => p.test(fullPath))) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 查询参数 SQL 注入检测
    const searchQuery = request.nextUrl.search;
    if (searchQuery) {
      const SQLI_PATTERNS = [
        /(\bunion\b.*\bselect\b)/i,
        /(\bor\b|\band\b)\s+\d+=\d+/i,
        /(\bdrop\b|\bdelete\b|\binsert\b|\bupdate\b)\s+(table|from|into)/i,
      ];
      if (SQLI_PATTERNS.some((p) => p.test(decodeURIComponent(searchQuery)))) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
  }

  // 1. 检测是否为白标域名（主域名或子域名）
  const isWhiteLabelDomain =
    hostname.includes(DOMAINS.whitelabel) ||
    hostname.includes(`localhost:${DEV_WHITELABEL_PORT}`);

  // 2. 提取子域名作为导游 slug（优先级最高）
  const subdomainSlug = extractSubdomain(hostname);

  // 2.5 白标域名上的裸模块页面 → 重定向到 /g/{slug}/ 白标路由
  //     checkout 子页面 → 补充 ?guide= 参数（用于返回链接）
  if (isWhiteLabelDomain) {
    const WHITELABEL_MODULE_PATHS = new Set([
      'hyogo-medical', 'kindai-hospital', 'cancer-treatment', 'medical-packages',
      'sai-clinic', 'wclinic-mens', 'helene-clinic',
      'ginza-phoenix', 'cell-medicine', 'ac-plus', 'igtc',
      'osaka-himak',
    ]);

    const firstSegment = pathname.split('/')[1];
    if (firstSegment && WHITELABEL_MODULE_PATHS.has(firstSegment)) {
      const slug = subdomainSlug || request.cookies.get(WHITELABEL_COOKIE_NAME)?.value;
      if (slug && isValidSlug(slug)) {
        const restOfPath = pathname.substring(1 + firstSegment.length); // '' 或 '/initial-consultation'
        if (!restOfPath || restOfPath === '/') {
          // 裸模块页面：/hyogo-medical → /g/{slug}/hyogo-medical（获得白标 layout）
          return NextResponse.redirect(new URL(`/g/${slug}${pathname}`, request.url));
        } else if (!request.nextUrl.searchParams.has('guide')) {
          // checkout 子页面：补充 ?guide= 参数
          const url = new URL(request.url);
          url.searchParams.set('guide', slug);
          return NextResponse.redirect(url);
        }
      }
    }
  }

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

  // 4. 处理 /g/[slug] 路由
  if (pathname.startsWith('/g/')) {
    const slug = pathname.split('/')[2];
    if (slug && isValidSlug(slug)) {
      // 生产环境 + 官方域名：重定向到白标子域名（官方域名不承载白标页面）
      // 临时禁用：等待配置 Vercel nameservers 后再启用
      // if (process.env.NODE_ENV === 'production' && !isWhiteLabelDomain) {
      //   const subdomainUrl = `https://${slug}.${DOMAINS.whitelabel}${pathname}`;
      //   return NextResponse.redirect(subdomainUrl);
      // }

      // 白标域名或开发环境：正常处理
      const response = await updateSession(request);
      response.cookies.set(WHITELABEL_COOKIE_NAME, slug, COOKIE_OPTIONS);
      response.headers.set('x-whitelabel-mode', 'true');
      response.headers.set('x-whitelabel-slug', slug);
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
