'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from './Logo';
import { Mail, Phone, Printer, MapPin, User, LogOut } from 'lucide-react';

interface MemberLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function MemberLayout({ children, showFooter = true }: MemberLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const pathname = usePathname();
  const supabase = createClient();

  // 判断当前是否在会员相关页面
  const isMemberPage = ['/my-account', '/my-orders', '/login', '/register', '/forgot-password', '/reset-password', '/order-lookup'].some(
    path => pathname?.startsWith(path)
  );

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '會員');
      }
    };
    checkAuth();

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '會員');
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-100 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo - 会员页面点击返回会员中心，否则返回首页 */}
          <Link
            href={isLoggedIn && isMemberPage ? '/my-account' : '/'}
            className="flex items-center gap-3 group"
          >
            <Logo className="w-10 h-10 text-black group-hover:text-blue-600 transition-colors" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-wide leading-none text-gray-900">NIIJIMA</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-1 group-hover:text-blue-500 transition-colors">Medical Tourism</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">首頁</Link>
            <Link href="/medical-packages" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">健檢套餐</Link>
            <Link href="/health-screening" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">AI 健康篩查</Link>
            <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">常見問題</Link>
          </div>

          {/* Actions - 根据登录状态显示不同内容 */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/my-account"
                  className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-blue-700 transition shadow-lg"
                >
                  <User size={14} />
                  {userName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1 text-gray-500 hover:text-red-600 transition text-xs"
                  title="登出"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-gray-800 transition shadow-lg"
              >
                會員登入
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-[#111] text-white py-16 border-t border-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Column 1: Brand */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Logo className="w-10 h-10 text-white" />
                  <span className="text-xl font-serif tracking-widest font-bold">NIIJIMA</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  專業日本醫療旅遊服務<br/>
                  TIMC 大阪德洲會國際醫療中心
                </p>
                <p className="text-gray-500 text-xs">
                  &copy; 2025 Niijima Kotsu Co., Ltd.<br/>All Rights Reserved.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6">快速連結</h4>
                <div className="space-y-3 text-sm text-gray-400">
                  <Link href="/medical-packages" className="block hover:text-white transition">健檢套餐</Link>
                  <Link href="/health-screening" className="block hover:text-white transition">AI 健康篩查</Link>
                  <Link href="/order-lookup" className="block hover:text-white transition">訂單查詢</Link>
                  <Link href="/faq" className="block hover:text-white transition">常見問題</Link>
                  {isLoggedIn && (
                    <>
                      <Link href="/my-account" className="block hover:text-white transition">會員中心</Link>
                      <Link href="/my-orders" className="block hover:text-white transition">我的訂單</Link>
                    </>
                  )}
                </div>
              </div>

              {/* Column 3: Contact */}
              <div>
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6">聯繫我們</h4>
                <div className="space-y-3 text-sm text-gray-400">
                  <p className="flex items-center gap-3"><Mail size={16} /> info@niijima-koutsu.jp</p>
                  <p className="flex items-center gap-3"><Phone size={16} /> 06-6632-8807</p>
                  <p className="flex items-center gap-3"><Printer size={16} /> 06-6632-8826 (FAX)</p>
                  <p className="flex items-start gap-3 mt-4">
                    <MapPin size={16} className="mt-1 min-w-[16px]" />
                    <span>〒556-0014<br/>大阪府大阪市浪速区大国1-2-21-602</span>
                  </p>
                </div>
              </div>

              {/* Column 4: LINE Support */}
              <div>
                <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  LINE 客服
                </h4>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <p className="text-xs text-gray-500 mb-2">掃碼添加 LINE 客服</p>
                  <a
                    href="https://line.me/ti/p/j3XxBP50j9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#06C755] font-bold hover:underline"
                  >
                    @niijima-medical
                  </a>
                  <p className="text-xs text-gray-500 mt-3">24小時內回覆</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
              <div className="flex gap-6">
                <span className="hover:text-gray-300 cursor-pointer transition">隱私政策</span>
                <span className="hover:text-gray-300 cursor-pointer transition">服務條款</span>
              </div>
              <div className="mt-4 md:mt-0">
                Powered by Niijima AI System
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
