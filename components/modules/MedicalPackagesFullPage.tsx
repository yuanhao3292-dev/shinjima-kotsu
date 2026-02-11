'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, ArrowRight, Building2, Globe, Stethoscope } from 'lucide-react';
import { translations, Language } from '@/translations';

interface MedicalPackagesFullPageProps {
  guideSlug: string;
  brandColor: string;
  brandName: string;
}

// 套餐颜色方案
const packageColors: Record<string, {
  headerBg: string;
  titleColor: string;
  priceColor: string;
  checkColor: string;
  buttonBg: string;
  buttonText: string;
  cardBg: string;
  borderColor: string;
  badgeBg?: string;
  isVIP?: boolean;
}> = {
  'vip-member-course': {
    headerBg: 'bg-gray-900',
    titleColor: 'text-yellow-400',
    priceColor: 'text-yellow-400',
    checkColor: 'text-yellow-500',
    buttonBg: 'bg-yellow-500',
    buttonText: 'text-black hover:bg-yellow-400',
    cardBg: 'bg-gray-900',
    borderColor: 'border-yellow-500',
    badgeBg: 'bg-yellow-500 text-black',
    isVIP: true,
  },
  'premium-cardiac-course': {
    headerBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
    titleColor: 'text-blue-900',
    priceColor: 'text-blue-900',
    checkColor: 'text-blue-500',
    buttonBg: 'bg-blue-600',
    buttonText: 'text-white hover:bg-blue-700',
    cardBg: 'bg-gradient-to-br from-blue-50 to-white',
    borderColor: 'border-blue-200',
  },
  'select-gastro-colonoscopy': {
    headerBg: 'bg-gradient-to-r from-green-600 to-green-700',
    titleColor: 'text-green-900',
    priceColor: 'text-green-900',
    checkColor: 'text-green-500',
    buttonBg: 'bg-green-600',
    buttonText: 'text-white hover:bg-green-700',
    cardBg: 'bg-white',
    borderColor: 'border-green-200',
  },
  'select-gastroscopy': {
    headerBg: 'bg-gradient-to-r from-teal-600 to-teal-700',
    titleColor: 'text-teal-800',
    priceColor: 'text-teal-800',
    checkColor: 'text-teal-500',
    buttonBg: 'bg-teal-600',
    buttonText: 'text-white hover:bg-teal-700',
    cardBg: 'bg-white',
    borderColor: 'border-teal-200',
  },
  'dwibs-cancer-screening': {
    headerBg: 'bg-gradient-to-r from-purple-600 to-purple-700',
    titleColor: 'text-purple-900',
    priceColor: 'text-purple-900',
    checkColor: 'text-purple-500',
    buttonBg: 'bg-purple-600',
    buttonText: 'text-white hover:bg-purple-700',
    cardBg: 'bg-white',
    borderColor: 'border-purple-200',
  },
  'basic-checkup': {
    headerBg: 'bg-gradient-to-r from-gray-700 to-gray-800',
    titleColor: 'text-gray-800',
    priceColor: 'text-gray-800',
    checkColor: 'text-gray-500',
    buttonBg: 'bg-gray-700',
    buttonText: 'text-white hover:bg-gray-800',
    cardBg: 'bg-gray-50',
    borderColor: 'border-gray-300',
  },
};

// 根据语言获取套餐数据
function getPackagesData(lang: Language) {
  const t = translations[lang].medical;
  return [
    {
      slug: 'vip-member-course',
      name: t.pkg_vip_title,
      nameEn: 'VIP Member Course',
      price: 1512500,
      description: t.pkg_vip_desc,
      features: [t.pkg_vip_item_1, t.pkg_vip_item_2, t.pkg_vip_item_3, t.pkg_vip_item_4, t.pkg_vip_item_5, t.pkg_vip_item_6],
      badge: 'Flagship',
    },
    {
      slug: 'premium-cardiac-course',
      name: t.pkg_premium_title,
      nameEn: 'Premium Cardiac Course',
      price: 825000,
      description: t.pkg_premium_desc,
      features: [t.pkg_premium_item_1, t.pkg_premium_item_2, t.pkg_premium_item_3, t.pkg_premium_item_4, t.pkg_premium_item_5],
    },
    {
      slug: 'select-gastro-colonoscopy',
      name: t.pkg_select_gc_title,
      nameEn: 'Gastro + Colonoscopy Course',
      price: 825000,
      description: t.pkg_select_gc_desc,
      features: [t.pkg_select_gc_item_1, t.pkg_select_gc_item_2, t.pkg_select_gc_item_3, t.pkg_select_gc_item_4, t.pkg_select_gc_item_5],
    },
    {
      slug: 'select-gastroscopy',
      name: t.pkg_select_g_title,
      nameEn: 'Gastroscopy Course',
      price: 687500,
      description: t.pkg_select_g_desc,
      features: [t.pkg_select_g_item_1, t.pkg_select_g_item_2, t.pkg_select_g_item_3, t.pkg_select_g_item_4, t.pkg_select_g_item_5],
    },
    {
      slug: 'dwibs-cancer-screening',
      name: t.pkg_dwibs_title,
      nameEn: 'DWIBS Cancer Screening',
      price: 275000,
      description: t.pkg_dwibs_desc,
      features: [t.pkg_dwibs_item_1, t.pkg_dwibs_item_2, t.pkg_dwibs_item_3, t.pkg_dwibs_item_4, t.pkg_dwibs_item_5],
    },
    {
      slug: 'basic-checkup',
      name: t.pkg_basic_title,
      nameEn: 'Standard Checkup Course',
      price: 550000,
      description: t.pkg_basic_desc,
      features: [t.pkg_basic_item_1, t.pkg_basic_item_2, t.pkg_basic_item_3, t.pkg_basic_item_4, t.pkg_basic_item_5],
    },
  ];
}

