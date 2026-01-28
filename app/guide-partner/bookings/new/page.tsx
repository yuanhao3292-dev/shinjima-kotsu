'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import {
  LayoutDashboard,
  Store,
  Calendar,
  Wallet,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      // 獲取導遊資訊（含佣金等級）
      const { data: guideData } = await supabase
        .from('guides')
        .select('id, name, status, commission_tier_id, commission_tiers(commission_rate)')
        .eq('auth_user_id', user.id)
        .single();

      if (!guideData || guideData.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      // 從 commission_tiers 獲取動態佣金率
      const tierData = Array.isArray(guideData.commission_tiers)
        ? guideData.commission_tiers[0]
        : guideData.commission_tiers;
      const commissionRate = tierData?.commission_rate
        ? Number(tierData.commission_rate) / 100  // 10.00 → 0.10
        : 0.10; // 默認 10%

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
      setError('請先登入');
      setSubmitting(false);
      return;
    }

    if (!formData.venueId) {
      setError('請選擇店舖');
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
      setError(err.message || '提交失敗，請稍後重試');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">預約已提交</h2>
          <p className="text-gray-600 mb-6">
            請前往「我的預約」頁面支付 ¥500 定金。<br />
            定金支付後管理員將確認預約。
          </p>
          <div className="space-y-3">
            <Link
              href="/guide-partner/bookings"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
            >
              前往支付定金
            </Link>
            <Link
              href="/guide-partner/venues"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition"
            >
              繼續預約其他店舖
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: '控制台', href: '/guide-partner/dashboard' },
    { icon: Store, label: '店舖列表', href: '/guide-partner/venues' },
    { icon: Calendar, label: '我的預約', href: '/guide-partner/bookings', active: true },
    { icon: Wallet, label: '報酬結算', href: '/guide-partner/commission' },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals' },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">新建預約</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-40 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <Logo className="w-8 h-8 text-orange-600" />
          <div>
            <span className="font-bold text-gray-900">NIIJIMA</span>
            <p className="text-xs text-gray-500">Guide Partner</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${item.active
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>退出登入</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-2xl">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/guide-partner/venues"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-4"
            >
              <ArrowLeft size={16} />
              返回店舖列表
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">新建預約</h1>
            <p className="text-gray-500 mt-1">為您的客戶預約服務</p>
          </div>

          {/* Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">預約須知</p>
                <ul className="list-disc list-inside space-y-1 text-orange-700">
                  <li>預約提交後，請提醒客戶支付 500 元人民幣定金</li>
                  <li>定金支付後預約方可生效</li>
                  <li>當天取消定金不退</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 店舖選擇 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Store className="inline mr-1" size={16} />
                  選擇店舖 *
                </label>
                <select
                  value={formData.venueId}
                  onChange={handleVenueChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">請選擇店舖</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city} · {v.area})
                    </option>
                  ))}
                </select>
                {venue && (
                  <p className="mt-2 text-sm text-gray-500">
                    最低消費: ¥{venue.min_spend?.toLocaleString()}
                  </p>
                )}
              </div>

              {/* 客戶姓名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline mr-1" size={16} />
                  客戶姓名 *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="客戶姓名"
                />
              </div>

              {/* 客戶電話 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline mr-1" size={16} />
                  客戶電話（選填）
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="客戶聯繫電話"
                />
              </div>

              {/* 人數 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users2 className="inline mr-1" size={16} />
                  人數 *
                </label>
                <select
                  value={formData.partySize}
                  onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n} 人</option>
                  ))}
                  <option value={15}>10人以上</option>
                </select>
              </div>

              {/* 日期時間 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline mr-1" size={16} />
                    預約日期 *
                  </label>
                  <input
                    type="date"
                    value={formData.bookingDate}
                    onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline mr-1" size={16} />
                    預約時間
                  </label>
                  <input
                    type="time"
                    value={formData.bookingTime}
                    onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 特殊要求 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="inline mr-1" size={16} />
                  特殊要求（選填）
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="如有特殊要求請在此說明..."
                />
              </div>

              {/* 合同主体声明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>ご契約について：</strong>本サービスのご契約は、新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。お客様との契約主体は新島交通株式会社となります。
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    提交中...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    提交預約
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
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
