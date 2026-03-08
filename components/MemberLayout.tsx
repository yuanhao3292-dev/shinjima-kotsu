'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { Mail, Phone, Printer, MapPin, User, LogOut } from 'lucide-react';

interface MemberLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const translations = {
  // Navigation
  back: { ja: '← 戻る', 'zh-CN': '← 返回', 'zh-TW': '← 返回', en: '← Back' },
  home: { ja: 'ホーム', 'zh-CN': '首页', 'zh-TW': '首頁', en: 'Home' },
  medicalCheckup: { ja: '精密健診', 'zh-CN': '精密体检', 'zh-TW': '精密體檢', en: 'Medical Checkup' },
  cancerTreatment: { ja: '総合治療', 'zh-CN': '综合治疗', 'zh-TW': '綜合治療', en: 'Comprehensive Treatment' },
  aiScreening: { ja: 'AI 健康スクリーニング', 'zh-CN': 'AI 健康筛查', 'zh-TW': 'AI 健康篩查', en: 'AI Health Screening' },
  faq: { ja: 'よくある質問', 'zh-CN': '常见问题', 'zh-TW': '常見問題', en: 'FAQ' },
  member: { ja: '会員', 'zh-CN': '会员', 'zh-TW': '會員', en: 'Member' },
  logout: { ja: 'ログアウト', 'zh-CN': '登出', 'zh-TW': '登出', en: 'Logout' },
  memberLogin: { ja: '会員ログイン', 'zh-CN': '会员登录', 'zh-TW': '會員登入', en: 'Member Login' },

