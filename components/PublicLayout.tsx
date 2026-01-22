'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, ChevronDown, LogIn, X, Menu, Mail, Phone, Printer, MapPin, MessageCircle } from 'lucide-react';
import { useWhiteLabel, useWhiteLabelVisibility } from '@/lib/contexts/WhiteLabelContext';

type Language = 'zh-TW' | 'ja' | 'en';

interface PublicLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  activeNav?: 'medical' | 'cancer' | 'golf' | 'business' | 'vehicles' | 'partner';
  transparentNav?: boolean; // 是否使用透明导航栏（融入 Hero）
  onLogoClick?: () => void; // 点击 Logo 时的回调（用于 SPA 内部导航）
}

const navLabels = {
  'zh-TW': {
    brand_sub: '新島交通株式會社',
    timc: '日本精密健檢',
    cancer: '日本綜合治療',
    golf: '名門高爾夫',
    business: '商務考察',
    vehicles: '車輛介紹',
    partner: '同業合作',
    guidePartner: '導遊合夥人',
    login: '會員登入',
  },
  'ja': {
    brand_sub: '新島交通株式会社',
    timc: '日本精密健診',
    cancer: '日本総合治療',
    golf: '名門ゴルフ',
    business: '商務視察',
    vehicles: '車両紹介',
    partner: '業務提携',
    guidePartner: 'ガイドパートナー',
    login: 'ログイン',
  },
  'en': {
    brand_sub: 'Niijima Kotsu Co., Ltd.',
    timc: 'Medical Checkup',
    cancer: 'Cancer Treatment',
    golf: 'Premium Golf',
    business: 'Business Tour',
    vehicles: 'Our Fleet',
    partner: 'Partnership',
    guidePartner: 'Guide Partner',
    login: 'Login',
  },
};

