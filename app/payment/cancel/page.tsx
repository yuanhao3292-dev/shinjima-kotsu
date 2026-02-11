'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { isValidSlug } from '@/lib/whitelabel-config';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const i18n = {
  title: { ja: 'お支払いがキャンセルされました', 'zh-TW': '支付已取消', 'zh-CN': '支付已取消', en: 'Payment Cancelled' } as Record<Language, string>,
  subtitle: { ja: 'お支払いはキャンセルされました。料金は発生しておりません。', 'zh-TW': '您的支付流程已取消，未產生任何費用。', 'zh-CN': '您的支付流程已取消，未产生任何费用。', en: 'Your payment has been cancelled. No charges were made.' } as Record<Language, string>,
  helpText: { ja: 'お支払いに問題がございましたら、カスタマーサポートまでお問い合わせください。', 'zh-TW': '如果您在支付過程中遇到問題，請聯繫我們的客服團隊。', 'zh-CN': '如果您在支付过程中遇到问题，请联系我们的客服团队。', en: 'If you encountered any issues during payment, please contact our support team.' } as Record<Language, string>,
  helpReady: { ja: 'いつでもお手伝いいたします！', 'zh-TW': '我們隨時為您提供幫助！', 'zh-CN': '我们随时为您提供帮助！', en: 'We are always here to help!' } as Record<Language, string>,
  retryPayment: { ja: 'お支払いをやり直す', 'zh-TW': '重新嘗試支付', 'zh-CN': '重新尝试支付', en: 'Retry Payment' } as Record<Language, string>,
  backToPackages: { ja: 'パッケージ一覧に戻る', 'zh-TW': '返回精密體檢', 'zh-CN': '返回精密健检', en: 'Back to Packages' } as Record<Language, string>,
  backToHome: { ja: 'トップページに戻る', 'zh-TW': '返回首頁', 'zh-CN': '返回首页', en: 'Back to Home' } as Record<Language, string>,
  backToGuide: { ja: 'ガイドページに戻る', 'zh-TW': '返回導遊主頁', 'zh-CN': '返回导游主页', en: 'Back to Guide Page' } as Record<Language, string>,
};

function detectLanguage(): Language {
  if (typeof document === 'undefined') return 'zh-TW';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
      return value as Language;
    }
  }
  const bl = navigator.language;
  if (bl.startsWith('ja')) return 'ja';
  if (bl === 'zh-TW' || bl === 'zh-Hant') return 'zh-TW';
  if (bl === 'zh-CN' || bl === 'zh-Hans' || bl.startsWith('zh')) return 'zh-CN';
  if (bl.startsWith('en')) return 'en';
  return 'zh-TW';
}

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');
  const guideSlugParam = (() => {
    const raw = searchParams.get('guide');
    if (raw && !isValidSlug(raw)) {
      console.warn('[SECURITY] Invalid guide slug in cancel URL:', raw);
      return null;
    }
    return raw;
  })();

  const [guideSlug, setGuideSlug] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [lang, setLang] = useState<Language>('zh-TW');

  useEffect(() => {
    setLang(detectLanguage());
  }, []);

  useEffect(() => {
    if (!orderId) {
      setGuideSlug(guideSlugParam);
      setLoaded(true);
      return;
    }

    async function fetchGuideSlug() {
      try {
        const response = await fetch(`/api/order-lookup?order_id=${encodeURIComponent(orderId)}`);
        if (response.ok) {
          const data = await response.json();
          const dbGuideSlug = typeof data.guideSlug === 'string' ? data.guideSlug : null;
          setGuideSlug(dbGuideSlug && isValidSlug(dbGuideSlug) ? dbGuideSlug : null);
        } else {
          setGuideSlug(guideSlugParam);
        }
      } catch {
        setGuideSlug(guideSlugParam);
      } finally {
        setLoaded(true);
      }
    }

    fetchGuideSlug();
  }, [orderId, guideSlugParam]);

  const t = (key: keyof typeof i18n) => i18n[key][lang];

  const backToPackagesHref = guideSlug ? `/g/${guideSlug}/medical-packages` : '/?page=medical';
  const backToHomeHref = guideSlug ? `/g/${guideSlug}` : '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-gray-600 mb-6">{t('subtitle')}</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2">{t('helpText')}</p>
          <p className="text-sm text-gray-700">{t('helpReady')}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {t('retryPayment')}
          </button>
          <Link
            href={backToPackagesHref}
            className={`block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 ${!loaded ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {t('backToPackages')}
          </Link>
          <Link
            href={backToHomeHref}
            className={`block w-full text-gray-600 hover:text-gray-800 font-semibold py-3 px-6 transition-colors duration-200 ${!loaded ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {guideSlug ? t('backToGuide') : t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
