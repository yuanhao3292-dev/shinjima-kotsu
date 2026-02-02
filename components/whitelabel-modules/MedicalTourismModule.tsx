'use client';

import { CheckCircle2 } from 'lucide-react';
import type { WhitelabelModuleProps } from './types';
import WhitelabelContactSection from './WhitelabelContactSection';

const stats = [
  { value: '5,000+', label: '累计体检人数' },
  { value: '98%', label: '满意度' },
  { value: '50+', label: '合作医疗机构' },
  { value: '24h', label: '预约服务' },
];

const services = [
  {
    title: '精密健康检查',
    description: 'PET-CT、MRI、内视镜检查等，以最新设备进行全面体检',
    features: ['早期癌症发现', '脑部检查', '心脏检查'],
  },
  {
    title: '癌症治疗介绍',
    description: '质子线治疗、光免疫疗法、BNCT等最先进的癌症治疗',
    features: ['第二意见', '治疗方案咨询', '住院安排'],
  },
  {
    title: '再生医疗',
    description: '干细胞治疗、PRP疗法等再生医疗服务介绍',
    features: ['抗衰老', '关节治疗', '医美'],
  },
  {
    title: '中文支持',
    description: '医疗口译、文件翻译、全程陪同完整服务',
    features: ['医疗口译随行', '报告书翻译', '24小时服务'],
  },
];

export default function MedicalTourismModule({ brandColor, brandName, contactInfo }: WhitelabelModuleProps) {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-20 text-white"
        style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, -40)} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">医疗旅游</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            日本最先进的医疗技术，精密体检服务，PET-CT、MRI、胃肠内视镜等世界顶级设备
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto text-center">
            运用日本最先进的医疗技术提供精密体检服务。通过与德洲会国际医疗中心（TIMC）的战略合作，提供PET-CT、MRI、胃肠内视镜等世界顶级设备的体检服务。
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
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
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3
            className="text-2xl font-bold text-gray-900 mb-8 pb-3 border-b-2"
            style={{ borderColor: brandColor }}
          >
            服务内容
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2 text-lg">{service.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} style={{ color: brandColor }} className="flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Hospital - TIMC */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3
            className="text-2xl font-bold text-gray-900 mb-8 pb-3 border-b-2"
            style={{ borderColor: brandColor }}
          >
            主要合作医疗机构
          </h3>
          <div className="p-6 bg-slate-900 text-white rounded-2xl">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400"
                  alt="TIMC OSAKA"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <div className="flex-1">
                <div className="text-blue-400 text-sm font-medium mb-2">官方预约代理</div>
                <h4 className="text-2xl font-bold mb-2">TIMC OSAKA</h4>
                <p className="text-gray-300 text-sm mb-4">
                  德洲会国际医疗中心（TIMC）是由日本最大医疗集团德洲会运营的外国人专用体检中心。以最新医疗设备和多语言服务人员，提供舒适的体检体验。
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs">JR大阪站直达</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs">JP TOWER OSAKA 11F</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs">中文服务</span>
                </div>
              </div>
            </div>
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

function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  const hex = color.replace('#', '');
  const r = clamp(parseInt(hex.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
