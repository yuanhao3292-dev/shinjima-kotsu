'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Check,
  Loader2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  PRODUCT_CATEGORIES,
  getActiveCategories,
  MODULE_DETAIL_ROUTES,
} from '@/lib/config/product-categories';
import type { ProductCategory } from '@/lib/config/product-categories';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const translations = {
  pageTitle: {
    ja: 'セレクションセンター',
    'zh-CN': '选品中心',
    'zh-TW': '選品中心',
    en: 'Product Center',
  },
  errorLoadFailed: {
    ja: '読み込みに失敗しました',
    'zh-CN': '加载失败',
    'zh-TW': '加載失敗',
    en: 'Failed to load',
  },
  errorNetwork: {
    ja: 'ネットワークエラー',
    'zh-CN': '网络错误',
    'zh-TW': '網路錯誤',
    en: 'Network error',
  },
  errorSetupFirst: {
    ja: 'まずホワイトラベルページを設定してください',
    'zh-CN': '请先设置您的白标页面',
    'zh-TW': '請先設置您的白標頁面',
    en: 'Please set up your white-label page first',
  },
  errorActionFailed: {
    ja: '操作に失敗しました',
    'zh-CN': '操作失败',
    'zh-TW': '操作失敗',
    en: 'Action failed',
  },
  noConfigTitle: {
    ja: 'ホワイトラベルページ未作成',
    'zh-CN': '尚未创建白标页面',
    'zh-TW': '尚未創建白標頁面',
    en: 'White-label page not created',
  },
  noConfigDesc: {
    ja: '提携機関を選択する前に、まずホワイトラベルページの設定を作成してください。',
    'zh-CN': '在选择合作机构之前，您需要先创建您的白标页面配置。',
    'zh-TW': '在選擇合作機構之前，您需要先創建您的白標頁面配置。',
    en: 'Before selecting partner institutions, you need to create your white-label page configuration.',
  },
  createNow: {
    ja: '今すぐ作成 →',
    'zh-CN': '立即创建 →',
    'zh-TW': '立即創建 →',
    en: 'Create Now →',
  },
  institutionCount: {
    ja: '家機関',
    'zh-CN': '家机构',
    'zh-TW': '家機構',
    en: ' institutions',
  },
  selected: {
    ja: '選択済み',
    'zh-CN': '已选',
    'zh-TW': '已選',
    en: 'Selected',
  },
  partnerInstitutions: {
    ja: '家提携機関',
    'zh-CN': '家合作机构',
    'zh-TW': '家合作機構',
    en: ' partner institutions',
  },
  otherModules: {
    ja: 'その他のサービスモジュール',
    'zh-CN': '其他服务模块',
    'zh-TW': '其他服務模塊',
    en: 'Other Service Modules',
  },
  noDescription: {
    ja: '説明なし',
    'zh-CN': '暂无描述',
    'zh-TW': '暫無描述',
    en: 'No description',
  },
  commission: {
    ja: 'コミッション',
    'zh-CN': '佣金',
    'zh-TW': '佣金',
    en: 'Commission',
  },
  deselect: {
    ja: '選択解除',
    'zh-CN': '取消选择',
    'zh-TW': '取消選擇',
    en: 'Deselect',
  },
  addToPage: {
    ja: '自分のページに追加',
    'zh-CN': '添加到我的页面',
    'zh-TW': '添加到我的頁面',
    en: 'Add to My Page',
  },
  preview: {
    ja: 'プレビュー',
    'zh-CN': '预览',
    'zh-TW': '預覽',
    en: 'Preview',
  },
  requiredModule: {
    ja: '必須',
    'zh-CN': '必选',
    'zh-TW': '必選',
    en: 'Required',
  },
  requiredModuleLabel: {
    ja: '必須モジュール',
    'zh-CN': '必选模块',
    'zh-TW': '必選模塊',
    en: 'Required module',
  },
  add: {
    ja: '追加',
    'zh-CN': '添加',
    'zh-TW': '添加',
    en: 'Add',
  },
  selectedLabel: {
    ja: '選択済み',
    'zh-CN': '已选择',
    'zh-TW': '已選擇',
    en: 'Selected',
  },
  noInstitutions: {
    ja: '利用可能な提携機関はありません',
    'zh-CN': '暂无可用合作机构',
    'zh-TW': '暫無可用合作機構',
    en: 'No partner institutions available',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

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
  const lang = useLanguage();

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
        setMessage({ type: 'error', text: error.error || t('errorLoadFailed', lang) });
      }
    } catch (error) {
      console.error('Load product center error:', error);
      setMessage({ type: 'error', text: t('errorNetwork', lang) });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModule = async (moduleId: string, isSelected: boolean) => {
    if (!guideConfig) {
      setMessage({ type: 'error', text: t('errorSetupFirst', lang) });
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
        setMessage({ type: 'error', text: result.error || t('errorActionFailed', lang) });
      }
    } catch {
      setMessage({ type: 'error', text: t('errorNetwork', lang) });
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
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">

          {/* Message */}
          {message && (
            <div className="mb-4">
              <div
                className={`p-4 rounded-lg flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
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
            <div className="mb-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-amber-800">{t('noConfigTitle', lang)}</p>
                  <p className="text-sm text-amber-600 mt-1">
                    {t('noConfigDesc', lang)}
                  </p>
                  <button
                    onClick={() => router.push('/guide-partner/whitelabel')}
                    className="mt-2 text-sm text-amber-700 underline hover:no-underline"
                  >
                    {t('createNow', lang)}
                  </button>
                </div>
              </div>
            </div>
          )}

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
                      <span>{catModules.length} {t('institutionCount', lang)}</span>
                      {selectedCount > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20' : 'bg-green-100 text-green-700'
                        }`}>
                          {t('selected', lang)} {selectedCount}
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
                <span className="text-sm text-gray-400">({currentCategoryData.modules.length} {t('partnerInstitutions', lang)})</span>
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
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 未分类模块 */}
          {uncategorizedModules.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('otherModules', lang)}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uncategorizedModules.map((module) => {
                  const uncatPreviewUrl = module.component_key
                    ? MODULE_DETAIL_ROUTES[module.component_key]
                    : undefined;
                  return (
                    <div
                      key={module.id}
                      className={`bg-white rounded-xl border-2 overflow-hidden transition ${
                        module.selectedByGuide
                          ? 'border-brand-500 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 mb-2">{module.name_zh || module.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {module.description_zh || module.description || t('noDescription', lang)}
                        </p>
                        <span className="text-xs text-gray-500">{t('commission', lang)} {module.commission_rate_min}%</span>
                      </div>
                      <div className="border-t px-5 py-3 bg-gray-50 flex items-center gap-2">
                        {uncatPreviewUrl && (
                          <a
                            href={uncatPreviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 rounded-lg text-sm font-medium border border-brand-200 text-brand-700 hover:bg-brand-50 transition flex items-center justify-center gap-1.5"
                          >
                            <Eye size={16} /> {t('preview', lang)}
                          </a>
                        )}
                        <button
                          onClick={() => handleToggleModule(module.id, module.selectedByGuide)}
                          disabled={actionLoading === module.id || !guideConfig}
                          className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                            module.selectedByGuide
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-brand-600 text-white hover:bg-brand-700'
                          } disabled:opacity-50`}
                        >
                          {actionLoading === module.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : module.selectedByGuide ? (
                            <>{t('deselect', lang)}</>
                          ) : (
                            <><Plus size={18} /> {t('addToPage', lang)}</>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {modules.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>{t('noInstitutions', lang)}</p>
            </div>
          )}
        </div>
      </main>
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
  lang,
}: {
  module: PageModule;
  category: ProductCategory;
  guideConfig: GuideConfig | null;
  actionLoading: string | null;
  onToggleModule: (moduleId: string, isSelected: boolean) => void;
  lang: Language;
}) {
  // 预览链接：优先用白标路由，fallback 到独立页面
  const previewUrl = module.component_key
    ? guideConfig?.slug
      ? `/g/${guideConfig.slug}/${module.component_key.replace(/_/g, '-')}`
      : MODULE_DETAIL_ROUTES[module.component_key]
    : undefined;

  return (
    <div
      className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
        module.selectedByGuide
          ? 'border-brand-500 shadow-lg'
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
              <Check size={12} /> {t('selectedLabel', lang)}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {module.description_zh || module.description || t('noDescription', lang)}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{t('commission', lang)} {module.commission_rate_min}%</span>
          {module.is_required && <span className="text-amber-600">{t('requiredModule', lang)}</span>}
        </div>
      </div>

      {/* 操作区 */}
      <div className="px-5 py-3 border-t bg-gray-50/50 flex items-center gap-2">
        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-lg text-sm font-medium border border-brand-200 text-brand-700 hover:bg-brand-50 transition flex items-center justify-center gap-1.5"
          >
            <Eye size={14} /> {t('preview', lang)}
          </a>
        )}
        {module.is_required ? (
          <span className="flex-1 py-2 text-center text-xs text-gray-400">{t('requiredModuleLabel', lang)}</span>
        ) : (
          <button
            onClick={() => onToggleModule(module.id, module.selectedByGuide)}
            disabled={actionLoading === module.id || !guideConfig}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5 ${
              module.selectedByGuide
                ? 'text-gray-600 hover:bg-gray-100'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            } disabled:opacity-50`}
          >
            {actionLoading === module.id ? (
              <Loader2 className="animate-spin" size={14} />
            ) : module.selectedByGuide ? (
              <>{t('deselect', lang)}</>
            ) : (
              <><Plus size={14} /> {t('add', lang)}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
