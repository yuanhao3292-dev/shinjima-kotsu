'use client';

import { useState } from 'react';
import Link from 'next/link';
import MemberLayout from '@/components/MemberLayout';
import Logo from '@/components/Logo';
import { ArrowLeft, Search, Package, Calendar, CreditCard, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface OrderInfo {
  orderId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  packageName: string;
  packagePrice: number;
  customerName: string;
  customerEmail: string;
  preferredDate: string | null;
  createdAt: string;
  paymentStatus: string;
}

const STATUS_MAP = {
  pending: { label: '待確認', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200', icon: Clock },
  confirmed: { label: '已確認', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: CheckCircle },
  completed: { label: '已完成', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', icon: AlertCircle },
};

export default function OrderLookupPage() {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setSearched(true);

    if (!email || !orderId) {
      setError('請填寫電子郵箱和訂單編號');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/order-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '查詢失敗，請檢查輸入信息');
        return;
      }

      setOrder(data.order);
    } catch {
      setError('網絡錯誤，請稍後重試');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <MemberLayout showFooter={false}>
      <div className="min-h-[calc(100vh-80px)] flex">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50"></div>
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <div className="flex items-center gap-3 mb-8">
              <Logo className="w-12 h-12 text-white" />
              <div>
                <span className="font-serif font-bold text-2xl tracking-wide">NIIJIMA</span>
                <p className="text-xs text-blue-200 uppercase tracking-widest">Medical Tourism</p>
              </div>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-6 leading-tight">
              訂單查詢<br />
              <span className="text-blue-400">無需登入</span>
            </h1>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-md">
              輸入您的電子郵箱和訂單編號，即可查看預約狀態。訂單編號可在確認郵件中找到。
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">24小時客服支援</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">中文服務</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Search Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <Logo className="w-10 h-10 text-blue-600" />
              <span className="font-serif font-bold text-xl">NIIJIMA</span>
            </div>

            {/* Back Link */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 text-sm font-medium transition"
            >
              <ArrowLeft size={16} />
              返回登入
            </Link>

            {/* Search Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">訂單查詢</h1>
                <p className="text-gray-500 mt-2 text-sm">輸入郵箱和訂單編號查看預約狀態</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電子郵箱
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="請輸入預約時使用的郵箱"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    訂單編號
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono transition"
                    placeholder="例如：ABC12345"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    訂單編號可在確認郵件中找到（8位字母數字）
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      查詢中...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      查詢訂單
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  已有帳號？
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1">
                    登入查看所有訂單
                  </Link>
                </p>
              </div>
            </div>

            {/* Order Result */}
            {order && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in">
                {/* Status Header */}
                <div className={`px-6 py-5 ${STATUS_MAP[order.status].bgColor.split(' ')[0]}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-75 mb-1">訂單狀態</p>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const StatusIcon = STATUS_MAP[order.status].icon;
                          return <StatusIcon size={22} className={STATUS_MAP[order.status].color} />;
                        })()}
                        <span className={`text-xl font-bold ${STATUS_MAP[order.status].color}`}>
                          {STATUS_MAP[order.status].label}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-75 mb-1">訂單編號</p>
                      <p className="text-lg font-mono font-bold text-gray-900">
                        #{order.orderId.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6 space-y-5">
                  {/* Package Info */}
                  <div className="flex items-start gap-4 pb-5 border-b border-gray-100">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs text-gray-400 mb-1">體檢套餐</p>
                      <p className="font-semibold text-gray-900">{order.packageName}</p>
                      <p className="text-xl font-bold text-blue-600 mt-1">
                        ¥{order.packagePrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Date & Payment */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">預約日期</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {order.preferredDate ? formatDate(order.preferredDate) : '待確認'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">付款狀態</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {order.paymentStatus === 'paid' ? '已付款' : '待付款'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div className="pt-4 border-t border-gray-100 text-sm text-gray-400">
                    訂單建立時間：{formatDate(order.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">如有任何問題，請聯繫我們</p>
                    <a
                      href="https://line.me/ti/p/j3XxBP50j9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#06C755] hover:underline font-bold"
                    >
                      LINE 客服諮詢
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* No Result */}
            {searched && !order && !loading && !error && (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">未找到訂單</h3>
                <p className="text-gray-500 text-sm">
                  請確認您輸入的電子郵箱和訂單編號是否正確
                </p>
              </div>
            )}

            {/* Help Text */}
            <p className="mt-6 text-center text-xs text-gray-400">
              找不到訂單編號？請查看您的預約確認郵件，或聯繫客服協助查詢。
            </p>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
