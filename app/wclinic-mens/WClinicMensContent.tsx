'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Phone, Clock, Train,
  Award, Shield, Heart,
  Syringe, Sparkles, CheckCircle,
  ArrowRight,
  Lock, Users, Activity,
  Zap, Eye,
  Building2, Scissors,
  Star, ShieldCheck,
  Stethoscope, Droplets,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// ======================================
// Hero Image
// ======================================
export const WCLINIC_MENS_HERO_IMAGE = 'https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/new/img/top/image03.png';

// ======================================
// Translations
// ======================================
const t = {
  heroTagline: {
    ja: 'W CLINIC men\'s · Osaka Umeda',
    'zh-TW': 'W CLINIC men\'s · Osaka Umeda',
    'zh-CN': 'W CLINIC men\'s · Osaka Umeda',
    en: 'W CLINIC men\'s · Osaka Umeda',
  } as Record<Language, string>,
  heroTitle: {
    ja: 'W CLINIC men\'s',
    'zh-TW': 'W CLINIC men\'s',
    'zh-CN': 'W CLINIC men\'s',
    en: 'W CLINIC men\'s',
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '大阪梅田 · 男性専科クリニック',
    'zh-TW': '大阪梅田 · 男性專科診所',
    'zh-CN': '大阪梅田 · 男性专科诊所',
    en: 'Osaka Umeda · Men\'s Specialty Clinic',
  } as Record<Language, string>,
  heroText: {
    ja: '植村天受教授が率いる男性健康総合診療センター。日本泌尿器科学会認定専門医・指導医、40年以上の臨床経験。\nED勃起機能障害、男性更年期(LOH症候群)、AGA脱毛、男性アンチエイジング等のワンストップ診療。\n完全予約制、個室完備、プライバシー保護。',
    'zh-TW': '植村天受教授領銜的男性健康綜合診療中心。日本泌尿器科學會認證專科醫生，40年以上臨床經驗。\n提供ED勃起功能障礙、男性更年期(LOH綜合徵)、AGA脫髮、男性抗衰美容等一站式診療服務。\n全預約制，獨立診室，保護您的隱私。',
    'zh-CN': '植村天受教授领衔的男性健康综合诊疗中心。日本泌尿科学会认证专科医生，40年以上临床经验。\n提供ED勃起功能障碍、男性更年期(LOH综合征)、AGA脱发、男性抗衰美容等一站式诊疗服务。\n全预约制，独立诊室，保护您的隐私。',
    en: 'A comprehensive men\'s health center led by Professor Uemura Tenju.\nBoard-certified urologist with 40+ years of clinical experience.\nOne-stop treatment for ED, male menopause (LOH), AGA hair loss, and men\'s anti-aging aesthetics.',
  } as Record<Language, string>,
  heroBadge: {
    ja: '完全予約制 · プライバシー保護',
    'zh-TW': '全預約制 · 隱私保護',
    'zh-CN': '全预约制 · 隐私保护',
    en: 'Fully Appointment-Based · Privacy Protected',
  } as Record<Language, string>,
  ctaButton: {
    ja: '予約相談',
    'zh-TW': '預約諮詢',
    'zh-CN': '预约咨询',
    en: 'Book Consultation',
  } as Record<Language, string>,
  statsTag: {
    ja: 'クリニックの実力',
    'zh-TW': '診所實力',
    'zh-CN': '诊所实力',
    en: 'Clinic Strength',
  } as Record<Language, string>,
  statsTitle: {
    ja: '数字で見る W CLINIC men\'s',
    'zh-TW': '數字看 W CLINIC men\'s',
    'zh-CN': '数字看 W CLINIC men\'s',
    en: 'W CLINIC men\'s by the Numbers',
  } as Record<Language, string>,
  coreServicesTag: {
    ja: '主要診療項目',
    'zh-TW': '主要診療項目',
    'zh-CN': '主要诊疗项目',
    en: 'Core Services',
  } as Record<Language, string>,
  coreServicesTitle: {
    ja: '男性健康の専門診療',
    'zh-TW': '男性健康專業診療',
    'zh-CN': '男性健康专业诊疗',
    en: 'Men\'s Health Specialty Services',
  } as Record<Language, string>,
  edTag: {
    ja: 'ED治療',
    'zh-TW': 'ED治療',
    'zh-CN': 'ED治疗',
    en: 'ED Treatment',
  } as Record<Language, string>,
  edTitle: {
    ja: 'ED勃起機能障害 · 精密治療',
    'zh-TW': 'ED勃起功能障礙 · 精準治療',
    'zh-CN': 'ED勃起功能障碍 · 精准治疗',
    en: 'Erectile Dysfunction · Precision Treatment',
  } as Record<Language, string>,
  edSubtitle: {
    ja: '原因に応じた最適な治療法を選択',
    'zh-TW': '根據病因選擇最適合的治療方案',
    'zh-CN': '根据病因选择最适合的治疗方案',
    en: 'Choose the optimal treatment based on the cause',
  } as Record<Language, string>,
  lohTag: {
    ja: 'LOH症候群',
    'zh-TW': 'LOH綜合徵',
    'zh-CN': 'LOH综合征',
    en: 'LOH Syndrome',
  } as Record<Language, string>,
  lohTitle: {
    ja: '男性更年期症候群(LOH) · 活力を取り戻す',
    'zh-TW': '男性更年期綜合徵(LOH) · 找回活力',
    'zh-CN': '男性更年期综合征(LOH) · 找回活力',
    en: 'Male Menopause (LOH) · Regain Your Vitality',
  } as Record<Language, string>,
  additionalTag: {
    ja: 'その他の診療',
    'zh-TW': '其他診療',
    'zh-CN': '其他诊疗',
    en: 'Additional Services',
  } as Record<Language, string>,
  additionalTitle: {
    ja: 'その他の専門診療',
    'zh-TW': '其他專業診療',
    'zh-CN': '其他专业诊疗',
    en: 'Additional Specialty Services',
  } as Record<Language, string>,
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
  privacyTag: {
    ja: 'プライバシー保護',
    'zh-TW': '隱私保護',
    'zh-CN': '隐私保护',
    en: 'Privacy & Comfort',
  } as Record<Language, string>,
  privacyTitle: {
    ja: '安心のプライバシー保護',
    'zh-TW': '安心的隱私保護',
    'zh-CN': '安心的隐私保护',
    en: 'Your Privacy, Fully Protected',
  } as Record<Language, string>,
  accessTag: {
    ja: 'アクセス',
    'zh-TW': '交通方式',
    'zh-CN': '交通方式',
    en: 'Access',
  } as Record<Language, string>,
  accessTitle: {
    ja: '大阪2院アクセス',
    'zh-TW': '大阪2處交通方式',
    'zh-CN': '大阪2处交通方式',
    en: '2 Locations in Osaka',
  } as Record<Language, string>,
  ctaTitle: {
    ja: '男性健康診療を始めましょう',
    'zh-TW': '開始您的專屬男性健康診療',
    'zh-CN': '开始您的专属男性健康诊疗',
    en: 'Start Your Men\'s Health Journey',
  } as Record<Language, string>,
  ctaButtonInitial: {
    ja: '前期相談(¥221,000)',
    'zh-TW': '前期諮詢(¥221,000)',
    'zh-CN': '前期咨询(¥221,000)',
    en: 'Initial Consultation (¥221,000)',
  } as Record<Language, string>,
  ctaButtonRemote: {
    ja: '遠隔診断(¥243,000)',
    'zh-TW': '遠程診斷(¥243,000)',
    'zh-CN': '远程诊断(¥243,000)',
    en: 'Remote Consultation (¥243,000)',
  } as Record<Language, string>,
};

