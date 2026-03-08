'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MemberLayout from '@/components/MemberLayout';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { Mail, Loader2, AlertCircle, CheckCircle, KeyRound, ArrowLeft } from 'lucide-react';

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const lang = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
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

  if (success) {
    return (
      <MemberLayout showFooter={false}>
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-neutral-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-neutral-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-3">{t('emailSent', lang)}</h1>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              {t('resetEmailSentPrefix', lang)} <span className="font-bold text-neutral-900">{email}</span>{t('resetEmailSent', lang)}
            </p>
            <Link
              href="/login"
              className="block w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg"
            >
              {t('backToLogin', lang)}
            </Link>
            <p className="text-sm text-neutral-400 mt-6">{t('noEmail', lang)}</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout showFooter={false}>
      <div className="min-h-[calc(100vh-80px)] flex">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-900 via-brand-700 to-brand-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-transparent to-brand-900/50"></div>

          {/* Language Switcher - Top Right */}
          <div className="absolute top-8 right-8 z-20">
            <LanguageSwitcher />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <div className="flex items-center gap-3 mb-8">
              <Logo className="w-12 h-12 text-white" />
              <div>
                <span className="font-serif font-bold text-2xl tracking-wide">NIIJIMA</span>
                <p className="text-xs text-brand-200 uppercase tracking-widest">Medical Tourism</p>
              </div>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
              {t('forgotPasswordHero', lang)}<br />
              <span className="text-brand-300">{t('dontWorry', lang)}</span>
            </h1>
            <p className="text-neutral-300 leading-relaxed mb-8 max-w-md">
              {t('heroDesc', lang)}
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-neutral-50 relative">
          {/* Language Switcher for mobile - Top Right */}
          <div className="absolute top-4 right-4 lg:hidden z-20">
            <LanguageSwitcher />
          </div>

          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <Logo className="w-10 h-10 text-brand-600" />
              <span className="font-serif font-bold text-xl">NIIJIMA</span>
            </div>

            {/* Back Link */}
            <Link href="/login" className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 mb-6 text-sm font-medium transition">
              <ArrowLeft size={16} />
              {t('backToLogin', lang)}
            </Link>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-full mb-4">
                  <KeyRound className="w-8 h-8 text-brand-600" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-neutral-900">{t('forgotPasswordTitle', lang)}</h1>
                <p className="text-neutral-500 mt-2 text-sm">{t('forgotPasswordSubtitle', lang)}</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-900 hover:bg-brand-800 disabled:bg-neutral-400 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {t('sending', lang)}
                    </>
                  ) : (
                    t('sendResetLink', lang)
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-neutral-600 text-sm">
                  {t('rememberPassword', lang)}
                  <Link href="/login" className="text-brand-600 hover:text-brand-700 font-bold ml-1">
                    {t('loginNow', lang)}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
