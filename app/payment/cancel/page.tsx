'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { isValidSlug } from '@/lib/whitelabel-config';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');
  // URL guide 仅作为兜底（DB 查询失败时），且必须通过格式校验
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

  useEffect(() => {
    // 如果有 order_id，从 DB 查询真实的导游归属（防篡改）
    if (!orderId) {
      // 无 order_id：降级使用校验过的 URL 参数
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
          // API 失败：Fail-Safe，降级使用校验过的 URL 参数
          setGuideSlug(guideSlugParam);
        }
      } catch {
        // 网络错误：降级使用校验过的 URL 参数
        setGuideSlug(guideSlugParam);
      } finally {
        setLoaded(true);
      }
    }

    fetchGuideSlug();
  }, [orderId, guideSlugParam]);

  // 根据导游归属生成返回链接
  const backToPackagesHref = guideSlug
    ? `/g/${guideSlug}/medical-packages`
    : '/?page=medical';
  const backToHomeHref = guideSlug
    ? `/g/${guideSlug}`
    : '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* 取消图标 */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* 取消消息 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          支付已取消
        </h1>

        <p className="text-gray-600 mb-6">
          您的支付流程已取消，未产生任何费用。
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2">
            如果您在支付过程中遇到问题，请联系我们的客服团队。
          </p>
          <p className="text-sm text-gray-700">
            我们随时为您提供帮助！
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            重新尝试支付
          </button>

          <Link
            href={backToPackagesHref}
            className={`block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 ${!loaded ? 'opacity-50 pointer-events-none' : ''}`}
          >
            返回精密體檢
          </Link>

          <Link
            href={backToHomeHref}
            className={`block w-full text-gray-600 hover:text-gray-800 font-semibold py-3 px-6 transition-colors duration-200 ${!loaded ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {guideSlug ? '返回導遊主頁' : '返回首页'}
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
        <div className="text-xl">載入中...</div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
