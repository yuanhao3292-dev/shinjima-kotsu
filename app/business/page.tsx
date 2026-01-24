'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CompanyLayout from '@/components/CompanyLayout';
import { ArrowRight } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  intro: {
    ja: '新島交通は、医療ツーリズム、ゴルフツーリズム、ビジネス視察、ガイドパートナーの四大領域で、華人旅客と日本の高品質な資源をつなぐサービスを提供しています。',
    'zh-TW': '新島交通在醫療旅遊、高爾夫旅遊、商務考察、導遊合夥人四大領域，提供連結華人旅客與日本高品質資源的服務。',
    'zh-CN': '新岛交通在医疗旅游、高尔夫旅游、商务考察、导游合伙人四大领域，提供连接华人旅客与日本高品质资源的服务。',
    en: 'NIIJIMA KOTSU provides services connecting Chinese-speaking travelers with Japan\'s premium resources across four major domains: medical tourism, golf tourism, business inspections, and guide partnerships.',
  },
  medicalTitle: {
    ja: '医療ツーリズム',
    'zh-TW': '醫療旅遊',
    'zh-CN': '医疗旅游',
    en: 'Medical Tourism',
  },
  medicalDesc: {
    ja: '世界最先端の日本の医療技術を活用した精密健診・がん治療サービス。TIMC（徳洲会国際医療センター）と提携し、PET-CT、MRI、内視鏡など高度な検査を提供。',
    'zh-TW': '運用日本世界領先的醫療技術提供精密健檢・癌症治療服務。與TIMC（德洲會國際醫療中心）合作，提供PET-CT、MRI、內視鏡等高端檢查。',
    'zh-CN': '运用日本世界领先的医疗技术提供精密体检・癌症治疗服务。与TIMC（德洲会国际医疗中心）合作，提供PET-CT、MRI、内视镜等高端检查。',
    en: 'Precision health screenings and cancer treatment services utilizing Japan\'s world-leading medical technology. Partnered with TIMC for PET-CT, MRI, endoscopy, and more.',
  },
  golfTitle: {
    ja: 'ゴルフツーリズム',
    'zh-TW': '高爾夫旅遊',
    'zh-CN': '高尔夫旅游',
    en: 'Golf Tourism',
  },
  golfDesc: {
    ja: '会員制名門ゴルフ場への特別アクセス。関西・関東の20以上のプレミアムコースと提携。送迎、宿泊、食事まで完全サポート。',
    'zh-TW': '會員制名門高爾夫球場的特別通道。與關西・關東20多家頂級球場合作。接送、住宿、餐飲全程服務。',
    'zh-CN': '会员制名门高尔夫球场的特别通道。与关西・关东20多家顶级球场合作。接送、住宿、餐饮全程服务。',
    en: 'Exclusive access to prestigious membership golf courses. Partnered with over 20 premium courses in Kansai and Kanto. Full support including transfers, accommodation, and dining.',
  },
  inspectionTitle: {
    ja: 'ビジネス視察',
    'zh-TW': '商務考察',
    'zh-CN': '商务考察',
    en: 'Business Inspections',
  },
  inspectionDesc: {
    ja: '日本企業・工場への視察ツアーをカスタマイズ。製造業、医療、テクノロジー分野での深い知見を提供。',
    'zh-TW': '客製化日本企業・工廠考察行程。提供製造業、醫療、科技領域的深入見解。',
    'zh-CN': '定制化日本企业・工厂考察行程。提供制造业、医疗、科技领域的深入见解。',
    en: 'Customized inspection tours to Japanese companies and factories. Deep insights in manufacturing, medical, and technology sectors.',
  },
  partnerTitle: {
    ja: 'ガイドパートナー',
    'zh-TW': '導遊合夥人',
    'zh-CN': '导游合伙人',
    en: 'Guide Partner Program',
  },
  partnerDesc: {
    ja: '在日華人ガイド向けのホワイトラベルソリューション。旅行会社レベルのリソースと技術を提供し、個人ガイドのビジネスをサポート。',
    'zh-TW': '在日華人導遊的白標解決方案。提供旅行社級別的資源與技術，支持個人導遊的業務發展。',
    'zh-CN': '在日华人导游的白标解决方案。提供旅行社级别的资源与技术，支持个人导游的业务发展。',
    en: 'White-label solutions for Chinese-speaking guides in Japan. Providing travel agency-level resources and technology to support individual guide businesses.',
  },
  medicalStats: {
    ja: ['累計5,000名+', 'TIMC公式代理', '中国語サポート'],
    'zh-TW': ['累計5,000名+', 'TIMC官方代理', '中文支援'],
    'zh-CN': ['累计5,000名+', 'TIMC官方代理', '中文支持'],
    en: ['5,000+ Served', 'Official TIMC Agent', 'Chinese Support'],
  },
  golfStats: {
    ja: ['名門20コース+', 'VIP待遇', '専属キャディ'],
    'zh-TW': ['20+名門球場', 'VIP待遇', '專屬球僮'],
    'zh-CN': ['20+名门球场', 'VIP待遇', '专属球僮'],
    en: ['20+ Premium Courses', 'VIP Treatment', 'Dedicated Caddy'],
  },
  inspectionStats: {
    ja: ['100社+視察実績', 'オーダーメイド', '通訳同行'],
    'zh-TW': ['100+企業考察', '量身定制', '翻譯隨行'],
    'zh-CN': ['100+企业考察', '量身定制', '翻译随行'],
    en: ['100+ Companies', 'Tailor-made', 'Interpreter Included'],
  },
  partnerStats: {
    ja: ['3,000名+ネットワーク', 'AIツール提供', '高還元率'],
    'zh-TW': ['3,000+人網絡', 'AI工具支援', '高回饋率'],
    'zh-CN': ['3,000+人网络', 'AI工具支持', '高回馈率'],
    en: ['3,000+ Network', 'AI Tools', 'High Returns'],
  },
};

export default function BusinessIndexPage() {
  const [currentLang, setCurrentLang] = useState<Language>('ja');

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

  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][currentLang];

  const businessItems = [
    {
      title: t('medicalTitle') as string,
      titleEn: 'Medical Tourism',
      description: t('medicalDesc') as string,
      link: '/business/medical',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800',
      stats: t('medicalStats') as string[],
    },
    {
      title: t('golfTitle') as string,
      titleEn: 'Golf Tourism',
      description: t('golfDesc') as string,
      link: '/business/golf',
      image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800',
      stats: t('golfStats') as string[],
    },
    {
      title: t('inspectionTitle') as string,
      titleEn: 'Business Inspection',
      description: t('inspectionDesc') as string,
      link: '/business/inspection',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800',
      stats: t('inspectionStats') as string[],
    },
    {
      title: t('partnerTitle') as string,
      titleEn: 'Guide Partner Program',
      description: t('partnerDesc') as string,
      link: '/business/partner',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
      stats: t('partnerStats') as string[],
    },
  ];

  return (
    <CompanyLayout
      title={{ ja: '事業領域', 'zh-TW': '事業領域', 'zh-CN': '业务领域', en: 'Business Domains' }}
      titleEn="Business Domains"
      breadcrumb={[{ label: { ja: '事業領域', 'zh-TW': '事業領域', 'zh-CN': '业务领域', en: 'Business Domains' } }]}
    >
      <div className="space-y-8">
        <p className="text-lg text-gray-600 leading-relaxed">
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 gap-6">
          {businessItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg border border-gray-100 transition-all"
            >
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">{item.titleEn}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.stats.map((stat, statIndex) => (
                    <span key={statIndex} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </CompanyLayout>
  );
}
