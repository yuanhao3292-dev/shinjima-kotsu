'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import Logo from '@/components/Logo';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, User } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/guide-partner/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      // 1. 登入
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
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

      // 2. 檢查是否是導遊
      const { data: guide, error: guideError } = await supabase
        .from('guides')
        .select('id, status')
        .eq('auth_user_id', authData.user?.id)
        .single();

      if (guideError || !guide) {
        setError('該帳號不是導遊帳號');
        await supabase.auth.signOut();
        return;
      }

      // 3. 檢查審核狀態
      if (guide.status === 'pending') {
        setError('您的帳號正在審核中，請耐心等待');
        await supabase.auth.signOut();
        return;
      }

      if (guide.status === 'rejected') {
        setError('您的申請未通過審核');
        await supabase.auth.signOut();
        return;
      }

      if (guide.status === 'suspended') {
        setError('您的帳號已被暫停，請聯繫管理員');
        await supabase.auth.signOut();
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError('登入失敗，請稍後重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 via-transparent to-orange-900/30"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <Logo className="w-12 h-12 text-white" />
            <div>
              <span className="font-serif font-bold text-2xl tracking-wide">NIIJIMA</span>
              <p className="text-xs text-orange-200 uppercase tracking-widest">Guide Partner</p>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
            導遊合夥人系統<br />
            <span className="text-amber-200">輕鬆管理您的業務</span>
          </h1>
          <p className="text-orange-100 leading-relaxed mb-8 max-w-md">
            登入後您可以：
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              瀏覽 160+ 高端夜總會
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              為客戶預約服務
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              查看返金和結算記錄
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              推薦新導遊賺取獎勵
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Logo className="w-10 h-10 text-orange-600" />
            <span className="font-serif font-bold text-xl">NIIJIMA</span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">導遊登入</h1>
              <p className="text-gray-500 mt-2 text-sm">登入您的合夥人帳號</p>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="your@email.com"
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
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
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
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    登入中...
                  </>
                ) : (
                  '登入'
                )}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-400">或</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                還沒有帳號？
                <Link href="/guide-partner/register" className="text-orange-600 hover:text-orange-700 font-bold ml-1">
                  申請成為合夥人
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <Link href="/guide-partner" className="text-gray-500 hover:text-gray-700 text-sm">
                ← 返回導遊合夥人首頁
              </Link>
            </div>

            {/* 法律声明 */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                本サービスは新島交通株式会社が提供しています<br />
                大阪府知事登録旅行業 第2-3115号 ｜ JATA正会員
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
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

export default function GuideLoginPage() {
  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      <div className="pt-20">
        <Suspense fallback={<LoadingFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
