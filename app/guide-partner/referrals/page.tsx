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
  Copy,
  CheckCircle2,
  Share2,
  QrCode,
  Loader2,
  UserPlus,
  Clock,
  Gift
} from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  referral_code: string;
}

interface Referral {
  id: string;
  name: string;
  status: string;
  level: string;
  total_bookings: number;
  total_commission: number;
  created_at: string;
}

interface ReferralReward {
  id: string;
  reward_amount: number;
  reward_rate: number;
  reward_type: string;
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

export default function ReferralsPage() {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: guideData } = await supabase
        .from('guides')
        .select('id, name, referral_code, status')
        .eq('auth_user_id', user.id)
        .single();

      if (!guideData || guideData.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      setGuide(guideData);

      // 載入被推薦的導遊
      const { data: referralsData } = await supabase
        .from('guides')
        .select('id, name, status, level, total_bookings, total_commission, created_at')
        .eq('referrer_id', guideData.id)
        .order('created_at', { ascending: false });

      setReferrals(referralsData || []);

      // 載入推薦獎勵記錄
      const { data: rewardsData } = await supabase
        .from('referral_rewards')
        .select(`
          id,
          reward_amount,
          reward_rate,
          reward_type,
          status,
          created_at,
          referee:guides!referral_rewards_referee_id_fkey(name),
          booking:bookings(customer_name, venue:venues(name))
        `)
        .eq('referrer_id', guideData.id)
        .order('created_at', { ascending: false })
        .limit(50);

      // Transform referee and booking from array to object (including nested venue)
      const transformedRewards = (rewardsData || []).map(r => {
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
      setRewards(transformedRewards);
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

  const copyReferralCode = () => {
    if (guide?.referral_code) {
      navigator.clipboard.writeText(guide.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyReferralLink = () => {
    if (guide?.referral_code) {
      const link = `${window.location.origin}/guide-partner/register?ref=${guide.referral_code}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      suspended: 'bg-gray-100 text-gray-700',
    };
    const labels: Record<string, string> = {
      pending: '審核中',
      approved: '已通過',
      rejected: '未通過',
      suspended: '已暫停',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const styles: Record<string, string> = {
      bronze: 'text-amber-600',
      silver: 'text-gray-500',
      gold: 'text-yellow-500',
      black: 'text-black',
    };
    const labels: Record<string, string> = {
      bronze: '青銅',
      silver: '白銀',
      gold: '黃金',
      black: '黑金',
    };
    return (
      <span className={`text-xs font-medium ${styles[level] || styles.bronze}`}>
        {labels[level] || level}
      </span>
    );
  };

  const totalRewards = rewards
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + (r.reward_amount || 0), 0);

  const pendingRewards = rewards
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + (r.reward_amount || 0), 0);

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
    { icon: Wallet, label: '報酬結算', href: '/guide-partner/commission' },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals', active: true },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">我的推薦</span>
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
            <h1 className="text-2xl font-bold text-gray-900">我的推薦</h1>
            <p className="text-gray-500 mt-1">邀請新導遊加入，獲得額外獎勵</p>
          </div>

          {/* Referral Code Card */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-lg font-medium opacity-90 mb-2">您的專屬推薦碼</h2>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl font-bold tracking-wider">{guide?.referral_code}</span>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                    title="複製推薦碼"
                  >
                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyReferralLink}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition"
                >
                  <Share2 size={18} />
                  複製邀請連結
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-80">
                分享您的推薦碼給其他導遊，他們註冊時填寫您的推薦碼，即可成為您的下線。
                您可以從他們的業績中獲得額外 2% 的獎勵！
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} className="text-purple-500" />
                <span className="text-sm text-gray-500">推薦人數</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{referrals.length}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-sm text-gray-500">已通過</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {referrals.filter(r => r.status === 'approved').length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={20} className="text-orange-500" />
                <span className="text-sm text-gray-500">累計獎勵</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{totalRewards.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-500" />
                <span className="text-sm text-gray-500">待結算</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{pendingRewards.toLocaleString()}</p>
            </div>
          </div>

          {/* Referral List */}
          <div className="bg-white rounded-xl border mb-8">
            <div className="p-4 border-b">
              <h2 className="font-bold text-gray-900">已推薦導遊</h2>
            </div>

            {referrals.length > 0 ? (
              <div className="divide-y">
                {referrals.map((referral) => (
                  <div key={referral.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">
                          {referral.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{referral.name}</p>
                          {getStatusBadge(referral.status)}
                        </div>
                        <p className="text-xs text-gray-400">
                          加入於 {new Date(referral.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {referral.status === 'approved' && (
                        <>
                          <p className="text-sm text-gray-500">
                            {referral.total_bookings} 筆預約
                          </p>
                          <p className="text-xs text-gray-400">
                            {getLevelBadge(referral.level)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>您還沒有推薦過導遊</p>
                <p className="text-sm mt-2">分享您的推薦碼開始邀請吧</p>
              </div>
            )}
          </div>

          {/* Rewards History */}
          <div className="bg-white rounded-xl border mb-8">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900">獎勵明細</h2>
                {pendingRewards > 0 && (
                  <span className="text-sm text-yellow-600 font-medium">
                    待結算 ¥{pendingRewards.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {rewards.length > 0 ? (
              <div className="divide-y">
                {rewards.map((reward) => (
                  <div key={reward.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        reward.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <Gift size={20} className={
                          reward.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                        } />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {reward.referee?.name || '未知導遊'} 的業績獎勵
                        </p>
                        {reward.booking && (
                          <p className="text-sm text-gray-500">
                            客戶: {reward.booking.customer_name}
                            {reward.booking.venue && ` · ${reward.booking.venue.name}`}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {new Date(reward.created_at).toLocaleDateString('zh-TW')}
                          {reward.reward_rate && ` · 獎勵率 ${(reward.reward_rate * 100).toFixed(0)}%`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reward.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {reward.status === 'paid' ? '已結算' : '待結算'}
                      </span>
                      <p className={`font-bold mt-1 ${
                        reward.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        +¥{reward.reward_amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>暫無獎勵記錄</p>
                <p className="text-sm mt-2">當您推薦的導遊完成訂單後，獎勵將自動生成</p>
              </div>
            )}
          </div>

          {/* Reward Rules */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-purple-800 mb-4">推薦獎勵規則</h3>
            <div className="space-y-3 text-sm text-purple-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                <p>被推薦導遊成功通過審核後，開始計算獎勵</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                <p>您可獲得被推薦導遊每筆訂單報酬的 2% 作為獎勵</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                <p>獎勵與報酬一起按月結算</p>
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
