/**
 * news 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '最新消息 | 新島交通公告與醫療旅遊資訊',
  description: '新島交通株式會社的公告、合作醫療機構動態，以及赴日醫療旅遊相關資訊。',
  path: '/news',
  keywords: ['新島交通', '公告', '醫療旅遊資訊', '日本醫療動態'],
});

export default function NewsPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
