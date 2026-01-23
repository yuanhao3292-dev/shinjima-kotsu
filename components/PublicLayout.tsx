'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, ChevronDown, LogIn, X, Menu } from 'lucide-react';
import { useWhiteLabel, useWhiteLabelVisibility } from '@/lib/contexts/WhiteLabelContext';

type Language = 'zh-TW' | 'zh-CN' | 'ja' | 'en';

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
    memberLogin: '個人會員登入',
    guideLogin: '導遊登入',
    memberLoginDesc: '醫療・健檢客戶',
    guideLoginDesc: '導遊合夥人',
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
    memberLogin: '個人会員ログイン',
    guideLogin: 'ガイドログイン',
    memberLoginDesc: '医療・健診のお客様',
    guideLoginDesc: 'ガイドパートナー',
  },
  'zh-CN': {
    brand_sub: '新岛交通株式会社',
    timc: '日本精密健检',
    cancer: '日本综合治疗',
    golf: '名门高尔夫',
    business: '商务考察',
    vehicles: '车辆介绍',
    partner: '同业合作',
    guidePartner: '导游合伙人',
    login: '会员登录',
    memberLogin: '个人会员登录',
    guideLogin: '导游登录',
    memberLoginDesc: '医疗・健检客户',
    guideLoginDesc: '导游合伙人',
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
    memberLogin: 'Member Login',
    guideLogin: 'Guide Login',
    memberLoginDesc: 'Medical & Checkup',
    guideLoginDesc: 'Guide Partner',
  },
};

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'zh-TW';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
      return value as Language;
    }
  }
  const browserLang = navigator.language;
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') return 'zh-TW';
  if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) return 'zh-CN';
  if (browserLang.startsWith('en')) return 'en';
  return 'zh-TW';
}

