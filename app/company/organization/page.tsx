'use client';

import React, { useState, useEffect } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { User, Users, Building, Briefcase, Heart, Globe } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  sectionOrgChart: {
    ja: '組織図',
    'zh-TW': '組織架構圖',
    'zh-CN': '组织架构图',
    en: 'Organization Chart',
  },
  ceoTitle: {
    ja: '代表取締役',
    'zh-TW': '代表取締役',
    'zh-CN': '代表取缔役',
    en: 'CEO',
  },
  ceoName: {
    ja: '員 昊',
    'zh-TW': '員 昊',
    'zh-CN': '员 昊',
    en: 'Yuan Hao',
  },
  sectionDirectors: {
    ja: '役員紹介',
    'zh-TW': '管理層介紹',
    'zh-CN': '管理层介绍',
    en: 'Board of Directors',
  },
  sectionEmployeeData: {
    ja: '従業員データ',
    'zh-TW': '員工數據',
    'zh-CN': '员工数据',
    en: 'Employee Data',
  },
  deptSales: {
    ja: '営業本部',
    'zh-TW': '營業總部',
    'zh-CN': '营业总部',
    en: 'Sales Division',
  },
  deptMedical: {
    ja: '医療事業部',
    'zh-TW': '醫療事業部',
    'zh-CN': '医疗事业部',
    en: 'Medical Division',
  },
  deptTourism: {
    ja: 'ツーリズム事業部',
    'zh-TW': '觀光事業部',
    'zh-CN': '观光事业部',
    en: 'Tourism Division',
  },
  deptAdmin: {
    ja: '管理本部',
    'zh-TW': '管理總部',
    'zh-CN': '管理总部',
    en: 'Administration',
  },
  teamCorporateSales: {
    ja: '法人営業部',
    'zh-TW': '法人業務部',
    'zh-CN': '法人业务部',
    en: 'Corporate Sales',
  },
  teamInbound: {
    ja: 'インバウンド営業部',
    'zh-TW': '入境業務部',
    'zh-CN': '入境业务部',
    en: 'Inbound Sales',
  },
  teamPartnerDev: {
    ja: 'パートナー開発部',
    'zh-TW': '夥伴開發部',
    'zh-CN': '伙伴开发部',
    en: 'Partner Development',
  },
  teamCheckup: {
    ja: '健診手配課',
    'zh-TW': '健檢安排課',
    'zh-CN': '体检安排课',
    en: 'Health Screening',
  },
  teamCancer: {
    ja: 'がん治療課',
    'zh-TW': '癌症治療課',
    'zh-CN': '癌症治疗课',
    en: 'Cancer Treatment',
  },
  teamCS: {
    ja: 'カスタマーサポート課',
    'zh-TW': '客戶服務課',
    'zh-CN': '客户服务课',
    en: 'Customer Support',
  },
  teamGolf: {
    ja: 'ゴルフ企画課',
    'zh-TW': '高爾夫企劃課',
    'zh-CN': '高尔夫企划课',
    en: 'Golf Planning',
  },
  teamInspection: {
    ja: 'ビジネス視察課',
    'zh-TW': '商務考察課',
    'zh-CN': '商务考察课',
    en: 'Business Inspection',
  },
  teamArrangement: {
    ja: '手配課',
    'zh-TW': '安排課',
    'zh-CN': '安排课',
    en: 'Arrangements',
  },
  teamAccounting: {
    ja: '経理部',
    'zh-TW': '財務部',
    'zh-CN': '财务部',
    en: 'Accounting',
  },
  teamHR: {
    ja: '人事総務部',
    'zh-TW': '人事總務部',
    'zh-CN': '人事总务部',
    en: 'HR & General Affairs',
  },
  teamIT: {
    ja: 'システム開発部',
    'zh-TW': '系統開發部',
    'zh-CN': '系统开发部',
    en: 'IT Development',
  },
  directorCEO: {
    ja: '代表取締役',
    'zh-TW': '代表取締役',
    'zh-CN': '代表取缔役',
    en: 'Representative Director',
  },
  directorSales: {
    ja: '取締役 営業本部長',
    'zh-TW': '取締役 營業總部長',
    'zh-CN': '取缔役 营业总部长',
    en: 'Director, Head of Sales',
  },
  directorMedical: {
    ja: '取締役 医療事業部長',
    'zh-TW': '取締役 醫療事業部長',
    'zh-CN': '取缔役 医疗事业部长',
    en: 'Director, Head of Medical',
  },
  directorAuditor: {
    ja: '監査役',
    'zh-TW': '監察人',
    'zh-CN': '监事',
    en: 'Auditor',
  },
  bioCEO: {
    ja: '早稲田大学卒業。大手旅行会社勤務を経て、2020年に新島交通を創業。華人旅客向けインバウンド事業の先駆者として業界をリード。',
    'zh-TW': '早稻田大學畢業。曾任職大型旅行社，2020年創立新島交通。作為華人旅客入境事業的先驅者引領業界。',
    'zh-CN': '早稻田大学毕业。曾任职大型旅行社，2020年创立新岛交通。作为华人旅客入境事业的先驱者引领行业。',
    en: 'Graduated from Waseda University. After working at a major travel company, founded NIIJIMA KOTSU in 2020. A pioneer in inbound tourism for Chinese-speaking travelers.',
  },
  bioSales: {
    ja: '大手旅行会社にて法人営業部長を歴任。20年以上の業界経験を活かし、法人向けサービスを統括。',
    'zh-TW': '曾任大型旅行社法人業務部長。憑藉20年以上的業界經驗，統括法人服務。',
    'zh-CN': '曾任大型旅行社法人业务部长。凭借20年以上的行业经验，统管法人服务。',
    en: 'Served as Corporate Sales Director at a major travel agency. Oversees corporate services with over 20 years of industry experience.',
  },
  bioMedical: {
    ja: '医療通訳者として10年の経験。TIMC連携の立ち上げから参画し、医療ツーリズム事業を牽引。',
    'zh-TW': '擁有10年醫療口譯經驗。從TIMC合作啟動起即參與，引領醫療觀光事業。',
    'zh-CN': '拥有10年医疗口译经验。从TIMC合作启动起即参与，引领医疗旅游事业。',
    en: '10 years of experience as a medical interpreter. Involved from the inception of the TIMC partnership, leading the medical tourism business.',
  },
  bioAuditor: {
    ja: '公認会計士。大手監査法人パートナーを経て就任。コーポレートガバナンスの強化に尽力。',
    'zh-TW': '註冊會計師。曾任大型會計師事務所合夥人。致力於強化公司治理。',
    'zh-CN': '注册会计师。曾任大型会计师事务所合伙人。致力于强化公司治理。',
    en: 'Certified public accountant. Former partner at a major audit firm. Dedicated to strengthening corporate governance.',
  },
  statEmployees: {
    ja: '従業員数',
    'zh-TW': '員工人數',
    'zh-CN': '员工人数',
    en: 'Employees',
  },
  statAge: {
    ja: '平均年齢',
    'zh-TW': '平均年齡',
    'zh-CN': '平均年龄',
    en: 'Average Age',
  },
  statGender: {
    ja: '男女比',
    'zh-TW': '男女比',
    'zh-CN': '男女比',
    en: 'Gender Ratio',
  },
  statForeign: {
    ja: '外国籍社員',
    'zh-TW': '外籍員工',
    'zh-CN': '外籍员工',
    en: 'Foreign Nationals',
  },
  statEmployeesValue: {
    ja: '25名',
    'zh-TW': '25名',
    'zh-CN': '25名',
    en: '25',
  },
  statAgeValue: {
    ja: '34歳',
    'zh-TW': '34歲',
    'zh-CN': '34岁',
    en: '34 yrs',
  },
  statGenderNote: {
    ja: '女性比率60%',
    'zh-TW': '女性比例60%',
    'zh-CN': '女性比例60%',
    en: '60% Female',
  },
  statForeignNote: {
    ja: '多国籍チーム',
    'zh-TW': '多國籍團隊',
    'zh-CN': '多国籍团队',
    en: 'Multinational Team',
  },
  statEmployeesNote: {
    ja: '2024年12月現在',
    'zh-TW': '截至2024年12月',
    'zh-CN': '截至2024年12月',
    en: 'As of Dec 2024',
  },
};