export default function MedicalPackagesFullPage({ guideSlug, brandColor, brandName }: MedicalPackagesFullPageProps) {
  const [currentLang, setCurrentLang] = useState<Language>('zh-TW');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setCurrentLang(value as Language);
        return;
      }
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
  }, []);

  const packages = getPackagesData(currentLang);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/g/${guideSlug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">返回 {brandName}</span>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-emerald-300 text-sm tracking-[0.3em] uppercase mb-4">TIMC Health Checkup</p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            日本 TIMC 精密体检
          </h1>
          <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto">
            德洲会国际医疗中心（TIMC）提供世界顶级精密体检服务
          </p>
        </div>
      </div>

      {/* About TIMC */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">关于 TIMC</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              TIMC（德洲会国际医疗中心）位于大阪JR站直达的JP Tower大楼11层，
              配备PET-CT、3.0T MRI、内视镜等世界顶级医疗设备，提供中文全程服务。
              作为日本最大医疗集团——德洲会集团旗下的国际医疗中心，为海外客户提供精密体检与专科医疗服务。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl border">
              <Building2 className="mx-auto mb-3 text-emerald-600" size={32} />
              <h3 className="font-bold text-gray-900 mb-1">大阪市中心</h3>
              <p className="text-sm text-gray-500">JP Tower大楼 11F，JR大阪站直达</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border">
              <Stethoscope className="mx-auto mb-3 text-emerald-600" size={32} />
              <h3 className="font-bold text-gray-900 mb-1">顶级设备</h3>
              <p className="text-sm text-gray-500">PET-CT · 3.0T MRI · 无痛内视镜</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border">
              <Globe className="mx-auto mb-3 text-emerald-600" size={32} />
              <h3 className="font-bold text-gray-900 mb-1">中文全程服务</h3>
              <p className="text-sm text-gray-500">中文接待 · 翻译陪诊 · 报告解读</p>
            </div>
          </div>
        </div>
      </section>

      {/* Package Cards */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">精选体检套餐</h2>
            <p className="text-gray-600">6 大套餐满足不同健康需求，从基础到 VIP 全覆盖</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const colors = packageColors[pkg.slug];
              if (!colors) return null;
              return (
                <div
                  key={pkg.slug}
                  className={`rounded-2xl overflow-hidden border-2 ${colors.borderColor} ${colors.cardBg} flex flex-col`}
                >
                  {/* Header */}
                  <div className={`${colors.headerBg} px-6 py-5 text-white`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold">{pkg.name}</h4>
                      {pkg.badge && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${colors.badgeBg || 'bg-white/20 text-white'}`}>
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${colors.isVIP ? 'text-gray-400' : 'text-white/70'}`}>{pkg.nameEn}</p>
                  </div>

                  {/* Price */}
                  <div className="px-6 py-4 border-b">
                    <div className={`text-2xl font-bold ${colors.priceColor}`}>
                      ¥{pkg.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500 ml-1">（含税）</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="px-6 pt-4">
                    <p className={`text-sm leading-relaxed mb-3 ${colors.isVIP ? 'text-gray-300' : 'text-gray-600'}`}>
                      {pkg.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="px-6 py-3 flex-1">
                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={16} className={`${colors.checkColor} flex-shrink-0 mt-0.5`} />
                          <span className={colors.isVIP ? 'text-gray-200' : 'text-gray-700'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="px-6 pb-6 pt-4">
                    <Link
                      href={`/g/${guideSlug}/medical-packages/${pkg.slug}`}
                      className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${colors.buttonBg} ${colors.buttonText}`}
                    >
                      查看详情 & 预约
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">不确定选哪个套餐？</h3>
          <p className="text-gray-600 mb-6">我们的健康顾问可以根据您的需求和健康状况，为您推荐最合适的体检方案。</p>
          <Link
            href={`/g/${guideSlug}#contact`}
            className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            咨询健康顾问
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>体检服务由 TIMC 德洲会国际医疗中心 提供</p>
          <p className="mt-1">旅行服务由 新岛交通株式会社 提供 · 大阪府知事登录旅行业 第2-3115号</p>
        </div>
      </footer>
    </div>
  );
}
