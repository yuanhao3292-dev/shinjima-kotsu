'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, Train,
  Award, Shield, Heart,
  Syringe, Microscope, CheckCircle,
  ArrowRight, Globe, Mail, MessageSquare,
  Activity,
  Droplets, FlaskConical, Dna, Scan,
  ChevronDown, ChevronUp,
  Beaker,
  Leaf, ShieldCheck, FileText,
  GraduationCap, Zap, Eye, Brain,
  Sparkles, Star,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';

// ======================================
// Props
// ======================================
interface HeleneClinicContentProps {
  isGuideEmbed?: boolean;
  guideSlug?: string;
}

/**
 * Proxy external images through Next.js image optimization (Vercel CDN).
 * Ensures images load regardless of client network access to stemcells.jp.
 * Browser requests bespoketrip.jp/_next/image → Vercel fetches from stemcells.jp → returns to client.
 */
const img = (url: string, w = 1200) =>
  `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`;

// ======================================
// Image Assets (stemcells.jp 官网图片)
// ======================================
const HELENE_IMAGES = {
  // Hero / Main visual
  professor: 'https://stemcells.jp/wp-content/themes/helene/assets/images/top-professor.jpg?v2',
  heroMv: 'https://stemcells.jp/wp-content/themes/helene/assets/images/title-mv.png',
  logo: 'https://stemcells.jp/wp-content/themes/helene/assets/images/logo.png',

  // Facility photos (theme assets — high quality)
  facility1: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-facility1.png?v2',
  facility2: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-facility2.png',
  facility3: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-facility3.png',
  facility4: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-facility4.png',
  facility5: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-facility5.png',
  facility7: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-facility7.png',
  facility8: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-facility8.png',
  facility9: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-facility9.png',

  // Doctor portraits
  drMatsuoka: 'https://stemcells.jp/wp-content/uploads/2022/11/matsuoka_2022_pc_002.png',
  drMatsuoka2: 'https://stemcells.jp/wp-content/uploads/2022/11/matsuoka_2022_pc_04.png',
  drKobayashi: 'https://stemcells.jp/wp-content/uploads/2022/11/kobayashi_2022_pc_02.png',
  drGupta: 'https://stemcells.jp/wp-content/uploads/2023/05/gupta_ver2-1.png',
  drIwata: 'https://stemcells.jp/wp-content/uploads/2024/06/iwata0610.png',
  drItohara: 'https://stemcells.jp/wp-content/uploads/2023/05/itohara_2023.png',
  drHara: 'https://stemcells.jp/wp-content/uploads/2025/05/hara.png',

  // Laboratory & Equipment (stemcells.jp/lab/)
  labClinic: 'https://stemcells.jp/lab/img/clinic.jpg',
  labMgmt1: 'https://stemcells.jp/lab/img/management-img01.jpg',
  labMgmt2: 'https://stemcells.jp/lab/img/management-img02.jpg',
  labMgmt3: 'https://stemcells.jp/lab/img/management-img03.png?v1',
  labMgmt4: 'https://stemcells.jp/lab/img/management-img04.png?v1',
  equipment1: 'https://stemcells.jp/lab/img/equipment-img01.png',
  equipment2: 'https://stemcells.jp/lab/img/equipment-img02.png',
  equipment3: 'https://stemcells.jp/lab/img/equipment-img03.png',
  equipment4: 'https://stemcells.jp/lab/img/equipment-img04.png?v2',
  equipment5: 'https://stemcells.jp/lab/img/equipment-img05.png',
  equipment6: 'https://stemcells.jp/lab/img/equipment-img06.png',
  equipment7: 'https://stemcells.jp/lab/img/equipment-img07.png',
  equipment8: 'https://stemcells.jp/lab/img/equipment-img08.png',
  equipment9: 'https://stemcells.jp/lab/img/equipment-img09.png',
  equipment10: 'https://stemcells.jp/lab/img/equipment-img10.png',
  equipment11: 'https://stemcells.jp/lab/img/equipment-img11.png',
  equipment12: 'https://stemcells.jp/lab/img/equipment-img12.png',

  // Technique page images (stemcells.jp/technique/)
  techAbout1: 'https://stemcells.jp/technique/img/about-img01.png',
  techAbout2: 'https://stemcells.jp/technique/img/about-img02.png',
  techGuarantee: 'https://stemcells.jp/technique/img/guarantee-img.png?2409',
  techDiff: 'https://stemcells.jp/technique/img/difference-img.jpg',
  techDiff1: 'https://stemcells.jp/technique/img/difference-img01.jpg',
  techDiff2: 'https://stemcells.jp/technique/img/difference-img02.jpg',
  techDiff3: 'https://stemcells.jp/technique/img/difference-img03.png',
  techDiff4: 'https://stemcells.jp/technique/img/difference-img04.png',
  techConfirm1: 'https://stemcells.jp/technique/img/confirm-img01.jpg',
  techConfirm2: 'https://stemcells.jp/technique/img/confirm-img02.jpg',
  techConfirm3: 'https://stemcells.jp/technique/img/confirm-img03.jpg',
  techConfirm4: 'https://stemcells.jp/technique/img/confirm-img04.png',
  techClinic: 'https://stemcells.jp/technique/img/clinic.jpg',

  // License & certification badges (real images from official site)
  licenseGcr: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license1.png',
  licenseIso: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license-iso2027.png',
  licenseApac: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license-apac.png',
  licenseEsqr2025: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license-esqr2025.png',
  licenseEsqr: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license-esqr.png',
  licenseAbrm: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license-abrm.png?v4',
  license3: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license3.png?2307',
  license4: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license4.png?2307',
  license5: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license5.png?2307',
  license6: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license6.png?2307',
  license7: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license7.png?2307',
  license8: 'https://stemcells.jp/wp-content/themes/helene/assets/images/img-license8.png?2307',

  // Disease treatment banners
  diseaseBnr1: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr01.png',
  diseaseBnr2: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr02.png',
  diseaseBnr3: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr03.png',
  diseaseBnr4: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr04.png',
  diseaseBnr5: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr05.png',
  diseaseBnr6: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr06.png',
  diseaseBnr7: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr07.png',
  diseaseBnr8: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr08.png',
  diseaseBnr9: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr09.png',
  diseaseBnr10: 'https://stemcells.jp/wp-content/themes/helene/assets/images/disease_bnr10.png',

  // Multilingual staff
  multilingualStaff: 'https://stemcells.jp/wp-content/themes/helene/assets/images/multilingual_staff.png',

  // Ao clinic (group)
  aoClinic: 'https://stemcells.jp/wp-content/themes/helene/assets/images/group_ao.jpg',
  aoGallery1: 'https://stemcells.jp/wp-content/themes/helene/assets/images/group_ao_gallery01.jpg',
  aoGallery2: 'https://stemcells.jp/wp-content/themes/helene/assets/images/group_ao_gallery02.jpg',
  aoGallery3: 'https://stemcells.jp/wp-content/themes/helene/assets/images/group_ao_gallery03.jpg',
  aoLabo: 'https://stemcells.jp/wp-content/themes/helene/assets/images/group_ao_labo.jpg',

  // Quality certificate
  qualityCert: 'https://stemcells.jp/wp-content/uploads/2024/09/Quality.png',

  // Scientific illustrations
  guptaLab: 'https://stemcells.jp/lab/img/gupta-img.jpg',
} as const;

