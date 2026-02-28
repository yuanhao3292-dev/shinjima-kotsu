'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import {
  Store,
  Calendar,
  Wallet,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Copy,
  ChevronRight,
  Loader2,
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
  const [copied, setCopied] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();

    // 检测支付成功参数，轮询刷新直到状态更新
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upgrade') === 'success') {
      // 移除 URL 参数，避免刷新时重复检测
      window.history.replaceState({}, '', '/guide-partner/dashboard');

      // 每 2 秒刷新一次，最多 15 秒
      let attempts = 0;
      const maxAttempts = 8;
      const pollInterval = setInterval(async () => {
        attempts++;
        await loadDashboardData();

        // 检查是否已升级为金牌合伙人
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: guide } = await supabase
            .from('guides')
            .select('commission_tier_code')
            .eq('auth_user_id', user.id)
            .single();

          if (guide?.commission_tier_code === 'gold' || attempts >= maxAttempts) {
            clearInterval(pollInterval);
            if (guide?.commission_tier_code === 'gold') {
              // 显示成功消息
              alert('🎉 恭喜！您已成功升级为金牌合夥人！');
            }
          }
        }
      }, 2000);
    }
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
        .from('white_label_orders')
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

  const copyReferralCode = () => {
    if (guide?.referral_code) {
      navigator.clipboard.writeText(guide.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpgrade = async (planCode: 'growth' | 'partner') => {
    if (!guide?.id) return;

    // 金牌合伙人显示合约
    if (planCode === 'partner') {
      setShowContract(true);
      return;
    }

    // 初期合伙人直接创建订阅
    await createSubscription(planCode);
  };

  const confirmUpgrade = async () => {
    setShowContract(false);
    await createSubscription('partner');
  };

  const createSubscription = async (planCode: 'growth' | 'partner') => {
    if (!guide?.id) return;

    setUpgrading(true);
    try {
      const response = await fetch('/api/guide/upgrade-to-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId: guide.id,
          planCode,
          successUrl: `${window.location.origin}/guide-partner/dashboard?upgrade=success`,
          cancelUrl: `${window.location.origin}/guide-partner/dashboard?upgrade=cancelled`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建支付失败');
      }

      // 跳转到 Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      alert(err.message || '升级失败，请重试');
      setUpgrading(false);
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
      growth: 'bg-orange-100 text-orange-700 border-orange-300',
      gold: 'bg-yellow-100 text-yellow-700 border-yellow-400',
    };
    const labels: Record<string, string> = {
      growth: '初期合夥人',
      gold: '🥇 金牌合夥人',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[level] || styles.growth}`}>
        {labels[level] || labels.growth}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle="控制台" />

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
                  {guide && getLevelBadge(guide.commission_tier_code || 'growth')}
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

          {/* Commission Tier System - Two Tiers */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 mb-8">
            {/* Header with Current Level */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">報酬制度</h2>
                <p className="text-sm text-gray-500">升級金牌合夥人，享受更高報酬</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">您當前等級</p>
                <p className="text-lg font-bold text-orange-600">{(guide?.commission_tier_code || 'growth') === 'gold' ? '🥇 金牌合夥人' : '初期合夥人'}</p>
              </div>
            </div>

            {/* Gold Partner Highlight */}
            {(guide?.commission_tier_code || 'growth') === 'gold' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥇</span>
                  <div>
                    <p className="font-bold text-yellow-700">恭喜！您已是金牌合夥人</p>
                    <p className="text-sm text-yellow-600">享受 20% 固定報酬比例</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tier 1: Growth */}
              <div className={`bg-white rounded-xl p-5 border-2 transition-all ${!guide?.commission_tier_code || guide?.commission_tier_code === 'growth' ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-200 opacity-70'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🔰</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700">初期合夥人</h4>
                    <p className="text-xs text-gray-400">¥1,980/月</p>
                  </div>
                </div>
                <div className="text-center py-3 bg-orange-50 rounded-lg mb-3">
                  <p className="text-2xl font-bold text-orange-600">10%</p>
                  <p className="text-xs text-gray-500">固定報酬比例</p>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <p>夜總會 · 體檢 · 醫療 · 高爾夫</p>
                  <p>白標頁面基礎功能</p>
                  <p>標準客服支持</p>
                </div>
                {(!guide?.commission_tier_code || guide?.commission_tier_code === 'growth') && (
                  <div className="text-center text-xs text-gray-500 py-2">當前使用中</div>
                )}
              </div>

              {/* Tier 2: Gold */}
              <div className={`bg-white rounded-xl p-5 border-2 transition-all ${guide?.commission_tier_code === 'gold' ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🥇</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-700">金牌合夥人</h4>
                    <p className="text-xs text-gray-400">¥4,980/月 + ¥200,000 入場費</p>
                  </div>
                </div>
                <div className="text-center py-3 bg-yellow-50 rounded-lg mb-3">
                  <p className="text-2xl font-bold text-yellow-600">20%</p>
                  <p className="text-xs text-gray-500">固定報酬比例</p>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <p>夜總會 · 體檢 · 醫療 · 高爾夫</p>
                  <p>白標頁面完整功能 · 高級模板</p>
                  <p>專屬客服 · 優先資源對接</p>
                  <p>合夥人專屬群 · 合夥人證書</p>
                </div>
                {guide?.commission_tier_code === 'gold' ? (
                  <div className="text-center text-xs text-gray-500 py-2">當前使用中</div>
                ) : (
                  <button
                    onClick={() => handleUpgrade('partner')}
                    disabled={upgrading}
                    className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg text-sm font-bold hover:from-yellow-600 hover:to-amber-700 transition disabled:opacity-50"
                  >
                    {upgrading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '立即升級'}
                  </button>
                )}
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

        {/* 合约弹窗 */}
        {showContract && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">金牌合夥人入會合約</h2>

              <div className="prose prose-sm mb-6 text-gray-600 space-y-3">
                <h3 className="font-bold text-gray-900">一、會員費用</h3>
                <p>1. 入場費：¥200,000（一次性支付，終身有效）</p>
                <p>2. 月會費：¥4,980/月（自動續訂）</p>

                <h3 className="font-bold text-gray-900">二、分成比例</h3>
                <p>金牌合夥人享受固定 20% 分成比例（所有業務線）</p>

                <h3 className="font-bold text-gray-900">三、降級與重新入會</h3>
                <p className="text-red-600 font-medium">
                  ⚠️ 重要提示：若您停止續費月會費（¥4,980/月），您的金牌合夥人資格將自動失效，降級為初期合夥人（10%分成）。
                </p>
                <p className="text-red-600 font-medium">
                  若之後需要重新升級為金牌合夥人，需要重新支付 ¥200,000 入場費。
                </p>

                <h3 className="font-bold text-gray-900">四、權益說明</h3>
                <ul className="list-disc pl-5">
                  <li>優先資源對接</li>
                  <li>專屬客服通道</li>
                  <li>合夥人專屬群</li>
                  <li>合夥人證書</li>
                  <li>年度合夥人大會邀請</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowContract(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={confirmUpgrade}
                  disabled={upgrading}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-amber-700 disabled:opacity-50"
                >
                  {upgrading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : '同意並支付'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
