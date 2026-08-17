/**
 * faq 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '常見問題 | 赴日體檢與就醫流程說明',
  description: '赴日體檢與就醫的常見問題：預約流程、簽證與停留、費用與付款方式、報告與翻譯、陪同接送、退改規則。',
  path: '/faq',
  keywords: ['赴日體檢流程', '日本就醫問題', '體檢簽證', '報告翻譯', '常見問題'],
});

export default function FaqPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
