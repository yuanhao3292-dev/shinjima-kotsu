'use client';
import React from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, Train,
  Award, Stethoscope, Activity, Shield,
  Heart, Microscope, CheckCircle,
  Zap, Target, Radio,
  ArrowRight, Globe, Mail,
  Thermometer, Syringe, BedDouble, CalendarCheck,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

interface Props {
  isGuideEmbed?: boolean;
}

// ======================================
// 多语言翻译
// ======================================
const t = (obj: Record<Language, string>, lang: Language) => obj[lang] || obj['zh-TW'];

const tr = {
  // Hero
  heroTitle: {
    ja: 'IGTクリニック', 'zh-TW': 'IGT 診所', 'zh-CN': 'IGT 诊所', en: 'IGT Clinic',
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '血管内治療の専門クリニック', 'zh-TW': '血管內治療專門診所', 'zh-CN': '血管内治疗专门诊所', en: 'Specialized Endovascular Treatment Clinic',
  } as Record<Language, string>,
  heroText: {
    ja: '医療法人 龍志会 IGTクリニック。カテーテルによる血管内治療と\nハイパーサーミア（温熱療法）を組み合わせた癌治療を提供。\n標準治療で効果が得られなかった患者様に新たな選択肢をご提案します。',
    'zh-TW': '醫療法人 龍志會 IGT診所。結合導管血管內治療與\n溫熱療法（Hyperthermia）的癌症治療。\n為標準治療效果不佳的患者提供新的治療選擇。',
    'zh-CN': '医疗法人 龙志会 IGT诊所。结合导管血管内治疗与\n温热疗法（Hyperthermia）的癌症治疗。\n为标准治疗效果不佳的患者提供新的治疗选择。',
    en: 'IGT Clinic by Medical Corporation Ryushikai.\nCombining catheter-based endovascular therapy with\nhyperthermia for cancer treatment.\nOffering new options for patients with limited standard treatment response.',
  } as Record<Language, string>,
  limitBadge: {
    ja: '健康保険適用・セカンドオピニオン対応可', 'zh-TW': '日本健保適用·可提供第二意見', 'zh-CN': '日本健保适用·可提供第二意见', en: 'Insurance Covered · Second Opinion Available',
  } as Record<Language, string>,

  // Stats
  statsTag: { ja: '治療実績', 'zh-TW': '治療實績', 'zh-CN': '治疗实绩', en: 'Treatment Results' } as Record<Language, string>,
  statsTitle: { ja: 'IGTクリニックの実力', 'zh-TW': 'IGT 診所的實力', 'zh-CN': 'IGT 诊所的实力', en: 'IGT Clinic Strengths' } as Record<Language, string>,

  // Treatments
  treatTag: { ja: '治療方法', 'zh-TW': '治療方法', 'zh-CN': '治疗方法', en: 'Treatment Methods' } as Record<Language, string>,
  treatTitle: { ja: '2つの専門治療', 'zh-TW': '兩大專業治療', 'zh-CN': '两大专业治疗', en: 'Two Specialized Treatments' } as Record<Language, string>,

  igtTitle: {
    ja: '血管内治療（IGT）', 'zh-TW': '血管內治療（IGT）', 'zh-CN': '血管内治疗（IGT）', en: 'Endovascular Treatment (IGT)',
  } as Record<Language, string>,
  igtDesc: {
    ja: '直径1ミリ程の細いカテーテルを使い、がんに栄養を送る血管に直接抗がん剤を高濃度で注入。さらに血管を塞ぎ、がん細胞への栄養供給を遮断します。全身への副作用を最小限に抑えながら、腫瘍を効果的に縮小させます。',
    'zh-TW': '使用直徑約1毫米的微導管，直接向供養癌細胞的血管注入高濃度抗癌藥物，再封堵血管切斷癌細胞營養供應。在將全身副作用降至最低的同時，有效縮小腫瘤。',
    'zh-CN': '使用直径约1毫米的微导管，直接向供养癌细胞的血管注入高浓度抗癌药物，再封堵血管切断癌细胞营养供应。在将全身副作用降至最低的同时，有效缩小肿瘤。',
    en: 'Using a micro-catheter (approx. 1mm diameter), high-concentration anti-cancer drugs are injected directly into tumor-feeding blood vessels, which are then occluded to cut off cancer cell nutrition. This effectively shrinks tumors while minimizing systemic side effects.',
  } as Record<Language, string>,

  hyperTitle: {
    ja: 'ハイパーサーミア（温熱療法）', 'zh-TW': '溫熱療法（Hyperthermia）', 'zh-CN': '温热疗法（Hyperthermia）', en: 'Hyperthermia Treatment',
  } as Record<Language, string>,
  hyperDesc: {
    ja: 'がん組織を42℃以上に加温し、がん細胞を直接死滅させる治療法。正常細胞は熱に強いため影響を受けません。血管内治療や放射線、化学療法との併用で効果が高まります。',
    'zh-TW': '將癌組織加熱至42°C以上，直接殺滅癌細胞的治療方法。正常細胞耐熱性強，不受影響。與血管內治療、放射線及化療併用可增強效果。',
    'zh-CN': '将癌组织加热至42°C以上，直接杀灭癌细胞的治疗方法。正常细胞耐热性强，不受影响。与血管内治疗、放射线及化疗并用可增强效果。',
    en: 'A treatment that heats cancer tissue above 42°C to directly destroy cancer cells. Normal cells are heat-resistant and remain unaffected. Effectiveness is enhanced when combined with endovascular therapy, radiation, or chemotherapy.',
  } as Record<Language, string>,

  // Cancers
  cancerTag: { ja: '対応がん種', 'zh-TW': '適應癌種', 'zh-CN': '适应癌种', en: 'Treatable Cancers' } as Record<Language, string>,
  cancerTitle: { ja: '多種がんに対応', 'zh-TW': '多種癌症適應', 'zh-CN': '多种癌症适应', en: 'Multiple Cancer Types Treated' } as Record<Language, string>,

  // Advantages
  advTag: { ja: '治療の優位性', 'zh-TW': '治療優勢', 'zh-CN': '治疗优势', en: 'Treatment Advantages' } as Record<Language, string>,
  advTitle: { ja: 'IGT治療が選ばれる理由', 'zh-TW': '選擇 IGT 治療的理由', 'zh-CN': '选择 IGT 治疗的理由', en: 'Why Choose IGT Treatment' } as Record<Language, string>,

  // Flow
  flowTag: { ja: '治療の流れ', 'zh-TW': '治療流程', 'zh-CN': '治疗流程', en: 'Treatment Flow' } as Record<Language, string>,
  flowTitle: { ja: 'ご相談から退院まで', 'zh-TW': '從諮詢到出院', 'zh-CN': '从咨询到出院', en: 'From Consultation to Discharge' } as Record<Language, string>,

  // Access
  accessTag: { ja: 'アクセス', 'zh-TW': '交通', 'zh-CN': '交通', en: 'Access' } as Record<Language, string>,
  accessTitle: { ja: '関西空港から最も近いがん治療クリニック', 'zh-TW': '距關西機場最近的癌症治療診所', 'zh-CN': '距关西机场最近的癌症治疗诊所', en: 'Closest Cancer Clinic to Kansai Airport' } as Record<Language, string>,

  // CTA
  ctaTitle: { ja: 'まずはご相談ください', 'zh-TW': '歡迎諮詢', 'zh-CN': '欢迎咨询', en: 'Contact Us' } as Record<Language, string>,
  ctaDesc: {
    ja: '標準治療で思うような結果が得られなかった方へ。IGTクリニックが新たな治療の選択肢をご提案いたします。',
    'zh-TW': '致標準治療效果不理想的患者。IGT診所為您提供新的治療選擇。',
    'zh-CN': '致标准治疗效果不理想的患者。IGT诊所为您提供新的治疗选择。',
    en: 'For patients who haven\'t achieved desired results with standard treatment. IGT Clinic offers new treatment options.',
  } as Record<Language, string>,
  ctaInitial: { ja: '前期相談サービス', 'zh-TW': '前期諮詢服務', 'zh-CN': '前期咨询服务', en: 'Initial Consultation' } as Record<Language, string>,
  ctaRemote: { ja: '遠隔診療サービス', 'zh-TW': '遠程會診服務', 'zh-CN': '远程会诊服务', en: 'Remote Consultation' } as Record<Language, string>,
  ctaInitialDesc: {
    ja: '病歴翻訳・IGTクリニック相談・治療可能性評価・費用概算',
    'zh-TW': '病歷翻譯·IGT診所諮詢·治療可行性評估·費用概算',
    'zh-CN': '病历翻译·IGT诊所咨询·治疗可行性评估·费用概算',
    en: 'Medical record translation · IGT Clinic consultation · Treatment feasibility · Cost estimation',
  } as Record<Language, string>,
  ctaRemoteDesc: {
    ja: 'IGTクリニック専門医とのオンライン診療・治療プラン策定・費用概算',
    'zh-TW': '與IGT診所專科醫生遠程視訊會診·治療方案制定·費用概算',
    'zh-CN': '与IGT诊所专科医生远程视频会诊·治疗方案制定·费用概算',
    en: 'Online consultation with IGT specialist · Treatment plan · Cost estimation',
  } as Record<Language, string>,
};

