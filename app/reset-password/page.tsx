'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MemberLayout from '@/components/MemberLayout';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, KeyRound } from 'lucide-react';

const translations = {
  // Errors
  linkExpired: { ja: 'リセットリンクの有効期限が切れているか無効です。再度申請してください', 'zh-CN': '重置链接已过期或无效，请重新申请', 'zh-TW': '重置連結已過期或無效，請重新申請', en: 'Reset link has expired or is invalid. Please request a new one' },
  passwordMismatch: { ja: '2回入力したパスワードが一致しません', 'zh-CN': '两次输入的密码不一致', 'zh-TW': '兩次輸入的密碼不一致', en: 'Passwords do not match' },
  passwordTooShort: { ja: 'パスワードは最低6文字必要です', 'zh-CN': '密码至少需要6个字符', 'zh-TW': '密碼至少需要6個字符', en: 'Password must be at least 6 characters' },
  resetFailed: { ja: 'リセットに失敗しました。後でもう一度お試しください', 'zh-CN': '重置失败，请稍后重试', 'zh-TW': '重置失敗，請稍後重試', en: 'Reset failed. Please try again later' },

  // Success page
  passwordReset: { ja: 'パスワードがリセットされました', 'zh-CN': '密码已重置', 'zh-TW': '密碼已重置', en: 'Password Reset' },
  passwordUpdated: { ja: 'パスワードが正常に更新されました。ログインページにリダイレクトしています...', 'zh-CN': '您的密码已成功更新，正在跳转到登录页面...', 'zh-TW': '您的密碼已成功更新，正在跳轉到登入頁面...', en: 'Your password has been successfully updated. Redirecting to login...' },
  loginNow: { ja: '今すぐログイン', 'zh-CN': '立即登录', 'zh-TW': '立即登入', en: 'Log in now' },

  // Hero
  resetPasswordHero: { ja: 'パスワードをリセット', 'zh-CN': '重置密码', 'zh-TW': '重置密碼', en: 'Reset Password' },
  setNewPassword: { ja: '新しいパスワードを設定', 'zh-CN': '设置新密码', 'zh-TW': '設置新密碼', en: 'Set New Password' },
  heroDesc: { ja: '安全な新しいパスワードを設定してください。最低6文字、文字と数字の組み合わせをお勧めします。', 'zh-CN': '请设置一个安全的新密码。建议使用至少6个字符，包含字母和数字的组合。', 'zh-TW': '請設置一個安全的新密碼。建議使用至少6個字符，包含字母和數字的組合。', en: 'Please set a secure new password. We recommend at least 6 characters with a combination of letters and numbers.' },

  // Form
  resetPasswordTitle: { ja: 'パスワードをリセット', 'zh-CN': '重置密码', 'zh-TW': '重置密碼', en: 'Reset Password' },
  resetPasswordSubtitle: { ja: '新しいパスワードを設定してください', 'zh-CN': '请设置您的新密码', 'zh-TW': '請設置您的新密碼', en: 'Please set your new password' },
  newPasswordLabel: { ja: '新しいパスワード', 'zh-CN': '新密码', 'zh-TW': '新密碼', en: 'New Password' },
  newPasswordPlaceholder: { ja: '最低6文字', 'zh-CN': '至少6个字符', 'zh-TW': '至少6個字符', en: 'At least 6 characters' },
  confirmNewPasswordLabel: { ja: '新しいパスワードの確認', 'zh-CN': '确认新密码', 'zh-TW': '確認新密碼', en: 'Confirm New Password' },
  confirmNewPasswordPlaceholder: { ja: '新しいパスワードを再入力', 'zh-CN': '再次输入新密码', 'zh-TW': '再次輸入新密碼', en: 'Re-enter new password' },
  resetting: { ja: 'リセット中...', 'zh-CN': '重置中...', 'zh-TW': '重置中...', en: 'Resetting...' },
  confirmReset: { ja: 'リセットを確認', 'zh-CN': '确认重置', 'zh-TW': '確認重置', en: 'Confirm Reset' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const lang = useLanguage();
  const searchParams = useSearchParams();
  const isGuide = searchParams.get('from') === 'guide';
  const loginPath = isGuide ? '/guide-partner/login' : '/login';

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError(t('linkExpired', lang));
      }
    };
    checkSession();
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(loginPath);
      }, 3000);
    } catch {
      setError(t('resetFailed', lang));
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
            <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-3">{t('passwordReset', lang)}</h1>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              {t('passwordUpdated', lang)}
            </p>
            <Link
              href={loginPath}
              className="block w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg"
            >
              {t('loginNow', lang)}
            </Link>
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
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
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
              {t('resetPasswordHero', lang)}<br />
              <span className="text-brand-300">{t('setNewPassword', lang)}</span>
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

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-full mb-4">
                  <KeyRound className="w-8 h-8 text-brand-600" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-neutral-900">{t('resetPasswordTitle', lang)}</h1>
                <p className="text-neutral-500 mt-2 text-sm">{t('resetPasswordSubtitle', lang)}</p>
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
                    {t('newPasswordLabel', lang)}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      placeholder={t('newPasswordPlaceholder', lang)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('confirmNewPasswordLabel', lang)}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      placeholder={t('confirmNewPasswordPlaceholder', lang)}
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
                      {t('resetting', lang)}
                    </>
                  ) : (
                    t('confirmReset', lang)
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
