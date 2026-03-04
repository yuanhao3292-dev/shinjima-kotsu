'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Train,
  Award, Stethoscope, Activity, Users, Shield,
  Heart, Pill,
  Microscope, CheckCircle,
  ExternalLink, FileText,
  HeartPulse, Scan,
  ArrowRight, Globe, Mail, MessageSquare,
  Dna, Target, Radio, FlaskConical, Bot, Clock
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';

// ======================================
// Props
// ======================================
interface Props {
  isGuideEmbed?: boolean;
  guideSlug?: string;
}

// ======================================
// Image Assets
// ======================================
const OICI_IMAGES = {
  exterior:  'https://www.nihonsekkei.co.jp/wp-content/uploads/2017/07/3c692a8b8911831af2d1fd6bfcd4e0e7.jpg',
  entrance:  'https://www.nihonsekkei.co.jp/wp-content/uploads/2017/07/4745774cffea3ed84559ed19c1439039.jpg',
  corridor:  'https://www.nihonsekkei.co.jp/wp-content/uploads/2017/07/b218fab3cfbf381734820ea138be5286.jpg',
  dayRoom:   'https://www.nihonsekkei.co.jp/wp-content/uploads/2017/07/260cfade06cbf22b775b4dc9e67ad9d0.jpg',
  room:      'https://www.nihonsekkei.co.jp/wp-content/uploads/2017/07/85cfc6f26230ae1a49490969cdb2108e.jpg',
  building1: 'https://www.takenaka.co.jp/majorworks/images/41404192016_01_l.jpg',
  building2: 'https://www.takenaka.co.jp/majorworks/images/41404192016_02_l.jpg',
  interior1: 'https://www.takenaka.co.jp/majorworks/images/41404192016_03_l.jpg',
  interior2: 'https://www.takenaka.co.jp/majorworks/images/41404192016_04_l.jpg',
  interior3: 'https://www.takenaka.co.jp/majorworks/images/41404192016_05_l.jpg',
  // OICI 官网 da Vinci 机器人手术相关图片
  daVinciSystem: 'https://oici.jp/file/202011/img_davinci_intro01.png',
  robotCenter:   'https://oici.jp/file/202509/img_ganrobotcenter01.jpg',
  daVinciConsole: 'https://oici.jp/file/202011/img_davinci02.png',
} as const;

