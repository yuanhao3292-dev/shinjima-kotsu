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
  guideSlug?: string;
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
    ja: 'がん治療専門クリニック', 'zh-TW': '癌症治療專門診所', 'zh-CN': '癌症治疗专门诊所', en: 'Cancer Treatment Specialized Clinic',
  } as Record<Language, string>,
  heroMission: {
    ja: '『受けて良かった』と思っていただける治療を目指しています',
    'zh-TW': '我們致力於提供讓患者感到「很高興接受」的治療',
    'zh-CN': '我们致力于提供让患者感到"很高兴接受"的治疗',
    en: 'Striving to provide treatment you\'ll be glad to receive',
  } as Record<Language, string>,
  heroText: {
    ja: '医療法人 龍志会 IGTクリニック。動脈塞栓術を主にした血管内治療を軸に、\n温熱治療などを組み合わせて、がんに苦しむ人たちが困っている病巣を\n少しでも小さくして症状を和らげ、臓器の働きを良くすることを目標としています。\n命を繋げてゆくための治療を実践する専門クリニックです。',
    'zh-TW': '醫療法人 龍志會 IGT診所。以動脈栓塞術為主的血管內治療為核心，\n結合溫熱療法等，目標是縮小病灶、緩解症狀、改善臟器功能，\n幫助癌症患者減輕痛苦。我們是實踐「維持生命治療」的專門診所。',
    'zh-CN': '医疗法人 龙志会 IGT诊所。以动脉栓塞术为主的血管内治疗为核心，\n结合温热疗法等，目标是缩小病灶、缓解症状、改善脏器功能，\n帮助癌症患者减轻痛苦。我们是实践「维持生命治疗」的专门诊所。',
    en: 'IGT Clinic by Medical Corporation Ryushikai. Centered on transarterial embolization\nand vascular treatment, combined with hyperthermia, we aim to shrink lesions,\nalleviate symptoms, and improve organ function for cancer patients.\nA specialized clinic practicing treatment to sustain life.',
  } as Record<Language, string>,
  limitBadge: {
    ja: '健康保険適用・セカンドオピニオン対応可', 'zh-TW': '日本健保適用·可提供第二意見', 'zh-CN': '日本健保适用·可提供第二意见', en: 'Insurance Covered · Second Opinion Available',
  } as Record<Language, string>,

  // Stats
  statsTag: { ja: '治療実績', 'zh-TW': '治療實績', 'zh-CN': '治疗实绩', en: 'Treatment Results' } as Record<Language, string>,
  statsTitle: { ja: 'IGTクリニックの実力', 'zh-TW': 'IGT 診所的實力', 'zh-CN': 'IGT 诊所的实力', en: 'IGT Clinic Strengths' } as Record<Language, string>,

  // Performance Graph
  perfTag: { ja: '月間治療実績', 'zh-TW': '每月治療實績', 'zh-CN': '每月治疗实绩', en: 'Monthly Performance' } as Record<Language, string>,
  perfTitle: { ja: '治療実績の推移', 'zh-TW': '治療實績趨勢', 'zh-CN': '治疗实绩趋势', en: 'Treatment Performance Trends' } as Record<Language, string>,
  perfDesc: { ja: '毎月の治療実績を公開しています', 'zh-TW': '每月公開治療實績', 'zh-CN': '每月公开治疗实绩', en: 'Monthly results published transparently' } as Record<Language, string>,

  // Facility
  facilityTag: { ja: '診療環境', 'zh-TW': '診療環境', 'zh-CN': '诊疗环境', en: 'Facility' } as Record<Language, string>,
  facilityTitle: { ja: '関西空港至近の医療施設', 'zh-TW': '鄰近關西機場的醫療設施', 'zh-CN': '邻近关西机场的医疗设施', en: 'Medical Facility Near Kansai Airport' } as Record<Language, string>,
  facilityDesc: { ja: 'メディカルりんくうポートに位置し、最新の医療設備を完備。患者様に安心して治療を受けていただける環境を整えています。', 'zh-TW': '位於醫療臨空港，配備最新醫療設備。為患者提供安心接受治療的環境。', 'zh-CN': '位于医疗临空港，配备最新医疗设备。为患者提供安心接受治疗的环境。', en: 'Located in Medical Rinku Port with state-of-the-art medical equipment, providing a comfortable environment for treatment.' } as Record<Language, string>,

  facilityLocation: { ja: '立地とアクセス', 'zh-TW': '地理位置與交通', 'zh-CN': '地理位置与交通', en: 'Location & Access' } as Record<Language, string>,
  facilityLocationDesc: { ja: '関西空港から1駅、りんくうタウン駅より徒歩10分の好立地', 'zh-TW': '距關西機場1站，臨空城站步行10分鐘', 'zh-CN': '距关西机场1站，临空城站步行10分钟', en: '1 station from Kansai Airport, 10 min walk from Rinku Town Station' } as Record<Language, string>,

  facilityEquipment: { ja: '医療設備', 'zh-TW': '醫療設備', 'zh-CN': '医疗设备', en: 'Medical Equipment' } as Record<Language, string>,
  facilityEquipmentDesc: { ja: '最新の血管造影装置と温熱治療機器を完備', 'zh-TW': '配備最新血管造影設備與溫熱治療儀器', 'zh-CN': '配备最新血管造影设备与温热治疗仪器', en: 'Equipped with latest angiography and hyperthermia systems' } as Record<Language, string>,

  facilityEnvironment: { ja: '診療環境', 'zh-TW': '診療環境', 'zh-CN': '诊疗环境', en: 'Treatment Environment' } as Record<Language, string>,
  facilityEnvironmentDesc: { ja: '清潔で快適な治療室、患者様のプライバシーに配慮', 'zh-TW': '清潔舒適的治療室，注重患者隱私', 'zh-CN': '清洁舒适的治疗室，注重患者隐私', en: 'Clean, comfortable treatment rooms with privacy consideration' } as Record<Language, string>,

  // Technical Details
  techTag: { ja: '技術詳細', 'zh-TW': '技術詳解', 'zh-CN': '技术详解', en: 'Technical Details' } as Record<Language, string>,
  techTitle: { ja: '先進的ながん治療技術', 'zh-TW': '先進的癌症治療技術', 'zh-CN': '先进的癌症治疗技术', en: 'Advanced Cancer Treatment Technology' } as Record<Language, string>,

  techIGTDetail: { ja: '動脈化学塞栓療法（TACE）の詳細', 'zh-TW': '動脈化學栓塞療法（TACE）詳解', 'zh-CN': '动脉化学栓塞疗法（TACE）详解', en: 'Transarterial Chemoembolization (TACE) Details' } as Record<Language, string>,
  techIGTPoint1: { ja: '局所集中投与：抗がん剤を腫瘍に直接届ける', 'zh-TW': '局部集中投藥：直接將抗癌藥物送達腫瘤', 'zh-CN': '局部集中投药：直接将抗癌药物送达肿瘤', en: 'Localized delivery: Direct anti-cancer drug to tumor' } as Record<Language, string>,
  techIGTPoint2: { ja: '血管塞栓：腫瘍への栄養供給を遮断', 'zh-TW': '血管栓塞：阻斷腫瘤營養供應', 'zh-CN': '血管栓塞：阻断肿瘤营养供应', en: 'Embolization: Cut off tumor nutrition supply' } as Record<Language, string>,
  techIGTPoint3: { ja: '副作用軽減：全身化学療法より負担が少ない', 'zh-TW': '減少副作用：比全身化療負擔更少', 'zh-CN': '减少副作用：比全身化疗负担更少', en: 'Reduced side effects: Less burden than systemic chemo' } as Record<Language, string>,

  techHyperDetail: { ja: '温熱療法の原理', 'zh-TW': '溫熱療法原理', 'zh-CN': '温热疗法原理', en: 'Hyperthermia Principles' } as Record<Language, string>,
  techHyperPoint1: { ja: '選択的加温：がん細胞のみを42-44℃に加温', 'zh-TW': '選擇性加溫：僅將癌細胞加熱至42-44°C', 'zh-CN': '选择性加温：仅将癌细胞加热至42-44°C', en: 'Selective heating: Heat cancer cells to 42-44°C only' } as Record<Language, string>,
  techHyperPoint2: { ja: '細胞死誘導：熱によりがん細胞のアポトーシスを促進', 'zh-TW': '誘導細胞死亡：熱促進癌細胞凋亡', 'zh-CN': '诱导细胞死亡：热促进癌细胞凋亡', en: 'Induce cell death: Heat promotes cancer cell apoptosis' } as Record<Language, string>,
  techHyperPoint3: { ja: '相乗効果：他治療との併用で効果増強', 'zh-TW': '協同效應：與其他治療併用增強效果', 'zh-CN': '协同效应：与其他治疗并用增强效果', en: 'Synergy: Enhanced effect when combined with other treatments' } as Record<Language, string>,

  // Medical Team
  teamTag: { ja: '医療チーム', 'zh-TW': '醫療團隊', 'zh-CN': '医疗团队', en: 'Medical Team' } as Record<Language, string>,
  teamTitle: { ja: '専門医による高度な治療', 'zh-TW': '專科醫生提供高水準治療', 'zh-CN': '专科医生提供高水准治疗', en: 'Expert Medical Care' } as Record<Language, string>,
  teamDesc: { ja: '放射線診断とIVRの専門医が、患者様一人ひとりに最適な治療を提供します', 'zh-TW': '放射診斷與IVR專科醫生為每位患者提供最適合的治療', 'zh-CN': '放射诊断与IVR专科医生为每位患者提供最适合的治疗', en: 'Radiology and IVR specialists provide personalized treatment for each patient' } as Record<Language, string>,

  doctorDirector: { ja: '院長', 'zh-TW': '院長', 'zh-CN': '院长', en: 'Director' } as Record<Language, string>,
  doctorChairman: { ja: '理事長', 'zh-TW': '理事長', 'zh-CN': '理事长', en: 'Chairman' } as Record<Language, string>,
  doctorPhysician: { ja: '医師', 'zh-TW': '醫師', 'zh-CN': '医师', en: 'Physician' } as Record<Language, string>,
  doctorPartTime: { ja: '非常勤医師', 'zh-TW': '兼職醫師', 'zh-CN': '兼职医师', en: 'Part-time Physician' } as Record<Language, string>,

  // Patient Support
  supportTag: { ja: '患者サポート', 'zh-TW': '患者支援', 'zh-CN': '患者支持', en: 'Patient Support' } as Record<Language, string>,
  supportTitle: { ja: '充実した相談体制', 'zh-TW': '完善的諮詢體制', 'zh-CN': '完善的咨询体制', en: 'Comprehensive Support System' } as Record<Language, string>,

  supportSecond: { ja: 'セカンドオピニオン', 'zh-TW': '第二意見諮詢', 'zh-CN': '第二意见咨询', en: 'Second Opinion' } as Record<Language, string>,
  supportSecondDesc: { ja: '標準治療で効果が得られなかった方、副作用で治療継続が困難な方のご相談に対応', 'zh-TW': '為標準治療效果不佳、因副作用難以繼續治療的患者提供諮詢', 'zh-CN': '为标准治疗效果不佳、因副作用难以继续治疗的患者提供咨询', en: 'For patients with limited standard treatment response or unable to continue due to side effects' } as Record<Language, string>,

  supportOnline: { ja: 'オンライン診療', 'zh-TW': '線上診療', 'zh-CN': '在线诊疗', en: 'Online Consultation' } as Record<Language, string>,
  supportOnlineDesc: { ja: '遠方の方でも専門医との診療が可能。治療計画の相談や経過観察に対応', 'zh-TW': '遠方患者也可與專科醫生會診。提供治療計劃諮詢與追蹤觀察', 'zh-CN': '远方患者也可与专科医生会诊。提供治疗计划咨询与追踪观察', en: 'Remote consultations available for treatment planning and follow-up' } as Record<Language, string>,

  supportEmail: { ja: '無料メール相談', 'zh-TW': '免費郵件諮詢', 'zh-CN': '免费邮件咨询', en: 'Free Email Consultation' } as Record<Language, string>,
  supportEmailDesc: { ja: '来院が難しい方向けに、1回まで無料でメール相談を受け付けています', 'zh-TW': '無法來院者可免費進行一次郵件諮詢', 'zh-CN': '无法来院者可免费进行一次邮件咨询', en: 'One complimentary email consultation available for those unable to visit' } as Record<Language, string>,

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

  // Insurance & Payment
  insuranceTag: { ja: '健康保険・費用', 'zh-TW': '健康保險·費用', 'zh-CN': '健康保险·费用', en: 'Insurance & Costs' } as Record<Language, string>,
  insuranceTitle: { ja: '健康保険適用について', 'zh-TW': '關於健康保險適用', 'zh-CN': '关于健康保险适用', en: 'About Insurance Coverage' } as Record<Language, string>,
  insuranceCovered: { ja: '保険適用治療', 'zh-TW': '保險適用治療', 'zh-CN': '保险适用治疗', en: 'Insurance Covered' } as Record<Language, string>,
  insuranceCoveredDesc: { ja: '血管内治療（IVR）は健康保険適用です。3割負担の場合、1回の治療で概ね30〜50万円程度となります。', 'zh-TW': '血管內治療（IVR）適用健康保險。自付30%的情況下，一次治療約30-50萬日元。', 'zh-CN': '血管内治疗（IVR）适用健康保险。自付30%的情况下，一次治疗约30-50万日元。', en: 'Endovascular treatment (IVR) is covered by Japanese health insurance. With 30% co-pay, one treatment costs approximately ¥300,000-500,000.' } as Record<Language, string>,
  insuranceAdvanced: { ja: '先進医療', 'zh-TW': '先進醫療', 'zh-CN': '先进医疗', en: 'Advanced Medicine' } as Record<Language, string>,
  insuranceAdvancedDesc: { ja: '温熱療法との併用は先進医療として、別途費用がかかる場合があります。詳細はご相談ください。', 'zh-TW': '與溫熱療法併用屬先進醫療，可能需額外費用。詳情請諮詢。', 'zh-CN': '与温热疗法并用属先进医疗，可能需额外费用。详情请咨询。', en: 'Combination with hyperthermia may require additional fees as advanced medical care. Please inquire for details.' } as Record<Language, string>,
  insuranceLimit: { ja: '高額療養費制度', 'zh-TW': '高額醫療費制度', 'zh-CN': '高额医疗费制度', en: 'Medical Expense Cap' } as Record<Language, string>,
  insuranceLimitDesc: { ja: '高額療養費制度により、月の医療費が一定額を超えた場合、超過分が払い戻されます。', 'zh-TW': '根據高額醫療費制度，每月醫療費超過一定金額時，可退還超出部分。', 'zh-CN': '根据高额医疗费制度，每月医疗费超过一定金额时，可退还超出部分。', en: 'Under the high-cost medical care system, excess expenses beyond a monthly cap can be reimbursed.' } as Record<Language, string>,

  // FAQ
  faqTag: { ja: 'よくある質問', 'zh-TW': '常見問題', 'zh-CN': '常见问题', en: 'FAQ' } as Record<Language, string>,
  faqTitle: { ja: '患者様からよくいただく質問', 'zh-TW': '患者常見問題', 'zh-CN': '患者常见问题', en: 'Frequently Asked Questions' } as Record<Language, string>,

  // International Support
  intlTag: { ja: '海外患者対応', 'zh-TW': '國際患者支援', 'zh-CN': '国际患者支持', en: 'International Patients' } as Record<Language, string>,
  intlTitle: { ja: '海外からの患者様へ', 'zh-TW': '致海外患者', 'zh-CN': '致海外患者', en: 'For International Patients' } as Record<Language, string>,
  intlDesc: { ja: '関西空港から1駅の立地を活かし、海外からの患者様も多数受け入れています。', 'zh-TW': '利用鄰近關西機場的地理優勢，接待眾多海外患者。', 'zh-CN': '利用邻近关西机场的地理优势，接待众多海外患者。', en: 'Located just 1 station from Kansai Airport, we welcome many international patients.' } as Record<Language, string>,
  intlLocation: { ja: '抜群のアクセス', 'zh-TW': '絕佳交通', 'zh-CN': '绝佳交通', en: 'Excellent Access' } as Record<Language, string>,
  intlLocationDesc: { ja: '関西国際空港から電車で5分。世界中からアクセス可能。', 'zh-TW': '距關西國際機場僅5分鐘車程，全球可達。', 'zh-CN': '距关西国际机场仅5分钟车程，全球可达。', en: '5 minutes by train from Kansai International Airport. Accessible worldwide.' } as Record<Language, string>,
  intlTranslation: { ja: '通訳サポート', 'zh-TW': '翻譯支援', 'zh-CN': '翻译支持', en: 'Translation Support' } as Record<Language, string>,
  intlTranslationDesc: { ja: '医療通訳サービスを通じて、英語・中国語での診療が可能です。', 'zh-TW': '透過醫療翻譯服務，可提供英語、中文診療。', 'zh-CN': '通过医疗翻译服务，可提供英语、中文诊疗。', en: 'Medical interpretation available in English and Chinese.' } as Record<Language, string>,
  intlVisa: { ja: '医療滞在ビザ', 'zh-TW': '醫療簽證', 'zh-CN': '医疗签证', en: 'Medical Visa' } as Record<Language, string>,
  intlVisaDesc: { ja: '医療滞在ビザ取得のための診断書発行をサポートします。', 'zh-TW': '協助開立醫療簽證所需診斷書。', 'zh-CN': '协助开立医疗签证所需诊断书。', en: 'Support for issuing medical certificates required for medical stay visas.' } as Record<Language, string>,

  // Results
  resultsTag: { ja: '治療成績', 'zh-TW': '治療成果', 'zh-CN': '治疗成果', en: 'Treatment Outcomes' } as Record<Language, string>,
  resultsTitle: { ja: '治療実績と成果', 'zh-TW': '治療實績與成果', 'zh-CN': '治疗实绩与成果', en: 'Treatment Results & Outcomes' } as Record<Language, string>,
  resultsDesc: { ja: 'IGTクリニックでは、透明性の高い医療を目指し、毎月の治療実績を公開しています。', 'zh-TW': 'IGT診所秉持透明醫療理念，每月公開治療實績。', 'zh-CN': 'IGT诊所秉持透明医疗理念，每月公开治疗实绩。', en: 'IGT Clinic publishes monthly treatment results to ensure transparent medical care.' } as Record<Language, string>,
  resultsMonthly: { ja: '月間治療件数', 'zh-TW': '每月治療件數', 'zh-CN': '每月治疗件数', en: 'Monthly Treatments' } as Record<Language, string>,
  resultsMonthlyDesc: { ja: '毎月平均50〜80件の血管内治療を実施。治療件数はウェブサイトで公開中。', 'zh-TW': '每月平均實施50-80次血管內治療。治療件數於網站公開。', 'zh-CN': '每月平均实施50-80次血管内治疗。治疗件数于网站公开。', en: 'Average 50-80 endovascular treatments per month. Case numbers published on website.' } as Record<Language, string>,
  resultsConference: { ja: '学会発表', 'zh-TW': '學會發表', 'zh-CN': '学会发表', en: 'Conference Presentations' } as Record<Language, string>,
  resultsConferenceDesc: { ja: '国際学会・国内学会での治療成果発表を継続的に実施。', 'zh-TW': '持續於國際及國內學會發表治療成果。', 'zh-CN': '持续于国际及国内学会发表治疗成果。', en: 'Ongoing presentations of treatment outcomes at international and domestic conferences.' } as Record<Language, string>,

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
  { icon: Activity, value: '20+', label: { ja: '年の治療経験', 'zh-TW': '年治療經驗', 'zh-CN': '年治疗经验', en: 'Years Experience' } as Record<Language, string> },
  { icon: Stethoscope, value: '12+', label: { ja: '対応がん種', 'zh-TW': '適應癌種', 'zh-CN': '适应癌种', en: 'Cancer Types' } as Record<Language, string> },
  { icon: Shield, value: '月次', label: { ja: '実績公開', 'zh-TW': '每月公開實績', 'zh-CN': '每月公开实绩', en: 'Monthly Reports' } as Record<Language, string> },
  { icon: Award, value: '国際', label: { ja: '学会発表', 'zh-TW': '國際學會發表', 'zh-CN': '国际学会发表', en: 'Intl. Conference' } as Record<Language, string> },
];

