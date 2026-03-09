'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  Users,
  Copy,
  CheckCircle2,
  Share2,
  Loader2,
  UserPlus,
  Clock,
  Gift
} from 'lucide-react';

const translations = {
  pageTitle: {
    ja: 'マイ紹介',
    'zh-CN': '我的推荐',
    'zh-TW': '我的推薦',
    en: 'My Referrals',
  },
  heading: {
    ja: 'マイ紹介',
    'zh-CN': '我的推荐',
    'zh-TW': '我的推薦',
    en: 'My Referrals',
  },
  subtitle: {
    ja: '新しいガイドを招待して、追加報酬を獲得しましょう',
    'zh-CN': '邀请新导游加入，获得额外奖励',
    'zh-TW': '邀請新導遊加入，獲得額外獎勵',
    en: 'Invite new guides and earn extra rewards',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  yourReferralCode: {
    ja: 'あなた専用の紹介コード',
    'zh-CN': '您的专属推荐码',
    'zh-TW': '您的專屬推薦碼',
    en: 'Your Referral Code',
  },
  copyReferralCode: {
    ja: '紹介コードをコピー',
    'zh-CN': '复制推荐码',
    'zh-TW': '複製推薦碼',
    en: 'Copy referral code',
  },
  copyInviteLink: {
    ja: '招待リンクをコピー',
    'zh-CN': '复制邀请链接',
    'zh-TW': '複製邀請連結',
    en: 'Copy Invite Link',
  },
  referralCodeDesc: {
    ja: '紹介コードを他のガイドに共有してください。登録時にあなたの紹介コードを入力すると、あなたの下位メンバーになります。彼らの実績から追加で2%の報酬を獲得できます！',
    'zh-CN': '分享您的推荐码给其他导游，他们注册时填写您的推荐码，即可成为您的下线。您可以从他们的业绩中获得额外 2% 的奖励！',
    'zh-TW': '分享您的推薦碼給其他導遊，他們註冊時填寫您的推薦碼，即可成為您的下線。您可以從他們的業績中獲得額外 2% 的獎勵！',
    en: 'Share your referral code with other guides. When they register using your code, they become your referrals. You earn an extra 2% reward from their performance!',
  },
  referralCount: {
    ja: '紹介人数',
    'zh-CN': '推荐人数',
    'zh-TW': '推薦人數',
    en: 'Referrals',
  },
  approved: {
    ja: '承認済み',
    'zh-CN': '已通过',
    'zh-TW': '已通過',
    en: 'Approved',
  },
  totalRewards: {
    ja: '累計報酬',
    'zh-CN': '累计奖励',
    'zh-TW': '累計獎勵',
    en: 'Total Rewards',
  },
  pendingSettlement: {
    ja: '未精算',
    'zh-CN': '待结算',
    'zh-TW': '待結算',
    en: 'Pending',
  },
  referredGuides: {
    ja: '紹介済みガイド',
    'zh-CN': '已推荐导游',
    'zh-TW': '已推薦導遊',
    en: 'Referred Guides',
  },
  joinedOn: {
    ja: '参加日：',
    'zh-CN': '加入于 ',
    'zh-TW': '加入於 ',
    en: 'Joined on ',
  },
  bookingsCount: {
    ja: '件の予約',
    'zh-CN': ' 笔预约',
    'zh-TW': ' 筆預約',
    en: ' bookings',
  },
  noReferrals: {
    ja: 'まだガイドを紹介していません',
    'zh-CN': '您还没有推荐过导游',
    'zh-TW': '您還沒有推薦過導遊',
    en: 'You have not referred any guides yet',
  },
  noReferralsHint: {
    ja: '紹介コードを共有して招待を始めましょう',
    'zh-CN': '分享您的推荐码开始邀请吧',
    'zh-TW': '分享您的推薦碼開始邀請吧',
    en: 'Share your referral code to start inviting',
  },
  rewardDetails: {
    ja: '報酬明細',
    'zh-CN': '奖励明细',
    'zh-TW': '獎勵明細',
    en: 'Reward Details',
  },
  pendingAmount: {
    ja: '未精算',
    'zh-CN': '待结算',
    'zh-TW': '待結算',
    en: 'Pending',
  },
  statusPending: {
    ja: '審査中',
    'zh-CN': '审核中',
    'zh-TW': '審核中',
    en: 'Pending',
  },
  statusApproved: {
    ja: '承認済み',
    'zh-CN': '已通过',
    'zh-TW': '已通過',
    en: 'Approved',
  },
  statusRejected: {
    ja: '不承認',
    'zh-CN': '未通过',
    'zh-TW': '未通過',
    en: 'Rejected',
  },
  statusSuspended: {
    ja: '停止中',
    'zh-CN': '已暂停',
    'zh-TW': '已暫停',
    en: 'Suspended',
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
  unknownGuide: {
    ja: '不明なガイド',
    'zh-CN': '未知导游',
    'zh-TW': '未知導遊',
    en: 'Unknown Guide',
  },
  performanceReward: {
    ja: 'の実績報酬',
    'zh-CN': ' 的业绩奖励',
    'zh-TW': ' 的業績獎勵',
    en: "'s Performance Reward",
  },
  customer: {
    ja: '顧客：',
    'zh-CN': '客户: ',
    'zh-TW': '客戶: ',
    en: 'Customer: ',
  },
  rewardRate: {
    ja: '報酬率',
    'zh-CN': '奖励率',
    'zh-TW': '獎勵率',
    en: 'Reward rate',
  },
  settled: {
    ja: '精算済み',
    'zh-CN': '已结算',
    'zh-TW': '已結算',
    en: 'Settled',
  },
  pendingLabel: {
    ja: '未精算',
    'zh-CN': '待结算',
    'zh-TW': '待結算',
    en: 'Pending',
  },
  noRewards: {
    ja: '報酬記録はまだありません',
    'zh-CN': '暂无奖励记录',
    'zh-TW': '暫無獎勵記錄',
    en: 'No reward records yet',
  },
  noRewardsHint: {
    ja: '紹介したガイドが注文を完了すると、報酬が自動的に生成されます',
    'zh-CN': '当您推荐的导游完成订单后，奖励将自动生成',
    'zh-TW': '當您推薦的導遊完成訂單後，獎勵將自動生成',
    en: 'Rewards will be generated automatically when your referred guides complete orders',
  },
  rewardRulesTitle: {
    ja: '紹介報酬ルール',
    'zh-CN': '推荐奖励规则',
    'zh-TW': '推薦獎勵規則',
    en: 'Referral Reward Rules',
  },
  rule1: {
    ja: '紹介されたガイドが審査に合格すると、報酬の計算が開始されます',
    'zh-CN': '被推荐导游成功通过审核后，开始计算奖励',
    'zh-TW': '被推薦導遊成功通過審核後，開始計算獎勵',
    en: 'Rewards start accruing once the referred guide passes verification',
  },
  rule2: {
    ja: '紹介されたガイドの各注文報酬の2%を報酬として獲得できます',
    'zh-CN': '您可获得被推荐导游每笔订单报酬的 2% 作为奖励',
    'zh-TW': '您可獲得被推薦導遊每筆訂單報酬的 2% 作為獎勵',
    en: 'You earn 2% of each order commission from your referred guides',
  },
  rule3: {
    ja: '報酬は月次で精算されます',
    'zh-CN': '奖励与报酬一起按月结算',
    'zh-TW': '獎勵與報酬一起按月結算',
    en: 'Rewards are settled monthly along with commissions',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};
const dateLocaleMap: Record<Language, string> = { ja: 'ja-JP', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en-US' };

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
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const lang = useLanguage();

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
    const labelKeys: Record<string, keyof typeof translations> = {
      pending: 'statusPending',
      approved: 'statusApproved',
      rejected: 'statusRejected',
      suspended: 'statusSuspended',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labelKeys[status] ? t(labelKeys[status], lang) : status}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const styles: Record<string, string> = {
      growth: 'text-brand-600',
      gold: 'text-yellow-500',
    };
    const labelKeys: Record<string, keyof typeof translations> = {
      growth: 'levelGrowth',
      gold: 'levelGold',
    };
    return (
      <span className={`text-xs font-medium ${styles[level] || styles.growth}`}>
        {labelKeys[level] ? t(labelKeys[level], lang) : level}
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
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('heading', lang)}</h1>
            <p className="text-gray-500 mt-1">{t('subtitle', lang)}</p>
          </div>

          {/* Referral Code Card */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-lg font-medium opacity-90 mb-2">{t('yourReferralCode', lang)}</h2>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl font-bold tracking-wider">{guide?.referral_code}</span>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                    title={t('copyReferralCode', lang)}
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
                  {t('copyInviteLink', lang)}
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-80">
                {t('referralCodeDesc', lang)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} className="text-purple-500" />
                <span className="text-sm text-gray-500">{t('referralCount', lang)}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{referrals.length}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-sm text-gray-500">{t('approved', lang)}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {referrals.filter(r => r.status === 'approved').length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={20} className="text-brand-500" />
                <span className="text-sm text-gray-500">{t('totalRewards', lang)}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{totalRewards.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-500" />
                <span className="text-sm text-gray-500">{t('pendingSettlement', lang)}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{pendingRewards.toLocaleString()}</p>
            </div>
          </div>

          {/* Referral List */}
          <div className="bg-white rounded-xl border mb-8">
            <div className="p-4 border-b">
              <h2 className="font-bold text-gray-900">{t('referredGuides', lang)}</h2>
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
                          {t('joinedOn', lang)}{new Date(referral.created_at).toLocaleDateString(dateLocaleMap[lang])}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {referral.status === 'approved' && (
                        <>
                          <p className="text-sm text-gray-500">
                            {referral.total_bookings}{t('bookingsCount', lang)}
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
                <p>{t('noReferrals', lang)}</p>
                <p className="text-sm mt-2">{t('noReferralsHint', lang)}</p>
              </div>
            )}
          </div>

          {/* Rewards History */}
          <div className="bg-white rounded-xl border mb-8">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900">{t('rewardDetails', lang)}</h2>
                {pendingRewards > 0 && (
                  <span className="text-sm text-yellow-600 font-medium">
                    {t('pendingAmount', lang)} ¥{pendingRewards.toLocaleString()}
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
                          {reward.referee?.name || t('unknownGuide', lang)}{t('performanceReward', lang)}
                        </p>
                        {reward.booking && (
                          <p className="text-sm text-gray-500">
                            {t('customer', lang)}{reward.booking.customer_name}
                            {reward.booking.venue && ` · ${reward.booking.venue.name}`}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {new Date(reward.created_at).toLocaleDateString(dateLocaleMap[lang])}
                          {reward.reward_rate && ` · ${t('rewardRate', lang)} ${(reward.reward_rate * 100).toFixed(0)}%`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reward.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {reward.status === 'paid' ? t('settled', lang) : t('pendingLabel', lang)}
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
                <p>{t('noRewards', lang)}</p>
                <p className="text-sm mt-2">{t('noRewardsHint', lang)}</p>
              </div>
            )}
          </div>

          {/* Reward Rules */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-purple-800 mb-4">{t('rewardRulesTitle', lang)}</h3>
            <div className="space-y-3 text-sm text-purple-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                <p>{t('rule1', lang)}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                <p>{t('rule2', lang)}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                <p>{t('rule3', lang)}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