// ======================================
// Translations
// ======================================
const tr = {
  heroTitle1: {
    ja: '大阪国際がんセンター',
    'zh-TW': '大阪國際癌症中心',
    'zh-CN': '大阪国际癌症中心',
    en: 'Osaka International Cancer Center',
  } as Record<Language, string>,
  heroTitle2: {
    ja: '大阪府唯一のがん専門病院',
    'zh-TW': '大阪府唯一癌症專科醫院',
    'zh-CN': '大阪府唯一癌症专科医院',
    en: "Osaka's Only Specialized Cancer Hospital",
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '1959年設立 — 日本初のがん・循環器疾患専門施設',
    'zh-TW': '1959年設立 — 日本首家癌症·心血管疾病專門機構',
    'zh-CN': '1959年设立 — 日本首家癌症·心血管疾病专门机构',
    en: 'Est. 1959 — Japan\'s First Specialized Cancer & Cardiovascular Facility',
  } as Record<Language, string>,
  limitBadge: {
    ja: '月10名様限定・セカンドオピニオン対応可',
    'zh-TW': '每月限10位·可提供第二意見',
    'zh-CN': '每月限10位·可提供第二意见',
    en: 'Limited 10/month · Second Opinion Available',
  } as Record<Language, string>,

  // Designation bar
  designation1: {
    ja: '特定機能病院・がんゲノム医療拠点',
    'zh-TW': '特定功能醫院·基因組醫療中心',
    'zh-CN': '特定功能医院·基因组医疗中心',
    en: 'Special Function Hospital & Genome Hub',
  } as Record<Language, string>,
  designation2: {
    ja: '大阪府がん診療連携拠点病院',
    'zh-TW': '大阪府癌症診療中心',
    'zh-CN': '大阪府癌症诊疗中心',
    en: 'Prefectural Cancer Diagnosis Hub',
  } as Record<Language, string>,
  designation3: {
    ja: '大阪府66施設のがん登録データ統括',
    'zh-TW': '統括大阪府66家機構癌症數據',
    'zh-CN': '统括大阪府66家机构癌症数据',
    en: 'Cancer registry data from 66 Osaka facilities',
  } as Record<Language, string>,

  // Stats
  statsTag: {
    ja: '病院の実力', 'zh-TW': '醫院實力', 'zh-CN': '医院实力', en: 'Hospital Strength',
  } as Record<Language, string>,
  statsTitle: {
    ja: '数字で見る大阪国際がんセンター', 'zh-TW': '數字看大阪國際癌症中心', 'zh-CN': '数字看大阪国际癌症中心', en: 'OICI by the Numbers',
  } as Record<Language, string>,

  // Facility gallery
  facilityTag: {
    ja: '施設紹介', 'zh-TW': '設施介紹', 'zh-CN': '设施介绍', en: 'Hospital Facilities',
  } as Record<Language, string>,
  facilityTitle: {
    ja: '2017年新築の最新鋭施設', 'zh-TW': '2017年新建的最先進設施', 'zh-CN': '2017年新建的最先进设施', en: 'State-of-the-Art Facility Built in 2017',
  } as Record<Language, string>,
  facilityDesc: {
    ja: '地上13階建・延床面積 68,329㎡ — 大阪城を望む最新のがん治療拠点',
    'zh-TW': '地上13層·總樓面積 68,329㎡ — 可眺望大阪城的最新癌症治療中心',
    'zh-CN': '地上13层·总建筑面积 68,329㎡ — 可眺望大阪城的最新癌症治疗中心',
    en: '13 Stories · 68,329㎡ — State-of-the-art cancer treatment hub overlooking Osaka Castle',
  } as Record<Language, string>,
  facilityEntrance: {
    ja: '外来エントランスホール', 'zh-TW': '門診大廳', 'zh-CN': '门诊大厅', en: 'Outpatient Entrance Hall',
  } as Record<Language, string>,
  facilityCorridor: {
    ja: '外来診療廊下', 'zh-TW': '門診走廊', 'zh-CN': '门诊走廊', en: 'Outpatient Corridor',
  } as Record<Language, string>,
  facilityDayRoom: {
    ja: '病棟デイルーム（大阪城一望）', 'zh-TW': '病棟休息室（可眺望大阪城）', 'zh-CN': '病栋休息室（可眺望大阪城）', en: 'Ward Day Room (Osaka Castle View)',
  } as Record<Language, string>,
  facilityRoom: {
    ja: '個室病室', 'zh-TW': '個人病房', 'zh-CN': '个人病房', en: 'Private Room',
  } as Record<Language, string>,

  // Centers
  centersTag: {
    ja: '8つの専門センター', 'zh-TW': '8大專科中心', 'zh-CN': '8大专科中心', en: '8 Specialty Centers',
  } as Record<Language, string>,
  centersTitle: {
    ja: 'がん種別専門センター', 'zh-TW': '癌種專科中心', 'zh-CN': '癌种专科中心', en: 'Cancer-Specific Specialty Centers',
  } as Record<Language, string>,
  centersDesc: {
    ja: '各がん種に特化した専門チームで、最善の治療をご提供', 'zh-TW': '各癌種專業團隊，提供最佳治療方案', 'zh-CN': '各癌种专业团队，提供最佳治疗方案', en: 'Specialized teams for each cancer type, delivering optimal treatment',
  } as Record<Language, string>,

  // Treatments
  treatTag: {
    ja: '先端治療技術', 'zh-TW': '先進治療技術', 'zh-CN': '先进治疗技术', en: 'Advanced Treatments',
  } as Record<Language, string>,
  treatTitle: {
    ja: '最先端のがん治療', 'zh-TW': '最先進的癌症治療', 'zh-CN': '最先进的癌症治疗', en: 'Cutting-Edge Cancer Treatment',
  } as Record<Language, string>,

  // Robot
  robotTag: {
    ja: 'ロボット手術センター', 'zh-TW': '機器人手術中心', 'zh-CN': '机器人手术中心', en: 'Robotic Surgery Center',
  } as Record<Language, string>,
  robotTitle: {
    ja: 'da Vinci Xi 3台体制 — 関西最多の実績', 'zh-TW': 'da Vinci Xi 3台體制 — 關西最多實績', 'zh-CN': 'da Vinci Xi 3台体制 — 关西最多实绩', en: '3 da Vinci Xi Systems — Most Cases in Kansai',
  } as Record<Language, string>,
  robotDesc: {
    ja: '泌尿器・消化器・呼吸器・婦人科・頭頸部・肝胆膵・乳腺・整形外科の8科でロボット支援手術を実施。年間500件以上、関西で最多の実績を誇ります。',
    'zh-TW': '泌尿科·消化科·呼吸科·婦科·頭頸部·肝膽胰·乳腺·整形外科8科實施機器人輔助手術。年500+件，關西最多實績。',
    'zh-CN': '泌尿科·消化科·呼吸科·妇科·头颈部·肝胆胰·乳腺·整形外科8科实施机器人辅助手术。年500+件，关西最多实绩。',
    en: 'Robot-assisted surgery across 8 departments: urology, GI, respiratory, gynecology, head/neck, HPB, breast, orthopedics. 500+ cases/year — most in Kansai.',
  } as Record<Language, string>,
  robotStat1: { ja: '年間 500+ 件', 'zh-TW': '年 500+ 件', 'zh-CN': '年 500+ 件', en: '500+ / Year' } as Record<Language, string>,
  robotStat2: { ja: '8診療科で実施', 'zh-TW': '8科實施', 'zh-CN': '8科实施', en: '8 Departments' } as Record<Language, string>,
  robotStat3: { ja: 'da Vinci Xi 3台', 'zh-TW': 'da Vinci Xi 3台', 'zh-CN': 'da Vinci Xi 3台', en: '3 da Vinci Xi' } as Record<Language, string>,

  // Departments
  deptsTag: {
    ja: '専門診療科', 'zh-TW': '專科診療', 'zh-CN': '专科诊疗', en: 'Clinical Departments',
  } as Record<Language, string>,
  deptsTitle: {
    ja: 'がん医療部門 20+ 診療科', 'zh-TW': '癌症醫療部門 20+ 診療科', 'zh-CN': '癌症医疗部门 20+ 诊疗科', en: 'Cancer Division 20+ Departments',
  } as Record<Language, string>,

  // Flow
  flowTag: {
    ja: '治療フロー', 'zh-TW': '治療流程', 'zh-CN': '治疗流程', en: 'Treatment Flow',
  } as Record<Language, string>,
  flowTitle: {
    ja: '海外患者の治療フロー', 'zh-TW': '海外患者治療流程', 'zh-CN': '海外患者治疗流程', en: 'International Patient Treatment Flow',
  } as Record<Language, string>,
  flowDesc: {
    ja: '初回相談から治療完了まで、全行程プロフェッショナルサポート', 'zh-TW': '從前期諮詢到治療完成，全程專業支援', 'zh-CN': '从前期咨询到治疗完成，全程专业支援', en: 'Professional support from initial consultation to treatment completion',
  } as Record<Language, string>,

  // Service
  svcTag: {
    ja: 'サービスご予約', 'zh-TW': '服務預約', 'zh-CN': '服务预约', en: 'Book Service',
  } as Record<Language, string>,
  svcTitle: {
    ja: '相談サービス', 'zh-TW': '諮詢服務', 'zh-CN': '咨询服务', en: 'Consultation Services',
  } as Record<Language, string>,
  svcDesc: {
    ja: 'ご希望のサービスを選択し、お支払い後24時間以内にご連絡いたします', 'zh-TW': '選擇您需要的服務，支付後24小時內與您聯繫', 'zh-CN': '选择您需要的服务，支付后24小时内与您联系', en: 'Select a service, we will contact you within 24 hours after payment',
  } as Record<Language, string>,

  // Contact
  contactTitle: {
    ja: 'お支払い前のご質問はお気軽に', 'zh-TW': '付款前有疑問？歡迎諮詢', 'zh-CN': '付款前有疑问？欢迎咨询', en: 'Questions? Contact us before payment',
  } as Record<Language, string>,

  // Research & Innovation
  researchTag: {
    ja: '研究・イノベーション', 'zh-TW': '研究·創新', 'zh-CN': '研究·创新', en: 'Research & Innovation',
  } as Record<Language, string>,
  researchTitle: {
    ja: 'がん研究所 — 次世代がん医療の開発拠点', 'zh-TW': '癌症研究所 — 新一代癌症醫療研發中心', 'zh-CN': '癌症研究所 — 新一代癌症医疗研发中心', en: 'Cancer Research Institute — Next-Gen Cancer Medicine Hub',
  } as Record<Language, string>,
  researchDesc: {
    ja: '研究所併設型がん専門病院として、基礎研究から臨床応用まで一貫した体制を構築', 'zh-TW': '作為設有研究所的癌症專科醫院，從基礎研究到臨床應用一體化', 'zh-CN': '作为设有研究所的癌症专科医院，从基础研究到临床应用一体化', en: 'As a research institute-integrated cancer hospital, seamless from basic research to clinical application',
  } as Record<Language, string>,

  // Patient Support
  supportTag: {
    ja: '患者サポート', 'zh-TW': '患者支援', 'zh-CN': '患者支持', en: 'Patient Support',
  } as Record<Language, string>,
  supportTitle: {
    ja: '総合的な患者支援体制', 'zh-TW': '全方位患者支援體系', 'zh-CN': '全方位患者支持体系', en: 'Comprehensive Patient Support System',
  } as Record<Language, string>,
  supportDesc: {
    ja: '治療だけでなく、患者の心身両面をトータルにサポート', 'zh-TW': '不僅治療，全面支援患者身心', 'zh-CN': '不仅治疗，全面支持患者身心', en: 'Supporting patients holistically — mind and body, beyond just treatment',
  } as Record<Language, string>,

  // History
  historyTag: {
    ja: '沿革', 'zh-TW': '歷史沿革', 'zh-CN': '历史沿革', en: 'History',
  } as Record<Language, string>,
  historyTitle: {
    ja: '65年以上の歴史 — 日本のがん医療を牽引', 'zh-TW': '65年以上歷史 — 引領日本癌症醫療', 'zh-CN': '65年以上历史 — 引领日本癌症医疗', en: '65+ Years of History — Leading Cancer Medicine in Japan',
  } as Record<Language, string>,

  // Common
  bookNow: { ja: '今すぐ予約', 'zh-TW': '立即預約', 'zh-CN': '立即预约', en: 'Book Now' } as Record<Language, string>,
  taxIncl: { ja: '日円（税込）', 'zh-TW': '日圓（含稅）', 'zh-CN': '日元（含税）', en: 'JPY (tax incl.)' } as Record<Language, string>,
  consultPlan: { ja: '治療プランを相談', 'zh-TW': '諮詢治療方案', 'zh-CN': '咨询治疗方案', en: 'Consult Treatment Plan' } as Record<Language, string>,
  viewFlow: { ja: '治療の流れを見る', 'zh-TW': '了解治療流程', 'zh-CN': '了解治疗流程', en: 'View Treatment Flow' } as Record<Language, string>,
};

