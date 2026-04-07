'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, ShoppingCart, X, Loader2 } from 'lucide-react';
import OrderConfirmationModal from '@/components/OrderConfirmationModal';
import { createClient } from '@/lib/supabase/client';
import type { AnalysisResult } from '@/services/aemc/types';
import type { Language } from '@/hooks/useLanguage';
import {
  matchPackages,
  getPackageName,
  getPackagePrice,
  formatPriceJPY,
  PACKAGE_HIGHLIGHTS,
  PACKAGE_URLS,
} from '@/lib/screening-package-matcher';

// ============================================================
// i18n
// ============================================================

const t = (key: string, lang: Language): string => T[key]?.[lang] ?? key;

const T: Record<string, Record<Language, string>> = {
  title: {
    'zh-CN': '可供参考的健检套餐',
    'zh-TW': '可供參考的健檢套餐',
    ja: 'ご参考いただける健診コース',
    en: 'Available Health Screening Packages',
    ko: '참고 가능한 건강검진 패키지',
  },
  desc: {
    'zh-CN': '如果您有兴趣进一步了解自身健康状况，以下日本精密健检方案可供参考',
    'zh-TW': '如果您有興趣進一步了解自身健康狀況，以下日本精密健檢方案可供參考',
    ja: 'ご自身の健康状態についてさらに詳しく知りたい方は、以下の精密健診プランをご参考ください',
    en: 'If you are interested in learning more about your health, the following precision health screening packages are available for your consideration',
    ko: '본인의 건강 상태에 대해 더 자세히 알고 싶으시다면, 아래의 정밀 건강검진 플랜을 참고해 주십시오',
  },
  viewDetails: {
    'zh-CN': '查看详情',
    'zh-TW': '查看詳情',
    ja: '詳細を見る',
    en: 'View Details',
    ko: '상세 보기',
  },
  bookNow: {
    'zh-CN': '立即预约',
    'zh-TW': '立即預約',
    ja: '今すぐ予約',
    en: 'Book Now',
    ko: '예약하기',
  },
  quickBook: {
    'zh-CN': '快速预约',
    'zh-TW': '快速預約',
    ja: 'クイック予約',
    en: 'Quick Booking',
    ko: '빠른 예약',
  },
  name: {
    'zh-CN': '姓名',
    'zh-TW': '姓名',
    ja: 'お名前',
    en: 'Full Name',
    ko: '성명',
  },
  email: {
    'zh-CN': '邮箱',
    'zh-TW': '電子郵件',
    ja: 'メールアドレス',
    en: 'Email',
    ko: '이메일',
  },
  phone: {
    'zh-CN': '电话',
    'zh-TW': '電話',
    ja: '電話番号',
    en: 'Phone',
    ko: '전화번호',
  },
  processing: {
    'zh-CN': '正在跳转至支付...',
    'zh-TW': '正在跳轉至付款...',
    ja: 'お支払いページへ移動中...',
    en: 'Redirecting to payment...',
    ko: '결제 페이지로 이동 중...',
  },
  checkoutError: {
    'zh-CN': '创建订单失败，请稍后再试',
    'zh-TW': '建立訂單失敗，請稍後再試',
    ja: '注文の作成に失敗しました。後でもう一度お試しください',
    en: 'Failed to create order. Please try again.',
    ko: '주문 생성에 실패했습니다. 잠시 후 다시 시도해 주십시오.',
  },
  contactRequired: {
    'zh-CN': '请填写姓名和至少一种联系方式',
    'zh-TW': '請填寫姓名和至少一種聯繫方式',
    ja: 'お名前と連絡先を1つ以上ご入力ください',
    en: 'Please enter your name and at least one contact method',
    ko: '성명과 연락처를 하나 이상 입력해 주십시오',
  },
  cancerFlag: {
    'zh-CN': '癌症风险评估',
    'zh-TW': '癌症風險評估',
    ja: 'がんリスク評価',
    en: 'Cancer Risk Assessment',
    ko: '암 위험도 평가',
  },
  cancerScreening: {
    'zh-CN': '无创癌症筛查',
    'zh-TW': '無創癌症篩查',
    ja: '非侵襲がん検診',
    en: 'Non-Invasive Cancer Screening',
    ko: '비침습 암 검진',
  },
  deptCardiology: {
    'zh-CN': '心脏专项评估',
    'zh-TW': '心臟專項評估',
    ja: '心臓専門評価',
    en: 'Cardiac Assessment',
    ko: '심장 전문 평가',
  },
  deptGastro: {
    'zh-CN': '消化道专项检查',
    'zh-TW': '消化道專項檢查',
    ja: '消化管専門検査',
    en: 'GI Tract Screening',
    ko: '소화기관 전문 검사',
  },
  highRisk: {
    'zh-CN': '综合精密健检',
    'zh-TW': '綜合精密健檢',
    ja: '総合精密健診',
    en: 'Comprehensive Screening',
    ko: '종합 정밀 건강검진',
  },
  generalCheckup: {
    'zh-CN': '定期健康检查',
    'zh-TW': '定期健康檢查',
    ja: '定期健康診断',
    en: 'Regular Health Checkup',
    ko: '정기 건강검진',
  },
  preventive: {
    'zh-CN': '预防性健康筛查',
    'zh-TW': '預防性健康篩查',
    ja: '予防的ヘルスチェック',
    en: 'Preventive Screening',
    ko: '예방 건강 검진',
  },
};

