'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage, type Language } from '@/hooks/useLanguage';
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
  label: Record<Language, string>;
  href: string;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: { ja: 'ダッシュボード', 'zh-CN': '控制台', 'zh-TW': '控制台', en: 'Dashboard' }, href: '/guide-partner/dashboard' },
  { icon: Store, label: { ja: '店舗一覧', 'zh-CN': '店铺列表', 'zh-TW': '店舖列表', en: 'Venues' }, href: '/guide-partner/venues' },
  { icon: Calendar, label: { ja: '予約管理', 'zh-CN': '我的预约', 'zh-TW': '我的預約', en: 'My Bookings' }, href: '/guide-partner/bookings' },
  { icon: Wallet, label: { ja: '報酬精算', 'zh-CN': '返金结算', 'zh-TW': '報酬結算', en: 'Commission' }, href: '/guide-partner/commission' },
  { icon: Users, label: { ja: '紹介管理', 'zh-CN': '我的推荐', 'zh-TW': '我的推薦', en: 'Referrals' }, href: '/guide-partner/referrals' },
  { icon: Trophy, label: { ja: 'ランキング', 'zh-CN': '排行榜', 'zh-TW': '排行榜', en: 'Leaderboard' }, href: '/guide-partner/leaderboard' },
  { icon: Globe, label: { ja: '販売ページ', 'zh-CN': '分销页面', 'zh-TW': '分銷頁面', en: 'White Label' }, href: '/guide-partner/whitelabel', highlight: true },
  { icon: Headphones, label: { ja: 'サポート', 'zh-CN': '客服支持', 'zh-TW': '客服支持', en: 'Support' }, href: '/guide-partner/support' },
  { icon: Settings, label: { ja: 'アカウント設定', 'zh-CN': '账户设置', 'zh-TW': '帳戶設定', en: 'Settings' }, href: '/guide-partner/settings' },
];

const sidebarTranslations = {
  guideBackend: {
    ja: 'ガイド管理画面',
    'zh-CN': '导游后台',
    'zh-TW': '導遊後台',
    en: 'Guide Dashboard',
  },
  logout: {
    ja: 'ログアウト',
    'zh-CN': '退出登录',
    'zh-TW': '退出登入',
    en: 'Logout',
  },
} as const;

const ts = (key: keyof typeof sidebarTranslations, lang: Language): string => {
  return sidebarTranslations[key][lang];
};

interface GuideSidebarProps {
  pageTitle?: string;
}

export default function GuideSidebar({ pageTitle }: GuideSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const lang = useLanguage();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner');
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-brand-600" />
          <span className="font-bold">{pageTitle || ts('guideBackend', lang)}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="compact" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-40 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <Logo className="w-8 h-8 text-brand-600" />
          <div>
            <span className="font-serif font-bold text-gray-900 tracking-wider">NIIJIMA</span>
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
                      ? 'bg-brand-50 text-brand-600 font-medium'
                      : item.highlight
                        ? 'text-blue-600 hover:bg-blue-50 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label[lang]}</span>
                {item.highlight && !active && (
                  <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-1">
          <div className="px-4 py-2">
            <LanguageSwitcher variant="compact" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>{ts('logout', lang)}</span>
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
