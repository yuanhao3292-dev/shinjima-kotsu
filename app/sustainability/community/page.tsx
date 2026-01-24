'use client';

import React, { useState, useEffect } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { MapPin, Users, Building, Heart } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  intro: {
    ja: '新島交通は、観光業を通じた地域経済の活性化と、地方創生に取り組んでいます。大都市だけでなく、地方の魅力を海外に発信し、持続可能な観光地づくりに貢献します。',
    'zh-TW': '新島交通致力於透過觀光業活化地方經濟，推動地方創生。不僅限於大城市，更向海外推廣地方魅力，為打造永續觀光地盡一份心力。',
    'zh-CN': '新岛交通致力于通过观光业活化地方经济，推动地方创生。不仅限于大城市，更向海外推广地方魅力，为打造可持续观光地尽一份力。',
    en: 'NIIJIMA KOTSU is committed to revitalizing regional economies through tourism and promoting regional development. We spread the charm of rural areas internationally, not just major cities, contributing to sustainable tourism destinations.',
  },
  sectionInitiatives: {
    ja: '主な取り組み',
    'zh-TW': '主要活動',
    'zh-CN': '主要活动',
    en: 'Key Initiatives',
  },
  initRegional: {
    ja: '地方創生ツアーの企画',
    'zh-TW': '地方創生行程企劃',
    'zh-CN': '地方创生行程企划',
    en: 'Regional Revitalization Tours',
  },
  initRegionalDesc: {
    ja: '大阪・京都だけでなく、和歌山、奈良、滋賀など関西の地方都市への観光ルートを開発。地域の隠れた魅力を海外旅行者に紹介しています。',
    'zh-TW': '不僅限於大阪・京都，還開發和歌山、奈良、滋賀等關西地方城市的觀光路線。向海外旅客介紹地方隱藏的魅力。',
    'zh-CN': '不仅限于大阪・京都，还开发和歌山、奈良、滋贺等关西地方城市的观光路线。向海外旅客介绍地方隐藏的魅力。',
    en: 'Developing tourism routes to regional cities in Kansai such as Wakayama, Nara, and Shiga, not just Osaka and Kyoto. Introducing hidden local charms to international travelers.',
  },
  initRegionalAchievements: {
    ja: ['和歌山・熊野古道ツアー', '奈良・吉野桜ツアー', '滋賀・琵琶湖周遊ツアー'],
    'zh-TW': ['和歌山・熊野古道之旅', '奈良・吉野櫻花之旅', '滋賀・琵琶湖環湖之旅'],
    'zh-CN': ['和歌山・熊野古道之旅', '奈良・吉野樱花之旅', '滋贺・琵琶湖环湖之旅'],
    en: ['Wakayama Kumano Kodo Tour', 'Nara Yoshino Cherry Blossom Tour', 'Shiga Lake Biwa Tour'],
  },
  initBusiness: {
    ja: '地域事業者との連携',
    'zh-TW': '與地方業者合作',
    'zh-CN': '与地方业者合作',
    en: 'Local Business Partnerships',
  },
  initBusinessDesc: {
    ja: '地元の宿泊施設、飲食店、体験施設と積極的に連携し、地域経済への直接的な還元を目指しています。',
    'zh-TW': '積極與當地住宿設施、餐飲店、體驗設施合作，致力於直接回饋地方經濟。',
    'zh-CN': '积极与当地住宿设施、餐饮店、体验设施合作，致力于直接回馈地方经济。',
    en: 'Actively partnering with local accommodations, restaurants, and experience facilities, aiming for direct economic contribution to local communities.',
  },
  initBusinessAchievements: {
    ja: ['地元旅館との優先契約', '農家体験プログラム', '伝統工芸体験の手配'],
    'zh-TW': ['與當地旅館優先簽約', '農家體驗方案', '傳統工藝體驗安排'],
    'zh-CN': ['与当地旅馆优先签约', '农家体验方案', '传统工艺体验安排'],
    en: ['Priority contracts with local ryokans', 'Farm experience programs', 'Traditional craft experiences'],
  },
  initCulture: {
    ja: '文化継承への支援',
    'zh-TW': '文化傳承支持',
    'zh-CN': '文化传承支持',
    en: 'Cultural Heritage Support',
  },
  initCultureDesc: {
    ja: '日本の伝統文化や祭りへの参加機会を提供し、文化の継承と国際理解の促進に貢献しています。',
    'zh-TW': '提供參與日本傳統文化和祭典的機會，為文化傳承和促進國際理解做出貢獻。',
    'zh-CN': '提供参与日本传统文化和祭典的机会，为文化传承和促进国际理解做出贡献。',
    en: 'Providing opportunities to participate in Japanese traditional culture and festivals, contributing to cultural preservation and international understanding.',
  },
  initCultureAchievements: {
    ja: ['祇園祭特別観覧ツアー', '茶道・華道体験', '能・狂言鑑賞会'],
    'zh-TW': ['祇園祭特別觀賞行程', '茶道・花道體驗', '能・狂言鑑賞會'],
    'zh-CN': ['祇园祭特别观赏行程', '茶道・花道体验', '能・狂言鉴赏会'],
    en: ['Gion Festival Special Viewing Tour', 'Tea Ceremony & Ikebana Experience', 'Noh & Kyogen Appreciation'],
  },
  initTalent: {
    ja: '人材育成',
    'zh-TW': '人才培育',
    'zh-CN': '人才培育',
    en: 'Talent Development',
  },
  initTalentDesc: {
    ja: '地域の観光ガイドや通訳者の育成を支援し、観光業の人材不足解消に取り組んでいます。',
    'zh-TW': '支持培育地方觀光導遊和口譯人員，致力於解決觀光業人才短缺問題。',
    'zh-CN': '支持培育地方观光导游和口译人员，致力于解决观光业人才短缺问题。',
    en: 'Supporting the development of local tourism guides and interpreters, addressing the talent shortage in the tourism industry.',
  },
  initTalentAchievements: {
    ja: ['ガイド研修プログラム', '多言語対応研修', 'インターンシップ受入'],
    'zh-TW': ['導遊培訓計劃', '多語言應對培訓', '實習生接收'],
    'zh-CN': ['导游培训计划', '多语言应对培训', '实习生接收'],
    en: ['Guide Training Program', 'Multilingual Training', 'Internship Acceptance'],
  },
  sectionResults: {
    ja: '実績データ',
    'zh-TW': '實績數據',
    'zh-CN': '实绩数据',
    en: 'Achievement Data',
  },
  statMunicipalities: {
    ja: '連携自治体',
    'zh-TW': '合作地方政府',
    'zh-CN': '合作地方政府',
    en: 'Partner Municipalities',
  },
  statBusinesses: {
    ja: '地域事業者',
    'zh-TW': '地方業者',
    'zh-CN': '地方业者',
    en: 'Local Businesses',
  },
  statVisitors: {
    ja: '地方送客数/年',
    'zh-TW': '年度地方遊客數',
    'zh-CN': '年度地方游客数',
    en: 'Annual Regional Visitors',
  },
  statContribution: {
    ja: '地域経済への貢献',
    'zh-TW': '地方經濟貢獻',
    'zh-CN': '地方经济贡献',
    en: 'Economic Contribution',
  },
};

