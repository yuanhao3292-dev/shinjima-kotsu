'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import {
  ArrowLeft,
  Globe,
  Palette,
  MessageCircle,
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Save
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
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    slug: '',
    brandName: '',
    brandLogoUrl: '',
    brandColor: '#2563eb',
    contactWechat: '',
    contactLine: '',
    contactDisplayPhone: '',
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // 白标页面 URL
  const whiteLabelUrl = guide?.slug
    ? `https://bespoketrip.jp/p/${guide.slug}`
    : null;

  useEffect(() => {
    loadGuideData();

    // 检查订阅状态参数
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      setMessage({ type: 'success', text: '订阅成功！您的白标页面已激活。' });
    } else if (subscriptionStatus === 'cancelled') {
      setMessage({ type: 'error', text: '订阅已取消。' });
    }
  }, [searchParams]);

  const loadGuideData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: guideData, error } = await supabase
        .from('guides')
        .select(`
          id, name, slug, brand_name, brand_logo_url, brand_color,
          contact_wechat, contact_line, contact_display_phone, email,
          subscription_status, subscription_plan, subscription_end_date,
          whitelabel_views, whitelabel_conversions
        `)
        .eq('auth_user_id', user.id)
        .single();

      if (error || !guideData) {
        router.push('/guide-partner/login');
        return;
      }

      setGuide(guideData);
      setFormData({
        slug: guideData.slug || '',
        brandName: guideData.brand_name || '',
        brandLogoUrl: guideData.brand_logo_url || '',
        brandColor: guideData.brand_color || '#2563eb',
        contactWechat: guideData.contact_wechat || '',
        contactLine: guideData.contact_line || '',
        contactDisplayPhone: guideData.contact_display_phone || '',
      });
    } catch (error) {
      console.error('Error loading guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!guide) return;

    setSaving(true);
    setMessage(null);

    try {
      // 验证 slug 格式
      if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
        setMessage({ type: 'error', text: 'URL 标识只能包含小写字母、数字和连字符' });
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('guides')
        .update({
          slug: formData.slug || null,
          brand_name: formData.brandName || null,
          brand_logo_url: formData.brandLogoUrl || null,
          brand_color: formData.brandColor,
          contact_wechat: formData.contactWechat || null,
          contact_line: formData.contactLine || null,
          contact_display_phone: formData.contactDisplayPhone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', guide.id);

      if (error) {
        if (error.code === '23505') {
          setMessage({ type: 'error', text: '此 URL 标识已被使用，请选择其他名称' });
        } else {
          setMessage({ type: 'error', text: '保存失败：' + error.message });
        }
      } else {
        setMessage({ type: 'success', text: '设置已保存' });
        loadGuideData(); // 重新加载数据
      }
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请稍后重试' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = async () => {
    if (!guide) return;

    try {
      const response = await fetch('/api/whitelabel/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId: guide.id,
          successUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=success`,
          cancelUrl: `${window.location.origin}/guide-partner/whitelabel?subscription=cancelled`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: data.error || '创建订阅失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '创建订阅失败，请稍后重试' });
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
    return null;
  }

  const isSubscribed = guide.subscription_status === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/guide-partner/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold">白标页面设置</h1>
              <p className="text-sm text-gray-500">自定义您的专属品牌页面</p>
            </div>
          </div>
          <Logo className="w-8 h-8" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
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

        {/* 订阅状态卡片 */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard size={20} />
                订阅状态
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                订阅后即可使用白标页面功能
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSubscribed
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isSubscribed ? '已激活' : '未订阅'}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">¥1,980 / 月</div>
                <div className="text-sm text-gray-500">白标页面订阅</div>
              </div>
              {isSubscribed ? (
                <button
                  onClick={handleManageSubscription}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  管理订阅
                </button>
              ) : (
                <button
                  onClick={handleSubscribe}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  立即订阅
                </button>
              )}
            </div>
          </div>

          {isSubscribed && guide.subscription_end_date && (
            <p className="mt-4 text-sm text-gray-500">
              下次续费日期：{new Date(guide.subscription_end_date).toLocaleDateString('zh-CN')}
            </p>
          )}
        </div>

        {/* 白标 URL */}
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
                URL 标识
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">bespoketrip.jp/p/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  placeholder="your-name"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                只能使用小写字母、数字和连字符
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

            {/* 品牌 Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                品牌 Logo URL
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="url"
                  value={formData.brandLogoUrl}
                  onChange={(e) => setFormData({ ...formData, brandLogoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.brandLogoUrl && (
                  <img
                    src={formData.brandLogoUrl}
                    alt="Logo Preview"
                    className="w-10 h-10 object-contain border rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>

            {/* 品牌颜色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                品牌主色
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.brandColor}
                  onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.brandColor}
                  onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                  className="w-32 px-4 py-2 border rounded-lg font-mono text-sm"
                />
              </div>
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
            这些信息将显示在白标页面的页脚，方便客户联系您
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
            <h3 className="font-bold text-amber-800 mb-2">需要订阅才能使用白标功能</h3>
            <p className="text-amber-700 text-sm mb-4">
              每月仅需 ¥1,980，即可获得专属品牌页面，所有客户通过您的链接访问都将自动归属于您。
            </p>
            <button
              onClick={handleSubscribe}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium"
            >
              立即订阅
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