// ======================================
// Data: Key Stats
// ======================================
const KEY_STATS = [
  {
    value: '69%',
    label: { ja: '全がん5年相対生存率', 'zh-TW': '全癌五年相對生存率', 'zh-CN': '全癌五年相对生存率', en: '5-Year Relative Survival' } as Record<Language, string>,
    sub: { ja: '全国トップクラス', 'zh-TW': '全國頂級水準', 'zh-CN': '全国顶级水准', en: 'Among best in Japan' } as Record<Language, string>,
  },
  {
    value: '4,270+',
    label: { ja: '年間手術件数', 'zh-TW': '年手術量', 'zh-CN': '年手术量', en: 'Annual Surgeries' } as Record<Language, string>,
    sub: { ja: '主に悪性腫瘍', 'zh-TW': '主要為惡性腫瘤', 'zh-CN': '主要为恶性肿瘤', en: 'Primarily malignant tumors' } as Record<Language, string>,
  },
  {
    value: '37',
    label: { ja: '診療科', 'zh-TW': '診療科', 'zh-CN': '诊疗科', en: 'Departments' } as Record<Language, string>,
    sub: { ja: 'がん専門科を網羅', 'zh-TW': '涵蓋癌症專科', 'zh-CN': '涵盖癌症专科', en: 'Comprehensive cancer specialties' } as Record<Language, string>,
  },
  {
    value: '500',
    label: { ja: '病床数', 'zh-TW': '病床數', 'zh-CN': '病床数', en: 'Hospital Beds' } as Record<Language, string>,
    sub: { ja: 'がん専門施設', 'zh-TW': '癌症專科設施', 'zh-CN': '癌症专科设施', en: 'Cancer-specialized facility' } as Record<Language, string>,
  },
  {
    value: '1,255',
    label: { ja: '1日外来患者数', 'zh-TW': '每日門診患者數', 'zh-CN': '每日门诊患者数', en: 'Daily Outpatients' } as Record<Language, string>,
    sub: { ja: '平均 1,254.5人/日', 'zh-TW': '平均 1,254.5人/日', 'zh-CN': '平均 1,254.5人/日', en: 'Average 1,254.5/day' } as Record<Language, string>,
  },
  {
    value: '148+',
    label: { ja: '専門医師数', 'zh-TW': '專科醫師數', 'zh-CN': '专科医师数', en: 'Physicians' } as Record<Language, string>,
    sub: { ja: '医師148名・歯科医2名・レジデント55名', 'zh-TW': '醫師148名·牙醫2名·住院醫55名', 'zh-CN': '医师148名·牙医2名·住院医55名', en: '148 doctors, 2 dentists, 55 residents' } as Record<Language, string>,
  },
  {
    value: '500+',
    label: { ja: 'ロボット手術件数/年', 'zh-TW': '年機器人手術件數', 'zh-CN': '年机器人手术件数', en: 'Robot Surgeries / Year' } as Record<Language, string>,
    sub: { ja: '関西最多', 'zh-TW': '關西最多', 'zh-CN': '关西最多', en: 'Most in Kansai' } as Record<Language, string>,
  },
  {
    value: '1,100+',
    label: { ja: 'セカンドオピニオン件数/年', 'zh-TW': '年第二意見件數', 'zh-CN': '年第二意见件数', en: 'Second Opinions / Year' } as Record<Language, string>,
    sub: { ja: '全国5位', 'zh-TW': '全國第5', 'zh-CN': '全国第5', en: 'Ranked #5 in Japan' } as Record<Language, string>,
  },
];

// ======================================
// Data: 8 Specialty Centers
// ======================================
const SPECIALTY_CENTERS = [
  {
    icon: 'stomach',
    name: { ja: '胃がんセンター', 'zh-TW': '胃癌中心', 'zh-CN': '胃癌中心', en: 'Gastric Cancer Center' } as Record<Language, string>,
    desc: { ja: '2024年実績：手術の100%を低侵襲化（うち92%がロボット支援手術）。山本主任医長を中心に消化管内科・消化器外科が一体診療。早期ESD内視鏡から先進ロボット手術まで全段階対応', 'zh-TW': '2024年：100%微創手術（92%機器人手術）。山本主任主導消化內科·外科一體診療。從早期ESD內鏡到先進機器人手術全階段對應', 'zh-CN': '2024年：100%微创手术（92%机器人手术）。山本主任主导消化内科·外科一体诊疗。从早期ESD内镜到先进机器人手术全阶段对应', en: '2024: 100% minimally invasive (92% robotic). Director Yamamoto leads integrated GI medicine & surgery. Full-spectrum from early ESD to advanced robotic surgery' } as Record<Language, string>,
    stats: { ja: '2024年 ロボット手術率 92%', 'zh-TW': '2024年 機器人手術率 92%', 'zh-CN': '2024年 机器人手术率 92%', en: '2024: 92% Robotic Surgery Rate' } as Record<Language, string>,
  },
  {
    icon: 'lung',
    name: { ja: '肺がんセンター', 'zh-TW': '肺癌中心', 'zh-CN': '肺癌中心', en: 'Lung Cancer Center' } as Record<Language, string>,
    desc: { ja: '呼吸器内科・呼吸器外科の協力体制。年間380+件の手術、VATS・ロボット手術を駆使', 'zh-TW': '呼吸內科·外科協作。年手術380+件，運用VATS·機器人手術', 'zh-CN': '呼吸内科·外科协作。年手术380+件，运用VATS·机器人手术', en: 'Respiratory medicine & surgery cooperate. 380+ surgeries/year with VATS & robotic assistance' } as Record<Language, string>,
    stats: { ja: '年間手術 380+ 件', 'zh-TW': '年手術 380+ 件', 'zh-CN': '年手术 380+ 件', en: '380+ surgeries/year' } as Record<Language, string>,
  },
  {
    icon: 'rectum',
    name: { ja: '直腸がんセンター', 'zh-TW': '直腸癌中心', 'zh-CN': '直肠癌中心', en: 'Rectal Cancer Center' } as Record<Language, string>,
    desc: { ja: '2024年：大腸がん手術の97.6%を低侵襲化、うち70%がロボット支援。肛門温存・排尿機能温存で患者QOLを最大化', 'zh-TW': '2024年：大腸癌手術97.6%微創化，70%機器人輔助。保肛·保排尿功能最大化QOL', 'zh-CN': '2024年：大肠癌手术97.6%微创化，70%机器人辅助。保肛·保排尿功能最大化QOL', en: '2024: 97.6% minimally invasive for colorectal, 70% robotic. Function-preserving for maximum QOL' } as Record<Language, string>,
    stats: { ja: '2024年 低侵襲率 97.6%', 'zh-TW': '2024年 微創率 97.6%', 'zh-CN': '2024年 微创率 97.6%', en: '2024: 97.6% Minimally Invasive' } as Record<Language, string>,
  },
  {
    icon: 'pancreas',
    name: { ja: '膵がんセンター', 'zh-TW': '胰腺癌中心', 'zh-CN': '胰腺癌中心', en: 'Pancreatic Cancer Center' } as Record<Language, string>,
    desc: { ja: '難治がんの代表・膵臓がんに対し、肝胆膵内科・消化器外科が協力。年間300+件', 'zh-TW': '針對難治性胰腺癌，肝膽胰內科·消化外科協作。年300+件', 'zh-CN': '针对难治性胰腺癌，肝胆胰内科·消化外科协作。年300+件', en: 'Hepatobiliary-pancreatic medicine & surgery cooperate for this difficult cancer. 300+ cases/year' } as Record<Language, string>,
    stats: { ja: '肝胆膵手術 年間 300+ 件', 'zh-TW': '年肝膽胰手術 300+ 件', 'zh-CN': '年肝胆胰手术 300+ 件', en: '300+ hepatobiliary-pancreatic surgeries/year' } as Record<Language, string>,
  },
  {
    icon: 'breast',
    name: { ja: '乳腺センター', 'zh-TW': '乳腺中心', 'zh-CN': '乳腺中心', en: 'Breast Center' } as Record<Language, string>,
    desc: { ja: 'ロボット支援乳頭温存乳房切除術（NSM）を導入。腋窩部から3-4cmの小切開のみで手術完了。乳がん手術におけるロボット導入は全国でも先駆的な取り組み', 'zh-TW': '引入機器人輔助保乳頭乳房切除術（NSM）。僅腋下3-4cm小切口即可完成手術。乳癌機器人手術的全國先驅', 'zh-CN': '引入机器人辅助保乳头乳房切除术（NSM）。仅腋下3-4cm小切口即可完成手术。乳癌机器人手术的全国先驱', en: 'Pioneer in robot-assisted nipple-sparing mastectomy (NSM). Only 3-4cm axillary incision. Leading nationwide in robotic breast surgery' } as Record<Language, string>,
    stats: { ja: '全国先駆的 ロボット乳腺手術', 'zh-TW': '全國先驅 機器人乳腺手術', 'zh-CN': '全国先驱 机器人乳腺手术', en: 'Pioneering Robotic Breast Surgery' } as Record<Language, string>,
  },
  {
    icon: 'rare',
    name: { ja: '希少がんセンター', 'zh-TW': '罕見癌中心', 'zh-CN': '罕见癌中心', en: 'Rare Cancer Center' } as Record<Language, string>,
    desc: { ja: '通常の病院では対応困難な希少がん・難治がんの診断・治療を専門的に実施', 'zh-TW': '專門診治一般醫院難以應對的罕見癌·難治癌', 'zh-CN': '专门诊治一般医院难以应对的罕见癌·难治癌', en: 'Specialized diagnosis and treatment of rare and intractable cancers' } as Record<Language, string>,
    stats: { ja: '地域連携の高度紹介制', 'zh-TW': '區域聯動高級轉介制', 'zh-CN': '区域联动高级转介制', en: 'Advanced referral network' } as Record<Language, string>,
  },
  {
    icon: 'robot',
    name: { ja: 'がんロボット手術センター', 'zh-TW': '癌症機器人手術中心', 'zh-CN': '癌症机器人手术中心', en: 'Cancer Robotic Surgery Center' } as Record<Language, string>,
    desc: { ja: 'da Vinci Xi 3台体制。泌尿器・消化器・呼吸器・婦人科・頭頸部・肝胆膵・乳腺の8科で実施', 'zh-TW': 'da Vinci Xi 3台。泌尿·消化·呼吸·婦科·頭頸·肝膽胰·乳腺8科實施', 'zh-CN': 'da Vinci Xi 3台。泌尿·消化·呼吸·妇科·头颈·肝胆胰·乳腺8科实施', en: '3 da Vinci Xi systems. 8 departments: urology, GI, respiratory, gynecology, head/neck, HPB, breast' } as Record<Language, string>,
    stats: { ja: '年間 500+ 件 / 関西最多', 'zh-TW': '年 500+ 件 / 關西最多', 'zh-CN': '年 500+ 件 / 关西最多', en: '500+ cases/year / Most in Kansai' } as Record<Language, string>,
  },
  {
    icon: 'endoscopy',
    name: { ja: '内視鏡センター', 'zh-TW': '內視鏡中心', 'zh-CN': '内视镜中心', en: 'Endoscopy Center' } as Record<Language, string>,
    desc: { ja: '上部・下部消化管内視鏡、ESD（内視鏡的粘膜下層剥離術）などの早期がん治療に対応', 'zh-TW': '上下消化道內視鏡、ESD（內鏡黏膜下層剝離術）等早期癌症治療', 'zh-CN': '上下消化道内视镜、ESD（内镜黏膜下层剥离术）等早期癌症治疗', en: 'Upper/lower GI endoscopy, ESD for early-stage cancer treatment' } as Record<Language, string>,
    stats: { ja: 'ESD・EMR 専門', 'zh-TW': 'ESD·EMR 專業', 'zh-CN': 'ESD·EMR 专业', en: 'ESD/EMR specialists' } as Record<Language, string>,
  },
];

