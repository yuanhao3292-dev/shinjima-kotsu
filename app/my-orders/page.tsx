'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MemberLayout from '@/components/MemberLayout';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { User } from '@supabase/supabase-js';
import {
  ArrowLeft,
  Loader2,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  LucideIcon
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount_jpy: number;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
  customer_snapshot: {
    name: string;
    email: string;
    phone?: string;
  };
  medical_packages: {
    name_zh_tw: string;
    slug: string;
  }[] | null;
}

const translations = {
  // Status labels
  statusPending: { ja: '支払待ち', 'zh-CN': '待付款', 'zh-TW': '待付款', en: 'Pending Payment' },
  statusPaid: { ja: '支払済み', 'zh-CN': '已付款', 'zh-TW': '已付款', en: 'Paid' },
  statusConfirmed: { ja: '確認済み', 'zh-CN': '已确认', 'zh-TW': '已確認', en: 'Confirmed' },
  statusCompleted: { ja: '完了', 'zh-CN': '已完成', 'zh-TW': '已完成', en: 'Completed' },
  statusCancelled: { ja: 'キャンセル', 'zh-CN': '已取消', 'zh-TW': '已取消', en: 'Cancelled' },
  statusRefunded: { ja: '返金済み', 'zh-CN': '已退款', 'zh-TW': '已退款', en: 'Refunded' },

  // Error messages
  loadError: { ja: '注文データを読み込めませんでした', 'zh-CN': '无法载入订单资料', 'zh-TW': '無法載入訂單資料', en: 'Unable to load order data' },
  generalError: { ja: 'エラーが発生しました。後でもう一度お試しください', 'zh-CN': '发生错误，请稍后重试', 'zh-TW': '發生錯誤，請稍後重試', en: 'An error occurred, please try again later' },
  loadingOrders: { ja: '注文を読み込み中...', 'zh-CN': '载入订单中...', 'zh-TW': '載入訂單中...', en: 'Loading orders...' },

  // Page titles and descriptions
  myOrders: { ja: 'マイオーダー', 'zh-CN': '我的订单', 'zh-TW': '我的訂單', en: 'My Orders' },
  bookingRecords: { ja: '予約記録', 'zh-CN': '预约记录', 'zh-TW': '預約記錄', en: 'Booking Records' },
  ordersDesc: { ja: 'すべての健診予約記録を確認し、注文状況を追跡し、行程の手配をいつでも把握できます。', 'zh-CN': '查看您的所有体检预约记录，追踪订单状态，随时掌握行程安排。', 'zh-TW': '查看您的所有健檢預約記錄，追蹤訂單狀態，隨時掌握行程安排。', en: 'View all your health checkup booking records, track order status, and stay updated on your schedule.' },
  backToAccount: { ja: '会員センターに戻る', 'zh-CN': '返回会员中心', 'zh-TW': '返回會員中心', en: 'Back to Member Center' },
  viewAllOrders: { ja: 'すべての健診予約記録を表示', 'zh-CN': '查看您的所有体检预约记录', 'zh-TW': '查看您的所有健檢預約記錄', en: 'View all your checkup booking records' },

  // Empty state
  noOrders: { ja: '注文なし', 'zh-CN': '尚无订单', 'zh-TW': '尚無訂單', en: 'No Orders Yet' },
  noOrdersDesc: { ja: 'まだ健診予約記録がありません', 'zh-CN': '您还没有任何体检预约记录', 'zh-TW': '您還沒有任何健檢預約記錄', en: 'You don\'t have any checkup booking records yet' },
  browsePackages: { ja: '健診パッケージを閲覧', 'zh-CN': '浏览体检套餐', 'zh-TW': '瀏覽健檢套餐', en: 'Browse Checkup Packages' },

  // Order details
  orderNumber: { ja: '注文番号', 'zh-CN': '订单编号', 'zh-TW': '訂單編號', en: 'Order Number' },
  checkupPackage: { ja: '健診パッケージ', 'zh-CN': '体检套餐', 'zh-TW': '健檢套餐', en: 'Checkup Package' },
  bookingDate: { ja: '予約日', 'zh-CN': '预约日期', 'zh-TW': '預約日期', en: 'Booking Date' },
  orderDate: { ja: '注文日時', 'zh-CN': '下单时间', 'zh-TW': '下單時間', en: 'Order Date' },
  notes: { ja: '備考', 'zh-CN': '备注', 'zh-TW': '備註', en: 'Notes' },
  paidAt: { ja: '支払日', 'zh-CN': '已于', 'zh-TW': '已於', en: 'Paid on' },
  paidOn: { ja: '支払済み', 'zh-CN': '付款', 'zh-TW': '付款', en: 'payment' },
  toBeConfirmed: { ja: '確認待ち', 'zh-CN': '待确认', 'zh-TW': '待確認', en: 'To be confirmed' },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

const getStatusConfig = (lang: Language): Record<string, { label: string; color: string; bgColor: string; icon: LucideIcon }> => ({
  pending: { label: t('statusPending', lang), color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200', icon: Clock },
  paid: { label: t('statusPaid', lang), color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: CreditCard },
  confirmed: { label: t('statusConfirmed', lang), color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200', icon: CheckCircle },
  completed: { label: t('statusCompleted', lang), color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', icon: CheckCircle },
  cancelled: { label: t('statusCancelled', lang), color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', icon: XCircle },
  refunded: { label: t('statusRefunded', lang), color: 'text-gray-700', bgColor: 'bg-gray-50 border-gray-200', icon: XCircle },
});

export default function MyOrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const lang = useLanguage();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/my-orders');
          return;
        }
        setUser(user);

        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!customer) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            order_number,
            status,
            total_amount_jpy,
            preferred_date,
            preferred_time,
            notes,
            created_at,
            paid_at,
            customer_snapshot,
            medical_packages (
              name_zh_tw,
              slug
            )
          `)
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          setError(t('loadError', lang));
        } else {
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(t('generalError', lang));
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [supabase, router, lang]);

  const statusConfig = getStatusConfig(lang);
  const localeMap: Record<Language, string> = {
    ja: 'ja-JP',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    en: 'en-US',
  };

  if (loading) {
    return (
      <MemberLayout showFooter={false}>
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">{t('loadingOrders', lang)}</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MemberLayout showFooter={false}>
      <div className="min-h-[calc(100vh-80px)] flex">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-2/5 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50"></div>

          {/* Language Switcher - Top Right */}
          <div className="absolute top-8 right-8 z-20">
            <LanguageSwitcher />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="flex items-center gap-3 mb-8">
              <Logo className="w-12 h-12 text-white" />
              <div>
                <span className="font-serif font-bold text-2xl tracking-wide">NIIJIMA</span>
                <p className="text-xs text-blue-200 uppercase tracking-widest">Medical Tourism</p>
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold mb-6 leading-tight">
              {t('myOrders', lang)}<br />
              <span className="text-blue-400">{t('bookingRecords', lang)}</span>
            </h1>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-sm">
              {t('ordersDesc', lang)}
            </p>
          </div>
        </div>

        {/* Right Side - Orders List */}
        <div className="w-full lg:w-3/5 bg-gray-50 p-8 overflow-y-auto relative">
          {/* Language Switcher for mobile - Top Right */}
          <div className="absolute top-4 right-4 lg:hidden z-20">
            <LanguageSwitcher />
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <Logo className="w-10 h-10 text-blue-600" />
              <span className="font-serif font-bold text-xl">NIIJIMA</span>
            </div>

            {/* Back Link */}
            <Link
              href="/my-account"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 mb-6 text-sm font-medium transition"
            >
              <ArrowLeft size={16} />
              {t('backToAccount', lang)}
            </Link>

            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-gray-900">{t('myOrders', lang)}</h1>
                  <p className="text-gray-500 text-sm">{t('viewAllOrders', lang)}</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{t('noOrders', lang)}</h3>
                <p className="text-gray-500 mb-8">{t('noOrdersDesc', lang)}</p>
                <Link
                  href="/medical"
                  className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg"
                >
                  <Package className="w-5 h-5" />
                  {t('browsePackages', lang)}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon: LucideIcon = status.icon;
                  const orderDate = new Date(order.created_at).toLocaleDateString(localeMap[lang], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  const preferredDate = order.preferred_date
                    ? new Date(order.preferred_date).toLocaleDateString(localeMap[lang], {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })
                    : t('toBeConfirmed', lang);

                  const packageName = order.medical_packages?.[0]?.name_zh_tw || t('checkupPackage', lang);

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">{t('orderNumber', lang)}</p>
                          <p className="font-mono font-bold text-gray-900">{order.order_number}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-900">{packageName}</span>
                        </div>
                        {order.preferred_date && (
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-gray-600 text-sm">
                              {t('bookingDate', lang)}：{preferredDate}
                              {order.preferred_time && ` ${order.preferred_time}`}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                          <span className="text-sm text-gray-400">{t('orderDate', lang)}：{orderDate}</span>
                          <span className="text-xl font-bold text-blue-600">
                            ¥{order.total_amount_jpy?.toLocaleString() || '-'}
                          </span>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500">{t('notes', lang)}：{order.notes}</p>
                        </div>
                      )}

                      {order.paid_at && (
                        <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {t('paidAt', lang)} {new Date(order.paid_at).toLocaleDateString(localeMap[lang])} {t('paidOn', lang)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
