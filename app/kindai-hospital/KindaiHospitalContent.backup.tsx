'use client';

import { useState } from 'react';
import {
  Building2,
  Stethoscope,
  Heart,
  Brain,
  Activity,
  Users,
  MapPin,
  Train,
  Bus,
  Car,
  Calendar,
  Shield,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type Lang = 'ja' | 'zh-CN' | 'zh-TW' | 'en';

interface KindaiHospitalContentProps {
  isGuideEmbed?: boolean;
  lang?: Lang;
}

export default function KindaiHospitalContent({
  isGuideEmbed = false,
  lang = 'ja',
}: KindaiHospitalContentProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  // ========== 翻译内容 ==========
  const t = {
    // Hero Section
    heroTitle: {
      ja: '近畿大学病院',
      'zh-CN': '近畿大学医院',
      'zh-TW': '近畿大學醫院',
      en: 'Kindai University Hospital',
    },
    heroSubtitle: {
      ja: '南大阪唯一の大学病院 ｜ 高度先端医療を提供',
      'zh-CN': '南大阪唯一的大学附属医院 | 提供先进医疗服务',
      'zh-TW': '南大阪唯一的大學附屬醫院 | 提供先進醫療服務',
      en: 'Southern Osaka\'s Only University Hospital | Advanced Medical Care',
    },
    heroBtn: {
      ja: '医療相談を申し込む',
      'zh-CN': '申请医疗咨询',
      'zh-TW': '申請醫療諮詢',
      en: 'Request Medical Consultation',
    },

    // 医院简介
    aboutTitle: {
      ja: '近畿大学病院について',
      'zh-CN': '关于近畿大学医院',
      'zh-TW': '關於近畿大學醫院',
      en: 'About Kindai University Hospital',
    },
    aboutDesc1: {
      ja: '近畿大学病院は1975年に創立された近畿大学医学部附属の総合大学病院です。大阪府堺市に位置し、800床を有し、35の標榜診療科を擁する南大阪地域唯一の大学病院として、地域医療の中核を担っています。',
      'zh-CN': '近畿大学医院成立于1975年，是近畿大学医学部附属的综合性大学附属医院。医院位于大阪府堺市，拥有800张病床和35个诊疗科室，作为南大阪地区唯一的大学附属医院，承担着区域医疗的核心职能。',
      'zh-TW': '近畿大學醫院成立於1975年，是近畿大學醫學部附屬的綜合性大學附屬醫院。醫院位於大阪府堺市，擁有800張病床和35個診療科室，作為南大阪地區唯一的大學附屬醫院，承擔著區域醫療的核心職能。',
      en: 'Established in 1975, Kindai University Hospital is a comprehensive university hospital affiliated with Kindai University School of Medicine. Located in Sakai City, Osaka Prefecture, with 800 beds and 35 clinical departments, it serves as the only university hospital in southern Osaka and plays a central role in regional healthcare.',
    },
    aboutDesc2: {
      ja: '臨床・教育・研究の三大機能を兼ね備え、がんセンター、心臓血管センター、脳卒中センターなど14の専門医療センターを設置しています。最先端の医療機器を配備し、多学科診療（MDT）を通じて患者様一人ひとりに最適な医療を提供しています。',
      'zh-CN': '医院集临床、教学、科研于一体，设有癌症中心、心脏血管中心、脑卒中中心等14个专门医疗中心。配备先进的医疗设备，通过多学科诊疗（MDT）为每位患者提供最优化的医疗服务。',
      'zh-TW': '醫院集臨床、教學、科研於一體，設有癌症中心、心臟血管中心、腦卒中中心等14個專門醫療中心。配備先進的醫療設備，通過多學科診療（MDT）為每位患者提供最優化的醫療服務。',
      en: 'Integrating clinical care, education, and research, the hospital houses 14 specialized medical centers including Cancer Center, Cardiovascular Center, and Stroke Center. Equipped with cutting-edge medical technology, we provide optimal care for each patient through a multidisciplinary team (MDT) approach.',
    },

    // 核心优势
    advantagesTitle: {
      ja: '近畿大学病院の強み',
      'zh-CN': '近畿大学医院的优势',
      'zh-TW': '近畿大學醫院的優勢',
      en: 'Our Strengths',
    },
    adv1Title: {
      ja: '大学病院の総合力',
      'zh-CN': '大学医院的综合实力',
      'zh-TW': '大學醫院的綜合實力',
      en: 'Comprehensive University Hospital Capability',
    },
    adv1Desc: {
      ja: '南大阪地域唯一の大学病院として、臨床・教育・研究の三大機能を兼ね備えています。最新の医学知見を臨床に反映し、質の高い医療を提供しています。',
      'zh-CN': '作为南大阪地区唯一的大学附属医院，集临床、教学、科研于一体。将最新的医学研究成果应用于临床，提供高质量的医疗服务。',
      'zh-TW': '作為南大阪地區唯一的大學附屬醫院，集臨床、教學、科研於一體。將最新的醫學研究成果應用於臨床，提供高質量的醫療服務。',
      en: 'As the only university hospital in southern Osaka, we integrate clinical care, education, and research. We translate the latest medical knowledge into clinical practice, delivering high-quality healthcare.',
    },
    adv2Title: {
      ja: '14の専門医療センター',
      'zh-CN': '14个专门医疗中心',
      'zh-TW': '14個專門醫療中心',
      en: '14 Specialized Medical Centers',
    },
    adv2Desc: {
      ja: 'がんセンター、心臓血管センター、脳卒中センター、救命救急センターなど14の専門センターを設置。各分野のエキスパートが連携して高度医療を提供しています。',
      'zh-CN': '设有癌症中心、心脏血管中心、脑卒中中心、急救中心等14个专门中心。各领域专家通力合作，提供高水平的医疗服务。',
      'zh-TW': '設有癌症中心、心臟血管中心、腦卒中中心、急救中心等14個專門中心。各領域專家通力合作，提供高水平的醫療服務。',
      en: 'We operate 14 specialized centers including Cancer Center, Cardiovascular Center, Stroke Center, and Emergency Medical Center. Experts from each field collaborate to provide advanced medical care.',
    },
    adv3Title: {
      ja: '最先端医療機器',
      'zh-CN': '先进医疗设备',
      'zh-TW': '先進醫療設備',
      en: 'Cutting-Edge Medical Equipment',
    },
    adv3Desc: {
      ja: '頭部・乳房専用PET装置（BresTome®）をはじめとする最先端医療機器を配備。早期診断から高度治療まで、質の高い医療を実現しています。',
      'zh-CN': '配备头部·乳房专用PET装置（BresTome®）等先进医疗设备。从早期诊断到高级治疗，实现高质量的医疗服务。',
      'zh-TW': '配備頭部·乳房專用PET裝置（BresTome®）等先進醫療設備。從早期診斷到高級治療，實現高質量的醫療服務。',
      en: 'Equipped with cutting-edge medical equipment including dedicated head and breast PET scanner (BresTome®). We achieve high-quality medical care from early diagnosis to advanced treatment.',
    },
    adv4Title: {
      ja: '多学科診療（MDT）',
      'zh-CN': '多学科诊疗（MDT）',
      'zh-TW': '多學科診療（MDT）',
      en: 'Multidisciplinary Team (MDT) Approach',
    },
    adv4Desc: {
      ja: 'がん治療などの複雑な症例に対して、複数の診療科の専門医がキャンサーボードで協議し、患者様一人ひとりに最適な治療計画を立案しています。',
      'zh-CN': '针对癌症治疗等复杂病例，多个科室的专家通过癌症委员会协作讨论，为每位患者制定最优化的治疗方案。',
      'zh-TW': '針對癌症治療等複雜病例，多個科室的專家通過癌症委員會協作討論，為每位患者制定最優化的治療方案。',
      en: 'For complex cases such as cancer treatment, specialists from multiple departments collaborate through cancer board meetings to develop optimal treatment plans for each patient.',
    },

    // 癌症中心
    cancerCenterTitle: {
      ja: 'がんセンター',
      'zh-CN': '癌症中心',
      'zh-TW': '癌症中心',
      en: 'Cancer Center',
    },
    cancerCenterDesc: {
      ja: '近畿大学病院がんセンターは、手術、化学療法、放射線治療、緩和ケアまで総合的ながん診療を提供しています。がん相談支援センターを設置し、患者様とご家族への支援プログラムも充実しています。',
      'zh-CN': '近畿大学医院癌症中心提供从手术、化疗、放疗到缓和护理的综合性癌症诊疗服务。设有癌症咨询支援中心，为患者及家属提供全面的支持项目。',
      'zh-TW': '近畿大學醫院癌症中心提供從手術、化療、放療到緩和護理的綜合性癌症診療服務。設有癌症諮詢支援中心，為患者及家屬提供全面的支持項目。',
      en: 'Kindai University Hospital Cancer Center provides comprehensive cancer care including surgery, chemotherapy, radiotherapy, and palliative care. We have established a Cancer Consultation Support Center with extensive support programs for patients and families.',
    },
    cancerFeature1: {
      ja: '多学科によるキャンサーボード',
      'zh-CN': '多学科癌症委员会',
      'zh-TW': '多學科癌症委員會',
      en: 'Multidisciplinary Cancer Board',
    },
    cancerFeature2: {
      ja: '最新の化学療法と放射線治療',
      'zh-CN': '最新化疗和放疗',
      'zh-TW': '最新化療和放療',
      en: 'Advanced Chemotherapy and Radiotherapy',
    },
    cancerFeature3: {
      ja: 'がん相談支援センター',
      'zh-CN': '癌症咨询支援中心',
      'zh-TW': '癌症諮詢支援中心',
      en: 'Cancer Consultation Support Center',
    },
    cancerFeature4: {
      ja: '小児・AYA世代患者支援',
      'zh-CN': '儿童及青年患者支持',
      'zh-TW': '兒童及青年患者支持',
      en: 'Pediatric and AYA Patient Support',
    },
    cancerFeature5: {
      ja: '生殖機能温存治療',
      'zh-CN': '生殖功能保存治疗',
      'zh-TW': '生殖功能保存治療',
      en: 'Fertility Preservation Treatment',
    },
    cancerFeature6: {
      ja: '緩和ケアと在宅医療連携',
      'zh-CN': '缓和护理与居家医疗',
      'zh-TW': '緩和護理與居家醫療',
      en: 'Palliative Care and Home Medical Collaboration',
    },

    // PET-CT 中心
    petCenterTitle: {
      ja: 'PET分子イメージング部',
      'zh-CN': 'PET分子影像中心',
      'zh-TW': 'PET分子影像中心',
      en: 'PET Molecular Imaging Center',
    },
    petCenterDesc: {
      ja: '頭部・乳房専用PET装置（BresTome®）を配備し、早期がんの発見から治療計画の立案まで、高精度な画像診断を提供しています。認知症の診断にも活用されています。',
      'zh-CN': '配备头部·乳房专用PET装置（BresTome®），从早期癌症发现到治疗方案制定，提供高精度的影像诊断。也用于认知症的诊断。',
      'zh-TW': '配備頭部·乳房專用PET裝置（BresTome®），從早期癌症發現到治療方案制定，提供高精度的影像診斷。也用於認知症的診斷。',
      en: 'Equipped with dedicated head and breast PET scanner (BresTome®), we provide high-precision imaging diagnosis from early cancer detection to treatment planning. Also utilized for dementia diagnosis.',
    },

    // 主要诊疗科室
    departmentsTitle: {
      ja: '主な診療科',
      'zh-CN': '主要诊疗科室',
      'zh-TW': '主要診療科室',
      en: 'Major Clinical Departments',
    },
    deptInternal: {
      ja: '内科系',
      'zh-CN': '内科系',
      'zh-TW': '內科系',
      en: 'Internal Medicine',
    },
    deptSurgical: {
      ja: '外科系',
      'zh-CN': '外科系',
      'zh-TW': '外科系',
      en: 'Surgical Departments',
    },
    deptSpecialty: {
      ja: '専門診療科',
      'zh-CN': '专科',
      'zh-TW': '專科',
      en: 'Specialty Departments',
    },
    deptCenters: {
      ja: '専門医療センター',
      'zh-CN': '专门医疗中心',
      'zh-TW': '專門醫療中心',
      en: 'Specialized Medical Centers',
    },

    // 交通访问
    accessTitle: {
      ja: '交通アクセス',
      'zh-CN': '交通访问',
      'zh-TW': '交通訪問',
      en: 'Access',
    },
    addressLabel: {
      ja: '住所',
      'zh-CN': '地址',
      'zh-TW': '地址',
      en: 'Address',
    },
    address: {
      ja: '〒590-0197 大阪府堺市南区三原台1丁14番1号',
      'zh-CN': '〒590-0197 大阪府堺市南区三原台1丁14番1号',
      'zh-TW': '〒590-0197 大阪府堺市南區三原台1丁14番1號',
      en: '1-14-1 Miharadai, Minami-ku, Sakai-shi, Osaka 590-0197',
    },
    trainLabel: {
      ja: '電車でのアクセス',
      'zh-CN': '电车路线',
      'zh-TW': '電車路線',
      en: 'By Train',
    },
    trainRoute: {
      ja: '南海泉北線「泉ケ丘駅」より徒歩約6分（550m）',
      'zh-CN': '南海泉北线「泉ケ丘站」步行约6分钟（550米）',
      'zh-TW': '南海泉北線「泉ケ丘站」步行約6分鐘（550米）',
      en: 'About 6 minutes walk (550m) from Izumigaoka Station on Nankai Senboku Line',
    },
    busLabel: {
      ja: 'バスでのアクセス',
      'zh-CN': '巴士路线',
      'zh-TW': '巴士路線',
      en: 'By Bus',
    },
    busRoute: {
      ja: '270系統「近大おおさかメディカルキャンパス前」行',
      'zh-CN': '270路「近大大阪医疗校区前」',
      'zh-TW': '270路「近大大阪醫療校區前」',
      en: 'Route 270 to "Kindai Osaka Medical Campus-mae"',
    },
    carLabel: {
      ja: 'お車でのアクセス',
      'zh-CN': '自驾路线',
      'zh-TW': '自駕路線',
      en: 'By Car',
    },
    carRoute: {
      ja: '堺IC出口より一般道路約4km / 専用駐車場完備',
      'zh-CN': '从堺IC出口经普通道路约4公里 / 配有专用停车场',
      'zh-TW': '從堺IC出口經普通道路約4公里 / 配有專用停車場',
      en: 'About 4km from Sakai IC exit / Dedicated parking available',
    },

    // FAQ
    faqTitle: {
      ja: 'よくある質問',
      'zh-CN': '常见问题',
      'zh-TW': '常見問題',
      en: 'FAQ',
    },
    faq1Q: {
      ja: '初診の予約は必要ですか？',
      'zh-CN': '初诊需要预约吗？',
      'zh-TW': '初診需要預約嗎？',
      en: 'Do I need an appointment for the first visit?',
    },
    faq1A: {
      ja: '当院は原則として地域の医療機関からの紹介状をお持ちの方を優先して診療しております。紹介状がない場合は、選定療養費が別途必要となります。',
      'zh-CN': '本院原则上优先诊治持有地区医疗机构介绍信的患者。如无介绍信，需另外支付选定医疗费。',
      'zh-TW': '本院原則上優先診治持有地區醫療機構介紹信的患者。如無介紹信，需另外支付選定醫療費。',
      en: 'In principle, we prioritize patients with referral letters from local medical institutions. Without a referral, additional selective medical fees apply.',
    },
    faq2Q: {
      ja: '海外からの患者も受け入れていますか？',
      'zh-CN': '接收海外患者吗？',
      'zh-TW': '接收海外患者嗎？',
      en: 'Do you accept international patients?',
    },
    faq2A: {
      ja: 'はい、海外からの患者様も受け入れております。医療渡航サービスを通じてお申し込みいただくと、通訳サポートや医療コーディネートなどのサービスを受けられます。',
      'zh-CN': '是的，我们接收海外患者。通过医疗旅行服务申请，可获得翻译支持和医疗协调等服务。',
      'zh-TW': '是的，我們接收海外患者。通過醫療旅行服務申請，可獲得翻譯支持和醫療協調等服務。',
      en: 'Yes, we accept international patients. By applying through medical travel services, you can receive interpreter support and medical coordination services.',
    },
    faq3Q: {
      ja: 'がん治療のセカンドオピニオンは受けられますか？',
      'zh-CN': '可以提供癌症治疗的第二意见吗？',
      'zh-TW': '可以提供癌症治療的第二意見嗎？',
      en: 'Do you provide second opinions for cancer treatment?',
    },
    faq3A: {
      ja: 'はい、セカンドオピニオン外来を設置しております。現在の治療に関する医療情報をご持参いただければ、当院の専門医がご意見を提供いたします。',
      'zh-CN': '是的，我们设有第二意见门诊。请携带当前治疗的医疗信息，我院专家将提供意见。',
      'zh-TW': '是的，我們設有第二意見門診。請攜帶當前治療的醫療資訊，我院專家將提供意見。',
      en: 'Yes, we have a second opinion outpatient service. Please bring your current medical information, and our specialists will provide their opinion.',
    },
    faq4Q: {
      ja: 'PET-CT検査は当日受けられますか？',
      'zh-CN': 'PET-CT检查可以当天进行吗？',
      'zh-TW': 'PET-CT檢查可以當天進行嗎？',
      en: 'Can I get a PET-CT scan on the same day?',
    },
    faq4A: {
      ja: 'PET-CT検査は予約制となっております。検査前の準備や禁食が必要なため、事前にご予約いただく必要があります。',
      'zh-CN': 'PET-CT检查需要预约。由于检查前需要准备和禁食，需要提前预约。',
      'zh-TW': 'PET-CT檢查需要預約。由於檢查前需要準備和禁食，需要提前預約。',
      en: 'PET-CT scans require prior reservation. As pre-examination preparation and fasting are necessary, advance booking is required.',
    },

    // CTA
    ctaTitle: {
      ja: '医療相談・予約のお申し込み',
      'zh-CN': '医疗咨询·预约申请',
      'zh-TW': '醫療諮詢·預約申請',
      en: 'Medical Consultation & Booking',
    },
    ctaDesc: {
      ja: '近畿大学病院での診療をご希望の方は、専門医療コーディネーターがサポートいたします。',
      'zh-CN': '希望在近畿大学医院就诊的患者，我们的专业医疗协调员将为您提供支持。',
      'zh-TW': '希望在近畿大學醫院就診的患者，我們的專業醫療協調員將為您提供支持。',
      en: 'For those wishing to receive treatment at Kindai University Hospital, our professional medical coordinators will support you.',
    },
    ctaBtn: {
      ja: '今すぐ相談する',
      'zh-CN': '立即咨询',
      'zh-TW': '立即諮詢',
      en: 'Consult Now',
    },
  };

  // 诊疗科室数据
  const departments = {
    internal: [
      { ja: '循環器内科', 'zh-CN': '心血管内科', 'zh-TW': '心血管內科', en: 'Cardiology' },
      { ja: '消化器内科', 'zh-CN': '消化内科', 'zh-TW': '消化內科', en: 'Gastroenterology' },
      { ja: '血液・膠原病内科', 'zh-CN': '血液·风湿免疫科', 'zh-TW': '血液·風濕免疫科', en: 'Hematology & Rheumatology' },
      { ja: '腎臓内科', 'zh-CN': '肾内科', 'zh-TW': '腎內科', en: 'Nephrology' },
      { ja: '脳神経内科', 'zh-CN': '神经内科', 'zh-TW': '神經內科', en: 'Neurology' },
      { ja: '腫瘍内科', 'zh-CN': '肿瘤内科', 'zh-TW': '腫瘤內科', en: 'Medical Oncology' },
      { ja: '呼吸器・アレルギー内科', 'zh-CN': '呼吸内科·过敏科', 'zh-TW': '呼吸內科·過敏科', en: 'Pulmonology & Allergy' },
      { ja: '内分泌・代謝・糖尿病内科', 'zh-CN': '内分泌·代谢·糖尿病科', 'zh-TW': '內分泌·代謝·糖尿病科', en: 'Endocrinology & Diabetes' },
    ],
    surgical: [
      { ja: '外科', 'zh-CN': '外科', 'zh-TW': '外科', en: 'Surgery' },
      { ja: '脳神経外科', 'zh-CN': '脑神经外科', 'zh-TW': '腦神經外科', en: 'Neurosurgery' },
      { ja: '心臓血管外科', 'zh-CN': '心脏血管外科', 'zh-TW': '心臟血管外科', en: 'Cardiovascular Surgery' },
      { ja: '整形外科', 'zh-CN': '骨科', 'zh-TW': '骨科', en: 'Orthopedics' },
      { ja: '泌尿器科', 'zh-CN': '泌尿外科', 'zh-TW': '泌尿外科', en: 'Urology' },
      { ja: '形成外科', 'zh-CN': '整形外科', 'zh-TW': '整形外科', en: 'Plastic Surgery' },
    ],
    specialty: [
      { ja: '皮膚科', 'zh-CN': '皮肤科', 'zh-TW': '皮膚科', en: 'Dermatology' },
      { ja: '眼科', 'zh-CN': '眼科', 'zh-TW': '眼科', en: 'Ophthalmology' },
      { ja: '耳鼻咽喉・頭頸部外科', 'zh-CN': '耳鼻喉·头颈外科', 'zh-TW': '耳鼻喉·頭頸外科', en: 'Otolaryngology' },
      { ja: '産婦人科', 'zh-CN': '妇产科', 'zh-TW': '婦產科', en: 'Obstetrics & Gynecology' },
      { ja: '小児科・思春期科', 'zh-CN': '儿科·青春期科', 'zh-TW': '兒科·青春期科', en: 'Pediatrics' },
      { ja: '歯科口腔外科', 'zh-CN': '口腔颌面外科', 'zh-TW': '口腔顎面外科', en: 'Oral Surgery' },
    ],
    centers: [
      { ja: 'がんセンター', 'zh-CN': '癌症中心', 'zh-TW': '癌症中心', en: 'Cancer Center' },
      { ja: '心臓血管センター', 'zh-CN': '心脏血管中心', 'zh-TW': '心臟血管中心', en: 'Cardiovascular Center' },
      { ja: '脳卒中センター', 'zh-CN': '脑卒中中心', 'zh-TW': '腦卒中中心', en: 'Stroke Center' },
      { ja: '救命救急センター', 'zh-CN': '急救中心', 'zh-TW': '急救中心', en: 'Emergency Medical Center' },
      { ja: '地域周産期母子医療センター', 'zh-CN': '区域围产期母子医疗中心', 'zh-TW': '區域圍產期母子醫療中心', en: 'Perinatal Medical Center' },
      { ja: '難治てんかんセンター', 'zh-CN': '难治性癫痫中心', 'zh-TW': '難治性癲癇中心', en: 'Refractory Epilepsy Center' },
      { ja: 'リウマチセンター', 'zh-CN': '风湿病中心', 'zh-TW': '風濕病中心', en: 'Rheumatology Center' },
      { ja: '糖尿病センター', 'zh-CN': '糖尿病中心', 'zh-TW': '糖尿病中心', en: 'Diabetes Center' },
    ],
  };

  const faqs = [
    { q: t.faq1Q[lang], a: t.faq1A[lang] },
    { q: t.faq2Q[lang], a: t.faq2A[lang] },
    { q: t.faq3Q[lang], a: t.faq3A[lang] },
    { q: t.faq4Q[lang], a: t.faq4A[lang] },
  ];

  const scrollToConsultation = () => {
    const element = document.getElementById('consultation-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <div
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <div className="mb-6">
              <Building2 size={64} className="mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              {t.heroTitle[lang]}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              {t.heroSubtitle[lang]}
            </p>
            {isGuideEmbed && (
              <button
                onClick={scrollToConsultation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                {t.heroBtn[lang]}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 医院简介 */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            {t.aboutTitle[lang]}
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
            <p>{t.aboutDesc1[lang]}</p>
            <p>{t.aboutDesc2[lang]}</p>
          </div>

          {/* 基本数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">800</div>
              <div className="text-sm text-gray-600">
                {lang === 'ja' && '病床数'}
                {lang === 'zh-CN' && '病床数'}
                {lang === 'zh-TW' && '病床數'}
                {lang === 'en' && 'Beds'}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">35</div>
              <div className="text-sm text-gray-600">
                {lang === 'ja' && '診療科'}
                {lang === 'zh-CN' && '诊疗科室'}
                {lang === 'zh-TW' && '診療科室'}
                {lang === 'en' && 'Departments'}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">14</div>
              <div className="text-sm text-gray-600">
                {lang === 'ja' && '専門センター'}
                {lang === 'zh-CN' && '专门中心'}
                {lang === 'zh-TW' && '專門中心'}
                {lang === 'en' && 'Centers'}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">1975</div>
              <div className="text-sm text-gray-600">
                {lang === 'ja' && '創立年'}
                {lang === 'zh-CN' && '成立年份'}
                {lang === 'zh-TW' && '成立年份'}
                {lang === 'en' && 'Established'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 核心优势 */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            {t.advantagesTitle[lang]}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* 优势1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Award size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t.adv1Title[lang]}
              </h3>
              <p className="text-gray-600 leading-relaxed">{t.adv1Desc[lang]}</p>
            </div>

            {/* 优势2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Building2 size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t.adv2Title[lang]}
              </h3>
              <p className="text-gray-600 leading-relaxed">{t.adv2Desc[lang]}</p>
            </div>

            {/* 优势3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Activity size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t.adv3Title[lang]}
              </h3>
              <p className="text-gray-600 leading-relaxed">{t.adv3Desc[lang]}</p>
            </div>

            {/* 优势4 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t.adv4Title[lang]}
              </h3>
              <p className="text-gray-600 leading-relaxed">{t.adv4Desc[lang]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 癌症中心 */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <Heart size={40} className="text-red-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {t.cancerCenterTitle[lang]}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg mb-8">
            {t.cancerCenterDesc[lang]}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              t.cancerFeature1,
              t.cancerFeature2,
              t.cancerFeature3,
              t.cancerFeature4,
              t.cancerFeature5,
              t.cancerFeature6,
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-3">
                  <Shield size={24} className="text-red-600 mt-1 shrink-0" />
                  <p className="text-gray-700 font-medium">{feature[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PET-CT 中心 */}
      <div className="bg-gradient-to-b from-white to-purple-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <Activity size={40} className="text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {t.petCenterTitle[lang]}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              {t.petCenterDesc[lang]}
            </p>
          </div>
        </div>
      </div>

      {/* 主要诊疗科室 */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
          {t.departmentsTitle[lang]}
        </h2>

        <div className="space-y-6">
          {/* 内科系 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() =>
                setExpandedDept(expandedDept === 'internal' ? null : 'internal')
              }
              className="w-full flex items-center justify-between p-6 hover:bg-blue-50 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <Stethoscope size={28} className="text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  {t.deptInternal[lang]}
                </h3>
              </div>
              {expandedDept === 'internal' ? (
                <ChevronUp size={24} className="text-gray-500" />
              ) : (
                <ChevronDown size={24} className="text-gray-500" />
              )}
            </button>
            {expandedDept === 'internal' && (
              <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
                {departments.internal.map((dept, index) => (
                  <div
                    key={index}
                    className="p-4 bg-blue-50 rounded-lg text-gray-700"
                  >
                    {dept[lang]}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 外科系 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() =>
                setExpandedDept(expandedDept === 'surgical' ? null : 'surgical')
              }
              className="w-full flex items-center justify-between p-6 hover:bg-green-50 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <Activity size={28} className="text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  {t.deptSurgical[lang]}
                </h3>
              </div>
              {expandedDept === 'surgical' ? (
                <ChevronUp size={24} className="text-gray-500" />
              ) : (
                <ChevronDown size={24} className="text-gray-500" />
              )}
            </button>
            {expandedDept === 'surgical' && (
              <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
                {departments.surgical.map((dept, index) => (
                  <div
                    key={index}
                    className="p-4 bg-green-50 rounded-lg text-gray-700"
                  >
                    {dept[lang]}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 专科 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() =>
                setExpandedDept(expandedDept === 'specialty' ? null : 'specialty')
              }
              className="w-full flex items-center justify-between p-6 hover:bg-purple-50 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <Heart size={28} className="text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  {t.deptSpecialty[lang]}
                </h3>
              </div>
              {expandedDept === 'specialty' ? (
                <ChevronUp size={24} className="text-gray-500" />
              ) : (
                <ChevronDown size={24} className="text-gray-500" />
              )}
            </button>
            {expandedDept === 'specialty' && (
              <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
                {departments.specialty.map((dept, index) => (
                  <div
                    key={index}
                    className="p-4 bg-purple-50 rounded-lg text-gray-700"
                  >
                    {dept[lang]}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 专门医疗中心 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() =>
                setExpandedDept(expandedDept === 'centers' ? null : 'centers')
              }
              className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <Building2 size={28} className="text-red-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  {t.deptCenters[lang]}
                </h3>
              </div>
              {expandedDept === 'centers' ? (
                <ChevronUp size={24} className="text-gray-500" />
              ) : (
                <ChevronDown size={24} className="text-gray-500" />
              )}
            </button>
            {expandedDept === 'centers' && (
              <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
                {departments.centers.map((dept, index) => (
                  <div
                    key={index}
                    className="p-4 bg-red-50 rounded-lg text-gray-700"
                  >
                    {dept[lang]}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 交通访问 */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            {t.accessTitle[lang]}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 地址 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <MapPin size={28} className="text-blue-600 mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t.addressLabel[lang]}
                  </h3>
                  <p className="text-gray-600">{t.address[lang]}</p>
                </div>
              </div>
            </div>

            {/* 电车 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Train size={28} className="text-green-600 mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t.trainLabel[lang]}
                  </h3>
                  <p className="text-gray-600">{t.trainRoute[lang]}</p>
                </div>
              </div>
            </div>

            {/* 巴士 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Bus size={28} className="text-orange-600 mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t.busLabel[lang]}
                  </h3>
                  <p className="text-gray-600">{t.busRoute[lang]}</p>
                </div>
              </div>
            </div>

            {/* 自驾 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Car size={28} className="text-purple-600 mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t.carLabel[lang]}
                  </h3>
                  <p className="text-gray-600">{t.carRoute[lang]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
          {t.faqTitle[lang]}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-6 hover:bg-blue-50 transition-colors duration-300 text-left"
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-4">
                  {faq.q}
                </h3>
                {expandedFaq === index ? (
                  <ChevronUp size={24} className="text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown size={24} className="text-gray-500 shrink-0" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {isGuideEmbed && (
        <div id="consultation-form" className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t.ctaTitle[lang]}
            </h2>
            <p className="text-xl text-blue-100 mb-8">{t.ctaDesc[lang]}</p>
            <button
              onClick={scrollToConsultation}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              {t.ctaBtn[lang]}
            </button>
          </div>
        </div>
      )}

      {/* 悬浮咨询按钮（白标唯一联系入口） */}
      {isGuideEmbed && (
        <button
          onClick={scrollToConsultation}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 font-semibold flex items-center gap-2"
        >
          <Calendar size={24} />
          <span>
            {lang === 'ja' && '相談する'}
            {lang === 'zh-CN' && '点我咨询'}
            {lang === 'zh-TW' && '點我諮詢'}
            {lang === 'en' && 'Contact'}
          </span>
        </button>
      )}
    </div>
  );
}