// ======================================
// Translations
// ======================================
const tr = {
  heroTitle: {
    ja: '表参道ヘレネクリニック', 'zh-TW': '表參道HELENE診所', 'zh-CN': '表参道HELENE诊所', en: 'Omotesando HELENE Clinic',
  } as Record<Language, string>,
  heroSub: {
    ja: '日本の幹細胞治療をリードする', 'zh-TW': '引領日本幹細胞治療', 'zh-CN': '引领日本干细胞治疗', en: 'Leading Stem Cell Therapy in Japan',
  } as Record<Language, string>,
  heroDesc: {
    ja: '2013年設立 — 10,000例以上の治療実績、厚生労働省認可17件以上', 'zh-TW': '2013年設立 — 10,000+例治療實績、厚生勞動省認可17+件', 'zh-CN': '2013年设立 — 10,000+例治疗实绩、厚生劳动省认可17+件', en: 'Est. 2013 — 10,000+ treatments, 17+ MHLW licenses',
  } as Record<Language, string>,
  limitBadge: {
    ja: '無料カウンセリング実施中・多言語対応', 'zh-TW': '免費諮詢進行中·多語言對應', 'zh-CN': '免费咨询进行中·多语言对应', en: 'Free Counseling Available · Multilingual Staff',
  } as Record<Language, string>,
  consultPlan: { ja: '治療プランを相談', 'zh-TW': '諮詢治療方案', 'zh-CN': '咨询治疗方案', en: 'Consult Treatment Plan' } as Record<Language, string>,
  viewFlow: { ja: '治療の流れを見る', 'zh-TW': '了解治療流程', 'zh-CN': '了解治疗流程', en: 'View Treatment Flow' } as Record<Language, string>,

  // Designation bar
  desig1: { ja: 'GCR国際認証取得（世界初）', 'zh-TW': 'GCR國際認證（全球首家）', 'zh-CN': 'GCR国际认证（全球首家）', en: 'GCR Certified (World First)' } as Record<Language, string>,
  desig2: { ja: 'ISO 9001品質管理', 'zh-TW': 'ISO 9001品質管理', 'zh-CN': 'ISO 9001质量管理', en: 'ISO 9001 Quality Management' } as Record<Language, string>,
  desig3: { ja: '厚生労働省認可 17件以上', 'zh-TW': '厚生勞動省認可 17+件', 'zh-CN': '厚生劳动省认可 17+件', en: '17+ MHLW Licenses' } as Record<Language, string>,

  // Stats
  statsTag: { ja: 'クリニックの実力', 'zh-TW': '診所實力', 'zh-CN': '诊所实力', en: 'Clinic Strength' } as Record<Language, string>,
  statsTitle: { ja: '数字で見るヘレネクリニック', 'zh-TW': '數字看HELENE診所', 'zh-CN': '数字看HELENE诊所', en: 'HELENE by the Numbers' } as Record<Language, string>,

  // Facility
  facilityTag: { ja: '施設紹介', 'zh-TW': '設施介紹', 'zh-CN': '设施介绍', en: 'Facilities' } as Record<Language, string>,
  facilityTitle: { ja: '表参道の最先端再生医療施設', 'zh-TW': '表參道最先進再生醫療設施', 'zh-CN': '表参道最先进再生医疗设施', en: 'State-of-the-Art Regenerative Medicine Facility in Omotesando' } as Record<Language, string>,

  // Treatments
  treatTag: { ja: '治療メニュー', 'zh-TW': '治療項目', 'zh-CN': '治疗项目', en: 'Treatments' } as Record<Language, string>,
  treatTitle: { ja: '7つの再生医療メニュー', 'zh-TW': '7大再生醫療項目', 'zh-CN': '7大再生医疗项目', en: '7 Regenerative Medicine Treatments' } as Record<Language, string>,

  // Indications
  indicTag: { ja: '適応症', 'zh-TW': '適應症', 'zh-CN': '适应症', en: 'Indications' } as Record<Language, string>,
  indicTitle: { ja: '幹細胞治療の対象疾患', 'zh-TW': '幹細胞治療適應疾病', 'zh-CN': '干细胞治疗适应疾病', en: 'Conditions Treated with Stem Cells' } as Record<Language, string>,
  indicDesc: { ja: '厚生労働省の認可を受けた再生医療計画に基づく治療', 'zh-TW': '基於厚生勞動省認可的再生醫療計畫', 'zh-CN': '基于厚生劳动省认可的再生医疗计划', en: 'Based on MHLW-approved regenerative medicine plans' } as Record<Language, string>,

  // Tech
  techTag: { ja: 'HELENE独自の技術', 'zh-TW': 'HELENE獨有技術', 'zh-CN': 'HELENE独有技术', en: 'HELENE Proprietary Technology' } as Record<Language, string>,
  techTitle: { ja: '品質と安全性を支える4つの独自技術', 'zh-TW': '支撐品質與安全的4大獨有技術', 'zh-CN': '支撑品质与安全的4大独有技术', en: '4 Proprietary Technologies Ensuring Quality & Safety' } as Record<Language, string>,

  // Team
  teamTag: { ja: '医療チーム', 'zh-TW': '醫療團隊', 'zh-CN': '医疗团队', en: 'Medical Team' } as Record<Language, string>,
  teamTitle: { ja: '世界トップレベルの専門医チーム', 'zh-TW': '世界頂級專科醫師團隊', 'zh-CN': '世界顶级专科医师团队', en: 'World-Class Specialist Team' } as Record<Language, string>,

  // Lab
  labTag: { ja: '細胞培養室（CPC）', 'zh-TW': '細胞培養室（CPC）', 'zh-CN': '细胞培养室（CPC）', en: 'Cell Processing Center (CPC)' } as Record<Language, string>,
  labTitle: { ja: '院内ISO Class 5 クリーンルーム', 'zh-TW': '院內ISO Class 5無塵室', 'zh-CN': '院内ISO Class 5无尘室', en: 'In-House ISO Class 5 Clean Room' } as Record<Language, string>,
  labDesc: { ja: '外部委託なし。採取から培養・投与まですべて院内で完結し、品質を徹底管理', 'zh-TW': '無需外包。從採集到培養·給藥全部院內完成，徹底品質管控', 'zh-CN': '无需外包。从采集到培养·给药全部院内完成，彻底品质管控', en: 'No outsourcing. From collection to culture to administration — all in-house with thorough quality control' } as Record<Language, string>,

  // Flow
  flowTag: { ja: '治療の流れ', 'zh-TW': '治療流程', 'zh-CN': '治疗流程', en: 'Treatment Flow' } as Record<Language, string>,
  flowTitle: { ja: '治療完了まで7ステップ', 'zh-TW': '7步完成治療', 'zh-CN': '7步完成治疗', en: '7 Steps to Treatment Completion' } as Record<Language, string>,
  flowDesc: { ja: '初回カウンセリングから治療完了まで、全行程サポート', 'zh-TW': '從初次諮詢到治療完成，全程支援', 'zh-CN': '从初次咨询到治疗完成，全程支持', en: 'Full support from initial counseling to treatment completion' } as Record<Language, string>,

  // Certs
  certsTag: { ja: '認証・受賞', 'zh-TW': '認證·獲獎', 'zh-CN': '认证·获奖', en: 'Certifications & Awards' } as Record<Language, string>,
  certsTitle: { ja: '国際認証と受賞実績', 'zh-TW': '國際認證與獲獎實績', 'zh-CN': '国际认证与获奖实绩', en: 'International Certifications & Awards' } as Record<Language, string>,

  // Pricing
  pricingTag: { ja: '治療メニュー・料金表', 'zh-TW': '治療項目·價格表', 'zh-CN': '治疗项目·价格表', en: 'Treatment Menu & Pricing' } as Record<Language, string>,
  pricingTitle: { ja: '幹細胞治療 料金一覧', 'zh-TW': '幹細胞治療價格一覽', 'zh-CN': '干细胞治疗价格一览', en: 'Stem Cell Treatment Pricing' } as Record<Language, string>,
  pricingDesc: { ja: '治療内容・細胞数に応じて最適なプランをお選びください（税込価格）', 'zh-TW': '根據治療內容·細胞數選擇最佳方案（含稅價格）', 'zh-CN': '根据治疗内容·细胞数选择最佳方案（含税价格）', en: 'Choose the optimal plan based on treatment type and cell count (tax included)' } as Record<Language, string>,
  pricingCta: { ja: '治療を予約する', 'zh-TW': '預約治療', 'zh-CN': '预约治疗', en: 'Book Treatment' } as Record<Language, string>,
  pricingNote: { ja: '※ 料金は参考価格です。最終的な治療費用は医師の診察後に確定いたします', 'zh-TW': '※ 以上為參考價格，最終治療費用於醫師診察後確定', 'zh-CN': '※ 以上为参考价格，最终治疗费用于医师诊察后确定', en: '* Prices are for reference. Final costs are confirmed after physician consultation' } as Record<Language, string>,

  // Services
  svcTag: { ja: 'サービスご予約', 'zh-TW': '服務預約', 'zh-CN': '服务预约', en: 'Book Service' } as Record<Language, string>,
  svcTitle: { ja: '相談サービス', 'zh-TW': '諮詢服務', 'zh-CN': '咨询服务', en: 'Consultation Services' } as Record<Language, string>,
  svcDesc: { ja: 'ご希望のサービスを選択し、お支払い後24時間以内にご連絡いたします', 'zh-TW': '選擇您需要的服務，支付後24小時內與您聯繫', 'zh-CN': '选择您需要的服务，支付后24小时内与您联系', en: 'Select a service, we will contact you within 24 hours after payment' } as Record<Language, string>,

  // Contact
  contactTitle: { ja: 'お支払い前のご質問はお気軽に', 'zh-TW': '付款前有疑問？歡迎諮詢', 'zh-CN': '付款前有疑问？欢迎咨询', en: 'Questions? Contact us before payment' } as Record<Language, string>,

  // Common
  bookNow: { ja: '今すぐ予約', 'zh-TW': '立即預約', 'zh-CN': '立即预约', en: 'Book Now' } as Record<Language, string>,
  taxIncl: { ja: '日円（税込）', 'zh-TW': '日圓（含稅）', 'zh-CN': '日元（含税）', en: 'JPY (tax incl.)' } as Record<Language, string>,
  learnMore: { ja: '詳しく見る', 'zh-TW': '了解詳情', 'zh-CN': '了解详情', en: 'Learn More' } as Record<Language, string>,
};

