'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Check,
  Loader2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Settings,
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

export default function ProductCenterPage() {
  const [modules, setModules] = useState<PageModule[]>([]);
  const [guideConfig, setGuideConfig] = useState<GuideConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadProductCenter();
  }, []);

  const loadProductCenter = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/guide/product-center', {
        headers: session ? { 'Authorization': `Bearer ${session.access_token}` } : {},
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

      const response = await fetch('/api/guide/selected-modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
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

  // 默认选中第一个有模块的分类
  const effectiveCategory = activeCategory || activeCategories[0]?.id || null;
  const currentCategoryData = categorizedModules.find(
    (c) => c.category.id === effectiveCategory
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
              <button
                onClick={() => router.push('/guide-partner/dashboard')}
                className="text-gray-400 hover:text-gray-600 transition"
                title="返回导游中心"
              >
                <ArrowRight size={20} className="rotate-180" />
              </button>
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

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Category Tabs - 横向大分类 */}
        {activeCategories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {activeCategories.map((category) => {
              const isActive = category.id === effectiveCategory;
              const catModules = categorizedModules.find((c) => c.category.id === category.id)?.modules || [];
              const selectedCount = catModules.filter((m) => m.selectedByGuide).length;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative p-5 rounded-2xl text-left transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${category.gradient} text-white shadow-lg scale-[1.02]`
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <h3 className={`font-bold text-base mb-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {category.name}
                  </h3>
                  <p className={`text-xs line-clamp-2 ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                    {category.description}
                  </p>
                  <div className={`mt-3 flex items-center gap-2 text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                    <span>{catModules.length} 家机构</span>
                    {selectedCount > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20' : 'bg-green-100 text-green-700'
                      }`}>
                        已选 {selectedCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Module Grid - 当前分类下的机构卡片 */}
        {currentCategoryData && currentCategoryData.modules.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-gray-900">{currentCategoryData.category.name}</h2>
              <span className="text-sm text-gray-400">({currentCategoryData.modules.length} 家合作机构)</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCategoryData.modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  category={currentCategoryData.category}
                  guideConfig={guideConfig}
                  actionLoading={actionLoading}
                  onToggleModule={handleToggleModule}
                  onNavigate={(path) => router.push(path)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 未分类模块 */}
        {uncategorizedModules.length > 0 && (
          <div className="mt-8">
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
            <p>暂无可用合作机构</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** 机构卡片组件 */
function ModuleCard({
  module,
  category,
  guideConfig,
  actionLoading,
  onToggleModule,
  onNavigate,
}: {
  module: PageModule;
  category: ProductCategory;
  guideConfig: GuideConfig | null;
  actionLoading: string | null;
  onToggleModule: (moduleId: string, isSelected: boolean) => void;
  onNavigate: (path: string) => void;
}) {
  const detailRoute = module.component_key
    ? MODULE_DETAIL_ROUTES[module.component_key]
    : undefined;

  return (
    <div
      className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
        module.selectedByGuide
          ? 'border-indigo-500 shadow-lg'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* 顶部渐变条 */}
      <div className={`h-1.5 bg-gradient-to-r ${category.gradient}`} />

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900">{module.name_zh || module.name}</h3>
          {module.selectedByGuide && (
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full flex items-center gap-1">
              <Check size={12} /> 已选择
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {module.description_zh || module.description || '暂无描述'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>佣金 {module.commission_rate_min}%</span>
          {module.is_required && <span className="text-amber-600">必选</span>}
        </div>
      </div>

      {/* 操作区 */}
      <div className="px-5 py-3 border-t bg-gray-50/50 flex items-center gap-2">
        {detailRoute && (
          <button
            onClick={() => onNavigate(detailRoute)}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition flex items-center justify-center gap-1"
          >
            查看详情 <ArrowRight size={14} />
          </button>
        )}
        {module.is_required ? (
          <span className="flex-1 py-2 text-center text-xs text-gray-400">必选模块</span>
        ) : (
          <button
            onClick={() => onToggleModule(module.id, module.selectedByGuide)}
            disabled={actionLoading === module.id || !guideConfig}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5 ${
              module.selectedByGuide
                ? 'text-gray-600 hover:bg-gray-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            } disabled:opacity-50`}
          >
            {actionLoading === module.id ? (
              <Loader2 className="animate-spin" size={14} />
            ) : module.selectedByGuide ? (
              <>取消选择</>
            ) : (
              <><Plus size={14} /> 添加</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
