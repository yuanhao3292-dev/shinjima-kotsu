/**
 * cancer-treatment 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { localizedPageMetadata } from '@/lib/seo-server';

// 文案见 lib/seo-copy 的 PAGE_COPY['/cancer-treatment']（四语言）。
// 必须是 generateMetadata：要读 middleware 透出的 x-locale，
// 静态 metadata 在构建期求值，拿不到请求头。
export const generateMetadata = () => localizedPageMetadata('/cancer-treatment');

export default function CancerTreatmentPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
