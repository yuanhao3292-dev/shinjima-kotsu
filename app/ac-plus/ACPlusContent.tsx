'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, ChevronDown, ChevronUp,
  Shield, Heart, Brain, Syringe, Microscope,
  CheckCircle, ArrowRight, Globe,
  Dna, FlaskConical, ShieldCheck,
  GraduationCap, Building2, Star,
  Sparkles, Activity, Droplets,
  Beaker, Bone, Leaf, Users,
  Zap, HelpCircle, Building,
  Thermometer, Eye, Stethoscope,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';


// ======================================
// Hero image export (white-label mapping)
// ======================================
export const AC_PLUS_HERO_IMAGE =
  'https://cdn.yun.sooce.cn/6/60567/png/1751617672017b7325ee433cf0da1346880da57c866f4.png?version=0';

// ======================================
// Official image URLs (acplusmedical.com CDN)
// ======================================
const IMG = {
  hero1: 'https://cdn.yun.sooce.cn/6/60567/png/1751617672017b7325ee433cf0da1346880da57c866f4.png?version=0',
  hero2: 'https://cdn.yun.sooce.cn/6/60567/png/1751617672019caec02c4cdf2988f92633bf2b746e795.png?version=1751617679',
  stemCard: 'https://cdn.yun.sooce.cn/6/60567/png/17519463900090120a4f9196a5f9eb9f523f31f914da7.png?version=0',
  nkCard: 'https://cdn.yun.sooce.cn/6/60567/png/1751946389988e1c80488853d86ab9d6decfe30d8930f.png?version=1751946391',
  supernatantCard: 'https://cdn.yun.sooce.cn/6/60567/png/17519463900128a9fd7dfda802921fdc4079f9a528ce8.png?version=1751946391',
  acrsCard: 'https://cdn.yun.sooce.cn/6/60567/png/175194638998937c965a8d6d7bec292c7b11ff315d9ea.png?version=1751946391',
  researchTeam: 'https://cdn.yun.sooce.cn/6/60567/jpg/1751622206873061feec8840bb22d082f8d23d2ee0cca.jpg?version=0',
  safety: 'https://cdn.yun.sooce.cn/6/60567/jpg/1751622206875cbd76ff4437b1871904361a926d1b5b3.jpg?version=1751622209',
  international: 'https://cdn.yun.sooce.cn/6/60567/jpg/175162248580478f0ba62ca3785bd28f341874b98b60d.jpg?version=0',
  exterior: 'https://cdn.yun.sooce.cn/6/60567/jpg/17516212715262f8a6bf31f3bd67bd2d9720c58b19c9a.jpg?version=0',
  cpc1: 'https://cdn.yun.sooce.cn/6/60567/png/1751944958872c4ca4238a0b923820dcc509a6f75849b.png?version=0',
  cpc2: 'https://cdn.yun.sooce.cn/6/60567/png/1751944958876c81e728d9d4c2f636f067f89cc14862c.png?version=1751944960',
  cpc3: 'https://cdn.yun.sooce.cn/6/60567/png/1751944958871eccbc87e4b5ce2fe28308fd9f2a7baf3.png?version=1751944960',
  facility1: 'https://cdn.yun.sooce.cn/6/60567/png/1751940893493c4ca4238a0b923820dcc509a6f75849b.png?version=0',
  facility2: 'https://cdn.yun.sooce.cn/6/60567/png/1751940924100c81e728d9d4c2f636f067f89cc14862c.png?version=0',
  stemDiagram: 'https://cdn.yun.sooce.cn/6/60567/png/1751947120300c4ca4238a0b923820dcc509a6f75849b.png?version=0',
  nkDiagram: 'https://cdn.yun.sooce.cn/6/60567/png/1751959376737c4ca4238a0b923820dcc509a6f75849b.png?version=0',
  supernatantImg: 'https://cdn.yun.sooce.cn/6/60567/png/1751962608525c4ca4238a0b923820dcc509a6f75849b.png?version=0',
  acrsImg1: 'https://cdn.yun.sooce.cn/6/60567/png/1752483838003c4ca4238a0b923820dcc509a6f75849b.png?version=0',
  acrsImg2: 'https://cdn.yun.sooce.cn/6/60567/png/1752483838006c81e728d9d4c2f636f067f89cc14862c.png?version=1752483840',
  bloodPurify: 'https://cdn.yun.sooce.cn/6/60567/png/1752485174207c4ca4238a0b923820dcc509a6f75849b.png?version=0',
  logo: 'https://acplusmedical.com/img/logo_4747.png?1753946659',
  statsCustomers: 'https://cdn.yun.sooce.cn/6/60567/png/1752638303594c4ca4238a0b923820dcc509a6f75849b.png?version=0',
  statsYears: 'https://cdn.yun.sooce.cn/6/60567/png/1752638303594c81e728d9d4c2f636f067f89cc14862c.png?version=1752638305',
  statsSatisfaction: 'https://cdn.yun.sooce.cn/6/60567/png/1752638303599eccbc87e4b5ce2fe28308fd9f2a7baf3.png?version=1752638305',
  upgrade2024: 'https://cdn.yun.sooce.cn/6/60567/png/175162054921078f0ba62ca3785bd28f341874b98b60d.png?version=1751620550',
  mapLocation: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/public-assets/ac-plus/map-location.png',
};

