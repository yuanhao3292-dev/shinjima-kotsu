'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, Train,
  Award, Shield, Heart,
  Syringe, Sparkles, CheckCircle,
  ArrowRight,
  Lock, Users, Activity,
  Zap, Eye,
  Building2, Scissors,
  GraduationCap, Star, ShieldCheck,
  Stethoscope, Droplets,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// ======================================
// Hero Image
// ======================================
export const WCLINIC_MENS_HERO_IMAGE = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2000&auto=format&fit=crop';

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
    ja: '植村天受教授が率いる男性健康総合診療センター。日本泌尿器科学会認定専科医、40年以上の臨床経験。ED勃起機能障害、男性更年期(LOH症候群)、AGA脱毛、男性アンチエイジング等のワンストップ診療。完全予約制、個室完備、プライバシー保護。',
    'zh-TW': '植村天受教授領銜的男性健康綜合診療中心。日本泌尿器科學會認證專科醫生，40年以上臨床經驗。提供ED勃起功能障礙、男性更年期(LOH綜合徵)、AGA脫髮、男性抗衰美容等一站式診療服務。全預約制，獨立診室，保護您的隱私。',
    'zh-CN': '植村天受教授领衔的男性健康综合诊疗中心。日本泌尿科学会认证专科医生，40年以上临床经验。提供ED勃起功能障碍、男性更年期(LOH综合征)、AGA脱发、男性抗衰美容等一站式诊疗服务。全预约制，独立诊室，保护您的隐私。',
    en: 'A comprehensive men\'s health center led by Professor Uemura Tenju. Board-certified urologist with 40+ years of clinical experience. One-stop treatment for ED, male menopause (LOH syndrome), AGA hair loss, and men\'s anti-aging aesthetics. Fully appointment-based with private consultation rooms.',
  } as Record<Language, string>,
  ctaButton: {
    ja: '予約相談',
    'zh-TW': '預約諮詢',
    'zh-CN': '预约咨询',
    en: 'Book Consultation',
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
    value: '40',
    unit: { ja: '年+', 'zh-TW': '年+', 'zh-CN': '年+', en: 'Yrs+' } as Record<Language, string>,
    label: { ja: '臨床経験', 'zh-TW': '臨床經驗', 'zh-CN': '临床经验', en: 'Clinical Exp.' } as Record<Language, string>,
  },
  {
    value: '30',
    unit: { ja: '+', 'zh-TW': '+', 'zh-CN': '+', en: '+' } as Record<Language, string>,
    label: { ja: '学会会員', 'zh-TW': '學會會員', 'zh-CN': '学会会员', en: 'Memberships' } as Record<Language, string>,
  },
  {
    value: '2',
    unit: { ja: '院', 'zh-TW': '院', 'zh-CN': '院', en: 'Clinics' } as Record<Language, string>,
    label: { ja: '大阪拠点', 'zh-TW': '大阪據點', 'zh-CN': '大阪据点', en: 'Osaka Locations' } as Record<Language, string>,
  },
  {
    value: '全',
    unit: { ja: '予約', 'zh-TW': '預約', 'zh-CN': '预约', en: 'Appt.' } as Record<Language, string>,
    label: { ja: 'プライバシー保障', 'zh-TW': '隱私保障', 'zh-CN': '隐私保障', en: 'Privacy' } as Record<Language, string>,
  },
];

