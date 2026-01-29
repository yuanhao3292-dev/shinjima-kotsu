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
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Download,
  Filter,
  Gift,
  Headphones
} from 'lucide-react';

interface Settlement {
  id: string;
  settlement_month: string;
  total_bookings: number;
  total_spend: number;
  total_commission: number;
  status: string;
  payment_method: string | null;
  paid_at: string | null;
}

interface CommissionRecord {
  id: string;
  customer_name: string;
  booking_date: string;
  actual_spend: number;
  commission_amount: number;
  commission_status: string;
  venue: {
    name: string;
    city: string;
  } | null;
}

// 白标订单佣金记录（包含新客奖励信息）
interface WhitelabelCommission {
  id: string;
  order_type: string;
  order_amount: number;
  commission_rate: number;
  applied_commission_rate: number;
  commission_amount: number;
  commission_status: string;
  commission_available_at: string | null;
  created_at: string;
  metadata: {
    new_customer_bonus?: boolean;
    bonus_rate?: number;
    bonus_amount?: number;
    base_commission?: number;
  } | null;
}

// 推薦獎勵記錄
interface ReferralReward {
  id: string;
  referee_id: string;
  booking_id: string | null;
  reward_type: string;
  reward_rate: number;
  reward_amount: number;
  status: string;
  created_at: string;
  referee: {
    name: string;
  } | null;
  booking: {
    customer_name: string;
    venue: {
      name: string;
    } | null;
  } | null;
}

interface Stats {
  totalEarned: number;
  pendingAmount: number;
  thisMonthAmount: number;
  lastMonthAmount: number;
  referralPending: number; // 新增：待結算的推薦獎勵
  referralTotal: number;   // 新增：累計推薦獎勵
}

