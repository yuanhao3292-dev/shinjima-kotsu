import Link from 'next/link';
import { ArrowRight, Shield, Award, MapPin } from 'lucide-react';
import { COLOR_THEMES } from '@/lib/types/display-config';

/**
 * /g/demo — 独立 demo 白标页面
 * 硬编码数据，不依赖任何真实导游账户或数据库查询
 * 用于 guide-partner 页面的 iframe 预览展示
 */

const DEMO_BRAND = '示例品牌';
const DEMO_PRODUCTS = [
  {
    componentKey: 'medical_packages',
    href: '/g/demo/medical-packages',
    heroImage: 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg',
    colorTheme: 'teal' as const,
    tagline: 'Premium Health Screening',
    title: '日本精密健康检查',
    description: '在日本医疗机构进行全面精密体检，提供中文陪诊服务。',
    stats: [
      { value: '300+', unit: '项', label: '检查项目' },
      { value: '70+', unit: '项', label: '精密项目' },
      { value: '24h', unit: '', label: '报告出具' },
    ],
    ctaText: '了解详情',
  },
  {
    componentKey: 'hyogo_medical',
    href: '/g/demo/hyogo-medical',
    heroImage: 'https://www.hosp.hyo-med.ac.jp/library/petcenter/institution/img/img01.jpg',
    colorTheme: 'emerald' as const,
    tagline: 'University Hospital',
    title: '兵库医科大学病院',
    description: '拥有近百年历史的综合大学病院，重离子线治疗、达芬奇手术机器人等先进医疗技术。',
    stats: [
      { value: '963', unit: '床', label: '病床规模' },
      { value: '30+', unit: '科', label: '诊疗科室' },
      { value: '1928', unit: '年', label: '创立' },
    ],
    ctaText: '了解详情',
  },
  {
    componentKey: 'sai_clinic',
    href: '/g/demo/sai-clinic',
    heroImage: 'https://saicli.jp/wp-content/themes/initializr/img/topFvImg01.jpg',
    colorTheme: 'rose' as const,
    tagline: 'Aesthetic Medicine',
    title: 'SAI 美容外科诊所',
    description: '日本关西医美整形诊所，糸リフト、注射美容、眼鼻整形等项目。',
    stats: [
      { value: '15,000+', unit: '例', label: '累计案例' },
      { value: '10+', unit: '年', label: '临床经验' },
    ],
    ctaText: '了解详情',
  },
  {
    componentKey: 'helene_clinic',
    href: '/g/demo/helene-clinic',
    heroImage: 'https://stemcells.jp/en/wp-content/themes/flavor_flavor_flavor/images/top/top-firstview-bg.webp',
    colorTheme: 'indigo' as const,
    tagline: 'Regenerative Medicine',
    title: '干细胞再生医疗',
    description: '日本再生医疗诊所，提供干细胞疗法、免疫调理等再生医疗服务。',
    stats: [
      { value: '10+', unit: '年', label: '临床经验' },
      { value: '5,000+', unit: '例', label: '治疗案例' },
    ],
    ctaText: '了解详情',
  },
];

export default function DemoWhiteLabelPage() {
  const heroProduct = DEMO_PRODUCTS[0];
  const heroTheme = COLOR_THEMES[heroProduct.colorTheme];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gray-950">
        <img
          src={heroProduct.heroImage}
          alt={heroProduct.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${heroTheme.gradientFrom} ${heroTheme.gradientVia} to-transparent`} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-white/40" />
              <span className="text-xs tracking-[0.3em] text-white/70 uppercase">
                {heroProduct.tagline}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {heroProduct.title}
            </h1>

            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              {heroProduct.description}
            </p>

            <div className="flex gap-8 mb-10">
              {heroProduct.stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}<span className="text-white/60 text-xl ml-1">{stat.unit}</span>
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <Link href={heroProduct.href} className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              {heroProduct.ctaText} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Sections */}
      {DEMO_PRODUCTS.slice(1).map((product, index) => {
        const theme = COLOR_THEMES[product.colorTheme];

        return (
          <section
            key={product.componentKey}
            className="relative min-h-screen flex items-center overflow-hidden"
            id={`service-${index + 1}`}
          >
            <img
              src={product.heroImage}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} to-transparent`} />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-white/40" />
                  <span className="text-xs tracking-[0.3em] text-white/70 uppercase">
                    {product.tagline}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  {product.title}
                </h2>

                <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                  {product.description}
                </p>

                {product.stats.length > 0 && (
                  <div className="flex gap-8 mb-10">
                    {product.stats.map((stat, idx) => (
                      <div key={idx}>
                        <div className="text-3xl font-bold text-white mb-1">
                          {stat.value}<span className="text-white/60 text-xl ml-1">{stat.unit}</span>
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <Link href={product.href} className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  {product.ctaText} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">持牌旅行社保障</h4>
              <p className="text-sm text-gray-500">新岛交通株式会社<br />大阪府知事登録旅行業 第2-3115号</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Award size={24} className="text-amber-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">合作医疗机构</h4>
              <p className="text-sm text-gray-500">合作医院为日本注册医疗机构</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <MapPin size={24} className="text-emerald-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">全程中文服务</h4>
              <p className="text-sm text-gray-500">从咨询到术后跟进<br />全程专业中文陪同</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