// ======================================
// Data
// ======================================

const STATS = [
  {
    value: '40+',
    label: { ja: '臨床経験', 'zh-TW': '臨床經驗', 'zh-CN': '临床经验', en: 'Years Clinical Exp.' } as Record<Language, string>,
    sub: { ja: '年', 'zh-TW': '年', 'zh-CN': '年', en: '' } as Record<Language, string>,
  },
  {
    value: '15+',
    label: { ja: '学会所属', 'zh-TW': '學會所屬', 'zh-CN': '学会所属', en: 'Society Memberships' } as Record<Language, string>,
    sub: { ja: '専門学会', 'zh-TW': '專業學會', 'zh-CN': '专业学会', en: 'Professional' } as Record<Language, string>,
  },
  {
    value: '2',
    label: { ja: '大阪拠点', 'zh-TW': '大阪據點', 'zh-CN': '大阪据点', en: 'Osaka Locations' } as Record<Language, string>,
    sub: { ja: '院', 'zh-TW': '院', 'zh-CN': '院', en: 'Clinics' } as Record<Language, string>,
  },
  {
    value: '100%',
    label: { ja: 'プライバシー保障', 'zh-TW': '隱私保障', 'zh-CN': '隐私保障', en: 'Privacy Guaranteed' } as Record<Language, string>,
    sub: { ja: '完全予約制', 'zh-TW': '全預約制', 'zh-CN': '全预约制', en: 'Appointment Only' } as Record<Language, string>,
  },
];

const CORE_SERVICES = [
  {
    icon: Syringe,
    image: 'https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/treatment/ed_tmb01.jpg',
    gradient: 'from-[#293f58] to-[#1a2a3e]',
    badge: { ja: 'ED治療', 'zh-TW': 'ED治療', 'zh-CN': 'ED治疗', en: 'ED Treatment' } as Record<Language, string>,
    title: { ja: 'ED治療', 'zh-TW': 'ED治療', 'zh-CN': 'ED治疗', en: 'ED Treatment' } as Record<Language, string>,
    desc: {
      ja: 'Morenova衝撃波治療、口服薬(Cialis/Viagra)、海綿体注射(ICI)、原因に応じた複数の治療法',
      'zh-TW': 'Morenova衝擊波治療、口服藥物(Cialis/Viagra)、海綿體注射(ICI)，多種治療方案根據病因精準對應',
      'zh-CN': 'Morenova冲击波治疗、口服药物(Cialis/Viagra)、海绵体注射(ICI)，多种治疗方案根据病因精准对应',
      en: 'Morenova shockwave therapy, oral medications (Cialis/Viagra), intracavernosal injection (ICI) — multiple approaches tailored to the cause',
    } as Record<Language, string>,
  },
  {
    icon: Activity,
    image: 'https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/treatment/kounenki_tmb01.png',
    gradient: 'from-[#1a4a6e] to-[#293f58]',
    badge: { ja: 'LOH症候群', 'zh-TW': 'LOH綜合徵', 'zh-CN': 'LOH综合征', en: 'LOH Syndrome' } as Record<Language, string>,
    title: { ja: '男性更年期(LOH)', 'zh-TW': '男性更年期(LOH)', 'zh-CN': '男性更年期(LOH)', en: 'Male Menopause (LOH)' } as Record<Language, string>,
    desc: {
      ja: 'テストステロン検査+問診評価→個人化ホルモン補充療法(HRT)、Sustanon注射、Androforte外用',
      'zh-TW': '睾酮檢測+問診評估→個性化荷爾蒙替代療法(HRT)，Sustanon注射、Androforte外用',
      'zh-CN': '睾酮检测+问诊评估→个性化荷尔蒙替代疗法(HRT)，Sustanon注射、Androforte外用',
      en: 'Testosterone testing + consultation → personalized hormone replacement therapy (HRT), Sustanon injection, Androforte topical',
    } as Record<Language, string>,
  },
  {
    icon: Users,
    image: 'https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/treatment/aga_tmb01.jpg',
    gradient: 'from-[#293f58] to-[#3a5a7c]',
    badge: { ja: 'AGA治療', 'zh-TW': 'AGA治療', 'zh-CN': 'AGA治疗', en: 'AGA Treatment' } as Record<Language, string>,
    title: { ja: 'AGA脱毛治療', 'zh-TW': 'AGA脫髮治療', 'zh-CN': 'AGA脱发治疗', en: 'AGA Hair Loss Treatment' } as Record<Language, string>,
    desc: {
      ja: '内服薬(Propecia/Dutasteride)+外用(Minoxidil)+Hydra Gentle+幹細胞注射、総合発毛プラン',
      'zh-TW': '內服藥(Propecia/Dutasteride)+外用(Minoxidil)+Hydra Gentle+幹細胞注射，綜合生髮方案',
      'zh-CN': '内服药(Propecia/Dutasteride)+外用(Minoxidil)+Hydra Gentle+干细胞注射，综合生发方案',
      en: 'Oral (Propecia/Dutasteride) + topical (Minoxidil) + Hydra Gentle + stem cell injection — comprehensive hair growth plan',
    } as Record<Language, string>,
  },
  {
    icon: Sparkles,
    image: 'https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/treatment/hifu_tmb01.jpg',
    gradient: 'from-[#3a5a7c] to-[#293f58]',
    badge: { ja: 'アンチエイジング', 'zh-TW': '抗衰美容', 'zh-CN': '抗衰美容', en: 'Anti-Aging' } as Record<Language, string>,
    title: { ja: '男性アンチエイジング', 'zh-TW': '男性抗衰美容', 'zh-CN': '男性抗衰美容', en: 'Men\'s Anti-Aging Aesthetics' } as Record<Language, string>,
    desc: {
      ja: 'HIFU、糸リフト、ボトックス、ヒアルロン酸、NMN点滴、エクソソーム等、男性専用アンチエイジング',
      'zh-TW': 'HIFU、線雕、肉毒桿菌、玻尿酸、NMN點滴、外泌體等，專為男性定制的抗衰老方案',
      'zh-CN': 'HIFU、线雕、肉毒素、玻尿酸、NMN点滴、外泌体等，专为男性定制的抗衰老方案',
      en: 'HIFU, thread lift, botox, hyaluronic acid, NMN drip, exosomes — anti-aging solutions designed for men',
    } as Record<Language, string>,
  },
];