// ======================================
// Multi-language translations
// ======================================
const t = {
  heroTag: { ja: '関西再生医療のベンチマーク', 'zh-TW': '關西再生醫療的標竿', 'zh-CN': '关西再生医疗的标杆', en: 'Kansai Regenerative Medicine Benchmark' } as Record<Language, string>,
  heroTitle: { ja: 'ACセルクリニック', 'zh-TW': 'AC Cell Clinic', 'zh-CN': 'AC Cell Clinic', en: 'AC Cell Clinic' } as Record<Language, string>,
  heroSub: { ja: 'ACメディカルグループ — 9階建て専用ビルで提供する\n京都大学・大阪大学連携の再生医療', 'zh-TW': 'AC Medical Group — 9層專用大樓提供\n京都大學・大阪大學合作的再生醫療', 'zh-CN': 'AC Medical Group — 9层专用大楼提供\n京都大学·大阪大学合作的再生医疗', en: 'AC Medical Group — Regenerative medicine in a\n9-floor dedicated building, partnered with Kyoto & Osaka Universities' } as Record<Language, string>,
  ctaConsult: { ja: '無料相談を予約する', 'zh-TW': '預約免費諮詢', 'zh-CN': '预约免费咨询', en: 'Book Free Consultation' } as Record<Language, string>,
  ctaLearn: { ja: '治療メニューを見る', 'zh-TW': '查看治療項目', 'zh-CN': '查看治疗项目', en: 'View Treatments' } as Record<Language, string>,

  // Stats
  stat1: { ja: '累計患者数', 'zh-TW': '累計患者數', 'zh-CN': '累计患者数', en: 'Total Patients' } as Record<Language, string>,
  stat2: { ja: '開業年数', 'zh-TW': '開業年數', 'zh-CN': '开业年数', en: 'Years in Practice' } as Record<Language, string>,
  stat3: { ja: '厚労省認可計画数', 'zh-TW': '厚勞省認可計劃數', 'zh-CN': '厚劳省认可计划数', en: 'MHLW-Approved Plans' } as Record<Language, string>,
  stat4: { ja: 'CPC規格', 'zh-TW': 'CPC規格', 'zh-CN': 'CPC规格', en: 'CPC Standard' } as Record<Language, string>,

  // Intro
  introTag: { ja: 'クリニック紹介', 'zh-TW': '診所介紹', 'zh-CN': '诊所介绍', en: 'About the Clinic' } as Record<Language, string>,
  introTitle: { ja: 'ACメディカルグループの挑戦', 'zh-TW': 'AC Medical Group的挑戰', 'zh-CN': 'AC Medical Group的挑战', en: 'The AC Medical Group Mission' } as Record<Language, string>,
  introP1: { ja: '2006年に大阪で設立されたACメディカルグループは、再生医療に特化した医療機関として18年以上の実績を持ちます。大阪市中央区に9階建ての専用ビル「日本細胞ビル」を構え、培養から投与まで一貫した体制で30,000名以上の患者様をサポートしてきました。', 'zh-TW': 'AC Medical Group於2006年在大阪成立，是一家專注於再生醫療的醫療機構，擁有超過18年的實績。在大阪市中央區擁有9層專用大樓「日本細胞大樓」，從培養到投藥提供一貫式服務，已為超過30,000名患者提供支援。', 'zh-CN': 'AC Medical Group于2006年在大阪成立，是一家专注于再生医疗的医疗机构，拥有超过18年的实绩。在大阪市中央区拥有9层专用大楼「日本细胞大楼」，从培养到投药提供一贯式服务，已为超过30,000名患者提供支援。', en: 'Founded in 2006 in Osaka, AC Medical Group is a regenerative medicine institution with over 18 years of track record. Operating from a 9-floor dedicated building, the Japan Cell Building, in Chuo-ku, Osaka, they have supported over 30,000 patients with integrated services from cell cultivation to administration.' } as Record<Language, string>,
  introP2: { ja: '京都大学再生医療研究所（河本宏チーム、iPS/ES細胞キラーT細胞技術）および大阪大学医学部附属病院と学術連携し、最先端の治療技術を臨床に応用しています。', 'zh-TW': '與京都大學再生醫療研究所（河本宏團隊，iPS/ES細胞殺手T細胞技術）及大阪大學醫學部附屬醫院進行學術合作，將最前沿的治療技術應用於臨床。', 'zh-CN': '与京都大学再生医疗研究所（河本宏团队，iPS/ES细胞杀手T细胞技术）及大阪大学医学部附属医院进行学术合作，将最前沿的治疗技术应用于临床。', en: 'In academic partnership with Kyoto University Institute of Regenerative Medicine (Prof. Kawamoto Hiroshi\'s team, iPS/ES cell killer T-cell technology) and Osaka University Medical Hospital, bringing cutting-edge treatment technologies to clinical practice.' } as Record<Language, string>,
  partnerKyoto: { ja: '京都大学再生医療研究所', 'zh-TW': '京都大學再生醫療研究所', 'zh-CN': '京都大学再生医疗研究所', en: 'Kyoto Univ. Institute of Regenerative Medicine' } as Record<Language, string>,
  partnerOsaka: { ja: '大阪大学医学部附属病院', 'zh-TW': '大阪大學醫學部附屬醫院', 'zh-CN': '大阪大学医学部附属医院', en: 'Osaka Univ. Medical Hospital' } as Record<Language, string>,

  // Treatments
  treatTag: { ja: '治療メニュー', 'zh-TW': '治療項目', 'zh-CN': '治疗项目', en: 'Treatment Menu' } as Record<Language, string>,
  treatTitle: { ja: '5つの先端再生医療', 'zh-TW': '5項先端再生醫療', 'zh-CN': '5项先端再生医疗', en: '5 Advanced Regenerative Therapies' } as Record<Language, string>,
  viewDetail: { ja: '詳細を見る', 'zh-TW': '查看詳情', 'zh-CN': '查看详情', en: 'View Details' } as Record<Language, string>,
  hideDetail: { ja: '閉じる', 'zh-TW': '收起', 'zh-CN': '收起', en: 'Hide' } as Record<Language, string>,

  // Treatment 1: Stem Cell
  sc_name: { ja: '自己脂肪由来幹細胞療法', 'zh-TW': '自體脂肪幹細胞療法', 'zh-CN': '自体脂肪干细胞疗法', en: 'Adipose-Derived Stem Cell Therapy' } as Record<Language, string>,
  sc_desc: { ja: '自己複製能、多分化能、パラクライン効果の3大特性を活かした再生医療の中核治療', 'zh-TW': '運用自我複製能力、多向分化能力、旁分泌效應三大特性的再生醫療核心治療', 'zh-CN': '运用自我复制能力、多向分化能力、旁分泌效应三大特性的再生医疗核心治疗', en: 'Core regenerative therapy utilizing 3 key properties: self-replication, multi-differentiation, and paracrine effects' } as Record<Language, string>,
  sc_apps: { ja: '代謝疾患・神経疾患・心血管・消化器・呼吸器・免疫・運動器', 'zh-TW': '代謝疾病・神經疾病・心血管・消化系統・呼吸系統・免疫・運動系統', 'zh-CN': '代谢疾病·神经疾病·心血管·消化系统·呼吸系统·免疫·运动系统', en: 'Metabolic, neurological, cardiovascular, digestive, respiratory, immune, musculoskeletal' } as Record<Language, string>,
  sc_process: { ja: '診断 → 脂肪採取（2mm切開, 20-30ml）→ 4週間培養（約1億個）→ 投与', 'zh-TW': '診斷 → 脂肪採取（2mm切口, 20-30ml）→ 4週培養（約1億個）→ 投與', 'zh-CN': '诊断 → 脂肪采取（2mm切口, 20-30ml）→ 4周培养（约1亿个）→ 投与', en: 'Diagnosis → Fat extraction (2mm incision, 20-30ml) → 4-week cultivation (~100M cells) → Administration' } as Record<Language, string>,
  sc_preserve: { ja: '-196°Cの液体窒素保存、解凍後回復率90%以上', 'zh-TW': '-196°C液態氮保存，解凍後恢復率90%以上', 'zh-CN': '-196°C液态氮保存，解冻后恢复率90%以上', en: '-196°C liquid nitrogen preservation, >90% post-thaw recovery rate' } as Record<Language, string>,

  // Treatment 2: NK Cell
  nk_name: { ja: 'NK細胞療法', 'zh-TW': 'NK細胞療法', 'zh-CN': 'NK细胞疗法', en: 'NK Cell Therapy' } as Record<Language, string>,
  nk_desc: { ja: '自然免疫細胞（リンパ球の5-20%）を約1億個まで拡大培養、95%以上の生存率で投与', 'zh-TW': '將自然免疫細胞（淋巴球的5-20%）擴大培養至約1億個，以95%以上的存活率投與', 'zh-CN': '将自然免疫细胞（淋巴细胞的5-20%）扩大培养至约1亿个，以95%以上的存活率投与', en: 'Expand natural immune cells (5-20% of lymphocytes) to ~100M, administered with >95% viability' } as Record<Language, string>,
  nk_targets: { ja: 'がん予防、治療後の再発予防に', 'zh-TW': '用於癌症預防、治療後復發預防', 'zh-CN': '用于癌症预防、治疗后复发预防', en: 'Cancer prevention and post-treatment recurrence prevention' } as Record<Language, string>,
  nk_process: { ja: '評価 → 採血 → 培養 → 点滴投与', 'zh-TW': '評估 → 採血 → 培養 → 點滴投與', 'zh-CN': '评估 → 采血 → 培养 → 点滴投与', en: 'Evaluation → Blood collection → Cultivation → IV infusion' } as Record<Language, string>,

  // Treatment 3: Supernatant
  sn_name: { ja: '幹細胞培養上清液', 'zh-TW': '幹細胞培養上清液', 'zh-CN': '干细胞培养上清液', en: 'Stem Cell Supernatant' } as Record<Language, string>,
  sn_desc: { ja: '120種以上の成長因子、50種以上のサイトカイン、エクソソームを含む1mLあたり1,000種以上の生理活性物質', 'zh-TW': '含有120種以上成長因子、50種以上細胞因子、外泌體等每mL 1,000種以上生理活性物質', 'zh-CN': '含有120种以上成长因子、50种以上细胞因子、外泌体等每mL 1,000种以上生理活性物质', en: '120+ growth factors, 50+ cytokines, exosomes — 1,000+ bioactive substances per mL' } as Record<Language, string>,
  sn_apps: { ja: '運動器・代謝・皮膚/毛髪・自己免疫疾患', 'zh-TW': '運動系統・代謝・皮膚/毛髮・自體免疫疾病', 'zh-CN': '运动系统·代谢·皮肤/毛发·自身免疫疾病', en: 'Musculoskeletal, metabolic, skin/hair, autoimmune' } as Record<Language, string>,
  sn_admin: { ja: '点滴（30-60分）、注射、マイクロニードル', 'zh-TW': '點滴（30-60分鐘）、注射、微針', 'zh-CN': '点滴（30-60分钟）、注射、微针', en: 'IV (30-60min), injection, or microneedle' } as Record<Language, string>,

  // Treatment 4: ACRS
  acrs_name: { ja: 'ACRS療法', 'zh-TW': 'ACRS療法', 'zh-CN': 'ACRS疗法', en: 'ACRS Therapy' } as Record<Language, string>,
  acrs_desc: { ja: 'PRP療法の進化版、15倍の効果。37°C処理で抗炎症サイトカイン（IL-1ra, IL-4ra）を活性化', 'zh-TW': 'PRP療法的進化版，效果達15倍。37°C處理激活抗炎細胞因子（IL-1ra, IL-4ra）', 'zh-CN': 'PRP疗法的进化版，效果达15倍。37°C处理激活抗炎细胞因子（IL-1ra, IL-4ra）', en: 'Evolution of PRP therapy, 15x more effective. 37°C processing activates anti-inflammatory cytokines (IL-1ra, IL-4ra)' } as Record<Language, string>,
  acrs_apps: { ja: '神経疾患・抗炎症・関節痛・毛髪・顔面若返り', 'zh-TW': '神經疾病・抗炎症・關節痛・毛髮・面部年輕化', 'zh-CN': '神经疾病·抗炎症·关节痛·毛发·面部年轻化', en: 'Neurological, anti-inflammatory, joint pain, hair, facial rejuvenation' } as Record<Language, string>,
  acrs_process: { ja: '採血 → 3時間血液処理 → 血清分離 → 注入 → 経過観察', 'zh-TW': '採血 → 3小時血液處理 → 血清分離 → 注入 → 追蹤觀察', 'zh-CN': '采血 → 3小时血液处理 → 血清分离 → 注入 → 追踪观察', en: 'Blood draw → 3-hour processing → Serum separation → Injection → Follow-up' } as Record<Language, string>,

  // Treatment 5: Blood Purification
  bp_name: { ja: '血液浄化療法', 'zh-TW': '血液淨化療法', 'zh-CN': '血液净化疗法', en: 'Blood Purification (Apheresis)' } as Record<Language, string>,
  bp_desc: { ja: 'Leocanaフィルターで中性脂肪・LDLコレステロールを選択的に除去。動脈硬化・心筋梗塞・脳卒中を予防', 'zh-TW': '使用Leocana濾器選擇性去除三酸甘油脂・LDL膽固醇。預防動脈硬化・心肌梗塞・腦中風', 'zh-CN': '使用Leocana滤器选择性去除甘油三酯·LDL胆固醇。预防动脉硬化·心肌梗塞·脑卒中', en: 'Selectively removes triglycerides and LDL cholesterol using Leocana filter. Prevents arteriosclerosis, heart attack, stroke' } as Record<Language, string>,

  // Stem Cell Deep Dive
  scDeepTag: { ja: '幹細胞療法 詳解', 'zh-TW': '幹細胞療法 詳解', 'zh-CN': '干细胞疗法 详解', en: 'Stem Cell Therapy In-Depth' } as Record<Language, string>,
  scDeepTitle: { ja: '幹細胞の3大特性と臨床応用', 'zh-TW': '幹細胞的3大特性與臨床應用', 'zh-CN': '干细胞的3大特性与临床应用', en: '3 Key Stem Cell Properties & Clinical Applications' } as Record<Language, string>,
  prop1: { ja: '自己複製能', 'zh-TW': '自我複製能力', 'zh-CN': '自我复制能力', en: 'Self-Replication' } as Record<Language, string>,
  prop1d: { ja: '幹細胞が自ら分裂・増殖し、同一の幹細胞を無限に生み出す能力', 'zh-TW': '幹細胞自行分裂增殖，無限生成同一幹細胞的能力', 'zh-CN': '干细胞自行分裂增殖，无限生成同一干细胞的能力', en: 'The ability to divide and proliferate, infinitely generating identical stem cells' } as Record<Language, string>,
  prop2: { ja: '多分化能', 'zh-TW': '多向分化能力', 'zh-CN': '多向分化能力', en: 'Multi-Differentiation' } as Record<Language, string>,
  prop2d: { ja: '骨、軟骨、脂肪、筋肉、神経など様々な細胞に変化する能力', 'zh-TW': '可分化為骨骼、軟骨、脂肪、肌肉、神經等多種細胞', 'zh-CN': '可分化为骨骼、软骨、脂肪、肌肉、神经等多种细胞', en: 'Transforms into bone, cartilage, fat, muscle, nerve, and other cell types' } as Record<Language, string>,
  prop3: { ja: 'パラクライン効果', 'zh-TW': '旁分泌效應', 'zh-CN': '旁分泌效应', en: 'Paracrine Effect' } as Record<Language, string>,
  prop3d: { ja: '成長因子やサイトカインを放出し、周囲の細胞を修復・活性化する効果', 'zh-TW': '釋放成長因子和細胞因子，修復並活化周圍細胞', 'zh-CN': '释放成长因子和细胞因子，修复并活化周围细胞', en: 'Releases growth factors and cytokines to repair and activate surrounding cells' } as Record<Language, string>,
  clinicalApps: { ja: '臨床応用分野', 'zh-TW': '臨床應用領域', 'zh-CN': '临床应用领域', en: 'Clinical Application Areas' } as Record<Language, string>,
  processTitle: { ja: '治療プロセス', 'zh-TW': '治療流程', 'zh-CN': '治疗流程', en: 'Treatment Process' } as Record<Language, string>,

  // CPC
  cpcTag: { ja: '細胞培養加工施設', 'zh-TW': '細胞培養加工設施', 'zh-CN': '细胞培养加工设施', en: 'Cell Processing Center' } as Record<Language, string>,
  cpcTitle: { ja: 'ISO Class 5 クリーンルーム', 'zh-TW': 'ISO Class 5 無塵室', 'zh-CN': 'ISO Class 5 洁净室', en: 'ISO Class 5 Cleanroom' } as Record<Language, string>,
  cpcDesc: { ja: '7階に設置された細胞培養加工施設（CPC）は、ISO Class 5（Class 100）の清浄度を維持。-85°C超低温フリーザーと-196°C液体窒素タンクで細胞を厳密に管理。GMP準拠のモニタリングシステムで24時間監視しています。', 'zh-TW': '位於7樓的細胞培養加工設施（CPC）維持ISO Class 5（Class 100）的潔淨度。使用-85°C超低溫冷凍庫和-196°C液態氮儲存槽嚴格管理細胞。符合GMP的監控系統24小時監控。', 'zh-CN': '位于7楼的细胞培养加工设施（CPC）维持ISO Class 5（Class 100）的洁净度。使用-85°C超低温冷冻库和-196°C液态氮储存罐严格管理细胞。符合GMP的监控系统24小时监控。', en: 'The Cell Processing Center (CPC) on the 7th floor maintains ISO Class 5 (Class 100) cleanliness. Cells are strictly managed with -85°C ultra-low temperature freezers and -196°C liquid nitrogen tanks, monitored 24/7 by GMP-compliant systems.' } as Record<Language, string>,

  // Building
  bldgTag: { ja: '施設案内', 'zh-TW': '設施導覽', 'zh-CN': '设施导览', en: 'Facility Guide' } as Record<Language, string>,
  bldgTitle: { ja: '日本細胞ビル — 9階建て専用施設', 'zh-TW': '日本細胞大樓 — 9層專用設施', 'zh-CN': '日本细胞大楼 — 9层专用设施', en: 'Japan Cell Building — 9-Floor Dedicated Facility' } as Record<Language, string>,
  bldgSub: { ja: '再生医療に特化した国内唯一の9階建て専用ビル', 'zh-TW': '日本唯一專注再生醫療的9層專用大樓', 'zh-CN': '日本唯一专注再生医疗的9层专用大楼', en: 'Japan\'s only 9-floor building dedicated to regenerative medicine' } as Record<Language, string>,

  // Features
  featTag: { ja: 'ACセルクリニックの特徴', 'zh-TW': 'AC Cell Clinic的特色', 'zh-CN': 'AC Cell Clinic的特色', en: 'AC Cell Clinic Features' } as Record<Language, string>,
  feat1Title: { ja: '産学連携の研究チーム', 'zh-TW': '產學合作的研究團隊', 'zh-CN': '产学合作的研究团队', en: 'Industry-Academic Research Team' } as Record<Language, string>,
  feat1Desc: { ja: '京都大学再生医療研究所（河本宏チーム）と大阪大学医学部附属病院との学術連携により、iPS/ES細胞キラーT細胞技術をはじめとする最先端研究を臨床応用しています。', 'zh-TW': '與京都大學再生醫療研究所（河本宏團隊）和大阪大學醫學部附屬醫院學術合作，將iPS/ES細胞殺手T細胞技術等最前沿研究應用於臨床。', 'zh-CN': '与京都大学再生医疗研究所（河本宏团队）和大阪大学医学部附属医院学术合作，将iPS/ES细胞杀手T细胞技术等最前沿研究应用于临床。', en: 'Academic partnerships with Kyoto University (Prof. Kawamoto team) and Osaka University Hospital bring cutting-edge iPS/ES cell killer T-cell technology to clinical practice.' } as Record<Language, string>,
  feat2Title: { ja: '安全性・有効性の追求', 'zh-TW': '追求安全性與有效性', 'zh-CN': '追求安全性与有效性', en: 'Pursuit of Safety & Efficacy' } as Record<Language, string>,
  feat2Desc: { ja: '自院CPC（ISO Class 5）での一貫した品質管理、30,000名以上の治療実績、98%以上の患者満足度が証明する信頼性。-196°C液体窒素保存で解凍後回復率90%以上。', 'zh-TW': '院內CPC（ISO Class 5）的一貫品質管理，超過30,000名治療實績，98%以上患者滿意度所證明的可靠性。-196°C液態氮保存，解凍後恢復率超過90%。', 'zh-CN': '院内CPC（ISO Class 5）的一贯品质管理，超过30,000名治疗实绩，98%以上患者满意度所证明的可靠性。-196°C液态氮保存，解冻后恢复率超过90%。', en: 'Consistent quality control in our in-house CPC (ISO Class 5), proven by 30,000+ treatments and 98%+ patient satisfaction. >90% post-thaw recovery with -196°C liquid nitrogen storage.' } as Record<Language, string>,
  feat3Title: { ja: '国際対応サービス', 'zh-TW': '國際服務', 'zh-CN': '国际服务', en: 'International Service' } as Record<Language, string>,
  feat3Desc: { ja: '中国語・英語の翻訳サポート完備。国際患者専用の対応チームが、予約から治療完了までサポート。細胞培養には最低6週間の事前予約が必要です。', 'zh-TW': '提供中文・英文翻譯支援。國際患者專屬團隊從預約到治療完成全程服務。細胞培養需至少提前6週預約。', 'zh-CN': '提供中文·英文翻译支援。国际患者专属团队从预约到治疗完成全程服务。细胞培养需至少提前6周预约。', en: 'Chinese and English translation support available. Dedicated international patient team provides full support from booking to treatment completion. Minimum 6 weeks advance booking required for cell cultivation.' } as Record<Language, string>,

  // History
  histTag: { ja: '沿革', 'zh-TW': '沿革', 'zh-CN': '沿革', en: 'History' } as Record<Language, string>,
  histTitle: { ja: 'ACメディカルグループの歩み', 'zh-TW': 'AC Medical Group的歷程', 'zh-CN': 'AC Medical Group的历程', en: 'AC Medical Group History' } as Record<Language, string>,
  hist2006: { ja: 'ACメディカルグループ設立。再生医療分野に参入', 'zh-TW': 'AC Medical Group成立。進入再生醫療領域', 'zh-CN': 'AC Medical Group成立。进入再生医疗领域', en: 'AC Medical Group founded. Entered regenerative medicine field' } as Record<Language, string>,
  hist2018: { ja: '累計患者数10,000名を突破', 'zh-TW': '累計患者數突破10,000名', 'zh-CN': '累计患者数突破10,000名', en: 'Surpassed 10,000 cumulative patients' } as Record<Language, string>,
  hist2020: { ja: '日本細胞ビルに移転。9階建て専用施設での運営開始', 'zh-TW': '搬遷至日本細胞大樓。開始在9層專用設施運營', 'zh-CN': '搬迁至日本细胞大楼。开始在9层专用设施运营', en: 'Relocated to Japan Cell Building. Operations began in 9-floor dedicated facility' } as Record<Language, string>,
  hist2024: { ja: '累計患者数30,000名突破。2024年大幅アップグレード完了', 'zh-TW': '累計患者數突破30,000名。2024年大幅升級完成', 'zh-CN': '累计患者数突破30,000名。2024年大幅升级完成', en: 'Surpassed 30,000 patients. Major 2024 facility upgrade completed' } as Record<Language, string>,

  // Conditions
  condTag: { ja: '対応疾患', 'zh-TW': '適應症', 'zh-CN': '适应症', en: 'Applicable Conditions' } as Record<Language, string>,
  condTitle: { ja: '幅広い疾患・症状に対応', 'zh-TW': '適用於多種疾病與症狀', 'zh-CN': '适用于多种疾病与症状', en: 'Wide Range of Conditions Treated' } as Record<Language, string>,

  // Access
  accessTag: { ja: 'アクセス', 'zh-TW': '交通指南', 'zh-CN': '交通指南', en: 'Access' } as Record<Language, string>,
  accessTitle: { ja: '大阪・日本細胞ビル', 'zh-TW': '大阪・日本細胞大樓', 'zh-CN': '大阪·日本细胞大楼', en: 'Osaka, Japan Cell Building' } as Record<Language, string>,
  address: { ja: '大阪府大阪市中央区北久宝寺町2丁目1-3 日本細胞ビル', 'zh-TW': '大阪府大阪市中央區北久寶寺町2丁目1-3 日本細胞大樓', 'zh-CN': '大阪府大阪市中央区北久宝寺町2丁目1-3 日本细胞大楼', en: '2-1-3 Kitakyuhojimachi, Chuo-ku, Osaka, Japan Cell Building' } as Record<Language, string>,
  hours: { ja: '10:00〜19:00（完全予約制）', 'zh-TW': '10:00〜19:00（完全預約制）', 'zh-CN': '10:00〜19:00（完全预约制）', en: '10:00-19:00 (Appointment only)' } as Record<Language, string>,
  closed: { ja: '不定休', 'zh-TW': '不定休', 'zh-CN': '不定休', en: 'Irregular holidays' } as Record<Language, string>,
  selfPay: { ja: '自由診療（保険適用外）', 'zh-TW': '自由診療（不適用保險）', 'zh-CN': '自由诊疗（不适用保险）', en: 'Self-pay only (not covered by insurance)' } as Record<Language, string>,

  // FAQ
  faqTag: { ja: 'よくある質問', 'zh-TW': '常見問題', 'zh-CN': '常见问题', en: 'FAQ' } as Record<Language, string>,
  faqTitle: { ja: 'よくいただくご質問', 'zh-TW': '常見問題', 'zh-CN': '常见问题', en: 'Frequently Asked Questions' } as Record<Language, string>,

  // CTA
  ctaTitle: { ja: 'まずは無料相談から', 'zh-TW': '從免費諮詢開始', 'zh-CN': '从免费咨询开始', en: 'Start with a Free Consultation' } as Record<Language, string>,
  ctaSub: { ja: '再生医療に関するご相談は、専門スタッフが丁寧にご対応いたします', 'zh-TW': '關於再生醫療的諮詢，由專業人員為您細心解答', 'zh-CN': '关于再生医疗的咨询，由专业人员为您细心解答', en: 'Our specialists will carefully guide you through your regenerative medicine options' } as Record<Language, string>,
  ctaChinese: { ja: '中国語対応可能', 'zh-TW': '支援中文服務', 'zh-CN': '支持中文服务', en: 'Chinese Support Available' } as Record<Language, string>,
  ctaBooking: { ja: '※ 細胞培養には最低6週間前の事前予約が必要です', 'zh-TW': '※ 細胞培養需至少提前6週預約', 'zh-CN': '※ 细胞培养需至少提前6周预约', en: '※ Minimum 6 weeks advance booking required for cell cultivation' } as Record<Language, string>,
};

