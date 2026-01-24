'use client';

import React, { useState, useEffect } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { Award, Shield, Building2 } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  sectionProfile: {
    ja: '会社概要',
    'zh-TW': '公司概況',
    'zh-CN': '公司概况',
    en: 'Company Profile',
  },
  sectionLicenses: {
    ja: '登録・許認可',
    'zh-TW': '登記與許可',
    'zh-CN': '登记与许可',
    en: 'Registrations & Licenses',
  },
  sectionBanks: {
    ja: '取引銀行',
    'zh-TW': '往來銀行',
    'zh-CN': '合作银行',
    en: 'Banking Partners',
  },
  sectionPartners: {
    ja: '主要取引先',
    'zh-TW': '主要合作夥伴',
    'zh-CN': '主要合作伙伴',
    en: 'Major Business Partners',
  },
  labelCompanyName: {
    ja: '商号',
    'zh-TW': '公司名稱',
    'zh-CN': '公司名称',
    en: 'Company Name',
  },
  labelCompanyNameEn: {
    ja: '英文商号',
    'zh-TW': '英文名稱',
    'zh-CN': '英文名称',
    en: 'English Name',
  },
  labelEstablished: {
    ja: '設立',
    'zh-TW': '成立時間',
    'zh-CN': '成立时间',
    en: 'Established',
  },
  labelCapital: {
    ja: '資本金',
    'zh-TW': '資本額',
    'zh-CN': '注册资本',
    en: 'Capital',
  },
  labelRepresentative: {
    ja: '代表者',
    'zh-TW': '代表人',
    'zh-CN': '法人代表',
    en: 'Representative',
  },
  labelEmployees: {
    ja: '従業員数',
    'zh-TW': '員工人數',
    'zh-CN': '员工人数',
    en: 'Employees',
  },
  labelAddress: {
    ja: '本社所在地',
    'zh-TW': '總部地址',
    'zh-CN': '总部地址',
    en: 'Head Office',
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
  labelBusiness: {
    ja: '事業内容',
    'zh-TW': '業務範圍',
    'zh-CN': '业务范围',
    en: 'Business Areas',
  },
  valueCompanyName: {
    ja: '新島交通株式会社',
    'zh-TW': '新島交通株式會社',
    'zh-CN': '新岛交通株式会社',
    en: 'NIIJIMA KOTSU Co., Ltd.',
  },
  valueEstablished: {
    ja: '2020年2月',
    'zh-TW': '2020年2月',
    'zh-CN': '2020年2月',
    en: 'February 2020',
  },
  valueCapital: {
    ja: '2,500万円',
    'zh-TW': '2,500萬日圓',
    'zh-CN': '2,500万日元',
    en: '25 million JPY',
  },
  valueRepresentative: {
    ja: '代表取締役 員昊',
    'zh-TW': '代表取締役 員昊',
    'zh-CN': '代表取缔役 员昊',
    en: 'Representative Director Yuan Hao',
  },
  valueEmployees: {
    ja: '25名（2024年12月現在）',
    'zh-TW': '25名（截至2024年12月）',
    'zh-CN': '25名（截至2024年12月）',
    en: '25 (as of December 2024)',
  },
  valueAddress: {
    ja: '〒556-0014\n大阪府大阪市浪速区大国1-2-21\nNICビル602号',
    'zh-TW': '〒556-0014\n大阪府大阪市浪速區大國1-2-21\nNIC大樓602號',
    'zh-CN': '〒556-0014\n大阪府大阪市浪速区大国1-2-21\nNIC大厦602号',
    en: '〒556-0014\n1-2-21 Daikoku, Naniwa-ku, Osaka\nNIC Building 602',
  },
  valueBusiness: {
    ja: '・インバウンド旅行事業\n・医療ツーリズム事業\n・ゴルフツーリズム事業\n・ビジネス視察事業',
    'zh-TW': '・入境旅遊事業\n・醫療觀光事業\n・高爾夫旅遊事業\n・商務考察事業',
    'zh-CN': '・入境旅游事业\n・医疗旅游事业\n・高尔夫旅游事业\n・商务考察事业',
    en: '- Inbound tourism\n- Medical tourism\n- Golf tourism\n- Business inspection tours',
  },
  licenseTravel: {
    ja: '第二種旅行業',
    'zh-TW': '第二種旅行業',
    'zh-CN': '第二种旅行业',
    en: 'Type II Travel Agency',
  },
  licenseTravelNumber: {
    ja: '大阪府知事登録 第2-XXXX号',
    'zh-TW': '大阪府知事登錄 第2-XXXX號',
    'zh-CN': '大阪府知事登录 第2-XXXX号',
    en: 'Osaka Governor Registration No. 2-XXXX',
  },
  licenseTravelDesc: {
    ja: '国内旅行・海外旅行の手配旅行業務',
    'zh-TW': '國內旅行・海外旅行的安排業務',
    'zh-CN': '国内旅行・海外旅行的安排业务',
    en: 'Arrangement of domestic and international travel',
  },
  licenseAnta: {
    ja: '全国旅行業協会',
    'zh-TW': '全國旅行業協會',
    'zh-CN': '全国旅行业协会',
    en: 'ANTA',
  },
  licenseAntaNumber: {
    ja: '正会員',
    'zh-TW': '正式會員',
    'zh-CN': '正式会员',
    en: 'Full Member',
  },
  licenseAntaDesc: {
    ja: 'ANTA 全国旅行業協会 正会員',
    'zh-TW': 'ANTA 全國旅行業協會正式會員',
    'zh-CN': 'ANTA 全国旅行业协会正式会员',
    en: 'Full member of All Nippon Travel Agents Association',
  },
  licenseTimc: {
    ja: 'TIMC公式代理店',
    'zh-TW': 'TIMC官方代理',
    'zh-CN': 'TIMC官方代理',
    en: 'Official TIMC Agent',
  },
  licenseTicmNumber: {
    ja: '認定番号 TIMC-2020-001',
    'zh-TW': '認定編號 TIMC-2020-001',
    'zh-CN': '认定编号 TIMC-2020-001',
    en: 'Certification No. TIMC-2020-001',
  },
  licenseTicmDesc: {
    ja: '徳洲会国際医療センター 公式予約代理店',
    'zh-TW': '德洲會國際醫療中心 官方預約代理',
    'zh-CN': '德洲会国际医疗中心 官方预约代理',
    en: 'Official booking agent for Tokushukai International Medical Center',
  },
};

