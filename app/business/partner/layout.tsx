/**
 * business/partner 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '同業合作 | 旅行社的日本醫療與高爾夫資源通道',
  description: '為旅行社與企業客戶提供日本醫療、高爾夫與商務考察的資源通道。靈活的合作模式與透明分潤，助傳統旅行社轉型高毛利醫療旅遊。',
  path: '/business/partner',
  keywords: ['同業合作', '旅行社合作', '醫療旅遊分銷', '日本地接', 'B2B 合作'],
});

export default function BusinessPartnerPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
