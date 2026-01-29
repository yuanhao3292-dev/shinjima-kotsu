'use client';

import React from 'react';
import PublicLayout from '@/components/PublicLayout';
import {
  Award, Shield, Building2, MapPin, Phone, Mail,
  Quote, Globe, Heart, Target
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// 页面翻译
const pageTranslations = {
  // Hero Section
  heroSubtitle: {
    ja: '華人世界と日本の高品質な資源をつなぐ架け橋',
    'zh-TW': '連結華人世界與日本高品質資源的橋樑',
    'zh-CN': '连结华人世界与日本高品质资源的桥梁',
    en: 'Bridging the Chinese World with Japan\'s Premium Resources'
  },

  // CEO Message Section
  ceoSectionLabel: {
    ja: 'Message from CEO',
    'zh-TW': 'Message from CEO',
    'zh-CN': 'Message from CEO',
    en: 'Message from CEO'
  },
  ceoSectionTitle: {
    ja: 'トップメッセージ',
    'zh-TW': '社長致辭',
    'zh-CN': '社长致辞',
    en: 'CEO Message'
  },
  ceoTitle: {
    ja: '代表取締役',
    'zh-TW': '代表取締役',
    'zh-CN': '代表取缔役',
    en: 'CEO & President'
  },
  ceoSlogan: {
    ja: '"用心連結世界與日本"',
    'zh-TW': '"用心連結世界與日本"',
    'zh-CN': '"用心连结世界与日本"',
    en: '"Connecting the World with Japan, Heart to Heart"'
  },
  ceoMessage1: {
    ja: '平素より新島交通株式会社をご愛顧いただき、誠にありがとうございます。',
    'zh-TW': '感謝各位一直以來對新島交通株式會社的支持與厚愛。',
    'zh-CN': '感谢各位一直以来对新岛交通株式会社的支持与厚爱。',
    en: 'Thank you for your continued support of NIIJIMA KOTSU Co., Ltd.'
  },
  ceoMessage2: {
    ja: '私は日本で長年生活する中で、日本独自の「おもてなし」精神——心からのきめ細やかなサービスを深く体験してまいりました。しかし同時に、多くの華人旅行者が言語の壁や情報の非対称性により、日本の最高品質のサービスを十分に享受できていない現状も目の当たりにしてきました。',
    'zh-TW': '我在日本生活多年，深刻體驗了日本獨特的「款待」精神——發自內心的細膩服務。然而同時，我也親眼目睹許多華人旅客因語言障礙和信息不對稱，無法充分享受日本最高品質的服務。',
    'zh-CN': '我在日本生活多年，深刻体验了日本独特的"款待"精神——发自内心的细腻服务。然而同时，我也亲眼目睹许多华人旅客因语言障碍和信息不对称，无法充分享受日本最高品质的服务。',
    en: 'Having lived in Japan for many years, I have deeply experienced Japan\'s unique "Omotenashi" spirit—heartfelt and meticulous service. At the same time, I have witnessed many Chinese travelers unable to fully enjoy Japan\'s highest quality services due to language barriers and information asymmetry.'
  },
  ceoMessage3: {
    ja: 'これこそが新島交通を創業した原点です。「華人世界と日本の高品質な資源をつなぐ架け橋となる」——世界トップクラスの精密健診、会員制の名門ゴルフ場、充実したビジネス視察など、お客様一人ひとりに「日本にはこんな楽しみ方があったのか」という驚きと感動をお届けしたいと考えております。',
    'zh-TW': '這正是創立新島交通的初心。「成為連結華人世界與日本高品質資源的橋樑」——世界頂級的精密健診、會員制名門高爾夫球場、充實的商務考察等，我們希望為每一位客戶帶來「原來日本還有這樣的體驗」的驚喜與感動。',
    'zh-CN': '这正是创立新岛交通的初心。「成为连结华人世界与日本高品质资源的桥梁」——世界顶级的精密健诊、会员制名门高尔夫球场、充实的商务考察等，我们希望为每一位客户带来「原来日本还有这样的体验」的惊喜与感动。',
    en: 'This is the founding principle of NIIJIMA KOTSU. "To become the bridge connecting the Chinese world with Japan\'s premium resources"—world-class precision health screenings, exclusive member-only golf courses, comprehensive business inspections, and more. We aim to bring each customer the surprise and emotion of discovering "Japan has experiences like this!"'
  },
  ceoMessage4: {
    ja: '今後も医療ツーリズム、ハイエンドカスタマイズ、ビジネス視察の三大領域を深耕し、テクノロジーでサービスを進化させ、真心でお客様の心を動かしてまいります。',
    'zh-TW': '未來我們將持續深耕醫療旅遊、高端定制、商務考察三大領域，以科技賦能服務，以真心打動人心。',
    'zh-CN': '未来我们将持续深耕医疗旅游、高端定制、商务考察三大领域，以科技赋能服务，以真心打动人心。',
    en: 'We will continue to deepen our expertise in medical tourism, high-end customization, and business inspections, empowering our services with technology and touching hearts with sincerity.'
  },
  ceoMessage5: {
    ja: '皆様のご支援を賜りますよう、何卒よろしくお願い申し上げます。',
    'zh-TW': '誠摯期待您的支持與指導。',
    'zh-CN': '诚挚期待您的支持与指导。',
    en: 'We sincerely look forward to your continued support.'
  },

  // Philosophy Section
  philosophyLabel: {
    ja: 'Philosophy',
    'zh-TW': 'Philosophy',
    'zh-CN': 'Philosophy',
    en: 'Philosophy'
  },
  philosophyTitle: {
    ja: '経営理念',
    'zh-TW': '經營理念',
    'zh-CN': '经营理念',
    en: 'Corporate Philosophy'
  },
  philosophy1Title: {
    ja: '用心',
    'zh-TW': '用心',
    'zh-CN': '用心',
    en: 'Sincerity'
  },
  philosophy1Desc: {
    ja: 'お客様の立場に立ち、心を込めたサービスを提供します',
    'zh-TW': '站在客戶的立場，提供用心的服務',
    'zh-CN': '站在客户的立场，提供用心的服务',
    en: 'We provide heartfelt service from the customer\'s perspective'
  },
  philosophy2Title: {
    ja: '連結',
    'zh-TW': '連結',
    'zh-CN': '连结',
    en: 'Connection'
  },
  philosophy2Desc: {
    ja: '華人世界と日本の架け橋として、文化と価値をつなぎます',
    'zh-TW': '作為華人世界與日本的橋樑，連結文化與價值',
    'zh-CN': '作为华人世界与日本的桥梁，连结文化与价值',
    en: 'As a bridge between the Chinese world and Japan, connecting cultures and values'
  },
  philosophy3Title: {
    ja: '革新',
    'zh-TW': '革新',
    'zh-CN': '革新',
    en: 'Innovation'
  },
  philosophy3Desc: {
    ja: 'テクノロジーで業界を革新し、新たな価値を創造します',
    'zh-TW': '以科技革新行業，創造新的價值',
    'zh-CN': '以科技革新行业，创造新的价值',
    en: 'Innovating the industry with technology, creating new value'
  },

  // Company Profile Section
  profileLabel: {
    ja: 'Company Profile',
    'zh-TW': 'Company Profile',
    'zh-CN': 'Company Profile',
    en: 'Company Profile'
  },
  profileTitle: {
    ja: '会社概要',
    'zh-TW': '公司概況',
    'zh-CN': '公司概况',
    en: 'Company Overview'
  },
  labelCompanyName: {
    ja: '商号',
    'zh-TW': '公司名稱',
    'zh-CN': '公司名称',
    en: 'Company Name'
  },
  labelCompanyNameEn: {
    ja: '英文商号',
    'zh-TW': '英文名稱',
    'zh-CN': '英文名称',
    en: 'English Name'
  },
  labelEstablished: {
    ja: '設立',
    'zh-TW': '成立日期',
    'zh-CN': '成立日期',
    en: 'Established'
  },
  labelCapital: {
    ja: '資本金',
    'zh-TW': '資本額',
    'zh-CN': '注册资本',
    en: 'Capital'
  },
  labelCEO: {
    ja: '代表者',
    'zh-TW': '代表人',
    'zh-CN': '代表人',
    en: 'Representative'
  },
  labelEmployees: {
    ja: '従業員数',
    'zh-TW': '員工人數',
    'zh-CN': '员工人数',
    en: 'Employees'
  },
  labelAddress: {
    ja: '本社所在地',
    'zh-TW': '總部地址',
    'zh-CN': '总部地址',
    en: 'Headquarters'
  },
  labelPhone: {
    ja: '電話番号',
    'zh-TW': '電話',
    'zh-CN': '电话',
    en: 'Phone'
  },
  labelEmail: {
    ja: 'メール',
    'zh-TW': '電子郵件',
    'zh-CN': '电子邮件',
    en: 'Email'
  },
  labelBusiness: {
    ja: '事業内容',
    'zh-TW': '業務範圍',
    'zh-CN': '业务范围',
    en: 'Business'
  },
  valueCompanyName: {
    ja: '新島交通株式会社',
    'zh-TW': '新島交通株式會社',
    'zh-CN': '新岛交通株式会社',
    en: 'NIIJIMA KOTSU Co., Ltd.'
  },
  valueEstablished: {
    ja: '2020年2月',
    'zh-TW': '2020年2月',
    'zh-CN': '2020年2月',
    en: 'February 2020'
  },
  valueCapital: {
    ja: '2,500万円',
    'zh-TW': '2,500萬日圓',
    'zh-CN': '2,500万日元',
    en: '25 Million JPY'
  },
  valueCEO: {
    ja: '代表取締役 員 昊',
    'zh-TW': '代表取締役 員 昊',
    'zh-CN': '代表取缔役 员 昊',
    en: 'CEO Yuan Hao'
  },
  valueEmployees: {
    ja: '25名（2024年12月現在）',
    'zh-TW': '25名（截至2024年12月）',
    'zh-CN': '25名（截至2024年12月）',
    en: '25 (as of December 2024)'
  },
  valueAddress: {
    ja: '〒556-0014\n大阪府大阪市浪速区大国1-2-21\nNICビル602号',
    'zh-TW': '〒556-0014\n日本大阪府大阪市浪速區大國1-2-21\nNIC大樓602號',
    'zh-CN': '〒556-0014\n日本大阪府大阪市浪速区大国1-2-21\nNIC大楼602号',
    en: '〒556-0014\nNIC Building 602, 1-2-21 Daikoku,\nNaniwa-ku, Osaka, Japan'
  },
  valueBusiness: {
    ja: '・インバウンド旅行事業\n・医療ツーリズム事業\n・ゴルフツーリズム事業\n・ビジネス視察事業',
    'zh-TW': '・入境旅遊事業\n・醫療旅遊事業\n・高爾夫旅遊事業\n・商務考察事業',
    'zh-CN': '・入境旅游事业\n・医疗旅游事业\n・高尔夫旅游事业\n・商务考察事业',
    en: '・Inbound Travel Services\n・Medical Tourism\n・Golf Tourism\n・Business Inspection Tours'
  },

  // Licenses Section
  licensesLabel: {
    ja: 'Licenses',
    'zh-TW': 'Licenses',
    'zh-CN': 'Licenses',
    en: 'Licenses'
  },
  licensesTitle: {
    ja: '登録・許認可',
    'zh-TW': '資質認證',
    'zh-CN': '资质认证',
    en: 'Licenses & Certifications'
  },
  license1Title: {
    ja: '第二種旅行業',
    'zh-TW': '第二種旅行業',
    'zh-CN': '第二种旅行业',
    en: 'Type 2 Travel Agency'
  },
  license1Number: {
    ja: '大阪府知事登録',
    'zh-TW': '大阪府知事登錄',
    'zh-CN': '大阪府知事登录',
    en: 'Registered with Osaka Prefecture'
  },
  license1Desc: {
    ja: '国内旅行・海外旅行の手配旅行業務',
    'zh-TW': '國內旅遊及海外旅遊代理業務',
    'zh-CN': '国内旅游及海外旅游代理业务',
    en: 'Domestic and international travel arrangement services'
  },
  license2Title: {
    ja: '全国旅行業協会',
    'zh-TW': '全國旅行業協會',
    'zh-CN': '全国旅行业协会',
    en: 'ANTA Member'
  },
  license2Number: {
    ja: 'ANTA 正会員',
    'zh-TW': 'ANTA 正式會員',
    'zh-CN': 'ANTA 正式会员',
    en: 'ANTA Official Member'
  },
  license2Desc: {
    ja: '全国旅行業協会に加盟',
    'zh-TW': '日本全國旅行業協會會員',
    'zh-CN': '日本全国旅行业协会会员',
    en: 'Member of All Nippon Travel Agents Association'
  },
  license3Title: {
    ja: 'TIMC公式代理店',
    'zh-TW': 'TIMC官方代理',
    'zh-CN': 'TIMC官方代理',
    en: 'TIMC Official Agent'
  },
  license3Number: {
    ja: '公式認定パートナー',
    'zh-TW': '官方認證合作夥伴',
    'zh-CN': '官方认证合作伙伴',
    en: 'Certified Official Partner'
  },
  license3Desc: {
    ja: '徳洲会国際医療センター 公式予約代理店',
    'zh-TW': '德洲會國際醫療中心 官方預約代理',
    'zh-CN': '德洲会国际医疗中心 官方预约代理',
    en: 'Official booking agent for Tokushukai International Medical Center'
  },

  // Partners Section
  partnersLabel: {
    ja: 'Partners',
    'zh-TW': 'Partners',
    'zh-CN': 'Partners',
    en: 'Partners'
  },
  partnersTitle: {
    ja: '主要取引先',
    'zh-TW': '主要合作夥伴',
    'zh-CN': '主要合作伙伴',
    en: 'Key Partners'
  },

  // Contact Section
  contactTitle: {
    ja: 'お問い合わせ',
    'zh-TW': '聯繫我們',
    'zh-CN': '联系我们',
    en: 'Contact Us'
  },
  contactPhone: {
    ja: '電話番号',
    'zh-TW': '電話',
    'zh-CN': '电话',
    en: 'Phone'
  },
  contactEmail: {
    ja: 'メール',
    'zh-TW': '電子郵件',
    'zh-CN': '电子邮件',
    en: 'Email'
  },
  contactAddress: {
    ja: '所在地',
    'zh-TW': '地址',
    'zh-CN': '地址',
    en: 'Address'
  },
  contactAddressValue: {
    ja: '大阪市浪速区大国1-2-21',
    'zh-TW': '大阪市浪速區大國1-2-21',
    'zh-CN': '大阪市浪速区大国1-2-21',
    en: 'Naniwa-ku, Osaka'
  },
};

export default function AboutPage() {
  const currentLang = useLanguage();

  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][currentLang];

  const partners = [
    { ja: '徳洲会グループ', 'zh-TW': '德洲會集團', 'zh-CN': '德洲会集团', en: 'Tokushukai Group' },
    { ja: 'TIMC OSAKA', 'zh-TW': 'TIMC OSAKA', 'zh-CN': 'TIMC OSAKA', en: 'TIMC OSAKA' },
    { ja: '関西名門ゴルフ倶楽部', 'zh-TW': '關西名門高爾夫俱樂部', 'zh-CN': '关西名门高尔夫俱乐部', en: 'Kansai Premium Golf Clubs' },
    { ja: '帝国ホテル大阪', 'zh-TW': '大阪帝國飯店', 'zh-CN': '大阪帝国酒店', en: 'Imperial Hotel Osaka' },
    { ja: 'ザ・リッツ・カールトン', 'zh-TW': '麗思卡爾頓', 'zh-CN': '丽思卡尔顿', en: 'The Ritz-Carlton' },
    { ja: 'ANA', 'zh-TW': 'ANA', 'zh-CN': 'ANA', en: 'ANA' },
    { ja: 'JAL', 'zh-TW': 'JAL', 'zh-CN': 'JAL', en: 'JAL' },
    { ja: 'JR西日本', 'zh-TW': 'JR西日本', 'zh-CN': 'JR西日本', en: 'JR West' },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                NIIJIMA KOTSU Co., Ltd.
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                {t('valueCompanyName')}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {t('heroSubtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* CEO Message Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">{t('ceoSectionLabel')}</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">{t('ceoSectionTitle')}</h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* CEO Photo */}
                <div className="lg:w-1/3 flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 transform translate-x-4 translate-y-4 rounded-2xl"></div>
                    <img
                      src="https://i.ibb.co/B2mJDvq7/founder.jpg"
                      alt="Yuan Hao"
                      className="relative rounded-2xl shadow-lg w-full aspect-[3/4] object-cover object-top"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">{t('ceoTitle')}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">員 昊</p>
                    <p className="text-sm text-gray-400">Yuan Hao</p>
                  </div>
                </div>

                {/* Message Content */}
                <div className="lg:w-2/3">
                  <div className="relative mb-8">
                    <Quote className="absolute -top-4 -left-6 text-gray-100 w-20 h-20 transform -scale-x-100" />
                    <p className="text-2xl text-gray-800 relative z-10 italic font-serif pl-4 border-l-4 border-blue-500 leading-relaxed">
                      {t('ceoSlogan')}
                    </p>
                  </div>

                  <div className="space-y-5 text-gray-600 leading-relaxed">
                    <p>{t('ceoMessage1')}</p>
                    <p>{t('ceoMessage2')}</p>
                    <p>
                      {t('ceoMessage3')}
                    </p>
                    <p>{t('ceoMessage4')}</p>
                    <p className="text-lg font-medium text-gray-900 pt-4">
                      {t('ceoMessage5')}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-gray-900 font-bold">{t('valueCompanyName')}</p>
                    <p className="text-gray-600">{t('valueCEO')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Philosophy */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">{t('philosophyLabel')}</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">{t('philosophyTitle')}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('philosophy1Title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('philosophy1Desc')}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('philosophy2Title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('philosophy2Desc')}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('philosophy3Title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('philosophy3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Profile Table */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">{t('profileLabel')}</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">{t('profileTitle')}</h2>
              </div>

              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { label: t('labelCompanyName'), value: t('valueCompanyName') },
                      { label: t('labelCompanyNameEn'), value: 'NIIJIMA KOTSU Co., Ltd.' },
                      { label: t('labelEstablished'), value: t('valueEstablished') },
                      { label: t('labelCapital'), value: t('valueCapital') },
                      { label: t('labelCEO'), value: t('valueCEO') },
                      { label: t('labelEmployees'), value: t('valueEmployees') },
                      { label: t('labelAddress'), value: t('valueAddress') },
                      { label: t('labelPhone'), value: '06-6632-8807' },
                      { label: t('labelEmail'), value: 'info@niijima-koutsu.jp' },
                      { label: t('labelBusiness'), value: t('valueBusiness') },
                    ].map((row, index) => (
                      <tr key={index} className="flex flex-col md:table-row hover:bg-white transition">
                        <th className="py-5 px-6 text-left font-bold text-gray-900 bg-gray-100 md:bg-transparent md:w-44">
                          {row.label}
                        </th>
                        <td className="py-5 px-6 text-gray-600 whitespace-pre-line">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Licenses & Certifications */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">{t('licensesLabel')}</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">{t('licensesTitle')}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Award,
                    title: t('license1Title'),
                    number: t('license1Number'),
                    desc: t('license1Desc'),
                    color: 'blue'
                  },
                  {
                    icon: Shield,
                    title: t('license2Title'),
                    number: t('license2Number'),
                    desc: t('license2Desc'),
                    color: 'green'
                  },
                  {
                    icon: Building2,
                    title: t('license3Title'),
                    number: t('license3Number'),
                    desc: t('license3Desc'),
                    color: 'purple'
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  const colorClasses = {
                    blue: 'from-blue-500 to-blue-600',
                    green: 'from-green-500 to-green-600',
                    purple: 'from-purple-500 to-purple-600'
                  };
                  return (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                      <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[item.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.number}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">{t('partnersLabel')}</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">{t('partnersTitle')}</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {partners.map((partner, index) => (
                  <div key={index} className="p-5 bg-gray-50 rounded-xl text-center font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition cursor-default">
                    {partner[currentLang]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-serif text-white">{t('contactTitle')}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <a href="tel:06-6632-8807" className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-5 hover:bg-white/20 transition group">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">{t('contactPhone')}</p>
                    <p className="text-white font-bold group-hover:text-blue-300 transition">06-6632-8807</p>
                  </div>
                </a>

                <a href="mailto:info@niijima-koutsu.jp" className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-5 hover:bg-white/20 transition group">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">{t('contactEmail')}</p>
                    <p className="text-white font-bold group-hover:text-green-300 transition">info@niijima-koutsu.jp</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-5">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">{t('contactAddress')}</p>
                    <p className="text-white font-bold text-sm">{t('contactAddressValue')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
