'use client';

import React from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { MapPin, Phone, Mail, Clock, Train, Building } from 'lucide-react';

export default function AccessPage() {
  return (
    <CompanyLayout
      title="所在地"
      titleEn="Access"
      breadcrumb={[
        { label: '企業情報', path: '/company' },
        { label: '所在地' }
      ]}
    >
      <div className="space-y-12">
        {/* 本社 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            本社
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 地図 */}
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.0!2d135.5!3d34.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQwJzQ4LjAiTiAxMzXCsDMwJzAwLjAiRQ!5e0!3m2!1sja!2sjp!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* 詳細情報 */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">新島交通株式会社 本社</div>
                  <div className="text-gray-600">NIIJIMA KOTSU Co., Ltd. Headquarters</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">住所</div>
                  <div className="text-gray-600">
                    〒556-0014<br />
                    大阪府大阪市浪速区大国1-2-21<br />
                    NICビル602号
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Train size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">アクセス</div>
                  <div className="text-gray-600">
                    大阪メトロ 御堂筋線・四つ橋線「大国町」駅 徒歩3分<br />
                    南海本線「今宮戎」駅 徒歩5分
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">電話番号</div>
                  <div className="text-gray-600">06-6632-8807</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">メール</div>
                  <div className="text-gray-600">info@niijima-koutsu.jp</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">営業時間</div>
                  <div className="text-gray-600">
                    平日 9:00 - 18:00<br />
                    <span className="text-sm text-gray-400">※土日祝日は休業</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 提携施設 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            主要提携施設
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'TIMC OSAKA',
                nameJa: '徳洲会国際医療センター',
                address: '大阪市北区梅田3-2-2 JP TOWER OSAKA 11F',
                type: '医療施設',
              },
              {
                name: '関西名門ゴルフ倶楽部',
                nameJa: 'Kansai Elite Golf Club',
                address: '大阪府・兵庫県・奈良県 各所',
                type: 'ゴルフ施設',
              },
            ].map((facility, index) => (
              <div key={index} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-blue-600 font-medium mb-1">{facility.type}</div>
                <div className="font-bold text-gray-900 mb-1">{facility.name}</div>
                <div className="text-sm text-gray-600 mb-2">{facility.nameJa}</div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={14} />
                  {facility.address}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CompanyLayout>
  );
}
