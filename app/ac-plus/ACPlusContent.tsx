'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, Train,
  Award, Shield, Heart, Brain,
  Syringe, Microscope, Sparkles, CheckCircle,
  ArrowRight, Globe,
  Dna, FlaskConical, Beaker, ShieldCheck, Droplets,
  GraduationCap, Building2,
  Zap, Leaf, Users, Star,
  Activity, Lock, ChevronDown, ChevronUp,
  Stethoscope, CircleDot, Layers,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// ======================================
// Hero 图片（白标首图映射用）
// ======================================
export const AC_PLUS_HERO_IMAGE = 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2000&auto=format&fit=crop';

// ======================================
// 多语言翻译
// ======================================
const t = {
  // Hero
  heroTagline: {
    ja: '再生医療の総合メディカルグループ',
    'zh-TW': '再生醫療綜合醫療集團',
    'zh-CN': '再生医疗综合医疗集团',
    en: 'Comprehensive Regenerative Medicine Group',
  } as Record<Language, string>,
  heroTitle: {
    ja: 'ACセルクリニック',
    'zh-TW': 'AC Cell Clinic',
    'zh-CN': 'AC Cell Clinic',
    en: 'AC Cell Clinic',
  } as Record<Language, string>,
  heroSubtitle: {
    ja: 'AC International Medical Group',
    'zh-TW': 'AC International Medical Group',
    'zh-CN': 'AC International Medical Group',
    en: 'AC International Medical Group',
  } as Record<Language, string>,
  heroText: {
    ja: '18年の歴史、30,000名以上の治療実績、98%以上の満足度。\n京都大学再生医科学研究所・大阪大学医学部と提携し、\n大阪の9階建て専用ビルにISO Class 5 CPCクリーンルームを完備。\n厚生労働省認可の再生医療等提供計画に基づく治療を提供。',
    'zh-TW': '18年歷史，30,000名以上治療實績，98%以上滿意度。\n與京都大學再生醫科學研究所、大阪大學醫學部合作，\n大阪9層專用大樓配備ISO Class 5 CPC無塵室。\n基於厚生勞動省認可的再生醫療計劃提供治療。',
    'zh-CN': '18年历史，30,000名以上治疗实绩，98%以上满意度。\n与京都大学再生医科学研究所、大阪大学医学部合作，\n大阪9层专用大楼配备ISO Class 5 CPC洁净室。\n基于厚生劳动省认可的再生医疗计划提供治疗。',
    en: '18 years of history, 30,000+ patients treated, 98%+ satisfaction.\nPartnered with Kyoto University Institute for Frontier Life and Medical Sciences\nand Osaka University School of Medicine.\n9-floor dedicated building with ISO Class 5 CPC cleanroom in Osaka.',
  } as Record<Language, string>,
  heroBadge: {
    ja: '京都大学・大阪大学提携',
    'zh-TW': '京都大學・大阪大學合作',
    'zh-CN': '京都大学·大阪大学合作',
    en: 'Kyoto & Osaka University Partnership',
  } as Record<Language, string>,

  // Stats
  statsTag: {
    ja: 'クリニックの実力',
    'zh-TW': '診所實力',
    'zh-CN': '诊所实力',
    en: 'Clinic Strength',
  } as Record<Language, string>,
  statsTitle: {
    ja: '数字で見るACセルクリニック',
    'zh-TW': '數字看AC Cell Clinic',
    'zh-CN': '数字看AC Cell Clinic',
    en: 'AC Cell Clinic by the Numbers',
  } as Record<Language, string>,

  // Core Services
  servicesTag: {
    ja: '5つの柱',
    'zh-TW': '五大核心',
    'zh-CN': '五大核心',
    en: 'Five Pillars',
  } as Record<Language, string>,
  servicesTitle: {
    ja: '5つの再生医療コアサービス',
    'zh-TW': '5大再生醫療核心服務',
    'zh-CN': '5大再生医疗核心服务',
    en: '5 Core Regenerative Medicine Services',
  } as Record<Language, string>,

  // Stem Cell Deep-Dive
  stemCellTag: {
    ja: '主力治療',
    'zh-TW': '主力治療',
    'zh-CN': '主力治疗',
    en: 'Flagship Treatment',
  } as Record<Language, string>,
  stemCellTitle: {
    ja: '自家脂肪由来幹細胞治療の詳細',
    'zh-TW': '自體脂肪來源幹細胞治療詳解',
    'zh-CN': '自体脂肪来源干细胞治疗详解',
    en: 'Autologous Adipose-Derived Stem Cell Therapy in Detail',
  } as Record<Language, string>,
  stemCellDesc: {
    ja: '患者自身の脂肪組織から幹細胞を採取し、4週間かけて約1億個まで培養。局所麻酔下で20-30mlの脂肪を採取し、GMP準拠の施設で厳格な品質管理のもと培養します。投与後は-196°Cで凍結保存し、90%以上の回収率で将来の治療にも対応可能です。',
    'zh-TW': '從患者自身的脂肪組織中採取幹細胞，歷時4週培養至約1億個。在局部麻醉下採取20-30ml脂肪，於GMP合規設施中進行嚴格品質管控培養。投藥後以-196°C凍存，回收率90%以上，可用於未來治療。',
    'zh-CN': '从患者自身的脂肪组织中采取干细胞，历时4周培养至约1亿个。在局部麻醉下采取20-30ml脂肪，于GMP合规设施中进行严格品质管控培养。给药后以-196°C冻存，回收率90%以上，可用于未来治疗。',
    en: 'Stem cells are harvested from the patient\'s own adipose tissue and cultured over 4 weeks to approximately 100 million cells. 20-30ml of fat is collected under local anesthesia and cultured under strict quality control in GMP-compliant facilities. Post-administration, cells are cryopreserved at -196°C with 90%+ recovery rate for future treatments.',
  } as Record<Language, string>,
  stemCellIndications: {
    ja: '適応症：糖尿病、神経疾患、心血管疾患、自己免疫疾患、筋骨格疾患など',
    'zh-TW': '適應症：糖尿病、神經疾患、心血管疾患、自體免疫疾患、肌肉骨骼疾患等',
    'zh-CN': '适应症：糖尿病、神经疾患、心血管疾患、自身免疫疾患、肌肉骨骼疾患等',
    en: 'Indications: Diabetes, neurological, cardiovascular, autoimmune, and musculoskeletal conditions',
  } as Record<Language, string>,

  // Stem Cell Procedure Steps
  stepAssessment: {
    ja: '初回カウンセリング・適性評価',
    'zh-TW': '初次諮詢・適性評估',
    'zh-CN': '初次咨询·适性评估',
    en: 'Initial Consultation & Assessment',
  } as Record<Language, string>,
  stepAssessmentDesc: {
    ja: '医師による問診・検査を行い、治療計画を策定します',
    'zh-TW': '由醫師進行問診・檢查，制定治療計劃',
    'zh-CN': '由医师进行问诊·检查，制定治疗计划',
    en: 'Doctor performs consultation and examination to develop treatment plan',
  } as Record<Language, string>,
  stepExtract: {
    ja: '脂肪採取（局所麻酔・約30分）',
    'zh-TW': '脂肪採取（局部麻醉・約30分鐘）',
    'zh-CN': '脂肪采取（局部麻醉·约30分钟）',
    en: 'Fat Extraction (Local Anesthesia, ~30 min)',
  } as Record<Language, string>,
  stepExtractDesc: {
    ja: '20-30mlの脂肪組織を局所麻酔下で安全に採取',
    'zh-TW': '在局部麻醉下安全採取20-30ml脂肪組織',
    'zh-CN': '在局部麻醉下安全采取20-30ml脂肪组织',
    en: 'Safely harvest 20-30ml of adipose tissue under local anesthesia',
  } as Record<Language, string>,
  stepCulture: {
    ja: '4週間の細胞培養（約1億個）',
    'zh-TW': '4週細胞培養（約1億個）',
    'zh-CN': '4周细胞培养（约1亿个）',
    en: '4-Week Cell Culture (~100M Cells)',
  } as Record<Language, string>,
  stepCultureDesc: {
    ja: 'ISO Class 5 CPCクリーンルームで厳格な品質管理のもと培養',
    'zh-TW': '在ISO Class 5 CPC無塵室中嚴格品質管控培養',
    'zh-CN': '在ISO Class 5 CPC洁净室中严格品质管控培养',
    en: 'Cultured in ISO Class 5 CPC cleanroom under strict quality control',
  } as Record<Language, string>,
  stepAdminister: {
    ja: '幹細胞投与・凍結保存',
    'zh-TW': '幹細胞給藥・凍結保存',
    'zh-CN': '干细胞给药·冻结保存',
    en: 'Cell Administration & Cryopreservation',
  } as Record<Language, string>,
  stepAdministerDesc: {
    ja: '静脈投与または局所注射で投与。余剰細胞は-196°Cで凍結保存',
    'zh-TW': '透過靜脈輸注或局部注射給藥。剩餘細胞以-196°C凍存',
    'zh-CN': '通过静脉输注或局部注射给药。剩余细胞以-196°C冻存',
    en: 'Administered via IV or local injection. Remaining cells cryopreserved at -196°C',
  } as Record<Language, string>,

  // NK Cell Section
  nkTag: {
    ja: 'がん免疫療法',
    'zh-TW': '癌症免疫療法',
    'zh-CN': '癌症免疫疗法',
    en: 'Cancer Immunotherapy',
  } as Record<Language, string>,
  nkTitle: {
    ja: 'NK細胞療法 — 自然免疫でがんに立ち向かう',
    'zh-TW': 'NK細胞療法 — 以自然免疫對抗癌症',
    'zh-CN': 'NK细胞疗法 — 以自然免疫对抗癌症',
    en: 'NK Cell Therapy — Fighting Cancer with Natural Immunity',
  } as Record<Language, string>,
  nkDesc: {
    ja: 'NK（ナチュラルキラー）細胞は、がん細胞を直接攻撃する自然免疫の主役です。T細胞療法と比較して、NK細胞はMHC非拘束性のため幅広いがん種に対応可能。採血から培養、静脈投与までのシンプルなプロセスで、がんの予防・再発防止に効果を発揮します。',
    'zh-TW': 'NK（自然殺手）細胞是直接攻擊癌細胞的自然免疫主力。與T細胞療法相比，NK細胞因不受MHC限制，可應對更廣泛的癌症類型。從採血到培養、靜脈輸注的簡單流程，有效預防癌症及防止復發。',
    'zh-CN': 'NK（自然杀手）细胞是直接攻击癌细胞的自然免疫主力。与T细胞疗法相比，NK细胞因不受MHC限制，可应对更广泛的癌症类型。从采血到培养、静脉输注的简单流程，有效预防癌症及防止复发。',
    en: 'NK (Natural Killer) cells are the frontline of innate immunity that directly attack cancer cells. Compared to T-cell therapy, NK cells are MHC-unrestricted, enabling broad applicability across cancer types. A simple process from blood draw to culture to IV infusion effectively prevents cancer and recurrence.',
  } as Record<Language, string>,
  nkProcess1: {
    ja: '採血（少量の血液サンプル）',
    'zh-TW': '採血（少量血液樣本）',
    'zh-CN': '采血（少量血液样本）',
    en: 'Blood Draw (Small Sample)',
  } as Record<Language, string>,
  nkProcess2: {
    ja: 'NK細胞の分離・培養',
    'zh-TW': 'NK細胞分離・培養',
    'zh-CN': 'NK细胞分离·培养',
    en: 'NK Cell Isolation & Culture',
  } as Record<Language, string>,
  nkProcess3: {
    ja: '静脈点滴で投与',
    'zh-TW': '靜脈點滴給藥',
    'zh-CN': '静脉点滴给药',
    en: 'IV Infusion Administration',
  } as Record<Language, string>,

  // ACRS & Supernatant Section
  acrsTag: {
    ja: '次世代再生治療',
    'zh-TW': '次世代再生治療',
    'zh-CN': '次世代再生治疗',
    en: 'Next-Gen Regenerative Therapy',
  } as Record<Language, string>,
  acrsTitle: {
    ja: 'ACRS療法 & 幹細胞培養上清液',
    'zh-TW': 'ACRS療法 & 幹細胞培養上清液',
    'zh-CN': 'ACRS疗法 & 干细胞培养上清液',
    en: 'ACRS Therapy & Stem Cell Culture Supernatant',
  } as Record<Language, string>,
  acrsSubTitle: {
    ja: 'ACRS療法 — PRPの進化系',
    'zh-TW': 'ACRS療法 — PRP的進化版',
    'zh-CN': 'ACRS疗法 — PRP的进化版',
    en: 'ACRS Therapy — Evolution of PRP',
  } as Record<Language, string>,
  acrsDesc: {
    ja: '従来のPRP療法の15倍の効果を持つACRS療法は、自己血液を3時間培養し、IL-1raやIL-4raなどの抗炎症性サイトカインを高濃度に含む血清を生成。関節痛、スポーツ外傷、発毛促進、肌若返りなど幅広い適応症に対応します。',
    'zh-TW': '比傳統PRP療法效果高15倍的ACRS療法，將自體血液培養3小時，生成含高濃度IL-1ra和IL-4ra等抗炎性細胞因子的血清。適用於關節痛、運動損傷、促進生髮、皮膚年輕化等廣泛適應症。',
    'zh-CN': '比传统PRP疗法效果高15倍的ACRS疗法，将自体血液培养3小时，生成含高浓度IL-1ra和IL-4ra等抗炎性细胞因子的血清。适用于关节痛、运动损伤、促进生发、皮肤年轻化等广泛适应症。',
    en: 'ACRS therapy is 15x more effective than traditional PRP. By cultivating autologous blood for 3 hours, it produces serum rich in anti-inflammatory cytokines including IL-1ra and IL-4ra. Applicable to joint pain, sports injuries, hair growth promotion, and skin rejuvenation.',
  } as Record<Language, string>,
  supernatantSubTitle: {
    ja: '幹細胞培養上清液',
    'zh-TW': '幹細胞培養上清液',
    'zh-CN': '干细胞培养上清液',
    en: 'Stem Cell Culture Supernatant',
  } as Record<Language, string>,
  supernatantDesc: {
    ja: '1mlあたり1,000種以上の生理活性物質を含む培養上清液。成長因子、サイトカイン、エクソソームなどが豊富に含まれ、静脈投与、局所注射、マイクロニードル投与に対応。抗炎症作用、組織再生、アンチエイジングに効果を発揮します。',
    'zh-TW': '每毫升含1,000種以上生物活性物質的培養上清液。富含生長因子、細胞因子、外泌體等，適用靜脈輸注、局部注射、微針導入。具有抗炎、組織再生、抗衰老功效。',
    'zh-CN': '每毫升含1,000种以上生物活性物质的培养上清液。富含生长因子、细胞因子、外泌体等，适用静脉输注、局部注射、微针导入。具有抗炎、组织再生、抗衰老功效。',
    en: 'Culture supernatant containing 1,000+ types of bioactive substances per ml. Rich in growth factors, cytokines, and exosomes. Administered via IV, local injection, or microneedle. Effective for anti-inflammation, tissue regeneration, and anti-aging.',
  } as Record<Language, string>,

  // Blood Purification (within services)
  bloodPurificationTitle: {
    ja: '血液浄化療法（アフェレシス）',
    'zh-TW': '血液淨化療法（血漿分離）',
    'zh-CN': '血液净化疗法（血浆分离）',
    en: 'Blood Purification (Apheresis)',
  } as Record<Language, string>,
  bloodPurificationDesc: {
    ja: '体外循環によりLeocanaフィルターを通して余分な中性脂肪やLDLコレステロールを除去。動脈硬化、心筋梗塞、脳卒中の予防に効果的です。',
    'zh-TW': '通過體外循環經Leocana過濾器去除多餘的三酸甘油酯和LDL膽固醇。有效預防動脈硬化、心肌梗塞、腦中風。',
    'zh-CN': '通过体外循环经Leocana过滤器去除多余的甘油三酯和LDL胆固醇。有效预防动脉硬化、心肌梗塞、脑卒中。',
    en: 'Removes excess triglycerides and LDL cholesterol through extracorporeal circulation via Leocana filter. Effective prevention of atherosclerosis, heart attacks, and strokes.',
  } as Record<Language, string>,

  // Facility
  facilityTag: {
    ja: '施設案内',
    'zh-TW': '設施介紹',
    'zh-CN': '设施介绍',
    en: 'Facility Guide',
  } as Record<Language, string>,
  facilityTitle: {
    ja: '9階建て専用メディカルビル「日本細胞ビル」',
    'zh-TW': '9層專用醫療大樓「日本細胞大廈」',
    'zh-CN': '9层专用医疗大楼「日本细胞大厦」',
    en: '9-Floor Dedicated Medical Building "Japan Cell Building"',
  } as Record<Language, string>,
  facilityDesc: {
    ja: '大阪市中央区に位置する9階建て専用ビルは、診療から細胞培養、リラクゼーションまで一貫したサービスを提供します。7階のCPC（細胞培養センター）はISO Class 5クリーンルームを完備し、GMP準拠の品質管理を実現しています。',
    'zh-TW': '位於大阪市中央區的9層專用大樓，從診療到細胞培養、放鬆身心，提供一站式服務。7樓CPC（細胞培養中心）配備ISO Class 5無塵室，實現GMP合規品質管理。',
    'zh-CN': '位于大阪市中央区的9层专用大楼，从诊疗到细胞培养、放松身心，提供一站式服务。7楼CPC（细胞培养中心）配备ISO Class 5洁净室，实现GMP合规品质管理。',
    en: 'The 9-floor dedicated building in Osaka\'s Chuo Ward offers integrated services from medical treatment to cell culture and relaxation. The 7F CPC (Cell Processing Center) features an ISO Class 5 cleanroom with GMP-compliant quality control.',
  } as Record<Language, string>,

  // Partnership & Credentials
  partnerTag: {
    ja: '提携・認証',
    'zh-TW': '合作・認證',
    'zh-CN': '合作·认证',
    en: 'Partnerships & Credentials',
  } as Record<Language, string>,
  partnerTitle: {
    ja: '大学研究機関との提携と厚労省認可',
    'zh-TW': '大學研究機構合作與厚勞省認可',
    'zh-CN': '大学研究机构合作与厚劳省认可',
    en: 'University Partnerships & Government Approval',
  } as Record<Language, string>,

  // Access
  accessTag: {
    ja: 'アクセス',
    'zh-TW': '交通方式',
    'zh-CN': '交通方式',
    en: 'Access',
  } as Record<Language, string>,
  accessTitle: {
    ja: '大阪市中央区 日本細胞ビル',
    'zh-TW': '大阪市中央區 日本細胞大廈',
    'zh-CN': '大阪市中央区 日本细胞大厦',
    en: 'Japan Cell Building, Chuo-ku, Osaka',
  } as Record<Language, string>,

  // CTA
  ctaTitle: {
    ja: '再生医療のご相談',
    'zh-TW': '再生醫療諮詢',
    'zh-CN': '再生医疗咨询',
    en: 'Regenerative Medicine Consultation',
  } as Record<Language, string>,
  ctaSubtitle: {
    ja: 'お気軽にご相談ください。完全予約制にて対応しています。',
    'zh-TW': '歡迎諮詢。採完全預約制。',
    'zh-CN': '欢迎咨询。采用完全预约制。',
    en: 'Contact us anytime. By appointment only.',
  } as Record<Language, string>,
  ctaInitial: {
    ja: '初期相談を予約する',
    'zh-TW': '預約初期諮詢',
    'zh-CN': '预约初期咨询',
    en: 'Book Initial Consultation',
  } as Record<Language, string>,
  ctaRemote: {
    ja: 'オンライン相談を予約する',
    'zh-TW': '預約線上諮詢',
    'zh-CN': '预约线上咨询',
    en: 'Book Remote Consultation',
  } as Record<Language, string>,

  // Legal
  legalTitle: {
    ja: '重要なお知らせ',
    'zh-TW': '重要提示',
    'zh-CN': '重要提示',
    en: 'Important Notice',
  } as Record<Language, string>,
  legalText: {
    ja: '本ページに記載の治療は自由診療（保険適用外）です。治療効果には個人差があり、全ての方に同等の効果を保証するものではありません。治療に伴うリスクや副作用については、必ず医師にご相談ください。旅行サービスは新島交通株式会社が提供します（大阪府知事登録旅行業 第2-3115号）。',
    'zh-TW': '本頁所載治療為自費診療（不適用保險）。治療效果因人而異，不保證所有人獲得相同效果。治療相關風險及副作用，請務必諮詢醫師。旅行服務由新島交通株式會社提供（大阪府知事登錄旅行業 第2-3115號）。',
    'zh-CN': '本页所载治疗为自费诊疗（不适用保险）。治疗效果因人而异，不保证所有人获得相同效果。治疗相关风险及副作用，请务必咨询医师。旅行服务由新岛交通株式会社提供（大阪府知事登录旅行业 第2-3115号）。',
    en: 'Treatments described on this page are self-pay (not covered by insurance). Results vary by individual and are not guaranteed. Please consult a physician regarding risks and side effects. Travel services provided by Niijima Kotsu Co., Ltd. (Osaka Prefecture Registered Travel Agency No. 2-3115).',
  } as Record<Language, string>,
  learnMore: {
    ja: '詳しく見る',
    'zh-TW': '了解更多',
    'zh-CN': '了解更多',
    en: 'Learn More',
  } as Record<Language, string>,
};

