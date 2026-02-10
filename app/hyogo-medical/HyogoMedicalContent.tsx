'use client';

import React from 'react';
import Image from 'next/image';
import {
  Building2, MapPin, Phone, Clock, Train,
  Award, Stethoscope, Activity, Users, Shield,
  Heart, Brain, Bone, Eye, Baby, Pill,
  Syringe, Microscope, Radio, Sparkles,
  CheckCircle, Star, ExternalLink, Calendar
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import type { WhitelabelModuleProps } from '@/components/whitelabel-modules/types';
import WhitelabelContactSection from '@/components/whitelabel-modules/WhitelabelContactSection';

// 多语言翻译
const translations = {
  // Hero Section
  heroBadge: {
    ja: '兵庫医科大学病院',
    'zh-TW': '兵庫醫科大學附屬醫院',
    'zh-CN': '兵库医科大学附属医院',
    en: 'Hyogo Medical University Hospital'
  } as Record<Language, string>,
  heroTitle: {
    ja: '兵庫県最大規模の特定機能病院',
    'zh-TW': '兵庫縣最大規模特定功能醫院',
    'zh-CN': '兵库县最大规模特定功能医院',
    en: "Hyogo's Largest Advanced Medical Institution"
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '患者さんに希望を、医学に進歩を',
    'zh-TW': '為患者帶來希望，為醫學帶來進步',
    'zh-CN': '为患者带来希望，为医学带来进步',
    en: 'Bringing Hope to Patients, Progress to Medicine'
  } as Record<Language, string>,
  heroDesc: {
    ja: '1972年開院以来、最先端の医療設備と高度な医療技術で地域医療に貢献。2026年9月には新病院棟が開院予定。',
    'zh-TW': '自1972年開院以來，以最先進的醫療設備和高端醫療技術貢獻地區醫療。2026年9月新病院大樓即將開院。',
    'zh-CN': '自1972年开院以来，以最先进的医疗设备和高端医疗技术贡献地区医疗。2026年9月新病院大楼即将开院。',
    en: 'Since 1972, contributing to regional healthcare with cutting-edge equipment and advanced medical technology. New hospital building opening September 2026.'
  } as Record<Language, string>,
  heroCTA: {
    ja: '健診・受診相談',
    'zh-TW': '健檢・就診諮詢',
    'zh-CN': '健检・就诊咨询',
    en: 'Consultation Inquiry'
  } as Record<Language, string>,

  // Stats
  statBeds: {
    ja: '病床数',
    'zh-TW': '病床數',
    'zh-CN': '病床数',
    en: 'Hospital Beds'
  } as Record<Language, string>,
  statDepts: {
    ja: '診療科',
    'zh-TW': '診療科',
    'zh-CN': '诊疗科',
    en: 'Departments'
  } as Record<Language, string>,
  statYears: {
    ja: '開院',
    'zh-TW': '開院',
    'zh-CN': '开院',
    en: 'Established'
  } as Record<Language, string>,
  statRank: {
    ja: '特定機能病院',
    'zh-TW': '特定功能醫院',
    'zh-CN': '特定功能医院',
    en: 'Advanced Hospital'
  } as Record<Language, string>,

  // About Section
  aboutTitle: {
    ja: '病院概要',
    'zh-TW': '醫院概要',
    'zh-CN': '医院概要',
    en: 'Hospital Overview'
  } as Record<Language, string>,
  aboutDesc: {
    ja: '兵庫医科大学病院は、国指定の特定機能病院として高度な医療を提供しています。全国に87施設、兵庫県内には2施設しかない特定機能病院の一つです。',
    'zh-TW': '兵庫醫科大學病院是國家指定的特定功能醫院，提供高端醫療服務。全日本僅有87家，兵庫縣內僅有2家特定功能醫院之一。',
    'zh-CN': '兵库医科大学病院是国家指定的特定功能医院，提供高端医疗服务。全日本仅有87家，兵库县内仅有2家特定功能医院之一。',
    en: 'Hyogo Medical University Hospital is a nationally designated advanced medical institution. Only 87 such hospitals exist in Japan, with just 2 in Hyogo Prefecture.'
  } as Record<Language, string>,

  // Certifications
  certTitle: {
    ja: '認定・指定',
    'zh-TW': '認定・指定',
    'zh-CN': '认定・指定',
    en: 'Certifications & Designations'
  } as Record<Language, string>,

  // Departments
  deptTitle: {
    ja: '主要診療科',
    'zh-TW': '主要診療科',
    'zh-CN': '主要诊疗科',
    en: 'Major Departments'
  } as Record<Language, string>,
  deptInternal: {
    ja: '内科系',
    'zh-TW': '內科系',
    'zh-CN': '内科系',
    en: 'Internal Medicine'
  } as Record<Language, string>,
  deptSurgical: {
    ja: '外科系',
    'zh-TW': '外科系',
    'zh-CN': '外科系',
    en: 'Surgical'
  } as Record<Language, string>,
  deptOther: {
    ja: 'その他',
    'zh-TW': '其他',
    'zh-CN': '其他',
    en: 'Others'
  } as Record<Language, string>,

  // Features
  featTitle: {
    ja: '病院の特色',
    'zh-TW': '醫院特色',
    'zh-CN': '医院特色',
    en: 'Hospital Features'
  } as Record<Language, string>,
  featEquipment: {
    ja: '最新医療機器',
    'zh-TW': '最新醫療設備',
    'zh-CN': '最新医疗设备',
    en: 'Latest Medical Equipment'
  } as Record<Language, string>,
  featEquipmentDesc: {
    ja: '手術支援ロボット「ダヴィンチXi」、PETがん検診センター等を完備',
    'zh-TW': '配備手術支援機器人「達文西Xi」、PET癌症篩查中心等',
    'zh-CN': '配备手术支援机器人「达芬奇Xi」、PET癌症筛查中心等',
    en: 'Equipped with Da Vinci Xi surgical robot, PET cancer screening center, etc.'
  } as Record<Language, string>,
  featEmergency: {
    ja: '急性医療総合センター',
    'zh-TW': '急性醫療綜合中心',
    'zh-CN': '急性医疗综合中心',
    en: 'Acute Medical Center'
  } as Record<Language, string>,
  featEmergencyDesc: {
    ja: '救命救急センター、手術センター、集中治療センター、IVRセンターを集約',
    'zh-TW': '整合救命急救中心、手術中心、重症監護中心、IVR中心',
    'zh-CN': '整合救命急救中心、手术中心、重症监护中心、IVR中心',
    en: 'Integrated emergency center, surgical center, ICU, and IVR center'
  } as Record<Language, string>,
  featDisaster: {
    ja: '災害拠点病院',
    'zh-TW': '災害據點醫院',
    'zh-CN': '灾害据点医院',
    en: 'Disaster Base Hospital'
  } as Record<Language, string>,
  featDisasterDesc: {
    ja: '兵庫県災害拠点病院として地域の安全を守る',
    'zh-TW': '作為兵庫縣災害據點醫院守護地區安全',
    'zh-CN': '作为兵库县灾害据点医院守护地区安全',
    en: 'Protecting regional safety as Hyogo Prefecture disaster base hospital'
  } as Record<Language, string>,

  // New Building
  newBuildingTitle: {
    ja: '2026年 新病院棟開院',
    'zh-TW': '2026年 新病院大樓開院',
    'zh-CN': '2026年 新病院大楼开院',
    en: '2026 New Hospital Building Opening'
  } as Record<Language, string>,
  newBuildingDesc: {
    ja: '「Human Centered Hospital」をコンセプトに、患者中心の未来型スマート病院が誕生。地上15階建て、801床の最新鋭施設。',
    'zh-TW': '以「Human Centered Hospital」為理念，打造以患者為中心的未來型智能醫院。地上15層、801床最先進設施。',
    'zh-CN': '以「Human Centered Hospital」为理念，打造以患者为中心的未来型智能医院。地上15层、801床最先进设施。',
    en: 'A patient-centered smart hospital of the future with "Human Centered Hospital" concept. 15-story, 801-bed state-of-the-art facility.'
  } as Record<Language, string>,

  // Access
  accessTitle: {
    ja: 'アクセス',
    'zh-TW': '交通方式',
    'zh-CN': '交通方式',
    en: 'Access'
  } as Record<Language, string>,
  accessAddress: {
    ja: '〒663-8501 兵庫県西宮市武庫川町1-1',
    'zh-TW': '〒663-8501 兵庫縣西宮市武庫川町1-1',
    'zh-CN': '〒663-8501 兵库县西宫市武库川町1-1',
    en: '1-1 Mukogawa-cho, Nishinomiya, Hyogo 663-8501'
  } as Record<Language, string>,
  accessTrain: {
    ja: '阪神電鉄「武庫川駅」西出口より徒歩5分',
    'zh-TW': '阪神電鐵「武庫川站」西出口步行5分鐘',
    'zh-CN': '阪神电铁「武库川站」西出口步行5分钟',
    en: '5-min walk from Hanshin Railway Mukogawa Station (West Exit)'
  } as Record<Language, string>,

  // Hours
  hoursTitle: {
    ja: '外来受付時間',
    'zh-TW': '門診受理時間',
    'zh-CN': '门诊受理时间',
    en: 'Outpatient Hours'
  } as Record<Language, string>,
  hoursWeekday: {
    ja: '月〜金 8:30-11:00',
    'zh-TW': '週一至週五 8:30-11:00',
    'zh-CN': '周一至周五 8:30-11:00',
    en: 'Mon-Fri 8:30-11:00'
  } as Record<Language, string>,
  hoursClosed: {
    ja: '休診：土日祝日・年末年始',
    'zh-TW': '休診：週六日及國定假日・年末年初',
    'zh-CN': '休诊：周六日及法定节假日・年末年初',
    en: 'Closed: Weekends, holidays, year-end/New Year'
  } as Record<Language, string>,

  // Contact
  contactTitle: {
    ja: 'お問い合わせ',
    'zh-TW': '聯繫方式',
    'zh-CN': '联系方式',
    en: 'Contact'
  } as Record<Language, string>,
  officialSite: {
    ja: '病院公式サイト',
    'zh-TW': '醫院官方網站',
    'zh-CN': '医院官方网站',
    en: 'Official Website'
  } as Record<Language, string>,

  // CTA
  ctaTitle: {
    ja: '日本での健診・治療をご検討の方へ',
    'zh-TW': '考慮在日本進行健檢・治療的您',
    'zh-CN': '考虑在日本进行健检・治疗的您',
    en: 'For Those Considering Medical Care in Japan'
  } as Record<Language, string>,
  ctaDesc: {
    ja: '兵庫医科大学病院での健診・受診について、お気軽にご相談ください。中国語対応スタッフが丁寧にサポートいたします。',
    'zh-TW': '關於在兵庫醫科大學病院的健檢・就診，歡迎隨時諮詢。中文服務人員將為您提供周到的支援。',
    'zh-CN': '关于在兵库医科大学病院的健检・就诊，欢迎随时咨询。中文服务人员将为您提供周到的支援。',
    en: 'Feel free to consult us about health checkups and treatment at Hyogo Medical University Hospital. Chinese-speaking staff will provide attentive support.'
  } as Record<Language, string>,
};

// 认定资质列表
const CERTIFICATIONS = [
  {
    title: {
      ja: '特定機能病院',
      'zh-TW': '特定功能醫院',
      'zh-CN': '特定功能医院',
      en: 'Advanced Medical Institution'
    } as Record<Language, string>,
    desc: {
      ja: '国指定（全国87施設）',
      'zh-TW': '國家指定（全日本87家）',
      'zh-CN': '国家指定（全日本87家）',
      en: 'Nationally designated (87 in Japan)'
    } as Record<Language, string>,
    icon: Award
  },
  {
    title: {
      ja: 'がん診療連携拠点病院',
      'zh-TW': '癌症診療聯合據點醫院',
      'zh-CN': '癌症诊疗联合据点医院',
      en: 'Cancer Treatment Base Hospital'
    } as Record<Language, string>,
    desc: {
      ja: '総合的ながん診療体制',
      'zh-TW': '綜合性癌症診療體系',
      'zh-CN': '综合性癌症诊疗体系',
      en: 'Comprehensive cancer care system'
    } as Record<Language, string>,
    icon: Shield
  },
  {
    title: {
      ja: '周産期母子医療センター',
      'zh-TW': '周產期母子醫療中心',
      'zh-CN': '周产期母子医疗中心',
      en: 'Perinatal Medical Center'
    } as Record<Language, string>,
    desc: {
      ja: '高リスク妊娠・新生児に対応',
      'zh-TW': '應對高風險妊娠・新生兒',
      'zh-CN': '应对高风险妊娠・新生儿',
      en: 'High-risk pregnancy & neonatal care'
    } as Record<Language, string>,
    icon: Baby
  },
  {
    title: {
      ja: '災害拠点病院',
      'zh-TW': '災害據點醫院',
      'zh-CN': '灾害据点医院',
      en: 'Disaster Base Hospital'
    } as Record<Language, string>,
    desc: {
      ja: '兵庫県指定',
      'zh-TW': '兵庫縣指定',
      'zh-CN': '兵库县指定',
      en: 'Hyogo Prefecture designated'
    } as Record<Language, string>,
    icon: Activity
  },
  {
    title: {
      ja: '認知症疾患医療センター',
      'zh-TW': '認知症疾病醫療中心',
      'zh-CN': '认知症疾病医疗中心',
      en: 'Dementia Medical Center'
    } as Record<Language, string>,
    desc: {
      ja: '兵庫県指定',
      'zh-TW': '兵庫縣指定',
      'zh-CN': '兵库县指定',
      en: 'Hyogo Prefecture designated'
    } as Record<Language, string>,
    icon: Brain
  },
  {
    title: {
      ja: '肝疾患診療連携拠点病院',
      'zh-TW': '肝疾病診療聯合據點醫院',
      'zh-CN': '肝疾病诊疗联合据点医院',
      en: 'Liver Disease Base Hospital'
    } as Record<Language, string>,
    desc: {
      ja: '専門的な肝臓治療',
      'zh-TW': '專業肝臟治療',
      'zh-CN': '专业肝脏治疗',
      en: 'Specialized liver treatment'
    } as Record<Language, string>,
    icon: Pill
  },
];

// 诊疗科室
const DEPARTMENTS = {
  internal: [
    { ja: '循環器内科', 'zh-TW': '循環器內科', 'zh-CN': '循环器内科', en: 'Cardiovascular Medicine' },
    { ja: '呼吸器内科', 'zh-TW': '呼吸器內科', 'zh-CN': '呼吸器内科', en: 'Respiratory Medicine' },
    { ja: '脳神経内科', 'zh-TW': '腦神經內科', 'zh-CN': '脑神经内科', en: 'Neurology' },
    { ja: '腎・透析内科', 'zh-TW': '腎・透析內科', 'zh-CN': '肾・透析内科', en: 'Nephrology & Dialysis' },
    { ja: '血液内科', 'zh-TW': '血液內科', 'zh-CN': '血液内科', en: 'Hematology' },
    { ja: '糖尿病・内分泌・代謝内科', 'zh-TW': '糖尿病・內分泌・代謝內科', 'zh-CN': '糖尿病・内分泌・代谢内科', en: 'Diabetes & Endocrinology' },
    { ja: '肝・胆・膵内科', 'zh-TW': '肝・膽・胰內科', 'zh-CN': '肝・胆・胰内科', en: 'Hepatobiliary & Pancreatic Medicine' },
    { ja: '消化管内科', 'zh-TW': '消化道內科', 'zh-CN': '消化道内科', en: 'Gastroenterology' },
    { ja: 'アレルギー・リウマチ内科', 'zh-TW': '過敏・風濕內科', 'zh-CN': '过敏・风湿内科', en: 'Allergy & Rheumatology' },
    { ja: '総合内科', 'zh-TW': '綜合內科', 'zh-CN': '综合内科', en: 'General Internal Medicine' },
  ] as Record<Language, string>[],
  surgical: [
    { ja: '心臓血管外科', 'zh-TW': '心臟血管外科', 'zh-CN': '心脏血管外科', en: 'Cardiovascular Surgery' },
    { ja: '呼吸器外科', 'zh-TW': '呼吸器外科', 'zh-CN': '呼吸器外科', en: 'Thoracic Surgery' },
    { ja: '脳神経外科', 'zh-TW': '腦神經外科', 'zh-CN': '脑神经外科', en: 'Neurosurgery' },
    { ja: '肝・胆・膵外科', 'zh-TW': '肝・膽・胰外科', 'zh-CN': '肝・胆・胰外科', en: 'Hepatobiliary & Pancreatic Surgery' },
    { ja: '上部消化管外科', 'zh-TW': '上消化道外科', 'zh-CN': '上消化道外科', en: 'Upper GI Surgery' },
    { ja: '下部消化管外科', 'zh-TW': '下消化道外科', 'zh-CN': '下消化道外科', en: 'Lower GI Surgery' },
    { ja: '乳腺・内分泌外科', 'zh-TW': '乳腺・內分泌外科', 'zh-CN': '乳腺・内分泌外科', en: 'Breast & Endocrine Surgery' },
    { ja: '泌尿器科', 'zh-TW': '泌尿科', 'zh-CN': '泌尿科', en: 'Urology' },
    { ja: '整形外科', 'zh-TW': '骨科', 'zh-CN': '骨科', en: 'Orthopedics' },
    { ja: '形成外科', 'zh-TW': '整形外科', 'zh-CN': '整形外科', en: 'Plastic Surgery' },
  ] as Record<Language, string>[],
  other: [
    { ja: '産科婦人科', 'zh-TW': '產科婦科', 'zh-CN': '产科妇科', en: 'Obstetrics & Gynecology' },
    { ja: '小児科', 'zh-TW': '小兒科', 'zh-CN': '小儿科', en: 'Pediatrics' },
    { ja: '眼科', 'zh-TW': '眼科', 'zh-CN': '眼科', en: 'Ophthalmology' },
    { ja: '耳鼻咽喉科・頭頸部外科', 'zh-TW': '耳鼻喉科・頭頸部外科', 'zh-CN': '耳鼻喉科・头颈部外科', en: 'ENT & Head/Neck Surgery' },
    { ja: '皮膚科', 'zh-TW': '皮膚科', 'zh-CN': '皮肤科', en: 'Dermatology' },
    { ja: '精神科神経科', 'zh-TW': '精神神經科', 'zh-CN': '精神神经科', en: 'Psychiatry' },
    { ja: '放射線科', 'zh-TW': '放射科', 'zh-CN': '放射科', en: 'Radiology' },
    { ja: '麻酔科', 'zh-TW': '麻醉科', 'zh-CN': '麻醉科', en: 'Anesthesiology' },
    { ja: '救急科', 'zh-TW': '急診科', 'zh-CN': '急诊科', en: 'Emergency Medicine' },
    { ja: 'リハビリテーション科', 'zh-TW': '復健科', 'zh-CN': '康复科', en: 'Rehabilitation' },
  ] as Record<Language, string>[],
};

interface HyogoMedicalContentProps {
  whitelabel?: WhitelabelModuleProps;
}

export default function HyogoMedicalContent({ whitelabel }: HyogoMedicalContentProps) {
  const lang = useLanguage();
  const brandColor = whitelabel?.brandColor || '#1e40af';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-medium">{translations.heroBadge[lang]}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {translations.heroTitle[lang]}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4">
              {translations.heroSubtitle[lang]}
            </p>
            <p className="max-w-3xl mx-auto text-blue-200 mb-8">
              {translations.heroDesc[lang]}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white">963</div>
                <div className="text-sm text-blue-200">{translations.statBeds[lang]}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white">41</div>
                <div className="text-sm text-blue-200">{translations.statDepts[lang]}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white">1972</div>
                <div className="text-sm text-blue-200">{translations.statYears[lang]}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-1">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-sm text-blue-200">{translations.statRank[lang]}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {translations.aboutTitle[lang]}
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              {translations.aboutDesc[lang]}
            </p>
          </div>

          {/* Certifications */}
          <div className="mb-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {translations.certTitle[lang]}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CERTIFICATIONS.map((cert, index) => {
                const Icon = cert.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${brandColor}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: brandColor }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.title[lang]}</h4>
                      <p className="text-sm text-gray-500">{cert.desc[lang]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
            {translations.featTitle[lang]}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Equipment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <Microscope className="w-7 h-7" style={{ color: brandColor }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {translations.featEquipment[lang]}
              </h3>
              <p className="text-gray-600">
                {translations.featEquipmentDesc[lang]}
              </p>
            </div>

            {/* Emergency */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#ef444415' }}
              >
                <Activity className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {translations.featEmergency[lang]}
              </h3>
              <p className="text-gray-600">
                {translations.featEmergencyDesc[lang]}
              </p>
            </div>

            {/* Disaster */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#f9731615' }}
              >
                <Shield className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {translations.featDisaster[lang]}
              </h3>
              <p className="text-gray-600">
                {translations.featDisasterDesc[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
            {translations.deptTitle[lang]}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Internal */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6" style={{ color: brandColor }} />
                <h3 className="text-lg font-bold text-gray-900">
                  {translations.deptInternal[lang]}
                </h3>
              </div>
              <ul className="space-y-2">
                {DEPARTMENTS.internal.map((dept, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {dept[lang]}
                  </li>
                ))}
              </ul>
            </div>

            {/* Surgical */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Syringe className="w-6 h-6" style={{ color: brandColor }} />
                <h3 className="text-lg font-bold text-gray-900">
                  {translations.deptSurgical[lang]}
                </h3>
              </div>
              <ul className="space-y-2">
                {DEPARTMENTS.surgical.map((dept, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {dept[lang]}
                  </li>
                ))}
              </ul>
            </div>

            {/* Other */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="w-6 h-6" style={{ color: brandColor }} />
                <h3 className="text-lg font-bold text-gray-900">
                  {translations.deptOther[lang]}
                </h3>
              </div>
              <ul className="space-y-2">
                {DEPARTMENTS.other.map((dept, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {dept[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* New Building Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">2026.9 OPEN</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {translations.newBuildingTitle[lang]}
            </h2>
            <p className="max-w-3xl mx-auto text-blue-100">
              {translations.newBuildingDesc[lang]}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold">15F</div>
                <div className="text-xs text-blue-200">
                  {lang === 'ja' ? '地上' : lang === 'en' ? 'Floors' : '地上'}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold">801</div>
                <div className="text-xs text-blue-200">{translations.statBeds[lang]}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold">2026</div>
                <div className="text-xs text-blue-200">
                  {lang === 'ja' ? '開院予定' : lang === 'en' ? 'Opening' : '开院'}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-lg font-bold">Smart</div>
                <div className="text-xs text-blue-200">Hospital</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
            {translations.accessTitle[lang]}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Map placeholder */}
            <div className="bg-gray-100 rounded-2xl h-80 md:h-full flex items-center justify-center overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.9847825831894!2d135.3802!3d34.7238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000f1a0d3e6f8e1%3A0x3b6b3b3b3b3b3b3b!2z5YW15bqr5Yy756eR5aSn5a2m55eF6Zmi!5e0!3m2!1sja!2sjp!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
            </div>

            {/* Info */}
            <div className="space-y-6">
              {/* Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${brandColor}15` }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: brandColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {lang === 'ja' ? '所在地' : lang === 'en' ? 'Address' : '地址'}
                    </h3>
                    <p className="text-gray-600">{translations.accessAddress[lang]}</p>
                  </div>
                </div>
              </div>

              {/* Train */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#10b98115' }}
                  >
                    <Train className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {lang === 'ja' ? '電車でお越しの方' : lang === 'en' ? 'By Train' : '电车'}
                    </h3>
                    <p className="text-gray-600">{translations.accessTrain[lang]}</p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#f5910015' }}
                  >
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {translations.hoursTitle[lang]}
                    </h3>
                    <p className="text-gray-600">{translations.hoursWeekday[lang]}</p>
                    <p className="text-sm text-gray-500">{translations.hoursClosed[lang]}</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${brandColor}15` }}
                  >
                    <Phone className="w-6 h-6" style={{ color: brandColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {lang === 'ja' ? '代表電話' : lang === 'en' ? 'Phone' : '电话'}
                    </h3>
                    <p className="text-gray-600">0798-45-6111</p>
                  </div>
                </div>
              </div>

              {/* Official Site */}
              <a
                href="https://www.hosp.hyo-med.ac.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                {translations.officialSite[lang]}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {translations.ctaTitle[lang]}
          </h2>
          <p className="text-gray-600 mb-8">
            {translations.ctaDesc[lang]}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      {whitelabel && whitelabel.showContact !== false && (
        <WhitelabelContactSection
          brandColor={whitelabel.brandColor}
          brandName={whitelabel.brandName}
          contactInfo={whitelabel.contactInfo}
        />
      )}
    </div>
  );
}
