'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useBasePathname } from '@/hooks/useLanguage';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Wallet,
  Store,
  Headphones,
  Newspaper,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  Shield,
  Loader2,
  Puzzle,
  FileText,
  ClipboardCheck,
  BarChart3,
  Target,
  Building2,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: '控制台', href: '/admin' },
  { icon: BarChart3, label: '数据分析', href: '/admin/analytics' },
  { icon: Target, label: 'Data Flywheel', href: '/admin/outcomes' },
  { icon: Building2, label: 'Enterprise B2B', href: '/admin/enterprises' },
  { icon: UserCheck, label: 'KYC 審核', href: '/admin/kyc' },
  { icon: Users, label: '導遊管理', href: '/admin/guides' },
  { icon: Wallet, label: '結算審核', href: '/admin/settlements' },
  { icon: Headphones, label: '客服工單', href: '/admin/support' },
  { icon: Store, label: '店鋪管理', href: '/admin/venues' },
  { icon: CalendarCheck, label: '預約管理', href: '/admin/bookings' },
  { icon: Puzzle, label: '頁面模塊', href: '/admin/page-modules' },
  { icon: Newspaper, label: '新聞管理', href: '/admin/news' },
  { icon: FileText, label: '合同管理', href: '/admin/contracts' },
  { icon: ClipboardCheck, label: '合規審查', href: '/admin/compliance' },
  { icon: Shield, label: 'AI 審核台', href: '/admin/reviews' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  // 用去掉语言前缀的路径做路由匹配 —— usePathname() 带 /ja、/zh-CN 前缀
  const pathname = useBasePathname();

  // 使用 useMemo 避免每次渲染都创建新的客户端
  const supabase = useMemo(() => createClient(), []);

  const checkAdminAccess = useCallback(async () => {
    // 登录页面不需要权限检查
    if (pathname === '/admin/login') {
      setLoading(false);
      setIsAdmin(true); // 允许渲染登录页面
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        router.push('/admin/login');
        return;
      }

      setUserEmail(user.email);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        setIsAdmin(true);
      } else {
        // 非管理员用户，重定向到管理员登录页
        await supabase.auth.signOut();
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Admin check error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [supabase, router, pathname]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">驗證管理員權限...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // 登录页面不显示侧边栏
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶栏：与官网主页同一套设计（渐变带 + 同款字标），保持全站统一 */}
      <header className="fixed top-0 left-0 right-0 h-16 brand-gradient-nav z-50 flex items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg tracking-wide leading-none text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.12)]">NIIJIMA</span>
            <span className="text-[10px] uppercase tracking-widest leading-none mt-1 text-white/85">新島交通株式会社</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-white text-brand-700 shadow-md">管理後台</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white lg:hidden">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Sidebar：白底黑字，从顶栏下方开始 */}
      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-neutral-200 z-40 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px - 100px)' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${isActive
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-900 hover:bg-neutral-100'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 bg-white">
          <div className="px-4 py-2 mb-2">
            <p className="text-neutral-500 text-xs">登入帳號</p>
            <p className="text-neutral-900 text-sm truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-neutral-900 hover:bg-neutral-100 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>退出登入</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        {children}
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
