'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Crown,
  Sparkles,
  Check,
  ArrowRight,
  Loader2,
  TrendingUp,
  Users,
  Headphones,
  Award,
  Zap,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';

interface SubscriptionDetails {
  subscriptionTier: 'growth' | 'partner';
  subscriptionStatus: 'inactive' | 'active' | 'cancelled' | 'past_due';
  commissionRate: number;
  commissionType: 'fixed';
  monthlyFee: number;
  entryFeePaid: boolean;
  entryFeeAmount: number;
  benefits: {
    whitelabel: boolean;
    templates: number;
    support: 'standard' | 'priority';
    priorityResources?: boolean;
    partnerCertificate?: boolean;
    partnerGroup?: boolean;
    description?: string;
  };
}

interface PlanComparison {
  growth: {
    name: string;
    monthlyFee: number;
    commission: string;
    commissionDescription: string;
    features: string[];
  };
  partner: {
    name: string;
    monthlyFee: number;
    entryFee: number;
    commission: string;
    commissionDescription: string;
    features: string[];
    breakEvenAnalysis: {
      medicalCheckup: { name: string; avgAmount: number; commissionAt20Percent: number; dealsToRecoverEntryFee: number };
      treatment: { name: string; avgAmount: number; commissionAt20Percent: number; dealsToRecoverEntryFee: number };
      nightclub: { name: string; avgAmount: number; commissionAt20Percent: number; dealsToRecoverEntryFee: number };
    };
  };
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [guideId, setGuideId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [plans, setPlans] = useState<PlanComparison | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      // 获取导游信息
      const { data: guide, error: guideError } = await supabase
        .from('guides')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (guideError || !guide) {
        router.push('/guide-partner/login');
        return;
      }

      setGuideId(guide.id);

      // 并行获取订阅详情和套餐对比
      const [subRes, plansRes] = await Promise.all([
        fetch(`/api/guide/subscription?guideId=${guide.id}`),
        fetch('/api/guide/upgrade-to-partner'),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }
    } catch (err) {
      console.error('加载数据失败:', err);
      setError('加载数据失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!guideId) return;

    setUpgrading(true);
    setError(null);

    try {
      const res = await fetch('/api/guide/upgrade-to-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId,
          paymentMethod: 'full',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '升级失败，请重试');
        return;
      }

      // 跳转到 Stripe 支付页面
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error('升级失败:', err);
      setError('升级失败，请重试');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const isPartner = subscription?.subscriptionTier === 'partner';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/guide-partner/dashboard" className="text-gray-500 hover:text-gray-700">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold">订阅管理</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 当前套餐状态 */}
        <div className="mb-8">
          <div className={`rounded-2xl p-6 ${isPartner ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' : 'bg-white border'}`}>
            <div className="flex items-center gap-4 mb-4">
              {isPartner ? (
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                </div>
              )}
              <div>
                <h2 className={`text-2xl font-bold ${isPartner ? 'text-white' : 'text-gray-900'}`}>
                  {isPartner ? '导游合伙人' : '成长版'}
                </h2>
                <p className={`text-sm ${isPartner ? 'text-white/80' : 'text-gray-500'}`}>
                  {subscription?.subscriptionStatus === 'active' ? '订阅生效中' : '未激活'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className={`rounded-xl p-4 ${isPartner ? 'bg-white/10' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isPartner ? 'text-white/70' : 'text-gray-500'}`}>分成比例</p>
                <p className={`text-2xl font-bold ${isPartner ? 'text-white' : 'text-gray-900'}`}>
                  {((subscription?.commissionRate || 0) * 100).toFixed(0)}%
                </p>
                <p className={`text-xs ${isPartner ? 'text-white/60' : 'text-gray-400'}`}>
                  固定分成
                </p>
              </div>
              <div className={`rounded-xl p-4 ${isPartner ? 'bg-white/10' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isPartner ? 'text-white/70' : 'text-gray-500'}`}>月费</p>
                <p className={`text-2xl font-bold ${isPartner ? 'text-white' : 'text-gray-900'}`}>
                  ¥{subscription?.monthlyFee?.toLocaleString()}
                </p>
                <p className={`text-xs ${isPartner ? 'text-white/60' : 'text-gray-400'}`}>每月</p>
              </div>
              <div className={`rounded-xl p-4 ${isPartner ? 'bg-white/10' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isPartner ? 'text-white/70' : 'text-gray-500'}`}>模板数量</p>
                <p className={`text-2xl font-bold ${isPartner ? 'text-white' : 'text-gray-900'}`}>
                  {subscription?.benefits?.templates || 3}
                </p>
                <p className={`text-xs ${isPartner ? 'text-white/60' : 'text-gray-400'}`}>套可选</p>
              </div>
            </div>

          </div>
        </div>

        {/* 套餐对比 */}
        {!isPartner && plans && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">升级到导游合伙人</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 成长版 */}
              <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  <h4 className="text-lg font-bold text-gray-900">{plans.growth.name}</h4>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">当前</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ¥{plans.growth.monthlyFee.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">/月</span>
                </p>
                <p className="text-sm text-gray-500 mb-4">{plans.growth.commission}</p>
                <ul className="space-y-2">
                  {plans.growth.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 合伙人 */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-6 h-6" />
                    <h4 className="text-lg font-bold">{plans.partner.name}</h4>
                    <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">推荐</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-3xl font-bold">¥{plans.partner.monthlyFee.toLocaleString()}</span>
                    <span className="text-sm">/月</span>
                  </div>
                  <p className="text-sm text-white/80 mb-1">+ ¥{plans.partner.entryFee.toLocaleString()} 入场费（一次性）</p>
                  <p className="text-sm text-white/80 mb-4">{plans.partner.commission}</p>
                  <ul className="space-y-2 mb-6">
                    {plans.partner.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className="w-full py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        升级为合伙人
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 盈亏分析 */}
        {!isPartner && plans && (
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              回本分析
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              入场费 ¥{plans.partner.entryFee.toLocaleString()} 看起来很多？看看多快能回本：
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(plans.partner.breakEvenAnalysis).map(([key, analysis]) => (
                <div key={key} className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{analysis.name}</h4>
                  <p className="text-sm text-gray-500 mb-1">
                    平均客单价：¥{analysis.avgAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    20%分成：¥{analysis.commissionAt20Percent.toLocaleString()}
                  </p>
                  <p className="text-lg font-bold text-indigo-600">
                    {analysis.dealsToRecoverEntryFee < 1
                      ? '不到1单回本'
                      : `${Math.ceil(analysis.dealsToRecoverEntryFee)}单回本`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 合伙人专属权益 */}
        {isPartner && (
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              合伙人专属权益
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">20% 固定分成</h4>
                <p className="text-sm text-gray-500">无论销售额多少</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <Users className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">优先资源对接</h4>
                <p className="text-sm text-gray-500">新医院资源优先获得</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <Headphones className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">专属客服</h4>
                <p className="text-sm text-gray-500">直接对接负责人</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">合伙人证书</h4>
                <p className="text-sm text-gray-500">可展示在白标页面</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
