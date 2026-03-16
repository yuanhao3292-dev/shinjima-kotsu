'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, Train,
  Award, Shield, Heart, Brain,
  Syringe, Microscope, Sparkles, CheckCircle,
  ArrowRight, Globe,
  Lock, Activity,
  Droplets, FlaskConical, Dna, Scan,
  ChevronDown, ChevronUp, Stethoscope,
  GraduationCap, Building2, CircleDot,
  Zap, ShieldCheck, FileText, HelpCircle,
  Beaker,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';


// Hero Image (白标首图映射用)
export const GINZA_PHOENIX_HERO_IMAGE =
  'https://static.wixstatic.com/media/1778a7_4417743f0826481297af97cd36d5a362~mv2.jpg';

// Official Site Image URLs
const IMAGES = {
  hero: GINZA_PHOENIX_HERO_IMAGE,
  drNagai: 'https://static.wixstatic.com/media/1778a7_cb8af8e2e028489dae8084f8f548b616~mv2.webp',
  drNagaiPortrait: 'https://static.wixstatic.com/media/1778a7_4f7f651883cd4a509a481bf39eb059a3~mv2.jpg',
  reception: 'https://static.wixstatic.com/media/1778a7_61c48104f389482c8870001e2e83b7cd~mv2.jpg',
  treatmentRoom: 'https://static.wixstatic.com/media/1778a7_404610b56d224e69abdc4075fce5dbcd~mv2.jpg',
  cpc: 'https://static.wixstatic.com/media/1778a7_2cd3ab97c12a46a18c50661896c1be63~mv2.png',
  waitingRoom: 'https://static.wixstatic.com/media/1778a7_f4f72df80ce842e1ac29a3f1a581f2f3~mv2.jpg',
  udxBuilding: 'https://static.wixstatic.com/media/1778a7_df63efd453ef4f25a4c91d96e947f6f9~mv2.webp',
  consultation: 'https://static.wixstatic.com/media/1778a7_b460ee2df83a4d8687f6bc178162f08a~mv2.webp',
  entrance: 'https://static.wixstatic.com/media/1778a7_a9bff88a5107440997dee93f5653e549~mv2.jpg',
  interiorReception: 'https://static.wixstatic.com/media/1778a7_39fcaac5f9a14455b8e99c04779505ae~mv2.jpg',
  treatmentRoom2: 'https://static.wixstatic.com/media/1778a7_92eca6135b954d3382a2675d2c856ed4~mv2.jpg',
};

// Brand: #2C3E50 (navy), #394E64 (teal-gray), #466777 (blue-gray), bg: #E2EDF5, #EFF3F7

// Translations
const t = {
  heroMotto: {
    ja: '患者の「生きる」にすべてを尽くす',
    'zh-TW': '為患者的「活著」傾盡全力',
    'zh-CN': '为患者的「活着」倾尽全力',
    en: 'Devoting everything to the patient\'s will to live',
  } as Record<Language, string>,
  heroTitle: {
    ja: '銀座鳳凰クリニック',
    'zh-TW': '銀座鳳凰診所',
    'zh-CN': '银座凤凰诊所',
    en: 'Ginza Phoenix Clinic',
  } as Record<Language, string>,
  heroSubtitle: {
    ja: 'がん免疫細胞療法・再生医療',
    'zh-TW': '癌症免疫細胞療法・再生醫療',
    'zh-CN': '癌症免疫细胞疗法・再生医疗',
    en: 'Cancer Immunocell Therapy & Regenerative Medicine',
  } as Record<Language, string>,
  heroStage4: {
    ja: 'ステージIVでも諦めない',
    'zh-TW': 'Stage IV 也不放棄',
    'zh-CN': 'Stage IV 也不放弃',
    en: 'Don\'t give up, even at Stage IV',
  } as Record<Language, string>,
  heroDesc: {
    ja: '厚生労働省認可 再生医療等提供計画19件\n院内GMP基準CPC（細胞培養加工施設）を保有\n初回カウンセリング無料・完全予約制',
    'zh-TW': '厚生勞動省認可 再生醫療計劃19件\n院內GMP標準CPC（細胞培養加工設施）\n初次諮詢免費・全預約制',
    'zh-CN': '厚生劳动省认可 再生医疗计划19件\n院内GMP标准CPC（细胞培养加工设施）\n初次咨询免费・全预约制',
    en: '19 MHLW-approved regenerative medicine plans\nIn-house GMP-grade CPC facility\nFree initial counseling — Appointment only',
  } as Record<Language, string>,
  ctaBook: {
    ja: '無料カウンセリングを予約',
    'zh-TW': '預約免費諮詢',
    'zh-CN': '预约免费咨询',
    en: 'Book Free Consultation',
  } as Record<Language, string>,
  ctaRemote: {
    ja: '遠隔相談を予約する',
    'zh-TW': '預約遠程諮詢',
    'zh-CN': '预约远程咨询',
    en: 'Book Remote Consultation',
  } as Record<Language, string>,
  introTag: {
    ja: 'クリニック紹介',
    'zh-TW': '診所介紹',
    'zh-CN': '诊所介绍',
    en: 'About the Clinic',
  } as Record<Language, string>,
  introTitle: {
    ja: 'がん免疫療法と再生医療の専門クリニック',
    'zh-TW': '癌症免疫療法與再生醫療專門診所',
    'zh-CN': '癌症免疫疗法与再生医疗专门诊所',
    en: 'A Clinic Specializing in Cancer Immunotherapy & Regenerative Medicine',
  } as Record<Language, string>,
  introText: {
    ja: '銀座鳳凰クリニックは、がん免疫療法と再生医療を専門とする自由診療のクリニックです。院内にCPC（細胞培養加工施設）を併設し、細胞の採取から培養・品質管理・投与まで一貫して院内で実施。兵庫医科大学発ベンチャー技術に基づく、科学的エビデンスのある先端治療を提供しています。',
    'zh-TW': '銀座鳳凰診所是專注於癌症免疫療法與再生醫療的自費診療診所。院內設有CPC（細胞培養加工設施），從細胞採集到培養、品質管理、給藥全程院內完成。基於兵庫醫科大學創投技術，提供有科學依據的先端治療。',
    'zh-CN': '银座凤凰诊所是专注于癌症免疫疗法与再生医疗的自费诊疗诊所。院内设有CPC（细胞培养加工设施），从细胞采集到培养、品质管理、给药全程院内完成。基于兵库医科大学创投技术，提供有科学依据的先端治疗。',
    en: 'Ginza Phoenix Clinic is a self-pay clinic specializing in cancer immunotherapy and regenerative medicine. With an in-house CPC (Cell Processing Center), all processes from cell extraction to culture, quality control, and administration are performed on-site. We deliver cutting-edge, evidence-based treatments based on Hyogo Medical University venture technology.',
  } as Record<Language, string>,
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
  menuTag: {
    ja: '治療費用',
    'zh-TW': '治療費用',
    'zh-CN': '治疗费用',
    en: 'Treatment Cost',
  } as Record<Language, string>,
  menuTitle: {
    ja: '治療メニューと費用一覧',
    'zh-TW': '治療項目與費用一覽',
    'zh-CN': '治疗项目与费用一览',
    en: 'Treatment Menu & Pricing',
  } as Record<Language, string>,
  menuSubtitle: {
    ja: '自由診療・税込表示。初回医療相談は無料です',
    'zh-TW': '自費診療・含稅價格。初次醫療諮詢免費',
    'zh-CN': '自费诊疗・含税价格。初次医疗咨询免费',
    en: 'Self-pay treatment, tax included. Initial counseling is free',
  } as Record<Language, string>,
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
  cpcTag: {
    ja: '院内CPC',
    'zh-TW': '院內CPC',
    'zh-CN': '院内CPC',
    en: 'In-House CPC',
  } as Record<Language, string>,
  cpcTitle: {
    ja: '東京最大級の院内細胞培養加工施設',
    'zh-TW': '東京最大級別院內細胞培養加工設施',
    'zh-CN': '东京最大级别院内细胞培养加工设施',
    en: 'One of Tokyo\'s Largest In-House Cell Processing Centers',
  } as Record<Language, string>,
  cpcDesc: {
    ja: '当クリニックは院内にGMP基準のCPC（細胞培養加工施設）を完備。患者様の細胞の採取から培養・品質管理・投与まで、すべてを院内で一貫して実施します。外部委託と比較して、輸送中の細胞劣化リスクを最小限に抑え、より高い品質管理と安全性を実現しています。',
    'zh-TW': '本診所院內配備GMP標準CPC（細胞培養加工設施）。從患者細胞的採集到培養、品質管理、給藥，全部在院內一貫完成。相較於外部委託，最大限度降低運輸過程中的細胞劣化風險，實現更高的品質管控與安全性。',
    'zh-CN': '本诊所院内配备GMP标准CPC（细胞培养加工设施）。从患者细胞的采集到培养、品质管理、给药，全部在院内一贯完成。相较于外部委托，最大限度降低运输过程中的细胞劣化风险，实现更高的品质管控与安全性。',
    en: 'Our clinic houses a GMP-grade CPC (Cell Processing Center) on-site. From cell extraction to culture, quality control, and administration, everything is performed in-house. Compared to outsourced processing, this minimizes cell degradation risk during transport, ensuring superior quality control and safety.',
  } as Record<Language, string>,
  doctorTag: {
    ja: '医師紹介',
    'zh-TW': '醫師介紹',
    'zh-CN': '医师介绍',
    en: 'Doctor Profile',
  } as Record<Language, string>,
  doctorTitle: {
    ja: '理事長・院長 永井 恒志',
    'zh-TW': '理事長・院長 永井 恒志',
    'zh-CN': '理事长・院长 永井 恒志',
    en: 'Director: Dr. Nagai Hisashi',
  } as Record<Language, string>,
  envTag: {
    ja: 'クリニック環境',
    'zh-TW': '診所環境',
    'zh-CN': '诊所环境',
    en: 'Clinic Environment',
  } as Record<Language, string>,
  envTitle: {
    ja: '安心の院内環境',
    'zh-TW': '安心的院內環境',
    'zh-CN': '安心的院内环境',
    en: 'Comfortable Clinic Environment',
  } as Record<Language, string>,
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
  faqTag: {
    ja: 'よくある質問',
    'zh-TW': '常見問題',
    'zh-CN': '常见问题',
    en: 'FAQ',
  } as Record<Language, string>,
  faqTitle: {
    ja: 'よくあるご質問',
    'zh-TW': '常見問題解答',
    'zh-CN': '常见问题解答',
    en: 'Frequently Asked Questions',
  } as Record<Language, string>,
  ctaTitle: {
    ja: 'がん免疫療法のご相談',
    'zh-TW': '癌症免疫療法諮詢',
    'zh-CN': '癌症免疫疗法咨询',
    en: 'Cancer Immunotherapy Consultation',
  } as Record<Language, string>,
  ctaSubtitle: {
    ja: '初回カウンセリング無料。専門医が丁寧にご相談に応じます',
    'zh-TW': '初次諮詢免費。專業醫師將認真傾聽您的需求',
    'zh-CN': '初次咨询免费。专业医师将认真倾听您的需求',
    en: 'Free initial counseling. Our specialists will listen carefully to your needs',
  } as Record<Language, string>,
  ctaConsultDesc: {
    ja: '病歴翻訳・クリニック相談・治療プラン評価・費用概算',
    'zh-TW': '病歷翻譯・診所諮詢・治療方案評估・費用概算',
    'zh-CN': '病历翻译・诊所咨询・治疗方案评估・费用概算',
    en: 'Record translation, clinic consultation, treatment assessment, cost estimate',
  } as Record<Language, string>,
  bookBtn: {
    ja: '予約',
    'zh-TW': '預約',
    'zh-CN': '预约',
    en: 'Book',
  } as Record<Language, string>,
};