const DOCTORS = [
  {
    name: { ja: '堀 篤史', 'zh-TW': '堀 篤史', 'zh-CN': '堀 笃史', en: 'Atsushi Hori' } as Record<Language, string>,
    title: { ja: '院長', 'zh-TW': '院長', 'zh-CN': '院长', en: 'Director' } as Record<Language, string>,
    specialty: { ja: '放射線診断・IVR・温熱治療', 'zh-TW': '放射診斷·IVR·溫熱療法', 'zh-CN': '放射诊断·IVR·温热疗法', en: 'Radiology, IVR, Hyperthermia' } as Record<Language, string>,
    photo: 'https://igtc.jp/images/staff/atsushi-hori.jpg',
  },
  {
    name: { ja: '堀 信一', 'zh-TW': '堀 信一', 'zh-CN': '堀 信一', en: 'Shinichi Hori' } as Record<Language, string>,
    title: { ja: '理事長', 'zh-TW': '理事長', 'zh-CN': '理事长', en: 'Chairman' } as Record<Language, string>,
    specialty: { ja: '放射線診断・IVR', 'zh-TW': '放射診斷·IVR', 'zh-CN': '放射诊断·IVR', en: 'Radiology, IVR' } as Record<Language, string>,
    photo: 'https://igtc.jp/images/staff/shinichi-hori.jpg',
  },
  {
    name: { ja: '竹内 誠人', 'zh-TW': '竹內 誠人', 'zh-CN': '竹内 诚人', en: 'Masato Takeuchi' } as Record<Language, string>,
    title: { ja: '医師', 'zh-TW': '醫師', 'zh-CN': '医师', en: 'Physician' } as Record<Language, string>,
    specialty: { ja: '救急医学・IVR', 'zh-TW': '急診醫學·IVR', 'zh-CN': '急诊医学·IVR', en: 'Emergency Medicine, IVR' } as Record<Language, string>,
    photo: 'https://igtc.jp/images/staff/dr_takeuchi.jpg',
  },
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

const FAQ_ITEMS = [
  {
    q: { ja: '血管内治療（TACE）は痛いですか？', 'zh-TW': '血管內治療（TACE）會痛嗎？', 'zh-CN': '血管内治疗（TACE）会痛吗？', en: 'Is endovascular treatment (TACE) painful?' } as Record<Language, string>,
    a: { ja: '局所麻酔下で行うため、カテーテル挿入時の痛みはほとんどありません。治療後に軽い発熱や痛みを感じることがありますが、鎮痛剤で対応可能です。', 'zh-TW': '在局部麻醉下進行，導管插入時幾乎無痛。治療後可能有輕微發燒或疼痛，可用止痛藥緩解。', 'zh-CN': '在局部麻醉下进行，导管插入时几乎无痛。治疗后可能有轻微发烧或疼痛，可用止痛药缓解。', en: 'Performed under local anesthesia, catheter insertion causes minimal pain. Mild fever or pain after treatment can be managed with pain medication.' } as Record<Language, string>,
  },
  {
    q: { ja: '入院期間はどのくらいですか？', 'zh-TW': '住院期間多長？', 'zh-CN': '住院期间多长？', en: 'How long is the hospital stay?' } as Record<Language, string>,
    a: { ja: '治療前日に入院し、治療後2〜3日で退院が可能です。合計3〜4日程度の入院となります。', 'zh-TW': '治療前一天入院，治療後2-3天可出院。總計約3-4天住院。', 'zh-CN': '治疗前一天入院，治疗后2-3天可出院。总计约3-4天住院。', en: 'Admission is the day before treatment, with discharge possible 2-3 days after. Total hospital stay is approximately 3-4 days.' } as Record<Language, string>,
  },
  {
    q: { ja: '副作用はありますか？', 'zh-TW': '有副作用嗎？', 'zh-CN': '有副作用吗？', en: 'Are there side effects?' } as Record<Language, string>,
    a: { ja: '腫瘍に直接薬剤を投与するため、全身化学療法に比べて副作用は大幅に少なくなります。治療後の発熱や倦怠感は数日で改善します。', 'zh-TW': '因藥物直接注入腫瘤，副作用比全身化療少得多。治療後的發燒或倦怠感數日內會改善。', 'zh-CN': '因药物直接注入肿瘤，副作用比全身化疗少得多。治疗后的发烧或倦怠感数日内会改善。', en: 'Direct drug delivery to tumors significantly reduces side effects compared to systemic chemotherapy. Post-treatment fever or fatigue improves within days.' } as Record<Language, string>,
  },
  {
    q: { ja: '治療は何回受けられますか？', 'zh-TW': '可接受幾次治療？', 'zh-CN': '可接受几次治疗？', en: 'How many treatments can I receive?' } as Record<Language, string>,
    a: { ja: '身体への負担が少ないため、必要に応じて複数回の治療が可能です。腫瘍の状態を見ながら、1〜2ヶ月間隔で治療を繰り返すことが一般的です。', 'zh-TW': '因身體負擔小，可根據需要進行多次治療。通常根據腫瘤狀況，每1-2個月重複治療。', 'zh-CN': '因身体负担小，可根据需要进行多次治疗。通常根据肿瘤状况，每1-2个月重复治疗。', en: 'Multiple treatments possible due to low physical burden. Typically repeated at 1-2 month intervals based on tumor response.' } as Record<Language, string>,
  },
  {
    q: { ja: '健康保険は使えますか？', 'zh-TW': '可使用健康保險嗎？', 'zh-CN': '可使用健康保险吗？', en: 'Can I use health insurance?' } as Record<Language, string>,
    a: { ja: '血管内治療（IVR）は健康保険適用です。高額療養費制度も利用可能ですので、実際の負担額は月の上限額までとなります。', 'zh-TW': '血管內治療（IVR）適用健康保險。也可使用高額醫療費制度，實際負擔額以每月上限為準。', 'zh-CN': '血管内治疗（IVR）适用健康保险。也可使用高额医疗费制度，实际负担额以每月上限为准。', en: 'Endovascular treatment (IVR) is covered by health insurance. High-cost medical care system available, capping actual monthly expenses.' } as Record<Language, string>,
  },
  {
    q: { ja: '他の病院で治療中ですが、セカンドオピニオンを受けられますか？', 'zh-TW': '正在其他醫院治療，可接受第二意見嗎？', 'zh-CN': '正在其他医院治疗，可接受第二意见吗？', en: 'Can I get a second opinion while being treated elsewhere?' } as Record<Language, string>,
    a: { ja: 'はい、可能です。現在の治療状況を踏まえて、血管内治療の適応可能性を評価いたします。診療情報提供書や画像データをご持参ください。', 'zh-TW': '是的，可以。我們會根據目前治療狀況，評估血管內治療的適用性。請攜帶診療資料及影像數據。', 'zh-CN': '是的，可以。我们会根据目前治疗状况，评估血管内治疗的适用性。请携带诊疗资料及影像数据。', en: 'Yes, we can evaluate suitability for endovascular treatment based on your current treatment. Please bring medical records and imaging data.' } as Record<Language, string>,
  },
  {
    q: { ja: '海外からでも治療を受けられますか？', 'zh-TW': '從海外也能接受治療嗎？', 'zh-CN': '从海外也能接受治疗吗？', en: 'Can international patients receive treatment?' } as Record<Language, string>,
    a: { ja: '関西空港から1駅の好立地を活かし、海外からの患者様を多数受け入れています。医療通訳サービスや医療滞在ビザ取得のサポートも行っています。', 'zh-TW': '利用鄰近關西機場的優勢，接待眾多海外患者。提供醫療翻譯服務及醫療簽證申請支援。', 'zh-CN': '利用邻近关西机场的优势，接待众多海外患者。提供医疗翻译服务及医疗签证申请支援。', en: 'Located 1 station from Kansai Airport, we welcome many international patients. Medical interpretation and visa support available.' } as Record<Language, string>,
  },
];

// ======================================
// 组件
// ======================================
export default function IGTCContent({ isGuideEmbed, guideSlug }: Props) {
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
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/80 to-blue-950/70" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Globe size={16} className="text-blue-300" />
            <span className="text-white/90 text-sm">{t(tr.limitBadge, lang)}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            {t(tr.heroTitle, lang)}
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-2">
            {t(tr.heroSubtitle, lang)}
          </p>
          <p className="text-lg md:text-xl text-white/95 font-medium mb-6 italic">
            {t(tr.heroMission, lang)}
          </p>
          <p className="text-white/80 text-base max-w-2xl whitespace-pre-line leading-relaxed">
            {t(tr.heroText, lang)}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {['保険適用', '血管内治療', '温熱療法', '月間実績公開'].map((tag) => (
              <span key={tag} className="bg-blue-800/80 text-white px-4 py-1.5 rounded-full text-sm font-medium">
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
            <span className="text-blue-800 font-medium text-sm">{t(tr.statsTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.statsTitle, lang)}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border hover:shadow-lg transition">
                <s.icon size={32} className="text-blue-800 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{t(s.label, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TREATMENT PERFORMANCE GRAPH ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="text-blue-800 font-medium text-sm">{t(tr.perfTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.perfTitle, lang)}</h2>
            <p className="text-gray-600 mt-2">{t(tr.perfDesc, lang)}</p>
          </div>
          <div className="bg-white rounded-2xl p-8 border shadow-sm">
            <img
              src="https://igtc.jp/images/top_temp/top_jisekigraf-pc.png"
              alt="Treatment Performance Graph"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ========== FACILITY & ENVIRONMENT ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.facilityTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.facilityTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{t(tr.facilityDesc, lang)}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Location */}
            <div className="bg-white rounded-2xl p-8 border hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <MapPin size={32} className="text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t(tr.facilityLocation, lang)}</h3>
              <p className="text-gray-600 text-center leading-relaxed">{t(tr.facilityLocationDesc, lang)}</p>
              <div className="mt-6 text-center">
                <span className="inline-block bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                  {lang === 'ja' ? 'りんくうタウン駅 徒歩10分' : lang === 'en' ? '10 min from station' : '车站步行10分钟'}
                </span>
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-2xl p-8 border hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Microscope size={32} className="text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t(tr.facilityEquipment, lang)}</h3>
              <p className="text-gray-600 text-center leading-relaxed">{t(tr.facilityEquipmentDesc, lang)}</p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-blue-800 shrink-0" />
                  <span>{lang === 'ja' ? '血管造影装置' : lang === 'en' ? 'Angiography System' : '血管造影设备'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-blue-800 shrink-0" />
                  <span>{lang === 'ja' ? '温熱治療機器' : lang === 'en' ? 'Hyperthermia System' : '温热治疗仪器'}</span>
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="bg-white rounded-2xl p-8 border hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <BedDouble size={32} className="text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t(tr.facilityEnvironment, lang)}</h3>
              <p className="text-gray-600 text-center leading-relaxed">{t(tr.facilityEnvironmentDesc, lang)}</p>
              <div className="mt-6 text-center">
                <span className="inline-block bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                  {lang === 'ja' ? '3F〜5F 完全個室対応' : lang === 'en' ? 'Private Rooms 3F-5F' : '3F-5F 独立诊室'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TECHNICAL DETAILS ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.techTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.techTitle, lang)}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* IGT Technical Details */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Syringe size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">{t(tr.techIGTDetail, lang)}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-blue-200" />
                  <p className="leading-relaxed">{t(tr.techIGTPoint1, lang)}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-blue-200" />
                  <p className="leading-relaxed">{t(tr.techIGTPoint2, lang)}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-blue-200" />
                  <p className="leading-relaxed">{t(tr.techIGTPoint3, lang)}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-blue-100">
                  {lang === 'ja' ? 'カテーテル技術により、がんの栄養血管に選択的に薬剤を投与し、腫瘍を縮小させます。' : lang === 'en' ? 'Catheter technology selectively delivers drugs to tumor feeding vessels to shrink tumors.' : '导管技术选择性地将药物输送到肿瘤供血血管以缩小肿瘤。'}
                </p>
              </div>
            </div>

            {/* Hyperthermia Technical Details */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Thermometer size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">{t(tr.techHyperDetail, lang)}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-orange-100" />
                  <p className="leading-relaxed">{t(tr.techHyperPoint1, lang)}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-orange-100" />
                  <p className="leading-relaxed">{t(tr.techHyperPoint2, lang)}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-orange-100" />
                  <p className="leading-relaxed">{t(tr.techHyperPoint3, lang)}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-orange-50">
                  {lang === 'ja' ? '温熱により、がん細胞を選択的に破壊し、他の治療法の効果を高めます。' : lang === 'en' ? 'Hyperthermia selectively destroys cancer cells and enhances other treatment effects.' : '温热选择性地破坏癌细胞并增强其他治疗效果。'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TREATMENTS ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.treatTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.treatTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* IGT */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="w-14 h-14 bg-blue-800 rounded-xl flex items-center justify-center mb-4">
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
            <span className="text-blue-800 font-medium text-sm">{t(tr.cancerTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.cancerTitle, lang)}</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CANCERS.map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center border hover:border-blue-300 transition">
                <c.icon size={24} className="text-blue-800 mx-auto mb-2" />
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
            <span className="text-blue-800 font-medium text-sm">{t(tr.advTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.advTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <a.icon size={24} className="text-blue-800" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t(a.title, lang)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(a.desc, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MEDICAL TEAM ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.teamTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.teamTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{t(tr.teamDesc, lang)}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {DOCTORS.map((doctor, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition">
                <div className="aspect-[3/4] bg-gray-100">
                  <img
                    src={doctor.photo}
                    alt={t(doctor.name, lang)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="inline-block bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                    {t(doctor.title, lang)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t(doctor.name, lang)}</h3>
                  <p className="text-gray-600 text-sm">{t(doctor.specialty, lang)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PATIENT SUPPORT ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.supportTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.supportTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Second Opinion */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center justify-center mb-4">
                <Stethoscope size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.supportSecond, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.supportSecondDesc, lang)}</p>
            </div>

            {/* Online Consultation */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center justify-center mb-4">
                <Globe size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.supportOnline, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.supportOnlineDesc, lang)}</p>
            </div>

            {/* Email Consultation */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center justify-center mb-4">
                <Mail size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.supportEmail, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.supportEmailDesc, lang)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== INSURANCE & PAYMENT ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.insuranceTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.insuranceTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Insurance Covered */}
            <div className="bg-white rounded-2xl p-8 border hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.insuranceCovered, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.insuranceCoveredDesc, lang)}</p>
            </div>

            {/* Advanced Medicine */}
            <div className="bg-white rounded-2xl p-8 border hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Award size={28} className="text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.insuranceAdvanced, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.insuranceAdvancedDesc, lang)}</p>
            </div>

            {/* Medical Expense Cap */}
            <div className="bg-white rounded-2xl p-8 border hover:shadow-lg transition">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
                <Shield size={28} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.insuranceLimit, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.insuranceLimitDesc, lang)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TREATMENT RESULTS ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.resultsTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.resultsTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{t(tr.resultsDesc, lang)}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Treatments */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Activity size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">{t(tr.resultsMonthly, lang)}</h3>
              </div>
              <p className="text-blue-50 leading-relaxed">{t(tr.resultsMonthlyDesc, lang)}</p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-4xl font-bold">50-80</p>
                    <p className="text-sm text-blue-200 mt-1">{lang === 'ja' ? '件/月' : lang === 'en' ? 'cases/month' : '件/月'}</p>
                  </div>
                  <CheckCircle size={40} className="text-blue-200" />
                </div>
              </div>
            </div>

            {/* Conference Presentations */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">{t(tr.resultsConference, lang)}</h3>
              </div>
              <p className="text-orange-50 leading-relaxed">{t(tr.resultsConferenceDesc, lang)}</p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-4xl font-bold">{lang === 'ja' ? '継続中' : lang === 'en' ? 'Ongoing' : '持續中'}</p>
                    <p className="text-sm text-orange-200 mt-1">{lang === 'ja' ? '国際学会・国内学会' : lang === 'en' ? 'International & Domestic' : '國際及國內學會'}</p>
                  </div>
                  <Globe size={40} className="text-orange-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.faqTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.faqTitle, lang)}</h2>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl border overflow-hidden group">
                <summary className="px-8 py-6 cursor-pointer font-bold text-gray-900 hover:bg-gray-50 transition flex items-start gap-3">
                  <span className="text-blue-800 text-lg shrink-0">Q{i + 1}</span>
                  <span className="flex-1">{t(faq.q, lang)}</span>
                  <ArrowRight size={20} className="text-gray-400 group-open:rotate-90 transition-transform shrink-0 mt-1" />
                </summary>
                <div className="px-8 py-6 bg-blue-50/50 border-t">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-800 font-bold text-lg shrink-0">A</span>
                    <p className="text-gray-700 leading-relaxed flex-1">{t(faq.a, lang)}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INTERNATIONAL PATIENTS ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.intlTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.intlTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{t(tr.intlDesc, lang)}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Excellent Access */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
                <MapPin size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.intlLocation, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.intlLocationDesc, lang)}</p>
            </div>

            {/* Translation Support */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Globe size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.intlTranslation, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.intlTranslationDesc, lang)}</p>
            </div>

            {/* Medical Visa */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.intlVisa, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.intlVisaDesc, lang)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TREATMENT FLOW ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-800 font-medium text-sm">{t(tr.flowTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.flowTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FLOW_STEPS.map((s, i) => (
              <div key={i} className="relative bg-white rounded-xl p-5 border text-center">
                <div className="text-xs font-bold text-blue-800 mb-2">STEP {s.step}</div>
                <s.icon size={28} className="text-blue-800 mx-auto mb-2" />
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
            <span className="text-blue-800 font-medium text-sm">{t(tr.accessTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.accessTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-blue-800 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">〒598-0047</p>
                    <p className="text-gray-600 text-sm">大阪府泉佐野市りんくう往来南3-41</p>
                    <p className="text-gray-600 text-sm">メディカルりんくうポート 3F〜5F</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Train size={20} className="text-blue-800 shrink-0" />
                  <p className="text-gray-600 text-sm">りんくうタウン駅より徒歩10分 / 関西空港から1駅</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-blue-800 shrink-0" />
                  <div>
                    <p className="text-gray-600 text-sm">月・火・水・金・土 9:00〜17:00</p>
                    <p className="text-gray-500 text-xs">休診：木・日・祝日</p>
                  </div>
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
              href={guideSlug ? `/igtc/initial-consultation?guide=${guideSlug}` : '/igtc/initial-consultation'}
              className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition group"
            >
              <p className="text-sm text-blue-800 font-medium mb-1">{t(tr.ctaInitial, lang)}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">¥221,000</p>
              <p className="text-gray-500 text-sm">{t(tr.ctaInitialDesc, lang)}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-blue-800 font-medium text-sm group-hover:gap-2 transition-all">
                {lang === 'ja' ? '詳細を見る' : lang === 'en' ? 'Learn More' : '了解詳情'}
                <ArrowRight size={16} />
              </div>
            </Link>
            <Link
              href={guideSlug ? `/igtc/remote-consultation?guide=${guideSlug}` : '/igtc/remote-consultation'}
              className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition group"
            >
              <p className="text-sm text-blue-800 font-medium mb-1">{t(tr.ctaRemote, lang)}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">¥243,000</p>
              <p className="text-gray-500 text-sm">{t(tr.ctaRemoteDesc, lang)}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-blue-800 font-medium text-sm group-hover:gap-2 transition-all">
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
