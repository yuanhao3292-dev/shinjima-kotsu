'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, Train,
  Award, Shield, Heart, Brain,
  Syringe, Microscope, Sparkles, CheckCircle,
  ArrowRight, Globe, Mail, MessageSquare,
  CreditCard, Lock, Users, Activity,
  Droplets, FlaskConical, Dna, Scan,
  Star, ChevronDown, ChevronUp, Stethoscope,
  GraduationCap, Building2, Beaker, CircleDot,
  Zap, Leaf, Eye, ShieldCheck,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// ======================================
// Hero 图片（白标首图映射用）
// ======================================
export const GINZA_PHOENIX_HERO_IMAGE = 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2000&auto=format&fit=crop';

// ======================================
// 多语言翻译
// ======================================
const t = {
  // Hero
  heroTagline: {
    ja: 'がん免疫療法の最先端',
    'zh-TW': '癌症免疫療法的最前沿',
    'zh-CN': '癌症免疫疗法的最前沿',
    en: 'The Frontier of Cancer Immunotherapy',
  } as Record<Language, string>,
  heroTitle: {
    ja: '銀座鳳凰クリニック',
    'zh-TW': '銀座鳳凰診所',
    'zh-CN': '银座凤凰诊所',
    en: 'Ginza Phoenix Clinic',
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '日本先端がん複合免疫細胞療法',
    'zh-TW': '日本先端癌症複合免疫細胞療法',
    'zh-CN': '日本先端癌症复合免疫细胞疗法',
    en: 'Advanced Combined Cancer Immunocell Therapy in Japan',
  } as Record<Language, string>,
  heroText: {
    ja: '兵庫医科大学発ベンチャー技術に基づく\n厚生労働省認可の再生医療計画19件。\n東京最大級の院内CPC（細胞培養加工施設）を保有。\nWT1樹状細胞ワクチン・NK細胞・NKT細胞の3つの核心療法。',
    'zh-TW': '基於兵庫醫科大學創投技術，\n厚生勞動省認可再生醫療計劃19件。\n擁有東京最大級別院內CPC（細胞培養加工設施）。\nWT1樹突狀細胞疫苗・NK細胞・NKT細胞三大核心療法。',
    'zh-CN': '基于兵库医科大学创投技术，\n厚生劳动省认可再生医疗计划19件。\n拥有东京最大级别院内CPC（细胞培养加工设施）。\nWT1树突状细胞疫苗・NK细胞・NKT细胞三大核心疗法。',
    en: 'Based on Hyogo Medical University venture technology.\n19 MHLW-approved regenerative medicine plans.\nOne of the largest in-house CPCs in Tokyo.\nThree core therapies: WT1 DC vaccine, NK cells, NKT cells.',
  } as Record<Language, string>,
  heroBadge: {
    ja: '兵庫医科大学発ベンチャー技術',
    'zh-TW': '兵庫醫科大學創投技術',
    'zh-CN': '兵库医科大学创投技术',
    en: 'Hyogo Medical University Venture Technology',
  } as Record<Language, string>,

  // Stats
  statsTag: {
    ja: 'クリニックの実力',
    'zh-TW': '診所實力',
    'zh-CN': '诊所实力',
    en: 'Clinic Strength',
  } as Record<Language, string>,
  statsTitle: {
    ja: '数字で見る銀座鳳凰クリニック',
    'zh-TW': '數字看銀座鳳凰診所',
    'zh-CN': '数字看银座凤凰诊所',
    en: 'Ginza Phoenix by the Numbers',
  } as Record<Language, string>,

  // Why Choose Us
  whyTag: {
    ja: '選ばれる理由',
    'zh-TW': '選擇我們的理由',
    'zh-CN': '选择我们的理由',
    en: 'Why Choose Us',
  } as Record<Language, string>,
  whyTitle: {
    ja: '銀座鳳凰が選ばれる4つの理由',
    'zh-TW': '選擇銀座鳳凰的4大理由',
    'zh-CN': '选择银座凤凰的4大理由',
    en: '4 Reasons to Choose Ginza Phoenix',
  } as Record<Language, string>,

  // Core Therapies
  therapyTag: {
    ja: '核心療法',
    'zh-TW': '核心療法',
    'zh-CN': '核心疗法',
    en: 'Core Therapies',
  } as Record<Language, string>,
  therapyTitle: {
    ja: '3つの核心がん免疫細胞療法',
    'zh-TW': '3大核心癌症免疫細胞療法',
    'zh-CN': '3大核心癌症免疫细胞疗法',
    en: '3 Core Cancer Immunocell Therapies',
  } as Record<Language, string>,

  // Applicable Cancers
  cancerTag: {
    ja: '適応がん種',
    'zh-TW': '適應癌症類型',
    'zh-CN': '适应癌症类型',
    en: 'Applicable Cancers',
  } as Record<Language, string>,
  cancerTitle: {
    ja: '適応となるがんの種類',
    'zh-TW': '適用的癌症類型',
    'zh-CN': '适用的癌症类型',
    en: 'Applicable Cancer Types',
  } as Record<Language, string>,
  cancerSubtitle: {
    ja: 'ステージIV・進行がん・転移がんにも対応。手術・化学療法・放射線との併用が可能です',
    'zh-TW': '適用於Stage IV、晚期癌症、轉移癌。可與手術、化療、放療併用',
    'zh-CN': '适用于Stage IV、晚期癌症、转移癌。可与手术、化疗、放疗并用',
    en: 'Applicable to Stage IV, advanced & metastatic cancers. Can combine with surgery, chemo & radiation',
  } as Record<Language, string>,

  // Treatment Flow
  flowTag: {
    ja: '治療の流れ',
    'zh-TW': '治療流程',
    'zh-CN': '治疗流程',
    en: 'Treatment Flow',
  } as Record<Language, string>,
  flowTitle: {
    ja: '初診から治療完了まで4つのステップ',
    'zh-TW': '從初診到治療完成的4個步驟',
    'zh-CN': '从初诊到治疗完成的4个步骤',
    en: '4 Steps from Consultation to Treatment',
  } as Record<Language, string>,

  // Doctors
  doctorTag: {
    ja: '医師紹介',
    'zh-TW': '醫師介紹',
    'zh-CN': '医师介绍',
    en: 'Medical Team',
  } as Record<Language, string>,
  doctorTitle: {
    ja: '経験豊富な医療チーム',
    'zh-TW': '經驗豐富的醫療團隊',
    'zh-CN': '经验丰富的医疗团队',
    en: 'Experienced Medical Team',
  } as Record<Language, string>,

  // Access
  accessTag: {
    ja: 'アクセス',
    'zh-TW': '交通方式',
    'zh-CN': '交通方式',
    en: 'Access',
  } as Record<Language, string>,
  accessTitle: {
    ja: 'JR秋葉原駅 徒歩2分',
    'zh-TW': 'JR秋葉原站 步行2分鐘',
    'zh-CN': 'JR秋叶原站 步行2分钟',
    en: '2 Min Walk from JR Akihabara Station',
  } as Record<Language, string>,

  // CTA
  ctaTitle: {
    ja: 'がん免疫療法のご相談',
    'zh-TW': '癌症免疫療法諮詢',
    'zh-CN': '癌症免疫疗法咨询',
    en: 'Cancer Immunotherapy Consultation',
  } as Record<Language, string>,
  ctaSubtitle: {
    ja: '初回カウンセリング無料。お気軽にご相談ください',
    'zh-TW': '初次諮詢免費，歡迎聯繫我們',
    'zh-CN': '初次咨询免费，欢迎联系我们',
    en: 'Free initial counseling available — contact us anytime',
  } as Record<Language, string>,
  ctaButton: {
    ja: '初期相談を予約する',
    'zh-TW': '預約初期諮詢',
    'zh-CN': '预约初期咨询',
    en: 'Book Initial Consultation',
  } as Record<Language, string>,
  ctaButtonRemote: {
    ja: '遠隔相談を予約する',
    'zh-TW': '預約遠程諮詢',
    'zh-CN': '预约远程咨询',
    en: 'Book Remote Consultation',
  } as Record<Language, string>,
  learnMore: {
    ja: '詳しく見る',
    'zh-TW': '了解更多',
    'zh-CN': '了解更多',
    en: 'Learn More',
  } as Record<Language, string>,
  contactUs: {
    ja: 'お問い合わせ',
    'zh-TW': '聯繫我們',
    'zh-CN': '联系我们',
    en: 'Contact Us',
  } as Record<Language, string>,
  consultation: {
    ja: '前期相談サービス',
    'zh-TW': '前期諮詢服務',
    'zh-CN': '前期咨询服务',
    en: 'Initial Consultation Service',
  } as Record<Language, string>,
  consultationDesc: {
    ja: '病歴翻訳・クリニック相談・治療プラン評価・費用概算',
    'zh-TW': '病歷翻譯・診所諮詢・治療方案評估・費用概算',
    'zh-CN': '病历翻译・诊所咨询・治疗方案评估・费用概算',
    en: 'Record translation, clinic consultation, treatment assessment, cost estimate',
  } as Record<Language, string>,
  freeConsultation: {
    ja: '初回カウンセリング無料',
    'zh-TW': '初次諮詢免費',
    'zh-CN': '初次咨询免费',
    en: 'Free Initial Counseling',
  } as Record<Language, string>,
};

