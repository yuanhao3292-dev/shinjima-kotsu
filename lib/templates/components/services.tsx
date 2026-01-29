/**
 * 服务模块模板
 * ============================================
 */

import { Package, ChevronRight } from 'lucide-react';
import { registerTemplate, type TemplateProps } from '../engine';

// ============================================
// 模板数据类型
// ============================================

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  iconUrl?: string | null;
}

export interface ServicesData {
  services: ServiceItem[];
}

// ============================================
// Modern Services 模板
// ============================================

export function ModernServicesTemplate({ context, data }: TemplateProps<ServicesData>) {
  const { brandColor } = context;

  if (data.services.length === 0) return null;

  return (
    <section id="services" className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">服务项目</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            为您精选的优质医疗和旅行服务
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${brandColor}15` }}
                  >
                    {service.iconUrl ? (
                      <img src={service.iconUrl} alt={service.name} className="w-8 h-8" />
                    ) : (
                      <Package size={28} style={{ color: brandColor }} />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                <button
                  className="w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  了解详情
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Classic Services 模板
// ============================================

export function ClassicServicesTemplate({ context, data }: TemplateProps<ServicesData>) {
  const { brandColor } = context;

  if (data.services.length === 0) return null;

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">服务项目</h2>
          <div className="w-16 h-1 mx-auto" style={{ backgroundColor: brandColor }} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {data.services.map((service) => (
            <div
              key={service.id}
              className="flex gap-6 p-6 border-l-4 bg-gray-50"
              style={{ borderLeftColor: brandColor }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                {service.iconUrl ? (
                  <img src={service.iconUrl} alt={service.name} className="w-8 h-8" />
                ) : (
                  <Package size={28} style={{ color: brandColor }} />
                )}
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Minimal Services 模板
// ============================================

export function MinimalServicesTemplate({ context, data }: TemplateProps<ServicesData>) {
  const { brandColor } = context;

  if (data.services.length === 0) return null;

  return (
    <section id="services" className="py-12 border-b">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">服务项目</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.services.map((service) => (
            <div key={service.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                {service.iconUrl ? (
                  <img src={service.iconUrl} alt={service.name} className="w-5 h-5" />
                ) : (
                  <Package size={16} style={{ color: brandColor }} />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 注册模板
// ============================================

export function initServiceTemplates(): void {
  registerTemplate('service', 'modern', ModernServicesTemplate);
  registerTemplate('service', 'classic', ClassicServicesTemplate);
  registerTemplate('service', 'minimal', MinimalServicesTemplate);
}