// ======================================
// Data: Clinical Departments
// ======================================
const DEPARTMENTS = [
  {
    category: { ja: 'がん医療部門（内科系）', 'zh-TW': '癌症醫療部門（內科系）', 'zh-CN': '癌症医疗部门（内科系）', en: 'Cancer Division (Internal Medicine)' } as Record<Language, string>,
    depts: [
      { ja: '消化管内科', 'zh-CN': '消化道内科', en: 'Gastrointestinal Medicine' },
      { ja: '肝胆膵内科', 'zh-CN': '肝胆胰内科', en: 'Hepatobiliary-Pancreatic Medicine' },
      { ja: '呼吸器内科', 'zh-CN': '呼吸内科', en: 'Respiratory Medicine' },
      { ja: '血液内科', 'zh-CN': '血液内科', en: 'Hematology' },
      { ja: '腫瘍内科', 'zh-CN': '肿瘤内科', en: 'Medical Oncology' },
    ],
  },
  {
    category: { ja: 'がん医療部門（外科系）', 'zh-TW': '癌症醫療部門（外科系）', 'zh-CN': '癌症医疗部门（外科系）', en: 'Cancer Division (Surgery)' } as Record<Language, string>,
    depts: [
      { ja: '消化器外科', 'zh-CN': '消化外科', en: 'Gastrointestinal Surgery' },
      { ja: '呼吸器外科', 'zh-CN': '胸外科', en: 'Thoracic Surgery' },
      { ja: '乳腺・内分泌外科', 'zh-CN': '乳腺·内分泌外科', en: 'Breast & Endocrine Surgery' },
      { ja: '脳神経外科', 'zh-CN': '神经外科', en: 'Neurosurgery' },
      { ja: '婦人科', 'zh-CN': '妇科', en: 'Gynecology' },
      { ja: '泌尿器科', 'zh-CN': '泌尿科', en: 'Urology' },
      { ja: '頭頸部外科', 'zh-CN': '头颈外科', en: 'Head & Neck Surgery' },
      { ja: '整形外科/骨軟部腫瘍科', 'zh-CN': '骨科/骨软组织肿瘤科', en: 'Orthopedics / Bone & Soft Tissue Tumors' },
      { ja: '形成外科', 'zh-CN': '整形外科', en: 'Plastic Surgery' },
    ],
  },
  {
    category: { ja: '中央診療・支持医療', 'zh-TW': '中央診療·支持醫療', 'zh-CN': '中央诊疗·支持医疗', en: 'Central & Supportive Care' } as Record<Language, string>,
    depts: [
      { ja: '放射線腫瘍科', 'zh-CN': '放射肿瘤科', en: 'Radiation Oncology' },
      { ja: 'がんゲノム診療科', 'zh-CN': '癌症基因组诊疗科', en: 'Cancer Genomics' },
      { ja: '遺伝性腫瘍診療科', 'zh-CN': '遗传性肿瘤诊疗科', en: 'Hereditary Tumor Medicine' },
      { ja: '外来化学療法科', 'zh-CN': '门诊化疗科', en: 'Outpatient Chemotherapy' },
      { ja: '支持・緩和医療科', 'zh-CN': '支持·姑息医疗科', en: 'Supportive & Palliative Care' },
      { ja: '腫瘍循環器科', 'zh-CN': '肿瘤心血管科', en: 'Cardio-Oncology' },
      { ja: 'アイソトープ診療科', 'zh-CN': '同位素诊疗科', en: 'Isotope Medicine' },
    ],
  },
];

