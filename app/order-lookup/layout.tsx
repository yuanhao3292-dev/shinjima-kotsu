/**
 * 訂單查詢页 —— 不进搜索引擎索引。
 *
 * 订单查询工具页，无检索价值，且会随参数产生大量近重复 URL。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '訂單查詢',
  description: '訂單查詢页面。',
  path: '/order-lookup',
  noIndex: true,
});

export default function OrderLookupPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