// ======================================
// Data: Key Stats
// ======================================
const KEY_STATS = [
  { value: '10,000+', label: { ja: '治療実績', 'zh-TW': '治療實績', 'zh-CN': '治疗实绩', en: 'Successful Cases' } as Record<Language, string>, sub: { ja: '累計症例数', 'zh-TW': '累計案例數', 'zh-CN': '累计案例数', en: 'Cumulative cases' } as Record<Language, string> },
  { value: '22.5億', label: { ja: '最大MSC培養数', 'zh-TW': '最大MSC培養數', 'zh-CN': '最大MSC培养数', en: 'Max MSC Cultured' } as Record<Language, string>, sub: { ja: '1ヶ月あたり', 'zh-TW': '每月產能', 'zh-CN': '每月产能', en: 'Per month capacity' } as Record<Language, string> },
  { value: '17+', label: { ja: '厚労省認可計画', 'zh-TW': '厚勞省認可計畫', 'zh-CN': '厚劳省认可计划', en: 'MHLW Licenses' } as Record<Language, string>, sub: { ja: '日本最多クラス', 'zh-TW': '日本最多級別', 'zh-CN': '日本最多级别', en: 'Among most in Japan' } as Record<Language, string> },
  { value: '0', label: { ja: '重篤な有害事象', 'zh-TW': '重大不良事件', 'zh-CN': '重大不良事件', en: 'Severe Adverse Events' } as Record<Language, string>, sub: { ja: '安全性実証済み', 'zh-TW': '安全性已驗證', 'zh-CN': '安全性已验证', en: 'Safety proven' } as Record<Language, string> },
  { value: '13+', label: { ja: '年の臨床経験', 'zh-TW': '年臨床經驗', 'zh-CN': '年临床经验', en: 'Years of Clinical Experience' } as Record<Language, string>, sub: { ja: '2013年設立', 'zh-TW': '2013年設立', 'zh-CN': '2013年设立', en: 'Est. 2013' } as Record<Language, string> },
  { value: '≥92%', label: { ja: '細胞生存率基準', 'zh-TW': '細胞存活率標準', 'zh-CN': '细胞存活率标准', en: 'Cell Viability Standard' } as Record<Language, string>, sub: { ja: '品質証明書発行', 'zh-TW': '發行品質證明書', 'zh-CN': '发行品质证明书', en: 'Quality certificate issued' } as Record<Language, string> },
  { value: '105+', label: { ja: '多言語スタッフ', 'zh-TW': '多語言員工', 'zh-CN': '多语言员工', en: 'Multilingual Staff' } as Record<Language, string>, sub: { ja: '15言語以上対応', 'zh-TW': '15+語言對應', 'zh-CN': '15+语言对应', en: '15+ languages supported' } as Record<Language, string> },
  { value: '-196°C', label: { ja: '液体窒素長期保存', 'zh-TW': '液氮長期保存', 'zh-CN': '液氮长期保存', en: 'Liquid Nitrogen Storage' } as Record<Language, string>, sub: { ja: 'セルバンク管理', 'zh-TW': '細胞庫管理', 'zh-CN': '细胞库管理', en: 'Cell bank management' } as Record<Language, string> },
];

// ======================================
// Data: Treatments
// ======================================
const TREATMENTS = [
  {
    icon: Syringe,
    title: { ja: '自己脂肪由来間葉系幹細胞（MSC）療法', 'zh-TW': '自體脂肪間充質幹細胞（MSC）療法', 'zh-CN': '自体脂肪间充质干细胞（MSC）疗法', en: 'Autologous Adipose-Derived MSC Therapy' } as Record<Language, string>,
    desc: { ja: '耳裏から5mmの皮膚片を採取し、院内CPCで最大22.5億個まで培養。静脈点滴・関節注射・皮下注射など、症状に応じた投与法で治療。全身の炎症抑制・組織修復・免疫調整に効果', 'zh-TW': '從耳後採取5mm皮膚片，院內CPC培養最多22.5億個。靜脈點滴·關節注射·皮下注射等按症狀選擇投與方式。全身抗炎·組織修復·免疫調節', 'zh-CN': '从耳后采取5mm皮肤片，院内CPC培养最多22.5亿个。静脉点滴·关节注射·皮下注射等按症状选择投与方式。全身抗炎·组织修复·免疫调节', en: 'Harvest 5mm skin sample from behind ear, culture up to 2.25B cells in-house. IV drip, joint injection, or subcutaneous — tailored to condition. Anti-inflammatory, tissue repair, immune modulation' } as Record<Language, string>,
  },
  {
    icon: FlaskConical,
    title: { ja: 'MSCエクソソーム療法', 'zh-TW': 'MSC外泌體療法', 'zh-CN': 'MSC外泌体疗法', en: 'MSC Exosome Therapy' } as Record<Language, string>,
    desc: { ja: '幹細胞が分泌する微小な細胞外小胞（エクソソーム）を精製・投与。細胞を使わず、幹細胞の再生促進シグナルを直接届ける次世代療法', 'zh-TW': '精製·投與幹細胞分泌的微小細胞外囊泡（外泌體）。不使用細胞，直接傳遞幹細胞的再生促進信號的新一代療法', 'zh-CN': '精制·投与干细胞分泌的微小细胞外囊泡（外泌体）。不使用细胞，直接传递干细胞的再生促进信号的新一代疗法', en: 'Purified extracellular vesicles (exosomes) secreted by stem cells. Cell-free next-gen therapy delivering regenerative signals directly' } as Record<Language, string>,
  },
  {
    icon: Droplets,
    title: { ja: '培養上清液治療', 'zh-TW': '培養上清液治療', 'zh-CN': '培养上清液治疗', en: 'Culture Supernatant Treatment' } as Record<Language, string>,
    desc: { ja: '幹細胞培養時に分泌される500種以上のタンパク質を含む上清液を静脈点滴投与。¥165,000（税込）から手軽に始められる再生医療入門メニュー', 'zh-TW': '靜脈點滴投與含500+種蛋白質的幹細胞培養上清液。¥165,000（含稅）起的入門再生醫療選項', 'zh-CN': '静脉点滴投与含500+种蛋白质的干细胞培养上清液。¥165,000（含税）起的入门再生医疗选项', en: 'IV infusion of supernatant containing 500+ proteins from stem cell culture. Starting at ¥165,000 — an accessible entry to regenerative medicine' } as Record<Language, string>,
  },
  {
    icon: Heart,
    title: { ja: 'PRP（多血小板血漿）療法', 'zh-TW': 'PRP（富血小板血漿）療法', 'zh-CN': 'PRP（富血小板血浆）疗法', en: 'PRP (Platelet-Rich Plasma) Therapy' } as Record<Language, string>,
    desc: { ja: '自身の血液から高濃度の血小板血漿を抽出し、変形性膝関節症などの治療に使用。MHLW認可計画に基づく安全な治療', 'zh-TW': '從自身血液提取高濃度血小板血漿，用於退化性膝關節炎等治療。基於厚勞省認可計畫的安全治療', 'zh-CN': '从自身血液提取高浓度血小板血浆，用于退化性膝关节炎等治疗。基于厚劳省认可计划的安全治疗', en: 'High-concentration platelet plasma extracted from your own blood for osteoarthritis treatment. MHLW-approved safe therapy' } as Record<Language, string>,
  },
  {
    icon: ShieldCheck,
    title: { ja: 'NK細胞療法', 'zh-TW': 'NK細胞療法', 'zh-CN': 'NK细胞疗法', en: 'NK Cell Therapy' } as Record<Language, string>,
    desc: { ja: 'ナチュラルキラー（NK）細胞を活性化・増殖させて体内に戻す免疫細胞療法。がんや感染症に対する自然免疫を強化', 'zh-TW': '活化·增殖自然殺手（NK）細胞並回輸體內的免疫細胞療法。強化對癌症及感染症的自然免疫力', 'zh-CN': '活化·增殖自然杀伤（NK）细胞并回输体内的免疫细胞疗法。强化对癌症及感染症的自然免疫力', en: 'Activate and expand Natural Killer (NK) cells for immune cell therapy. Enhances innate immunity against cancer and infections' } as Record<Language, string>,
  },
  {
    icon: Zap,
    title: { ja: 'BAT（褐色脂肪細胞）内因性注入', 'zh-TW': 'BAT（棕色脂肪細胞）內源性注入', 'zh-CN': 'BAT（棕色脂肪细胞）内源性注入', en: 'BAT (Brown Adipose Tissue) Endogenous Injection' } as Record<Language, string>,
    desc: { ja: '褐色脂肪細胞を活性化し、代謝改善・体脂肪減少を促進する先端治療。エネルギー消費を高め、肥満・メタボリック症候群の改善をサポート', 'zh-TW': '活化棕色脂肪細胞，促進代謝改善·體脂肪減少的先端治療。提高能量消耗，改善肥胖·代謝症候群', 'zh-CN': '活化棕色脂肪细胞，促进代谢改善·体脂肪减少的先端治疗。提高能量消耗，改善肥胖·代谢综合征', en: 'Activate brown adipose tissue to improve metabolism and reduce body fat. Supports obesity and metabolic syndrome improvement' } as Record<Language, string>,
  },
  {
    icon: Scan,
    title: { ja: 'HELENE幹細胞コスメ', 'zh-TW': 'HELENE幹細胞美容品', 'zh-CN': 'HELENE干细胞美容品', en: 'HELENE Stem Cell Cosmetics' } as Record<Language, string>,
    desc: { ja: '高濃度ヒト幹細胞エキス配合のホームケア製品。治療との相乗効果で、肌の再生をサポート', 'zh-TW': '高濃度人類幹細胞精華配方的居家護理產品。與治療協同增效，支持肌膚再生', 'zh-CN': '高浓度人类干细胞精华配方的居家护理产品。与治疗协同增效，支持肌肤再生', en: 'High-concentration human stem cell extract homecare products. Synergizes with treatments for skin regeneration' } as Record<Language, string>,
  },
];

