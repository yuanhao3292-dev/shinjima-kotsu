/**
 * 导游后台统一外壳 —— 仅提供一个 .gp-shell 作用域,供 globals.css 给全后台的按钮/卡片
 * 链接统一加「按压回弹」反馈(见 globals.css 中 .gp-shell 规则)。
 *
 * 不产生视觉盒子影响:内部页面各自是 min-h-screen 块级布局,包一层普通 div 不改变布局;
 * GuideSidebar 的 fixed 定位不受无 transform 的包裹层影响。
 */
export default function GuidePartnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="gp-shell">{children}</div>;
}
