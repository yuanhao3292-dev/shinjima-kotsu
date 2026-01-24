'use client';

import React, { useState, useEffect } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { MapPin, Phone, Mail, Clock, Train, Building } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  sectionHQ: {
    ja: '本社',
    'zh-TW': '總部',
    'zh-CN': '总部',
    en: 'Head Office',
  },
  companyFullName: {
    ja: '新島交通株式会社 本社',
    'zh-TW': '新島交通株式會社 總部',
    'zh-CN': '新岛交通株式会社 总部',
    en: 'NIIJIMA KOTSU Co., Ltd. Head Office',
  },
  companyFullNameEn: {
    ja: 'NIIJIMA KOTSU Co., Ltd. Headquarters',
    'zh-TW': 'NIIJIMA KOTSU Co., Ltd. Headquarters',
    'zh-CN': 'NIIJIMA KOTSU Co., Ltd. Headquarters',
    en: 'NIIJIMA KOTSU Co., Ltd. Headquarters',
  },
  labelAddress: {
    ja: '住所',
    'zh-TW': '地址',
    'zh-CN': '地址',
    en: 'Address',
  },
  addressLine: {
    ja: '大阪府大阪市浪速区大国1-2-21',
    'zh-TW': '大阪府大阪市浪速區大國1-2-21',
    'zh-CN': '大阪府大阪市浪速区大国1-2-21',
    en: '1-2-21 Daikoku, Naniwa-ku, Osaka',
  },
  addressBuilding: {
    ja: 'NICビル602号',
    'zh-TW': 'NIC大樓602號',
    'zh-CN': 'NIC大厦602号',
    en: 'NIC Building 602',
  },
  labelAccess: {
    ja: 'アクセス',
    'zh-TW': '交通方式',
    'zh-CN': '交通方式',
    en: 'Access',
  },
  accessLine1: {
    ja: '大阪メトロ 御堂筋線・四つ橋線「大国町」駅 徒歩3分',
    'zh-TW': '大阪地鐵 御堂筋線・四橋線「大國町」站 步行3分鐘',
    'zh-CN': '大阪地铁 御堂筋线・四桥线「大国町」站 步行3分钟',
    en: 'Osaka Metro Midosuji/Yotsubashi Line "Daikokucho" Station, 3 min walk',
  },
  accessLine2: {
    ja: '南海本線「今宮戎」駅 徒歩5分',
    'zh-TW': '南海本線「今宮戎」站 步行5分鐘',
    'zh-CN': '南海本线「今宫戎」站 步行5分钟',
    en: 'Nankai Main Line "Imamiya-Ebisu" Station, 5 min walk',
  },
  labelPhone: {
    ja: '電話番号',
    'zh-TW': '電話',
    'zh-CN': '电话',
    en: 'Phone',
  },
  labelEmail: {
    ja: 'メール',
    'zh-TW': '電子信箱',
    'zh-CN': '电子邮箱',
    en: 'Email',
  },
  labelHours: {
    ja: '営業時間',
    'zh-TW': '營業時間',
    'zh-CN': '营业时间',
    en: 'Business Hours',
  },
  hoursLine: {
    ja: '平日 9:00 - 18:00',
    'zh-TW': '週一至週五 9:00 - 18:00',
    'zh-CN': '周一至周五 9:00 - 18:00',
    en: 'Weekdays 9:00 - 18:00',
  },
  hoursNote: {
    ja: '※土日祝日は休業',
    'zh-TW': '※週末及國定假日休息',
    'zh-CN': '※周末及法定节假日休息',
    en: '* Closed on weekends and public holidays',
  },
  sectionPartnerFacilities: {
    ja: '主要提携施設',
    'zh-TW': '主要合作設施',
    'zh-CN': '主要合作设施',
    en: 'Partner Facilities',
  },
  facilityMedical: {
    ja: '医療施設',
    'zh-TW': '醫療設施',
    'zh-CN': '医疗设施',
    en: 'Medical Facility',
  },
  facilityGolf: {
    ja: 'ゴルフ施設',
    'zh-TW': '高爾夫設施',
    'zh-CN': '高尔夫设施',
    en: 'Golf Facility',
  },
  timcName: {
    ja: '徳洲会国際医療センター',
    'zh-TW': '德洲會國際醫療中心',
    'zh-CN': '德洲会国际医疗中心',
    en: 'Tokushukai International Medical Center',
  },
  timcAddress: {
    ja: '大阪市北区梅田3-2-2 JP TOWER OSAKA 11F',
    'zh-TW': '大阪市北區梅田3-2-2 JP TOWER OSAKA 11F',
    'zh-CN': '大阪市北区梅田3-2-2 JP TOWER OSAKA 11F',
    en: '3-2-2 Umeda, Kita-ku, Osaka, JP TOWER OSAKA 11F',
  },
  golfClubName: {
    ja: '関西名門ゴルフ倶楽部',
    'zh-TW': '關西名門高爾夫俱樂部',
    'zh-CN': '关西名门高尔夫俱乐部',
    en: 'Kansai Elite Golf Club',
  },
  golfAddress: {
    ja: '大阪府・兵庫県・奈良県 各所',
    'zh-TW': '大阪府・兵庫縣・奈良縣各地',
    'zh-CN': '大阪府・兵库县・奈良县各地',
    en: 'Various locations in Osaka, Hyogo, and Nara',
  },
};

export default function AccessPage() {
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

  return (
    <CompanyLayout
      title={{ ja: '所在地', 'zh-TW': '辦公據點', 'zh-CN': '办公地点', en: 'Access' }}
      titleEn="Access"
      breadcrumb={[
        { label: { ja: '企業情報', 'zh-TW': '企業資訊', 'zh-CN': '企业信息', en: 'Company' }, path: '/company' },
        { label: { ja: '所在地', 'zh-TW': '辦公據點', 'zh-CN': '办公地点', en: 'Access' } }
      ]}
    >
      <div className="space-y-12">
        {/* 本社 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            {t('sectionHQ')}
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
                  <div className="font-bold text-gray-900 mb-1">{t('companyFullName')}</div>
                  <div className="text-gray-600">{t('companyFullNameEn')}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">{t('labelAddress')}</div>
                  <div className="text-gray-600">
                    〒556-0014<br />
                    {t('addressLine')}<br />
                    {t('addressBuilding')}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Train size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">{t('labelAccess')}</div>
                  <div className="text-gray-600">
                    {t('accessLine1')}<br />
                    {t('accessLine2')}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">{t('labelPhone')}</div>
                  <div className="text-gray-600">06-6632-8807</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">{t('labelEmail')}</div>
                  <div className="text-gray-600">info@niijima-koutsu.jp</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">{t('labelHours')}</div>
                  <div className="text-gray-600">
                    {t('hoursLine')}<br />
                    <span className="text-sm text-gray-400">{t('hoursNote')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 提携施設 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            {t('sectionPartnerFacilities')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'TIMC OSAKA',
                nameJa: t('timcName'),
                address: t('timcAddress'),
                type: t('facilityMedical'),
              },
              {
                name: t('golfClubName'),
                nameJa: 'Kansai Elite Golf Club',
                address: t('golfAddress'),
                type: t('facilityGolf'),
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
