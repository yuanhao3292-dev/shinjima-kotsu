/**
 * cancer-treatment 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '日本癌症治療轉診 | 關西癌症專門醫院・遠程會診',
  description: '對接關西地區癌症專門醫院：兵庫醫科大學、近畿大學醫院、大阪國際癌症中心、IGT 診所。病歷翻譯、遠程會診、赴日治療全程安排。',
  path: '/cancer-treatment',
  keywords: ['日本癌症治療', '赴日就醫', '關西癌症醫院', '遠程會診', '質子治療', '免疫療法', '病歷翻譯'],
});

export default function CancerTreatmentPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
