'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import MemberLayout from '@/components/MemberLayout';
import Logo from '@/components/Logo';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, User } from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useSiteImages } from '@/lib/hooks/useSiteImages';

// ==================== 翻译对象 ====================
const translations = {
  // Hero 区域
  heroTitle: {
    ja: 'NIIJIMA スマート医療サービスプラットフォーム',
    'zh-CN': 'NIIJIMA 智能医疗服务平台',
    'zh-TW': 'NIIJIMA 智能醫療服務平台',
    en: 'NIIJIMA Smart Medical Service Platform',
  },
  heroSubtitle: {
    ja: 'AI健康スクリーニング · 会員予約管理 · 日本医療リソース連携',
    'zh-CN': 'AI 健康筛查 · 会员预约管理 · 日本医疗资源对接',
    'zh-TW': 'AI 健康篩查 · 會員預約管理 · 日本醫療資源對接',
    en: 'AI Health Screening · Appointment Management · Japan Medical Coordination',
  },
  heroDescription: {
    ja: 'NIIJIMAは、専門的な訪日医療コーディネートサービスを提供します。AIスマートスクリーニングシステムにより、最適な医療プランをマッチングし、徳洲会国際医療センター(TIMC)、日本トップクラスのがん専門病院、幹細胞クリニックなどの優良医療リソースの予約管理サービスを提供します。',
    'zh-CN': 'NIIJIMA 为您提供专业的访日医疗对接服务。通过 AI 智能筛查系统，为您匹配最适合的医疗方案，并提供德州会国际医疗中心(TIMC)、日本顶级癌症专科医院、干细胞诊所等优质医疗资源的预约管理服务。',
    'zh-TW': 'NIIJIMA 為您提供專業的訪日醫療對接服務。透過 AI 智能篩查系統，為您配對最適合的醫療方案，並提供德州會國際醫療中心(TIMC)、日本頂級癌症專科醫院、幹細胞診所等優質醫療資源的預約管理服務。',
    en: 'NIIJIMA provides professional Japan medical coordination services. Through our AI smart screening system, we match you with the most suitable medical plans and provide appointment management for premium resources including TIMC, top cancer specialty hospitals, and stem cell clinics.',
  },
  support24h: {
    ja: '24時間カスタマーサポート',
    'zh-CN': '24小时客服支持',
    'zh-TW': '24小時客服支援',
    en: '24/7 Customer Support',
  },
  chineseService: {
    ja: '中国語サービス',
    'zh-CN': '中文服务',
    'zh-TW': '中文服務',
    en: 'Chinese Service',
  },

  // 表单标题
  pageTitle: {
    ja: '会員ログイン',
    'zh-CN': '会员登录',
    'zh-TW': '會員登入',
    en: 'Member Login',
  },
  pageSubtitle: {
    ja: 'ログインしてAI健康スクリーニングと予約を管理',
    'zh-CN': '登录管理 AI 筛查和预约服务',
    'zh-TW': '登入管理 AI 篩查和預約服務',
    en: 'Login to manage AI screening and appointments',
  },

  // 表单字段
  emailLabel: {
    ja: 'メールアドレス',
    'zh-CN': '电子邮箱',
    'zh-TW': '電子郵箱',
    en: 'Email Address',
  },
  emailPlaceholder: {
    ja: 'your@email.com',
    'zh-CN': 'your@email.com',
    'zh-TW': 'your@email.com',
    en: 'your@email.com',
  },
  passwordLabel: {
    ja: 'パスワード',
    'zh-CN': '密码',
    'zh-TW': '密碼',
    en: 'Password',
  },
  passwordPlaceholder: {
    ja: '••••••••',
    'zh-CN': '••••••••',
    'zh-TW': '••••••••',
    en: '••••••••',
  },
  forgotPassword: {
    ja: 'パスワードを忘れましたか？',
    'zh-CN': '忘记密码？',
    'zh-TW': '忘記密碼？',
    en: 'Forgot Password?',
  },

  // 按钮文本
  loginButton: {
    ja: 'ログイン',
    'zh-CN': '登录',
    'zh-TW': '登入',
    en: 'Login',
  },
  loggingIn: {
    ja: 'ログイン中...',
    'zh-CN': '登录中...',
    'zh-TW': '登入中...',
    en: 'Logging in...',
  },

  // 分隔符
  or: {
    ja: 'または',
    'zh-CN': '或',
    'zh-TW': '或',
    en: 'or',
  },

  // 注册链接
  noAccount: {
    ja: 'アカウントをお持ちでないですか？',
    'zh-CN': '还没有账号？',
    'zh-TW': '還沒有帳號？',
    en: 'Don\'t have an account?',
  },
  registerNow: {
    ja: '今すぐ登録',
    'zh-CN': '立即注册',
    'zh-TW': '立即註冊',
    en: 'Register Now',
  },

  // 访客查询
  guestLookup: {
    ja: 'アカウントなしでも注文照会可能',
    'zh-CN': '没有账号也可以查询订单',
    'zh-TW': '沒有帳號也可以查詢訂單',
    en: 'You can check orders without an account',
  },
  useOrderNumber: {
    ja: '注文番号で照会 →',
    'zh-CN': '使用订单编号查询 →',
    'zh-TW': '使用訂單編號查詢 →',
    en: 'Check with Order Number →',
  },

  // 错误消息
  errorInvalidCredentials: {
    ja: 'メールアドレスまたはパスワードが間違っています',
    'zh-CN': '邮箱或密码错误',
    'zh-TW': '郵箱或密碼錯誤',
    en: 'Invalid email or password',
  },
  errorEmailNotConfirmed: {
    ja: 'メールアドレスを確認してください',
    'zh-CN': '请先验证您的邮箱',
    'zh-TW': '請先驗證您的郵箱',
    en: 'Please verify your email first',
  },
  errorLoginFailed: {
    ja: 'ログインに失敗しました。後でもう一度お試しください',
    'zh-CN': '登录失败，请稍后重试',
    'zh-TW': '登入失敗，請稍後重試',
    en: 'Login failed, please try again later',
  },
  errorAuthCallback: {
    ja: '認証に失敗しました。もう一度お試しください',
    'zh-CN': '认证失败，请重试',
    'zh-TW': '認證失敗，請重試',
    en: 'Authentication failed, please try again',
  },
  errorVerificationFailed: {
    ja: '検証に失敗しました。もう一度お試しください',
    'zh-CN': '验证失败，请重试',
    'zh-TW': '驗證失敗，請重試',
    en: 'Verification failed, please try again',
  },
  emailVerified: {
    ja: 'メールアドレスの認証が完了しました！以下からログインしてください。',
    'zh-CN': '邮箱验证成功！请在下方登录。',
    'zh-TW': '郵箱驗證成功！請在下方登入。',
    en: 'Email verified successfully! Please log in below.',
  },
} as const;

