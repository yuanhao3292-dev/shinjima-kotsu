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
  wechatTitle: { ja: 'カスタマーサポート', 'zh-TW': '聯繫客服', 'zh-CN': '联系客服', en: 'Contact Support' } as Record<Language, string>,
  wechatScan: { ja: 'QRコードをスキャンしてサポートを追加', 'zh-TW': '掃碼添加客服微信', 'zh-CN': '扫码添加客服微信', en: 'Scan to add support on WeChat' } as Record<Language, string>,
  wechatTip: { ja: '追加後にご注文番号をお伝えください', 'zh-TW': '添加後請告知訂單編號', 'zh-CN': '添加后请告知订单编号', en: 'Share your order number after adding' } as Record<Language, string>,
  downloadReceipt: { ja: '領収書をダウンロード', 'zh-TW': '下載收據', 'zh-CN': '下载收据', en: 'Download Receipt' } as Record<Language, string>,
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
  const [invoiceToken, setInvoiceToken] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('zh-TW');

  useEffect(() => {
    setLang(detectLanguage());
  }, []);

  useEffect(() => {
    if (!sessionId) {
      router.push(guideSlugParam ? `/g/${guideSlugParam}` : '/medical');
      return;
    }

    async function fetchOrderId() {
      try {
        const response = await fetch(`/api/order-lookup?session_id=${encodeURIComponent(sessionId)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.orderId) setOrderId(data.orderId);
          if (data.invoiceToken) setInvoiceToken(data.invoiceToken);
        }
      } catch (error) {
        console.error('Failed to fetch order info:', error);
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

  // 导航目标仅由 URL 中的 guide 参数决定（表示用户来自白标页面）
  const backToPackagesHref = guideSlugParam ? `/g/${guideSlugParam}/medical-packages` : '/medical';
  const backToHomeHref = guideSlugParam ? `/g/${guideSlugParam}` : '/';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-neutral-200 p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-brand-900 mb-2">{t('title')}</h1>
        <p className="text-neutral-600 mb-6">{t('subtitle')}</p>

        {/* 微信QR — 主CTA */}
        <div className="bg-[#07C160]/5 border border-[#07C160]/30 p-6 mb-6 text-center">
          <h2 className="font-bold text-brand-900 mb-1">{t('wechatTitle')}</h2>
          <p className="text-sm text-neutral-500 mb-4">{t('wechatScan')}</p>
          <img src="/wechat-qr.png" alt="WeChat QR" className="w-48 h-48 mx-auto object-contain mb-3" />
          <p className="text-xs text-neutral-400">{t('wechatTip')}</p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 p-4 mb-6 text-left">
          <p className="text-sm text-neutral-700 mb-2">📧 {t('emailSent')}</p>
          <p className="text-sm text-neutral-700 mb-2">📞 {t('contactSoon')}</p>
          <p className="text-sm text-neutral-700">🏥 {t('keepPhone')}</p>
        </div>

        {displayOrderId && (
          <div className="mb-4 text-sm text-neutral-500">
            <p>{t('orderNumber')}: {displayOrderId}</p>
          </div>
        )}

        {orderId && invoiceToken && (
          <div className="mb-6">
            <a
              href={`/api/invoices/${orderId}?token=${invoiceToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-700 hover:text-brand-900 transition-colors border border-neutral-200 rounded-lg px-4 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('downloadReceipt')}
            </a>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href={backToPackagesHref}
            className="block w-full bg-gold-400 hover:bg-gold-300 text-brand-900 font-bold py-3 px-6 tracking-wider transition-colors"
          >
            {t('backToPackages')}
          </Link>
          <Link
            href={backToHomeHref}
            className="block w-full bg-neutral-100 hover:bg-neutral-200 text-brand-900 font-semibold py-3 px-6 transition-colors"
          >
            {t('backToHome')}
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