// ======================================
// 数据
// ======================================
const STATS = [
  { icon: Activity, value: '20+', label: { ja: '年間治療実績', 'zh-TW': '年治療經驗', 'zh-CN': '年治疗经验', en: 'Years Experience' } as Record<Language, string> },
  { icon: Stethoscope, value: '10+', label: { ja: '対応がん種', 'zh-TW': '適應癌種', 'zh-CN': '适应癌种', en: 'Cancer Types' } as Record<Language, string> },
  { icon: Shield, value: '80%', label: { ja: '症状改善率', 'zh-TW': '症狀改善率', 'zh-CN': '症状改善率', en: 'Improvement Rate' } as Record<Language, string> },
  { icon: Award, value: 'CIRSE', label: { ja: '国際学会受賞', 'zh-TW': '國際學會獲獎', 'zh-CN': '国际学会获奖', en: 'Intl. Award' } as Record<Language, string> },
];

const CANCERS = [
  { icon: Heart, name: { ja: '肝臓がん', 'zh-TW': '肝癌', 'zh-CN': '肝癌', en: 'Liver Cancer' } as Record<Language, string> },
  { icon: Zap, name: { ja: '乳がん', 'zh-TW': '乳腺癌', 'zh-CN': '乳腺癌', en: 'Breast Cancer' } as Record<Language, string> },
  { icon: Radio, name: { ja: '肺がん', 'zh-TW': '肺癌', 'zh-CN': '肺癌', en: 'Lung Cancer' } as Record<Language, string> },
  { icon: Target, name: { ja: '膵臓がん', 'zh-TW': '胰腺癌', 'zh-CN': '胰腺癌', en: 'Pancreatic Cancer' } as Record<Language, string> },
  { icon: Microscope, name: { ja: '胆管がん', 'zh-TW': '膽管癌', 'zh-CN': '胆管癌', en: 'Bile Duct Cancer' } as Record<Language, string> },
  { icon: Activity, name: { ja: '大腸がん', 'zh-TW': '大腸癌', 'zh-CN': '大肠癌', en: 'Colorectal Cancer' } as Record<Language, string> },
  { icon: Stethoscope, name: { ja: '胃がん', 'zh-TW': '胃癌', 'zh-CN': '胃癌', en: 'Gastric Cancer' } as Record<Language, string> },
  { icon: Shield, name: { ja: '腎臓がん', 'zh-TW': '腎癌', 'zh-CN': '肾癌', en: 'Renal Cancer' } as Record<Language, string> },
  { icon: Heart, name: { ja: '膀胱がん', 'zh-TW': '膀胱癌', 'zh-CN': '膀胱癌', en: 'Bladder Cancer' } as Record<Language, string> },
  { icon: Zap, name: { ja: '子宮がん', 'zh-TW': '子宮癌', 'zh-CN': '子宫癌', en: 'Uterine Cancer' } as Record<Language, string> },
  { icon: Target, name: { ja: '卵巣がん', 'zh-TW': '卵巢癌', 'zh-CN': '卵巢癌', en: 'Ovarian Cancer' } as Record<Language, string> },
  { icon: Radio, name: { ja: '頭頸部がん', 'zh-TW': '頭頸部癌', 'zh-CN': '头颈部癌', en: 'Head & Neck Cancer' } as Record<Language, string> },
];

