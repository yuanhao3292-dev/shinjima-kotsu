'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { isValidSlug } from '@/lib/whitelabel-config';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  // URL guide 仅用于无 session_id 时的重定向兜底，且必须通过格式校验
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
  // 初始化为 null，不信任 URL 参数
  // 只有 API 返回的订单数据才能设置此值（防篡改）
  const [guideSlug, setGuideSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      // 无 session_id 时，使用校验过的 URL 参数做兜底重定向
      router.push(guideSlugParam ? `/g/${guideSlugParam}` : '/?page=medical');
      return;
    }

    async function fetchOrderId() {
      try {
        const response = await fetch(`/api/order-lookup?session_id=${encodeURIComponent(sessionId)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.orderId) {
            setOrderId(data.orderId);
          }
          // 订单数据优先于 URL 参数（防篡改）
          // 同时校验 DB 返回值的格式
          const dbGuideSlug = typeof data.guideSlug === 'string' ? data.guideSlug : null;
          setGuideSlug(dbGuideSlug && isValidSlug(dbGuideSlug) ? dbGuideSlug : null);
        } else {
          // API 返回非 200：Fail-Safe，不回退到 URL 参数
          setGuideSlug(null);
        }
      } catch (error) {
        console.error('取得訂單資訊失敗:', error);
        // 网络错误/超时：Fail-Safe，不回退到 URL 参数
        setGuideSlug(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderId();
  }, [sessionId, router, guideSlugParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">驗證支付狀態...</div>
      </div>
    );
  }

  // 顯示訂單編號
  const displayOrderId = orderId
    ? `#${orderId.slice(-8).toUpperCase()}`
    : sessionId
      ? `#${sessionId.slice(-8).toUpperCase()}`
      : '';

  // 根据订单中的导游归属生成返回链接
  const backToPackagesHref = guideSlug
    ? `/g/${guideSlug}/medical-packages`
    : '/?page=medical';
  const backToHomeHref = guideSlug
    ? `/g/${guideSlug}`
    : '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* 成功圖示 */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 成功訊息 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          支付成功！
        </h1>

        <p className="text-gray-600 mb-6">
          感謝您的預約！我們已收到您的付款。
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2">
            📧 確認郵件已發送到您的信箱
          </p>
          <p className="text-sm text-gray-700 mb-2">
            📞 我們的客服團隊將在 1-2 個工作日內與您聯繫，確認體檢日期和詳細安排
          </p>
          <p className="text-sm text-gray-700">
            🏥 請保持電話暢通，注意查收郵件
          </p>
        </div>

        {/* 訂單號 */}
        {displayOrderId && (
          <div className="mb-6 text-sm text-gray-500">
            <p>訂單編號: {displayOrderId}</p>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="space-y-3">
          <Link
            href={backToPackagesHref}
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            返回套餐列表
          </Link>

          <Link
            href={backToHomeHref}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {guideSlug ? '返回導遊主頁' : '返回首頁'}
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
        <div className="text-xl">載入中...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
