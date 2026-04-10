'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

type Locale = 'ja' | 'zh-TW' | 'zh-CN' | 'en' | 'ko';

interface Language {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '\u7B80\u4E2D', flag: '🇨🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
];

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'ja';

  // Check cookie first
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === LOCALE_COOKIE_NAME && ['ja', 'zh-TW', 'zh-CN', 'en', 'ko'].includes(value)) {
      return value as Locale;
    }
  }

  // Check browser language - more specific matching for Chinese variants
  const browserLang = navigator.language;
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') return 'zh-TW';
  if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) return 'zh-CN';
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('en')) return 'en';

  return 'ja'; // Default
}

function setStoredLocale(locale: Locale) {
  // Set cookie with 1 year expiry
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'footer' | 'sidebar';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('ja');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentLocale(getStoredLocale());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    setStoredLocale(locale);
    setCurrentLocale(locale);
    setIsOpen(false);

    // Reload page to apply new language
    window.location.reload();
  };

  const currentLanguage = languages.find(l => l.code === currentLocale) || languages[0];

  if (variant === 'compact') {
    const abbr = currentLocale === 'zh-TW' ? '繁中' : currentLocale === 'zh-CN' ? '简中' : currentLocale === 'ko' ? '한국' : currentLocale.toUpperCase();
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-600 hover:text-gray-900 transition rounded-lg hover:bg-gray-100 uppercase tracking-wider"
          aria-label="Select language"
        >
          <Globe size={14} />
          <span>{abbr}</span>
          <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-neutral-50 transition ${
                  currentLocale === lang.code ? 'text-brand-700 bg-brand-50' : 'text-neutral-600'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'sidebar') {
    const abbr = currentLocale === 'zh-TW' ? '繁中' : currentLocale === 'zh-CN' ? '简中' : currentLocale === 'ko' ? '한국' : currentLocale.toUpperCase();
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-xl transition"
          aria-label="Select language"
        >
          <Globe size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">{abbr}</span>
          <ChevronDown size={12} className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-neutral-50 transition ${
                  currentLocale === lang.code ? 'text-brand-700 bg-brand-50' : 'text-neutral-600'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe size={16} className="text-gray-400" />
        {languages.map((lang, index) => (
          <span key={lang.code}>
            <button
              onClick={() => handleLanguageChange(lang.code)}
              className={`text-sm hover:underline ${
                currentLocale === lang.code ? 'text-white font-medium' : 'text-gray-400'
              }`}
            >
              {lang.nativeName}
            </button>
            {index < languages.length - 1 && <span className="text-gray-600 mx-1">|</span>}
          </span>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition rounded-lg hover:bg-gray-100 border border-gray-200"
        aria-label="Select language"
      >
        <Globe size={16} />
        <span>{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition ${
                currentLocale === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs text-gray-400">{lang.name}</div>
              </div>
              {currentLocale === lang.code && <Check size={16} className="text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
