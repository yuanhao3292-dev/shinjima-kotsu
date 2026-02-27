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
export const HELENE_HERO_IMAGE = 'https://stemcells.jp/en/wp-content/themes/flavor_flavor_flavor/images/top/top-firstview-bg.webp';

// ======================================
// 多语言翻译
// ======================================
const t = {
  // Hero
  heroTagline: {
    ja: '再生医療の最先端',
    'zh-TW': '再生醫療的最前沿',
    'zh-CN': '再生医疗的最前沿',
    en: 'The Frontier of Regenerative Medicine',
  } as Record<Language, string>,
  heroTitle: {
    ja: '表参道ヘレネクリニック',
    'zh-TW': '表參道HELENE診所',
    'zh-CN': '表参道HELENE诊所',
    en: 'Omotesando HELENE Clinic',
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '日本初の合法幹細胞治療専門機関',
    'zh-TW': '日本首家合法幹細胞治療專門機構',
    'zh-CN': '日本首家合法干细胞治疗专门机构',
    en: "Japan's First Licensed Stem Cell Therapy Clinic",
  } as Record<Language, string>,
  heroText: {
    ja: '2014年より厚生労働省認可の幹細胞治療を実施。\n独自の3D多層培養技術とアニマルフリー培養液で\n世界トップクラスの22.5億個のMSCを培養。\n16,000名以上の治療実績、重大な合併症ゼロ。',
    'zh-TW': '自2014年起實施厚生勞動省認可的幹細胞治療。\n獨家3D多層培養技術與無動物成分培養液，\n可培養世界頂級的22.5億個MSC。\n16,000名以上治療實績，重大併發症零。',
    'zh-CN': '自2014年起实施厚生劳动省认可的干细胞治疗。\n独家3D多层培养技术与无动物成分培养液，\n可培养世界顶级的22.5亿个MSC。\n16,000名以上治疗实绩，重大并发症零。',
    en: 'MHLW-approved stem cell therapy since 2014.\nProprietary 3D multi-layer culture with animal-free medium,\nproducing world-leading 2.25 billion MSCs.\n16,000+ patients treated with zero severe complications.',
  } as Record<Language, string>,
  heroBadge: {
    ja: 'ケンブリッジ大学教授監修',
    'zh-TW': '劍橋大學教授監修',
    'zh-CN': '剑桥大学教授监修',
    en: 'Advised by Cambridge University Professor',
  } as Record<Language, string>,

  // Stats
  statsTag: {
    ja: 'クリニックの実力',
    'zh-TW': '診所實力',
    'zh-CN': '诊所实力',
    en: 'Clinic Strength',
  } as Record<Language, string>,
  statsTitle: {
    ja: '数字で見るヘレネクリニック',
    'zh-TW': '數字看HELENE診所',
    'zh-CN': '数字看HELENE诊所',
    en: 'HELENE by the Numbers',
  } as Record<Language, string>,

  // Technology
  techTag: {
    ja: '技術優位性',
    'zh-TW': '技術優勢',
    'zh-CN': '技术优势',
    en: 'Technology Advantages',
  } as Record<Language, string>,
  techTitle: {
    ja: '世界をリードする幹細胞培養技術',
    'zh-TW': '引領世界的幹細胞培養技術',
    'zh-CN': '引领世界的干细胞培养技术',
    en: 'World-Leading Stem Cell Culture Technology',
  } as Record<Language, string>,

  // Treatments
  treatTag: {
    ja: '治療項目',
    'zh-TW': '治療項目',
    'zh-CN': '治疗项目',
    en: 'Treatments',
  } as Record<Language, string>,
  treatTitle: {
    ja: '幹細胞治療の適応症',
    'zh-TW': '幹細胞治療適應症',
    'zh-CN': '干细胞治疗适应症',
    en: 'Treatment Indications',
  } as Record<Language, string>,
  treatSubtitle: {
    ja: '厚生労働省認可の再生医療計画に基づく治療を提供しています',
    'zh-TW': '基於厚生勞動省認可的再生醫療計劃提供治療',
    'zh-CN': '基于厚生劳动省认可的再生医疗计划提供治疗',
    en: 'Treatments based on MHLW-approved regenerative medicine plans',
  } as Record<Language, string>,

  // Services
  servicesTag: {
    ja: '治療メニュー',
    'zh-TW': '治療菜單',
    'zh-CN': '治疗菜单',
    en: 'Treatment Menu',
  } as Record<Language, string>,
  servicesTitle: {
    ja: '4つの再生医療サービス',
    'zh-TW': '4大再生醫療服務',
    'zh-CN': '4大再生医疗服务',
    en: '4 Regenerative Medicine Services',
  } as Record<Language, string>,

  // Flow
  flowTag: {
    ja: '治療の流れ',
    'zh-TW': '治療流程',
    'zh-CN': '治疗流程',
    en: 'Treatment Flow',
  } as Record<Language, string>,
  flowTitle: {
    ja: '初診からアフターケアまで7つのステップ',
    'zh-TW': '從初診到術後護理的7個步驟',
    'zh-CN': '从初诊到术后护理的7个步骤',
    en: '7 Steps from Consultation to Aftercare',
  } as Record<Language, string>,

  // Certifications
  certTag: {
    ja: '認証・資格',
    'zh-TW': '認證資質',
    'zh-CN': '认证资质',
    en: 'Certifications',
  } as Record<Language, string>,
  certTitle: {
    ja: '国際認証と厚生労働省認可',
    'zh-TW': '國際認證與厚生勞動省認可',
    'zh-CN': '国际认证与厚生劳动省认可',
    en: 'International Certifications & MHLW Approvals',
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
    ja: '表参道駅B1出口 徒歩1分',
    'zh-TW': '表參道站B1出口 步行1分鐘',
    'zh-CN': '表参道站B1出口 步行1分钟',
    en: '1 Min Walk from Omotesando Sta. B1 Exit',
  } as Record<Language, string>,

  // CTA
  ctaTitle: {
    ja: '幹細胞治療のご相談',
    'zh-TW': '幹細胞治療諮詢',
    'zh-CN': '干细胞治疗咨询',
    en: 'Stem Cell Therapy Consultation',
  } as Record<Language, string>,
  ctaSubtitle: {
    ja: '無料カウンセリングでお気軽にご相談ください',
    'zh-TW': '免費諮詢，歡迎聯繫我們',
    'zh-CN': '免费咨询，欢迎联系我们',
    en: 'Free counseling available — contact us anytime',
  } as Record<Language, string>,
  ctaButton: {
    ja: '初期相談を予約する',
    'zh-TW': '預約初期諮詢',
    'zh-CN': '预约初期咨询',
    en: 'Book Initial Consultation',
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
  consultationPrice: {
    ja: '¥221,000（税込）',
    'zh-TW': '¥221,000（含稅）',
    'zh-CN': '¥221,000（含税）',
    en: '¥221,000 (tax incl.)',
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
  multiLang: {
    ja: '多言語スタッフ常駐',
    'zh-TW': '多語言工作人員常駐',
    'zh-CN': '多语言工作人员常驻',
    en: 'Multilingual Staff Available',
  } as Record<Language, string>,
};

// ======================================
// 数据
// ======================================

const STATS = [
  {
    value: '16,000',
    unit: { ja: '名+', 'zh-TW': '名+', 'zh-CN': '名+', en: '+' } as Record<Language, string>,
    label: { ja: '治療実績', 'zh-TW': '治療實績', 'zh-CN': '治疗实绩', en: 'Patients Treated' } as Record<Language, string>,
  },
  {
    value: '22.5',
    unit: { ja: '億個', 'zh-TW': '億個', 'zh-CN': '亿个', en: 'B cells' } as Record<Language, string>,
    label: { ja: 'MSC最大培養数', 'zh-TW': 'MSC最大培養數', 'zh-CN': 'MSC最大培养数', en: 'Max MSC Culture' } as Record<Language, string>,
  },
  {
    value: '20',
    unit: { ja: '件+', 'zh-TW': '件+', 'zh-CN': '件+', en: '+' } as Record<Language, string>,
    label: { ja: '厚労省認可計画', 'zh-TW': '厚勞省認可計劃', 'zh-CN': '厚劳省认可计划', en: 'MHLW Licenses' } as Record<Language, string>,
  },
  {
    value: '0',
    unit: { ja: '件', 'zh-TW': '件', 'zh-CN': '件', en: '' } as Record<Language, string>,
    label: { ja: '重大合併症', 'zh-TW': '重大併發症', 'zh-CN': '重大并发症', en: 'Severe Complications' } as Record<Language, string>,
  },
];

const TECH_ADVANTAGES = [
  {
    icon: <Dna size={24} />,
    title: { ja: '独自3D多層培養技術', 'zh-TW': '獨家3D多層培養技術', 'zh-CN': '独家3D多层培养技术', en: 'Proprietary 3D Multi-Layer Culture' } as Record<Language, string>,
    desc: { ja: '高密度・高機能の幹細胞を実現。従来培養法より数千倍の増殖速度', 'zh-TW': '實現高密度、高功能的幹細胞。比傳統培養法快數千倍的增殖速度', 'zh-CN': '实现高密度、高功能的干细胞。比传统培养法快数千倍的增殖速度', en: 'High-density, high-function stem cells. Thousands of times faster than conventional methods' } as Record<Language, string>,
  },
  {
    icon: <Leaf size={24} />,
    title: { ja: 'HELENE培養液（アニマルフリー）', 'zh-TW': 'HELENE培養液（無動物成分）', 'zh-CN': 'HELENE培养液（无动物成分）', en: 'HELENE Medium (Animal-Free)' } as Record<Language, string>,
    desc: { ja: '動物由来成分ゼロの自社開発GMP培養液。安全性と純度を極限まで追求', 'zh-TW': '自主研發零動物成分GMP培養液。將安全性和純度追求到極致', 'zh-CN': '自主研发零动物成分GMP培养液。将安全性和纯度追求到极致', en: 'Self-developed GMP medium with zero animal components. Maximum safety & purity' } as Record<Language, string>,
  },
  {
    icon: <Beaker size={24} />,
    title: { ja: '院内CPC（細胞培養施設）', 'zh-TW': '院內CPC（細胞培養設施）', 'zh-CN': '院内CPC（细胞培养设施）', en: 'In-House CPC (Cell Processing Center)' } as Record<Language, string>,
    desc: { ja: 'ISO 9001認証のクリーンルーム。採取から培養・品質検査まで一貫管理', 'zh-TW': 'ISO 9001認證潔淨室。從採集到培養、品質檢測全程一貫管理', 'zh-CN': 'ISO 9001认证洁净室。从采集到培养、品质检测全程一贯管理', en: 'ISO 9001 certified clean room. End-to-end from collection to culture & QC' } as Record<Language, string>,
  },
  {
    icon: <ShieldCheck size={24} />,
    title: { ja: '第三者検証（Takara Bio）', 'zh-TW': '第三方驗證（Takara Bio）', 'zh-CN': '第三方验证（Takara Bio）', en: 'Third-Party Verification (Takara Bio)' } as Record<Language, string>,
    desc: { ja: '培養細胞を宝生物で科学検証。3つの証明書を全患者に発行', 'zh-TW': '培養細胞由Takara Bio科學驗證。為每位患者發放3份證明書', 'zh-CN': '培养细胞由Takara Bio科学验证。为每位患者发放3份证明书', en: 'Cells verified by Takara Bio. 3 certificates issued to every patient' } as Record<Language, string>,
  },
];

const TREATMENT_INDICATIONS = [
  {
    icon: <Heart size={20} />,
    name: { ja: '動脈硬化', 'zh-TW': '動脈硬化', 'zh-CN': '动脉硬化', en: 'Arteriosclerosis' } as Record<Language, string>,
    color: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    icon: <Activity size={20} />,
    name: { ja: '糖尿病（1型・2型）', 'zh-TW': '糖尿病（1型・2型）', 'zh-CN': '糖尿病（1型・2型）', en: 'Diabetes (Type 1 & 2)' } as Record<Language, string>,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    icon: <CircleDot size={20} />,
    name: { ja: '膝関節痛・変形性関節症', 'zh-TW': '膝關節痛・退化性關節炎', 'zh-CN': '膝关节痛・退行性关节炎', en: 'Knee Pain & Osteoarthritis' } as Record<Language, string>,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    icon: <Brain size={20} />,
    name: { ja: '脳梗塞・神経変性疾患', 'zh-TW': '腦梗塞・神經退化性疾患', 'zh-CN': '脑梗塞・神经退行性疾病', en: 'Stroke & Neurodegenerative Diseases' } as Record<Language, string>,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    icon: <Sparkles size={20} />,
    name: { ja: '毛髪再生', 'zh-TW': '毛髮再生', 'zh-CN': '毛发再生', en: 'Hair Regeneration' } as Record<Language, string>,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    icon: <Droplets size={20} />,
    name: { ja: '肌再生・アンチエイジング', 'zh-TW': '肌膚再生・抗衰老', 'zh-CN': '肌肤再生・抗衰老', en: 'Skin Regeneration & Anti-Aging' } as Record<Language, string>,
    color: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    icon: <Stethoscope size={20} />,
    name: { ja: '歯周病', 'zh-TW': '牙周病', 'zh-CN': '牙周病', en: 'Periodontal Disease' } as Record<Language, string>,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    icon: <Shield size={20} />,
    name: { ja: '免疫力低下・免疫老化', 'zh-TW': '免疫力低下・免疫老化', 'zh-CN': '免疫力低下・免疫老化', en: 'Immunosuppression & Immune Aging' } as Record<Language, string>,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    icon: <Users size={20} />,
    name: { ja: '女性ホルモン失調・更年期', 'zh-TW': '女性荷爾蒙失調・更年期', 'zh-CN': '女性荷尔蒙失调・更年期', en: 'Hormonal Imbalance & Menopause' } as Record<Language, string>,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    icon: <Zap size={20} />,
    name: { ja: '男性勃起障害（ED）', 'zh-TW': '男性勃起功能障礙（ED）', 'zh-CN': '男性勃起功能障碍（ED）', en: 'Erectile Dysfunction (ED)' } as Record<Language, string>,
    color: 'bg-sky-50 text-sky-700 border-sky-200',
  },
];

const SERVICES = [
  {
    icon: <Syringe size={28} />,
    title: { ja: '自家脂肪由来MSC治療', 'zh-TW': '自體脂肪來源MSC治療', 'zh-CN': '自体脂肪来源MSC治疗', en: 'Autologous Adipose-Derived MSC Therapy' } as Record<Language, string>,
    desc: { ja: '耳裏の脂肪組織から幹細胞を採取・培養し、静脈投与や局所注射で治療。最大22.5億個のMSCを培養可能。自己細胞のため拒絶反応リスクが極めて低い。', 'zh-TW': '從耳後脂肪組織中採取幹細胞進行培養，通過靜脈輸注或局部注射治療。最多可培養22.5億個MSC。因使用自體細胞，排斥反應風險極低。', 'zh-CN': '从耳后脂肪组织中采取干细胞进行培养，通过静脉输注或局部注射治疗。最多可培养22.5亿个MSC。因使用自体细胞，排斥反应风险极低。', en: 'Stem cells harvested from postauricular fat, cultured up to 2.25B MSCs, administered via IV or local injection. Extremely low rejection risk using autologous cells.' } as Record<Language, string>,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: <FlaskConical size={28} />,
    title: { ja: 'MSCエクソソーム治療', 'zh-TW': 'MSC外泌體治療', 'zh-CN': 'MSC外泌体治疗', en: 'MSC Exosome Therapy' } as Record<Language, string>,
    desc: { ja: '幹細胞から分泌される100nm以下の微小小胞。治療用マイクロRNAを直接運搬し、細胞よりも小さいため塞栓リスクが低い。複数回投与が可能。', 'zh-TW': '幹細胞分泌的100nm以下微小囊泡。直接運輸治療性microRNA，因比細胞小，栓塞風險更低。可進行多次投藥。', 'zh-CN': '干细胞分泌的100nm以下微小囊泡。直接运输治疗性microRNA，因比细胞小，栓塞风险更低。可进行多次给药。', en: 'Sub-100nm vesicles secreted by stem cells carrying therapeutic microRNAs. Lower embolism risk than cells. Multiple administrations possible.' } as Record<Language, string>,
    color: 'from-purple-500 to-fuchsia-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: <Droplets size={28} />,
    title: { ja: '培養上清治療', 'zh-TW': '培養上清液治療', 'zh-CN': '培养上清液治疗', en: 'Culture Supernatant Treatment' } as Record<Language, string>,
    desc: { ja: '幹細胞培養時に分泌される500種以上のタンパク質・成長因子を含む上清液。EGF・TGF・PDGF・VEGFなど。静脈・関節内・頭皮注射に対応。¥165,000〜', 'zh-TW': '幹細胞培養時分泌的含500種以上蛋白質和生長因子的上清液。包含EGF、TGF、PDGF、VEGF等。適用靜脈、關節、頭皮注射。¥165,000起', 'zh-CN': '干细胞培养时分泌的含500种以上蛋白质和生长因子的上清液。包含EGF、TGF、PDGF、VEGF等。适用静脉、关节、头皮注射。¥165,000起', en: 'Supernatant with 500+ proteins & growth factors (EGF, TGF, PDGF, VEGF). IV, joint, or scalp injection. From ¥165,000' } as Record<Language, string>,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: <Scan size={28} />,
    title: { ja: '幹細胞コスメ（HELENE）', 'zh-TW': '幹細胞護膚品（HELENE）', 'zh-CN': '干细胞护肤品（HELENE）', en: 'Stem Cell Cosmetics (HELENE)' } as Record<Language, string>,
    desc: { ja: '自家幹細胞から製造するオーダーメイドスキンケア。培養上清液配合で肌の再生力を高め、外側からもアンチエイジングをサポート。', 'zh-TW': '以自體幹細胞製造的訂製護膚品。配合培養上清液提升肌膚再生力，從外部也支持抗衰老。', 'zh-CN': '以自体干细胞制造的定制护肤品。配合培养上清液提升肌肤再生力，从外部也支持抗衰老。', en: 'Custom skincare from autologous stem cells. Culture supernatant formula enhances skin regeneration for external anti-aging support.' } as Record<Language, string>,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
];

const TREATMENT_FLOW = [
  {
    step: 1,
    title: { ja: '予約・お問い合わせ', 'zh-TW': '預約・諮詢', 'zh-CN': '预约・咨询', en: 'Booking & Inquiry' } as Record<Language, string>,
    desc: { ja: '来院日を確認。海外の方は3ヶ月以内の健康診断書とパスポートをご準備ください', 'zh-TW': '確認就診日期。海外患者請準備3個月內的體檢報告和護照', 'zh-CN': '确认就诊日期。海外患者请准备3个月内的体检报告和护照', en: 'Confirm visit date. International patients: prepare health report (within 3 months) & passport' } as Record<Language, string>,
    icon: <Phone size={20} />,
  },
  {
    step: 2,
    title: { ja: 'カウンセリング（無料）', 'zh-TW': '診療諮詢（免費）', 'zh-CN': '诊疗咨询（免费）', en: 'Counseling (Free)' } as Record<Language, string>,
    desc: { ja: '問診票記入後、医師が治療内容を説明し、個別の治療プランをご提案', 'zh-TW': '填寫問診表後，醫師說明治療內容並提出個人化治療方案', 'zh-CN': '填写问诊表后，医师说明治疗内容并提出个性化治疗方案', en: 'Complete questionnaire. Doctor explains treatment and proposes personalized plan' } as Record<Language, string>,
    icon: <Stethoscope size={20} />,
  },
  {
    step: 3,
    title: { ja: '細胞採取・採血', 'zh-TW': '細胞採取・採血', 'zh-CN': '细胞采取・采血', en: 'Cell Harvest & Blood Draw' } as Record<Language, string>,
    desc: { ja: '耳裏から約5mmの脂肪組織を局所麻酔下で採取（約20分）。溶解糸使用で抜糸不要', 'zh-TW': '局部麻醉下從耳後採取約5mm脂肪組織（約20分鐘）。使用可溶線，無需拆線', 'zh-CN': '局部麻醉下从耳后采取约5mm脂肪组织（约20分钟）。使用可溶线，无需拆线', en: 'Collect ~5mm fat from behind ear under local anesthesia (~20 min). Dissolving sutures, no removal needed' } as Record<Language, string>,
    icon: <Syringe size={20} />,
  },
  {
    step: 4,
    title: { ja: 'お支払い', 'zh-TW': '支付', 'zh-CN': '支付', en: 'Payment' } as Record<Language, string>,
    desc: { ja: '細胞採取当日にお支払い。クレジットカード・銀聯・WeChat Pay・Alipay対応', 'zh-TW': '採集當日支付。支持信用卡、銀聯、微信支付、支付寶', 'zh-CN': '采集当日支付。支持信用卡、银联、微信支付、支付宝', en: 'Payment on collection day. Credit card, UnionPay, WeChat Pay, Alipay accepted' } as Record<Language, string>,
    icon: <CreditCard size={20} />,
  },
  {
    step: 5,
    title: { ja: '細胞培養（約4週間）', 'zh-TW': '細胞培養（約4週）', 'zh-CN': '细胞培养（约4周）', en: 'Cell Culture (~4 Weeks)' } as Record<Language, string>,
    desc: { ja: '院内CPCで厳格な品質管理のもと培養。バーコード管理で完全トレーサビリティ', 'zh-TW': '在院內CPC嚴格品質管控下培養。條碼管理實現完全可追溯', 'zh-CN': '在院内CPC严格品质管控下培养。条码管理实现完全可追溯', en: 'Cultured in-house CPC under strict QC. Barcode management for full traceability' } as Record<Language, string>,
    icon: <Microscope size={20} />,
  },
  {
    step: 6,
    title: { ja: '細胞投与', 'zh-TW': '細胞給藥', 'zh-CN': '细胞给药', en: 'Cell Administration' } as Record<Language, string>,
    desc: { ja: '静脈点滴（40-60分）、関節内注射、頭皮注射（20-30分）、皮膚注射など適応に応じて', 'zh-TW': '靜脈輸注（40-60分鐘）、關節注射、頭皮注射（20-30分鐘）、皮膚注射等，視適應症而定', 'zh-CN': '静脉输注（40-60分钟）、关节注射、头皮注射（20-30分钟）、皮肤注射等，视适应症而定', en: 'IV infusion (40-60 min), joint injection, scalp (20-30 min), or skin injection as indicated' } as Record<Language, string>,
    icon: <Droplets size={20} />,
  },
  {
    step: 7,
    title: { ja: '治療完了・アフターケア', 'zh-TW': '治療完成・術後護理', 'zh-CN': '治疗完成・术后护理', en: 'Completion & Aftercare' } as Record<Language, string>,
    desc: { ja: '当日退院可能。術後の注意事項を説明。電話・メールでのフォローアップ対応', 'zh-TW': '當日可出院。說明術後注意事項。提供電話和郵件隨訪', 'zh-CN': '当日可出院。说明术后注意事项。提供电话和邮件随访', en: 'Same-day discharge. Post-treatment instructions. Phone/email follow-up support' } as Record<Language, string>,
    icon: <CheckCircle size={20} />,
  },
];

const CERTIFICATIONS = [
  {
    icon: <Globe size={20} />,
    title: { ja: 'GCR国際認証', 'zh-TW': 'GCR國際認證', 'zh-CN': 'GCR国际认证', en: 'GCR International Certification' } as Record<Language, string>,
    desc: { ja: '世界初の幹細胞クリニックとしてGCR認証取得（2017年）', 'zh-TW': '全球首家獲得GCR認證的幹細胞診所（2017年）', 'zh-CN': '全球首家获得GCR认证的干细胞诊所（2017年）', en: "World's first stem cell clinic to receive GCR certification (2017)" } as Record<Language, string>,
  },
  {
    icon: <Award size={20} />,
    title: 'ISO 9001',
    desc: { ja: 'CPC（細胞培養施設）品質マネジメントシステム認証', 'zh-TW': 'CPC（細胞培養設施）品質管理體系認證', 'zh-CN': 'CPC（细胞培养设施）品质管理体系认证', en: 'CPC quality management system certification' } as Record<Language, string>,
  },
  {
    icon: <Star size={20} />,
    title: { ja: 'ESQR 2025 品質賞', 'zh-TW': 'ESQR 2025 品質獎', 'zh-CN': 'ESQR 2025 品质奖', en: 'ESQR 2025 Quality Choice Prize' } as Record<Language, string>,
    desc: { ja: '欧州品質研究協会の品質選択賞を受賞', 'zh-TW': '歐洲品質研究協會品質選擇獎', 'zh-CN': '欧洲品质研究协会品质选择奖', en: 'European Society for Quality Research award' } as Record<Language, string>,
  },
  {
    icon: <Shield size={20} />,
    title: { ja: 'APAC 2025', 'zh-TW': 'APAC 2025', 'zh-CN': 'APAC 2025', en: 'APAC 2025' } as Record<Language, string>,
    desc: { ja: 'アジア太平洋トップ再生医療ソリューションプロバイダー', 'zh-TW': '亞太區頂級再生醫療解決方案提供商', 'zh-CN': '亚太区顶级再生医疗解决方案提供商', en: 'Top Regenerative Medicine Solution Provider in Asia-Pacific' } as Record<Language, string>,
  },
  {
    icon: <ShieldCheck size={20} />,
    title: { ja: '厚生労働省認可', 'zh-TW': '厚生勞動省認可', 'zh-CN': '厚生劳动省认可', en: 'MHLW Approval' } as Record<Language, string>,
    desc: { ja: '再生医療等提供計画 20件以上受理（日本最多クラス）', 'zh-TW': '再生醫療提供計劃20件以上受理（日本最多級別）', 'zh-CN': '再生医疗提供计划20件以上受理（日本最多级别）', en: '20+ regenerative medicine plans approved (among most in Japan)' } as Record<Language, string>,
  },
];

const DOCTORS = [
  {
    name: { ja: '松岡孝明', 'zh-TW': '松岡孝明', 'zh-CN': '松冈孝明', en: 'Dr. Takaaki Matsuoka' } as Record<Language, string>,
    role: { ja: '院長・創業者', 'zh-TW': '院長・創辦人', 'zh-CN': '院长・创始人', en: 'Founder & Medical Director' } as Record<Language, string>,
    bio: { ja: '慶應義塾大学医学部卒。ハーバード医学校PGA会員。北京大学EMBA。2013年ヘレネ創業。麻酔科・再生医療・血管外科を専門とする。', 'zh-TW': '慶應義塾大學醫學部畢業。哈佛醫學院PGA會員。北京大學EMBA。2013年創立HELENE。專長麻醉科、再生醫療、血管外科。', 'zh-CN': '庆应义塾大学医学部毕业。哈佛医学院PGA会员。北京大学EMBA。2013年创立HELENE。专长麻醉科、再生医疗、血管外科。', en: 'Keio University School of Medicine. Harvard Medical School PGA. Peking University EMBA. Founded HELENE 2013. Anesthesiology, regenerative medicine, vascular surgery.' } as Record<Language, string>,
  },
  {
    name: { ja: '小林菜奈', 'zh-TW': '小林菜奈', 'zh-CN': '小林菜奈', en: 'Dr. Nana Kobayashi' } as Record<Language, string>,
    role: { ja: '理事長', 'zh-TW': '理事長', 'zh-CN': '理事长', en: 'Chairperson' } as Record<Language, string>,
    bio: { ja: '日本大学医学部卒。外科・消化器外科・内科・再生医療を専門とする。2021年より医療法人ヘレネ理事長。', 'zh-TW': '日本大學醫學部畢業。專長外科、消化器外科、內科、再生醫療。2021年起擔任醫療法人HELENE理事長。', 'zh-CN': '日本大学医学部毕业。专长外科、消化器外科、内科、再生医疗。2021年起担任医疗法人HELENE理事长。', en: 'Nihon University School of Medicine. Specialist in surgery, GI surgery, internal medicine & regenerative medicine. Chairperson since 2021.' } as Record<Language, string>,
  },
  {
    name: { ja: 'Ravindra Gupta 教授', 'zh-TW': 'Ravindra Gupta 教授', 'zh-CN': 'Ravindra Gupta 教授', en: 'Prof. Ravindra Gupta' } as Record<Language, string>,
    role: { ja: '学術顧問（ケンブリッジ大学）', 'zh-TW': '學術顧問（劍橋大學）', 'zh-CN': '学术顾问（剑桥大学）', en: 'Academic Advisor (Cambridge University)' } as Record<Language, string>,
    bio: { ja: 'ケンブリッジ大学臨床微生物学教授。TIME誌「世界で最も影響力のある100人」（2020年）選出。2022年「世界で最も影響力のある微生物学者」。', 'zh-TW': '劍橋大學臨床微生物學教授。TIME雜誌「全球最具影響力100人」（2020年）。2022年「全球最具影響力微生物學家」。', 'zh-CN': '剑桥大学临床微生物学教授。TIME杂志「全球最具影响力100人」（2020年）。2022年「全球最具影响力微生物学家」。', en: 'Cambridge University Clinical Microbiology Professor. TIME "100 Most Influential People" (2020). "Most Influential Microbiologist" (2022).' } as Record<Language, string>,
  },
];

// ======================================
// 组件
// ======================================

interface HeleneClinicContentProps {
  isGuideEmbed?: boolean;
}

export default function HeleneClinicContent({ isGuideEmbed }: HeleneClinicContentProps) {
  const lang = useLanguage();
  const [expandedService, setExpandedService] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* ━━━━━━━━ Hero Section ━━━━━━━━ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src={HELENE_HERO_IMAGE}
          alt="HELENE Clinic"
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-200 text-xs mb-6">
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
                href={isGuideEmbed ? '#consultation' : '/helene-clinic/initial-consultation'}
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

      {/* ━━━━━━━━ Technology Advantages ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full mb-4">{t.techTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.techTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {TECH_ADVANTAGES.map((tech, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                  {tech.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tech.title[lang]}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tech.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Treatment Indications ━━━━━━━━ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full mb-4">{t.treatTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.treatTitle[lang]}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t.treatSubtitle[lang]}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-10">
            {TREATMENT_INDICATIONS.map((item, i) => (
              <div key={i} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${item.color} text-sm font-medium`}>
                {item.icon}
                <span>{item.name[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 4 Services ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full mb-4">{t.servicesTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.servicesTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map((svc, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl border border-gray-100 ${svc.bgColor} hover:shadow-lg transition-all cursor-pointer`}
                onClick={() => setExpandedService(expandedService === i ? null : i)}
              >
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-white mb-5`}>
                    {svc.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{svc.title[lang]}</h3>
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

      {/* ━━━━━━━━ Certifications ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">{t.certTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.certTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {CERTIFICATIONS.map((cert, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                    {cert.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {typeof cert.title === 'string' ? cert.title : cert.title[lang]}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{cert.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Medical Team ━━━━━━━━ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full mb-4">{t.doctorTag[lang]}</span>
            <h2 className="text-3xl font-bold text-gray-900">{t.doctorTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-500 mb-4">
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
      <section className="py-20 bg-white">
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
                  <p className="font-bold text-gray-900 text-sm">HELENE CLINIC</p>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '〒107-0062 東京都港区南青山5-9-15 青山OHMOTOビル3F' :
                     lang === 'en' ? '3F Aoyama OHMOTO Bldg, 5-9-15 Minamiaoyama, Minato-ku, Tokyo 107-0062' :
                     '〒107-0062 东京都港区南青山5-9-15 青山OHMOTO大厦3F'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Train size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '東京メトロ 表参道駅 B1出口より徒歩1分' :
                     lang === 'en' ? 'Tokyo Metro Omotesando Station, B1 Exit — 1 min walk' :
                     '东京地铁 表参道站 B1出口步行1分钟'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">10:00 - 19:00</p>
                  <p className="text-xs text-gray-400">
                    {lang === 'ja' ? '休診日：水曜・日曜' :
                     lang === 'en' ? 'Closed: Wednesday & Sunday' :
                     '休诊日：周三、周日'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">+81-3-3400-2277</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">inquiry@stemcells.jp</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={20} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">{t.multiLang[lang]}</p>
                  <p className="text-xs text-gray-400">
                    {lang === 'ja' ? '日本語・中国語・英語・ベトナム語・インドネシア語ほか' :
                     lang === 'en' ? 'Japanese, Chinese, English, Vietnamese, Indonesian & more' :
                     '日语、中文、英语、越南语、印尼语等'}
                  </p>
                </div>
              </div>
            </div>

            {/* 支付方式 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-gray-400" />
                {lang === 'ja' ? 'お支払い方法' : lang === 'en' ? 'Payment Methods' : '支付方式'}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Visa / Mastercard / AMEX</p>
                <p>UnionPay ({lang === 'ja' ? '銀聯' : lang === 'en' ? 'China UnionPay' : '银联'})</p>
                <p>WeChat Pay / Alipay</p>
                <p>LINE Pay</p>
                <p>{lang === 'ja' ? '国際銀行送金' : lang === 'en' ? 'International Bank Transfer' : '国际银行汇款'}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare size={18} className="text-gray-400" />
                  {lang === 'ja' ? 'SNS' : lang === 'en' ? 'Social Media' : '社交媒体'}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>LINE / WeChat / WhatsApp</p>
                  <p>WhatsApp: +81-70-1550-4730</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Consultation CTA ━━━━━━━━ */}
      <section id="consultation" className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle[lang]}</h2>
          <p className="text-lg text-white/70 mb-3">{t.ctaSubtitle[lang]}</p>
          <p className="text-white/50 text-sm mb-8">{t.freeConsultation[lang]}</p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-lg mx-auto mb-8 border border-white/10">
            <h3 className="font-bold text-lg mb-2">{t.consultation[lang]}</h3>
            <p className="text-2xl font-bold text-amber-300 mb-3">{t.consultationPrice[lang]}</p>
            <p className="text-sm text-white/60 mb-6">{t.consultationDesc[lang]}</p>
            <Link
              href={isGuideEmbed ? '#consultation' : '/helene-clinic/initial-consultation'}
              className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
            >
              {t.ctaButton[lang]} <ArrowRight size={18} />
            </Link>
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
