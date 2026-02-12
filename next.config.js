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
    ],
  },

  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
