'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.push('/medical-packages');
      return;
    }

    // 获取订单 ID
    async function fetchOrderId() {
      try {
        const response = await fetch(`/api/order-lookup?session_id=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.orderId) {
            setOrderId(data.orderId);
          }
        }
      } catch (error) {
        console.error('获取订单信息失败:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderId();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">验证支付状态...</div>
      </div>
    );
  }

  // 显示订单编号：优先使用数据库订单ID，否则使用session ID
  const displayOrderId = orderId
    ? `#${orderId.slice(-8).toUpperCase()}`
    : sessionId
      ? `#${sessionId.slice(-8).toUpperCase()}`
      : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* 成功图标 */}
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

        {/* 成功消息 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          支付成功！
        </h1>

        <p className="text-gray-600 mb-6">
          感谢您的预约！我们已收到您的付款。
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2">
            📧 确认邮件已发送到您的邮箱
          </p>
          <p className="text-sm text-gray-700 mb-2">
            📞 我们的客服团队将在 1-2 个工作日内与您联系，确认体检日期和详细安排
          </p>
          <p className="text-sm text-gray-700">
            🏥 请保持电话畅通，注意查收邮件
          </p>
        </div>

        {/* 订单号 */}
        {displayOrderId && (
          <div className="mb-6 text-sm text-gray-500">
            <p>订单编号: {displayOrderId}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="space-y-3">
          <Link
            href="/medical-packages"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            返回套餐列表
          </Link>

          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            返回首页
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
        <div className="text-xl">加载中...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
