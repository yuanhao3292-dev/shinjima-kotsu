/**
 * medical 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'TIMC OSAKA 精密體檢 | PET-CT・全身MRI・胃腸內視鏡',
  description: '德州會 TIMC OSAKA 官方預約代理。VIP 會員套餐、DWIBS 癌症篩查、PET-CT、上下消化道內視鏡。中文專屬禮賓全程陪同，報告翻譯與後續方案一站式安排。',
  path: '/medical',
  keywords: ['日本體檢', 'TIMC OSAKA', '大阪精密體檢', 'PET-CT', 'DWIBS', '胃腸內視鏡', '德州會', '日本健檢'],
});

export default function MedicalPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
