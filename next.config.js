/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 环境变量配置
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },

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
    ],
  },

  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
