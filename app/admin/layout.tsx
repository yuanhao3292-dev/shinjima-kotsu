'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
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
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: '控制台', href: '/admin' },
  { icon: UserCheck, label: 'KYC 審核', href: '/admin/kyc' },
  { icon: Users, label: '導遊管理', href: '/admin/guides' },
  { icon: Wallet, label: '結算審核', href: '/admin/settlements' },
  { icon: Headphones, label: '客服工單', href: '/admin/support' },
  { icon: Store, label: '店鋪管理', href: '/admin/venues' },
  { icon: CalendarCheck, label: '預約管理', href: '/admin/bookings' },
  { icon: Newspaper, label: '新聞管理', href: '/admin/news' },
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
  const pathname = usePathname();

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
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-indigo-900 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-white">
          <Shield size={24} />
          <span className="font-bold">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-indigo-900 z-40 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-indigo-800">
          <Logo className="w-8 h-8 text-white" />
          <div>
            <span className="font-bold text-white">NIIJIMA</span>
            <p className="text-xs text-indigo-300">Admin Panel</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
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
                    ? 'bg-indigo-800 text-white font-medium'
                    : 'text-indigo-200 hover:bg-indigo-800/50'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-indigo-300 text-xs">登入帳號</p>
            <p className="text-white text-sm truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-indigo-200 hover:bg-indigo-800/50 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>退出登入</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
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
