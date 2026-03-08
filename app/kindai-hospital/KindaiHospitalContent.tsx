'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  Award,
  Users,
  Building2,
  Microscope,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  CheckCircle2,
  MapPin,
  Train,
  Car,
  Bus,
  Shield,
  GraduationCap,
  FlaskConical,
  UserCheck,
  Clock,
  ArrowRight,
  FileText,
  CreditCard,
  Lock,
  MessageSquare,
  Mail,
  Globe,
  CheckCircle,
} from 'lucide-react'
import { useLanguage, type Language } from '@/hooks/useLanguage'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface KindaiHospitalContentProps {
  isGuideEmbed?: boolean
  guideSlug?: string
}

export default function KindaiHospitalContent({
  isGuideEmbed = false,
  guideSlug,
}: KindaiHospitalContentProps) {
  const locale = useLanguage()
  const [activePhase, setActivePhase] = useState<number>(1)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  // ========== 多语言内容 ==========

  // Hero 标题
  const heroTitle = {
    ja: '近畿大学病院',
    'zh-CN': '近畿大学医院',
    'zh-TW': '近畿大學醫院',
    en: 'Kindai University Hospital',
  }

  const heroSubtitle = {
    ja: '南大阪唯一の大学附属病院｜特定機能病院',
    'zh-CN': '南大阪唯一的大学附属医院 | 国家认定特定功能医院',
    'zh-TW': '南大阪唯一的大學附屬醫院 | 國家認定特定功能醫院',
    en: 'The Only University Hospital in South Osaka | Designated Advanced Care Hospital',
  }

  const heroDescription = {
    ja: '1975年創立｜35診療科・20専門センター・800床｜高度先端総合医療センター',
    'zh-CN': '1975年创立 | 35个诊疗科·20个专门中心·800床 | 高度先进综合医疗中心',
    'zh-TW': '1975年創立 | 35個診療科·20個專門中心·800床 | 高度先進綜合醫療中心',
    en: 'Est. 1975 | 35 Departments · 20 Centers · 800 Beds | Advanced Comprehensive Medical Center',
  }

  // 国家级资质认证
  const certificationsTitle = {
    ja: '国が認定した医療機能',
    'zh-CN': '国家认定医疗资质',
    'zh-TW': '國家認定醫療資質',
    en: 'National Medical Certifications',
  }

  const certifications = [
    {
      icon: Shield,
      name: {
        ja: '特定機能病院',
        'zh-CN': '特定功能医院',
        'zh-TW': '特定功能醫院',
        en: 'Advanced Care Hospital',
      },
      description: {
        ja: '厚生労働省指定・高度医療提供施設',
        'zh-CN': '厚生劳动省指定的高度医疗提供机构',
        'zh-TW': '厚生勞動省指定的高度醫療提供機構',
        en: 'Designated by Ministry of Health for Advanced Care',
      },
    },
    {
      icon: Microscope,
      name: {
        ja: 'がんゲノム医療拠点病院',
        'zh-CN': '癌症基因组医疗核心医院',
        'zh-TW': '癌症基因組醫療核心醫院',
        en: 'Cancer Genomic Medicine Hub',
      },
      description: {
        ja: '国指定・がんゲノム医療の中核拠点',
        'zh-CN': '国家指定的癌症基因组医疗核心据点',
        'zh-TW': '國家指定的癌症基因組醫療核心據點',
        en: 'National Hub for Genomic Cancer Treatment',
      },
    },
    {
      icon: GraduationCap,
      name: {
        ja: '臨床研修指定病院',
        'zh-CN': '临床研修指定医院',
        'zh-TW': '臨床研修指定醫院',
        en: 'Clinical Training Hospital',
      },
      description: {
        ja: '医師育成・臨床研究の拠点施設',
        'zh-CN': '医师培养与临床研究的核心机构',
        'zh-TW': '醫師培養與臨床研究的核心機構',
        en: 'Core Facility for Physician Training & Research',
      },
    },
    {
      icon: Heart,
      name: {
        ja: '災害拠点病院',
        'zh-CN': '灾害救援核心医院',
        'zh-TW': '災害救援核心醫院',
        en: 'Disaster Relief Hospital',
      },
      description: {
        ja: '大阪府指定・災害時医療提供体制',
        'zh-CN': '大阪府指定的灾害时医疗保障体系',
        'zh-TW': '大阪府指定的災害時醫療保障體系',
        en: 'Osaka Prefecture Designated Emergency Medical System',
      },
    },
  ]

  // 综合医疗实力
  const comprehensiveTitle = {
    ja: '総合医療の実力',
    'zh-CN': '综合医疗实力',
    'zh-TW': '綜合醫療實力',
    en: 'Comprehensive Medical Capability',
  }

  const comprehensiveStats = [
    {
      icon: Building2,
      number: '800',
      unit: { ja: '床', 'zh-CN': '床', 'zh-TW': '床', en: 'Beds' },
      label: { ja: '病床数', 'zh-CN': '病床数', 'zh-TW': '病床數', en: 'Total Beds' },
    },
    {
      icon: Stethoscope,
      number: '35',
      unit: { ja: '科', 'zh-CN': '科', 'zh-TW': '科', en: 'Depts' },
      label: {
        ja: '診療科',
        'zh-CN': '诊疗科',
        'zh-TW': '診療科',
        en: 'Medical Departments',
      },
    },
    {
      icon: Heart,
      number: '20',
      unit: { ja: 'センター', 'zh-CN': '中心', 'zh-TW': '中心', en: 'Centers' },
      label: {
        ja: '専門医療センター',
        'zh-CN': '专门医疗中心',
        'zh-TW': '專門醫療中心',
        en: 'Specialized Centers',
      },
    },
    {
      icon: Users,
      number: '23,451',
      unit: { ja: '名', 'zh-CN': '人', 'zh-TW': '人', en: '' },
      label: {
        ja: '年間退院患者数',
        'zh-CN': '年度出院患者',
        'zh-TW': '年度出院患者',
        en: 'Annual Discharges',
      },
    },
    {
      icon: Activity,
      number: '3,000+',
      unit: { ja: '件', 'zh-CN': '台', 'zh-TW': '台', en: '' },
      label: {
        ja: '年間手術件数',
        'zh-CN': '年度手术量',
        'zh-TW': '年度手術量',
        en: 'Annual Surgeries',
      },
    },
    {
      icon: Award,
      number: '50',
      unit: { ja: '年', 'zh-CN': '年', 'zh-TW': '年', en: 'Yrs' },
      label: {
        ja: '臨床実績（1975年創立）',
        'zh-CN': '临床实绩（1975年创立）',
        'zh-TW': '臨床實績（1975年創立）',
        en: 'Clinical Track Record (Est. 1975)',
      },
    },
    {
      icon: UserCheck,
      number: '773',
      unit: { ja: '名', 'zh-CN': '人', 'zh-TW': '人', en: '' },
      label: {
        ja: '医師数',
        'zh-CN': '医师团队',
        'zh-TW': '醫師團隊',
        en: 'Medical Doctors',
      },
    },
    {
      icon: Heart,
      number: '892',
      unit: { ja: '名', 'zh-CN': '人', 'zh-TW': '人', en: '' },
      label: {
        ja: '看護師数',
        'zh-CN': '护士团队',
        'zh-TW': '護士團隊',
        en: 'Nursing Staff',
      },
    },
  ]

  // MDT 多学科协作
  const mdtTitle = {
    ja: '集学的治療（チーム医療）',
    'zh-CN': 'MDT多学科协作诊疗',
    'zh-TW': 'MDT多學科協作診療',
    en: 'Multidisciplinary Team (MDT) Approach',
  }

  const mdtDescription = {
    ja: '複雑な疾患に対して、複数の診療科の専門医がチームを組み、患者様一人ひとりに最適な治療計画を策定します。外科、内科、放射線科、病理診断科、緩和ケア科などの専門家が協力し、エビデンスに基づいた総合的な治療を提供します。',
    'zh-CN':
      '针对复杂疾病,由多个诊疗科的专家组成团队,为每位患者制定最优的个性化治疗方案。外科、内科、放射科、病理诊断科、姑息治疗科等专家协作,提供基于循证医学的综合治疗。',
    'zh-TW':
      '針對複雜疾病,由多個診療科的專家組成團隊,為每位患者制定最優的個性化治療方案。外科、內科、放射科、病理診斷科、姑息治療科等專家協作,提供基於循證醫學的綜合治療。',
    en: 'For complex diseases, specialists from multiple departments form a team to develop optimal personalized treatment plans for each patient. Experts in surgery, internal medicine, radiology, pathology, and palliative care collaborate to provide evidence-based comprehensive treatment.',
  }

  const mdtFeatures = [
    {
      icon: Users,
      title: {
        ja: 'キャンサーボード',
        'zh-CN': '癌症专家委员会',
        'zh-TW': '癌症專家委員會',
        en: 'Cancer Board',
      },
      description: {
        ja: '各科の専門医が集まり、治療方針を協議',
        'zh-CN': '各科专家汇聚,共同讨论治疗方针',
        'zh-TW': '各科專家匯聚,共同討論治療方針',
        en: 'Specialists from all departments discuss treatment strategies',
      },
    },
    {
      icon: Microscope,
      title: {
        ja: '最新エビデンス活用',
        'zh-CN': '最新循证医学',
        'zh-TW': '最新循證醫學',
        en: 'Latest Evidence-Based Medicine',
      },
      description: {
        ja: '大学病院ならではの研究成果を臨床に応用',
        'zh-CN': '将大学医院的研究成果应用于临床',
        'zh-TW': '將大學醫院的研究成果應用於臨床',
        en: 'Applying university hospital research to clinical practice',
      },
    },
    {
      icon: Heart,
      title: {
        ja: '個別化医療',
        'zh-CN': '个性化医疗',
        'zh-TW': '個性化醫療',
        en: 'Personalized Medicine',
      },
      description: {
        ja: '患者様の状態に合わせた最適な治療計画',
        'zh-CN': '根据患者状况制定最优治疗方案',
        'zh-TW': '根據患者狀況制定最優治療方案',
        en: 'Optimal treatment plans tailored to patient conditions',
      },
    },
    {
      icon: CheckCircle2,
      title: {
        ja: '多角的評価',
        'zh-CN': '多维度评估',
        'zh-TW': '多維度評估',
        en: 'Multidimensional Evaluation',
      },
      description: {
        ja: '診断から治療、予後まで総合的にサポート',
        'zh-CN': '从诊断到治疗、预后全方位支持',
        'zh-TW': '從診斷到治療、預後全方位支持',
        en: 'Comprehensive support from diagnosis to treatment and prognosis',
      },
    },
  ]

  // 大学医院背景
  const universityTitle = {
    ja: '大学病院の強み',
    'zh-CN': '大学医院优势',
    'zh-TW': '大學醫院優勢',
    en: 'University Hospital Strengths',
  }

  const universityFeatures = [
    {
      icon: GraduationCap,
      title: {
        ja: '近畿大学医学部附属',
        'zh-CN': '近畿大学医学部附属',
        'zh-TW': '近畿大學醫學部附屬',
        en: 'Affiliated with Kindai University Faculty of Medicine',
      },
      description: {
        ja: '医学教育・研究・診療の三位一体',
        'zh-CN': '医学教育、研究、诊疗三位一体',
        'zh-TW': '醫學教育、研究、診療三位一體',
        en: 'Integration of medical education, research, and clinical practice',
      },
    },
    {
      icon: FlaskConical,
      title: {
        ja: '臨床研究センター',
        'zh-CN': '临床研究中心',
        'zh-TW': '臨床研究中心',
        en: 'Clinical Research Center',
      },
      description: {
        ja: '最新の医学研究成果を即座に臨床に反映',
        'zh-CN': '最新医学研究成果立即应用于临床',
        'zh-TW': '最新醫學研究成果立即應用於臨床',
        en: 'Immediate clinical application of latest medical research',
      },
    },
    {
      icon: UserCheck,
      title: {
        ja: '専門医育成',
        'zh-CN': '专科医师培养',
        'zh-TW': '專科醫師培養',
        en: 'Specialist Training',
      },
      description: {
        ja: '次世代を担う優秀な医師を育成',
        'zh-CN': '培养引领下一代的优秀医师',
        'zh-TW': '培養引領下一代的優秀醫師',
        en: 'Training excellent physicians for the next generation',
      },
    },
    {
      icon: Microscope,
      title: {
        ja: '先進医療の承認',
        'zh-CN': '先进医疗认证',
        'zh-TW': '先進醫療認證',
        en: 'Advanced Medical Approval',
      },
      description: {
        ja: '保険適用外の最新治療技術を提供可能',
        'zh-CN': '可提供保险范围外的最新治疗技术',
        'zh-TW': '可提供保險範圍外的最新治療技術',
        en: 'Access to latest treatments beyond standard insurance coverage',
      },
    },
  ]

  // 先进医疗设备（精简版）
  const equipmentTitle = {
    ja: '最先端医療機器',
    'zh-CN': '顶尖医疗设备',
    'zh-TW': '頂尖醫療設備',
    en: 'Advanced Medical Equipment',
  }

  const coreEquipment = [
    {
      icon: Activity,
      name: {
        ja: 'da Vinci 手術支援ロボット',
        'zh-CN': 'da Vinci 手术辅助机器人',
        'zh-TW': 'da Vinci 手術輔助機器人',
        en: 'da Vinci Surgical Robot',
      },
      highlight: {
        ja: '第4世代 da Vinci Xiシステム',
        'zh-CN': '第4代 da Vinci Xi系统',
        'zh-TW': '第4代 da Vinci Xi系統',
        en: '4th Generation da Vinci Xi System',
      },
      purpose: {
        ja: '3D高精細画像と多関節アームによる低侵襲精密手術',
        'zh-CN': '通过3D高清影像和多关节机械臂实现微创精密手术',
        'zh-TW': '透過3D高清影像和多關節機械臂實現微創精密手術',
        en: '3D HD imaging with multi-articulated arms for minimally invasive precision surgery',
      },
      imageUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_2020_03_davinci_01.jpg',
      applications: {
        ja: '泌尿器科・外科・婦人科',
        'zh-CN': '泌尿外科、外科、妇科',
        'zh-TW': '泌尿外科、外科、婦科',
        en: 'Urology, Surgery, Gynecology',
      },
      yearIntroduced: '2016',
      advantages: [
        { ja: '手ぶれがなく安全な手術', 'zh-CN': '无手部抖动,安全手术', 'zh-TW': '無手部抖動,安全手術', en: 'Tremor-free, safe surgery' },
        { ja: '術後の機能温存率向上', 'zh-CN': '术后功能保留率提高', 'zh-TW': '術後功能保留率提高', en: 'Improved post-op function preservation' },
        { ja: '出血量が少ない', 'zh-CN': '出血量少', 'zh-TW': '出血量少', en: 'Minimal blood loss' },
        { ja: '早期社会復帰が可能', 'zh-CN': '可快速重返社会', 'zh-TW': '可快速重返社會', en: 'Faster return to daily life' },
      ],
    },
    {
      icon: Building2,
      name: {
        ja: 'ハイブリッド手術室',
        'zh-CN': '复合手术室',
        'zh-TW': '複合手術室',
        en: 'Hybrid Operating Room',
      },
      highlight: {
        ja: 'Artis zee / ARTIS Q ceiling',
        'zh-CN': 'Artis zee / ARTIS Q ceiling',
        'zh-TW': 'Artis zee / ARTIS Q ceiling',
        en: 'Artis zee / ARTIS Q ceiling',
      },
      purpose: {
        ja: '手術と画像診断を同時実施可能な最新鋭手術室',
        'zh-CN': '可同时进行手术和影像诊断的最先进手术室',
        'zh-TW': '可同時進行手術和影像診斷的最先進手術室',
        en: 'State-of-the-art OR enabling simultaneous surgery and imaging',
      },
      imageUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_2020_02_hybrid_operating_room_01.jpg',
      applications: {
        ja: '心臓血管外科・脳神経外科',
        'zh-CN': '心血管外科、脑外科',
        'zh-TW': '心血管外科、腦外科',
        en: 'Cardiovascular, Neurosurgery',
      },
      yearIntroduced: '2016',
      facilities: {
        ja: '面積71.8m²・Artis zeego（多軸駆動アーム搭載血管撮影システム）',
        'zh-CN': '面积71.8m²·Artis zeego（多轴驱动臂血管造影系统）',
        'zh-TW': '面積71.8m²·Artis zeego（多軸驅動臂血管造影系統）',
        en: 'Area: 71.8m² · Artis zeego (Multi-axis angiography system)',
      },
      advantages: [
        { ja: '術中撮影画像の3D化・瞬時の画像融合', 'zh-CN': '术中影像3D化·瞬间图像融合', 'zh-TW': '術中影像3D化·瞬間圖像融合', en: 'Intraoperative 3D imaging & instant fusion' },
        { ja: '患者の院内移動減少', 'zh-CN': '减少患者院内移动', 'zh-TW': '減少患者院內移動', en: 'Reduced patient transfers' },
        { ja: '手術時間短縮・出血量低減', 'zh-CN': '缩短手术时间·减少出血', 'zh-TW': '縮短手術時間·減少出血', en: 'Shorter surgery time, less bleeding' },
        { ja: '入院期間短縮', 'zh-CN': '缩短住院时间', 'zh-TW': '縮短住院時間', en: 'Shorter hospital stay' },
      ],
    },
    {
      icon: Activity,
      name: {
        ja: 'Halcyon 放射線治療装置',
        'zh-CN': 'Halcyon 放射治疗设备',
        'zh-TW': 'Halcyon 放射治療設備',
        en: 'Halcyon Radiation Therapy System',
      },
      highlight: {
        ja: 'kV-CBCT画像誘導放射線治療',
        'zh-CN': 'kV-CBCT影像引导放射治疗',
        'zh-TW': 'kV-CBCT影像引導放射治療',
        en: 'kV-CBCT Image-Guided Radiation Therapy',
      },
      purpose: {
        ja: '毎回CT撮影による高精度照射・治療時間を大幅短縮',
        'zh-CN': '每次治疗前CT扫描实现精准照射,大幅缩短治疗时间',
        'zh-TW': '每次治療前CT掃描實現精準照射,大幅縮短治療時間',
        en: 'Pre-treatment CT for precision targeting with significantly reduced treatment time',
      },
      imageUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_2020_04_halcyon_01.jpg',
      applications: {
        ja: '放射線治療センター',
        'zh-CN': '放射治疗中心',
        'zh-TW': '放射治療中心',
        en: 'Radiation Therapy Center',
      },
      yearIntroduced: '2019',
      status: {
        ja: '西日本初導入',
        'zh-CN': '西日本首台引进',
        'zh-TW': '西日本首台引進',
        en: 'First in Western Japan',
      },
      advantages: [
        { ja: '治療時間が約半分に短縮（約15分→約3分）', 'zh-CN': '治疗时间缩短约一半（约15分→约3分）', 'zh-TW': '治療時間縮短約一半（約15分→約3分）', en: 'Treatment time halved (15min→3min)' },
        { ja: '息を止める必要がない', 'zh-CN': '无需屏住呼吸', 'zh-TW': '無需屏住呼吸', en: 'No breath-holding required' },
        { ja: '高い静音性', 'zh-CN': '高静音性', 'zh-TW': '高靜音性', en: 'High noise reduction' },
        { ja: 'より鮮明なCT画像撮影が可能', 'zh-CN': '可拍摄更清晰的CT图像', 'zh-TW': '可拍攝更清晰的CT圖像', en: 'Clearer CT imaging' },
      ],
      targetDiseases: {
        ja: '前立腺がん・肺がん・頭頸部がん・膵臓がん・婦人科がん',
        'zh-CN': '前列腺癌、肺癌、头颈部癌、胰腺癌、妇科癌',
        'zh-TW': '前列腺癌、肺癌、頭頸部癌、胰臟癌、婦科癌',
        en: 'Prostate, lung, head/neck, pancreatic, gynecological cancers',
      },
    },
    {
      icon: Activity,
      name: {
        ja: 'NAVIO 膝関節手術支援ロボット',
        'zh-CN': 'NAVIO 膝关节手术辅助机器人',
        'zh-TW': 'NAVIO 膝關節手術輔助機器人',
        en: 'NAVIO Knee Surgery Robot',
      },
      highlight: {
        ja: 'CT不要・術中リアルタイム3Dマッピング',
        'zh-CN': '无需CT·术中实时3D骨骼成像',
        'zh-TW': '無需CT·術中即時3D骨骼成像',
        en: 'No CT Required - Real-time 3D Bone Mapping',
      },
      purpose: {
        ja: '人工膝関節置換術の精度向上・被曝ゼロ',
        'zh-CN': '提高人工膝关节置换术精度,零辐射',
        'zh-TW': '提高人工膝關節置換術精度,零輻射',
        en: 'Enhanced precision for knee replacement with zero radiation',
      },
      imageUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_2020_01_navio_01.jpg',
      applications: {
        ja: '整形外科',
        'zh-CN': '骨科',
        'zh-TW': '骨科',
        en: 'Orthopedics',
      },
      yearIntroduced: '2019',
      status: {
        ja: '日本国内初導入',
        'zh-CN': '日本国内首台引进',
        'zh-TW': '日本國內首台引進',
        en: 'First in Japan',
      },
      technology: {
        ja: '赤外線技術で骨の形状と関節の動きを感知し、ドリル動作を制御',
        'zh-CN': '利用红外线技术感知骨骼形状和关节运动,控制钻孔动作',
        'zh-TW': '利用紅外線技術感知骨骼形狀和關節運動,控制鑽孔動作',
        en: 'Infrared technology detects bone shape and joint movement to control drilling',
      },
      advantages: [
        { ja: '必要な部分のみを正確に削除', 'zh-CN': '仅精确删除必要部分', 'zh-TW': '僅精確刪除必要部分', en: 'Precisely removes only necessary parts' },
        { ja: '前十字靭帯の温存が実現', 'zh-CN': '实现前交叉韧带保留', 'zh-TW': '實現前交叉韌帶保留', en: 'ACL preservation achieved' },
        { ja: '骨削除時のエラー防止', 'zh-CN': '防止骨削除误差', 'zh-TW': '防止骨削除誤差', en: 'Error prevention in bone resection' },
        { ja: 'リハビリ期間の短縮・早期退院', 'zh-CN': '缩短康复期·早期出院', 'zh-TW': '縮短康復期·早期出院', en: 'Shorter rehab, earlier discharge' },
      ],
    },
    {
      icon: Microscope,
      name: {
        ja: 'PET分子イメージングセンター',
        'zh-CN': 'PET分子影像中心',
        'zh-TW': 'PET分子影像中心',
        en: 'PET Molecular Imaging Center',
      },
      highlight: {
        ja: 'BresTome® 頭部・乳房専用PET装置',
        'zh-CN': 'BresTome® 头部/乳房专用PET设备',
        'zh-TW': 'BresTome® 頭部/乳房專用PET設備',
        en: 'BresTome® Dedicated Brain/Breast PET Scanner',
      },
      purpose: {
        ja: '早期がん検出・認知症診断に特化した高精度検査',
        'zh-CN': '专门用于早期癌症检测和认知症诊断的高精度检查',
        'zh-TW': '專門用於早期癌症檢測和認知症診斷的高精度檢查',
        en: 'High-precision detection for early cancer and dementia diagnosis',
      },
      imageUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_2020_05_pet_01.jpg',
      applications: {
        ja: 'PET分子イメージングセンター',
        'zh-CN': 'PET分子影像中心',
        'zh-TW': 'PET分子影像中心',
        en: 'PET Imaging Center',
      },
      yearIntroduced: '2005',
      status: {
        ja: '大阪南エリア初導入',
        'zh-CN': '南大阪地区首台引进',
        'zh-TW': '南大阪地區首台引進',
        en: 'First in South Osaka',
      },
      technology: {
        ja: '18F-FDG薬剤を利用し、がん細胞が正常細胞よりも多くのブドウ糖を消費する特性を活用',
        'zh-CN': '利用18F-FDG药剂,运用癌细胞比正常细胞消耗更多葡萄糖的特性',
        'zh-TW': '利用18F-FDG藥劑,運用癌細胞比正常細胞消耗更多葡萄糖的特性',
        en: 'Uses 18F-FDG tracer, leveraging cancer cells\' higher glucose consumption',
      },
      advantages: [
        { ja: '約1cm前後のがんも発見可能', 'zh-CN': '可发现约1cm左右的癌症', 'zh-TW': '可發現約1cm左右的癌症', en: 'Can detect cancers ~1cm in size' },
        { ja: '全身同時撮影で転移巣を評価', 'zh-CN': '全身同步拍摄评估转移灶', 'zh-TW': '全身同步拍攝評估轉移灶', en: 'Whole-body scan assesses metastases' },
        { ja: '副作用なし', 'zh-CN': '无副作用', 'zh-TW': '無副作用', en: 'No side effects' },
        { ja: 'サイクロトロンで検査当日にFDG製剤を製造', 'zh-CN': '回旋加速器当日制造FDG制剂', 'zh-TW': '迴旋加速器當日製造FDG製劑', en: 'Same-day FDG production via cyclotron' },
      ],
    },
    {
      icon: FlaskConical,
      name: {
        ja: '光免疫療法（アルミノックス）',
        'zh-CN': '光免疫疗法（Alluminox）',
        'zh-TW': '光免疫療法（Alluminox）',
        en: 'Photoimmunotherapy (Alluminox)',
      },
      highlight: {
        ja: '第5のがん治療法・アキャルックス®',
        'zh-CN': '第5种癌症治疗法·Akalux®',
        'zh-TW': '第5種癌症治療法·Akalux®',
        en: 'The 5th Cancer Treatment - Akalux®',
      },
      purpose: {
        ja: '切除不能な頭頸部がんに対する革新的光治療',
        'zh-CN': '针对不可切除头颈部癌症的创新光疗法',
        'zh-TW': '針對不可切除頭頸部癌症的創新光療法',
        en: 'Innovative light therapy for unresectable head and neck cancer',
      },
      imageUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_2022_amc01_alluminox_01.jpg',
      applications: {
        ja: '耳鼻咽喉・頭頸部外科',
        'zh-CN': '耳鼻咽喉·头颈部外科',
        'zh-TW': '耳鼻咽喉·頭頸部外科',
        en: 'Otolaryngology & Head/Neck Surgery',
      },
      yearIntroduced: '2022',
      status: {
        ja: '第5のがん治療法として注目',
        'zh-CN': '作为第5代癌症治疗法备受关注',
        'zh-TW': '作為第5代癌症治療法備受關注',
        en: '5th cancer treatment gaining attention',
      },
      developer: {
        ja: '楽天メディカル',
        'zh-CN': '乐天医疗',
        'zh-TW': '樂天醫療',
        en: 'Rakuten Medical',
      },
      treatmentProcess: [
        { ja: '第1段階: アキャルックス®を点滴投与し、がん細胞表面のタンパク質に結合', 'zh-CN': '第1步: 静脉注射Akalux®,与癌细胞表面蛋白结合', 'zh-TW': '第1步: 靜脈注射Akalux®,與癌細胞表面蛋白結合', en: 'Step 1: IV Akalux® binds to cancer cell proteins' },
        { ja: '第2段階: レーザ光を照射して薬剤を反応させ、がん細胞を消滅', 'zh-CN': '第2步: 激光照射激活药物,消灭癌细胞', 'zh-TW': '第2步: 激光照射激活藥物,消滅癌細胞', en: 'Step 2: Laser activates drug to eliminate cancer cells' },
      ],
      advantages: [
        { ja: '入院期間わずか2日間', 'zh-CN': '住院仅需2天', 'zh-TW': '住院僅需2天', en: 'Only 2-day hospital stay' },
        { ja: '保険適用対象（切除不能な局所進行又は局所再発の頭頸部がん）', 'zh-CN': '已纳入保险（不可切除的局部晚期或复发头颈部癌）', 'zh-TW': '已納入保險（不可切除的局部晚期或復發頭頸部癌）', en: 'Insurance-covered (unresectable advanced/recurrent head & neck cancer)' },
        { ja: '手術・化学療法・放射線療法・免疫療法に続く新治療法', 'zh-CN': '继手术、化疗、放疗、免疫疗法后的新疗法', 'zh-TW': '繼手術、化療、放療、免疫療法後的新療法', en: 'New option after surgery, chemo, radiation, immunotherapy' },
        { ja: '数日間の遮光が必要（強い光・直射日光を避ける）', 'zh-CN': '需避光数日（避免强光·直射阳光）', 'zh-TW': '需避光數日（避免強光·直射陽光）', en: 'Light avoidance required for a few days' },
      ],
    },
  ]

  // 医师团队
  const doctorsTitle = {
    ja: '専門医チーム',
    'zh-CN': '专家医师团队',
    'zh-TW': '專家醫師團隊',
    en: 'Expert Medical Team',
  }

  const featuredDoctors = [
    {
      name: {
        ja: '津谷 康浩',
        'zh-CN': '津谷康浩',
        'zh-TW': '津谷康浩',
        en: 'Tsutani Yasuhiro',
      },
      title: {
        ja: '教授・診療部長',
        'zh-CN': '教授·诊疗部长',
        'zh-TW': '教授·診療部長',
        en: 'Professor & Director',
      },
      department: {
        ja: '呼吸器外科',
        'zh-CN': '呼吸外科',
        'zh-TW': '呼吸外科',
        en: 'Thoracic Surgery',
      },
      specialties: [
        { ja: '肺がん', 'zh-CN': '肺癌', 'zh-TW': '肺癌', en: 'Lung Cancer' },
        { ja: '縦隔腫瘍', 'zh-CN': '纵隔肿瘤', 'zh-TW': '縱隔腫瘤', en: 'Mediastinal Tumors' },
        { ja: '胸腔鏡手術', 'zh-CN': '胸腔镜手术', 'zh-TW': '胸腔鏡手術', en: 'Thoracoscopic Surgery' },
      ],
      credentials: {
        ja: '日本外科学会専門医・指導医、日本呼吸器外科学会専門医、da Vinci Certificate取得',
        'zh-CN': '日本外科学会专科医师·指导医师、日本呼吸外科学会专科医师、da Vinci 认证',
        'zh-TW': '日本外科學會專科醫師·指導醫師、日本呼吸外科學會專科醫師、da Vinci 認證',
        en: 'Board-certified surgeon, thoracic surgery specialist, da Vinci certified',
      },
      achievements: {
        ja: '肺がん手術年間150例以上、胸腔鏡手術のエキスパート',
        'zh-CN': '每年肺癌手术150例以上,胸腔镜手术专家',
        'zh-TW': '每年肺癌手術150例以上,胸腔鏡手術專家',
        en: '150+ lung cancer surgeries annually, expert in thoracoscopic procedures',
      },
      photoUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_kindaibito_tsutani_yasuhiro01.jpg',
    },
    {
      name: {
        ja: '坂口 元一',
        'zh-CN': '坂口元一',
        'zh-TW': '坂口元一',
        en: 'Sakaguchi Genichi',
      },
      title: {
        ja: '主任教授',
        'zh-CN': '主任教授',
        'zh-TW': '主任教授',
        en: 'Chief Professor',
      },
      department: {
        ja: '心臓血管外科',
        'zh-CN': '心脏血管外科',
        'zh-TW': '心臟血管外科',
        en: 'Cardiovascular Surgery',
      },
      specialties: [
        { ja: '心臓手術', 'zh-CN': '心脏手术', 'zh-TW': '心臟手術', en: 'Cardiac Surgery' },
        { ja: '小切開弁膜症手術（MICS）', 'zh-CN': '小切开瓣膜症手术（MICS）', 'zh-TW': '小切開瓣膜症手術（MICS）', en: 'Minimally Invasive Cardiac Surgery (MICS)' },
        { ja: 'TAVI（大動脈弁狭窄症カテーテル治療）', 'zh-CN': 'TAVI（大动脉瓣狭窄症导管治疗）', 'zh-TW': 'TAVI（大動脈瓣狹窄症導管治療）', en: 'Transcatheter Aortic Valve Implantation (TAVI)' },
      ],
      credentials: {
        ja: 'メルボルン大学オースチン医療センター留学、日本トップクラスの心臓手術実績',
        'zh-CN': '墨尔本大学奥斯汀医疗中心留学经历，日本顶级心脏手术实绩',
        'zh-TW': '墨爾本大學奧斯汀醫療中心留學經歷，日本頂級心臟手術實績',
        en: 'Trained at Austin Health, University of Melbourne; Top-tier cardiac surgery track record in Japan',
      },
      achievements: {
        ja: '全国から患者が来院する心臓外科のトップランナー、80歳以上・再手術患者への対応実績',
        'zh-CN': '全国患者慕名而来的心脏外科领军者，擅长80岁以上及再手术患者',
        'zh-TW': '全國患者慕名而來的心臟外科領軍者，擅長80歲以上及再手術患者',
        en: 'Leading cardiac surgeon with patients from across Japan; Expert in treating patients 80+ and reoperation cases',
      },
      photoUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_kindaibito_sakaguchi_genichi01.jpg',
    },
    {
      name: {
        ja: '安松 隆治',
        'zh-CN': '安松隆治',
        'zh-TW': '安松隆治',
        en: 'Yasumatsu Ryuji',
      },
      title: {
        ja: '主任教授',
        'zh-CN': '主任教授',
        'zh-TW': '主任教授',
        en: 'Chief Professor',
      },
      department: {
        ja: '耳鼻咽喉・頭頸部外科',
        'zh-CN': '耳鼻咽喉·头颈部外科',
        'zh-TW': '耳鼻咽喉·頭頸部外科',
        en: 'Otolaryngology & Head/Neck Surgery',
      },
      specialties: [
        { ja: '頭頸部がん治療', 'zh-CN': '头颈部癌症治疗', 'zh-TW': '頭頸部癌症治療', en: 'Head & Neck Cancer Treatment' },
        { ja: '内視鏡手術', 'zh-CN': '内窥镜手术', 'zh-TW': '內窺鏡手術', en: 'Endoscopic Surgery' },
        { ja: 'ロボット支援下手術', 'zh-CN': '机器人辅助手术', 'zh-TW': '機器人輔助手術', en: 'Robot-Assisted Surgery' },
        { ja: '光免疫療法', 'zh-CN': '光免疫疗法', 'zh-TW': '光免疫療法', en: 'Photoimmunotherapy' },
      ],
      credentials: {
        ja: '頭頸部がん専門医・指導医、大阪府内数少ない頭頸部がん専門家',
        'zh-CN': '头颈部癌症专科医师·指导医师，大阪府内为数不多的头颈部癌症专家',
        'zh-TW': '頭頸部癌症專科醫師·指導醫師，大阪府內為數不多的頭頸部癌症專家',
        en: 'Board-certified head & neck cancer specialist and instructor; One of few head & neck cancer experts in Osaka Prefecture',
      },
      achievements: {
        ja: '低侵襲治療と機能温存を重視した頭頸部がん治療の第一人者、光免疫療法導入リーダー',
        'zh-CN': '微创治疗和功能保留的头颈部癌症治疗先驱，光免疫疗法引进领导者',
        'zh-TW': '微創治療和功能保留的頭頸部癌症治療先驅，光免疫療法引進領導者',
        en: 'Pioneer in minimally invasive and function-preserving head & neck cancer treatment; Leader in implementing photoimmunotherapy',
      },
      photoUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_kindaibito_yasumatsu_ryuji01.jpg',
    },
    {
      name: {
        ja: '林 秀敏',
        'zh-CN': '林秀敏',
        'zh-TW': '林秀敏',
        en: 'Hayashi Hidetoshi',
      },
      title: {
        ja: '主任教授',
        'zh-CN': '主任教授',
        'zh-TW': '主任教授',
        en: 'Chief Professor',
      },
      department: {
        ja: '腫瘍内科',
        'zh-CN': '肿瘤内科',
        'zh-TW': '腫瘤內科',
        en: 'Medical Oncology',
      },
      specialties: [
        { ja: '肺がん治療', 'zh-CN': '肺癌治疗', 'zh-TW': '肺癌治療', en: 'Lung Cancer Treatment' },
        { ja: '原発不明がん', 'zh-CN': '原发不明癌', 'zh-TW': '原發不明癌', en: 'Cancer of Unknown Primary' },
        { ja: '免疫チェックポイント阻害薬', 'zh-CN': '免疫检查点抑制剂', 'zh-TW': '免疫檢查點抑制劑', en: 'Immune Checkpoint Inhibitors' },
      ],
      credentials: {
        ja: '2003年大阪大学医学部卒業、京都大学本庶佑特別教授との共同研究実績',
        'zh-CN': '2003年大阪大学医学部毕业，与京都大学本庶佑特别教授共同研究经历',
        'zh-TW': '2003年大阪大學醫學部畢業，與京都大學本庶佑特別教授共同研究經歷',
        en: 'Graduated from Osaka University School of Medicine (2003); Collaborative research with Prof. Tasuku Honjo at Kyoto University',
      },
      achievements: {
        ja: '原発不明がんへの免疫チェックポイント阻害薬の有効性を世界で初めて確認し、治療薬承認に貢献',
        'zh-CN': '世界首次确认免疫检查点抑制剂对原发不明癌的有效性，为治疗药物获批做出贡献',
        'zh-TW': '世界首次確認免疫檢查點抑制劑對原發不明癌的有效性，為治療藥物獲批做出貢獻',
        en: 'World-first confirmation of immune checkpoint inhibitor efficacy for cancer of unknown primary; Contributed to drug approval',
      },
      photoUrl: 'https://www.med.kindai.ac.jp/img/about/mirai/detail/pic_detail_kindaibito_hayashi_hidetoshi01.jpg',
    },
  ]

  // 主要疾病治疗中心
  const centersTitle = {
    ja: '主な専門医療センター',
    'zh-CN': '主要专门医疗中心',
    'zh-TW': '主要專門醫療中心',
    en: 'Major Specialized Medical Centers',
  }

  // 癌症中心
  const cancerCenterTitle = {
    ja: 'がんセンター',
    'zh-CN': '癌症中心',
    'zh-TW': '癌症中心',
    en: 'Cancer Center',
  }

  const cancerCenterDescription = {
    ja: '手術、化学療法、放射線治療、緩和ケアを統合した総合がん診療を提供。キャンサーボード（多診療科合同カンファレンス）により、患者様一人ひとりに最適な治療法を選択します。',
    'zh-CN':
      '提供整合手术、化疗、放疗、姑息治疗的综合癌症诊疗。通过癌症专家委员会（多科室联合会议）,为每位患者选择最优治疗方法。',
    'zh-TW':
      '提供整合手術、化療、放療、姑息治療的綜合癌症診療。通過癌症專家委員會（多科室聯合會議）,為每位患者選擇最優治療方法。',
    en: 'Comprehensive cancer care integrating surgery, chemotherapy, radiation therapy, and palliative care. Cancer Board (multidisciplinary conference) selects optimal treatment for each patient.',
  }

  const cancerFeatures = [
    {
      title: {
        ja: 'がんゲノム医療',
        'zh-CN': '癌症基因组医疗',
        'zh-TW': '癌症基因組醫療',
        en: 'Genomic Cancer Medicine',
      },
      description: {
        ja: '遺伝子解析に基づく個別化治療',
        'zh-CN': '基于基因分析的个性化治疗',
        'zh-TW': '基於基因分析的個性化治療',
        en: 'Personalized treatment based on genetic analysis',
      },
    },
    {
      title: {
        ja: '集学的治療',
        'zh-CN': '多学科综合治疗',
        'zh-TW': '多學科綜合治療',
        en: 'Multidisciplinary Treatment',
      },
      description: {
        ja: '外科・内科・放射線科の協力治療',
        'zh-CN': '外科、内科、放射科协作治疗',
        'zh-TW': '外科、內科、放射科協作治療',
        en: 'Collaborative treatment by surgery, internal medicine, and radiology',
      },
    },
    {
      title: {
        ja: '緩和ケア',
        'zh-CN': '姑息治疗',
        'zh-TW': '姑息治療',
        en: 'Palliative Care',
      },
      description: {
        ja: '症状緩和・QOL向上支援',
        'zh-CN': '症状缓解与生活质量提升支持',
        'zh-TW': '症狀緩解與生活質量提升支持',
        en: 'Symptom relief and quality of life improvement',
      },
    },
    {
      title: {
        ja: 'AYA世代支援',
        'zh-CN': 'AYA世代患者支持',
        'zh-TW': 'AYA世代患者支持',
        en: 'AYA Generation Support',
      },
      description: {
        ja: '若年がん患者の特別サポート',
        'zh-CN': '青少年及年轻成人癌症患者特别支持',
        'zh-TW': '青少年及年輕成人癌症患者特別支持',
        en: 'Special support for adolescent and young adult cancer patients',
      },
    },
    {
      title: {
        ja: '妊孕性温存',
        'zh-CN': '生育力保存',
        'zh-TW': '生育力保存',
        en: 'Fertility Preservation',
      },
      description: {
        ja: 'がん治療前の生殖機能保存治療',
        'zh-CN': '癌症治疗前的生殖功能保存治疗',
        'zh-TW': '癌症治療前的生殖功能保存治療',
        en: 'Reproductive function preservation before cancer treatment',
      },
    },
    {
      title: {
        ja: '在宅緩和ケア連携',
        'zh-CN': '居家姑息护理衔接',
        'zh-TW': '居家姑息護理銜接',
        en: 'Home Palliative Care Coordination',
      },
      description: {
        ja: '地域医療機関との連携体制',
        'zh-CN': '与社区医疗机构的合作体系',
        'zh-TW': '與社區醫療機構的合作體系',
        en: 'Collaboration with community medical facilities',
      },
    },
  ]

  // 心脏血管中心
  const cardioCenterTitle = {
    ja: '心臓血管センター',
    'zh-CN': '心脏血管中心',
    'zh-TW': '心臟血管中心',
    en: 'Cardiovascular Center',
  }

  const cardioCenterDescription = {
    ja: '循環器内科・心臓血管外科の密接な連携により、急性心筋梗塞・大動脈解離などの緊急疾患から、冠動脈バイパス術・弁膜症手術まで、24時間体制で対応します。',
    'zh-CN':
      '循环内科与心脏血管外科紧密协作,从急性心肌梗塞、主动脉夹层等急症,到冠状动脉搭桥术、瓣膜手术,提供24小时全天候应对。',
    'zh-TW':
      '循環內科與心臟血管外科緊密協作,從急性心肌梗塞、主動脈夾層等急症,到冠狀動脈搭橋術、瓣膜手術,提供24小時全天候應對。',
    en: 'Close collaboration between cardiology and cardiovascular surgery provides 24/7 response from emergencies like acute myocardial infarction and aortic dissection to coronary bypass and valve surgery.',
  }

  const cardioFeatures = [
    {
      title: {
        ja: 'Door to Balloon < 90分',
        'zh-CN': 'Door to Balloon < 90分钟',
        'zh-TW': 'Door to Balloon < 90分鐘',
        en: 'Door to Balloon < 90 min',
      },
      description: {
        ja: '急性心筋梗塞の迅速な緊急カテーテル治療',
        'zh-CN': '急性心肌梗塞的快速紧急导管治疗',
        'zh-TW': '急性心肌梗塞的快速緊急導管治療',
        en: 'Rapid emergency catheterization for acute MI',
      },
    },
    {
      title: {
        ja: '24時間Heart Call',
        'zh-CN': '24小时Heart Call',
        'zh-TW': '24小時Heart Call',
        en: '24/7 Heart Call',
      },
      description: {
        ja: '心臓専門医による24時間緊急対応',
        'zh-CN': '心脏专科医师24小时紧急应对',
        'zh-TW': '心臟專科醫師24小時緊急應對',
        en: 'Cardiac specialist 24/7 emergency response',
      },
    },
    {
      title: {
        ja: 'ハイブリッド手術室',
        'zh-CN': '混合手术室',
        'zh-TW': '混合手術室',
        en: 'Hybrid Operating Room',
      },
      description: {
        ja: 'カテーテル+外科手術の同時実施',
        'zh-CN': '导管治疗与外科手术同步实施',
        'zh-TW': '導管治療與外科手術同步實施',
        en: 'Simultaneous catheter and surgical procedures',
      },
    },
    {
      title: {
        ja: 'TAVI（経カテーテル大動脈弁置換術）',
        'zh-CN': 'TAVI（经导管主动脉瓣置换术）',
        'zh-TW': 'TAVI（經導管主動脈瓣置換術）',
        en: 'TAVI (Transcatheter Aortic Valve Implantation)',
      },
      description: {
        ja: '低侵襲な弁膜症治療',
        'zh-CN': '微创瓣膜疾病治疗',
        'zh-TW': '微創瓣膜疾病治療',
        en: 'Minimally invasive valve disease treatment',
      },
    },
  ]

  // 脑卒中中心
  const strokeCenterTitle = {
    ja: '脳卒中センター',
    'zh-CN': '脑卒中中心',
    'zh-TW': '腦卒中中心',
    en: 'Stroke Center',
  }

  const strokeCenterDescription = {
    ja: '年間293例の脳卒中患者を受け入れ、脳神経内科・脳神経外科・リハビリテーション科が一体となり、急性期治療から回復期リハビリまで一貫したケアを提供します。',
    'zh-CN':
      '年收治293例脑卒中患者,神经内科、神经外科、康复科一体化,从急性期治疗到恢复期康复提供一贯的医疗服务。',
    'zh-TW':
      '年收治293例腦卒中患者,神經內科、神經外科、康復科一體化,從急性期治療到恢復期康復提供一貫的醫療服務。',
    en: 'Admitting 293 stroke patients annually, neurology, neurosurgery, and rehabilitation work as one to provide consistent care from acute treatment to recovery rehabilitation.',
  }

  const strokeStats = [
    {
      number: '293',
      unit: { ja: '例', 'zh-CN': '例', 'zh-TW': '例', en: 'cases' },
      label: {
        ja: '年間脳卒中患者数',
        'zh-CN': '年度脑卒中患者',
        'zh-TW': '年度腦卒中患者',
        en: 'Annual Stroke Patients',
      },
    },
    {
      number: '16.84',
      unit: { ja: '日', 'zh-CN': '天', 'zh-TW': '天', en: 'days' },
      label: {
        ja: '平均在院日数',
        'zh-CN': '平均住院天数',
        'zh-TW': '平均住院天數',
        en: 'Average Length of Stay',
      },
    },
  ]

  // 交通信息
  const accessTitle = {
    ja: 'アクセス',
    'zh-CN': '交通信息',
    'zh-TW': '交通資訊',
    en: 'Access',
  }

  const accessAddress = {
    ja: '〒590-0197 大阪府堺市南区三原台1丁14番1号',
    'zh-CN': '〒590-0197 大阪府堺市南区三原台1丁14番1号',
    'zh-TW': '〒590-0197 大阪府堺市南區三原台1丁14番1號',
    en: '〒590-0197 1-14-1 Miharadai, Minami-ku, Sakai City, Osaka',
  }

  const trainTitle = {
    ja: '電車でお越しの方',
    'zh-CN': '电车出行',
    'zh-TW': '電車出行',
    en: 'By Train',
  }

  const trainRoute = {
    ja: '南海泉北線「泉ケ丘」駅 → 徒歩約6分（550m）',
    'zh-CN': '南海泉北线「泉丘」站 → 步行约6分钟（550米）',
    'zh-TW': '南海泉北線「泉丘」站 → 步行約6分鐘（550米）',
    en: 'Nankai Senboku Line "Izumigaoka" Station → 6 min walk (550m)',
  }

  const busTitle = {
    ja: 'バスでお越しの方',
    'zh-CN': '巴士出行',
    'zh-TW': '巴士出行',
    en: 'By Bus',
  }

  const busRoutes = [
    {
      ja: '270系統「近大大阪医療キャンパス前」行',
      'zh-CN': '270路「近大大阪医疗校区前」方向',
      'zh-TW': '270路「近大大阪醫療校區前」方向',
      en: 'Route 270 to "Kindai Osaka Medical Campus"',
    },
    {
      ja: '213系統 三原台回り',
      'zh-CN': '213路 三原台循环',
      'zh-TW': '213路 三原台循環',
      en: 'Route 213 Miharadai Loop',
    },
    {
      ja: '市内循環バス A/B線（院内停留所）',
      'zh-CN': '市内循环巴士 A/B线（院内停靠）',
      'zh-TW': '市內循環巴士 A/B線（院內停靠）',
      en: 'City Loop Bus A/B Line (On-campus stop)',
    },
  ]

  const carTitle = {
    ja: 'お車でお越しの方',
    'zh-CN': '自驾出行',
    'zh-TW': '自駕出行',
    en: 'By Car',
  }

  const carRoutes = [
    {
      ja: '堺IC出口 → 一般道 約4km',
      'zh-CN': '堺IC出口 → 普通道路 约4公里',
      'zh-TW': '堺IC出口 → 普通道路 約4公里',
      en: 'Sakai IC Exit → General Road ~4km',
    },
    {
      ja: '美原北IC出口 → 一般道 約11km',
      'zh-CN': '美原北IC出口 → 普通道路 约11公里',
      'zh-TW': '美原北IC出口 → 普通道路 約11公里',
      en: 'Mihara-kita IC Exit → General Road ~11km',
    },
  ]

  const parkingNote = {
    ja: '※ 専用駐車場あり',
    'zh-CN': '※ 设有专用停车场',
    'zh-TW': '※ 設有專用停車場',
    en: '* Dedicated parking available',
  }

  // ========== 就诊流程 (Treatment Flow) ==========

  const flowTag = {
    ja: '受診の流れ',
    'zh-CN': '就诊流程',
    'zh-TW': '就診流程',
    en: 'Treatment Flow',
  }

  const flowTitle = {
    ja: '近畿大学病院での受診 — 全プロセス',
    'zh-CN': '近畿大学医院就诊 — 全流程',
    'zh-TW': '近畿大學醫院就診 — 全流程',
    en: 'Kindai Hospital Treatment — Complete Process',
  }

  const flowDesc = {
    ja: '初回相談から来日受診・術後フォローまで、全ステップを安心サポート',
    'zh-CN': '从初次咨询到来日就诊、术后跟踪，全程安心支持',
    'zh-TW': '從初次諮詢到來日就診、術後跟蹤，全程安心支持',
    en: 'Full support from initial consultation to treatment in Japan and post-op follow-up',
  }

  const flowClickPhase = {
    ja: '各フェーズをクリックして詳細を確認',
    'zh-CN': '点击各阶段查看详情',
    'zh-TW': '點擊各階段查看詳情',
    en: 'Click each phase for details',
  }

  const flowYouDo = {
    ja: 'あなたがすること',
    'zh-CN': '您需要做的',
    'zh-TW': '您需要做的',
    en: 'What You Do',
  }

  const flowWeHandle = {
    ja: '私たちがサポート',
    'zh-CN': '我们为您处理',
    'zh-TW': '我們為您處理',
    en: 'What We Handle',
  }

  const flowStepDetail = {
    ja: 'ステップ詳細',
    'zh-CN': '步骤详情',
    'zh-TW': '步驟詳情',
    en: 'Step Details',
  }

  const treatmentPhases = [
    {
      id: 'consultation',
      phaseNumber: 1,
      icon: MessageSquare,
      color: 'blue' as const,
      title: { ja: '初回相談', 'zh-CN': '初次咨询', 'zh-TW': '初次諮詢', en: 'Initial Consultation' },
      subtitle: { ja: 'オンラインで症状・ご希望をヒアリング', 'zh-CN': '在线了解病情与需求', 'zh-TW': '線上了解病情與需求', en: 'Online assessment of condition & needs' },
      duration: { ja: '1-3日', 'zh-CN': '1-3天', 'zh-TW': '1-3天', en: '1-3 days' },
      stepRange: [1, 3] as const,
      patientActions: [
        { ja: 'お問い合わせフォーム送信', 'zh-CN': '提交咨询表单', 'zh-TW': '提交諮詢表單', en: 'Submit inquiry form' },
        { ja: '医療記録・検査結果の準備', 'zh-CN': '准备病历、检查结果', 'zh-TW': '準備病歷、檢查結果', en: 'Prepare medical records & test results' },
        { ja: 'オンライン面談参加', 'zh-CN': '参加在线会诊', 'zh-TW': '參加線上會診', en: 'Join online consultation' },
      ],
      weHandle: [
        { ja: '24時間以内に初回返信', 'zh-CN': '24小时内初步回复', 'zh-TW': '24小時內初步回覆', en: 'Initial response within 24 hours' },
        { ja: '専門医師との面談調整', 'zh-CN': '安排专科医师会诊', 'zh-TW': '安排專科醫師會診', en: 'Arrange specialist consultation' },
        { ja: '医療記録の翻訳サポート', 'zh-CN': '病历翻译支持', 'zh-TW': '病歷翻譯支持', en: 'Medical record translation support' },
      ],
    },
    {
      id: 'preparation',
      phaseNumber: 2,
      icon: FileText,
      color: 'green' as const,
      title: { ja: '来日前準備', 'zh-CN': '来日前准备', 'zh-TW': '來日前準備', en: 'Pre-Arrival Preparation' },
      subtitle: { ja: '予約確定・ビザ・宿泊など全手配', 'zh-CN': '预约确定、签证、住宿等全程安排', 'zh-TW': '預約確定、簽證、住宿等全程安排', en: 'Appointment, visa, accommodation arrangements' },
      duration: { ja: '7-14日', 'zh-CN': '7-14天', 'zh-TW': '7-14天', en: '7-14 days' },
      feeSummary: { ja: '相談料 ¥221,000~', 'zh-CN': '咨询费 ¥221,000起', 'zh-TW': '諮詢費 ¥221,000起', en: 'Consultation fee from ¥221,000' },
      stepRange: [4, 6] as const,
      patientActions: [
        { ja: '診察予約の確定', 'zh-CN': '确认就诊预约', 'zh-TW': '確認就診預約', en: 'Confirm appointment' },
        { ja: '来日スケジュール調整', 'zh-CN': '调整来日行程', 'zh-TW': '調整來日行程', en: 'Adjust travel schedule' },
        { ja: 'ビザ申請（必要な場合）', 'zh-CN': '申请签证（如需要）', 'zh-TW': '申請簽證（如需要）', en: 'Apply for visa (if needed)' },
      ],
      weHandle: [
        { ja: '病院への予約代行', 'zh-CN': '代为预约医院', 'zh-TW': '代為預約醫院', en: 'Hospital appointment booking' },
        { ja: '医療ビザ招聘状発行', 'zh-CN': '办理医疗签证邀请函', 'zh-TW': '辦理醫療簽證邀請函', en: 'Medical visa invitation letter' },
        { ja: '宿泊・送迎手配', 'zh-CN': '安排住宿与接送', 'zh-TW': '安排住宿與接送', en: 'Accommodation & transport arrangement' },
      ],
    },
    {
      id: 'treatment',
      phaseNumber: 3,
      icon: Stethoscope,
      color: 'red' as const,
      title: { ja: '来日受診', 'zh-CN': '来日就诊', 'zh-TW': '來日就診', en: 'Treatment in Japan' },
      subtitle: { ja: '初診・検査・治療を通訳同行サポート', 'zh-CN': '初诊·检查·治疗全程翻译陪同', 'zh-TW': '初診·檢查·治療全程翻譯陪同', en: 'Consultation, tests, treatment with interpreter' },
      duration: { ja: '1-7日', 'zh-CN': '1-7天', 'zh-TW': '1-7天', en: '1-7 days' },
      feeSummary: { ja: '通訳同行 ¥50,000~', 'zh-CN': '翻译陪同 ¥50,000起', 'zh-TW': '翻譯陪同 ¥50,000起', en: 'Interpreter from ¥50,000' },
      stepRange: [7, 9] as const,
      patientActions: [
        { ja: '時間通りに病院へ来院', 'zh-CN': '按时到达医院', 'zh-TW': '按時到達醫院', en: 'Arrive at hospital on time' },
        { ja: '診察・検査を受診', 'zh-CN': '接受诊察与检查', 'zh-TW': '接受診察與檢查', en: 'Undergo consultation & tests' },
        { ja: '治療方針の相談・決定', 'zh-CN': '商讨与确定治疗方案', 'zh-TW': '商討與確定治療方案', en: 'Discuss & decide treatment plan' },
      ],
      weHandle: [
        { ja: '病院までの送迎', 'zh-CN': '医院接送服务', 'zh-TW': '醫院接送服務', en: 'Hospital transportation' },
        { ja: '診察・検査時の通訳', 'zh-CN': '诊察·检查现场翻译', 'zh-TW': '診察·檢查現場翻譯', en: 'Interpretation during consultations' },
        { ja: '診断書・処方箋の翻訳', 'zh-CN': '诊断书·处方翻译', 'zh-TW': '診斷書·處方翻譯', en: 'Translation of diagnosis & prescriptions' },
      ],
    },
    {
      id: 'followup',
      phaseNumber: 4,
      icon: Heart,
      color: 'purple' as const,
      title: { ja: '術後フォロー', 'zh-CN': '术后跟踪', 'zh-TW': '術後跟蹤', en: 'Post-Treatment Follow-up' },
      subtitle: { ja: '帰国後もオンラインで継続サポート', 'zh-CN': '回国后在线持续跟进', 'zh-TW': '回國後線上持續跟進', en: 'Ongoing online support after return' },
      duration: { ja: '継続', 'zh-CN': '持续', 'zh-TW': '持續', en: 'Ongoing' },
      stepRange: [10, 11] as const,
      patientActions: [
        { ja: '定期検査結果の共有', 'zh-CN': '分享定期检查结果', 'zh-TW': '分享定期檢查結果', en: 'Share regular test results' },
        { ja: '体調変化の報告', 'zh-CN': '报告身体变化', 'zh-TW': '報告身體變化', en: 'Report health changes' },
      ],
      weHandle: [
        { ja: 'オンライン経過観察', 'zh-CN': '在线随访', 'zh-TW': '線上隨訪', en: 'Online follow-up monitoring' },
        { ja: '検査結果の医師確認', 'zh-CN': '医师审查检查结果', 'zh-TW': '醫師審查檢查結果', en: 'Doctor review of test results' },
        { ja: '再来院が必要な場合の調整', 'zh-CN': '必要时安排再次来日', 'zh-TW': '必要時安排再次來日', en: 'Arrange return visit if needed' },
      ],
    },
  ]

  const treatmentFlow = [
    { step: 1, title: { ja: 'お問い合わせ', 'zh-CN': '提交咨询', 'zh-TW': '提交諮詢', en: 'Submit Inquiry' }, subtitle: { ja: 'フォームまたはLINE/微信で症状を送信', 'zh-CN': '通过表单或LINE/微信发送病情', 'zh-TW': '通過表單或LINE/微信發送病情', en: 'Submit via form or LINE/WeChat' }, from: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' }, to: { ja: '私たち', 'zh-CN': '我们', 'zh-TW': '我們', en: 'Us' } },
    { step: 2, title: { ja: '初回返信・ヒアリング', 'zh-CN': '初步回复·了解需求', 'zh-TW': '初步回覆·了解需求', en: 'Initial Response & Assessment' }, subtitle: { ja: '24時間以内に返信、詳細ヒアリング', 'zh-CN': '24小时内回复，详细了解', 'zh-TW': '24小時內回覆，詳細了解', en: 'Reply within 24h, detailed assessment' }, from: { ja: '私たち', 'zh-CN': '我们', 'zh-TW': '我們', en: 'Us' }, to: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' } },
    { step: 3, title: { ja: 'オンライン事前面談', 'zh-CN': '在线预诊', 'zh-TW': '線上預診', en: 'Online Pre-Consultation' }, subtitle: { ja: '専門医師とのビデオ相談（必要な場合）', 'zh-CN': '与专科医师视频会诊（如需要）', 'zh-TW': '與專科醫師視訊會診（如需要）', en: 'Video consultation with specialist (if needed)' }, from: { ja: '医師', 'zh-CN': '医师', 'zh-TW': '醫師', en: 'Doctor' }, to: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' }, fee: 221000, desc: { ja: 'オンライン事前面談は任意です。専門医師が直接病状を確認し、来日治療の適応性を判断します。', 'zh-CN': '在线预诊为可选服务。专科医师直接确认病情，判断来日治疗的适应性。', 'zh-TW': '線上預診為可選服務。專科醫師直接確認病情，判斷來日治療的適應性。', en: 'Optional service. Specialist directly confirms condition and assesses suitability for treatment in Japan.' } },
    { step: 4, title: { ja: '受診予約確定', 'zh-CN': '确定就诊预约', 'zh-TW': '確定就診預約', en: 'Confirm Appointment' }, subtitle: { ja: '診察日時の決定と病院への予約', 'zh-CN': '确定就诊日期并向医院预约', 'zh-TW': '確定就診日期並向醫院預約', en: 'Set date and book hospital appointment' }, from: { ja: '私たち', 'zh-CN': '我们', 'zh-TW': '我們', en: 'Us' }, to: { ja: '病院', 'zh-CN': '医院', 'zh-TW': '醫院', en: 'Hospital' }, fee: 221000 },
    { step: 5, title: { ja: '医療ビザ招聘状発行', 'zh-CN': '办理医疗签证邀请函', 'zh-TW': '辦理醫療簽證邀請函', en: 'Medical Visa Invitation' }, subtitle: { ja: '病院からの公式招聘状を取得', 'zh-CN': '获取医院官方邀请函', 'zh-TW': '獲取醫院官方邀請函', en: 'Obtain official hospital invitation' }, from: { ja: '病院', 'zh-CN': '医院', 'zh-TW': '醫院', en: 'Hospital' }, to: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' } },
    { step: 6, title: { ja: '宿泊・送迎手配', 'zh-CN': '安排住宿与接送', 'zh-TW': '安排住宿與接送', en: 'Arrange Accommodation & Transport' }, subtitle: { ja: '病院近くのホテル・空港送迎を手配', 'zh-CN': '安排医院附近酒店及机场接送', 'zh-TW': '安排醫院附近酒店及機場接送', en: 'Book nearby hotel & airport transfer' }, from: { ja: '私たち', 'zh-CN': '我们', 'zh-TW': '我們', en: 'Us' }, to: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' } },
    { step: 7, title: { ja: '初診受付・検査', 'zh-CN': '初诊登记·检查', 'zh-TW': '初診登記·檢查', en: 'Initial Visit & Tests' }, subtitle: { ja: '受付手続きと必要な検査を実施', 'zh-CN': '办理手续并进行必要检查', 'zh-TW': '辦理手續並進行必要檢查', en: 'Registration and necessary tests' }, from: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' }, to: { ja: '病院', 'zh-CN': '医院', 'zh-TW': '醫院', en: 'Hospital' }, fee: 50000, desc: { ja: '通訳同行サービスには、受付・診察・検査時の通訳、会計サポート、院内移動のアシストが含まれます。', 'zh-CN': '翻译陪同服务包括登记、诊察、检查时的翻译，结算支持，院内移动协助。', 'zh-TW': '翻譯陪同服務包括登記、診察、檢查時的翻譯，結算支持，院內移動協助。', en: 'Interpreter service includes translation during registration, consultation, tests, payment support, and in-hospital assistance.' } },
    { step: 8, title: { ja: '診察・診断', 'zh-CN': '诊察·诊断', 'zh-TW': '診察·診斷', en: 'Consultation & Diagnosis' }, subtitle: { ja: '専門医師による詳細診察と診断', 'zh-CN': '专科医师详细诊察与诊断', 'zh-TW': '專科醫師詳細診察與診斷', en: 'Detailed examination & diagnosis by specialist' }, from: { ja: '医師', 'zh-CN': '医师', 'zh-TW': '醫師', en: 'Doctor' }, to: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' } },
    { step: 9, title: { ja: '治療方針決定・開始', 'zh-CN': '确定治疗方案·开始治疗', 'zh-TW': '確定治療方案·開始治療', en: 'Treatment Plan & Initiation' }, subtitle: { ja: '治療計画の説明と治療開始', 'zh-CN': '说明治疗计划并开始治疗', 'zh-TW': '說明治療計劃並開始治療', en: 'Explain treatment plan and begin treatment' }, from: { ja: '医師', 'zh-CN': '医师', 'zh-TW': '醫師', en: 'Doctor' }, to: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' } },
    { step: 10, title: { ja: 'オンライン経過観察', 'zh-CN': '在线随访', 'zh-TW': '線上隨訪', en: 'Online Follow-up' }, subtitle: { ja: '帰国後の定期オンライン相談', 'zh-CN': '回国后定期在线咨询', 'zh-TW': '回國後定期線上諮詢', en: 'Regular online consultations after return' }, from: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' }, to: { ja: '医師', 'zh-CN': '医师', 'zh-TW': '醫師', en: 'Doctor' } },
    { step: 11, title: { ja: '再来院調整（必要時）', 'zh-CN': '安排再次来日（如需）', 'zh-TW': '安排再次來日（如需）', en: 'Arrange Return Visit (if needed)' }, subtitle: { ja: '追加検査・治療が必要な場合', 'zh-CN': '需要追加检查或治疗时', 'zh-TW': '需要追加檢查或治療時', en: 'When additional tests/treatment needed' }, from: { ja: '私たち', 'zh-CN': '我们', 'zh-TW': '我們', en: 'Us' }, to: { ja: 'あなた', 'zh-CN': '您', 'zh-TW': '您', en: 'You' } },
  ]

  const phaseColors = {
    blue: { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-600', ring: 'ring-blue-100', dot: 'bg-blue-600' },
    green: { bg: 'bg-green-600', light: 'bg-green-50', border: 'border-green-300', text: 'text-green-600', ring: 'ring-green-100', dot: 'bg-green-600' },
    red: { bg: 'bg-red-600', light: 'bg-red-50', border: 'border-red-300', text: 'text-red-600', ring: 'ring-red-100', dot: 'bg-red-600' },
    purple: { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-600', ring: 'ring-purple-100', dot: 'bg-purple-600' },
  }

  const phaseGradientMap = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    red: 'from-red-600 to-red-700',
    purple: 'from-purple-600 to-purple-700',
  }

  // ========== 咨询服务 ==========

  const svcTag = { ja: 'サポートサービス', 'zh-CN': '咨询服务', 'zh-TW': '諮詢服務', en: 'Support Services' }
  const svcTitle = { ja: '受診サポートサービスのご案内', 'zh-CN': '就诊支持服务介绍', 'zh-TW': '就診支持服務介紹', en: 'Medical Support Services' }
  const svcDesc = { ja: '初回相談から来日受診・通訳同行まで、あなたに最適なサポートプランをお選びください', 'zh-CN': '从初次咨询到来日就诊、翻译陪同，选择最适合您的支持方案', 'zh-TW': '從初次諮詢到來日就診、翻譯陪同，選擇最適合您的支持方案', en: 'From initial consultation to treatment in Japan with interpreter — choose your ideal support plan' }
  const svcLimit = { ja: '各月5名様限定', 'zh-CN': '每月限5名', 'zh-TW': '每月限5名', en: 'Limited to 5 per month' }
  const taxIncl = { ja: '税込', 'zh-CN': '含税', 'zh-TW': '含稅', en: 'Tax Incl.' }
  const bookNow = { ja: '今すぐ予約', 'zh-CN': '立即预约', 'zh-TW': '立即預約', en: 'Book Now' }

  const consultationServices = [
    {
      slug: 'initial-consultation',
      name: { ja: '前期相談サービス', 'zh-CN': '前期咨询服务', 'zh-TW': '前期諮詢服務', en: 'Initial Consultation Service' },
      nameEn: 'Initial Consultation',
      price: 221000,
      gradient: 'from-[#003e7e] to-[#0052a3]',
      hoverGradient: 'hover:from-[#002f5f] hover:to-[#003d7f]',
      checkColor: 'text-[#003e7e]',
      href: '/kindai-hospital/initial-consultation',
      desc: { ja: '初回から来日受診まで、全プロセスをサポート', 'zh-CN': '从初次咨询到来日就诊的全流程支持', 'zh-TW': '從初次諮詢到來日就診的全流程支持', en: 'Full support from initial inquiry to treatment in Japan' },
      features: [
        { ja: 'オンライン事前面談（30分）', 'zh-CN': '在线预诊（30分钟）', 'zh-TW': '線上預診（30分鐘）', en: 'Online pre-consultation (30min)' },
        { ja: '病院予約代行', 'zh-CN': '代为预约医院', 'zh-TW': '代為預約醫院', en: 'Hospital appointment booking' },
        { ja: '医療ビザ招聘状取得', 'zh-CN': '办理医疗签证邀请函', 'zh-TW': '辦理醫療簽證邀請函', en: 'Medical visa invitation' },
        { ja: '宿泊・送迎手配', 'zh-CN': '住宿与接送安排', 'zh-TW': '住宿與接送安排', en: 'Accommodation & transport' },
      ],
    },
    {
      slug: 'remote-consultation',
      name: { ja: '遠隔会診サービス', 'zh-CN': '远程会诊服务', 'zh-TW': '遠程會診服務', en: 'Remote Consultation Service' },
      nameEn: 'Remote Consultation',
      price: 243000,
      gradient: 'from-green-600 to-green-700',
      hoverGradient: 'hover:from-green-700 hover:to-green-800',
      checkColor: 'text-green-600',
      href: '/kindai-hospital/remote-consultation',
      desc: { ja: 'まずはオンラインで専門医に相談したい方', 'zh-CN': '想先在线向专科医师咨询的您', 'zh-TW': '想先線上向專科醫師諮詢的您', en: 'For those who want to consult a specialist online first' },
      features: [
        { ja: 'オンライン医師面談（30分）', 'zh-CN': '在线医师会诊（30分钟）', 'zh-TW': '線上醫師會診（30分鐘）', en: 'Online doctor consultation (30min)' },
        { ja: '医療記録翻訳サポート', 'zh-CN': '病历翻译支持', 'zh-TW': '病歷翻譯支持', en: 'Medical record translation' },
        { ja: 'セカンドオピニオン取得', 'zh-CN': '获取第二诊疗意见', 'zh-TW': '獲取第二診療意見', en: 'Second opinion' },
        { ja: '治療方針アドバイス', 'zh-CN': '治疗方案建议', 'zh-TW': '治療方案建議', en: 'Treatment plan advice' },
      ],
    },
  ]

  const memberTitle = { ja: '会員制医療サポート', 'zh-CN': '会员制医疗支持', 'zh-TW': '會員制醫療支持', en: 'Membership Medical Support' }
  const memberDesc = { ja: '年間サポート会員も募集中。継続的な健康管理・定期検診・緊急時対応をトータルサポートします。詳しくはお問い合わせください。', 'zh-CN': '现正招募年度支持会员。全面支持持续健康管理、定期体检、紧急应对。详情请咨询。', 'zh-TW': '現正招募年度支持會員。全面支持持續健康管理、定期體檢、緊急應對。詳情請諮詢。', en: 'Annual support membership now available. Comprehensive support for ongoing health management, regular check-ups, and emergency response. Contact us for details.' }

  // ========== 全35诊疗科 ==========

  const deptTitle = { ja: '全35診療科', 'zh-CN': '全35个诊疗科', 'zh-TW': '全35個診療科', en: 'All 35 Clinical Departments' }
  const deptInternal = { ja: '内科系', 'zh-CN': '内科系', 'zh-TW': '內科系', en: 'Internal Medicine' }
  const deptSurgical = { ja: '外科系', 'zh-CN': '外科系', 'zh-TW': '外科系', en: 'Surgical' }
  const deptSpecialty = { ja: '専門科・その他', 'zh-CN': '专科・其他', 'zh-TW': '專科・其他', en: 'Specialty & Others' }

  const departments = {
    internal: [
      { ja: '循環器内科', 'zh-CN': '循环内科', 'zh-TW': '循環內科', en: 'Cardiology' },
      { ja: '消化器内科', 'zh-CN': '消化内科', 'zh-TW': '消化內科', en: 'Gastroenterology' },
      { ja: '呼吸器内科', 'zh-CN': '呼吸内科', 'zh-TW': '呼吸內科', en: 'Pulmonology' },
      { ja: '神経内科', 'zh-CN': '神经内科', 'zh-TW': '神經內科', en: 'Neurology' },
      { ja: '腎臓内科', 'zh-CN': '肾脏内科', 'zh-TW': '腎臟內科', en: 'Nephrology' },
      { ja: '内分泌・代謝・糖尿病内科', 'zh-CN': '内分泌・代谢・糖尿病内科', 'zh-TW': '內分泌・代謝・糖尿病內科', en: 'Endocrinology & Diabetes' },
      { ja: '血液内科', 'zh-CN': '血液内科', 'zh-TW': '血液內科', en: 'Hematology' },
      { ja: 'リウマチ・膠原病内科', 'zh-CN': '风湿・胶原病内科', 'zh-TW': '風濕・膠原病內科', en: 'Rheumatology' },
      { ja: '感染症内科', 'zh-CN': '感染科', 'zh-TW': '感染科', en: 'Infectious Disease' },
      { ja: '総合内科', 'zh-CN': '综合内科', 'zh-TW': '綜合內科', en: 'General Internal Medicine' },
    ],
    surgical: [
      { ja: '心臓血管外科', 'zh-CN': '心脏血管外科', 'zh-TW': '心臟血管外科', en: 'Cardiovascular Surgery' },
      { ja: '消化器外科', 'zh-CN': '消化外科', 'zh-TW': '消化外科', en: 'Gastrointestinal Surgery' },
      { ja: '呼吸器外科', 'zh-CN': '呼吸外科', 'zh-TW': '呼吸外科', en: 'Thoracic Surgery' },
      { ja: '脳神経外科', 'zh-CN': '神经外科', 'zh-TW': '神經外科', en: 'Neurosurgery' },
      { ja: '整形外科', 'zh-CN': '骨科', 'zh-TW': '骨科', en: 'Orthopedics' },
      { ja: '形成外科', 'zh-CN': '整形外科', 'zh-TW': '整形外科', en: 'Plastic Surgery' },
      { ja: '乳腺外科', 'zh-CN': '乳腺外科', 'zh-TW': '乳腺外科', en: 'Breast Surgery' },
      { ja: '泌尿器科', 'zh-CN': '泌尿科', 'zh-TW': '泌尿科', en: 'Urology' },
      { ja: '婦人科', 'zh-CN': '妇科', 'zh-TW': '婦科', en: 'Gynecology' },
      { ja: '産科', 'zh-CN': '产科', 'zh-TW': '產科', en: 'Obstetrics' },
    ],
    specialty: [
      { ja: '小児科', 'zh-CN': '小儿科', 'zh-TW': '小兒科', en: 'Pediatrics' },
      { ja: '新生児科', 'zh-CN': '新生儿科', 'zh-TW': '新生兒科', en: 'Neonatology' },
      { ja: '眼科', 'zh-CN': '眼科', 'zh-TW': '眼科', en: 'Ophthalmology' },
      { ja: '耳鼻咽喉科', 'zh-CN': '耳鼻喉科', 'zh-TW': '耳鼻喉科', en: 'Otolaryngology' },
      { ja: '皮膚科', 'zh-CN': '皮肤科', 'zh-TW': '皮膚科', en: 'Dermatology' },
      { ja: '精神神経科', 'zh-CN': '精神神经科', 'zh-TW': '精神神經科', en: 'Psychiatry' },
      { ja: '放射線治療科', 'zh-CN': '放射治疗科', 'zh-TW': '放射治療科', en: 'Radiation Oncology' },
      { ja: '放射線診断科', 'zh-CN': '放射诊断科', 'zh-TW': '放射診斷科', en: 'Radiology' },
      { ja: '麻酔科', 'zh-CN': '麻醉科', 'zh-TW': '麻醉科', en: 'Anesthesiology' },
      { ja: '救命救急科', 'zh-CN': '急诊科', 'zh-TW': '急診科', en: 'Emergency Medicine' },
      { ja: 'リハビリテーション科', 'zh-CN': '康复科', 'zh-TW': '康復科', en: 'Rehabilitation' },
      { ja: '病理診断科', 'zh-CN': '病理诊断科', 'zh-TW': '病理診斷科', en: 'Pathology' },
      { ja: '臨床検査科', 'zh-CN': '临床检验科', 'zh-TW': '臨床檢驗科', en: 'Clinical Laboratory' },
      { ja: '歯科口腔外科', 'zh-CN': '口腔外科', 'zh-TW': '口腔外科', en: 'Oral Surgery' },
      { ja: '総合診療科', 'zh-CN': '全科', 'zh-TW': '全科', en: 'General Practice' },
    ],
  }

  // ========== CTA Section ==========

  const ctaTitle = { ja: '近畿大学病院での受診をご検討の方へ', 'zh-CN': '考虑在近畿大学医院就诊的您', 'zh-TW': '考慮在近畿大學醫院就診的您', en: 'Considering Medical Care at Kindai University Hospital?' }
  const ctaDesc = { ja: '中国語対応スタッフが丁寧にサポートいたします。\n予約手配から通訳同行まで一括対応。お気軽にご相談ください。', 'zh-CN': '中文服务人员为您提供全程支援。\n从预约安排到翻译陪同一站式服务，欢迎随时咨询。', 'zh-TW': '中文服務人員為您提供全程支援。\n從預約安排到翻譯陪同一站式服務，歡迎隨時諮詢。', en: 'Chinese-speaking staff provide full support.\nFrom appointment arrangement to interpreter accompaniment. Feel free to consult us.' }

  // ========== 渲染 ==========

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Language Switcher - Fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher variant="compact" />
      </div>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <Image
          src="https://www.med.kindai.ac.jp/img/about/relocation/mv.webp"
          alt="Kindai University Hospital"
          fill
          className="object-cover brightness-50"
          priority
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />

        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span>{certificationsTitle[locale]}</span>
              </div>

              <h1 className="text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                {heroTitle[locale]}
              </h1>

              <p className="text-xl text-slate-200 md:text-2xl">
                {heroSubtitle[locale]}
              </p>

              <p className="text-base text-slate-300 md:text-lg">
                {heroDescription[locale]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 国家级资质认证 */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              {certificationsTitle[locale]}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-[#003e7e] to-[#0052a3] p-4 text-white transition-transform duration-300 group-hover:scale-110">
                  <cert.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {cert.name[locale]}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {cert.description[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 综合医疗实力 */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="container mx-auto px-6">
          <div className="space-y-12">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
                  {comprehensiveTitle[locale]}
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {comprehensiveStats.map((stat, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-[#003e7e] to-[#0052a3] p-4 text-white transition-transform duration-300 group-hover:scale-110">
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#003e7e]">
                        {stat.number}
                      </span>
                      <span className="text-lg text-slate-600">
                        {stat.unit[locale]}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {stat.label[locale]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* MDT 多学科协作 */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="space-y-12">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
                  {mdtTitle[locale]}
                </h2>
                <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600">
                  {mdtDescription[locale]}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {mdtFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-[#003e7e] to-[#0052a3] p-4 text-white transition-transform duration-300 group-hover:scale-110">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900">
                      {feature.title[locale]}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {feature.description[locale]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* 先进医疗设备 */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="space-y-12">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
                  {equipmentTitle[locale]}
                </h2>
              </div>

              <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                {coreEquipment.map((equip, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border-2 border-[#003e7e]/20 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#003e7e]/40"
                  >
                    {equip.imageUrl && (
                      <div className="relative h-64 overflow-hidden rounded-t-3xl bg-slate-100">
                        <Image
                          src={equip.imageUrl}
                          alt={equip.name[locale]}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          quality={75}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="mb-4 flex items-start gap-3">
                        <div className="inline-flex rounded-xl bg-gradient-to-br from-[#003e7e] to-[#0052a3] p-3 text-white">
                          <equip.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1 text-xl font-bold text-slate-900">
                            {equip.name[locale]}
                          </h3>
                          <p className="text-sm font-semibold text-[#003e7e]">
                            {equip.highlight[locale]}
                          </p>
                          {equip.yearIntroduced && (
                            <p className="mt-1 text-xs text-slate-500">
                              {locale === 'ja' && `導入: ${equip.yearIntroduced}年`}
                              {locale === 'zh-CN' && `引进: ${equip.yearIntroduced}年`}
                              {locale === 'zh-TW' && `引進: ${equip.yearIntroduced}年`}
                              {locale === 'en' && `Introduced: ${equip.yearIntroduced}`}
                              {equip.status && (
                                <span className="ml-2 rounded-full bg-[#003e7e]/10 px-2 py-0.5 text-xs font-medium text-[#003e7e]">
                                  {equip.status[locale]}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="mb-4 text-sm leading-relaxed text-slate-700">
                        {equip.purpose[locale]}
                      </p>

                      {equip.advantages && equip.advantages.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600">
                            {locale === 'ja' && '主な利点'}
                            {locale === 'zh-CN' && '主要优势'}
                            {locale === 'zh-TW' && '主要優勢'}
                            {locale === 'en' && 'Key Advantages'}
                          </h4>
                          <ul className="space-y-1.5">
                            {equip.advantages.map((advantage, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs text-slate-600"
                              >
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#003e7e]" />
                                <span>{advantage[locale]}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {equip.targetDiseases && (
                        <div className="mb-3 rounded-lg bg-slate-50 p-3">
                          <p className="text-xs font-semibold text-slate-700">
                            {locale === 'ja' && '対象疾患: '}
                            {locale === 'zh-CN' && '适应症: '}
                            {locale === 'zh-TW' && '適應症: '}
                            {locale === 'en' && 'Target Diseases: '}
                            <span className="font-normal">{equip.targetDiseases[locale]}</span>
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
                        <Activity className="h-4 w-4" />
                        <span>{equip.applications[locale]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* 大学医院优势 */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="space-y-12">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
                  {universityTitle[locale]}
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {universityFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-[#003e7e] to-[#0052a3] p-4 text-white transition-transform duration-300 group-hover:scale-110">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900">
                      {feature.title[locale]}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {feature.description[locale]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* 专家医师团队 */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              {doctorsTitle[locale]}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            {featuredDoctors.map((doctor, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border-2 border-[#003e7e]/20 bg-gradient-to-br from-white to-slate-50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-[#003e7e]/40"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                  {doctor.photoUrl ? (
                    <Image
                      src={doctor.photoUrl}
                      alt={doctor.name[locale]}
                      fill
                      className="object-cover object-top"
                      quality={75}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#003e7e] to-[#0052a3]">
                      <UserCheck className="h-24 w-24 text-white" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-1 text-3xl font-bold text-[#003e7e]">
                        {doctor.name[locale]}
                      </h3>
                      <p className="mb-2 text-lg font-semibold text-slate-700">
                        {doctor.title[locale]} | {doctor.department[locale]}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-600">
                        <Stethoscope className="h-4 w-4" />
                        {locale === 'ja' && '専門分野'}
                        {locale === 'zh-CN' && '专业领域'}
                        {locale === 'zh-TW' && '專業領域'}
                        {locale === 'en' && 'Specialties'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-[#003e7e]/10 px-3 py-1 text-sm font-medium text-[#003e7e]"
                          >
                            {specialty[locale]}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-600">
                        <GraduationCap className="h-4 w-4" />
                        {locale === 'ja' && '資格・認定'}
                        {locale === 'zh-CN' && '资质认证'}
                        {locale === 'zh-TW' && '資質認證'}
                        {locale === 'en' && 'Credentials'}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {doctor.credentials[locale]}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-600">
                        <Award className="h-4 w-4" />
                        {locale === 'ja' && '実績'}
                        {locale === 'zh-CN' && '成就'}
                        {locale === 'zh-TW' && '成就'}
                        {locale === 'en' && 'Achievements'}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {doctor.achievements[locale]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 主要疾病治疗中心 */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              {centersTitle[locale]}
            </h2>
          </div>

          <div className="space-y-12">
            {/* 癌症中心 */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 shadow-2xl">
              <div className="p-8 md:p-12">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-4 text-white">
                    <Heart className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {cancerCenterTitle[locale]}
                  </h3>
                </div>

                <p className="mb-8 text-base leading-relaxed text-slate-700">
                  {cancerCenterDescription[locale]}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cancerFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-red-200 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-red-600" />
                        <h4 className="font-bold text-slate-900">
                          {feature.title[locale]}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600">
                        {feature.description[locale]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 心脏血管中心 */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-white shadow-2xl">
              <div className="p-8 md:p-12">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-[#003e7e] to-[#0052a3] p-4 text-white">
                    <Heart className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {cardioCenterTitle[locale]}
                  </h3>
                </div>

                <p className="mb-8 text-base leading-relaxed text-slate-700">
                  {cardioCenterDescription[locale]}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {cardioFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-blue-200 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[#003e7e]" />
                        <h4 className="font-bold text-slate-900">
                          {feature.title[locale]}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600">
                        {feature.description[locale]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 脑卒中中心 */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl">
              <div className="p-8 md:p-12">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-[#003e7e] to-[#0052a3] p-4 text-white">
                    <Brain className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {strokeCenterTitle[locale]}
                  </h3>
                </div>

                <p className="mb-8 text-base leading-relaxed text-slate-700">
                  {strokeCenterDescription[locale]}
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                  {strokeStats.map((stat, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-purple-200 bg-white/60 p-6 backdrop-blur-sm"
                    >
                      <div className="mb-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-[#003e7e]">
                          {stat.number}
                        </span>
                        <span className="text-lg text-slate-600">
                          {stat.unit[locale]}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {stat.label[locale]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          就诊流程 (Treatment Flow)
          ======================================== */}
      <section id="treatment-flow" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-[#003e7e] text-xs tracking-widest uppercase font-bold">{flowTag[locale]}</span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-3 mb-4">{flowTitle[locale]}</h3>
            <p className="text-slate-500 max-w-2xl mx-auto">{flowDesc[locale]}</p>
          </div>

          {/* Phase Navigation */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {treatmentPhases.map((phase) => {
                const PhaseIcon = phase.icon
                const isActive = activePhase === phase.phaseNumber
                const c = phaseColors[phase.color]
                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.phaseNumber)}
                    className={`relative rounded-2xl p-4 text-left transition-all ${
                      isActive
                        ? `${c.light} ${c.border} border-2 shadow-md ring-4 ${c.ring}`
                        : 'bg-slate-50 border border-slate-200 hover:shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? c.bg : 'bg-slate-200'}`}>
                        <PhaseIcon size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                      </div>
                      <span className={`text-xs font-bold ${isActive ? c.text : 'text-slate-400'}`}>
                        PHASE {phase.phaseNumber}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                      {phase.title[locale]}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {phase.duration[locale]}
                    </p>
                  </button>
                )
              })}
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">{flowClickPhase[locale]}</p>
          </div>

          {/* Active Phase Detail */}
          {(() => {
            const phase = treatmentPhases.find(p => p.phaseNumber === activePhase)!
            const PhaseIcon = phase.icon
            const phaseSteps = treatmentFlow.filter(
              s => s.step >= phase.stepRange[0] && s.step <= phase.stepRange[1]
            )

            return (
              <div className="max-w-5xl mx-auto">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                  {/* Phase Header */}
                  <div className={`bg-gradient-to-r ${phaseGradientMap[phase.color]} p-6 md:p-8 text-white`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                          <PhaseIcon size={24} />
                        </div>
                        <div>
                          <div className="text-white/70 text-xs font-bold tracking-wider">PHASE {phase.phaseNumber}</div>
                          <h4 className="text-xl md:text-2xl font-bold">{phase.title[locale]}</h4>
                          <p className="text-white/80 text-sm mt-1">{phase.subtitle[locale]}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                          <Clock size={14} /> {phase.duration[locale]}
                        </span>
                        {phase.feeSummary && (
                          <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                            <CreditCard size={14} /> {phase.feeSummary[locale]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Two-column: You Do vs We Handle */}
                  <div className="p-6 md:p-8 bg-white">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {/* Patient Actions */}
                      <div className={`rounded-xl p-5 border ${phaseColors[phase.color].light}`}>
                        <div className="flex items-center gap-2 mb-4">
                          <Users size={18} className="text-slate-600" />
                          <h5 className="font-bold text-slate-900 text-sm">{flowYouDo[locale]}</h5>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.patientActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                              <CheckCircle size={16} className="text-[#003e7e] flex-shrink-0 mt-0.5" />
                              <span>{action[locale]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* We Handle */}
                      <div className="rounded-xl p-5 border bg-slate-50 border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield size={18} className="text-slate-600" />
                          <h5 className="font-bold text-slate-900 text-sm">{flowWeHandle[locale]}</h5>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.weHandle.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                              <CheckCircle size={16} className="text-[#003e7e] flex-shrink-0 mt-0.5" />
                              <span>{item[locale]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Sub-step Timeline */}
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" />
                        {flowStepDetail[locale]}
                      </h5>
                      <div className="relative">
                        <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${phaseColors[phase.color].dot} opacity-20`}></div>
                        <div className="space-y-3">
                          {phaseSteps.map((step) => (
                            <div
                              key={step.step}
                              className="relative flex gap-4 group cursor-pointer"
                              onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                            >
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 ${phaseColors[phase.color].dot}`}>
                                {step.step}
                              </div>
                              <div className={`flex-grow rounded-xl p-4 border transition-all ${
                                expandedStep === step.step ? 'bg-white shadow-md border-slate-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm'
                              }`}>
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h6 className="text-sm font-bold text-slate-900">{step.title[locale]}</h6>
                                      {step.fee && (
                                        <span className="bg-blue-50 text-[#003e7e] text-xs font-bold px-2 py-0.5 rounded-full">
                                          ¥{step.fee.toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500">{step.subtitle[locale]}</p>
                                    {expandedStep === step.step && step.desc && (
                                      <div className="mt-3 pt-3 border-t border-slate-200">
                                        <p className="text-xs text-slate-600 leading-relaxed">{step.desc[locale]}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <span className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">{step.from[locale]}</span>
                                    <ArrowRight size={10} />
                                    <span className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">{step.to[locale]}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* ========================================
          咨询服务预约（Stripe 支付）
          ======================================== */}
      <section id="contact-form" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#003e7e] text-xs tracking-widest uppercase font-bold">{svcTag[locale]}</span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-3 mb-4">{svcTitle[locale]}</h3>
              <p className="text-slate-500 mb-4">{svcDesc[locale]}</p>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#003e7e]" />
                </span>
                <span className="text-[#003e7e] text-sm">{svcLimit[locale]}</span>
              </div>
            </div>

            {/* 2 Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {consultationServices.map((svc) => (
                <div key={svc.slug} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all">
                  <div className={`bg-gradient-to-r ${svc.gradient} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold">{svc.name[locale]}</h4>
                        <p className="text-white/70 text-sm">{svc.nameEn}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">¥{svc.price.toLocaleString()}</p>
                        <p className="text-xs text-white/60">{taxIncl[locale]}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-600 text-sm mb-6">{svc.desc[locale]}</p>
                    <ul className="space-y-2 mb-6 text-sm text-slate-600">
                      {svc.features.map((feat: any, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle size={14} className={`${svc.checkColor} mt-0.5 shrink-0`} />
                          <span>{feat[locale]}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={!isGuideEmbed ? svc.href : '#contact-form'}
                      className={`block w-full py-3 bg-gradient-to-r ${svc.gradient} ${svc.hoverGradient} text-white text-center font-bold rounded-xl transition shadow-lg`}
                    >
                      {bookNow[locale]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Member System Notice */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Users size={24} className="text-[#003e7e]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">{memberTitle[locale]}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{memberDesc[locale]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CTA Section
          ======================================== */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h3 className="text-3xl font-serif text-slate-900 mb-4">{ctaTitle[locale]}</h3>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto whitespace-pre-line mb-8">{ctaDesc[locale]}</p>
          {!isGuideEmbed && (
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#003e7e] to-[#0052a3] text-white px-8 py-4 rounded-full font-bold hover:from-[#002f5f] hover:to-[#003d7f] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Stethoscope size={20} />
              {bookNow[locale]}
              <ArrowRight size={18} />
            </a>
          )}
        </div>
      </div>
      {/* ========================================
          全35诊疗科
          ======================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#003e7e] text-xs tracking-widest uppercase font-bold">Clinical Departments</span>
            <h3 className="text-3xl font-serif text-slate-900 mt-2">{deptTitle[locale]}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-[#003e7e] rounded-full flex items-center justify-center"><Heart size={20} /></div>
                <h4 className="text-lg font-bold text-slate-800 font-serif">{deptInternal[locale]}</h4>
              </div>
              <div className="space-y-2">
                {departments.internal.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-600"><CheckCircle size={14} className="text-[#003e7e] shrink-0 mt-0.5" />{dept[locale]}</div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-[#003e7e] rounded-full flex items-center justify-center"><Activity size={20} /></div>
                <h4 className="text-lg font-bold text-slate-800 font-serif">{deptSurgical[locale]}</h4>
              </div>
              <div className="space-y-2">
                {departments.surgical.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-600"><CheckCircle size={14} className="text-[#003e7e] shrink-0 mt-0.5" />{dept[locale]}</div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center"><Stethoscope size={20} /></div>
                <h4 className="text-lg font-bold text-slate-800 font-serif">{deptSpecialty[locale]}</h4>
              </div>
              <div className="space-y-2">
                {departments.specialty.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-600"><CheckCircle size={14} className="text-slate-500 shrink-0 mt-0.5" />{dept[locale]}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 交通信息 */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              {accessTitle[locale]}
            </h2>
            <p className="flex items-center justify-center gap-2 text-base text-slate-600">
              <MapPin className="h-5 w-5" />
              {accessAddress[locale]}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* 电车 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-3 text-white">
                <Train className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                {trainTitle[locale]}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {trainRoute[locale]}
              </p>
            </div>

            {/* 巴士 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-[#003e7e] to-[#0052a3] p-3 text-white">
                <Bus className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                {busTitle[locale]}
              </h3>
              <ul className="space-y-2">
                {busRoutes.map((route, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#003e7e]" />
                    <span>{route[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 自驾 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-[#003e7e] to-[#0052a3] p-3 text-white">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                {carTitle[locale]}
              </h3>
              <ul className="mb-4 space-y-2">
                {carRoutes.map((route, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#003e7e]" />
                    <span>{route[locale]}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500">{parkingNote[locale]}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
