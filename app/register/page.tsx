'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MemberLayout from '@/components/MemberLayout';
import Logo from '@/components/Logo';
import { Mail, Lock, User, Loader2, AlertCircle, Eye, EyeOff, CheckCircle, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致');
      return;
    }

    if (password.length < 6) {
      setError('密碼至少需要6個字符');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setError('此郵箱已被註冊，請直接登入');
        } else {
          setError(error.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError('註冊失敗，請稍後重試');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <MemberLayout showFooter={false}>
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">註冊成功！</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              我們已向 <span className="font-bold text-gray-900">{email}</span> 發送驗證郵件，請點擊郵件中的連結完成驗證。
            </p>
            <Link
              href="/login"
              className="block w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg"
            >
              前往登入
            </Link>
            <p className="text-sm text-gray-400 mt-6">沒有收到郵件？請檢查垃圾郵件匣</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout showFooter={false}>
      <div className="min-h-[calc(100vh-80px)] flex">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50"></div>
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <div className="flex items-center gap-3 mb-8">
              <Logo className="w-12 h-12 text-white" />
              <div>
                <span className="font-serif font-bold text-2xl tracking-wide">NIIJIMA</span>
                <p className="text-xs text-blue-200 uppercase tracking-widest">Medical Tourism</p>
              </div>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
              加入我們<br />
              <span className="text-blue-400">開啟健康之旅</span>
            </h1>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-md">
              註冊成為會員，享受便捷的預約管理、訂單查詢，以及專屬的健檢套餐推薦服務。
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">一鍵管理所有預約</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">專屬會員優惠通知</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">AI 智能健康分析</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <Logo className="w-10 h-10 text-blue-600" />
              <span className="font-serif font-bold text-xl">NIIJIMA</span>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  <UserPlus className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">會員註冊</h1>
                <p className="text-gray-500 mt-2 text-sm">創建帳號以管理您的預約</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="您的姓名" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電子郵箱</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">密碼</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="至少6個字符" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">確認密碼</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="再次輸入密碼" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6">
                  {loading ? <><Loader2 className="animate-spin" size={20} />註冊中...</> : '立即註冊'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">已有帳號？<Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1">立即登入</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