// Data
const STATS = [
  {
    value: '19',
    unit: { ja: '件', 'zh-TW': '件', 'zh-CN': '件', en: '' } as Record<Language, string>,
    label: { ja: '厚労省再生医療計画', 'zh-TW': '厚勞省再生醫療計劃', 'zh-CN': '厚劳省再生医疗计划', en: 'MHLW Regen. Plans' } as Record<Language, string>,
    icon: <FileText size={20} />,
  },
  {
    value: '3',
    unit: { ja: '種', 'zh-TW': '種', 'zh-CN': '种', en: '' } as Record<Language, string>,
    label: { ja: '核心免疫細胞療法', 'zh-TW': '核心免疫細胞療法', 'zh-CN': '核心免疫细胞疗法', en: 'Core Immunotherapies' } as Record<Language, string>,
    icon: <Dna size={20} />,
  },
  {
    value: 'GMP',
    unit: { ja: '基準', 'zh-TW': '標準', 'zh-CN': '标准', en: 'Grade' } as Record<Language, string>,
    label: { ja: '院内CPC環境', 'zh-TW': '院內CPC環境', 'zh-CN': '院内CPC环境', en: 'In-House CPC' } as Record<Language, string>,
    icon: <ShieldCheck size={20} />,
  },
  {
    value: '100%',
    unit: { ja: '', 'zh-TW': '', 'zh-CN': '', en: '' } as Record<Language, string>,
    label: { ja: '完全予約制', 'zh-TW': '全預約制', 'zh-CN': '全预约制', en: 'Appointment Only' } as Record<Language, string>,
    icon: <Lock size={20} />,
  },
];

const WHY_CHOOSE_US = [
  {
    icon: <Building2 size={24} />,
    title: { ja: '東京最大級の院内CPC', 'zh-TW': '東京最大級別院內CPC', 'zh-CN': '东京最大级别院内CPC', en: 'One of Tokyo\'s Largest In-House CPC' } as Record<Language, string>,
    desc: { ja: '院内にGMP基準の細胞培養加工施設を保有。採取から培養・品質管理・投与まで一貫して院内で実施し、外部輸送による細胞劣化リスクを排除', 'zh-TW': '院內配備GMP標準細胞培養加工設施。從採集到培養、品質管理、給藥全程院內完成，排除外部運輸導致的細胞劣化風險', 'zh-CN': '院内配备GMP标准细胞培养加工设施。从采集到培养、品质管理、给药全程院内完成，排除外部运输导致的细胞劣化风险', en: 'In-house GMP-grade cell processing facility. End-to-end on-site processing eliminates cell degradation risk from external transport' } as Record<Language, string>,
  },
  {
    icon: <GraduationCap size={24} />,
    title: { ja: '東京大学医学博士が率いる専門チーム', 'zh-TW': '東京大學醫學博士領銜專業團隊', 'zh-CN': '东京大学医学博士领衔专业团队', en: 'Led by a University of Tokyo PhD' } as Record<Language, string>,
    desc: { ja: '永井恒志院長（東京大学医学博士）が率いる医療チーム。兵庫医科大学の研究支援による最先端のがん免疫細胞療法を提供', 'zh-TW': '永井恒志院長（東京大學醫學博士）領銜醫療團隊。兵庫醫科大學研究支持的最先端癌症免疫細胞療法', 'zh-CN': '永井恒志院长（东京大学医学博士）领衔医疗团队。兵库医科大学研究支持的最先端癌症免疫细胞疗法', en: 'Medical team led by Director Nagai Hisashi, PhD (University of Tokyo). Cutting-edge cancer immunocell therapy backed by Hyogo Medical University research' } as Record<Language, string>,
  },
  {
    icon: <ShieldCheck size={24} />,
    title: { ja: '厚労省認可・再生医療計画19件', 'zh-TW': '厚勞省認可・再生醫療計劃19件', 'zh-CN': '厚劳省认可・再生医疗计划19件', en: '19 MHLW-Approved Regen. Medicine Plans' } as Record<Language, string>,
    desc: { ja: '厚生労働省に19件の再生医療等提供計画が受理。法令を遵守した安全かつ合法的な治療を提供しています', 'zh-TW': '厚生勞動省受理19件再生醫療提供計劃。遵守法規提供安全且合法的治療', 'zh-CN': '厚生劳动省受理19件再生医疗提供计划。遵守法规提供安全且合法的治疗', en: '19 regenerative medicine plans accepted by MHLW. Safe and legal treatments in full regulatory compliance' } as Record<Language, string>,
  },
  {
    icon: <Award size={24} />,
    title: { ja: '兵庫医科大学発ベンチャー技術', 'zh-TW': '兵庫醫科大學創投技術', 'zh-CN': '兵库医科大学创投技术', en: 'Hyogo Medical University Venture Technology' } as Record<Language, string>,
    desc: { ja: '兵庫医科大学発ベンチャー企業である青山名城国際医療研究所の技術に基づく、科学的エビデンスのある先端免疫細胞療法', 'zh-TW': '基於兵庫醫科大學創投企業青山名城國際醫療研究所的技術，提供有科學依據的先端免疫細胞療法', 'zh-CN': '基于兵库医科大学创投企业青山名城国际医疗研究所的技术，提供有科学依据的先端免疫细胞疗法', en: 'Advanced immunocell therapy based on Aoyama Meijo International Medical Research Institute, a venture from Hyogo Medical University' } as Record<Language, string>,
  },
];

