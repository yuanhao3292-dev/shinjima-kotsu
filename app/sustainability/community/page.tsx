'use client';

import React from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { MapPin, Users, Building, Heart } from 'lucide-react';

export default function CommunityPage() {
  return (
    <CompanyLayout
      title="地域貢献"
      titleEn="Community Contribution"
      breadcrumb={[
        { label: 'サステナビリティ', path: '/sustainability' },
        { label: '地域貢献' }
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-600 leading-relaxed">
            新島交通は、観光業を通じた地域経済の活性化と、地方創生に取り組んでいます。
            大都市だけでなく、地方の魅力を海外に発信し、持続可能な観光地づくりに貢献します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-rose-600">
            主な取り組み
          </h2>

          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: '地方創生ツアーの企画',
                description: '大阪・京都だけでなく、和歌山、奈良、滋賀など関西の地方都市への観光ルートを開発。地域の隠れた魅力を海外旅行者に紹介しています。',
                achievements: ['和歌山・熊野古道ツアー', '奈良・吉野桜ツアー', '滋賀・琵琶湖周遊ツアー'],
              },
              {
                icon: Building,
                title: '地域事業者との連携',
                description: '地元の宿泊施設、飲食店、体験施設と積極的に連携し、地域経済への直接的な還元を目指しています。',
                achievements: ['地元旅館との優先契約', '農家体験プログラム', '伝統工芸体験の手配'],
              },
              {
                icon: Heart,
                title: '文化継承への支援',
                description: '日本の伝統文化や祭りへの参加機会を提供し、文化の継承と国際理解の促進に貢献しています。',
                achievements: ['祇園祭特別観覧ツアー', '茶道・華道体験', '能・狂言鑑賞会'],
              },
              {
                icon: Users,
                title: '人材育成',
                description: '地域の観光ガイドや通訳者の育成を支援し、観光業の人材不足解消に取り組んでいます。',
                achievements: ['ガイド研修プログラム', '多言語対応研修', 'インターンシップ受入'],
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.achievements.map((achievement, aIndex) => (
                          <span key={aIndex} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-rose-600">
            実績データ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '15+', label: '連携自治体' },
              { value: '50+', label: '地域事業者' },
              { value: '2,000+', label: '地方送客数/年' },
              { value: '¥5,000万+', label: '地域経済への貢献' },
            ].map((stat, index) => (
              <div key={index} className="p-4 bg-rose-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-rose-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CompanyLayout>
  );
}
