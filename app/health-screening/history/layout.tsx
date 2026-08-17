/**
 * 問診記錄页 —— 不进搜索引擎索引。
 *
 * 个人问诊记录，属于用户私有数据，不应被抓取。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '問診記錄',
  description: '問診記錄页面。',
  path: '/health-screening/history',
  noIndex: true,
});

export default function HealthScreeningHistoryPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