const CORE_THERAPIES = [
  {
    icon: <Dna size={28} />,
    title: { ja: 'WT1樹状細胞ワクチン療法', 'zh-TW': 'WT1樹突狀細胞疫苗療法', 'zh-CN': 'WT1树突状细胞疫苗疗法', en: 'WT1 Dendritic Cell Vaccine Therapy' } as Record<Language, string>,
    desc: { ja: '患者の血液から単核球を採取し、樹状細胞へ培養。WT1抗原（がん特異的ペプチド）と結合させワクチンを製造します。がん細胞を選択的に攻撃する多重免疫メカニズムを活性化し、抗がん免疫力を強化します。α-GalCer（NKT活性化物質）との併用プロトコルもご用意。', 'zh-TW': '從患者血液中提取單核細胞，培養為樹突狀細胞，結合WT1抗原（癌症特異性肽）製成疫苗。激活多重免疫機制選擇性攻擊癌細胞，強化抗癌免疫力。亦可搭配α-GalCer（NKT活化物質）併用方案。', 'zh-CN': '从患者血液中提取单核细胞，培养为树突状细胞，结合WT1抗原（癌症特异性肽）制成疫苗。激活多重免疫机制选择性攻击癌细胞，强化抗癌免疫力。亦可搭配α-GalCer（NKT活化物质）并用方案。', en: 'Monocytes from patient blood are cultured into dendritic cells and combined with WT1 antigen (a cancer-specific peptide) to create a vaccine. Activates multiple immune mechanisms to selectively attack cancer cells. An α-GalCer (NKT activator) combination protocol is also available.' } as Record<Language, string>,
    accent: '#2C3E50',
    bg: 'bg-[#E2EDF5]',
  },
  {
    icon: <Shield size={28} />,
    title: { ja: '高活性NK細胞療法', 'zh-TW': '高活性NK細胞療法', 'zh-CN': '高活性NK细胞疗法', en: 'Highly Active NK Cell Therapy' } as Record<Language, string>,
    desc: { ja: '患者自身のNK（ナチュラルキラー）細胞を体外で大量に増殖・活性化し、体内に戻す療法です。NK細胞はがん細胞を直接攻撃する能力を持ち、副作用が少なく身体への負担が低いのが特徴。スーパーNK細胞療法では活性度をさらに強化。進行がん患者にも適用可能です。', 'zh-TW': '將患者自身的NK（自然殺傷）細胞在體外大量增殖、活化後回輸體內。NK細胞具有直接攻擊癌細胞的能力，副作用少、身體負擔低。超級NK細胞療法可進一步強化活性度。適用於晚期癌症患者。', 'zh-CN': '将患者自身的NK（自然杀伤）细胞在体外大量增殖、活化后回输体内。NK细胞具有直接攻击癌细胞的能力，副作用少、身体负担低。超级NK细胞疗法可进一步强化活性度。适用于晚期癌症患者。', en: 'Patient\'s own NK (Natural Killer) cells are expanded and activated ex vivo, then reinfused. NK cells can directly attack cancer cells with low side effects and physical burden. Super NK cell therapy further enhances activity. Applicable to advanced cancer patients.' } as Record<Language, string>,
    accent: '#394E64',
    bg: 'bg-[#EFF3F7]',
  },
  {
    icon: <Zap size={28} />,
    title: { ja: 'NKT細胞活性化療法', 'zh-TW': 'NKT細胞活化療法', 'zh-CN': 'NKT细胞活化疗法', en: 'NKT Cell Activation Therapy' } as Record<Language, string>,
    desc: { ja: 'NKT細胞は先天免疫と獲得免疫の両方を発揮する特殊な免疫細胞です。二重の免疫機能で包括的にがん細胞を攻撃します。NK細胞・樹状細胞ワクチンとの三種複合療法により、多角的な免疫応答を引き出し、治療効果を最大化します。', 'zh-TW': 'NKT細胞是同時發揮先天免疫和獲得性免疫的特殊免疫細胞。以雙重免疫功能全面攻擊癌細胞。與NK細胞、樹突狀細胞疫苗三種複合療法結合，引發多角度免疫應答，最大化治療效果。', 'zh-CN': 'NKT细胞是同时发挥先天免疫和获得性免疫的特殊免疫细胞。以双重免疫功能全面攻击癌细胞。与NK细胞、树突状细胞疫苗三种复合疗法结合，引发多角度免疫应答，最大化治疗效果。', en: 'NKT cells are unique immune cells that activate both innate and adaptive immunity. They comprehensively attack cancer cells with dual immune functions. Combined with NK cells and DC vaccines in a triple combination therapy, they elicit multi-dimensional immune responses for maximum effect.' } as Record<Language, string>,
    accent: '#466777',
    bg: 'bg-[#E2EDF5]',
  },
];

const APPLICABLE_CANCERS = [
  { icon: <Activity size={18} />, name: { ja: '肺がん', 'zh-TW': '肺癌', 'zh-CN': '肺癌', en: 'Lung' } as Record<Language, string> },
  { icon: <CircleDot size={18} />, name: { ja: '胃がん', 'zh-TW': '胃癌', 'zh-CN': '胃癌', en: 'Stomach' } as Record<Language, string> },
  { icon: <Heart size={18} />, name: { ja: '大腸がん', 'zh-TW': '大腸癌', 'zh-CN': '大肠癌', en: 'Colorectal' } as Record<Language, string> },
  { icon: <Scan size={18} />, name: { ja: '肝臓がん', 'zh-TW': '肝癌', 'zh-CN': '肝癌', en: 'Liver' } as Record<Language, string> },
  { icon: <FlaskConical size={18} />, name: { ja: '膵臓がん', 'zh-TW': '胰腺癌', 'zh-CN': '胰腺癌', en: 'Pancreatic' } as Record<Language, string> },
  { icon: <Sparkles size={18} />, name: { ja: '乳がん', 'zh-TW': '乳腺癌', 'zh-CN': '乳腺癌', en: 'Breast' } as Record<Language, string> },
  { icon: <Droplets size={18} />, name: { ja: '卵巣がん', 'zh-TW': '卵巢癌', 'zh-CN': '卵巢癌', en: 'Ovarian' } as Record<Language, string> },
  { icon: <Shield size={18} />, name: { ja: '前立腺がん', 'zh-TW': '前列腺癌', 'zh-CN': '前列腺癌', en: 'Prostate' } as Record<Language, string> },
  { icon: <Brain size={18} />, name: { ja: '脳腫瘍', 'zh-TW': '腦腫瘤', 'zh-CN': '脑肿瘤', en: 'Brain' } as Record<Language, string> },
  { icon: <Dna size={18} />, name: { ja: '血液がん', 'zh-TW': '血液癌', 'zh-CN': '血液癌', en: 'Blood' } as Record<Language, string> },
  { icon: <Globe size={18} />, name: { ja: '腎臓がん', 'zh-TW': '腎癌', 'zh-CN': '肾癌', en: 'Kidney' } as Record<Language, string> },
  { icon: <Stethoscope size={18} />, name: { ja: '食道がん', 'zh-TW': '食道癌', 'zh-CN': '食道癌', en: 'Esophageal' } as Record<Language, string> },
];

