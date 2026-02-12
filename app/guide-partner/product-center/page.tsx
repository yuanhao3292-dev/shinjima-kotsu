'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Package,
  Plus,
  Check,
  Loader2,
  AlertCircle,
  Stethoscope,
  ArrowRight,
  Hospital,
  ExternalLink,
  Settings,
  Sparkles,
} from 'lucide-react';
import {
  PRODUCT_CATEGORIES,
  getActiveCategories,
  MODULE_DETAIL_ROUTES,
} from '@/lib/config/product-categories';
import type { ProductCategory } from '@/lib/config/product-categories';

interface PageModule {
  id: string;
  module_type: string;
  name: string;
  name_ja: string | null;
  name_zh: string | null;
  description: string | null;
  description_zh: string | null;
  icon_url: string | null;
  is_required: boolean;
  commission_rate_min: number;
  commission_rate_max: number;
  component_key: string | null;
  selectedByGuide: boolean;
}

interface GuideConfig {
  id: string;
  slug: string;
  is_published: boolean;
}

const CATEGORY_ICONS: Record<string, typeof Hospital> = {
  Hospital,
  Stethoscope,
  Sparkles,
};

export default function ProductCenterPage() {
  const [modules, setModules] = useState<PageModule[]>([]);
  const [guideConfig, setGuideConfig] = useState<GuideConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadProductCenter();
  }, []);

  const loadProductCenter = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/guide-partner/login');
        return;
      }

      const response = await fetch('/api/guide/product-center', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setModules(data.modules || []);
        setGuideConfig(data.guideConfig);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || '加载失败' });
      }
    } catch (error) {
      console.error('Load product center error:', error);
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModule = async (moduleId: string, isSelected: boolean) => {
    if (!guideConfig) {
      setMessage({ type: 'error', text: '请先设置您的白标页面' });
      return;
    }

    setActionLoading(moduleId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/guide/selected-modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: isSelected ? 'remove' : 'add',
          moduleId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        await loadProductCenter();
      } else {
        setMessage({ type: 'error', text: result.error || '操作失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setActionLoading(null);
    }
  };

  // 按分类配置对模块分组
  const moduleComponentKeys = modules
    .map((m) => m.component_key)
    .filter(Boolean) as string[];
  const activeCategories = getActiveCategories(moduleComponentKeys);

  const categorizedModules = activeCategories.map((category) => ({
    category,
    modules: modules.filter(
      (m) => m.component_key && category.moduleKeys.includes(m.component_key)
    ),
  }));

  // 不属于任何分类的模块
  const allCategorizedKeys = PRODUCT_CATEGORIES.flatMap((c) => c.moduleKeys);
  const uncategorizedModules = modules.filter(
    (m) => !m.component_key || !allCategorizedKeys.includes(m.component_key)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">选品中心</h1>
                <p className="text-gray-500">选择要在您白标页面展示的合作机构</p>
              </div>
            </div>
            {guideConfig?.slug ? (
              <a
                href={`/g/${guideConfig.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
              >
                <span>预览我的页面</span>
                <ExternalLink size={16} />
              </a>
            ) : guideConfig ? (
              <button
                onClick={() => router.push('/guide-partner/whitelabel')}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-700"
              >
                <AlertCircle size={16} />
                <span>请先设置页面链接</span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/guide-partner/whitelabel')}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <Settings size={18} />
                <span>创建白标页面</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="ml-auto text-current hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* No Config Warning */}
      {!guideConfig && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium text-amber-800">尚未创建白标页面</p>
              <p className="text-sm text-amber-600 mt-1">
                在选择合作机构之前，您需要先创建您的白标页面配置。
              </p>
              <button
                onClick={() => router.push('/guide-partner/whitelabel')}
                className="mt-2 text-sm text-amber-700 underline hover:no-underline"
              >
                立即创建 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Sections */}
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
        {categorizedModules.map(({ category, modules: catModules }) => (
          <CategorySection
            key={category.id}
            category={category}
            modules={catModules}
            guideConfig={guideConfig}
            actionLoading={actionLoading}
            onToggleModule={handleToggleModule}
            onNavigate={(path) => router.push(path)}
          />
        ))}

        {/* 未分类模块（当前不应出现，但作为兜底） */}
        {uncategorizedModules.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">其他服务模块</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uncategorizedModules.map((module) => (
                <div
                  key={module.id}
                  className={`bg-white rounded-xl border-2 overflow-hidden transition ${
                    module.selectedByGuide
                      ? 'border-indigo-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">{module.name_zh || module.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {module.description_zh || module.description || '暂无描述'}
                    </p>
                    <span className="text-xs text-gray-500">佣金 {module.commission_rate_min}%</span>
                  </div>
                  <div className="border-t px-5 py-3 bg-gray-50">
                    <button
                      onClick={() => handleToggleModule(module.id, module.selectedByGuide)}
                      disabled={actionLoading === module.id || !guideConfig}
                      className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                        module.selectedByGuide
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      } disabled:opacity-50`}
                    >
                      {actionLoading === module.id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : module.selectedByGuide ? (
                        <>取消选择</>
                      ) : (
                        <><Plus size={18} /> 添加到我的页面</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {modules.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暂无可用合作机构</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** 分类区块组件 */
function CategorySection({
  category,
  modules,
  guideConfig,
  actionLoading,
  onToggleModule,
  onNavigate,
}: {
  category: ProductCategory;
  modules: PageModule[];
  guideConfig: GuideConfig | null;
  actionLoading: string | null;
  onToggleModule: (moduleId: string, isSelected: boolean) => void;
  onNavigate: (path: string) => void;
}) {
  const Icon = CATEGORY_ICONS[category.iconName] || Package;

  return (
    <section>
      {/* 分类标题 */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center`}>
          <Icon className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
          <p className="text-sm text-gray-500">{category.description}</p>
        </div>
      </div>

      {/* 模块卡片 */}
      <div className="space-y-4">
        {modules.map((module) => {
          const detailRoute = module.component_key
            ? MODULE_DETAIL_ROUTES[module.component_key]
            : undefined;

          return (
            <div
              key={module.id}
              className={`bg-gradient-to-r ${category.gradient} rounded-2xl overflow-hidden text-white transition-all ${
                module.selectedByGuide ? 'ring-3 ring-white/50 shadow-xl' : ''
              }`}
            >
              <div
                onClick={() => detailRoute && onNavigate(detailRoute)}
                className={`p-6 ${detailRoute ? 'cursor-pointer hover:bg-white/5' : ''} transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <Icon className="text-white" size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{module.name_zh || module.name}</h3>
                        {detailRoute && (
                          <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full">完整页面</span>
                        )}
                        {module.selectedByGuide && (
                          <span className="px-2 py-0.5 bg-green-400/30 text-xs rounded-full flex items-center gap-1">
                            <Check size={10} /> 已选择
                          </span>
                        )}
                      </div>
                      <p className={`${category.textColor} text-sm`}>
                        {module.description_zh || module.description || ''}
                      </p>
                    </div>
                  </div>
                  {detailRoute && (
                    <ArrowRight size={24} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                  )}
                </div>
              </div>
              <div className="px-6 py-3 bg-black/10 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/60">
                  佣金 {module.commission_rate_min}%
                </span>
                {module.is_required ? (
                  <span className="text-xs text-white/60">必选模块</span>
                ) : (
                  <button
                    onClick={() => onToggleModule(module.id, module.selectedByGuide)}
                    disabled={actionLoading === module.id || !guideConfig}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      module.selectedByGuide
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-white text-gray-700 hover:bg-white/90'
                    } disabled:opacity-50`}
                  >
                    {actionLoading === module.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : module.selectedByGuide ? (
                      <>取消选择</>
                    ) : (
                      <><Plus size={14} /> 添加到我的页面</>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