// ======================================
// Data: Indications
// ======================================
const INDICATIONS = [
  { icon: Heart, name: { ja: '動脈硬化', 'zh-TW': '動脈硬化', 'zh-CN': '动脉硬化', en: 'Arteriosclerosis' } as Record<Language, string>, color: 'bg-red-50 text-red-700' },
  { icon: Activity, name: { ja: '糖尿病', 'zh-TW': '糖尿病', 'zh-CN': '糖尿病', en: 'Diabetes' } as Record<Language, string>, color: 'bg-blue-50 text-blue-700' },
  { icon: Zap, name: { ja: '膝関節痛', 'zh-TW': '膝關節痛', 'zh-CN': '膝关节痛', en: 'Knee Pain' } as Record<Language, string>, color: 'bg-amber-50 text-amber-700' },
  { icon: Brain, name: { ja: '脳梗塞', 'zh-TW': '腦梗塞', 'zh-CN': '脑梗塞', en: 'Stroke' } as Record<Language, string>, color: 'bg-purple-50 text-purple-700' },
  { icon: Sparkles, name: { ja: '毛髪再生', 'zh-TW': '毛髮再生', 'zh-CN': '毛发再生', en: 'Hair Regeneration' } as Record<Language, string>, color: 'bg-emerald-50 text-emerald-700' },
  { icon: Eye, name: { ja: '肌再生', 'zh-TW': '肌膚再生', 'zh-CN': '肌肤再生', en: 'Skin Regeneration' } as Record<Language, string>, color: 'bg-pink-50 text-pink-700' },
  { icon: Microscope, name: { ja: '歯周病', 'zh-TW': '牙周病', 'zh-CN': '牙周病', en: 'Periodontal Disease' } as Record<Language, string>, color: 'bg-teal-50 text-teal-700' },
  { icon: Shield, name: { ja: '免疫老化', 'zh-TW': '免疫老化', 'zh-CN': '免疫老化', en: 'Immunosenescence' } as Record<Language, string>, color: 'bg-indigo-50 text-indigo-700' },
  { icon: Star, name: { ja: 'ホルモン失調', 'zh-TW': '荷爾蒙失調', 'zh-CN': '荷尔蒙失调', en: 'Hormonal Imbalance' } as Record<Language, string>, color: 'bg-rose-50 text-rose-700' },
  { icon: Dna, name: { ja: 'ED（勃起不全）', 'zh-TW': 'ED（勃起功能障礙）', 'zh-CN': 'ED（勃起功能障碍）', en: 'Erectile Dysfunction' } as Record<Language, string>, color: 'bg-slate-50 text-slate-700' },
];

// ======================================
// Data: Technology
// ======================================
const TECH_ITEMS = [
  { icon: Dna, title: { ja: '独自3D多層培養法', 'zh-TW': '獨有3D多層培養法', 'zh-CN': '独有3D多层培养法', en: 'Proprietary 3D Multi-Layer Culture' } as Record<Language, string>, desc: { ja: '一般的な2D培養の限界を超え、3D環境で効率的に大量培養。細胞サイズは競合培養より約20%小さく、血管閉塞リスクを低減', 'zh-TW': '突破一般2D培養限制，3D環境高效大量培養。細胞比競品培養小約20%，降低血管堵塞風險', 'zh-CN': '突破一般2D培养限制，3D环境高效大量培养。细胞比竞品培养小约20%，降低血管堵塞风险', en: 'Beyond standard 2D culture limits. 3D environment for efficient mass culture. Cells ~20% smaller, reducing embolism risk' } as Record<Language, string> },
  { icon: Leaf, title: { ja: 'HELENE培地 — 動物由来成分フリー', 'zh-TW': 'HELENE培養基 — 無動物成分', 'zh-CN': 'HELENE培养基 — 无动物成分', en: 'HELENE Medium — Animal-Free' } as Record<Language, string>, desc: { ja: '独自開発の無血清・無異種（ゼノフリー）GMP品質培地。動物由来の感染リスクを排除し、より安全な細胞培養を実現', 'zh-TW': '自主研發的無血清·無異種（Xeno-Free）GMP品質培養基。排除動物源感染風險，實現更安全的細胞培養', 'zh-CN': '自主研发的无血清·无异种（Xeno-Free）GMP品质培养基。排除动物源感染风险，实现更安全的细胞培养', en: 'Proprietary serum-free, xeno-free GMP-grade medium. Eliminates animal-derived infection risks for safer cell culture' } as Record<Language, string> },
  { icon: Beaker, title: { ja: '院内CPC — ISO 9001認証', 'zh-TW': '院內CPC — ISO 9001認證', 'zh-CN': '院内CPC — ISO 9001认证', en: 'In-House CPC — ISO 9001 Certified' } as Record<Language, string>, desc: { ja: 'ISO Class 5クリーンルームを院内に完備。外部委託なく、採取から培養・保管・投与まで全工程を院内で一貫管理', 'zh-TW': '院內配備ISO Class 5無塵室。無需外包，從採集到培養·保管·投與全程院內一貫管理', 'zh-CN': '院内配备ISO Class 5无尘室。无需外包，从采集到培养·保管·投与全程院内一贯管理', en: 'In-house ISO Class 5 clean room. No outsourcing — from harvest to culture, storage, and administration, all managed on-site' } as Record<Language, string> },
  { icon: ShieldCheck, title: { ja: '第三者検証 — タカラバイオ', 'zh-TW': '第三方驗證 — Takara Bio', 'zh-CN': '第三方验证 — Takara Bio', en: 'Third-Party Verification by Takara Bio' } as Record<Language, string>, desc: { ja: 'GMP・GLP基準に準拠した第三者検査で品質を二重保証。エンドトキシン、マイコプラズマ、無菌性、細胞同一性を検証', 'zh-TW': '符合GMP·GLP標準的第三方檢測雙重保證品質。驗證內毒素、支原體、無菌性、細胞同一性', 'zh-CN': '符合GMP·GLP标准的第三方检测双重保证品质。验证内毒素、支原体、无菌性、细胞同一性', en: 'GMP/GLP-compliant third-party testing for dual quality assurance. Endotoxin, mycoplasma, sterility, cell identity verified' } as Record<Language, string> },
];

