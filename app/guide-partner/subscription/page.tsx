'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Check, Loader2, AlertCircle, Crown, Sparkles } from 'lucide-react';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const translations = {
  pageTitle: {
    ja: '報酬制度',
    'zh-CN': '报酬制度',
    'zh-TW': '報酬制度',
    en: 'Reward System',
  },
  heading: {
    ja: '報酬制度',
    'zh-CN': '报酬制度',
    'zh-TW': '報酬制度',
    en: 'Reward System',
  },
  subtitle: {
    ja: 'ゴールドパートナーにアップグレードして、より高い報酬を獲得',
    'zh-CN': '升级金牌合伙人，享受更高报酬',
    'zh-TW': '升級金牌合夥人，享受更高報酬',
    en: 'Upgrade to Gold Partner for higher rewards',
  },
  growthName: {
    ja: '初期パートナー',
    'zh-CN': '初期合伙人',
    'zh-TW': '初期合夥人',
    en: 'Growth Partner',
  },
  growthDesc: {
    ja: '無料登録、固定10%の分成',
    'zh-CN': '免费注册，固定10%分成',
    'zh-TW': '免費註冊，固定10%分成',
    en: 'Free registration, fixed 10% commission',
  },
  growthFeature1: {
    ja: 'ナイトクラブ・カジノ・医療・ゴルフ',
    'zh-CN': '夜总会・赌场・医疗・高尔夫',
    'zh-TW': '夜總會・賭場・醫療・高爾夫',
    en: 'Nightclubs, Casinos, Medical, Golf',
  },
  growthFeature2: {
    ja: 'ホワイトラベルページ基本機能',
    'zh-CN': '白标页面基础功能',
    'zh-TW': '白標頁面基礎功能',
    en: 'White-label page basic features',
  },
  growthFeature3: {
    ja: '標準カスタマーサポート',
    'zh-CN': '标准客服支持',
    'zh-TW': '標準客服支持',
    en: 'Standard customer support',
  },
  partnerName: {
    ja: 'ゴールドパートナー',
    'zh-CN': '金牌合伙人',
    'zh-TW': '金牌合夥人',
    en: 'Gold Partner',
  },
  partnerDesc: {
    ja: '入場料20万円を一括支払い、固定20%の分成',
    'zh-CN': '一次支付20万日币入场费，固定享受 20% 分成',
    'zh-TW': '一次支付20萬日幣入場費，固定享受 20% 分成',
    en: 'One-time 200,000 JPY entry fee, fixed 20% commission',
  },
  partnerFeature1: {
    ja: 'ナイトクラブ・カジノ・医療・ゴルフ',
    'zh-CN': '夜总会・赌场・医疗・高尔夫',
    'zh-TW': '夜總會・賭場・醫療・高爾夫',
    en: 'Nightclubs, Casinos, Medical, Golf',
  },
  partnerFeature2: {
    ja: 'ホワイトラベルページ完全機能',
    'zh-CN': '白标页面完整功能',
    'zh-TW': '白標頁面完整功能',
    en: 'White-label page full features',
  },
  partnerFeature3: {
    ja: '専属カスタマーサポート・優先リソース',
    'zh-CN': '专属客服通道・优先资源对接',
    'zh-TW': '專屬客服通道・優先資源對接',
    en: 'Dedicated support channel & priority resources',
  },
  partnerFeature4: {
    ja: 'パートナー専用グループ・パートナー証書',
    'zh-CN': '合伙人专属群・合伙人证书',
    'zh-TW': '合夥人專屬群・合夥人證書',
    en: 'Partner exclusive group & partner certificate',
  },
  partnerFeature5: {
    ja: '年次パートナー大会への招待',
    'zh-CN': '年度合伙人大会邀请',
    'zh-TW': '年度合夥人大會邀請',
    en: 'Annual partner conference invitation',
  },
  recommend: {
    ja: 'おすすめ',
    'zh-CN': '推荐',
    'zh-TW': '推薦',
    en: 'Recommended',
  },
  currentPlan: {
    ja: '現在のプラン',
    'zh-CN': '当前套餐',
    'zh-TW': '當前套餐',
    en: 'Current Plan',
  },
  currentlyUsing: {
    ja: '現在使用中',
    'zh-CN': '当前使用中',
    'zh-TW': '當前使用中',
    en: 'Currently Active',
  },
  upgradeNow: {
    ja: '今すぐアップグレード',
    'zh-CN': '立即升级',
    'zh-TW': '立即升級',
    en: 'Upgrade Now',
  },
  subscribeNow: {
    ja: '今すぐ登録',
    'zh-CN': '立即订阅',
    'zh-TW': '立即訂閱',
    en: 'Subscribe Now',
  },
  selectPlan: {
    ja: 'このプランを選択',
    'zh-CN': '选择此套餐',
    'zh-TW': '選擇此套餐',
    en: 'Select This Plan',
  },
  perMonth: {
    ja: '/月',
    'zh-CN': '/月',
    'zh-TW': '/月',
    en: '/mo',
  },
  free: {
    ja: '無料',
    'zh-CN': '免费',
    'zh-TW': '免費',
    en: 'Free',
  },
  entryFee: {
    ja: '入場料 (一回限り)',
    'zh-CN': '入场费 (一次性)',
    'zh-TW': '入場費 (一次性)',
    en: 'Entry fee (one-time)',
  },
  fixedCommission: {
    ja: '固定分成比率',
    'zh-CN': '固定分成比例',
    'zh-TW': '固定分成比例',
    en: 'Fixed commission rate',
  },
  // Contract modal
  contractTitle: {
    ja: 'ゴールドパートナー入会契約',
    'zh-CN': '金牌合伙人入会合约',
    'zh-TW': '金牌合夥人入會合約',
    en: 'Gold Partner Membership Agreement',
  },
  contractSection1: {
    ja: '一、会費',
    'zh-CN': '一、会员费用',
    'zh-TW': '一、會員費用',
    en: '1. Membership Fees',
  },
  contractFee1: {
    ja: '1. 入場料：¥200,000（一括払い、永久有効）',
    'zh-CN': '1. 入场费：¥200,000（一次性支付，终身有效）',
    'zh-TW': '1. 入場費：¥200,000（一次性支付，終身有效）',
    en: '1. Entry fee: ¥200,000 (one-time payment, lifetime validity)',
  },
  contractFee2: {
    ja: '2. 月会費：¥4,980/月（自動更新）',
    'zh-CN': '2. 月会费：¥4,980/月（自动续订）',
    'zh-TW': '2. 月會費：¥4,980/月（自動續訂）',
    en: '2. Monthly fee: ¥4,980/month (auto-renewal)',
  },
  contractSection2: {
    ja: '二、分成比率',
    'zh-CN': '二、分成比例',
    'zh-TW': '二、分成比例',
    en: '2. Commission Rate',
  },
  contractCommission: {
    ja: 'ゴールドパートナーは全業務ラインで固定20%の分成比率を享受',
    'zh-CN': '金牌合伙人享受固定 20% 分成比例（所有业务线）',
    'zh-TW': '金牌合夥人享受固定 20% 分成比例（所有業務線）',
    en: 'Gold Partners enjoy a fixed 20% commission rate (all business lines)',
  },
  contractSection3: {
    ja: '三、ダウングレードと再入会',
    'zh-CN': '三、降级与重新入会',
    'zh-TW': '三、降級與重新入會',
    en: '3. Downgrade and Re-enrollment',
  },
  contractWarning1: {
    ja: '重要：月会費（¥4,980/月）の支払いを停止した場合、ゴールドパートナー資格は自動的に失効し、初期パートナー（無料・10%分成）にダウングレードされます。',
    'zh-CN': '重要提示：若您停止续费月会费（¥4,980/月），您的金牌合伙人资格将自动失效，降级为初期合伙人（免费・10%分成）。',
    'zh-TW': '重要提示：若您停止續費月會費（¥4,980/月），您的金牌合夥人資格將自動失效，降級為初期合夥人（免費・10%分成）。',
    en: 'Important: If you stop paying the monthly fee (¥4,980/month), your Gold Partner status will automatically expire and be downgraded to Growth Partner (free, 10% commission).',
  },
  contractWarning2: {
    ja: 'その後ゴールドパートナーに再アップグレードする場合、入場料¥200,000を再度お支払いいただく必要があります。',
    'zh-CN': '若之后需要重新升级为金牌合伙人，需要重新支付 ¥200,000 入场费。',
    'zh-TW': '若之後需要重新升級為金牌合夥人，需要重新支付 ¥200,000 入場費。',
    en: 'If you wish to re-upgrade to Gold Partner later, you will need to pay the ¥200,000 entry fee again.',
  },
  contractSection4: {
    ja: '四、権利説明',
    'zh-CN': '四、权益说明',
    'zh-TW': '四、權益說明',
    en: '4. Benefits',
  },
  benefit1: {
    ja: '優先リソース対応',
    'zh-CN': '优先资源对接',
    'zh-TW': '優先資源對接',
    en: 'Priority resource allocation',
  },
  benefit2: {
    ja: '専属カスタマーサポート',
    'zh-CN': '专属客服通道',
    'zh-TW': '專屬客服通道',
    en: 'Dedicated support channel',
  },
  benefit3: {
    ja: 'パートナー専用グループ',
    'zh-CN': '合伙人专属群',
    'zh-TW': '合夥人專屬群',
    en: 'Partner exclusive group',
  },
  benefit4: {
    ja: 'パートナー証書',
    'zh-CN': '合伙人证书',
    'zh-TW': '合夥人證書',
    en: 'Partner certificate',
  },
  benefit5: {
    ja: '年次パートナー大会への招待',
    'zh-CN': '年度合伙人大会邀请',
    'zh-TW': '年度合夥人大會邀請',
    en: 'Annual partner conference invitation',
  },
  cancel: {
    ja: 'キャンセル',
    'zh-CN': '取消',
    'zh-TW': '取消',
    en: 'Cancel',
  },
  agreeAndPay: {
    ja: '同意して支払い',
    'zh-CN': '同意并支付',
    'zh-TW': '同意並支付',
    en: 'Agree & Pay',
  },
  faqTitle: {
    ja: 'よくある質問',
    'zh-CN': '常见问题',
    'zh-TW': '常見問題',
    en: 'FAQ',
  },
  faq1: {
    ja: '各注文の分成比率は現在の会員等級に基づいて計算されます',
    'zh-CN': '每笔订单的分成比例根据您当前的会员等级计算',
    'zh-TW': '每筆訂單的分成比例根據您當前的會員等級計算',
    en: 'Commission rates are calculated based on your current membership tier for each order',
  },
  faq2: {
    ja: 'ゴールドパートナーの月会費はStripeで自動更新され、いつでもキャンセル可能',
    'zh-CN': '金牌合伙人月会费通过 Stripe 自动续订，可随时取消',
    'zh-TW': '金牌合夥人月會費通過 Stripe 自動續訂，可隨時取消',
    en: 'Gold Partner monthly fees are auto-renewed via Stripe and can be cancelled anytime',
  },
  faq3: {
    ja: 'ゴールドパートナーの入場料は一括払い、永久有効（月会費の継続が必要）',
    'zh-CN': '金牌合伙人的入场费一次支付，终身有效（需保持月会费续订）',
    'zh-TW': '金牌合夥人的入場費一次支付，終身有效（需保持月會費續訂）',
    en: 'Gold Partner entry fee is a one-time payment with lifetime validity (monthly fee renewal required)',
  },
  errorLoadFailed: {
    ja: 'ガイド情報の読み込みに失敗しました',
    'zh-CN': '加载导游信息失败',
    'zh-TW': '加載導遊信息失敗',
    en: 'Failed to load guide information',
  },
  errorRefresh: {
    ja: '読み込みに失敗しました。ページを更新してください',
    'zh-CN': '加载失败，请刷新页面',
    'zh-TW': '加載失敗，請刷新頁面',
    en: 'Failed to load. Please refresh the page',
  },
  errorPaymentFailed: {
    ja: '支払いの作成に失敗しました',
    'zh-CN': '创建支付失败',
    'zh-TW': '創建支付失敗',
    en: 'Failed to create payment',
  },
  errorUpgradeFailed: {
    ja: 'アップグレードに失敗しました。再度お試しください',
    'zh-CN': '升级失败，请重试',
    'zh-TW': '升級失敗，請重試',
    en: 'Upgrade failed. Please try again',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

interface SubscriptionPlan {
  code: 'growth' | 'partner';
  name: string;
  monthlyFee: number;
  entryFee: number;
  commission: string;
  features: string[];
  description: string;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const supabase = createClient();
  const lang = useLanguage();

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [currentTier, setCurrentTier] = useState<'growth' | 'partner' | null>(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [guideId, setGuideId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showContract, setShowContract] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'growth' | 'partner' | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      code: 'growth',
      name: t('growthName', lang),
      monthlyFee: 0,
      entryFee: 0,
      commission: '10%',
      description: t('growthDesc', lang),
      features: [
        t('growthFeature1', lang),
        t('growthFeature2', lang),
        t('growthFeature3', lang),
      ],
    },
    {
      code: 'partner',
      name: t('partnerName', lang),
      monthlyFee: 4980,
      entryFee: 200000,
      commission: '20%',
      description: t('partnerDesc', lang),
      features: [
        t('partnerFeature1', lang),
        t('partnerFeature2', lang),
        t('partnerFeature3', lang),
        t('partnerFeature4', lang),
        t('partnerFeature5', lang),
      ],
    },
  ];

  useEffect(() => {
    loadGuideInfo();
  }, []);

  const loadGuideInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: guide } = await supabase
        .from('guides')
        .select('id, subscription_tier, subscription_status')
        .eq('auth_user_id', user.id)
        .single();

      if (guide) {
        setGuideId(guide.id);
        setCurrentTier(guide.subscription_tier || 'growth');
        setSubscriptionActive(guide.subscription_status === 'active');
      }
    } catch (err) {
      console.error(t('errorLoadFailed', lang), err);
      setError(t('errorRefresh', lang));
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planCode: 'growth' | 'partner') => {
    if (!guideId) return;

    setSelectedPlan(planCode);

    // 如果是金牌合伙人，显示合约
    if (planCode === 'partner') {
      setShowContract(true);
      return;
    }

    // 初期合伙人直接创建订阅
    await createSubscription(planCode);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;
    setShowContract(false);
    await createSubscription(selectedPlan);
  };

  const createSubscription = async (planCode: 'growth' | 'partner') => {
    setUpgrading(true);
    setError(null);

    try {
      const response = await fetch('/api/guide/upgrade-to-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId,
          planCode,
          successUrl: `${window.location.origin}/guide-partner/dashboard?upgrade=success`,
          cancelUrl: `${window.location.origin}/guide-partner/subscription?upgrade=cancelled`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('errorPaymentFailed', lang));
      }

      // 跳转到 Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setError(err.message || t('errorUpgradeFailed', lang));
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />
      <main className="lg:ml-64 pt-16 lg:pt-0"><div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-brand-900 mb-3">{t('heading', lang)}</h1>
          <p className="text-neutral-600">{t('subtitle', lang)}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">×</button>
          </div>
        )}

        {/* Plans Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrent = currentTier === plan.code;
            const isUpgrade = currentTier === 'growth' && plan.code === 'partner';

            return (
              <div
                key={plan.code}
                className={`relative bg-white border-2 p-8 transition-all ${
                  plan.code === 'partner'
                    ? 'border-amber-400 scale-105'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Badge */}
                {plan.code === 'partner' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-1 text-sm font-bold">
                      <Crown size={14} /> {t('recommend', lang)}
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 text-xs font-medium">
                      <Check size={12} /> {t('currentPlan', lang)}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 flex items-center justify-center mb-4 ${
                  plan.code === 'partner' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                  {plan.code === 'partner' ? (
                    <Crown size={28} className="text-amber-600" />
                  ) : (
                    <Sparkles size={28} className="text-green-600" />
                  )}
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-brand-900 mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1 mb-1">
                    {plan.monthlyFee === 0 ? (
                      <span className="text-4xl font-bold text-green-600">{t('free', lang)}</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-neutral-900">¥{plan.monthlyFee.toLocaleString()}</span>
                        <span className="text-neutral-500">{t('perMonth', lang)}</span>
                      </>
                    )}
                  </div>
                  {plan.entryFee > 0 && (
                    <div className="text-sm text-neutral-600">
                      + ¥{plan.entryFee.toLocaleString()} {t('entryFee', lang)}
                    </div>
                  )}
                </div>

                {/* Commission */}
                <div className="bg-neutral-50 p-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-1">{plan.commission}</div>
                    <div className="text-xs text-neutral-500">{t('fixedCommission', lang)}</div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.code === 'growth' && currentTier === 'growth' ? (
                  <div className="text-center text-sm text-neutral-500 py-3">{t('currentlyUsing', lang)}</div>
                ) : isCurrent && subscriptionActive ? (
                  <div className="text-center text-sm text-neutral-500 py-3">{t('currentlyUsing', lang)}</div>
                ) : isUpgrade ? (
                  <button
                    onClick={() => handleUpgrade(plan.code)}
                    disabled={upgrading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50"
                  >
                    {upgrading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t('upgradeNow', lang)}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.code)}
                    disabled={upgrading}
                    className="w-full py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {t('selectPlan', lang)}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 合约弹窗 */}
        {showContract && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold font-serif text-brand-900 mb-4">{t('contractTitle', lang)}</h2>

              <div className="prose prose-sm mb-6 text-neutral-600 space-y-3">
                <h3 className="font-bold text-brand-900">{t('contractSection1', lang)}</h3>
                <p>{t('contractFee1', lang)}</p>
                <p>{t('contractFee2', lang)}</p>

                <h3 className="font-bold text-brand-900">{t('contractSection2', lang)}</h3>
                <p>{t('contractCommission', lang)}</p>

                <h3 className="font-bold text-brand-900">{t('contractSection3', lang)}</h3>
                <p className="text-red-600 font-medium">{t('contractWarning1', lang)}</p>
                <p className="text-red-600 font-medium">{t('contractWarning2', lang)}</p>

                <h3 className="font-bold text-brand-900">{t('contractSection4', lang)}</h3>
                <ul className="list-disc pl-5">
                  <li>{t('benefit1', lang)}</li>
                  <li>{t('benefit2', lang)}</li>
                  <li>{t('benefit3', lang)}</li>
                  <li>{t('benefit4', lang)}</li>
                  <li>{t('benefit5', lang)}</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowContract(false); setSelectedPlan(null); }}
                  className="flex-1 py-3 border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50"
                >
                  {t('cancel', lang)}
                </button>
                <button
                  onClick={confirmUpgrade}
                  disabled={upgrading}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold hover:from-amber-600 hover:to-amber-700 disabled:opacity-50"
                >
                  {upgrading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t('agreeAndPay', lang)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 说明 */}
        <div className="bg-blue-50 border border-blue-200 p-6">
          <h4 className="font-bold text-blue-900 mb-2">{t('faqTitle', lang)}</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• {t('faq1', lang)}</p>
            <p>• {t('faq2', lang)}</p>
            <p>• {t('faq3', lang)}</p>
          </div>
        </div>
      </div></main>
    </div>
  );
}