  // Footer
  brandDesc: { ja: '日本医療ツーリズム専門サービス', 'zh-CN': '专业日本医疗旅游服务', 'zh-TW': '專業日本醫療旅遊服務', en: 'Professional Japan Medical Tourism Service' },
  hospitalName: { ja: 'TIMC 大阪徳洲会国際医療センター', 'zh-CN': 'TIMC 大阪德洲会国际医疗中心', 'zh-TW': 'TIMC 大阪德洲會國際醫療中心', en: 'TIMC Osaka Tokushukai International Medical Center' },
  quickLinks: { ja: 'クイックリンク', 'zh-CN': '快速链接', 'zh-TW': '快速連結', en: 'Quick Links' },
  orderLookup: { ja: '注文照会', 'zh-CN': '订单查询', 'zh-TW': '訂單查詢', en: 'Order Lookup' },
  memberCenter: { ja: '会員センター', 'zh-CN': '会员中心', 'zh-TW': '會員中心', en: 'Member Center' },
  myOrders: { ja: 'マイオーダー', 'zh-CN': '我的订单', 'zh-TW': '我的訂單', en: 'My Orders' },
  contactUs: { ja: 'お問い合わせ', 'zh-CN': '联系我们', 'zh-TW': '聯繫我們', en: 'Contact Us' },
  lineSupport: { ja: 'LINE カスタマーサポート', 'zh-CN': 'LINE 客服', 'zh-TW': 'LINE 客服', en: 'LINE Support' },
  scanQR: { ja: 'LINE カスタマーサポートQRコードをスキャン', 'zh-CN': '扫码添加 LINE 客服', 'zh-TW': '掃碼添加 LINE 客服', en: 'Scan to add LINE support' },
  replyWithin24h: { ja: '24時間以内に返信', 'zh-CN': '24小时内回复', 'zh-TW': '24小時內回覆', en: 'Reply within 24 hours' },
  legalNotice: { ja: '本サービスは新島交通株式会社が提供しています', 'zh-CN': '本服务由新岛交通株式会社提供', 'zh-TW': '本服務由新島交通株式會社提供', en: 'This service is provided by Niijima Kotsu Co., Ltd.' },
  legalLicense: { ja: '大阪府知事登録旅行業 第2-3115号 ｜ 一般社団法人 日本旅行業協会（JATA）正会員', 'zh-CN': '大阪府知事登录旅行业 第2-3115号 ｜ 日本旅行业协会（JATA）正式会员', 'zh-TW': '大阪府知事登錄旅行業 第2-3115號 ｜ 日本旅行業協會（JATA）正式會員', en: 'Osaka Prefecture Travel Agency No. 2-3115 | JATA Member' },
  tokushoho: { ja: '特定商取引法に基づく表記', 'zh-CN': '特定商交易法声明', 'zh-TW': '特定商交易法聲明', en: 'Specified Commercial Transaction Act' },
  privacy: { ja: 'プライバシーポリシー', 'zh-CN': '隐私政策', 'zh-TW': '隱私政策', en: 'Privacy Policy' },
  terms: { ja: '利用規約', 'zh-CN': '使用条款', 'zh-TW': '使用條款', en: 'Terms of Service' },
  allRightsReserved: { ja: 'All rights reserved.', 'zh-CN': 'All rights reserved.', 'zh-TW': 'All rights reserved.', en: 'All rights reserved.' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

export default function MemberLayout({ children, showFooter = true }: MemberLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const pathname = usePathname();
  const supabase = createClient();
  const lang = useLanguage();

  // 判断当前是否在会员相关页面
  const isMemberPage = ['/my-account', '/my-orders', '/login', '/register', '/forgot-password', '/reset-password', '/order-lookup'].some(
    path => pathname?.startsWith(path)
  );

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '會員');
      }
    };
    checkAuth();

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '會員');
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-100 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* 返回链接 - 会员页面点击返回会员中心，否则返回首页 */}
          <Link
            href={isLoggedIn && isMemberPage ? '/my-account' : '/'}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            {t('back', lang)}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">{t('home', lang)}</Link>
            <Link href="/medical" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">{t('medicalCheckup', lang)}</Link>
            <Link href="/cancer-treatment" className="text-sm font-medium text-gray-600 hover:text-rose-600 transition">{t('cancerTreatment', lang)}</Link>
            <Link href="/health-screening" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">{t('aiScreening', lang)}</Link>
            <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">{t('faq', lang)}</Link>
          </div>

          {/* Actions - 根据登录状态显示不同内容 */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/my-account"
                  className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-blue-700 transition shadow-lg"
                >
                  <User size={14} />
                  {userName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1 text-gray-500 hover:text-red-600 transition text-xs"
                  title={t('logout', lang)}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-gray-800 transition shadow-lg"
              >
                {t('memberLogin', lang)}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-[#111] text-white py-16 border-t border-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Column 1: Brand */}
              <div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {t('brandDesc', lang)}<br/>
                  {t('hospitalName', lang)}
                </p>
                <p className="text-gray-500 text-xs">
                  &copy; 2025 Niijima Kotsu Co., Ltd.<br/>{t('allRightsReserved', lang)}
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6">{t('quickLinks', lang)}</h4>
                <div className="space-y-3 text-sm text-gray-400">
                  <Link href="/medical" className="block hover:text-white transition">{t('medicalCheckup', lang)}</Link>
                  <Link href="/health-screening" className="block hover:text-white transition">{t('aiScreening', lang)}</Link>
                  <Link href="/order-lookup" className="block hover:text-white transition">{t('orderLookup', lang)}</Link>
                  <Link href="/faq" className="block hover:text-white transition">{t('faq', lang)}</Link>
                  {isLoggedIn && (
                    <>
                      <Link href="/my-account" className="block hover:text-white transition">{t('memberCenter', lang)}</Link>
                      <Link href="/my-orders" className="block hover:text-white transition">{t('myOrders', lang)}</Link>
                    </>
                  )}
                </div>
              </div>

              {/* Column 3: Contact */}
              <div>
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6">{t('contactUs', lang)}</h4>
                <div className="space-y-3 text-sm text-gray-400">
                  <p className="flex items-center gap-3"><Mail size={16} /> info@niijima-koutsu.jp</p>
                  <p className="flex items-center gap-3"><Phone size={16} /> 06-6632-8807</p>
                  <p className="flex items-center gap-3"><Printer size={16} /> 06-6632-8826 (FAX)</p>
                  <p className="flex items-start gap-3 mt-4">
                    <MapPin size={16} className="mt-1 min-w-[16px]" />
                    <span>〒556-0014<br/>大阪府大阪市浪速区大国1-2-21-602</span>
                  </p>
                </div>
              </div>

              {/* Column 4: LINE Support */}
              <div>
                <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {t('lineSupport', lang)}
                </h4>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <p className="text-xs text-gray-500 mb-2">{t('scanQR', lang)}</p>
                  <a
                    href="https://line.me/ti/p/j3XxBP50j9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#06C755] font-bold hover:underline"
                  >
                    @niijima-medical
                  </a>
                  <p className="text-xs text-gray-500 mt-3">{t('replyWithin24h', lang)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
              {/* 法律必须显示的信息 */}
              <div className="mb-4 text-gray-400">
                <p>{t('legalNotice', lang)}</p>
                <p className="mt-1">{t('legalLicense', lang)}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <Link href="/legal/tokushoho" className="hover:text-white transition">
                  {t('tokushoho', lang)}
                </Link>
                <span className="text-gray-700">|</span>
                <Link href="/legal/privacy" className="hover:text-white transition">
                  {t('privacy', lang)}
                </Link>
                <span className="text-gray-700">|</span>
                <Link href="/legal/terms" className="hover:text-white transition">
                  {t('terms', lang)}
                </Link>
              </div>
              <p>© {new Date().getFullYear()} 新島交通株式會社. {t('allRightsReserved', lang)}</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
