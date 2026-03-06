'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  Microscope,
  Zap,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
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
  const [activeEquipmentTab, setActiveEquipmentTab] = useState<'mri' | 'ct' | 'angio' | 'ri'>('mri');

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
      'zh-CN': '南大阪唯一的大学附属医院 | 提供高水平先进医疗',
      'zh-TW': '南大阪唯一的大學附屬醫院 | 提供高水平先進醫療',
      en: 'Southern Osaka\'s Only University Hospital | Advanced Medical Excellence',
    },
    heroBtn: {
      ja: '医療相談を申し込む',
      'zh-CN': '申请医疗咨询',
      'zh-TW': '申請醫療諮詢',
      en: 'Request Consultation',
    },

    // 统计数据
    statsLabel1: { ja: '病床数', 'zh-CN': '病床数', 'zh-TW': '病床數', en: 'Beds' },
    statsLabel2: { ja: '診療科', 'zh-CN': '诊疗科室', 'zh-TW': '診療科室', en: 'Departments' },
    statsLabel3: { ja: '専門センター', 'zh-CN': '专门中心', 'zh-TW': '專門中心', en: 'Centers' },
    statsLabel4: { ja: '創立年', 'zh-CN': '成立年份', 'zh-TW': '成立年份', en: 'Established' },
    statsLabel5: { ja: '年間退院患者', 'zh-CN': '年度出院患者', 'zh-TW': '年度出院患者', en: 'Annual Discharges' },
    statsLabel6: { ja: '年間手術件数', 'zh-CN': '年度手术数', 'zh-TW': '年度手術數', en: 'Annual Surgeries' },

    // 医院简介
    aboutTitle: {
      ja: '近畿大学病院について',
      'zh-CN': '关于近畿大学医院',
      'zh-TW': '關於近畿大學醫院',
      en: 'About Kindai University Hospital',
    },
    aboutDesc1: {
      ja: '近畿大学病院は1975年に創立された近畿大学医学部附属の総合大学病院です。大阪府堺市に位置し、800床を有し、35の標榜診療科を擁する南大阪地域唯一の大学病院として、地域医療の中核を担っています。',
      'zh-CN': '近畿大学医院成立于1975年，是近畿大学医学部附属的综合性大学医院。医院位于大阪府堺市，拥有800张病床和35个诊疗科室，作为南大阪地区唯一的大学附属医院，承担着区域医疗的核心职能。',
      'zh-TW': '近畿大學醫院成立於1975年，是近畿大學醫學部附屬的綜合性大學醫院。醫院位於大阪府堺市，擁有800張病床和35個診療科室，作為南大阪地區唯一的大學附屬醫院，承擔著區域醫療的核心職能。',
      en: 'Established in 1975, Kindai University Hospital is a comprehensive university hospital affiliated with Kindai University School of Medicine. Located in Sakai City, Osaka, with 800 beds and 35 clinical departments, it serves as the cornerstone of regional healthcare as the only university hospital in southern Osaka.',
    },
    aboutDesc2: {
      ja: '年間23,000人以上の退院患者、3,000件以上の手術を実施。臨床・教育・研究の三大機能を兼ね備え、がんセンター、心臓血管センター、脳卒中センターなど14の専門医療センターを設置し、最先端の医療機器を配備して患者様一人ひとりに最適な医療を提供しています。',
      'zh-CN': '年度出院患者超过23,000人，实施手术超过3,000例。医院集临床、教学、科研于一体，设有癌症中心、心脏血管中心、脑卒中中心等14个专门医疗中心，配备先进医疗设备，为每位患者提供最优化的医疗服务。',
      'zh-TW': '年度出院患者超過23,000人，實施手術超過3,000例。醫院集臨床、教學、科研於一體，設有癌症中心、心臟血管中心、腦卒中中心等14個專門醫療中心，配備先進醫療設備，為每位患者提供最優化的醫療服務。',
      en: 'With over 23,000 annual patient discharges and 3,000+ surgeries performed, the hospital integrates clinical care, education, and research. We operate 14 specialized medical centers including Cancer, Cardiovascular, and Stroke Centers, equipped with cutting-edge technology to deliver optimal care for each patient.',
    },

    // 新医院迁建
    newHospitalTitle: {
      ja: '2025年11月 新病院開院予定',
      'zh-CN': '2025年11月 新医院预计开业',
      'zh-TW': '2025年11月 新醫院預計開業',
      en: 'New Hospital Opening November 2025',
    },
    newHospitalConcept: {
      ja: 'コンセプト：「ひとつながりのひろば」',
      'zh-CN': '概念："互联互通的广场"',
      'zh-TW': '概念："互聯互通的廣場"',
      en: 'Concept: "A Connected Plaza"',
    },
    newHospitalDesc: {
      ja: '堺市泉ヶ丘に移転し、地域と共進化する最先端医療施設として生まれ変わります。緑地、人文、都市が一体となった持続可能な医療キャンパスを実現します。',
      'zh-CN': '医院将迁至堺市泉ヶ丘，作为与地区共同发展的先进医疗设施重生。实现绿地、人文、城市一体化的可持续医疗园区。',
      'zh-TW': '醫院將遷至堺市泉ヶ丘，作為與地區共同發展的先進醫療設施重生。實現綠地、人文、城市一體化的可持續醫療園區。',
      en: 'Relocating to Izumigaoka, Sakai City, to be reborn as a cutting-edge medical facility co-evolving with the community. Creating a sustainable medical campus integrating greenery, humanity, and urban development.',
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
      en: 'Comprehensive Academic Excellence',
    },
    adv1Desc: {
      ja: '南大阪地域唯一の大学病院として、臨床・教育・研究の三大機能を兼ね備え、最新の医学知見を臨床に反映しています。',
      'zh-CN': '作为南大阪地区唯一的大学附属医院，集临床、教学、科研于一体，将最新医学研究成果应用于临床。',
      'zh-TW': '作為南大阪地區唯一的大學附屬醫院，集臨床、教學、科研於一體，將最新醫學研究成果應用於臨床。',
      en: 'As the only university hospital in southern Osaka, we integrate clinical practice, education, and research, applying the latest medical knowledge to patient care.',
    },
    adv2Title: {
      ja: '14の専門医療センター',
      'zh-CN': '14个专门医疗中心',
      'zh-TW': '14個專門醫療中心',
      en: '14 Specialized Medical Centers',
    },
    adv2Desc: {
      ja: 'がんセンター、心臓血管センター、脳卒中センター、救命救急センターなど14の専門センターが連携し、高度医療を提供しています。',
      'zh-CN': '癌症中心、心脏血管中心、脑卒中中心、急救中心等14个专门中心协同合作，提供高水平医疗服务。',
      'zh-TW': '癌症中心、心臟血管中心、腦卒中中心、急救中心等14個專門中心協同合作，提供高水平醫療服務。',
      en: 'Our 14 specialized centers including Cancer, Cardiovascular, Stroke, and Emergency Medical Centers collaborate to deliver advanced medical care.',
    },
    adv3Title: {
      ja: '最先端医療機器16台',
      'zh-CN': '16台先进医疗设备',
      'zh-TW': '16台先進醫療設備',
      en: '16 Advanced Medical Equipment',
    },
    adv3Desc: {
      ja: 'MRI4台、CT4台、血管撮影装置6台、RI装置2台など最先端医療機器を配備し、精密診断から高度治療まで対応しています。',
      'zh-CN': '配备4台MRI、4台CT、6台血管造影设备、2台RI装置等先进医疗设备，从精密诊断到高级治疗全面覆盖。',
      'zh-TW': '配備4台MRI、4台CT、6台血管造影設備、2台RI裝置等先進醫療設備，從精密診斷到高級治療全面覆蓋。',
      en: 'Equipped with 16 advanced devices including 4 MRI, 4 CT, 6 angiography systems, and 2 RI units, supporting precision diagnosis to advanced treatment.',
    },
    adv4Title: {
      ja: '年間実績23,000件超',
      'zh-CN': '年度实绩超23,000例',
      'zh-TW': '年度實績超23,000例',
      en: '23,000+ Annual Cases',
    },
    adv4Desc: {
      ja: '年間23,451人の退院患者、眼科3,000件・消化器内科561件など豊富な診療実績。5大がん（胃・大腸・乳・肺・肝）の治療経験も多数。',
      'zh-CN': '年度出院患者23,451人，眼科3,000例、消化内科561例等丰富诊疗实绩。五大癌症（胃、大肠、乳腺、肺、肝）治疗经验丰富。',
      'zh-TW': '年度出院患者23,451人，眼科3,000例、消化內科561例等豐富診療實績。五大癌症（胃、大腸、乳腺、肺、肝）治療經驗豐富。',
      en: '23,451 annual patient discharges with extensive experience: 3,000 ophthalmology, 561 gastroenterology procedures. Rich experience treating five major cancers.',
    },

    // 医疗设备
    equipmentTitle: {
      ja: '最先端医療機器',
      'zh-CN': '先进医疗设备',
      'zh-TW': '先進醫療設備',
      en: 'Advanced Medical Equipment',
    },
    equipmentMRI: { ja: 'MRI装置（4台）', 'zh-CN': 'MRI装置（4台）', 'zh-TW': 'MRI裝置（4台）', en: 'MRI Systems (4)' },
    equipmentCT: { ja: 'CT装置（4台）', 'zh-CN': 'CT装置（4台）', 'zh-TW': 'CT裝置（4台）', en: 'CT Systems (4)' },
    equipmentAngio: { ja: '血管撮影装置（6台）', 'zh-CN': '血管造影设备（6台）', 'zh-TW': '血管造影設備（6台）', en: 'Angiography (6)' },
    equipmentRI: { ja: 'RI装置（2台）', 'zh-CN': 'RI装置（2台）', 'zh-TW': 'RI裝置（2台）', en: 'RI Systems (2)' },

    // 癌症中心
    cancerCenterTitle: {
      ja: 'がんセンター',
      'zh-CN': '癌症中心',
      'zh-TW': '癌症中心',
      en: 'Cancer Center',
    },
    cancerCenterDesc: {
      ja: '手術、化学療法、放射線治療、緩和ケアまで総合的ながん診療を提供。がん相談支援センターを設置し、患者様とご家族への支援プログラムも充実しています。',
      'zh-CN': '提供从手术、化疗、放疗到缓和护理的综合性癌症诊疗服务。设有癌症咨询支援中心，为患者及家属提供全面的支持项目。',
      'zh-TW': '提供從手術、化療、放療到緩和護理的綜合性癌症診療服務。設有癌症諮詢支援中心，為患者及家屬提供全面的支持項目。',
      en: 'Comprehensive cancer care from surgery, chemotherapy, radiotherapy to palliative care. Cancer Consultation Support Center provides extensive programs for patients and families.',
    },
    cancerDataTitle: {
      ja: '5大がん治療実績（年間）',
      'zh-CN': '五大癌症治疗实绩（年度）',
      'zh-TW': '五大癌症治療實績（年度）',
      en: 'Five Major Cancers (Annual)',
    },

    // 脑卒中中心
    strokeCenterTitle: {
      ja: '脳卒中センター',
      'zh-CN': '脑卒中中心',
      'zh-TW': '腦卒中中心',
      en: 'Stroke Center',
    },
    strokeCenterDesc: {
      ja: '24時間体制の「脳卒中コール」により専門医が直通で対応。rt-PA血栓溶解療法および血栓回収術を実施し、迅速な救命治療を提供しています。',
      'zh-CN': '24小时"脑卒中呼叫"体制，专科医生直接应对。实施rt-PA血栓溶解疗法和血栓回收术，提供快速救命治疗。',
      'zh-TW': '24小時"腦卒中呼叫"體制，專科醫生直接應對。實施rt-PA血栓溶解療法和血栓回收術，提供快速救命治療。',
      en: '24-hour "Stroke Call" system with direct specialist response. Performing rt-PA thrombolysis and thrombectomy for rapid life-saving treatment.',
    },
    strokeData1: {
      ja: '年間脳梗塞患者：293件',
      'zh-CN': '年度脑梗塞患者：293例',
      'zh-TW': '年度腦梗塞患者：293例',
      en: 'Annual Stroke Patients: 293',
    },
    strokeData2: {
      ja: '平均在院日数：16.84日',
      'zh-CN': '平均住院天数：16.84天',
      'zh-TW': '平均住院天數：16.84天',
      en: 'Average Hospital Stay: 16.84 days',
    },

    // 心脏血管中心
    cardioCenterTitle: {
      ja: '心臓血管センター',
      'zh-CN': '心脏血管中心',
      'zh-TW': '心臟血管中心',
      en: 'Cardiovascular Center',
    },
    cardioCenterDesc: {
      ja: 'CCU（冠疾患集中治療室）を備え、緊急冠動脈インターベンションに対応。ほとんどの症例でDoor to Balloon Time 90分以内を達成しています。',
      'zh-CN': '配备CCU（冠心病重症监护室），应对紧急冠状动脉介入治疗。大多数病例实现Door to Balloon Time 90分钟以内。',
      'zh-TW': '配備CCU（冠心病重症監護室），應對緊急冠狀動脈介入治療。大多數病例實現Door to Balloon Time 90分鐘以內。',
      en: 'Equipped with CCU (Coronary Care Unit) for emergency coronary intervention. Achieving Door-to-Balloon time under 90 minutes in most cases.',
    },
    cardioData1: {
      ja: 'Door to Balloon < 90分',
      'zh-CN': 'Door to Balloon < 90分钟',
      'zh-TW': 'Door to Balloon < 90分鐘',
      en: 'Door-to-Balloon < 90 min',
    },
    cardioData2: {
      ja: '24時間ハートコール対応',
      'zh-CN': '24小时心脏呼叫应对',
      'zh-TW': '24小時心臟呼叫應對',
      en: '24/7 Heart Call Response',
    },

    // 治疗实绩
    achievementsTitle: {
      ja: '診療実績',
      'zh-CN': '诊疗实绩',
      'zh-TW': '診療實績',
      en: 'Clinical Achievements',
    },

    // 楼层导览
    floorGuideTitle: {
      ja: 'フロアガイド',
      'zh-CN': '楼层导览',
      'zh-TW': '樓層導覽',
      en: 'Floor Guide',
    },

    // 主要诊疗科室
    departmentsTitle: {
      ja: '主な診療科',
      'zh-CN': '主要诊疗科室',
      'zh-TW': '主要診療科室',
      en: 'Major Departments',
    },
    deptInternal: { ja: '内科系', 'zh-CN': '内科系', 'zh-TW': '內科系', en: 'Internal Medicine' },
    deptSurgical: { ja: '外科系', 'zh-CN': '外科系', 'zh-TW': '外科系', en: 'Surgical' },
    deptSpecialty: { ja: '専門診療科', 'zh-CN': '专科', 'zh-TW': '專科', en: 'Specialty' },
    deptCenters: { ja: '専門医療センター', 'zh-CN': '专门医疗中心', 'zh-TW': '專門醫療中心', en: 'Medical Centers' },

    // 交通访问
    accessTitle: { ja: '交通アクセス', 'zh-CN': '交通访问', 'zh-TW': '交通訪問', en: 'Access' },
    addressLabel: { ja: '住所', 'zh-CN': '地址', 'zh-TW': '地址', en: 'Address' },
    address: {
      ja: '〒590-0197 大阪府堺市南区三原台1丁14番1号',
      'zh-CN': '〒590-0197 大阪府堺市南区三原台1丁14番1号',
      'zh-TW': '〒590-0197 大阪府堺市南區三原台1丁14番1號',
      en: '1-14-1 Miharadai, Minami-ku, Sakai, Osaka 590-0197',
    },
    trainLabel: { ja: '電車', 'zh-CN': '电车', 'zh-TW': '電車', en: 'By Train' },
    trainRoute: {
      ja: '南海泉北線「泉ケ丘駅」より徒歩約6分',
      'zh-CN': '南海泉北线「泉ケ丘站」步行约6分钟',
      'zh-TW': '南海泉北線「泉ケ丘站」步行約6分鐘',
      en: '6 min walk from Izumigaoka Station',
    },
    busLabel: { ja: 'バス', 'zh-CN': '巴士', 'zh-TW': '巴士', en: 'By Bus' },
    busRoute: {
      ja: '270系統「近大おおさかメディカルキャンパス前」行',
      'zh-CN': '270路「近大大阪医疗校区前」',
      'zh-TW': '270路「近大大阪醫療校區前」',
      en: 'Route 270 to Medical Campus',
    },
    carLabel: { ja: 'お車', 'zh-CN': '自驾', 'zh-TW': '自駕', en: 'By Car' },
    carRoute: {
      ja: '堺IC出口より約4km',
      'zh-CN': '堺IC出口约4公里',
      'zh-TW': '堺IC出口約4公里',
      en: 'About 4km from Sakai IC',
    },

    // FAQ
    faqTitle: { ja: 'よくある質問', 'zh-CN': '常见问题', 'zh-TW': '常見問題', en: 'FAQ' },
    faq1Q: {
      ja: '初診の予約は必要ですか？',
      'zh-CN': '初诊需要预约吗？',
      'zh-TW': '初診需要預約嗎？',
      en: 'Do I need an appointment?',
    },
    faq1A: {
      ja: '原則として地域の医療機関からの紹介状をお持ちの方を優先しております。',
      'zh-CN': '原则上优先诊治持有地区医疗机构介绍信的患者。',
      'zh-TW': '原則上優先診治持有地區醫療機構介紹信的患者。',
      en: 'We prioritize patients with referral letters.',
    },
    faq2Q: {
      ja: '海外からの患者も受け入れていますか？',
      'zh-CN': '接收海外患者吗？',
      'zh-TW': '接收海外患者嗎？',
      en: 'Do you accept international patients?',
    },
    faq2A: {
      ja: 'はい、医療渡航サービスを通じて通訳サポートなどを提供しています。',
      'zh-CN': '是的，通过医疗旅行服务提供翻译支持等服务。',
      'zh-TW': '是的，通過醫療旅行服務提供翻譯支持等服務。',
      en: 'Yes, we provide interpreter support through medical travel services.',
    },
    faq3Q: {
      ja: 'がん治療のセカンドオピニオンは受けられますか？',
      'zh-CN': '可以提供癌症治疗的第二意见吗？',
      'zh-TW': '可以提供癌症治療的第二意見嗎？',
      en: 'Do you provide second opinions?',
    },
    faq3A: {
      ja: 'はい、セカンドオピニオン外来を設置しております。',
      'zh-CN': '是的，我们设有第二意见门诊。',
      'zh-TW': '是的，我們設有第二意見門診。',
      en: 'Yes, we have a second opinion service.',
    },
    faq4Q: {
      ja: '新病院の開院はいつですか？',
      'zh-CN': '新医院何时开业？',
      'zh-TW': '新醫院何時開業？',
      en: 'When will the new hospital open?',
    },
    faq4A: {
      ja: '2025年11月に堺市泉ヶ丘に移転・開院予定です。',
      'zh-CN': '预计2025年11月迁至堺市泉ヶ丘开业。',
      'zh-TW': '預計2025年11月遷至堺市泉ヶ丘開業。',
      en: 'Scheduled to relocate and open in Izumigaoka, November 2025.',
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
      en: 'Our professional medical coordinators will support your treatment at Kindai University Hospital.',
    },
    ctaBtn: {
      ja: '今すぐ相談する',
      'zh-CN': '立即咨询',
      'zh-TW': '立即諮詢',
      en: 'Consult Now',
    },
  };

  // 医疗设备数据
  const equipmentData = {
    mri: [
      {
        name: 'Achieva 3T',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_mr01.jpg',
        specs: {
          ja: '3テスラ高磁場MRI、脳梗塞・脳動脈瘤・心臓機能評価に対応',
          'zh-CN': '3特斯拉高磁场MRI，应对脑梗塞、脑动脉瘤、心脏功能评估',
          'zh-TW': '3特斯拉高磁場MRI，應對腦梗塞、腦動脈瘤、心臟功能評估',
          en: '3 Tesla high-field MRI for stroke, aneurysm, cardiac function',
        },
      },
      {
        name: 'SIGNA HDxt 1.5T',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_mr02.jpg',
        specs: {
          ja: '1.5テスラMRI、X線被ばくなし複数画像撮像',
          'zh-CN': '1.5特斯拉MRI，无X射线辐射多重成像',
          'zh-TW': '1.5特斯拉MRI，無X射線輻射多重成像',
          en: '1.5 Tesla MRI with zero X-ray exposure, multiple imaging',
        },
      },
      {
        name: 'Achieva dStream 1.5T',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_mr03.jpg',
        specs: {
          ja: 'デジタルストリームMRI、金属確認セキュリティ完備',
          'zh-CN': '数字流MRI，配备金属确认安全系统',
          'zh-TW': '數位流MRI，配備金屬確認安全系統',
          en: 'Digital stream MRI with metal detection security',
        },
      },
      {
        name: 'Ingenia Prodiva 1.5T',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_mr04.jpg',
        specs: {
          ja: '救急用MRI、迅速な診断対応',
          'zh-CN': '急救用MRI，快速诊断应对',
          'zh-TW': '急救用MRI，快速診斷應對',
          en: 'Emergency MRI for rapid diagnosis',
        },
      },
    ],
    ct: [
      {
        name: 'Aquilion PRIME',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_ct01.jpg',
        specs: {
          ja: 'AI画像処理搭載、被曝低減技術',
          'zh-CN': '配备AI图像处理，低辐射技术',
          'zh-TW': '配備AI圖像處理，低輻射技術',
          en: 'AI image processing with radiation reduction',
        },
      },
      {
        name: 'Revolution CT',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_ct02.jpg',
        specs: {
          ja: '逐次近似再構成法搭載',
          'zh-CN': '配备迭代重建技术',
          'zh-TW': '配備迭代重建技術',
          en: 'Iterative reconstruction technology',
        },
      },
      {
        name: 'Aquilion One',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_ct03.jpg',
        specs: {
          ja: '被曝管理システム完備',
          'zh-CN': '配备辐射管理系统',
          'zh-TW': '配備輻射管理系統',
          en: 'Comprehensive radiation management',
        },
      },
      {
        name: 'Optima',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_ct04.jpg',
        specs: {
          ja: '救急CT、迅速診断対応',
          'zh-CN': '急救CT，快速诊断应对',
          'zh-TW': '急救CT，快速診斷應對',
          en: 'Emergency CT for rapid diagnosis',
        },
      },
    ],
    angio: [
      {
        name: 'Azurion7 B1212',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_bv01.jpg',
        specs: {
          ja: 'バルーン・ステント治療対応、低侵襲',
          'zh-CN': '应对球囊·支架治疗，低侵入性',
          'zh-TW': '應對球囊·支架治療，低侵入性',
          en: 'Balloon/stent treatment, minimally invasive',
        },
      },
      {
        name: 'Infinix Celeve-I',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_bv02.jpg',
        specs: {
          ja: '放射線被曝管理機能',
          'zh-CN': '辐射暴露管理功能',
          'zh-TW': '輻射暴露管理功能',
          en: 'Radiation exposure management',
        },
      },
      {
        name: 'BRANSIST safire',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_bv03.jpg',
        specs: {
          ja: '動脈瘤コイル治療対応',
          'zh-CN': '应对动脉瘤线圈治疗',
          'zh-TW': '應對動脈瘤線圈治療',
          en: 'Aneurysm coiling treatment',
        },
      },
      {
        name: 'Innova 4100IQ',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_bv04.jpg',
        specs: {
          ja: '連続撮影機能搭載',
          'zh-CN': '配备连续摄影功能',
          'zh-TW': '配備連續攝影功能',
          en: 'Continuous imaging capability',
        },
      },
      {
        name: 'INNOVA IGS630',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_bv05.jpg',
        specs: {
          ja: '救急血管撮影、迅速治療',
          'zh-CN': '急救血管造影，快速治疗',
          'zh-TW': '急救血管造影，快速治療',
          en: 'Emergency angiography, rapid treatment',
        },
      },
      {
        name: 'Artis zeego',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_bv06.jpg',
        specs: {
          ja: 'ハイブリッド手術室、術中リアルタイム画像化',
          'zh-CN': '混合手术室，术中实时成像',
          'zh-TW': '混合手術室，術中即時成像',
          en: 'Hybrid OR with intraoperative real-time imaging',
        },
      },
    ],
    ri: [
      {
        name: 'Symbia',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_ri01.jpg',
        specs: {
          ja: 'SPECT/CT融合、臓器代謝評価',
          'zh-CN': 'SPECT/CT融合，器官代谢评估',
          'zh-TW': 'SPECT/CT融合，器官代謝評估',
          en: 'SPECT/CT fusion for organ metabolism',
        },
      },
      {
        name: 'Bright View',
        image: 'https://www.med.kindai.ac.jp/img/about/pic_equipment_medical_devices_ri02.jpg',
        specs: {
          ja: '前立腺がん・神経内分泌腫瘍治療対応',
          'zh-CN': '应对前列腺癌·神经内分泌肿瘤治疗',
          'zh-TW': '應對前列腺癌·神經內分泌腫瘤治療',
          en: 'Prostate cancer, neuroendocrine tumor treatment',
        },
      },
    ],
  };

  // 5大癌症数据
  const cancerData = [
    { name: { ja: '肺がん', 'zh-CN': '肺癌', 'zh-TW': '肺癌', en: 'Lung Cancer' }, cases: 625 },
    { name: { ja: '大腸がん', 'zh-CN': '大肠癌', 'zh-TW': '大腸癌', en: 'Colorectal' }, cases: 305 },
    { name: { ja: '乳がん', 'zh-CN': '乳腺癌', 'zh-TW': '乳腺癌', en: 'Breast Cancer' }, cases: 239 },
    { name: { ja: '胃がん', 'zh-CN': '胃癌', 'zh-TW': '胃癌', en: 'Gastric Cancer' }, cases: 217 },
    { name: { ja: '肝がん', 'zh-CN': '肝癌', 'zh-TW': '肝癌', en: 'Liver Cancer' }, cases: 360 },
  ];

  // 诊疗科室数据
  const departments = {
    internal: [
      { ja: '循環器内科', 'zh-CN': '心血管内科', 'zh-TW': '心血管內科', en: 'Cardiology' },
      { ja: '消化器内科', 'zh-CN': '消化内科', 'zh-TW': '消化內科', en: 'Gastroenterology' },
      { ja: '血液・膠原病内科', 'zh-CN': '血液·风湿免疫科', 'zh-TW': '血液·風濕免疫科', en: 'Hematology & Rheumatology' },
      { ja: '腎臓内科', 'zh-CN': '肾内科', 'zh-TW': '腎內科', en: 'Nephrology' },
      { ja: '脳神経内科', 'zh-CN': '神经内科', 'zh-TW': '神經內科', en: 'Neurology' },
      { ja: '腫瘍内科', 'zh-CN': '肿瘤内科', 'zh-TW': '腫瘤內科', en: 'Medical Oncology' },
      { ja: '呼吸器・アレルギー内科', 'zh-CN': '呼吸·过敏科', 'zh-TW': '呼吸·過敏科', en: 'Pulmonology & Allergy' },
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
      { ja: '産婦人科', 'zh-CN': '妇产科', 'zh-TW': '婦產科', en: 'OB/GYN' },
      { ja: '小児科・思春期科', 'zh-CN': '儿科·青春期科', 'zh-TW': '兒科·青春期科', en: 'Pediatrics' },
      { ja: '歯科口腔外科', 'zh-CN': '口腔颌面外科', 'zh-TW': '口腔顎面外科', en: 'Oral Surgery' },
    ],
    centers: [
      { ja: 'がんセンター', 'zh-CN': '癌症中心', 'zh-TW': '癌症中心', en: 'Cancer Center' },
      { ja: '心臓血管センター', 'zh-CN': '心脏血管中心', 'zh-TW': '心臟血管中心', en: 'Cardiovascular Center' },
      { ja: '脳卒中センター', 'zh-CN': '脑卒中中心', 'zh-TW': '腦卒中中心', en: 'Stroke Center' },
      { ja: '救命救急センター', 'zh-CN': '急救中心', 'zh-TW': '急救中心', en: 'Emergency Center' },
      { ja: '地域周産期母子医療センター', 'zh-CN': '区域围产期母子医疗中心', 'zh-TW': '區域圍產期母子醫療中心', en: 'Perinatal Center' },
      { ja: '難治てんかんセンター', 'zh-CN': '难治性癫痫中心', 'zh-TW': '難治性癲癇中心', en: 'Epilepsy Center' },
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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Hero Section - 使用新医院效果图 */}
      <div
        className="relative h-[700px] bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 50, 100, 0.7), rgba(0, 30, 60, 0.6)), url(https://www.med.kindai.ac.jp/img/about/relocation/mv.webp)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-5xl">
            {/* Logo */}
            <div className="mb-6">
              <Image
                src="https://www.med.kindai.ac.jp/img/common/logo_med_kindai_white.svg"
                alt="Kindai University Hospital"
                width={300}
                height={80}
                className="mx-auto opacity-95"
              />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
              {t.heroTitle[lang]}
            </h1>
            <p className="text-2xl md:text-3xl mb-10 font-light tracking-wide">
              {t.heroSubtitle[lang]}
            </p>
            {isGuideEmbed && (
              <button
                onClick={scrollToConsultation}
                className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-5 rounded-xl text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                {t.heroBtn[lang]}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 统计数据卡片 */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl font-bold text-blue-600 mb-2">800</div>
            <div className="text-sm text-gray-600 font-medium">{t.statsLabel1[lang]}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl font-bold text-blue-600 mb-2">35</div>
            <div className="text-sm text-gray-600 font-medium">{t.statsLabel2[lang]}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl font-bold text-blue-600 mb-2">14</div>
            <div className="text-sm text-gray-600 font-medium">{t.statsLabel3[lang]}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl font-bold text-blue-600 mb-2">1975</div>
            <div className="text-sm text-gray-600 font-medium">{t.statsLabel4[lang]}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">23K+</div>
            <div className="text-sm text-gray-600 font-medium">{t.statsLabel5[lang]}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">3K+</div>
            <div className="text-sm text-gray-600 font-medium">{t.statsLabel6[lang]}</div>
          </div>
        </div>
      </div>

      {/* 医院简介 */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
            {t.aboutTitle[lang]}
          </h2>
          <div className="space-y-8 text-gray-700 leading-relaxed text-lg">
            <p className="text-xl">{t.aboutDesc1[lang]}</p>
            <p className="text-xl">{t.aboutDesc2[lang]}</p>
          </div>
        </div>
      </div>

      {/* 新医院迁建项目 - 4张效果图 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.newHospitalTitle[lang]}
            </h2>
            <p className="text-2xl text-blue-100 mb-4">{t.newHospitalConcept[lang]}</p>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              {t.newHospitalDesc[lang]}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
              <Image
                src="https://www.med.kindai.ac.jp/img/about/relocation/img_concept01.jpg"
                alt="New Hospital Concept 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
              <Image
                src="https://www.med.kindai.ac.jp/img/about/relocation/img_concept02.jpg"
                alt="New Hospital Concept 2"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
              <Image
                src="https://www.med.kindai.ac.jp/img/about/relocation/img_concept03.jpg"
                alt="New Hospital Concept 3"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
              <Image
                src="https://www.med.kindai.ac.jp/img/about/relocation/mv.webp"
                alt="New Hospital Main View"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 核心优势 - 4个卡片 */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-14 text-center">
          {t.advantagesTitle[lang]}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Award size={40} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.adv1Title[lang]}</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{t.adv1Desc[lang]}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Building2 size={40} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.adv2Title[lang]}</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{t.adv2Desc[lang]}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Microscope size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.adv3Title[lang]}</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{t.adv3Desc[lang]}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <TrendingUp size={40} className="text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.adv4Title[lang]}</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{t.adv4Desc[lang]}</p>
          </div>
        </div>
      </div>

      {/* 医疗设备展示 - 16台设备带图片 */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center">
            {t.equipmentTitle[lang]}
          </h2>
          <p className="text-center text-gray-600 text-xl mb-12">
            {lang === 'ja' && 'MRI 4台、CT 4台、血管撮影装置 6台、RI装置 2台を配備'}
            {lang === 'zh-CN' && '配备4台MRI、4台CT、6台血管造影设备、2台RI装置'}
            {lang === 'zh-TW' && '配備4台MRI、4台CT、6台血管造影設備、2台RI裝置'}
            {lang === 'en' && 'Equipped with 4 MRI, 4 CT, 6 Angiography, and 2 RI Systems'}
          </p>

          {/* 设备分类标签 */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {(['mri', 'ct', 'angio', 'ri'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveEquipmentTab(type)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  activeEquipmentTab === type
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
                }`}
              >
                {type === 'mri' && t.equipmentMRI[lang]}
                {type === 'ct' && t.equipmentCT[lang]}
                {type === 'angio' && t.equipmentAngio[lang]}
                {type === 'ri' && t.equipmentRI[lang]}
              </button>
            ))}
          </div>

          {/* 设备图片网格 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentData[activeEquipmentTab].map((equipment, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64">
                  <Image
                    src={equipment.image}
                    alt={equipment.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{equipment.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{equipment.specs[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 癌症中心 */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-red-50 via-pink-50 to-white rounded-3xl shadow-2xl p-10 md:p-14">
          <div className="flex items-center gap-4 mb-8">
            <Heart size={48} className="text-red-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              {t.cancerCenterTitle[lang]}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-xl mb-10">{t.cancerCenterDesc[lang]}</p>

          {/* 5大癌症治疗数据 */}
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t.cancerDataTitle[lang]}
          </h3>
          <div className="grid md:grid-cols-5 gap-6 mb-10">
            {cancerData.map((cancer, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl font-bold text-red-600 mb-2">{cancer.cases}</div>
                <div className="text-gray-700 font-medium">{cancer.name[lang]}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {lang === 'ja' && '件/年'}
                  {lang === 'zh-CN' && '例/年'}
                  {lang === 'zh-TW' && '例/年'}
                  {lang === 'en' && 'cases/year'}
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { ja: '多学科キャンサーボード', 'zh-CN': '多学科癌症委员会', 'zh-TW': '多學科癌症委員會', en: 'Multidisciplinary Cancer Board' },
              { ja: '最新化学療法', 'zh-CN': '最新化疗', 'zh-TW': '最新化療', en: 'Advanced Chemotherapy' },
              { ja: 'がん相談支援', 'zh-CN': '癌症咨询支援', 'zh-TW': '癌症諮詢支援', en: 'Cancer Consultation' },
              { ja: 'AYA世代支援', 'zh-CN': '青年患者支持', 'zh-TW': '青年患者支持', en: 'AYA Patient Support' },
              { ja: '生殖機能温存', 'zh-CN': '生殖功能保存', 'zh-TW': '生殖功能保存', en: 'Fertility Preservation' },
              { ja: '在宅緩和ケア', 'zh-CN': '居家缓和护理', 'zh-TW': '居家緩和護理', en: 'Home Palliative Care' },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={24} className="text-red-600 mt-1 shrink-0" />
                  <p className="text-gray-700 font-medium text-lg">{feature[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 脑卒中中心 */}
      <div className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-14">
            <div className="flex items-center gap-4 mb-8">
              <Brain size={48} className="text-purple-600" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                {t.strokeCenterTitle[lang]}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-xl mb-10">
              {t.strokeCenterDesc[lang]}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-purple-50 rounded-2xl p-8 text-center">
                <Activity size={48} className="mx-auto mb-4 text-purple-600" />
                <div className="text-3xl font-bold text-purple-600 mb-2">{t.strokeData1[lang]}</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-8 text-center">
                <Clock size={48} className="mx-auto mb-4 text-purple-600" />
                <div className="text-3xl font-bold text-purple-600 mb-2">{t.strokeData2[lang]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 心脏血管中心 */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-2xl p-10 md:p-14">
          <div className="flex items-center gap-4 mb-8">
            <Heart size={48} className="text-blue-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              {t.cardioCenterTitle[lang]}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-xl mb-10">
            {t.cardioCenterDesc[lang]}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Zap size={48} className="mx-auto mb-4 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600 mb-2">{t.cardioData1[lang]}</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Target size={48} className="mx-auto mb-4 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600 mb-2">{t.cardioData2[lang]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要诊疗科室 */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-14 text-center">
            {t.departmentsTitle[lang]}
          </h2>

          <div className="space-y-6">
            {/* 内科系 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => setExpandedDept(expandedDept === 'internal' ? null : 'internal')}
                className="w-full flex items-center justify-between p-8 hover:bg-blue-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <Stethoscope size={32} className="text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-800">{t.deptInternal[lang]}</h3>
                </div>
                {expandedDept === 'internal' ? (
                  <ChevronUp size={28} className="text-gray-500" />
                ) : (
                  <ChevronDown size={28} className="text-gray-500" />
                )}
              </button>
              {expandedDept === 'internal' && (
                <div className="px-8 pb-8 grid md:grid-cols-2 gap-4">
                  {departments.internal.map((dept, index) => (
                    <div key={index} className="p-5 bg-blue-50 rounded-xl text-gray-700 text-lg">
                      {dept[lang]}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 外科系 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => setExpandedDept(expandedDept === 'surgical' ? null : 'surgical')}
                className="w-full flex items-center justify-between p-8 hover:bg-green-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <Activity size={32} className="text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-800">{t.deptSurgical[lang]}</h3>
                </div>
                {expandedDept === 'surgical' ? (
                  <ChevronUp size={28} className="text-gray-500" />
                ) : (
                  <ChevronDown size={28} className="text-gray-500" />
                )}
              </button>
              {expandedDept === 'surgical' && (
                <div className="px-8 pb-8 grid md:grid-cols-2 gap-4">
                  {departments.surgical.map((dept, index) => (
                    <div key={index} className="p-5 bg-green-50 rounded-xl text-gray-700 text-lg">
                      {dept[lang]}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 专科 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => setExpandedDept(expandedDept === 'specialty' ? null : 'specialty')}
                className="w-full flex items-center justify-between p-8 hover:bg-purple-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <Heart size={32} className="text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-800">{t.deptSpecialty[lang]}</h3>
                </div>
                {expandedDept === 'specialty' ? (
                  <ChevronUp size={28} className="text-gray-500" />
                ) : (
                  <ChevronDown size={28} className="text-gray-500" />
                )}
              </button>
              {expandedDept === 'specialty' && (
                <div className="px-8 pb-8 grid md:grid-cols-2 gap-4">
                  {departments.specialty.map((dept, index) => (
                    <div key={index} className="p-5 bg-purple-50 rounded-xl text-gray-700 text-lg">
                      {dept[lang]}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 专门医疗中心 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => setExpandedDept(expandedDept === 'centers' ? null : 'centers')}
                className="w-full flex items-center justify-between p-8 hover:bg-red-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <Building2 size={32} className="text-red-600" />
                  <h3 className="text-2xl font-bold text-gray-800">{t.deptCenters[lang]}</h3>
                </div>
                {expandedDept === 'centers' ? (
                  <ChevronUp size={28} className="text-gray-500" />
                ) : (
                  <ChevronDown size={28} className="text-gray-500" />
                )}
              </button>
              {expandedDept === 'centers' && (
                <div className="px-8 pb-8 grid md:grid-cols-2 gap-4">
                  {departments.centers.map((dept, index) => (
                    <div key={index} className="p-5 bg-red-50 rounded-xl text-gray-700 text-lg">
                      {dept[lang]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 交通访问 */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-14 text-center">
          {t.accessTitle[lang]}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <MapPin size={32} className="text-blue-600 mt-1 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{t.addressLabel[lang]}</h3>
                <p className="text-gray-600 text-lg">{t.address[lang]}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Train size={32} className="text-green-600 mt-1 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{t.trainLabel[lang]}</h3>
                <p className="text-gray-600 text-lg">{t.trainRoute[lang]}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Bus size={32} className="text-orange-600 mt-1 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{t.busLabel[lang]}</h3>
                <p className="text-gray-600 text-lg">{t.busRoute[lang]}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Car size={32} className="text-purple-600 mt-1 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{t.carLabel[lang]}</h3>
                <p className="text-gray-600 text-lg">{t.carRoute[lang]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-14 text-center">
            {t.faqTitle[lang]}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-8 hover:bg-blue-50 transition-colors duration-300 text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-800 pr-4">{faq.q}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp size={28} className="text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown size={28} className="text-gray-500 shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-8 pb-8">
                    <p className="text-gray-600 leading-relaxed text-lg">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {isGuideEmbed && (
        <div id="consultation-form" className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t.ctaTitle[lang]}</h2>
            <p className="text-2xl text-blue-100 mb-10">{t.ctaDesc[lang]}</p>
            <button
              onClick={scrollToConsultation}
              className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 rounded-xl text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              {t.ctaBtn[lang]}
            </button>
          </div>
        </div>
      )}

      {/* 悬浮咨询按钮 */}
      {isGuideEmbed && (
        <button
          onClick={scrollToConsultation}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 font-bold text-lg flex items-center gap-3"
        >
          <Calendar size={28} />
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
