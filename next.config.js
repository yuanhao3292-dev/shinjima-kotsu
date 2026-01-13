/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 支持 Vercel 部署
  output: 'standalone',

  // 环境变量配置
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },

  // 图片优化配置
  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'www.transparenttextures.com'
    ],
  },

  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint 配置
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
