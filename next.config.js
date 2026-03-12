const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
}

module.exports = nextConfig
