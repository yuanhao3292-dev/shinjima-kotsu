'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  Calendar,
  X,
  ArrowLeft,
  MapPin,
  Clock,
  Users2,
  Phone,
  MessageSquare,
  Loader2,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

const translations = {
  pageTitle: {
    ja: '予約詳細',
    'zh-CN': '预约详情',
    'zh-TW': '預約詳情',
    en: 'Booking Details',
  },
  pageTitleSidebar: {
    ja: '予約詳細',
    'zh-CN': '预约详情',
    'zh-TW': '預約詳情',
    en: 'Booking Details',
  },
  backToList: {
    ja: '予約一覧に戻る',
    'zh-CN': '返回预约列表',
    'zh-TW': '返回預約列表',
    en: 'Back to Bookings',
  },
  bookingNotExistOrNoAccess: {
    ja: '予約が存在しないか、アクセス権がありません',
    'zh-CN': '预约不存在或无权访问',
    'zh-TW': '預約不存在或無權訪問',
    en: 'Booking does not exist or access denied',
  },
  loadFailed: {
    ja: '読み込みに失敗しました',
    'zh-CN': '加载失败',
    'zh-TW': '載入失敗',
    en: 'Failed to load',
  },
  pleaseLogin: {
    ja: '再ログインしてください',
    'zh-CN': '请重新登录',
    'zh-TW': '請重新登入',
    en: 'Please log in again',
  },
  cannotCreatePayment: {
    ja: '支払いページを作成できません',
    'zh-CN': '无法创建支付页面',
    'zh-TW': '無法創建支付頁面',
    en: 'Unable to create payment page',
  },
  paymentFailed: {
    ja: '支払いリクエストに失敗しました。後ほどお試しください。',
    'zh-CN': '支付请求失败，请稍后重试',
    'zh-TW': '支付請求失敗，請稍後重試',
    en: 'Payment request failed. Please try again later.',
  },
  sameDayCancelConfirm: {
    ja: '当日キャンセルの場合、デポジットは返金されません。キャンセルしますか？',
    'zh-CN': '当天取消定金将不予退还，确定要取消吗？',
    'zh-TW': '當天取消定金將不予退還，確定要取消嗎？',
    en: 'Same-day cancellation will forfeit the deposit. Are you sure you want to cancel?',
  },
  cancelFailed: {
    ja: 'キャンセルに失敗しました',
    'zh-CN': '取消失败',
    'zh-TW': '取消失敗',
    en: 'Cancellation failed',
  },
  statusPending: {
    ja: '確認待ち',
    'zh-CN': '待确认',
    'zh-TW': '待確認',
    en: 'Pending',
  },
  statusConfirmed: {
    ja: '確認済み',
    'zh-CN': '已确认',
    'zh-TW': '已確認',
    en: 'Confirmed',
  },
  statusCompleted: {
    ja: '完了',
    'zh-CN': '已完成',
    'zh-TW': '已完成',
    en: 'Completed',
  },
  statusCancelled: {
    ja: 'キャンセル',
    'zh-CN': '已取消',
    'zh-TW': '已取消',
    en: 'Cancelled',
  },
  statusNoShow: {
    ja: '未来店',
    'zh-CN': '未到店',
    'zh-TW': '未到店',
    en: 'No Show',
  },
  depositStatusPending: {
    ja: '未払い',
    'zh-CN': '待支付',
    'zh-TW': '待支付',
    en: 'Unpaid',
  },
  depositStatusPaid: {
    ja: '支払い済み',
    'zh-CN': '已支付',
    'zh-TW': '已支付',
    en: 'Paid',
  },
  depositStatusRefunded: {
    ja: '返金済み',
    'zh-CN': '已退款',
    'zh-TW': '已退款',
    en: 'Refunded',
  },
  depositStatusForfeited: {
    ja: '没収済み',
    'zh-CN': '已没收',
    'zh-TW': '已沒收',
    en: 'Forfeited',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  bookingStatus: {
    ja: '予約ステータス',
    'zh-CN': '预约状态',
    'zh-TW': '預約狀態',
    en: 'Booking Status',
  },
  deposit: {
    ja: 'デポジット:',
    'zh-CN': '定金:',
    'zh-TW': '定金:',
    en: 'Deposit:',
  },
  processing: {
    ja: '処理中...',
    'zh-CN': '处理中...',
    'zh-TW': '處理中...',
    en: 'Processing...',
  },
  payDeposit: {
    ja: 'デポジットを支払う',
    'zh-CN': '支付定金',
    'zh-TW': '支付定金',
    en: 'Pay Deposit',
  },
  customerInfo: {
    ja: 'お客様情報',
    'zh-CN': '客户信息',
    'zh-TW': '客戶資訊',
    en: 'Customer Info',
  },
  personCount: {
    ja: '名',
    'zh-CN': '人',
    'zh-TW': '人',
    en: 'guests',
  },
  venueInfo: {
    ja: '店舗情報',
    'zh-CN': '店铺信息',
    'zh-TW': '店舖資訊',
    en: 'Venue Info',
  },
  bookingInfo: {
    ja: '予約情報',
    'zh-CN': '预约信息',
    'zh-TW': '預約資訊',
    en: 'Booking Info',
  },
  commissionInfo: {
    ja: '報酬情報',
    'zh-CN': '报酬信息',
    'zh-TW': '報酬資訊',
    en: 'Commission Info',
  },
  actualSpend: {
    ja: '実際の消費額',
    'zh-CN': '实际消费',
    'zh-TW': '實際消費',
    en: 'Actual Spend',
  },
  preTaxAmount: {
    ja: '税抜金額',
    'zh-CN': '税前金额',
    'zh-TW': '稅前金額',
    en: 'Pre-tax Amount',
  },
  commissionRate: {
    ja: '報酬 (10%)',
    'zh-CN': '报酬 (10%)',
    'zh-TW': '報酬 (10%)',
    en: 'Commission (10%)',
  },
  actions: {
    ja: '操作',
    'zh-CN': '操作',
    'zh-TW': '操作',
    en: 'Actions',
  },
  cancelBooking: {
    ja: '予約をキャンセル',
    'zh-CN': '取消预约',
    'zh-TW': '取消預約',
    en: 'Cancel Booking',
  },
  adminHandleNote: {
    ja: '予約の確認・完了等の操作は管理者が行います',
    'zh-CN': '预约确认、完成等操作由管理员处理',
    'zh-TW': '預約確認、完成等操作由管理員處理',
    en: 'Booking confirmation and completion are handled by the administrator',
  },
  createdAt: {
    ja: '作成日',
    'zh-CN': '创建于',
    'zh-TW': '創建於',
    en: 'Created on',
  },
  completedAt: {
    ja: '完了日',
    'zh-CN': '完成于',
    'zh-TW': '完成於',
    en: 'Completed on',
  },
  bookingNotExist: {
    ja: '予約が存在しません',
    'zh-CN': '预约不存在',
    'zh-TW': '預約不存在',
    en: 'Booking does not exist',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};
const dateLocaleMap: Record<Language, string> = { ja: 'ja-JP', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en-US' };

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  party_size: number;
  booking_date: string;
  booking_time: string | null;
  special_requests: string | null;
  status: string;
  deposit_status: string;
  deposit_amount: number;
  actual_spend: number | null;
  spend_before_tax: number | null;
  commission_amount: number | null;
  commission_status: string;
  created_at: string;
  completed_at: string | null;
  venue: {
    id: string;
    name: string;
    name_ja: string | null;
    city: string;
    area: string | null;
    category: string;
  } | null;
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [payingDeposit, setPayingDeposit] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const lang = useLanguage();

  useEffect(() => {
    loadBookingDetail();
  }, [id]);

  const loadBookingDetail = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: guide } = await supabase
        .from('guides')
        .select('id, status')
        .eq('auth_user_id', user.id)
        .single();

      if (!guide || guide.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(id, name, name_ja, city, area, category)
        `)
        .eq('id', id)
        .eq('guide_id', guide.id)
        .single();

      if (bookingError || !bookingData) {
        setError(t('bookingNotExistOrNoAccess', lang));
        return;
      }

      // Transform venue from array to object
      const transformedBooking = {
        ...bookingData,
        venue: Array.isArray(bookingData.venue) ? bookingData.venue[0] : bookingData.venue
      } as Booking;

      setBooking(transformedBooking);
    } catch (err) {
      console.error('Error:', err);
      setError(t('loadFailed', lang));
    } finally {
      setLoading(false);
    }
  };

  const handlePayDeposit = async () => {
    if (!booking) return;
    setPayingDeposit(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError(t('pleaseLogin', lang));
        setPayingDeposit(false);
        return;
      }

      const res = await fetch('/api/booking/deposit-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('cannotCreatePayment', lang));
        setPayingDeposit(false);
        return;
      }

      // 跳轉到 Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(t('paymentFailed', lang));
      setPayingDeposit(false);
    }
  };

  const cancelBooking = async () => {
    if (!booking) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const isSameDay = booking.booking_date === todayStr;
    const depositStatus = isSameDay ? 'forfeited' : 'refunded';

    if (isSameDay) {
      if (!confirm(t('sameDayCancelConfirm', lang))) {
        return;
      }
    }

    setUpdating(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          deposit_status: depositStatus
        })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      await loadBookingDetail();
    } catch (err) {
      setError(t('cancelFailed', lang));
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-neutral-100 text-neutral-700',
      no_show: 'bg-red-100 text-red-700',
    };
    const labelKeys: Record<string, keyof typeof translations> = {
      pending: 'statusPending',
      confirmed: 'statusConfirmed',
      completed: 'statusCompleted',
      cancelled: 'statusCancelled',
      no_show: 'statusNoShow',
    };
    return (
      <span className={`px-3 py-1 text-sm font-medium ${styles[status] || styles.pending}`}>
        {labelKeys[status] ? t(labelKeys[status], lang) : status}
      </span>
    );
  };

  const getDepositBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      paid: 'bg-green-50 text-green-600 border-green-200',
      refunded: 'bg-neutral-50 text-neutral-600 border-neutral-200',
      forfeited: 'bg-red-50 text-red-600 border-red-200',
    };
    const labelKeys: Record<string, keyof typeof translations> = {
      pending: 'depositStatusPending',
      paid: 'depositStatusPaid',
      refunded: 'depositStatusRefunded',
      forfeited: 'depositStatusForfeited',
    };
    return (
      <span className={`px-3 py-1 text-sm border ${styles[status] || styles.pending}`}>
        {labelKeys[status] ? t(labelKeys[status], lang) : status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">{t('loading', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <GuideSidebar pageTitle={t('pageTitleSidebar', lang)} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/guide-partner/bookings"
              className="inline-flex items-center gap-1 text-neutral-500 hover:text-brand-900 text-sm mb-4"
            >
              <ArrowLeft size={16} />
              {t('backToList', lang)}
            </Link>
            <h1 className="text-2xl font-bold font-serif text-brand-900">{t('pageTitle', lang)}</h1>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {booking ? (
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold font-serif text-brand-900">{t('bookingStatus', lang)}</h2>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-neutral-500">{t('deposit', lang)}</span>
                  {getDepositBadge(booking.deposit_status)}
                  <span className="text-neutral-400">¥{booking.deposit_amount}</span>
                </div>

                {/* Pay Deposit Button */}
                {booking.status === 'pending' && booking.deposit_status === 'pending' && (
                  <button
                    onClick={handlePayDeposit}
                    disabled={payingDeposit}
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-bold py-3 transition"
                  >
                    {payingDeposit ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        {t('processing', lang)}
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        {t('payDeposit', lang)} ¥{booking.deposit_amount}
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Customer Info */}
              <div className="bg-white border p-6">
                <h2 className="font-bold font-serif text-brand-900 mb-4">{t('customerInfo', lang)}</h2>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Users2 className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="font-medium text-brand-900">{booking.customer_name}</p>
                      <p className="text-sm text-neutral-500">{booking.party_size} {t('personCount', lang)}</p>
                    </div>
                  </div>
                  {booking.customer_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-neutral-400" />
                      <span className="text-neutral-600">{booking.customer_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Venue Info */}
              <div className="bg-white border p-6">
                <h2 className="font-bold font-serif text-brand-900 mb-4">{t('venueInfo', lang)}</h2>
                <div className="space-y-3">
                  <p className="font-medium text-brand-900">{booking.venue?.name}</p>
                  {booking.venue?.name_ja && (
                    <p className="text-sm text-neutral-500">{booking.venue.name_ja}</p>
                  )}
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin size={16} />
                    <span>{booking.venue?.city} · {booking.venue?.area}</span>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-white border p-6">
                <h2 className="font-bold font-serif text-brand-900 mb-4">{t('bookingInfo', lang)}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-600">{booking.booking_date}</span>
                  </div>
                  {booking.booking_time && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-neutral-400" />
                      <span className="text-neutral-600">{booking.booking_time}</span>
                    </div>
                  )}
                  {booking.special_requests && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <p className="text-neutral-600">{booking.special_requests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Commission Info */}
              {(booking.actual_spend || booking.status === 'completed') && (
                <div className="bg-green-50 border border-green-200 p-6">
                  <h2 className="font-bold font-serif text-green-800 mb-4">{t('commissionInfo', lang)}</h2>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">{t('actualSpend', lang)}</span>
                      <span className="font-bold text-green-800">¥{booking.actual_spend?.toLocaleString(dateLocaleMap[lang])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">{t('preTaxAmount', lang)}</span>
                      <span className="text-green-800">¥{booking.spend_before_tax?.toLocaleString(dateLocaleMap[lang])}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-green-200">
                      <span className="text-green-700 font-medium">{t('commissionRate', lang)}</span>
                      <span className="font-bold text-green-800 text-lg">¥{booking.commission_amount?.toLocaleString(dateLocaleMap[lang])}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <div className="bg-white border p-6">
                  <h2 className="font-bold font-serif text-brand-900 mb-4">{t('actions', lang)}</h2>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={cancelBooking}
                      disabled={updating}
                      className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 disabled:bg-neutral-50 text-neutral-700 font-medium px-4 py-2 transition"
                    >
                      {updating ? <Loader2 className="animate-spin" size={18} /> : <X size={18} />}
                      {t('cancelBooking', lang)}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400 mt-3">
                    {t('adminHandleNote', lang)}
                  </p>
                </div>
              )}

              {/* Meta Info */}
              <div className="text-sm text-neutral-400 text-center">
                {t('createdAt', lang)} {new Date(booking.created_at).toLocaleString(dateLocaleMap[lang])}
                {booking.completed_at && (
                  <> · {t('completedAt', lang)} {new Date(booking.completed_at).toLocaleString(dateLocaleMap[lang])}</>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border p-12 text-center">
              <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">{t('bookingNotExist', lang)}</p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