// ======================================
// 数据
// ======================================

const STATS = [
  {
    value: '30,000',
    unit: { ja: '名+', 'zh-TW': '名+', 'zh-CN': '名+', en: '+' } as Record<Language, string>,
    label: { ja: '治療実績', 'zh-TW': '治療實績', 'zh-CN': '治疗实绩', en: 'Patients Treated' } as Record<Language, string>,
  },
  {
    value: '18',
    unit: { ja: '年', 'zh-TW': '年', 'zh-CN': '年', en: 'yrs' } as Record<Language, string>,
    label: { ja: '運営実績', 'zh-TW': '營運歷史', 'zh-CN': '运营历史', en: 'Years of Operation' } as Record<Language, string>,
  },
  {
    value: '98',
    unit: { ja: '%+', 'zh-TW': '%+', 'zh-CN': '%+', en: '%+' } as Record<Language, string>,
    label: { ja: '患者満足度', 'zh-TW': '患者滿意度', 'zh-CN': '患者满意度', en: 'Satisfaction Rate' } as Record<Language, string>,
  },
  {
    value: '9',
    unit: { ja: '階', 'zh-TW': '層', 'zh-CN': '层', en: 'floors' } as Record<Language, string>,
    label: { ja: '専用ビル', 'zh-TW': '專用大樓', 'zh-CN': '专用大楼', en: 'Dedicated Building' } as Record<Language, string>,
  },
];

