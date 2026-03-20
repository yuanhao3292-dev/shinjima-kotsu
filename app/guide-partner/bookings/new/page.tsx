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
  ArrowLeft,
  User,
  Phone,
  Clock,
  Users2,
  MessageSquare,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

const translations = {
  pageTitle: {
    ja: '新規予約',
    'zh-CN': '新建预约',
    'zh-TW': '新建預約',
    en: 'New Booking',
  },
  pageTitleSidebar: {
    ja: '新規予約',
    'zh-CN': '新建预约',
    'zh-TW': '新建預約',
    en: 'New Booking',
  },
  backToVenues: {
    ja: '店舗一覧に戻る',
    'zh-CN': '返回店铺列表',
    'zh-TW': '返回店舖列表',
    en: 'Back to Venues',
  },
  subtitle: {
    ja: 'お客様の予約を作成します',
    'zh-CN': '为您的客户预约服务',
    'zh-TW': '為您的客戶預約服務',
    en: 'Create a booking for your customer',
  },
  noticeTitle: {
    ja: '予約に関するご注意',
    'zh-CN': '预约须知',
    'zh-TW': '預約須知',
    en: 'Booking Notice',
  },
  noticeDeposit: {
    ja: '予約送信後、お客様に500元のデポジットのお支払いをお願いしてください',
    'zh-CN': '预约提交后，请提醒客户支付 500 元人民币定金',
    'zh-TW': '預約提交後，請提醒客戶支付 500 元人民幣定金',
    en: 'After submission, please remind the customer to pay the 500 CNY deposit',
  },
  noticeActivation: {
    ja: 'デポジットのお支払い後、予約が有効になります',
    'zh-CN': '定金支付后预约方可生效',
    'zh-TW': '定金支付後預約方可生效',
    en: 'The booking will be activated after the deposit is paid',
  },
  noticeSameDay: {
    ja: '当日キャンセルの場合、デポジットは返金されません',
    'zh-CN': '当天取消定金不退',
    'zh-TW': '當天取消定金不退',
    en: 'Same-day cancellation will forfeit the deposit',
  },
  selectVenueLabel: {
    ja: '店舗を選択 *',
    'zh-CN': '选择店铺 *',
    'zh-TW': '選擇店舖 *',
    en: 'Select Venue *',
  },
  selectVenuePlaceholder: {
    ja: '店舗を選択してください',
    'zh-CN': '请选择店铺',
    'zh-TW': '請選擇店舖',
    en: 'Please select a venue',
  },
  minSpend: {
    ja: '最低消費額:',
    'zh-CN': '最低消费:',
    'zh-TW': '最低消費:',
    en: 'Minimum spend:',
  },
  customerNameLabel: {
    ja: 'お客様氏名 *',
    'zh-CN': '客户姓名 *',
    'zh-TW': '客戶姓名 *',
    en: 'Customer Name *',
  },
  customerNamePlaceholder: {
    ja: 'お客様氏名',
    'zh-CN': '客户姓名',
    'zh-TW': '客戶姓名',
    en: 'Customer name',
  },
  customerPhoneLabel: {
    ja: 'お客様電話番号（任意）',
    'zh-CN': '客户电话（选填）',
    'zh-TW': '客戶電話（選填）',
    en: 'Customer Phone (Optional)',
  },
  customerPhonePlaceholder: {
    ja: 'お客様の電話番号',
    'zh-CN': '客户联系电话',
    'zh-TW': '客戶聯繫電話',
    en: 'Customer phone number',
  },
  partySizeLabel: {
    ja: '人数 *',
    'zh-CN': '人数 *',
    'zh-TW': '人數 *',
    en: 'Party Size *',
  },
  personCount: {
    ja: '名',
    'zh-CN': '人',
    'zh-TW': '人',
    en: 'guests',
  },
  moreThanTen: {
    ja: '10名以上',
    'zh-CN': '10人以上',
    'zh-TW': '10人以上',
    en: 'More than 10',
  },
  bookingDateLabel: {
    ja: '予約日 *',
    'zh-CN': '预约日期 *',
    'zh-TW': '預約日期 *',
    en: 'Booking Date *',
  },
  bookingTimeLabel: {
    ja: '予約時間',
    'zh-CN': '预约时间',
    'zh-TW': '預約時間',
    en: 'Booking Time',
  },
  specialRequestsLabel: {
    ja: '特別なご要望（任意）',
    'zh-CN': '特殊要求（选填）',
    'zh-TW': '特殊要求（選填）',
    en: 'Special Requests (Optional)',
  },
  specialRequestsPlaceholder: {
    ja: '特別なご要望がございましたらご記入ください...',
    'zh-CN': '如有特殊要求请在此说明...',
    'zh-TW': '如有特殊要求請在此說明...',
    en: 'Please describe any special requests...',
  },
  submitting: {
    ja: '送信中...',
    'zh-CN': '提交中...',
    'zh-TW': '提交中...',
    en: 'Submitting...',
  },
  submitBooking: {
    ja: '予約を送信',
    'zh-CN': '提交预约',
    'zh-TW': '提交預約',
    en: 'Submit Booking',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  pleaseLogin: {
    ja: 'ログインしてください',
    'zh-CN': '请先登录',
    'zh-TW': '請先登入',
    en: 'Please log in first',
  },
  pleaseSelectVenue: {
    ja: '店舗を選択してください',
    'zh-CN': '请选择店铺',
    'zh-TW': '請選擇店舖',
    en: 'Please select a venue',
  },
  submitFailed: {
    ja: '送信に失敗しました。後ほどお試しください。',
    'zh-CN': '提交失败，请稍后重试',
    'zh-TW': '提交失敗，請稍後重試',
    en: 'Submission failed. Please try again later.',
  },
  bookingSubmitted: {
    ja: '予約を送信しました',
    'zh-CN': '预约已提交',
    'zh-TW': '預約已提交',
    en: 'Booking Submitted',
  },
  successMessage: {
    ja: '「予約管理」ページで ¥500 のデポジットをお支払いください。\nデポジットのお支払い後、管理者が予約を確認いたします。',
    'zh-CN': '请前往「我的预约」页面支付 ¥500 定金。\n定金支付后管理员将确认预约。',
    'zh-TW': '請前往「我的預約」頁面支付 ¥500 定金。\n定金支付後管理員將確認預約。',
    en: 'Please go to "My Bookings" to pay the ¥500 deposit.\nThe administrator will confirm the booking after deposit payment.',
  },
  goToPayDeposit: {
    ja: 'デポジットを支払う',
    'zh-CN': '前往支付定金',
    'zh-TW': '前往支付定金',
    en: 'Go to Pay Deposit',
  },
  continueBooking: {
    ja: '他の店舗を予約する',
    'zh-CN': '继续预约其他店铺',
    'zh-TW': '繼續預約其他店舖',
    en: 'Book Another Venue',
  },
  contractNoticeTitle: {
    ja: 'ご契約について：',
    'zh-CN': '关于合同：',
    'zh-TW': '關於合約：',
    en: 'Contract Notice: ',
  },
  contractNoticeBody: {
    ja: '本サービスのご契約は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。お客様との契約主体は新島交通株式会社となります。',
    'zh-CN': '本服务的合同由新岛交通株式会社（大阪府知事登录旅行业 第2-3115号）签订。与客户的合同主体为新岛交通株式会社。',
    'zh-TW': '本服務的合約由新島交通株式會社（大阪府知事登錄旅行業 第2-3115號）簽訂。與客戶的合約主體為新島交通株式會社。',
    en: 'The contract for this service is concluded with Niijima Kotsu Co., Ltd. (Osaka Governor Registered Travel Agency No. 2-3115). The contracting party with the customer is Niijima Kotsu Co., Ltd.',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

interface Venue {
  id: string;
  name: string;
  name_ja: string;
  city: string;
  area: string;
  category: string;
  min_spend: number;
}

interface Guide {
  id: string;
  name: string;
  commission_rate: number; // 佣金率（小数格式，如 0.10 = 10%）
}

function NewBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venue');

  const [guide, setGuide] = useState<Guide | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    venueId: venueId || '',
    customerName: '',
    customerPhone: '',
    partySize: 2,
    bookingDate: '',
    bookingTime: '',
    specialRequests: '',
  });

  const supabase = createClient();
  const lang = useLanguage();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (venueId && venues.length > 0) {
      const selectedVenue = venues.find(v => v.id === venueId);
      if (selectedVenue) {
        setVenue(selectedVenue);
        setFormData(prev => ({ ...prev, venueId }));
      }
    }
  }, [venueId, venues]);

  const loadInitialData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      // 獲取導遊資訊
      const { data: guideData } = await supabase
        .from('guides')
        .select('id, name, status, subscription_tier')
        .eq('auth_user_id', user.id)
        .single();

      if (!guideData || guideData.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      // 基础佣金率（展示用），实际费率由 page_modules.commission_rate_a/b 在下单时决定
      const commissionRate = guideData.subscription_tier === 'partner' ? 0.20 : 0.10;

      setGuide({
        id: guideData.id,
        name: guideData.name,
        commission_rate: commissionRate,
      });

      // 獲取店舖列表
      const { data: venuesData } = await supabase
        .from('venues')
        .select('id, name, name_ja, city, area, category, min_spend')
        .eq('is_active', true)
        .order('city');

      setVenues(venuesData || []);

      // 設置預設日期為明天（使用本地時間避免時區問題）
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      setFormData(prev => ({
        ...prev,
        bookingDate: `${year}-${month}-${day}`,
      }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVenueId = e.target.value;
    setFormData(prev => ({ ...prev, venueId: selectedVenueId }));
    const selectedVenue = venues.find(v => v.id === selectedVenueId);
    setVenue(selectedVenue || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!guide) {
      setError(t('pleaseLogin', lang));
      setSubmitting(false);
      return;
    }

    if (!formData.venueId) {
      setError(t('pleaseSelectVenue', lang));
      setSubmitting(false);
      return;
    }

    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          guide_id: guide.id,
          venue_id: formData.venueId,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone || null,
          party_size: formData.partySize,
          booking_date: formData.bookingDate,
          booking_time: formData.bookingTime || null,
          special_requests: formData.specialRequests || null,
          status: 'pending',
          deposit_status: 'pending',
          commission_rate: guide.commission_rate, // 記錄創建時的阶梯佣金率
        });

      if (bookingError) {
        throw bookingError;
      }

      // 發送管理員通知（非阻塞，不影響預約提交結果）
      const selectedVenue = venues.find(v => v.id === formData.venueId);
      fetch('/api/guide-bookings/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideName: guide.name,
          venueName: selectedVenue?.name || '未知店舖',
          customerName: formData.customerName,
          customerPhone: formData.customerPhone || null,
          partySize: formData.partySize,
          bookingDate: formData.bookingDate,
          bookingTime: formData.bookingTime || null,
          specialRequests: formData.specialRequests || null,
        }),
      }).catch(err => console.error('Failed to send notification:', err));

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t('submitFailed', lang));
    } finally {
      setSubmitting(false);
    }
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

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-900 mb-4">{t('bookingSubmitted', lang)}</h2>
          <p className="text-neutral-600 mb-6 whitespace-pre-line">
            {t('successMessage', lang)}
          </p>
          <div className="space-y-3">
            <Link
              href="/guide-partner/bookings"
              className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 transition"
            >
              {t('goToPayDeposit', lang)}
            </Link>
            <Link
              href="/guide-partner/venues"
              className="block w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-3 transition"
            >
              {t('continueBooking', lang)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <GuideSidebar pageTitle={t('pageTitleSidebar', lang)} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-2xl">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/guide-partner/venues"
              className="inline-flex items-center gap-1 text-neutral-500 hover:text-brand-900 text-sm mb-4"
            >
              <ArrowLeft size={16} />
              {t('backToVenues', lang)}
            </Link>
            <h1 className="font-serif text-2xl font-bold text-brand-900">{t('pageTitle', lang)}</h1>
            <p className="text-neutral-500 mt-1">{t('subtitle', lang)}</p>
          </div>

          {/* Notice */}
          <div className="bg-brand-50 border border-brand-200 p-4 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-brand-800">
                <p className="font-medium mb-1">{t('noticeTitle', lang)}</p>
                <ul className="list-disc list-inside space-y-1 text-brand-700">
                  <li>{t('noticeDeposit', lang)}</li>
                  <li>{t('noticeActivation', lang)}</li>
                  <li>{t('noticeSameDay', lang)}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-2 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 店舖選擇 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Store className="inline mr-1" size={16} />
                  {t('selectVenueLabel', lang)}
                </label>
                <select
                  value={formData.venueId}
                  onChange={handleVenueChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="">{t('selectVenuePlaceholder', lang)}</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city} · {v.area})
                    </option>
                  ))}
                </select>
                {venue && (
                  <p className="mt-2 text-sm text-neutral-500">
                    {t('minSpend', lang)} ¥{venue.min_spend?.toLocaleString()}
                  </p>
                )}
              </div>

              {/* 客戶姓名 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <User className="inline mr-1" size={16} />
                  {t('customerNameLabel', lang)}
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder={t('customerNamePlaceholder', lang)}
                />
              </div>

              {/* 客戶電話 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Phone className="inline mr-1" size={16} />
                  {t('customerPhoneLabel', lang)}
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder={t('customerPhonePlaceholder', lang)}
                />
              </div>

              {/* 人數 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Users2 className="inline mr-1" size={16} />
                  {t('partySizeLabel', lang)}
                </label>
                <select
                  value={formData.partySize}
                  onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n} {t('personCount', lang)}</option>
                  ))}
                  <option value={15}>{t('moreThanTen', lang)}</option>
                </select>
              </div>

              {/* 日期時間 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Calendar className="inline mr-1" size={16} />
                    {t('bookingDateLabel', lang)}
                  </label>
                  <input
                    type="date"
                    value={formData.bookingDate}
                    onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Clock className="inline mr-1" size={16} />
                    {t('bookingTimeLabel', lang)}
                  </label>
                  <input
                    type="time"
                    value={formData.bookingTime}
                    onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 特殊要求 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <MessageSquare className="inline mr-1" size={16} />
                  {t('specialRequestsLabel', lang)}
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                  placeholder={t('specialRequestsPlaceholder', lang)}
                />
              </div>

              {/* 合同主体声明 */}
              <div className="bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-800">
                  <strong>{t('contractNoticeTitle', lang)}</strong>{t('contractNoticeBody', lang)}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-bold py-4 transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t('submitting', lang)}
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    {t('submitBooking', lang)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewBookingForm />
    </Suspense>
  );
}
