'use client';

import React, { useState, useEffect } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { Building2, Award, Heart, Star, Sparkles, Users, Globe, Rocket } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  intro: {
    ja: '2020年の創業以来、新島交通は「華人旅客と日本をつなぐ架け橋」として着実に成長を続けてまいりました。',
    'zh-TW': '自2020年創業以來，新島交通作為「連結華人旅客與日本的橋樑」，持續穩健成長。',
    'zh-CN': '自2020年创业以来，新岛交通作为"连接华人旅客与日本的桥梁"，持续稳健成长。',
    en: 'Since its founding in 2020, NIIJIMA KOTSU has steadily grown as a bridge connecting Chinese-speaking travelers with Japan.',
  },
};

const getHistoryData = (lang: Language) => {
  const data: { year: string; month: Record<Language, string>; title: Record<Language, string>; description: Record<Language, string>; icon: typeof Building2; highlight?: boolean }[] = [
    {
      year: '2020',
      month: { ja: '2月', 'zh-TW': '2月', 'zh-CN': '2月', en: 'Feb' },
      title: { ja: '新島交通株式会社 設立', 'zh-TW': '新島交通株式會社成立', 'zh-CN': '新岛交通株式会社成立', en: 'NIIJIMA KOTSU Co., Ltd. Established' },
      description: { ja: '大阪市浪速区にて創業。「華人旅客と日本の高品質な観光資源をつなぐ」をミッションに事業開始。', 'zh-TW': '於大阪市浪速區創業。以「連結華人旅客與日本高品質觀光資源」為使命展開事業。', 'zh-CN': '于大阪市浪速区创业。以"连接华人旅客与日本高品质观光资源"为使命展开事业。', en: 'Founded in Naniwa-ku, Osaka. Commenced operations with the mission of connecting Chinese-speaking travelers with Japan\'s premium tourism resources.' },
      icon: Building2,
      highlight: true,
    },
    {
      year: '2020',
      month: { ja: '6月', 'zh-TW': '6月', 'zh-CN': '6月', en: 'Jun' },
      title: { ja: '第二種旅行業登録取得', 'zh-TW': '取得第二種旅行業登記', 'zh-CN': '取得第二种旅行业登记', en: 'Type II Travel Agency Registration' },
      description: { ja: '大阪府知事より第二種旅行業の登録を取得。国内・海外旅行の手配業務を本格開始。', 'zh-TW': '取得大阪府知事核發之第二種旅行業登記。正式開展國內外旅行安排業務。', 'zh-CN': '取得大阪府知事核发的第二种旅行业登记。正式开展国内外旅行安排业务。', en: 'Obtained Type II Travel Agency registration from the Osaka Prefectural Governor. Full-scale commencement of domestic and international travel arrangement services.' },
      icon: Award,
    },
    {
      year: '2020',
      month: { ja: '9月', 'zh-TW': '9月', 'zh-CN': '9月', en: 'Sep' },
      title: { ja: '全国旅行業協会（ANTA）加盟', 'zh-TW': '加入全國旅行業協會（ANTA）', 'zh-CN': '加入全国旅行业协会（ANTA）', en: 'Joined ANTA' },
      description: { ja: '業界団体への正会員加盟により、信頼性と業界ネットワークを強化。', 'zh-TW': '成為業界團體正式會員，強化信賴度與業界網絡。', 'zh-CN': '成为行业团体正式会员，强化信誉度与行业网络。', en: 'Strengthened credibility and industry network through full membership in the industry association.' },
      icon: Award,
    },
    {
      year: '2021',
      month: { ja: '3月', 'zh-TW': '3月', 'zh-CN': '3月', en: 'Mar' },
      title: { ja: '医療ツーリズム事業部 発足', 'zh-TW': '醫療觀光事業部成立', 'zh-CN': '医疗旅游事业部成立', en: 'Medical Tourism Division Launched' },
      description: { ja: '徳洲会国際医療センター（TIMC）と戦略的パートナーシップを締結。精密健診市場に本格参入。', 'zh-TW': '與德洲會國際醫療中心（TIMC）締結戰略夥伴關係。正式進入精密健檢市場。', 'zh-CN': '与德洲会国际医疗中心（TIMC）缔结战略伙伴关系。正式进入精密体检市场。', en: 'Established strategic partnership with TIMC (Tokushukai International Medical Center). Full-scale entry into the precision health screening market.' },
      icon: Heart,
      highlight: true,
    },
    {
      year: '2021',
      month: { ja: '10月', 'zh-TW': '10月', 'zh-CN': '10月', en: 'Oct' },
      title: { ja: 'TIMC公式予約代理店 認定', 'zh-TW': '獲TIMC官方預約代理認定', 'zh-CN': '获TIMC官方预约代理认定', en: 'Certified as Official TIMC Booking Agent' },
      description: { ja: 'TIMC OSAKAの公式予約代理店として認定を取得。', 'zh-TW': '獲得TIMC OSAKA官方預約代理認定。', 'zh-CN': '获得TIMC OSAKA官方预约代理认定。', en: 'Obtained certification as an official booking agent for TIMC OSAKA.' },
      icon: Award,
    },
    {
      year: '2021',
      month: { ja: '4月', 'zh-TW': '4月', 'zh-CN': '4月', en: 'Apr' },
      title: { ja: 'ゴルフツーリズム事業 開始', 'zh-TW': '高爾夫旅遊事業啟動', 'zh-CN': '高尔夫旅游事业启动', en: 'Golf Tourism Business Launched' },
      description: { ja: '関西地区20以上の会員制名門ゴルフ場と独占提携契約を締結。', 'zh-TW': '與關西地區20多家會員制名門高爾夫球場簽訂獨家合作契約。', 'zh-CN': '与关西地区20多家会员制名门高尔夫球场签订独家合作合同。', en: 'Signed exclusive partnership agreements with over 20 prestigious membership golf courses in the Kansai region.' },
      icon: Star,
    },
    {
      year: '2022',
      month: { ja: '7月', 'zh-TW': '7月', 'zh-CN': '7月', en: 'Jul' },
      title: { ja: 'ビジネス視察事業 拡大', 'zh-TW': '商務考察事業擴大', 'zh-CN': '商务考察事业扩大', en: 'Business Inspection Tours Expanded' },
      description: { ja: '企業向け日本視察ツアーのカスタマイズサービスを強化。製造業・医療・テック分野での視察実績蓄積。', 'zh-TW': '強化企業日本考察之客製化服務。累積製造業、醫療、科技領域的考察實績。', 'zh-CN': '强化企业日本考察的定制化服务。积累制造业、医疗、科技领域的考察实绩。', en: 'Enhanced customization services for corporate Japan inspection tours. Accumulated experience in manufacturing, medical, and technology sectors.' },
      icon: Globe,
    },
    {
      year: '2023',
      month: { ja: '9月', 'zh-TW': '9月', 'zh-CN': '9月', en: 'Sep' },
      title: { ja: 'AI報価システム「LinkQuote」リリース', 'zh-TW': 'AI報價系統「LinkQuote」上線', 'zh-CN': 'AI报价系统"LinkQuote"上线', en: 'AI Quotation System "LinkQuote" Released' },
      description: { ja: '自社開発のAI搭載見積もりエンジンをリリース。24時間即時見積もり対応を実現。', 'zh-TW': '發布自主研發的AI報價引擎。實現24小時即時報價服務。', 'zh-CN': '发布自主研发的AI报价引擎。实现24小时即时报价服务。', en: 'Released our proprietary AI-powered quotation engine. Achieved 24/7 instant quote capability.' },
      icon: Sparkles,
      highlight: true,
    },
    {
      year: '2024',
      month: { ja: '3月', 'zh-TW': '3月', 'zh-CN': '3月', en: 'Mar' },
      title: { ja: 'ガイドパートナープログラム 開始', 'zh-TW': '導遊合夥人計劃啟動', 'zh-CN': '导游合伙人计划启动', en: 'Guide Partner Program Launched' },
      description: { ja: '在日華人ガイド向けホワイトラベルソリューションを提供開始。3,000名以上のガイドネットワークを構築。', 'zh-TW': '開始提供在日華人導遊白標解決方案。構建超過3,000人的導遊網絡。', 'zh-CN': '开始提供在日华人导游白标解决方案。构建超过3,000人的导游网络。', en: 'Began providing white-label solutions for Chinese-speaking guides in Japan. Built a network of over 3,000 guides.' },
      icon: Users,
      highlight: true,
    },
    {
      year: '2024',
      month: { ja: '8月', 'zh-TW': '8月', 'zh-CN': '8月', en: 'Aug' },
      title: { ja: '従業員数25名突破', 'zh-TW': '員工人數突破25名', 'zh-CN': '员工人数突破25名', en: 'Surpassed 25 Employees' },
      description: { ja: '事業拡大に伴い、組織体制を強化。', 'zh-TW': '隨著業務擴大，強化組織體制。', 'zh-CN': '随着业务扩大，强化组织体制。', en: 'Strengthened organizational structure in line with business expansion.' },
      icon: Users,
    },
    {
      year: '2025',
      month: { ja: '1月', 'zh-TW': '1月', 'zh-CN': '1月', en: 'Jan' },
      title: { ja: '総合医療サービス事業 拡充', 'zh-TW': '綜合醫療服務事業擴充', 'zh-CN': '综合医疗服务事业扩充', en: 'Comprehensive Medical Services Expanded' },
      description: { ja: 'がん治療（陽子線・光免疫・BNCT）紹介サービスを新設。医療ツーリズムの領域を拡大。', 'zh-TW': '新設癌症治療（質子線、光免疫、BNCT）介紹服務。擴大醫療觀光領域。', 'zh-CN': '新设癌症治疗（质子线、光免疫、BNCT）介绍服务。扩大医疗旅游领域。', en: 'Established cancer treatment referral services (proton therapy, photoimmunotherapy, BNCT). Expanded the scope of medical tourism.' },
      icon: Rocket,
      highlight: true,
    },
  ];
  return data;
};

