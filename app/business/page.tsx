'use client';

import React from 'react';
import Link from 'next/link';
import CompanyLayout, { navigationStructure } from '@/components/CompanyLayout';
import { ChevronRight, ArrowRight } from 'lucide-react';

export default function BusinessIndexPage() {
  const businessNav = navigationStructure.find(cat => cat.basePath === '/business');

  return (
    <CompanyLayout
      title="事業領域"
      titleEn="Business Domains"
      breadcrumb={[{ label: '事業領域' }]}
    >
      <div className="space-y-8">
        <p className="text-lg text-gray-600 leading-relaxed">
          新島交通は、医療ツーリズム、ゴルフツーリズム、ビジネス視察、ガイドパートナーの四大領域で、
          華人旅客と日本の高品質な資源をつなぐサービスを提供しています。
        </p>

        <div className="grid grid-cols-1 gap-6">
          {[
            {
              title: '医療ツーリズム',
              titleEn: 'Medical Tourism',
              description: '世界最先端の日本の医療技術を活用した精密健診・がん治療サービス。TIMC（徳洲会国際医療センター）と提携し、PET-CT、MRI、内視鏡など高度な検査を提供。',
              link: '/business/medical',
              image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800',
              stats: ['累計5,000名+', 'TIMC公式代理', '中国語サポート'],
            },
            {
              title: 'ゴルフツーリズム',
              titleEn: 'Golf Tourism',
              description: '会員制名門ゴルフ場への特別アクセス。関西・関東の20以上のプレミアムコースと提携。送迎、宿泊、食事まで完全サポート。',
              link: '/business/golf',
              image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800',
              stats: ['名門20コース+', 'VIP待遇', '専属キャディ'],
            },
            {
              title: 'ビジネス視察',
              titleEn: 'Business Inspection',
              description: '日本企業・工場への視察ツアーをカスタマイズ。製造業、医療、テクノロジー分野での深い知見を提供。',
              link: '/business/inspection',
              image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800',
              stats: ['100社+視察実績', 'オーダーメイド', '通訳同行'],
            },
            {
              title: 'ガイドパートナー',
              titleEn: 'Guide Partner Program',
              description: '在日華人ガイド向けのホワイトラベルソリューション。旅行会社レベルのリソースと技術を提供し、個人ガイドのビジネスをサポート。',
              link: '/business/partner',
              image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
              stats: ['3,000名+ネットワーク', 'AIツール提供', '高還元率'],
            },
          ].map((item, index) => (
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