const ADVANTAGES = [
  { icon: Syringe, title: { ja: '低侵襲', 'zh-TW': '微創', 'zh-CN': '微创', en: 'Minimally Invasive' } as Record<Language, string>, desc: { ja: '大きな切開なし。カテーテル挿入のみで治療可能。身体への負担が少なく、高齢者にも適応。', 'zh-TW': '無需大切口，僅通過導管插入即可治療。身體負擔小，高齡患者也適用。', 'zh-CN': '无需大切口，仅通过导管插入即可治疗。身体负担小，高龄患者也适用。', en: 'No major incisions. Treatment via catheter insertion only. Low physical burden, suitable for elderly patients.' } as Record<Language, string> },
  { icon: Shield, title: { ja: '副作用が少ない', 'zh-TW': '副作用少', 'zh-CN': '副作用少', en: 'Fewer Side Effects' } as Record<Language, string>, desc: { ja: '薬剤を腫瘍に直接投与するため、全身化学療法に比べて副作用が大幅に軽減。', 'zh-TW': '藥物直接注入腫瘤，相比全身化療副作用大幅減少。', 'zh-CN': '药物直接注入肿瘤，相比全身化疗副作用大幅减少。', en: 'Drugs delivered directly to tumor, significantly reducing side effects compared to systemic chemotherapy.' } as Record<Language, string> },
  { icon: BedDouble, title: { ja: '短期入院', 'zh-TW': '短期住院', 'zh-CN': '短期住院', en: 'Short Hospital Stay' } as Record<Language, string>, desc: { ja: '治療後2〜3日で退院可能。日常生活への復帰が早い。', 'zh-TW': '治療後2-3天即可出院，可迅速恢復日常生活。', 'zh-CN': '治疗后2-3天即可出院，可迅速恢复日常生活。', en: 'Discharge possible 2-3 days after treatment. Quick return to daily life.' } as Record<Language, string> },
  { icon: CalendarCheck, title: { ja: '繰り返し治療可能', 'zh-TW': '可重複治療', 'zh-CN': '可重复治疗', en: 'Repeatable Treatment' } as Record<Language, string>, desc: { ja: '身体への負担が少ないため、必要に応じて複数回治療が可能。', 'zh-TW': '因身體負擔小，可根據需要進行多次治療。', 'zh-CN': '因身体负担小，可根据需要进行多次治疗。', en: 'Due to low physical burden, multiple treatments can be administered as needed.' } as Record<Language, string> },
];