// ======================================
// 数据
// ======================================

const STATS = [
  {
    value: '19',
    unit: { ja: '件', 'zh-TW': '件', 'zh-CN': '件', en: '' } as Record<Language, string>,
    label: { ja: '厚労省再生医療計画', 'zh-TW': '厚勞省再生醫療計劃', 'zh-CN': '厚劳省再生医疗计划', en: 'MHLW Regen. Plans' } as Record<Language, string>,
  },
  {
    value: '3',
    unit: { ja: '種', 'zh-TW': '種', 'zh-CN': '种', en: '' } as Record<Language, string>,
    label: { ja: '核心療法', 'zh-TW': '核心療法', 'zh-CN': '核心疗法', en: 'Core Therapies' } as Record<Language, string>,
  },
  {
    value: '350',
    unit: { ja: '万円〜', 'zh-TW': '萬日圓〜', 'zh-CN': '万日元〜', en: '万+' } as Record<Language, string>,
    label: { ja: '1クール費用参考', 'zh-TW': '1療程費用參考', 'zh-CN': '1疗程费用参考', en: 'Per Course (ref.)' } as Record<Language, string>,
  },
  {
    value: 'GMP',
    unit: { ja: '基準', 'zh-TW': '標準', 'zh-CN': '标准', en: 'Grade' } as Record<Language, string>,
    label: { ja: '院内CPC環境', 'zh-TW': '院內CPC環境', 'zh-CN': '院内CPC环境', en: 'In-House CPC' } as Record<Language, string>,
  },
];

