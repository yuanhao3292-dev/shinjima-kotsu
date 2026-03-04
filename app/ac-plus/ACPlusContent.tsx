'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, Train,
  Shield, Heart,
  Syringe, Microscope, CheckCircle,
  ArrowRight, Globe,
  Dna, FlaskConical, ShieldCheck,
  GraduationCap, Building2,
  Star,
  ChevronDown, ChevronUp,
  Stethoscope, Layers,
  Sparkles, Activity, Lock,
  CircleDot, Bone, Leaf,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// ======================================
// Hero image export (white-label mapping)
// ======================================
export const AC_PLUS_HERO_IMAGE = 'https://www.acell-clinic.com/img/img_main_01.jpg';

// ======================================
// Official image URLs
// ======================================
const IMAGES = {
  hero: 'https://www.acell-clinic.com/img/img_main_01.jpg',
  heroAlt: 'https://www.acell-clinic.com/img/img_main_02.jpg',
  regen: 'https://www.acell-clinic.com/img/img_rebirth.jpg',
  lymph: 'https://www.acell-clinic.com/img/img_lymph.jpg',
  varicose: 'https://www.acell-clinic.com/img/img_lower.jpg',
  drRui: 'https://www.acell-clinic.com/doctors/img/img_rui.jpg',
  drTsuji: 'https://www.acell-clinic.com/doctors/img/img_tsuji.jpg',
  drMatsuzaki: 'https://www.acell-clinic.com/doctors/img/img_matsuzaki.jpg',
  drSeki: 'https://www.acell-clinic.com/doctors/img/img_seki.jpg',
  drYoshimatsu: 'https://www.acell-clinic.com/doctors/img/img_yoshimatsu.jpg',
  concept: 'https://www.acell-clinic.com/rebirth/img/index_img_concept02.jpg',
  cpc1: 'https://www.acell-clinic.com/rebirth/img/index_img_03.jpg',
  cpc2: 'https://www.acell-clinic.com/rebirth/img/index_img_02.jpg',
  stemDiagram: 'https://www.acell-clinic.com/rebirth/img/index_img_01.png',
  injection: 'https://www.acell-clinic.com/rebirth/injection/img/img_01.jpg',
  rebirthMain: 'https://www.acell-clinic.com/rebirth/img/img_main.jpg',
  lymphMain: 'https://www.acell-clinic.com/lymph/img/img_main.jpg',
  doctorMain: 'https://www.acell-clinic.com/doctors/img/img_main.jpg',
  logo: 'https://www.acell-clinic.com/common/img/logo_new.png',
};