const SERVICES = [
  {
    icon: <Syringe size={28} />,
    title: {
      ja: '自家脂肪由来幹細胞治療',
      'zh-TW': '自體脂肪來源幹細胞治療',
      'zh-CN': '自体脂肪来源干细胞治疗',
      en: 'Autologous Adipose-Derived Stem Cell Therapy',
    } as Record<Language, string>,
    desc: {
      ja: '患者自身の脂肪組織から幹細胞を採取・4週間培養し約1億個に増殖。局所麻酔下で20-30mlの脂肪を採取。糖尿病、神経疾患、心血管疾患、自己免疫疾患、筋骨格疾患に対応。-196°Cで凍結保存、90%以上の回収率。',
      'zh-TW': '從患者自身脂肪組織採取幹細胞，4週培養至約1億個。局部麻醉下採取20-30ml脂肪。適用糖尿病、神經疾患、心血管疾患、自體免疫疾患、肌肉骨骼疾患。-196°C凍存，90%以上回收率。',
      'zh-CN': '从患者自身脂肪组织采取干细胞，4周培养至约1亿个。局部麻醉下采取20-30ml脂肪。适用糖尿病、神经疾患、心血管疾患、自身免疫疾患、肌肉骨骼疾患。-196°C冻存，90%以上回收率。',
      en: 'Extracts stem cells from patient\'s own fat tissue, cultured for 4 weeks to ~100M cells. 20-30ml fat harvested under local anesthesia. Treats diabetes, neurological, cardiovascular, autoimmune, and musculoskeletal conditions. Cryopreserved at -196°C, 90%+ recovery.',
    } as Record<Language, string>,
    color: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
  },
  {
    icon: <Shield size={28} />,
    title: {
      ja: 'NK細胞療法',
      'zh-TW': 'NK細胞療法',
      'zh-CN': 'NK细胞疗法',
      en: 'NK Cell Therapy',
    } as Record<Language, string>,
    desc: {
      ja: 'ナチュラルキラー細胞によるがん免疫療法。がんリスク低減と再発予防に効果。採血→培養→静脈投与のシンプルなプロセス。T細胞療法より広い適応性を持つ。',
      'zh-TW': '以自然殺手細胞進行癌症免疫療法。有效降低癌症風險及預防復發。採血→培養→靜脈輸注的簡單流程。比T細胞療法適應範圍更廣。',
      'zh-CN': '以自然杀手细胞进行癌症免疫疗法。有效降低癌症风险及预防复发。采血→培养→静脉输注的简单流程。比T细胞疗法适应范围更广。',
      en: 'Cancer immunotherapy using Natural Killer cells. Reduces cancer risk and prevents recurrence. Simple process: blood draw → culture → IV infusion. Broader applicability than T-cell therapy.',
    } as Record<Language, string>,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: <FlaskConical size={28} />,
    title: {
      ja: '幹細胞培養上清液',
      'zh-TW': '幹細胞培養上清液',
      'zh-CN': '干细胞培养上清液',
      en: 'Stem Cell Culture Supernatant',
    } as Record<Language, string>,
    desc: {
      ja: '1mlあたり1,000種以上の生理活性物質を含有。成長因子、サイトカイン、エクソソームが豊富。静脈投与、局所注射、マイクロニードルに対応。抗炎症・組織再生・アンチエイジング。',
      'zh-TW': '每毫升含1,000種以上生物活性物質。富含生長因子、細胞因子、外泌體。適用靜脈輸注、局部注射、微針導入。抗炎・組織再生・抗衰老。',
      'zh-CN': '每毫升含1,000种以上生物活性物质。富含生长因子、细胞因子、外泌体。适用静脉输注、局部注射、微针导入。抗炎·组织再生·抗衰老。',
      en: '1,000+ bioactive substances per ml. Rich in growth factors, cytokines, and exosomes. IV, local injection, or microneedle administration. Anti-inflammatory, tissue regeneration, anti-aging.',
    } as Record<Language, string>,
    color: 'from-purple-500 to-fuchsia-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: <Zap size={28} />,
    title: {
      ja: 'ACRS療法',
      'zh-TW': 'ACRS療法',
      'zh-CN': 'ACRS疗法',
      en: 'ACRS Therapy',
    } as Record<Language, string>,
    desc: {
      ja: '従来のPRP療法の15倍の効果。自己血液を3時間培養し、IL-1ra・IL-4raの抗炎症性サイトカインを含む血清を生成。関節痛、スポーツ外傷、発毛促進、肌若返りに対応。',
      'zh-TW': '比傳統PRP療法效果高15倍。將自體血液培養3小時，生成含IL-1ra・IL-4ra抗炎性細胞因子的血清。適用關節痛、運動損傷、促進生髮、皮膚年輕化。',
      'zh-CN': '比传统PRP疗法效果高15倍。将自体血液培养3小时，生成含IL-1ra·IL-4ra抗炎性细胞因子的血清。适用关节痛、运动损伤、促进生发、皮肤年轻化。',
      en: '15x more effective than traditional PRP. Autologous blood cultivated for 3 hours produces serum with IL-1ra & IL-4ra anti-inflammatory cytokines. For joint pain, sports injuries, hair growth, skin rejuvenation.',
    } as Record<Language, string>,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: <Droplets size={28} />,
    title: {
      ja: '血液浄化療法（アフェレシス）',
      'zh-TW': '血液淨化療法（血漿分離）',
      'zh-CN': '血液净化疗法（血浆分离）',
      en: 'Blood Purification (Apheresis)',
    } as Record<Language, string>,
    desc: {
      ja: 'Leocanaフィルターを通した体外循環で余分な中性脂肪やLDLコレステロールを除去。動脈硬化、心筋梗塞、脳卒中の予防に効果的。',
      'zh-TW': '通過Leocana過濾器的體外循環去除多餘三酸甘油酯和LDL膽固醇。有效預防動脈硬化、心肌梗塞、腦中風。',
      'zh-CN': '通过Leocana过滤器的体外循环去除多余甘油三酯和LDL胆固醇。有效预防动脉硬化、心肌梗塞、脑卒中。',
      en: 'Removes excess triglycerides and LDL cholesterol via extracorporeal circulation through Leocana filter. Prevents atherosclerosis, heart attacks, and strokes.',
    } as Record<Language, string>,
    color: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
  },
];