function persistLang(locale: Language) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `NEXT_LOCALE=${locale};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export default function PublicLayout({ children, showFooter = true, activeNav, transparentNav = true, onLogoClick }: PublicLayoutProps) {
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 从 cookie 读取语言偏好
  useEffect(() => {
    setCurrentLang(getInitialLang());
  }, []);

  // 切换语言时持久化到 cookie
  const handleLangChange = (lang: Language) => {
    setCurrentLang(lang);
    persistLang(lang);
    setLangMenuOpen(false);
    window.location.reload();
  };

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

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.login-dropdown') && !target.closest('.lang-dropdown')) {
        setLoginMenuOpen(false);
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // 判断是否使用透明模式（未滚动 + 启用透明导航）
  const isTransparent = transparentNav && !scrolled;

  const LanguageSwitcher = () => (
    <div className="relative lang-dropdown">
      <button
        onClick={() => setLangMenuOpen(!langMenuOpen)}
        className={`flex items-center gap-1 text-xs font-bold transition uppercase tracking-wider ${
          isTransparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'
        }`}
      >
        <Globe size={14} />
        {currentLang === 'zh-TW' ? '繁中' : currentLang === 'zh-CN' ? '简中' : currentLang.toUpperCase()}
        <ChevronDown size={12} />
      </button>
      {langMenuOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-down">
          {[{ code: 'ja', label: '日本語' }, { code: 'zh-TW', label: '繁體中文' }, { code: 'zh-CN', label: '简体中文' }, { code: 'en', label: 'English' }].map((lang) => (
            <button key={lang.code} onClick={() => handleLangChange(lang.code as Language)} className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 transition ${currentLang === lang.code ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}>
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
              <Link href="/business/partner" className={getNavLinkClass('partner', isActive('partner'))}>{t.partner}</Link>
            )}
            {/* 白标模式下隐藏导游合伙人链接 */}
            {!hideGuidePartnerContent && (
              <Link href="/guide-partner" className={getNavLinkClass('guidePartner', false, 'orange')}>{t.guidePartner}</Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <LanguageSwitcher />

            {/* Login Dropdown */}
            <div className="relative hidden md:block login-dropdown">
              <button
                onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-wider transition shadow-lg ${
                  isTransparent
                    ? 'bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30'
                    : 'bg-black text-white border border-transparent hover:bg-gray-800 hover:border-gray-600'
                }`}
              >
                <LogIn size={14} /> {t.login}
                <ChevronDown size={12} className={`transition-transform ${loginMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {loginMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-down">
                  <Link
                    href="/login"
                    onClick={() => setLoginMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <LogIn size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{t.memberLogin}</p>
                      <p className="text-[10px] text-gray-400">{t.memberLoginDesc}</p>
                    </div>
                  </Link>
                  {!hideGuidePartnerContent && (
                    <Link
                      href="/guide-partner/login"
                      onClick={() => setLoginMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <LogIn size={14} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{t.guideLogin}</p>
                        <p className="text-[10px] text-gray-400">{t.guideLoginDesc}</p>
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>

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
            <Link href="/business/partner" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b pb-2">{t.partner}</Link>
          )}
          {/* 白标模式下隐藏导游合伙人链接 */}
          {!hideGuidePartnerContent && (
            <Link href="/guide-partner" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b pb-2 text-orange-600 font-bold">{t.guidePartner}</Link>
          )}

          {/* 登入入口区域 */}
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">{t.login}</p>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 bg-blue-600 text-white py-4 px-5 rounded-xl font-bold"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <LogIn size={18} />
              </div>
              <div>
                <p>{t.memberLogin}</p>
                <p className="text-xs font-normal opacity-80">{t.memberLoginDesc}</p>
              </div>
            </Link>
            {!hideGuidePartnerContent && (
              <Link
                href="/guide-partner/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 bg-orange-500 text-white py-4 px-5 rounded-xl font-bold"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <LogIn size={18} />
                </div>
                <div>
                  <p>{t.guideLogin}</p>
                  <p className="text-xs font-normal opacity-80">{t.guideLoginDesc}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Content - 不再添加 pt-20，让内容可以延伸到导航栏下方 */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - 日式专业设计 */}
      {showFooter && (
        <footer className="bg-gradient-to-b from-[#f8f6f3] to-[#f0ece6] text-gray-800">
          {/* 主要内容区 */}
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">

              {/* 品牌区域 - 占 2 列 */}
              <div className="col-span-2">
                <div className="mb-4">
                  {hideOfficialBranding && branding.logoUrl ? (
                    <div className="flex items-center gap-3 mb-4">
                      <img src={branding.logoUrl} alt={displayBrandName} className="w-10 h-10 object-contain" />
                      <span className="text-xl font-serif tracking-wider text-gray-800">{displayBrandName}</span>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-serif tracking-[0.2em] mb-1 text-gray-800">NIIJIMA</h3>
                      <p className="text-xs tracking-[0.1em] text-gray-500">新島交通株式會社</p>
                    </>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-[280px]">
                  {hideOfficialBranding ? (
                    <>專注日本高端定制旅行<br/>精密健檢 · 名門高爾夫 · 商務考察</>
                  ) : (
                    <>為各國訪日遊客提供精密健檢、名門高爾夫、商務考察等定制服務。</>
                  )}
                </p>
                {/* 联系方式 */}
                {hideOfficialBranding ? (
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>{contact.email || 'info@niijima-koutsu.jp'}</div>
                    {contact.phone && <div>{contact.phone}</div>}
                  </div>
                ) : (
                  <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                    <div>〒556-0014 大阪府大阪市浪速区大国1-2-21-602</div>
                    <div>
                      <a href="tel:06-6632-8807" className="hover:text-gray-900 transition-colors">TEL: 06-6632-8807</a>
                    </div>
                    <div>
                      <a href="mailto:haoyuan@niijima-koutsu.jp" className="hover:text-gray-900 transition-colors">haoyuan@niijima-koutsu.jp</a>
                    </div>
                  </div>
                )}
                {/* 社交媒体图标 */}
                {!hideOfficialBranding && (
                  <div className="flex items-center gap-3">
                    <a href="https://wa.me/818012345678" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800/5 hover:bg-gray-800/10 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700" aria-label="WhatsApp">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-gray-800/5 hover:bg-gray-800/10 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700" aria-label="WeChat">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.245 0-.06-.024-.12-.04-.178l-.327-1.233a.492.492 0 01.178-.554C23.469 18.287 24.5 16.489 24.5 14.478c0-3.015-3.282-5.568-7.562-5.62zm-2.615 3.418c.545 0 .987.45.987 1.003a.995.995 0 01-.987 1.003.995.995 0 01-.988-1.003c0-.553.442-1.003.988-1.003zm4.938 0c.545 0 .987.45.987 1.003a.995.995 0 01-.987 1.003.995.995 0 01-.988-1.003c0-.553.443-1.003.988-1.003z"/></svg>
                    </a>
                    <a href="https://line.me/ti/p/~niijima-koutsu" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800/5 hover:bg-gray-800/10 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700" aria-label="LINE">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                    </a>
                  </div>
                )}
              </div>

              {/* 服务项目 */}
              <div>
                <h4 className="text-xs font-medium tracking-wider text-gray-800 uppercase mb-4">服務項目</h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/?page=medical" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {t.timc}
                    </Link>
                  </li>
                  <li>
                    <Link href="/cancer-treatment" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {t.cancer}
                    </Link>
                  </li>
                  <li>
                    <Link href="/?page=golf" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {t.golf}
                    </Link>
                  </li>
                  <li>
                    <Link href="/?page=business" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {t.business}
                    </Link>
                  </li>
                  <li>
                    <Link href="/vehicles" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      車輛介紹
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 合作伙伴 */}
              <div>
                <h4 className="text-xs font-medium tracking-wider text-gray-800 uppercase mb-4">合作夥伴</h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/guide-partner" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      導遊合夥人
                    </Link>
                  </li>
                  <li>
                    <Link href="/business/partner" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      同業合作
                    </Link>
                  </li>
                  <li>
                    <Link href="/health-screening" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      AI 健康評估
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 公司信息 */}
              <div>
                <h4 className="text-xs font-medium tracking-wider text-gray-800 uppercase mb-4">公司資訊</h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/company/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      關於我們
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      最新消息
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      常見問題
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/tokushoho" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      特定商取引法
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      隱私政策
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      使用條款
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 底部信息栏 */}
          <div className="border-t border-gray-300/50">
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* 资质信息 */}
                <div className="text-center md:text-left">
                  <p className="text-xs text-gray-500">大阪府知事登録旅行業 第2-3115号 ｜ 一般社団法人 日本旅行業協会（JATA）正会員</p>
                </div>

                {/* 版权信息 */}
                <div className="text-center md:text-right">
                  <p className="text-xs text-gray-500">
                    {hideOfficialBranding ? (
                      <>© {new Date().getFullYear()} {displayBrandName}. All rights reserved.</>
                    ) : (
                      <>© {new Date().getFullYear()} 新島交通株式會社. All rights reserved.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
