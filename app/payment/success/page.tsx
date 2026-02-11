'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { isValidSlug } from '@/lib/whitelabel-config';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const i18n = {
  loading: { ja: 'お支払い状況を確認中...', 'zh-TW': '驗證支付狀態...', 'zh-CN': '验证支付状态...', en: 'Verifying payment...' } as Record<Language, string>,
  title: { ja: 'お支払い完了！', 'zh-TW': '支付成功！', 'zh-CN': '支付成功！', en: 'Payment Successful!' } as Record<Language, string>,
  subtitle: { ja: 'ご予約ありがとうございます！お支払いを確認いたしました。', 'zh-TW': '感謝您的預約！我們已收到您的付款。', 'zh-CN': '感谢您的预约！我们已收到您的付款。', en: 'Thank you for your booking! We have received your payment.' } as Record<Language, string>,
  emailSent: { ja: '確認メールをお送りしました', 'zh-TW': '確認郵件已發送到您的信箱', 'zh-CN': '确认邮件已发送到您的邮箱', en: 'Confirmation email has been sent' } as Record<Language, string>,
  contactSoon: { ja: '1〜2営業日以内に担当者よりご連絡し、検診日程・詳細をご案内いたします', 'zh-TW': '我們的客服團隊將在 1-2 個工作日內與您聯繫，確認體檢日期和詳細安排', 'zh-CN': '我们的客服团队将在 1-2 个工作日内与您联系，确认体检日期和详细安排', en: 'Our team will contact you within 1-2 business days to confirm the schedule and details' } as Record<Language, string>,
  keepPhone: { ja: 'お電話に出られるようにし、メールもご確認ください', 'zh-TW': '請保持電話暢通，注意查收郵件', 'zh-CN': '请保持电话畅通，注意查收邮件', en: 'Please keep your phone available and check your email' } as Record<Language, string>,
  orderNumber: { ja: '注文番号', 'zh-TW': '訂單編號', 'zh-CN': '订单编号', en: 'Order ID' } as Record<Language, string>,
  backToPackages: { ja: 'パッケージ一覧に戻る', 'zh-TW': '返回套餐列表', 'zh-CN': '返回套餐列表', en: 'Back to Packages' } as Record<Language, string>,
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

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const guideSlugParam = (() => {
    const raw = searchParams.get('guide');
    if (raw && !isValidSlug(raw)) {
      console.warn('[SECURITY] Invalid guide slug in success URL:', raw);
      return null;
    }
    return raw;
  })();

  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [guideSlug, setGuideSlug] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('zh-TW');

  useEffect(() => {
    setLang(detectLanguage());
  }, []);

  useEffect(() => {
    if (!sessionId) {
      router.push(guideSlugParam ? `/g/${guideSlugParam}` : '/?page=medical');
      return;
    }

    async function fetchOrderId() {
      try {
        const response = await fetch(`/api/order-lookup?session_id=${encodeURIComponent(sessionId)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.orderId) setOrderId(data.orderId);
          const dbGuideSlug = typeof data.guideSlug === 'string' ? data.guideSlug : null;
          setGuideSlug(dbGuideSlug && isValidSlug(dbGuideSlug) ? dbGuideSlug : null);
        } else {
          setGuideSlug(null);
        }
      } catch (error) {
        console.error('Failed to fetch order info:', error);
        setGuideSlug(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderId();
  }, [sessionId, router, guideSlugParam]);

  const t = (key: keyof typeof i18n) => i18n[key][lang];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('loading')}</div>
      </div>
    );
  }

  const displayOrderId = orderId
    ? `#${orderId.slice(-8).toUpperCase()}`
    : sessionId
      ? `#${sessionId.slice(-8).toUpperCase()}`
      : '';

  const backToPackagesHref = guideSlug ? `/g/${guideSlug}/medical-packages` : '/?page=medical';
  const backToHomeHref = guideSlug ? `/g/${guideSlug}` : '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-gray-600 mb-6">{t('subtitle')}</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2">📧 {t('emailSent')}</p>
          <p className="text-sm text-gray-700 mb-2">📞 {t('contactSoon')}</p>
          <p className="text-sm text-gray-700">🏥 {t('keepPhone')}</p>
        </div>

        {displayOrderId && (
          <div className="mb-6 text-sm text-gray-500">
            <p>{t('orderNumber')}: {displayOrderId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href={backToPackagesHref}
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {t('backToPackages')}
          </Link>
          <Link
            href={backToHomeHref}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {guideSlug ? t('backToGuide') : t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
