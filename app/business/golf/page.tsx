'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CompanyLayout from '@/components/CompanyLayout';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  intro: {
    ja: '新島交通のゴルフツーリズムは、通常では予約困難な会員制名門ゴルフ場への特別アクセスを提供。関西・関東の20以上のプレミアムコースと提携し、送迎、宿泊、食事まで完全サポートいたします。',
    'zh-TW': '新島交通的高爾夫旅遊提供通常難以預約的會員制名門高爾夫球場特別通道。與關西・關東20多家頂級球場合作，接送、住宿、餐飲全程服務。',
    'zh-CN': '新岛交通的高尔夫旅游提供通常难以预约的会员制名门高尔夫球场特别通道。与关西・关东20多家顶级球场合作，接送、住宿、餐饮全程服务。',
    en: 'NIIJIMA KOTSU\'s golf tourism provides exclusive access to prestigious membership golf courses that are typically difficult to book. Partnered with over 20 premium courses in Kansai and Kanto, with full support for transfers, accommodation, and dining.',
  },
  statCourses: {
    ja: '提携名門コース',
    'zh-TW': '合作名門球場',
    'zh-CN': '合作名门球场',
    en: 'Partner Courses',
  },
  statVIP: {
    ja: '待遇保証',
    'zh-TW': '待遇保障',
    'zh-CN': '待遇保障',
    en: 'Treatment Guarantee',
  },
  statUsers: {
    ja: '年間利用者',
    'zh-TW': '年度使用者',
    'zh-CN': '年度使用者',
    en: 'Annual Users',
  },
  statBooking: {
    ja: '予約成功率',
    'zh-TW': '預約成功率',
    'zh-CN': '预约成功率',
    en: 'Booking Success',
  },
  sectionFeatures: {
    ja: 'サービス特徴',
    'zh-TW': '服務特色',
    'zh-CN': '服务特色',
    en: 'Service Features',
  },
  featureCourse: {
    ja: '名門コースアクセス',
    'zh-TW': '名門球場通道',
    'zh-CN': '名门球场通道',
    en: 'Elite Course Access',
  },
  featureCourseItems: {
    ja: ['会員紹介不要', 'トーナメントコース', '提携コース優先予約'],
    'zh-TW': ['無需會員推薦', '錦標賽球場', '合作球場優先預約'],
    'zh-CN': ['无需会员推荐', '锦标赛球场', '合作球场优先预约'],
    en: ['No member referral needed', 'Tournament courses', 'Priority booking'],
  },
  featureVIP: {
    ja: 'VIPサービス',
    'zh-TW': 'VIP服務',
    'zh-CN': 'VIP服务',
    en: 'VIP Service',
  },
  featureVIPItems: {
    ja: ['専属キャディ', 'ラウンジ利用', '優先スタート'],
    'zh-TW': ['專屬球僮', '貴賓室使用', '優先開球'],
    'zh-CN': ['专属球僮', '贵宾室使用', '优先开球'],
    en: ['Dedicated caddy', 'Lounge access', 'Priority tee time'],
  },
  featureTransfer: {
    ja: '送迎・宿泊手配',
    'zh-TW': '接送・住宿安排',
    'zh-CN': '接送・住宿安排',
    en: 'Transfers & Accommodation',
  },
  featureTransferItems: {
    ja: ['空港送迎', '高級旅館手配', '温泉付きプラン'],
    'zh-TW': ['機場接送', '高級旅館安排', '溫泉方案'],
    'zh-CN': ['机场接送', '高级旅馆安排', '温泉方案'],
    en: ['Airport transfers', 'Premium ryokan', 'Hot spring plans'],
  },
  featureLanguage: {
    ja: '多言語対応',
    'zh-TW': '多語言服務',
    'zh-CN': '多语言服务',
    en: 'Multilingual Support',
  },
  featureLanguageItems: {
    ja: ['中国語サポート', '英語対応可', '通訳同行'],
    'zh-TW': ['中文支援', '英語服務', '翻譯隨行'],
    'zh-CN': ['中文支持', '英语服务', '翻译随行'],
    en: ['Chinese support', 'English available', 'Interpreter included'],
  },
  ctaTitle: {
    ja: 'ゴルフツアーのお問い合わせ',
    'zh-TW': '高爾夫行程諮詢',
    'zh-CN': '高尔夫行程咨询',
    en: 'Golf Tour Inquiries',
  },
  ctaButton: {
    ja: '詳細を見る',
    'zh-TW': '查看詳情',
    'zh-CN': '查看详情',
    en: 'View Details',
  },
};

export default function GolfBusinessPage() {
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

  const stats = [
    { value: '20+', label: t('statCourses') },
    { value: 'VIP', label: t('statVIP') },
    { value: '1,000+', label: t('statUsers') },
    { value: '98%+', label: t('statBooking') },
  ];

  const services = [
    { title: t('featureCourse') as string, features: t('featureCourseItems') as string[] },
    { title: t('featureVIP') as string, features: t('featureVIPItems') as string[] },
    { title: t('featureTransfer') as string, features: t('featureTransferItems') as string[] },
    { title: t('featureLanguage') as string, features: t('featureLanguageItems') as string[] },
  ];

  return (
    <CompanyLayout
      title={{ ja: 'ゴルフツーリズム', 'zh-TW': '高爾夫旅遊', 'zh-CN': '高尔夫旅游', en: 'Golf Tourism' }}
      titleEn="Golf Tourism"
      breadcrumb={[
        { label: { ja: '事業領域', 'zh-TW': '事業領域', 'zh-CN': '业务领域', en: 'Business' }, path: '/business' },
        { label: { ja: 'ゴルフツーリズム', 'zh-TW': '高爾夫旅遊', 'zh-CN': '高尔夫旅游', en: 'Golf Tourism' } }
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('intro')}
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 bg-green-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-600">
            {t('sectionFeatures')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="p-5 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-3">{service.title}</h3>
                <ul className="space-y-2">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center py-8 bg-green-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('ctaTitle')}</h3>
          <Link
            href="/?page=golf"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition"
          >
            {t('ctaButton')} <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </CompanyLayout>
  );
}
