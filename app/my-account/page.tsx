'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MemberLayout from '@/components/MemberLayout';
import { User } from '@supabase/supabase-js';
import {
  User as UserIcon,
  Mail,
  Calendar,
  ClipboardList,
  LogOut,
  Loader2,
  ChevronRight,
  Shield,
  Heart,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

export default function MyAccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <MemberLayout showFooter={false}>
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">載入中...</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '會員';
  const memberSince = new Date(user.created_at).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <MemberLayout showFooter={false}>
      <div className="min-h-[calc(100vh-80px)] flex">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50"></div>
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
              歡迎回來<br />
              <span className="text-blue-400">{userName}</span>
            </h1>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-md">
              在這裡管理您的健檢預約、查看訂單記錄，享受專屬會員服務。
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">24小時客服支援</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">中文服務</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Account Info */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-gray-900">{userName}</h1>
                  <p className="text-gray-500 text-sm">歡迎回來！</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{user.email}</span>
                  {user.email_confirmed_at && (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                      <Shield className="w-3 h-3" />
                      已驗證
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">加入於 {memberSince}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-6">
              <Link
                href="/my-orders"
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">我的訂單</h3>
                    <p className="text-sm text-gray-500">查看所有預約記錄</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href="/medical-packages"
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">預約體檢</h3>
                    <p className="text-sm text-gray-500">瀏覽健檢套餐</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href="/health-screening"
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      AI 健康篩查
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                        <Sparkles className="w-3 h-3" />
                        免費
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500">AI 分析健康風險，推薦日本先端治療</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href="/cancer-treatment"
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
                    <HeartPulse className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">日本綜合治療</h3>
                    <p className="text-sm text-gray-500">質子重離子、光免疫療法、BNCT</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl shadow-lg border border-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              {loggingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  登出中...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  登出
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