const WHY_CHOOSE_US = [
  {
    icon: <Building2 size={24} />,
    title: { ja: '東京最大級の院内CPC', 'zh-TW': '東京最大級別院內CPC', 'zh-CN': '东京最大级别院内CPC', en: 'One of Tokyo\'s Largest In-House CPC' } as Record<Language, string>,
    desc: { ja: '東京最大級の院内細胞培養加工施設（CPC）を保有。採取から培養・品質管理まで一貫して院内で実施', 'zh-TW': '擁有東京最大級別院內細胞培養加工設施（CPC）。從採集到培養、品質管理全程院內完成', 'zh-CN': '拥有东京最大级别院内细胞培养加工设施（CPC）。从采集到培养、品质管理全程院内完成', en: 'One of the largest in-house Cell Processing Centers (CPC) in Tokyo. End-to-end cell collection, culture & QC performed in-house' } as Record<Language, string>,
  },
  {
    icon: <GraduationCap size={24} />,
    title: { ja: '医学博士が率いる専門チーム', 'zh-TW': '醫學博士領銜專業團隊', 'zh-CN': '医学博士领衔专业团队', en: 'PhD-Led Professional Team' } as Record<Language, string>,
    desc: { ja: '東京大学医学博士の院長が率いる医療チーム。兵庫医科大学の研究支援による最先端の免疫細胞療法', 'zh-TW': '東京大學醫學博士院長領銜醫療團隊。兵庫醫科大學研究支持的最先端免疫細胞療法', 'zh-CN': '东京大学医学博士院长领衔医疗团队。兵库医科大学研究支持的最先端免疫细胞疗法', en: 'Medical team led by a Tokyo University PhD director. Cutting-edge immunocell therapy backed by Hyogo Medical University research' } as Record<Language, string>,
  },
  {
    icon: <ShieldCheck size={24} />,
    title: { ja: 'GMP基準の治療環境', 'zh-TW': 'GMP標準治療環境', 'zh-CN': 'GMP标准治疗环境', en: 'GMP Standard Treatment Environment' } as Record<Language, string>,
    desc: { ja: '院内CPCはGMP（医薬品製造管理基準）レベルのクリーンルームを完備。安全性と品質を最優先', 'zh-TW': '院內CPC配備GMP（藥品生產管理標準）級別潔淨室。以安全性和品質為最優先', 'zh-CN': '院内CPC配备GMP（药品生产管理标准）级别洁净室。以安全性和品质为最优先', en: 'In-house CPC equipped with GMP-grade clean rooms. Safety and quality as top priorities' } as Record<Language, string>,
  },
  {
    icon: <Award size={24} />,
    title: { ja: '厚労省認可・再生医療計画19件', 'zh-TW': '厚勞省認可・再生醫療計劃19件', 'zh-CN': '厚劳省认可・再生医疗计划19件', en: '19 MHLW-Approved Regen. Medicine Plans' } as Record<Language, string>,
    desc: { ja: '厚生労働省に19件の再生医療等提供計画が受理。法令を遵守した安全かつ合法的な治療を提供', 'zh-TW': '厚生勞動省受理19件再生醫療提供計劃。遵守法規提供安全且合法的治療', 'zh-CN': '厚生劳动省受理19件再生医疗提供计划。遵守法规提供安全且合法的治疗', en: '19 regenerative medicine plans accepted by MHLW. Safe and legal treatments in full regulatory compliance' } as Record<Language, string>,
  },
];