// 翻译辅助函数
const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

function LoginForm() {
  const lang = useLanguage();
  const { getImage } = useSiteImages();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/my-account';
  const urlError = searchParams.get('error');
  const verified = searchParams.get('verified');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError(t('errorInvalidCredentials', lang));
        } else if (authError.message.includes('Email not confirmed')) {
          setError(t('errorEmailNotConfirmed', lang));
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError(t('errorLoginFailed', lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900">
        <Image
          src={getImage('medical_hero', 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg')}
          alt="Medical"
          fill
          className="object-cover"
          quality={75}
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/30 to-brand-900/50"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <Logo className="w-12 h-12 text-white" />
            <div>
              <span className="font-serif font-bold text-2xl tracking-wide">NIIJIMA</span>
              <p className="text-xs text-brand-200 uppercase tracking-widest">Medical Tourism</p>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
            {t('heroTitle', lang)}<br/>
            <span className="text-brand-300">{t('heroSubtitle', lang)}</span>
          </h1>
          <p className="text-neutral-300 leading-relaxed mb-8 max-w-md">
            {t('heroDescription', lang)}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-neutral-300">{t('support24h', lang)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
              <span className="text-neutral-300">{t('chineseService', lang)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Logo className="w-10 h-10 text-brand-600" />
            <span className="font-serif font-bold text-xl">NIIJIMA</span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-full mb-4">
                <User className="w-8 h-8 text-brand-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-neutral-900">{t('pageTitle', lang)}</h1>
              <p className="text-neutral-500 mt-2 text-sm">{t('pageSubtitle', lang)}</p>
            </div>

            {/* Email Verified Success Message */}
            {verified && !error && !urlError && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{t('emailVerified', lang)}</span>
              </div>
            )}

            {/* Error Messages */}
            {(error || urlError) && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle size={18} />
                <span>
                  {error || (urlError === 'auth_callback_error' ? t('errorAuthCallback', lang) : t('errorVerificationFailed', lang))}
                </span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t('emailLabel', lang)}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder={t('emailPlaceholder', lang)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t('passwordLabel', lang)}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder={t('passwordPlaceholder', lang)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    {t('forgotPassword', lang)}
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-900 hover:bg-brand-800 disabled:bg-neutral-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t('loggingIn', lang)}
                  </>
                ) : (
                  t('loginButton', lang)
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="px-4 text-sm text-neutral-400">{t('or', lang)}</span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-neutral-600 text-sm">
                {t('noAccount', lang)}
                <Link
                  href="/register"
                  className="text-brand-600 hover:text-brand-700 font-bold ml-1"
                >
                  {t('registerNow', lang)}
                </Link>
              </p>
            </div>

            {/* Guest Order Lookup */}
            <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-400 mb-2">{t('guestLookup', lang)}</p>
              <Link
                href="/order-lookup"
                className="text-brand-600 hover:text-brand-700 text-sm font-medium inline-flex items-center gap-1"
              >
                {t('useOrderNumber', lang)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-neutral-200 rounded-full"></div>
          </div>
          <div className="h-8 bg-neutral-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-neutral-200 rounded-xl"></div>
            <div className="h-12 bg-neutral-200 rounded-xl"></div>
            <div className="h-12 bg-neutral-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <MemberLayout showFooter={false}>
      <Suspense fallback={<LoadingFallback />}>
        <LoginForm />
      </Suspense>
    </MemberLayout>
  );
}
