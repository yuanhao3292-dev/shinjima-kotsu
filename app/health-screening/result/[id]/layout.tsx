/**
 * 問診報告页 —— 不进搜索引擎索引。
 *
 * 报告页含个人健康信息。URL 虽不可枚举，但一旦被分享出去就可能被抓取，显式 noindex。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '問診報告',
  description: '問診報告页面。',
  path: '/health-screening/result/[id]',
  noIndex: true,
});

export default function HealthScreeningResultPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
