'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useSiteImages } from '@/lib/hooks/useSiteImages';

// ==================== Translations ====================
const translations = {
  heroLabel: {
    ja: 'MEMBER LOGIN',
    'zh-CN': 'MEMBER LOGIN',
    'zh-TW': 'MEMBER LOGIN',
    en: 'MEMBER LOGIN',
  },
  heroTitle: {
    ja: '会員ログイン',
    'zh-CN': '会员登录',
    'zh-TW': '會員登入',
    en: 'Member Login',
  },
  heroSubtitle: {
    ja: 'サービスをご利用ください',
    'zh-CN': '开始使用我们的服务',
    'zh-TW': '開始使用我們的服務',
    en: 'Access Your Account',
  },
  heroDesc: {
    ja: 'AI健康スクリーニング・予約管理・注文照会など、すべてのサービスをご利用いただけます。',
    'zh-CN': 'AI 健康筛查、预约管理、订单查询等，所有服务尽在掌握。',
    'zh-TW': 'AI 健康篩查、預約管理、訂單查詢等，所有服務盡在掌握。',
    en: 'Access AI health screening, appointment management, order tracking, and all our services.',
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

  // Form
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
  or: {
    ja: 'または',
    'zh-CN': '或',
    'zh-TW': '或',
    en: 'or',
  },
  noAccount: {
    ja: 'アカウントをお持ちでないですか？',
    'zh-CN': '还没有账号？',
    'zh-TW': '還沒有帳號？',
    en: "Don't have an account?",
  },
  registerNow: {
    ja: '今すぐ登録',
    'zh-CN': '立即注册',
    'zh-TW': '立即註冊',
    en: 'Register Now',
  },
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

  // Error messages
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
    <div className="min-h-screen flex">
      {/* Left Side — Brand Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 overflow-hidden">
        <Image
          src={getImage('medical_hero', 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg')}
          alt="Medical"
          fill
          className="object-cover"
          quality={75}
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/85 to-brand-900/70" />

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20" />
          <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-gold-400" />
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">
                {t('heroLabel', lang)}
              </span>
            </div>

            <h1 className="font-serif text-4xl xl:text-5xl text-white mb-4 leading-tight">
              {t('heroTitle', lang)}
              <br />
              <span className="text-gold-400">{t('heroSubtitle', lang)}</span>
            </h1>

            <p className="text-lg text-neutral-300 leading-relaxed font-light mb-10 max-w-md">
              {t('heroDesc', lang)}
            </p>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-neutral-300">{t('support24h', lang)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gold-400 rounded-full" />
                <span className="text-neutral-300">{t('chineseService', lang)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile hero label */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-gold-400" />
            <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">MEMBER LOGIN</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-brand-900 mb-2">{t('heroTitle', lang)}</h1>
            <p className="text-neutral-500 text-sm">{t('heroDesc', lang)}</p>
          </div>

          {/* Email Verified */}
          {verified && !error && !urlError && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 flex items-center gap-2 text-sm">
              <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('emailVerified', lang)}</span>
            </div>
          )}

          {/* Error */}
          {(error || urlError) && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>
                {error || (urlError === 'auth_callback_error' ? t('errorAuthCallback', lang) : t('errorVerificationFailed', lang))}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('emailLabel', lang)}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                  placeholder={t('emailPlaceholder', lang)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('passwordLabel', lang)}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                  placeholder={t('passwordPlaceholder', lang)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-brand-700 hover:text-brand-900 font-medium"
                >
                  {t('forgotPassword', lang)}
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-400 hover:bg-gold-300 disabled:bg-neutral-300 text-brand-900 font-medium py-3 px-6 text-sm tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {t('loggingIn', lang)}
                </>
              ) : (
                t('loginButton', lang)
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-neutral-200" />
            <span className="px-4 text-sm text-neutral-400">{t('or', lang)}</span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>

          {/* Register */}
          <div className="text-center">
            <p className="text-neutral-600 text-sm">
              {t('noAccount', lang)}
              <Link
                href="/register"
                className="text-brand-700 hover:text-brand-900 font-medium ml-1"
              >
                {t('registerNow', lang)}
              </Link>
            </p>
          </div>

          {/* Guest Lookup */}
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-400 mb-2">{t('guestLookup', lang)}</p>
            <Link
              href="/order-lookup"
              className="text-brand-700 hover:text-brand-900 text-sm font-medium inline-flex items-center gap-1"
            >
              {t('useOrderNumber', lang)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 w-1/3 mb-2" />
          <div className="h-4 bg-neutral-200 w-2/3 mb-8" />
          <div className="space-y-5">
            <div className="h-12 bg-neutral-100 border border-neutral-200" />
            <div className="h-12 bg-neutral-100 border border-neutral-200" />
            <div className="h-12 bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PublicLayout showFooter={false}>
      <Suspense fallback={<LoadingFallback />}>
        <LoginForm />
      </Suspense>
    </PublicLayout>
  );
}