const CORE_SERVICES = [
  {
    icon: <Syringe size={24} />,
    title: { ja: 'ED治療', 'zh-TW': 'ED治療', 'zh-CN': 'ED治疗', en: 'ED Treatment' } as Record<Language, string>,
    desc: {
      ja: 'Morenova衝撃波治療、口服薬(Cialis/Viagra)、海綿体注射(ICI)、原因に応じた複数の治療法',
      'zh-TW': 'Morenova衝擊波治療、口服藥物(Cialis/Viagra)、海綿體注射(ICI)，多種治療方案根據病因精準對應',
      'zh-CN': 'Morenova冲击波治疗、口服药物(Cialis/Viagra)、海绵体注射(ICI)，多种治疗方案根据病因精准对应',
      en: 'Morenova shockwave therapy, oral medications (Cialis/Viagra), intracavernosal injection (ICI) — multiple approaches tailored to the cause',
    } as Record<Language, string>,
  },
  {
    icon: <Activity size={24} />,
    title: { ja: '男性更年期(LOH)', 'zh-TW': '男性更年期(LOH)', 'zh-CN': '男性更年期(LOH)', en: 'Male Menopause (LOH)' } as Record<Language, string>,
    desc: {
      ja: 'テストステロン検査+問診評価→個人化ホルモン補充療法(HRT)、Sustanon注射、Androforte外用',
      'zh-TW': '睾酮檢測+問診評估→個性化荷爾蒙替代療法(HRT)，Sustanon注射、Androforte外用',
      'zh-CN': '睾酮检测+问诊评估→个性化荷尔蒙替代疗法(HRT)，Sustanon注射、Androforte外用',
      en: 'Testosterone testing + consultation → personalized hormone replacement therapy (HRT), Sustanon injection, Androforte topical',
    } as Record<Language, string>,
  },
  {
    icon: <Users size={24} />,
    title: { ja: 'AGA脱毛治療', 'zh-TW': 'AGA脫髮治療', 'zh-CN': 'AGA脱发治疗', en: 'AGA Hair Loss Treatment' } as Record<Language, string>,
    desc: {
      ja: '内服薬(Propecia/Dutasteride)+外用(Minoxidil)+Hydra Gentle+幹細胞注射、総合発毛プラン',
      'zh-TW': '內服藥(Propecia/Dutasteride)+外用(Minoxidil)+Hydra Gentle+幹細胞注射，綜合生髮方案',
      'zh-CN': '内服药(Propecia/Dutasteride)+外用(Minoxidil)+Hydra Gentle+干细胞注射，综合生发方案',
      en: 'Oral (Propecia/Dutasteride) + topical (Minoxidil) + Hydra Gentle + stem cell injection — comprehensive hair growth plan',
    } as Record<Language, string>,
  },
  {
    icon: <Sparkles size={24} />,
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
  { name: 'Viagra (50mg)', price: '¥1,280' },
  { name: 'Sildenafil (50mg)', price: '¥1,000' },
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
    icon: <Scissors size={22} />,
    title: { ja: 'AGA脱毛治療', 'zh-TW': 'AGA脫髮治療', 'zh-CN': 'AGA脱发治疗', en: 'AGA Hair Loss' } as Record<Language, string>,
    price: { ja: 'W Original AGA Set ¥14,500/月〜', 'zh-TW': 'W Original AGA Set ¥14,500/月起', 'zh-CN': 'W Original AGA Set ¥14,500/月起', en: 'W Original AGA Set from ¥14,500/mo' } as Record<Language, string>,
  },
  {
    icon: <Droplets size={22} />,
    title: { ja: 'NMN点滴', 'zh-TW': 'NMN點滴', 'zh-CN': 'NMN点滴', en: 'NMN Drip' } as Record<Language, string>,
    price: { ja: '¥32,780〜', 'zh-TW': '從¥32,780起', 'zh-CN': '从¥32,780起', en: 'From ¥32,780' } as Record<Language, string>,
  },
  {
    icon: <Zap size={22} />,
    title: { ja: 'エクソソーム療法', 'zh-TW': '外泌體療法', 'zh-CN': '外泌体疗法', en: 'Exosome Therapy' } as Record<Language, string>,
    price: { ja: '¥123,200〜', 'zh-TW': '從¥123,200起', 'zh-CN': '从¥123,200起', en: 'From ¥123,200' } as Record<Language, string>,
  },
  {
    icon: <Eye size={22} />,
    title: { ja: 'HIFU超音波', 'zh-TW': 'HIFU超音刀', 'zh-CN': 'HIFU超声刀', en: 'HIFU Ultrasound' } as Record<Language, string>,
    price: { ja: '¥27,500〜', 'zh-TW': '從¥27,500起', 'zh-CN': '从¥27,500起', en: 'From ¥27,500' } as Record<Language, string>,
  },
  {
    icon: <Star size={22} />,
    title: { ja: '糸リフト', 'zh-TW': '線雕提升', 'zh-CN': '线雕提升', en: 'Thread Lift' } as Record<Language, string>,
    price: { ja: '¥19,800/本〜', 'zh-TW': '從¥19,800/根起', 'zh-CN': '从¥19,800/根起', en: 'From ¥19,800/thread' } as Record<Language, string>,
  },
  {
    icon: <Heart size={22} />,
    title: { ja: 'Morenovaいびき治療', 'zh-TW': 'Morenova鼾症治療', 'zh-CN': 'Morenova鼾症治疗', en: 'Morenova Snoring Treatment' } as Record<Language, string>,
    price: { ja: '¥88,000', 'zh-TW': '¥88,000', 'zh-CN': '¥88,000', en: '¥88,000' } as Record<Language, string>,
  },
];

// ======================================
// Component
// ======================================

interface WClinicMensContentProps {
  isGuideEmbed?: boolean;
}