export default function CommissionPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [recentCommissions, setRecentCommissions] = useState<CommissionRecord[]>([]);
  const [whitelabelCommissions, setWhitelabelCommissions] = useState<WhitelabelCommission[]>([]);
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'whitelabel' | 'referrals' | 'history'>('overview');
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [tierName, setTierName] = useState<string>('銅牌合夥人');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadCommissionData();
  }, []);

  const loadCommissionData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: guide } = await supabase
        .from('guides')
        .select(`
          id,
          status,
          total_commission,
          commission_tier_code,
          commission_tiers(commission_rate, tier_name_zh)
        `)
        .eq('auth_user_id', user.id)
        .single();

      if (!guide || guide.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      // 設置導遊的佣金等級信息
      const tierData = Array.isArray(guide.commission_tiers)
        ? guide.commission_tiers[0]
        : guide.commission_tiers;
      if (tierData) {
        setCommissionRate(tierData.commission_rate || 10);
        setTierName(tierData.tier_name_zh || '銅牌合夥人');
      }

      // 載入結算記錄
      const { data: settlementsData } = await supabase
        .from('commission_settlements')
        .select('*')
        .eq('guide_id', guide.id)
        .order('settlement_month', { ascending: false });

      setSettlements(settlementsData || []);

      // 載入最近的報酬記錄
      const { data: commissionsData } = await supabase
        .from('bookings')
        .select(`
          id,
          customer_name,
          booking_date,
          actual_spend,
          commission_amount,
          commission_status,
          venue:venues(name, city)
        `)
        .eq('guide_id', guide.id)
        .not('commission_amount', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(10);

      // Transform venue from array to object (Supabase returns array for single relations)
      const transformedCommissions = (commissionsData || []).map(c => ({
        ...c,
        venue: Array.isArray(c.venue) ? c.venue[0] : c.venue
      })) as CommissionRecord[];
      setRecentCommissions(transformedCommissions);

      // 載入白標訂單佣金記錄（包含新客獎勵）
      const { data: wlCommissions } = await supabase
        .from('whitelabel_orders')
        .select('*')
        .eq('guide_id', guide.id)
        .order('created_at', { ascending: false })
        .limit(20);

      setWhitelabelCommissions((wlCommissions || []) as WhitelabelCommission[]);

      // 載入推薦獎勵記錄
      const { data: rewards } = await supabase
        .from('referral_rewards')
        .select(`
          id,
          referee_id,
          booking_id,
          reward_type,
          reward_rate,
          reward_amount,
          status,
          created_at,
          referee:guides!referral_rewards_referee_id_fkey(name),
          booking:bookings(customer_name, venue:venues(name))
        `)
        .eq('referrer_id', guide.id)
        .order('created_at', { ascending: false })
        .limit(50);

      // Transform referee and booking from array to object (including nested venue)
      const transformedRewards = (rewards || []).map(r => {
        const booking = Array.isArray(r.booking) ? r.booking[0] : r.booking;
        return {
          ...r,
          referee: Array.isArray(r.referee) ? r.referee[0] : r.referee,
          booking: booking ? {
            ...booking,
            venue: Array.isArray(booking.venue) ? booking.venue[0] : booking.venue
          } : null
        };
      }) as ReferralReward[];
      setReferralRewards(transformedRewards);

      // 計算統計數據
      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

      const thisMonthSettlement = settlementsData?.find(s => s.settlement_month === thisMonth);
      const lastMonthSettlement = settlementsData?.find(s => s.settlement_month === lastMonthStr);

      // 計算待結算金額（已計算但未支付）
      const { data: pendingBookings } = await supabase
        .from('bookings')
        .select('commission_amount')
        .eq('guide_id', guide.id)
        .eq('commission_status', 'calculated');

      const pendingAmount = pendingBookings?.reduce((sum, b) => sum + (b.commission_amount || 0), 0) || 0;

      // 計算推薦獎勵統計
      const referralPending = transformedRewards
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + (r.reward_amount || 0), 0);
      const referralTotal = transformedRewards
        .reduce((sum, r) => sum + (r.reward_amount || 0), 0);

      setStats({
        totalEarned: guide.total_commission || 0,
        pendingAmount: pendingAmount + referralPending, // 包含推薦獎勵
        thisMonthAmount: thisMonthSettlement?.total_commission || 0,
        lastMonthAmount: lastMonthSettlement?.total_commission || 0,
        referralPending,
        referralTotal,
      });
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

  const getSettlementStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
    };
    const labels: Record<string, string> = {
      pending: '統計中',
      confirmed: '待付款',
      paid: '已結算',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getCommissionStatusBadge = (status: string, availableAt?: string | null) => {
    const styles: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-600',
      calculated: 'bg-yellow-100 text-yellow-700',
      available: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
    };
    const labels: Record<string, string> = {
      pending: '待計算',
      calculated: '鎖定中',
      available: '可提現',
      paid: '已結算',
    };

    // 对于 calculated 状态，显示解锁日期
    if (status === 'calculated' && availableAt) {
      const unlockDate = new Date(availableAt);
      const now = new Date();
      const daysLeft = Math.max(0, Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      return (
        <div className="text-right">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.calculated}`}>
            {labels.calculated}
          </span>
          {daysLeft > 0 && (
            <p className="text-xs text-yellow-600 mt-1">
              {daysLeft}天後可提現
            </p>
          )}
        </div>
      );
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${year}年${parseInt(month)}月`;
  };

  // 導出 CSV 功能
  const exportToCSV = () => {
    const orderTypeLabels: Record<string, string> = {
      medical: '醫療體檢',
      golf: '高爾夫',
      business: '商務考察',
    };
    const statusLabels: Record<string, string> = {
      pending: '待計算',
      calculated: '待結算',
      paid: '已結算',
    };

    // 準備 CSV 數據
    const headers = ['日期', '類型', '訂單金額', '佣金率', '佣金金額', '新客獎勵', '狀態'];
    const rows = whitelabelCommissions.map(record => {
      const hasBonus = record.metadata?.new_customer_bonus;
      return [
        new Date(record.created_at).toLocaleDateString('zh-TW'),
        orderTypeLabels[record.order_type] || record.order_type,
        record.order_amount,
        `${record.applied_commission_rate}%`,
        record.commission_amount,
        hasBonus ? `+¥${record.metadata?.bonus_amount || 0}` : '-',
        statusLabels[record.commission_status] || record.commission_status,
      ];
    });

    // 生成 CSV 內容（添加 BOM 以支持中文）
    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // 下載文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `佣金報表_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    { icon: Calendar, label: '我的預約', href: '/guide-partner/bookings' },
    { icon: Wallet, label: '報酬結算', href: '/guide-partner/commission', active: true },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals' },
    { icon: Headphones, label: '客服支援', href: '/guide-partner/support' },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">報酬結算</span>
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">報酬結算</h1>
            <p className="text-gray-500 mt-1">查看您的報酬收入和結算記錄</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={20} />
                <span className="text-sm opacity-90">累計收入</span>
              </div>
              <p className="text-3xl font-bold">¥{(stats?.totalEarned || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-500" />
                <span className="text-sm text-gray-500">待結算</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(stats?.pendingAmount || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-blue-500" />
                <span className="text-sm text-gray-500">本月</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(stats?.thisMonthAmount || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">上月</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(stats?.lastMonthAmount || 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Commission Rate Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{commissionRate}%</span>
              </div>
              <div>
                <h3 className="font-bold text-orange-800">報酬計算方式 · {tierName}</h3>
                <p className="text-sm text-orange-700 mt-1">
                  報酬 = 客戶消費金額 ÷ 1.1（扣除10%消費稅）× {commissionRate}%
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  例：客戶消費 100 萬日元 → 報酬約 ¥{Math.round(1000000 / 1.1 * commissionRate / 100).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* 新客首單獎勵說明 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Gift size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-purple-800">新客首單獎勵 +5%</h3>
                <p className="text-sm text-purple-700 mt-1">
                  每位新客戶的首筆訂單，您將額外獲得 5% 的獎勵佣金！
                </p>
                <p className="text-xs text-purple-600 mt-2">
                  例：{tierName} ({commissionRate}%) + 新客獎勵 (5%) = 總佣金率 {commissionRate + 5}%
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              店舖報酬
            </button>
            <button
              onClick={() => setActiveTab('whitelabel')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'whitelabel'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              白標訂單
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'referrals'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              推薦獎勵
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'history'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              月度結算
            </button>
          </div>

          {/* Content */}
          {activeTab === 'overview' ? (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-900">店舖報酬記錄</h2>
              </div>

              {recentCommissions.length > 0 ? (
                <div className="divide-y">
                  {recentCommissions.map((record) => (
                    <div key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{record.customer_name}</p>
                        <p className="text-sm text-gray-500">
                          {record.venue?.name} · {record.venue?.city}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{record.booking_date}</p>
                      </div>
                      <div className="text-right">
                        {getCommissionStatusBadge(record.commission_status)}
                        <p className="font-bold text-green-600 mt-1">
                          +¥{record.commission_amount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          消費 ¥{record.actual_spend?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暫無報酬記錄</p>
                  <Link
                    href="/guide-partner/venues"
                    className="inline-block mt-4 text-orange-600 font-medium hover:underline"
                  >
                    開始預約賺取報酬
                  </Link>
                </div>
              )}
            </div>
          ) : activeTab === 'whitelabel' ? (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">白標訂單佣金</h2>
                  <p className="text-sm text-gray-500 mt-1">透過您專屬連結下單的客戶</p>
                </div>
                {whitelabelCommissions.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition"
                  >
                    <Download size={16} />
                    導出CSV
                  </button>
                )}
              </div>

              {whitelabelCommissions.length > 0 ? (
                <div className="divide-y">
                  {whitelabelCommissions.map((record) => {
                    const hasBonus = record.metadata?.new_customer_bonus;
                    const orderTypeLabels: Record<string, string> = {
                      medical: '醫療體檢',
                      golf: '高爾夫',
                      business: '商務考察',
                    };
                    return (
                      <div key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {orderTypeLabels[record.order_type] || record.order_type}
                            </p>
                            {hasBonus && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full">
                                <Gift size={12} />
                                新客獎勵
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            訂單金額 ¥{record.order_amount?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(record.created_at).toLocaleDateString('zh-TW')}
                          </p>
                        </div>
                        <div className="text-right">
                          {getCommissionStatusBadge(record.commission_status, record.commission_available_at)}
                          <p className="font-bold text-green-600 mt-1">
                            +¥{record.commission_amount?.toLocaleString()}
                          </p>
                          {hasBonus && record.metadata ? (
                            <div className="text-xs text-gray-500 mt-1">
                              <span>基礎 ¥{record.metadata.base_commission?.toLocaleString()}</span>
                              <span className="text-purple-600 ml-1">
                                + 獎勵 ¥{record.metadata.bonus_amount?.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">
                              佣金率 {record.applied_commission_rate}%
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暫無白標訂單</p>
                  <Link
                    href="/guide-partner/whitelabel"
                    className="inline-block mt-4 text-orange-600 font-medium hover:underline"
                  >
                    設置白標網站開始推廣
                  </Link>
                </div>
              )}
            </div>
          ) : activeTab === 'referrals' ? (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">推薦獎勵記錄</h2>
                    <p className="text-sm text-gray-500 mt-1">您推薦的導遊業績帶來的 2% 額外獎勵</p>
                  </div>
                  {stats && stats.referralPending > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">待結算獎勵</p>
                      <p className="text-lg font-bold text-yellow-600">
                        ¥{stats.referralPending.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {referralRewards.length > 0 ? (
                <div className="divide-y">
                  {referralRewards.map((reward) => (
                    <div key={reward.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {reward.referee?.name || '未知導遊'} 的業績
                          </p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                            <Users size={12} />
                            下線獎勵
                          </span>
                        </div>
                        {reward.booking && (
                          <p className="text-sm text-gray-500">
                            客戶: {reward.booking.customer_name}
                            {reward.booking.venue && ` · ${reward.booking.venue.name}`}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(reward.created_at).toLocaleDateString('zh-TW')}
                        </p>
                      </div>
                      <div className="text-right">
                        {getCommissionStatusBadge(reward.status)}
                        <p className="font-bold text-green-600 mt-1">
                          +¥{reward.reward_amount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          獎勵率 {(reward.reward_rate * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暫無推薦獎勵</p>
                  <p className="text-sm mt-2 text-gray-400">
                    當您推薦的導遊完成訂單後，您將獲得其業績 2% 的額外獎勵
                  </p>
                  <Link
                    href="/guide-partner/referrals"
                    className="inline-block mt-4 text-orange-600 font-medium hover:underline"
                  >
                    查看我的推薦碼
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-900">月度結算記錄</h2>
              </div>

              {settlements.length > 0 ? (
                <div className="divide-y">
                  {settlements.map((settlement) => (
                    <div key={settlement.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{formatMonth(settlement.settlement_month)}</p>
                        <p className="text-sm text-gray-500">
                          {settlement.total_bookings} 筆訂單 · 總消費 ¥{settlement.total_spend?.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {getSettlementStatusBadge(settlement.status)}
                        <p className="font-bold text-green-600 mt-1">
                          ¥{settlement.total_commission?.toLocaleString()}
                        </p>
                        {settlement.paid_at && (
                          <p className="text-xs text-gray-400">
                            {new Date(settlement.paid_at).toLocaleDateString()} 已付款
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暫無結算記錄</p>
                  <p className="text-sm mt-2">每月初統計上月報酬</p>
                </div>
              )}
            </div>
          )}

          {/* Settlement Info */}
          <div className="mt-8 bg-gray-100 rounded-xl p-4">
            <h3 className="font-medium text-gray-700 mb-2">結算說明</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 白標訂單佣金在客人完成服務後 <strong>2 週</strong>即可申請提現</li>
              <li>• 店舖報酬每月 1-5 日統計上月已完成訂單</li>
              <li>• 提現通過銀行轉帳支付，1-3 個工作日到帳</li>
              <li>• 如有疑問請聯繫客服核實</li>
            </ul>
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
