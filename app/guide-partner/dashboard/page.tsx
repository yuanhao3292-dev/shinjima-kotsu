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
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Loader2,
  Globe,
  Trophy,
  Headphones
} from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  phone: string;
  email: string;
  referral_code: string;
  status: string;
  level: string;
  commission_tier_code: string;
  total_bookings: number;
  total_commission: number;
  created_at: string;
}

interface Booking {
  id: string;
  customer_name: string;
  booking_date: string;
  status: string;
  actual_spend: number | null;
  commission_amount: number | null;
  venue: {
    name: string;
    city: string;
  } | null;
}

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalCommission: number;
  pendingCommission: number;
  referralCount: number;
  quarterlySpend: number; // 本季度实际销售额
}

export default function GuideDashboard() {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 獲取當前用戶
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      // 獲取導遊資訊
      const { data: guideData, error: guideError } = await supabase
        .from('guides')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (guideError || !guideData) {
        router.push('/guide-partner/login');
        return;
      }

      if (guideData.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      setGuide(guideData);

      // 獲取最近預約
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          id,
          customer_name,
          booking_date,
          status,
          actual_spend,
          commission_amount,
          venue:venues(name, city)
        `)
        .eq('guide_id', guideData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Transform venue from array to object (Supabase returns array for single relations)
      const transformedBookings = (bookings || []).map(b => ({
        ...b,
        venue: Array.isArray(b.venue) ? b.venue[0] : b.venue
      })) as Booking[];
      setRecentBookings(transformedBookings);

      // 計算統計數據
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('status, commission_amount, commission_status, actual_spend, created_at')
        .eq('guide_id', guideData.id);

      const { count: referralCount } = await supabase
        .from('guides')
        .select('id', { count: 'exact' })
        .eq('referrer_id', guideData.id);

      // 計算本季度銷售額（從 whitelabel_orders 和 bookings 表）
      const now = new Date();
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const quarterStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
      const quarterStartISO = quarterStart.toISOString();

      // 從 whitelabel_orders 獲取本季度已完成訂單金額
      const { data: wlOrders } = await supabase
        .from('whitelabel_orders')
        .select('order_amount')
        .eq('guide_id', guideData.id)
        .eq('status', 'completed')
        .gte('created_at', quarterStartISO);

      // 從 bookings 獲取本季度已完成預約的實際消費
      const quarterlyBookingsSpend = (allBookings || [])
        .filter(b => b.status === 'completed' && b.created_at && new Date(b.created_at) >= quarterStart)
        .reduce((sum, b) => sum + (b.actual_spend || 0), 0);

      // 計算總季度銷售額
      const quarterlyWLSpend = (wlOrders || []).reduce((sum, o) => sum + (Number(o.order_amount) || 0), 0);
      const quarterlySpend = quarterlyWLSpend + quarterlyBookingsSpend;

      const statsData: Stats = {
        totalBookings: allBookings?.length || 0,
        pendingBookings: allBookings?.filter(b => b.status === 'pending' || b.status === 'confirmed').length || 0,
        completedBookings: allBookings?.filter(b => b.status === 'completed').length || 0,
        totalCommission: guideData.total_commission || 0,
        pendingCommission: allBookings?.filter(b => b.commission_status === 'calculated').reduce((sum, b) => sum + (b.commission_amount || 0), 0) || 0,
        referralCount: referralCount || 0,
        quarterlySpend,
      };

      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner');
  };

  const copyReferralCode = () => {
    if (guide?.referral_code) {
      navigator.clipboard.writeText(guide.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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

  const getLevelBadge = (level: string) => {
    const styles: Record<string, string> = {
      bronze: 'bg-gray-100 text-gray-700 border-gray-300',
      silver: 'bg-blue-100 text-blue-700 border-blue-300',
      gold: 'bg-yellow-100 text-yellow-700 border-yellow-400',
      diamond: 'bg-purple-100 text-purple-700 border-purple-400',
    };
    const labels: Record<string, string> = {
      bronze: '🥉 銅牌',
      silver: '🥈 銀牌',
      gold: '🥇 金牌',
      diamond: '💎 鑽石',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[level] || styles.bronze}`}>
        {labels[level] || labels.bronze}
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
    { icon: LayoutDashboard, label: '控制台', href: '/guide-partner/dashboard', active: true },
    { icon: Store, label: '店舖列表', href: '/guide-partner/venues' },
    { icon: Calendar, label: '我的預約', href: '/guide-partner/bookings' },
    { icon: Wallet, label: '報酬結算', href: '/guide-partner/commission' },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals' },
    { icon: Trophy, label: '排行榜', href: '/guide-partner/leaderboard' },
    { icon: Globe, label: '白標頁面', href: '/guide-partner/whitelabel', highlight: true },
    { icon: Headphones, label: '客服支援', href: '/guide-partner/support' },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">導遊後台</span>
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
                  : (item as any).highlight
                    ? 'text-blue-600 hover:bg-blue-50 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {(item as any).highlight && (
                <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">NEW</span>
              )}
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">歡迎回來，{guide?.name}</h1>
            <p className="text-gray-500 mt-1">查看您的業務概況</p>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold">{guide?.name}</span>
                  {guide && getLevelBadge(guide.commission_tier_code || 'bronze')}
                </div>
                <p className="text-orange-100">手機: {guide?.phone}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <p className="text-xs text-orange-100 mb-1">您的推薦碼</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold tracking-wider">{guide?.referral_code}</span>
                  <button
                    onClick={copyReferralCode}
                    className="p-1 hover:bg-white/20 rounded transition"
                    title="複製"
                  >
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
              <p className="text-sm text-gray-500">總預約數</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingBookings || 0}</p>
              <p className="text-sm text-gray-500">待完成</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(stats?.totalCommission || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">累計報酬</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.referralCount || 0}</p>
              <p className="text-sm text-gray-500">推薦導遊</p>
            </div>
          </div>

          {/* Commission Tier System - Enhanced with Progress Bar */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 mb-8">
            {/* Header with Current Level */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">階梯報酬制度</h2>
                <p className="text-sm text-gray-500">季度銷售額越高，報酬比例越高</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">您當前等級</p>
                <p className="text-lg font-bold text-orange-600">{(guide?.commission_tier_code || 'bronze') === 'diamond' ? '💎 鑽石' : (guide?.commission_tier_code || 'bronze') === 'gold' ? '🥇 金牌' : (guide?.commission_tier_code || 'bronze') === 'silver' ? '🥈 銀牌' : '🥉 銅牌'}</p>
              </div>
            </div>

            {/* Progress to Next Tier */}
            {(() => {
              const currentLevel = guide?.commission_tier_code || 'bronze';
              // 使用真实的季度销售额数据
              const quarterlySpend = stats?.quarterlySpend || 0;
              const tiers = [
                { level: 'bronze', min: 0, max: 1000000, next: '銀牌', color: 'gray' },
                { level: 'silver', min: 1000000, max: 3000000, next: '金牌', color: 'blue' },
                { level: 'gold', min: 3000000, max: 5000000, next: '鑽石', color: 'yellow' },
                { level: 'diamond', min: 5000000, max: 10000000, next: null, color: 'purple' },
              ];
              const currentTier = tiers.find(t => t.level === currentLevel) || tiers[0];
              const progress = currentTier.next
                ? Math.min(100, ((quarterlySpend - currentTier.min) / (currentTier.max - currentTier.min)) * 100)
                : 100;
              const remaining = Math.max(0, currentTier.max - quarterlySpend);

              return currentTier.next ? (
                <div className="mb-6 p-4 bg-white rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">升級進度</span>
                    <span className="text-sm text-orange-600 font-bold">
                      距離 {currentTier.next} 還差 ¥{remaining.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, progress)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>¥{currentTier.min.toLocaleString()}</span>
                    <span>本季度: ¥{quarterlySpend.toLocaleString()}</span>
                    <span>¥{currentTier.max.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="font-bold text-purple-700">恭喜！您已達到最高等級</p>
                      <p className="text-sm text-purple-600">享受 20% 最高報酬比例</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Tier Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Tier 1: Bronze */}
              <div className={`bg-white rounded-xl p-4 border-2 transition-all ${!guide?.commission_tier_code || guide?.commission_tier_code === 'bronze' ? 'border-orange-400 ring-2 ring-orange-100 scale-[1.02]' : 'border-gray-200 opacity-70'}`}>
                <div className="text-center mb-2">
                  <span className="text-2xl">🥉</span>
                  <h4 className="font-bold text-gray-700 text-sm">銅牌</h4>
                  <p className="text-[10px] text-gray-400">入門級別</p>
                </div>
                <div className="text-center py-2 bg-gray-50 rounded-lg mb-2">
                  <p className="text-xl font-bold text-gray-900">10%</p>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <p>夜總會 · 體檢 · 醫療</p>
                  <p className="font-medium">統一 10% 報酬</p>
                </div>
              </div>

              {/* Tier 2: Silver */}
              <div className={`bg-white rounded-xl p-4 border-2 transition-all ${guide?.commission_tier_code === 'silver' ? 'border-blue-400 ring-2 ring-blue-100 scale-[1.02]' : 'border-gray-200 opacity-70'}`}>
                <div className="text-center mb-2">
                  <span className="text-2xl">🥈</span>
                  <h4 className="font-bold text-blue-700 text-sm">銀牌</h4>
                  <p className="text-[10px] text-gray-400">季度 ≥100萬</p>
                </div>
                <div className="text-center py-2 bg-blue-50 rounded-lg mb-2">
                  <p className="text-xl font-bold text-blue-600">12%</p>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <p>夜總會 · 體檢 · 醫療</p>
                  <p className="font-medium">統一 12% 報酬</p>
                </div>
              </div>

              {/* Tier 3: Gold */}
              <div className={`bg-white rounded-xl p-4 border-2 transition-all ${guide?.commission_tier_code === 'gold' ? 'border-yellow-400 ring-2 ring-yellow-100 scale-[1.02]' : 'border-gray-200 opacity-70'}`}>
                <div className="text-center mb-2">
                  <span className="text-2xl">🥇</span>
                  <h4 className="font-bold text-yellow-700 text-sm">金牌</h4>
                  <p className="text-[10px] text-gray-400">季度 ≥300萬</p>
                </div>
                <div className="text-center py-2 bg-yellow-50 rounded-lg mb-2">
                  <p className="text-xl font-bold text-yellow-600">15%</p>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <p>夜總會 · 體檢 · 醫療</p>
                  <p className="font-medium">統一 15% 報酬</p>
                </div>
              </div>

              {/* Tier 4: Diamond */}
              <div className={`bg-white rounded-xl p-4 border-2 transition-all ${guide?.commission_tier_code === 'diamond' ? 'border-purple-400 ring-2 ring-purple-100 scale-[1.02]' : 'border-gray-200 opacity-70'}`}>
                <div className="text-center mb-2">
                  <span className="text-2xl">💎</span>
                  <h4 className="font-bold text-purple-700 text-sm">鑽石</h4>
                  <p className="text-[10px] text-gray-400">季度 ≥500萬</p>
                </div>
                <div className="text-center py-2 bg-purple-50 rounded-lg mb-2">
                  <p className="text-xl font-bold text-purple-600">20%</p>
                </div>
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <p>夜總會 · 體檢 · 醫療</p>
                  <p className="font-medium">統一 20% 報酬</p>
                </div>
              </div>
            </div>

            {/* Referral Bonus Highlight */}
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-800 text-sm">🎁 推薦獎勵</h4>
                  <p className="text-xs text-green-600">成功推薦新導遊加入，您將獲得其每筆訂單報酬的 <span className="font-bold">2%</span> 作為額外獎勵</p>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-[10px] text-gray-400">
                💡 等級每季度初根據上季度銷售額自動調整 · 新季度保留上季度等級至首筆訂單
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/guide-partner/venues"
              className="bg-white rounded-xl p-6 border hover:border-orange-300 hover:shadow-lg transition group"
            >
              <Store className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">瀏覽店舖</h3>
              <p className="text-sm text-gray-500 mb-3">查看 160+ 高端夜總會</p>
              <span className="text-orange-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                立即查看 <ChevronRight size={16} />
              </span>
            </Link>

            <Link
              href="/guide-partner/bookings/new"
              className="bg-white rounded-xl p-6 border hover:border-orange-300 hover:shadow-lg transition group"
            >
              <Calendar className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">新建預約</h3>
              <p className="text-sm text-gray-500 mb-3">為客戶預約夜總會</p>
              <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                立即預約 <ChevronRight size={16} />
              </span>
            </Link>

            <Link
              href="/guide-partner/commission"
              className="bg-white rounded-xl p-6 border hover:border-orange-300 hover:shadow-lg transition group"
            >
              <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">報酬結算</h3>
              <p className="text-sm text-gray-500 mb-3">
                {stats?.pendingCommission ? `¥${stats.pendingCommission.toLocaleString()} 待結算` : '查看結算記錄'}
              </p>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                查看詳情 <ChevronRight size={16} />
              </span>
            </Link>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-900">最近預約</h2>
              <Link href="/guide-partner/bookings" className="text-orange-600 text-sm font-medium hover:underline">
                查看全部
              </Link>
            </div>

            {recentBookings.length > 0 ? (
              <div className="divide-y">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer_name}</p>
                      <p className="text-sm text-gray-500">
                        {booking.venue?.name} · {booking.venue?.city}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{booking.booking_date}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
                      {booking.commission_amount && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          +¥{booking.commission_amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>暫無預約記錄</p>
                <Link
                  href="/guide-partner/venues"
                  className="inline-block mt-4 text-orange-600 font-medium hover:underline"
                >
                  瀏覽店舖並創建預約
                </Link>
              </div>
            )}
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
