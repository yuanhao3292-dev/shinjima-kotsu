/**
 * business 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '日本商務考察 | 企業參訪・產業考察行程規劃',
  description: '面向企業客戶的日本商務考察安排：產業參訪對接、日程規劃、翻譯與專車、住宿與宴請一站式落地。',
  path: '/business',
  keywords: ['日本商務考察', '企業參訪', '產業考察', '商務接待', '日本考察團'],
});

export default function BusinessPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
