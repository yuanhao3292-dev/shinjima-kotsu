'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
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
  MapPin,
  Clock,
  Users2,
  Phone,
  MessageSquare,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  DollarSign,
  Edit3
} from 'lucide-react';

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
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSpendInput, setShowSpendInput] = useState(false);
  const [actualSpend, setActualSpend] = useState('');
  const router = useRouter();
  const supabase = createClient();

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
        setError('預約不存在或無權訪問');
        return;
      }

      // Transform venue from array to object
      const transformedBooking = {
        ...bookingData,
        venue: Array.isArray(bookingData.venue) ? bookingData.venue[0] : bookingData.venue
      } as Booking;

      setBooking(transformedBooking);
      if (transformedBooking.actual_spend) {
        setActualSpend(transformedBooking.actual_spend.toString());
      }
    } catch (err) {
      console.error('Error:', err);
      setError('載入失敗');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!booking) return;
    setUpdating(true);
    setError('');

    try {
      const updateData: Record<string, unknown> = { status: newStatus };

      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', booking.id);

      if (updateError) throw updateError;

      await loadBookingDetail();
    } catch (err) {
      setError('更新失敗');
    } finally {
      setUpdating(false);
    }
  };

  const updateActualSpend = async () => {
    if (!booking || !actualSpend) return;
    setUpdating(true);
    setError('');

    try {
      const spend = parseFloat(actualSpend);
      if (isNaN(spend) || spend <= 0) {
        setError('請輸入有效的消費金額');
        setUpdating(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          actual_spend: spend,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      setShowSpendInput(false);
      await loadBookingDetail();
    } catch (err) {
      setError('更新失敗');
    } finally {
      setUpdating(false);
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
      if (!confirm('當天取消定金將不予退還，確定要取消嗎？')) {
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
      setError('取消失敗');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner');
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-700',
      no_show: 'bg-red-100 text-red-700',
    };
    const labels: Record<string, string> = {
      pending: '待確認',
      confirmed: '已確認',
      completed: '已完成',
      cancelled: '已取消',
      no_show: '未到店',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getDepositBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      paid: 'bg-green-50 text-green-600 border-green-200',
      refunded: 'bg-gray-50 text-gray-600 border-gray-200',
      forfeited: 'bg-red-50 text-red-600 border-red-200',
    };
    const labels: Record<string, string> = {
      pending: '待支付',
      paid: '已支付',
      refunded: '已退款',
      forfeited: '已沒收',
    };
    return (
      <span className={`px-3 py-1 rounded text-sm border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
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

  const navItems = [
    { icon: LayoutDashboard, label: '控制台', href: '/guide-partner/dashboard' },
    { icon: Store, label: '店舖列表', href: '/guide-partner/venues' },
    { icon: Calendar, label: '我的預約', href: '/guide-partner/bookings', active: true },
    { icon: Wallet, label: '返金結算', href: '/guide-partner/commission' },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals' },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">預約詳情</span>
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
        <div className="p-6 lg:p-8 max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/guide-partner/bookings"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-4"
            >
              <ArrowLeft size={16} />
              返回預約列表
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">預約詳情</h1>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {booking ? (
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">預約狀態</h2>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-500">定金:</span>
                  {getDepositBadge(booking.deposit_status)}
                  <span className="text-gray-400">¥{booking.deposit_amount}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-4">客戶資訊</h2>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Users2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer_name}</p>
                      <p className="text-sm text-gray-500">{booking.party_size} 人</p>
                    </div>
                  </div>
                  {booking.customer_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{booking.customer_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Venue Info */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-4">店舖資訊</h2>
                <div className="space-y-3">
                  <p className="font-medium text-gray-900">{booking.venue?.name}</p>
                  {booking.venue?.name_ja && (
                    <p className="text-sm text-gray-500">{booking.venue.name_ja}</p>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{booking.venue?.city} · {booking.venue?.area}</span>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-4">預約資訊</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{booking.booking_date}</span>
                  </div>
                  {booking.booking_time && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{booking.booking_time}</span>
                    </div>
                  )}
                  {booking.special_requests && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                      <p className="text-gray-600">{booking.special_requests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Commission Info */}
              {(booking.actual_spend || booking.status === 'completed') && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h2 className="font-bold text-green-800 mb-4">返金資訊</h2>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">實際消費</span>
                      <span className="font-bold text-green-800">¥{booking.actual_spend?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">稅前金額</span>
                      <span className="text-green-800">¥{booking.spend_before_tax?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-green-200">
                      <span className="text-green-700 font-medium">返金 (10%)</span>
                      <span className="font-bold text-green-800 text-lg">¥{booking.commission_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Spend Input */}
              {showSpendInput && (
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="font-bold text-gray-900 mb-4">錄入實際消費</h2>
                  <div className="flex gap-3">
                    <div className="flex-grow relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={actualSpend}
                        onChange={(e) => setActualSpend(e.target.value)}
                        placeholder="輸入消費金額（日元）"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={updateActualSpend}
                      disabled={updating}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium px-6 py-3 rounded-xl transition flex items-center gap-2"
                    >
                      {updating ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                      確認
                    </button>
                    <button
                      onClick={() => setShowSpendInput(false)}
                      className="text-gray-500 hover:text-gray-700 px-4"
                    >
                      取消
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    錄入後系統將自動計算返金（稅前金額 × 10%）
                  </p>
                </div>
              )}

              {/* Actions */}
              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="font-bold text-gray-900 mb-4">操作</h2>
                  <div className="flex flex-wrap gap-3">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => updateStatus('confirmed')}
                        disabled={updating}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-xl transition"
                      >
                        <CheckCircle2 size={18} />
                        確認預約
                      </button>
                    )}

                    {(booking.status === 'pending' || booking.status === 'confirmed') && !showSpendInput && (
                      <button
                        onClick={() => setShowSpendInput(true)}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-xl transition"
                      >
                        <Edit3 size={18} />
                        錄入消費完成
                      </button>
                    )}

                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => updateStatus('no_show')}
                        disabled={updating}
                        className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-xl transition"
                      >
                        <XCircle size={18} />
                        標記未到店
                      </button>
                    )}

                    <button
                      onClick={cancelBooking}
                      disabled={updating}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-xl transition"
                    >
                      <X size={18} />
                      取消預約
                    </button>
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="text-sm text-gray-400 text-center">
                創建於 {new Date(booking.created_at).toLocaleString()}
                {booking.completed_at && (
                  <> · 完成於 {new Date(booking.completed_at).toLocaleString()}</>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">預約不存在</p>
            </div>
          )}
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
