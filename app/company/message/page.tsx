'use client';

import React, { useState, useEffect } from 'react';
import CompanyLayout from '@/components/CompanyLayout';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  ceoTitle: {
    ja: '代表取締役',
    'zh-TW': '代表取締役',
    'zh-CN': '代表取缔役',
    en: 'Representative Director',
  },
  ceoName: {
    ja: '員 昊',
    'zh-TW': '員 昊',
    'zh-CN': '员 昊',
    en: 'Yuan Hao',
  },
  ceoNameEn: {
    ja: 'Yuan Hao',
    'zh-TW': 'Yuan Hao',
    'zh-CN': 'Yuan Hao',
    en: '',
  },
  heading: {
    ja: '用心連結世界與日本',
    'zh-TW': '用心連結世界與日本',
    'zh-CN': '用心连结世界与日本',
    en: 'Connecting the World with Japan, with Heart',
  },
  para1: {
    ja: '平素より新島交通株式会社をご愛顧いただき、誠にありがとうございます。',
    'zh-TW': '感謝各位一直以來對新島交通株式會社的支持與厚愛。',
    'zh-CN': '感谢各位一直以来对新岛交通株式会社的支持与厚爱。',
    en: 'Thank you for your continued patronage of NIIJIMA KOTSU Co., Ltd.',
  },
  para2: {
    ja: '私は日本で長年生活する中で、日本独自の「おもてなし」精神——心からのきめ細やかなサービスを深く体験してまいりました。しかし同時に、多くの華人旅行者が言語の壁や情報の非対称性により、日本の最高品質のサービスを十分に享受できていない現状も目の当たりにしてきました。',
    'zh-TW': '我在日本生活多年，深刻體驗了日本獨特的「款待」精神——發自內心的細膩服務。然而同時，我也親眼目睹許多華人旅客因語言障礙和資訊不對稱，無法充分享受日本最高品質的服務。',
    'zh-CN': '我在日本生活多年，深刻体验了日本独特的"款待"精神——发自内心的细腻服务。然而同时，我也亲眼目睹许多华人旅客因语言障碍和信息不对称，无法充分享受日本最高品质的服务。',
    en: 'Having lived in Japan for many years, I have deeply experienced Japan\'s unique spirit of "omotenashi" — heartfelt, meticulous service. At the same time, I have witnessed how many Chinese-speaking travelers cannot fully enjoy Japan\'s highest quality services due to language barriers and information asymmetry.',
  },
  para3: {
    ja: 'これこそが新島交通を創業した原点です。「華人世界と日本の高品質な資源をつなぐ架け橋となる」——世界トップクラスの精密健診、会員制の名門ゴルフ場、充実したビジネス視察など、お客様一人ひとりに「日本にはこんな楽しみ方があったのか」という驚きと感動をお届けしたいと考えております。',
    'zh-TW': '這正是創立新島交通的初衷。「成為連結華人世界與日本高品質資源的橋樑」——世界頂級的精密健檢、會員制名門高爾夫球場、充實的商務考察等，我們希望為每一位客戶帶來「原來日本還可以這樣玩」的驚喜與感動。',
    'zh-CN': '这正是创立新岛交通的初衷。"成为连接华人世界与日本高品质资源的桥梁"——世界顶级的精密体检、会员制名门高尔夫球场、充实的商务考察等，我们希望为每一位客户带来"原来日本还可以这样玩"的惊喜与感动。',
    en: 'This is the very origin of founding NIIJIMA KOTSU. "To become a bridge connecting the Chinese-speaking world with Japan\'s premium resources" — from world-class comprehensive health screenings, exclusive membership golf courses, to enriching business inspections, we aspire to deliver the surprise and excitement of discovering "Japan can be enjoyed in such ways" to each and every customer.',
  },
  para4: {
    ja: '2024年には「ガイドパートナープログラム」を開始し、在日華人ガイドの皆様に旅行会社レベルのリソースと技術サポートを提供する取り組みを始めました。これはビジネスモデルの革新にとどまらず、業界全体への責任と約束でもあります。',
    'zh-TW': '2024年我們啟動了「導遊合夥人計劃」，為在日華人導遊提供旅行社級別的資源與技術支持。這不僅是商業模式的創新，更是對整個行業的責任與承諾。',
    'zh-CN': '2024年我们启动了"导游合伙人计划"，为在日华人导游提供旅行社级别的资源与技术支持。这不仅是商业模式的创新，更是对整个行业的责任与承诺。',
    en: 'In 2024, we launched the "Guide Partner Program," providing Chinese-speaking guides in Japan with travel agency-level resources and technical support. This is not merely a business model innovation, but also a responsibility and commitment to the entire industry.',
  },
  para5: {
    ja: '今後も医療ツーリズム、ハイエンドカスタマイズ、ビジネス視察の三大領域を深耕し、テクノロジーでサービスを進化させ、真心でお客様の心を動かしてまいります。',
    'zh-TW': '未來我們將繼續深耕醫療旅遊、高端定制、商務考察三大領域，以科技推動服務進化，以真心打動每位客戶。',
    'zh-CN': '未来我们将继续深耕医疗旅游、高端定制、商务考察三大领域，以科技推动服务进化，以真心打动每位客户。',
    en: 'Going forward, we will continue to deepen our expertise in medical tourism, high-end customization, and business inspections, evolving our services through technology and touching hearts with sincerity.',
  },
  closing: {
    ja: '皆様のご支援を賜りますよう、何卒よろしくお願い申し上げます。',
    'zh-TW': '懇請各位繼續給予支持與指導，謝謝。',
    'zh-CN': '恳请各位继续给予支持与指导，谢谢。',
    en: 'We sincerely look forward to your continued support.',
  },
  companyName: {
    ja: '新島交通株式会社',
    'zh-TW': '新島交通株式會社',
    'zh-CN': '新岛交通株式会社',
    en: 'NIIJIMA KOTSU Co., Ltd.',
  },
  signoff: {
    ja: '代表取締役 員 昊',
    'zh-TW': '代表取締役 員 昊',
    'zh-CN': '代表取缔役 员 昊',
    en: 'Representative Director, Yuan Hao',
  },
};