// ======================================
// Data: Advanced Treatments
// ======================================
const TREATMENTS = [
  {
    icon: Target,
    title: { ja: '精密手術', 'zh-TW': '精密手術', 'zh-CN': '精密手术', en: 'Precision Surgery' } as Record<Language, string>,
    desc: { ja: 'da Vinci Xi ロボット3台体制。2024年度：胃がん手術 100%低侵襲化（92%ロボット支援）、大腸がん 97.6%低侵襲化（70%ロボット支援）。最小3-4cmの切開で入院期間を大幅短縮', 'zh-TW': 'da Vinci Xi 3台體制。2024年：胃癌手術100%微創化（92%機器人）、大腸癌97.6%微創化（70%機器人）。最小3-4cm切口大幅縮短住院', 'zh-CN': 'da Vinci Xi 3台体制。2024年：胃癌手术100%微创化（92%机器人）、大肠癌97.6%微创化（70%机器人）。最小3-4cm切口大幅缩短住院', en: '3 da Vinci Xi robots. 2024: gastric 100% minimally invasive (92% robotic), colorectal 97.6% minimally invasive (70% robotic). As small as 3-4cm incisions' } as Record<Language, string>,
  },
  {
    icon: Radio,
    title: { ja: '高度放射線治療', 'zh-TW': '高度放射線治療', 'zh-CN': '高度放射线治疗', en: 'Advanced Radiation Therapy' } as Record<Language, string>,
    desc: { ja: 'リニアック4台。2024年実績：外照射2,051件、IMRT/VMAT 1,032件、定位照射303件、新規患者1,479名（12がん種）。HyperArc™で脳転移の高精度照射に対応', 'zh-TW': '直線加速器4台。2024年：外照射2,051件、IMRT/VMAT 1,032件、定位照射303件、新患者1,479名（12癌種）。HyperArc™精準治療腦轉移', 'zh-CN': '直线加速器4台。2024年：外照射2,051件、IMRT/VMAT 1,032件、定位照射303件、新患者1,479名（12癌种）。HyperArc™精准治疗脑转移', en: '4 linacs. 2024: 2,051 external beam, 1,032 IMRT/VMAT, 303 stereotactic, 1,479 new patients (12 cancer types). HyperArc™ for brain metastases' } as Record<Language, string>,
  },
  {
    icon: FlaskConical,
    title: { ja: '化学療法', 'zh-TW': '化學療法', 'zh-CN': '化学疗法', en: 'Chemotherapy' } as Record<Language, string>,
    desc: { ja: '外来化学療法センター46床、1日平均108名。薬剤師による100%無菌調製体制。造血幹細胞移植用の無菌個室29室を完備。個別化投薬と副作用管理で患者QOLを重視', 'zh-TW': '門診化療中心46床、日均108名。藥劑師100%無菌配製。備有造血幹細胞移植用無菌個室29間。個體化用藥與副作用管理重視QOL', 'zh-CN': '门诊化疗中心46床、日均108名。药剂师100%无菌配制。备有造血干细胞移植用无菌个室29间。个体化用药与副作用管理重视QOL', en: '46-bed outpatient chemo center, 108 daily patients. 100% pharmacist-prepared sterile compounding. 29 isolation rooms for stem cell transplant. Personalized dosing & QOL focus' } as Record<Language, string>,
  },
  {
    icon: Dna,
    title: { ja: 'がんゲノム医療', 'zh-TW': '癌症基因組醫療', 'zh-CN': '癌症基因组医疗', en: 'Cancer Genomic Medicine' } as Record<Language, string>,
    desc: { ja: '2019年がんゲノム医療拠点病院に指定。がん遺伝子パネル検査による個別化治療。Cancer Cell Portバイオバンクでシングルセル解析・オルガノイド研究を推進', 'zh-TW': '2019年獲指定癌症基因組醫療中心。基因面板檢測實現個體化治療。Cancer Cell Port生物樣本庫推進單細胞分析·類器官研究', 'zh-CN': '2019年获指定癌症基因组医疗中心。基因面板检测实现个体化治疗。Cancer Cell Port生物样本库推进单细胞分析·类器官研究', en: 'Designated Cancer Genome Medicine Hub since 2019. Gene panel testing for personalized treatment. Cancer Cell Port biobank advancing single-cell & organoid research' } as Record<Language, string>,
  },
  {
    icon: Shield,
    title: { ja: '免疫療法', 'zh-TW': '免疫療法', 'zh-CN': '免疫疗法', en: 'Immunotherapy' } as Record<Language, string>,
    desc: { ja: '免疫チェックポイント阻害剤を中心に、エビデンスに基づく免疫治療を実施。治療後の免疫関連有害事象にも腫瘍循環器科と連携して対応', 'zh-TW': '以免疫檢查點抑制劑為核心，基於循證的免疫治療。與腫瘤心血管科聯合管理免疫相關不良反應', 'zh-CN': '以免疫检查点抑制剂为核心，基于循证的免疫治疗。与肿瘤心血管科联合管理免疫相关不良反应', en: 'Evidence-based immunotherapy centered on immune checkpoint inhibitors. Cardio-oncology collaboration for immune-related adverse events' } as Record<Language, string>,
  },
  {
    icon: HeartPulse,
    title: { ja: '腫瘍循環器科（Cardio-Oncology）', 'zh-TW': '腫瘤心血管科', 'zh-CN': '肿瘤心血管科', en: 'Cardio-Oncology' } as Record<Language, string>,
    desc: { ja: 'がん治療に伴う心血管系合併症の予防・治療。免疫チェックポイント阻害剤や分子標的薬による心筋障害・血管障害を早期発見・対応する専門チーム', 'zh-TW': '預防·治療癌症治療相關心血管併發症。免疫檢查點抑制劑·分子標靶藥物引發的心肌·血管損傷早期發現·應對', 'zh-CN': '预防·治疗癌症治疗相关心血管并发症。免疫检查点抑制剂·分子靶向药物引发的心肌·血管损伤早期发现·应对', en: 'Preventing & treating cardiovascular complications. Early detection of myocardial/vascular damage from checkpoint inhibitors & targeted drugs' } as Record<Language, string>,
  },
];

// ======================================
// Data: Treatment Flow
// ======================================
const FLOW_STEPS = [
  {
    phase: { ja: '事前評価', 'zh-TW': '事前評估', 'zh-CN': '事前评估', en: 'Pre-Assessment' } as Record<Language, string>,
    steps: [
      {
        title: { ja: '医療資料の提出', 'zh-TW': '提交醫療資料', 'zh-CN': '提交医疗资料', en: 'Submit Medical Records' } as Record<Language, string>,
        desc: { ja: '診断書・画像・病理報告をご提出ください', 'zh-TW': '提交診斷書·影像·病理報告', 'zh-CN': '提交诊断书·影像·病理报告', en: 'Submit diagnosis, imaging, pathology reports' } as Record<Language, string>,
      },
      {
        title: { ja: '初期相談サービス', 'zh-TW': '初期諮詢服務', 'zh-CN': '初期咨询服务', en: 'Initial Consultation Service' } as Record<Language, string>,
        desc: { ja: '¥221,000 — 翻訳・病院照会・可能性評価レポート', 'zh-TW': '¥221,000 — 翻譯·醫院諮詢·可行性評估報告', 'zh-CN': '¥221,000 — 翻译·医院咨询·可行性评估报告', en: '¥221,000 — Translation, hospital consultation, feasibility report' } as Record<Language, string>,
      },
    ],
  },
  {
    phase: { ja: '遠隔診療', 'zh-TW': '遠程會診', 'zh-CN': '远程会诊', en: 'Remote Consultation' } as Record<Language, string>,
    steps: [
      {
        title: { ja: '専門医ビデオ診察', 'zh-TW': '專科醫生視頻會診', 'zh-CN': '专科医生视频会诊', en: 'Video Consultation with Specialist' } as Record<Language, string>,
        desc: { ja: '¥243,000 — 医療通訳同行・治療計画説明・費用見積', 'zh-TW': '¥243,000 — 醫療翻譯陪同·治療方案說明·費用報價', 'zh-CN': '¥243,000 — 医疗翻译陪同·治疗方案说明·费用报价', en: '¥243,000 — Interpreter, treatment plan, cost estimate' } as Record<Language, string>,
      },
    ],
  },
  {
    phase: { ja: '来日治療', 'zh-TW': '赴日治療', 'zh-CN': '赴日治疗', en: 'Treatment in Japan' } as Record<Language, string>,
    steps: [
      {
        title: { ja: '渡航・受診', 'zh-TW': '赴日·就診', 'zh-CN': '赴日·就诊', en: 'Travel & Hospital Visit' } as Record<Language, string>,
        desc: { ja: '日程調整・医療ビザ・通訳手配・病院予約', 'zh-TW': '日程協調·醫療簽證·翻譯安排·醫院預約', 'zh-CN': '日程协调·医疗签证·翻译安排·医院预约', en: 'Schedule, medical visa, interpreter, hospital booking' } as Record<Language, string>,
      },
      {
        title: { ja: 'がんセンターでの治療', 'zh-TW': '癌症中心治療', 'zh-CN': '癌症中心治疗', en: 'Treatment at Cancer Center' } as Record<Language, string>,
        desc: { ja: '手術・放射線・化学療法・ゲノム医療など最適な治療を実施', 'zh-TW': '手術·放療·化療·基因組醫療等最佳治療方案', 'zh-CN': '手术·放疗·化疗·基因组医疗等最佳治疗方案', en: 'Surgery, radiation, chemo, genomic medicine — optimal treatment' } as Record<Language, string>,
      },
    ],
  },
  {
    phase: { ja: 'フォローアップ', 'zh-TW': '後續隨訪', 'zh-CN': '后续随访', en: 'Follow-Up' } as Record<Language, string>,
    steps: [
      {
        title: { ja: '退院・帰国後フォロー', 'zh-TW': '出院·回國後隨訪', 'zh-CN': '出院·回国后随访', en: 'Post-Discharge Follow-Up' } as Record<Language, string>,
        desc: { ja: '費用精算、遠隔経過観察、母国医師との連携', 'zh-TW': '費用結算、遠程隨訪、與本地醫生協作', 'zh-CN': '费用结算、远程随访、与本地医生协作', en: 'Cost settlement, remote monitoring, coordination with home doctors' } as Record<Language, string>,
      },
    ],
  },
];

