'use client';

import React from 'react';
import {
  Building, MapPin, Phone, Clock, Train,
  Award, Stethoscope, Activity, Users, Shield,
  Heart, Brain, Baby, Pill,
  Syringe, Microscope, Sparkles, CheckCircle,
  ExternalLink, FileText, Armchair
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import type { WhitelabelModuleProps } from '@/components/whitelabel-modules/types';
import WhitelabelContactSection from '@/components/whitelabel-modules/WhitelabelContactSection';

// ======================================
// 多语言翻译
// ======================================
const t = {
  heroTitle1: { ja: '兵庫医科大学病院', 'zh-TW': '兵庫醫科大學病院', 'zh-CN': '兵库医科大学病院', en: 'Hyogo Medical University Hospital' } as Record<Language, string>,
  heroTitle2: { ja: '兵庫県最大規模の特定機能病院', 'zh-TW': '兵庫縣最大規模特定功能醫院', 'zh-CN': '兵库县最大规模特定功能医院', en: "Hyogo's Largest Advanced Hospital" } as Record<Language, string>,
  heroSubtitle: { ja: '患者さんに希望を、医学に進歩を', 'zh-TW': '為患者帶來希望，為醫學帶來進步', 'zh-CN': '为患者带来希望，为医学带来进步', en: 'Bringing Hope to Patients, Progress to Medicine' } as Record<Language, string>,
  heroText: { ja: '1972年開院以来、最先端の医療設備と高度な医療技術で\n兵庫県の地域医療に貢献し続ける国指定特定機能病院。\n全国87施設、兵庫県内わずか2施設の一つ。', 'zh-TW': '自1972年開院以來，以最先進的醫療設備和高端醫療技術\n持續為兵庫縣的地區醫療做出貢獻。\n國家指定特定功能醫院，全日本僅87家，兵庫縣內僅2家。', 'zh-CN': '自1972年开院以来，以最先进的医疗设备和高端医疗技术\n持续为兵库县的地区医疗做出贡献。\n国家指定特定功能医院，全日本仅87家，兵库县内仅2家。', en: 'Since 1972, contributing to regional healthcare with cutting-edge\nequipment and advanced medical technology.\nNationally designated - only 87 in Japan, 2 in Hyogo Prefecture.' } as Record<Language, string>,
  limitBadge: { ja: '2026年9月 新病院棟 開院予定', 'zh-TW': '2026年9月 新病院大樓 即將開院', 'zh-CN': '2026年9月 新病院大楼 即将开院', en: 'New Hospital Building Opening Sep 2026' } as Record<Language, string>,

  // Authority
  authTag: { ja: '病院の資格認定', 'zh-TW': '醫院資質認定', 'zh-CN': '医院资质认定', en: 'Certifications' } as Record<Language, string>,
  authTitle: { ja: '国が認めた高度医療機関', 'zh-TW': '國家認定高端醫療機構', 'zh-CN': '国家认定高端医疗机构', en: 'Nationally Certified Advanced Medical Institution' } as Record<Language, string>,

  // Tech
  techTitle: { ja: '最新医療設備', 'zh-TW': '最新醫療設備', 'zh-CN': '最新医疗设备', en: 'Latest Medical Equipment' } as Record<Language, string>,
  techSub: { ja: '世界レベルの医療機器で精確な診断と治療を', 'zh-TW': '世界級醫療設備，精準診斷與治療', 'zh-CN': '世界级医疗设备，精准诊断与治疗', en: 'World-class equipment for precise diagnosis and treatment' } as Record<Language, string>,
  techDavinci: { ja: '手術支援ロボット ダヴィンチXi', 'zh-TW': '手術支援機器人 達文西Xi', 'zh-CN': '手术支援机器人 达芬奇Xi', en: 'Da Vinci Xi Surgical Robot' } as Record<Language, string>,
  techDavinciDesc: { ja: '精確性と低侵襲性を両立した最先端のロボット支援手術システム。泌尿器科・消化器外科等で活用', 'zh-TW': '兼具精確性與低侵入性的最先進機器人輔助手術系統，應用於泌尿科・消化外科等', 'zh-CN': '兼具精确性与低侵入性的最先进机器人辅助手术系统，应用于泌尿科・消化外科等', en: 'State-of-the-art robotic surgical system combining precision with minimal invasiveness' } as Record<Language, string>,
  techPet: { ja: 'PET-CT がん検診センター', 'zh-TW': 'PET-CT 癌症篩查中心', 'zh-CN': 'PET-CT 癌症筛查中心', en: 'PET-CT Cancer Screening Center' } as Record<Language, string>,
  techPetDesc: { ja: '全身のがんを一度にスクリーニング。早期発見・早期治療を実現する最新のPET-CT装置を完備', 'zh-TW': '一次性全身癌症篩查，配備最新PET-CT裝置，實現早期發現・早期治療', 'zh-CN': '一次性全身癌症筛查，配备最新PET-CT装置，实现早期发现・早期治疗', en: 'Full-body cancer screening with latest PET-CT for early detection and treatment' } as Record<Language, string>,
  techMri: { ja: '3.0T MRI', 'zh-TW': '3.0T MRI', 'zh-CN': '3.0T MRI', en: '3.0T MRI' } as Record<Language, string>,
  techMriDesc: { ja: '超高磁場MRIによる高精細画像診断。脳・脊髄・関節等の微細な病変を検出', 'zh-TW': '超高磁場MRI高精度影像診斷，可檢測腦・脊髓・關節等微細病變', 'zh-CN': '超高磁场MRI高精度影像诊断，可检测脑・脊髓・关节等微细病变', en: 'Ultra-high field MRI for high-resolution imaging of brain, spine, and joints' } as Record<Language, string>,
  techCt: { ja: '320列CT', 'zh-TW': '320列CT', 'zh-CN': '320列CT', en: '320-Row CT Scanner' } as Record<Language, string>,
  techCtDesc: { ja: '心臓の1回転撮影が可能な320列CT。低被ばくかつ高精細な画像を実現', 'zh-TW': '可一次旋轉拍攝心臟的320列CT，實現低輻射量高精度影像', 'zh-CN': '可一次旋转拍摄心脏的320列CT，实现低辐射量高精度影像', en: 'Single-rotation cardiac imaging with low radiation and high resolution' } as Record<Language, string>,

  // Facility
  facilityTitle: { ja: '医療施設', 'zh-TW': '醫療設施', 'zh-CN': '医疗设施', en: 'Hospital Facilities' } as Record<Language, string>,
  facilitySubtitle: { ja: '患者さんに最高の治療環境を提供', 'zh-TW': '為患者提供最佳治療環境', 'zh-CN': '为患者提供最佳治疗环境', en: 'Providing the best treatment environment for patients' } as Record<Language, string>,
  facility1Title: { ja: '急性医療総合センター', 'zh-TW': '急性醫療綜合中心', 'zh-CN': '急性医疗综合中心', en: 'Acute Medical Center' } as Record<Language, string>,
  facility1Desc: { ja: '救命救急センター、手術センター、集中治療センター、IVRセンターを一箇所に集約した急性期医療の中核施設', 'zh-TW': '將急救中心、手術中心、重症監護中心、IVR中心整合於一處的急性期醫療核心設施', 'zh-CN': '将急救中心、手术中心、重症监护中心、IVR中心整合于一处的急性期医疗核心设施', en: 'Core acute care facility integrating emergency, surgical, ICU, and IVR centers' } as Record<Language, string>,
  facility2Title: { ja: '2026年 新病院棟', 'zh-TW': '2026年 新病院大樓', 'zh-CN': '2026年 新病院大楼', en: '2026 New Hospital Building' } as Record<Language, string>,
  facility2Desc: { ja: '「Human Centered Hospital」をコンセプトに、患者中心の未来型スマート病院。地上15階建て、801床の最新鋭施設が2026年9月に開院予定', 'zh-TW': '以「Human Centered Hospital」為理念，以患者為中心的未來型智能醫院。地上15層、801床最先進設施，2026年9月開院', 'zh-CN': '以「Human Centered Hospital」为理念，以患者为中心的未来型智能医院。地上15层、801床最先进设施，2026年9月开院', en: '"Human Centered Hospital" concept - 15-story, 801-bed smart hospital opening September 2026' } as Record<Language, string>,

  // Departments
  deptTitle: { ja: '主要診療科', 'zh-TW': '主要診療科', 'zh-CN': '主要诊疗科', en: 'Major Departments' } as Record<Language, string>,
  deptInternal: { ja: '内科系', 'zh-TW': '內科系', 'zh-CN': '内科系', en: 'Internal Medicine' } as Record<Language, string>,
  deptSurgical: { ja: '外科系', 'zh-TW': '外科系', 'zh-CN': '外科系', en: 'Surgical' } as Record<Language, string>,
  deptOther: { ja: 'その他', 'zh-TW': '其他', 'zh-CN': '其他', en: 'Others' } as Record<Language, string>,

  // Flow
  flowTitle: { ja: '外来受診の流れ', 'zh-TW': '門診就診流程', 'zh-CN': '门诊就诊流程', en: 'Outpatient Visit Flow' } as Record<Language, string>,
  flow1: { ja: '受付', 'zh-TW': '掛號', 'zh-CN': '挂号', en: 'Reception' } as Record<Language, string>,
  flow1d: { ja: '紹介状をお持ちの方は受付窓口へ', 'zh-TW': '持轉介信者請至掛號窗口', 'zh-CN': '持转介信者请至挂号窗口', en: 'Present referral letter at reception' } as Record<Language, string>,
  flow2: { ja: '診察', 'zh-TW': '診察', 'zh-CN': '诊察', en: 'Consultation' } as Record<Language, string>,
  flow2d: { ja: '専門医による詳細な診察', 'zh-TW': '專科醫生詳細診察', 'zh-CN': '专科医生详细诊察', en: 'Detailed consultation with specialist' } as Record<Language, string>,
  flow3: { ja: '検査', 'zh-TW': '檢查', 'zh-CN': '检查', en: 'Examination' } as Record<Language, string>,
  flow3d: { ja: '最新機器による精密検査', 'zh-TW': '使用最新設備精密檢查', 'zh-CN': '使用最新设备精密检查', en: 'Precision testing with latest equipment' } as Record<Language, string>,
  flow4: { ja: '結果説明', 'zh-TW': '結果說明', 'zh-CN': '结果说明', en: 'Results' } as Record<Language, string>,
  flow4d: { ja: '検査結果の丁寧なご説明', 'zh-TW': '詳細說明檢查結果', 'zh-CN': '详细说明检查结果', en: 'Detailed explanation of test results' } as Record<Language, string>,
  flow5: { ja: '会計', 'zh-TW': '結帳', 'zh-CN': '结账', en: 'Payment' } as Record<Language, string>,
  flow5d: { ja: '自動精算機で迅速お支払い', 'zh-TW': '自助結算機快速付款', 'zh-CN': '自助结算机快速付款', en: 'Quick payment via automatic machines' } as Record<Language, string>,

  // Access
  accessTitle: { ja: 'アクセス', 'zh-TW': '交通方式', 'zh-CN': '交通方式', en: 'Access' } as Record<Language, string>,
  accessAddress: { ja: '〒663-8501 兵庫県西宮市武庫川町1-1', 'zh-TW': '〒663-8501 兵庫縣西宮市武庫川町1-1', 'zh-CN': '〒663-8501 兵库县西宫市武库川町1-1', en: '1-1 Mukogawa-cho, Nishinomiya, Hyogo 663-8501' } as Record<Language, string>,
  accessTrain: { ja: '阪神電鉄「武庫川駅」西出口より徒歩5分', 'zh-TW': '阪神電鐵「武庫川站」西出口步行5分鐘', 'zh-CN': '阪神电铁「武库川站」西出口步行5分钟', en: '5-min walk from Hanshin Railway Mukogawa Station (West Exit)' } as Record<Language, string>,
  hoursWeekday: { ja: '月〜金 8:30-11:00', 'zh-TW': '週一至週五 8:30-11:00', 'zh-CN': '周一至周五 8:30-11:00', en: 'Mon-Fri 8:30-11:00' } as Record<Language, string>,
  hoursClosed: { ja: '休診：土日祝日・年末年始', 'zh-TW': '休診：週六日及國定假日', 'zh-CN': '休诊：周六日及法定节假日', en: 'Closed: Weekends & holidays' } as Record<Language, string>,
  officialSite: { ja: '病院公式サイト（外部リンク）', 'zh-TW': '醫院官方網站（外部連結）', 'zh-CN': '医院官方网站（外部链接）', en: 'Official Website (External Link)' } as Record<Language, string>,

  // CTA
  ctaTitle: { ja: '兵庫医科大学病院での健診・治療をご検討の方へ', 'zh-TW': '考慮在兵庫醫科大學病院進行健檢・治療的您', 'zh-CN': '考虑在兵库医科大学病院进行健检・治疗的您', en: 'Considering Medical Care at Hyogo Medical University Hospital?' } as Record<Language, string>,
  ctaDesc: { ja: '中国語対応スタッフが丁寧にサポートいたします。お気軽にご相談ください。', 'zh-TW': '中文服務人員將為您提供周到的支援，歡迎隨時諮詢。', 'zh-CN': '中文服务人员将为您提供周到的支援，欢迎随时咨询。', en: 'Chinese-speaking staff will provide attentive support. Feel free to consult us.' } as Record<Language, string>,
};

// 认定资质
const CERTIFICATIONS = [
  { title: { ja: '特定機能病院', 'zh-TW': '特定功能醫院', 'zh-CN': '特定功能医院', en: 'Advanced Medical Institution' } as Record<Language, string>, desc: { ja: '国指定（全国87施設）', 'zh-TW': '國家指定（全日本87家）', 'zh-CN': '国家指定（全日本87家）', en: 'Nationally designated (87 in Japan)' } as Record<Language, string>, icon: Award, color: 'blue' },
  { title: { ja: 'がん診療連携拠点病院', 'zh-TW': '癌症診療聯合據點醫院', 'zh-CN': '癌症诊疗联合据点医院', en: 'Cancer Treatment Base Hospital' } as Record<Language, string>, desc: { ja: '総合的ながん診療体制', 'zh-TW': '綜合性癌症診療體系', 'zh-CN': '综合性癌症诊疗体系', en: 'Comprehensive cancer care' } as Record<Language, string>, icon: Shield, color: 'purple' },
  { title: { ja: '周産期母子医療センター', 'zh-TW': '周產期母子醫療中心', 'zh-CN': '周产期母子医疗中心', en: 'Perinatal Medical Center' } as Record<Language, string>, desc: { ja: '高リスク妊娠・新生児対応', 'zh-TW': '高風險妊娠・新生兒應對', 'zh-CN': '高风险妊娠・新生儿应对', en: 'High-risk pregnancy & neonatal' } as Record<Language, string>, icon: Baby, color: 'pink' },
  { title: { ja: '災害拠点病院', 'zh-TW': '災害據點醫院', 'zh-CN': '灾害据点医院', en: 'Disaster Base Hospital' } as Record<Language, string>, desc: { ja: '兵庫県指定', 'zh-TW': '兵庫縣指定', 'zh-CN': '兵库县指定', en: 'Hyogo Prefecture designated' } as Record<Language, string>, icon: Activity, color: 'orange' },
  { title: { ja: '認知症疾患医療センター', 'zh-TW': '認知症疾病醫療中心', 'zh-CN': '认知症疾病医疗中心', en: 'Dementia Medical Center' } as Record<Language, string>, desc: { ja: '兵庫県指定', 'zh-TW': '兵庫縣指定', 'zh-CN': '兵库县指定', en: 'Hyogo Prefecture designated' } as Record<Language, string>, icon: Brain, color: 'teal' },
  { title: { ja: '肝疾患診療連携拠点病院', 'zh-TW': '肝疾病診療聯合據點醫院', 'zh-CN': '肝疾病诊疗联合据点医院', en: 'Liver Disease Base Hospital' } as Record<Language, string>, desc: { ja: '専門的な肝臓治療', 'zh-TW': '專業肝臟治療', 'zh-CN': '专业肝脏治疗', en: 'Specialized liver treatment' } as Record<Language, string>, icon: Pill, color: 'green' },
];

const ICON_COLORS: Record<string, { bg: string; text: string; hoverBg: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', hoverBg: 'group-hover:bg-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', hoverBg: 'group-hover:bg-purple-600' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', hoverBg: 'group-hover:bg-pink-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', hoverBg: 'group-hover:bg-orange-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700', hoverBg: 'group-hover:bg-teal-600' },
  green: { bg: 'bg-green-100', text: 'text-green-700', hoverBg: 'group-hover:bg-green-600' },
};

