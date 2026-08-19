'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { authRedirectUrl } from '@/lib/config/site';
import PublicLayout from '@/components/PublicLayout';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useSiteImages } from '@/lib/hooks/useSiteImages';
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const translations = {
  // Errors
  sendFailed: { ja: '送信に失敗しました。後でもう一度お試しください', 'zh-CN': '发送失败，请稍后重试', 'zh-TW': '發送失敗，請稍後重試', en: 'Send failed. Please try again later' },

  // Success page
  emailSent: { ja: 'メールを送信しました', 'zh-CN': '邮件已发送', 'zh-TW': '郵件已發送', en: 'Email Sent' },
  resetEmailSentPrefix: { ja: '私たちは', 'zh-CN': '我们已向', 'zh-TW': '我們已向', en: 'We have sent a password reset email to' },
  backToLogin: { ja: 'ログインに戻る', 'zh-CN': '返回登录', 'zh-TW': '返回登入', en: 'Back to Login' },

  // Hero
  heroLabel: { ja: 'PASSWORD RESET', 'zh-CN': 'PASSWORD RESET', 'zh-TW': 'PASSWORD RESET', en: 'PASSWORD RESET' },
  forgotPasswordHero: { ja: 'パスワードをお忘れですか？', 'zh-CN': '忘记密码？', 'zh-TW': '忘記密碼？', en: 'Forgot Password?' },
  dontWorry: { ja: 'ご心配なく', 'zh-CN': '别担心', 'zh-TW': '別擔心', en: 'Don\'t Worry' },
  heroDesc: { ja: '登録時に使用したメールアドレスを入力してください。リセットリンクをお送りします。安全かつ迅速にアカウントを回復できます。', 'zh-CN': '输入您注册时使用的电子邮箱，我们将发送重置链接给您。安全、快速地找回您的账号。', 'zh-TW': '輸入您註冊時使用的電子郵箱，我們將發送重置連結給您。安全、快速地找回您的帳號。', en: 'Enter the email you used to register. We\'ll send you a reset link. Securely and quickly recover your account.' },

  // Form
  forgotPasswordTitle: { ja: 'パスワードを忘れた', 'zh-CN': '忘记密码', 'zh-TW': '忘記密碼', en: 'Forgot Password' },
  forgotPasswordSubtitle: { ja: '\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u78ba\u8a8d\u30b3\u30fc\u30c9\u3092\u304a\u9001\u308a\u3057\u307e\u3059', 'zh-CN': '\u8f93\u5165\u60a8\u7684\u90ae\u7bb1\uff0c\u6211\u4eec\u5c06\u53d1\u9001\u9a8c\u8bc1\u7801', 'zh-TW': '\u8f38\u5165\u60a8\u7684\u90f5\u7bb1\uff0c\u6211\u5011\u5c07\u767c\u9001\u9a57\u8b49\u78bc', en: 'Enter your email and we\'ll send you a verification code' },
  emailLabel: { ja: 'メールアドレス', 'zh-CN': '电子邮箱', 'zh-TW': '電子郵箱', en: 'Email' },
  emailPlaceholder: { ja: 'your@email.com', 'zh-CN': 'your@email.com', 'zh-TW': 'your@email.com', en: 'your@email.com' },
  sending: { ja: '送信中...', 'zh-CN': '发送中...', 'zh-TW': '發送中...', en: 'Sending...' },
  sendResetLink: { ja: '\u78ba\u8a8d\u30b3\u30fc\u30c9\u3092\u9001\u4fe1', 'zh-CN': '\u53d1\u9001\u9a8c\u8bc1\u7801', 'zh-TW': '\u767c\u9001\u9a57\u8b49\u78bc', en: 'Send Verification Code' },
  rememberPassword: { ja: 'パスワードを思い出しましたか？', 'zh-CN': '想起密码了？', 'zh-TW': '想起密碼了？', en: 'Remember your password?' },
  loginNow: { ja: 'ログイン', 'zh-CN': '立即登录', 'zh-TW': '立即登入', en: 'Log in now' },

  // 验证码步骤
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return (translations[key] as Record<Language, string>)[lang];
};

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lang = useLanguage();
  const { getImage } = useSiteImages();
  const searchParams = useSearchParams();
  const isGuide = searchParams.get('from') === 'guide';
  const loginPath = isGuide ? '/guide-partner/login' : '/login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const resetUrl = authRedirectUrl(
        isGuide ? '/reset-password?from=guide' : '/reset-password'
      );
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: resetUrl,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // 邮箱交给重置页预填。之所以跳转而不是留在本页用局部状态展示输入框：
      // 用户要切到邮箱客户端抄验证码，回来时本页的 React 状态早就没了，
      // 会被打回"输入邮箱"从头再来。/reset-password 是固定地址，随时可回。
      window.sessionStorage.setItem('pw_reset_email', email.trim().toLowerCase());
      window.location.href = isGuide ? '/reset-password?from=guide' : '/reset-password';
    } catch {
      setError(t('sendFailed', lang));
    } finally {
      setLoading(false);
    }
  };

  // ==================== Form State ====================
  return (
    <div className="min-h-screen flex">
      {/* Left Side — Brand Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative brand-gradient-deep overflow-hidden">
        <Image
          src={isGuide
              ? getImage('guide_hero', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000')
              : getImage('medical_hero', 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/public-assets/site/hero-medical.jpg')
            }
          alt="Password Reset"
          fill
          className="object-cover"
          quality={75}
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/75 via-neutral-900/55 to-neutral-900/25" />

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-white/70/10 rounded-full filter blur-3xl top-1/4 -left-20" />
          <div className="absolute w-72 h-72 bg-white/70/10 rounded-full filter blur-3xl bottom-1/4 right-10" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-white/70" />
              <span className="text-xs tracking-[0.3em] text-white/90 uppercase">
                {t('heroLabel', lang)}
              </span>
            </div>

            <h1 className="font-serif text-4xl xl:text-5xl text-white mb-4 leading-tight">
              {t('forgotPasswordHero', lang)}
              <br />
              <span className="text-white/90">{t('dontWorry', lang)}</span>
            </h1>

            <p className="text-lg text-white/85 leading-relaxed font-light max-w-md">
              {t('heroDesc', lang)}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-24 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile hero label */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-brand-400" />
            <span className="text-xs tracking-[0.3em] text-neutral-700 uppercase">PASSWORD RESET</span>
          </div>

          {/* Back Link */}
          <Link
            href={loginPath}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-700 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            {t('backToLogin', lang)}
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-neutral-900 mb-2">{t('forgotPasswordTitle', lang)}</h1>
            <p className="text-neutral-500 text-sm">{t('forgotPasswordSubtitle', lang)}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('emailLabel', lang)}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
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

            <button
              type="submit"
              disabled={loading}
              className="w-full brand-gradient-solid hover:opacity-90 disabled:bg-neutral-300 text-white font-medium py-3 px-6 text-sm tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {t('sending', lang)}
                </>
              ) : (
                t('sendResetLink', lang)
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-neutral-600 text-sm">
              {t('rememberPassword', lang)}
              <Link href={loginPath} className="text-brand-700 hover:text-brand-700 font-medium ml-1">
                {t('loginNow', lang)}
              </Link>
            </p>
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
          <div className="h-4 bg-neutral-200 w-1/4 mb-6" />
          <div className="h-6 bg-neutral-200 w-1/2 mb-2" />
          <div className="h-4 bg-neutral-200 w-3/4 mb-8" />
          <div className="h-12 bg-neutral-100 border border-neutral-200 mb-5" />
          <div className="h-12 bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      <Suspense fallback={<LoadingFallback />}>
        <ForgotPasswordForm />
      </Suspense>
    </PublicLayout>
  );
}