// ======================================
// Data: Doctors
// ======================================
const DOCTORS = [
  { photo: HELENE_IMAGES.drMatsuoka, name: { ja: '松岡 孝明', 'zh-TW': '松岡 孝明', 'zh-CN': '松冈 孝明', en: 'Dr. Takaaki Matsuoka' } as Record<Language, string>, role: { ja: '院長・創業者', 'zh-TW': '院長·創辦人', 'zh-CN': '院长·创始人', en: 'Founder & Director' } as Record<Language, string>, bio: { ja: '慶應義塾大学医学部卒（2003年）。ハーバード大学医学部PGA修了。北京大学MBA。再生医療の分野で日本を代表する専門家', 'zh-TW': '慶應義塾大學醫學部畢業（2003年）。哈佛大學醫學部PGA。北京大學MBA。日本再生醫療領域代表性專家', 'zh-CN': '庆应义塾大学医学部毕业（2003年）。哈佛大学医学部PGA。北京大学MBA。日本再生医疗领域代表性专家', en: 'Keio University School of Medicine (2003). Harvard Medical School PGA. Peking University MBA. Leading expert in regenerative medicine in Japan' } as Record<Language, string> },
  { photo: HELENE_IMAGES.drKobayashi, name: { ja: '小林 奈奈', 'zh-TW': '小林 奈奈', 'zh-CN': '小林 奈奈', en: 'Dr. Nana Kobayashi' } as Record<Language, string>, role: { ja: 'HELENE理事長', 'zh-TW': 'HELENE理事長', 'zh-CN': 'HELENE理事长', en: 'HELENE Chairperson' } as Record<Language, string>, bio: { ja: '日本大学医学部卒（2007年）。消化器外科・消化器内科・再生医療。日本消化器外科学会・日本消化器病学会・日本腹部救急医学会所属', 'zh-TW': '日本大學醫學部畢業（2007年）。消化外科·消化內科·再生醫療。日本消化器外科學會·消化器病學會·腹部急救醫學會', 'zh-CN': '日本大学医学部毕业（2007年）。消化外科·消化内科·再生医疗。日本消化器外科学会·消化器病学会·腹部急救医学会', en: 'Nihon University School of Medicine (2007). GI Surgery, Internal Medicine, Regenerative Medicine. Member: Gastrointestinal Surgery, Gastroenterology, Abdominal Emergency Surgery societies' } as Record<Language, string> },
  { photo: HELENE_IMAGES.drGupta, name: { ja: 'ラビンドラ・グプタ教授', 'zh-TW': 'Ravindra Gupta 教授', 'zh-CN': 'Ravindra Gupta 教授', en: 'Prof. Ravindra Gupta' } as Record<Language, string>, role: { ja: '学術顧問（ケンブリッジ大学）', 'zh-TW': '學術顧問（劍橋大學）', 'zh-CN': '学术顾问（剑桥大学）', en: 'Academic Advisor (Cambridge University)' } as Record<Language, string>, bio: { ja: 'ケンブリッジ大学臨床微生物学教授。TIME誌「世界で最も影響力のある100人」（2020年）。FMedSci（2021年）。Clarivate高被引用研究者（2022-2024年）', 'zh-TW': '劍橋大學臨床微生物學教授。TIME雜誌「全球最具影響力100人」（2020年）。FMedSci（2021年）。Clarivate高被引研究者（2022-2024年）', 'zh-CN': '剑桥大学临床微生物学教授。TIME杂志「全球最具影响力100人」（2020年）。FMedSci（2021年）。Clarivate高被引研究者（2022-2024年）', en: 'Cambridge University Clinical Microbiology Professor. TIME "100 Most Influential" (2020). FMedSci (2021). Clarivate Highly Cited Researcher (2022-2024)' } as Record<Language, string> },
  { photo: HELENE_IMAGES.drIwata, name: { ja: '岩田 慎一郎', 'zh-TW': '岩田 慎一郎', 'zh-CN': '岩田 慎一郎', en: 'Dr. Shinichiro Iwata' } as Record<Language, string>, role: { ja: '整形外科再生医療', 'zh-TW': '骨科再生醫療', 'zh-CN': '骨科再生医疗', en: 'Orthopedic Regenerative Medicine' } as Record<Language, string>, bio: { ja: '慶應義塾大学医学部卒（1996年）。スタンフォード大学留学（2004年）。膝関節幹細胞治療のスペシャリスト', 'zh-TW': '慶應義塾大學醫學部畢業（1996年）。史丹佛大學留學（2004年）。膝關節幹細胞治療專家', 'zh-CN': '庆应义塾大学医学部毕业（1996年）。斯坦福大学留学（2004年）。膝关节干细胞治疗专家', en: 'Keio University (1996). Stanford University (2004). Specialist in knee joint stem cell therapy' } as Record<Language, string> },
  { photo: HELENE_IMAGES.drItohara, name: { ja: '糸原', 'zh-TW': '糸原', 'zh-CN': '糸原', en: 'Dr. Itohara' } as Record<Language, string>, role: { ja: 'ヘレネAOビルクリニック院長', 'zh-TW': 'HELENE AO大樓診所院長', 'zh-CN': 'HELENE AO大楼诊所院长', en: 'Director, Helene AO Building Clinic' } as Record<Language, string>, bio: { ja: '京都大学卒（2003年）。心臓血管外科・再生医療。2014年ヘレネ入職、2025年AO院長就任', 'zh-TW': '京都大學畢業（2003年）。心臟血管外科·再生醫療。2014年加入HELENE，2025年就任AO院長', 'zh-CN': '京都大学毕业（2003年）。心脏血管外科·再生医疗。2014年加入HELENE，2025年就任AO院长', en: 'Kyoto University (2003). Cardiovascular Surgery, Regenerative Medicine. Joined HELENE 2014, AO Director 2025' } as Record<Language, string> },
  { photo: HELENE_IMAGES.drHara, name: { ja: '原 友里恵', 'zh-TW': '原 友里惠', 'zh-CN': '原 友里惠', en: 'Dr. Yurie Hara' } as Record<Language, string>, role: { ja: '産婦人科・婦人科再生医療', 'zh-TW': '婦產科·婦科再生醫療', 'zh-CN': '妇产科·妇科再生医疗', en: 'OB/GYN & Gynecological Regenerative Medicine' } as Record<Language, string>, bio: { ja: '杏林大学医学部卒。日本産科婦人科学会専門医。ドバイGPライセンス取得。日本生殖医学会・日本産科婦人科内視鏡学会所属', 'zh-TW': '杏林大學醫學部畢業。日本產科婦人科學會專科醫師。持有杜拜GP執照。日本生殖醫學會·產科婦人科內視鏡學會', 'zh-CN': '杏林大学医学部毕业。日本产科妇人科学会专科医师。持有迪拜GP执照。日本生殖医学会·产科妇人科内视镜学会', en: 'Kyorin University School of Medicine. Japan Society of OB/GYN Specialist. Dubai GP License. Member: Reproductive Medicine, Gynecological Endoscopy societies' } as Record<Language, string> },
];

// ======================================
// Data: Flow Steps
// ======================================
const FLOW_STEPS = [
  { step: 1, title: { ja: '予約・お問い合わせ', 'zh-TW': '預約·諮詢', 'zh-CN': '预约·咨询', en: 'Booking & Inquiry' } as Record<Language, string>, desc: { ja: '医療資料をご提出ください（検査結果、MRI等）', 'zh-TW': '請提交醫療資料（檢查結果、MRI等）', 'zh-CN': '请提交医疗资料（检查结果、MRI等）', en: 'Submit medical records (test results, MRI, etc.)' } as Record<Language, string> },
  { step: 2, title: { ja: 'カウンセリング（無料）', 'zh-TW': '諮詢（免費）', 'zh-CN': '咨询（免费）', en: 'Counseling (Free)' } as Record<Language, string>, desc: { ja: '医師が治療計画を説明し、個別プランをご提案', 'zh-TW': '醫師說明治療計畫，提出個別方案', 'zh-CN': '医师说明治疗计划，提出个别方案', en: 'Doctor explains treatment and proposes personalized plan' } as Record<Language, string> },
  { step: 3, title: { ja: '細胞採取・採血', 'zh-TW': '細胞採取·採血', 'zh-CN': '细胞采取·采血', en: 'Cell Harvest & Blood Draw' } as Record<Language, string>, desc: { ja: '耳裏から5mmの皮膚片を採取（局所麻酔・約20分）', 'zh-TW': '耳後採取5mm皮膚片（局部麻醉·約20分鐘）', 'zh-CN': '耳后采取5mm皮肤片（局部麻醉·约20分钟）', en: '5mm skin sample from behind ear (local anesthesia, ~20 min)' } as Record<Language, string> },
  { step: 4, title: { ja: 'お支払い', 'zh-TW': '支付', 'zh-CN': '支付', en: 'Payment' } as Record<Language, string>, desc: { ja: 'クレジットカード・銀聯・WeChat Pay・Alipay・LINE Pay・銀行振込対応', 'zh-TW': '信用卡·銀聯·微信支付·支付寶·LINE Pay·銀行轉帳', 'zh-CN': '信用卡·银联·微信支付·支付宝·LINE Pay·银行转账', en: 'Credit card, UnionPay, WeChat Pay, Alipay, LINE Pay, bank transfer' } as Record<Language, string> },
  { step: 5, title: { ja: '細胞培養（約4週間）', 'zh-TW': '細胞培養（約4週）', 'zh-CN': '细胞培养（约4周）', en: 'Cell Culture (~4 weeks)' } as Record<Language, string>, desc: { ja: '院内CPCのISO Class 5クリーンルームで培養。品質証明書を発行', 'zh-TW': '院內CPC ISO Class 5無塵室培養。發行品質證明書', 'zh-CN': '院内CPC ISO Class 5无尘室培养。发行品质证明书', en: 'Cultured in ISO Class 5 clean room. Quality certificate issued' } as Record<Language, string> },
  { step: 6, title: { ja: '細胞投与', 'zh-TW': '細胞投與', 'zh-CN': '细胞投与', en: 'Cell Administration' } as Record<Language, string>, desc: { ja: '静脈点滴・関節注射・皮下注射など（30-60分）。当日帰宅可', 'zh-TW': '靜脈點滴·關節注射·皮下注射等（30-60分鐘）。當日可出院', 'zh-CN': '静脉点滴·关节注射·皮下注射等（30-60分钟）。当日可出院', en: 'IV drip, joint injection, or subcutaneous (30-60 min). Same-day discharge' } as Record<Language, string> },
  { step: 7, title: { ja: '完了・アフターケア', 'zh-TW': '完成·後續照護', 'zh-CN': '完成·后续照护', en: 'Completion & Aftercare' } as Record<Language, string>, desc: { ja: '3ヶ月後フォローアップ。再治療オプションもご案内', 'zh-TW': '3個月後隨訪。可選擇再治療方案', 'zh-CN': '3个月后随访。可选择再治疗方案', en: '3-month follow-up. Re-treatment options available' } as Record<Language, string> },
];

// ======================================
// Data: Certifications
// ======================================
const CERTIFICATIONS = [
  { image: HELENE_IMAGES.licenseGcr, title: 'GCR International', desc: { ja: 'グローバルクリニック格付け 国際認証', 'zh-TW': '全球診所評級 國際認證', 'zh-CN': '全球诊所评级 国际认证', en: 'Global Clinic Rating — International Certification' } as Record<Language, string> },
  { image: HELENE_IMAGES.licenseIso, title: 'ISO 9001:2015', desc: { ja: '品質管理システム認証（2027年まで有効）', 'zh-TW': '品質管理系統認證（有效至2027年）', 'zh-CN': '质量管理系统认证（有效至2027年）', en: 'Quality Management System (valid through 2027)' } as Record<Language, string> },
  { image: HELENE_IMAGES.licenseEsqr, title: 'ESQR 2024', desc: { ja: '欧州品質研究協会 国際品質賞', 'zh-TW': '歐洲品質研究協會 國際品質獎', 'zh-CN': '欧洲品质研究协会 国际品质奖', en: 'European Society for Quality Research — International Quality Award' } as Record<Language, string> },
  { image: HELENE_IMAGES.licenseEsqr2025, title: 'ESQR 2025', desc: { ja: '欧州品質研究協会 Quality Choice Prize', 'zh-TW': '歐洲品質研究協會 Quality Choice Prize', 'zh-CN': '欧洲品质研究协会 Quality Choice Prize', en: 'European Society for Quality Research — Quality Choice Prize' } as Record<Language, string> },
  { image: HELENE_IMAGES.licenseApac, title: 'APAC 2025', desc: { ja: 'アジア太平洋地域 Top再生医療ソリューション', 'zh-TW': '亞太地區 Top再生醫療解決方案', 'zh-CN': '亚太地区 Top再生医疗解决方案', en: 'Top Regenerative Medicine Solution Provider in APAC' } as Record<Language, string> },
  { image: HELENE_IMAGES.licenseAbrm, title: 'ABRM', desc: { ja: '米国再生医療学会 日本支部認定', 'zh-TW': '美國再生醫療學會 日本分部認定', 'zh-CN': '美国再生医疗学会 日本分部认定', en: 'American Society for Regenerative Medicine — Japan Chapter' } as Record<Language, string> },
];

