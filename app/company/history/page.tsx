'use client';

import React from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { Building2, Award, Heart, Star, Sparkles, Users, Globe, Rocket } from 'lucide-react';

const historyData = [
  {
    year: '2020',
    month: '2月',
    title: '新島交通株式会社 設立',
    description: '大阪市浪速区にて創業。「華人旅客と日本の高品質な観光資源をつなぐ」をミッションに事業開始。',
    icon: Building2,
    highlight: true,
  },
  {
    year: '2020',
    month: '6月',
    title: '第二種旅行業登録取得',
    description: '大阪府知事より第二種旅行業の登録を取得。国内・海外旅行の手配業務を本格開始。',
    icon: Award,
  },
  {
    year: '2020',
    month: '9月',
    title: '全国旅行業協会（ANTA）加盟',
    description: '業界団体への正会員加盟により、信頼性と業界ネットワークを強化。',
    icon: Award,
  },
  {
    year: '2021',
    month: '3月',
    title: '医療ツーリズム事業部 発足',
    description: '徳洲会国際医療センター（TIMC）と戦略的パートナーシップを締結。精密健診市場に本格参入。',
    icon: Heart,
    highlight: true,
  },
  {
    year: '2021',
    month: '10月',
    title: 'TIMC公式予約代理店 認定',
    description: 'TIMC OSAKAの公式予約代理店として認定を取得。',
    icon: Award,
  },
  {
    year: '2021',
    month: '4月',
    title: 'ゴルフツーリズム事業 開始',
    description: '関西地区20以上の会員制名門ゴルフ場と独占提携契約を締結。',
    icon: Star,
  },
  {
    year: '2022',
    month: '7月',
    title: 'ビジネス視察事業 拡大',
    description: '企業向け日本視察ツアーのカスタマイズサービスを強化。製造業・医療・テック分野での視察実績蓄積。',
    icon: Globe,
  },
  {
    year: '2023',
    month: '9月',
    title: 'AI報価システム「LinkQuote」リリース',
    description: '自社開発のAI搭載見積もりエンジンをリリース。24時間即時見積もり対応を実現。',
    icon: Sparkles,
    highlight: true,
  },
  {
    year: '2024',
    month: '3月',
    title: 'ガイドパートナープログラム 開始',
    description: '在日華人ガイド向けホワイトラベルソリューションを提供開始。3,000名以上のガイドネットワークを構築。',
    icon: Users,
    highlight: true,
  },
  {
    year: '2024',
    month: '8月',
    title: '従業員数25名突破',
    description: '事業拡大に伴い、組織体制を強化。',
    icon: Users,
  },
  {
    year: '2025',
    month: '1月',
    title: '総合医療サービス事業 拡充',
    description: 'がん治療（陽子線・光免疫・BNCT）紹介サービスを新設。医療ツーリズムの領域を拡大。',
    icon: Rocket,
    highlight: true,
  },
];

export default function HistoryPage() {
  return (
    <CompanyLayout
      title="沿革"
      titleEn="History"
      breadcrumb={[
        { label: '企業情報', path: '/company' },
        { label: '沿革' }
      ]}
    >
      <div className="space-y-8">
        <p className="text-gray-600 leading-relaxed">
          2020年の創業以来、新島交通は「華人旅客と日本をつなぐ架け橋」として着実に成長を続けてまいりました。
        </p>

        {/* タイムライン */}
        <div className="relative">
          {/* 縦線 */}
          <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600" />

          <div className="space-y-0">
            {historyData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
                  {/* 年月 */}
                  <div className="w-20 flex-shrink-0 text-right">
                    <div className="font-bold text-gray-900">{item.year}</div>
                    <div className="text-sm text-gray-500">{item.month}</div>
                  </div>

                  {/* アイコン */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.highlight
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}>
                    <Icon size={18} />
                  </div>

                  {/* 内容 */}
                  <div className={`flex-1 pb-8 ${item.highlight ? '' : ''}`}>
                    <div className={`p-4 rounded-xl ${
                      item.highlight
                        ? 'bg-blue-50 border border-blue-100'
                        : 'bg-gray-50 border border-gray-100'
                    }`}>
                      <h3 className={`font-bold mb-1 ${
                        item.highlight ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
