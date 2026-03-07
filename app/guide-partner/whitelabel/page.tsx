'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_SELECTED_PAGES } from '@/lib/whitelabel-config';
import { SUBSCRIPTION_PLANS } from '@/lib/whitelabel-config';
import {
  Globe,
  Palette,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Save,
  Package,
  ChevronRight,
  Car,
  User,
} from 'lucide-react';

interface GuideWhiteLabelData {
  id: string;
  name: string;
  slug: string | null;
  brand_name: string | null;
  brand_logo_url: string | null;
  brand_color: string;
  contact_wechat: string | null;
  contact_line: string | null;
  contact_display_phone: string | null;
  email: string | null;
  subscription_status: 'inactive' | 'active' | 'cancelled' | 'past_due';
  subscription_plan: string | null;
  subscription_end_date: string | null;
  whitelabel_views: number;
  whitelabel_conversions: number;
}

export default function WhiteLabelSettingsPage() {
  const [guide, setGuide] = useState<GuideWhiteLabelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscribing, setSubscribing] = useState(false);  // 订阅按钮 loading 状态
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasWhiteLabelConfig, setHasWhiteLabelConfig] = useState(true); // guide_white_label 记录是否存在

  // 表单状态
  const [formData, setFormData] = useState({
    slug: '',
    brandName: '',
    brandTagline: '',
    contactWechat: '',
    contactLine: '',
    contactDisplayPhone: '',
    contactEmail: '',
    selectedPages: DEFAULT_SELECTED_PAGES as string[],
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // 分销页面 URL（路径模式）
  const whiteLabelUrl = guide?.slug
    ? `https://bespoketrip.jp/g/${guide.slug}`
    : null;

  // 初始加载导游数据（仅执行一次）
  useEffect(() => {
    loadGuideData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 检查订阅回调参数（仅在 URL 参数变化时执行）
  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      // 付款成功后，主动同步订阅状态（Webhook 可能延迟）
      syncSubscriptionStatus();
      setShowSuccessModal(true);
      // 清除 URL 参数，避免刷新时重复显示
      window.history.replaceState({}, '', '/guide-partner/whitelabel');
    } else if (subscriptionStatus === 'cancelled') {
      setMessage({ type: 'error', text: '订阅已取消。' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 从 Stripe 同步订阅状态（Webhook 备用机制）
  const syncSubscriptionStatus = async () => {
    if (!guide?.id) {
      // 如果 guide 还没加载，等待加载后再同步
      const checkAndSync = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: guideData } = await supabase
          .from('guides')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (guideData?.id) {
          try {
            await fetch('/api/whitelabel/sync-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ guideId: guideData.id }),
            });
            // 同步后重新加载数据
            loadGuideData();
          } catch (error) {
            console.error('订阅状态同步失败:', error);
          }
        }
      };
      checkAndSync();
      return;
    }

    try {
      await fetch('/api/whitelabel/sync-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideId: guide.id }),
      });
      // 同步后重新加载数据
      loadGuideData();
    } catch (error) {
      console.error('订阅状态同步失败:', error);
    }
  };

  // ESC 键关闭弹窗
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSuccessModal) {
        setShowSuccessModal(false);
        loadGuideData();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showSuccessModal]);

  const loadGuideData = async () => {
    try {
      // 使用 API 获取数据，避免直接调用客户端 Supabase
      const response = await fetch('/api/whitelabel/settings');

      if (response.status === 401) {
        router.push('/guide-partner/login');
        return;
      }

      if (response.status === 404) {
        // 用户已登录但没有导游资料，显示错误而不是登出
        const errorData = await response.json();
        console.error('导游资料不存在:', errorData);
        setMessage({
          type: 'error',
          text: '未找到您的导游资料。请确认您的账户已关联导游身份。'
        });
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load guide data');
      }

      const guideData = await response.json();

      setGuide({
        id: guideData.id,
        name: guideData.name,
        slug: guideData.slug,
        brand_name: guideData.brandName,
        brand_logo_url: guideData.brandLogoUrl,
        brand_color: guideData.brandColor,
        contact_wechat: guideData.contactWechat,
        contact_line: guideData.contactLine,
        contact_display_phone: guideData.contactDisplayPhone,
        email: guideData.email,
        subscription_status: guideData.subscriptionStatus,
        subscription_plan: guideData.subscriptionPlan,
        subscription_end_date: guideData.subscriptionEndDate,
        whitelabel_views: guideData.whiteLabelViews,
        whitelabel_conversions: guideData.whiteLabelConversions,
      });
      setFormData({
        slug: guideData.slug || '',
        brandName: guideData.brandName || '',
        brandTagline: guideData.brandTagline || '',
        contactWechat: guideData.contactWechat || '',
        contactLine: guideData.contactLine || '',
        contactDisplayPhone: guideData.contactDisplayPhone || '',
        contactEmail: guideData.email || '',
        selectedPages: guideData.selectedPages || DEFAULT_SELECTED_PAGES,
      });

      // 检查 guide_white_label 记录是否存在（公开分销页面依赖此记录）
      if (guideData.subscription_status === 'active') {
        const { data: wlConfig } = await supabase
          .from('guide_white_label')
          .select('id')
          .eq('guide_id', guideData.id)
          .single();
        setHasWhiteLabelConfig(!!wlConfig);
      }
    } catch (error) {
      console.error('Error loading guide data:', error);
      router.push('/guide-partner/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!guide) return;

    setSaving(true);
    setMessage(null);

    try {
      // 使用 API 更新数据
      const response = await fetch('/api/whitelabel/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.slug || null,
          brandName: formData.brandName || null,
          brandTagline: formData.brandTagline || null,
          contactWechat: formData.contactWechat || null,
          contactLine: formData.contactLine || null,
          contactDisplayPhone: formData.contactDisplayPhone || null,
          contactEmail: formData.contactEmail || null,
          selectedPages: formData.selectedPages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setMessage({ type: 'error', text: '此 URL 标识已被使用，请选择其他名称' });
        } else if (response.status === 403) {
          setMessage({ type: 'error', text: '请先订阅分销服务' });
        } else if (data.details) {
          // 验证错误
          const firstError = data.details[0];
          setMessage({ type: 'error', text: firstError?.message || '保存失败' });
        } else {
          setMessage({ type: 'error', text: data.error || '保存失败' });
        }
        setSaving(false);
        return;
      }

      // 2. 同步创建/更新 guide_white_label 记录（选品中心依赖此表）
      const { error: wlError } = await supabase
        .from('guide_white_label')
        .upsert({
          guide_id: guide.id,
          slug: formData.slug,
          display_name: formData.brandName || guide.name,
          contact_wechat: formData.contactWechat || null,
          contact_line: formData.contactLine || null,
          contact_phone: formData.contactDisplayPhone || null,
          contact_email: formData.contactEmail || null,
          is_published: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'guide_id',
        });

      if (wlError) {
        console.error('[handleSave] guide_white_label upsert error:', wlError);
        // 不阻止保存成功提示，guides 表已更新
        if (wlError.code === '23505') {
          // slug 冲突
          setMessage({ type: 'error', text: '此 URL 标识已被其他导游使用' });
          setSaving(false);
          return;
        }
      }

      setMessage({ type: 'success', text: '设置已保存' });
      setHasWhiteLabelConfig(true);
      loadGuideData();
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请稍后重试' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = async (plan: 'professional' = 'professional') => {
    if (!guide) return;

    // 防止重复点击
    if (subscribing) return;
    setSubscribing(true);
    setMessage(null);

    console.log('[handleSubscribe] 开始订阅，导游信息:', { id: guide.id, name: guide.name });

    try {
      const requestBody = {
        guideId: guide.id,
        successUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=success`,
        cancelUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=cancelled`,
      };
      console.log('[handleSubscribe] 发送请求:', requestBody);

      const response = await fetch('/api/whitelabel/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId: guide.id,
          plan,
          successUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=success`,
          cancelUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=cancelled`,
        }),
      });

      console.log('[handleSubscribe] 响应状态:', response.status);

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: data.error || '创建订阅失败' });
        setSubscribing(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '创建订阅失败，请稍后重试' });
      setSubscribing(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!guide) return;

    try {
      const response = await fetch('/api/whitelabel/manage-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId: guide.id,
          returnUrl: `${window.location.origin}/guide-partner/whitelabel`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: data.error || '无法打开订阅管理' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '无法打开订阅管理，请稍后重试' });
    }
  };

  const copyUrl = () => {
    if (whiteLabelUrl) {
      navigator.clipboard.writeText(whiteLabelUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!guide) {
    // 导游资料不存在时显示错误信息
    return (
      <div className="min-h-screen bg-gray-50">
        <GuideSidebar pageTitle="分销页面" />
        <main className="lg:ml-64 pt-16 lg:pt-0">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {message && (
              <div className="p-4 rounded-lg flex items-center gap-3 bg-red-50 text-red-800 border border-red-200">
                <AlertCircle size={20} />
                <span>{message.text}</span>
              </div>
            )}
            <div className="mt-6 bg-white rounded-xl border p-6 text-center">
              <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">未找到导游资料</h2>
              <p className="text-gray-600 mb-6">
                您的账户尚未关联导游身份，无法使用分销页面功能。<br />
                请联系管理员完成账户关联。
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isSubscribed = guide.subscription_status === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle="分销页面" />

      {/* 订阅成功弹窗 */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowSuccessModal(false);
            loadGuideData();
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 成功图标 */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>

            {/* 标题 */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 订阅成功！
            </h2>

            {/* 描述 */}
            <p className="text-gray-600 mb-6">
              恭喜您！分销页面订阅已激活。<br />
              现在可以开始设置您的专属品牌页面了。
            </p>

            {/* 订阅信息 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">订阅套餐</span>
                <span className="font-medium">分销页面 - 月度</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">订阅费用</span>
                <span className="font-bold text-blue-600">¥1,980/月</span>
              </div>
            </div>

            {/* 提示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-left">
              <p className="text-blue-800 text-sm">
                <strong>📧 确认邮件已发送</strong><br />
                我们已向您的注册邮箱发送了订阅确认邮件，请注意查收。
              </p>
            </div>

            {/* 按钮 */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                loadGuideData(); // 重新加载数据以显示激活状态
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              开始设置分销页面
            </button>
          </div>
        </div>
      )}

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8">
        {/* 消息提示 */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* 订阅方案选择 */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard size={20} />
                订阅方案
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                选择适合您的订阅方案
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSubscribed
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isSubscribed ? '已订阅' : '未订阅'}
            </div>
          </div>

          {/* 专业版 */}
          <div className={`p-5 rounded-xl border-2 transition ${
            isSubscribed
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{SUBSCRIPTION_PLANS.professional.name}</h3>
              <span className="text-2xl font-bold">¥{SUBSCRIPTION_PLANS.professional.priceJpy}<span className="text-sm font-normal text-gray-500">/月</span></span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              {SUBSCRIPTION_PLANS.professional.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            {!isSubscribed && (
              <button
                onClick={() => handleSubscribe('professional')}
                disabled={subscribing}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {subscribing && <Loader2 size={16} className="animate-spin" />}
                {subscribing ? '处理中...' : '立即订阅'}
              </button>
            )}
          </div>

          {isSubscribed && (
            <div className="mt-4 flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-500">
                下次续费日期：{guide.subscription_end_date ? new Date(guide.subscription_end_date).toLocaleDateString('zh-CN') : '-'}
              </p>
              <button
                onClick={handleManageSubscription}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                管理订阅
              </button>
            </div>
          )}
        </div>

        {/* 分销页面 URL */}
        {isSubscribed && (
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Globe size={20} />
              您的专属页面链接
            </h2>

            {whiteLabelUrl ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm truncate">
                  {whiteLabelUrl}
                </div>
                <button
                  onClick={copyUrl}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition"
                  title="复制链接"
                >
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
                <a
                  href={whiteLabelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border rounded-lg hover:bg-gray-50 transition"
                  title="打开页面"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                请先设置 URL 标识以生成您的专属链接
              </p>
            )}

            {/* 分销页面配置缺失提示 */}
            {!hasWhiteLabelConfig && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 font-medium text-sm">分销页面尚未生成</p>
                  <p className="text-amber-700 text-sm mt-1">
                    请先完善下方的品牌设置和联系方式，然后点击「保存设置」按钮以生成您的专属分销页面。
                  </p>
                </div>
              </div>
            )}

            {/* 统计数据 */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {guide.whitelabel_views.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">页面浏览量</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {guide.whitelabel_conversions.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">订单转化</div>
              </div>
            </div>
          </div>
        )}

        {/* 选品中心入口 */}
        {isSubscribed && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Package size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">选品中心</h2>
                  <p className="text-white/80 text-sm mt-1">
                    选择要在您页面展示的医疗服务、车辆等产品模块
                  </p>
                </div>
              </div>
              <Link
                href="/guide-partner/product-center"
                className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-xl font-medium hover:bg-white/90 transition"
              >
                进入选品
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* 快速信息 */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                  <Package size={14} />
                  服务模块
                </div>
                <div className="text-lg font-bold">自由选择</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                  <User size={14} />
                  自我介绍
                </div>
                <div className="text-lg font-bold">多种模板</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                  <Car size={14} />
                  车辆展示
                </div>
                <div className="text-lg font-bold">丰富车型</div>
              </div>
            </div>
          </div>
        )}

        {/* 品牌设置 */}
        <div className={`bg-white rounded-xl border p-6 ${!isSubscribed ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Palette size={20} />
            品牌设置
          </h2>

          <div className="space-y-6">
            {/* URL 标识 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                专属页面标识
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">bespoketrip.jp/g/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  placeholder="your-name"
                  className="w-40 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                只能使用小写字母、数字和连字符（3-50个字符）
              </p>
            </div>

            {/* 品牌名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                品牌名称
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder="例：日本定制游 - 小王"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                将替换导航栏和页脚的品牌名称
              </p>
            </div>

            {/* 品牌英文名 (导航栏副标题) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                品牌英文名
              </label>
              <input
                type="text"
                value={formData.brandTagline}
                onChange={(e) => setFormData({ ...formData, brandTagline: e.target.value })}
                placeholder="例：Bespoke Japan Travel"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                显示在导航栏品牌名称下方的英文副标题
              </p>
            </div>

          </div>
        </div>

        {/* 联系方式 */}
        <div className={`bg-white rounded-xl border p-6 ${!isSubscribed ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <MessageCircle size={20} />
            联系方式
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            这些信息将显示在分销页面右下角的悬浮联系按钮中，方便客户联系您
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                微信号
              </label>
              <input
                type="text"
                value={formData.contactWechat}
                onChange={(e) => setFormData({ ...formData, contactWechat: e.target.value })}
                placeholder="your_wechat_id"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LINE ID
              </label>
              <input
                type="text"
                value={formData.contactLine}
                onChange={(e) => setFormData({ ...formData, contactLine: e.target.value })}
                placeholder="your_line_id"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                显示电话
              </label>
              <input
                type="tel"
                value={formData.contactDisplayPhone}
                onChange={(e) => setFormData({ ...formData, contactDisplayPhone: e.target.value })}
                placeholder="+86 138-xxxx-xxxx"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                此邮箱将显示在分销页面的联系方式中
              </p>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        {isSubscribed && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              保存设置
            </button>
          </div>
        )}

        {/* 未订阅提示 */}
        {!isSubscribed && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <AlertCircle size={32} className="mx-auto text-amber-500 mb-3" />
            <h3 className="font-bold text-amber-800 mb-2">需要订阅才能使用品牌展示网站功能</h3>
            <p className="text-amber-700 text-sm mb-4">
              每月仅需 ¥1,980，即可获得专属品牌展示页面，所有客户通过您的链接访问都将自动归属于您。
            </p>
            <button
              onClick={() => handleSubscribe('professional')}
              disabled={subscribing}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {subscribing && <Loader2 size={16} className="animate-spin" />}
              {subscribing ? '处理中...' : '立即订阅'}
            </button>
          </div>
        )}

        {/* 法律声明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            <AlertCircle size={18} />
            重要法律声明
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• 品牌展示网站为新岛交通株式会社系统的授权使用</li>
            <li>• 网站上的所有旅行服务由新岛交通株式会社（大阪府知事登录旅行业 第2-3115号）提供</li>
            <li>• 您的角色为「客户介绍者」，不是独立的旅行服务提供者</li>
            <li>• 所有旅行服务合同均在新岛交通与客户之间签订</li>
            <li>• 网站底部将自动显示服务提供者信息及旅行业登录号</li>
          </ul>
        </div>
        </div>
      </main>
    </div>
  );
}