// FAQ data
const faqData: { q: Record<Language, string>; a: Record<Language, string> }[] = [
  {
    q: { ja: 'なぜ日本の再生医療が選ばれるのですか？', 'zh-TW': '為什麼選擇日本的再生醫療？', 'zh-CN': '为什么选择日本的再生医疗？', en: 'Why choose Japan for regenerative medicine?' },
    a: { ja: '日本は再生医療分野で4,000件以上の臨床研究、3,600件以上の特許を保有し、世界で初めて再生医療に関する法律（再生医療等安全性確保法）を制定した国です。法的枠組みの整備により、安全かつ効果的な治療を受けることができます。', 'zh-TW': '日本在再生醫療領域擁有4,000多項臨床研究、3,600多項專利，是世界上第一個制定再生醫療法律（再生醫療等安全確保法）的國家。完善的法律框架確保您能接受安全有效的治療。', 'zh-CN': '日本在再生医疗领域拥有4,000多项临床研究、3,600多项专利，是世界上第一个制定再生医疗法律（再生医疗等安全确保法）的国家。完善的法律框架确保您能接受安全有效的治疗。', en: 'Japan has 4,000+ clinical studies, 3,600+ patents in regenerative medicine, and was the first country to enact a law specifically for regenerative medicine safety. This legal framework ensures safe and effective treatment.' },
  },
  {
    q: { ja: '治療前にどのような検査が必要ですか？', 'zh-TW': '治療前需要哪些檢查？', 'zh-CN': '治疗前需要哪些检查？', en: 'What tests are required before treatment?' },
    a: { ja: '血液検査、腫瘍マーカー、感染症スクリーニング（HIV、HBV、HCV、梅毒など）が必要です。国内外の医療機関での検査結果（3ヶ月以内）を事前にご提出いただきます。', 'zh-TW': '需要血液檢查、腫瘤標記物、感染症篩檢（HIV、HBV、HCV、梅毒等）。請事先提交國內外醫療機構的檢查結果（3個月以內）。', 'zh-CN': '需要血液检查、肿瘤标记物、感染症筛检（HIV、HBV、HCV、梅毒等）。请事先提交国内外医疗机构的检查结果（3个月以内）。', en: 'Blood tests, tumor markers, and infection screening (HIV, HBV, HCV, syphilis, etc.) are required. Please submit test results from medical institutions (within 3 months) in advance.' },
  },
  {
    q: { ja: 'がん患者も治療を受けられますか？', 'zh-TW': '癌症患者也能接受治療嗎？', 'zh-CN': '癌症患者也能接受治疗吗？', en: 'Can cancer patients receive treatment?' },
    a: { ja: '活動性のがん（進行中）は幹細胞療法の禁忌となります。ただし、安定期または寛解状態のがん患者様は、医師の判断により治療可能な場合があります。NK細胞療法はがん予防・再発予防にご利用いただけます。', 'zh-TW': '活動性癌症（進行中）是幹細胞療法的禁忌症。但處於穩定期或緩解狀態的癌症患者，經醫師判斷後可能可以接受治療。NK細胞療法可用於癌症預防和復發預防。', 'zh-CN': '活动性癌症（进行中）是干细胞疗法的禁忌症。但处于稳定期或缓解状态的癌症患者，经医师判断后可能可以接受治疗。NK细胞疗法可用于癌症预防和复发预防。', en: 'Active (progressing) cancer is a contraindication for stem cell therapy. However, patients in stable or remission status may qualify upon physician evaluation. NK cell therapy is available for cancer prevention and recurrence prevention.' },
  },
  {
    q: { ja: '脂肪採取はどのように行いますか？', 'zh-TW': '脂肪採取如何進行？', 'zh-CN': '脂肪采取如何进行？', en: 'How is fat extraction performed?' },
    a: { ja: '最新の1mmマイクロニードル技術を使用し、0.05MPaの超低圧で約10分間で採取します。傷跡は目立たず、日帰りで施術可能です。従来の方法に比べて痛みが大幅に軽減されています。', 'zh-TW': '使用最新的1mm微針技術，以0.05MPa超低壓在約10分鐘內完成採取。傷口不明顯，可當日完成手術。比傳統方法大幅減輕疼痛。', 'zh-CN': '使用最新的1mm微针技术，以0.05MPa超低压在约10分钟内完成采取。伤口不明显，可当日完成手术。比传统方法大幅减轻疼痛。', en: 'Using the latest 1mm microneedle technology at 0.05MPa ultra-low pressure, extraction takes about 10 minutes. Scars are minimal, and it\'s a same-day procedure with significantly reduced pain compared to traditional methods.' },
  },
  {
    q: { ja: '投与された細胞はどのくらい体内で作用しますか？', 'zh-TW': '投與的細胞在體內作用多久？', 'zh-CN': '投与的细胞在体内作用多久？', en: 'How long do administered cells work in the body?' },
    a: { ja: '投与後1〜3ヶ月で活性化期、3〜6ヶ月で修復期、6〜9ヶ月で若返り期と段階的に効果が現れます。個人差はありますが、多くの患者様が3ヶ月目頃から変化を実感されます。', 'zh-TW': '投與後1-3個月為活化期，3-6個月為修復期，6-9個月為年輕化期，效果分階段顯現。雖有個人差異，但多數患者在3個月左右開始感受到變化。', 'zh-CN': '投与后1-3个月为活化期，3-6个月为修复期，6-9个月为年轻化期，效果分阶段显现。虽有个人差异，但多数患者在3个月左右开始感受到变化。', en: 'Effects appear in stages: 1-3 months activation, 3-6 months repair, 6-9 months rejuvenation. While individual results vary, most patients notice changes around the 3-month mark.' },
  },
  {
    q: { ja: '治療頻度はどのくらいですか？', 'zh-TW': '治療頻率是多少？', 'zh-CN': '治疗频率是多少？', en: 'How often should I receive treatment?' },
    a: { ja: '個々の症状や目的に応じて、医師が最適な治療プランを策定します。初回治療後の経過を見ながら、追加治療の必要性を判断いたします。', 'zh-TW': '根據個人症狀和目的，醫師會制定最佳治療計劃。觀察初次治療後的進展，判斷是否需要追加治療。', 'zh-CN': '根据个人症状和目的，医师会制定最佳治疗计划。观察初次治疗后的进展，判断是否需要追加治疗。', en: 'Your physician will create a personalized treatment plan based on your symptoms and goals. Additional treatment needs are assessed based on progress after the initial treatment.' },
  },
  {
    q: { ja: '治療後の注意事項はありますか？', 'zh-TW': '治療後有什麼注意事項？', 'zh-CN': '治疗后有什么注意事项？', en: 'Are there post-treatment precautions?' },
    a: { ja: '治療後は十分な休息を取り、激しい運動は数日間お控えください。また、治療後1ヶ月間はワクチン接種をお避けください。日常生活は通常通りお過ごしいただけます。', 'zh-TW': '治療後請充分休息，數日內避免劇烈運動。治療後1個月內請避免接種疫苗。日常生活可正常進行。', 'zh-CN': '治疗后请充分休息，数日内避免剧烈运动。治疗后1个月内请避免接种疫苗。日常生活可正常进行。', en: 'Rest well after treatment and avoid strenuous activity for several days. Avoid vaccinations for 1 month after treatment. Daily activities can continue as normal.' },
  },
  {
    q: { ja: '予約はどのくらい前に必要ですか？', 'zh-TW': '需要提前多久預約？', 'zh-CN': '需要提前多久预约？', en: 'How far in advance should I book?' },
    a: { ja: '細胞培養に最低4〜6週間必要なため、治療の最低6週間前までにご予約ください。渡航準備も含めると、2〜3ヶ月前のご相談をお勧めいたします。', 'zh-TW': '由於細胞培養至少需要4-6週，請在治療前至少6週預約。考慮到出行準備，建議提前2-3個月諮詢。', 'zh-CN': '由于细胞培养至少需要4-6周，请在治疗前至少6周预约。考虑到出行准备，建议提前2-3个月咨询。', en: 'Cell cultivation requires a minimum of 4-6 weeks, so please book at least 6 weeks before treatment. We recommend consulting 2-3 months in advance to allow for travel preparations.' },
  },
  {
    q: { ja: '保険は適用されますか？', 'zh-TW': '可以使用保險嗎？', 'zh-CN': '可以使用保险吗？', en: 'Is insurance applicable?' },
    a: { ja: '当クリニックの再生医療はすべて自由診療（保険適用外）となります。治療費用については、初回カウンセリング時に詳しくご案内いたします。', 'zh-TW': '本診所的再生醫療全部為自由診療（不適用保險）。治療費用將在初次諮詢時詳細說明。', 'zh-CN': '本诊所的再生医疗全部为自由诊疗（不适用保险）。治疗费用将在初次咨询时详细说明。', en: 'All regenerative medicine treatments at our clinic are self-pay (not covered by insurance). Treatment costs will be explained in detail during your initial consultation.' },
  },
];

