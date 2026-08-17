/**
 * 导游后台统一外壳 —— 仅提供一个 .gp-shell 作用域,供 globals.css 给全后台的按钮/卡片
 * 链接统一加「按压回弹」反馈(见 globals.css 中 .gp-shell 规则)。
 *
 * 不产生视觉盒子影响:内部页面各自是 min-h-screen 块级布局,包一层普通 div 不改变布局;
 * GuideSidebar 的 fixed 定位不受无 transform 的包裹层影响。
 */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

// 这一条服务于对外的招募落地页 /guide-partner。
// 它同时覆盖 /guide-partner/* 的后台页面，但那些路径已被 robots.txt
// 的 `Disallow: /guide-partner/` 挡在索引之外，不会因此产生重复标题。
export const metadata: Metadata = pageMetadata({
  title: '導遊合夥人招募 | 您帶客戶，我們出資源',
  description:
    '面向在日導遊與地接的合夥人計畫：您帶客戶，我們提供日本醫療與高爾夫資源並支付介紹手續費。專屬白標頁面、訂單追蹤、佣金結算。',
  path: '/guide-partner',
  keywords: ['導遊合夥人', '日本地接', '介紹手續費', '醫療旅遊分銷', '白標頁面'],
});

export default function GuidePartnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="gp-shell">{children}</div>;
}
