'use client'

import Image from 'next/image'
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
} from 'lucide-react'

type Lang = 'ja' | 'zh-CN' | 'zh-TW' | 'en'

interface KindaiHospitalContentProps {
  isGuideEmbed?: boolean
  lang?: Lang
}

export default function KindaiHospitalContent({
  isGuideEmbed = false,
  lang = 'ja',
}: KindaiHospitalContentProps) {
  const locale = lang
  const [activeTab, setActiveTab] = useState<
    'comprehensive' | 'mdt' | 'equipment' | 'university'
  >('comprehensive')

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
    ja: '1975年創立｜35診療科・14専門センター・800床｜高度先端総合医療センター',
    'zh-CN': '1975年创立 | 35个诊疗科·14个专门中心·800床 | 高度先进综合医疗中心',
    'zh-TW': '1975年創立 | 35個診療科·14個專門中心·800床 | 高度先進綜合醫療中心',
    en: 'Est. 1975 | 35 Departments · 14 Centers · 800 Beds | Advanced Comprehensive Medical Center',
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
      number: '14',
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
    },
    {
      icon: Activity,
      name: {
        ja: '高磁場MRI（3テスラ）',
        'zh-CN': '高磁场MRI（3特斯拉）',
        'zh-TW': '高磁場MRI（3特斯拉）',
        en: 'High-Field MRI (3 Tesla)',
      },
      highlight: {
        ja: 'Achieva 3T / Ingenia Prodiva 1.5T',
        'zh-CN': 'Achieva 3T / Ingenia Prodiva 1.5T',
        'zh-TW': 'Achieva 3T / Ingenia Prodiva 1.5T',
        en: 'Achieva 3T / Ingenia Prodiva 1.5T',
      },
      purpose: {
        ja: '脳梗塞・脳動脈瘤・心臓機能の精密評価',
        'zh-CN': '脑梗塞、脑动脉瘤、心脏功能的精密评估',
        'zh-TW': '腦梗塞、腦動脈瘤、心臟功能的精密評估',
        en: 'Precision evaluation of stroke, aneurysm, and cardiac function',
      },
    },
    {
      icon: Heart,
      name: {
        ja: '血管撮影システム',
        'zh-CN': '血管造影系统',
        'zh-TW': '血管造影系統',
        en: 'Angiography System',
      },
      highlight: {
        ja: 'Azurion 7 B12 / INNOVA IGS630',
        'zh-CN': 'Azurion 7 B12 / INNOVA IGS630',
        'zh-TW': 'Azurion 7 B12 / INNOVA IGS630',
        en: 'Azurion 7 B12 / INNOVA IGS630',
      },
      purpose: {
        ja: '心血管カテーテル治療・脳血管治療',
        'zh-CN': '心血管导管治疗、脑血管治疗',
        'zh-TW': '心血管導管治療、腦血管治療',
        en: 'Cardiovascular catheterization and cerebrovascular treatment',
      },
    },
    {
      icon: Activity,
      name: {
        ja: '最新CT装置',
        'zh-CN': '最新CT设备',
        'zh-TW': '最新CT設備',
        en: 'Latest CT Scanner',
      },
      highlight: {
        ja: 'Revolution CT / Aquilion ONE',
        'zh-CN': 'Revolution CT / Aquilion ONE',
        'zh-TW': 'Revolution CT / Aquilion ONE',
        en: 'Revolution CT / Aquilion ONE',
      },
      purpose: {
        ja: '低被曝・高速・高精度画像診断',
        'zh-CN': '低辐射、高速、高精度影像诊断',
        'zh-TW': '低輻射、高速、高精度影像診斷',
        en: 'Low-dose, high-speed, high-precision imaging diagnosis',
      },
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

  // ========== 渲染 ==========

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <Image
          src="https://www.med.kindai.ac.jp/img/about/relocation/mv.webp"
          alt="Kindai University Hospital"
          fill
          className="object-cover brightness-50"
          priority
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
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white transition-transform duration-300 group-hover:scale-110">
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

      {/* Tabs for 4 sections */}
      <section className="border-y border-slate-200 bg-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {[
              {
                key: 'comprehensive' as const,
                label: {
                  ja: '総合医療実力',
                  'zh-CN': '综合医疗实力',
                  'zh-TW': '綜合醫療實力',
                  en: 'Comprehensive',
                },
              },
              {
                key: 'mdt' as const,
                label: {
                  ja: 'チーム医療',
                  'zh-CN': 'MDT协作',
                  'zh-TW': 'MDT協作',
                  en: 'MDT',
                },
              },
              {
                key: 'equipment' as const,
                label: {
                  ja: '最先端機器',
                  'zh-CN': '顶尖设备',
                  'zh-TW': '頂尖設備',
                  en: 'Equipment',
                },
              },
              {
                key: 'university' as const,
                label: {
                  ja: '大学病院の強み',
                  'zh-CN': '大学医院优势',
                  'zh-TW': '大學醫院優勢',
                  en: 'University',
                },
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label[locale]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* 综合医疗实力 */}
          {activeTab === 'comprehensive' && (
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
                    <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white transition-transform duration-300 group-hover:scale-110">
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-blue-600">
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
          )}

          {/* MDT 多学科协作 */}
          {activeTab === 'mdt' && (
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
                    <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white transition-transform duration-300 group-hover:scale-110">
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
          )}

          {/* 先进医疗设备 */}
          {activeTab === 'equipment' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
                  {equipmentTitle[locale]}
                </h2>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {coreEquipment.map((equip, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="mb-6 flex items-start gap-4">
                      <div className="inline-flex rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 p-4 text-white transition-transform duration-300 group-hover:scale-110">
                        <equip.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold text-slate-900">
                          {equip.name[locale]}
                        </h3>
                        <p className="mb-3 text-sm font-semibold text-teal-600">
                          {equip.highlight[locale]}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {equip.purpose[locale]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 大学医院优势 */}
          {activeTab === 'university' && (
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
                    <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white transition-transform duration-300 group-hover:scale-110">
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
          )}
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
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 shadow-2xl">
              <div className="p-8 md:p-12">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
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
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
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
                  <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
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
                        <span className="text-4xl font-bold text-purple-600">
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
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white">
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
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span>{route[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 自驾 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-3 text-white">
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
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
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