const TREATMENT_MENU = [
  {
    id: 'consultation',
    icon: Stethoscope,
    category: { ja: '診察', 'zh-TW': '診察', 'zh-CN': '诊察', en: 'Consultation' } as Record<Language, string>,
    items: [
      { name: { ja: '医療相談（初回）', 'zh-TW': '醫療諮詢（初次）', 'zh-CN': '医疗咨询（初次）', en: 'Medical Counseling (1st)' } as Record<Language, string>, price: { ja: '無料', 'zh-TW': '免費', 'zh-CN': '免费', en: 'Free' } as Record<Language, string> },
      { name: { ja: '医療相談（2回目以降）', 'zh-TW': '醫療諮詢（第2次起）', 'zh-CN': '医疗咨询（第2次起）', en: 'Medical Counseling (2nd+)' } as Record<Language, string>, price: '¥11,000' as string | Record<Language, string> },
      { name: { ja: '初診', 'zh-TW': '初診', 'zh-CN': '初诊', en: 'First Visit' } as Record<Language, string>, price: '¥11,000' as string | Record<Language, string> },
      { name: { ja: '再診', 'zh-TW': '複診', 'zh-CN': '复诊', en: 'Follow-up Visit' } as Record<Language, string>, price: '¥3,300' as string | Record<Language, string> },
    ],
  },
  {
    id: 'tests',
    icon: Microscope,
    category: { ja: '検査', 'zh-TW': '檢查', 'zh-CN': '检查', en: 'Tests' } as Record<Language, string>,
    items: [
      { name: { ja: '血算生化学検査', 'zh-TW': '血液生化學檢查', 'zh-CN': '血液生化学检查', en: 'CBC & Biochemistry' } as Record<Language, string>, price: '¥3,300' as string | Record<Language, string> },
      { name: { ja: 'がん初回採血セット', 'zh-TW': '癌症初次採血套組', 'zh-CN': '癌症初次采血套组', en: 'Cancer Initial Blood Panel' } as Record<Language, string>, price: '¥19,800' as string | Record<Language, string> },
      { name: { ja: '免疫機能検査', 'zh-TW': '免疫功能檢查', 'zh-CN': '免疫功能检查', en: 'Immune Function Test' } as Record<Language, string>, price: '¥6,600' as string | Record<Language, string> },
      { name: { ja: '腫瘍マーカー（1項目）', 'zh-TW': '腫瘤標記物（1項）', 'zh-CN': '肿瘤标记物（1项）', en: 'Tumor Marker (per item)' } as Record<Language, string>, price: '¥2,500' as string | Record<Language, string> },
      { name: { ja: '感染症5種検査', 'zh-TW': '5種感染症檢查', 'zh-CN': '5种感染症检查', en: 'Infection Panel (5 types)' } as Record<Language, string>, price: '¥28,600' as string | Record<Language, string> },
    ],
  },
  {
    id: 'immunotherapy',
    icon: Dna,
    category: { ja: 'がん免疫細胞療法', 'zh-TW': '癌症免疫細胞療法', 'zh-CN': '癌症免疫细胞疗法', en: 'Cancer Immunotherapy' } as Record<Language, string>,
    items: [
      { name: { ja: 'スーパーNK細胞療法', 'zh-TW': '超級NK細胞療法', 'zh-CN': '超级NK细胞疗法', en: 'Super NK Cell Therapy' } as Record<Language, string>, price: '¥451,000' as string | Record<Language, string> },
      { name: { ja: 'NK細胞療法', 'zh-TW': 'NK細胞療法', 'zh-CN': 'NK细胞疗法', en: 'NK Cell Therapy' } as Record<Language, string>, price: '¥253,000' as string | Record<Language, string> },
      { name: { ja: 'α-GalCer+WT1 DC 1クール', 'zh-TW': 'α-GalCer+WT1 DC 1療程', 'zh-CN': 'α-GalCer+WT1 DC 1疗程', en: 'α-GalCer+WT1 DC 1 Course' } as Record<Language, string>, price: '¥3,223,000' as string | Record<Language, string> },
      { name: { ja: 'WT1 DC ワクチン', 'zh-TW': 'WT1 DC 疫苗', 'zh-CN': 'WT1 DC 疫苗', en: 'WT1 DC Vaccine' } as Record<Language, string>, price: '¥451,000' as string | Record<Language, string> },
      { name: { ja: 'NKT三種複合療法', 'zh-TW': 'NKT三種複合療法', 'zh-CN': 'NKT三种复合疗法', en: 'NKT Triple Combination' } as Record<Language, string>, price: '¥572,000' as string | Record<Language, string> },
    ],
  },
  {
    id: 'checkpoint',
    icon: Shield,
    category: { ja: '免疫チェックポイント阻害薬', 'zh-TW': '免疫檢查點抑制劑', 'zh-CN': '免疫检查点抑制剂', en: 'Checkpoint Inhibitors' } as Record<Language, string>,
    items: [
      { name: { ja: 'ヤーボイ（イピリムマブ）', 'zh-TW': 'Yervoy（Ipilimumab）', 'zh-CN': 'Yervoy（Ipilimumab）', en: 'Yervoy (Ipilimumab)' } as Record<Language, string>, price: '¥267,300' as string | Record<Language, string> },
      { name: { ja: 'オプジーボ（ニボルマブ）', 'zh-TW': 'Opdivo（Nivolumab）', 'zh-CN': 'Opdivo（Nivolumab）', en: 'Opdivo (Nivolumab)' } as Record<Language, string>, price: '¥132,000' as string | Record<Language, string> },
      { name: { ja: 'テセントリク（アテゾリズマブ）', 'zh-TW': 'Tecentriq（Atezolizumab）', 'zh-CN': 'Tecentriq（Atezolizumab）', en: 'Tecentriq (Atezolizumab)' } as Record<Language, string>, price: '¥165,000' as string | Record<Language, string> },
    ],
  },
  {
    id: 'stemcell',
    icon: Beaker,
    category: { ja: '幹細胞治療', 'zh-TW': '幹細胞治療', 'zh-CN': '干细胞治疗', en: 'Stem Cell Therapy' } as Record<Language, string>,
    items: [
      { name: { ja: '脂肪由来幹細胞治療（1回）', 'zh-TW': '脂肪來源幹細胞治療（1次）', 'zh-CN': '脂肪来源干细胞治疗（1次）', en: 'Adipose-Derived Stem Cell (per session)' } as Record<Language, string>, price: '¥3,355,000' as string | Record<Language, string> },
    ],
  },
];

const TREATMENT_FLOW = [
  {
    step: 1,
    title: { ja: '相談・診察', 'zh-TW': '諮詢診察', 'zh-CN': '咨询诊察', en: 'Consultation & Examination' } as Record<Language, string>,
    desc: { ja: '初回無料カウンセリング。医師が詳細に病状を評価し、最適な治療プランをご提案します。遠隔相談も対応可能', 'zh-TW': '初次免費諮詢。醫師詳細評估病情，提出最適合的治療方案。亦可遠程諮詢', 'zh-CN': '初次免费咨询。医师详细评估病情，提出最适合的治疗方案。亦可远程咨询', en: 'Free initial counseling. Doctor assesses condition in detail and proposes an optimal treatment plan. Remote consultation also available' } as Record<Language, string>,
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
    title: { ja: '細胞培養（院内CPC）', 'zh-TW': '細胞培養（院內CPC）', 'zh-CN': '细胞培养（院内CPC）', en: 'Cell Culture (In-House CPC)' } as Record<Language, string>,
    desc: { ja: '院内GMP基準CPCで約3週間培養し、ワクチンを製造。厳格な品質管理のもとで実施します', 'zh-TW': '在院內GMP標準CPC中培養約3週製成疫苗。在嚴格品質管控下進行', 'zh-CN': '在院内GMP标准CPC中培养约3周制成疫苗。在严格品质管控下进行', en: 'Cultured for ~3 weeks in GMP-grade in-house CPC to produce vaccine. Under strict quality control' } as Record<Language, string>,
    icon: <Microscope size={20} />,
  },
  {
    step: 4,
    title: { ja: '定期治療', 'zh-TW': '定期治療', 'zh-CN': '定期治疗', en: 'Periodic Treatment' } as Record<Language, string>,
    desc: { ja: '2週間ごとに皮内注射を実施。1回約30分、1クール7回の治療です。経過をモニタリングしながら進めます', 'zh-TW': '每2週進行皮內注射。每次約30分鐘，1療程共7次。邊監測進展邊進行', 'zh-CN': '每2周进行皮内注射。每次约30分钟，1疗程共7次。边监测进展边进行', en: 'Intradermal injection every 2 weeks. ~30 min per session, 7 sessions per course. Progress is monitored throughout' } as Record<Language, string>,
    icon: <CheckCircle size={20} />,
  },
];

