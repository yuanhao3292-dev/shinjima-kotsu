'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  Store,
  Calendar,
  X,
  Plus,
  Filter,
  Loader2,
  MapPin,
  Users2,
  ChevronRight,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

const translations = {
  pageTitle: {
    ja: '予約管理',
    'zh-CN': '我的预约',
    'zh-TW': '我的預約',
    en: 'My Bookings',
    ko: '예약 관리',
  },
  pageTitleSidebar: {
    ja: '予約管理',
    'zh-CN': '我的预约',
    'zh-TW': '我的預約',
    en: 'My Bookings',
    ko: '예약 관리',
  },
  subtitle: {
    ja: 'お客様の予約を管理します',
    'zh-CN': '管理您的客户预约',
    'zh-TW': '管理您的客戶預約',
    en: 'Manage your customer bookings',
    ko: '고객 예약을 관리합니다',
  },
  newBooking: {
    ja: '新規予約',
    'zh-CN': '新建预约',
    'zh-TW': '新建預約',
    en: 'New Booking',
    ko: '새 예약',
  },
  filterAll: {
    ja: 'すべて',
    'zh-CN': '全部',
    'zh-TW': '全部',
    en: 'All',
    ko: '전체',
  },
  filterPending: {
    ja: '確認待ち',
    'zh-CN': '待确认',
    'zh-TW': '待確認',
    en: 'Pending',
    ko: '확인 대기',
  },
  filterConfirmed: {
    ja: '確認済み',
    'zh-CN': '已确认',
    'zh-TW': '已確認',
    en: 'Confirmed',
    ko: '확인됨',
  },
  filterCompleted: {
    ja: '完了',
    'zh-CN': '已完成',
    'zh-TW': '已完成',
    en: 'Completed',
    ko: '완료',
  },
  filterCancelled: {
    ja: 'キャンセル',
    'zh-CN': '已取消',
    'zh-TW': '已取消',
    en: 'Cancelled',
    ko: '취소됨',
  },
  statusPending: {
    ja: '確認待ち',
    'zh-CN': '待确认',
    'zh-TW': '待確認',
    en: 'Pending',
    ko: '확인 대기',
  },
  statusConfirmed: {
    ja: '確認済み',
    'zh-CN': '已确认',
    'zh-TW': '已確認',
    en: 'Confirmed',
    ko: '확인됨',
  },
  statusCompleted: {
    ja: '完了',
    'zh-CN': '已完成',
    'zh-TW': '已完成',
    en: 'Completed',
    ko: '완료',
  },
  statusCancelled: {
    ja: 'キャンセル',
    'zh-CN': '已取消',
    'zh-TW': '已取消',
    en: 'Cancelled',
    ko: '취소됨',
  },
  statusNoShow: {
    ja: '未来店',
    'zh-CN': '未到店',
    'zh-TW': '未到店',
    en: 'No Show',
    ko: '미방문',
  },
  depositPending: {
    ja: 'デポジット未払い',
    'zh-CN': '待支付定金',
    'zh-TW': '待支付定金',
    en: 'Deposit Pending',
    ko: '보증금 미결제',
  },
  depositPaid: {
    ja: 'デポジット済み',
    'zh-CN': '定金已付',
    'zh-TW': '定金已付',
    en: 'Deposit Paid',
    ko: '보증금 결제 완료',
  },
  depositRefunded: {
    ja: '返金済み',
    'zh-CN': '已退款',
    'zh-TW': '已退款',
    en: 'Refunded',
    ko: '환불 완료',
  },
  depositForfeited: {
    ja: 'デポジット没収',
    'zh-CN': '定金没收',
    'zh-TW': '定金沒收',
    en: 'Deposit Forfeited',
    ko: '보증금 몰수',
  },
  paymentSuccess: {
    ja: 'デポジットの支払いが完了しました。管理者が予約を確認いたします。',
    'zh-CN': '定金支付成功！管理员将尽快确认您的预约。',
    'zh-TW': '定金支付成功！管理員將盡快確認您的預約。',
    en: 'Deposit payment successful! The administrator will confirm your booking shortly.',
    ko: '보증금 결제가 완료되었습니다. 관리자가 예약을 확인해 드리겠습니다.',
  },
  paymentCancelled: {
    ja: '支払いがキャンセルされました。後ほどデポジットをお支払いいただけます。',
    'zh-CN': '支付已取消。您可以稍后再支付定金。',
    'zh-TW': '支付已取消。您可以稍後再支付定金。',
    en: 'Payment cancelled. You can pay the deposit later.',
    ko: '결제가 취소되었습니다. 나중에 보증금을 결제하실 수 있습니다.',
  },
  pleaseLogin: {
    ja: '再ログインしてください',
    'zh-CN': '请重新登录',
    'zh-TW': '請重新登入',
    en: 'Please log in again',
    ko: '다시 로그인해 주세요',
  },
  cannotCreatePayment: {
    ja: '支払いページを作成できません',
    'zh-CN': '无法创建支付页面',
    'zh-TW': '無法創建支付頁面',
    en: 'Unable to create payment page',
    ko: '결제 페이지를 생성할 수 없습니다',
  },
  paymentFailed: {
    ja: '支払いリクエストに失敗しました。後ほどお試しください。',
    'zh-CN': '支付请求失败，请稍后重试',
    'zh-TW': '支付請求失敗，請稍後重試',
    en: 'Payment request failed. Please try again later.',
    ko: '결제 요청에 실패했습니다. 나중에 다시 시도해 주세요.',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
    ko: '로딩 중...',
  },
  totalRecords: {
    ja: '件の予約記録',
    'zh-CN': '条预约记录',
    'zh-TW': '條預約記錄',
    en: 'booking records',
    ko: '건의 예약 기록',
  },
  personCount: {
    ja: '名',
    'zh-CN': '人',
    'zh-TW': '人',
    en: 'guests',
    ko: '명',
  },
  actualSpend: {
    ja: '実際の消費額',
    'zh-CN': '实际消费',
    'zh-TW': '實際消費',
    en: 'Actual Spend',
    ko: '실제 소비 금액',
  },
  commission: {
    ja: '報酬',
    'zh-CN': '报酬',
    'zh-TW': '報酬',
    en: 'Commission',
    ko: '커미션',
  },
  processing: {
    ja: '処理中...',
    'zh-CN': '处理中...',
    'zh-TW': '處理中...',
    en: 'Processing...',
    ko: '처리 중...',
  },
  payDeposit: {
    ja: 'デポジットを支払う ¥500',
    'zh-CN': '支付定金 ¥500',
    'zh-TW': '支付定金 ¥500',
    en: 'Pay Deposit ¥500',
    ko: '보증금 결제 ¥500',
  },
  createdAt: {
    ja: '作成日',
    'zh-CN': '创建于',
    'zh-TW': '創建於',
    en: 'Created on',
    ko: '생성일',
  },
  viewDetails: {
    ja: '詳細を見る',
    'zh-CN': '查看详情',
    'zh-TW': '查看詳情',
    en: 'View Details',
    ko: '상세 보기',
  },
  noBookings: {
    ja: '予約記録がありません',
    'zh-CN': '暂无预约记录',
    'zh-TW': '暫無預約記錄',
    en: 'No booking records',
    ko: '예약 기록이 없습니다',
  },
  startBooking: {
    ja: 'お客様の予約を始めましょう',
    'zh-CN': '开始为您的客户预约服务吧',
    'zh-TW': '開始為您的客戶預約服務吧',
    en: 'Start booking services for your customers',
    ko: '고객을 위한 예약을 시작하세요',
  },
  browseVenues: {
    ja: '店舗を見る',
    'zh-CN': '浏览店铺',
    'zh-TW': '瀏覽店舖',
    en: 'Browse Venues',
    ko: '매장 둘러보기',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};
const dateLocaleMap: Record<Language, string> = { ja: 'ja-JP', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en-US', ko: 'ko-KR' };

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  party_size: number;
  booking_date: string;
  booking_time: string;
  status: string;
  deposit_status: string;
  actual_spend: number | null;
  commission_amount: number | null;
  commission_status: string;
  created_at: string;
  venue: {
    name: string;
    city: string;
    area: string;
    category: string;
  };
}

const STATUS_FILTER_KEYS: { value: string; labelKey: keyof typeof translations }[] = [
  { value: 'all', labelKey: 'filterAll' },
  { value: 'pending', labelKey: 'filterPending' },
  { value: 'confirmed', labelKey: 'filterConfirmed' },
  { value: 'completed', labelKey: 'filterCompleted' },
  { value: 'cancelled', labelKey: 'filterCancelled' },
];

function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const lang = useLanguage();

  useEffect(() => {
    loadBookings();
  }, []);

  // Handle payment callback query params
  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      setMessage({ type: 'success', text: t('paymentSuccess', lang) });
      // Reload bookings to reflect updated deposit status
      loadBookings();
    } else if (payment === 'cancelled') {
      setMessage({ type: 'error', text: t('paymentCancelled', lang) });
    }
  }, [searchParams]);

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handlePayDeposit = async (bookingId: string) => {
    setPayingBookingId(bookingId);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage({ type: 'error', text: t('pleaseLogin', lang) });
        setPayingBookingId(null);
        return;
      }

      const res = await fetch('/api/booking/deposit-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || t('cannotCreatePayment', lang) });
        setPayingBookingId(null);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage({ type: 'error', text: t('paymentFailed', lang) });
      setPayingBookingId(null);
    }
  };

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === statusFilter));
    }
  }, [bookings, statusFilter]);

  const loadBookings = async () => {
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

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(name, city, area, category)
        `)
        .eq('guide_id', guide.id)
        .order('created_at', { ascending: false });

      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-neutral-100 text-neutral-600',
      confirmed: 'bg-brand-100 text-brand-700',
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
      <span className={`px-2 py-1 text-xs font-medium ${styles[status] || styles.pending}`}>
        {labelKeys[status] ? t(labelKeys[status], lang) : status}
      </span>
    );
  };

  const getDepositBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-neutral-50 text-neutral-600 border-neutral-200',
      paid: 'bg-green-50 text-green-600 border-green-200',
      refunded: 'bg-neutral-50 text-neutral-600 border-neutral-200',
      forfeited: 'bg-red-50 text-red-600 border-red-200',
    };
    const labelKeys: Record<string, keyof typeof translations> = {
      pending: 'depositPending',
      paid: 'depositPaid',
      refunded: 'depositRefunded',
      forfeited: 'depositForfeited',
    };
    return (
      <span className={`px-2 py-1 text-xs border ${styles[status] || styles.pending}`}>
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
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-brand-900">{t('pageTitle', lang)}</h1>
              <p className="text-neutral-500 mt-1">{t('subtitle', lang)}</p>
            </div>
            <Link
              href="/guide-partner/venues"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 transition"
            >
              <Plus size={18} />
              {t('newBooking', lang)}
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white border p-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter size={16} className="text-neutral-400 flex-shrink-0" />
              {STATUS_FILTER_KEYS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`
                    px-4 py-2 text-sm font-medium whitespace-nowrap transition
                    ${statusFilter === filter.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }
                  `}
                >
                  {t(filter.labelKey, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Message */}
          {message && (
            <div className={`mb-4 p-4 flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
              {message.text}
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-neutral-500 mb-4">
            {filteredBookings.length} {t('totalRecords', lang)}
          </p>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border hover:border-brand-300 transition overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-brand-900 text-lg">{booking.customer_name}</h3>
                        {getStatusBadge(booking.status)}
                        {getDepositBadge(booking.deposit_status)}
                      </div>

                      <p className="text-neutral-600 font-medium mb-2">
                        {booking.venue?.name}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {booking.venue?.city} · {booking.venue?.area}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {booking.booking_date}
                          {booking.booking_time && ` ${booking.booking_time}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users2 size={14} />
                          {booking.party_size} {t('personCount', lang)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Commission */}
                    <div className="sm:text-right">
                      {booking.actual_spend && (
                        <div className="mb-2">
                          <p className="text-xs text-neutral-500">{t('actualSpend', lang)}</p>
                          <p className="font-bold text-brand-900">¥{booking.actual_spend.toLocaleString()}</p>
                        </div>
                      )}
                      {booking.commission_amount && (
                        <div>
                          <p className="text-xs text-neutral-500">{t('commission', lang)}</p>
                          <p className="font-bold text-green-600">+¥{booking.commission_amount.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pay Deposit Button */}
                {booking.status === 'pending' && booking.deposit_status === 'pending' && (
                  <div className="px-4 sm:px-6 py-3 border-t">
                    <button
                      onClick={() => handlePayDeposit(booking.id)}
                      disabled={payingBookingId === booking.id}
                      className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-bold py-3 transition"
                    >
                      {payingBookingId === booking.id ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          {t('processing', lang)}
                        </>
                      ) : (
                        <>
                          <CreditCard size={18} />
                          {t('payDeposit', lang)}
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="px-4 sm:px-6 py-3 bg-neutral-50 border-t flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    {t('createdAt', lang)} {new Date(booking.created_at).toLocaleDateString(dateLocaleMap[lang])}
                  </span>
                  <Link
                    href={`/guide-partner/bookings/${booking.id}`}
                    className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    {t('viewDetails', lang)} <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="bg-white border p-12 text-center">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="font-bold text-brand-900 mb-2">{t('noBookings', lang)}</h3>
              <p className="text-neutral-500 mb-4">{t('startBooking', lang)}</p>
              <Link
                href="/guide-partner/venues"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-3 transition"
              >
                <Store size={18} />
                {t('browseVenues', lang)}
              </Link>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
      </div>
    }>
      <BookingsContent />
    </Suspense>
  );
}