// Building floors
const floors: { floor: string; label: Record<Language, string>; icon: React.ReactNode }[] = [
  { floor: '9F', label: { ja: '本部オフィス', 'zh-TW': '總部辦公室', 'zh-CN': '总部办公室', en: 'Headquarters' }, icon: <Building2 size={16} /> },
  { floor: '8F', label: { ja: '会議室', 'zh-TW': '會議室', 'zh-CN': '会议室', en: 'Conference Room' }, icon: <Users size={16} /> },
  { floor: '7F', label: { ja: 'CPC（ISO Class 5）', 'zh-TW': 'CPC（ISO Class 5）', 'zh-CN': 'CPC（ISO Class 5）', en: 'CPC (ISO Class 5)' }, icon: <Microscope size={16} /> },
  { floor: '6F', label: { ja: '管理部門', 'zh-TW': '行政管理', 'zh-CN': '行政管理', en: 'Administration' }, icon: <Building size={16} /> },
  { floor: '5F', label: { ja: '受付・カウンセリング', 'zh-TW': '接待・諮詢', 'zh-CN': '接待·咨询', en: 'Reception & Counseling' }, icon: <Stethoscope size={16} /> },
  { floor: '4F', label: { ja: '治療室', 'zh-TW': '治療室', 'zh-CN': '治疗室', en: 'Treatment Rooms' }, icon: <Syringe size={16} /> },
  { floor: '3F', label: { ja: 'VIPルーム', 'zh-TW': 'VIP室', 'zh-CN': 'VIP室', en: 'VIP Rooms' }, icon: <Star size={16} /> },
  { floor: '2F', label: { ja: 'ピラティススタジオ', 'zh-TW': '皮拉提斯教室', 'zh-CN': '普拉提工作室', en: 'Pilates Studio' }, icon: <Activity size={16} /> },
  { floor: '1F', label: { ja: 'コーヒーショップ', 'zh-TW': '咖啡廳', 'zh-CN': '咖啡厅', en: 'Coffee Shop' }, icon: <Leaf size={16} /> },
];