const FAQ_DATA = [
  {
    q: { ja: '入院は必要ですか？', 'zh-TW': '需要住院嗎？', 'zh-CN': '需要住院吗？', en: 'Is hospitalization required?' } as Record<Language, string>,
    a: { ja: '入院の必要はありません。免疫細胞療法はすべて外来で行えます。点滴や注射は30分〜1時間程度で完了し、日帰りで治療が可能です。', 'zh-TW': '無需住院。免疫細胞療法全部可在門診進行。點滴或注射約30分鐘至1小時即可完成，當天即可返回。', 'zh-CN': '无需住院。免疫细胞疗法全部可在门诊进行。点滴或注射约30分钟至1小时即可完成，当天即可返回。', en: 'No hospitalization is needed. All immunocell therapies are outpatient procedures. Drips and injections take 30 minutes to 1 hour and can be completed in a day visit.' } as Record<Language, string>,
  },
  {
    q: { ja: '副作用はありますか？', 'zh-TW': '有副作用嗎？', 'zh-CN': '有副作用吗？', en: 'Are there side effects?' } as Record<Language, string>,
    a: { ja: '自己の免疫細胞を用いるため、重篤な副作用は稀です。一時的な微熱や注射部位の軽度発赤が見られる場合がありますが、通常は短時間で治まります。免疫チェックポイント阻害薬との併用時は、医師が副作用を注意深くモニタリングします。', 'zh-TW': '因使用自身免疫細胞，嚴重副作用極為罕見。可能出現暫時性微熱或注射部位輕度發紅，通常短時間即可消退。併用免疫檢查點抑制劑時，醫師會密切監測副作用。', 'zh-CN': '因使用自身免疫细胞，严重副作用极为罕见。可能出现暂时性微热或注射部位轻度发红，通常短时间即可消退。并用免疫检查点抑制剂时，医师会密切监测副作用。', en: 'Since we use the patient\'s own immune cells, serious side effects are rare. Temporary mild fever or slight redness at the injection site may occur but typically resolves quickly. When combining with checkpoint inhibitors, doctors carefully monitor for side effects.' } as Record<Language, string>,
  },
  {
    q: { ja: '他の治療（手術・化学療法・放射線）と併用できますか？', 'zh-TW': '可以和其他治療（手術、化療、放療）併用嗎？', 'zh-CN': '可以和其他治疗（手术、化疗、放疗）并用吗？', en: 'Can it be combined with other treatments (surgery, chemo, radiation)?' } as Record<Language, string>,
    a: { ja: 'はい、併用可能です。免疫細胞療法は手術・化学療法・放射線療法との併用が可能で、相乗効果が期待できます。他院での治療を受けながら当クリニックで免疫細胞療法を行う患者様も多くいらっしゃいます。', 'zh-TW': '可以。免疫細胞療法可與手術、化療、放療併用，預期可產生協同效果。很多患者在其他醫院接受治療的同時在本診所進行免疫細胞療法。', 'zh-CN': '可以。免疫细胞疗法可与手术、化疗、放疗并用，预期可产生协同效果。很多患者在其他医院接受治疗的同时在本诊所进行免疫细胞疗法。', en: 'Yes. Immunocell therapy can be combined with surgery, chemotherapy, and radiation therapy, and synergistic effects can be expected. Many patients receive treatment at other hospitals while undergoing immunocell therapy at our clinic.' } as Record<Language, string>,
  },
  {
    q: { ja: '費用はどのくらいかかりますか？', 'zh-TW': '費用大約需要多少？', 'zh-CN': '费用大约需要多少？', en: 'What is the estimated cost?' } as Record<Language, string>,
    a: { ja: '治療内容により異なりますが、NK細胞療法は1回¥253,000から、WT1 DCワクチンは1回¥451,000から、α-GalCer+WT1 DC 1クール（7回）は¥3,223,000です。初回の医療相談は無料ですので、まずはご相談ください。', 'zh-TW': '依治療內容不同而異。NK細胞療法每次¥253,000起，WT1 DC疫苗每次¥451,000起，α-GalCer+WT1 DC 1療程（7次）¥3,223,000。初次醫療諮詢免費，歡迎先來諮詢。', 'zh-CN': '依治疗内容不同而异。NK细胞疗法每次¥253,000起，WT1 DC疫苗每次¥451,000起，α-GalCer+WT1 DC 1疗程（7次）¥3,223,000。初次医疗咨询免费，欢迎先来咨询。', en: 'Costs vary by treatment. NK cell therapy starts at ¥253,000 per session, WT1 DC vaccine at ¥451,000, and α-GalCer+WT1 DC course (7 sessions) is ¥3,223,000. Initial medical counseling is free, so please consult us first.' } as Record<Language, string>,
  },
  {
    q: { ja: 'どのような方が対象ですか？', 'zh-TW': '什麼樣的人適合治療？', 'zh-CN': '什么样的人适合治疗？', en: 'Who is eligible for treatment?' } as Record<Language, string>,
    a: { ja: 'がんと診断された方が対象です。ステージI〜IVまで対応可能で、特に進行がん・再発がん・転移がんの方にご検討いただいています。年齢制限は原則ありませんが、治療の適応は医師が個別に判断いたします。', 'zh-TW': '被診斷為癌症的患者均為對象。可對應Stage I～IV，特別建議晚期癌症、復發癌症、轉移癌的患者考慮。原則上無年齡限制，但治療適應性由醫師個別判斷。', 'zh-CN': '被诊断为癌症的患者均为对象。可对应Stage I～IV，特别建议晚期癌症、复发癌症、转移癌的患者考虑。原则上无年龄限制，但治疗适应性由医师个别判断。', en: 'Patients diagnosed with cancer are eligible. We treat Stages I-IV, and immunocell therapy is particularly recommended for advanced, recurrent, or metastatic cancers. There is no age limit in principle, but treatment suitability is assessed individually by the doctor.' } as Record<Language, string>,
  },
  {
    q: { ja: '海外から来院する場合、どのようなサポートがありますか？', 'zh-TW': '從海外前來就診時，有什麼支援服務？', 'zh-CN': '从海外前来就诊时，有什么支援服务？', en: 'What support is available for international patients?' } as Record<Language, string>,
    a: { ja: '中国語対応スタッフが常駐しており、病歴翻訳・通訳・治療プラン説明・費用見積もりまでサポートいたします。遠隔相談（ビデオ通話）で事前に医師とご相談いただくことも可能です。', 'zh-TW': '本診所常駐中文對應工作人員，可提供病歷翻譯、口譯、治療方案說明、費用估算等全方位支援。亦可通過遠程諮詢（視頻通話）事先與醫師溝通。', 'zh-CN': '本诊所常驻中文对应工作人员，可提供病历翻译、口译、治疗方案说明、费用估算等全方位支援。亦可通过远程咨询（视频通话）事先与医师沟通。', en: 'Chinese-speaking staff are available to assist with medical record translation, interpretation, treatment plan explanation, and cost estimates. You can also have a pre-visit consultation with the doctor via remote video call.' } as Record<Language, string>,
  },
];