const CORE_THERAPIES = [
  {
    icon: <Dna size={28} />,
    title: { ja: 'WT1樹状細胞ワクチン療法', 'zh-TW': 'WT1樹突狀細胞疫苗療法', 'zh-CN': 'WT1树突状细胞疫苗疗法', en: 'WT1 Dendritic Cell Vaccine Therapy' } as Record<Language, string>,
    desc: { ja: '患者の血液から単核球を採取し、樹状細胞へ培養。WT1抗原と結合させワクチンを製造。多重免疫メカニズムを活性化し、抗がん免疫力を強化します。', 'zh-TW': '從患者血液中提取單核細胞，培養為樹突狀細胞，結合WT1抗原製成疫苗。激活多重免疫機制，強化抗癌免疫力。', 'zh-CN': '从患者血液中提取单核细胞，培养为树突状细胞，结合WT1抗原制成疫苗。激活多重免疫机制，强化抗癌免疫力。', en: 'Monocytes extracted from patient blood are cultured into dendritic cells and combined with WT1 antigen to create a vaccine. Activates multiple immune mechanisms to strengthen anti-cancer immunity.' } as Record<Language, string>,
    color: 'from-blue-500 to-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    icon: <Shield size={28} />,
    title: { ja: '高活性NK細胞療法', 'zh-TW': '高活性NK細胞療法', 'zh-CN': '高活性NK细胞疗法', en: 'Highly Active NK Cell Therapy' } as Record<Language, string>,
    desc: { ja: '患者自身のNK細胞を体外で大量に増殖・活性化し、体内に戻す療法。副作用が少なく、身体への負担が低い。進行がん患者にも適用可能。', 'zh-TW': '將患者自身的NK細胞在體外大量增殖、活化後回輸體內。副作用少、身體負擔低，適用於晚期癌症患者。', 'zh-CN': '将患者自身的NK细胞在体外大量增殖、活化后回输体内。副作用少、身体负担低，适用于晚期癌症患者。', en: 'Patient\'s own NK cells are expanded and activated ex vivo, then reinfused. Low side effects and physical burden. Applicable to advanced cancer patients.' } as Record<Language, string>,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: <Zap size={28} />,
    title: { ja: 'NKT細胞活性化療法', 'zh-TW': 'NKT細胞活化療法', 'zh-CN': 'NKT细胞活化疗法', en: 'NKT Cell Activation Therapy' } as Record<Language, string>,
    desc: { ja: 'NKT細胞は先天免疫と獲得免疫の両方を発揮する特殊な免疫細胞。二重の免疫機能で包括的にがん細胞を攻撃します。', 'zh-TW': 'NKT細胞是同時發揮先天免疫和獲得性免疫的特殊免疫細胞。以雙重免疫功能全面攻擊癌細胞。', 'zh-CN': 'NKT细胞是同时发挥先天免疫和获得性免疫的特殊免疫细胞。以双重免疫功能全面攻击癌细胞。', en: 'NKT cells are unique immune cells that activate both innate and adaptive immunity. Comprehensively attacks cancer cells with dual immune functions.' } as Record<Language, string>,
    color: 'from-purple-500 to-fuchsia-600',
    bgColor: 'bg-purple-50',
  },
];

