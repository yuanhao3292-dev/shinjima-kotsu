'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import { User, Phone, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const translations = {
  // Success page
  successTitle: {
    ja: '登録完了！',
    'zh-CN': '注册成功！',
    'zh-TW': '註冊成功！',
    en: 'Registration Successful!',
  },
  successMessage: {
    ja: 'ガイドアカウントが作成されました。',
    'zh-CN': '您的导游账号已创建成功。',
    'zh-TW': '您的導遊帳號已創建成功。',
    en: 'Your guide account has been created successfully.',
  },
  successSubMessage: {
    ja: 'ログインしてご利用を開始できます。',
    'zh-CN': '现在可以登录并开始使用了。',
    'zh-TW': '現在可以登錄並開始使用了。',
    en: 'You can now log in and start using the platform.',
  },
  goToLogin: {
    ja: 'ログインへ',
    'zh-CN': '前往登录',
    'zh-TW': '前往登入',
    en: 'Go to Login',
  },
  // Hero section
  heroTitle1: {
    ja: 'ガイド提携パートナー',
    'zh-CN': '加入导游提携伙伴',
    'zh-TW': '加入導遊提攜夥伴',
    en: 'Join Guide Partner',
  },
  heroTitle2: {
    ja: 'お客様紹介プログラム',
    'zh-CN': '客户介绍计划',
    'zh-TW': '客戶介紹計劃',
    en: 'Client Referral Program',
  },
  heroDesc: {
    ja: 'お客様を新島交通にご紹介いただき、成功すれば紹介報酬を獲得できます。ナイトクラブ、健診、医療——豊富なサービスをご紹介ください。',
    'zh-CN': '介绍客户给新岛交通，成功即获介绍报酬。夜总会、健检、医疗——丰富服务资源等您推荐。',
    'zh-TW': '介紹客戶給新島交通，成功即獲介紹報酬。夜總會、健檢、醫療——豐富服務資源等您推薦。',
    en: 'Refer clients to Niijima Kotsu and earn referral rewards. Nightclubs, health checkups, medical services — a wide range of services for you to recommend.',
  },
  step1: {
    ja: '情報を入力し、アカウントを登録',
    'zh-CN': '填写资讯，注册账号',
    'zh-TW': '填寫資訊，註冊帳號',
    en: 'Fill in your info and register',
  },
  step2: {
    ja: 'ログインして専用紹介コードを取得',
    'zh-CN': '登录后台，获得专属推荐码',
    'zh-TW': '登錄後台，獲得專屬推薦碼',
    en: 'Log in and get your referral code',
  },
  step3: {
    ja: 'お客様を紹介して報酬を獲得',
    'zh-CN': '介绍客户成功，获得介绍报酬',
    'zh-TW': '介紹客戶成功，獲得介紹報酬',
    en: 'Refer clients and earn rewards',
  },
  // Form
  registerTitle: {
    ja: 'ガイド登録',
    'zh-CN': '导游注册',
    'zh-TW': '導遊註冊',
    en: 'Guide Registration',
  },
  registerSubtitle: {
    ja: '情報を入力してパートナー申請',
    'zh-CN': '填写资讯申请成为合伙人',
    'zh-TW': '填寫資訊申請成為合夥人',
    en: 'Fill in your details to apply as a partner',
  },
  referrerInvite: {
    ja: 'からのご招待',
    'zh-CN': ' 邀请您加入',
    'zh-TW': ' 邀請您加入',
    en: ' invited you to join',
  },
  labelName: {
    ja: '氏名 *',
    'zh-CN': '姓名 *',
    'zh-TW': '姓名 *',
    en: 'Full Name *',
  },
  placeholderName: {
    ja: 'お名前',
    'zh-CN': '您的姓名',
    'zh-TW': '您的姓名',
    en: 'Your name',
  },
  labelPhone: {
    ja: '電話番号 *',
    'zh-CN': '手机号 *',
    'zh-TW': '手機號 *',
    en: 'Phone Number *',
  },
  placeholderPhone: {
    ja: '日本または中国の電話番号',
    'zh-CN': '日本或中国手机号',
    'zh-TW': '日本或中國手機號',
    en: 'Japan or China phone number',
  },
  labelEmail: {
    ja: 'メールアドレス *',
    'zh-CN': '邮箱 *',
    'zh-TW': '郵箱 *',
    en: 'Email *',
  },
  labelWechat: {
    ja: 'WeChat ID（任意）',
    'zh-CN': '微信号（选填）',
    'zh-TW': '微信號（選填）',
    en: 'WeChat ID (Optional)',
  },
  placeholderWechat: {
    ja: 'WeChat ID',
    'zh-CN': '您的微信号',
    'zh-TW': '您的微信號',
    en: 'Your WeChat ID',
  },
  labelPassword: {
    ja: 'パスワード設定 *',
    'zh-CN': '设置密码 *',
    'zh-TW': '設置密碼 *',
    en: 'Set Password *',
  },
  placeholderPassword: {
    ja: '8文字以上',
    'zh-CN': '至少 8 位字符',
    'zh-TW': '至少 8 位字符',
    en: 'At least 8 characters',
  },
  labelConfirmPassword: {
    ja: 'パスワード確認 *',
    'zh-CN': '确认密码 *',
    'zh-TW': '確認密碼 *',
    en: 'Confirm Password *',
  },
  placeholderConfirmPassword: {
    ja: 'パスワードを再入力',
    'zh-CN': '再次输入密码',
    'zh-TW': '再次輸入密碼',
    en: 'Re-enter password',
  },
  submitting: {
    ja: '送信中...',
    'zh-CN': '提交中...',
    'zh-TW': '提交中...',
    en: 'Submitting...',
  },
  submitButton: {
    ja: '申請を提出',
    'zh-CN': '提交申请',
    'zh-TW': '提交申請',
    en: 'Submit Application',
  },
  hasAccount: {
    ja: 'アカウントをお持ちですか？',
    'zh-CN': '已有账号？',
    'zh-TW': '已有帳號？',
    en: 'Already have an account?',
  },
  loginNow: {
    ja: '今すぐログイン',
    'zh-CN': '立即登录',
    'zh-TW': '立即登入',
    en: 'Log in now',
  },
  // Error messages
  errorPasswordMismatch: {
    ja: 'パスワードが一致しません',
    'zh-CN': '两次输入的密码不一致',
    'zh-TW': '兩次輸入的密碼不一致',
    en: 'Passwords do not match',
  },
  errorPasswordLength: {
    ja: 'パスワードは8文字以上必要です',
    'zh-CN': '密码至少需要 8 位字符',
    'zh-TW': '密碼至少需要 8 位字符',
    en: 'Password must be at least 8 characters',
  },
  errorRegisterFailed: {
    ja: '登録に失敗しました。後ほど再度お試しください',
    'zh-CN': '注册失败，请稍后重试',
    'zh-TW': '註冊失敗，請稍後重試',
    en: 'Registration failed. Please try again later',
  },
  // Footer
  footerLegal: {
    ja: '本サービスは新島交通株式会社が提供しています',
    'zh-CN': '本服务由新岛交通株式会社提供',
    'zh-TW': '本服務由新島交通株式會社提供',
    en: 'This service is provided by Niijima Kotsu Co., Ltd.',
  },
  footerLicense: {
    ja: '大阪府知事登録旅行業 第2-3115号 ｜ JATA正会員',
    'zh-CN': '大阪府知事登录旅行业 第2-3115号 ｜ JATA正会员',
    'zh-TW': '大阪府知事登錄旅行業 第2-3115號 ｜ JATA正會員',
    en: 'Osaka Governor Registered Travel Agency No. 2-3115 | JATA Member',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

function RegisterForm() {
  const searchParams = useSearchParams();
  const referrerCode = searchParams.get('ref') || '';
  const lang = useLanguage();

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
      setError(t('errorPasswordMismatch', lang));
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError(t('errorPasswordLength', lang));
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
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          wechat_id: formData.wechatId || undefined,
          password: formData.password,
          referrer_code: referrerCode || undefined,
          locale: lang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 處理 API 錯誤
        setError(data.error || t('errorRegisterFailed', lang));
        setLoading(false);
        return;
      }

      // 註冊成功
      setSuccess(true);
    } catch (err) {
      console.error('註冊錯誤:', err);
      setError(t('errorRegisterFailed', lang));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-gradient-to-b from-brand-50 to-white">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('successTitle', lang)}</h2>
          <p className="text-gray-600 mb-6">
            {t('successMessage', lang)}<br />
            {t('successSubMessage', lang)}
          </p>
          <Link
            href="/guide-partner/login"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl transition"
          >
            {t('goToLogin', lang)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-600 via-brand-500 to-amber-500">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2000')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 via-transparent to-brand-900/30"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-wide leading-none">NIIJIMA</span>
              <span className="text-[10px] uppercase tracking-widest leading-none mt-1 text-white/60">
                {{ ja: '新島交通株式会社', 'zh-TW': '新島交通株式會社', 'zh-CN': '新岛交通株式会社', en: 'Niijima Kotsu Co., Ltd.' }[lang]}
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
            {t('heroTitle1', lang)}<br />
            <span className="text-amber-200">{t('heroTitle2', lang)}</span>
          </h1>
          <p className="text-brand-100 leading-relaxed mb-8 max-w-md">
            {t('heroDesc', lang)}
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-amber-200 font-bold">1</span>
              </div>
              <span>{t('step1', lang)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-amber-200 font-bold">2</span>
              </div>
              <span>{t('step2', lang)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-amber-200 font-bold">3</span>
              </div>
              <span>{t('step3', lang)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex flex-col items-center">
              <span className="font-serif font-bold text-lg tracking-wide leading-none text-neutral-900">NIIJIMA</span>
              <span className="text-[10px] uppercase tracking-widest leading-none mt-1 text-neutral-400">
                {{ ja: '新島交通株式会社', 'zh-TW': '新島交通株式會社', 'zh-CN': '新岛交通株式会社', en: 'Niijima Kotsu Co., Ltd.' }[lang]}
              </span>
            </div>
          </div>

          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-full mb-4">
                <User className="w-8 h-8 text-brand-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">{t('registerTitle', lang)}</h1>
              <p className="text-gray-500 mt-2 text-sm">{t('registerSubtitle', lang)}</p>
            </div>

            {/* 推荐人提示 */}
            {referrerName && (
              <div className="mb-6 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-xl text-sm">
                <span className="font-medium">{referrerName}</span>{t('referrerInvite', lang)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('labelName', lang)}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder={t('placeholderName', lang)}
                  />
                </div>
              </div>

              {/* 手機號 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('labelPhone', lang)}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder={t('placeholderPhone', lang)}
                  />
                </div>
              </div>

              {/* 郵箱 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('labelEmail', lang)}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* 微信 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('labelWechat', lang)}</label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.wechatId}
                    onChange={(e) => setFormData({ ...formData, wechatId: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder={t('placeholderWechat', lang)}
                  />
                </div>
              </div>

              {/* 密碼 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('labelPassword', lang)}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder={t('placeholderPassword', lang)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('labelConfirmPassword', lang)}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder={t('placeholderConfirmPassword', lang)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t('submitting', lang)}
                  </>
                ) : (
                  t('submitButton', lang)
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {t('hasAccount', lang)}
                <Link href="/guide-partner/login" className="text-brand-600 hover:text-brand-700 font-bold ml-1">
                  {t('loginNow', lang)}
                </Link>
              </p>
            </div>

            {/* 法律声明 */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {t('footerLegal', lang)}<br />
                {t('footerLicense', lang)}
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
