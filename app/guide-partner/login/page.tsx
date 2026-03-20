'use client';

import { useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useSiteImages } from '@/lib/hooks/useSiteImages';

// 翻译对象
const translations = {
  // Error messages
  invalidCredentials: {
    ja: 'メールアドレスまたはパスワードが間違っています',
    'zh-CN': '邮箱或密码错误',
    'zh-TW': '郵箱或密碼錯誤',
    en: 'Invalid email or password',
  },
  isAdmin: {
    ja: 'このアカウントは管理者アカウントです。管理者ログインページをご利用ください',
    'zh-CN': '此账号是管理员账号，请使用管理员登录页面',
    'zh-TW': '此帳號是管理員帳號，請使用管理員登入頁面',
    en: 'This account is an admin account. Please use the admin login page',
  },
  loginFailed: {
    ja: 'ログインに失敗しました。後でもう一度お試しください',
    'zh-CN': '登录失败，请稍后重试',
    'zh-TW': '登入失敗,請稍後重試',
    en: 'Login failed. Please try again later',
  },
  notGuide: {
    ja: 'このアカウントはガイドアカウントではありません',
    'zh-CN': '该账号不是导游账号',
    'zh-TW': '該帳號不是導遊帳號',
    en: 'This account is not a guide account',
  },
  pending: {
    ja: 'アカウントは審査中です。お待ちください',
    'zh-CN': '您的账号正在审核中，请耐心等待',
    'zh-TW': '您的帳號正在審核中，請耐心等待',
    en: 'Your account is under review. Please wait',
  },
  rejected: {
    ja: '申請は承認されませんでした',
    'zh-CN': '您的申请未通过审核',
    'zh-TW': '您的申請未通過審核',
    en: 'Your application was not approved',
  },
  suspended: {
    ja: 'アカウントは停止されています。管理者にお問い合わせください',
    'zh-CN': '您的账号已被暂停，请联系管理员',
    'zh-TW': '您的帳號已被暫停，請聯繫管理員',
    en: 'Your account has been suspended. Please contact the administrator',
  },
  goToAdminLogin: {
    ja: '→ 管理者ログインページへ',
    'zh-CN': '→ 前往管理员登录页面',
    'zh-TW': '→ 前往管理員登入頁面',
    en: '→ Go to Admin Login',
  },

  // Hero section
  heroLabel: {
    ja: 'GUIDE PARTNER',
    'zh-CN': 'GUIDE PARTNER',
    'zh-TW': 'GUIDE PARTNER',
    en: 'GUIDE PARTNER',
  },
  heroTitle: {
    ja: 'ガイドパートナーシステム',
    'zh-CN': '导游合伙人系统',
    'zh-TW': '導遊合夥人系統',
    en: 'Guide Partner System',
  },
  heroSubtitle: {
    ja: 'ビジネスを簡単に管理',
    'zh-CN': '轻松管理您的业务',
    'zh-TW': '輕鬆管理您的業務',
    en: 'Easily Manage Your Business',
  },
  heroDesc: {
    ja: 'ログイン後、以下のことができます:',
    'zh-CN': '登录后您可以:',
    'zh-TW': '登入後您可以:',
    en: 'After logging in, you can:',
  },
  feature1: {
    ja: '160以上の高級ナイトクラブを閲覧',
    'zh-CN': '浏览 160+ 高端夜总会',
    'zh-TW': '瀏覽 160+ 高端夜總會',
    en: 'Browse 160+ premium nightclubs',
  },
  feature2: {
    ja: 'お客様のためにサービスを予約',
    'zh-CN': '为客户预约服务',
    'zh-TW': '為客戶預約服務',
    en: 'Book services for customers',
  },
  feature3: {
    ja: '紹介報酬と決済記録を確認',
    'zh-CN': '查看介绍报酬和结算记录',
    'zh-TW': '查看介紹報酬和結算記錄',
    en: 'View referral rewards and settlement records',
  },
  feature4: {
    ja: '新しいガイドを紹介して報酬を獲得',
    'zh-CN': '推荐新导游赚取奖励',
    'zh-TW': '推薦新導遊賺取獎勵',
    en: 'Refer new guides and earn rewards',
  },

  // Form
  loginTitle: {
    ja: 'ガイドログイン',
    'zh-CN': '导游登录',
    'zh-TW': '導遊登入',
    en: 'Guide Login',
  },
  loginDesc: {
    ja: 'パートナーアカウントにログイン',
    'zh-CN': '登录您的合伙人账号',
    'zh-TW': '登入您的合夥人帳號',
    en: 'Login to your partner account',
  },
  emailLabel: {
    ja: 'メールアドレス',
    'zh-CN': '邮箱',
    'zh-TW': '郵箱',
    en: 'Email',
  },
  passwordLabel: {
    ja: 'パスワード',
    'zh-CN': '密码',
    'zh-TW': '密碼',
    en: 'Password',
  },
  loggingIn: {
    ja: 'ログイン中...',
    'zh-CN': '登录中...',
    'zh-TW': '登入中...',
    en: 'Logging in...',
  },
  loginButton: {
    ja: 'ログイン',
    'zh-CN': '登录',
    'zh-TW': '登入',
    en: 'Login',
  },
  orDivider: {
    ja: 'または',
    'zh-CN': '或',
    'zh-TW': '或',
    en: 'or',
  },
  noAccount: {
    ja: 'まだアカウントをお持ちでないですか？',
    'zh-CN': '还没有账号？',
    'zh-TW': '還沒有帳號？',
    en: 'Don\'t have an account?',
  },
  registerLink: {
    ja: 'パートナー登録申請',
    'zh-CN': '申请成为合伙人',
    'zh-TW': '申請成為合夥人',
    en: 'Apply to Become a Partner',
  },
  forgotPassword: {
    ja: 'パスワードをお忘れですか？',
    'zh-CN': '忘记密码？',
    'zh-TW': '忘記密碼？',
    en: 'Forgot password?',
  },
  backToHome: {
    ja: '← ガイドパートナートップへ戻る',
    'zh-CN': '← 返回导游合伙人首页',
    'zh-TW': '← 返回導遊合夥人首頁',
    en: '← Back to Guide Partner Home',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

// 安全的重定向路径验证
const getSafeRedirect = (redirect: string | null, allowedPrefix: string, defaultPath: string): string => {
  if (!redirect) return defaultPath;
  if (redirect.startsWith(allowedPrefix) && !redirect.includes('//') && !redirect.includes('..')) {
    return redirect;
  }
  return defaultPath;
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

  // 安全处理重定向路径
  const safeRedirect = useMemo(() =>
    getSafeRedirect(searchParams.get('redirect'), '/guide-partner', '/guide-partner/dashboard'),
    [searchParams]
  );

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
          setError(t('invalidCredentials', lang));
        } else {
          setError(authError.message);
        }
        return;
      }

      // 2. 檢查是否是管理員
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const verifyResponse = await fetch('/api/admin/verify', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        if (verifyResponse.ok) {
          setError(t('isAdmin', lang));
          await supabase.auth.signOut();
          return;
        }
      }

      // 3. 檢查是否是導遊
      if (!authData.user) {
        setError(t('loginFailed', lang));
        return;
      }

      const { data: guide, error: guideError } = await supabase
        .from('guides')
        .select('id, status')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (guideError || !guide) {
        setError(t('notGuide', lang));
        await supabase.auth.signOut();
        return;
      }

      // 4. 檢查審核狀態
      if (guide.status === 'pending') {
        setError(t('pending', lang));
        await supabase.auth.signOut();
        return;
      }

      if (guide.status === 'rejected') {
        setError(t('rejected', lang));
        await supabase.auth.signOut();
        return;
      }

      if (guide.status === 'suspended') {
        setError(t('suspended', lang));
        await supabase.auth.signOut();
        return;
      }

      router.push(safeRedirect);
      router.refresh();
    } catch {
      setError(t('loginFailed', lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side — Brand Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 overflow-hidden">
        <Image
          src={getImage('guide_hero', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000')}
          alt="Guide Partner"
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

            <ul className="space-y-3 text-sm">
              {(['feature1', 'feature2', 'feature3', 'feature4'] as const).map((key) => (
                <li key={key} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gold-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-300">{t(key, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-24 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile hero label */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-gold-400" />
            <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">GUIDE PARTNER</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-brand-900 mb-2">{t('loginTitle', lang)}</h1>
            <p className="text-neutral-500 text-sm">{t('loginDesc', lang)}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-start gap-2 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <span>{error}</span>
                {error.includes(t('isAdmin', lang).slice(0, 10)) && (
                  <Link
                    href="/admin/login"
                    className="mt-2 block text-brand-700 hover:text-brand-900 font-medium"
                  >
                    {t('goToAdminLogin', lang)}
                  </Link>
                )}
              </div>
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
                  placeholder="your@email.com"
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
                  placeholder="••••••••"
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
                  href="/forgot-password?from=guide"
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
            <span className="px-4 text-sm text-neutral-400">{t('orDivider', lang)}</span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>

          {/* Register */}
          <div className="text-center">
            <p className="text-neutral-600 text-sm">
              {t('noAccount', lang)}
              <Link
                href="/guide-partner/register"
                className="text-brand-700 hover:text-brand-900 font-medium ml-1"
              >
                {t('registerLink', lang)}
              </Link>
            </p>
          </div>

          {/* Back to Guide Partner Home */}
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <Link
              href="/guide-partner"
              className="text-neutral-500 hover:text-brand-900 text-sm"
            >
              {t('backToHome', lang)}
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

export default function GuideLoginPage() {
  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      <Suspense fallback={<LoadingFallback />}>
        <LoginForm />
      </Suspense>
    </PublicLayout>
  );
}