export default function WClinicMensContent({ isGuideEmbed }: WClinicMensContentProps) {
  const lang = useLanguage();

  return (
    <div className="min-h-screen bg-white">

      {/* ━━━━━━━━ Hero Section ━━━━━━━━ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src={WCLINIC_MENS_HERO_IMAGE}
          alt="W CLINIC men's"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            {/* Tagline */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-white/40" />
              <span className="text-xs tracking-[0.3em] text-white/70 uppercase">
                {t.heroTagline[lang]}
              </span>
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

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-amber-400">
                    {stat.value}<span className="text-sm text-amber-400/70 ml-0.5">{stat.unit[lang]}</span>
                  </div>
                  <div className="text-xs text-white/50 mt-1">{stat.label[lang]}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={isGuideEmbed ? '#consultation' : '/wclinic-mens/initial-consultation'}
                className="inline-flex items-center justify-center gap-3 bg-amber-500 text-white px-8 py-4 rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl"
              >
                {t.ctaButton[lang]} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Core Services ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">
              {t.coreServicesTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.coreServicesTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {CORE_SERVICES.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title[lang]}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ ED Treatment Detail ━━━━━━━━ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">
              {t.edTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.edTitle[lang]}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t.edSubtitle[lang]}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Morenova */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-3">
                {lang === 'ja' ? 'Morenova 低強度衝撃波治療' :
                 lang === 'en' ? 'Morenova Low-Intensity Shockwave' :
                 lang === 'zh-TW' ? 'Morenova 低強度衝擊波治療' :
                 'Morenova 低强度冲击波治疗'}
              </h3>
              <ul className="space-y-2 mb-5">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? '薬不要・副作用なしの物理治療' : lang === 'en' ? 'Drug-free, no side effects — physical therapy' : lang === 'zh-TW' ? '無需藥物、無副作用的物理治療' : '无需药物、无副作用的物理治疗'}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? '低強度衝撃波で陰茎血管新生を促進' : lang === 'en' ? 'Low-intensity shockwaves promote penile neovascularization' : lang === 'zh-TW' ? '通過低強度衝擊波促進陰莖血管新生' : '通过低强度冲击波促进阴茎血管新生'}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? '4回で1サイクル' : lang === 'en' ? '4 sessions per treatment cycle' : lang === 'zh-TW' ? '4次療程為1個週期' : '4次疗程为1个周期'}</span>
                </li>
              </ul>
              <div className="border-t border-gray-100 pt-4 space-y-1.5">
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{lang === 'ja' ? '初診' : lang === 'en' ? 'First visit' : lang === 'zh-TW' ? '初診' : '初诊'}</span>
                  <span className="font-semibold text-gray-900">¥33,000</span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{lang === 'ja' ? '単回' : lang === 'en' ? 'Single' : lang === 'zh-TW' ? '單次' : '单次'}</span>
                  <span className="font-semibold text-gray-900">¥38,000</span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{lang === 'ja' ? '4回' : lang === 'en' ? '4 sessions' : lang === 'zh-TW' ? '4次' : '4次'}</span>
                  <span className="font-semibold text-gray-900">¥126,000</span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{lang === 'ja' ? '4回+幹細胞' : lang === 'en' ? '4 sessions + stem cells' : lang === 'zh-TW' ? '4次+幹細胞' : '4次+干细胞'}</span>
                  <span className="font-semibold text-gray-900">¥258,000</span>
                </div>
              </div>
            </div>

            {/* Card 2: Oral Medication */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                <Syringe size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-3">
                {lang === 'ja' ? '口服薬物治療' : lang === 'en' ? 'Oral Medication' : lang === 'zh-TW' ? '口服藥物治療' : '口服药物治疗'}
              </h3>
              <div className="space-y-0">
                {ED_ORAL_MEDICATIONS.map((med, j) => (
                  <div key={j} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{med.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{med.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: ICI */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                <Shield size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-3">
                {lang === 'ja' ? 'ICI 海綿体注射' : lang === 'en' ? 'ICI Intracavernosal Injection' : lang === 'zh-TW' ? 'ICI 海綿體注射' : 'ICI 海绵体注射'}
              </h3>
              <ul className="space-y-2 mb-5">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? '口服薬が効かない場合の進化形治療' : lang === 'en' ? 'Advanced option when oral medications are ineffective' : lang === 'zh-TW' ? '口服藥物無效時的進階選擇' : '对口服药物无效时的进阶选择'}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? '血管拡張剤を直接注射' : lang === 'en' ? 'Direct injection of vasodilator' : lang === 'zh-TW' ? '直接注射血管擴張劑' : '直接注射血管扩张剂'}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <span>{lang === 'ja' ? '効果が迅速かつ確実' : lang === 'en' ? 'Rapid and reliable results' : lang === 'zh-TW' ? '效果迅速且確實' : '效果迅速且确实'}</span>
                </li>
              </ul>
              <div className="border-t border-gray-100 pt-4">
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">¥55,000</span>
                  <span className="text-sm text-gray-400">/{lang === 'ja' ? '回' : lang === 'en' ? 'session' : '次'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ LOH Section ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">
              {t.lohTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.lohTitle[lang]}</h2>
          </div>

          {/* Symptoms Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
            {LOH_SYMPTOMS.map((symptom, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm font-medium">
                <Activity size={16} className="shrink-0" />
                <span>{symptom[lang]}</span>
              </div>
            ))}
          </div>

          {/* Diagnostic Flow */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Stethoscope size={20} className="text-amber-600" />
              {lang === 'ja' ? '診断・治療の流れ' : lang === 'en' ? 'Diagnostic & Treatment Flow' : lang === 'zh-TW' ? '診斷與治療流程' : '诊断与治疗流程'}
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              {LOH_FLOW.map((step, i) => (
                <div key={i} className="flex-1 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
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
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Award size={18} />
                {lang === 'ja' ? '治療オプション' : lang === 'en' ? 'Treatment Options' : lang === 'zh-TW' ? '治療方案' : '治疗方案'}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {LOH_TREATMENTS.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-6 py-4">
                  <span className="text-sm text-gray-700">{item.name[lang]}</span>
                  <span className="text-sm font-bold text-amber-600">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Additional Services ━━━━━━━━ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">
              {t.additionalTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.additionalTitle[lang]}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ADDITIONAL_SERVICES.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mx-auto mb-3">
                  {service.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{service.title[lang]}</h3>
                <p className="text-xs text-amber-600 font-medium">{service.price[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Medical Team ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">
              {t.doctorTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.doctorTitle[lang]}</h2>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Photo placeholder */}
              <div className="w-32 h-32 bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl flex items-center justify-center text-white shrink-0 mx-auto md:mx-0">
                <GraduationCap size={40} />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {lang === 'ja' ? '植村天受 教授' : lang === 'en' ? 'Prof. Uemura Tenju' : '植村天受 教授'}
                </h3>
                <p className="text-sm text-amber-600 font-medium mb-4">
                  {lang === 'ja' ? 'Wクリニック メンズ 総合監修' : lang === 'en' ? 'W CLINIC men\'s General Supervisor' : lang === 'zh-TW' ? 'W診所 男性 總監修' : 'W诊所 男性 总监修'}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '日本泌尿器科学会 専科医・指導医/前理事' : lang === 'en' ? 'Japanese Urological Association Board-Certified Specialist / Former Director' : lang === 'zh-TW' ? '日本泌尿器科學會 專科醫生·指導醫生/前理事' : '日本泌尿科学会 专科医生·指导医生/前理事'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '大阪腎泌尿疾患研究財団 代表理事' : lang === 'en' ? 'Osaka Kidney & Urological Research Foundation Representative Director' : lang === 'zh-TW' ? '大阪腎泌尿疾患研究財團 代表理事' : '大阪肾泌尿疾病研究财团 代表理事'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '公益財団法人 大阪腎臓バンク 理事' : lang === 'en' ? 'Public Interest Foundation Osaka Kidney Bank Director' : lang === 'zh-TW' ? '公益財團法人 大阪腎臟庫 理事' : '公益财团法人 大阪肾脏库 理事'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '近畿大学医学部附属病院 特任研究教授/前副院長' : lang === 'en' ? 'Kindai University Hospital Specially Appointed Research Professor / Former Vice President' : lang === 'zh-TW' ? '近畿大學醫學部附屬醫院 特聘研究教授/前副院長' : '近畿大学医学部附属医院 特聘研究教授/前副院长'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? 'オランダ・ナイメーヘン大学 医学博士(PhD)' : lang === 'en' ? 'PhD in Medicine, Radboud University Nijmegen, Netherlands' : lang === 'zh-TW' ? '荷蘭奈梅亨大學 醫學博士(PhD)' : '荷兰奈梅亨大学 医学博士(PhD)'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>{lang === 'ja' ? '40年以上の泌尿器科臨床経験' : lang === 'en' ? '40+ years of urology clinical experience' : lang === 'zh-TW' ? '40年以上泌尿器科臨床經驗' : '40年以上泌尿科临床经验'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>World Journal of Urology, International Journal of Urology {lang === 'ja' ? '編委' : lang === 'en' ? 'Editorial Board' : lang === 'zh-TW' ? '編委' : '编委'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Privacy & Comfort ━━━━━━━━ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">
              {t.privacyTag[lang]}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{t.privacyTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 mx-auto mb-3">
                <Lock size={22} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                {lang === 'ja' ? '完全予約制' : lang === 'en' ? 'Fully Appointment-Based' : lang === 'zh-TW' ? '全預約制' : '全预约制'}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'ja' ? '待ち時間なくスムーズに診療' : lang === 'en' ? 'No waiting, smooth consultation' : lang === 'zh-TW' ? '無需等候，順暢診療' : '无需等候，顺畅诊疗'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 mx-auto mb-3">
                <Shield size={22} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                {lang === 'ja' ? '男性専用個室' : lang === 'en' ? 'Men\'s Private Rooms' : lang === 'zh-TW' ? '男性專屬獨立診室' : '男性专属独立诊室'}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'ja' ? '完全個室で安心の診療環境' : lang === 'en' ? 'Fully private consultation environment' : lang === 'zh-TW' ? '完全獨立診室，安心診療' : '完全独立诊室，安心诊疗'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 mx-auto mb-3">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                {lang === 'ja' ? 'プライバシー保護' : lang === 'en' ? 'Privacy Protection' : lang === 'zh-TW' ? '隱私保護' : '隐私保护'}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'ja' ? '患者情報の完全管理' : lang === 'en' ? 'Complete patient data protection' : lang === 'zh-TW' ? '患者資料完全管理' : '患者信息完全管理'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Access ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-4">
              {t.accessTag[lang]}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{t.accessTitle[lang]}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Umeda */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-amber-600" />
                {lang === 'ja' ? '梅田院' : lang === 'en' ? 'Umeda Clinic' : '梅田院'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '〒530-0001 大阪市北区梅田2-1-21 レイズウメダビル2階' :
                     lang === 'en' ? '2F Rays Umeda Bldg, 2-1-21 Umeda, Kita-ku, Osaka 530-0001' :
                     lang === 'zh-TW' ? '〒530-0001 大阪市北區梅田2-1-21 レイズウメダビル2樓' :
                     '〒530-0001 大阪市北区梅田2-1-21 レイズウメダビル2层'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Train size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '西梅田駅10番出口直結' :
                     lang === 'en' ? 'Directly connected to Nishi-Umeda Station Exit 10' :
                     lang === 'zh-TW' ? '西梅田站10號出口直結' :
                     '西梅田站10号出口直达'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">10:00 - 19:00</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">06-4708-3666</p>
                </div>
              </div>
            </div>

            {/* Kitashinchi */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-amber-600" />
                {lang === 'ja' ? '北新地院' : lang === 'en' ? 'Kitashinchi Clinic' : '北新地院'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? '〒530-0002 大阪市北区曽根崎新地1丁目7-30 北新地ビル2〜4階' :
                     lang === 'en' ? '2-4F Kitashinchi Bldg, 1-7-30 Sonezaki Shinchi, Kita-ku, Osaka 530-0002' :
                     lang === 'zh-TW' ? '〒530-0002 大阪市北區曽根崎新地1丁目7-30 北新地ビル2〜4樓' :
                     '〒530-0002 大阪市北区曽根崎新地1丁目7-30 北新地ビル2〜4层'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Train size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    {lang === 'ja' ? 'JR北新地駅 F92出口 徒歩2分' :
                     lang === 'en' ? 'JR Kitashinchi Sta. Exit F92, 2 min walk' :
                     lang === 'zh-TW' ? 'JR北新地站 F92出口 步行2分鐘' :
                     'JR北新地站 F92出口 步行2分钟'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">10:00 - 19:00</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">06-4708-3666</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ CTA Section ━━━━━━━━ */}
      <section id="consultation" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle[lang]}</h2>
          <p className="text-lg text-white/60 mb-10">
            {lang === 'ja' ? '植村天受教授の専門チームが、あなたのお悩みに対応します' :
             lang === 'en' ? 'Prof. Uemura Tenju\'s expert team is ready to help you' :
             lang === 'zh-TW' ? '植村天受教授的專業團隊，為您解決男性健康問題' :
             '植村天受教授的专业团队，为您解决男性健康问题'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isGuideEmbed ? '#consultation' : '/wclinic-mens/initial-consultation'}
              className="inline-flex items-center justify-center gap-3 bg-amber-500 text-white px-8 py-4 rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg"
            >
              {t.ctaButtonInitial[lang]} <ArrowRight size={18} />
            </Link>
            <Link
              href={isGuideEmbed ? '#consultation' : '/wclinic-mens/remote-consultation'}
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

      {/* ━━━━━━━━ Legal Footer ━━━━━━━━ */}
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