// ======================================
// Multi-language translations
// ======================================
const t = {
  heroTagline: {
    ja: '先進再生医療・リンパ浮腫・下肢静脈瘤',
    'zh-TW': '先進再生醫療・淋巴水腫・下肢靜脈曲張',
    'zh-CN': '先进再生医疗·淋巴水肿·下肢静脉曲张',
    en: 'Advanced Regenerative Medicine, Lymphedema & Varicose Veins',
  } as Record<Language, string>,
  heroTitle: {
    ja: 'アヴェニューセルクリニック',
    'zh-TW': 'Avenue Cell Clinic',
    'zh-CN': 'Avenue Cell Clinic',
    en: 'Avenue Cell Clinic',
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '表参道の再生医療・血管外科専門クリニック',
    'zh-TW': '表參道再生醫療・血管外科專門診所',
    'zh-CN': '表参道再生医疗·血管外科专门诊所',
    en: 'Regenerative Medicine & Vascular Surgery Clinic in Omotesando',
  } as Record<Language, string>,
  heroDesc: {
    ja: '東京大学出身の医師チームによる自家脂肪由来幹細胞治療、\nリンパ浮腫手術、下肢静脈瘤治療を一つの施設で。\n院内CPC完備・保険診療対応。',
    'zh-TW': '由東京大學出身的醫師團隊提供自體脂肪幹細胞治療、\n淋巴水腫手術、下肢靜脈曲張治療，一站式完成。\n院內CPC完備・可使用保險。',
    'zh-CN': '由东京大学出身的医师团队提供自体脂肪干细胞治疗、\n淋巴水肿手术、下肢静脉曲张治疗，一站式完成。\n院内CPC完备·可使用保险。',
    en: 'Autologous adipose-derived stem cell therapy, lymphedema surgery,\nand varicose vein treatment — all under one roof.\nIn-house CPC, insurance accepted for select treatments.',
  } as Record<Language, string>,
  heroBadge: {
    ja: '表参道駅A4出口 徒歩1分',
    'zh-TW': '表參道站A4出口 步行1分鐘',
    'zh-CN': '表参道站A4出口 步行1分钟',
    en: 'Omotesando Station A4 Exit, 1 min walk',
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
  introTag: {
    ja: 'クリニック紹介',
    'zh-TW': '診所介紹',
    'zh-CN': '诊所介绍',
    en: 'About the Clinic',
  } as Record<Language, string>,
  introTitle: {
    ja: '3つの専門領域を一つの施設で',
    'zh-TW': '三大專科領域 一站式完成',
    'zh-CN': '三大专科领域 一站式完成',
    en: 'Three Specialties Under One Roof',
  } as Record<Language, string>,
  introDesc: {
    ja: 'アヴェニューセルクリニックは、東京・南青山に位置する再生医療、リンパ浮腫、下肢静脈瘤の専門クリニックです。形成外科・血管外科・皮膚科・内科・整形外科の5つの診療科を有し、院内に細胞培養加工施設（CPC）を完備。再生医療から外科手術、リハビリまで全てワンストップで提供します。',
    'zh-TW': 'Avenue Cell Clinic位於東京南青山，是再生醫療、淋巴水腫、下肢靜脈曲張的專門診所。設有形成外科、血管外科、皮膚科、內科、整形外科5個診療科，院內完備細胞培養加工設施（CPC）。從再生醫療到外科手術、復健一站式提供。',
    'zh-CN': 'Avenue Cell Clinic位于东京南青山，是再生医疗、淋巴水肿、下肢静脉曲张的专门诊所。设有形成外科、血管外科、皮肤科、内科、整形外科5个诊疗科，院内完备细胞培养加工设施（CPC）。从再生医疗到外科手术、康复一站式提供。',
    en: 'Avenue Cell Clinic, located in Minami-Aoyama, Tokyo, specializes in regenerative medicine, lymphedema, and varicose veins. With 5 departments — Plastic Surgery, Vascular Surgery, Dermatology, Internal Medicine, and Orthopedics — and an in-house Cell Processing Center (CPC), we offer everything from regenerative therapy to surgery and rehabilitation under one roof.',
  } as Record<Language, string>,
  servicesTag: {
    ja: '3つの専門領域',
    'zh-TW': '三大專科',
    'zh-CN': '三大专科',
    en: 'Three Specialties',
  } as Record<Language, string>,
  servicesTitle: {
    ja: '当院の3つのコア治療',
    'zh-TW': '本院三大核心治療',
    'zh-CN': '本院三大核心治疗',
    en: 'Our Three Core Treatments',
  } as Record<Language, string>,
  stemCellTag: {
    ja: '幹細胞治療',
    'zh-TW': '幹細胞治療',
    'zh-CN': '干细胞治疗',
    en: 'Stem Cell Therapy',
  } as Record<Language, string>,
  stemCellTitle: {
    ja: '自家脂肪由来幹細胞治療 — 院内CPCによる高品質培養',
    'zh-TW': '自體脂肪幹細胞治療 — 院內CPC高品質培養',
    'zh-CN': '自体脂肪干细胞治疗 — 院内CPC高品质培养',
    en: 'Autologous Adipose-Derived Stem Cell Therapy — In-House CPC Quality',
  } as Record<Language, string>,
  stemCellDesc: {
    ja: '患者様ご自身の脂肪組織から間葉系幹細胞を分離し、院内CPCにて3〜4週間、3,000万〜2億個まで培養。動物由来の血清を一切使用せず、患者様ご自身の組織のみで安全に培養します。点滴投与と局所注射の2つの方法で、幅広い疾患・症状に対応します。',
    'zh-TW': '從患者自身脂肪組織分離間質幹細胞，在院內CPC培養3-4週，增殖至3,000萬-2億個。完全不使用動物來源血清，僅使用患者自身組織安全培養。透過點滴和局部注射兩種方式，廣泛應對各種疾患。',
    'zh-CN': '从患者自身脂肪组织分离间质干细胞，在院内CPC培养3-4周，增殖至3,000万-2亿个。完全不使用动物来源血清，仅使用患者自身组织安全培养。通过点滴和局部注射两种方式，广泛应对各种疾患。',
    en: 'Mesenchymal stem cells are isolated from the patient\'s own adipose tissue and cultured in our in-house CPC for 3-4 weeks, multiplying to 30-200 million cells. No animal-derived serum is used — only the patient\'s own tissue ensures safety. IV drip and local injection methods address a wide range of conditions.',
  } as Record<Language, string>,
  conditionsTag: {
    ja: '対応疾患',
    'zh-TW': '適應症',
    'zh-CN': '适应症',
    en: 'Applicable Conditions',
  } as Record<Language, string>,
  conditionsTitle: {
    ja: '幹細胞治療の適応症',
    'zh-TW': '幹細胞治療適應症',
    'zh-CN': '干细胞治疗适应症',
    en: 'Stem Cell Therapy Indications',
  } as Record<Language, string>,
  flowTag: {
    ja: '治療の流れ',
    'zh-TW': '治療流程',
    'zh-CN': '治疗流程',
    en: 'Treatment Flow',
  } as Record<Language, string>,
  flowTitle: {
    ja: '幹細胞治療の7ステップ',
    'zh-TW': '幹細胞治療7步流程',
    'zh-CN': '干细胞治疗7步流程',
    en: '7-Step Stem Cell Treatment Process',
  } as Record<Language, string>,
  doctorTag: {
    ja: '医師紹介',
    'zh-TW': '醫師介紹',
    'zh-CN': '医师介绍',
    en: 'Doctor Team',
  } as Record<Language, string>,
  doctorTitle: {
    ja: '東京大学出身の専門医チーム',
    'zh-TW': '東京大學出身的專科醫師團隊',
    'zh-CN': '东京大学出身的专科医师团队',
    en: 'Specialist Team from The University of Tokyo',
  } as Record<Language, string>,
  cpcTag: {
    ja: '院内CPC',
    'zh-TW': '院內CPC',
    'zh-CN': '院内CPC',
    en: 'In-House CPC',
  } as Record<Language, string>,
  cpcTitle: {
    ja: '院内細胞培養加工施設（CPC）',
    'zh-TW': '院內細胞培養加工設施（CPC）',
    'zh-CN': '院内细胞培养加工设施（CPC）',
    en: 'In-House Cell Processing Center (CPC)',
  } as Record<Language, string>,
  cpcDesc: {
    ja: '当院は院内にCPCを完備し、患者様の幹細胞を外部に持ち出すことなく安全に培養します。培養プロセスの全工程を医師が管理し、品質を厳格にコントロールしています。',
    'zh-TW': '本院院內完備CPC設施，患者的幹細胞無需送出院外，安全培養。培養全過程由醫師管理，嚴格控制品質。',
    'zh-CN': '本院院内完备CPC设施，患者的干细胞无需送出院外，安全培养。培养全过程由医师管理，严格控制品质。',
    en: 'Our in-house CPC ensures patient stem cells never leave the clinic, guaranteeing safe cultivation. The entire process is physician-supervised with strict quality controls.',
  } as Record<Language, string>,
  partnerTag: {
    ja: '提携医療機関',
    'zh-TW': '合作醫療機構',
    'zh-CN': '合作医疗机构',
    en: 'Partner Institutions',
  } as Record<Language, string>,
  partnerTitle: {
    ja: '大学病院・基幹病院との連携',
    'zh-TW': '與大學醫院・基幹醫院的合作',
    'zh-CN': '与大学医院·基干医院的合作',
    en: 'Partnerships with University & Core Hospitals',
  } as Record<Language, string>,
  featureTag: {
    ja: '院内環境',
    'zh-TW': '院內環境',
    'zh-CN': '院内环境',
    en: 'Clinic Environment',
  } as Record<Language, string>,
  featureTitle: {
    ja: '安心・快適な診療環境',
    'zh-TW': '安心・舒適的診療環境',
    'zh-CN': '安心·舒适的诊疗环境',
    en: 'Safe & Comfortable Treatment Environment',
  } as Record<Language, string>,
  accessTag: {
    ja: 'アクセス',
    'zh-TW': '交通方式',
    'zh-CN': '交通方式',
    en: 'Access',
  } as Record<Language, string>,
  accessTitle: {
    ja: '表参道駅より徒歩1分',
    'zh-TW': '表參道站步行1分鐘',
    'zh-CN': '表参道站步行1分钟',
    en: '1 Minute Walk from Omotesando Station',
  } as Record<Language, string>,
  faqTag: {
    ja: 'よくある質問',
    'zh-TW': '常見問題',
    'zh-CN': '常见问题',
    en: 'FAQ',
  } as Record<Language, string>,
  faqTitle: {
    ja: 'よくある質問',
    'zh-TW': '常見問題',
    'zh-CN': '常见问题',
    en: 'Frequently Asked Questions',
  } as Record<Language, string>,
  ctaTag: {
    ja: 'ご相談・ご予約',
    'zh-TW': '諮詢・預約',
    'zh-CN': '咨询·预约',
    en: 'Consultation & Booking',
  } as Record<Language, string>,
  ctaTitle: {
    ja: 'まずはお気軽にご相談ください',
    'zh-TW': '歡迎諮詢',
    'zh-CN': '欢迎咨询',
    en: 'Contact Us for a Consultation',
  } as Record<Language, string>,
  ctaSubtitle: {
    ja: '再生医療・リンパ浮腫・下肢静脈瘤でお悩みの方、海外からの受診をご検討の方はお気軽にお問い合わせください。',
    'zh-TW': '有再生醫療、淋巴水腫、下肢靜脈曲張問題，或正在考慮從海外前來就診的患者，歡迎聯繫我們。',
    'zh-CN': '有再生医疗、淋巴水肿、下肢静脉曲张问题，或正在考虑从海外前来就诊的患者，欢迎联系我们。',
    en: 'Whether you are considering regenerative medicine, lymphedema surgery, or varicose vein treatment — including from overseas — please do not hesitate to reach out.',
  } as Record<Language, string>,
  legalTitle: {
    ja: '重要なお知らせ',
    'zh-TW': '重要提示',
    'zh-CN': '重要提示',
    en: 'Important Notice',
  } as Record<Language, string>,
  legalText: {
    ja: '本ページに記載の再生医療は自由診療（保険適用外）です。リンパ浮腫手術・下肢静脈瘤治療は保険適用となる場合があります。治療効果には個人差があり、全ての方に同等の効果を保証するものではありません。治療に伴うリスクや副作用については、必ず医師にご相談ください。旅行サービスは新島交通株式会社が提供します（大阪府知事登録旅行業 第2-3115号）。',
    'zh-TW': '本頁所載的再生醫療為自費診療（不適用保險）。淋巴水腫手術和下肢靜脈曲張治療可能適用保險。治療效果因人而異，不保證所有人獲得相同效果。治療相關風險及副作用，請務必諮詢醫師。旅行服務由新島交通株式會社提供（大阪府知事登錄旅行業 第2-3115號）。',
    'zh-CN': '本页所载的再生医疗为自费诊疗（不适用保险）。淋巴水肿手术和下肢静脉曲张治疗可能适用保险。治疗效果因人而异，不保证所有人获得相同效果。治疗相关风险及副作用，请务必咨询医师。旅行服务由新岛交通株式会社提供（大阪府知事登录旅行业 第2-3115号）。',
    en: 'Regenerative medicine treatments on this page are self-pay (not covered by insurance). Lymphedema surgery and varicose vein treatment may be covered by insurance. Results vary by individual and are not guaranteed. Please consult a physician regarding risks and side effects. Travel services provided by Niijima Kotsu Co., Ltd. (Osaka Prefecture Registered Travel Agency No. 2-3115).',
  } as Record<Language, string>,
};

// ======================================
// Stats data
// ======================================
const STATS = [
  {
    value: '5',
    label: { ja: '診療科', 'zh-TW': '診療科', 'zh-CN': '诊疗科', en: 'Departments' } as Record<Language, string>,
    desc: { ja: '形成・血管・皮膚・内科・整形', 'zh-TW': '形成・血管・皮膚・內科・整形', 'zh-CN': '形成·血管·皮肤·内科·整形', en: 'Plastic, Vascular, Derm, Internal, Ortho' } as Record<Language, string>,
  },
  {
    value: '12+',
    label: { ja: '専門医', 'zh-TW': '專科醫師', 'zh-CN': '专科医师', en: 'Specialists' } as Record<Language, string>,
    desc: { ja: '東京大学出身中心', 'zh-TW': '以東京大學出身為主', 'zh-CN': '以东京大学出身为主', en: 'Primarily from Univ. of Tokyo' } as Record<Language, string>,
  },
  {
    value: 'CPC',
    label: { ja: '院内CPC', 'zh-TW': '院內CPC', 'zh-CN': '院内CPC', en: 'In-House CPC' } as Record<Language, string>,
    desc: { ja: '細胞培養加工施設完備', 'zh-TW': '細胞培養加工設施完備', 'zh-CN': '细胞培养加工设施完备', en: 'Cell Processing Center' } as Record<Language, string>,
  },
  {
    value: { ja: '保険+自費', 'zh-TW': '保險+自費', 'zh-CN': '保险+自费', en: 'Insurance + Self-Pay' } as Record<Language, string>,
    label: { ja: '診療体制', 'zh-TW': '診療體制', 'zh-CN': '诊疗体制', en: 'Payment Options' } as Record<Language, string>,
    desc: { ja: 'リンパ・静脈瘤は保険適用可', 'zh-TW': '淋巴・靜脈曲張可用保險', 'zh-CN': '淋巴·静脉曲张可用保险', en: 'Lymphedema & varicose: insured' } as Record<Language, string>,
  },
];

// ======================================
// 3 Core Services
// ======================================
const CORE_SERVICES = [
  {
    image: IMAGES.regen,
    icon: <Dna size={28} />,
    color: 'bg-[#1e3a5f]',
    title: {
      ja: '再生医療（幹細胞治療）',
      'zh-TW': '再生醫療（幹細胞治療）',
      'zh-CN': '再生医疗（干细胞治疗）',
      en: 'Regenerative Medicine (Stem Cell)',
    } as Record<Language, string>,
    summary: {
      ja: '自家脂肪由来の間葉系幹細胞を院内CPCで3〜4週間培養。点滴投与は脳卒中後遺症・認知症・ALS・アトピー性皮膚炎・動脈硬化に、局所注射は肌若返り・薄毛・リンパ浮腫・靱帯/腱の修復・膝関節症に対応。',
      'zh-TW': '以院內CPC培養自體脂肪間質幹細胞3-4週。點滴投與適用腦中風後遺症、認知症、ALS、異位性皮膚炎、動脈硬化；局部注射適用皮膚回春、掉髮、淋巴水腫、韌帶/肌腱修復、膝關節症。',
      'zh-CN': '以院内CPC培养自体脂肪间质干细胞3-4周。点滴投与适用脑卒中后遗症、认知症、ALS、特应性皮炎、动脉硬化；局部注射适用皮肤回春、脱发、淋巴水肿、韧带/肌腱修复、膝关节症。',
      en: 'Adipose-derived MSCs cultured 3-4 weeks in our CPC. IV drip for post-stroke, dementia, ALS, atopic dermatitis, arteriosclerosis. Local injection for skin rejuvenation, hair loss, lymphedema, ligament/tendon repair, knee osteoarthritis.',
    } as Record<Language, string>,
    details: {
      ja: '培養細胞数：3,000万〜2億個｜動物由来血清不使用｜患者自身の組織のみ使用',
      'zh-TW': '培養細胞數：3,000萬-2億個｜不使用動物來源血清｜僅使用患者自身組織',
      'zh-CN': '培养细胞数：3,000万-2亿个｜不使用动物来源血清｜仅使用患者自身组织',
      en: 'Cell count: 30-200 million | No animal-derived serum | Patient\'s own tissue only',
    } as Record<Language, string>,
  },
  {
    image: IMAGES.lymph,
    icon: <Heart size={28} />,
    color: 'bg-rose-600',
    title: {
      ja: 'リンパ浮腫',
      'zh-TW': '淋巴水腫',
      'zh-CN': '淋巴水肿',
      en: 'Lymphedema',
    } as Record<Language, string>,
    summary: {
      ja: '日本でも数少ないリンパ浮腫手術に対応する民間クリニック。診断・手術・リハビリまで全て院内で完結。LVA（局所麻酔・2〜3時間）、リンパ節移植、脂肪吸引の3術式に対応。ICGリンパ管造影による正確な診断。保険適用：1肢約11万円（3割負担）。',
      'zh-TW': '日本少數可進行淋巴水腫手術的民間診所。從診斷、手術到復健全部院內完成。對應LVA（局麻・2-3小時）、淋巴結移植、脂肪抽吸3種術式。ICG淋巴管造影精確診斷。保險適用：每肢約11萬日圓（3成負擔）。',
      'zh-CN': '日本少数可进行淋巴水肿手术的民间诊所。从诊断、手术到康复全部院内完成。对应LVA（局麻·2-3小时）、淋巴结移植、脂肪抽吸3种术式。ICG淋巴管造影精确诊断。保险适用：每肢约11万日元（3成负担）。',
      en: 'One of Japan\'s rare private clinics offering lymphedema surgery. Diagnosis, surgery, and rehabilitation all in-house. LVA (local anesthesia, 2-3h), lymph node transplant, and liposuction. ICG lymphangiography diagnosis. Insurance covered: ~110,000 JPY (30% copay) per limb.',
    } as Record<Language, string>,
    details: {
      ja: '保険適用｜LVA・リンパ節移植・脂肪吸引｜ICGリンパ管造影｜完全ワンストップ',
      'zh-TW': '保險適用｜LVA・淋巴結移植・脂肪抽吸｜ICG淋巴管造影｜完全一站式',
      'zh-CN': '保险适用｜LVA·淋巴结移植·脂肪抽吸｜ICG淋巴管造影｜完全一站式',
      en: 'Insurance covered | LVA, lymph node transplant, liposuction | ICG lymphangiography | Complete one-stop',
    } as Record<Language, string>,
  },
  {
    image: IMAGES.varicose,
    icon: <Activity size={28} />,
    color: 'bg-sky-600',
    title: {
      ja: '下肢静脈瘤',
      'zh-TW': '下肢靜脈曲張',
      'zh-CN': '下肢静脉曲张',
      en: 'Varicose Veins',
    } as Record<Language, string>,
    summary: {
      ja: '血管内レーザー焼灼術（約15分・局所麻酔）、スタブアバルジョン法、硬化療法を提供。日帰り手術で当日歩いてお帰りいただけます。保険適用：1肢約5万円（3割負担）。',
      'zh-TW': '提供血管內雷射燒灼術（約15分鐘・局麻）、小切口靜脈摘除術、硬化療法。當日手術，步行回家。保險適用：每肢約5萬日圓（3成負擔）。',
      'zh-CN': '提供血管内激光烧灼术（约15分钟·局麻）、小切口静脉摘除术、硬化疗法。当日手术，步行回家。保险适用：每肢约5万日元（3成负担）。',
      en: 'Endovenous laser ablation (~15 min, local anesthesia), stab avulsion, and sclerotherapy. Day surgery — walk home the same day. Insurance covered: ~50,000 JPY (30% copay) per leg.',
    } as Record<Language, string>,
    details: {
      ja: '保険適用｜レーザー焼灼約15分｜日帰り手術｜当日歩行可',
      'zh-TW': '保險適用｜雷射燒灼約15分鐘｜當日手術｜當日步行回家',
      'zh-CN': '保险适用｜激光烧灼约15分钟｜当日手术｜当日步行回家',
      en: 'Insurance covered | Laser ~15 min | Day surgery | Walk home same day',
    } as Record<Language, string>,
  },
];

const CONDITIONS = [
  { ja: '脳卒中後遺症', 'zh-TW': '腦中風後遺症', 'zh-CN': '脑卒中后遗症', en: 'Post-Stroke' },
  { ja: '認知症', 'zh-TW': '認知症', 'zh-CN': '认知症', en: 'Dementia' },
  { ja: 'ALS', 'zh-TW': 'ALS', 'zh-CN': 'ALS', en: 'ALS' },
  { ja: 'アトピー性皮膚炎', 'zh-TW': '異位性皮膚炎', 'zh-CN': '特应性皮炎', en: 'Atopic Dermatitis' },
  { ja: '膝関節症', 'zh-TW': '膝關節症', 'zh-CN': '膝关节症', en: 'Knee Osteoarthritis' },
  { ja: 'リンパ浮腫', 'zh-TW': '淋巴水腫', 'zh-CN': '淋巴水肿', en: 'Lymphedema' },
  { ja: '下肢静脈瘤', 'zh-TW': '下肢靜脈曲張', 'zh-CN': '下肢静脉曲张', en: 'Varicose Veins' },
  { ja: '肌若返り', 'zh-TW': '皮膚回春', 'zh-CN': '皮肤回春', en: 'Skin Rejuvenation' },
  { ja: '薄毛', 'zh-TW': '掉髮', 'zh-CN': '脱发', en: 'Hair Loss' },
  { ja: '靱帯・腱の修復', 'zh-TW': '韌帶・肌腱修復', 'zh-CN': '韧带·肌腱修复', en: 'Ligament/Tendon Repair' },
  { ja: '動脈硬化', 'zh-TW': '動脈硬化', 'zh-CN': '动脉硬化', en: 'Arteriosclerosis' },
  { ja: '軟骨修復', 'zh-TW': '軟骨修復', 'zh-CN': '软骨修复', en: 'Cartilage Repair' },
] as Record<Language, string>[];

const FLOW_STEPS = [
  {
    icon: <Stethoscope size={20} />,
    title: { ja: 'カウンセリング・診察', 'zh-TW': '諮詢・診察', 'zh-CN': '咨询·诊察', en: 'Consultation & Examination' } as Record<Language, string>,
    desc: { ja: '医師による問診、検査、治療計画の策定', 'zh-TW': '醫師問診、檢查、制定治療計劃', 'zh-CN': '医师问诊、检查、制定治疗计划', en: 'Doctor consultation, examination, treatment plan' } as Record<Language, string>,
  },
  {
    icon: <Syringe size={20} />,
    title: { ja: '脂肪採取', 'zh-TW': '脂肪採取', 'zh-CN': '脂肪采取', en: 'Fat Extraction' } as Record<Language, string>,
    desc: { ja: '局所麻酔下で少量（米粒2〜3杯分）の脂肪を採取', 'zh-TW': '局麻下採取少量脂肪（約米粒2-3匙）', 'zh-CN': '局麻下采取少量脂肪（约米粒2-3匙）', en: 'Small amount of fat harvested under local anesthesia' } as Record<Language, string>,
  },
  {
    icon: <FlaskConical size={20} />,
    title: { ja: '幹細胞分離', 'zh-TW': '幹細胞分離', 'zh-CN': '干细胞分离', en: 'Stem Cell Isolation' } as Record<Language, string>,
    desc: { ja: '院内CPCで脂肪組織から間葉系幹細胞を分離', 'zh-TW': '院內CPC從脂肪組織分離間質幹細胞', 'zh-CN': '院内CPC从脂肪组织分离间质干细胞', en: 'MSCs isolated from adipose tissue in our CPC' } as Record<Language, string>,
  },
  {
    icon: <Microscope size={20} />,
    title: { ja: '3〜4週間の培養', 'zh-TW': '3-4週培養', 'zh-CN': '3-4周培养', en: '3-4 Week Cultivation' } as Record<Language, string>,
    desc: { ja: '動物由来血清不使用、患者自身の組織のみで安全培養', 'zh-TW': '不使用動物來源血清，僅用患者自身組織安全培養', 'zh-CN': '不使用动物来源血清，仅用患者自身组织安全培养', en: 'No animal serum, patient\'s own tissue only for safe cultivation' } as Record<Language, string>,
  },
  {
    icon: <ShieldCheck size={20} />,
    title: { ja: '品質検査', 'zh-TW': '品質檢查', 'zh-CN': '品质检查', en: 'Quality Inspection' } as Record<Language, string>,
    desc: { ja: '細胞数・無菌性・バイアビリティを厳密に検査', 'zh-TW': '嚴格檢查細胞數、無菌性、活性', 'zh-CN': '严格检查细胞数、无菌性、活性', en: 'Strict testing: cell count, sterility, viability' } as Record<Language, string>,
  },
  {
    icon: <Dna size={20} />,
    title: { ja: '幹細胞投与', 'zh-TW': '幹細胞投與', 'zh-CN': '干细胞投与', en: 'Stem Cell Administration' } as Record<Language, string>,
    desc: { ja: '点滴投与（全身）または局所注射で投与', 'zh-TW': '點滴投與（全身）或局部注射', 'zh-CN': '点滴投与（全身）或局部注射', en: 'IV drip (systemic) or local injection' } as Record<Language, string>,
  },
  {
    icon: <Heart size={20} />,
    title: { ja: '経過観察', 'zh-TW': '術後追蹤', 'zh-CN': '术后追踪', en: 'Follow-Up' } as Record<Language, string>,
    desc: { ja: '定期的な経過観察、余剰細胞は凍結保存で将来の治療に対応', 'zh-TW': '定期追蹤，多餘細胞凍存供未來治療', 'zh-CN': '定期追踪，多余细胞冻存供未来治疗', en: 'Regular follow-up; surplus cells cryopreserved for future use' } as Record<Language, string>,
  },
];

const DOCTORS = [
  {
    name: { ja: '楊 睿', 'zh-TW': '楊 睿', 'zh-CN': '杨 睿', en: 'Rui Yang' } as Record<Language, string>,
    role: { ja: '院長', 'zh-TW': '院長', 'zh-CN': '院长', en: 'Director' } as Record<Language, string>,
    specialty: { ja: '形成外科専門医', 'zh-TW': '形成外科專科醫師', 'zh-CN': '形成外科专科医师', en: 'Board-Certified Plastic Surgeon' } as Record<Language, string>,
    bio: { ja: '広島大学医学部卒 | 東京大学附属病院形成外科 | 日本形成外科学会・日本再生医療学会', 'zh-TW': '廣島大學醫學部 | 東京大學附屬醫院 | 日本形成外科學會・日本再生醫療學會', 'zh-CN': '广岛大学医学部 | 东京大学附属医院 | 日本形成外科学会·日本再生医疗学会', en: 'Hiroshima Univ. | Univ. of Tokyo Hospital | JSPRS, JSRM' } as Record<Language, string>,
    photo: IMAGES.drRui,
  },
  {
    name: { ja: '辻 晋作', 'zh-TW': '辻 晉作', 'zh-CN': '辻 晋作', en: 'Shinsaku Tsuji' } as Record<Language, string>,
    role: { ja: '再生医療統括医師', 'zh-TW': '再生醫療統括醫師', 'zh-CN': '再生医疗统括医师', en: 'Chief of Regenerative Medicine' } as Record<Language, string>,
    specialty: { ja: '医学博士・形成外科専門医・再生医療認定医・CPC管理者', 'zh-TW': '醫學博士・形成外科專科醫師・再生醫療認定醫・CPC管理者', 'zh-CN': '医学博士·形成外科专科医师·再生医疗认定医·CPC管理者', en: 'PhD, Plastic Surgeon, Regen Med Certified, CPC Manager' } as Record<Language, string>,
    bio: { ja: '東京大学医学部卒 | 東京大学形成外科 | 帝京大学 | 東京女子医大', 'zh-TW': '東京大學醫學部 | 東京大學形成外科 | 帝京大學 | 東京女子醫大', 'zh-CN': '东京大学医学部 | 东京大学形成外科 | 帝京大学 | 东京女子医大', en: 'Univ. of Tokyo | Teikyo Univ. | Tokyo Women\'s Medical Univ.' } as Record<Language, string>,
    photo: IMAGES.drTsuji,
  },
  {
    name: { ja: '松﨑 時夫', 'zh-TW': '松﨑 時夫', 'zh-CN': '松崎 时夫', en: 'Tokio Matsuzaki' } as Record<Language, string>,
    role: { ja: '整形外科', 'zh-TW': '整形外科', 'zh-CN': '整形外科', en: 'Orthopedics' } as Record<Language, string>,
    specialty: { ja: '医学博士・整形外科専門医・再生医療認定医', 'zh-TW': '醫學博士・整形外科專科醫師・再生醫療認定醫', 'zh-CN': '医学博士·整形外科专科医师·再生医疗认定医', en: 'PhD, Orthopedic Surgeon, Regen Med Certified' } as Record<Language, string>,
    bio: { ja: '神戸大学医学部卒 | 東北大学客員教授 | Scripps研究所・UCSD | 東京理科大学', 'zh-TW': '神戶大學醫學部 | 東北大學客座教授 | Scripps・UCSD | 東京理科大學', 'zh-CN': '神户大学医学部 | 东北大学客座教授 | Scripps·UCSD | 东京理科大学', en: 'Kobe Univ. | Tohoku Univ. Visiting Prof. | Scripps, UCSD' } as Record<Language, string>,
    photo: IMAGES.drMatsuzaki,
  },
  {
    name: { ja: '関 征央', 'zh-TW': '關 征央', 'zh-CN': '关 征央', en: 'Yukio Seki' } as Record<Language, string>,
    role: { ja: 'リンパ浮腫専門', 'zh-TW': '淋巴水腫專科', 'zh-CN': '淋巴水肿专科', en: 'Lymphedema Specialist' } as Record<Language, string>,
    specialty: { ja: '医学博士・形成外科専門医・マイクロサージャリー指導医', 'zh-TW': '醫學博士・形成外科專科醫師・顯微外科指導醫', 'zh-CN': '医学博士·形成外科专科医师·显微外科指导医', en: 'PhD, Plastic Surgeon, Microsurgery Supervisor' } as Record<Language, string>,
    bio: { ja: '順天堂大学准教授 | がん研有明病院リンパ外科部長 | リンパ浮腫ガイドライン委員', 'zh-TW': '順天堂大學副教授 | 癌研有明醫院淋巴外科部長', 'zh-CN': '顺天堂大学副教授 | 癌研有明医院淋巴外科部长', en: 'Juntendo Assoc. Prof. | Cancer Institute Hospital Lymph Surgery Director' } as Record<Language, string>,
    photo: IMAGES.drSeki,
  },
  {
    name: { ja: '吉松 英彦', 'zh-TW': '吉松 英彥', 'zh-CN': '吉松 英彦', en: 'Hidehiko Yoshimatsu' } as Record<Language, string>,
    role: { ja: '形成外科', 'zh-TW': '形成外科', 'zh-CN': '形成外科', en: 'Plastic Surgery' } as Record<Language, string>,
    specialty: { ja: '形成外科専門医', 'zh-TW': '形成外科專科醫師', 'zh-CN': '形成外科专科医师', en: 'Board-Certified Plastic Surgeon' } as Record<Language, string>,
    bio: { ja: '東京大学形成外科助教 | がん研有明病院形成外科副部長', 'zh-TW': '東京大學形成外科助教 | 癌研有明醫院副部長', 'zh-CN': '东京大学形成外科助教 | 癌研有明医院副部长', en: 'Univ. of Tokyo Asst. Prof. | Cancer Institute Hospital Deputy Director' } as Record<Language, string>,
    photo: IMAGES.drYoshimatsu,
  },
];

const PARTNERS = [
  { ja: '東京大学医学部附属病院', 'zh-TW': '東京大學附屬醫院', 'zh-CN': '东京大学附属医院', en: 'The University of Tokyo Hospital' },
  { ja: '虎の門病院', 'zh-TW': '虎之門醫院', 'zh-CN': '虎之门医院', en: 'Toranomon Hospital' },
  { ja: 'がん研有明病院', 'zh-TW': '癌研有明醫院', 'zh-CN': '癌研有明医院', en: 'Cancer Institute Hospital' },
  { ja: '順天堂大学医学部附属病院', 'zh-TW': '順天堂大學附屬醫院', 'zh-CN': '顺天堂大学附属医院', en: 'Juntendo University Hospital' },
  { ja: '帝京大学医学部附属病院', 'zh-TW': '帝京大學附屬醫院', 'zh-CN': '帝京大学附属医院', en: 'Teikyo University Hospital' },
  { ja: '東京女子医科大学病院', 'zh-TW': '東京女子醫大醫院', 'zh-CN': '东京女子医大医院', en: 'Tokyo Women\'s Medical Univ. Hospital' },
  { ja: '東北大学病院', 'zh-TW': '東北大學醫院', 'zh-CN': '东北大学医院', en: 'Tohoku University Hospital' },
] as Record<Language, string>[];

const CLINIC_FEATURES = [
  {
    icon: <Lock size={20} />,
    title: { ja: '完全個室', 'zh-TW': '完全個室', 'zh-CN': '完全个室', en: 'Private Rooms' } as Record<Language, string>,
    desc: { ja: 'プライバシーに配慮した完全個室で診察・施術', 'zh-TW': '注重隱私的完全個室診察・施術', 'zh-CN': '注重隐私的完全个室诊察·施术', en: 'Examinations and procedures in fully private rooms' } as Record<Language, string>,
  },
  {
    icon: <ShieldCheck size={20} />,
    title: { ja: '感染対策', 'zh-TW': '感染對策', 'zh-CN': '感染对策', en: 'Infection Control' } as Record<Language, string>,
    desc: { ja: '院内CPCレベルの徹底した感染管理体制', 'zh-TW': '院內CPC等級的徹底感染管理體制', 'zh-CN': '院内CPC级别的彻底感染管理体制', en: 'CPC-level thorough infection management system' } as Record<Language, string>,
  },
  {
    icon: <Star size={20} />,
    title: { ja: 'ホテルライクな内装', 'zh-TW': '飯店級內裝', 'zh-CN': '酒店级内装', en: 'Hotel-like Interior' } as Record<Language, string>,
    desc: { ja: '南青山のラグジュアリーな空間でリラックスした治療体験', 'zh-TW': '在南青山的奢華空間中享受放鬆的治療體驗', 'zh-CN': '在南青山的奢华空间中享受放松的治疗体验', en: 'Relaxing treatment experience in a luxury Minami-Aoyama setting' } as Record<Language, string>,
  },
  {
    icon: <Layers size={20} />,
    title: { ja: 'ワンストップ治療', 'zh-TW': '一站式治療', 'zh-CN': '一站式治疗', en: 'One-Stop Treatment' } as Record<Language, string>,
    desc: { ja: '5診療科・院内CPC・リハビリまで全て一つの施設で完結', 'zh-TW': '5診療科・院內CPC・復健全部在一個設施完成', 'zh-CN': '5诊疗科·院内CPC·康复全部在一个设施完成', en: '5 departments, in-house CPC, and rehabilitation all in one facility' } as Record<Language, string>,
  },
];

const FAQ_ITEMS = [
  {
    q: { ja: '幹細胞治療は安全ですか？', 'zh-TW': '幹細胞治療安全嗎？', 'zh-CN': '干细胞治疗安全吗？', en: 'Is stem cell therapy safe?' } as Record<Language, string>,
    a: { ja: '患者様ご自身の脂肪組織から採取した幹細胞を使用するため、拒絶反応のリスクが極めて低いです。また、院内CPCで培養するため外部搬送による汚染リスクもありません。動物由来の血清を使用しないことも安全性を高めています。', 'zh-TW': '因為使用的是患者自身脂肪組織採取的幹細胞，排斥反應風險極低。而且在院內CPC培養，沒有外部運送的污染風險。不使用動物來源血清也提高了安全性。', 'zh-CN': '因为使用的是患者自身脂肪组织采取的干细胞，排斥反应风险极低。而且在院内CPC培养，没有外部运送的污染风险。不使用动物来源血清也提高了安全性。', en: 'Using stem cells from the patient\'s own adipose tissue minimizes rejection risk. Our in-house CPC eliminates contamination from external transport. No animal-derived serum further enhances safety.' } as Record<Language, string>,
  },
  {
    q: { ja: 'リンパ浮腫手術は保険が使えますか？', 'zh-TW': '淋巴水腫手術可以用保險嗎？', 'zh-CN': '淋巴水肿手术可以用保险吗？', en: 'Is lymphedema surgery covered by insurance?' } as Record<Language, string>,
    a: { ja: 'はい、リンパ浮腫手術（LVA等）は保険適用です。3割負担の場合、1肢あたり約11万円となります。詳しくは診察時にご説明いたします。', 'zh-TW': '是的，淋巴水腫手術（LVA等）適用保險。3成負擔的情況下，每肢約11萬日圓。詳情將在診察時說明。', 'zh-CN': '是的，淋巴水肿手术（LVA等）适用保险。3成负担的情况下，每肢约11万日元。详情将在诊察时说明。', en: 'Yes, lymphedema surgery (LVA, etc.) is covered by insurance. With 30% copay, it\'s approximately 110,000 JPY per limb. Details will be explained during consultation.' } as Record<Language, string>,
  },
  {
    q: { ja: '海外から受診できますか？', 'zh-TW': '可以從海外前來就診嗎？', 'zh-CN': '可以从海外前来就诊吗？', en: 'Can I visit from overseas?' } as Record<Language, string>,
    a: { ja: 'はい、海外からの患者様も多数お受けしております。幹細胞培養に3〜4週間かかるため、脂肪採取後に一時帰国し、培養完了後に再来日して投与を受けるスケジュールが一般的です。', 'zh-TW': '是的，我們接待許多海外患者。由於幹細胞培養需要3-4週，通常的流程是採取脂肪後先回國，培養完成後再來日本接受投與。', 'zh-CN': '是的，我们接待许多海外患者。由于干细胞培养需要3-4周，通常的流程是采取脂肪后先回国，培养完成后再来日本接受投与。', en: 'Yes, we welcome many international patients. Since stem cell cultivation takes 3-4 weeks, a common schedule is: fat extraction visit, return home, then come back for cell administration after cultivation.' } as Record<Language, string>,
  },
  {
    q: { ja: '下肢静脈瘤の手術時間はどのくらいですか？', 'zh-TW': '下肢靜脈曲張手術需要多長時間？', 'zh-CN': '下肢静脉曲张手术需要多长时间？', en: 'How long does varicose vein surgery take?' } as Record<Language, string>,
    a: { ja: '血管内レーザー焼灼術は約15分、局所麻酔で行います。日帰り手術で、術後は歩いてお帰りいただけます。保険適用で、3割負担の場合1肢あたり約5万円です。', 'zh-TW': '血管內雷射燒灼術約15分鐘，局部麻醉。當日手術，術後可步行回家。保險適用，3成負擔每肢約5萬日圓。', 'zh-CN': '血管内激光烧灼术约15分钟，局部麻醉。当日手术，术后可步行回家。保险适用，3成负担每肢约5万日元。', en: 'Endovenous laser ablation takes ~15 minutes under local anesthesia. It\'s day surgery, and you can walk home afterward. Insurance covered: ~50,000 JPY (30% copay) per leg.' } as Record<Language, string>,
  },
  {
    q: { ja: '幹細胞は何個まで培養できますか？', 'zh-TW': '幹細胞可以培養到多少個？', 'zh-CN': '干细胞可以培养到多少个？', en: 'How many stem cells can be cultivated?' } as Record<Language, string>,
    a: { ja: '3〜4週間の培養で3,000万〜2億個まで増殖させます。投与後の余剰細胞は凍結保存し、将来の追加治療に使用可能です。', 'zh-TW': '3-4週培養可增殖至3,000萬-2億個。投與後的多餘細胞凍結保存，可用於未來的追加治療。', 'zh-CN': '3-4周培养可增殖至3,000万-2亿个。投与后的多余细胞冻结保存，可用于未来的追加治疗。', en: 'Cells are expanded to 30-200 million over 3-4 weeks. Surplus cells after administration are cryopreserved for potential future treatments.' } as Record<Language, string>,
  },
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
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const checkoutHref = (path: string) => {
    if (isGuideEmbed) return '#consultation';
    return guideSlug ? `${path}?guide=${guideSlug}` : path;
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ================================================================
          1. HERO SECTION
          ================================================================ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <img
          src={IMAGES.hero}
          alt="Avenue Cell Clinic"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b3e]/90 via-[#1e3a5f]/75 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-white/40" />
              <span className="text-xs tracking-[0.3em] text-white/70 uppercase">
                {t.heroTagline[lang]}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/90 text-xs mb-6">
              <MapPin size={14} />
              {t.heroBadge[lang]}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
              {t.heroTitle[lang]}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">
              {t.heroSubtitle[lang]}
            </p>
            <p className="text-base text-white/70 leading-relaxed mb-8 whitespace-pre-line max-w-xl">
              {t.heroDesc[lang]}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={checkoutHref('/ac-plus/initial-consultation')}
                className="inline-flex items-center justify-center gap-3 bg-white text-[#1e3a5f] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                {t.ctaInitial[lang]} <ArrowRight size={18} />
              </Link>
              <Link
                href={checkoutHref('/ac-plus/remote-consultation')}
                className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                {t.ctaRemote[lang]} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          2. STATS BAR
          ================================================================ */}
      <section className="py-6 bg-[#1e3a5f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center py-4">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {typeof stat.value === 'string' ? stat.value : stat.value[lang]}
                </div>
                <div className="text-sm text-white/90 font-medium">{stat.label[lang]}</div>
                <div className="text-xs text-white/60 mt-0.5">{stat.desc[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          3. CLINIC INTRODUCTION
          ================================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.introTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.introTitle[lang]}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">{t.introDesc[lang]}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src={IMAGES.concept} alt="Avenue Cell Clinic Concept" className="w-full h-72 object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden shadow-md">
                <img src={IMAGES.regen} alt="Regenerative Medicine" className="w-full h-32 object-cover" />
              </div>
              <div className="rounded-xl overflow-hidden shadow-md">
                <img src={IMAGES.lymph} alt="Lymphedema" className="w-full h-32 object-cover" />
              </div>
              <div className="rounded-xl overflow-hidden shadow-md">
                <img src={IMAGES.varicose} alt="Varicose Veins" className="w-full h-32 object-cover" />
              </div>
              <div className="rounded-xl overflow-hidden shadow-md">
                <img src={IMAGES.injection} alt="Treatment" className="w-full h-32 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. THREE CORE SERVICES (expandable)
          ================================================================ */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.servicesTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.servicesTitle[lang]}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {CORE_SERVICES.map((svc, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={svc.image} alt={svc.title[lang]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className={`absolute bottom-4 left-4 w-12 h-12 ${svc.color} rounded-xl flex items-center justify-center text-white`}>
                    {svc.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{svc.title[lang]}</h3>
                  <p className={`text-sm text-gray-600 leading-relaxed ${expandedService === i ? '' : 'line-clamp-4'}`}>
                    {svc.summary[lang]}
                  </p>
                  {expandedService === i && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-[#1e3a5f] font-medium">{svc.details[lang]}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setExpandedService(expandedService === i ? null : i)}
                    className="mt-4 text-xs text-[#1e3a5f] font-medium flex items-center gap-1 hover:underline"
                  >
                    {expandedService === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expandedService === i
                      ? (lang === 'en' ? 'Show less' : lang === 'ja' ? '閉じる' : '收起')
                      : (lang === 'en' ? 'Read more' : lang === 'ja' ? '詳細を見る' : lang === 'zh-TW' ? '了解更多' : '了解更多')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          5. STEM CELL DEEP-DIVE
          ================================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.stemCellTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.stemCellTitle[lang]}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gray-600 leading-relaxed mb-6">{t.stemCellDesc[lang]}</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Syringe size={18} />, text: { ja: '点滴投与（全身）', 'zh-TW': '點滴投與（全身）', 'zh-CN': '点滴投与（全身）', en: 'IV Drip (Systemic)' } as Record<Language, string> },
                  { icon: <CircleDot size={18} />, text: { ja: '局所注射', 'zh-TW': '局部注射', 'zh-CN': '局部注射', en: 'Local Injection' } as Record<Language, string> },
                  { icon: <Bone size={18} />, text: { ja: '関節治療', 'zh-TW': '關節治療', 'zh-CN': '关节治疗', en: 'Joint Treatment' } as Record<Language, string> },
                  { icon: <Leaf size={18} />, text: { ja: '肌若返り', 'zh-TW': '皮膚回春', 'zh-CN': '皮肤回春', en: 'Skin Rejuvenation' } as Record<Language, string> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-[#f7f9fc] rounded-lg px-3 py-2.5 border border-gray-100">
                    <span className="text-[#1e3a5f]">{item.icon}</span>
                    {item.text[lang]}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src={IMAGES.stemDiagram} alt="Stem Cell Diagram" className="rounded-xl shadow-md w-full h-40 object-cover" />
              <img src={IMAGES.cpc1} alt="CPC Process" className="rounded-xl shadow-md w-full h-40 object-cover" />
              <img src={IMAGES.cpc2} alt="CPC Facility" className="rounded-xl shadow-md w-full h-40 object-cover" />
              <img src={IMAGES.rebirthMain} alt="Rebirth Main" className="rounded-xl shadow-md w-full h-40 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          6. APPLICABLE CONDITIONS (TAGS)
          ================================================================ */}
      <section className="py-16 bg-[#f7f9fc]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.conditionsTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.conditionsTitle[lang]}</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {CONDITIONS.map((cond, i) => {
              const c = cond as Record<Language, string>;
              return (
                <span
                  key={i}
                  className="px-5 py-2.5 bg-white border border-[#1e3a5f]/15 text-[#1e3a5f] text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                  {c[lang]}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          7. TREATMENT FLOW (7 steps)
          ================================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.flowTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.flowTitle[lang]}</h2>
          </div>

          <div className="space-y-0">
            {FLOW_STEPS.map((step, i, arr) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-0.5 h-full bg-[#1e3a5f]/20 min-h-[50px]" />
                  )}
                </div>
                <div className="pb-6 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#1e3a5f]">{step.icon}</span>
                    <h3 className="text-base font-bold text-gray-900">{step.title[lang]}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          8. DOCTOR TEAM
          ================================================================ */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.doctorTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.doctorTitle[lang]}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-56 overflow-hidden bg-gray-100">
                  <img
                    src={doc.photo}
                    alt={doc.name[lang]}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{doc.name[lang]}</h3>
                    <span className="px-2 py-0.5 bg-[#e8f0f8] text-[#1e3a5f] text-[10px] font-medium rounded-full">
                      {doc.role[lang]}
                    </span>
                  </div>
                  <p className="text-xs text-[#1e3a5f] font-medium mb-2">{doc.specialty[lang]}</p>
                  <p className="text-xs text-gray-500">{doc.bio[lang]}</p>
                </div>
              </div>
            ))}

            {/* Medical Adviser Card */}
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0d1b3e] rounded-2xl p-6 text-white md:col-span-2 lg:col-span-1 flex flex-col justify-center">
              <div className="text-xs text-white/60 font-medium uppercase tracking-wider mb-2">Medical Adviser</div>
              <h3 className="text-xl font-bold mb-1">
                {lang === 'zh-CN' ? '波利井 清纪' : '波利井 清紀'}
              </h3>
              <p className="text-sm text-white/80 font-medium mb-3">
                {lang === 'en' ? 'Kiyonori Harii' : ''}
              </p>
              <div className="space-y-1.5 text-sm text-white/70">
                <div className="flex items-start gap-2">
                  <GraduationCap size={14} className="mt-0.5 shrink-0 text-white/50" />
                  <span>
                    {lang === 'ja' ? '東京大学名誉教授（形成外科）' :
                     lang === 'zh-TW' ? '東京大學名譽教授（形成外科）' :
                     lang === 'zh-CN' ? '东京大学名誉教授（形成外科）' :
                     'Professor Emeritus, The University of Tokyo (Plastic Surgery)'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 size={14} className="mt-0.5 shrink-0 text-white/50" />
                  <span>
                    {lang === 'ja' ? '杏林大学教授' :
                     lang === 'zh-TW' ? '杏林大學教授' :
                     lang === 'zh-CN' ? '杏林大学教授' :
                     'Professor, Kyorin University'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          9. CPC SECTION
          ================================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.cpcTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.cpcTitle[lang]}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">{t.cpcDesc[lang]}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img src={IMAGES.cpc1} alt="CPC" className="w-full h-52 object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img src={IMAGES.cpc2} alt="CPC Equipment" className="w-full h-52 object-cover" />
            </div>
            <div className="bg-[#1e3a5f] rounded-2xl p-6 flex flex-col justify-center text-white">
              <h3 className="font-bold text-lg mb-4">
                {lang === 'ja' ? 'CPCの特長' : lang === 'en' ? 'CPC Features' : lang === 'zh-TW' ? 'CPC特色' : 'CPC特色'}
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { ja: '院内設置 — 外部搬送リスクゼロ', 'zh-TW': '院內設置 — 無外部運送風險', 'zh-CN': '院内设置 — 无外部运送风险', en: 'In-house — Zero external transport risk' },
                  { ja: '動物由来血清不使用', 'zh-TW': '不使用動物來源血清', 'zh-CN': '不使用动物来源血清', en: 'No animal-derived serum' },
                  { ja: '医師による全工程管理', 'zh-TW': '醫師全程管理', 'zh-CN': '医师全程管理', en: 'Physician-managed entire process' },
                  { ja: '余剰細胞の凍結保存対応', 'zh-TW': '多餘細胞凍結保存', 'zh-CN': '多余细胞冻结保存', en: 'Cryopreservation of surplus cells' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-white/70 mt-0.5 shrink-0" />
                    <span className="text-white/90">{(feature as Record<Language, string>)[lang]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          10. PARTNER INSTITUTIONS
          ================================================================ */}
      <section className="py-16 bg-[#f7f9fc]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.partnerTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.partnerTitle[lang]}</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PARTNERS.map((partner, i) => {
              const p = partner as Record<Language, string>;
              return (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e8f0f8] rounded-lg flex items-center justify-center text-[#1e3a5f] shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{p[lang]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          11. CLINIC FEATURES
          ================================================================ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.featureTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.featureTitle[lang]}</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {CLINIC_FEATURES.map((feat, i) => (
              <div key={i} className="text-center p-6 bg-[#f7f9fc] rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-[#e8f0f8] rounded-xl flex items-center justify-center text-[#1e3a5f] mx-auto mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{feat.title[lang]}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          12. ACCESS / LOCATION
          ================================================================ */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.accessTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.accessTitle[lang]}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <img src={IMAGES.logo} alt="Avenue Cell Clinic" className="h-10 object-contain" />
              </div>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Building2 size={20} className="text-[#1e3a5f] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {lang === 'ja' ? 'アヴェニューセルクリニック' : 'Avenue Cell Clinic'}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {lang === 'ja' ? '〒107-0062 東京都港区南青山3-18-16 ル・ボワビル3F' :
                       lang === 'zh-TW' ? '〒107-0062 東京都港區南青山3-18-16 Le Bois Bldg 3F' :
                       lang === 'zh-CN' ? '〒107-0062 东京都港区南青山3-18-16 Le Bois大厦3F' :
                       '3-18-16 Minami-Aoyama, Minato-ku, Tokyo 107-0062, Le Bois Bldg 3F'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Train size={20} className="text-[#1e3a5f] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {lang === 'ja' ? '表参道駅 A4出口 徒歩1分' :
                       lang === 'zh-TW' ? '表參道站 A4出口 步行1分鐘' :
                       lang === 'zh-CN' ? '表参道站 A4出口 步行1分钟' :
                       'Omotesando Station A4 Exit, 1 min walk'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {lang === 'ja' ? '東京メトロ 銀座線・半蔵門線・千代田線' :
                       lang === 'en' ? 'Tokyo Metro Ginza, Hanzomon, Chiyoda Lines' :
                       lang === 'zh-TW' ? '東京Metro 銀座線・半藏門線・千代田線' :
                       '东京Metro 银座线·半藏门线·千代田线'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-[#1e3a5f] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">10:00 - 14:00 / 15:00 - 19:00</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {lang === 'ja' ? '月〜土（日曜・祝日休診）' :
                       lang === 'en' ? 'Mon-Sat (Closed Sun & Holidays)' :
                       lang === 'zh-TW' ? '週一至週六（週日・假日休診）' :
                       '周一至周六（周日·假日休诊）'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-[#1e3a5f] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">0120-382-300
                      <span className="text-xs text-gray-400 ml-1">
                        ({lang === 'ja' ? 'フリーダイヤル' : lang === 'en' ? 'Toll-free' : '免费电话'})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">03-3796-5511</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Sparkles size={18} className="text-[#1e3a5f]" />
                {lang === 'ja' ? '診療科目' : lang === 'en' ? 'Departments' : lang === 'zh-TW' ? '診療科目' : '诊疗科目'}
              </h3>
              <div className="space-y-3 mb-6">
                {[
                  { ja: '形成外科', 'zh-TW': '形成外科', 'zh-CN': '形成外科', en: 'Plastic Surgery' },
                  { ja: '血管外科', 'zh-TW': '血管外科', 'zh-CN': '血管外科', en: 'Vascular Surgery' },
                  { ja: '皮膚科', 'zh-TW': '皮膚科', 'zh-CN': '皮肤科', en: 'Dermatology' },
                  { ja: '内科', 'zh-TW': '內科', 'zh-CN': '内科', en: 'Internal Medicine' },
                  { ja: '整形外科', 'zh-TW': '整形外科', 'zh-CN': '整形外科', en: 'Orthopedics' },
                ].map((dept, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-[#1e3a5f] shrink-0" />
                    <span>{(dept as Record<Language, string>)[lang]}</span>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Globe size={18} className="text-[#1e3a5f]" />
                  {lang === 'ja' ? '海外からの受診' : lang === 'en' ? 'International Patients' : lang === 'zh-TW' ? '海外就診' : '海外就诊'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'ja' ? '海外からの患者様は、事前相談を通じて治療計画を立てた上でご来院いただけます。中国語・英語での対応が可能です。' :
                   lang === 'zh-TW' ? '海外患者可通過事前諮詢制定治療計劃後前來就診。可提供中文、英文對應。' :
                   lang === 'zh-CN' ? '海外患者可通过事前咨询制定治疗计划后前来就诊。可提供中文、英文对应。' :
                   'International patients can plan their treatment through pre-consultation before visiting. Chinese and English support available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          13. FAQ
          ================================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[#e8f0f8] text-[#1e3a5f] text-xs font-medium rounded-full mb-4">
              {t.faqTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.faqTitle[lang]}</h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="bg-[#f7f9fc] rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-bold text-gray-900 text-sm pr-4">{faq.q[lang]}</span>
                  {expandedFaq === i ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a[lang]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          14. CONSULTATION CTA
          ================================================================ */}
      <section id="consultation" className="py-20 bg-gradient-to-br from-[#0d1b3e] via-[#1e3a5f] to-[#1a2a5e] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-xs font-medium rounded-full mb-6">
            {t.ctaTag[lang]}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle[lang]}</h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.ctaSubtitle[lang]}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <Stethoscope size={32} className="text-blue-300 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">
                {lang === 'ja' ? '前期相談サービス' : lang === 'en' ? 'Initial Consultation' : lang === 'zh-TW' ? '前期諮詢服務' : '前期咨询服务'}
              </h3>
              <p className="text-sm text-white/60 mb-6">
                {lang === 'ja' ? '病歴翻訳・クリニック相談・治療プラン評価' : lang === 'en' ? 'Record translation, clinic consultation, treatment assessment' : lang === 'zh-TW' ? '病歷翻譯・診所諮詢・治療方案評估' : '病历翻译·诊所咨询·治疗方案评估'}
              </p>
              <Link
                href={checkoutHref('/ac-plus/initial-consultation')}
                className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all text-sm"
              >
                {t.ctaInitial[lang]} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <Globe size={32} className="text-blue-300 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">
                {lang === 'ja' ? 'オンライン相談' : lang === 'en' ? 'Remote Consultation' : lang === 'zh-TW' ? '線上諮詢' : '线上咨询'}
              </h3>
              <p className="text-sm text-white/60 mb-6">
                {lang === 'ja' ? '自宅から医師とオンラインで相談' : lang === 'en' ? 'Consult with doctors online from home' : lang === 'zh-TW' ? '在家即可與醫師線上諮詢' : '在家即可与医师线上咨询'}
              </p>
              <Link
                href={checkoutHref('/ac-plus/remote-consultation')}
                className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all text-sm"
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

      {/* ================================================================
          15. LEGAL FOOTER (only when NOT guide embed)
          ================================================================ */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h4 className="text-xs font-bold text-gray-500 mb-2">{t.legalTitle[lang]}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">{t.legalText[lang]}</p>
          </div>
        </div>
      </section>

      {!isGuideEmbed && (
        <section className="py-6 bg-gray-100 text-center border-t border-gray-200">
          <p className="text-xs text-gray-400">
            &copy; AVENUE CELL CLINIC |{' '}
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
