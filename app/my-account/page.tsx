'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import PublicLayout from '@/components/PublicLayout';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useSiteImages } from '@/lib/hooks/useSiteImages';
import { User } from '@supabase/supabase-js';
import {
  User as UserIcon,
  Mail,
  Calendar,
  LogOut,
  Loader2,
  ChevronRight,
  Shield,
} from 'lucide-react';

const translations = {
  loading: { ja: '読み込み中...', 'zh-CN': '载入中...', 'zh-TW': '載入中...', en: 'Loading...' },
  heroLabel: { ja: 'MY ACCOUNT', 'zh-CN': 'MY ACCOUNT', 'zh-TW': 'MY ACCOUNT', en: 'MY ACCOUNT' },
  member: { ja: '会員', 'zh-CN': '会员', 'zh-TW': '會員', en: 'Member' },
  welcomeBack: { ja: 'お帰りなさい', 'zh-CN': '欢迎回来', 'zh-TW': '歡迎回來', en: 'Welcome back' },
  accountDesc: { ja: 'ここで健診予約を管理し、注文記録を確認し、会員専用サービスをお楽しみください。', 'zh-CN': '在这里管理您的体检预约、查看订单记录，享受专属会员服务。', 'zh-TW': '在這裡管理您的健檢預約、查看訂單記錄，享受專屬會員服務。', en: 'Manage your health checkup appointments, view order history, and enjoy exclusive member services.' },
  support24h: { ja: '24時間サポート', 'zh-CN': '24小时客服支持', 'zh-TW': '24小時客服支援', en: '24/7 Support' },
  chineseService: { ja: '中国語サービス', 'zh-CN': '中文服务', 'zh-TW': '中文服務', en: 'Chinese Service' },
  welcomeBackShort: { ja: 'お帰りなさい！', 'zh-CN': '欢迎回来！', 'zh-TW': '歡迎回來！', en: 'Welcome back!' },
  verified: { ja: '確認済み', 'zh-CN': '已验证', 'zh-TW': '已驗證', en: 'Verified' },
  memberSince: { ja: '登録日', 'zh-CN': '加入于', 'zh-TW': '加入於', en: 'Member since' },
  myOrders: { ja: 'マイオーダー', 'zh-CN': '我的订单', 'zh-TW': '我的訂單', en: 'My Orders' },
  viewAllOrders: { ja: 'すべての予約記録を表示', 'zh-CN': '查看所有预约记录', 'zh-TW': '查看所有預約記錄', en: 'View all booking records' },
  bookCheckup: { ja: '健診予約', 'zh-CN': '预约体检', 'zh-TW': '預約體檢', en: 'Book Checkup' },
  browsePackages: { ja: '健診パッケージを閲覧', 'zh-CN': '浏览体检套餐', 'zh-TW': '瀏覽健檢套餐', en: 'Browse checkup packages' },
  aiHealthScreening: { ja: 'AI 健康スクリーニング', 'zh-CN': 'AI 健康筛查', 'zh-TW': 'AI 健康篩查', en: 'AI Health Screening' },
  free: { ja: '無料', 'zh-CN': '免费', 'zh-TW': '免費', en: 'Free' },
  aiScreeningDesc: { ja: 'AIが健康リスクを分析し、日本の先端治療を推奨', 'zh-CN': 'AI 分析健康风险，推荐日本先进治疗', 'zh-TW': 'AI 分析健康風險，推薦日本先端治療', en: 'AI analyzes health risks and recommends advanced Japanese treatments' },
  comprehensiveTreatment: { ja: '日本総合治療', 'zh-CN': '日本综合治疗', 'zh-TW': '日本綜合治療', en: 'Japan Comprehensive Treatment' },
  treatmentTypes: { ja: '陽子線・重粒子線、光免疫療法、BNCT', 'zh-CN': '质子重离子、光免疫疗法、BNCT', 'zh-TW': '質子重離子、光免疫療法、BNCT', en: 'Proton/Heavy Ion, Photoimmunotherapy, BNCT' },
  loggingOut: { ja: 'ログアウト中...', 'zh-CN': '登出中...', 'zh-TW': '登出中...', en: 'Logging out...' },
  logout: { ja: 'ログアウト', 'zh-CN': '登出', 'zh-TW': '登出', en: 'Logout' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

export default function MyAccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const lang = useLanguage();
  const supabase = createClient();
  const { getImage } = useSiteImages();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <PublicLayout showFooter={false} transparentNav={false}>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-700 mx-auto mb-4" />
            <p className="text-neutral-500 text-sm">{t('loading', lang)}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || t('member', lang);
  const localeMap: Record<Language, string> = {
    ja: 'ja-JP',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    en: 'en-US',
  };
  const memberSince = new Date(user.created_at).toLocaleDateString(localeMap[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      <div className="min-h-screen flex">
        {/* Left Side — Brand Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 overflow-hidden">
          <Image
            src={getImage('medical_hero', 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg')}
            alt="My Account"
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
                {t('welcomeBack', lang)}
                <br />
                <span className="text-gold-400">{userName}</span>
              </h1>

              <p className="text-lg text-neutral-300 leading-relaxed font-light mb-10 max-w-md">
                {t('accountDesc', lang)}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-neutral-300">{t('support24h', lang)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold-400 rounded-full" />
                  <span className="text-neutral-300">{t('chineseService', lang)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Account Info */}
        <div className="w-full lg:w-1/2 flex items-start justify-center p-8 pt-24 bg-white overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Mobile hero label */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-gold-400" />
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">MY ACCOUNT</span>
            </div>

            {/* Profile Section */}
            <div className="border border-neutral-200 p-8 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-neutral-50 border border-neutral-200 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-brand-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif text-brand-900">{userName}</h1>
                  <p className="text-neutral-500 text-sm">{t('welcomeBackShort', lang)}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-neutral-200 pt-6">
                <div className="flex items-center gap-3 text-neutral-600">
                  <Mail className="w-5 h-5 text-neutral-400" />
                  <span className="text-sm">{user.email}</span>
                  {user.email_confirmed_at && (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 border border-green-200">
                      <Shield className="w-3 h-3" />
                      {t('verified', lang)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-neutral-600">
                  <Calendar className="w-5 h-5 text-neutral-400" />
                  <span className="text-sm">{t('memberSince', lang)} {memberSince}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-neutral-200 overflow-hidden mb-6">
              <Link
                href="/my-orders"
                className="flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors border-b border-neutral-200"
              >
                <div>
                  <h3 className="font-semibold text-brand-900">{t('myOrders', lang)}</h3>
                  <p className="text-sm text-neutral-500">{t('viewAllOrders', lang)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400" />
              </Link>

              <Link
                href="/health-checkup"
                className="flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors border-b border-neutral-200"
              >
                <div>
                  <h3 className="font-semibold text-brand-900">{t('bookCheckup', lang)}</h3>
                  <p className="text-sm text-neutral-500">{t('browsePackages', lang)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400" />
              </Link>

              <Link
                href="/health-screening"
                className="flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors border-b border-neutral-200"
              >
                <div>
                  <h3 className="font-semibold text-brand-900 flex items-center gap-2">
                    {t('aiHealthScreening', lang)}
                    <span className="inline-flex items-center gap-1 text-xs bg-gold-400/10 text-gold-700 px-2 py-0.5 border border-gold-400/30">
                      {t('free', lang)}
                    </span>
                  </h3>
                  <p className="text-sm text-neutral-500">{t('aiScreeningDesc', lang)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400" />
              </Link>

              <Link
                href="/cancer-treatment"
                className="flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-brand-900">{t('comprehensiveTreatment', lang)}</h3>
                  <p className="text-sm text-neutral-500">{t('treatmentTypes', lang)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400" />
              </Link>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full bg-white hover:bg-neutral-50 text-neutral-700 font-medium py-4 px-6 border border-neutral-200 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loggingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('loggingOut', lang)}
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  {t('logout', lang)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