const FLOOR_GUIDE = [
  {
    floor: '1F',
    name: {
      ja: 'Omille — スペシャリティコーヒーショップ',
      'zh-TW': 'Omille — 精品咖啡店',
      'zh-CN': 'Omille — 精品咖啡店',
      en: 'Omille — Specialty Coffee Shop',
    } as Record<Language, string>,
    icon: <Leaf size={18} />,
  },
  {
    floor: '2F',
    name: {
      ja: 'ウェルネススタジオ（ピラティス）',
      'zh-TW': '健身工作室（皮拉提斯）',
      'zh-CN': '健身工作室（普拉提）',
      en: 'Wellness Studio (Pilates)',
    } as Record<Language, string>,
    icon: <Activity size={18} />,
  },
  {
    floor: '3F',
    name: {
      ja: 'VIPケアゾーン（個室6室）',
      'zh-TW': 'VIP護理區（6間獨立包廂）',
      'zh-CN': 'VIP护理区（6间独立包房）',
      en: 'VIP Care Zone (6 Private Rooms)',
    } as Record<Language, string>,
    icon: <Star size={18} />,
  },
  {
    floor: '4F',
    name: {
      ja: '診療フロア',
      'zh-TW': '診療樓層',
      'zh-CN': '诊疗楼层',
      en: 'Medical Treatment Floor',
    } as Record<Language, string>,
    icon: <Stethoscope size={18} />,
  },
  {
    floor: '7F',
    name: {
      ja: 'CPC（細胞培養センター）— ISO Class 5 クリーンルーム',
      'zh-TW': 'CPC（細胞培養中心）— ISO Class 5 無塵室',
      'zh-CN': 'CPC（细胞培养中心）— ISO Class 5 洁净室',
      en: 'CPC (Cell Processing Center) — ISO Class 5 Cleanroom',
    } as Record<Language, string>,
    icon: <Microscope size={18} />,
  },
];

