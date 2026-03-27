'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { User, LogOut } from 'lucide-react';

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
  aiScreening: { ja: 'AI ヘルスチェック', 'zh-CN': 'AI 健康自测', 'zh-TW': 'AI 健康自測', en: 'AI Health Check' },
  faq: { ja: 'よくある質問', 'zh-CN': '常见问题', 'zh-TW': '常見問題', en: 'FAQ' },
  member: { ja: '会員', 'zh-CN': '会员', 'zh-TW': '會員', en: 'Member' },
  logout: { ja: 'ログアウト', 'zh-CN': '登出', 'zh-TW': '登出', en: 'Logout' },
  memberLogin: { ja: '会員ログイン', 'zh-CN': '会员登录', 'zh-TW': '會員登入', en: 'Member Login' },

  // Footer
  brandDesc: { ja: '日本医療ツーリズム専門サービス', 'zh-CN': '专业日本医疗旅游服务', 'zh-TW': '專業日本醫療旅遊服務', en: 'Professional Japan Medical Tourism Service' },
  hospitalName: { ja: 'TIMC 大阪徳洲会国際医療センター', 'zh-CN': 'TIMC 大阪德州会国际医疗中心', 'zh-TW': 'TIMC 大阪德州會國際醫療中心', en: 'TIMC Osaka Tokushukai International Medical Center' },
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
          {/* 返回链接 - 会员子页面返回会员中心，会员中心本身和其他页面返回首页 */}
          <Link
            href={isLoggedIn && isMemberPage && pathname !== '/my-account' ? '/my-account' : '/'}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            {t('back', lang)}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">{t('home', lang)}</Link>
            <Link href="/medical" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">{t('medicalCheckup', lang)}</Link>
            <Link href="/cancer-treatment" className="text-sm font-medium text-gray-600 hover:text-rose-600 transition">{t('cancerTreatment', lang)}</Link>
            <Link href="/login?redirect=/health-screening" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">{t('aiScreening', lang)}</Link>
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
        <footer className="bg-gradient-to-b from-[#f8f6f3] to-[#f0ece6] text-gray-800">
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Column 1: Brand */}
              <div>
                <h3 className="text-xl font-serif tracking-[0.2em] mb-1 text-gray-800">NIIJIMA</h3>
                <p className="text-xs tracking-[0.1em] text-gray-500 mb-4">{t('brandDesc', lang)}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {t('hospitalName', lang)}
                </p>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div>{lang === 'en' ? '1-2-21-602 Daikoku, Naniwa-ku, Osaka 556-0014, Japan' : lang === 'zh-TW' ? '〒556-0014 大阪府大阪市浪速區大國1-2-21-602' : lang === 'zh-CN' ? '〒556-0014 大阪府大阪市浪速区大国1-2-21-602' : '〒556-0014 大阪府大阪市浪速区大国1-2-21-602'}</div>
                  <div className="flex items-center gap-3">
                    <a href="tel:06-6632-8807" className="hover:text-gray-900 transition-colors">TEL: 06-6632-8807</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href="mailto:info@niijima-koutsu.jp" className="hover:text-gray-900 transition-colors">info@niijima-koutsu.jp</a>
                  </div>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="text-xs font-medium tracking-wider text-gray-800 uppercase mb-4">{t('quickLinks', lang)}</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/medical" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('medicalCheckup', lang)}</Link></li>
                  <li><Link href="/login?redirect=/health-screening" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('aiScreening', lang)}</Link></li>
                  <li><Link href="/cancer-treatment" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('cancerTreatment', lang)}</Link></li>
                  <li><Link href="/order-lookup" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('orderLookup', lang)}</Link></li>
                  <li><Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('faq', lang)}</Link></li>
                  {isLoggedIn && (
                    <>
                      <li><Link href="/my-account" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('memberCenter', lang)}</Link></li>
                      <li><Link href="/my-orders" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('myOrders', lang)}</Link></li>
                    </>
                  )}
                </ul>
              </div>

              {/* Column 3: Legal */}
              <div>
                <h4 className="text-xs font-medium tracking-wider text-gray-800 uppercase mb-4">{t('contactUs', lang)}</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/company/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('legalNotice', lang)}</Link></li>
                  <li><Link href="/legal/tokushoho" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('tokushoho', lang)}</Link></li>
                  <li><Link href="/legal/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('privacy', lang)}</Link></li>
                  <li><Link href="/legal/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('terms', lang)}</Link></li>
                </ul>
              </div>

              {/* Column 4: LINE Support */}
              <div>
                <h4 className="text-xs font-medium tracking-wider text-gray-800 uppercase mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {t('lineSupport', lang)}
                </h4>
                <div className="bg-white/60 p-5 rounded-xl border border-gray-200">
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
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-300/50">
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-xs text-gray-500 text-center md:text-left">{t('legalLicense', lang)}</p>
                <p className="text-xs text-gray-500 text-center md:text-right">© {new Date().getFullYear()} 新島交通株式會社. {t('allRightsReserved', lang)}</p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