// 诊疗科室
const DEPARTMENTS = {
  internal: [
    { ja: '循環器内科', 'zh-TW': '循環器內科', 'zh-CN': '循环器内科', en: 'Cardiovascular Medicine' },
    { ja: '呼吸器内科', 'zh-TW': '呼吸器內科', 'zh-CN': '呼吸器内科', en: 'Respiratory Medicine' },
    { ja: '脳神経内科', 'zh-TW': '腦神經內科', 'zh-CN': '脑神经内科', en: 'Neurology' },
    { ja: '腎・透析内科', 'zh-TW': '腎・透析內科', 'zh-CN': '肾・透析内科', en: 'Nephrology & Dialysis' },
    { ja: '血液内科', 'zh-TW': '血液內科', 'zh-CN': '血液内科', en: 'Hematology' },
    { ja: '糖尿病・内分泌・代謝内科', 'zh-TW': '糖尿病・內分泌・代謝內科', 'zh-CN': '糖尿病・内分泌・代谢内科', en: 'Diabetes & Endocrinology' },
    { ja: '肝・胆・膵内科', 'zh-TW': '肝・膽・胰內科', 'zh-CN': '肝・胆・胰内科', en: 'Hepatobiliary & Pancreatic' },
    { ja: '消化管内科', 'zh-TW': '消化道內科', 'zh-CN': '消化道内科', en: 'Gastroenterology' },
    { ja: 'アレルギー・リウマチ内科', 'zh-TW': '過敏・風濕內科', 'zh-CN': '过敏・风湿内科', en: 'Allergy & Rheumatology' },
    { ja: '総合内科', 'zh-TW': '綜合內科', 'zh-CN': '综合内科', en: 'General Internal Medicine' },
  ] as Record<Language, string>[],
  surgical: [
    { ja: '心臓血管外科', 'zh-TW': '心臟血管外科', 'zh-CN': '心脏血管外科', en: 'Cardiovascular Surgery' },
    { ja: '呼吸器外科', 'zh-TW': '呼吸器外科', 'zh-CN': '呼吸器外科', en: 'Thoracic Surgery' },
    { ja: '脳神経外科', 'zh-TW': '腦神經外科', 'zh-CN': '脑神经外科', en: 'Neurosurgery' },
    { ja: '肝・胆・膵外科', 'zh-TW': '肝・膽・胰外科', 'zh-CN': '肝・胆・胰外科', en: 'Hepatobiliary Surgery' },
    { ja: '上部消化管外科', 'zh-TW': '上消化道外科', 'zh-CN': '上消化道外科', en: 'Upper GI Surgery' },
    { ja: '下部消化管外科', 'zh-TW': '下消化道外科', 'zh-CN': '下消化道外科', en: 'Lower GI Surgery' },
    { ja: '乳腺・内分泌外科', 'zh-TW': '乳腺・內分泌外科', 'zh-CN': '乳腺・内分泌外科', en: 'Breast & Endocrine Surgery' },
    { ja: '泌尿器科', 'zh-TW': '泌尿科', 'zh-CN': '泌尿科', en: 'Urology' },
    { ja: '整形外科', 'zh-TW': '骨科', 'zh-CN': '骨科', en: 'Orthopedics' },
    { ja: '形成外科', 'zh-TW': '整形外科', 'zh-CN': '整形外科', en: 'Plastic Surgery' },
  ] as Record<Language, string>[],
  other: [
    { ja: '産科婦人科', 'zh-TW': '產科婦科', 'zh-CN': '产科妇科', en: 'OB/GYN' },
    { ja: '小児科', 'zh-TW': '小兒科', 'zh-CN': '小儿科', en: 'Pediatrics' },
    { ja: '眼科', 'zh-TW': '眼科', 'zh-CN': '眼科', en: 'Ophthalmology' },
    { ja: '耳鼻咽喉科・頭頸部外科', 'zh-TW': '耳鼻喉科・頭頸部外科', 'zh-CN': '耳鼻喉科・头颈部外科', en: 'ENT & Head/Neck' },
    { ja: '皮膚科', 'zh-TW': '皮膚科', 'zh-CN': '皮肤科', en: 'Dermatology' },
    { ja: '精神科神経科', 'zh-TW': '精神神經科', 'zh-CN': '精神神经科', en: 'Psychiatry' },
    { ja: '放射線科', 'zh-TW': '放射科', 'zh-CN': '放射科', en: 'Radiology' },
    { ja: '麻酔科', 'zh-TW': '麻醉科', 'zh-CN': '麻醉科', en: 'Anesthesiology' },
    { ja: '救急科', 'zh-TW': '急診科', 'zh-CN': '急诊科', en: 'Emergency' },
    { ja: 'リハビリテーション科', 'zh-TW': '復健科', 'zh-CN': '康复科', en: 'Rehabilitation' },
  ] as Record<Language, string>[],
};

