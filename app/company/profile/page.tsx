'use client';

import React from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { Award, Shield, Building2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <CompanyLayout
      title="会社概要"
      titleEn="Company Profile"
      breadcrumb={[
        { label: '企業情報', path: '/company' },
        { label: '会社概要' }
      ]}
    >
      <div className="space-y-12">
        {/* 会社概要表 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            会社概要
          </h2>

          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              {[
                { label: '商号', value: '新島交通株式会社' },
                { label: '英文商号', value: 'NIIJIMA KOTSU Co., Ltd.' },
                { label: '設立', value: '2018年4月' },
                { label: '資本金', value: '1,000万円' },
                { label: '代表者', value: '代表取締役 袁 浩（Yuan Hao）' },
                { label: '従業員数', value: '25名（2024年12月現在）' },
                { label: '本社所在地', value: '〒541-0053\n大阪府大阪市中央区本町1丁目5番6号\n山甚ビル 8F' },
                { label: '電話番号', value: '06-6632-8807' },
                { label: 'メール', value: 'info@niijima-koutsu.jp' },
                { label: '事業内容', value: '・インバウンド旅行事業\n・医療ツーリズム事業\n・ゴルフツーリズム事業\n・ビジネス視察事業\n・地域交通事業\n・旅行業システム開発' },
              ].map((row, index) => (
                <tr key={index} className="flex flex-col md:table-row">
                  <th className="py-4 pr-6 text-left font-bold text-gray-900 bg-gray-50 md:bg-transparent md:w-40 px-4 md:px-0">
                    {row.label}
                  </th>
                  <td className="py-4 text-gray-600 whitespace-pre-line px-4 md:px-0">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 登録・許認可 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            登録・許認可
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Award,
                title: '第二種旅行業',
                number: '大阪府知事登録 第2-XXXX号',
                desc: '国内旅行・海外旅行の手配旅行業務'
              },
              {
                icon: Shield,
                title: '全国旅行業協会',
                number: '正会員',
                desc: 'ANTA 全国旅行業協会 正会員'
              },
              {
                icon: Building2,
                title: 'TIMC公式代理店',
                number: '認定番号 TIMC-2020-001',
                desc: '徳洲会国際医療センター 公式予約代理店'
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.number}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 取引銀行 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            取引銀行
          </h2>

          <ul className="space-y-2 text-gray-600">
            <li>・三菱UFJ銀行 大阪営業部</li>
            <li>・三井住友銀行 本町支店</li>
            <li>・りそな銀行 大阪本店営業部</li>
          </ul>
        </section>

        {/* 主要取引先 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            主要取引先
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              '徳洲会グループ',
              'TIMC OSAKA',
              '関西名門ゴルフ倶楽部',
              '帝国ホテル大阪',
              'ザ・リッツ・カールトン',
              'ANA',
              'JAL',
              'JR西日本',
            ].map((partner, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg text-center text-sm font-medium text-gray-700">
                {partner}
              </div>
            ))}
          </div>
        </section>
      </div>
    </CompanyLayout>
  );
}
