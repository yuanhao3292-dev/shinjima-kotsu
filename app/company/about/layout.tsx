/**
 * company/about 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '公司簡介・會社概要',
  description: '新島交通株式會社 —— 立足日本的醫療旅遊與商務服務公司。提供精密體檢、綜合治療轉診、名門高爾夫與商務考察的一站式落地服務。',
  path: '/company/about',
  keywords: ['新島交通株式會社', '公司簡介', '日本醫療旅遊公司', '會社概要'],
});

export default function AboutPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
