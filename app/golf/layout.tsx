/**
 * golf 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '日本名門高爾夫預約 | 關西名門球場代訂・會員制球場引薦',
  description: '日本關西名門高爾夫球場預約代訂。會員制球場引薦、專車接送、球僮與翻譯安排，可與體檢或商務行程合併規劃。',
  path: '/golf',
  keywords: ['日本高爾夫', '關西名門球場', '會員制球場', '高爾夫預約', '日本打球'],
});

export default function GolfPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