// Conditions tags
const conditionTags: Record<Language, string[]> = {
  ja: ['糖尿病', '高血圧', '脂質異常症', 'アルツハイマー', 'パーキンソン病', '脳卒中後遺症', '心筋梗塞', '動脈硬化', '肝硬変', '慢性肝炎', 'COPD', '間質性肺炎', 'リウマチ', 'SLE', '変形性関節症', '腰痛', 'がん予防', '再発予防', 'アンチエイジング', '薄毛・AGA', 'ED', 'アトピー', '慢性疲労'],
  'zh-TW': ['糖尿病', '高血壓', '血脂異常', '阿茲海默症', '帕金森氏症', '腦中風後遺症', '心肌梗塞', '動脈硬化', '肝硬化', '慢性肝炎', 'COPD', '間質性肺炎', '類風濕', 'SLE', '退化性關節炎', '腰痛', '癌症預防', '復發預防', '抗衰老', '落髮・AGA', 'ED', '異位性皮膚炎', '慢性疲勞'],
  'zh-CN': ['糖尿病', '高血压', '血脂异常', '阿尔茨海默症', '帕金森病', '脑卒中后遗症', '心肌梗塞', '动脉硬化', '肝硬化', '慢性肝炎', 'COPD', '间质性肺炎', '类风湿', 'SLE', '退行性关节炎', '腰痛', '癌症预防', '复发预防', '抗衰老', '脱发·AGA', 'ED', '特应性皮炎', '慢性疲劳'],
  en: ['Diabetes', 'Hypertension', 'Dyslipidemia', "Alzheimer's", "Parkinson's", 'Post-stroke', 'Heart attack', 'Arteriosclerosis', 'Liver cirrhosis', 'Chronic hepatitis', 'COPD', 'Interstitial pneumonia', 'Rheumatism', 'SLE', 'Osteoarthritis', 'Back pain', 'Cancer prevention', 'Recurrence prevention', 'Anti-aging', 'Hair loss/AGA', 'ED', 'Atopic dermatitis', 'Chronic fatigue'],
};