const APPLICABLE_CANCERS = [
  {
    icon: <Activity size={20} />,
    name: { ja: '肺がん', 'zh-TW': '肺癌', 'zh-CN': '肺癌', en: 'Lung Cancer' } as Record<Language, string>,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    icon: <CircleDot size={20} />,
    name: { ja: '胃がん', 'zh-TW': '胃癌', 'zh-CN': '胃癌', en: 'Stomach Cancer' } as Record<Language, string>,
    color: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    icon: <Heart size={20} />,
    name: { ja: '大腸がん', 'zh-TW': '大腸癌', 'zh-CN': '大肠癌', en: 'Colorectal Cancer' } as Record<Language, string>,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    icon: <Scan size={20} />,
    name: { ja: '肝臓がん', 'zh-TW': '肝癌', 'zh-CN': '肝癌', en: 'Liver Cancer' } as Record<Language, string>,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    icon: <FlaskConical size={20} />,
    name: { ja: '膵臓がん', 'zh-TW': '胰腺癌', 'zh-CN': '胰腺癌', en: 'Pancreatic Cancer' } as Record<Language, string>,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    icon: <Sparkles size={20} />,
    name: { ja: '乳がん', 'zh-TW': '乳腺癌', 'zh-CN': '乳腺癌', en: 'Breast Cancer' } as Record<Language, string>,
    color: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    icon: <Droplets size={20} />,
    name: { ja: '卵巣がん', 'zh-TW': '卵巢癌', 'zh-CN': '卵巢癌', en: 'Ovarian Cancer' } as Record<Language, string>,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    icon: <Shield size={20} />,
    name: { ja: '前立腺がん', 'zh-TW': '前列腺癌', 'zh-CN': '前列腺癌', en: 'Prostate Cancer' } as Record<Language, string>,
    color: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    icon: <Brain size={20} />,
    name: { ja: '脳腫瘍', 'zh-TW': '腦腫瘤', 'zh-CN': '脑肿瘤', en: 'Brain Tumor' } as Record<Language, string>,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    icon: <Dna size={20} />,
    name: { ja: '血液がん', 'zh-TW': '血液癌', 'zh-CN': '血液癌', en: 'Blood Cancer' } as Record<Language, string>,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
  },
];

const TREATMENT_FLOW = [
  {
    step: 1,
    title: { ja: '咨询・診察', 'zh-TW': '諮詢診察', 'zh-CN': '咨询诊察', en: 'Consultation & Examination' } as Record<Language, string>,
    desc: { ja: '初回無料カウンセリング。医師が詳細に病状を評価し、最適な治療プランをご提案します', 'zh-TW': '初次免費諮詢。醫師詳細評估病情，提出最適合的治療方案', 'zh-CN': '初次免费咨询。医师详细评估病情，提出最适合的治疗方案', en: 'Free initial counseling. Doctor performs detailed assessment and proposes optimal treatment plan' } as Record<Language, string>,
    icon: <Stethoscope size={20} />,
  },
  {
    step: 2,
    title: { ja: '検査・採血', 'zh-TW': '檢查採血', 'zh-CN': '检查采血', en: 'Testing & Blood Collection' } as Record<Language, string>,
    desc: { ja: '腫瘍マーカー検査、感染症検査を実施。成分採血（アフェレーシス）には3〜4時間かかります', 'zh-TW': '進行腫瘤標記物檢查、感染症檢查。成分採血（離心分離）需3-4小時', 'zh-CN': '进行肿瘤标记物检查、感染症检查。成分采血（离心分离）需3-4小时', en: 'Tumor marker tests and infection screening. Apheresis blood collection takes 3-4 hours' } as Record<Language, string>,
    icon: <Syringe size={20} />,
  },
  {
    step: 3,
    title: { ja: '細胞培養', 'zh-TW': '細胞培養', 'zh-CN': '细胞培养', en: 'Cell Culture' } as Record<Language, string>,
    desc: { ja: '院内GMP基準CPCで約3週間培養し、ワクチンを製造。厳格な品質管理のもとで実施', 'zh-TW': '在院內GMP標準CPC中培養約3週，製成疫苗。在嚴格品質管控下進行', 'zh-CN': '在院内GMP标准CPC中培养约3周，制成疫苗。在严格品质管控下进行', en: 'Cultured for ~3 weeks in GMP-grade in-house CPC to produce vaccine. Under strict quality control' } as Record<Language, string>,
    icon: <Microscope size={20} />,
  },
  {
    step: 4,
    title: { ja: '定期治療', 'zh-TW': '定期治療', 'zh-CN': '定期治疗', en: 'Periodic Treatment' } as Record<Language, string>,
    desc: { ja: '2週間ごとに皮内注射を実施。1回約30分、1クール7回の治療です', 'zh-TW': '每2週進行皮內注射。每次約30分鐘，1療程共7次', 'zh-CN': '每2周进行皮内注射。每次约30分钟，1疗程共7次', en: 'Intradermal injection every 2 weeks. ~30 min per session, 7 sessions per course' } as Record<Language, string>,
    icon: <CheckCircle size={20} />,
  },
];