const DOCTOR_CREDENTIALS = [
  { ja: '医師、医学博士（東京大学）', 'zh-TW': '醫師、醫學博士（東京大學）', 'zh-CN': '医师、医学博士（东京大学）', en: 'MD, PhD (University of Tokyo)' } as Record<Language, string>,
  { ja: '東海大学大学院 客員准教授', 'zh-TW': '東海大學研究院 客座副教授', 'zh-CN': '东海大学研究院 客座副教授', en: 'Visiting Associate Professor, Tokai University' } as Record<Language, string>,
  { ja: '金沢医科大学卒業', 'zh-TW': '金澤醫科大學畢業', 'zh-CN': '金泽医科大学毕业', en: 'Graduated from Kanazawa Medical University' } as Record<Language, string>,
  { ja: '東京大学附属病院 研修', 'zh-TW': '東京大學附屬醫院 研修', 'zh-CN': '东京大学附属医院 研修', en: 'Residency at University of Tokyo Hospital' } as Record<Language, string>,
];

const DOCTOR_SPECIALTIES = [
  { ja: '再生医療（細胞医学）', 'zh-TW': '再生醫療（細胞醫學）', 'zh-CN': '再生医疗（细胞医学）', en: 'Regenerative Medicine (Cell Medicine)' } as Record<Language, string>,
  { ja: '腫瘍免疫学', 'zh-TW': '腫瘤免疫學', 'zh-CN': '肿瘤免疫学', en: 'Tumor Immunology' } as Record<Language, string>,
  { ja: '抗加齢医学', 'zh-TW': '抗衰老醫學', 'zh-CN': '抗衰老医学', en: 'Anti-Aging Medicine' } as Record<Language, string>,
];

const DOCTOR_MEMBERSHIPS = [
  { ja: '日本がん免疫学会', 'zh-TW': '日本癌症免疫學會', 'zh-CN': '日本癌症免疫学会', en: 'Japanese Association for Cancer Immunology' } as Record<Language, string>,
  { ja: '日本再生医療学会', 'zh-TW': '日本再生醫療學會', 'zh-CN': '日本再生医疗学会', en: 'Japanese Society for Regenerative Medicine' } as Record<Language, string>,
];

// Component
interface GinzaPhoenixContentProps {
  isGuideEmbed?: boolean;
  guideSlug?: string;
}

