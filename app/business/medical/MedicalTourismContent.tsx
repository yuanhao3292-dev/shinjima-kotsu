'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  intro: {
    ja: '新島交通の医療ツーリズム事業は、日本最先端の医療技術を活用した精密健診サービスを提供しています。徳洲会国際医療センター（TIMC）との戦略的パートナーシップにより、PET-CT、MRI、胃腸内視鏡など世界トップクラスの検査機器による健診をご案内いたします。',
    'zh-TW': '新島交通的醫療旅遊事業運用日本最先進的醫療技術提供精密健檢服務。透過與德洲會國際醫療中心（TIMC）的戰略合作，提供PET-CT、MRI、胃腸內視鏡等世界頂級設備的健檢服務。',
    'zh-CN': '新岛交通的医疗旅游事业运用日本最先进的医疗技术提供精密体检服务。通过与德洲会国际医疗中心（TIMC）的战略合作，提供PET-CT、MRI、胃肠内视镜等世界顶级设备的体检服务。',
    en: 'NIIJIMA KOTSU\'s medical tourism division provides precision health screening services utilizing Japan\'s most advanced medical technology. Through our strategic partnership with TIMC, we offer screenings with world-class equipment including PET-CT, MRI, and gastrointestinal endoscopy.',
  },
  statScreenings: {
    ja: '累計健診者数', 'zh-TW': '累計健檢人數', 'zh-CN': '累计体检人数', en: 'Total Screenings',
  },
  statSatisfaction: {
    ja: '満足度', 'zh-TW': '滿意度', 'zh-CN': '满意度', en: 'Satisfaction',
  },
  statPartners: {
    ja: '提携医療機関', 'zh-TW': '合作醫療機構', 'zh-CN': '合作医疗机构', en: 'Partner Hospitals',
  },
  statHours: {
    ja: '予約対応', 'zh-TW': '預約服務', 'zh-CN': '预约服务', en: 'Booking',
  },
  sectionServices: {
    ja: 'サービス内容', 'zh-TW': '服務內容', 'zh-CN': '服务内容', en: 'Services',
  },
  serviceCheckup: {
    ja: '精密健康診断', 'zh-TW': '精密健康檢查', 'zh-CN': '精密健康检查', en: 'Comprehensive Health Screening',
  },
  serviceCheckupDesc: {
    ja: 'PET-CT、MRI、内視鏡検査など、最新設備による包括的な健診',
    'zh-TW': 'PET-CT、MRI、內視鏡檢查等，以最新設備進行全面健檢',
    'zh-CN': 'PET-CT、MRI、内视镜检查等，以最新设备进行全面体检',
    en: 'Comprehensive screenings with state-of-the-art PET-CT, MRI, and endoscopy equipment',
  },
  serviceCheckupFeatures: {
    ja: ['早期がん発見', '脳ドック', '心臓ドック'],
    'zh-TW': ['早期癌症發現', '腦部檢查', '心臟檢查'],
    'zh-CN': ['早期癌症发现', '脑部检查', '心脏检查'],
    en: ['Early cancer detection', 'Brain screening', 'Cardiac screening'],
  },
  serviceCancer: {
    ja: 'がん治療紹介', 'zh-TW': '癌症治療介紹', 'zh-CN': '癌症治疗介绍', en: 'Cancer Treatment Referral',
  },
  serviceCancerDesc: {
    ja: '陽子線治療、光免疫療法、BNCTなど最先端のがん治療',
    'zh-TW': '質子線治療、光免疫療法、BNCT等最先進的癌症治療',
    'zh-CN': '质子线治疗、光免疫疗法、BNCT等最先进的癌症治疗',
    en: 'Cutting-edge cancer treatments including proton therapy, photoimmunotherapy, and BNCT',
  },
  serviceCancerFeatures: {
    ja: ['セカンドオピニオン', '治療計画相談', '入院手配'],
    'zh-TW': ['第二意見', '治療方案諮詢', '住院安排'],
    'zh-CN': ['第二意见', '治疗方案咨询', '住院安排'],
    en: ['Second opinion', 'Treatment planning', 'Hospitalization arrangement'],
  },
  serviceRegen: {
    ja: '再生医療', 'zh-TW': '再生醫療', 'zh-CN': '再生医疗', en: 'Regenerative Medicine',
  },
  serviceRegenDesc: {
    ja: '幹細胞治療、PRP療法など再生医療サービスの紹介',
    'zh-TW': '幹細胞治療、PRP療法等再生醫療服務介紹',
    'zh-CN': '干细胞治疗、PRP疗法等再生医疗服务介绍',
    en: 'Referral for regenerative medicine services including stem cell therapy and PRP therapy',
  },
  serviceRegenFeatures: {
    ja: ['アンチエイジング', '関節治療', '美容医療'],
    'zh-TW': ['抗衰老', '關節治療', '醫美'],
    'zh-CN': ['抗衰老', '关节治疗', '医美'],
    en: ['Anti-aging', 'Joint treatment', 'Aesthetic medicine'],
  },
  serviceSupport: {
    ja: '中国語サポート', 'zh-TW': '中文支援', 'zh-CN': '中文支持', en: 'Chinese Language Support',
  },
  serviceSupportDesc: {
    ja: '医療通訳、書類翻訳、アテンドまで完全サポート',
    'zh-TW': '醫療口譯、文件翻譯、全程陪同完整服務',
    'zh-CN': '医疗口译、文件翻译、全程陪同完整服务',
    en: 'Complete support including medical interpretation, document translation, and personal assistance',
  },
  serviceSupportFeatures: {
    ja: ['医療通訳同行', '報告書翻訳', '24時間対応'],
    'zh-TW': ['醫療口譯隨行', '報告書翻譯', '24小時服務'],
    'zh-CN': ['医疗口译随行', '报告书翻译', '24小时服务'],
    en: ['Medical interpreter', 'Report translation', '24/7 support'],
  },
  sectionPartnerHospitals: {
    ja: '主要提携医療機関', 'zh-TW': '主要合作醫療機構', 'zh-CN': '主要合作医疗机构', en: 'Major Partner Medical Institutions',
  },
  timcBadge: {
    ja: '公式予約代理店', 'zh-TW': '官方預約代理', 'zh-CN': '官方预约代理', en: 'Official Booking Agent',
  },
  timcDesc: {
    ja: '徳洲会国際医療センター（TIMC）は、日本最大級の医療グループである徳洲会が運営する外国人専用の健診センターです。最新の医療機器と多言語対応スタッフで、快適な健診体験を提供しています。',
    'zh-TW': '德洲會國際醫療中心（TIMC）是由日本最大醫療集團德洲會營運的外國人專用健檢中心。以最新醫療設備和多語言服務人員，提供舒適的健檢體驗。',
    'zh-CN': '德洲会国际医疗中心（TIMC）是由日本最大医疗集团德洲会运营的外国人专用体检中心。以最新医疗设备和多语言服务人员，提供舒适的体检体验。',
    en: 'TIMC is a health screening center exclusively for international patients, operated by Tokushukai, one of Japan\'s largest medical groups. It provides a comfortable screening experience with state-of-the-art equipment and multilingual staff.',
  },
  timcTag1: {
    ja: 'JR大阪駅直結', 'zh-TW': 'JR大阪站直達', 'zh-CN': 'JR大阪站直达', en: 'Direct access from JR Osaka',
  },
  timcTag3: {
    ja: '中国語対応', 'zh-TW': '中文服務', 'zh-CN': '中文服务', en: 'Chinese Available',
  },
  ctaTitle: {
    ja: '医療サービスについてのお問い合わせ', 'zh-TW': '醫療服務諮詢', 'zh-CN': '医疗服务咨询', en: 'Medical Service Inquiries',
  },
  ctaSubtitle: {
    ja: '専門スタッフが日本語・中国語でご対応いたします',
    'zh-TW': '專業人員以日語・中文為您服務',
    'zh-CN': '专业人员以日语・中文为您服务',
    en: 'Our specialists are available in Japanese and Chinese',
  },
  ctaButton: {
    ja: '詳細を見る', 'zh-TW': '查看詳情', 'zh-CN': '查看详情', en: 'View Details',
  },
};