const FLOW_STEPS = [
  { step: '01', icon: Mail, title: { ja: 'お問い合わせ', 'zh-TW': '諮詢聯繫', 'zh-CN': '咨询联系', en: 'Contact' } as Record<Language, string>, desc: { ja: '電話・メール・オンラインでご相談', 'zh-TW': '電話·郵件·線上諮詢', 'zh-CN': '电话·邮件·在线咨询', en: 'Phone, email, or online inquiry' } as Record<Language, string> },
  { step: '02', icon: Stethoscope, title: { ja: '初診・検査', 'zh-TW': '初診·檢查', 'zh-CN': '初诊·检查', en: 'First Visit & Tests' } as Record<Language, string>, desc: { ja: 'CT等の精密検査で治療計画を策定', 'zh-TW': 'CT等精密檢查，制定治療計劃', 'zh-CN': 'CT等精密检查，制定治疗计划', en: 'Detailed CT exams & treatment planning' } as Record<Language, string> },
  { step: '03', icon: BedDouble, title: { ja: '入院', 'zh-TW': '入院', 'zh-CN': '入院', en: 'Admission' } as Record<Language, string>, desc: { ja: '治療前日に入院', 'zh-TW': '治療前一天入院', 'zh-CN': '治疗前一天入院', en: 'Admission day before treatment' } as Record<Language, string> },
  { step: '04', icon: Syringe, title: { ja: '血管内治療', 'zh-TW': '血管內治療', 'zh-CN': '血管内治疗', en: 'Endovascular Therapy' } as Record<Language, string>, desc: { ja: 'カテーテルによる動脈化学塞栓療法', 'zh-TW': '導管動脈化學栓塞治療', 'zh-CN': '导管动脉化学栓塞治疗', en: 'Catheter-based chemoembolization' } as Record<Language, string> },
  { step: '05', icon: Thermometer, title: { ja: '温熱療法', 'zh-TW': '溫熱療法', 'zh-CN': '温热疗法', en: 'Hyperthermia' } as Record<Language, string>, desc: { ja: '併用により治療効果を向上', 'zh-TW': '併用增強治療效果', 'zh-CN': '并用增强治疗效果', en: 'Combined to enhance efficacy' } as Record<Language, string> },
  { step: '06', icon: CheckCircle, title: { ja: '退院', 'zh-TW': '出院', 'zh-CN': '出院', en: 'Discharge' } as Record<Language, string>, desc: { ja: '治療後2〜3日で退院', 'zh-TW': '治療後2-3天出院', 'zh-CN': '治疗后2-3天出院', en: 'Discharge 2-3 days after treatment' } as Record<Language, string> },
];