const DOCTORS = [
  {
    name: { ja: '永井恒志', 'zh-TW': '永井恒志', 'zh-CN': '永井恒志', en: 'Dr. Koji Nagai' } as Record<Language, string>,
    role: { ja: '院長・医学博士（東京大学）', 'zh-TW': '院長・醫學博士（東京大學）', 'zh-CN': '院长・医学博士（东京大学）', en: 'Director, MD PhD (University of Tokyo)' } as Record<Language, string>,
    bio: { ja: '2003年金沢医科大学卒業。2015年東京大学にて医学博士号取得。2018年東海大学客員准教授。再生医療とがん免疫治療を専門とし、臨床と研究の両面から先端治療を推進。', 'zh-TW': '2003年金澤醫科大學畢業。2015年東京大學醫學博士。2018年東海大學客座副教授。專注再生醫療與癌症免疫治療，從臨床與研究兩方面推動先端治療。', 'zh-CN': '2003年金泽医科大学毕业。2015年东京大学医学博士。2018年东海大学客座副教授。专注再生医疗与癌症免疫治疗，从临床与研究两方面推动先端治疗。', en: 'Graduated Kanazawa Medical University 2003. PhD from University of Tokyo 2015. Visiting Associate Professor at Tokai University 2018. Specializes in regenerative medicine and cancer immunotherapy.' } as Record<Language, string>,
  },
  {
    name: { ja: '山原研一 教授', 'zh-TW': '山原研一 教授', 'zh-CN': '山原研一 教授', en: 'Prof. Kenichi Yamahara' } as Record<Language, string>,
    role: { ja: '兵庫医科大学教授', 'zh-TW': '兵庫醫科大學教授', 'zh-CN': '兵库医科大学教授', en: 'Professor, Hyogo Medical University' } as Record<Language, string>,
    bio: { ja: '細胞治療・再生医療分野のベテラン研究者。複合免疫細胞療法の研究開発と臨床応用を主導し、銀座鳳凰クリニックの技術基盤を支えています。', 'zh-TW': '細胞治療、再生醫療領域資深專家。主導複合免疫細胞療法的研發與臨床應用，支撐銀座鳳凰診所的技術基礎。', 'zh-CN': '细胞治疗、再生医疗领域资深专家。主导复合免疫细胞疗法的研发与临床应用，支撑银座凤凰诊所的技术基础。', en: 'Veteran researcher in cell therapy and regenerative medicine. Leads R&D and clinical application of combined immunocell therapy, forming the technical foundation of Ginza Phoenix Clinic.' } as Record<Language, string>,
  },
];

// ======================================
// 组件
// ======================================

interface GinzaPhoenixContentProps {
  isGuideEmbed?: boolean;
}