export default function MessagePage() {
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
      title={{ ja: 'トップメッセージ', 'zh-TW': '社長致辭', 'zh-CN': '社长致辞', en: 'CEO Message' }}
      titleEn="Message from CEO"
      breadcrumb={[
        { label: { ja: '企業情報', 'zh-TW': '企業資訊', 'zh-CN': '企业信息', en: 'Company' }, path: '/company' },
        { label: { ja: 'トップメッセージ', 'zh-TW': '社長致辭', 'zh-CN': '社长致辞', en: 'CEO Message' } }
      ]}
    >
      <article className="prose prose-gray max-w-none">
        <div className="not-prose mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://i.ibb.co/B2mJDvq7/founder.jpg"
                  alt={t('ceoName')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">{t('ceoTitle')}</p>
                <p className="text-xl font-bold text-gray-900">{t('ceoName')}</p>
                {t('ceoNameEn') && <p className="text-sm text-gray-400">{t('ceoNameEn')}</p>}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                {t('heading')}
              </h2>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>{t('para1')}</p>
                <p>{t('para2')}</p>
                <p>
                  {currentLang === 'ja' ? (
                    <>
                      これこそが新島交通を創業した原点です。
                      <strong className="text-gray-900">「華人世界と日本の高品質な資源をつなぐ架け橋となる」</strong>——
                      世界トップクラスの精密健診、会員制の名門ゴルフ場、充実したビジネス視察など、
                      お客様一人ひとりに「日本にはこんな楽しみ方があったのか」という驚きと感動をお届けしたいと考えております。
                    </>
                  ) : t('para3')}
                </p>
                <p>{t('para4')}</p>
                <p>{t('para5')}</p>
                <p className="text-lg font-medium text-gray-900 pt-4">
                  {t('closing')}
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="text-gray-900 font-bold">{t('companyName')}</p>
                <p className="text-gray-600">{t('signoff')}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </CompanyLayout>
  );
}
