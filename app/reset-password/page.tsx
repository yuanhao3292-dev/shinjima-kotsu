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
  linkExpiredHint: { ja: 'リセットリンクは1回のみ有効です。複数回申請した場合は、最新のメールのリンクをご利用ください。', 'zh-CN': '重置链接只能使用一次。如果你申请了多封邮件，请点击最新一封里的链接。', 'zh-TW': '重置連結只能使用一次。如果你申請了多封郵件，請點擊最新一封裡的連結。', en: 'A reset link can only be used once. If you requested several emails, use the link in the most recent one.' },
  linkMissing: { ja: '\u30bb\u30c3\u30b7\u30e7\u30f3\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002\u78ba\u8a8d\u30b3\u30fc\u30c9\u306e\u5165\u529b\u304b\u3089\u3084\u308a\u76f4\u3057\u3066\u304f\u3060\u3055\u3044', 'zh-CN': '\u672a\u627e\u5230\u6709\u6548\u4f1a\u8bdd\uff0c\u8bf7\u91cd\u65b0\u7533\u8bf7\u9a8c\u8bc1\u7801', 'zh-TW': '\u672a\u627e\u5230\u6709\u6548\u6703\u8a71\uff0c\u8acb\u91cd\u65b0\u7533\u8acb\u9a57\u8b49\u78bc', en: 'No active session. Please request a verification code again' },
  verifying: { ja: 'リンクを確認しています...', 'zh-CN': '正在验证链接...', 'zh-TW': '正在驗證連結...', en: 'Verifying link...' },
  requestNewLink: { ja: '新しいリンクを申請する', 'zh-CN': '重新申请重置链接', 'zh-TW': '重新申請重置連結', en: 'Request a new link' },
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
  return (translations[key] as Record<Language, string>)[lang];
};

/** 链接校验的三种状态 */
type LinkState = 'verifying' | 'valid' | 'invalid';

/**
 * 读取 Supabase 回跳时携带的错误。
 * 它会把 error / error_code / error_description 同时放进 query 和 hash 片段，
 * 两处都要看。
 */
function readSupabaseAuthError(): { code: string; description: string } | null {
  if (typeof window === 'undefined') return null;

  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  const code = query.get('error_code') || hash.get('error_code');
  const error = query.get('error') || hash.get('error');
  if (!code && !error) return null;

  return {
    code: code || error || 'unknown',
    description: query.get('error_description') || hash.get('error_description') || '',
  };
}

/** URL 里是否带着待处理的恢复凭证（PKCE 的 code，或隐式流的 access_token） */
function hasPendingCredential(): boolean {
  if (typeof window === 'undefined') return false;
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return Boolean(query.get('code') || hash.get('access_token') || hash.get('code'));
}

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [linkState, setLinkState] = useState<LinkState>('verifying');
  const [linkErrorKey, setLinkErrorKey] = useState<'linkExpired' | 'linkMissing'>('linkExpired');
  const router = useRouter();
  const lang = useLanguage();
  const searchParams = useSearchParams();
  const isGuide = searchParams.get('from') === 'guide';
  const loginPath = isGuide ? '/guide-partner/login' : '/login';
  const forgotPath = isGuide ? '/forgot-password?from=guide' : '/forgot-password';

  useEffect(() => {
    const supabase = createClient();

    // Supabase 明确回报了错误（令牌过期、已被使用、类型不符…），直接采信
    const authError = readSupabaseAuthError();
    if (authError) {
      console.warn('[reset-password] Supabase 拒绝了恢复令牌:', authError.code, authError.description);
      setLinkErrorKey('linkExpired');
      setLinkState('invalid');
      return;
    }

    let settled = false;
    const markValid = () => {
      if (settled) return;
      settled = true;
      setLinkState('valid');
    };

    // 关键：supabase-js 需要异步解析 URL 里的凭证才能建立会话，
    // 直接 getSession() 很可能在解析完成前返回 null —— 那会让完全有效的
    // 链接也被判成"已过期"。因此监听状态变化，而不是只查一次。
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) markValid();
    });

    // 会话可能在订阅之前就已建立：
    //   - 用户在 /forgot-password 输入验证码通过后跳转过来（此时 URL 无凭证）
    //   - 用户刷新了本页
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) markValid();
    });

    // 兜底。URL 里带着待处理凭证时给足时间换取会话；否则只等一小会儿，
    // 因为验证码流程的会话本应已在本地存好，等久了只是白让用户干瞪眼。
    const timer = setTimeout(
      () => {
        if (!settled) {
          settled = true;
          setLinkErrorKey(hasPendingCredential() ? 'linkExpired' : 'linkMissing');
          setLinkState('invalid');
        }
      },
      hasPendingCredential() ? 8000 : 2500
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 没有有效会话时 updateUser 必然失败，且只会抛出英文原始错误。
    // 表单此时已经隐藏，这里是防止程序化提交的兜底。
    if (linkState !== 'valid') {
      setError(t(linkErrorKey, lang));
      return;
    }

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
          <div className={`absolute inset-0 bg-cover bg-center opacity-30`} style={{ backgroundImage: `url('${isGuide ? 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000' : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000'}')` }}></div>
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

              {linkState === 'verifying' && (
                <div className="mb-6 flex items-center justify-center gap-2 text-neutral-500 text-sm py-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>{t('verifying', lang)}</span>
                </div>
              )}

              {linkState === 'invalid' && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <p>{t(linkErrorKey, lang)}</p>
                      {linkErrorKey === 'linkExpired' && (
                        <p className="mt-1.5 text-red-600/80 text-xs leading-relaxed">
                          {t('linkExpiredHint', lang)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    href={forgotPath}
                    className="mt-3 block w-full text-center bg-brand-900 hover:bg-brand-800 text-white font-bold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    {t('requestNewLink', lang)}
                  </Link>
                </div>
              )}

              {error && linkState === 'valid' && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" hidden={linkState !== 'valid'}>
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
