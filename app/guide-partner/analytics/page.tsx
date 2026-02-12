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
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Trophy,
  Headphones,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  level: string;
  total_bookings: number;
  total_commission: number;
}

interface MonthlyData {
  month: string;
  bookings: number;
  commission: number;
  spend: number;
}

interface VenueStats {
  venue_name: string;
  booking_count: number;
  total_spend: number;
}

interface Stats {
  thisMonth: {
    bookings: number;
    commission: number;
    spend: number;
  };
  lastMonth: {
    bookings: number;
    commission: number;
    spend: number;
  };
  thisQuarter: {
    bookings: number;
    commission: number;
    spend: number;
  };
  lastQuarter: {
    bookings: number;
    commission: number;
    spend: number;
  };
  total: {
    bookings: number;
    commission: number;
    spend: number;
    referrals: number;
  };
  monthlyTrend: MonthlyData[];
  topVenues: VenueStats[];
  statusBreakdown: {
    completed: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

const LEVEL_TARGETS: Record<string, { bookings: number; spend: number }> = {
  growth: { bookings: 10, spend: 500000 },
  gold: { bookings: 60, spend: 5000000 },
};

const LEVEL_CONFIG: Record<string, { label: string; color: string; next: string | null }> = {
  growth: { label: '初期合夥人', color: 'text-orange-700', next: 'gold' },
  gold: { label: '金牌合夥人', color: 'text-yellow-600', next: null },
};

export default function AnalyticsPage() {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: guideData } = await supabase
        .from('guides')
        .select('id, name, level, total_bookings, total_commission')
        .eq('auth_user_id', user.id)
        .single();

      if (!guideData) {
        router.push('/guide-partner/login');
        return;
      }

      setGuide(guideData);

      // 获取所有预约数据
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('id, status, actual_spend, commission_amount, created_at, venue:venues(name)')
        .eq('guide_id', guideData.id)
        .order('created_at', { ascending: false });

      // 计算时间范围
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const currentQuarter = Math.floor(now.getMonth() / 3);
      const thisQuarterStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
      const lastQuarterStart = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
      const lastQuarterEnd = new Date(now.getFullYear(), currentQuarter * 3, 0);

      // 分类统计
      const thisMonthData = { bookings: 0, commission: 0, spend: 0 };
      const lastMonthData = { bookings: 0, commission: 0, spend: 0 };
      const thisQuarterData = { bookings: 0, commission: 0, spend: 0 };
      const lastQuarterData = { bookings: 0, commission: 0, spend: 0 };
      const totalData = { bookings: 0, commission: 0, spend: 0 };
      const statusBreakdown = { completed: 0, confirmed: 0, pending: 0, cancelled: 0 };
      const monthlyMap: Record<string, MonthlyData> = {};
      const venueMap: Record<string, VenueStats> = {};

      (allBookings || []).forEach((booking) => {
        const createdAt = new Date(booking.created_at);
        const commission = booking.commission_amount || 0;
        const spend = booking.actual_spend || 0;

        // 总计
        totalData.bookings++;
        totalData.commission += commission;
        totalData.spend += spend;

        // 状态分布
        if (booking.status === 'completed') statusBreakdown.completed++;
        else if (booking.status === 'confirmed') statusBreakdown.confirmed++;
        else if (booking.status === 'pending') statusBreakdown.pending++;
        else if (booking.status === 'cancelled') statusBreakdown.cancelled++;

        // 本月
        if (createdAt >= thisMonthStart) {
          thisMonthData.bookings++;
          thisMonthData.commission += commission;
          thisMonthData.spend += spend;
        }

        // 上月
        if (createdAt >= lastMonthStart && createdAt <= lastMonthEnd) {
          lastMonthData.bookings++;
          lastMonthData.commission += commission;
          lastMonthData.spend += spend;
        }

        // 本季度
        if (createdAt >= thisQuarterStart) {
          thisQuarterData.bookings++;
          thisQuarterData.commission += commission;
          thisQuarterData.spend += spend;
        }

        // 上季度
        if (createdAt >= lastQuarterStart && createdAt <= lastQuarterEnd) {
          lastQuarterData.bookings++;
          lastQuarterData.commission += commission;
          lastQuarterData.spend += spend;
        }

        // 月度趋势（最近6个月）
        const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { month: monthKey, bookings: 0, commission: 0, spend: 0 };
        }
        monthlyMap[monthKey].bookings++;
        monthlyMap[monthKey].commission += commission;
        monthlyMap[monthKey].spend += spend;

        // 店铺统计
        const venueName = Array.isArray(booking.venue) ? booking.venue[0]?.name : (booking.venue as any)?.name;
        if (venueName) {
          if (!venueMap[venueName]) {
            venueMap[venueName] = { venue_name: venueName, booking_count: 0, total_spend: 0 };
          }
          venueMap[venueName].booking_count++;
          venueMap[venueName].total_spend += spend;
        }
      });

