import DistributionNav from '@/components/distribution/DistributionNav';
import type { NavItem } from '@/components/distribution/DistributionNav';

const navItems: NavItem[] = [
  { id: 'home', label: '首页', href: '/g/demo' },
  { id: 'medical_packages', label: '精密体检', href: '/g/demo/medical-packages' },
  { id: 'hyogo_medical', label: '兵庫医大病院', href: '/g/demo/hyogo-medical' },
  { id: 'sai_clinic', label: 'SAI CLINIC', href: '/g/demo/sai-clinic' },
  { id: 'helene_clinic', label: '干细胞再生', href: '/g/demo/helene-clinic' },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DistributionNav
        brandName="NIIJIMA"
        brandTagline="新島交通株式会社"
        navItems={navItems}
        homeHref="/g/demo"
      />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-sm text-gray-400 space-y-1">
            <p>旅行服务由 新岛交通株式会社 提供</p>
            <p>大阪府知事登録旅行業 第2-3115号</p>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} 新島交通株式会社. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const metadata = {
  title: '新岛交通 - 日本医疗旅行服务 Demo',
  description: '白标分销页面演示 — 精密体检、医疗美容、干细胞再生医疗',
};
