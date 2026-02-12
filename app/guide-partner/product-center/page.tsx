'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Package,
  User,
  Car,
  Plus,
  Check,
  Loader2,
  AlertCircle,
  ChevronRight,
  Percent,
  ImageIcon,
  Palette,
  Settings,
  ExternalLink,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';

interface PageModule {
  id: string;
  module_type: 'bio' | 'vehicle' | 'medical';
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

interface PageTemplate {
  id: string;
  module_type: 'bio' | 'vehicle';
  template_key: string;
  name: string;
  name_zh: string | null;
  preview_image_url: string | null;
  is_default: boolean;
}

interface VehicleLibrary {
  id: string;
  vehicle_type: string;
  brand: string;
  model: string;
  year: number | null;
  seat_capacity: number;
  luggage_capacity: number;
  image_url: string | null;
  features: string[];
  description_zh: string | null;
  selectedByGuide: boolean;
}

interface GuideConfig {
  id: string;
  slug: string;
  is_published: boolean;
  bio_template_id: string | null;
  vehicle_template_id: string | null;
}

export default function ProductCenterPage() {
  const [modules, setModules] = useState<PageModule[]>([]);
  const [templates, setTemplates] = useState<{ bio: PageTemplate[]; vehicle: PageTemplate[] }>({ bio: [], vehicle: [] });
  const [vehicles, setVehicles] = useState<VehicleLibrary[]>([]);
  const [guideConfig, setGuideConfig] = useState<GuideConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'modules' | 'templates' | 'vehicles'>('modules');

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
        setTemplates(data.templates || { bio: [], vehicle: [] });
        setVehicles(data.vehicles || []);
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
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVehicle = async (vehicleId: string, isSelected: boolean) => {
    if (!guideConfig) {
      setMessage({ type: 'error', text: '请先设置您的白标页面' });
      return;
    }

    setActionLoading(vehicleId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/guide/selected-vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: isSelected ? 'remove' : 'add',
          vehicleId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        await loadProductCenter();
      } else {
        setMessage({ type: 'error', text: result.error || '操作失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setActionLoading(null);
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'bio': return <User className="text-blue-500" size={24} />;
      case 'vehicle': return <Car className="text-green-500" size={24} />;
      case 'medical': return <Package className="text-purple-500" size={24} />;
      default: return <Package className="text-gray-500" size={24} />;
    }
  };

  const getModuleTypeName = (type: string) => {
    switch (type) {
      case 'bio': return '自我介绍';
      case 'vehicle': return '车辆介绍';
      case 'medical': return '医疗服务';
      default: return type;
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
                <p className="text-gray-500">选择要在您白标页面展示的模块和产品</p>
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
                在选择产品之前，您需要先创建您的白标页面配置。
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

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-4 py-3 font-medium transition border-b-2 -mb-px ${
              activeTab === 'modules'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Package size={18} />
              服务模块
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {modules.length}
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-3 font-medium transition border-b-2 -mb-px ${
              activeTab === 'templates'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Palette size={18} />
              页面模板
            </span>
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-3 font-medium transition border-b-2 -mb-px ${
              activeTab === 'vehicles'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Car size={18} />
              车辆库
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {vehicles.length}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            {/* TIMC 体检中心服务模块入口 */}
            <div
              onClick={() => router.push('/guide-partner/product-center/timc')}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Stethoscope className="text-white" size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">TIMC 体检中心 — 完整服务模块</h3>
                      <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full">完整页面</span>
                    </div>
                    <p className="text-blue-100 text-sm">
                      查看 TIMC 大阪精密体检中心全部内容：设备介绍、设施环境、6大体检套餐、套餐对比表、客户评价、FAQ等
                    </p>
                  </div>
                </div>
                <ArrowRight size={24} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`bg-white rounded-xl border-2 overflow-hidden transition ${
                  module.selectedByGuide
                    ? 'border-indigo-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        {getModuleIcon(module.module_type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{module.name_zh || module.name}</h3>
                        <span className="text-xs text-gray-500">
                          {getModuleTypeName(module.module_type)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {module.component_key && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          完整页面
                        </span>
                      )}
                      {module.is_required && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          必选
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {module.description_zh || module.description || '暂无描述'}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Percent size={14} />
                      佣金 {module.commission_rate_min}-{module.commission_rate_max}%
                    </span>
                    {module.selectedByGuide && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Check size={14} />
                        已选择
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t px-5 py-3 bg-gray-50">
                  {module.is_required ? (
                    <span className="text-sm text-gray-500">必选模块，无法取消</span>
                  ) : (
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
                        <>
                          <Plus size={18} />
                          添加到我的页面
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {modules.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>暂无可用模块</p>
              </div>
            )}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-8">
            {/* Bio Templates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-500" />
                自我介绍模板
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.bio.map((template) => (
                  <div
                    key={template.id}
                    className={`bg-white rounded-xl border-2 overflow-hidden transition ${
                      guideConfig?.bio_template_id === template.id
                        ? 'border-indigo-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      {template.preview_image_url ? (
                        <img
                          src={template.preview_image_url}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={32} className="text-gray-300" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{template.name_zh || template.name}</h4>
                        {template.is_default && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            推荐
                          </span>
                        )}
                      </div>
                      {guideConfig?.bio_template_id === template.id && (
                        <span className="text-sm text-indigo-600 flex items-center gap-1 mt-2">
                          <Check size={14} />
                          当前使用
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Templates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car size={20} className="text-green-500" />
                车辆介绍模板
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.vehicle.map((template) => (
                  <div
                    key={template.id}
                    className={`bg-white rounded-xl border-2 overflow-hidden transition ${
                      guideConfig?.vehicle_template_id === template.id
                        ? 'border-indigo-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      {template.preview_image_url ? (
                        <img
                          src={template.preview_image_url}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={32} className="text-gray-300" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{template.name_zh || template.name}</h4>
                        {template.is_default && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            推荐
                          </span>
                        )}
                      </div>
                      {guideConfig?.vehicle_template_id === template.id && (
                        <span className="text-sm text-indigo-600 flex items-center gap-1 mt-2">
                          <Check size={14} />
                          当前使用
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              模板选择功能请前往
              <button
                onClick={() => router.push('/guide-partner/whitelabel')}
                className="text-indigo-600 underline hover:no-underline mx-1"
              >
                白标页面设置
              </button>
              进行配置
            </p>
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`bg-white rounded-xl border-2 overflow-hidden transition ${
                  vehicle.selectedByGuide
                    ? 'border-indigo-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {vehicle.image_url ? (
                    <img
                      src={vehicle.image_url}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car size={48} className="text-gray-300" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </h4>
                      <span className="text-sm text-gray-500">{vehicle.vehicle_type}</span>
                    </div>
                    {vehicle.selectedByGuide && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                        <Check size={12} />
                        已选
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>{vehicle.seat_capacity} 座</span>
                    <span>{vehicle.luggage_capacity} 件行李</span>
                    {vehicle.year && <span>{vehicle.year}年款</span>}
                  </div>

                  {vehicle.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {vehicle.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {vehicle.features.length > 3 && (
                        <span className="text-xs text-gray-400">+{vehicle.features.length - 3}</span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleToggleVehicle(vehicle.id, vehicle.selectedByGuide)}
                    disabled={actionLoading === vehicle.id || !guideConfig}
                    className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                      vehicle.selectedByGuide
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } disabled:opacity-50`}
                  >
                    {actionLoading === vehicle.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : vehicle.selectedByGuide ? (
                      <>取消选择</>
                    ) : (
                      <>
                        <Plus size={18} />
                        添加到我的页面
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {vehicles.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>暂无可用车辆</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
