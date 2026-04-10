'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, ChevronDown, Lock } from 'lucide-react';

type Language = 'zh-TW' | 'zh-CN' | 'ja' | 'en';

interface CheckoutLayoutProps {
  children: React.ReactNode;
  serviceName?: string;
  backHref?: string;
  backLabel?: string;
}

const brandLabels: Record<Language, { sub: string; legal: string; copyright: string }> = {
  'zh-TW': {
    sub: '新島交通株式會社',
    legal: '大阪府知事登録旅行業 第2-3115号',
    copyright: '新島交通株式會社',
  },
  'zh-CN': {
    sub: '新岛交通株式会社',
    legal: '大阪府知事登録旅行業 第2-3115号',
    copyright: '新岛交通株式会社',
  },
  ja: {
    sub: '新島交通株式会社',
    legal: '大阪府知事登録旅行業 第2-3115号',
    copyright: '新島交通株式会社',
  },
  en: {
    sub: 'Niijima Kotsu Co., Ltd.',
    legal: 'Osaka Registered Travel Agency No. 2-3115',
    copyright: 'Niijima Kotsu Co., Ltd.',
  },
};

const securePaymentLabel: Record<Language, string> = {
  'zh-TW': '安全結帳',
  'zh-CN': '安全结账',
  ja: '安全なお支払い',
  en: 'Secure Checkout',
};

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'zh-CN';
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
  return 'zh-CN';
}

function persistLang(locale: Language) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `NEXT_LOCALE=${locale};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const [currentLang, setCurrentLang] = useState<Language>('zh-CN');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const displayBrandName = 'NIIJIMA';

  useEffect(() => {
    setCurrentLang(getInitialLang());
  }, []);

  const handleLangChange = (lang: Language) => {
    setCurrentLang(lang);
    persistLang(lang);
    setLangMenuOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.checkout-lang-dropdown')) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const labels = brandLabels[currentLang];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal top bar */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Brand - minimal, synced with whitelabel settings */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm tracking-wide text-brand-900">{displayBrandName}</span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 leading-none">
                {labels.sub}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Secure badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400">
              <Lock size={12} className="text-green-500" />
              <span>{securePaymentLabel[currentLang]}</span>
            </div>

            {/* Language Switcher */}
            <div className="relative checkout-lang-dropdown">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 transition"
              >
                <Globe size={13} />
                {currentLang === 'zh-TW' ? '繁中' : currentLang === 'zh-CN' ? '简中' : currentLang.toUpperCase()}
                <ChevronDown size={11} />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-neutral-200 py-1.5 z-50">
                  {[
                    { code: 'ja', label: '\u65E5\u672C\u8A9E' },
                    { code: 'zh-TW', label: '\u7E41\u4E2D' },
                    { code: 'zh-CN', label: '\u7B80\u4E2D' },
                    { code: 'en', label: 'English' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code as Language)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white transition ${
                        currentLang === lang.code ? 'text-brand-700 font-medium' : 'text-neutral-600'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="bg-white border-t border-neutral-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-neutral-400">
            {labels.legal}
          </p>
          <p className="text-xs text-neutral-300 mt-1">
            © {new Date().getFullYear()} {labels.copyright}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