const ED_ORAL_MEDICATIONS = [
  { name: 'Cialis (20mg)', price: '¥1,580' },
  { name: 'Tadalafil (20mg)', price: '¥1,340' },
  { name: 'Vardenafil (20mg)', price: '¥1,340' },
  { name: 'Vardenafil (10mg)', price: '¥940' },
  { name: 'Viagra (50mg)', price: '¥1,280' },
  { name: 'Sildenafil (50mg)', price: '¥1,000' },
  { name: 'Sildenafil (25mg)', price: '¥600' },
  { name: 'バイアグラODフィルム (50mg)', price: '¥770' },
];

const LOH_SYMPTOMS = [
  { ja: '体力精力低下', 'zh-TW': '體力精力下降', 'zh-CN': '体力精力下降', en: 'Fatigue & low energy' } as Record<Language, string>,
  { ja: '睡眠の質低下', 'zh-TW': '睡眠品質差', 'zh-CN': '睡眠质量差', en: 'Poor sleep quality' } as Record<Language, string>,
  { ja: '性欲減退', 'zh-TW': '性慾減退', 'zh-CN': '性欲减退', en: 'Decreased libido' } as Record<Language, string>,
  { ja: 'イライラ・不安', 'zh-TW': '情緒易怒焦慮', 'zh-CN': '情绪易怒焦虑', en: 'Irritability & anxiety' } as Record<Language, string>,
  { ja: '集中力低下', 'zh-TW': '注意力難集中', 'zh-CN': '注意力难集中', en: 'Difficulty concentrating' } as Record<Language, string>,
  { ja: '筋肉量減少', 'zh-TW': '肌肉量減少', 'zh-CN': '肌肉量减少', en: 'Muscle mass loss' } as Record<Language, string>,
];

const LOH_FLOW = [
  { step: 1, title: { ja: 'テストステロン検査 (¥11,000)', 'zh-TW': '睾酮檢測 (¥11,000)', 'zh-CN': '睾酮水平检测 (¥11,000)', en: 'Testosterone Test (¥11,000)' } as Record<Language, string> },
  { step: 2, title: { ja: '総合問診評価', 'zh-TW': '綜合問診評估', 'zh-CN': '综合问诊评估', en: 'Comprehensive Consultation' } as Record<Language, string> },
  { step: 3, title: { ja: '個人化HRTプラン策定', 'zh-TW': '個性化HRT方案制定', 'zh-CN': '个性化HRT方案制定', en: 'Personalized HRT Plan' } as Record<Language, string> },
  { step: 4, title: { ja: '定期復査・調整', 'zh-TW': '定期復查調整', 'zh-CN': '定期复查调整', en: 'Regular Follow-up & Adjustment' } as Record<Language, string> },
];

const LOH_TREATMENTS = [
  { name: { ja: 'テストステロン注射 Enarmon', 'zh-TW': '睾酮注射 Enarmon', 'zh-CN': '睾酮注射 Enarmon', en: 'Testosterone Injection Enarmon' } as Record<Language, string>, price: '¥3,300' },
  { name: { ja: 'テストステロン外用 Glomin', 'zh-TW': '睾酮外用膏 Glomin', 'zh-CN': '睾酮外用膏 Glomin', en: 'Testosterone Topical Glomin' } as Record<Language, string>, price: '¥3,960' },
  { name: { ja: 'Androforte 5%', 'zh-TW': 'Androforte 5%', 'zh-CN': 'Androforte 5%', en: 'Androforte 5%' } as Record<Language, string>, price: '¥22,000' },
  { name: { ja: 'Sustanon 250', 'zh-TW': 'Sustanon 250', 'zh-CN': 'Sustanon 250', en: 'Sustanon 250' } as Record<Language, string>, price: '¥3,300' },
];

