/**
 * health-screening 的 metadata。
 *
 * 页面本体是 'use client'，客户端组件不能导出 metadata，
 * 因此用同目录的服务端 layout 承载 —— 不改动页面组件本身。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'AI 智能健康問診 | 免費症狀初篩與就診科別建議',
  description: '輸入症狀，由多模型 AI 管線做初步分診：風險等級、建議就診科別、需要補充的檢查方向，並匹配日本合作醫療機構。僅供參考，不構成醫療診斷。',
  path: '/health-screening',
  keywords: ['AI 問診', '線上初篩', '症狀自查', '就診科別', '日本就醫'],
});

export default function HealthScreeningPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
