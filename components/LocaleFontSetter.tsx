'use client';

import { useEffect } from 'react';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

function getStoredLocale(): string {
  if (typeof window === 'undefined') return 'ja';

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === LOCALE_COOKIE_NAME && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
      return value;
    }
  }

  // Check browser language
  const browserLang = navigator.language;
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') return 'zh-TW';
  if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) return 'zh-CN';
  if (browserLang.startsWith('en')) return 'en';

  return 'ja';
}

export default function LocaleFontSetter() {
  useEffect(() => {
    const locale = getStoredLocale();
    document.documentElement.setAttribute('data-locale', locale);
  }, []);

  return null;
}
