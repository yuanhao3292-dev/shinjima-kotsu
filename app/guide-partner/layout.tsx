/**
 * 导游后台统一外壳 —— 仅提供一个 .gp-shell 作用域,供 globals.css 给全后台的按钮/卡片
 * 链接统一加「按压回弹」反馈(见 globals.css 中 .gp-shell 规则)。
 *
 * 不产生视觉盒子影响:内部页面各自是 min-h-screen 块级布局,包一层普通 div 不改变布局;
 * GuideSidebar 的 fixed 定位不受无 transform 的包裹层影响。
 */
import { localizedPageMetadata } from '@/lib/seo-server';

// 这一条服务于对外的招募落地页 /guide-partner。
// 它同时覆盖 /guide-partner/* 的后台页面，但那些路径已被 robots.txt
// 的 `Disallow: /guide-partner/` 挡在索引之外，不会因此产生重复标题。
// 文案见 lib/seo-copy 的 PAGE_COPY['/guide-partner']（四语言）。
// 必须是 generateMetadata：要读 middleware 透出的 x-locale，
// 静态 metadata 在构建期求值，拿不到请求头。
export const generateMetadata = () => localizedPageMetadata('/guide-partner');

export default function GuidePartnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="gp-shell">{children}</div>;
}
