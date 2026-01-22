'use client';

import { useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Shield, Server, Database, Users } from 'lucide-react';

// 安全的重定向路径验证
const getSafeRedirect = (redirect: string | null, allowedPrefix: string, defaultPath: string): string => {
  if (!redirect) return defaultPath;
  // 只允许相对路径且必须以指定前缀开头
  if (redirect.startsWith(allowedPrefix) && !redirect.includes('//') && !redirect.includes('..')) {
    return redirect;
  }
  return defaultPath;
};

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // 安全处理重定向路径
  const safeRedirect = useMemo(() =>
    getSafeRedirect(searchParams.get('redirect'), '/admin', '/admin'),
    [searchParams]
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      // 1. 登入
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('郵箱或密碼錯誤');
        } else {
          setError(authError.message);
        }
        return;
      }

      // 2. 取得 session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('獲取會話失敗');
        return;
      }

      // 3. 驗證是否是管理員
      const verifyResponse = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!verifyResponse.ok) {
        setError('該帳號不是管理員帳號');
        await supabase.auth.signOut();
        return;
      }

      // 成功 - 跳轉到管理後台（使用安全验证后的路径）
      router.push(safeRedirect);
      router.refresh();
    } catch {
      setError('登入失敗，請稍後重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-indigo-950/40"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Shield className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-wide">NIIJIMA</span>
              <p className="text-xs text-indigo-300 uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
            管理員控制台<br />
            <span className="text-indigo-300">系統管理中心</span>
          </h1>
          <p className="text-indigo-200 leading-relaxed mb-8 max-w-md">
            管理系統核心功能：
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <Users className="w-6 h-6 text-indigo-300 mb-2" />
              <h3 className="font-medium text-white mb-1">導遊管理</h3>
              <p className="text-xs text-indigo-300">KYC審核・等級調整</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <Database className="w-6 h-6 text-indigo-300 mb-2" />
              <h3 className="font-medium text-white mb-1">結算系統</h3>
              <p className="text-xs text-indigo-300">提現審核・財務管理</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <Server className="w-6 h-6 text-indigo-300 mb-2" />
              <h3 className="font-medium text-white mb-1">店鋪管理</h3>
              <p className="text-xs text-indigo-300">合作店鋪・價格設定</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <Shield className="w-6 h-6 text-indigo-300 mb-2" />
              <h3 className="font-medium text-white mb-1">新聞管理</h3>
              <p className="text-xs text-indigo-300">公告發布・內容管理</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Admin Console</span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">管理員登入</h1>
              <p className="text-gray-500 mt-2 text-sm">請使用管理員帳號登入</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">郵箱</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">密碼</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    驗證中...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    登入管理後台
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">注意</p>
                    <p className="text-amber-700 mt-1">
                      此頁面僅供管理員使用。如果您是導遊合夥人，請前往{' '}
                      <Link href="/guide-partner/login" className="text-indigo-600 hover:underline font-medium">
                        導遊登入頁面
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
                ← 返回首頁
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              新島交通株式会社 管理系統<br />
              v2.0 | Powered by Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