const PARTNERSHIPS = [
  {
    icon: <GraduationCap size={20} />,
    title: {
      ja: '京都大学再生医科学研究所',
      'zh-TW': '京都大學再生醫科學研究所',
      'zh-CN': '京都大学再生医科学研究所',
      en: 'Kyoto University Institute for Frontier Life and Medical Sciences',
    } as Record<Language, string>,
    desc: {
      ja: '幹細胞研究の世界的権威と連携し、最先端の培養技術を導入',
      'zh-TW': '與幹細胞研究的世界權威合作，導入最先端培養技術',
      'zh-CN': '与干细胞研究的世界权威合作，导入最前沿培养技术',
      en: 'Partnered with world-leading stem cell research authority for cutting-edge culture technology',
    } as Record<Language, string>,
  },
  {
    icon: <GraduationCap size={20} />,
    title: {
      ja: '大阪大学医学部',
      'zh-TW': '大阪大學醫學部',
      'zh-CN': '大阪大学医学部',
      en: 'Osaka University School of Medicine',
    } as Record<Language, string>,
    desc: {
      ja: '臨床応用研究の協力体制を構築し、治療プロトコルの品質向上を実現',
      'zh-TW': '建立臨床應用研究合作體制，實現治療方案品質提升',
      'zh-CN': '建立临床应用研究合作体制，实现治疗方案品质提升',
      en: 'Established clinical research collaboration to enhance treatment protocol quality',
    } as Record<Language, string>,
  },
  {
    icon: <ShieldCheck size={20} />,
    title: {
      ja: '厚生労働省認可 再生医療等提供計画',
      'zh-TW': '厚生勞動省認可 再生醫療提供計劃',
      'zh-CN': '厚生劳动省认可 再生医疗提供计划',
      en: 'MHLW-Approved Regenerative Medicine Plan',
    } as Record<Language, string>,
    desc: {
      ja: '再生医療等安全性確保法に基づく厚生労働省認可計画を取得',
      'zh-TW': '基於再生醫療安全確保法取得厚生勞動省認可計劃',
      'zh-CN': '基于再生医疗安全确保法取得厚生劳动省认可计划',
      en: 'Approved plan under the Act on the Safety of Regenerative Medicine',
    } as Record<Language, string>,
  },
  {
    icon: <Award size={20} />,
    title: {
      ja: 'GMP準拠 細胞培養施設',
      'zh-TW': 'GMP合規 細胞培養設施',
      'zh-CN': 'GMP合规 细胞培养设施',
      en: 'GMP-Compliant Cell Culture Facility',
    } as Record<Language, string>,
    desc: {
      ja: 'ISO Class 5クリーンルーム、厳格な品質管理体制を完備',
      'zh-TW': 'ISO Class 5無塵室，嚴格品質管理體制',
      'zh-CN': 'ISO Class 5洁净室，严格品质管理体制',
      en: 'ISO Class 5 cleanroom with rigorous quality management system',
    } as Record<Language, string>,
  },
];