export default function CommunityPage() {
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

  const initiatives = [
    {
      icon: MapPin,
      title: t('initRegional') as string,
      description: t('initRegionalDesc') as string,
      achievements: t('initRegionalAchievements') as string[],
    },
    {
      icon: Building,
      title: t('initBusiness') as string,
      description: t('initBusinessDesc') as string,
      achievements: t('initBusinessAchievements') as string[],
    },
    {
      icon: Heart,
      title: t('initCulture') as string,
      description: t('initCultureDesc') as string,
      achievements: t('initCultureAchievements') as string[],
    },
    {
      icon: Users,
      title: t('initTalent') as string,
      description: t('initTalentDesc') as string,
      achievements: t('initTalentAchievements') as string[],
    },
  ];

  const stats = [
    { value: '15+', label: t('statMunicipalities') },
    { value: '50+', label: t('statBusinesses') },
    { value: '2,000+', label: t('statVisitors') },
    { value: '¥5,000万+', label: t('statContribution') },
  ];

  return (
    <CompanyLayout
      title={{ ja: '地域貢献', 'zh-TW': '地方創生', 'zh-CN': '地方创生', en: 'Community Contribution' }}
      titleEn="Community Contribution"
      breadcrumb={[
        { label: { ja: 'サステナビリティ', 'zh-TW': '永續發展', 'zh-CN': '可持续发展', en: 'Sustainability' }, path: '/sustainability' },
        { label: { ja: '地域貢献', 'zh-TW': '地方創生', 'zh-CN': '地方创生', en: 'Community' } }
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('intro')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-rose-600">
            {t('sectionInitiatives')}
          </h2>

          <div className="space-y-6">
            {initiatives.map((item, index) => {
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
            {t('sectionResults')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
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