const LOCALE_MAP: Record<Language, 'ja' | 'zh-CN' | 'zh-TW' | 'en'> = {
  ja: 'ja',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  en: 'en',
  ko: 'en',
};

// ============================================================
// Quick Checkout Modal
// ============================================================

function QuickCheckoutModal({
  slug,
  lang,
  onClose,
}: {
  slug: string;
  lang: Language;
  onClose: () => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Pre-fill from auth user
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        const meta = user.user_metadata;
        if (meta?.full_name) setName(meta.full_name);
        else if (meta?.name) setName(meta.name);
        if (meta?.phone) setPhone(meta.phone);
      }
    })();
  }, [supabase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate: name required + at least one contact
    if (!name.trim() || (!email.trim() && !phone.trim())) {
      setError(t('contactRequired', lang));
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug: slug,
          customerInfo: {
            name: name.trim(),
            email: email.trim() || undefined,
            phone: phone.trim() || undefined,
          },
          locale: LOCALE_MAP[lang],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('checkoutError', lang));
      }

      const { checkoutUrl } = await res.json();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err: any) {
      setError(err.message || t('checkoutError', lang));
      setSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const packageName = getPackageName(slug, lang);
  const price = getPackagePrice(slug);

  return (
    <>
    <OrderConfirmationModal
      isOpen={showConfirmation}
      onConfirm={handleConfirmedSubmit}
      onCancel={() => setShowConfirmation(false)}
      packageName={packageName}
      price={price}
      customerName={name}
      lang={lang}
      isProcessing={submitting}
    />
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">{t('quickBook', lang)}</h3>
            <p className="text-emerald-100 text-sm">{packageName}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {price > 0 && (
            <div className="text-center pb-2">
              <span className="text-3xl font-bold text-emerald-600">
                {formatPriceJPY(price)}
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('name', lang)} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email', lang)}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('phone', lang)}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl disabled:opacity-60 transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('processing', lang)}
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {t('bookNow', lang)}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

// ============================================================
// Main Component
// ============================================================

interface Props {
  result: AnalysisResult;
  lang: Language;
}

export default function RecommendedPackages({ result, lang }: Props) {
  const recommendations = matchPackages(result);
  const [checkoutSlug, setCheckoutSlug] = useState<string | null>(null);

  if (recommendations.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-neutral-900 tracking-wide">
            {t('title', lang)}
          </h3>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-[52px]">{t('desc', lang)}</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => {
            const name = getPackageName(rec.slug, lang);
            const price = getPackagePrice(rec.slug);
            const highlights = PACKAGE_HIGHLIGHTS[rec.slug]?.[lang] ?? [];
            const url = PACKAGE_URLS[rec.slug] ?? '#';

            return (
              <div
                key={rec.slug}
                className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col"
              >
                {/* Match reason badge */}
                <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full mb-3 self-start">
                  {t(rec.matchReasonKey, lang)}
                </span>

                {/* Name + price */}
                <h4 className="font-bold text-gray-900 mb-1 leading-snug">{name}</h4>
                {price > 0 && (
                  <p className="text-emerald-600 font-semibold text-lg mb-3">
                    {formatPriceJPY(price)}
                  </p>
                )}

                {/* Highlights */}
                {highlights.length > 0 && (
                  <ul className="space-y-1.5 mb-4 flex-1">
                    {highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTAs */}
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setCheckoutSlug(rec.slug)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {t('bookNow', lang)}
                  </button>
                  <Link
                    href={url}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                  >
                    {t('viewDetails', lang)}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Checkout Modal */}
      {checkoutSlug && (
        <QuickCheckoutModal
          slug={checkoutSlug}
          lang={lang}
          onClose={() => setCheckoutSlug(null)}
        />
      )}
    </>
  );
}
