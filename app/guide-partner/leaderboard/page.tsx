'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Loader2,
} from 'lucide-react';

const translations = {
  pageTitle: {
    ja: 'ランキング',
    'zh-CN': '排行榜',
    'zh-TW': '排行榜',
    en: 'Leaderboard',
  },
  heading: {
    ja: 'パートナーランキング',
    'zh-CN': '合伙人排行榜',
    'zh-TW': '合夥人排行榜',
    en: 'Partner Leaderboard',
  },
  subtitle: {
    ja: '累計コミッションランキング',
    'zh-CN': '累计佣金排名',
    'zh-TW': '累計佣金排名',
    en: 'Ranked by Total Commission',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  yourCurrentRank: {
    ja: 'あなたの現在の順位',
    'zh-CN': '您的当前排名',
    'zh-TW': '您的當前排名',
    en: 'Your Current Rank',
  },
  totalCommission: {
    ja: '累計コミッション',
    'zh-CN': '累计佣金',
    'zh-TW': '累計佣金',
    en: 'Total Commission',
  },
  ordersCount: {
    ja: '件の注文',
    'zh-CN': ' 笔订单',
    'zh-TW': ' 筆訂單',
    en: ' orders',
  },
  gapToNext: {
    ja: '次の順位まであと',
    'zh-CN': '距离上一名还差',
    'zh-TW': '距離上一名還差',
    en: 'Gap to next rank: ',
  },
  leaderboardTitle: {
    ja: 'コミッションランキング TOP 50',
    'zh-CN': '佣金排行 TOP 50',
    'zh-TW': '佣金排行 TOP 50',
    en: 'Commission Ranking TOP 50',
  },
  noData: {
    ja: 'ランキングデータがありません',
    'zh-CN': '暂无排行数据',
    'zh-TW': '暫無排行數據',
    en: 'No ranking data available',
  },
  noDataHint: {
    ja: '予約を獲得してコミッションを稼ぎ、ランキングに参加しましょう！',
    'zh-CN': '开始预约赚取佣金，登上排行榜！',
    'zh-TW': '開始預約賺取佣金，登上排行榜！',
    en: 'Start booking and earning commission to climb the leaderboard!',
  },
  bottomInfo: {
    ja: 'ランキングは毎日更新されます · 審査通過済みのパートナーのみ表示',
    'zh-CN': '排行榜每日更新 · 仅显示已通过审核的合伙人',
    'zh-TW': '排行榜每日更新 · 僅顯示已通過審核的合夥人',
    en: 'Updated daily · Only verified partners are shown',
  },
  youIndicator: {
    ja: '(あなた)',
    'zh-CN': '(您)',
    'zh-TW': '(您)',
    en: '(You)',
  },
  anonymous: {
    ja: '匿名',
    'zh-CN': '匿名',
    'zh-TW': '匿名',
    en: 'Anonymous',
  },
  levelGrowth: {
    ja: '初期',
    'zh-CN': '初期',
    'zh-TW': '初期',
    en: 'Growth',
  },
  levelGold: {
    ja: 'ゴールド',
    'zh-CN': '金牌',
    'zh-TW': '金牌',
    en: 'Gold',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

interface LeaderboardEntry {
  id: string;
  name: string;
  level: string;
  total_commission: number;
  total_bookings: number;
  rank: number;
  isCurrentUser: boolean;
}

// Level style configuration (colors only, labels handled by translations)
const LEVEL_STYLES: Record<string, { color: string; bgColor: string; borderColor: string }> = {
  growth: { color: 'text-amber-700', bgColor: 'bg-amber-100', borderColor: 'border-amber-300' },
  gold: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' },
};

const LEVEL_LABEL_KEYS: Record<string, keyof typeof translations> = {
  growth: 'levelGrowth',
  gold: 'levelGold',
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all');
  const router = useRouter();
  const supabase = createClient();
  const lang = useLanguage();

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

  // Mask name (show only first character + *)
  const maskName = (name: string): string => {
    if (!name || name.length <= 1) return name || t('anonymous', lang);
    return name.charAt(0) + '*'.repeat(name.length - 1);
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
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-brand-500 rounded-xl flex items-center justify-center">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('heading', lang)}</h1>
                <p className="text-gray-500">{t('subtitle', lang)}</p>
              </div>
            </div>
          </div>

          {/* Current User Rank Card */}
          {currentUserRank && (
            <div className="bg-gradient-to-r from-brand-600 to-brand-400 rounded-2xl p-6 text-white mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-100 text-sm">{t('yourCurrentRank', lang)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-5xl font-bold">#{currentUserRank.rank}</span>
                    <div className="text-left">
                      <p className="text-brand-100 text-sm">{t('totalCommission', lang)}</p>
                      <p className="text-2xl font-bold">¥{currentUserRank.total_commission.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${LEVEL_STYLES[currentUserRank.level]?.bgColor || 'bg-white/20'}`}>
                    <Star size={14} className={LEVEL_STYLES[currentUserRank.level]?.color || 'text-white'} />
                    <span className={`text-sm font-medium ${LEVEL_STYLES[currentUserRank.level]?.color || 'text-white'}`}>
                      {LEVEL_LABEL_KEYS[currentUserRank.level] ? t(LEVEL_LABEL_KEYS[currentUserRank.level], lang) : currentUserRank.level}
                    </span>
                  </div>
                  <p className="text-brand-100 text-sm mt-2">
                    {currentUserRank.total_bookings}{t('ordersCount', lang)}
                  </p>
                </div>
              </div>
              {currentUserRank.rank > 1 && (
                <div className="mt-4 pt-4 border-t border-amber-400/30">
                  <p className="text-brand-100 text-sm flex items-center gap-2">
                    <TrendingUp size={16} />
                    {t('gapToNext', lang)} ¥{(leaderboard[currentUserRank.rank - 2]?.total_commission - currentUserRank.total_commission).toLocaleString()}
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
                {t('leaderboardTitle', lang)}
              </h2>
            </div>

            <div className="divide-y">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-4 flex items-center gap-4 transition ${getRankStyle(entry.rank)} ${
                      entry.isCurrentUser ? 'ring-2 ring-amber-500 ring-inset' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-10 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Name & Level */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium truncate ${entry.isCurrentUser ? 'text-amber-600' : 'text-gray-900'}`}>
                          {entry.name}
                          {entry.isCurrentUser && <span className="ml-2 text-xs text-amber-500">{t('youIndicator', lang)}</span>}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          LEVEL_STYLES[entry.level]?.bgColor || 'bg-gray-100'
                        } ${LEVEL_STYLES[entry.level]?.color || 'text-gray-600'}`}>
                          {LEVEL_LABEL_KEYS[entry.level] ? t(LEVEL_LABEL_KEYS[entry.level], lang) : entry.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {entry.total_bookings}{t('ordersCount', lang)}
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
                  <p>{t('noData', lang)}</p>
                  <p className="text-sm mt-2">{t('noDataHint', lang)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>{t('bottomInfo', lang)}</p>
          </div>
        </div>
      </main>

    </div>
  );
}