// Clinical application areas for stem cell
const clinicalAreas: { icon: React.ReactNode; label: Record<Language, string> }[] = [
  { icon: <Thermometer size={18} />, label: { ja: '代謝疾患', 'zh-TW': '代謝疾病', 'zh-CN': '代谢疾病', en: 'Metabolic' } },
  { icon: <Brain size={18} />, label: { ja: '神経疾患', 'zh-TW': '神經疾病', 'zh-CN': '神经疾病', en: 'Neurological' } },
  { icon: <Heart size={18} />, label: { ja: '心血管', 'zh-TW': '心血管', 'zh-CN': '心血管', en: 'Cardiovascular' } },
  { icon: <Stethoscope size={18} />, label: { ja: '消化器', 'zh-TW': '消化系統', 'zh-CN': '消化系统', en: 'Digestive' } },
  { icon: <Activity size={18} />, label: { ja: '呼吸器', 'zh-TW': '呼吸系統', 'zh-CN': '呼吸系统', en: 'Respiratory' } },
  { icon: <Shield size={18} />, label: { ja: '免疫', 'zh-TW': '免疫', 'zh-CN': '免疫', en: 'Immune' } },
  { icon: <Bone size={18} />, label: { ja: '運動器', 'zh-TW': '運動系統', 'zh-CN': '运动系统', en: 'Musculoskeletal' } },
];

// Treatment cards
const treatments = [
  { key: 'sc', img: IMG.stemCard, name: t.sc_name, desc: t.sc_desc, icon: <Dna size={22} /> },
  { key: 'nk', img: IMG.nkCard, name: t.nk_name, desc: t.nk_desc, icon: <ShieldCheck size={22} /> },
  { key: 'sn', img: IMG.supernatantCard, name: t.sn_name, desc: t.sn_desc, icon: <Droplets size={22} /> },
  { key: 'acrs', img: IMG.acrsCard, name: t.acrs_name, desc: t.acrs_desc, icon: <FlaskConical size={22} /> },
  { key: 'bp', img: IMG.bloodPurify, name: t.bp_name, desc: t.bp_desc, icon: <Beaker size={22} /> },
];

