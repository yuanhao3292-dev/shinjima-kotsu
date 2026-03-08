'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MemberLayout from '@/components/MemberLayout';
import Logo from '@/components/Logo';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, User } from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// ==================== 翻译对象 ====================
const translations = {
  // Hero 区域
  heroTitle: {
    ja: 'プロフェッショナル日本医療ツアー',
    'zh-CN': '专业日本医疗旅游',
    'zh-TW': '專業日本醫療旅遊',
    en: 'Professional Japan Medical Tourism',
  },
  heroSubtitle: {
    ja: 'TIMC 健診予約',
    'zh-CN': 'TIMC 健检预约',
    'zh-TW': 'TIMC 健檢預約',
    en: 'TIMC Health Checkup',
  },
  heroDescription: {
    ja: '徳洲会国際医療センター（TIMC）は日本最大の医療グループ徳洲会傘下の国際医療機関で、世界トップクラスの健康診断サービスを提供しています。',
    'zh-CN': '德洲会国际医疗中心（TIMC）是日本最大医疗集团德洲会旗下的国际医疗机构，为您提供世界顶级的健康检查服务。',
    'zh-TW': '德洲會國際醫療中心（TIMC）是日本最大醫療集團德洲會旗下的國際醫療機構，為您提供世界頂級的健康檢查服務。',
    en: 'Tokushukai International Medical Center (TIMC) is an international medical institution under Tokushukai, Japan\'s largest medical group, providing world-class health screening services.',
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

  // 表单标题
  pageTitle: {
    ja: '会員ログイン',
    'zh-CN': '会员登录',
    'zh-TW': '會員登入',
    en: 'Member Login',
  },
  pageSubtitle: {
    ja: 'ログインして健診予約を管理',
    'zh-CN': '登录以管理您的健检预约',
    'zh-TW': '登入以管理您的健檢預約',
    en: 'Login to manage your checkup appointments',
  },

  // 表单字段
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

  // 按钮文本
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

  // 分隔符
  or: {
    ja: 'または',
    'zh-CN': '或',
    'zh-TW': '或',
    en: 'or',
  },

  // 注册链接
  noAccount: {
    ja: 'アカウントをお持ちでないですか？',
    'zh-CN': '还没有账号？',
    'zh-TW': '還沒有帳號？',
    en: 'Don\'t have an account?',
  },
  registerNow: {
    ja: '今すぐ登録',
    'zh-CN': '立即注册',
    'zh-TW': '立即註冊',
    en: 'Register Now',
  },

  // 访客查询
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

  // 错误消息
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
} as const;

// 翻译辅助函数
const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

function LoginForm() {
  const lang = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/my-account';
  const urlError = searchParams.get('error');

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
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <Logo className="w-12 h-12 text-white" />
            <div>
              <span className="font-serif font-bold text-2xl tracking-wide">NIIJIMA</span>
              <p className="text-xs text-blue-200 uppercase tracking-widest">Medical Tourism</p>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
            {t('heroTitle', lang)}<br/>
            <span className="text-blue-400">{t('heroSubtitle', lang)}</span>
          </h1>
          <p className="text-gray-300 leading-relaxed mb-8 max-w-md">
            {t('heroDescription', lang)}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">{t('support24h', lang)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">{t('chineseService', lang)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Logo className="w-10 h-10 text-blue-600" />
            <span className="font-serif font-bold text-xl">NIIJIMA</span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">{t('pageTitle', lang)}</h1>
              <p className="text-gray-500 mt-2 text-sm">{t('pageSubtitle', lang)}</p>
            </div>

            {/* Error Messages */}
            {(error || urlError) && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle size={18} />
                <span>
                  {error || (urlError === 'auth_callback_error' ? t('errorAuthCallback', lang) : t('errorVerificationFailed', lang))}
                </span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('emailLabel', lang)}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={t('emailPlaceholder', lang)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('passwordLabel', lang)}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={t('passwordPlaceholder', lang)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t('forgotPassword', lang)}
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t('loggingIn', lang)}
                  </>
                ) : (
                  t('loginButton', lang)
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-400">{t('or', lang)}</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                {t('noAccount', lang)}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-bold ml-1"
                >
                  {t('registerNow', lang)}
                </Link>
              </p>
            </div>

            {/* Guest Order Lookup */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 mb-2">{t('guestLookup', lang)}</p>
              <Link
                href="/order-lookup"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
              >
                {t('useOrderNumber', lang)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <MemberLayout showFooter={false}>
      <Suspense fallback={<LoadingFallback />}>
        <LoginForm />
      </Suspense>
    </MemberLayout>
  );
}
