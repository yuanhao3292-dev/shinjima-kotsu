'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Check, Loader2, AlertCircle, Crown, Sparkles } from 'lucide-react';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';

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

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [currentTier, setCurrentTier] = useState<'growth' | 'partner' | null>(null);
  const [guideId, setGuideId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showContract, setShowContract] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'growth' | 'partner' | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      code: 'growth',
      name: '初期合伙人',
      monthlyFee: 1980,
      entryFee: 0,
      commission: '10%',
      description: '每月1,980日币会员费，固定10%分成',
      features: [
        '夜总会・赌场・医疗・高尔夫',
        '白标页面基础功能',
        '标准客服支持',
      ],
    },
    {
      code: 'partner',
      name: '金牌合伙人',
      monthlyFee: 4980,
      entryFee: 200000,
      commission: '20%',
      description: '一次支付20万日币入场费，固定享受 20% 分成',
      features: [
        '夜总会・赌场・医疗・高尔夫',
        '白标页面完整功能',
        '专属客服通道・优先资源对接',
        '合伙人专属群・合伙人证书',
        '年度合伙人大会邀请',
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
        .select('id, subscription_tier')
        .eq('auth_user_id', user.id)
        .single();

      if (guide) {
        setGuideId(guide.id);
        setCurrentTier(guide.subscription_tier || 'growth');
      }
    } catch (err) {
      console.error('加载导游信息失败:', err);
      setError('加载失败，请刷新页面');
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
        throw new Error(data.error || '创建支付失败');
      }

      // 跳转到 Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setError(err.message || '升级失败，请重试');
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
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle="报酬制度" />
      <main className="lg:ml-64 pt-16 lg:pt-0"><div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">报酬制度</h1>
          <p className="text-gray-600">升级金牌合伙人，享受更高报酬</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
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
                className={`relative bg-white rounded-2xl border-2 p-8 transition-all ${
                  plan.code === 'partner'
                    ? 'border-amber-400 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Badge */}
                {plan.code === 'partner' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      <Crown size={14} /> 推荐
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      <Check size={12} /> 当前套餐
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  plan.code === 'partner' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                  {plan.code === 'partner' ? (
                    <Crown size={28} className="text-amber-600" />
                  ) : (
                    <Sparkles size={28} className="text-green-600" />
                  )}
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-gray-900">¥{plan.monthlyFee.toLocaleString()}</span>
                    <span className="text-gray-500">/月</span>
                  </div>
                  {plan.entryFee > 0 && (
                    <div className="text-sm text-gray-600">
                      + ¥{plan.entryFee.toLocaleString()} 入场费 (一次性)
                    </div>
                  )}
                </div>

                {/* Commission */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-1">{plan.commission}</div>
                    <div className="text-xs text-gray-500">固定分成比例</div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <div className="text-center text-sm text-gray-500 py-3">当前使用中</div>
                ) : isUpgrade ? (
                  <button
                    onClick={() => handleUpgrade(plan.code)}
                    disabled={upgrading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-bold hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50"
                  >
                    {upgrading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : '立即升级'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.code)}
                    disabled={upgrading}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    选择此套餐
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 合约弹窗 */}
        {showContract && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">金牌合伙人入会合约</h2>

              <div className="prose prose-sm mb-6 text-gray-600 space-y-3">
                <h3 className="font-bold text-gray-900">一、会员费用</h3>
                <p>1. 入场费：¥200,000（一次性支付，终身有效）</p>
                <p>2. 月会费：¥4,980/月（自动续订）</p>

                <h3 className="font-bold text-gray-900">二、分成比例</h3>
                <p>金牌合伙人享受固定 20% 分成比例（所有业务线）</p>

                <h3 className="font-bold text-gray-900">三、降级与重新入会</h3>
                <p className="text-red-600 font-medium">
                  ⚠️ 重要提示：若您停止续费月会费（¥4,980/月），您的金牌合伙人资格将自动失效，降级为初期合伙人（10%分成）。
                </p>
                <p className="text-red-600 font-medium">
                  若之后需要重新升级为金牌合伙人，需要重新支付 ¥200,000 入场费。
                </p>

                <h3 className="font-bold text-gray-900">四、权益说明</h3>
                <ul className="list-disc pl-5">
                  <li>优先资源对接</li>
                  <li>专属客服通道</li>
                  <li>合伙人专属群</li>
                  <li>合伙人证书</li>
                  <li>年度合伙人大会邀请</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowContract(false); setSelectedPlan(null); }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={confirmUpgrade}
                  disabled={upgrading}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-bold hover:from-amber-600 hover:to-amber-700 disabled:opacity-50"
                >
                  {upgrading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : '同意并支付'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-bold text-blue-900 mb-2">💡 常见问题</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• 每笔订单的分成比例根据您当前的会员等级计算</p>
            <p>• 月会费通过 Stripe 自动续订，可随时取消</p>
            <p>• 金牌合伙人的入场费一次支付，终身有效（需保持月会费续订）</p>
          </div>
        </div>
      </div></main>
    </div>
  );
}
