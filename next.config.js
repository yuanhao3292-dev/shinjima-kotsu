const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 关闭左下角的 Next.js 开发工具指示器（<nextjs-portal>）。
  // 它本来就只在 next dev 存在，生产构建不含该组件，
  // 关掉纯粹是不让它挡住本地预览的目视核对与截图。
  // 只关指示器徽章，编译错误浮层不受影响。
  devIndicators: false,

  // Turbopack 配置 (Next.js 16+ 默认启用)
  turbopack: {},

  // Webpack 配置 (备用)
  webpack: (config) => {
    return config;
  },

  // 注意：不要在 env 中暴露敏感 API 密钥到客户端
  // GEMINI_API_KEY 应该只在服务端使用（API routes）
  // 如需客户端使用，应使用 NEXT_PUBLIC_ 前缀并确认安全性

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
      },
      {
        protocol: 'https',
        hostname: 'fcpcjfqxxtxlbtvbjduk.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.hosp.hyo-med.ac.jp',
      },
      {
        protocol: 'https',
        hostname: 'www.hyo-med.ac.jp',
      },
      {
        protocol: 'https',
        hostname: 'hyo-med-gastro.jp',
      },
      {
        protocol: 'https',
        hostname: 'hyo-med-ganka.jp',
      },
      {
        protocol: 'https',
        hostname: 'hcm-radiology.com',
      },
      {
        protocol: 'https',
        hostname: 'hyogo-deptobgyn.jp',
      },
      {
        protocol: 'https',
        hostname: 'www.nihonsekkei.co.jp',
      },
      {
        protocol: 'https',
        hostname: 'www.takenaka.co.jp',
      },
      {
        protocol: 'https',
        hostname: 'oici.jp',
      },
      {
        protocol: 'https',
        hostname: 'stemcells.jp',
      },
      {
        protocol: 'https',
        hostname: 'mens.wclinic-osaka.jp',
      },
      {
        protocol: 'https',
        hostname: 'www.med.kindai.ac.jp',
      },
      {
        protocol: 'https',
        hostname: 'saicli.jp',
      },
    ],
  },

  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: false,
  },

  // /medical, /golf, /business 现在是独立的 App Router 页面（app/medical/page.tsx 等）
  // 不再需要 rewrites — 旧的 rewrite 方式导致 RSC prefetch 404

  async redirects() {
    return [
      // www → apex 永久跳转。此前两个域名都直接 200、互不跳转，等于同一套站
      // 跑在两个 origin 上：SEO canonical 指 apex，认证回跳却指 www，
      // Cookie（host-only）也各存一份。2026-08-18 起 apex 为唯一 origin ——
      // Supabase Site URL / Redirect URLs 已同步改到 apex。
      // 用 has:host 匹配，只对 www 主机生效，白标域 bespoketrip.jp 不受影响。
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.niijima-koutsu.jp' }],
        destination: 'https://niijima-koutsu.jp/:path*',
        permanent: true,
      },
      // /health-checkup 曾经把导游端 product-center 的 TIMCContent 套进
      // MemberLayout 对外暴露（且进了 sitemap，已被搜索引擎收录）。
      // 页面已删除 —— 永久重定向到真正的对客体检页，保住既有搜索权重。
      // permanent: true 在 Next 里发的是 308（Google 与 301 同等对待）。
      { source: '/health-checkup', destination: '/medical', permanent: true },
      // /community（健康故事社区，半成品）已删除；它曾以 priority 0.4 进过 sitemap，
      // 可能已被收录，落到首页而不是 404。
      { source: '/community', destination: '/', permanent: true },
      { source: '/community/:path*', destination: '/', permanent: true },
    ];
  },
}

module.exports = withSentryConfig(nextConfig, {
  // Suppress source map upload warnings when SENTRY_AUTH_TOKEN is not set
  silent: !process.env.SENTRY_AUTH_TOKEN,
  // Upload source maps for better stack traces
  widenClientFileUpload: true,
  // Disable Sentry telemetry
  disableLogger: true,
})