export default function GinzaPhoenixContent({ isGuideEmbed, guideSlug }: GinzaPhoenixContentProps) {
  const lang = useLanguage();
  const [expandedTherapy, setExpandedTherapy] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const checkoutHref = (path: string) => {
    if (isGuideEmbed) return '#consultation';
    return guideSlug ? `${path}?guide=${guideSlug}` : path;
  };

  return (
    <div className="min-h-screen bg-white">

      {/* 1. HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <img
          src={IMAGES.hero}
          alt="Ginza Phoenix Clinic"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50]/95 via-[#2C3E50]/75 to-[#2C3E50]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/60 via-transparent to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="max-w-2xl">
            {/* Motto */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[2px] w-12 bg-white/50" />
              <span className="text-sm tracking-[0.15em] text-white/80 font-medium italic">
                {t.heroMotto[lang]}
              </span>
            </div>

            {/* Stage IV badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm mb-6 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
              {t.heroStage4[lang]}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
              {t.heroTitle[lang]}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-5">
              {t.heroSubtitle[lang]}
            </p>

            {/* Description */}
            <p className="text-base text-white/70 leading-relaxed mb-8 whitespace-pre-line max-w-xl border-l-2 border-[#466777] pl-4">
              {t.heroDesc[lang]}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={checkoutHref('/ginza-phoenix/initial-consultation')}
                className="inline-flex items-center justify-center gap-3 bg-white text-[#2C3E50] px-8 py-4 rounded-full font-bold hover:bg-[#E2EDF5] transition-all shadow-lg hover:shadow-xl"
              >
                {t.ctaBook[lang]} <ArrowRight size={18} />
              </Link>
              <Link
                href={checkoutHref('/ginza-phoenix/remote-consultation')}
                className="inline-flex items-center justify-center gap-3 bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all border border-white/25 backdrop-blur-sm"
              >
                {t.ctaRemote[lang]} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-gradient-to-r from-[#2C3E50] to-[#394E64] py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {stat.value}<span className="text-lg text-white/50 ml-1">{stat.unit[lang]}</span>
                </div>
                <div className="text-sm text-white/60 mt-1">{stat.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CLINIC INTRODUCTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#E2EDF5] text-[#2C3E50] text-xs font-medium rounded-full mb-4">
              {t.introTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333]">{t.introTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[#333333]/80 leading-relaxed text-sm md:text-base">
                {t.introText[lang]}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { ja: '自由診療', 'zh-TW': '自費診療', 'zh-CN': '自费诊疗', en: 'Self-pay' },
                  { ja: '完全予約制', 'zh-TW': '全預約制', 'zh-CN': '全预约制', en: 'Appointment Only' },
                  { ja: '中国語対応', 'zh-TW': '中文服務', 'zh-CN': '中文服务', en: 'Chinese Support' },
                ].map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF3F7] text-[#2C3E50] text-xs font-medium rounded-full border border-[#E2EDF5]">
                    <CheckCircle size={12} />
                    {(tag as Record<Language, string>)[lang]}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src={IMAGES.entrance} alt="Clinic entrance" className="rounded-xl w-full h-40 object-cover" />
              <img src={IMAGES.interiorReception} alt="Reception" className="rounded-xl w-full h-40 object-cover" />
              <img src={IMAGES.reception} alt="Waiting area" className="rounded-xl w-full h-40 object-cover col-span-2" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-20 bg-[#EFF3F7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-white text-[#2C3E50] text-xs font-medium rounded-full mb-4 border border-[#E2EDF5]">
              {t.whyTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333]">{t.whyTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {WHY_CHOOSE_US.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#E2EDF5] hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#E2EDF5] rounded-xl flex items-center justify-center text-[#2C3E50] mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#333333] mb-2">{item.title[lang]}</h3>
                <p className="text-sm text-[#333333]/70 leading-relaxed">{item.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CORE THERAPIES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[#E2EDF5] text-[#2C3E50] text-xs font-medium rounded-full mb-4">
              {t.therapyTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333]">{t.therapyTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CORE_THERAPIES.map((therapy, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl border border-[#E2EDF5] ${therapy.bg} hover:shadow-lg transition-all cursor-pointer`}
                onClick={() => setExpandedTherapy(expandedTherapy === i ? null : i)}
              >
                <div className="p-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5"
                    style={{ backgroundColor: therapy.accent }}
                  >
                    {therapy.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#333333] mb-3">{therapy.title[lang]}</h3>
                  <p className={`text-sm text-[#333333]/70 leading-relaxed ${expandedTherapy === i ? '' : 'line-clamp-3'}`}>
                    {therapy.desc[lang]}
                  </p>
                  <button className="mt-4 text-xs text-[#466777] flex items-center gap-1 font-medium">
                    {expandedTherapy === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expandedTherapy === i
                      ? (lang === 'ja' ? '閉じる' : lang === 'en' ? 'Less' : lang === 'zh-TW' ? '收起' : '收起')
                      : (lang === 'ja' ? 'もっと見る' : lang === 'en' ? 'More' : lang === 'zh-TW' ? '展開' : '展开')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. APPLICABLE CANCERS */}
      <section className="py-20 bg-[#EFF3F7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 bg-white text-[#2C3E50] text-xs font-medium rounded-full mb-4 border border-[#E2EDF5]">
              {t.cancerTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333] mb-3">{t.cancerTitle[lang]}</h2>
            <p className="text-[#333333]/60 max-w-2xl mx-auto text-sm">{t.cancerSubtitle[lang]}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-10">
            {APPLICABLE_CANCERS.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[#E2EDF5] bg-white text-sm font-medium text-[#2C3E50] hover:bg-[#E2EDF5] transition-colors">
                <span className="text-[#466777]">{item.icon}</span>
                <span>{item.name[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TREATMENT COST MENU */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#E2EDF5] text-[#2C3E50] text-xs font-medium rounded-full mb-4">
              {t.menuTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333] mb-3">{t.menuTitle[lang]}</h2>
            <p className="text-[#333333]/60 text-sm">{t.menuSubtitle[lang]}</p>
          </div>
          <div className="space-y-3">
            {TREATMENT_MENU.map((cat) => {
              const Icon = cat.icon;
              const isOpen = openMenu === cat.id;
              return (
                <div key={cat.id} className="border border-[#E2EDF5] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : cat.id)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#EFF3F7] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#E2EDF5] flex items-center justify-center text-[#2C3E50]">
                        <Icon size={18} />
                      </div>
                      <span className="font-bold text-[#333333] text-sm md:text-base">{cat.category[lang]}</span>
                      <span className="text-xs text-[#466777] bg-[#EFF3F7] px-2 py-0.5 rounded-full">
                        {cat.items.length}
                        {lang === 'ja' ? '項目' : lang === 'en' ? ' items' : '项'}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-[#466777]" /> : <ChevronDown size={18} className="text-[#466777]" />}
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#E2EDF5]">
                      {cat.items.map((item, j) => {
                        const priceStr = typeof item.price === 'string' ? item.price : item.price[lang];
                        return (
                          <div key={j} className="flex items-center justify-between px-6 py-3.5 border-b border-[#EFF3F7] last:border-0 hover:bg-[#EFF3F7]/50 transition-colors">
                            <span className="text-sm text-[#333333]">{item.name[lang]}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-[#2C3E50]">{priceStr}</span>
                              <Link
                                href={checkoutHref('/ginza-phoenix/initial-consultation')}
                                className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-[#2C3E50] text-white text-xs rounded-full hover:bg-[#394E64] transition-colors"
                              >
                                {t.bookBtn[lang]}
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#333333]/50 mt-4 text-center">
            {lang === 'ja' ? '※表示価格は全て税込です。治療内容・回数により費用が異なります' :
             lang === 'en' ? '* All prices include tax. Costs vary by treatment type and number of sessions' :
             lang === 'zh-TW' ? '※以上價格均含稅。費用依治療內容及次數而異' :
             '※以上价格均含税。费用依治疗内容及次数而异'}
          </p>
        </div>
      </section>

      {/* 8. TREATMENT FLOW */}
      <section className="py-20 bg-[#EFF3F7]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-white text-[#2C3E50] text-xs font-medium rounded-full mb-4 border border-[#E2EDF5]">
              {t.flowTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333]">{t.flowTitle[lang]}</h2>
          </div>
          <div className="space-y-0">
            {TREATMENT_FLOW.map((step, i) => (
              <div key={i} className="flex gap-6">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#2C3E50] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {step.step}
                  </div>
                  {i < TREATMENT_FLOW.length - 1 && (
                    <div className="w-0.5 h-full bg-[#E2EDF5] min-h-[60px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#2C3E50]">{step.icon}</span>
                    <h3 className="text-lg font-bold text-[#333333]">{step.title[lang]}</h3>
                  </div>
                  <p className="text-sm text-[#333333]/70 leading-relaxed">{step.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CPC SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#E2EDF5] text-[#2C3E50] text-xs font-medium rounded-full mb-4">
              {t.cpcTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333]">{t.cpcTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <img
                src={IMAGES.cpc}
                alt="CPC - Cell Processing Center"
                className="rounded-2xl w-full object-cover shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#2C3E50] text-white px-5 py-3 rounded-xl shadow-lg">
                <p className="text-xs font-medium">GMP Grade</p>
                <p className="text-lg font-bold">
                  {lang === 'ja' ? 'クリーンルーム完備' :
                   lang === 'en' ? 'Clean Room Equipped' :
                   lang === 'zh-TW' ? '潔淨室完備' :
                   '洁净室完备'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[#333333]/80 leading-relaxed text-sm md:text-base mb-6">
                {t.cpcDesc[lang]}
              </p>
              <div className="space-y-3">
                {[
                  { ja: '細胞採取から投与まで院内一貫管理', 'zh-TW': '從細胞採集到給藥院內一貫管理', 'zh-CN': '从细胞采集到给药院内一贯管理', en: 'End-to-end in-house cell management' },
                  { ja: '外部輸送による細胞劣化リスクを排除', 'zh-TW': '排除外部運輸導致的細胞劣化風險', 'zh-CN': '排除外部运输导致的细胞劣化风险', en: 'Eliminates cell degradation from transport' },
                  { ja: 'GMP基準のクリーンルームで培養', 'zh-TW': 'GMP標準潔淨室培養', 'zh-CN': 'GMP标准洁净室培养', en: 'Culture in GMP-grade clean rooms' },
                  { ja: '厳格な品質管理プロトコル', 'zh-TW': '嚴格的品質管理協議', 'zh-CN': '严格的品质管理协议', en: 'Strict quality control protocols' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={16} className="text-[#2C3E50] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#333333]/80">{(item as Record<Language, string>)[lang]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. DOCTOR PROFILE */}
      <section className="py-20 bg-[#EFF3F7]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-white text-[#2C3E50] text-xs font-medium rounded-full mb-4 border border-[#E2EDF5]">
              {t.doctorTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333]">{t.doctorTitle[lang]}</h2>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E2EDF5]">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Photo */}
              <div className="md:col-span-2">
                <img
                  src={IMAGES.drNagaiPortrait}
                  alt="Dr. Nagai Hisashi"
                  className="w-full h-full object-cover min-h-[300px]"
                />
              </div>
              {/* Info */}
              <div className="md:col-span-3 p-8">
                <h3 className="text-2xl font-bold text-[#333333] mb-1">
                  {lang === 'ja' ? '永井 恒志' : lang === 'en' ? 'Nagai Hisashi' : '永井 恒志'}
                </h3>
                <p className="text-sm text-[#466777] font-medium mb-4">
                  {lang === 'ja' ? '理事長・院長' : lang === 'en' ? 'Chairman & Director' : lang === 'zh-TW' ? '理事長・院長' : '理事长・院长'}
                </p>

                {/* Credentials */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2">
                    {lang === 'ja' ? '経歴・資格' : lang === 'en' ? 'Credentials' : lang === 'zh-TW' ? '經歷・資格' : '经历・资格'}
                  </h4>
                  <div className="space-y-1.5">
                    {DOCTOR_CREDENTIALS.map((cred, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <GraduationCap size={14} className="text-[#466777] mt-0.5 shrink-0" />
                        <span className="text-xs text-[#333333]/80">{cred[lang]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2">
                    {lang === 'ja' ? '専門分野' : lang === 'en' ? 'Specialties' : lang === 'zh-TW' ? '專業領域' : '专业领域'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {DOCTOR_SPECIALTIES.map((spec, i) => (
                      <span key={i} className="px-3 py-1 bg-[#E2EDF5] text-[#2C3E50] text-xs rounded-full font-medium">
                        {spec[lang]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Memberships */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2">
                    {lang === 'ja' ? '学会' : lang === 'en' ? 'Memberships' : lang === 'zh-TW' ? '學會' : '学会'}
                  </h4>
                  <div className="space-y-1">
                    {DOCTOR_MEMBERSHIPS.map((mem, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Award size={14} className="text-[#466777] mt-0.5 shrink-0" />
                        <span className="text-xs text-[#333333]/80">{mem[lang]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publications */}
                <div>
                  <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2">
                    {lang === 'ja' ? '論文掲載誌' : lang === 'en' ? 'Publications' : lang === 'zh-TW' ? '論文發表' : '论文发表'}
                  </h4>
                  <p className="text-xs text-[#333333]/60">Cureus, Cancer Medicine etc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CLINIC ENVIRONMENT */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#E2EDF5] text-[#2C3E50] text-xs font-medium rounded-full mb-4">
              {t.envTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333]">{t.envTitle[lang]}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 row-span-2">
              <img src={IMAGES.interiorReception} alt="Reception & Waiting" className="rounded-xl w-full h-full object-cover min-h-[250px]" />
            </div>
            <div>
              <img src={IMAGES.treatmentRoom} alt="Treatment Room" className="rounded-xl w-full h-full object-cover min-h-[120px]" />
            </div>
            <div>
              <img src={IMAGES.waitingRoom} alt="Waiting Room" className="rounded-xl w-full h-full object-cover min-h-[120px]" />
            </div>
            <div>
              <img src={IMAGES.treatmentRoom2} alt="Treatment Room 2" className="rounded-xl w-full h-full object-cover min-h-[120px]" />
            </div>
            <div>
              <img src={IMAGES.consultation} alt="Consultation" className="rounded-xl w-full h-full object-cover min-h-[120px]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 text-center text-xs text-[#333333]/50">
            <p>{lang === 'ja' ? '受付・待合室' : lang === 'en' ? 'Reception & Waiting' : lang === 'zh-TW' ? '候診區' : '候诊区'}</p>
            <p>{lang === 'ja' ? '診療室' : lang === 'en' ? 'Treatment Room' : lang === 'zh-TW' ? '診療室' : '诊疗室'}</p>
            <p>{lang === 'ja' ? '相談室' : lang === 'en' ? 'Consultation Room' : lang === 'zh-TW' ? '諮詢室' : '咨询室'}</p>
          </div>
        </div>
      </section>

      {/* 12. ACCESS */}
      <section className="py-20 bg-[#EFF3F7]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-white text-[#2C3E50] text-xs font-medium rounded-full mb-4 border border-[#E2EDF5]">
              {t.accessTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333]">{t.accessTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Building photo */}
            <div className="relative rounded-2xl overflow-hidden">
              <img src={IMAGES.udxBuilding} alt="Akihabara UDX Building" className="w-full h-full object-cover min-h-[300px]" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2C3E50]/90 to-transparent p-6">
                <p className="text-white font-bold text-lg">
                  {lang === 'ja' ? '秋葉原UDXビル' : lang === 'en' ? 'Akihabara UDX Building' : lang === 'zh-TW' ? '秋葉原UDX大廈' : '秋叶原UDX大厦'}
                </p>
                <p className="text-white/70 text-sm">6F Clinic Mall</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#466777] mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-[#333333] text-sm">
                    {lang === 'ja' ? '銀座鳳凰クリニック' :
                     lang === 'en' ? 'Ginza Phoenix Clinic' :
                     lang === 'zh-TW' ? '銀座鳳凰診所' :
                     '银座凤凰诊所'}
                  </p>
                  <p className="text-sm text-[#333333]/70">
                    {lang === 'ja' ? '〒101-0021 東京都千代田区外神田4-14-1 秋葉原UDXビル6F クリニックモール' :
                     lang === 'en' ? '6F Clinic Mall, Akihabara UDX Bldg, 4-14-1 Sotokanda, Chiyoda-ku, Tokyo 101-0021' :
                     lang === 'zh-TW' ? '〒101-0021 東京都千代田區外神田4-14-1 秋葉原UDX大廈6F 診所商場' :
                     '〒101-0021 东京都千代田区外神田4-14-1 秋叶原UDX大厦6F 诊所商场'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Train size={20} className="text-[#466777] mt-0.5 shrink-0" />
                <div className="text-sm text-[#333333]/70 space-y-1">
                  <p>
                    {lang === 'ja' ? 'JR秋葉原駅 電気街口 徒歩2分' :
                     lang === 'en' ? 'JR Akihabara Station, Electric Town Exit — 2 min walk' :
                     lang === 'zh-TW' ? 'JR秋葉原站 電器街出口 步行2分鐘' :
                     'JR秋叶原站 电器街出口 步行2分钟'}
                  </p>
                  <p>
                    {lang === 'ja' ? '東京メトロ 末広町駅 徒歩3分' :
                     lang === 'en' ? 'Tokyo Metro Suehirocho Station — 3 min walk' :
                     lang === 'zh-TW' ? '東京地鐵 末廣町站 步行3分鐘' :
                     '东京地铁 末广町站 步行3分钟'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[#466777] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#333333]/70">10:00 - 17:00</p>
                  <p className="text-xs text-[#333333]/50">
                    {lang === 'ja' ? '月〜日（祝日含む）・完全予約制' :
                     lang === 'en' ? 'Mon-Sun (incl. holidays) — Appointment only' :
                     lang === 'zh-TW' ? '週一至週日（含假日）・全預約制' :
                     '周一至周日（含假日）・全预约制'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 size={20} className="text-[#466777] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#333333]/70">
                    {lang === 'ja' ? '運営: 株式会社青山名城国際医療研究所' :
                     lang === 'en' ? 'Operated by: Aoyama Meijo International Medical Research Institute' :
                     lang === 'zh-TW' ? '運營: 株式會社青山名城國際醫療研究所' :
                     '运营: 株式会社青山名城国际医疗研究所'}
                  </p>
                  <p className="text-xs text-[#333333]/50">
                    {lang === 'ja' ? '兵庫医科大学発ベンチャー' :
                     lang === 'en' ? 'Hyogo Medical University Venture' :
                     lang === 'zh-TW' ? '兵庫醫科大學創投企業' :
                     '兵库医科大学创投企业'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#E2EDF5] text-[#2C3E50] text-xs font-medium rounded-full mb-4">
              {t.faqTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-[#333333]">{t.faqTitle[lang]}</h2>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border border-[#E2EDF5] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-start justify-between px-6 py-4 hover:bg-[#EFF3F7] transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle size={18} className="text-[#466777] mt-0.5 shrink-0" />
                      <span className="font-medium text-[#333333] text-sm md:text-base">{faq.q[lang]}</span>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-[#466777] mt-0.5 shrink-0" /> : <ChevronDown size={18} className="text-[#466777] mt-0.5 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-0">
                      <div className="pl-7 text-sm text-[#333333]/70 leading-relaxed border-l-2 border-[#E2EDF5] ml-1.5">
                        {faq.a[lang]}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 14. CONSULTATION CTA */}
      <section id="consultation" className="py-20 bg-gradient-to-br from-[#2C3E50] via-[#394E64] to-[#2C3E50] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle[lang]}</h2>
          <p className="text-lg text-white/70 mb-3">{t.ctaSubtitle[lang]}</p>

          {/* Free consultation highlight */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/20 border border-amber-400/30 rounded-full text-amber-200 text-sm mb-8">
            <Sparkles size={14} />
            {lang === 'ja' ? '初回カウンセリング無料' :
             lang === 'en' ? 'Free Initial Counseling' :
             lang === 'zh-TW' ? '初次諮詢免費' :
             '初次咨询免费'}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-lg mx-auto mb-8 border border-white/10">
            <h3 className="font-bold text-lg mb-2">
              {lang === 'ja' ? '前期相談サービス' :
               lang === 'en' ? 'Initial Consultation Service' :
               lang === 'zh-TW' ? '前期諮詢服務' :
               '前期咨询服务'}
            </h3>
            <p className="text-sm text-white/60 mb-6">{t.ctaConsultDesc[lang]}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={checkoutHref('/ginza-phoenix/initial-consultation')}
                className="inline-flex items-center justify-center gap-3 bg-white text-[#2C3E50] px-8 py-4 rounded-full font-bold hover:bg-[#E2EDF5] transition-all shadow-lg"
              >
                {t.ctaBook[lang]} <ArrowRight size={18} />
              </Link>
              <Link
                href={checkoutHref('/ginza-phoenix/remote-consultation')}
                className="inline-flex items-center justify-center gap-3 bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all border border-white/20"
              >
                {t.ctaRemote[lang]} <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-8 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <Lock size={14} />
              {lang === 'ja' ? '安全なお支払い' : lang === 'en' ? 'Secure Payment' : '安全支付'}
            </span>
            <span className="flex items-center gap-2">
              <Shield size={14} />
              {lang === 'ja' ? '持牌旅行社保障' : lang === 'en' ? 'Licensed Travel Agency' : '持牌旅行社保障'}
            </span>
          </div>
        </div>
      </section>

      {/* 15. LEGAL FOOTER */}
      {!isGuideEmbed && (
        <section className="py-6 bg-[#333333] text-center">
          <p className="text-xs text-white/40">
            {lang === 'ja'
              ? '旅行サービスは 新島交通株式会社 が提供 ｜ 大阪府知事登録旅行業 第2-3115号'
              : lang === 'en'
              ? 'Travel services provided by Niijima Kotsu Co., Ltd. | Osaka Prefecture Registered Travel Agency No. 2-3115'
              : lang === 'zh-TW'
              ? '旅行服務由 新島交通株式會社 提供 ｜ 大阪府知事登錄旅行業 第2-3115號'
              : '旅行服务由 新岛交通株式会社 提供 ｜ 大阪府知事登録旅行業 第2-3115号'}
          </p>
        </section>
      )}
    </div>
  );
}
