'use client';

import { CheckCircle2 } from 'lucide-react';
import type { WhitelabelModuleProps } from './types';
import WhitelabelContactSection from './WhitelabelContactSection';

const stats = [
  { value: '20+', label: '名门球场' },
  { value: 'VIP', label: '专属预约通道' },
  { value: '1,000+', label: '累计服务人数' },
  { value: '98%+', label: '预约成功率' },
];

const services = [
  {
    id: 'course',
    title: '球场甄选',
    features: ['关西地区20+名门球场', '会员制球场优先预约', '季节最佳球场推荐'],
  },
  {
    id: 'vip',
    title: 'VIP 管理',
    features: ['专属预约管家', '优先开球时段', '贵宾室休息安排'],
  },
  {
    id: 'transfer',
    title: '接送服务',
    features: ['酒店球场专车接送', '高端商务车型', '灵活行程安排'],
  },
  {
    id: 'language',
    title: '中文服务',
    features: ['中文球僮协助', '餐饮中文菜单', '全程中文陪同'],
  },
];

export default function GolfModule({ brandColor, brandName, contactInfo }: WhitelabelModuleProps) {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-20 text-white"
        style={{
          background: `linear-gradient(135deg, #15803d 0%, #166534 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">名门高尔夫旅游</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            日本关西名门球场 VIP 预约通道，专车接送、中文服务、专属定制
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: `${brandColor}10` }}
              >
                <div className="text-3xl font-bold" style={{ color: brandColor }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3
            className="text-2xl font-bold text-gray-900 mb-8 pb-3 border-b-2"
            style={{ borderColor: brandColor }}
          >
            服务特色
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service.id} className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-3 text-lg">{service.title}</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 size={14} style={{ color: brandColor }} className="flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
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