interface MedicalTourismContentProps {
  isGuideEmbed?: boolean;
}

export default function MedicalTourismContent({ isGuideEmbed }: MedicalTourismContentProps) {
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
    { value: '5,000+', label: t('statScreenings') },
    { value: '98%', label: t('statSatisfaction') },
    { value: '50+', label: t('statPartners') },
    { value: '24h', label: t('statHours') },
  ];

  const services = [
    { title: t('serviceCheckup') as string, description: t('serviceCheckupDesc') as string, features: t('serviceCheckupFeatures') as string[] },
    { title: t('serviceCancer') as string, description: t('serviceCancerDesc') as string, features: t('serviceCancerFeatures') as string[] },
    { title: t('serviceRegen') as string, description: t('serviceRegenDesc') as string, features: t('serviceRegenFeatures') as string[] },
    { title: t('serviceSupport') as string, description: t('serviceSupportDesc') as string, features: t('serviceSupportFeatures') as string[] },
  ];

  return (
    <div className="space-y-12">
      {/* 概要 */}
      <section>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t('intro')}
        </p>
      </section>

      {/* 実績数字 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-xl text-center bg-blue-50"
          >
            <div
              className="text-2xl font-bold text-blue-600"
            >
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* サービス内容 */}
      <section>
        <h2
          className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600"
        >
          {t('sectionServices')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div key={index} className="p-5 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
              <ul className="space-y-1">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2
                      size={14}
                      className="flex-shrink-0 text-blue-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 提携医療機関 */}
      <section>
        <h2
          className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600"
        >
          {t('sectionPartnerHospitals')}
        </h2>

        <div className="p-6 bg-slate-900 text-white rounded-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3">
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400"
                alt="TIMC OSAKA"
                width={400}
                height={192}
                quality={75}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
            <div className="flex-1">
              <div className="text-blue-400 text-sm font-medium mb-2">{t('timcBadge')}</div>
              <h3 className="text-2xl font-bold mb-2">TIMC OSAKA</h3>
              <p className="text-gray-300 text-sm mb-4">
                {t('timcDesc')}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">{t('timcTag1')}</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">JP TOWER OSAKA 11F</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">{t('timcTag3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isGuideEmbed && (
        <section className="text-center py-8 bg-blue-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('ctaTitle')}</h3>
          <p className="text-gray-600 mb-6">{t('ctaSubtitle')}</p>
          <Link
            href="/?page=medical"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition"
          >
            {t('ctaButton')} <ArrowRight size={18} />
          </Link>
        </section>
      )}
    </div>
  );
}
