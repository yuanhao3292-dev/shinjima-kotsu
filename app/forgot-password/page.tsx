'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useSiteImages } from '@/lib/hooks/useSiteImages';
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const translations = {
  // Errors
  sendFailed: { ja: '送信に失敗しました。後でもう一度お試しください', 'zh-CN': '发送失败，请稍后重试', 'zh-TW': '發送失敗，請稍後重試', en: 'Send failed. Please try again later' },

  // Success page
  emailSent: { ja: 'メールを送信しました', 'zh-CN': '邮件已发送', 'zh-TW': '郵件已發送', en: 'Email Sent' },
  resetEmailSent: { ja: 'に パスワードリセットメールを送信しました。メール内のリンクをクリックしてパスワードをリセットしてください。', 'zh-CN': ' 发送密码重置邮件，请点击邮件中的链接重置密码。', 'zh-TW': ' 發送密碼重置郵件，請點擊郵件中的連結重置密碼。', en: '. Please click the link in the email to reset your password.' },
  resetEmailSentPrefix: { ja: '私たちは', 'zh-CN': '我们已向', 'zh-TW': '我們已向', en: 'We have sent a password reset email to' },
  backToLogin: { ja: 'ログインに戻る', 'zh-CN': '返回登录', 'zh-TW': '返回登入', en: 'Back to Login' },
  noEmail: { ja: 'メールが届いていませんか？迷惑メールフォルダをご確認ください', 'zh-CN': '没有收到邮件？请检查垃圾邮件夹', 'zh-TW': '沒有收到郵件？請檢查垃圾郵件匣', en: 'No email? Please check your spam folder' },

  // Hero
  heroLabel: { ja: 'PASSWORD RESET', 'zh-CN': 'PASSWORD RESET', 'zh-TW': 'PASSWORD RESET', en: 'PASSWORD RESET' },
  forgotPasswordHero: { ja: 'パスワードをお忘れですか？', 'zh-CN': '忘记密码？', 'zh-TW': '忘記密碼？', en: 'Forgot Password?' },
  dontWorry: { ja: 'ご心配なく', 'zh-CN': '别担心', 'zh-TW': '別擔心', en: 'Don\'t Worry' },
  heroDesc: { ja: '登録時に使用したメールアドレスを入力してください。リセットリンクをお送りします。安全かつ迅速にアカウントを回復できます。', 'zh-CN': '输入您注册时使用的电子邮箱，我们将发送重置链接给您。安全、快速地找回您的账号。', 'zh-TW': '輸入您註冊時使用的電子郵箱，我們將發送重置連結給您。安全、快速地找回您的帳號。', en: 'Enter the email you used to register. We\'ll send you a reset link. Securely and quickly recover your account.' },

  // Form
  forgotPasswordTitle: { ja: 'パスワードを忘れた', 'zh-CN': '忘记密码', 'zh-TW': '忘記密碼', en: 'Forgot Password' },
  forgotPasswordSubtitle: { ja: 'メールアドレスを入力してください。リセットリンクをお送りします', 'zh-CN': '输入您的邮箱，我们将发送重置链接', 'zh-TW': '輸入您的郵箱，我們將發送重置連結', en: 'Enter your email and we\'ll send you a reset link' },
  emailLabel: { ja: 'メールアドレス', 'zh-CN': '电子邮箱', 'zh-TW': '電子郵箱', en: 'Email' },
  emailPlaceholder: { ja: 'your@email.com', 'zh-CN': 'your@email.com', 'zh-TW': 'your@email.com', en: 'your@email.com' },
  sending: { ja: '送信中...', 'zh-CN': '发送中...', 'zh-TW': '發送中...', en: 'Sending...' },
  sendResetLink: { ja: 'リセットリンクを送信', 'zh-CN': '发送重置链接', 'zh-TW': '發送重置連結', en: 'Send Reset Link' },
  rememberPassword: { ja: 'パスワードを思い出しましたか？', 'zh-CN': '想起密码了？', 'zh-TW': '想起密碼了？', en: 'Remember your password?' },
  loginNow: { ja: 'ログイン', 'zh-CN': '立即登录', 'zh-TW': '立即登入', en: 'Log in now' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
      const resetUrl = isGuide
        ? `${window.location.origin}/reset-password?from=guide`
        : `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: resetUrl,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError(t('sendFailed', lang));
    } finally {
      setLoading(false);
    }
  };

  // ==================== Success State ====================
  if (success) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side — Brand Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 overflow-hidden">
          <Image
            src={isGuide
              ? getImage('guide_hero', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000')
              : getImage('medical_hero', 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg')
            }
            alt="Password Reset"
            fill
            className="object-cover"
            quality={75}
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/85 to-brand-900/70" />
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
                {t('emailSent', lang)}
              </h1>
              <p className="text-lg text-neutral-300 leading-relaxed font-light max-w-md">
                {t('heroDesc', lang)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side — Success Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-24 bg-white">
          <div className="w-full max-w-md text-center">
            <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
              <div className="h-[1px] w-8 bg-gold-400" />
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">PASSWORD RESET</span>
              <div className="h-[1px] w-8 bg-gold-400" />
            </div>

            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 border border-green-200 mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-serif text-brand-900 mb-3">{t('emailSent', lang)}</h1>
            <p className="text-neutral-600 mb-8 leading-relaxed text-sm">
              {t('resetEmailSentPrefix', lang)} <span className="font-bold text-brand-900">{email}</span>{t('resetEmailSent', lang)}
            </p>

            <Link
              href={loginPath}
              className="block w-full bg-gold-400 hover:bg-gold-300 text-brand-900 font-medium py-3 px-6 text-sm tracking-wider transition-colors"
            >
              {t('backToLogin', lang)}
            </Link>

            <p className="text-xs text-neutral-400 mt-6">{t('noEmail', lang)}</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== Form State ====================
  return (
    <div className="min-h-screen flex">
      {/* Left Side — Brand Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 overflow-hidden">
        <Image
          src={isGuide
              ? getImage('guide_hero', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000')
              : getImage('medical_hero', 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg')
            }
          alt="Password Reset"
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
              {t('forgotPasswordHero', lang)}
              <br />
              <span className="text-gold-400">{t('dontWorry', lang)}</span>
            </h1>

            <p className="text-lg text-neutral-300 leading-relaxed font-light max-w-md">
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
            <div className="h-[1px] w-8 bg-gold-400" />
            <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">PASSWORD RESET</span>
          </div>

          {/* Back Link */}
          <Link
            href={loginPath}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            {t('backToLogin', lang)}
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-brand-900 mb-2">{t('forgotPasswordTitle', lang)}</h1>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-400 hover:bg-gold-300 disabled:bg-neutral-300 text-brand-900 font-medium py-3 px-6 text-sm tracking-wider transition-colors flex items-center justify-center gap-2"
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
              <Link href={loginPath} className="text-brand-700 hover:text-brand-900 font-medium ml-1">
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