// ======================================
// Helper: Center Icon
// ======================================
function CenterIcon({ type, className }: { type: string; className?: string }) {
  const cn = className || 'w-6 h-6';
  switch (type) {
    case 'stomach': return <Activity className={cn} />;
    case 'lung': return <HeartPulse className={cn} />;
    case 'rectum': return <Pill className={cn} />;
    case 'pancreas': return <FlaskConical className={cn} />;
    case 'breast': return <Heart className={cn} />;
    case 'rare': return <Microscope className={cn} />;
    case 'robot': return <Bot className={cn} />;
    case 'endoscopy': return <Scan className={cn} />;
    default: return <Stethoscope className={cn} />;
  }
}

// ======================================
// Facility gallery data
// ======================================
const FACILITY_GALLERY = [
  { src: OICI_IMAGES.entrance, labelKey: 'facilityEntrance' as const },
  { src: OICI_IMAGES.corridor, labelKey: 'facilityCorridor' as const },
  { src: OICI_IMAGES.dayRoom, labelKey: 'facilityDayRoom' as const },
  { src: OICI_IMAGES.room, labelKey: 'facilityRoom' as const },
];

// ======================================
// Facility strip images
// ======================================
const FACILITY_STRIP = [
  OICI_IMAGES.building1,
  OICI_IMAGES.interior1,
  OICI_IMAGES.interior2,
  OICI_IMAGES.interior3,
  OICI_IMAGES.building2,
];

// ======================================
// Data: Research & Innovation
// ======================================
const RESEARCH_ITEMS = [
  {
    icon: Dna,
    title: { ja: 'Cancer Cell Port バイオバンク', 'zh-TW': 'Cancer Cell Port 生物樣本庫', 'zh-CN': 'Cancer Cell Port 生物样本库', en: 'Cancer Cell Port Biobank' } as Record<Language, string>,
    desc: { ja: '患者由来のがん組織・血液サンプルを体系的に収集・保管。シングルセル解析やオルガノイド研究に活用し、個別化医療を推進', 'zh-TW': '系統性收集保管患者癌組織·血液樣本。用於單細胞分析·類器官研究，推進個體化醫療', 'zh-CN': '系统性收集保管患者癌组织·血液样本。用于单细胞分析·类器官研究，推进个体化医疗', en: 'Systematic collection of patient-derived cancer tissue & blood samples. Used for single-cell analysis & organoid research to advance personalized medicine' } as Record<Language, string>,
  },
  {
    icon: Bot,
    title: { ja: 'AI創薬・データサイエンス', 'zh-TW': 'AI藥物研發·數據科學', 'zh-CN': 'AI药物研发·数据科学', en: 'AI Drug Discovery & Data Science' } as Record<Language, string>,
    desc: { ja: '人工知能を活用した新規治療薬候補の探索。ゲノムデータと臨床データの統合解析で新たな治療標的を同定', 'zh-TW': '運用人工智能探索新治療藥物候選。整合基因組與臨床數據分析發現新治療靶點', 'zh-CN': '运用人工智能探索新治疗药物候选。整合基因组与临床数据分析发现新治疗靶点', en: 'AI-powered exploration of drug candidates. Integrating genomic & clinical data to identify novel therapeutic targets' } as Record<Language, string>,
  },
  {
    icon: Globe,
    title: { ja: '国際共同研究', 'zh-TW': '國際合作研究', 'zh-CN': '国际合作研究', en: 'International Collaborations' } as Record<Language, string>,
    desc: { ja: 'ドイツ・シンガポール・タイ・米国・中国の研究機関と連携。世界最先端のがん治療知見を共有・還元', 'zh-TW': '與德國·新加坡·泰國·美國·中國研究機構合作。共享世界最前沿癌症治療知識', 'zh-CN': '与德国·新加坡·泰国·美国·中国研究机构合作。共享世界最前沿癌症治疗知识', en: 'Partnerships with institutions in Germany, Singapore, Thailand, USA & China. Sharing cutting-edge cancer research globally' } as Record<Language, string>,
  },
];

// ======================================
// Data: Patient Support
// ======================================
const SUPPORT_ITEMS = [
  {
    icon: Heart,
    title: { ja: 'HOPE LifeMark コンシェルジュ', 'zh-TW': 'HOPE LifeMark 管家服務', 'zh-CN': 'HOPE LifeMark 管家服务', en: 'HOPE LifeMark Concierge' } as Record<Language, string>,
    desc: { ja: '入院から退院後まで、患者・ご家族を一貫してサポート。情報提供・療養環境整備・福祉連携を行う専任チーム', 'zh-TW': '從入院到出院後全程支援患者·家屬。提供資訊·療養環境整備·福利銜接的專屬團隊', 'zh-CN': '从入院到出院后全程支持患者·家属。提供信息·疗养环境整备·福利衔接的专属团队', en: 'Dedicated team supporting patients & families from admission to post-discharge. Information, environment, and welfare coordination' } as Record<Language, string>,
  },
  {
    icon: Users,
    title: { ja: '2人主治医体制', 'zh-TW': '雙主治醫師制度', 'zh-CN': '双主治医师制度', en: 'Dual Attending Physician System' } as Record<Language, string>,
    desc: { ja: '主治医2名が担当することで、24時間365日の対応体制を実現。夜間・休日も安心の継続的医療提供', 'zh-TW': '由2名主治醫師負責，實現24/7全天候對應。夜間·假日也能安心接受持續醫療', 'zh-CN': '由2名主治医师负责，实现24/7全天候对应。夜间·假日也能安心接受持续医疗', en: 'Two attending physicians per patient ensure 24/7 coverage. Continuous care including nights and holidays' } as Record<Language, string>,
  },
  {
    icon: Shield,
    title: { ja: 'がん相談支援センター', 'zh-TW': '癌症諮詢支援中心', 'zh-CN': '癌症咨询支持中心', en: 'Cancer Counseling Support Center' } as Record<Language, string>,
    desc: { ja: '治療法・費用・生活・就労など、がんに関するあらゆる相談に看護師・MSWが無料で対応。セカンドオピニオンの相談窓口', 'zh-TW': '治療方案·費用·生活·就業等癌症相關問題，由護理師·MSW免費諮詢。第二意見諮詢窗口', 'zh-CN': '治疗方案·费用·生活·就业等癌症相关问题，由护理师·MSW免费咨询。第二意见咨询窗口', en: 'Free counseling on treatment, costs, lifestyle, employment by nurses & MSWs. Second opinion consultation desk' } as Record<Language, string>,
  },
  {
    icon: HeartPulse,
    title: { ja: '緩和ケアセンター・ACP', 'zh-TW': '安寧緩和照護中心·ACP', 'zh-CN': '姑息治疗中心·ACP', en: 'Palliative Care Center & ACP' } as Record<Language, string>,
    desc: { ja: '治療初期から緩和ケアを統合。ACP（アドバンス・ケア・プランニング）で患者の意思を尊重した治療方針を策定', 'zh-TW': '從治療初期即整合安寧緩和照護。ACP（預立醫療照護諮商）尊重患者意願制定治療方針', 'zh-CN': '从治疗初期即整合姑息治疗。ACP（预立医疗照护计划）尊重患者意愿制定治疗方针', en: 'Palliative care integrated from treatment onset. ACP (Advance Care Planning) respects patient wishes in care decisions' } as Record<Language, string>,
  },
];

