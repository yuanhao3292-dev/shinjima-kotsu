'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  Store,
  Calendar,
  Wallet,
  Users,
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

// ─── i18n translations ───────────────────────────────────────────────
const translations = {
  pageTitle: {
    ja: '報酬精算',
    'zh-CN': '返金结算',
    'zh-TW': '返金結算',
    en: 'Commission Settlement',
  },
  headerTitle: {
    ja: '報酬精算',
    'zh-CN': '报酬结算',
    'zh-TW': '報酬結算',
    en: 'Commission Settlement',
  },
  headerDesc: {
    ja: '報酬収入と精算記録をご確認ください',
    'zh-CN': '查看您的报酬收入和结算记录',
    'zh-TW': '查看您的報酬收入和結算記錄',
    en: 'View your commission income and settlement records',
  },
  totalEarned: {
    ja: '累計収入',
    'zh-CN': '累计收入',
    'zh-TW': '累計收入',
    en: 'Total Earned',
  },
  pendingSettlement: {
    ja: '未精算',
    'zh-CN': '待结算',
    'zh-TW': '待結算',
    en: 'Pending',
  },
  thisMonth: {
    ja: '今月',
    'zh-CN': '本月',
    'zh-TW': '本月',
    en: 'This Month',
  },
  lastMonth: {
    ja: '先月',
    'zh-CN': '上月',
    'zh-TW': '上月',
    en: 'Last Month',
  },
  applyWithdrawal: {
    ja: '出金申請',
    'zh-CN': '申请提现',
    'zh-TW': '申請提現',
    en: 'Request Withdrawal',
  },
  commissionCalcTitle: {
    ja: '報酬計算方式',
    'zh-CN': '报酬计算方式',
    'zh-TW': '報酬計算方式',
    en: 'Commission Calculation',
  },
  commissionFormula: {
    ja: '報酬 = お客様消費金額 ÷ 1.1（消費税10%控除）×',
    'zh-CN': '报酬 = 客户消费金额 ÷ 1.1（扣除10%消费税）×',
    'zh-TW': '報酬 = 客戶消費金額 ÷ 1.1（扣除10%消費稅）×',
    en: 'Commission = Customer spend ÷ 1.1 (excl. 10% tax) ×',
  },
  commissionExample: {
    ja: '例：お客様消費 100 万円 → 報酬約',
    'zh-CN': '例：客户消费 100 万日元 → 报酬约',
    'zh-TW': '例：客戶消費 100 萬日元 → 報酬約',
    en: 'E.g.: Customer spends ¥1,000,000 → Commission approx.',
  },
  newCustomerBonusTitle: {
    ja: '新規顧客初回ボーナス +5%',
    'zh-CN': '新客首单奖励 +5%',
    'zh-TW': '新客首單獎勵 +5%',
    en: 'New Customer Bonus +5%',
  },
  newCustomerBonusDesc: {
    ja: '新規顧客の初回注文で、追加 5% のボーナスコミッションを獲得できます！',
    'zh-CN': '每位新客户的首笔订单，您将额外获得 5% 的奖励佣金！',
    'zh-TW': '每位新客戶的首筆訂單，您將額外獲得 5% 的獎勵佣金！',
    en: 'Earn an extra 5% bonus commission on every new customer\'s first order!',
  },
  newCustomerBonusExample: {
    ja: '例：',
    'zh-CN': '例：',
    'zh-TW': '例：',
    en: 'E.g.: ',
  },
  newCustomerBonusLabel: {
    ja: '+ 新規ボーナス',
    'zh-CN': '+ 新客奖励',
    'zh-TW': '+ 新客獎勵',
    en: '+ New Customer Bonus',
  },
  totalCommissionRateLabel: {
    ja: '= 合計コミッション率',
    'zh-CN': '= 总佣金率',
    'zh-TW': '= 總佣金率',
    en: '= Total Commission Rate',
  },
  tabStoreCommission: {
    ja: '店舗報酬',
    'zh-CN': '店铺报酬',
    'zh-TW': '店舖報酬',
    en: 'Store Commission',
  },
  tabWhitelabel: {
    ja: 'ホワイトラベル注文',
    'zh-CN': '白标订单',
    'zh-TW': '白標訂單',
    en: 'Whitelabel Orders',
  },
  tabReferrals: {
    ja: '紹介報酬',
    'zh-CN': '推荐奖励',
    'zh-TW': '推薦獎勵',
    en: 'Referral Rewards',
  },
  tabMonthlySettlement: {
    ja: '月次精算',
    'zh-CN': '月度结算',
    'zh-TW': '月度結算',
    en: 'Monthly Settlement',
  },
  storeCommissionRecords: {
    ja: '店舗報酬記録',
    'zh-CN': '店铺报酬记录',
    'zh-TW': '店舖報酬記錄',
    en: 'Store Commission Records',
  },
  noCommissionRecords: {
    ja: '報酬記録はありません',
    'zh-CN': '暂无报酬记录',
    'zh-TW': '暫無報酬記錄',
    en: 'No commission records yet',
  },
  startBookingToEarn: {
    ja: '予約を開始して報酬を獲得しましょう',
    'zh-CN': '开始预约赚取报酬',
    'zh-TW': '開始預約賺取報酬',
    en: 'Start booking to earn commissions',
  },
  spend: {
    ja: '消費',
    'zh-CN': '消费',
    'zh-TW': '消費',
    en: 'Spent',
  },
  whitelabelCommissionTitle: {
    ja: 'ホワイトラベル注文コミッション',
    'zh-CN': '白标订单佣金',
    'zh-TW': '白標訂單佣金',
    en: 'Whitelabel Order Commission',
  },
  whitelabelCommissionDesc: {
    ja: 'お客様が専用リンクから注文した分',
    'zh-CN': '通过您专属链接下单的客户',
    'zh-TW': '透過您專屬連結下單的客戶',
    en: 'Orders placed via your exclusive link',
  },
  exportCSV: {
    ja: 'CSV出力',
    'zh-CN': '导出CSV',
    'zh-TW': '導出CSV',
    en: 'Export CSV',
  },
  orderTypeMedical: {
    ja: '医療健診',
    'zh-CN': '医疗体检',
    'zh-TW': '醫療體檢',
    en: 'Medical Checkup',
  },
  orderTypeGolf: {
    ja: 'ゴルフ',
    'zh-CN': '高尔夫',
    'zh-TW': '高爾夫',
    en: 'Golf',
  },
  orderTypeBusiness: {
    ja: 'ビジネス視察',
    'zh-CN': '商务考察',
    'zh-TW': '商務考察',
    en: 'Business Visit',
  },
  newCustomerReward: {
    ja: '新規ボーナス',
    'zh-CN': '新客奖励',
    'zh-TW': '新客獎勵',
    en: 'New Customer Bonus',
  },
  orderAmount: {
    ja: '注文金額',
    'zh-CN': '订单金额',
    'zh-TW': '訂單金額',
    en: 'Order Amount',
  },
  baseCommission: {
    ja: '基本',
    'zh-CN': '基础',
    'zh-TW': '基礎',
    en: 'Base',
  },
  bonusReward: {
    ja: '+ ボーナス',
    'zh-CN': '+ 奖励',
    'zh-TW': '+ 獎勵',
    en: '+ Bonus',
  },
  commissionRate: {
    ja: 'コミッション率',
    'zh-CN': '佣金率',
    'zh-TW': '佣金率',
    en: 'Commission Rate',
  },
  noWhitelabelOrders: {
    ja: 'ホワイトラベル注文はありません',
    'zh-CN': '暂无白标订单',
    'zh-TW': '暫無白標訂單',
    en: 'No whitelabel orders yet',
  },
  setupWhitelabelToStart: {
    ja: 'ホワイトラベルサイトを設定して販促を開始',
    'zh-CN': '设置白标网站开始推广',
    'zh-TW': '設置白標網站開始推廣',
    en: 'Set up your whitelabel site to start promoting',
  },
  referralRewardsTitle: {
    ja: '紹介報酬記録',
    'zh-CN': '推荐奖励记录',
    'zh-TW': '推薦獎勵記錄',
    en: 'Referral Reward Records',
  },
  referralRewardsDesc: {
    ja: 'ご紹介のガイドの業績による 2% の追加報酬',
    'zh-CN': '您推荐的导游业绩带来的 2% 额外奖励',
    'zh-TW': '您推薦的導遊業績帶來的 2% 額外獎勵',
    en: '2% extra reward from your referred guides\' performance',
  },
  pendingReferralRewards: {
    ja: '未精算の紹介報酬',
    'zh-CN': '待结算奖励',
    'zh-TW': '待結算獎勵',
    en: 'Pending Rewards',
  },
  unknownGuide: {
    ja: '不明なガイド',
    'zh-CN': '未知导游',
    'zh-TW': '未知導遊',
    en: 'Unknown Guide',
  },
  performanceOf: {
    ja: ' の業績',
    'zh-CN': ' 的业绩',
    'zh-TW': ' 的業績',
    en: '\'s Performance',
  },
  downlineReward: {
    ja: '紹介報酬',
    'zh-CN': '下线奖励',
    'zh-TW': '下線獎勵',
    en: 'Referral Reward',
  },
  customer: {
    ja: '顧客',
    'zh-CN': '客户',
    'zh-TW': '客戶',
    en: 'Customer',
  },
  rewardRate: {
    ja: '報酬率',
    'zh-CN': '奖励率',
    'zh-TW': '獎勵率',
    en: 'Reward Rate',
  },
  noReferralRewards: {
    ja: '紹介報酬はありません',
    'zh-CN': '暂无推荐奖励',
    'zh-TW': '暫無推薦獎勵',
    en: 'No referral rewards yet',
  },
  referralRewardsEmptyDesc: {
    ja: 'ご紹介のガイドが注文を完了すると、業績の 2% が追加報酬として付与されます',
    'zh-CN': '当您推荐的导游完成订单后，您将获得其业绩 2% 的额外奖励',
    'zh-TW': '當您推薦的導遊完成訂單後，您將獲得其業績 2% 的額外獎勵',
    en: 'When your referred guides complete orders, you earn an extra 2% of their performance',
  },
  viewMyReferralCode: {
    ja: '紹介コードを確認',
    'zh-CN': '查看我的推荐码',
    'zh-TW': '查看我的推薦碼',
    en: 'View My Referral Code',
  },
  monthlySettlementRecords: {
    ja: '月次精算記録',
    'zh-CN': '月度结算记录',
    'zh-TW': '月度結算記錄',
    en: 'Monthly Settlement Records',
  },
  ordersCount: {
    ja: '件の注文',
    'zh-CN': '笔订单',
    'zh-TW': '筆訂單',
    en: ' orders',
  },
  totalSpend: {
    ja: '総消費',
    'zh-CN': '总消费',
    'zh-TW': '總消費',
    en: 'Total Spend',
  },
  paidOn: {
    ja: '支払済',
    'zh-CN': '已付款',
    'zh-TW': '已付款',
    en: 'Paid',
  },
  noSettlementRecords: {
    ja: '精算記録はありません',
    'zh-CN': '暂无结算记录',
    'zh-TW': '暫無結算記錄',
    en: 'No settlement records yet',
  },
  monthlySettlementNote: {
    ja: '毎月初に前月の報酬を集計します',
    'zh-CN': '每月初统计上月报酬',
    'zh-TW': '每月初統計上月報酬',
    en: 'Previous month commissions are tallied at the start of each month',
  },
  settlementInfoTitle: {
    ja: '精算について',
    'zh-CN': '结算说明',
    'zh-TW': '結算說明',
    en: 'Settlement Info',
  },
  settlementInfo1: {
    ja: 'ホワイトラベル注文のコミッションは、サービス完了後 <strong>2 週間</strong>で出金申請が可能です',
    'zh-CN': '白标订单佣金在客人完成服务后 <strong>2 周</strong>即可申请提现',
    'zh-TW': '白標訂單佣金在客人完成服務後 <strong>2 週</strong>即可申請提現',
    en: 'Whitelabel order commissions can be withdrawn <strong>2 weeks</strong> after service completion',
  },
  settlementInfo2: {
    ja: '店舗報酬は毎月 1〜5 日に前月完了分を集計します',
    'zh-CN': '店铺报酬每月 1-5 日统计上月已完成订单',
    'zh-TW': '店舖報酬每月 1-5 日統計上月已完成訂單',
    en: 'Store commissions are tallied on the 1st-5th of each month for prior month',
  },
  settlementInfo3: {
    ja: '出金は銀行振込で、1〜3 営業日で着金します',
    'zh-CN': '提现通过银行转账支付，1-3 个工作日到账',
    'zh-TW': '提現通過銀行轉帳支付，1-3 個工作日到帳',
    en: 'Withdrawals are paid via bank transfer within 1-3 business days',
  },
  settlementInfo4: {
    ja: 'ご不明な点はカスタマーサポートまでお問い合わせください',
    'zh-CN': '如有疑问请联系客服核实',
    'zh-TW': '如有疑問請聯繫客服核實',
    en: 'Contact support if you have any questions',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  // Settlement status badges
  statusPending: {
    ja: '集計中',
    'zh-CN': '统计中',
    'zh-TW': '統計中',
    en: 'Processing',
  },
  statusConfirmed: {
    ja: '支払待ち',
    'zh-CN': '待付款',
    'zh-TW': '待付款',
    en: 'Awaiting Payment',
  },
  statusPaid: {
    ja: '精算済',
    'zh-CN': '已结算',
    'zh-TW': '已結算',
    en: 'Settled',
  },
  // Commission status badges
  commStatusPending: {
    ja: '未計算',
    'zh-CN': '待计算',
    'zh-TW': '待計算',
    en: 'Pending',
  },
  commStatusCalculated: {
    ja: 'ロック中',
    'zh-CN': '锁定中',
    'zh-TW': '鎖定中',
    en: 'Locked',
  },
  commStatusAvailable: {
    ja: '出金可能',
    'zh-CN': '可提现',
    'zh-TW': '可提現',
    en: 'Available',
  },
  commStatusPaid: {
    ja: '精算済',
    'zh-CN': '已结算',
    'zh-TW': '已結算',
    en: 'Settled',
  },
  daysUntilAvailable: {
    ja: '日後に出金可能',
    'zh-CN': '天后可提现',
    'zh-TW': '天後可提現',
    en: ' day(s) until available',
  },
  // CSV export headers
  csvDate: {
    ja: '日付',
    'zh-CN': '日期',
    'zh-TW': '日期',
    en: 'Date',
  },
  csvType: {
    ja: '種類',
    'zh-CN': '类型',
    'zh-TW': '類型',
    en: 'Type',
  },
  csvOrderAmount: {
    ja: '注文金額',
    'zh-CN': '订单金额',
    'zh-TW': '訂單金額',
    en: 'Order Amount',
  },
  csvCommissionRate: {
    ja: 'コミッション率',
    'zh-CN': '佣金率',
    'zh-TW': '佣金率',
    en: 'Commission Rate',
  },
  csvCommissionAmount: {
    ja: 'コミッション金額',
    'zh-CN': '佣金金额',
    'zh-TW': '佣金金額',
    en: 'Commission Amount',
  },
  csvNewCustomerBonus: {
    ja: '新規ボーナス',
    'zh-CN': '新客奖励',
    'zh-TW': '新客獎勵',
    en: 'New Customer Bonus',
  },
  csvStatus: {
    ja: 'ステータス',
    'zh-CN': '状态',
    'zh-TW': '狀態',
    en: 'Status',
  },
  csvFilename: {
    ja: 'コミッションレポート',
    'zh-CN': '佣金报表',
    'zh-TW': '佣金報表',
    en: 'commission-report',
  },
  // CSV export status labels
  csvStatusPending: {
    ja: '未計算',
    'zh-CN': '待计算',
    'zh-TW': '待計算',
    en: 'Pending',
  },
  csvStatusCalculated: {
    ja: '未精算',
    'zh-CN': '待结算',
    'zh-TW': '待結算',
    en: 'Pending Settlement',
  },
  csvStatusPaid: {
    ja: '精算済',
    'zh-CN': '已结算',
    'zh-TW': '已結算',
    en: 'Settled',
  },
  // Tier names
  tierGold: {
    ja: 'ゴールドパートナー',
    'zh-CN': '金牌合伙人',
    'zh-TW': '金牌合夥人',
    en: 'Gold Partner',
  },
  tierInitial: {
    ja: '初期パートナー',
    'zh-CN': '初期合伙人',
    'zh-TW': '初期合夥人',
    en: 'Starter Partner',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

// ─── Date locale mapping ─────────────────────────────────────────────
const dateLocaleMap: Record<Language, string> = {
  ja: 'ja-JP',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  en: 'en-US',
};

// ─── Interfaces ──────────────────────────────────────────────────────
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
  referralPending: number;
  referralTotal: number;
}

export default function CommissionPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [recentCommissions, setRecentCommissions] = useState<CommissionRecord[]>([]);
  const [whitelabelCommissions, setWhitelabelCommissions] = useState<WhitelabelCommission[]>([]);
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'whitelabel' | 'referrals' | 'history'>('overview');
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [tierName, setTierName] = useState<'tierGold' | 'tierInitial'>('tierInitial');
  const router = useRouter();
  const supabase = createClient();
  const lang = useLanguage();

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

      const isGold = guide.commission_tier_code === 'gold';
      setCommissionRate(isGold ? 20 : 10);
      setTierName(isGold ? 'tierGold' : 'tierInitial');

      const { data: settlementsData } = await supabase
        .from('commission_settlements')
        .select('*')
        .eq('guide_id', guide.id)
        .order('settlement_month', { ascending: false });

      setSettlements(settlementsData || []);

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

      const transformedCommissions = (commissionsData || []).map(c => ({
        ...c,
        venue: Array.isArray(c.venue) ? c.venue[0] : c.venue
      })) as CommissionRecord[];
      setRecentCommissions(transformedCommissions);

      const { data: wlCommissions } = await supabase
        .from('white_label_orders')
        .select('*')
        .eq('guide_id', guide.id)
        .order('created_at', { ascending: false })
        .limit(20);

      setWhitelabelCommissions((wlCommissions || []) as WhitelabelCommission[]);

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

      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

      const thisMonthSettlement = settlementsData?.find(s => s.settlement_month === thisMonth);
      const lastMonthSettlement = settlementsData?.find(s => s.settlement_month === lastMonthStr);

      const { data: pendingBookings } = await supabase
        .from('bookings')
        .select('commission_amount')
        .eq('guide_id', guide.id)
        .eq('commission_status', 'calculated');

      const pendingAmount = pendingBookings?.reduce((sum, b) => sum + (b.commission_amount || 0), 0) || 0;

      const referralPending = transformedRewards
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + (r.reward_amount || 0), 0);
      const referralTotal = transformedRewards
        .reduce((sum, r) => sum + (r.reward_amount || 0), 0);

      setStats({
        totalEarned: guide.total_commission || 0,
        pendingAmount: pendingAmount + referralPending,
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

  const getSettlementStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-600',
      confirmed: 'bg-brand-100 text-brand-700',
      paid: 'bg-green-100 text-green-700',
    };
    const labels: Record<string, string> = {
      pending: t('statusPending', lang),
      confirmed: t('statusConfirmed', lang),
      paid: t('statusPaid', lang),
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
      calculated: 'bg-gray-100 text-gray-600',
      available: 'bg-brand-100 text-brand-700',
      paid: 'bg-green-100 text-green-700',
    };
    const labels: Record<string, string> = {
      pending: t('commStatusPending', lang),
      calculated: t('commStatusCalculated', lang),
      available: t('commStatusAvailable', lang),
      paid: t('commStatusPaid', lang),
    };

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
              {daysLeft}{t('daysUntilAvailable', lang)}
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
    if (lang === 'ja') return `${year}年${parseInt(month)}月`;
    if (lang === 'zh-CN' || lang === 'zh-TW') return `${year}年${parseInt(month)}月`;
    return `${year}/${parseInt(month)}`;
  };

  const exportToCSV = () => {
    const orderTypeLabels: Record<string, string> = {
      medical: t('orderTypeMedical', lang),
      golf: t('orderTypeGolf', lang),
      business: t('orderTypeBusiness', lang),
    };
    const statusLabels: Record<string, string> = {
      pending: t('csvStatusPending', lang),
      calculated: t('csvStatusCalculated', lang),
      paid: t('csvStatusPaid', lang),
    };

    const headers = [
      t('csvDate', lang),
      t('csvType', lang),
      t('csvOrderAmount', lang),
      t('csvCommissionRate', lang),
      t('csvCommissionAmount', lang),
      t('csvNewCustomerBonus', lang),
      t('csvStatus', lang),
    ];
    const rows = whitelabelCommissions.map(record => {
      const hasBonus = record.metadata?.new_customer_bonus;
      return [
        new Date(record.created_at).toLocaleDateString(dateLocaleMap[lang]),
        orderTypeLabels[record.order_type] || record.order_type,
        record.order_amount,
        `${record.applied_commission_rate}%`,
        record.commission_amount,
        hasBonus ? `+¥${record.metadata?.bonus_amount || 0}` : '-',
        statusLabels[record.commission_status] || record.commission_status,
      ];
    });

    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${t('csvFilename', lang)}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('headerTitle', lang)}</h1>
            <p className="text-gray-500 mt-1">{t('headerDesc', lang)}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-brand-800 to-brand-900 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={20} />
                <span className="text-sm opacity-90">{t('totalEarned', lang)}</span>
              </div>
              <p className="text-3xl font-bold">¥{(stats?.totalEarned || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-500" />
                <span className="text-sm text-gray-500">{t('pendingSettlement', lang)}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(stats?.pendingAmount || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-brand-500" />
                <span className="text-sm text-gray-500">{t('thisMonth', lang)}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(stats?.thisMonthAmount || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">{t('lastMonth', lang)}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(stats?.lastMonthAmount || 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Withdrawal CTA */}
          <div className="mb-8">
            <Link
              href="/guide-partner/withdrawal"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-700 text-white rounded-lg font-medium hover:bg-brand-800 transition text-sm"
            >
              <Wallet size={18} />
              {t('applyWithdrawal', lang)}
            </Link>
          </div>

          {/* Commission Rate Info */}
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{commissionRate}%</span>
              </div>
              <div>
                <h3 className="font-bold text-brand-800">{t('commissionCalcTitle', lang)} · {t(tierName, lang)}</h3>
                <p className="text-sm text-brand-700 mt-1">
                  {t('commissionFormula', lang)} {commissionRate}%
                </p>
                <p className="text-xs text-brand-600 mt-2">
                  {t('commissionExample', lang)} ¥{Math.round(1000000 / 1.1 * commissionRate / 100).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* New Customer First Order Bonus */}
          <div className="bg-gradient-to-r from-brand-50 to-brand-100 border border-brand-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-700 to-brand-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Gift size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-brand-800">{t('newCustomerBonusTitle', lang)}</h3>
                <p className="text-sm text-brand-700 mt-1">
                  {t('newCustomerBonusDesc', lang)}
                </p>
                <p className="text-xs text-brand-600 mt-2">
                  {t('newCustomerBonusExample', lang)}{t(tierName, lang)} ({commissionRate}%) {t('newCustomerBonusLabel', lang)} (5%) {t('totalCommissionRateLabel', lang)} {commissionRate + 5}%
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
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              {t('tabStoreCommission', lang)}
            </button>
            <button
              onClick={() => setActiveTab('whitelabel')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'whitelabel'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              {t('tabWhitelabel', lang)}
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'referrals'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              {t('tabReferrals', lang)}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'history'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              {t('tabMonthlySettlement', lang)}
            </button>
          </div>

          {/* Content */}
          {activeTab === 'overview' ? (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-900">{t('storeCommissionRecords', lang)}</h2>
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
                          {t('spend', lang)} ¥{record.actual_spend?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{t('noCommissionRecords', lang)}</p>
                  <Link
                    href="/guide-partner/venues"
                    className="inline-block mt-4 text-brand-600 font-medium hover:underline"
                  >
                    {t('startBookingToEarn', lang)}
                  </Link>
                </div>
              )}
            </div>
          ) : activeTab === 'whitelabel' ? (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">{t('whitelabelCommissionTitle', lang)}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t('whitelabelCommissionDesc', lang)}</p>
                </div>
                {whitelabelCommissions.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-brand-600 hover:bg-brand-50 rounded-lg transition"
                  >
                    <Download size={16} />
                    {t('exportCSV', lang)}
                  </button>
                )}
              </div>

              {whitelabelCommissions.length > 0 ? (
                <div className="divide-y">
                  {whitelabelCommissions.map((record) => {
                    const hasBonus = record.metadata?.new_customer_bonus;
                    const orderTypeLabels: Record<string, string> = {
                      medical: t('orderTypeMedical', lang),
                      golf: t('orderTypeGolf', lang),
                      business: t('orderTypeBusiness', lang),
                    };
                    return (
                      <div key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {orderTypeLabels[record.order_type] || record.order_type}
                            </p>
                            {hasBonus && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-brand-100 to-brand-200 text-brand-700 text-xs rounded-full">
                                <Gift size={12} />
                                {t('newCustomerReward', lang)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {t('orderAmount', lang)} ¥{record.order_amount?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(record.created_at).toLocaleDateString(dateLocaleMap[lang])}
                          </p>
                        </div>
                        <div className="text-right">
                          {getCommissionStatusBadge(record.commission_status, record.commission_available_at)}
                          <p className="font-bold text-green-600 mt-1">
                            +¥{record.commission_amount?.toLocaleString()}
                          </p>
                          {hasBonus && record.metadata ? (
                            <div className="text-xs text-gray-500 mt-1">
                              <span>{t('baseCommission', lang)} ¥{record.metadata.base_commission?.toLocaleString()}</span>
                              <span className="text-brand-600 ml-1">
                                {t('bonusReward', lang)} ¥{record.metadata.bonus_amount?.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">
                              {t('commissionRate', lang)} {record.applied_commission_rate}%
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
                  <p>{t('noWhitelabelOrders', lang)}</p>
                  <Link
                    href="/guide-partner/whitelabel"
                    className="inline-block mt-4 text-brand-600 font-medium hover:underline"
                  >
                    {t('setupWhitelabelToStart', lang)}
                  </Link>
                </div>
              )}
            </div>
          ) : activeTab === 'referrals' ? (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">{t('referralRewardsTitle', lang)}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('referralRewardsDesc', lang)}</p>
                  </div>
                  {stats && stats.referralPending > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{t('pendingReferralRewards', lang)}</p>
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
                            {reward.referee?.name || t('unknownGuide', lang)}{t('performanceOf', lang)}
                          </p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-100 text-brand-700 text-xs rounded-full">
                            <Users size={12} />
                            {t('downlineReward', lang)}
                          </span>
                        </div>
                        {reward.booking && (
                          <p className="text-sm text-gray-500">
                            {t('customer', lang)}: {reward.booking.customer_name}
                            {reward.booking.venue && ` · ${reward.booking.venue.name}`}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(reward.created_at).toLocaleDateString(dateLocaleMap[lang])}
                        </p>
                      </div>
                      <div className="text-right">
                        {getCommissionStatusBadge(reward.status)}
                        <p className="font-bold text-green-600 mt-1">
                          +¥{reward.reward_amount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t('rewardRate', lang)} {(reward.reward_rate * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{t('noReferralRewards', lang)}</p>
                  <p className="text-sm mt-2 text-gray-400">
                    {t('referralRewardsEmptyDesc', lang)}
                  </p>
                  <Link
                    href="/guide-partner/referrals"
                    className="inline-block mt-4 text-brand-600 font-medium hover:underline"
                  >
                    {t('viewMyReferralCode', lang)}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-900">{t('monthlySettlementRecords', lang)}</h2>
              </div>

              {settlements.length > 0 ? (
                <div className="divide-y">
                  {settlements.map((settlement) => (
                    <div key={settlement.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{formatMonth(settlement.settlement_month)}</p>
                        <p className="text-sm text-gray-500">
                          {settlement.total_bookings} {t('ordersCount', lang)} · {t('totalSpend', lang)} ¥{settlement.total_spend?.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {getSettlementStatusBadge(settlement.status)}
                        <p className="font-bold text-green-600 mt-1">
                          ¥{settlement.total_commission?.toLocaleString()}
                        </p>
                        {settlement.paid_at && (
                          <p className="text-xs text-gray-400">
                            {new Date(settlement.paid_at).toLocaleDateString(dateLocaleMap[lang])} {t('paidOn', lang)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{t('noSettlementRecords', lang)}</p>
                  <p className="text-sm mt-2">{t('monthlySettlementNote', lang)}</p>
                </div>
              )}
            </div>
          )}

          {/* Settlement Info */}
          <div className="mt-8 bg-gray-100 rounded-xl p-4">
            <h3 className="font-medium text-gray-700 mb-2">{t('settlementInfoTitle', lang)}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li dangerouslySetInnerHTML={{ __html: `• ${t('settlementInfo1', lang)}` }} />
              <li>• {t('settlementInfo2', lang)}</li>
              <li>• {t('settlementInfo3', lang)}</li>
              <li>• {t('settlementInfo4', lang)}</li>
            </ul>
          </div>
        </div>
      </main>

    </div>
  );
}