export default function HistoryPage() {
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
  const historyData = getHistoryData(currentLang);

  return (
    <CompanyLayout
      title={{ ja: '沿革', 'zh-TW': '發展歷程', 'zh-CN': '发展历程', en: 'History' }}
      titleEn="History"
      breadcrumb={[
        { label: { ja: '企業情報', 'zh-TW': '企業資訊', 'zh-CN': '企业信息', en: 'Company' }, path: '/company' },
        { label: { ja: '沿革', 'zh-TW': '發展歷程', 'zh-CN': '发展历程', en: 'History' } }
      ]}
    >
      <div className="space-y-8">
        <p className="text-gray-600 leading-relaxed">
          {t('intro')}
        </p>

        {/* タイムライン */}
        <div className="relative">
          {/* 縦線 */}
          <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600" />

          <div className="space-y-0">
            {historyData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
                  {/* 年月 */}
                  <div className="w-20 flex-shrink-0 text-right">
                    <div className="font-bold text-gray-900">{item.year}</div>
                    <div className="text-sm text-gray-500">{item.month[currentLang]}</div>
                  </div>

                  {/* アイコン */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.highlight
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}>
                    <Icon size={18} />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 pb-8">
                    <div className={`p-4 rounded-xl ${
                      item.highlight
                        ? 'bg-blue-50 border border-blue-100'
                        : 'bg-gray-50 border border-gray-100'
                    }`}>
                      <h3 className={`font-bold mb-1 ${
                        item.highlight ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {item.title[currentLang]}
                      </h3>
                      <p className="text-sm text-gray-600">{item.description[currentLang]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
