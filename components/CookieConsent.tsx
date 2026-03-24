'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

type Language = 'zh-TW' | 'zh-CN' | 'ja' | 'en';

const labels: Record<Language, {
  message: string;
  accept: string;
  necessary: string;
  detail: string;
}> = {
  'ja': {
    message: '当サイトでは、サービス向上のためにCookieおよび分析ツールを使用しています。',
    accept: 'すべて許可',
    necessary: '必要なもののみ',
    detail: '詳細はプライバシーポリシーをご覧ください。',
  },
  'zh-TW': {
    message: '本網站使用 Cookie 及分析工具以提升服務品質。',
    accept: '全部接受',
    necessary: '僅必要',
    detail: '詳情請參閱隱私政策。',
  },
  'zh-CN': {
    message: '本网站使用 Cookie 及分析工具以提升服务品质。',
    accept: '全部接受',
    necessary: '仅必要',
    detail: '详情请参阅隐私政策。',
  },
  'en': {
    message: 'This site uses cookies and analytics tools to improve our services.',
    accept: 'Accept All',
    necessary: 'Necessary Only',
    detail: 'See our Privacy Policy for details.',
  },
};

function getLang(): Language {
  if (typeof window === 'undefined') return 'ja';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
      return value as Language;
    }
  }
  const nav = navigator.language;
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('en')) return 'en';
  if (nav === 'zh-TW' || nav === 'zh-HK') return 'zh-TW';
  return 'zh-CN';
}

const CONSENT_KEY = 'cookie_consent';

export type CookieConsentValue = 'all' | 'necessary' | null;

export function getConsent(): CookieConsentValue {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === 'all' || v === 'necessary') return v;
  return null;
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsentValue>(null);
  const [show, setShow] = useState(false);
  const [lang, setLang] = useState<Language>('ja');

  useEffect(() => {
    const stored = getConsent();
    setConsent(stored);
    setLang(getLang());
    if (!stored) {
      // Delay showing the banner slightly to avoid CLS
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (value: 'all' | 'necessary') => {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setShow(false);
  };

  const t = labels[lang];

  return (
    <>
      {/* Umami analytics — only load when user consented to all */}
      {consent === 'all' && (
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="905e0ccc-e1fc-4af5-8d17-8127501c6af3"
        />
      )}

      {/* Cookie consent banner */}
      {show && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 text-sm text-gray-700 leading-relaxed">
              <p>{t.message}</p>
              <a
                href="/legal/privacy"
                className="text-brand-700 hover:text-brand-900 underline underline-offset-2 text-xs mt-1 inline-block"
              >
                {t.detail}
              </a>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleAccept('necessary')}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {t.necessary}
              </button>
              <button
                onClick={() => handleAccept('all')}
                className="px-4 py-2 text-sm text-white bg-brand-800 rounded-lg hover:bg-brand-900 transition-colors whitespace-nowrap"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