// ======================================
// Data: History Milestones
// ======================================
const HISTORY_MILESTONES = [
  {
    year: '1959',
    title: { ja: '大阪府立成人病センター設立', 'zh-TW': '大阪府立成人病中心設立', 'zh-CN': '大阪府立成人病中心设立', en: 'Osaka Prefectural Adult Disease Center Founded' } as Record<Language, string>,
    desc: { ja: '日本初のがん・循環器疾患専門施設として開院', 'zh-TW': '作為日本首家癌症·心血管疾病專門機構開院', 'zh-CN': '作为日本首家癌症·心血管疾病专门机构开院', en: "Opened as Japan's first specialized cancer & cardiovascular facility" } as Record<Language, string>,
  },
  {
    year: '1977',
    title: { ja: 'がん専門病院化', 'zh-TW': '轉型癌症專科醫院', 'zh-CN': '转型癌症专科医院', en: 'Became Cancer Specialty Hospital' } as Record<Language, string>,
    desc: { ja: 'がん診療に特化した専門病院として再編', 'zh-TW': '重組為癌症診療專門醫院', 'zh-CN': '重组为癌症诊疗专门医院', en: 'Reorganized as a cancer-specialized hospital' } as Record<Language, string>,
  },
  {
    year: '2006',
    title: { ja: '特定機能病院に認定', 'zh-TW': '獲認定為特定功能醫院', 'zh-CN': '获认定为特定功能医院', en: 'Designated Special Function Hospital' } as Record<Language, string>,
    desc: { ja: '市立病院として全国初の特定機能病院認定を取得', 'zh-TW': '作為市立醫院全國首個獲得特定功能醫院認定', 'zh-CN': '作为市立医院全国首个获得特定功能医院认定', en: 'First municipal hospital nationwide to receive Special Function designation' } as Record<Language, string>,
  },
  {
    year: '2017',
    title: { ja: '新棟移転・名称変更', 'zh-TW': '遷入新樓·更名', 'zh-CN': '迁入新楼·更名', en: 'New Building & Renamed' } as Record<Language, string>,
    desc: { ja: '地上13階建・68,329㎡の最新施設に移転。「大阪国際がんセンター」に名称変更', 'zh-TW': '遷入地上13層·68,329㎡最新設施。更名為「大阪國際癌症中心」', 'zh-CN': '迁入地上13层·68,329㎡最新设施。更名为「大阪国际癌症中心」', en: 'Moved to 13-story, 68,329㎡ state-of-the-art facility. Renamed to "Osaka International Cancer Center"' } as Record<Language, string>,
  },
  {
    year: '2019',
    title: { ja: 'がんゲノム医療拠点病院', 'zh-TW': '癌症基因組醫療中心', 'zh-CN': '癌症基因组医疗中心', en: 'Cancer Genome Medicine Hub' } as Record<Language, string>,
    desc: { ja: '厚生労働省よりがんゲノム医療拠点病院に指定', 'zh-TW': '獲厚生勞動省指定為癌症基因組醫療中心', 'zh-CN': '获厚生劳动省指定为癌症基因组医疗中心', en: 'Designated Cancer Genome Medicine Hub by Ministry of Health' } as Record<Language, string>,
  },
  {
    year: '2023',
    title: { ja: 'がんロボット手術センター開設', 'zh-TW': '癌症機器人手術中心開設', 'zh-CN': '癌症机器人手术中心开设', en: 'Robotic Surgery Center Opened' } as Record<Language, string>,
    desc: { ja: 'da Vinci Xi 3台体制で8診療科のロボット手術を集約。年間500件以上', 'zh-TW': 'da Vinci Xi 3台集結8科機器人手術。年500+件', 'zh-CN': 'da Vinci Xi 3台集结8科机器人手术。年500+件', en: '3 da Vinci Xi systems across 8 departments. 500+ cases/year' } as Record<Language, string>,
  },
];

