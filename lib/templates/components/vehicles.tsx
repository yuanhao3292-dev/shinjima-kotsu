/**
 * 车辆展示模板
 * ============================================
 */

import { Car, Users, Briefcase } from 'lucide-react';
import { registerTemplate, type TemplateProps } from '../engine';

// ============================================
// 模板数据类型
// ============================================

export interface VehicleItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  seatCapacity: number;
  luggageCapacity: number;
  features: string[];
}

export interface VehiclesData {
  vehicles: VehicleItem[];
}

// ============================================
// Modern Vehicles 模板
// ============================================

export function ModernVehiclesTemplate({ context, data }: TemplateProps<VehiclesData>) {
  if (data.vehicles.length === 0) return null;

  return (
    <section id="vehicles" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">车辆介绍</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            为您提供舒适、安全的高端座驾
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-gray-50 rounded-xl overflow-hidden border hover:shadow-lg transition"
            >
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Car size={48} className="text-gray-400" />
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{vehicle.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {vehicle.seatCapacity} 座
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} />
                    {vehicle.luggageCapacity} 件行李
                  </span>
                </div>
                {vehicle.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {vehicle.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Classic Vehicles 模板
// ============================================

export function ClassicVehiclesTemplate({ context, data }: TemplateProps<VehiclesData>) {
  const { brandColor } = context;

  if (data.vehicles.length === 0) return null;

  return (
    <section id="vehicles" className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">车辆阵容</h2>
          <div
            className="w-16 h-1 mx-auto"
            style={{ backgroundColor: brandColor }}
          />
        </div>

        <div className="space-y-8">
          {data.vehicles.map((vehicle, idx) => (
            <div
              key={vehicle.id}
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} bg-white shadow-lg overflow-hidden`}
            >
              <div className="md:w-1/2 aspect-video md:aspect-auto">
                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center min-h-[300px]">
                    <Car size={64} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{vehicle.name}</h3>
                <p className="text-gray-600 mb-6">{vehicle.description}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Users size={18} style={{ color: brandColor }} />
                    {vehicle.seatCapacity} 座
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase size={18} style={{ color: brandColor }} />
                    {vehicle.luggageCapacity} 件行李
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Minimal Vehicles 模板
// ============================================

export function MinimalVehiclesTemplate({ context, data }: TemplateProps<VehiclesData>) {
  if (data.vehicles.length === 0) return null;

  return (
    <section id="vehicles" className="py-12 border-b">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">车辆服务</h2>
        <div className="space-y-4">
          {data.vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-20 h-14 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <Car size={24} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{vehicle.name}</h3>
                <p className="text-sm text-gray-500">
                  {vehicle.seatCapacity} 座 · {vehicle.luggageCapacity} 件行李
                </p>
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

export function initVehicleTemplates(): void {
  registerTemplate('vehicle', 'modern', ModernVehiclesTemplate);
  registerTemplate('vehicle', 'classic', ClassicVehiclesTemplate);
  registerTemplate('vehicle', 'minimal', MinimalVehiclesTemplate);
}
