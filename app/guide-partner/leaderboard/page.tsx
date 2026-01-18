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
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Loader2,
  Headphones
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  level: string;
  total_commission: number;
  total_bookings: number;
  rank: number;
  isCurrentUser: boolean;
}

// 等级配置
const LEVEL_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  bronze: { label: '銅牌', color: 'text-amber-700', bgColor: 'bg-amber-100', borderColor: 'border-amber-300' },
  silver: { label: '銀牌', color: 'text-gray-500', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' },
  gold: { label: '金牌', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' },
  diamond: { label: '鑽石', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadLeaderboard();
  }, [timeRange]);

  const loadLeaderboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      // 獲取當前用戶的導遊信息
      const { data: currentGuide } = await supabase
        .from('guides')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!currentGuide) {
        router.push('/guide-partner/login');
        return;
      }

      // 獲取排行榜數據（按累計佣金排序）
      // 只顯示已通過審核的導遊
      const { data: guides, error } = await supabase
        .from('guides')
        .select('id, name, level, total_commission, total_bookings')
        .eq('status', 'approved')
        .order('total_commission', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading leaderboard:', error);
        return;
      }

      // 處理排行榜數據
      const leaderboardData: LeaderboardEntry[] = (guides || []).map((guide, index) => ({
        id: guide.id,
        name: maskName(guide.name),
        level: guide.level,
        total_commission: guide.total_commission || 0,
        total_bookings: guide.total_bookings || 0,
        rank: index + 1,
        isCurrentUser: guide.id === currentGuide.id,
      }));

      setLeaderboard(leaderboardData);

      // 找出當前用戶的排名
      const currentUserEntry = leaderboardData.find(entry => entry.isCurrentUser);
      setCurrentUserRank(currentUserEntry || null);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 姓名脫敏（只顯示姓氏 + *）
  const maskName = (name: string): string => {
    if (!name || name.length <= 1) return name || '匿名';
    return name.charAt(0) + '*'.repeat(name.length - 1);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner');
  };

  // 獲取排名圖標
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-amber-600" size={24} />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</span>;
    }
  };

  // 獲取排名樣式
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
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
    { icon: Wallet, label: '返金結算', href: '/guide-partner/commission' },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals' },
    { icon: Trophy, label: '排行榜', href: '/guide-partner/leaderboard', active: true },
    { icon: Headphones, label: '客服支援', href: '/guide-partner/support' },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">排行榜</span>
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
        <div className="p-6 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">合夥人排行榜</h1>
                <p className="text-gray-500">累計佣金排名</p>
              </div>
            </div>
          </div>

          {/* Current User Rank Card */}
          {currentUserRank && (
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">您的當前排名</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-5xl font-bold">#{currentUserRank.rank}</span>
                    <div className="text-left">
                      <p className="text-orange-100 text-sm">累計佣金</p>
                      <p className="text-2xl font-bold">¥{currentUserRank.total_commission.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${LEVEL_CONFIG[currentUserRank.level]?.bgColor || 'bg-white/20'}`}>
                    <Star size={14} className={LEVEL_CONFIG[currentUserRank.level]?.color || 'text-white'} />
                    <span className={`text-sm font-medium ${LEVEL_CONFIG[currentUserRank.level]?.color || 'text-white'}`}>
                      {LEVEL_CONFIG[currentUserRank.level]?.label || currentUserRank.level}
                    </span>
                  </div>
                  <p className="text-orange-100 text-sm mt-2">
                    {currentUserRank.total_bookings} 筆訂單
                  </p>
                </div>
              </div>
              {currentUserRank.rank > 1 && (
                <div className="mt-4 pt-4 border-t border-orange-400/30">
                  <p className="text-orange-100 text-sm flex items-center gap-2">
                    <TrendingUp size={16} />
                    距離上一名還差 ¥{(leaderboard[currentUserRank.rank - 2]?.total_commission - currentUserRank.total_commission).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard List */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" />
                佣金排行 TOP 50
              </h2>
            </div>

            <div className="divide-y">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-4 flex items-center gap-4 transition ${getRankStyle(entry.rank)} ${
                      entry.isCurrentUser ? 'ring-2 ring-orange-500 ring-inset' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-10 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Name & Level */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium truncate ${entry.isCurrentUser ? 'text-orange-600' : 'text-gray-900'}`}>
                          {entry.name}
                          {entry.isCurrentUser && <span className="ml-2 text-xs text-orange-500">(您)</span>}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          LEVEL_CONFIG[entry.level]?.bgColor || 'bg-gray-100'
                        } ${LEVEL_CONFIG[entry.level]?.color || 'text-gray-600'}`}>
                          {LEVEL_CONFIG[entry.level]?.label || entry.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {entry.total_bookings} 筆訂單
                      </p>
                    </div>

                    {/* Commission */}
                    <div className="text-right">
                      <p className={`font-bold ${entry.rank <= 3 ? 'text-lg' : ''} ${
                        entry.rank === 1 ? 'text-yellow-600' :
                        entry.rank === 2 ? 'text-gray-500' :
                        entry.rank === 3 ? 'text-amber-600' :
                        'text-gray-900'
                      }`}>
                        ¥{entry.total_commission.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暫無排行數據</p>
                  <p className="text-sm mt-2">開始預約賺取佣金，登上排行榜！</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>排行榜每日更新 · 僅顯示已通過審核的合夥人</p>
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
