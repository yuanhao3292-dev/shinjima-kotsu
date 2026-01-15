'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const router = useRouter();

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
            href="/medical-packages"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            返回套餐列表
          </Link>

          <Link
            href="/"
            className="block w-full text-gray-600 hover:text-gray-800 font-semibold py-3 px-6 transition-colors duration-200"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
