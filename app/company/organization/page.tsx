'use client';

import React from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { User, Users, Building, Briefcase, Heart, Globe, Code, Headphones } from 'lucide-react';

export default function OrganizationPage() {
  return (
    <CompanyLayout
      title="組織体制"
      titleEn="Organization"
      breadcrumb={[
        { label: '企業情報', path: '/company' },
        { label: '組織体制' }
      ]}
    >
      <div className="space-y-12">
        {/* 組織図 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-8 pb-3 border-b-2 border-blue-600">
            組織図
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* 代表取締役 */}
              <div className="flex justify-center mb-8">
                <div className="bg-slate-900 text-white px-8 py-4 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">代表取締役</div>
                    <div className="font-bold text-lg">袁 浩</div>
                  </div>
                </div>
              </div>

              {/* 連結線 */}
              <div className="flex justify-center mb-8">
                <div className="w-0.5 h-8 bg-gray-300" />
              </div>

              {/* 各部門 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: '営業本部', icon: Briefcase, color: 'blue', teams: ['法人営業部', 'インバウンド営業部', 'パートナー開発部'] },
                  { name: '医療事業部', icon: Heart, color: 'rose', teams: ['健診手配課', 'がん治療課', 'カスタマーサポート課'] },
                  { name: 'ツーリズム事業部', icon: Globe, color: 'amber', teams: ['ゴルフ企画課', 'ビジネス視察課', '手配課'] },
                  { name: '管理本部', icon: Building, color: 'slate', teams: ['経理部', '人事総務部', 'システム開発部'] },
                ].map((dept, index) => {
                  const Icon = dept.icon;
                  const colorClasses: Record<string, string> = {
                    blue: 'bg-blue-50 border-blue-200 text-blue-600',
                    rose: 'bg-rose-50 border-rose-200 text-rose-600',
                    amber: 'bg-amber-50 border-amber-200 text-amber-600',
                    slate: 'bg-slate-50 border-slate-200 text-slate-600',
                  };
                  const iconBg: Record<string, string> = {
                    blue: 'bg-blue-100',
                    rose: 'bg-rose-100',
                    amber: 'bg-amber-100',
                    slate: 'bg-slate-100',
                  };

                  return (
                    <div key={index} className="space-y-2">
                      {/* 連結線 */}
                      <div className="flex justify-center">
                        <div className="w-0.5 h-4 bg-gray-300" />
                      </div>

                      {/* 部門カード */}
                      <div className={`p-4 rounded-xl border-2 ${colorClasses[dept.color]}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-8 h-8 ${iconBg[dept.color]} rounded-lg flex items-center justify-center`}>
                            <Icon size={16} />
                          </div>
                          <div className="font-bold text-gray-900 text-sm">{dept.name}</div>
                        </div>
                        <ul className="space-y-1">
                          {dept.teams.map((team, teamIndex) => (
                            <li key={teamIndex} className="text-xs text-gray-600 flex items-center gap-1">
                              <span className="w-1 h-1 bg-gray-400 rounded-full" />
                              {team}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 役員紹介 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            役員紹介
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                position: '代表取締役',
                name: '袁 浩',
                nameEn: 'Yuan Hao',
                photo: 'https://i.ibb.co/B2mJDvq7/founder.jpg',
                bio: '早稲田大学卒業。大手旅行会社勤務を経て、2018年に新島交通を創業。華人旅客向けインバウンド事業の先駆者として業界をリード。',
              },
              {
                position: '取締役 営業本部長',
                name: '田中 誠一',
                nameEn: 'Seiichi Tanaka',
                photo: null,
                bio: '大手旅行会社にて法人営業部長を歴任。20年以上の業界経験を活かし、法人向けサービスを統括。',
              },
              {
                position: '取締役 医療事業部長',
                name: '李 美華',
                nameEn: 'Meihua Li',
                photo: null,
                bio: '医療通訳者として10年の経験。TIMC連携の立ち上げから参画し、医療ツーリズム事業を牽引。',
              },
              {
                position: '監査役',
                name: '山本 健太郎',
                nameEn: 'Kentaro Yamamoto',
                photo: null,
                bio: '公認会計士。大手監査法人パートナーを経て就任。コーポレートガバナンスの強化に尽力。',
              },
            ].map((person, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-blue-600 font-medium mb-1">{person.position}</div>
                  <div className="font-bold text-gray-900">{person.name}</div>
                  <div className="text-xs text-gray-400 mb-2">{person.nameEn}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 従業員データ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            従業員データ
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '従業員数', value: '25名', note: '2024年12月現在' },
              { label: '平均年齢', value: '34歳', note: '' },
              { label: '男女比', value: '4:6', note: '女性比率60%' },
              { label: '外国籍社員', value: '40%', note: '多国籍チーム' },
            ].map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                {stat.note && <div className="text-xs text-gray-400 mt-1">{stat.note}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </CompanyLayout>
  );
}