      // 获取推荐人数
      const { count: referralCount } = await supabase
        .from('guides')
        .select('id', { count: 'exact', head: true })
        .eq('referrer_id', guideData.id);

      // 排序月度数据
      const monthlyTrend = Object.values(monthlyMap)
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6);

      // 排序店铺数据
      const topVenues = Object.values(venueMap)
        .sort((a, b) => b.total_spend - a.total_spend)
        .slice(0, 5);

      setStats({
        thisMonth: thisMonthData,
        lastMonth: lastMonthData,
        thisQuarter: thisQuarterData,
        lastQuarter: lastQuarterData,
        total: { ...totalData, referrals: referralCount || 0 },
        monthlyTrend,
        topVenues,
        statusBreakdown,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner');
  };

  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;

  const calcGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const navItems = [
    { icon: LayoutDashboard, label: '控制台', href: '/guide-partner/dashboard' },
    { icon: Store, label: '店舖列表', href: '/guide-partner/venues' },
    { icon: Calendar, label: '我的預約', href: '/guide-partner/bookings' },
    { icon: Wallet, label: '報酬結算', href: '/guide-partner/commission' },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals' },
    { icon: Trophy, label: '排行榜', href: '/guide-partner/leaderboard' },
    { icon: BarChart3, label: '數據分析', href: '/guide-partner/analytics', active: true },
    { icon: Headphones, label: '客服支援', href: '/guide-partner/support' },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings' },
  ];

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

  const currentLevel = guide?.level || 'bronze';
  const nextLevel = LEVEL_CONFIG[currentLevel]?.next;
  const nextTarget = nextLevel ? LEVEL_TARGETS[nextLevel] : null;
  const progress = nextTarget ? {
    bookings: Math.min(100, ((guide?.total_bookings || 0) / nextTarget.bookings) * 100),
    spend: Math.min(100, ((stats?.total.spend || 0) / nextTarget.spend) * 100),
  } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">數據分析</span>
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
        <div className="p-6 lg:p-8 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="text-orange-500" size={28} />
              數據分析
            </h1>
            <p className="text-gray-500 mt-1">查看您的業績表現和趨勢</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* 本月訂單 */}
            <div className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">本月訂單</p>
                {stats && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${
                    calcGrowth(stats.thisMonth.bookings, stats.lastMonth.bookings) >= 0
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {calcGrowth(stats.thisMonth.bookings, stats.lastMonth.bookings) >= 0
                      ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(calcGrowth(stats.thisMonth.bookings, stats.lastMonth.bookings))}%
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.thisMonth.bookings || 0}</p>
              <p className="text-xs text-gray-400 mt-1">上月: {stats?.lastMonth.bookings || 0}</p>
            </div>

            {/* 本月佣金 */}
            <div className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">本月佣金</p>
                {stats && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${
                    calcGrowth(stats.thisMonth.commission, stats.lastMonth.commission) >= 0
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {calcGrowth(stats.thisMonth.commission, stats.lastMonth.commission) >= 0
                      ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(calcGrowth(stats.thisMonth.commission, stats.lastMonth.commission))}%
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(stats?.thisMonth.commission || 0)}</p>
              <p className="text-xs text-gray-400 mt-1">上月: {formatCurrency(stats?.lastMonth.commission || 0)}</p>
            </div>

            {/* 本季銷售額 */}
            <div className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">本季銷售額</p>
                {stats && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${
                    calcGrowth(stats.thisQuarter.spend, stats.lastQuarter.spend) >= 0
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {calcGrowth(stats.thisQuarter.spend, stats.lastQuarter.spend) >= 0
                      ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(calcGrowth(stats.thisQuarter.spend, stats.lastQuarter.spend))}%
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-indigo-600">{formatCurrency(stats?.thisQuarter.spend || 0)}</p>
              <p className="text-xs text-gray-400 mt-1">上季: {formatCurrency(stats?.lastQuarter.spend || 0)}</p>
            </div>

            {/* 推薦人數 */}
            <div className="bg-white rounded-xl border p-5">
              <p className="text-sm text-gray-500 mb-2">推薦人數</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.total.referrals || 0}</p>
              <p className="text-xs text-gray-400 mt-1">累計推薦</p>
            </div>
          </div>

          {/* Level Progress */}
          {nextTarget && progress && (
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-white/80" size={24} />
                <div>
                  <p className="text-orange-100 text-sm">升級目標</p>
                  <p className="font-bold text-lg">
                    {LEVEL_CONFIG[currentLevel]?.label} → {LEVEL_CONFIG[nextLevel]?.label}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-orange-100">訂單數</span>
                    <span>{guide?.total_bookings || 0} / {nextTarget.bookings}</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${progress.bookings}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-orange-100">銷售額</span>
                    <span>{formatCurrency(stats?.total.spend || 0)} / {formatCurrency(nextTarget.spend)}</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${progress.spend}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} />
                月度趨勢
              </h2>
              {stats?.monthlyTrend && stats.monthlyTrend.length > 0 ? (
                <div className="space-y-3">
                  {stats.monthlyTrend.map((month) => (
                    <div key={month.month} className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 w-16">{month.month.slice(5)}月</span>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                            style={{
                              width: `${Math.min(100, (month.commission / Math.max(...stats.monthlyTrend.map(m => m.commission || 1))) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-24 text-right">
                        {formatCurrency(month.commission)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">暫無數據</p>
              )}
            </div>

            {/* Top Venues */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart size={18} />
                熱門店鋪 TOP 5
              </h2>
              {stats?.topVenues && stats.topVenues.length > 0 ? (
                <div className="space-y-3">
                  {stats.topVenues.map((venue, idx) => (
                    <div key={venue.venue_name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                          idx === 1 ? 'bg-gray-300 text-gray-700' :
                          idx === 2 ? 'bg-amber-400 text-amber-900' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-medium text-gray-900">{venue.venue_name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(venue.total_spend)}</p>
                        <p className="text-xs text-gray-400">{venue.booking_count} 筆</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">暫無數據</p>
              )}
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-xl border p-6 lg:col-span-2">
              <h2 className="font-bold text-gray-900 mb-4">訂單狀態分佈</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-600">{stats?.statusBreakdown.completed || 0}</p>
                  <p className="text-sm text-green-700 mt-1">已完成</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-600">{stats?.statusBreakdown.confirmed || 0}</p>
                  <p className="text-sm text-blue-700 mt-1">已確認</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <p className="text-3xl font-bold text-yellow-600">{stats?.statusBreakdown.pending || 0}</p>
                  <p className="text-sm text-yellow-700 mt-1">待處理</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-500">{stats?.statusBreakdown.cancelled || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">已取消</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 bg-white rounded-xl border p-6">
            <h2 className="font-bold text-gray-900 mb-4">累計統計</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500">總訂單數</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total.bookings || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">總佣金收入</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats?.total.commission || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">總銷售額</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(stats?.total.spend || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">推薦人數</p>
                <p className="text-2xl font-bold text-purple-600">{stats?.total.referrals || 0}</p>
              </div>
            </div>
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
