'use client';

import { useState, useMemo } from 'react';
import {
  Car,
  Shield,
  Star,
  Award,
  Sparkles,
  Clock,
  Users,
  BadgeCheck,
  Headphones,
} from 'lucide-react';
import type { WhitelabelModuleProps } from './types';
import WhitelabelContactSection from './WhitelabelContactSection';
import VEHICLES_DATA from '@/app/vehicles/data/vehicles.json';
import type { Vehicle, VehicleCategory } from '@/app/vehicles/types/vehicle';

const VEHICLES = VEHICLES_DATA as Vehicle[];

const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  all: '全部车型',
  taxi: '商务轿车',
  minibus: '小型巴士',
  mediumbus: '中型巴士',
  largebus: '大型巴士',
};

export default function VehiclesModule({ brandColor, brandName, contactInfo }: WhitelabelModuleProps) {
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('all');

  const filteredVehicles = useMemo(() => {
    return selectedCategory === 'all'
      ? VEHICLES
      : VEHICLES.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

  const promiseItems = [
    { icon: BadgeCheck, title: '全绿牌正规', desc: '所有车辆均持有旅客运输营业许可，合法合规经营' },
    { icon: Shield, title: '全额保险', desc: '商业保险全额覆盖，乘客安全无忧' },
    { icon: Users, title: '专业司机', desc: '持证专业司机，经验丰富、服务周到' },
    { icon: Clock, title: '准时守信', desc: '严格时间管理，提前到达不让您等待' },
    { icon: Headphones, title: '24小时客服', desc: '全天候中文客服支持，随时解答您的问题' },
    { icon: Star, title: '高端体验', desc: '车辆整洁如新，配备WiFi、充电等贴心设备' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-ebd3fee29dbf?q=80&w=2070&auto=format&fit=crop')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70" />
        </div>

        <div className="container mx-auto px-6 relative z-10 py-24">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
              <Car size={16} style={{ color: brandColor }} />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Premium Vehicle Fleet</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              高端车队<br />
              <span style={{ color: brandColor }}>专属您的座驾</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              全绿牌营业车辆，专业持证司机，24小时全天候服务
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                { value: `${VEHICLES.length}+`, label: '可选车型' },
                { value: '4-60', label: '座位范围' },
                { value: '100%', label: '正规许可' },
                { value: '24h', label: '全天服务' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 border border-white/20">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center gap-2 py-4 overflow-x-auto">
            {(Object.keys(CATEGORY_LABELS) as VehicleCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedCategory === cat ? { backgroundColor: brandColor } : undefined}
              >
                {CATEGORY_LABELS[cat]}
                <span className="ml-1 text-xs opacity-70">
                  ({cat === 'all' ? VEHICLES.length : VEHICLES.filter(v => v.category === cat).length})
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Vehicle Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">车队一览</h3>
            <p className="text-gray-500">从商务轿车到大型巴士，满足各种出行需求</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition">
                <div className="aspect-video bg-gray-200">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name['zh-CN']}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{vehicle.name['zh-CN']}</h4>
                  <p className="text-sm text-gray-500 mb-3">{vehicle.highlight['zh-CN']}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {vehicle.capacity.passengers}
                      {vehicle.capacity.maxPassengers && `~${vehicle.capacity.maxPassengers}`}
                      座
                    </span>
                    <span>{vehicle.capacity.luggage} 件行李</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features['zh-CN'].slice(0, 3).map((f, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">车型对比</h3>
            <p className="text-gray-500">轻松选择最适合您的车型</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-l-lg">车型</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">座位</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">行李</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">车长</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-r-lg">适用场景</th>
                </tr>
              </thead>
              <tbody>
                {VEHICLES.map((v, index) => (
                  <tr key={v.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{v.name['zh-CN']}</p>
                      <p className="text-xs text-gray-400">{v.name.en}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold" style={{ color: brandColor }}>{v.capacity.passengers}</span>
                      {v.capacity.maxPassengers && <span className="text-gray-400 text-sm">~{v.capacity.maxPassengers}</span>}
                      <span className="text-gray-500 text-sm">人</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium text-gray-700">{v.capacity.luggage}</span>
                      <span className="text-gray-500 text-sm">件</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {(v.dimensions.length / 1000).toFixed(1)}m
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.suitableFor['zh-CN'].slice(0, 2).map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${brandColor}10`, color: brandColor }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Award size={16} style={{ color: brandColor }} />
              Our Promise
            </div>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              <span style={{ color: brandColor }}>我们的承诺</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              每一次出行，都是一次高品质的体验
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promiseItems.map(item => (
              <div key={item.title} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${brandColor}30` }}>
                  <item.icon className="w-6 h-6" style={{ color: brandColor }} />
                </div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <WhitelabelContactSection
        brandColor={brandColor}
        brandName={brandName}
        contactInfo={contactInfo}
      />
    </div>
  );
}