// ======================================
// Component
// ======================================
interface ACPlusContentProps {
  isGuideEmbed?: boolean;
  guideSlug?: string;
}

export default function ACPlusContent({ isGuideEmbed, guideSlug }: ACPlusContentProps) {
  const lang = useLanguage();
  const [expandedTreat, setExpandedTreat] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const checkoutHref = (path: string) => {
    if (isGuideEmbed) return '#consultation';
    return guideSlug ? `${path}?guide=${guideSlug}` : path;
  };

  // Expanded treatment detail content
  const treatDetail = (key: string) => {
    switch (key) {
      case 'sc': return (
        <div className="space-y-3 text-sm text-[#444]">
          <p><span className="font-semibold text-[#333]">{lang === 'ja' ? '適応分野: ' : lang === 'en' ? 'Applications: ' : '适应领域: '}</span>{t.sc_apps[lang]}</p>
          <p><span className="font-semibold text-[#333]">{lang === 'ja' ? 'プロセス: ' : lang === 'en' ? 'Process: ' : '流程: '}</span>{t.sc_process[lang]}</p>
          <p><span className="font-semibold text-[#333]">{lang === 'ja' ? '保存: ' : lang === 'en' ? 'Storage: ' : '保存: '}</span>{t.sc_preserve[lang]}</p>
        </div>
      );
      case 'nk': return (
        <div className="space-y-3 text-sm text-[#444]">
          <p><span className="font-semibold text-[#333]">{lang === 'ja' ? '対象: ' : lang === 'en' ? 'Targets: ' : '对象: '}</span>{t.nk_targets[lang]}</p>
          <p><span className="font-semibold text-[#333]">{lang === 'ja' ? 'プロセス: ' : lang === 'en' ? 'Process: ' : '流程: '}</span>{t.nk_process[lang]}</p>
        </div>
      );
      case 'sn': return (
        <div className="space-y-3 text-sm text-[#444]">
          <p><span className="font-semibold text-[#333]">{lang === 'ja' ? '適応: ' : lang === 'en' ? 'Applications: ' : '适应: '}</span>{t.sn_apps[lang]}</p>
          <p><span className="font-semibold text-[#333]">{lang === 'ja' ? '投与方法: ' : lang === 'en' ? 'Administration: ' : '投与方法: '}</span>{t.sn_admin[lang]}</p>
        </div>
      );
      case 'acrs': return (
        <div className="space-y-3 text-sm text-[#444]">
          <p><span className="font-semibold text-[#333]">{lang === 'ja' ? '適応: ' : lang === 'en' ? 'Applications: ' : '适应: '}</span>{t.acrs_apps[lang]}</p>
          <p><span className="font-semibold text-[#333]">{lang === 'ja' ? 'プロセス: ' : lang === 'en' ? 'Process: ' : '流程: '}</span>{t.acrs_process[lang]}</p>
        </div>
      );
      case 'bp': return null;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#333]">

      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        <img src={IMG.hero1} alt="AC Cell Clinic" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t.heroTitle[lang]}
            </h1>
            <p className="text-lg md:text-xl text-white/85 whitespace-pre-line mb-8 leading-relaxed">
              {t.heroSub[lang]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={checkoutHref('/ac-plus/initial-consultation')}
                className="inline-flex items-center justify-center gap-2 bg-[#4874cb] text-white px-8 py-4 rounded-full font-bold hover:bg-[#3a63b8] transition-all shadow-lg hover:shadow-xl"
              >
                {t.ctaConsult[lang]} <ArrowRight size={18} />
              </Link>
              <a
                href="#treatments"
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white px-8 py-4 rounded-full font-bold hover:bg-white/25 transition-all border border-white/30 backdrop-blur-sm"
              >
                {t.ctaLearn[lang]}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. STATS BAR ===== */}
      <section className="bg-[#4874cb] py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: '30,000+', label: t.stat1[lang], icon: <Users size={20} /> },
            { val: '18', label: t.stat2[lang], icon: <Star size={20} /> },
            { val: '19', label: t.stat3[lang], icon: <Heart size={20} /> },
            { val: 'ISO 5', label: t.stat4[lang], icon: <Shield size={20} /> },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="opacity-80">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-bold">{s.val}</div>
              <div className="text-sm text-white/80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 3. CLINIC INTRODUCTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.introTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-2">{t.introTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <p className="text-[#555] leading-relaxed">{t.introP1[lang]}</p>
              <p className="text-[#555] leading-relaxed">{t.introP2[lang]}</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="flex items-center gap-2 bg-[#f6f6f6] rounded-lg px-4 py-3">
                  <GraduationCap size={18} className="text-[#4874cb]" />
                  <span className="text-sm font-medium">{t.partnerKyoto[lang]}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#f6f6f6] rounded-lg px-4 py-3">
                  <Building2 size={18} className="text-[#4874cb]" />
                  <span className="text-sm font-medium">{t.partnerOsaka[lang]}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src={IMG.exterior} alt="Japan Cell Building" className="rounded-xl shadow-md w-full h-48 object-cover" />
              <img src={IMG.hero2} alt="AC Cell Clinic interior" className="rounded-xl shadow-md w-full h-48 object-cover" />
              <img src={IMG.facility1} alt="Clinic facility" className="rounded-xl shadow-md w-full h-48 object-cover col-span-2" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. TREATMENT CARDS ===== */}
      <section id="treatments" className="py-20 bg-[#f6f6f6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.treatTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.treatTitle[lang]}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((tr) => {
              const isOpen = expandedTreat === tr.key;
              return (
                <div
                  key={tr.key}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col"
                  style={{ borderTopColor: '#4874cb', borderTopWidth: 3 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={tr.img} alt={tr.name[lang]} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 text-[#4874cb]">
                      {tr.icon}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-[#333] mb-2">{tr.name[lang]}</h3>
                    <p className="text-sm text-[#666] mb-4 flex-1">{tr.desc[lang]}</p>
                    {treatDetail(tr.key) && (
                      <>
                        {isOpen && <div className="mb-4 pt-3 border-t border-gray-100">{treatDetail(tr.key)}</div>}
                        <button
                          onClick={() => setExpandedTreat(isOpen ? null : tr.key)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#4874cb] transition-colors"
                        >
                          {isOpen ? t.hideDetail[lang] : t.viewDetail[lang]}
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 5. STEM CELL DEEP DIVE ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.scDeepTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.scDeepTitle[lang]}</h2>
          </div>

          {/* 3 Properties */}
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              { title: t.prop1, desc: t.prop1d, icon: <Dna size={28} className="text-[#4874cb]" /> },
              { title: t.prop2, desc: t.prop2d, icon: <Sparkles size={28} className="text-[#4874cb]" /> },
              { title: t.prop3, desc: t.prop3d, icon: <Zap size={28} className="text-[#4874cb]" /> },
            ].map((p, i) => (
              <div key={i} className="bg-[#4874cb]/5 rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold text-[#333] mb-2">{p.title[lang]}</h3>
                <p className="text-sm text-[#666]">{p.desc[lang]}</p>
              </div>
            ))}
          </div>

          {/* Clinical Applications Grid */}
          <div className="mb-14">
            <h3 className="text-xl font-bold text-[#333] text-center mb-6">{t.clinicalApps[lang]}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {clinicalAreas.map((area, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#f6f6f6] rounded-full px-5 py-2.5 text-sm font-medium text-[#444]">
                  <span className="text-[#4874cb]">{area.icon}</span>
                  {area.label[lang]}
                </div>
              ))}
            </div>
          </div>

          {/* Process Diagram */}
          <div className="bg-[#f6f6f6] rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#333] text-center mb-8">{t.processTitle[lang]}</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {[
                { icon: <Eye size={24} />, label: { ja: '診断', 'zh-TW': '診斷', 'zh-CN': '诊断', en: 'Diagnosis' } as Record<Language, string> },
                { icon: <Syringe size={24} />, label: { ja: '脂肪採取\n(2mm, 20-30ml)', 'zh-TW': '脂肪採取\n(2mm, 20-30ml)', 'zh-CN': '脂肪采取\n(2mm, 20-30ml)', en: 'Fat Extraction\n(2mm, 20-30ml)' } as Record<Language, string> },
                { icon: <Microscope size={24} />, label: { ja: '4週間培養\n(約1億個)', 'zh-TW': '4週培養\n(約1億個)', 'zh-CN': '4周培养\n(约1亿个)', en: '4-Week Culture\n(~100M cells)' } as Record<Language, string> },
                { icon: <Droplets size={24} />, label: { ja: '投与', 'zh-TW': '投與', 'zh-CN': '投与', en: 'Administration' } as Record<Language, string> },
              ].map((step, i, arr) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center text-center w-36">
                    <div className="w-14 h-14 rounded-full bg-[#4874cb] text-white flex items-center justify-center mb-3">
                      {step.icon}
                    </div>
                    <span className="text-sm font-medium text-[#333] whitespace-pre-line">{step.label[lang]}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight size={20} className="text-[#4874cb] hidden md:block flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-6 text-center">
              <img src={IMG.stemDiagram} alt="Stem cell diagram" className="mx-auto rounded-xl max-h-64 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. CPC SECTION ===== */}
      <section className="py-20 bg-[#f6f6f6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.cpcTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.cpcTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <p className="text-[#555] leading-relaxed">{t.cpcDesc[lang]}</p>
            <div className="grid grid-cols-3 gap-3">
              <img src={IMG.cpc1} alt="CPC cleanroom" className="rounded-xl w-full h-32 object-cover shadow-sm" />
              <img src={IMG.cpc2} alt="CPC equipment" className="rounded-xl w-full h-32 object-cover shadow-sm" />
              <img src={IMG.cpc3} alt="CPC monitoring" className="rounded-xl w-full h-32 object-cover shadow-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. 9-FLOOR BUILDING ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.bldgTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-2">{t.bldgTitle[lang]}</h2>
            <p className="text-[#666]">{t.bldgSub[lang]}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-0">
              {floors.map((f, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-3.5 border-l-4 transition-colors ${
                    f.floor === '7F'
                      ? 'border-l-[#4874cb] bg-[#4874cb]/5'
                      : f.floor === '3F'
                      ? 'border-l-[#4874cb]/50 bg-[#4874cb]/5'
                      : 'border-l-gray-200 hover:bg-[#f6f6f6]'
                  }`}
                >
                  <span className="text-lg font-bold text-[#4874cb] w-10 flex-shrink-0">{f.floor}</span>
                  <span className="text-[#4874cb]">{f.icon}</span>
                  <span className="text-sm font-medium text-[#333]">{f.label[lang]}</span>
                  {f.floor === '7F' && (
                    <span className="ml-auto text-xs bg-[#4874cb] text-white px-2 py-0.5 rounded-full">
                      {lang === 'ja' ? 'クリーンルーム' : lang === 'en' ? 'Cleanroom' : '洁净室'}
                    </span>
                  )}
                  {f.floor === '3F' && (
                    <span className="ml-auto text-xs bg-[#4874cb]/70 text-white px-2 py-0.5 rounded-full">VIP</span>
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <img src={IMG.hero2} alt="Clinic environment" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
              <img src={IMG.facility2} alt="Clinic interior" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 8. CLINIC FEATURES ===== */}
      <section className="py-20 bg-[#f6f6f6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.featTag[lang]}
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t.feat1Title, desc: t.feat1Desc, img: IMG.researchTeam, icon: <GraduationCap size={24} /> },
              { title: t.feat2Title, desc: t.feat2Desc, img: IMG.safety, icon: <ShieldCheck size={24} /> },
              { title: t.feat3Title, desc: t.feat3Desc, img: IMG.international, icon: <Globe size={24} /> },
            ].map((feat, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img src={feat.img} alt={feat.title[lang]} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-[#4874cb] text-white rounded-full p-2.5">
                    {feat.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#333] mb-3">{feat.title[lang]}</h3>
                  <p className="text-sm text-[#666] leading-relaxed">{feat.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. HISTORY TIMELINE ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.histTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.histTitle[lang]}</h2>
          </div>
          <div className="relative pl-8 border-l-2 border-[#4874cb]/30 space-y-10">
            {[
              { year: '2006', text: t.hist2006 },
              { year: '2018', text: t.hist2018 },
              { year: '2020', text: t.hist2020 },
              { year: '2024', text: t.hist2024 },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] top-0 w-5 h-5 bg-[#4874cb] rounded-full border-4 border-white shadow" />
                <div className="bg-[#f6f6f6] rounded-xl p-5">
                  <span className="text-sm font-bold text-[#4874cb]">{item.year}</span>
                  <p className="text-[#555] mt-1">{item.text[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10. APPLICABLE CONDITIONS ===== */}
      <section className="py-20 bg-[#f6f6f6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.condTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.condTitle[lang]}</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {conditionTags[lang].map((tag, i) => (
              <span key={i} className="bg-white text-[#444] text-sm px-4 py-2 rounded-full border border-gray-200 hover:border-[#4874cb] hover:text-[#4874cb] transition-colors cursor-default shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 11. ACCESS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.accessTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.accessTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#4874cb] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-[#333]">{t.address[lang]}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[#4874cb] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-[#333]">{t.hours[lang]}</p>
                  <p className="text-sm text-[#666]">{t.closed[lang]}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-[#4874cb] mt-1 flex-shrink-0" />
                <p className="text-sm text-[#666]">{t.selfPay[lang]}</p>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={20} className="text-[#4874cb] mt-1 flex-shrink-0" />
                <p className="text-sm text-[#666]">{t.ctaChinese[lang]}</p>
              </div>
            </div>
            <img src={IMG.mapLocation} alt="Map to AC Cell Clinic" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
          </div>
        </div>
      </section>

      {/* ===== 12. FAQ ===== */}
      <section className="py-20 bg-[#f6f6f6]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#4874cb]/10 text-[#4874cb] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              <HelpCircle size={14} className="inline mr-1 -mt-0.5" />{t.faqTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.faqTitle[lang]}</h2>
          </div>
          <div className="space-y-3">
            {faqData.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-[#333] text-sm md:text-base">{faq.q[lang]}</span>
                    {isOpen ? <ChevronUp size={18} className="text-[#4874cb] flex-shrink-0" /> : <ChevronDown size={18} className="text-[#999] flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-[#555] leading-relaxed border-t border-gray-50 pt-3">
                      {faq.a[lang]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 13. CONSULTATION CTA (standalone only) ===== */}
      {!isGuideEmbed && (
      <section id="consultation" className="py-20 bg-[#f6f6f6]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img src={IMG.logo} alt="AC Cell Clinic" className="h-14 mx-auto mb-6 object-contain" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-4">{t.ctaTitle[lang]}</h2>
          <p className="text-lg text-[#555] mb-3">{t.ctaSub[lang]}</p>
          <div className="inline-flex items-center gap-2 bg-[#4874cb]/10 text-[#4874cb] rounded-full px-4 py-1.5 text-sm mb-4">
            <Globe size={14} />
            {t.ctaChinese[lang]}
          </div>
          <p className="text-xs text-[#666] mb-8">{t.ctaBooking[lang]}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={checkoutHref('/ac-plus/initial-consultation')}
              className="inline-flex items-center justify-center gap-3 bg-[#4874cb] text-white px-8 py-4 rounded-full font-bold hover:bg-[#3a63b8] transition-all shadow-lg"
            >
              {t.ctaConsult[lang]} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ===== 14. LEGAL FOOTER ===== */}
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
