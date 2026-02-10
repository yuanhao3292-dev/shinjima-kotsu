'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import {
  LayoutDashboard,
  Store,
  Calendar,
  Wallet,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Trophy,
  Headphones,
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: '控制台', href: '/guide-partner/dashboard' },
  { icon: Store, label: '店铺列表', href: '/guide-partner/venues' },
  { icon: Calendar, label: '我的预约', href: '/guide-partner/bookings' },
  { icon: Wallet, label: '返金结算', href: '/guide-partner/commission' },
  { icon: Users, label: '我的推荐', href: '/guide-partner/referrals' },
  { icon: Trophy, label: '排行榜', href: '/guide-partner/leaderboard' },
  { icon: Globe, label: '分销页面', href: '/guide-partner/whitelabel', highlight: true },
  { icon: Headphones, label: '客服支持', href: '/guide-partner/support' },
  { icon: Settings, label: '账户设置', href: '/guide-partner/settings' },
];

interface GuideSidebarProps {
  pageTitle?: string;
}

export default function GuideSidebar({ pageTitle }: GuideSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner');
  };

  const isActive = (href: string) => {
    if (href === '/guide-partner/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">{pageTitle || '导游后台'}</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-40 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <Logo className="w-8 h-8 text-orange-600" />
          <div>
            <span className="font-bold text-gray-900">NIIJIMA</span>
            <p className="text-xs text-gray-500">Guide Partner</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${
                    active
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : item.highlight
                        ? 'text-blue-600 hover:bg-blue-50 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {item.highlight && !active && (
                  <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
