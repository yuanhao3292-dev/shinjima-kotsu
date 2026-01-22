'use client';

import { useState, useEffect } from 'react';
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
  Plus,
  Filter,
  Loader2,
  MapPin,
  Clock,
  Users2,
  ChevronRight
} from 'lucide-react';

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

const STATUS_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待確認' },
  { value: 'confirmed', label: '已確認' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadBookings();
  }, []);

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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
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
      pending: '待支付定金',
      paid: '定金已付',
      refunded: '已退款',
      forfeited: '定金沒收',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs border ${styles[status] || styles.pending}`}>
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
          <span className="font-bold">我的預約</span>
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
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">我的預約</h1>
              <p className="text-gray-500 mt-1">管理您的客戶預約</p>
            </div>
            <Link
              href="/guide-partner/venues"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-xl transition"
            >
              <Plus size={18} />
              新建預約
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border p-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter size={16} className="text-gray-400 flex-shrink-0" />
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                    ${statusFilter === filter.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-500 mb-4">
            共 {filteredBookings.length} 條預約記錄
          </p>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl border hover:border-orange-300 hover:shadow-md transition overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{booking.customer_name}</h3>
                        {getStatusBadge(booking.status)}
                        {getDepositBadge(booking.deposit_status)}
                      </div>

                      <p className="text-gray-600 font-medium mb-2">
                        {booking.venue?.name}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                          {booking.party_size} 人
                        </span>
                      </div>
                    </div>

                    {/* Right: Commission */}
                    <div className="sm:text-right">
                      {booking.actual_spend && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">實際消費</p>
                          <p className="font-bold text-gray-900">¥{booking.actual_spend.toLocaleString()}</p>
                        </div>
                      )}
                      {booking.commission_amount && (
                        <div>
                          <p className="text-xs text-gray-500">報酬</p>
                          <p className="font-bold text-green-600">+¥{booking.commission_amount.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    創建於 {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/guide-partner/bookings/${booking.id}`}
                    className="text-orange-600 text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    查看詳情 <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">暫無預約記錄</h3>
              <p className="text-gray-500 mb-4">開始為您的客戶預約服務吧</p>
              <Link
                href="/guide-partner/venues"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition"
              >
                <Store size={18} />
                瀏覽店舖
              </Link>
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