const ADDITIONAL_SERVICES = [
  {
    icon: Scissors,
    title: { ja: 'AGA脱毛治療', 'zh-TW': 'AGA脫髮治療', 'zh-CN': 'AGA脱发治疗', en: 'AGA Hair Loss' } as Record<Language, string>,
    price: { ja: 'W Original AGA Set ¥14,500/月〜', 'zh-TW': 'W Original AGA Set ¥14,500/月起', 'zh-CN': 'W Original AGA Set ¥14,500/月起', en: 'W Original AGA Set from ¥14,500/mo' } as Record<Language, string>,
  },
  {
    icon: Droplets,
    title: { ja: 'NMN点滴', 'zh-TW': 'NMN點滴', 'zh-CN': 'NMN点滴', en: 'NMN Drip' } as Record<Language, string>,
    price: { ja: '¥32,780〜', 'zh-TW': '從¥32,780起', 'zh-CN': '从¥32,780起', en: 'From ¥32,780' } as Record<Language, string>,
  },
  {
    icon: Zap,
    title: { ja: 'エクソソーム療法', 'zh-TW': '外泌體療法', 'zh-CN': '外泌体疗法', en: 'Exosome Therapy' } as Record<Language, string>,
    price: { ja: '¥123,200〜', 'zh-TW': '從¥123,200起', 'zh-CN': '从¥123,200起', en: 'From ¥123,200' } as Record<Language, string>,
  },
  {
    icon: Eye,
    title: { ja: 'HIFU超音波', 'zh-TW': 'HIFU超音刀', 'zh-CN': 'HIFU超声刀', en: 'HIFU Ultrasound' } as Record<Language, string>,
    price: { ja: '¥27,500〜', 'zh-TW': '從¥27,500起', 'zh-CN': '从¥27,500起', en: 'From ¥27,500' } as Record<Language, string>,
  },
  {
    icon: Star,
    title: { ja: '糸リフト', 'zh-TW': '線雕提升', 'zh-CN': '线雕提升', en: 'Thread Lift' } as Record<Language, string>,
    price: { ja: '¥19,800/本〜', 'zh-TW': '從¥19,800/根起', 'zh-CN': '从¥19,800/根起', en: 'From ¥19,800/thread' } as Record<Language, string>,
  },
  {
    icon: Heart,
    title: { ja: 'W Night Laser いびき治療', 'zh-TW': 'W Night Laser 鼾症治療', 'zh-CN': 'W Night Laser 鼾症治疗', en: 'W Night Laser Snoring Treatment' } as Record<Language, string>,
    price: { ja: '初診¥33,000 / 施術¥88,000〜', 'zh-TW': '初診¥33,000 / 治療¥88,000起', 'zh-CN': '初诊¥33,000 / 治疗¥88,000起', en: 'First ¥33,000 / Session ¥88,000+' } as Record<Language, string>,
  },
];

const PRIVACY_FEATURES = [
  {
    icon: Lock,
    title: { ja: '完全予約制', en: 'Fully Appointment-Based', 'zh-TW': '全預約制', 'zh-CN': '全预约制' } as Record<Language, string>,
    desc: { ja: '待ち時間なくスムーズに診療', en: 'No waiting, smooth consultation', 'zh-TW': '無需等候，順暢診療', 'zh-CN': '无需等候，顺畅诊疗' } as Record<Language, string>,
  },
  {
    icon: Shield,
    title: { ja: '男性専用個室', en: 'Men\'s Private Rooms', 'zh-TW': '男性專屬獨立診室', 'zh-CN': '男性专属独立诊室' } as Record<Language, string>,
    desc: { ja: '完全個室で安心の診療環境', en: 'Fully private consultation environment', 'zh-TW': '完全獨立診室，安心診療', 'zh-CN': '完全独立诊室，安心诊疗' } as Record<Language, string>,
  },
  {
    icon: ShieldCheck,
    title: { ja: 'プライバシー保護', en: 'Privacy Protection', 'zh-TW': '隱私保護', 'zh-CN': '隐私保护' } as Record<Language, string>,
    desc: { ja: '患者情報の完全管理', en: 'Complete patient data protection', 'zh-TW': '患者資料完全管理', 'zh-CN': '患者信息完全管理' } as Record<Language, string>,
  },
];

// ======================================
// Component
// ======================================

interface WClinicMensContentProps {
  isGuideEmbed?: boolean;
  guideSlug?: string;
}

