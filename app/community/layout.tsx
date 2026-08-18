/**
 * 健康故事社区 —— 暂不进搜索引擎索引。
 *
 * 该页面目前没有任何站内入口、线上 0 条数据、投稿页面尚未实现，
 * 属于半成品。被收录只会让用户从搜索结果落到一个空页面。
 * 功能成型后删掉这个 noIndex 并把 sitemap 里那条加回。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '健康故事社區',
  description: '會員分享的赴日體檢與就醫經歷。',
  path: '/community',
  noIndex: true,
});

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