export default function OrganizationPage() {
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

  const departments = [
    { name: t('deptSales'), icon: Briefcase, color: 'blue', teams: [t('teamCorporateSales'), t('teamInbound'), t('teamPartnerDev')] },
    { name: t('deptMedical'), icon: Heart, color: 'rose', teams: [t('teamCheckup'), t('teamCancer'), t('teamCS')] },
    { name: t('deptTourism'), icon: Globe, color: 'amber', teams: [t('teamGolf'), t('teamInspection'), t('teamArrangement')] },
    { name: t('deptAdmin'), icon: Building, color: 'slate', teams: [t('teamAccounting'), t('teamHR'), t('teamIT')] },
  ];

  const directors = [
    {
      position: t('directorCEO'),
      name: '員 昊',
      nameEn: 'Yuan Hao',
      photo: 'https://i.ibb.co/B2mJDvq7/founder.jpg',
      bio: t('bioCEO'),
    },
    {
      position: t('directorSales'),
      name: '田中 誠一',
      nameEn: 'Seiichi Tanaka',
      photo: null,
      bio: t('bioSales'),
    },
    {
      position: t('directorMedical'),
      name: '李 美華',
      nameEn: 'Meihua Li',
      photo: null,
      bio: t('bioMedical'),
    },
    {
      position: t('directorAuditor'),
      name: '山本 健太郎',
      nameEn: 'Kentaro Yamamoto',
      photo: null,
      bio: t('bioAuditor'),
    },
  ];

  const employeeStats = [
    { label: t('statEmployees'), value: t('statEmployeesValue'), note: t('statEmployeesNote') },
    { label: t('statAge'), value: t('statAgeValue'), note: '' },
    { label: t('statGender'), value: '4:6', note: t('statGenderNote') },
    { label: t('statForeign'), value: '40%', note: t('statForeignNote') },
  ];

  return (
    <CompanyLayout
      title={{ ja: '組織体制', 'zh-TW': '組織架構', 'zh-CN': '组织架构', en: 'Organization' }}
      titleEn="Organization"
      breadcrumb={[
        { label: { ja: '企業情報', 'zh-TW': '企業資訊', 'zh-CN': '企业信息', en: 'Company' }, path: '/company' },
        { label: { ja: '組織体制', 'zh-TW': '組織架構', 'zh-CN': '组织架构', en: 'Organization' } }
      ]}
    >
      <div className="space-y-12">
        {/* 組織図 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-8 pb-3 border-b-2 border-blue-600">
            {t('sectionOrgChart')}
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* 代表取締役 */}
              <div className="flex justify-center mb-8">
                <div className="bg-slate-900 text-white px-8 py-4 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">{t('ceoTitle')}</div>
                    <div className="font-bold text-lg">{t('ceoName')}</div>
                  </div>
                </div>
              </div>

              {/* 連結線 */}
              <div className="flex justify-center mb-8">
                <div className="w-0.5 h-8 bg-gray-300" />
              </div>

              {/* 各部門 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {departments.map((dept, index) => {
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
            {t('sectionDirectors')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {directors.map((person, index) => (
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
            {t('sectionEmployeeData')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {employeeStats.map((stat, index) => (
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
