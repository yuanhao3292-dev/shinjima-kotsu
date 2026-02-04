'use client';

import { Check } from 'lucide-react';
import type { WhitelabelModuleProps } from './types';
import WhitelabelContactSection from './WhitelabelContactSection';

interface PackageData {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  features: string[];
  badge?: string;
  colors: {
    headerBg: string;
    titleColor: string;
    priceColor: string;
    checkColor: string;
    buttonBg: string;
    buttonText: string;
    cardBg: string;
    borderColor: string;
  };
}

const PACKAGES: PackageData[] = [
  {
    slug: 'vip-member-course',
    name: 'VIP 会员套餐',
    subtitle: '商务精英至尊方案，脑、心脏、全身癌筛+内视镜一体化',
    price: 1512500,
    badge: '旗舰',
    features: [
      'MRI: 脑(MRA)+心脏+DWIBS+骨盆',
      'CT: 胸部+冠状动脉钙化+内脏脂肪',
      '内视镜: 胃+大肠（镇静下）',
      '超声: 颈部/心脏/腹部/下肢/乳腺(女)',
      'PET/CT: 全身癌症扫描',
      'VIP: 私人套房 + 美食券×2',
    ],
    colors: {
      headerBg: 'bg-gray-900',
      titleColor: 'text-yellow-400',
      priceColor: 'text-yellow-400',
      checkColor: 'text-yellow-500',
      buttonBg: 'bg-yellow-500',
      buttonText: 'text-black',
      cardBg: 'bg-gray-900',
      borderColor: 'border-yellow-500',
    },
  },
  {
    slug: 'premium-cardiac-course',
    name: '高端心脏套餐',
    subtitle: '针对高压人群，深度评估猝死和动脉硬化风险',
    price: 825000,
    features: [
      'MRI: 心脏(无造影)+脑MRA+DWIBS',
      'CT: 胸部+冠状动脉钙化评分',
      '超声: 心脏、颈动脉、下肢',
      '血液: NTproBNP、肌钙蛋白T、CPK',
      '功能: ABI/CAVI（血管年龄）',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
      titleColor: 'text-blue-900',
      priceColor: 'text-blue-900',
      checkColor: 'text-blue-500',
      buttonBg: 'bg-blue-600',
      buttonText: 'text-white',
      cardBg: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  },
  {
    slug: 'select-gastro-colonoscopy',
    name: '胃肠镜精选套餐',
    subtitle: '一次完成上下消化道筛查（镇静下），发现息肉当场切除',
    price: 825000,
    features: [
      '内视镜: 胃+大肠（镇静下）',
      '处置: 发现息肉当场切除',
      '超声: 腹部(肝/胆/胰/脾/肾)',
      '感染: 幽门螺杆菌抗体',
      '血液: 消化道肿瘤标志物',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-green-600 to-green-700',
      titleColor: 'text-green-900',
      priceColor: 'text-green-900',
      checkColor: 'text-green-500',
      buttonBg: 'bg-green-600',
      buttonText: 'text-white',
      cardBg: 'bg-white',
      borderColor: 'border-green-200',
    },
  },
  {
    slug: 'select-gastroscopy',
    name: '胃镜精选套餐',
    subtitle: '高胃癌风险人群首选，无需肠道准备，检查时间短',
    price: 687500,
    features: [
      '内视镜: 胃镜（经口/经鼻）',
      '超声: 腹部(肝/胆/胰/脾/肾)',
      '感染: 幽门螺杆菌抗体',
      '血液: 胃癌风险+肿瘤标志物',
      '基础: 身体测量、视力、听力、心电图',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-teal-600 to-teal-700',
      titleColor: 'text-teal-800',
      priceColor: 'text-teal-800',
      checkColor: 'text-teal-500',
      buttonBg: 'bg-teal-600',
      buttonText: 'text-white',
      cardBg: 'bg-white',
      borderColor: 'border-teal-200',
    },
  },
  {
    slug: 'dwibs-cancer-screening',
    name: 'DWIBS 癌症筛查',
    subtitle: '无辐射全身癌症MRI，无造影剂，适合定期复查',
    price: 275000,
    features: [
      'MRI: DWIBS（颈部至骨盆）',
      '血液: 全套肿瘤标志物',
      '血液: 肝肾功能、甲状腺',
      '特点: 无辐射、无痛、无创',
      '基础: 身体测量、视力、听力、心电图',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-purple-600 to-purple-700',
      titleColor: 'text-purple-900',
      priceColor: 'text-purple-900',
      checkColor: 'text-purple-500',
      buttonBg: 'bg-purple-600',
      buttonText: 'text-white',
      cardBg: 'bg-white',
      borderColor: 'border-purple-200',
    },
  },
  {
    slug: 'basic-checkup',
    name: '基础体检套餐',
    subtitle: '标准体检项目，含血液、影像和超声，性价比之选',
    price: 550000,
    features: [
      '影像: 胸部X线 + 腹部超声',
      '血液: 肝肾功能/血脂/血糖/甲状腺/肿瘤标志物',
      '基础: 视力、听力、眼压、眼底、心电图',
      '标本: 尿检 + 粪便潜血（2日法）',
      '口腔: 口腔扫描、X线、餐券',
    ],
    colors: {
      headerBg: 'bg-gradient-to-r from-gray-700 to-gray-800',
      titleColor: 'text-gray-800',
      priceColor: 'text-gray-800',
      checkColor: 'text-gray-500',
      buttonBg: 'bg-gray-700',
      buttonText: 'text-white',
      cardBg: 'bg-gray-50',
      borderColor: 'border-gray-300',
    },
  },
];

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export default function MedicalPackagesModule({ brandColor, brandName, contactInfo, showContact }: WhitelabelModuleProps) {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">TIMC 健检套餐</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            德洲会国际医疗中心 6 大健检套餐，从基础到 VIP 全覆盖
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            TIMC（德洲会国际医疗中心）位于大阪JR站直达的JP Tower大楼11层，
            配备PET-CT、MRI、内视镜等世界顶级医疗设备，提供中文全程服务。
            以下为6大精选健检套餐，满足不同需求。
          </p>
        </div>
      </section>

      {/* Package Cards */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.slug}
                className={`rounded-2xl overflow-hidden border-2 ${pkg.colors.borderColor} ${pkg.colors.cardBg} flex flex-col`}
              >
                {/* Header */}
                <div className={`${pkg.colors.headerBg} px-6 py-5 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold">{pkg.name}</h4>
                    {pkg.badge && (
                      <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded-full">
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-white/80 text-sm">{pkg.subtitle}</p>
                </div>

                {/* Price */}
                <div className="px-6 py-4 border-b">
                  <div className={`text-2xl font-bold ${pkg.colors.priceColor}`}>
                    {formatPrice(pkg.price)}
                    <span className="text-sm font-normal text-gray-500 ml-1">（含税）</span>
                  </div>
                </div>

                {/* Features */}
                <div className="px-6 py-4 flex-1">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check size={16} className={`${pkg.colors.checkColor} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button - replaced Stripe link with contact */}
                <div className="px-6 pb-6">
                  <button
                    className={`w-full py-3 rounded-xl font-bold transition hover:opacity-90 ${pkg.colors.buttonBg} ${pkg.colors.buttonText}`}
                    onClick={() => {
                      document.getElementById('whitelabel-contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    咨询预约
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      {showContact !== false && (
        <div id="whitelabel-contact">
          <WhitelabelContactSection
            brandColor={brandColor}
            brandName={brandName}
            contactInfo={contactInfo}
          />
        </div>
      )}
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
