/**
 * package-recommender 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '體檢套餐推薦 | 依年齡與關注項目挑選日本體檢方案',
  description: '回答幾個問題，依年齡、性別與關注的健康項目，推薦適合的日本精密體檢套餐與檢查組合。',
  path: '/package-recommender',
  keywords: ['體檢套餐推薦', '日本體檢方案', '健檢項目', '套餐比較'],
});

export default function PackageRecommenderPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