export default function PublicLayout({ children, showFooter = true, activeNav, transparentNav = true, onLogoClick }: PublicLayoutProps) {
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 白标模式
  const { isWhiteLabelMode, branding, contact, guideConfig, isSubscriptionActive } = useWhiteLabel();
  const { hideGuidePartnerContent, hideOfficialBranding } = useWhiteLabelVisibility();

  // 白标模式下显示导游品牌名，否则显示官方品牌
  const displayBrandName = hideOfficialBranding && branding.name ? branding.name : 'NIIJIMA';
  // 白标模式下副标题显示「日本高端定制旅行」，官方模式显示公司名
  const displayBrandSub = hideOfficialBranding
    ? '日本高端定制旅行'
    : navLabels[currentLang].brand_sub;

  const t = navLabels[currentLang];

  // 使用节流优化 scroll 事件
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 判断是否使用透明模式（未滚动 + 启用透明导航）
  const isTransparent = transparentNav && !scrolled;

  const LanguageSwitcher = () => (
    <div className="relative">
      <button
        onClick={() => setLangMenuOpen(!langMenuOpen)}
        className={`flex items-center gap-1 text-xs font-bold transition uppercase tracking-wider ${
          isTransparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'
        }`}
      >
        <Globe size={14} />
        {currentLang === 'zh-TW' ? '繁中' : currentLang.toUpperCase()}
        <ChevronDown size={12} />
      </button>
      {langMenuOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-down">
          {[{ code: 'ja', label: '日本語' }, { code: 'zh-TW', label: '繁體中文' }, { code: 'en', label: 'English' }].map((lang) => (
            <button key={lang.code} onClick={() => { setCurrentLang(lang.code as Language); setLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 transition ${currentLang === lang.code ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const isActive = (nav: string) => activeNav === nav;

  // 导航项的样式
  const getNavLinkClass = (nav: string, isCurrentActive: boolean, specialColor?: string) => {
    if (isTransparent) {
      // 透明模式：白色文字
      if (isCurrentActive) {
        return `text-sm font-bold text-white`;
      }
      if (specialColor === 'orange') {
        return `text-sm font-bold text-orange-400 hover:text-orange-300 transition`;
      }
      return `text-sm font-medium text-white/80 hover:text-white transition`;
    } else {
      // 白色背景模式：深色文字
      if (isCurrentActive) {
        if (specialColor === 'red') return `text-sm font-bold text-red-600`;
        return `text-sm font-bold text-blue-600`;
      }
      if (specialColor === 'orange') {
        return `text-sm font-bold text-orange-600 hover:text-orange-500 transition`;
      }
      if (specialColor === 'red') {
        return `text-sm font-medium text-gray-600 hover:text-red-600 transition`;
      }
      return `text-sm font-medium text-gray-600 hover:text-blue-600 transition`;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-100 flex flex-col">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isTransparent ? 'bg-transparent' : 'bg-white shadow-sm'
      }`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          {onLogoClick ? (
            <button onClick={onLogoClick} className="flex items-center gap-3 group">
              {/* 白标模式下如果有自定义 Logo 则显示 */}
              {hideOfficialBranding && branding.logoUrl && (
                <img src={branding.logoUrl} alt={displayBrandName} className="w-10 h-10 object-contain" />
              )}
              <div className="flex flex-col">
                <span className={`font-serif font-bold text-lg tracking-wide leading-none ${isTransparent ? 'text-white' : 'text-gray-900'}`}>{displayBrandName}</span>
                <span className={`text-[10px] uppercase tracking-widest leading-none mt-1 transition-colors ${isTransparent ? 'text-white/60' : 'text-gray-400 group-hover:text-blue-500'}`}>{displayBrandSub}</span>
              </div>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-3 group">
              {/* 白标模式下如果有自定义 Logo 则显示 */}
              {hideOfficialBranding && branding.logoUrl && (
                <img src={branding.logoUrl} alt={displayBrandName} className="w-10 h-10 object-contain" />
              )}
              <div className="flex flex-col">
                <span className={`font-serif font-bold text-lg tracking-wide leading-none ${isTransparent ? 'text-white' : 'text-gray-900'}`}>{displayBrandName}</span>
                <span className={`text-[10px] uppercase tracking-widest leading-none mt-1 transition-colors ${isTransparent ? 'text-white/60' : 'text-gray-400 group-hover:text-blue-500'}`}>{displayBrandSub}</span>
              </div>
            </Link>
          )}

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/?page=medical" className={getNavLinkClass('medical', isActive('medical'))}>{t.timc}</Link>
            <Link href="/cancer-treatment" className={getNavLinkClass('cancer', isActive('cancer'), 'red')}>{t.cancer}</Link>
            <Link href="/?page=golf" className={getNavLinkClass('golf', isActive('golf'))}>{t.golf}</Link>
            <Link href="/?page=business" className={getNavLinkClass('business', isActive('business'))}>{t.business}</Link>
            <Link href="/vehicles" className={getNavLinkClass('vehicles', isActive('vehicles'))}>{t.vehicles}</Link>
            {/* 白标模式下隐藏同业合作链接 */}
            {!hideGuidePartnerContent && (
              <Link href="/?page=partner" className={getNavLinkClass('partner', isActive('partner'))}>{t.partner}</Link>
            )}
            {/* 白标模式下隐藏导游合伙人链接 */}
            {!hideGuidePartnerContent && (
              <Link href="/guide-partner" className={getNavLinkClass('guidePartner', false, 'orange')}>{t.guidePartner}</Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link
              href="/login"
              className={`hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-wider transition shadow-lg ${
                isTransparent
                  ? 'bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30'
                  : 'bg-black text-white border border-transparent hover:bg-gray-800 hover:border-gray-600'
              }`}
            >
              <LogIn size={14} /> {t.login}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 ${isTransparent ? 'text-white' : 'text-gray-600'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-white z-40 p-6 flex flex-col gap-6 overflow-y-auto animate-fade-in-down">
          <Link href="/?page=medical" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b pb-2">{t.timc}</Link>
          <Link href="/cancer-treatment" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b pb-2 text-red-600">{t.cancer}</Link>
          <Link href="/?page=golf" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b pb-2">{t.golf}</Link>
          <Link href="/?page=business" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b pb-2">{t.business}</Link>
          <Link href="/vehicles" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b pb-2">{t.vehicles}</Link>
          {/* 白标模式下隐藏同业合作链接 */}
          {!hideGuidePartnerContent && (
            <Link href="/?page=partner" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b pb-2">{t.partner}</Link>
          )}
          {/* 白标模式下隐藏导游合伙人链接 */}
          {!hideGuidePartnerContent && (
            <Link href="/guide-partner" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b pb-2 text-orange-600 font-bold">{t.guidePartner}</Link>
          )}
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="bg-black text-white py-4 rounded-lg font-bold mt-4 text-center">{t.login}</Link>
        </div>
      )}

      {/* Main Content - 不再添加 pt-20，让内容可以延伸到导航栏下方 */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-[#111] text-white py-16 border-t border-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Column 1: Brand */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  {hideOfficialBranding && branding.logoUrl && (
                    <img src={branding.logoUrl} alt={displayBrandName} className="w-10 h-10 object-contain" />
                  )}
                  <span className="text-xl font-serif tracking-widest font-bold">{displayBrandName}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {hideOfficialBranding ? (
                    <>日本高端定制旅行<br/>精密健检 · 名门高尔夫 · 商务考察</>
                  ) : (
                    <>B2B Land Operator<br/>Specializing in Kansai Region</>
                  )}
                </p>
              </div>

              {/* Column 2: Services */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-gray-300">Services</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="/?page=medical" className="hover:text-white transition">{t.timc}</Link></li>
                  <li><Link href="/cancer-treatment" className="hover:text-white transition">{t.cancer}</Link></li>
                  <li><Link href="/?page=golf" className="hover:text-white transition">{t.golf}</Link></li>
                  <li><Link href="/?page=business" className="hover:text-white transition">{t.business}</Link></li>
                </ul>
              </div>

              {/* Column 3: Links */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-gray-300">Links</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="/health-screening" className="hover:text-white transition">AI 健康篩查</Link></li>
                  <li><Link href="/?page=medical" className="hover:text-white transition">精密體檢</Link></li>
                  <li><Link href="/company/about" className="hover:text-white transition">公司介紹</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition">常見問題</Link></li>
                  <li><Link href="/login" className="hover:text-white transition">會員登入</Link></li>
                </ul>
              </div>

              {/* Column 4: Contact - 白标模式显示导游联系方式，官方模式显示完整公司信息 */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-gray-300">Contact</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  {hideOfficialBranding ? (
                    // 白标模式：显示导游联系方式
                    <>
                      <li className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{contact.email || 'info@niijima-koutsu.jp'}</span>
                      </li>
                      {contact.phone && (
                        <li className="flex items-center gap-2">
                          <Phone size={14} />
                          <span>{contact.phone}</span>
                        </li>
                      )}
                      {contact.wechat && (
                        <li className="flex items-center gap-2">
                          <MessageCircle size={14} />
                          <span>微信: {contact.wechat}</span>
                        </li>
                      )}
                      {contact.line && (
                        <li className="flex items-center gap-2">
                          <MessageCircle size={14} />
                          <span>LINE: {contact.line}</span>
                        </li>
                      )}
                    </>
                  ) : (
                    // 官方模式：显示完整公司信息
                    <>
                      <li className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>haoyuan@niijima-koutsu.jp</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>06-6632-8807</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>〒556-0014 大阪府大阪市浪速区大国1-2-21-602</span>
                      </li>
                      <li className="flex items-start gap-2 mt-2">
                        <span className="text-xs text-gray-500">大阪府知事登録旅行業 第2-3115号</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
              {/* 法律必须显示的信息 - 无论何种模式都必须显示 */}
              <div className="mb-4 text-gray-400">
                <p>本サービスは新島交通株式会社が提供しています</p>
                <p className="mt-1">大阪府知事登録旅行業 第2-3115号 ｜ 一般社団法人 日本旅行業協会（JATA）正会員</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <Link href="/legal/tokushoho" className="hover:text-white transition">
                  特定商取引法に基づく表記
                </Link>
                <span className="text-gray-700">|</span>
                <Link href="/legal/privacy" className="hover:text-white transition">
                  プライバシーポリシー
                </Link>
              </div>
              {hideOfficialBranding ? (
                <>© {new Date().getFullYear()} {displayBrandName}. Powered by NIIJIMA</>
              ) : (
                <>© {new Date().getFullYear()} 新島交通株式會社. All rights reserved.</>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