// MHLW license badges row
const MHLW_LICENSES = [
  HELENE_IMAGES.license3,
  HELENE_IMAGES.license4,
  HELENE_IMAGES.license5,
  HELENE_IMAGES.license6,
  HELENE_IMAGES.license7,
  HELENE_IMAGES.license8,
];

// ======================================
// Facility gallery
// ======================================
const FACILITY_GALLERY = [
  { src: HELENE_IMAGES.facility1, label: { ja: '受付・ロビー', 'zh-TW': '接待·大廳', 'zh-CN': '接待·大厅', en: 'Reception & Lobby' } as Record<Language, string> },
  { src: HELENE_IMAGES.facility3, label: { ja: '診察室', 'zh-TW': '診察室', 'zh-CN': '诊察室', en: 'Consultation Room' } as Record<Language, string> },
  { src: HELENE_IMAGES.facility5, label: { ja: '処置室', 'zh-TW': '處置室', 'zh-CN': '处置室', en: 'Treatment Room' } as Record<Language, string> },
  { src: HELENE_IMAGES.facility7, label: { ja: '培養室（CPC）', 'zh-TW': '培養室（CPC）', 'zh-CN': '培养室（CPC）', en: 'Cell Culture Room (CPC)' } as Record<Language, string> },
  { src: HELENE_IMAGES.facility4, label: { ja: '点滴ルーム', 'zh-TW': '點滴室', 'zh-CN': '点滴室', en: 'IV Infusion Room' } as Record<Language, string> },
  { src: HELENE_IMAGES.facility8, label: { ja: 'ラウンジ', 'zh-TW': '貴賓休息室', 'zh-CN': '贵宾休息室', en: 'Lounge' } as Record<Language, string> },
];

// ======================================
// Facility strip
// ======================================
const FACILITY_STRIP = [
  HELENE_IMAGES.facility9,
  HELENE_IMAGES.techClinic,
  HELENE_IMAGES.aoClinic,
  HELENE_IMAGES.aoGallery1,
  HELENE_IMAGES.aoGallery2,
];

// ======================================
// Data: Treatment Pricing Categories
// ======================================
interface PricingItem {
  slug: string;
  label: Record<Language, string>;
}

interface PricingCategory {
  name: Record<Language, string>;
  items: PricingItem[];
}