// ======================================
// Component
// ======================================
export default function OICIContent({ isGuideEmbed, guideSlug }: Props) {
  const lang = useLanguage();
  const [expandedPhase, setExpandedPhase] = useState<number>(0);

  const t = (key: keyof typeof tr) => tr[key][lang] || tr[key]['ja'];

  // 只显示 OICI 癌症治疗的两个套餐（不混入兵库医大等其他 cancer_treatment 分类的套餐）
  const oiciPackages = [
    {
      ...MEDICAL_PACKAGES['cancer-initial-consultation'],
      name: {
        ja: MEDICAL_PACKAGES['cancer-initial-consultation'].nameJa,
        'zh-TW': MEDICAL_PACKAGES['cancer-initial-consultation'].nameZhTw,
        'zh-CN': '癌症治疗 - 前期咨询服务',
        en: MEDICAL_PACKAGES['cancer-initial-consultation'].nameEn,
      } as Record<Language, string>,
      desc: {
        ja: '資料翻訳、病院照会、治療プラン初期評価',
        'zh-TW': '資料翻譯、醫院諮詢、治療方案初步評估',
        'zh-CN': '资料翻译、医院咨询、治疗方案初步评估',
        en: 'Document translation, hospital consultation, preliminary treatment assessment',
      } as Record<Language, string>,
      ctaPath: 'initial-consultation',
    },
    {
      ...MEDICAL_PACKAGES['cancer-remote-consultation'],
      name: {
        ja: MEDICAL_PACKAGES['cancer-remote-consultation'].nameJa,
        'zh-TW': MEDICAL_PACKAGES['cancer-remote-consultation'].nameZhTw,
        'zh-CN': '癌症治疗 - 远程会诊服务',
        en: MEDICAL_PACKAGES['cancer-remote-consultation'].nameEn,
      } as Record<Language, string>,
      desc: {
        ja: '日本の専門医とのビデオ相談、治療プラン説明、費用概算',
        'zh-TW': '與日本醫生遠程視頻會診、討論治療方案、費用概算',
        'zh-CN': '与日本医生远程视频会诊、讨论治疗方案、费用概算',
        en: 'Video consultation with Japanese specialists, treatment plan discussion, cost estimate',
      } as Record<Language, string>,
      ctaPath: 'remote-consultation',
    },
  ];

  return (
    <div className={`min-h-screen bg-white ${isGuideEmbed ? '' : ''}`}>
      {/* ============ Hero Section (Photo-Based) ============ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden text-white">
        <img
          src={OICI_IMAGES.exterior}
          alt="Osaka International Cancer Center"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#005BAC]/90 via-[#005BAC]/65 to-[#005BAC]/20" />

        <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium tracking-wide">{t('limitBadge')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight">
              {t('heroTitle1')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-semibold mb-4">
              {t('heroTitle2')}
            </p>
            <p className="text-sm text-white/70 mb-8">{t('heroSubtitle')}</p>

            <div className="flex flex-wrap gap-3">
              <a href="#services" className="inline-flex items-center gap-2 bg-white text-[#005BAC] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-lg">
                <FileText size={18} />
                {t('consultPlan')}
              </a>
              <a href="#flow" className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition">
                <ArrowRight size={18} />
                {t('viewFlow')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Designation Bar ============ */}
      <section className="bg-[#005BAC]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 sm:divide-x sm:divide-white/30">
            {[
              { icon: Shield, text: t('designation1') },
              { icon: Award, text: t('designation2') },
              { icon: Users, text: t('designation3') },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-6">
                <badge.icon size={16} className="text-white/80 flex-shrink-0" />
                <span className="text-xs text-white/90 font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Key Stats ============ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('statsTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('statsTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {KEY_STATS.map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition text-center">
                <div className="text-3xl font-black text-[#005BAC]">
                  {stat.value}
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-2">{stat.label[lang]}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.sub[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Facility Gallery ============ */}
      <section className="bg-white">
        <div className="container mx-auto px-6 pb-4">
          <div className="text-center mb-10">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('facilityTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('facilityTitle')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">{t('facilityDesc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {FACILITY_GALLERY.map((item, i) => (
            <div key={i} className="relative min-h-[35vh] md:min-h-[45vh] overflow-hidden group">
              <img
                src={item.src}
                alt={tr[item.labelKey][lang]}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-semibold text-lg">{tr[item.labelKey][lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 8 Specialty Centers ============ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('centersTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('centersTitle')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('centersDesc')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SPECIALTY_CENTERS.map((center, i) => (
              <div key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                <div className="h-1 bg-[#005BAC]" />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <CenterIcon type={center.icon} className="w-5 h-5 text-[#005BAC]" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{center.name[lang]}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{center.desc[lang]}</p>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005BAC]" />
                    <span className="text-[#005BAC] font-medium">{center.stats[lang]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Advanced Treatments ============ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('treatTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('treatTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TREATMENTS.map((treat, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#005BAC] flex items-center justify-center mb-4">
                  <treat.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{treat.title[lang]}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{treat.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Da Vinci Robotic Surgery Spotlight ============ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('robotTag')}</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{t('robotTitle')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{t('robotDesc')}</p>
              <div className="flex flex-wrap gap-3">
                {[t('robotStat1'), t('robotStat2'), t('robotStat3')].map((stat, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-blue-50 text-[#005BAC] text-sm font-medium px-4 py-2 rounded-full">
                    {stat}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
              <img
                src={OICI_IMAGES.daVinciSystem}
                alt="da Vinci Xi Surgical Robot System"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ Research & Innovation ============ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('researchTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('researchTitle')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t('researchDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {RESEARCH_ITEMS.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#005BAC] flex items-center justify-center mb-4">
                  <item.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title[lang]}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Patient Support ============ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('supportTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('supportTitle')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t('supportDesc')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {SUPPORT_ITEMS.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-[#005BAC]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title[lang]}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc[lang]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Clinical Departments ============ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('deptsTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('deptsTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {DEPARTMENTS.map((group, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-[#005BAC] text-lg mb-4 pb-3 border-b border-gray-100">{group.category[lang]}</h3>
                <ul className="space-y-2">
                  {group.depts.map((dept, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} className="text-[#005BAC] mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="font-medium">{dept.ja}</span>
                        {lang !== 'ja' && (
                          <span className="text-gray-400 ml-1.5">
                            {(dept as Record<string, string>)[lang] || (dept as Record<string, string>)['zh-CN'] || dept.en}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ History Timeline ============ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('historyTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('historyTitle')}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {HISTORY_MILESTONES.map((milestone, i) => (
              <div key={i} className="flex gap-4 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#005BAC] text-white flex items-center justify-center flex-shrink-0">
                    <Clock size={16} />
                  </div>
                  {i < HISTORY_MILESTONES.length - 1 && (
                    <div className="w-px flex-1 bg-[#005BAC]/20 mt-2" />
                  )}
                </div>
                <div className="pb-6">
                  <span className="text-[#005BAC] font-black text-lg">{milestone.year}</span>
                  <h4 className="font-bold text-gray-900 mt-1">{milestone.title[lang]}</h4>
                  <p className="text-sm text-gray-600 mt-1">{milestone.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Treatment Flow ============ */}
      <section id="flow" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('flowTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('flowTitle')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('flowDesc')}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {FLOW_STEPS.map((phase, i) => (
              <button
                key={i}
                onClick={() => setExpandedPhase(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  expandedPhase === i
                    ? 'bg-[#005BAC] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {i + 1}. {phase.phase[lang]}
              </button>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            {FLOW_STEPS.map((phase, i) => (
              expandedPhase === i && (
                <div key={i} className="space-y-4">
                  {phase.steps.map((step, j) => (
                    <div key={j} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#005BAC] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {j + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{step.title[lang]}</h4>
                          <p className="text-sm text-gray-600">{step.desc[lang]}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ============ Facility Strip ============ */}
      <section className="grid grid-cols-2 md:grid-cols-5">
        {FACILITY_STRIP.map((src, i) => (
          <div key={i} className="relative aspect-[3/2] overflow-hidden group">
            <img
              src={src}
              alt={`OICI Facility ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </section>

      {/* ============ Services ============ */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#005BAC] text-xs tracking-widest uppercase font-bold">{t('svcTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('svcTitle')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('svcDesc')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {oiciPackages.map((pkg) => (
              <div key={pkg.slug} className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#005BAC] p-8 transition shadow-sm hover:shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name[lang]}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-[#005BAC]">¥{pkg.priceJpy.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">{t('taxIncl')}</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">{pkg.desc[lang]}</p>
                <Link
                  href={guideSlug ? `/cancer-treatment/${pkg.ctaPath}?guide=${guideSlug}` : `/cancer-treatment/${pkg.ctaPath}`}
                  className="block w-full text-center bg-[#005BAC] text-white font-bold py-3 rounded-xl hover:bg-[#004a8a] transition"
                >
                  {t('bookNow')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Hospital Info ============ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-[#005BAC]" />
                {tr.heroTitle1[lang]}
              </h3>
              <div className="grid gap-5 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#005BAC] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {lang === 'ja' ? '所在地' : lang === 'en' ? 'Address' : '地址'}
                    </p>
                    <p>〒541-8567</p>
                    <p>{lang === 'ja' ? '大阪市中央区大手前3-1-69' : lang === 'en' ? '3-1-69 Otemae, Chuo-ku, Osaka' : '大阪市中央区大手前3-1-69'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[#005BAC] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {lang === 'ja' ? '代表電話' : lang === 'en' ? 'Phone' : '电话'}
                    </p>
                    <p>06-6945-1181</p>
                    <p className="text-xs text-gray-400">
                      {lang === 'ja' ? '平日 9:00〜17:30' : lang === 'en' ? 'Mon-Fri 9:00-17:30' : '工作日 9:00〜17:30'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={16} className="text-[#005BAC] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {lang === 'ja' ? '公式サイト' : lang === 'en' ? 'Website' : '官网'}
                    </p>
                    <a href="https://oici.jp" target="_blank" rel="noopener noreferrer" className="text-[#005BAC] hover:underline flex items-center gap-1">
                      oici.jp <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Train size={16} className="text-[#005BAC] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {lang === 'ja' ? '交通アクセス' : lang === 'en' ? 'Access' : '交通'}
                    </p>
                    <p>{lang === 'ja' ? '大阪メトロ谷町線「天満橋駅」徒歩3分' : lang === 'en' ? '3 min walk from Temmabashi Station' : '大阪地铁谷町线「天满桥站」步行3分钟'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <img
                src={OICI_IMAGES.building2}
                alt="OICI Building"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ Contact ============ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{t('contactTitle')}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://line.me/R/ti/p/@shinjima"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#06C755] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              <MessageSquare size={18} />
              LINE
            </a>
            <a
              href="mailto:info@niijima-koutsu.jp"
              className="inline-flex items-center gap-2 bg-[#005BAC] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#004a8a] transition"
            >
              <Mail size={18} />
              Email
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            {lang === 'ja'
              ? '※ 当サイトは大阪国際がんセンターの公式サイトではありません。医療ツーリズムの仲介サービスです。'
              : lang === 'en'
              ? '* This is not the official OICI website. We provide medical tourism coordination services.'
              : '※ 本站非大阪国际癌症中心官网。我们提供医疗旅游协调服务。'}
          </p>
        </div>
      </section>
    </div>
  );
}
