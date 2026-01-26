'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import Logo from '@/components/Logo';
import { User, Phone, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, MessageCircle } from 'lucide-react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const referrerCode = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    wechatId: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [referrerName, setReferrerName] = useState<string | null>(null);

  // 如果有推荐码，查询推荐人信息
  useEffect(() => {
    if (referrerCode) {
      const supabase = createClient();
      supabase
        .from('guides')
        .select('name')
        .eq('referral_code', referrerCode.toUpperCase())
        .eq('status', 'approved')
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setReferrerName(data.name);
          }
          // 无效推荐码静默处理，不影响注册流程
        });
    }
  }, [referrerCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 前端驗證
    if (formData.password !== formData.confirmPassword) {
      setError('兩次輸入的密碼不一致');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('密碼至少需要 8 位字符');
      setLoading(false);
      return;
    }

    try {
      // 調用服務端 API 完成註冊
      const response = await fetch('/api/guide/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone,
          wechat_id: formData.wechatId || undefined,
          password: formData.password,
          referrer_code: referrerCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 處理 API 錯誤
        setError(data.error?.message || '註冊失敗，請稍後重試');
        setLoading(false);
        return;
      }

      // 註冊成功
      setSuccess(true);
    } catch (err) {
      console.error('註冊錯誤:', err);
      setError('註冊失敗，請稍後重試');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-gradient-to-b from-orange-50 to-white">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">註冊成功！</h2>
          <p className="text-gray-600 mb-6">
            您的導遊帳號已創建成功。<br />
            現在可以登錄並開始使用了。
          </p>
          <Link
            href="/guide-partner/login"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition"
          >
            前往登入
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2000')] bg-cover bg-center opacity-20"></div>
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
            加入導遊提攜夥伴<br />
            <span className="text-amber-200">客戶介紹計劃</span>
          </h1>
          <p className="text-orange-100 leading-relaxed mb-8 max-w-md">
            介紹客戶給新島交通，成功即獲介紹報酬。
            夜總會、健檢、醫療——豐富服務資源等您推薦。
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-amber-200 font-bold">1</span>
              </div>
              <span>填寫資訊，註冊帳號</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-amber-200 font-bold">2</span>
              </div>
              <span>登錄後台，獲得專屬推薦碼</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-amber-200 font-bold">3</span>
              </div>
              <span>介紹客戶成功，獲得介紹報酬</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Logo className="w-10 h-10 text-orange-600" />
            <span className="font-serif font-bold text-xl">NIIJIMA</span>
          </div>

          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">導遊註冊</h1>
              <p className="text-gray-500 mt-2 text-sm">填寫資訊申請成為合夥人</p>
            </div>

            {/* 推荐人提示 */}
            {referrerName && (
              <div className="mb-6 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-xl text-sm">
                <span className="font-medium">{referrerName}</span> 邀請您加入
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 姓名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="您的姓名"
                  />
                </div>
              </div>

              {/* 手機號 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">手機號 *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="日本或中國手機號"
                  />
                </div>
              </div>

              {/* 郵箱 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">郵箱 *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* 微信 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">微信號（選填）</label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.wechatId}
                    onChange={(e) => setFormData({ ...formData, wechatId: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="您的微信號"
                  />
                </div>
              </div>

              {/* 密碼 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">設置密碼 *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="至少 8 位字符"
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

              {/* 確認密碼 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">確認密碼 *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="再次輸入密碼"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    提交中...
                  </>
                ) : (
                  '提交申請'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                已有帳號？
                <Link href="/guide-partner/login" className="text-orange-600 hover:text-orange-700 font-bold ml-1">
                  立即登入
                </Link>
              </p>
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

export default function GuideRegisterPage() {
  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      <div className="pt-20">
        <Suspense fallback={<LoadingFallback />}>
          <RegisterForm />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
