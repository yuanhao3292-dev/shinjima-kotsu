'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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
  { icon: LayoutDashboard, label: { ja: 'ダッシュボード', 'zh-CN': '控制台', 'zh-TW': '控制台', en: 'Dashboard', ko: '대시보드' }, href: '/guide-partner/dashboard' },
  { icon: Store, label: { ja: 'ナイトクラブ', 'zh-CN': '夜总会', 'zh-TW': '夜總會', en: 'Nightclubs', ko: '나이트클럽' }, href: '/guide-partner/venues' },
  { icon: Calendar, label: { ja: '予約管理', 'zh-CN': '我的预约', 'zh-TW': '我的預約', en: 'My Bookings', ko: '예약 관리' }, href: '/guide-partner/bookings' },
  { icon: Wallet, label: { ja: '報酬精算', 'zh-CN': '返金结算', 'zh-TW': '報酬結算', en: 'Commission', ko: '커미션' }, href: '/guide-partner/commission' },
  { icon: Users, label: { ja: '紹介管理', 'zh-CN': '我的推荐', 'zh-TW': '我的推薦', en: 'Referrals', ko: '추천' }, href: '/guide-partner/referrals' },
  { icon: Trophy, label: { ja: 'ランキング', 'zh-CN': '排行榜', 'zh-TW': '排行榜', en: 'Leaderboard', ko: '리더보드' }, href: '/guide-partner/leaderboard' },
  { icon: Globe, label: { ja: '販売ページ', 'zh-CN': '分销页面', 'zh-TW': '分銷頁面', en: 'White Label', ko: '화이트라벨' }, href: '/guide-partner/whitelabel', highlight: true },
  { icon: Headphones, label: { ja: 'サポート', 'zh-CN': '客服支持', 'zh-TW': '客服支持', en: 'Support', ko: '지원' }, href: '/guide-partner/support' },
  { icon: Settings, label: { ja: 'アカウント設定', 'zh-CN': '账户设置', 'zh-TW': '帳戶設定', en: 'Settings', ko: '설정' }, href: '/guide-partner/settings' },
];

const sidebarTranslations = {
  guideBackend: {
    ja: 'ガイド管理画面',
    'zh-CN': '导游后台',
    'zh-TW': '導遊後台',
    en: 'Guide Dashboard',
    ko: '가이드 대시보드',
  },
  logout: {
    ja: 'ログアウト',
    'zh-CN': '退出登录',
    'zh-TW': '退出登入',
    en: 'Logout',
    ko: '로그아웃',
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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="font-serif font-bold text-lg tracking-wide leading-none text-neutral-900">NIIJIMA</span>
            <span className="text-[10px] uppercase tracking-widest leading-none mt-1 text-neutral-400">{pageTitle || ts('guideBackend', lang)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="compact" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-neutral-600">
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
        <div className="h-20 flex items-center gap-3 px-6 border-b">
          <div className="flex flex-col items-center">
            <span className="font-serif font-bold text-lg tracking-wide leading-none text-neutral-900">NIIJIMA</span>
            <span className="text-[10px] uppercase tracking-widest leading-none mt-1 text-neutral-400">{ts('guideBackend', lang)}</span>
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
                  flex items-center gap-3 px-4 py-3 text-sm font-medium transition
                  ${
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-neutral-600 hover:text-brand-700 hover:bg-neutral-50'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label[lang]}</span>
                {item.highlight && !active && (
                  <span className="ml-auto px-2 py-0.5 bg-gold-400/10 text-gold-700 text-xs font-medium border border-gold-400/30">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-1">
          <LanguageSwitcher variant="sidebar" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-neutral-600 hover:text-brand-700 hover:bg-neutral-50 text-sm font-medium transition"
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