export default function GinzaPhoenixContent({ isGuideEmbed }: GinzaPhoenixContentProps) {
  const lang = useLanguage();
  const [expandedTherapy, setExpandedTherapy] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* ━━━━━━━━ Hero Section ━━━━━━━━ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src={GINZA_PHOENIX_HERO_IMAGE}
          alt="Ginza Phoenix Clinic"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/70 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            {/* 标签 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-white/40" />
              <span className="text-xs tracking-[0.3em] text-white/70 uppercase">
                {t.heroTagline[lang]}
              </span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-200 text-xs mb-6">
              <GraduationCap size={14} />
              {t.heroBadge[lang]}
            </div>

            {/* 标题 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
              {t.heroTitle[lang]}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">
              {t.heroSubtitle[lang]}
            </p>

            {/* 描述 */}
            <p className="text-base text-white/70 leading-relaxed mb-8 whitespace-pre-line max-w-xl">
              {t.heroText[lang]}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={isGuideEmbed ? '#consultation' : '/ginza-phoenix/initial-consultation'}
                className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                {t.ctaButton[lang]} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Stats Section ━━━━━━━━ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-4">{t.statsTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.statsTitle[lang]}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}<span className="text-lg text-gray-400 ml-1">{stat.unit[lang]}</span>
                </div>
                <div className="text-sm text-gray-500">{stat.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Why Choose Us ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-4">{t.whyTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.whyTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {WHY_CHOOSE_US.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title[lang]}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Applicable Cancers ━━━━━━━━ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full mb-4">{t.cancerTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.cancerTitle[lang]}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t.cancerSubtitle[lang]}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-10">
            {APPLICABLE_CANCERS.map((item, i) => (
              <div key={i} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${item.color} text-sm font-medium`}>
                {item.icon}
                <span>{item.name[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 3 Core Therapies ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-4">{t.therapyTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.therapyTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CORE_THERAPIES.map((therapy, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl border border-gray-100 ${therapy.bgColor} hover:shadow-lg transition-all cursor-pointer`}
                onClick={() => setExpandedTherapy(expandedTherapy === i ? null : i)}
              >
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${therapy.color} flex items-center justify-center text-white mb-5`}>
                    {therapy.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{therapy.title[lang]}</h3>
                  <p className={`text-sm text-gray-600 leading-relaxed ${expandedTherapy === i ? '' : 'line-clamp-3'}`}>
                    {therapy.desc[lang]}
                  </p>
                  <button className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                    {expandedTherapy === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expandedTherapy === i
                      ? (lang === 'en' ? 'Less' : lang === 'ja' ? '閉じる' : '收起')
                      : (lang === 'en' ? 'More' : lang === 'ja' ? 'もっと見る' : '展开')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Treatment Flow ━━━━━━━━ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-sky-50 text-sky-700 text-xs font-medium rounded-full mb-4">{t.flowTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.flowTitle[lang]}</h2>
          </div>
          <div className="space-y-0">
            {TREATMENT_FLOW.map((step, i) => (
              <div key={i} className="flex gap-6">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {step.step}
                  </div>
                  {i < TREATMENT_FLOW.length - 1 && (
                    <div className="w-0.5 h-full bg-blue-200 min-h-[60px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-600">{step.icon}</span>
                    <h3 className="text-lg font-bold text-gray-900">{step.title[lang]}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Medical Team ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full mb-4">{t.doctorTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.doctorTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{doc.name[lang]}</h3>
                <p className="text-sm text-blue-600 font-medium mb-3">{doc.role[lang]}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{doc.bio[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Access ━━━━━━━━ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-700 text-xs font-medium rounded-full mb-4">{t.accessTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.accessTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Building2 size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {lang === 'ja' ? '銀座鳳凰クリニック' :
                     lang === 'en' ? 'Ginza Phoenix Clinic' :
                     lang === 'zh-TW' ? '銀座鳳凰診所' :
                     '银座凤凰诊所'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '〒101-0021 東京都千代田区外神田4-14-1 秋葉原UDXビル6F クリニックモール' :
                     lang === 'en' ? '6F Clinic Mall, Akihabara UDX Bldg, 4-14-1 Sotokanda, Chiyoda-ku, Tokyo 101-0021' :
                     lang === 'zh-TW' ? '〒101-0021 東京都千代田區外神田4-14-1 秋葉原UDX大廈6F 診所商場' :
                     '〒101-0021 东京都千代田区外神田4-14-1 秋叶原UDX大厦6F 诊所商场'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Train size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? 'JR秋葉原駅 電気街口 徒歩2分 / 末広町駅 徒歩3分' :
                     lang === 'en' ? 'JR Akihabara Sta. Electric Town Exit — 2 min walk / Suehirocho Sta. — 3 min walk' :
                     lang === 'zh-TW' ? 'JR秋葉原站 電器街出口 步行2分鐘 / 末廣町站 步行3分鐘' :
                     'JR秋叶原站 电器街出口 步行2分钟 / 末广町站 步行3分钟'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">10:00 - 17:00</p>
                  <p className="text-xs text-gray-400">
                    {lang === 'ja' ? '月〜日（祝日含む）' :
                     lang === 'en' ? 'Mon-Sun (including holidays)' :
                     lang === 'zh-TW' ? '週一至週日（含假日）' :
                     '周一至周日（含假日）'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">03-6263-8163</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '株式会社青山名城国際医療研究所' :
                     lang === 'en' ? 'Aoyama Meijo International Medical Research Institute Co., Ltd.' :
                     lang === 'zh-TW' ? '株式會社青山名城國際醫療研究所' :
                     '株式会社青山名城国际医疗研究所'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {lang === 'ja' ? '兵庫医科大学発ベンチャー' :
                     lang === 'en' ? 'Hyogo Medical University Venture' :
                     lang === 'zh-TW' ? '兵庫醫科大學創投企業' :
                     '兵库医科大学创投企业'}
                  </p>
                </div>
              </div>
            </div>

            {/* 治療特色 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={18} className="text-blue-600" />
                {lang === 'ja' ? '治療の特長' : lang === 'en' ? 'Treatment Features' : lang === 'zh-TW' ? '治療特色' : '治疗特色'}
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <p>{lang === 'ja' ? '初回カウンセリング無料' : lang === 'en' ? 'Free initial counseling' : lang === 'zh-TW' ? '初次諮詢免費' : '初次咨询免费'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <p>{lang === 'ja' ? '手術・化学療法・放射線との併用可能' : lang === 'en' ? 'Can combine with surgery, chemo & radiation' : lang === 'zh-TW' ? '可與手術、化療、放療併用' : '可与手术、化疗、放疗并用'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <p>{lang === 'ja' ? 'ステージIV・進行がんにも対応' : lang === 'en' ? 'Applicable to Stage IV & advanced cancers' : lang === 'zh-TW' ? '適用於Stage IV、晚期癌症' : '适用于Stage IV、晚期癌症'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <p>{lang === 'ja' ? '副作用が少なく、身体負担が低い' : lang === 'en' ? 'Low side effects and physical burden' : lang === 'zh-TW' ? '副作用少、身體負擔低' : '副作用少、身体负担低'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <p>{lang === 'ja' ? '院内GMP基準CPC完備' : lang === 'en' ? 'In-house GMP-grade CPC facility' : lang === 'zh-TW' ? '院內GMP標準CPC設施完備' : '院内GMP标准CPC设施完备'}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare size={18} className="text-gray-400" />
                  {lang === 'ja' ? 'お問い合わせ' : lang === 'en' ? 'Contact' : '联系方式'}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>TEL: 03-6263-8163</p>
                  <p>
                    {lang === 'ja' ? '診療時間: 10:00-17:00（月〜日・祝日含む）' :
                     lang === 'en' ? 'Hours: 10:00-17:00 (Mon-Sun, incl. holidays)' :
                     lang === 'zh-TW' ? '診療時間: 10:00-17:00（週一至週日、含假日）' :
                     '诊疗时间: 10:00-17:00（周一至周日、含假日）'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Consultation CTA ━━━━━━━━ */}
      <section id="consultation" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle[lang]}</h2>
          <p className="text-lg text-white/70 mb-3">{t.ctaSubtitle[lang]}</p>
          <p className="text-white/50 text-sm mb-8">{t.freeConsultation[lang]}</p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-lg mx-auto mb-8 border border-white/10">
            <h3 className="font-bold text-lg mb-2">{t.consultation[lang]}</h3>
            <p className="text-sm text-white/60 mb-6">{t.consultationDesc[lang]}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={isGuideEmbed ? '#consultation' : '/ginza-phoenix/initial-consultation'}
                className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
              >
                {t.ctaButton[lang]} <ArrowRight size={18} />
              </Link>
              <Link
                href={isGuideEmbed ? '#consultation' : '/ginza-phoenix/remote-consultation'}
                className="inline-flex items-center justify-center gap-3 bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all border border-white/20"
              >
                {t.ctaButtonRemote[lang]} <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-8 text-sm text-white/50">
            <span className="flex items-center gap-2"><Lock size={14} /> {lang === 'ja' ? '安全なお支払い' : lang === 'en' ? 'Secure Payment' : '安全支付'}</span>
            <span className="flex items-center gap-2"><Shield size={14} /> {lang === 'ja' ? '持牌旅行社保障' : lang === 'en' ? 'Licensed Travel Agency' : '持牌旅行社保障'}</span>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Legal Footer (白标模式下由 layout 提供) ━━━━━━━━ */}
      {!isGuideEmbed && (
        <section className="py-6 bg-gray-100 text-center">
          <p className="text-xs text-gray-400">
            {lang === 'ja'
              ? '旅行サービスは 新島交通株式会社 が提供 ｜ 大阪府知事登録旅行業 第2-3115号'
              : lang === 'en'
              ? 'Travel services provided by Niijima Kotsu Co., Ltd. | Osaka Prefecture Registered Travel Agency No. 2-3115'
              : '旅行服务由 新岛交通株式会社 提供 ｜ 大阪府知事登録旅行業 第2-3115号'}
          </p>
        </section>
      )}
    </div>
  );
}
