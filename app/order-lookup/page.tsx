'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/PublicLayout';
import { formatDateLong } from '@/lib/utils/format-date';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { useSiteImages } from '@/lib/hooks/useSiteImages';
import { ArrowLeft, Search, Package, Calendar, CreditCard, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const translations = {
  // Status labels
  statusPending: { ja: '確認待ち', 'zh-CN': '待确认', 'zh-TW': '待確認', en: 'Pending' },
  statusConfirmed: { ja: '確認済み', 'zh-CN': '已确认', 'zh-TW': '已確認', en: 'Confirmed' },
  statusCompleted: { ja: '完了', 'zh-CN': '已完成', 'zh-TW': '已完成', en: 'Completed' },
  statusCancelled: { ja: 'キャンセル', 'zh-CN': '已取消', 'zh-TW': '已取消', en: 'Cancelled' },

  // Errors
  fillFields: { ja: 'メールアドレスと注文番号を入力してください', 'zh-CN': '请填写电子邮箱和订单编号', 'zh-TW': '請填寫電子郵箱和訂單編號', en: 'Please fill in email and order number' },
  queryFailed: { ja: '検索に失敗しました。入力情報を確認してください', 'zh-CN': '查询失败，请检查输入信息', 'zh-TW': '查詢失敗，請檢查輸入信息', en: 'Query failed. Please check your input' },
  networkError: { ja: 'ネットワークエラー。後でもう一度お試しください', 'zh-CN': '网络错误，请稍后重试', 'zh-TW': '網絡錯誤，請稍後重試', en: 'Network error. Please try again later' },

  // Hero
  heroLabel: { ja: 'ORDER LOOKUP', 'zh-CN': 'ORDER LOOKUP', 'zh-TW': 'ORDER LOOKUP', en: 'ORDER LOOKUP' },
  orderLookupHero: { ja: '注文照会', 'zh-CN': '订单查询', 'zh-TW': '訂單查詢', en: 'Order Lookup' },
  noLoginRequired: { ja: 'ログイン不要', 'zh-CN': '无需登录', 'zh-TW': '無需登入', en: 'No Login Required' },
  heroDesc: { ja: 'メールアドレスと注文番号を入力すると、予約状況を確認できます。注文番号は確認メールに記載されています。', 'zh-CN': '输入您的电子邮箱和订单编号，即可查看预约状态。订单编号可在确认邮件中找到。', 'zh-TW': '輸入您的電子郵箱和訂單編號，即可查看預約狀態。訂單編號可在確認郵件中找到。', en: 'Enter your email and order number to check your appointment status. Order number can be found in the confirmation email.' },
  support24h: { ja: '24時間カスタマーサポート', 'zh-CN': '24小时客服支持', 'zh-TW': '24小時客服支援', en: '24/7 Support' },
  chineseService: { ja: '中国語サービス', 'zh-CN': '中文服务', 'zh-TW': '中文服務', en: 'Chinese Service' },

  // Form
  backToLogin: { ja: 'ログインに戻る', 'zh-CN': '返回登录', 'zh-TW': '返回登入', en: 'Back to Login' },
  orderLookupTitle: { ja: '注文照会', 'zh-CN': '订单查询', 'zh-TW': '訂單查詢', en: 'Order Lookup' },
  orderLookupSubtitle: { ja: 'メールアドレスと注文番号を入力して予約状況を確認', 'zh-CN': '输入邮箱和订单编号查看预约状态', 'zh-TW': '輸入郵箱和訂單編號查看預約狀態', en: 'Enter email and order number to check status' },
  emailLabel: { ja: 'メールアドレス', 'zh-CN': '电子邮箱', 'zh-TW': '電子郵箱', en: 'Email' },
  emailPlaceholder: { ja: '予約時に使用したメールアドレスを入力してください', 'zh-CN': '请输入预约时使用的邮箱', 'zh-TW': '請輸入預約時使用的郵箱', en: 'Enter the email used for booking' },
  orderIdLabel: { ja: '注文番号', 'zh-CN': '订单编号', 'zh-TW': '訂單編號', en: 'Order Number' },
  orderIdPlaceholder: { ja: '例：ABC12345', 'zh-CN': '例如：ABC12345', 'zh-TW': '例如：ABC12345', en: 'e.g., ABC12345' },
  orderIdHint: { ja: '注文番号は確認メールに記載されています（8桁の英数字）', 'zh-CN': '订单编号可在确认邮件中找到（8位字母数字）', 'zh-TW': '訂單編號可在確認郵件中找到（8位字母數字）', en: 'Order number can be found in confirmation email (8 alphanumeric characters)' },
  searching: { ja: '検索中...', 'zh-CN': '查询中...', 'zh-TW': '查詢中...', en: 'Searching...' },
  searchOrder: { ja: '注文を検索', 'zh-CN': '查询订单', 'zh-TW': '查詢訂單', en: 'Search Order' },
  haveAccount: { ja: 'アカウントをお持ちですか？', 'zh-CN': '已有账号？', 'zh-TW': '已有帳號？', en: 'Have an account?' },
  loginViewAll: { ja: 'ログインしてすべての注文を表示', 'zh-CN': '登录查看所有订单', 'zh-TW': '登入查看所有訂單', en: 'Login to view all orders' },

  // Order details
  orderStatus: { ja: '注文状況', 'zh-CN': '订单状态', 'zh-TW': '訂單狀態', en: 'Order Status' },
  orderNumber: { ja: '注文番号', 'zh-CN': '订单编号', 'zh-TW': '訂單編號', en: 'Order Number' },
  package: { ja: '健診パッケージ', 'zh-CN': '体检套餐', 'zh-TW': '體檢套餐', en: 'Checkup Package' },
  appointmentDate: { ja: '予約日', 'zh-CN': '预约日期', 'zh-TW': '預約日期', en: 'Appointment Date' },
  toBeConfirmed: { ja: '確認待ち', 'zh-CN': '待确认', 'zh-TW': '待確認', en: 'To be confirmed' },
  paymentStatus: { ja: '支払い状況', 'zh-CN': '付款状态', 'zh-TW': '付款狀態', en: 'Payment Status' },
  paid: { ja: '支払済み', 'zh-CN': '已付款', 'zh-TW': '已付款', en: 'Paid' },
  unpaid: { ja: '未払い', 'zh-CN': '待付款', 'zh-TW': '待付款', en: 'Unpaid' },
  orderCreated: { ja: '注文作成日時：', 'zh-CN': '订单建立时间：', 'zh-TW': '訂單建立時間：', en: 'Order created: ' },
  contactUs: { ja: 'ご不明な点がございましたら、お問い合わせください', 'zh-CN': '如有任何问题，请联系我们', 'zh-TW': '如有任何問題，請聯繫我們', en: 'If you have any questions, please contact us' },
  lineSupport: { ja: 'LINE カスタマーサポート', 'zh-CN': 'LINE 客服咨询', 'zh-TW': 'LINE 客服諮詢', en: 'LINE Support' },

  // No result
  orderNotFound: { ja: '注文が見つかりません', 'zh-CN': '未找到订单', 'zh-TW': '未找到訂單', en: 'Order Not Found' },
  checkInput: { ja: '入力したメールアドレスと注文番号が正しいかご確認ください', 'zh-CN': '请确认您输入的电子邮箱和订单编号是否正确', 'zh-TW': '請確認您輸入的電子郵箱和訂單編號是否正確', en: 'Please verify your email and order number are correct' },
  helpText: { ja: '注文番号が見つかりませんか？予約確認メールをご確認いただくか、カスタマーサポートにお問い合わせください。', 'zh-CN': '找不到订单编号？请查看您的预约确认邮件，或联系客服协助查询。', 'zh-TW': '找不到訂單編號？請查看您的預約確認郵件，或聯繫客服協助查詢。', en: 'Can\'t find order number? Check your confirmation email or contact support.' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

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

const getStatusConfig = (lang: Language) => ({
  pending: { label: t('statusPending', lang), color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200', icon: Clock },
  confirmed: { label: t('statusConfirmed', lang), color: 'text-brand-700', bgColor: 'bg-brand-50 border-brand-200', icon: CheckCircle },
  completed: { label: t('statusCompleted', lang), color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', icon: CheckCircle },
  cancelled: { label: t('statusCancelled', lang), color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', icon: AlertCircle },
});

export default function OrderLookupPage() {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [searched, setSearched] = useState(false);
  const lang = useLanguage();
  const { getImage } = useSiteImages();
  const STATUS_MAP = getStatusConfig(lang);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setSearched(true);

    if (!email || !orderId) {
      setError(t('fillFields', lang));
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
        setError(data.error || t('queryFailed', lang));
        return;
      }

      setOrder(data.order);
    } catch {
      setError(t('networkError', lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout showFooter={false} transparentNav={false}>
      <div className="min-h-screen flex">
        {/* Left Side — Brand Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 overflow-hidden">
          <Image
            src={getImage('medical_hero', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000')}
            alt="Order Lookup"
            fill
            className="object-cover"
            quality={75}
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/85 to-brand-900/70" />

          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20" />
            <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10" />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-16">
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-gold-400" />
                <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">
                  {t('heroLabel', lang)}
                </span>
              </div>

              <h1 className="font-serif text-4xl xl:text-5xl text-white mb-4 leading-tight">
                {t('orderLookupHero', lang)}
                <br />
                <span className="text-gold-400">{t('noLoginRequired', lang)}</span>
              </h1>

              <p className="text-lg text-neutral-300 leading-relaxed font-light mb-10 max-w-md">
                {t('heroDesc', lang)}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-neutral-300">{t('support24h', lang)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold-400 rounded-full" />
                  <span className="text-neutral-300">{t('chineseService', lang)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Form & Results */}
        <div className="w-full lg:w-1/2 flex items-start justify-center p-8 pt-24 bg-white overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Mobile hero label */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-gold-400" />
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">ORDER LOOKUP</span>
            </div>

            {/* Back Link */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 mb-6 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              {t('backToLogin', lang)}
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-serif text-brand-900 mb-2">{t('orderLookupTitle', lang)}</h1>
              <p className="text-neutral-500 text-sm">{t('orderLookupSubtitle', lang)}</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t('emailLabel', lang)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white text-sm"
                  placeholder={t('emailPlaceholder', lang)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t('orderIdLabel', lang)}
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono transition bg-white text-sm"
                  placeholder={t('orderIdPlaceholder', lang)}
                />
                <p className="mt-2 text-xs text-neutral-400">
                  {t('orderIdHint', lang)}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-2 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-400 hover:bg-gold-300 disabled:bg-neutral-300 text-brand-900 font-medium py-3 px-6 text-sm tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {t('searching', lang)}
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    {t('searchOrder', lang)}
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-neutral-600 text-sm">
                {t('haveAccount', lang)}
                <Link href="/login" className="text-brand-700 hover:text-brand-900 font-medium ml-1">
                  {t('loginViewAll', lang)}
                </Link>
              </p>
            </div>

            {/* Order Result */}
            {order && (
              <div className="mt-8 border border-neutral-200 overflow-hidden animate-fade-in">
                {/* Status Header */}
                <div className={`px-6 py-5 ${STATUS_MAP[order.status].bgColor.split(' ')[0]}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-75 mb-1">{t('orderStatus', lang)}</p>
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
                      <p className="text-xs opacity-75 mb-1">{t('orderNumber', lang)}</p>
                      <p className="text-lg font-mono font-bold text-brand-900">
                        #{order.orderId.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6 space-y-5">
                  {/* Package Info */}
                  <div className="flex items-start gap-4 pb-5 border-b border-neutral-200">
                    <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-brand-700" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs text-neutral-400 mb-1">{t('package', lang)}</p>
                      <p className="font-semibold text-brand-900">{order.packageName}</p>
                      <p className="text-xl font-bold text-brand-700 mt-1">
                        ¥{order.packagePrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Date & Payment */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 mb-1">{t('appointmentDate', lang)}</p>
                        <p className="font-semibold text-brand-900 text-sm">
                          {order.preferredDate ? formatDateLong(order.preferredDate) : t('toBeConfirmed', lang)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 mb-1">{t('paymentStatus', lang)}</p>
                        <p className="font-semibold text-brand-900 text-sm">
                          {order.paymentStatus === 'paid' ? t('paid', lang) : t('unpaid', lang)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div className="pt-4 border-t border-neutral-200 text-sm text-neutral-400">
                    {t('orderCreated', lang)}{formatDateLong(order.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6">
                  <div className="bg-neutral-50 border border-neutral-200 p-4 text-center">
                    <p className="text-sm text-neutral-600 mb-2">{t('contactUs', lang)}</p>
                    <a
                      href="https://line.me/ti/p/j3XxBP50j9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#06C755] hover:underline font-bold"
                    >
                      {t('lineSupport', lang)}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* No Result */}
            {searched && !order && !loading && !error && (
              <div className="mt-8 border border-neutral-200 p-8 text-center">
                <div className="w-16 h-16 bg-neutral-50 border border-neutral-200 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="text-lg font-serif text-brand-900 mb-2">{t('orderNotFound', lang)}</h3>
                <p className="text-neutral-500 text-sm">
                  {t('checkInput', lang)}
                </p>
              </div>
            )}

            {/* Help Text */}
            <p className="mt-6 text-center text-xs text-neutral-400">
              {t('helpText', lang)}
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