// ======================================
// 组件
// ======================================

interface ACPlusContentProps {
  isGuideEmbed?: boolean;
}

export default function ACPlusContent({ isGuideEmbed }: ACPlusContentProps) {
  const lang = useLanguage();
  const [expandedService, setExpandedService] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* ━━━━━━━━ Hero Section ━━━━━━━━ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src={AC_PLUS_HERO_IMAGE}
          alt="AC Cell Clinic"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/90 via-teal-900/70 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            {/* Tagline */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-white/40" />
              <span className="text-xs tracking-[0.3em] text-white/70 uppercase">
                {t.heroTagline[lang]}
              </span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-200 text-xs mb-6">
              <GraduationCap size={14} />
              {t.heroBadge[lang]}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
              {t.heroTitle[lang]}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">
              {t.heroSubtitle[lang]}
            </p>

            {/* Description */}
            <p className="text-base text-white/70 leading-relaxed mb-8 whitespace-pre-line max-w-xl">
              {t.heroText[lang]}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={isGuideEmbed ? '#consultation' : '/ac-plus/initial-consultation'}
                className="inline-flex items-center justify-center gap-3 bg-white text-teal-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                {t.ctaInitial[lang]} <ArrowRight size={18} />
              </Link>
              <Link
                href={isGuideEmbed ? '#consultation' : '/ac-plus/remote-consultation'}
                className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                {t.ctaRemote[lang]} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Stats Section ━━━━━━━━ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full mb-4">
              {t.statsTag[lang]}
            </span>
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

      {/* ━━━━━━━━ Core Services (5 Services) ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full mb-4">
              {t.servicesTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.servicesTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl border border-gray-100 ${svc.bgColor} hover:shadow-lg transition-all cursor-pointer ${i >= 3 ? 'lg:col-span-1' : ''}`}
                onClick={() => setExpandedService(expandedService === i ? null : i)}
              >
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-white mb-5`}>
                    {svc.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{svc.title[lang]}</h3>
                  <p className={`text-sm text-gray-600 leading-relaxed ${expandedService === i ? '' : 'line-clamp-3'}`}>
                    {svc.desc[lang]}
                  </p>
                  <button className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                    {expandedService === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expandedService === i
                      ? (lang === 'en' ? 'Less' : lang === 'ja' ? '閉じる' : '收起')
                      : (lang === 'en' ? 'More' : lang === 'ja' ? 'もっと見る' : '展开')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Stem Cell Therapy Deep-Dive ━━━━━━━━ */}
      <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full mb-4">
              {t.stemCellTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.stemCellTitle[lang]}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">{t.stemCellDesc[lang]}</p>
            <p className="text-teal-700 font-medium mt-4 text-sm">{t.stemCellIndications[lang]}</p>
          </div>

          {/* Procedure Steps */}
          <div className="space-y-0">
            {[
              { step: 1, title: t.stepAssessment, desc: t.stepAssessmentDesc, icon: <Stethoscope size={20} /> },
              { step: 2, title: t.stepExtract, desc: t.stepExtractDesc, icon: <Syringe size={20} /> },
              { step: 3, title: t.stepCulture, desc: t.stepCultureDesc, icon: <Microscope size={20} /> },
              { step: 4, title: t.stepAdminister, desc: t.stepAdministerDesc, icon: <Droplets size={20} /> },
            ].map((item, i, arr) => (
              <div key={i} className="flex gap-6">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {item.step}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-0.5 h-full bg-teal-200 min-h-[60px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-teal-600">{item.icon}</span>
                    <h3 className="text-lg font-bold text-gray-900">{item.title[lang]}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ NK Cell Therapy Section ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-4">
              {t.nkTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.nkTitle[lang]}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">{t.nkDesc[lang]}</p>
          </div>

          {/* NK Process */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', text: t.nkProcess1, icon: <Syringe size={24} />, color: 'bg-blue-100 text-blue-600' },
              { step: '02', text: t.nkProcess2, icon: <Microscope size={24} />, color: 'bg-indigo-100 text-indigo-600' },
              { step: '03', text: t.nkProcess3, icon: <Droplets size={24} />, color: 'bg-purple-100 text-purple-600' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <div className="text-xs text-gray-400 font-bold mb-2">STEP {item.step}</div>
                <p className="font-bold text-gray-900">{item.text[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ ACRS & Supernatant Section ━━━━━━━━ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">
              {t.acrsTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.acrsTitle[lang]}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ACRS Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t.acrsSubTitle[lang]}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.acrsDesc[lang]}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { ja: 'PRP比15倍', 'zh-TW': 'PRP的15倍', 'zh-CN': 'PRP的15倍', en: '15x PRP' },
                  { ja: 'IL-1ra', 'zh-TW': 'IL-1ra', 'zh-CN': 'IL-1ra', en: 'IL-1ra' },
                  { ja: '3時間培養', 'zh-TW': '3小時培養', 'zh-CN': '3小时培养', en: '3hr Culture' },
                ].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                    {(tag as Record<Language, string>)[lang]}
                  </span>
                ))}
              </div>
            </div>

            {/* Supernatant Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <FlaskConical size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t.supernatantSubTitle[lang]}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.supernatantDesc[lang]}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { ja: '1,000種以上/ml', 'zh-TW': '1,000種以上/ml', 'zh-CN': '1,000种以上/ml', en: '1,000+/ml' },
                  { ja: 'エクソソーム', 'zh-TW': '外泌體', 'zh-CN': '外泌体', en: 'Exosomes' },
                  { ja: '成長因子', 'zh-TW': '生長因子', 'zh-CN': '生长因子', en: 'Growth Factors' },
                ].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                    {(tag as Record<Language, string>)[lang]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Facility Showcase ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full mb-4">
              {t.facilityTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.facilityTitle[lang]}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">{t.facilityDesc[lang]}</p>
          </div>

          {/* Floor Guide */}
          <div className="space-y-3">
            {FLOOR_GUIDE.map((floor, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                  {floor.floor}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-teal-600">{floor.icon}</span>
                  <span className="font-medium text-gray-900">{floor.name[lang]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Partnership & Credentials ━━━━━━━━ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full mb-4">
              {t.partnerTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.partnerTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {PARTNERSHIPS.map((partner, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                    {partner.icon}
                  </div>
                  <h3 className="font-bold text-gray-900">{partner.title[lang]}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{partner.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Location / Access ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full mb-4">
              {t.accessTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.accessTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Building2 size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">ACセルクリニック / AC Cell Clinic</p>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '〒541-0053 大阪市中央区北久宝寺町2-1-3 日本細胞ビル' :
                     lang === 'en' ? '2-1-3 Kitakyuhojimachi, Chuo-ku, Osaka — Japan Cell Building' :
                     lang === 'zh-TW' ? '〒541-0053 大阪市中央區北久寶寺町2-1-3 日本細胞大廈' :
                     '〒541-0053 大阪市中央区北久宝寺町2-1-3 日本细胞大厦'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Train size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '大阪メトロ 本町駅より徒歩約5分' :
                     lang === 'en' ? 'Osaka Metro Honmachi Station — ~5 min walk' :
                     lang === 'zh-TW' ? '大阪地鐵 本町站步行約5分鐘' :
                     '大阪地铁 本町站步行约5分钟'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">10:00 - 19:00</p>
                  <p className="text-xs text-gray-400">
                    {lang === 'ja' ? '完全予約制' :
                     lang === 'en' ? 'By appointment only' :
                     lang === 'zh-TW' ? '完全預約制' :
                     '完全预约制'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">
                    {lang === 'ja' ? '多言語対応スタッフ常駐' :
                     lang === 'en' ? 'Multilingual staff available' :
                     lang === 'zh-TW' ? '多語言工作人員常駐' :
                     '多语言工作人员常驻'}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights Card */}
            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-teal-600" />
                {lang === 'ja' ? '施設のポイント' : lang === 'en' ? 'Facility Highlights' : lang === 'zh-TW' ? '設施亮點' : '设施亮点'}
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? '9階建て専用メディカルビル' : lang === 'en' ? '9-floor dedicated medical building' : lang === 'zh-TW' ? '9層專用醫療大樓' : '9层专用医疗大楼'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? 'ISO Class 5 CPC クリーンルーム完備' : lang === 'en' ? 'ISO Class 5 CPC cleanroom equipped' : lang === 'zh-TW' ? '配備ISO Class 5 CPC無塵室' : '配备ISO Class 5 CPC洁净室'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? 'VIP個室6室完備' : lang === 'en' ? '6 VIP private rooms' : lang === 'zh-TW' ? '6間VIP獨立包廂' : '6间VIP独立包房'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? '1Fスペシャリティコーヒーショップ' : lang === 'en' ? '1F specialty coffee shop' : lang === 'zh-TW' ? '1F精品咖啡店' : '1F精品咖啡店'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? '2Fウェルネススタジオ（ピラティス）' : lang === 'en' ? '2F wellness studio (pilates)' : lang === 'zh-TW' ? '2F健身工作室（皮拉提斯）' : '2F健身工作室（普拉提）'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ CTA Section ━━━━━━━━ */}
      <section id="consultation" className="py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle[lang]}</h2>
          <p className="text-lg text-white/70 mb-10">{t.ctaSubtitle[lang]}</p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            {/* Initial Consultation CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <Stethoscope size={32} className="text-teal-300 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">
                {lang === 'ja' ? '前期相談サービス' : lang === 'en' ? 'Initial Consultation' : lang === 'zh-TW' ? '前期諮詢服務' : '前期咨询服务'}
              </h3>
              <p className="text-sm text-white/60 mb-6">
                {lang === 'ja' ? '病歴翻訳・クリニック相談・治療プラン評価' : lang === 'en' ? 'Medical record translation, clinic consultation, treatment plan assessment' : lang === 'zh-TW' ? '病歷翻譯・診所諮詢・治療方案評估' : '病历翻译·诊所咨询·治疗方案评估'}
              </p>
              <Link
                href={isGuideEmbed ? '#consultation' : '/ac-plus/initial-consultation'}
                className="inline-flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all text-sm"
              >
                {t.ctaInitial[lang]} <ArrowRight size={16} />
              </Link>
            </div>

            {/* Remote Consultation CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <Globe size={32} className="text-teal-300 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">
                {lang === 'ja' ? 'オンライン相談' : lang === 'en' ? 'Remote Consultation' : lang === 'zh-TW' ? '線上諮詢' : '线上咨询'}
              </h3>
              <p className="text-sm text-white/60 mb-6">
                {lang === 'ja' ? '自宅から医師とオンラインで相談' : lang === 'en' ? 'Consult with doctors online from home' : lang === 'zh-TW' ? '在家即可與醫師線上諮詢' : '在家即可与医师线上咨询'}
              </p>
              <Link
                href={isGuideEmbed ? '#consultation' : '/ac-plus/remote-consultation'}
                className="inline-flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all text-sm"
              >
                {t.ctaRemote[lang]} <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-8 text-sm text-white/50">
            <span className="flex items-center gap-2"><Lock size={14} /> {lang === 'ja' ? '安全なお支払い' : lang === 'en' ? 'Secure Payment' : '安全支付'}</span>
            <span className="flex items-center gap-2"><Shield size={14} /> {lang === 'ja' ? '持牌旅行社保障' : lang === 'en' ? 'Licensed Travel Agency' : '持牌旅行社保障'}</span>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Legal Disclaimer ━━━━━━━━ */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h4 className="text-xs font-bold text-gray-500 mb-2">{t.legalTitle[lang]}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">{t.legalText[lang]}</p>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Footer (白标模式下由 layout 提供) ━━━━━━━━ */}
      {!isGuideEmbed && (
        <section className="py-6 bg-gray-100 text-center border-t border-gray-200">
          <p className="text-xs text-gray-400">
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