const PRICING_CATEGORIES: PricingCategory[] = [
  {
    name: { ja: 'MSC幹細胞 静脈/皮下注射', 'zh-TW': 'MSC幹細胞 靜脈/皮下注射', 'zh-CN': 'MSC干细胞 静脉/皮下注射', en: 'MSC Stem Cell IV/Subcutaneous' } as Record<Language, string>,
    items: [
      { slug: 'helene-msc-iv-grade-b-minus', label: { ja: 'Grade B-（1億個）', 'zh-TW': 'Grade B-（1億個）', 'zh-CN': 'Grade B-（1亿个）', en: 'Grade B- (100M cells)' } as Record<Language, string> },
      { slug: 'helene-msc-iv-grade-b', label: { ja: 'Grade B（4億個）', 'zh-TW': 'Grade B（4億個）', 'zh-CN': 'Grade B（4亿个）', en: 'Grade B (400M cells)' } as Record<Language, string> },
      { slug: 'helene-msc-iv-grade-b-plus', label: { ja: 'Grade B+（7億個）', 'zh-TW': 'Grade B+（7億個）', 'zh-CN': 'Grade B+（7亿个）', en: 'Grade B+ (700M cells)' } as Record<Language, string> },
      { slug: 'helene-msc-iv-grade-a-minus', label: { ja: 'Grade A-（10億個）', 'zh-TW': 'Grade A-（10億個）', 'zh-CN': 'Grade A-（10亿个）', en: 'Grade A- (1B cells)' } as Record<Language, string> },
      { slug: 'helene-msc-iv-grade-a', label: { ja: 'Grade A（22.5億個）', 'zh-TW': 'Grade A（22.5億個）', 'zh-CN': 'Grade A（22.5亿个）', en: 'Grade A (2.25B cells)' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: 'MSC幹細胞 膝関節内注射', 'zh-TW': 'MSC幹細胞 膝關節注射', 'zh-CN': 'MSC干细胞 膝关节注射', en: 'MSC Knee Joint Injection' } as Record<Language, string>,
    items: [
      { slug: 'helene-msc-knee-single', label: { ja: '片膝（1億個）', 'zh-TW': '單膝（1億個）', 'zh-CN': '单膝（1亿个）', en: 'Single Knee (100M cells)' } as Record<Language, string> },
      { slug: 'helene-msc-knee-both', label: { ja: '両膝（2億個）', 'zh-TW': '雙膝（2億個）', 'zh-CN': '双膝（2亿个）', en: 'Both Knees (200M cells)' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: 'MSC幹細胞 歯周組織内注射', 'zh-TW': 'MSC幹細胞 牙周組織注射', 'zh-CN': 'MSC干细胞 牙周组织注射', en: 'MSC Periodontal Injection' } as Record<Language, string>,
    items: [
      { slug: 'helene-msc-periodontal-single', label: { ja: '上顎or下顎（1億個）', 'zh-TW': '單顎（1億個）', 'zh-CN': '单颌（1亿个）', en: 'Single Jaw (100M cells)' } as Record<Language, string> },
      { slug: 'helene-msc-periodontal-both', label: { ja: '上下顎（2億個）', 'zh-TW': '雙顎（2億個）', 'zh-CN': '双颌（2亿个）', en: 'Both Jaws (200M cells)' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: 'MSC幹細胞 脱毛部位注射', 'zh-TW': 'MSC幹細胞 脫髮部位注射', 'zh-CN': 'MSC干细胞 脱发部位注射', en: 'MSC Hair Loss Treatment' } as Record<Language, string>,
    items: [
      { slug: 'helene-msc-hair', label: { ja: 'Grade B（10億個）', 'zh-TW': 'Grade B（10億個）', 'zh-CN': 'Grade B（10亿个）', en: 'Grade B (1B cells)' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: '自己エクソソーム', 'zh-TW': '自體外泌體', 'zh-CN': '自体外泌体', en: 'Autologous Exosomes' } as Record<Language, string>,
    items: [
      { slug: 'helene-exosome-topical', label: { ja: '外用塗布（6ヶ月分）', 'zh-TW': '外用塗抹（6個月份）', 'zh-CN': '外用涂抹（6个月份）', en: 'Topical (6 Months)' } as Record<Language, string> },
      { slug: 'helene-exosome-injection', label: { ja: 'セルフ注射（1ヶ月分）', 'zh-TW': '自我注射（1個月份）', 'zh-CN': '自我注射（1个月份）', en: 'Self-Injection (1 Month)' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: 'NK細胞 静脈投与', 'zh-TW': 'NK細胞 靜脈投與', 'zh-CN': 'NK细胞 静脉投与', en: 'NK Cell IV Therapy' } as Record<Language, string>,
    items: [
      { slug: 'helene-nk-50', label: { ja: '50億個', 'zh-TW': '50億個', 'zh-CN': '50亿个', en: '5B cells' } as Record<Language, string> },
      { slug: 'helene-nk-100', label: { ja: '100億個', 'zh-TW': '100億個', 'zh-CN': '100亿个', en: '10B cells' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: '血液浄化療法', 'zh-TW': '血液淨化療法', 'zh-CN': '血液净化疗法', en: 'Blood Purification Therapy' } as Record<Language, string>,
    items: [
      { slug: 'helene-blood-purification', label: { ja: '血液浄化', 'zh-TW': '血液淨化', 'zh-CN': '血液净化', en: 'Blood Purification' } as Record<Language, string> },
    ],
  },
];

// ======================================
// Component
// ======================================
export default function HeleneClinicContent({ isGuideEmbed, guideSlug }: HeleneClinicContentProps) {
  const lang = useLanguage();
  const [expandedFlow, setExpandedFlow] = useState<number>(0);

  const t = (key: keyof typeof tr) => tr[key][lang] || tr[key]['ja'];

  const helenePackages = [
    {
      ...MEDICAL_PACKAGES['helene-initial-consultation'],
      name: { ja: 'ヘレネクリニック - 初期相談サービス', 'zh-TW': 'HELENE診所 - 前期諮詢服務', 'zh-CN': 'HELENE诊所 - 前期咨询服务', en: 'HELENE Clinic - Initial Consultation' } as Record<Language, string>,
      desc: { ja: '病歴翻訳、クリニック相談、幹細胞治療プラン評価、費用概算', 'zh-TW': '病歷翻譯、診所諮詢、幹細胞治療方案評估、費用概算', 'zh-CN': '病历翻译、诊所咨询、干细胞治疗方案评估、费用概算', en: 'Record translation, clinic consultation, stem cell treatment assessment, cost estimate' } as Record<Language, string>,
      ctaPath: 'initial-consultation',
    },
    {
      ...MEDICAL_PACKAGES['helene-remote-consultation'],
      name: { ja: 'ヘレネクリニック - 遠隔診断サービス', 'zh-TW': 'HELENE診所 - 遠程診斷服務', 'zh-CN': 'HELENE诊所 - 远程诊断服务', en: 'HELENE Clinic - Remote Diagnosis' } as Record<Language, string>,
      desc: { ja: 'HELENE専門医とのビデオ相談、幹細胞治療プラン説明、費用概算', 'zh-TW': '與HELENE專科醫生遠程視頻會診、幹細胞治療方案評估、費用概算', 'zh-CN': '与HELENE专科医生远程视频会诊、干细胞治疗方案评估、费用概算', en: 'Video consultation with HELENE specialists, stem cell treatment plan, cost estimate' } as Record<Language, string>,
      ctaPath: 'remote-consultation',
    },
  ];

  return (
    <div className={`min-h-screen bg-white ${isGuideEmbed ? '' : ''}`}>
      {/* ============ Hero ============ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden text-white">
        <img src={img(HELENE_IMAGES.professor, 1920)} alt="HELENE Clinic" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#007130]/90 via-[#007130]/65 to-[#007130]/20" />
        <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              <span className="text-xs font-medium tracking-wide">{t('limitBadge')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight">{t('heroTitle')}</h1>
            <p className="text-xl md:text-2xl text-white/90 font-semibold mb-4">{t('heroSub')}</p>
            <p className="text-sm text-white/70 mb-8">{t('heroDesc')}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#services" className="inline-flex items-center gap-2 bg-white text-[#007130] font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition shadow-lg">
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
      <section className="bg-[#007130]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 sm:divide-x sm:divide-white/30">
            {[
              { icon: Award, text: t('desig1') },
              { icon: Shield, text: t('desig2') },
              { icon: GraduationCap, text: t('desig3') },
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
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('statsTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('statsTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {KEY_STATS.map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition text-center">
                <div className="text-3xl font-black text-[#007130]">{stat.value}</div>
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
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('facilityTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('facilityTitle')}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3">
          {FACILITY_GALLERY.map((item, i) => (
            <div key={i} className="relative min-h-[30vh] md:min-h-[40vh] overflow-hidden group">
              <img src={img(item.src, 828)} alt={item.label[lang]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-semibold text-lg">{item.label[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Treatments ============ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('treatTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('treatTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {TREATMENTS.map((treat, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#007130] flex items-center justify-center flex-shrink-0">
                    <treat.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{treat.title[lang]}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{treat.desc[lang]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Indications ============ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('indicTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('indicTitle')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('indicDesc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {INDICATIONS.map((ind, i) => (
              <div key={i} className={`${ind.color} rounded-xl p-4 text-center hover:shadow-md transition`}>
                <ind.icon size={24} className="mx-auto mb-2" />
                <p className="text-sm font-semibold">{ind.name[lang]}</p>
              </div>
            ))}
          </div>
          {/* Disease treatment banners from official website */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              HELENE_IMAGES.diseaseBnr1, HELENE_IMAGES.diseaseBnr2, HELENE_IMAGES.diseaseBnr3,
              HELENE_IMAGES.diseaseBnr4, HELENE_IMAGES.diseaseBnr5, HELENE_IMAGES.diseaseBnr6,
              HELENE_IMAGES.diseaseBnr7, HELENE_IMAGES.diseaseBnr8, HELENE_IMAGES.diseaseBnr9,
              HELENE_IMAGES.diseaseBnr10,
            ].map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <img src={img(src, 384)} alt={`Treatment ${i + 1}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Technology (Left text + Right images) ============ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('techTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('techTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-5">
              {TECH_ITEMS.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <item.icon size={20} className="text-[#007130]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title[lang]}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.desc[lang]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Right side: technique comparison images from official site */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <img src={img(HELENE_IMAGES.techAbout1, 1080)} alt="HELENE 3D Culture Technology" className="absolute inset-0 w-full h-full object-contain bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-square rounded-xl overflow-hidden shadow">
                  <img src={img(HELENE_IMAGES.techDiff1, 828)} alt="Cell comparison 1" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden shadow">
                  <img src={img(HELENE_IMAGES.techDiff2, 828)} alt="Cell comparison 2" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow">
                  <img src={img(HELENE_IMAGES.techConfirm1, 828)} alt="Quality verification 1" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow">
                  <img src={img(HELENE_IMAGES.techConfirm2, 828)} alt="Quality verification 2" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
          {/* Guarantee badge */}
          <div className="mt-10 flex justify-center">
            <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-md">
              <img src={img(HELENE_IMAGES.techGuarantee, 828)} alt="Quality Guarantee" className="w-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ Medical Team ============ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('teamTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('teamTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img src={img(doc.photo, 828)} alt={doc.name[lang]} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{doc.name[lang]}</h3>
                  <p className="text-xs text-[#007130] font-semibold mb-2">{doc.role[lang]}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{doc.bio[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Prof. Gupta Research Banner ============ */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[40vh] overflow-hidden">
            <img src={img(HELENE_IMAGES.guptaLab, 1080)} alt="Prof. Gupta Research" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="bg-[#007130] text-white flex items-center p-10 md:p-14">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2">
                {lang === 'ja' ? '学術連携' : lang === 'en' ? 'Academic Collaboration' : lang === 'zh-TW' ? '學術合作' : '学术合作'}
              </p>
              <h3 className="text-2xl font-bold mb-4">
                {lang === 'ja' ? 'ケンブリッジ大学との学術連携' : lang === 'en' ? 'Cambridge University Partnership' : lang === 'zh-TW' ? '劍橋大學學術合作' : '剑桥大学学术合作'}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {lang === 'ja'
                  ? 'TIME誌「世界で最も影響力のある100人」（2020年）、FMedSci（2021年）、Clarivate高被引用研究者（2022-2024年）に選出されたRavindra Gupta教授を学術顧問に迎え、最先端の研究成果を臨床に応用しています'
                  : lang === 'en'
                  ? 'Prof. Ravindra Gupta — TIME "100 Most Influential" (2020), FMedSci (2021), Clarivate Highly Cited Researcher (2022-2024) — serves as academic advisor, bringing cutting-edge research to clinical practice'
                  : lang === 'zh-TW'
                  ? '邀請TIME「全球最具影響力100人」（2020年）、FMedSci（2021年）、Clarivate高被引研究者（2022-2024年）的Ravindra Gupta教授擔任學術顧問，將最尖端研究成果應用於臨床'
                  : '邀请TIME「全球最具影响力100人」（2020年）、FMedSci（2021年）、Clarivate高被引研究者（2022-2024年）的Ravindra Gupta教授担任学术顾问，将最尖端研究成果应用于临床'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Lab / CPC ============ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Lab intro with main photo */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <img src={img(HELENE_IMAGES.labClinic, 1080)} alt="HELENE CPC" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('labTag')}</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{t('labTitle')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{t('labDesc')}</p>
              <div className="space-y-3">
                {[
                  { ja: 'ISO Class 5 (Class 100) クリーンルーム', 'zh-TW': 'ISO Class 5 (Class 100) 無塵室', 'zh-CN': 'ISO Class 5 (Class 100) 无尘室', en: 'ISO Class 5 (Class 100) Clean Room' },
                  { ja: '37°C・5% CO2・湿度90%以上・HEPAフィルター', 'zh-TW': '37°C·5% CO2·濕度90%以上·HEPA過濾', 'zh-CN': '37°C·5% CO2·湿度90%以上·HEPA过滤', en: '37°C, 5% CO2, >90% humidity, HEPA filtered' },
                  { ja: '1バッチ1インキュベーター（交差汚染防止）', 'zh-TW': '一批次一培養箱（防止交叉污染）', 'zh-CN': '一批次一培养箱（防止交叉污染）', en: 'One batch, one incubator (prevent cross-contamination)' },
                  { ja: '細胞生存率 ≥92% 基準', 'zh-TW': '細胞存活率 ≥92% 標準', 'zh-CN': '细胞存活率 ≥92% 标准', en: 'Cell viability ≥92% standard' },
                  { ja: '液体窒素 -196°C 長期保存', 'zh-TW': '液氮 -196°C 長期保存', 'zh-CN': '液氮 -196°C 长期保存', en: 'Liquid nitrogen -196°C long-term storage' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#007130] flex-shrink-0" />
                    <span className="text-sm text-gray-700">{(item as Record<string, string>)[lang] || (item as Record<string, string>)['ja']}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quality management photos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[HELENE_IMAGES.labMgmt1, HELENE_IMAGES.labMgmt2, HELENE_IMAGES.labMgmt3, HELENE_IMAGES.labMgmt4].map((src, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                <img src={img(src, 828)} alt={`Lab Management ${i + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
            ))}
          </div>

          {/* Equipment grid */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-center text-sm font-bold text-gray-700 mb-4">
              {lang === 'ja' ? '主要設備一覧' : lang === 'en' ? 'Key Equipment' : lang === 'zh-TW' ? '主要設備一覽' : '主要设备一览'}
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                HELENE_IMAGES.equipment1, HELENE_IMAGES.equipment2, HELENE_IMAGES.equipment3,
                HELENE_IMAGES.equipment4, HELENE_IMAGES.equipment5, HELENE_IMAGES.equipment6,
                HELENE_IMAGES.equipment7, HELENE_IMAGES.equipment8, HELENE_IMAGES.equipment9,
                HELENE_IMAGES.equipment10, HELENE_IMAGES.equipment11, HELENE_IMAGES.equipment12,
              ].map((src, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-2 flex items-center justify-center aspect-square">
                  <img src={img(src, 384)} alt={`Equipment ${i + 1}`} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Treatment Flow ============ */}
      <section id="flow" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('flowTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('flowTitle')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('flowDesc')}</p>
          </div>
          <div className="max-w-2xl mx-auto">
            {FLOW_STEPS.map((step, i) => (
              <div key={i} className="flex gap-4 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setExpandedFlow(expandedFlow === i ? -1 : i)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm transition ${expandedFlow === i ? 'bg-[#007130] text-white' : 'bg-gray-100 text-gray-500 hover:bg-green-50'}`}
                  >
                    {step.step}
                  </button>
                  {i < FLOW_STEPS.length - 1 && <div className="w-px flex-1 bg-[#007130]/20 mt-2" />}
                </div>
                <div className="pb-4 flex-1">
                  <button
                    onClick={() => setExpandedFlow(expandedFlow === i ? -1 : i)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <h4 className="font-bold text-gray-900">{step.title[lang]}</h4>
                    {expandedFlow === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  {expandedFlow === i && (
                    <p className="text-sm text-gray-600 mt-2">{step.desc[lang]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Certifications ============ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('certsTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t('certsTitle')}</h2>
          </div>
          {/* Main certification badges with real images */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {CERTIFICATIONS.map((cert, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition">
                <div className="h-20 flex items-center justify-center mb-3">
                  <img src={img(cert.image, 384)} alt={cert.title} className="max-h-full max-w-full object-contain" />
                </div>
                <p className="font-bold text-gray-900 text-sm">{cert.title}</p>
                <p className="text-xs text-gray-500 mt-1">{cert.desc[lang]}</p>
              </div>
            ))}
          </div>
          {/* MHLW license badges row */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-center text-sm font-bold text-gray-700 mb-4">
              {lang === 'ja' ? '厚生労働省 再生医療等提供計画 認可証' : lang === 'en' ? 'MHLW Regenerative Medicine Plan Licenses' : lang === 'zh-TW' ? '厚生勞動省 再生醫療等提供計畫 認可證' : '厚生劳动省 再生医疗等提供计划 认可证'}
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {MHLW_LICENSES.map((src, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                  <img src={img(src, 384)} alt={`MHLW License ${i + 1}`} className="max-h-24 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Facility Strip ============ */}
      <section className="grid grid-cols-2 md:grid-cols-5">
        {FACILITY_STRIP.map((src, i) => (
          <div key={i} className="relative aspect-[3/2] overflow-hidden group">
            <img src={img(src, 828)} alt={`HELENE Facility ${i + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        ))}
      </section>

      {/* ============ Treatment Pricing ============ */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('pricingTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('pricingTitle')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('pricingDesc')}</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {PRICING_CATEGORIES.map((cat, ci) => (
              <div key={ci} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900">{cat.name[lang]}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {cat.items.map((item) => {
                    const pkg = MEDICAL_PACKAGES[item.slug];
                    if (!pkg) return null;
                    return (
                      <div key={item.slug} className="flex items-center justify-between px-6 py-4 hover:bg-green-50/30 transition">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{item.label[lang]}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-black text-[#007130]">¥{pkg.priceJpy.toLocaleString()}</span>
                          <Link
                            href={guideSlug ? `/helene-clinic/treatment?guide=${guideSlug}` : '/helene-clinic/treatment'}
                            className="hidden sm:inline-flex items-center gap-1 bg-[#007130] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#005a26] transition"
                          >
                            <ArrowRight size={14} />
                            {t('pricingCta')}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* Mobile full-width CTA */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              href={guideSlug ? `/helene-clinic/treatment?guide=${guideSlug}` : '/helene-clinic/treatment'}
              className="inline-flex items-center gap-2 bg-[#007130] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#005a26] transition"
            >
              <ArrowRight size={18} />
              {t('pricingCta')}
            </Link>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">{t('pricingNote')}</p>
        </div>
      </section>

      {/* ============ Services ============ */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#007130] text-xs tracking-widest uppercase font-bold">{t('svcTag')}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t('svcTitle')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('svcDesc')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {helenePackages.map((pkg) => (
              <div key={pkg.slug} className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#007130] p-8 transition shadow-sm hover:shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name[lang]}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-[#007130]">¥{pkg.priceJpy.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">{t('taxIncl')}</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">{pkg.desc[lang]}</p>
                <Link
                  href={guideSlug ? `/helene-clinic/${pkg.ctaPath}?guide=${guideSlug}` : `/helene-clinic/${pkg.ctaPath}`}
                  className="block w-full text-center bg-[#007130] text-white font-bold py-3 rounded-xl hover:bg-[#005a26] transition"
                >
                  {t('bookNow')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Clinic Info ============ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-[#007130]" />
                {tr.heroTitle[lang]}
              </h3>
              <div className="grid gap-5 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#007130] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{lang === 'ja' ? '所在地' : lang === 'en' ? 'Address' : lang === 'zh-TW' ? '地址' : '地址'}</p>
                    <p>〒107-0062</p>
                    <p>{lang === 'ja' ? '東京都港区南青山5-9-15 青山OHMOTOビル3F' : lang === 'en' ? '3F Aoyama OHMOTO Bldg, 5-9-15 Minamiaoyama, Minato-ku, Tokyo' : lang === 'zh-TW' ? '東京都港區南青山5-9-15 青山OHMOTO大樓3F' : '东京都港区南青山5-9-15 青山OHMOTO大楼3F'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Train size={16} className="text-[#007130] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{lang === 'ja' ? '交通アクセス' : lang === 'en' ? 'Access' : lang === 'zh-TW' ? '交通' : '交通'}</p>
                    <p>{lang === 'ja' ? '表参道駅B1出口 徒歩1分' : lang === 'en' ? '1 min walk from Omotesando Station B1 Exit' : lang === 'zh-TW' ? '表參道站B1出口 步行1分鐘' : '表参道站B1出口 步行1分钟'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[#007130] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{lang === 'ja' ? '電話' : lang === 'en' ? 'Phone' : lang === 'zh-TW' ? '電話' : '电话'}</p>
                    <p>+81-3-3400-2277</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-[#007130] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{lang === 'ja' ? '診療時間' : lang === 'en' ? 'Hours' : lang === 'zh-TW' ? '診療時間' : '诊疗时间'}</p>
                    <p>10:00 - 19:00</p>
                    <p className="text-xs text-gray-400">{lang === 'ja' ? '休診日：水曜・日曜' : lang === 'en' ? 'Closed: Wed & Sun' : lang === 'zh-TW' ? '休診日：週三·週日' : '休诊日：周三·周日'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={16} className="text-[#007130] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{lang === 'ja' ? '対応言語' : lang === 'en' ? 'Languages' : lang === 'zh-TW' ? '對應語言' : '对应语言'}</p>
                    <p>{lang === 'ja' ? '日本語・中国語・英語・ベトナム語・インドネシア語 他' : lang === 'en' ? 'Japanese, Chinese, English, Vietnamese, Indonesian +' : lang === 'zh-TW' ? '日語·中文·英語·越南語·印尼語等15+語言' : '日语·中文·英语·越南语·印尼语等15+语言'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <img src={img(HELENE_IMAGES.facility2, 1080)} alt="HELENE Clinic Exterior" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img src={img(HELENE_IMAGES.multilingualStaff, 1080)} alt="Multilingual Staff" className="w-full object-contain" />
                <p className="text-center text-xs text-gray-500 mt-2 px-2 pb-2">
                  {lang === 'ja' ? '多国籍スタッフが15以上の言語でサポート' : lang === 'en' ? 'Multilingual staff supporting 15+ languages' : lang === 'zh-TW' ? '多國籍員工支持15+語言' : '多国籍员工支持15+语言'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Contact ============ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{t('contactTitle')}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://line.me/R/ti/p/@shinjima" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#06C755] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition">
              <MessageSquare size={18} />
              LINE
            </a>
            <a href="mailto:info@niijima-koutsu.jp" className="inline-flex items-center gap-2 bg-[#007130] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#005a26] transition">
              <Mail size={18} />
              Email
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            {lang === 'ja'
              ? '※ 当サイトは表参道ヘレネクリニックの公式サイトではありません。医療ツーリズムの仲介サービスです。'
              : lang === 'en'
              ? '* This is not the official HELENE Clinic website. We provide medical tourism coordination services.'
              : lang === 'zh-TW'
              ? '※ 本站非表參道HELENE診所官網。我們提供醫療旅遊協調服務。'
              : '※ 本站非表参道HELENE诊所官网。我们提供医疗旅游协调服务。'}
          </p>
        </div>
      </section>
    </div>
  );
}
