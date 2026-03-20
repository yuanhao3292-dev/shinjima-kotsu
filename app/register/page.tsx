'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useSiteImages } from '@/lib/hooks/useSiteImages';
import { Mail, Lock, User, Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

const translations = {
  // Errors
  passwordMismatch: { ja: '2回入力したパスワードが一致しません', 'zh-CN': '两次输入的密码不一致', 'zh-TW': '兩次輸入的密碼不一致', en: 'Passwords do not match' },
  passwordTooShort: { ja: 'パスワードは最低6文字必要です', 'zh-CN': '密码至少需要6个字符', 'zh-TW': '密碼至少需要6個字符', en: 'Password must be at least 6 characters' },
  emailAlreadyRegistered: { ja: 'このメールアドレスは既に登録されています。ログインしてください', 'zh-CN': '此邮箱已被注册，请直接登录', 'zh-TW': '此郵箱已被註冊，請直接登入', en: 'This email is already registered. Please log in' },
  registerFailed: { ja: '登録に失敗しました。後でもう一度お試しください', 'zh-CN': '注册失败，请稍后重试', 'zh-TW': '註冊失敗，請稍後重試', en: 'Registration failed. Please try again later' },

  // Success
  registerSuccess: { ja: '登録成功！', 'zh-CN': '注册成功！', 'zh-TW': '註冊成功！', en: 'Registration Successful!' },
  verificationEmailSent: { ja: 'に認証メールを送信しました。メール内のリンクをクリックして認証を完了してください。', 'zh-CN': ' 发送验证邮件，请点击邮件中的链接完成验证。', 'zh-TW': ' 發送驗證郵件，請點擊郵件中的連結完成驗證。', en: '. Please click the link in the email to complete verification.' },
  verificationEmailSentPrefix: { ja: '私たちは', 'zh-CN': '我们已向', 'zh-TW': '我們已向', en: 'We have sent a verification email to' },
  goToLogin: { ja: 'ログインへ', 'zh-CN': '前往登录', 'zh-TW': '前往登入', en: 'Go to Login' },
  noEmail: { ja: 'メールが届いていませんか？迷惑メールフォルダをご確認ください', 'zh-CN': '没有收到邮件？请检查垃圾邮件夹', 'zh-TW': '沒有收到郵件？請檢查垃圾郵件匣', en: 'No email? Please check your spam folder' },

  // Hero
  heroLabel: { ja: 'MEMBER REGISTRATION', 'zh-CN': 'MEMBER REGISTRATION', 'zh-TW': 'MEMBER REGISTRATION', en: 'MEMBER REGISTRATION' },
  heroTitle: { ja: '会員登録', 'zh-CN': '会员注册', 'zh-TW': '會員註冊', en: 'Member Registration' },
  heroSubtitle: { ja: '健康への旅を始めましょう', 'zh-CN': '开启健康之旅', 'zh-TW': '開啟健康之旅', en: 'Start Your Health Journey' },
  heroDesc: { ja: '会員登録で、便利な予約管理、注文照会、専用健診パッケージの推奨サービスをお楽しみいただけます。', 'zh-CN': '注册成为会员，享受便捷的预约管理、订单查询，以及专属的体检套餐推荐服务。', 'zh-TW': '註冊成為會員，享受便捷的預約管理、訂單查詢，以及專屬的健檢套餐推薦服務。', en: 'Register to enjoy convenient appointment management, order tracking, and personalized health checkup recommendations.' },
  benefit1: { ja: 'ワンクリックですべての予約を管理', 'zh-CN': '一键管理所有预约', 'zh-TW': '一鍵管理所有預約', en: 'Manage all appointments with one click' },
  benefit2: { ja: '専用会員優待通知', 'zh-CN': '专属会员优惠通知', 'zh-TW': '專屬會員優惠通知', en: 'Exclusive member offers' },
  benefit3: { ja: 'AI インテリジェント健康分析', 'zh-CN': 'AI 智能健康分析', 'zh-TW': 'AI 智能健康分析', en: 'AI-powered health analysis' },

  // Form
  registerTitle: { ja: '会員登録', 'zh-CN': '会员注册', 'zh-TW': '會員註冊', en: 'Member Registration' },
  registerSubtitle: { ja: 'アカウントを作成して予約を管理', 'zh-CN': '创建账号以管理您的预约', 'zh-TW': '創建帳號以管理您的預約', en: 'Create an account to manage your appointments' },
  nameLabel: { ja: '氏名', 'zh-CN': '姓名', 'zh-TW': '姓名', en: 'Name' },
  namePlaceholder: { ja: 'お名前', 'zh-CN': '您的姓名', 'zh-TW': '您的姓名', en: 'Your name' },
  emailLabel: { ja: 'メールアドレス', 'zh-CN': '电子邮箱', 'zh-TW': '電子郵箱', en: 'Email' },
  emailPlaceholder: { ja: 'your@email.com', 'zh-CN': 'your@email.com', 'zh-TW': 'your@email.com', en: 'your@email.com' },
  passwordLabel: { ja: 'パスワード', 'zh-CN': '密码', 'zh-TW': '密碼', en: 'Password' },
  passwordPlaceholder: { ja: '最低6文字', 'zh-CN': '至少6个字符', 'zh-TW': '至少6個字符', en: 'At least 6 characters' },
  confirmPasswordLabel: { ja: 'パスワード確認', 'zh-CN': '确认密码', 'zh-TW': '確認密碼', en: 'Confirm Password' },
  confirmPasswordPlaceholder: { ja: 'パスワードを再入力', 'zh-CN': '再次输入密码', 'zh-TW': '再次輸入密碼', en: 'Re-enter password' },
  registering: { ja: '登録中...', 'zh-CN': '注册中...', 'zh-TW': '註冊中...', en: 'Registering...' },
  registerButton: { ja: '今すぐ登録', 'zh-CN': '立即注册', 'zh-TW': '立即註冊', en: 'Register Now' },
  haveAccount: { ja: 'アカウントをお持ちですか？', 'zh-CN': '已有账号？', 'zh-TW': '已有帳號？', en: 'Have an account?' },
  loginNow: { ja: 'ログイン', 'zh-CN': '立即登录', 'zh-TW': '立即登入', en: 'Log in now' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const lang = useLanguage();
  const { getImage } = useSiteImages();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('passwordMismatch', lang));
      return;
    }

    if (password.length < 6) {
      setError(t('passwordTooShort', lang));
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: name.trim(), locale: lang },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setError(t('emailAlreadyRegistered', lang));
        } else {
          setError(error.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError(t('registerFailed', lang));
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <PublicLayout showFooter={false} transparentNav={false}>
        <div className="min-h-screen flex items-center justify-center p-8 pt-24 bg-white">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 border border-green-200 mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-serif text-brand-900 mb-3">{t('registerSuccess', lang)}</h1>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              {t('verificationEmailSentPrefix', lang)} <span className="font-medium text-brand-900">{email}</span>{t('verificationEmailSent', lang)}
            </p>
            <Link
              href="/login"
              className="block w-full bg-gold-400 hover:bg-gold-300 text-brand-900 font-medium py-3 px-6 text-sm tracking-wider transition-colors"
            >
              {t('goToLogin', lang)}
            </Link>
            <p className="text-sm text-neutral-400 mt-6">{t('noEmail', lang)}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout showFooter={false} transparentNav={false}>
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

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                  <span className="text-neutral-300">{t('benefit1', lang)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                  <span className="text-neutral-300">{t('benefit2', lang)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                  <span className="text-neutral-300">{t('benefit3', lang)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-24 bg-white">
          <div className="w-full max-w-md">
            {/* Mobile hero label */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-gold-400" />
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">MEMBER REGISTRATION</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-serif text-brand-900 mb-2">{t('registerTitle', lang)}</h1>
              <p className="text-neutral-500 text-sm">{t('registerSubtitle', lang)}</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-2 text-sm">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('nameLabel', lang)}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                    placeholder={t('namePlaceholder', lang)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('emailLabel', lang)}</label>
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
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('passwordLabel', lang)}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('confirmPasswordLabel', lang)}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                    placeholder={t('confirmPasswordPlaceholder', lang)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-400 hover:bg-gold-300 disabled:bg-neutral-300 text-brand-900 font-medium py-3 px-6 text-sm tracking-wider transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {t('registering', lang)}
                  </>
                ) : (
                  t('registerButton', lang)
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-neutral-600 text-sm">
                {t('haveAccount', lang)}
                <Link href="/login" className="text-brand-700 hover:text-brand-900 font-medium ml-1">
                  {t('loginNow', lang)}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