interface HyogoMedicalContentProps {
  whitelabel?: WhitelabelModuleProps;
}

export default function HyogoMedicalContent({ whitelabel }: HyogoMedicalContentProps) {
  const lang = useLanguage();

  return (
    <div className="animate-fade-in-up min-h-screen bg-white">

      {/* ========================================
          1. Hero Section - 全屏背景图 (TIMC 风格)
          ======================================== */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden text-white bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          alt="Hyogo Medical University Hospital"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
        <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif mb-4 md:mb-6 leading-[1.2]">
              {t.heroTitle1[lang]}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{t.heroTitle2[lang]}</span>
            </h1>
            <h2 className="text-base sm:text-lg md:text-2xl text-gray-300 font-light mb-6 md:mb-8 font-serif">
              {t.heroSubtitle[lang]}
            </h2>
            <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base border-l-2 border-blue-500 pl-4 md:pl-6 max-w-2xl whitespace-pre-line">
              {t.heroText[lang]}
            </p>
            {/* 限量营销文案 */}
            <div className="mt-8 inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 px-5 py-3 rounded-full backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
              <span className="text-amber-200 text-sm font-medium">{t.limitBadge[lang]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-24">

        {/* ========================================
            2. Authority Section - 认证资质 (TIMC 风格)
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">{t.authTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.authTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {CERTIFICATIONS.slice(0, 3).map((cert, i) => {
              const Icon = cert.icon;
              const colors = ICON_COLORS[cert.color];
              return (
                <div key={i} className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                  <div className={`w-12 h-12 ${colors.bg} ${colors.text} rounded-full flex items-center justify-center mb-6 ${colors.hoverBg} group-hover:text-white transition`}>
                    <Icon size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{cert.title[lang]}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{cert.desc[lang]}</p>
                </div>
              );
            })}
          </div>
          {/* 第二行 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
            {CERTIFICATIONS.slice(3).map((cert, i) => {
              const Icon = cert.icon;
              const colors = ICON_COLORS[cert.color];
              return (
                <div key={i} className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                  <div className={`w-12 h-12 ${colors.bg} ${colors.text} rounded-full flex items-center justify-center mb-6 ${colors.hoverBg} group-hover:text-white transition`}>
                    <Icon size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{cert.title[lang]}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{cert.desc[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================
            3. Tech Section - 医疗设备 (TIMC 双列全屏图风格)
            ======================================== */}
        <div className="mb-0">
          <div className="text-center py-20 bg-white">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-3">{t.techTitle[lang]}</h3>
            <p className="text-gray-500 text-sm tracking-widest uppercase mb-6">Medical Equipment Lineup</p>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto px-4">{t.techSub[lang]}</p>
          </div>
        </div>
      </div>

      {/* 全宽设备图片区 */}
      {/* Row 1: Da Vinci + PET-CT */}
      <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1551190822-a9ce113ac100?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Da Vinci Xi" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.techDavinci[lang]}</h4>
            <p className="text-base text-white/80 leading-relaxed">{t.techDavinciDesc[lang]}</p>
          </div>
        </div>
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="PET-CT" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.techPet[lang]}</h4>
            <p className="text-base text-white/80 leading-relaxed">{t.techPetDesc[lang]}</p>
          </div>
        </div>
      </div>
      {/* Row 2: MRI + CT */}
      <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="MRI" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.techMri[lang]}</h4>
            <p className="text-base text-white/80 leading-relaxed">{t.techMriDesc[lang]}</p>
          </div>
        </div>
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1530497610245-b489b3085e3b?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="CT Scanner" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-4">{t.techCt[lang]}</h4>
            <p className="text-base text-white/80 leading-relaxed">{t.techCtDesc[lang]}</p>
          </div>
        </div>
      </div>

      {/* ========================================
          3.5. Facility Section - 设施展示 (TIMC 全屏交替风格)
          ======================================== */}
      <div className="mb-0">
        <div className="text-center py-20 bg-white">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-3">{t.facilityTitle[lang]}</h3>
          <p className="text-gray-500 text-sm tracking-widest uppercase mb-6">Facility & Departments</p>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto px-4">{t.facilitySubtitle[lang]}</p>
        </div>

        {/* Facility 1 - 急性医疗综合中心 (左对齐) */}
        <div className="relative min-h-[60vh] flex items-center overflow-hidden">
          <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="Acute Medical Center" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
          <div className="relative container mx-auto px-6 py-16">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-12 bg-amber-400" />
                <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">01</span>
              </div>
              <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.facility1Title[lang]}</h4>
              <p className="text-lg text-white/80 leading-relaxed">{t.facility1Desc[lang]}</p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">963 Beds</span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">ICU / IVR</span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">24h Emergency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Facility 2 - 新病院大楼 (右对齐) */}
        <div className="relative min-h-[60vh] flex items-center overflow-hidden">
          <img src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="New Hospital Building" />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-900/90 via-slate-900/70 to-transparent" />
          <div className="relative container mx-auto px-6 py-16">
            <div className="max-w-xl ml-auto text-right">
              <div className="flex items-center justify-end gap-3 mb-4">
                <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">02</span>
                <div className="h-[1px] w-12 bg-amber-400" />
              </div>
              <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.facility2Title[lang]}</h4>
              <p className="text-lg text-white/80 leading-relaxed">{t.facility2Desc[lang]}</p>
              <div className="mt-6 flex justify-end gap-3 flex-wrap">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">15 Floors</span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">801 Beds</span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Smart Hospital</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-24">

        {/* ========================================
            4. Flow Experience - 就诊流程 (TIMC 深色圆角风格)
            ======================================== */}
        <div className="mb-24 bg-gray-900 text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
          <div className="relative z-10 text-center mb-12">
            <h3 className="text-3xl font-serif">{t.flowTitle[lang]}</h3>
            <p className="text-gray-400 mt-2 text-sm">Outpatient Visit Flow</p>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            {[
              { id: '01', icon: <Building size={24} />, title: t.flow1[lang], desc: t.flow1d[lang] },
              { id: '02', icon: <Stethoscope size={24} />, title: t.flow2[lang], desc: t.flow2d[lang] },
              { id: '03', icon: <Microscope size={24} />, title: t.flow3[lang], desc: t.flow3d[lang] },
              { id: '04', icon: <FileText size={24} />, title: t.flow4[lang], desc: t.flow4d[lang] },
              { id: '05', icon: <CheckCircle size={24} />, title: t.flow5[lang], desc: t.flow5d[lang] },
            ].map((step, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition group">
                <div className="text-blue-400 font-mono text-xl mb-4 opacity-50">{step.id}</div>
                <div className="flex justify-center mb-4 text-white opacity-80 group-hover:scale-110 transition">{step.icon}</div>
                <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================
            5. Departments Section - 诊疗科室
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">41 Clinical Departments</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.deptTitle[lang]}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 内科 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                  <Heart size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">{t.deptInternal[lang]}</h4>
              </div>
              <div className="space-y-2">
                {DEPARTMENTS.internal.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    {dept[lang]}
                  </div>
                ))}
              </div>
            </div>

            {/* 外科 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center">
                  <Syringe size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">{t.deptSurgical[lang]}</h4>
              </div>
              <div className="space-y-2">
                {DEPARTMENTS.surgical.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-purple-500 shrink-0 mt-0.5" />
                    {dept[lang]}
                  </div>
                ))}
              </div>
            </div>

            {/* 其他 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center">
                  <Stethoscope size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">{t.deptOther[lang]}</h4>
              </div>
              <div className="space-y-2">
                {DEPARTMENTS.other.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-gray-500 shrink-0 mt-0.5" />
                    {dept[lang]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            6. Access & Info Section
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">Hospital Information</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.accessTitle[lang]}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 左：地图 */}
            <div className="bg-gray-100 rounded-2xl h-80 md:h-[450px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.9!2d135.3802!3d34.7238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000f1a0d3e6f8e1%3A0x3b6b3b3b3b3b3b3b!2z5YW15bqr5Yy756eR5aSn5a2m55eF6Zmi!5e0!3m2!1sja!2sjp!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
            </div>

            {/* 右：信息卡 */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0"><MapPin size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{lang === 'ja' ? '所在地' : lang === 'en' ? 'Address' : '地址'}</h4>
                    <p className="text-sm text-gray-500">{t.accessAddress[lang]}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0"><Train size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{lang === 'ja' ? '電車でお越しの方' : lang === 'en' ? 'By Train' : '电车交通'}</h4>
                    <p className="text-sm text-gray-500">{t.accessTrain[lang]}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shrink-0"><Clock size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{lang === 'ja' ? '外来受付時間' : lang === 'en' ? 'Outpatient Hours' : '门诊时间'}</h4>
                    <p className="text-sm text-gray-500">{t.hoursWeekday[lang]}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.hoursClosed[lang]}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0"><Phone size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{lang === 'ja' ? '代表電話' : lang === 'en' ? 'Phone' : '电话'}</h4>
                    <p className="text-sm text-gray-500">0798-45-6111</p>
                  </div>
                </div>
              </div>

              <a
                href="https://www.hosp.hyo-med.ac.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition text-center"
              >
                <ExternalLink size={16} />
                {t.officialSite[lang]}
              </a>
            </div>
          </div>
        </div>

        {/* ========================================
            7. CTA Section
            ======================================== */}
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-serif text-gray-900 mb-4">{t.ctaTitle[lang]}</h3>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">{t.ctaDesc[lang]}</p>
        </div>
      </div>

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