// ======================================
// 组件
// ======================================
export default function IGTCContent({ isGuideEmbed }: Props) {
  const lang = useLanguage();

  return (
    <div className="bg-white">
      {/* ========== HERO ========== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://igtc.jp/images/top_temp/top_main_copy-pc.png"
            alt="IGT Clinic"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/70 to-blue-950/60" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Globe size={16} className="text-blue-300" />
            <span className="text-white/90 text-sm">{t(tr.limitBadge, lang)}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            {t(tr.heroTitle, lang)}
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-6">
            {t(tr.heroSubtitle, lang)}
          </p>
          <p className="text-white/80 text-lg max-w-2xl whitespace-pre-line leading-relaxed">
            {t(tr.heroText, lang)}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {['保険適用', '血管内治療', '温熱療法', '月間実績公開'].map((tag) => (
              <span key={tag} className="bg-blue-600/80 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-10">
            <a href="#cta" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition">
              {t(tr.ctaTitle, lang)}
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium text-sm">{t(tr.statsTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.statsTitle, lang)}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border hover:shadow-lg transition">
                <s.icon size={32} className="text-blue-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{t(s.label, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TREATMENTS ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium text-sm">{t(tr.treatTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.treatTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* IGT */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Syringe size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.igtTitle, lang)}</h3>
              <p className="text-gray-700 leading-relaxed">{t(tr.igtDesc, lang)}</p>
            </div>
            {/* Hyperthermia */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Thermometer size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.hyperTitle, lang)}</h3>
              <p className="text-gray-700 leading-relaxed">{t(tr.hyperDesc, lang)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CANCERS ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium text-sm">{t(tr.cancerTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.cancerTitle, lang)}</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CANCERS.map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center border hover:border-blue-300 transition">
                <c.icon size={24} className="text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{t(c.name, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ADVANTAGES ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium text-sm">{t(tr.advTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.advTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <a.icon size={24} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t(a.title, lang)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(a.desc, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TREATMENT FLOW ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium text-sm">{t(tr.flowTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.flowTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FLOW_STEPS.map((s, i) => (
              <div key={i} className="relative bg-white rounded-xl p-5 border text-center">
                <div className="text-xs font-bold text-blue-600 mb-2">STEP {s.step}</div>
                <s.icon size={28} className="text-blue-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm mb-1">{t(s.title, lang)}</h4>
                <p className="text-xs text-gray-500">{t(s.desc, lang)}</p>
                {i < FLOW_STEPS.length - 1 && (
                  <ArrowRight size={16} className="absolute -right-3 top-1/2 -translate-y-1/2 text-gray-300 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ACCESS ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium text-sm">{t(tr.accessTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.accessTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-blue-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">〒598-0047</p>
                    <p className="text-gray-600 text-sm">大阪府泉佐野市りんくう往来南3-41</p>
                    <p className="text-gray-600 text-sm">メディカルりんくうポート 3F〜5F</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Train size={20} className="text-blue-600 shrink-0" />
                  <p className="text-gray-600 text-sm">りんくうタウン駅より徒歩10分 / 関西空港から1駅</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-blue-600 shrink-0" />
                  <p className="text-gray-600 text-sm">072-463-3811</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-blue-600 shrink-0" />
                  <p className="text-gray-600 text-sm">月〜土 9:00〜17:00</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border h-64 md:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3289.8!2d135.298!3d34.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDI0JzAwLjAiTiAxMzXCsDE3JzUyLjgiRQ!5e0!3m2!1sja!2sjp!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 256 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="IGT Clinic Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section id="cta" className="py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t(tr.ctaTitle, lang)}</h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto">{t(tr.ctaDesc, lang)}</p>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/igtc/initial-consultation"
              className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition group"
            >
              <p className="text-sm text-blue-600 font-medium mb-1">{t(tr.ctaInitial, lang)}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">¥221,000</p>
              <p className="text-gray-500 text-sm">{t(tr.ctaInitialDesc, lang)}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                {lang === 'ja' ? '詳細を見る' : lang === 'en' ? 'Learn More' : '了解詳情'}
                <ArrowRight size={16} />
              </div>
            </Link>
            <Link
              href="/igtc/remote-consultation"
              className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition group"
            >
              <p className="text-sm text-blue-600 font-medium mb-1">{t(tr.ctaRemote, lang)}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">¥243,000</p>
              <p className="text-gray-500 text-sm">{t(tr.ctaRemoteDesc, lang)}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                {lang === 'ja' ? '詳細を見る' : lang === 'en' ? 'Learn More' : '了解詳情'}
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER (standalone only) ========== */}
      {!isGuideEmbed && (
        <footer className="py-8 bg-gray-900 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} IGTクリニック（医療法人 龍志会）
          </p>
          <a href="https://igtc.jp" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline mt-1 inline-block">
            igtc.jp
          </a>
        </footer>
      )}
    </div>
  );
}
