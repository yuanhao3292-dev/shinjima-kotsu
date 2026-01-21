'use client';

import React from 'react';
import Link from 'next/link';
import CompanyLayout from '@/components/CompanyLayout';
import { Leaf, Heart, Globe, Users, ChevronRight } from 'lucide-react';

export default function SustainabilityPage() {
  return (
    <CompanyLayout
      title="サステナビリティ"
      titleEn="Sustainability"
      breadcrumb={[{ label: 'サステナビリティ' }]}
    >
      <div className="space-y-12">
        {/* トップメッセージ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-600">
            サステナビリティへの取り組み
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            新島交通は、「持続可能な観光」を経営の柱に据え、環境・社会・ガバナンス（ESG）の
            観点から企業活動を推進しています。旅行業を通じて、地域社会への貢献と
            地球環境の保全に取り組んでまいります。
          </p>
        </section>

        {/* 方針カード */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Leaf,
              color: 'green',
              title: '環境への配慮',
              titleEn: 'Environment',
              points: [
                'ペーパーレス化の推進',
                'カーボンオフセット旅行の提案',
                '環境配慮型宿泊施設の優先案内',
              ],
            },
            {
              icon: Heart,
              color: 'rose',
              title: '地域貢献',
              titleEn: 'Community',
              points: [
                '地方創生ツアーの企画',
                '地域経済への還元',
                '伝統文化の継承支援',
              ],
              link: '/sustainability/community',
            },
            {
              icon: Users,
              color: 'blue',
              title: '多様性の尊重',
              titleEn: 'Diversity & Inclusion',
              points: [
                '多国籍チームの構成',
                '女性活躍の推進',
                'バリアフリー観光の提案',
              ],
            },
            {
              icon: Globe,
              color: 'amber',
              title: '責任ある観光',
              titleEn: 'Responsible Tourism',
              points: [
                'オーバーツーリズム対策',
                '地域住民との共生',
                '文化財保護への貢献',
              ],
            },
          ].map((item, index) => {
            const Icon = item.icon;
            const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
              green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
              rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-200' },
              blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
              amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200' },
            };
            const colors = colorClasses[item.color];

            return (
              <div key={index} className={`p-6 rounded-xl border ${colors.bg} ${colors.border}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon size={24} className={colors.icon} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500 uppercase">{item.titleEn}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {item.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.icon.replace('text-', 'bg-')}`} />
                      {point}
                    </li>
                  ))}
                </ul>
                {item.link && (
                  <Link
                    href={item.link}
                    className={`inline-flex items-center gap-1 text-sm font-medium ${colors.icon} hover:underline`}
                  >
                    詳細を見る <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            );
          })}
        </section>

        {/* SDGs */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-600">
            SDGsへの貢献
          </h2>
          <p className="text-gray-600 mb-6">
            当社の事業活動は、以下のSDGs（持続可能な開発目標）に貢献しています。
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { num: 3, label: 'すべての人に健康と福祉を', color: 'bg-green-500' },
              { num: 8, label: '働きがいも経済成長も', color: 'bg-red-600' },
              { num: 11, label: '住み続けられるまちづくりを', color: 'bg-amber-500' },
              { num: 12, label: 'つくる責任つかう責任', color: 'bg-yellow-600' },
              { num: 17, label: 'パートナーシップで目標を達成しよう', color: 'bg-blue-800' },
            ].map((sdg, index) => (
              <div
                key={index}
                className={`${sdg.color} text-white px-4 py-2 rounded-lg text-sm font-medium`}
              >
                SDG {sdg.num}
              </div>
            ))}
          </div>
        </section>
      </div>
    </CompanyLayout>
  );
}
