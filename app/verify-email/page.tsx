'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { Loader2, AlertCircle, MailCheck } from 'lucide-react';

const translations = {
  title: { ja: 'メールアドレスの確認', 'zh-CN': '验证邮箱', 'zh-TW': '驗證郵箱', en: 'Verify Your Email' },
  subtitle: { ja: '登録時に届いた8桁の確認コードを入力してください', 'zh-CN': '请输入注册时收到的 8 位验证码', 'zh-TW': '請輸入註冊時收到的 8 位驗證碼', en: 'Enter the 8-digit code from your registration email' },
  emailLabel: { ja: 'メールアドレス', 'zh-CN': '电子邮箱', 'zh-TW': '電子郵箱', en: 'Email' },
  emailPlaceholder: { ja: 'your@email.com', 'zh-CN': 'your@email.com', 'zh-TW': 'your@email.com', en: 'your@email.com' },
  codeLabel: { ja: '確認コード', 'zh-CN': '验证码', 'zh-TW': '驗證碼', en: 'Verification Code' },
  codePlaceholder: { ja: '8桁の数字', 'zh-CN': '8 位数字', 'zh-TW': '8 位數字', en: '8 digits' },
  submit: { ja: 'アカウントを有効化', 'zh-CN': '激活账号', 'zh-TW': '啟用帳號', en: 'Activate Account' },
  submitting: { ja: '確認中...', 'zh-CN': '验证中...', 'zh-TW': '驗證中...', en: 'Verifying...' },
  invalid: { ja: '確認コードが正しくないか、有効期限が切れています', 'zh-CN': '验证码不正确或已过期', 'zh-TW': '驗證碼不正確或已過期', en: 'The code is incorrect or has expired' },
  hint: { ja: '確認コードの有効期限は1時間です。メールが届かない場合は迷惑メールフォルダをご確認ください。', 'zh-CN': '验证码 1 小时内有效。没收到邮件请检查垃圾邮件夹。', 'zh-TW': '驗證碼 1 小時內有效。沒收到郵件請檢查垃圾郵件匣。', en: 'The code is valid for 1 hour. If no email arrives, check your spam folder.' },
  resend: { ja: 'コードを再送信', 'zh-CN': '重新发送验证码', 'zh-TW': '重新發送驗證碼', en: 'Resend code' },
  resending: { ja: '送信中...', 'zh-CN': '发送中...', 'zh-TW': '發送中...', en: 'Sending...' },
  resent: { ja: '確認コードを再送信しました', 'zh-CN': '验证码已重新发送', 'zh-TW': '驗證碼已重新發送', en: 'A new code has been sent' },
  resendFailed: { ja: '再送信に失敗しました', 'zh-CN': '重新发送失败', 'zh-TW': '重新發送失敗', en: 'Failed to resend' },
  emailRequired: { ja: 'メールアドレスを入力してください', 'zh-CN': '请先填写邮箱', 'zh-TW': '請先填寫郵箱', en: 'Enter your email first' },
  backToLogin: { ja: 'ログインに戻る', 'zh-CN': '返回登录', 'zh-TW': '返回登入', en: 'Back to Login' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string =>
  (translations[key] as Record<Language, string>)[lang];

/**
 * 邮箱验证页。
 *
 * 独立成一个固定地址，而不是把输入框做在注册页的局部状态里 ——
 * 用户必须切到邮箱客户端抄验证码，回来时注册页的 React 状态早已丢失，
 * 会退回"填写注册表单"，验证码无处可填（这个坑在密码重置流程里踩过一次，
 * 注册流程又原样重犯了一遍）。固定地址刷新不丢、随时可回。
 */
function VerifyEmailForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const lang = useLanguage();

  // 注册页会把邮箱存下来，省去用户再输一遍
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.sessionStorage.getItem('pending_signup_email');
    if (saved) setEmail(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: 'signup',
      });

      if (verifyError) {
        setError(t('invalid', lang));
        return;
      }

      window.sessionStorage.removeItem('pending_signup_email');
      // 整页跳转：verifyOtp 刚写入会话 cookie，需要一次完整请求让服务端读到
      window.location.href = '/my-account';
    } catch {
      setError(t('invalid', lang));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError(t('emailRequired', lang));
      return;
    }
    setError('');
    setNotice('');
    setResending(true);

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });
      if (resendError) {
        setError(t('resendFailed', lang));
        return;
      }
      setNotice(t('resent', lang));
    } catch {
      setError(t('resendFailed', lang));
    } finally {
      setResending(false);
    }
  };

  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      <div className="min-h-screen flex items-center justify-center p-8 pt-24 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-50 border border-gold-200 mb-5">
              <MailCheck className="w-8 h-8 text-gold-500" />
            </div>
            <h1 className="text-2xl font-serif text-brand-900 mb-2">{t('title', lang)}</h1>
            <p className="text-sm text-neutral-500">{t('subtitle', lang)}</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm text-center">
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('emailLabel', lang)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                placeholder={t('emailPlaceholder', lang)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('codeLabel', lang)}
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                required
                autoFocus
                className="w-full px-4 py-3 border border-neutral-200 text-center text-2xl tracking-[0.4em] font-mono focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                placeholder={t('codePlaceholder', lang)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-gold-400 hover:bg-gold-300 disabled:bg-neutral-200 disabled:text-neutral-400 text-brand-900 font-medium py-3 px-6 text-sm tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {t('submitting', lang)}
                </>
              ) : (
                t('submit', lang)
              )}
            </button>
          </form>

          <p className="text-xs text-neutral-400 mt-5 text-center leading-relaxed">{t('hint', lang)}</p>

          <div className="flex items-center justify-center gap-4 mt-5 text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-brand-700 hover:text-brand-900 underline disabled:text-neutral-400"
            >
              {resending ? t('resending', lang) : t('resend', lang)}
            </button>
            <span className="text-neutral-300">|</span>
            <Link href="/login" className="text-brand-700 hover:text-brand-900 underline">
              {t('backToLogin', lang)}
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
