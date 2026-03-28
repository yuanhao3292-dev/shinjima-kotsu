'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import { User, Phone, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useSiteImages } from '@/lib/hooks/useSiteImages';
import { COUNTRY_CODES, DEFAULT_CODE_BY_LANG } from '@/lib/config/country-codes';

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
  heroLabel: {
    ja: 'GUIDE PARTNER',
    'zh-CN': 'GUIDE PARTNER',
    'zh-TW': 'GUIDE PARTNER',
    en: 'GUIDE PARTNER',
  },
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
  agreeTerms: {
    ja: '私は以下を読み、同意しました：',
    'zh-CN': '我已阅读并同意：',
    'zh-TW': '我已閱讀並同意：',
    en: 'I have read and agree to:',
  },
  serviceAgreement: {
    ja: 'ガイドパートナーサービス契約',
    'zh-CN': '导游合作伙伴服务协议',
    'zh-TW': '導遊提攜夥伴服務協議',
    en: 'Guide Partner Service Agreement',
  },
  and: {
    ja: 'および',
    'zh-CN': '和',
    'zh-TW': '和',
    en: 'and',
  },
  privacyPolicy: {
    ja: 'プライバシーポリシー',
    'zh-CN': '隐私政策',
    'zh-TW': '隱私政策',
    en: 'Privacy Policy',
  },
  errorAgreeRequired: {
    ja: 'サービス契約とプライバシーポリシーに同意してください',
    'zh-CN': '请先同意服务协议和隐私政策',
    'zh-TW': '請先同意服務協議和隱私政策',
    en: 'Please agree to the Service Agreement and Privacy Policy',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

function RegisterForm() {
  const searchParams = useSearchParams();
  const referrerCode = searchParams.get('ref') || '';
  const lang = useLanguage();
  const { getImage } = useSiteImages();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    wechatId: '',
    password: '',
    confirmPassword: '',
  });
  const [countryCode, setCountryCode] = useState(() => DEFAULT_CODE_BY_LANG[lang] || '+86');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
        });
    }
  }, [referrerCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!agreedToTerms) {
      setError(t('errorAgreeRequired', lang));
      setLoading(false);
      return;
    }

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
      const response = await fetch('/api/guide/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() ? `${countryCode}${formData.phone.trim()}` : '',
          wechat_id: formData.wechatId || undefined,
          password: formData.password,
          referrer_code: referrerCode || undefined,
          locale: lang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('errorRegisterFailed', lang));
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError(t('errorRegisterFailed', lang));
    } finally {
      setLoading(false);
    }
  };

  // ==================== Hero Side (shared) ====================
  const heroSide = (
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
            {t('heroTitle1', lang)}
            <br />
            <span className="text-gold-400">{t('heroTitle2', lang)}</span>
          </h1>

          <p className="text-lg text-neutral-300 leading-relaxed font-light mb-10 max-w-md">
            {t('heroDesc', lang)}
          </p>

          <div className="space-y-4 text-sm">
            {(['step1', 'step2', 'step3'] as const).map((key, i) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-8 h-8 border border-gold-400/30 flex items-center justify-center">
                  <span className="text-gold-400 font-medium">{i + 1}</span>
                </div>
                <span className="text-neutral-300">{t(key, lang)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== Success State ====================
  if (success) {
    return (
      <div className="min-h-screen flex">
        {heroSide}

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-24 bg-white">
          <div className="w-full max-w-md text-center">
            <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
              <div className="h-[1px] w-8 bg-gold-400" />
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">GUIDE PARTNER</span>
              <div className="h-[1px] w-8 bg-gold-400" />
            </div>

            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 border border-green-200 mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-serif text-brand-900 mb-3">{t('successTitle', lang)}</h1>
            <p className="text-neutral-600 mb-8 leading-relaxed text-sm">
              {t('successMessage', lang)}<br />
              {t('successSubMessage', lang)}
            </p>

            <Link
              href="/guide-partner/login"
              className="block w-full bg-gold-400 hover:bg-gold-300 text-brand-900 font-medium py-3 px-6 text-sm tracking-wider transition-colors"
            >
              {t('goToLogin', lang)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==================== Form State ====================
  return (
    <div className="min-h-screen flex">
      {heroSide}

      {/* Right Side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-24 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile hero label */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-gold-400" />
            <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">GUIDE PARTNER</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-serif text-brand-900 mb-2">{t('registerTitle', lang)}</h1>
            <p className="text-neutral-500 text-sm">{t('registerSubtitle', lang)}</p>
          </div>

          {/* Referrer invite */}
          {referrerName && (
            <div className="mb-6 bg-neutral-50 border border-neutral-200 text-neutral-700 px-4 py-3 text-sm">
              <span className="font-medium text-brand-900">{referrerName}</span>{t('referrerInvite', lang)}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">{t('labelName', lang)}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                  placeholder={t('placeholderName', lang)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">{t('labelPhone', lang)}</label>
              <div className="flex">
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 text-neutral-400 pointer-events-none" size={18} />
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="pl-10 pr-2 py-3 border border-neutral-200 border-r-0 bg-neutral-50 text-sm text-neutral-700 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none min-w-[120px]"
                  >
                    {COUNTRY_CODES.map((cc) => (
                      <option key={cc.code} value={cc.code}>{cc.label}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="flex-1 px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                  placeholder={t('placeholderPhone', lang)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">{t('labelEmail', lang)}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">{t('labelWechat', lang)}</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  value={formData.wechatId}
                  onChange={(e) => setFormData({ ...formData, wechatId: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                  placeholder={t('placeholderWechat', lang)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">{t('labelPassword', lang)}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-12 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                  placeholder={t('placeholderPassword', lang)}
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
              <label className="block text-sm font-medium text-neutral-700 mb-2">{t('labelConfirmPassword', lang)}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                  placeholder={t('placeholderConfirmPassword', lang)}
                />
              </div>
            </div>

            {/* Terms & Privacy consent */}
            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 border-neutral-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="agree-terms" className="text-xs text-neutral-600 leading-relaxed">
                {t('agreeTerms', lang)}{' '}
                <Link href="/guide-partner/terms" target="_blank" className="text-brand-700 underline hover:text-brand-900">
                  {t('serviceAgreement', lang)}
                </Link>
                {' '}{t('and', lang)}{' '}
                <Link href="/legal/privacy" target="_blank" className="text-brand-700 underline hover:text-brand-900">
                  {t('privacyPolicy', lang)}
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full bg-gold-400 hover:bg-gold-300 disabled:bg-neutral-300 disabled:cursor-not-allowed text-brand-900 font-medium py-3 px-6 text-sm tracking-wider transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {t('submitting', lang)}
                </>
              ) : (
                t('submitButton', lang)
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-neutral-600 text-sm">
              {t('hasAccount', lang)}
              <Link href="/guide-partner/login" className="text-brand-700 hover:text-brand-900 font-medium ml-1">
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
          <div className="h-6 bg-neutral-200 w-1/3 mb-2" />
          <div className="h-4 bg-neutral-200 w-2/3 mb-8" />
          <div className="space-y-4">
            <div className="h-12 bg-neutral-100 border border-neutral-200" />
            <div className="h-12 bg-neutral-100 border border-neutral-200" />
            <div className="h-12 bg-neutral-100 border border-neutral-200" />
            <div className="h-12 bg-neutral-100 border border-neutral-200" />
            <div className="h-12 bg-neutral-100 border border-neutral-200" />
            <div className="h-12 bg-neutral-100 border border-neutral-200" />
            <div className="h-12 bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuideRegisterPage() {
  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      <Suspense fallback={<LoadingFallback />}>
        <RegisterForm />
      </Suspense>
    </PublicLayout>
  );
}