export default function ProfilePage() {
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

  const profileRows = [
    { label: t('labelCompanyName'), value: t('valueCompanyName') },
    { label: t('labelCompanyNameEn'), value: 'NIIJIMA KOTSU Co., Ltd.' },
    { label: t('labelEstablished'), value: t('valueEstablished') },
    { label: t('labelCapital'), value: t('valueCapital') },
    { label: t('labelRepresentative'), value: t('valueRepresentative') },
    { label: t('labelEmployees'), value: t('valueEmployees') },
    { label: t('labelAddress'), value: t('valueAddress') },
    { label: t('labelPhone'), value: '06-6632-8807' },
    { label: t('labelEmail'), value: 'info@niijima-koutsu.jp' },
    { label: t('labelBusiness'), value: t('valueBusiness') },
  ];

  const licenses = [
    {
      icon: Award,
      title: t('licenseTravel'),
      number: t('licenseTravelNumber'),
      desc: t('licenseTravelDesc'),
    },
    {
      icon: Shield,
      title: t('licenseAnta'),
      number: t('licenseAntaNumber'),
      desc: t('licenseAntaDesc'),
    },
    {
      icon: Building2,
      title: t('licenseTimc'),
      number: t('licenseTicmNumber'),
      desc: t('licenseTicmDesc'),
    },
  ];

  const banks = [
    { ja: '三菱UFJ銀行 大阪営業部', 'zh-TW': '三菱UFJ銀行 大阪營業部', 'zh-CN': '三菱UFJ银行 大阪营业部', en: 'MUFG Bank, Osaka Branch' },
    { ja: '三井住友銀行 本町支店', 'zh-TW': '三井住友銀行 本町支店', 'zh-CN': '三井住友银行 本町支店', en: 'SMBC, Hommachi Branch' },
    { ja: 'りそな銀行 大阪本店営業部', 'zh-TW': 'Resona銀行 大阪本店營業部', 'zh-CN': 'Resona银行 大阪本店营业部', en: 'Resona Bank, Osaka Head Office' },
  ];

  return (
    <CompanyLayout
      title={{ ja: '会社概要', 'zh-TW': '公司概況', 'zh-CN': '公司概况', en: 'Company Profile' }}
      titleEn="Company Profile"
      breadcrumb={[
        { label: { ja: '企業情報', 'zh-TW': '企業資訊', 'zh-CN': '企业信息', en: 'Company' }, path: '/company' },
        { label: { ja: '会社概要', 'zh-TW': '公司概況', 'zh-CN': '公司概况', en: 'Company Profile' } }
      ]}
    >
      <div className="space-y-12">
        {/* 会社概要表 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            {t('sectionProfile')}
          </h2>

          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              {profileRows.map((row, index) => (
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
            {t('sectionLicenses')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {licenses.map((item, index) => {
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
            {t('sectionBanks')}
          </h2>

          <ul className="space-y-2 text-gray-600">
            {banks.map((bank, index) => (
              <li key={index}>{bank[currentLang]}</li>
            ))}
          </ul>
        </section>

        {/* 主要取引先 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            {t('sectionPartners')}
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