export default function WClinicMensContent({ isGuideEmbed, guideSlug }: WClinicMensContentProps) {
  const lang = useLanguage();

  return (
    <div className="animate-fade-in-up min-h-screen bg-white">

      {/* ========================================
          1. Hero Section — 兵库医科风格全屏背景
          ======================================== */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden text-white bg-slate-900">
        <Image
          src={WCLINIC_MENS_HERO_IMAGE}
          fill
          className="object-cover opacity-80"
          alt="W CLINIC men's"
          sizes="100vw"
          quality={90}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#293f58]/95 via-[#293f58]/60 to-transparent" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
        <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif mb-4 md:mb-6 leading-[1.2]">
              {t.heroTitle[lang]}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c300] to-[#7dff7d]">{t.heroSubtitle[lang]}</span>
            </h1>
            <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base border-l-2 border-[#00c300] pl-4 md:pl-6 max-w-2xl whitespace-pre-line">
              {t.heroText[lang]}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 bg-[#293f58]/40 border border-[#00c300]/60 px-5 py-3 rounded-full backdrop-blur-md">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c300] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00c300]" />
                </span>
                <span className="text-[#00c300] text-sm font-medium">{t.heroBadge[lang]}</span>
              </div>
              <Link
                href={isGuideEmbed ? '#consultation' : '/wclinic-mens/initial-consultation'}
                className="inline-flex items-center gap-2 bg-[#00c300] text-white px-7 py-3 rounded-full font-bold hover:bg-[#009a00] transition-all shadow-lg hover:shadow-xl text-sm"
              >
                {t.ctaButton[lang]} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          2. Stats — 深色渐变过渡区
          ======================================== */}
      <div className="bg-gradient-to-r from-[#293f58] to-[#1a2a3e] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#00c300] text-xs tracking-[0.3em] uppercase font-bold">{t.statsTag[lang]}</span>
            <h3 className="text-3xl font-serif text-white mt-3">{t.statsTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                <div className="text-3xl md:text-4xl font-bold text-white font-serif">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-2 font-medium">{stat.label[lang]}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.sub[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================
          3. Core Services — 带图片的 Hyogo 风格卡片
          ======================================== */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#293f58] text-xs tracking-widest uppercase font-bold">{t.coreServicesTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.coreServicesTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CORE_SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className={`bg-gradient-to-r ${service.gradient} px-5 py-2.5 flex items-center justify-between`}>
                    <span className="text-white text-xs font-bold tracking-wide">{service.badge[lang]}</span>
                    <Icon size={16} className="text-white/60" />
                  </div>
                  <div className="relative aspect-[16/7] overflow-hidden">
                    <Image
                      src={service.image}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={service.title[lang]}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 font-serif mb-2">{service.title[lang]}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.desc[lang]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================
            4. ED Treatment Detail
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#293f58] text-xs tracking-widest uppercase font-bold">{t.edTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.edTitle[lang]}</h3>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm">{t.edSubtitle[lang]}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Morenova */}
            <div className="bg-gray-900 text-white rounded-2xl overflow-hidden group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/homme01/about-ed_img00a.png"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Morenova"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4 bg-[#00c300] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {lang === 'ja' ? '衝撃波' : lang === 'en' ? 'Shockwave' : '冲击波'}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-serif font-bold mb-3">
                  {lang === 'ja' ? 'Morenova 低強度衝撃波治療' :
                   lang === 'en' ? 'Morenova Low-Intensity Shockwave' :
                   lang === 'zh-TW' ? 'Morenova 低強度衝擊波治療' :
                   'Morenova 低强度冲击波治疗'}
                </h4>
                <ul className="space-y-2 mb-5">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle size={14} className="text-[#00c300] mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '薬不要・副作用なしの物理治療' : lang === 'en' ? 'Drug-free, no side effects' : lang === 'zh-TW' ? '無需藥物、無副作用' : '无需药物、无副作用'}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle size={14} className="text-[#00c300] mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '低強度衝撃波で陰茎血管新生を促進' : lang === 'en' ? 'Promotes penile neovascularization' : lang === 'zh-TW' ? '促進陰莖血管新生' : '促进阴茎血管新生'}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle size={14} className="text-[#00c300] mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '4回で1サイクル' : lang === 'en' ? '4 sessions per cycle' : lang === 'zh-TW' ? '4次為1個週期' : '4次为1个周期'}</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">{lang === 'ja' ? '初診 ¥33,000' : lang === 'en' ? 'First ¥33,000' : '初诊 ¥33,000'}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">{lang === 'ja' ? '4回 ¥126,000' : lang === 'en' ? '4x ¥126,000' : '4次 ¥126,000'}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">{lang === 'ja' ? '+幹細胞 ¥258,000' : lang === 'en' ? '+Stem ¥258,000' : '+干细胞 ¥258,000'}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Oral Medication */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#293f58] to-[#1a2a3e] px-5 py-3">
                <span className="text-white text-xs font-bold tracking-wide">
                  {lang === 'ja' ? '口服薬物治療' : lang === 'en' ? 'Oral Medication' : lang === 'zh-TW' ? '口服藥物治療' : '口服药物治疗'}
                </span>
              </div>
              <div className="p-6">
                <div className="w-10 h-10 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center mb-4">
                  <Syringe size={20} />
                </div>
                <div className="space-y-0">
                  {ED_ORAL_MEDICATIONS.map((med, j) => (
                    <div key={j} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-600">{med.name}</span>
                      <span className="text-sm font-bold text-[#293f58]">{med.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: ICI */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#1a4a6e] to-[#293f58] px-5 py-3">
                <span className="text-white text-xs font-bold tracking-wide">
                  {lang === 'ja' ? 'ICI 海綿体注射' : lang === 'en' ? 'ICI Injection' : lang === 'zh-TW' ? 'ICI 海綿體注射' : 'ICI 海绵体注射'}
                </span>
              </div>
              <div className="p-6">
                <div className="w-10 h-10 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center mb-4">
                  <Shield size={20} />
                </div>
                <ul className="space-y-2 mb-5">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-[#00c300] mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '口服薬が効かない場合の進化形治療' : lang === 'en' ? 'Advanced option when oral meds are ineffective' : lang === 'zh-TW' ? '口服藥物無效時的進階選擇' : '对口服药物无效时的进阶选择'}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-[#00c300] mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '血管拡張剤を直接注射' : lang === 'en' ? 'Direct injection of vasodilator' : lang === 'zh-TW' ? '直接注射血管擴張劑' : '直接注射血管扩张剂'}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-[#00c300] mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '効果が迅速かつ確実' : lang === 'en' ? 'Rapid and reliable results' : lang === 'zh-TW' ? '效果迅速且確實' : '效果迅速且确实'}</span>
                  </li>
                </ul>
                <div className="text-center pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold font-serif text-[#293f58]">¥55,000</span>
                  <span className="text-sm text-gray-400">/{lang === 'ja' ? '回' : lang === 'en' ? 'session' : '次'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            5. LOH Section
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#293f58] text-xs tracking-widest uppercase font-bold">{t.lohTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.lohTitle[lang]}</h3>
          </div>

          {/* Symptoms Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
            {LOH_SYMPTOMS.map((symptom, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 text-sm font-medium hover:shadow-md transition">
                <Activity size={16} className="text-[#293f58] shrink-0" />
                <span>{symptom[lang]}</span>
              </div>
            ))}
          </div>

          {/* Diagnostic Flow */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 font-serif">
              <Stethoscope size={20} className="text-[#293f58]" />
              {lang === 'ja' ? '診断・治療の流れ' : lang === 'en' ? 'Diagnostic & Treatment Flow' : lang === 'zh-TW' ? '診斷與治療流程' : '诊断与治疗流程'}
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              {LOH_FLOW.map((step, i) => (
                <div key={i} className="flex-1 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#293f58] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {step.step}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{step.title[lang]}</span>
                  {i < LOH_FLOW.length - 1 && (
                    <ArrowRight size={16} className="text-gray-300 hidden md:block shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Options */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-[#293f58] to-[#1a2a3e] px-6 py-4 text-white">
              <h3 className="font-bold flex items-center gap-2 font-serif">
                <Award size={18} />
                {lang === 'ja' ? '治療オプション' : lang === 'en' ? 'Treatment Options' : lang === 'zh-TW' ? '治療方案' : '治疗方案'}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {LOH_TREATMENTS.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition">
                  <span className="text-sm text-gray-700">{item.name[lang]}</span>
                  <span className="text-sm font-bold text-[#00c300]">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================
            6. Additional Services — 深色品牌圆角区块 (Hyogo Centers 风格)
            ======================================== */}
        <div className="mb-24 bg-[#293f58] text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
          <div className="relative z-10 text-center mb-12">
            <span className="text-[#00c300] text-xs tracking-[0.3em] uppercase font-bold">{t.additionalTag[lang]}</span>
            <h3 className="text-3xl font-serif mt-3">{t.additionalTitle[lang]}</h3>
          </div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {ADDITIONAL_SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition group text-center">
                  <div className="flex justify-center mb-3 text-[#00c300] group-hover:scale-110 transition"><Icon size={28} /></div>
                  <h4 className="font-bold text-sm mb-1">{service.title[lang]}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{service.price[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================
          7. Medical Team — Hyogo 风格医师卡
          ======================================== */}
      <div className="bg-[#f7f6f0] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#293f58] text-xs tracking-widest uppercase font-bold">{t.doctorTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.doctorTitle[lang]}</h3>
          </div>

          {/* 3 Doctor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Dr. Nakaki */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="bg-gradient-to-r from-[#293f58] to-[#3a5a7c] px-5 py-2.5">
                <span className="text-white text-xs font-bold tracking-wide">
                  {lang === 'ja' ? 'メンズ医師' : lang === 'en' ? 'Physician' : lang === 'zh-TW' ? '男性醫師' : '男性医师'}
                </span>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/concept/dr_nakaki01.png"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  alt="中木 義浩"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold text-gray-900 font-serif">
                  {lang === 'ja' ? '中木 義浩' : lang === 'en' ? 'Dr. Yoshihiro Nakaki' : '中木 義浩'}
                </h4>
                <p className="text-xs text-[#293f58] font-medium mt-1 mb-3">
                  {lang === 'ja' ? 'Wクリニック メンズ 医師' : lang === 'en' ? 'W CLINIC men\'s Physician' : lang === 'zh-TW' ? 'W診所 男性 醫師' : 'W诊所 男性 医师'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {lang === 'ja' ? '耳鼻咽喉科専門医' : lang === 'en' ? 'ENT Specialist' : lang === 'zh-TW' ? '耳鼻喉科專門醫' : '耳鼻喉科专门医'}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {lang === 'ja' ? '補聴器相談医' : lang === 'en' ? 'Hearing Aid Consultant' : lang === 'zh-TW' ? '助聽器諮詢醫' : '助听器咨询医'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dr. Uemura — 总监修 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-[#293f58]/30 group">
              <div className="bg-gradient-to-r from-[#293f58] to-[#1a2a3e] px-5 py-2.5 flex items-center justify-between">
                <span className="text-[#00c300] text-xs font-bold tracking-wide">
                  {lang === 'ja' ? '総合監修' : lang === 'en' ? 'General Supervisor' : lang === 'zh-TW' ? '總監修' : '总监修'}
                </span>
                <Award size={14} className="text-[#00c300]" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/concept/dr_uemura01.png"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  alt="植村 天受"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold text-gray-900 font-serif">
                  {lang === 'ja' ? '植村 天受 教授' : lang === 'en' ? 'Prof. Uemura Tenju' : '植村 天受 教授'}
                </h4>
                <p className="text-xs text-[#293f58] font-medium mt-1 mb-3">
                  {lang === 'ja' ? '泌尿器科専門医・指導医' : lang === 'en' ? 'Board-Certified Urologist' : lang === 'zh-TW' ? '泌尿器科專科醫生·指導醫生' : '泌尿科专科医生·指导医生'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full">40{lang === 'en' ? 'yr+' : '年+'}</span>
                  <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full">PhD Nijmegen</span>
                  <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {lang === 'ja' ? '元理事' : lang === 'en' ? 'Fmr Director' : '前理事'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dr. Adachi */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="bg-gradient-to-r from-[#3a5a7c] to-[#293f58] px-5 py-2.5">
                <span className="text-white text-xs font-bold tracking-wide">
                  {lang === 'ja' ? '理事長' : lang === 'en' ? 'Director' : lang === 'zh-TW' ? '理事長' : '理事长'}
                </span>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/concept/dr_adachi01.png"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  alt="足立 真由美"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold text-gray-900 font-serif">
                  {lang === 'ja' ? '足立 真由美' : lang === 'en' ? 'Dr. Mayumi Adachi' : '足立 真由美'}
                </h4>
                <p className="text-xs text-[#293f58] font-medium mt-1 mb-3">
                  {lang === 'ja' ? '医療法人涼葵会 理事長' : lang === 'en' ? 'Medical Corp. Director' : lang === 'zh-TW' ? '醫療法人涼葵會 理事長' : '医疗法人凉葵会 理事长'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {lang === 'ja' ? 'W CLINIC創設者' : lang === 'en' ? 'W CLINIC Founder' : 'W CLINIC创始人'}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {lang === 'ja' ? '和歌山県立医大卒' : lang === 'en' ? 'Wakayama Med. Univ.' : '和歌山县立医大'}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {lang === 'ja' ? '医学博士' : lang === 'en' ? 'M.D., Ph.D.' : '医学博士'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Uemura Detail Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0 mx-auto md:mx-0" style={{ boxShadow: '8px 8px 0px 0px #293f58' }}>
                <Image
                  src="https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/concept/dr_uemura01.png"
                  fill
                  className="object-cover"
                  alt="植村天受 教授"
                  sizes="128px"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 font-serif">
                  {lang === 'ja' ? '植村天受 教授' : lang === 'en' ? 'Prof. Uemura Tenju' : '植村天受 教授'}
                </h3>
                <p className="text-sm text-[#293f58] font-medium mb-4 border-l-2 border-[#00c300] pl-3">
                  {lang === 'ja' ? 'Wクリニック メンズ 総合監修' : lang === 'en' ? 'W CLINIC men\'s General Supervisor' : lang === 'zh-TW' ? 'W診所 男性 總監修' : 'W诊所 男性 总监修'}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  {[
                    { ja: '日本泌尿器科学会 専門医・指導医/元理事', en: 'Japanese Urological Association Board-Certified Specialist / Former Director', 'zh-TW': '日本泌尿器科學會 專門醫生·指導醫生/前理事', 'zh-CN': '日本泌尿科学会 专门医生·指导医生/前理事' },
                    { ja: '日本腎臓学会 専門医・指導医', en: 'Japanese Society of Nephrology Board-Certified Specialist', 'zh-TW': '日本腎臟學會 專門醫生·指導醫生', 'zh-CN': '日本肾脏学会 专门医生·指导医生' },
                    { ja: '日本透析医学会 専門医・指導医', en: 'Japanese Society for Dialysis Therapy Board-Certified Specialist', 'zh-TW': '日本透析醫學會 專門醫生·指導醫生', 'zh-CN': '日本透析医学会 专门医生·指导医生' },
                    { ja: '近畿大学医学部泌尿器科 元主任教授/元副院長', en: 'Kindai University Urology Former Chief Professor / Former Vice President', 'zh-TW': '近畿大學醫學部泌尿器科 前主任教授/前副院長', 'zh-CN': '近畿大学医学部泌尿科 前主任教授/前副院长' },
                    { ja: '大阪腎泌尿疾患研究財団 代表理事', en: 'Osaka Kidney & Urological Research Foundation Representative Director', 'zh-TW': '大阪腎泌尿疾患研究財團 代表理事', 'zh-CN': '大阪肾泌尿疾病研究财团 代表理事' },
                    { ja: '公益財団法人 大阪腎臓バンク 理事', en: 'Public Interest Foundation Osaka Kidney Bank Director', 'zh-TW': '公益財團法人 大阪腎臟庫 理事', 'zh-CN': '公益财团法人 大阪肾脏库 理事' },
                    { ja: 'オランダ・ナイメヘン大学 医学博士(PhD)', en: 'PhD in Medicine, Radboud University Nijmegen, Netherlands', 'zh-TW': '荷蘭奈梅亨大學 醫學博士(PhD)', 'zh-CN': '荷兰奈梅亨大学 医学博士(PhD)' },
                    { ja: '奈良県立医科大学卒、40年以上の泌尿器科臨床経験', en: 'Nara Medical University, 40+ years of urology clinical experience', 'zh-TW': '奈良縣立醫科大學畢業，40年以上泌尿器科臨床經驗', 'zh-CN': '奈良县立医科大学毕业，40年以上泌尿科临床经验' },
                    { ja: 'World Journal of Urology, International Journal of Urology 編委', en: 'World Journal of Urology, International Journal of Urology Editorial Board', 'zh-TW': 'World Journal of Urology, International Journal of Urology 編委', 'zh-CN': 'World Journal of Urology, International Journal of Urology 编委' },
                  ].map((cred, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-[#00c300] mt-0.5 shrink-0" />
                      <span>{(cred as Record<string, string>)[lang]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          8. Privacy & Comfort — Hyogo 认证资质风格
          ======================================== */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="text-[#293f58] text-xs tracking-widest uppercase font-bold">{t.privacyTag[lang]}</span>
          <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.privacyTitle[lang]}</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PRIVACY_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group text-center">
                <div className="w-12 h-12 bg-[#293f58] text-[#00c300] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                  <Icon size={22} />
                </div>
                <h4 className="text-base font-bold text-gray-800 mb-2 font-serif">{feature.title[lang]}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.desc[lang]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================
          9. Access — 带地图的 Hyogo 风格
          ======================================== */}
      <div className="bg-[#f7f6f0] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#293f58] text-xs tracking-widest uppercase font-bold">{t.accessTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.accessTitle[lang]}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Umeda */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src="https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/material02/img/top/info_umeda.png"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="W CLINIC men's 梅田院"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#293f58] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {lang === 'ja' ? '梅田院' : lang === 'en' ? 'Umeda Clinic' : '梅田院'}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center shrink-0"><MapPin size={16} /></div>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '〒530-0001 大阪市北区梅田2-1-21 レイズウメダビル2階' :
                     lang === 'en' ? '2F Rays Umeda Bldg, 2-1-21 Umeda, Kita-ku, Osaka 530-0001' :
                     lang === 'zh-TW' ? '〒530-0001 大阪市北區梅田2-1-21 レイズウメダビル2樓' :
                     '〒530-0001 大阪市北区梅田2-1-21 レイズウメダビル2层'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center shrink-0"><Train size={16} /></div>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '西梅田駅10番出口直結' :
                     lang === 'en' ? 'Directly connected to Nishi-Umeda Station Exit 10' :
                     lang === 'zh-TW' ? '西梅田站10號出口直結' :
                     '西梅田站10号出口直达'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center shrink-0"><Clock size={16} /></div>
                  <p className="text-sm text-gray-600">10:00 - 19:00</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center shrink-0"><Phone size={16} /></div>
                  <p className="text-sm text-gray-600">06-4708-3666</p>
                </div>
              </div>
            </div>

            {/* Kitashinchi */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src="https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/access_map02.jpg"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="W CLINIC men's 北新地院"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#293f58] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {lang === 'ja' ? '北新地院' : lang === 'en' ? 'Kitashinchi Clinic' : '北新地院'}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center shrink-0"><MapPin size={16} /></div>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '〒530-0002 大阪市北区曽根崎新地1丁目7-30 北新地ビル2〜4階' :
                     lang === 'en' ? '2-4F Kitashinchi Bldg, 1-7-30 Sonezaki Shinchi, Kita-ku, Osaka 530-0002' :
                     lang === 'zh-TW' ? '〒530-0002 大阪市北區曽根崎新地1丁目7-30 北新地ビル2〜4樓' :
                     '〒530-0002 大阪市北区曽根崎新地1丁目7-30 北新地ビル2〜4层'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center shrink-0"><Train size={16} /></div>
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? 'JR北新地駅 F92出口 徒歩2分' :
                     lang === 'en' ? 'JR Kitashinchi Sta. Exit F92, 2 min walk' :
                     lang === 'zh-TW' ? 'JR北新地站 F92出口 步行2分鐘' :
                     'JR北新地站 F92出口 步行2分钟'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center shrink-0"><Clock size={16} /></div>
                  <p className="text-sm text-gray-600">10:00 - 19:00</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#293f58]/10 text-[#293f58] rounded-full flex items-center justify-center shrink-0"><Phone size={16} /></div>
                  <p className="text-sm text-gray-600">06-4708-3666</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          10. CTA Section
          ======================================== */}
      <section id="consultation" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#293f58] to-[#1a2a3e]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t.ctaTitle[lang]}</h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            {lang === 'ja' ? '植村天受教授の専門チームが、あなたのお悩みに対応します' :
             lang === 'en' ? 'Prof. Uemura Tenju\'s expert team is ready to help you' :
             lang === 'zh-TW' ? '植村天受教授的專業團隊，為您解決男性健康問題' :
             '植村天受教授的专业团队，为您解决男性健康问题'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={guideSlug ? `/wclinic-mens/initial-consultation?guide=${guideSlug}` : '/wclinic-mens/initial-consultation'}
              className="inline-flex items-center justify-center gap-3 bg-[#00c300] text-white px-8 py-4 rounded-full font-bold hover:bg-[#009a00] transition-all shadow-lg"
            >
              {t.ctaButtonInitial[lang]} <ArrowRight size={18} />
            </Link>
            <Link
              href={guideSlug ? `/wclinic-mens/remote-consultation?guide=${guideSlug}` : '/wclinic-mens/remote-consultation'}
              className="inline-flex items-center justify-center gap-3 bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all border border-white/20"
            >
              {t.ctaButtonRemote[lang]} <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex justify-center gap-8 text-sm text-white/40 mt-8">
            <span className="flex items-center gap-2"><Lock size={14} /> {lang === 'ja' ? '安全なお支払い' : lang === 'en' ? 'Secure Payment' : '安全支付'}</span>
            <span className="flex items-center gap-2"><Shield size={14} /> {lang === 'ja' ? '持牌旅行社保障' : lang === 'en' ? 'Licensed Travel Agency' : '持牌旅行社保障'}</span>
          </div>
        </div>
      </section>

      {/* ========================================
          11. Legal Footer
          ======================================== */}
      {!isGuideEmbed && (
        <section className="py-6 bg-gray-100 text-center">
          <div className="max-w-4xl mx-auto px-6 space-y-1">
            <p className="text-xs text-gray-400">
              {lang === 'ja'
                ? '本ページの情報は参考です。具体的な診療方針は医師の面診をもとに決定されます'
                : lang === 'en'
                ? 'Information on this page is for reference only. Specific treatment plans are determined during in-person consultation.'
                : lang === 'zh-TW'
                ? '本頁資訊僅供參考，具體診療方案以醫生面診為準'
                : '本页信息仅供参考，具体诊疗方案以医生面诊为准'}
            </p>
            <p className="text-xs text-gray-400">
              {lang === 'ja'
                ? 'ED/LOH/AGA等の治療は自由診療です（一部泌尿器科項目は保険適用可）'
                : lang === 'en'
                ? 'ED/LOH/AGA treatments are self-pay (some urology services may be covered by insurance).'
                : lang === 'zh-TW'
                ? 'ED/LOH/AGA等治療屬於自由診療（部分泌尿科項目可用保險）'
                : 'ED/LOH/AGA等治疗属于自由诊疗（部分泌尿科项目可用保险）'}
            </p>
            <p className="text-xs text-gray-400">
              {lang === 'ja'
                ? '旅行サービスは 新島交通株式会社 が提供 ｜ 大阪府知事登録旅行業 第2-3115号'
                : lang === 'en'
                ? 'Travel services provided by Niijima Kotsu Co., Ltd. | Osaka Prefecture Registered Travel Agency No. 2-3115'
                : '旅行服务由 新岛交通株式会社 提供 ｜ 大阪府知事登録旅行業 第2-3115号'}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
