'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import {
  MapPin, Phone, Clock, Train,
  Award, Stethoscope, Activity, Shield,
  Heart, Microscope, CheckCircle,
  Zap, Target, Radio,
  ArrowRight, Globe, Mail,
  Thermometer, Syringe, BedDouble, CalendarCheck,
  ChevronDown, ChevronUp, FileText, Droplets, Dna, Beaker,
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
    ja: '関西空港近く・海外患者も多数受入', 'zh-TW': '鄰近關西機場·接待眾多海外患者', 'zh-CN': '邻近关西机场·接待众多海外患者', en: 'Near Kansai Airport · Welcoming International Patients',
  } as Record<Language, string>,

  // Stats
  statsTag: { ja: '治療実績', 'zh-TW': '治療實績', 'zh-CN': '治疗实绩', en: 'Treatment Results' } as Record<Language, string>,
  statsTitle: { ja: 'IGTクリニックの実力', 'zh-TW': 'IGT 診所的實力', 'zh-CN': 'IGT 诊所的实力', en: 'IGT Clinic Strengths' } as Record<Language, string>,

  // Performance Graph
  perfTag: { ja: '月間治療実績', 'zh-TW': '每月治療實績', 'zh-CN': '每月治疗实绩', en: 'Monthly Performance' } as Record<Language, string>,
  perfTitle: { ja: '治療実績の推移', 'zh-TW': '治療實績趨勢', 'zh-CN': '治疗实绩趋势', en: 'Treatment Performance Trends' } as Record<Language, string>,
  perfDesc: { ja: '毎月の治療実績を公開しています', 'zh-TW': '每月公開治療實績', 'zh-CN': '每月公开治疗实绩', en: 'Monthly results published transparently' } as Record<Language, string>,

  // Facility
  facilityTag: { ja: '施設紹介', 'zh-TW': '設施簡介', 'zh-CN': '设施简介', en: 'Facilities' } as Record<Language, string>,
  facilityTitle: { ja: 'メディカルりんくうポートの充実した医療環境', 'zh-TW': '醫療臨空港的完善醫療環境', 'zh-CN': '医疗临空港的完善医疗环境', en: 'Comprehensive Medical Environment at Medical Rinku Port' } as Record<Language, string>,
  facilityDesc: { ja: '3階・4階・5階に広がる診療空間。最新の医療設備と快適な療養環境を完備し、患者様に安心して治療を受けていただけます。', 'zh-TW': '橫跨3樓·4樓·5樓的診療空間。配備最新醫療設備與舒適療養環境，為患者提供安心的治療。', 'zh-CN': '横跨3楼·4楼·5楼的诊疗空间。配备最新医疗设备与舒适疗养环境，为患者提供安心的治疗。', en: 'Medical space across 3F, 4F, and 5F. Equipped with state-of-the-art medical equipment and comfortable recovery environment.' } as Record<Language, string>,

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

  // Treatment Protocols
  protocolTag: { ja: '治療詳細', 'zh-TW': '治療詳情', 'zh-CN': '治疗详情', en: 'Treatment Details' } as Record<Language, string>,
  protocolTitle: { ja: '治療流程紹介', 'zh-TW': '治療流程介紹', 'zh-CN': '治疗流程介绍', en: 'Treatment Protocols' } as Record<Language, string>,
  protocolDesc: { ja: '各治療法の詳細な流れと注意事項', 'zh-TW': '各治療方法的詳細流程與注意事項', 'zh-CN': '各治疗方法的详细流程与注意事项', en: 'Detailed protocols and precautions for each treatment' } as Record<Language, string>,

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
  accessAddress1: { ja: '大阪府泉佐野市りんくう往来南3-41', 'zh-TW': '大阪府泉佐野市臨空往來南3-41', 'zh-CN': '大阪府泉佐野市临空往来南3-41', en: '3-41 Rinku Orai Minami, Izumisano, Osaka' } as Record<Language, string>,
  accessAddress2: { ja: 'メディカルりんくうポート 3F〜5F', 'zh-TW': 'Medical Rinku Port 3F〜5F', 'zh-CN': 'Medical Rinku Port 3F〜5F', en: 'Medical Rinku Port 3F-5F' } as Record<Language, string>,
  accessStation: { ja: 'りんくうタウン駅より徒歩10分 / 関西空港から1駅', 'zh-TW': '臨空城站步行10分鐘 / 距關西機場1站', 'zh-CN': '临空城站步行10分钟 / 距关西机场1站', en: '10-min walk from Rinku Town Station / 1 stop from Kansai Airport' } as Record<Language, string>,
  accessHours: { ja: '月・火・水・金・土 9:00〜17:00', 'zh-TW': '週一·二·三·五·六 9:00〜17:00', 'zh-CN': '周一·二·三·五·六 9:00〜17:00', en: 'Mon, Tue, Wed, Fri, Sat 9:00-17:00' } as Record<Language, string>,
  accessClosed: { ja: '休診：木・日・祝日', 'zh-TW': '休診：週四·週日·假日', 'zh-CN': '休诊：周四·周日·假日', en: 'Closed: Thu, Sun, Public Holidays' } as Record<Language, string>,
  accessRouteTag: { ja: '駅からのルート', 'zh-TW': '車站路線', 'zh-CN': '车站路线', en: 'Route from Station' } as Record<Language, string>,
  accessRouteTitle: { ja: 'りんくうタウン駅からクリニックまで', 'zh-TW': '從臨空城站到診所', 'zh-CN': '从临空城站到诊所', en: 'Rinku Town Station to Clinic' } as Record<Language, string>,
  accessRouteDesc: { ja: '駅から徒歩10分。実際の道のりを写真でご案内します。', 'zh-TW': '車站步行10分鐘。實拍路線照片指引。', 'zh-CN': '车站步行10分钟。实拍路线照片指引。', en: '10-minute walk from station. Photo guide of the actual route.' } as Record<Language, string>,

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
  resultsMonthlyDesc: { ja: '毎月平均60〜70件の血管内治療を実施。2026年1-2月実績：130例（原発腫瘍106例含む）。治療件数はウェブサイトで公開中。', 'zh-TW': '每月平均實施60-70次血管內治療。2026年1-2月實績：130例（含原發腫瘤106例）。治療件數於網站公開。', 'zh-CN': '每月平均实施60-70次血管内治疗。2026年1-2月实绩：130例（含原发肿瘤106例）。治疗件数于网站公开。', en: 'Average 60-70 endovascular treatments per month. 2026 Jan-Feb: 130 cases (106 primary tumors). Case numbers published on website.' } as Record<Language, string>,
  resultsConference: { ja: '学会発表', 'zh-TW': '學會發表', 'zh-CN': '学会发表', en: 'Conference Presentations' } as Record<Language, string>,
  resultsConferenceDesc: { ja: '国際学会・国内学会での治療成果発表を継続的に実施。', 'zh-TW': '持續於國際及國內學會發表治療成果。', 'zh-CN': '持续于国际及国内学会发表治疗成果。', en: 'Ongoing presentations of treatment outcomes at international and domestic conferences.' } as Record<Language, string>,
  resultsAward: { ja: '2024年CIRSE最高賞「Magna Cum Laude」受賞', 'zh-TW': '2024年CIRSE最高獎「Magna Cum Laude」', 'zh-CN': '2024年CIRSE最高奖「Magna Cum Laude」', en: '2024 CIRSE "Magna Cum Laude" Award' } as Record<Language, string>,
  results2026: { ja: '2026年1-2月治療実績：130例', 'zh-TW': '2026年1-2月治療實績：130例', 'zh-CN': '2026年1-2月治疗实绩：130例', en: '2026 Jan-Feb: 130 cases' } as Record<Language, string>,

  // Hospitalization
  hospTag: { ja: '入院のご案内', 'zh-TW': '住院指南', 'zh-CN': '住院指南', en: 'Hospitalization Guide' } as Record<Language, string>,
  hospTitle: { ja: '快適な入院環境', 'zh-TW': '舒適的住院環境', 'zh-CN': '舒适的住院环境', en: 'Comfortable Hospitalization' } as Record<Language, string>,
  hospDesc: { ja: '基本入院期間は3泊4日。患者様のニーズに応じた3つの病室タイプをご用意しています。', 'zh-TW': '基本住院期間為3晚4天。我們備有3種病房類型以滿足患者需求。', 'zh-CN': '基本住院期间为3晚4天。我们备有3种病房类型以满足患者需求。', en: 'Standard stay: 3 nights 4 days. Three room types available to meet patient needs.' } as Record<Language, string>,
  hospStandard: { ja: '4人部屋', 'zh-TW': '4人病房', 'zh-CN': '4人病房', en: '4-Bed Room' } as Record<Language, string>,
  hospStandardDesc: { ja: 'スタンダード病室。共用デイルーム利用可能。', 'zh-TW': '標準病房。可使用共用日間活動室。', 'zh-CN': '标准病房。可使用共用日间活动室。', en: 'Standard ward. Shared day room available.' } as Record<Language, string>,
  hospPrivate: { ja: '個室', 'zh-TW': '單人病房', 'zh-CN': '单人病房', en: 'Private Room' } as Record<Language, string>,
  hospPrivateDesc: { ja: 'シャワー・トイレ完備。テレビ、冷蔵庫、アメニティセット付き。', 'zh-TW': '配備淋浴·廁所。附電視、冰箱、盥洗用品。', 'zh-CN': '配备淋浴·厕所。附电视、冰箱、盥洗用品。', en: 'En-suite shower & toilet. TV, fridge, amenities included.' } as Record<Language, string>,
  hospPrivatePrice: { ja: '¥38,500/日（税込）', 'zh-TW': '¥38,500/日（含稅）', 'zh-CN': '¥38,500/日（含税）', en: '¥38,500/day (tax incl.)' } as Record<Language, string>,
  hospSpecial: { ja: '特別室', 'zh-TW': '特別病房', 'zh-CN': '特别病房', en: 'Special Room' } as Record<Language, string>,
  hospSpecialDesc: { ja: 'セミダブルベッド、ソファーベッド（2名宿泊対応）。バスルーム・応接セット完備。', 'zh-TW': '半雙人床、沙發床（可住2人）。配備浴室、會客設施。', 'zh-CN': '半双人床、沙发床（可住2人）。配备浴室、会客设施。', en: 'Semi-double bed, sofa bed (2 guests). Bathroom & lounge set included.' } as Record<Language, string>,
  hospSpecialPrice: { ja: '¥55,000/日（税込）', 'zh-TW': '¥55,000/日（含稅）', 'zh-CN': '¥55,000/日（含税）', en: '¥55,000/day (tax incl.)' } as Record<Language, string>,

  // Hyperthermia Details
  hyperDetailTag: { ja: '温熱療法詳細', 'zh-TW': '溫熱療法詳解', 'zh-CN': '温热疗法详解', en: 'Hyperthermia Details' } as Record<Language, string>,
  hyperDevice: { ja: '装置：サーモトロンRF8（8MHz高周波）', 'zh-TW': '設備：Thermotron RF8（8MHz高頻）', 'zh-CN': '设备：Thermotron RF8（8MHz高频）', en: 'Device: Thermotron RF8 (8MHz RF)' } as Record<Language, string>,
  hyperFreq: { ja: '週1回、約40分/回', 'zh-TW': '每週1次，約40分鐘/次', 'zh-CN': '每周1次，约40分钟/次', en: 'Once weekly, ~40min/session' } as Record<Language, string>,
  hyperTemp: { ja: '腫瘍を42°C以上に加温してがん細胞を壊死', 'zh-TW': '將腫瘤加熱至42°C以上使癌細胞壞死', 'zh-CN': '将肿瘤加热至42°C以上使癌细胞坏死', en: 'Heat tumor to 42°C+ to necrotize cancer cells' } as Record<Language, string>,
  hyperQOL: { ja: 'QOL改善：食欲増進、体力回復、睡眠改善', 'zh-TW': 'QOL改善：增進食慾、恢復體力、改善睡眠', 'zh-CN': 'QOL改善：增进食欲、恢复体力、改善睡眠', en: 'QOL improvement: Appetite, vitality, sleep' } as Record<Language, string>,
  hyperInsurance: { ja: '健康保険適用', 'zh-TW': '適用健康保險', 'zh-CN': '适用健康保险', en: 'Insurance Covered' } as Record<Language, string>,

  // Other Services
  otherServicesTag: { ja: 'その他の診療', 'zh-TW': '其他診療服務', 'zh-CN': '其他诊疗服务', en: 'Other Services' } as Record<Language, string>,
  otherServicesTitle: { ja: 'がん治療をトータルサポート', 'zh-TW': '全方位癌症治療支援', 'zh-CN': '全方位癌症治疗支援', en: 'Comprehensive Cancer Care' } as Record<Language, string>,
  lymphedemaTitle: { ja: 'リンパ浮腫外来', 'zh-TW': '淋巴水腫門診', 'zh-CN': '淋巴水肿门诊', en: 'Lymphedema Clinic' } as Record<Language, string>,
  lymphedemaDesc: { ja: 'がん治療後のむくみケア。早期発見・早期治療を重視。', 'zh-TW': '癌症治療後水腫護理。重視早期發現與治療。', 'zh-CN': '癌症治疗后水肿护理。重视早期发现与治疗。', en: 'Post-cancer treatment edema care. Focus on early detection & treatment.' } as Record<Language, string>,
  lymphedemaPrice: { ja: '初診¥4,000 + 施術料¥6,500～', 'zh-TW': '初診¥4,000 + 施術費¥6,500起', 'zh-CN': '初诊¥4,000 + 施术费¥6,500起', en: 'Initial ¥4,000 + Treatment from ¥6,500' } as Record<Language, string>,
  cancerScreeningTitle: { ja: '特殊がん検診', 'zh-TW': '特殊癌症檢查', 'zh-CN': '特殊癌症检查', en: 'Special Cancer Screening' } as Record<Language, string>,
  cancerScreeningDesc: { ja: 'CT検査と血液検査を組み合わせた精密スクリーニング。当日に放射線診断専門医が結果説明。', 'zh-TW': 'CT檢查與血液檢查結合的精密篩檢。當天由放射診斷專科醫師說明結果。', 'zh-CN': 'CT检查与血液检查结合的精密筛检。当天由放射诊断专科医师说明结果。', en: 'Precise screening combining CT & blood tests. Same-day results explained by radiology specialist.' } as Record<Language, string>,
  cancerScreeningPrice: { ja: '¥47,520～（造影CT：¥69,520）', 'zh-TW': '¥47,520起（顯影CT：¥69,520）', 'zh-CN': '¥47,520起（显影CT：¥69,520）', en: 'From ¥47,520 (Contrast CT: ¥69,520)' } as Record<Language, string>,

  // Media Coverage
  mediaTag: { ja: 'メディア掲載', 'zh-TW': '媒體報導', 'zh-CN': '媒体报道', en: 'Media Coverage' } as Record<Language, string>,
  mediaTitle: { ja: '国内外メディアで紹介されています', 'zh-TW': '獲國內外媒體報導', 'zh-CN': '获国内外媒体报道', en: 'Featured in Media' } as Record<Language, string>,
  mediaDesc: { ja: 'IGTクリニックの先進的な治療技術は、国内外の主要メディアで紹介されています。', 'zh-TW': 'IGT診所的先進治療技術獲得國內外主流媒體報導。', 'zh-CN': 'IGT诊所的先进治疗技术获得国内外主流媒体报道。', en: 'IGT Clinic\'s advanced treatment technology has been featured in major domestic and international media.' } as Record<Language, string>,

  // Academic Achievements
  academicTag: { ja: '学術実績', 'zh-TW': '學術成就', 'zh-CN': '学术成就', en: 'Academic Achievements' } as Record<Language, string>,
  academicTitle: { ja: '国際的な学術活動', 'zh-TW': '國際學術活動', 'zh-CN': '国际学术活动', en: 'International Academic Activities' } as Record<Language, string>,
  academicDesc: { ja: '世界トップレベルの学術交流と研究発表を継続的に実施。', 'zh-TW': '持續進行世界頂尖水準的學術交流與研究發表。', 'zh-CN': '持续进行世界顶尖水准的学术交流与研究发表。', en: 'Continuous world-class academic exchange and research presentations.' } as Record<Language, string>,

  // Patient Testimonials
  testimonialTag: { ja: '患者の声', 'zh-TW': '患者見證', 'zh-CN': '患者见证', en: 'Patient Testimonials' } as Record<Language, string>,
  testimonialTitle: { ja: '治療を受けられた患者様の声', 'zh-TW': '接受治療患者的心聲', 'zh-CN': '接受治疗患者的心声', en: 'Voices from Our Patients' } as Record<Language, string>,
  testimonialDesc: { ja: '実際に治療を受けられた患者様のインタビュー動画をご覧いただけます。', 'zh-TW': '您可以觀看接受治療患者的訪談影片。', 'zh-CN': '您可以观看接受治疗患者的访谈视频。', en: 'Watch interview videos from patients who received treatment.' } as Record<Language, string>,

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
  // Treatment Pricing
  pricingTag: { ja: '治療料金', 'zh-TW': '治療價格', 'zh-CN': '治疗价格', en: 'Treatment Pricing' } as Record<Language, string>,
  pricingTitle: { ja: 'IGT治療メニュー・料金表', 'zh-TW': 'IGT治療項目·價格表', 'zh-CN': 'IGT治疗项目·价格表', en: 'IGT Treatment Menu & Pricing' } as Record<Language, string>,
  pricingDesc: { ja: '治療内容に応じて最適なプランをお選びください（すべて税込価格）', 'zh-TW': '根據治療內容選擇最佳方案（價格均含稅）', 'zh-CN': '根据治疗内容选择最佳方案（价格均含税）', en: 'Choose the optimal plan based on treatment type (all prices tax-included)' } as Record<Language, string>,
  pricingCta: { ja: '治療を予約する', 'zh-TW': '預約治療', 'zh-CN': '预约治疗', en: 'Book Treatment' } as Record<Language, string>,
  pricingNote: { ja: '※ 料金は参考価格です。最終的な治療費用は医師の診察後に確定いたします', 'zh-TW': '※ 以上為參考價格，最終治療費用於醫師診察後確定', 'zh-CN': '※ 以上为参考价格，最终治疗费用于医师诊察后确定', en: '* Prices are for reference. Final costs are confirmed after physician consultation' } as Record<Language, string>,
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
  {
    name: { ja: '出嶋 育朗', 'zh-TW': '出嶋 育朗', 'zh-CN': '出岛 育朗', en: 'Ikuo Dejima' } as Record<Language, string>,
    title: { ja: '非常勤医師', 'zh-TW': '兼職醫師', 'zh-CN': '兼职医师', en: 'Part-time Physician' } as Record<Language, string>,
    specialty: { ja: '放射線診断・IVR', 'zh-TW': '放射診斷·IVR', 'zh-CN': '放射诊断·IVR', en: 'Radiology, IVR' } as Record<Language, string>,
    photo: 'https://igtc.jp/images/staff/desaki.jpg',
  },
  {
    name: { ja: '熊本 亮彦', 'zh-TW': '熊本 亮彥', 'zh-CN': '熊本 亮彦', en: 'Akihiko Kumamoto' } as Record<Language, string>,
    title: { ja: '非常勤医師', 'zh-TW': '兼職醫師', 'zh-CN': '兼职医师', en: 'Part-time Physician' } as Record<Language, string>,
    specialty: { ja: '放射線診断・IVR', 'zh-TW': '放射診斷·IVR', 'zh-CN': '放射诊断·IVR', en: 'Radiology, IVR' } as Record<Language, string>,
    photo: 'https://igtc.jp/images/staff/st_dc_kumamoto2.jpg',
  },
];

const FACILITY_PHOTOS = [
  { src: 'https://igtc.jp/images/shisetsu/gaikan.jpg', title: { ja: '外観', 'zh-TW': '外觀', 'zh-CN': '外观', en: 'Exterior' } as Record<Language, string>, desc: { ja: 'メディカルりんくうポート', 'zh-TW': '醫療臨空港大樓', 'zh-CN': '医疗临空港大楼', en: 'Medical Rinku Port Building' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/shisetsu/uketsuke.jpg', title: { ja: '受付', 'zh-TW': '接待處', 'zh-CN': '接待处', en: 'Reception' } as Record<Language, string>, desc: { ja: '4階受付カウンター', 'zh-TW': '4樓接待櫃台', 'zh-CN': '4楼接待柜台', en: '4F Reception Counter' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/shisetsu/01nars-station.jpg', title: { ja: 'ナースステーション', 'zh-TW': '護士站', 'zh-CN': '护士站', en: 'Nurse Station' } as Record<Language, string>, desc: { ja: '24時間対応可能', 'zh-TW': '24小時值班', 'zh-CN': '24小时值班', en: '24-Hour Availability' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/shisetsu/shinsatsu.jpg', title: { ja: '診察室', 'zh-TW': '診療室', 'zh-CN': '诊疗室', en: 'Examination Room' } as Record<Language, string>, desc: { ja: '個室診療室', 'zh-TW': '獨立診療室', 'zh-CN': '独立诊疗室', en: 'Private Consultation Room' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/shisetsu/36ct.jpg', title: { ja: '64列CT', 'zh-TW': '64排CT', 'zh-CN': '64排CT', en: '64-Slice CT' } as Record<Language, string>, desc: { ja: '最新鋭CT装置', 'zh-TW': '最新CT設備', 'zh-CN': '最新CT设备', en: 'State-of-the-art CT Scanner' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/shisetsu/onnetsu.jpg', title: { ja: '温熱療法室', 'zh-TW': '溫熱療法室', 'zh-CN': '温热疗法室', en: 'Hyperthermia Room' } as Record<Language, string>, desc: { ja: 'ハイパーサーミア装置', 'zh-TW': '溫熱治療設備', 'zh-CN': '温热治疗设备', en: 'Hyperthermia Equipment' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/shisetsu/05-1room.jpg', title: { ja: '個室病室', 'zh-TW': '單人病房', 'zh-CN': '单人病房', en: 'Private Room' } as Record<Language, string>, desc: { ja: 'プライバシー重視の個室', 'zh-TW': '注重隱私的獨立病房', 'zh-CN': '注重隐私的独立病房', en: 'Privacy-Focused Private Room' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/shisetsu/06-tokubetsu.jpg', title: { ja: '特別室', 'zh-TW': '特別病房', 'zh-CN': '特别病房', en: 'Special Room' } as Record<Language, string>, desc: { ja: '快適な療養環境', 'zh-TW': '舒適的療養環境', 'zh-CN': '舒适的疗养环境', en: 'Comfortable Recovery Environment' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/shisetsu/03-4room.jpg', title: { ja: '4人部屋', 'zh-TW': '4人病房', 'zh-CN': '4人病房', en: '4-Bed Room' } as Record<Language, string>, desc: { ja: 'スタンダード病室', 'zh-TW': '標準病房', 'zh-CN': '标准病房', en: 'Standard Ward' } as Record<Language, string> },
];

const ACCESS_ROUTE_PHOTOS = [
  { src: 'https://igtc.jp/images/access/ac_eki_01.jpg', caption: { ja: 'りんくうタウン駅 改札口', 'zh-TW': '臨空城站 檢票口', 'zh-CN': '临空城站 检票口', en: 'Rinku Town Station Gate' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/access/ac_eki_02.jpg', caption: { ja: '駅出口から歩道橋へ', 'zh-TW': '車站出口往人行天橋', 'zh-CN': '车站出口往人行天桥', en: 'Exit to Pedestrian Bridge' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/access/ac_eki_03.jpg', caption: { ja: '歩道橋上の分岐点', 'zh-TW': '人行天橋分岔路口', 'zh-CN': '人行天桥分岔路口', en: 'Bridge Junction' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/access/ac_eki_04.jpg', caption: { ja: 'エレベーターを降りて', 'zh-TW': '電梯下來後', 'zh-CN': '电梯下来后', en: 'After Elevator' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/access/ac_eki_05.jpg', caption: { ja: '航空保安大学校の建物', 'zh-TW': '航空保安大學建築', 'zh-CN': '航空保安大学建筑', en: 'Aviation College Building' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/access/ac_eki_06.jpg', caption: { ja: 'メディカルりんくうポート入口', 'zh-TW': '醫療臨空港入口', 'zh-CN': '医疗临空港入口', en: 'Medical Rinku Port Entrance' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/access/ac_eki_07.jpg', caption: { ja: '1階エントランス', 'zh-TW': '1樓大廳', 'zh-CN': '1楼大厅', en: '1F Entrance Hall' } as Record<Language, string> },
  { src: 'https://igtc.jp/images/access/ac_eki_08.jpg', caption: { ja: 'IGTクリニック4階受付', 'zh-TW': 'IGT診所4樓接待處', 'zh-CN': 'IGT诊所4楼接待处', en: 'IGT Clinic 4F Reception' } as Record<Language, string> },
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

//======================================
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
    name: { ja: '血管内治療 標準コース', 'zh-TW': '血管內治療 標準套餐', 'zh-CN': '血管内治疗 标准套餐', en: 'Endovascular Treatment - Standard Courses' } as Record<Language, string>,
    items: [
      { slug: 'igtc-standard-initial', label: { ja: '初回（1泊2日）', 'zh-TW': '初回（1晚2天）', 'zh-CN': '初回（1晚2天）', en: 'Initial (2D/1N)' } as Record<Language, string> },
      { slug: 'igtc-standard-subsequent', label: { ja: '2回目以降（1泊2日）', 'zh-TW': '第2次及之後（1晚2天）', 'zh-CN': '第2次及之后（1晚2天）', en: 'Follow-up (2D/1N)' } as Record<Language, string> },
      { slug: 'igtc-standard-outpatient', label: { ja: '外来済（1泊2日）', 'zh-TW': '已完成外來診察（1晚2天）', 'zh-CN': '已完成外来诊察（1晚2天）', en: 'Post-Outpatient (2D/1N)' } as Record<Language, string> },
      { slug: 'igtc-hyperthermia-hydrogen', label: { ja: '温熱治療（水素併用）', 'zh-TW': '溫熱治療（併用水素）', 'zh-CN': '温热治疗（并用水素）', en: 'Hyperthermia with Hydrogen' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: '自家がんワクチン', 'zh-TW': '自家癌症疫苗', 'zh-CN': '自家癌症疫苗', en: 'Autologous Cancer Vaccine' } as Record<Language, string>,
    items: [
      { slug: 'igtc-cancer-vaccine-1', label: { ja: '1回コース', 'zh-TW': '1次療程', 'zh-CN': '1次疗程', en: '1 Dose' } as Record<Language, string> },
      { slug: 'igtc-cancer-vaccine-2', label: { ja: '2回コース', 'zh-TW': '2次療程', 'zh-CN': '2次疗程', en: '2 Doses' } as Record<Language, string> },
      { slug: 'igtc-cancer-vaccine-3', label: { ja: '3回コース', 'zh-TW': '3次療程', 'zh-CN': '3次疗程', en: '3 Doses' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: '免疫細胞療法（静注）', 'zh-TW': '免疫細胞療法（靜注）', 'zh-CN': '免疫细胞疗法（静注）', en: 'Immune Cell Therapy (IV)' } as Record<Language, string>,
    items: [
      { slug: 'igtc-immune-iv-1', label: { ja: '1回', 'zh-TW': '1次', 'zh-CN': '1次', en: '1 Session' } as Record<Language, string> },
      { slug: 'igtc-immune-iv-6', label: { ja: '6回コース', 'zh-TW': '6次療程', 'zh-CN': '6次疗程', en: '6 Sessions' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: '幹細胞治療', 'zh-TW': '幹細胞治療', 'zh-CN': '干细胞治疗', en: 'Stem Cell Therapy' } as Record<Language, string>,
    items: [
      { slug: 'igtc-stem-cell-4', label: { ja: '4回コース', 'zh-TW': '4次療程', 'zh-CN': '4次疗程', en: '4 Sessions' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: 'CTC検査', 'zh-TW': 'CTC檢查', 'zh-CN': 'CTC检查', en: 'CTC Tests' } as Record<Language, string>,
    items: [
      { slug: 'igtc-ctc-oncocount', label: { ja: 'Oncocount', 'zh-TW': 'Oncocount', 'zh-CN': 'Oncocount', en: 'Oncocount' } as Record<Language, string> },
      { slug: 'igtc-ctc-oncotrace', label: { ja: 'Oncotrace', 'zh-TW': 'Oncotrace', 'zh-CN': 'Oncotrace', en: 'Oncotrace' } as Record<Language, string> },
      { slug: 'igtc-ctc-onconomics', label: { ja: 'Onconomics', 'zh-TW': 'Onconomics', 'zh-CN': 'Onconomics', en: 'Onconomics' } as Record<Language, string> },
      { slug: 'igtc-ctc-onconomics-plus', label: { ja: 'Onconomics Plus', 'zh-TW': 'Onconomics Plus', 'zh-CN': 'Onconomics Plus', en: 'Onconomics Plus' } as Record<Language, string> },
    ],
  },
  {
    name: { ja: '特殊がん検診', 'zh-TW': '特殊癌症檢診', 'zh-CN': '特殊癌症检诊', en: 'Special Cancer Screening' } as Record<Language, string>,
    items: [
      { slug: 'igtc-cancer-screening', label: { ja: 'CTCなし', 'zh-TW': '不含CTC', 'zh-CN': '不含CTC', en: 'Without CTC' } as Record<Language, string> },
      { slug: 'igtc-cancer-screening-ctc', label: { ja: 'CTC付き', 'zh-TW': '含CTC', 'zh-CN': '含CTC', en: 'With CTC' } as Record<Language, string> },
    ],
  },
];

const MEDIA_COVERAGE = [
  {
    title: { ja: 'NHK WORLD 取材', 'zh-TW': 'NHK WORLD 採訪', 'zh-CN': 'NHK WORLD 采访', en: 'NHK WORLD Interview' } as Record<Language, string>,
    desc: { ja: '国際放送NHK WORLDによる取材', 'zh-TW': '國際廣播NHK WORLD採訪報導', 'zh-CN': '国际广播NHK WORLD采访报道', en: 'Featured on NHK WORLD international broadcast' } as Record<Language, string>,
    url: 'https://video.weibo.com/show?fid=1034:4575173697798161',
    type: 'video' as const,
  },
  {
    title: { ja: '超級医生インタビュー', 'zh-TW': '超級醫生訪談', 'zh-CN': '超级医生访谈', en: 'Super Doctor Interview' } as Record<Language, string>,
    desc: { ja: '堀院長のインタビュー特集', 'zh-TW': '堀院長專訪特輯', 'zh-CN': '堀院长专访特辑', en: 'Special interview with Dr. Hori' } as Record<Language, string>,
    url: 'https://video.weibo.com/show?fid=1034:4700096064061480',
    type: 'video' as const,
  },
  {
    title: { ja: 'ラジオ取材', 'zh-TW': '電台採訪', 'zh-CN': '电台采访', en: 'Radio Interview' } as Record<Language, string>,
    desc: { ja: '血管内治療についてのラジオ取材', 'zh-TW': '血管內治療電台專訪', 'zh-CN': '血管内治疗电台专访', en: 'Radio interview on endovascular treatment' } as Record<Language, string>,
    url: 'https://video.weibo.com/show?fid=1034:4763243483431033',
    type: 'video' as const,
  },
  {
    title: { ja: 'IGTクリニック紹介', 'zh-TW': 'IGT診所簡介', 'zh-CN': 'IGT诊所简介', en: 'IGT Clinic Introduction' } as Record<Language, string>,
    desc: { ja: 'クリニックの施設・治療紹介', 'zh-TW': '診所設施與治療介紹', 'zh-CN': '诊所设施与治疗介绍', en: 'Clinic facilities and treatment overview' } as Record<Language, string>,
    url: 'https://video.weibo.com/show?fid=1034:4573386341548061',
    type: 'video' as const,
  },
];

const ACADEMIC_ACHIEVEMENTS = [
  {
    year: '2024',
    title: { ja: 'CIRSE最高賞「Magna Cum Laude」受賞', 'zh-TW': 'CIRSE最高獎「Magna Cum Laude」', 'zh-CN': 'CIRSE最高奖「Magna Cum Laude」', en: 'CIRSE "Magna Cum Laude" Award' } as Record<Language, string>,
    desc: { ja: 'ポルトガル・リスボンで開催された国際学会CIRSEにて、乳がん治療の研究発表5件を実施し、最高賞を受賞', 'zh-TW': '於葡萄牙里斯本舉行的國際學會CIRSE發表5項乳腺癌治療研究，榮獲最高獎', 'zh-CN': '于葡萄牙里斯本举行的国际学会CIRSE发表5项乳腺癌治疗研究，荣获最高奖', en: 'Presented 5 breast cancer treatment studies at CIRSE in Lisbon, Portugal, receiving the highest honor' } as Record<Language, string>,
    icon: Award,
  },
  {
    year: '2021',
    title: { ja: 'アジア太平洋腫瘍介入会議（APCIO）講演', 'zh-TW': '亞太腫瘤介入會議（APCIO）演講', 'zh-CN': '亚太肿瘤介入会议（APCIO）演讲', en: 'APCIO Conference Speaker' } as Record<Language, string>,
    desc: { ja: '北京大学主催のアジア太平洋腫瘤介入会議にて、堀信一理事長が講演。国際的な学術交流を実施', 'zh-TW': '堀信一理事長於北京大學主辦的亞太腫瘤介入會議演講，進行國際學術交流', 'zh-CN': '堀信一理事长于北京大学主办的亚太肿瘤介入会议演讲，进行国际学术交流', en: 'Dr. Shinichi Hori presented at the Asia-Pacific Conference on Interventional Oncology hosted by Peking University' } as Record<Language, string>,
    icon: Globe,
  },
  {
    year: '2010',
    title: { ja: '広州復旦大学附属腫瘍医院 特別顧問就任', 'zh-TW': '廣州復旦大學附屬腫瘤醫院 特別顧問', 'zh-CN': '广州复旦大学附属肿瘤医院 特别顾问', en: 'Special Advisor, Fuda Cancer Hospital' } as Record<Language, string>,
    desc: { ja: '堀信一理事長が広州復旦大学附属腫瘍医院の特別顧問に就任。中国との学術交流を強化', 'zh-TW': '堀信一理事長獲聘為廣州復旦大學附屬腫瘤醫院特別顧問，加強與中國的學術交流', 'zh-CN': '堀信一理事长获聘为广州复旦大学附属肿瘤医院特别顾问，加强与中国的学术交流', en: 'Dr. Shinichi Hori appointed as Special Advisor to Fuda Cancer Hospital, strengthening academic exchange with China' } as Record<Language, string>,
    icon: Shield,
  },
];

const PATIENT_TESTIMONIALS = [
  {
    title: { ja: '患者インタビュー 1', 'zh-TW': '患者訪談 1', 'zh-CN': '患者访谈 1', en: 'Patient Interview 1' } as Record<Language, string>,
    url: 'https://video.weibo.com/show?fid=1034:4704200555429975',
  },
  {
    title: { ja: '患者インタビュー 2', 'zh-TW': '患者訪談 2', 'zh-CN': '患者访谈 2', en: 'Patient Interview 2' } as Record<Language, string>,
    url: 'https://video.weibo.com/show?fid=1034:4716742619103301',
  },
  {
    title: { ja: '患者インタビュー 3', 'zh-TW': '患者訪談 3', 'zh-CN': '患者访谈 3', en: 'Patient Interview 3' } as Record<Language, string>,
    url: 'https://video.weibo.com/show?fid=1034:4716467506315358',
  },
  {
    title: { ja: '患者インタビュー 4', 'zh-TW': '患者訪談 4', 'zh-CN': '患者访谈 4', en: 'Patient Interview 4' } as Record<Language, string>,
    url: 'https://video.weibo.com/show?fid=1034:4715310583054402',
  },
];

// ======================================
// 组件
// ======================================
export default function IGTCContent({ isGuideEmbed, guideSlug }: Props) {
  const lang = useLanguage();
  const [expandedProtocol, setExpandedProtocol] = useState<number | null>(null);

  return (
    <div className="bg-white">

      {/* ========== HERO ========== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/igtc/gaikan.jpg"
            alt="IGT Clinic"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/75 via-gray-900/55 to-cyan-950/30" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                {t(tr.heroTitle, lang)}
              </h1>
              <p className="text-xl md:text-2xl text-cyan-200 mb-4">
                {t(tr.heroSubtitle, lang)}
              </p>
              <p className="text-lg text-white/95 font-medium mb-6 italic">
                {t(tr.heroMission, lang)}
              </p>
              <p className="text-base text-gray-300/90 leading-relaxed mb-8 max-w-lg whitespace-pre-line">
                {t(tr.heroText, lang)}
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {['保険適用', '血管内治療', '温熱療法', '月間実績公開'].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>
              <a href="#cta" className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg">
                {t(tr.ctaTitle, lang)}
                <ArrowRight size={20} />
              </a>
            </div>
            <div className="hidden lg:block">
              {/* Right side space - can add stats or images later */}
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.statsTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.statsTitle, lang)}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border hover:shadow-lg transition">
                <s.icon size={32} className="text-cyan-600 mx-auto mb-3" />
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
            <span className="text-cyan-600 font-medium text-sm">{t(tr.perfTag, lang)}</span>
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
            <span className="text-cyan-600 font-medium text-sm">{t(tr.facilityTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.facilityTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{t(tr.facilityDesc, lang)}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Location */}
            <div className="bg-white rounded-2xl p-8 border hover:shadow-lg transition">
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <MapPin size={32} className="text-cyan-600" />
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
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Microscope size={32} className="text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t(tr.facilityEquipment, lang)}</h3>
              <p className="text-gray-600 text-center leading-relaxed">{t(tr.facilityEquipmentDesc, lang)}</p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-cyan-600 shrink-0" />
                  <span>{lang === 'ja' ? '血管造影装置' : lang === 'en' ? 'Angiography System' : '血管造影设备'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-cyan-600 shrink-0" />
                  <span>{lang === 'ja' ? '温熱治療機器' : lang === 'en' ? 'Hyperthermia System' : '温热治疗仪器'}</span>
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="bg-white rounded-2xl p-8 border hover:shadow-lg transition">
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <BedDouble size={32} className="text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t(tr.facilityEnvironment, lang)}</h3>
              <p className="text-gray-600 text-center leading-relaxed">{t(tr.facilityEnvironmentDesc, lang)}</p>
              <div className="mt-6 text-center">
                <span className="inline-block bg-cyan-50 text-cyan-600 px-4 py-2 rounded-lg text-sm font-medium">
                  {lang === 'ja' ? '3F〜5F 完全個室対応' : lang === 'en' ? 'Private Rooms 3F-5F' : '3F-5F 独立诊室'}
                </span>
              </div>
            </div>
          </div>

          {/* Facility Photos Gallery */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {lang === 'ja' ? '施設ギャラリー' : lang === 'en' ? 'Facility Gallery' : lang === 'zh-TW' ? '設施畫廊' : '设施画廊'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {FACILITY_PHOTOS.map((photo, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition group">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <img
                      src={photo.src}
                      alt={t(photo.title, lang)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{t(photo.title, lang)}</h4>
                    <p className="text-xs text-gray-600">{t(photo.desc, lang)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOSPITALIZATION ========== */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 via-white to-cyan-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.hospTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.hospTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{t(tr.hospDesc, lang)}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 4-Bed Room */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-cyan-400 transition">
              <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img
                  src="https://igtc.jp/images/hospitalization/hos_room4.jpg"
                  alt={t(tr.hospStandard, lang)}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t(tr.hospStandard, lang)}</h3>
              <p className="text-gray-600 text-sm mb-4">{t(tr.hospStandardDesc, lang)}</p>
              <div className="bg-cyan-50 rounded-lg p-3 text-center">
                <p className="text-cyan-800 font-bold">{lang === 'ja' ? '基本料金' : lang === 'en' ? 'Standard Rate' : '基本費用'}</p>
              </div>
            </div>

            {/* Private Room */}
            <div className="bg-white rounded-2xl p-6 border-2 border-cyan-400 hover:border-cyan-500 transition relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                {lang === 'ja' ? '人気' : lang === 'en' ? 'Popular' : '熱門'}
              </div>
              <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img
                  src="https://igtc.jp/images/hospitalization/hos_koshitu_01.jpg"
                  alt={t(tr.hospPrivate, lang)}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t(tr.hospPrivate, lang)}</h3>
              <p className="text-gray-600 text-sm mb-4">{t(tr.hospPrivateDesc, lang)}</p>
              <div className="bg-cyan-600 rounded-lg p-3 text-center">
                <p className="text-white font-bold">{t(tr.hospPrivatePrice, lang)}</p>
              </div>
            </div>

            {/* Special Room */}
            <div className="bg-white rounded-2xl p-6 border-2 border-sky-400 hover:border-sky-500 transition">
              <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img
                  src="https://igtc.jp/images/hospitalization/hos_tokubetu_01.jpg"
                  alt={t(tr.hospSpecial, lang)}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t(tr.hospSpecial, lang)}</h3>
              <p className="text-gray-600 text-sm mb-4">{t(tr.hospSpecialDesc, lang)}</p>
              <div className="bg-sky-500 rounded-lg p-3 text-center">
                <p className="text-white font-bold">{t(tr.hospSpecialPrice, lang)}</p>
              </div>
            </div>
          </div>

          {/* Day Room Info */}
          <div className="mt-8 bg-white rounded-2xl p-6 border">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-cyan-50 rounded-xl flex items-center justify-center shrink-0">
                <BedDouble size={28} className="text-cyan-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">
                  {lang === 'ja' ? '共用デイルーム' : lang === 'en' ? 'Shared Day Room' : lang === 'zh-TW' ? '共用日間活動室' : '共用日间活动室'}
                </h4>
                <p className="text-gray-600 text-sm">
                  {lang === 'ja' ? '自動販売機、トースター、ポット、電子レンジ、新聞などを完備。患者様および付き添いの方がくつろげる空間を提供しています。' : lang === 'en' ? 'Equipped with vending machines, toaster, kettle, microwave, newspapers. Relaxing space for patients and companions.' : lang === 'zh-TW' ? '配備自動販賣機、烤麵包機、熱水壺、微波爐、報紙等。為患者及陪同者提供休憩空間。' : '配备自动售货机、烤面包机、热水壶、微波炉、报纸等。为患者及陪同者提供休憩空间。'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TECHNICAL DETAILS ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.techTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.techTitle, lang)}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* IGT Technical Details */}
            <div className="bg-gradient-to-br from-cyan-700 to-cyan-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Syringe size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">{t(tr.techIGTDetail, lang)}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-cyan-200" />
                  <p className="leading-relaxed">{t(tr.techIGTPoint1, lang)}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-cyan-200" />
                  <p className="leading-relaxed">{t(tr.techIGTPoint2, lang)}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-cyan-200" />
                  <p className="leading-relaxed">{t(tr.techIGTPoint3, lang)}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-cyan-100">
                  {lang === 'ja' ? 'カテーテル技術により、がんの栄養血管に選択的に薬剤を投与し、腫瘍を縮小させます。' : lang === 'en' ? 'Catheter technology selectively delivers drugs to tumor feeding vessels to shrink tumors.' : '导管技术选择性地将药物输送到肿瘤供血血管以缩小肿瘤。'}
                </p>
              </div>
            </div>

            {/* Hyperthermia Technical Details */}
            <div className="bg-gradient-to-br from-sky-600 to-sky-500 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Thermometer size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">{t(tr.techHyperDetail, lang)}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-sky-100" />
                  <p className="leading-relaxed">{t(tr.techHyperPoint1, lang)}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-sky-100" />
                  <p className="leading-relaxed">{t(tr.techHyperPoint2, lang)}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-1 text-sky-100" />
                  <p className="leading-relaxed">{t(tr.techHyperPoint3, lang)}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-sky-50 mb-4">
                  {lang === 'ja' ? '温熱により、がん細胞を選択的に破壊し、他の治療法の効果を高めます。' : lang === 'en' ? 'Hyperthermia selectively destroys cancer cells and enhances other treatment effects.' : '温热选择性地破坏癌细胞并增强其他治疗效果。'}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-bold">{t(tr.hyperDevice, lang)}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-bold">{t(tr.hyperFreq, lang)}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 col-span-2">
                    <p className="font-bold">{t(tr.hyperTemp, lang)}</p>
                  </div>
                </div>
                <div className="mt-3 bg-white/10 rounded-lg p-3">
                  <p className="text-sm"><strong>{lang === 'ja' ? 'QOL改善効果' : lang === 'en' ? 'QOL Improvement' : 'QOL改善效果'}:</strong> {t(tr.hyperQOL, lang)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TREATMENTS ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.treatTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.treatTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* IGT */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-8 border border-cyan-200">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Syringe size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.igtTitle, lang)}</h3>
              <p className="text-gray-700 leading-relaxed">{t(tr.igtDesc, lang)}</p>
            </div>
            {/* Hyperthermia */}
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-8 border border-sky-200">
              <div className="w-14 h-14 bg-sky-500 rounded-xl flex items-center justify-center mb-4">
                <Thermometer size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.hyperTitle, lang)}</h3>
              <p className="text-gray-700 leading-relaxed">{t(tr.hyperDesc, lang)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TREATMENT PROTOCOLS ========== */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm uppercase tracking-wide">{t(tr.protocolTag, lang)}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">{t(tr.protocolTitle, lang)}</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">{t(tr.protocolDesc, lang)}</p>
          </div>

          <div className="grid gap-6">
            {/* 1. 肿瘤血管内介入治疗 */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
              <button
                onClick={() => setExpandedProtocol(expandedProtocol === 0 ? null : 0)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Syringe className="text-cyan-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {lang === 'ja' ? '肿瘤血管内介入治疗' : lang === 'en' ? 'Tumor Endovascular Intervention' : lang === 'zh-TW' ? '腫瘤血管內介入治療' : '肿瘤血管内介入治疗'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {lang === 'ja' ? '動脈塞栓術 + 化学療法' : lang === 'en' ? 'Arterial Embolization + Chemotherapy' : lang === 'zh-TW' ? '動脈栓塞術 + 化療' : '动脉栓塞术 + 化疗'}
                    </p>
                  </div>
                </div>
                {expandedProtocol === 0 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedProtocol === 0 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療概要' : lang === 'en' ? 'Overview' : lang === 'zh-TW' ? '治療概要' : '治疗概要'}
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {lang === 'ja' ? 'CT或血管造影装置の引導下で腫瘍に栄養を送る血管内に化学療法薬を注入し、栓塞物質を投入して腫瘍栄養血管を栓塞閉鎖することで、腫瘍への血液と栄養供給を遮断し、化学療法薬を腫瘍内に閉じ込めて薬物と腫瘍の接触時間を延長させ、最終的に腫瘍縮小と症状緩和を実現します。' : lang === 'en' ? 'Under CT or angiography guidance, chemotherapy drugs are injected into tumor-feeding blood vessels, followed by embolization to cut off blood and nutrition supply while trapping drugs inside the tumor, ultimately achieving tumor shrinkage and symptom relief.' : lang === 'zh-TW' ? '在CT或血管造影裝置的引導下向腫瘤輸送營養的血管內注入化療藥物進行動脈灌注，後投放栓塞物質將腫瘤營養血管栓塞封死，以切斷腫瘤的供血和營養供應，並將化療藥物困在腫瘤內延長藥物與腫瘤的接觸時間，最終實現縮小腫瘤和緩和症狀的目的。' : '在CT或血管造影装备的引导下向肿瘤输送营养的血管内注入化疗药物进行动脉灌注，后投放栓塞物质将肿瘤营养血管栓塞封死，以切断肿瘤的供血和营养供应，并将化疗药物困在肿瘤内延长药物与肿瘤的接触时间，最终实现缩小肿瘤和缓和症状的目的。'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療フロー' : lang === 'en' ? 'Treatment Flow' : lang === 'zh-TW' ? '治療流程' : '治疗流程'}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 font-bold mt-0.5">第1天：</span>
                          <span>{lang === 'ja' ? '医師診察、全身検査、治療方針決定' : lang === 'en' ? 'Medical consultation, physical examination, treatment plan determination' : lang === 'zh-TW' ? '醫生診察、全身體檢、確定治療方案' : '医生诊察、全身体检、确定治疗方案'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 font-bold mt-0.5">第2天：</span>
                          <span>{lang === 'ja' ? '入院、手術（約2時間）、医師による術後説明' : lang === 'en' ? 'Hospitalization, surgery (approx. 2 hours), post-operative explanation' : lang === 'zh-TW' ? '住院、手術（2個小時左右）、醫生術後說明' : '住院、手术（2个小时左右）、医生术后说明'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 font-bold mt-0.5">第3天：</span>
                          <span>{lang === 'ja' ? '退院' : lang === 'en' ? 'Discharge' : lang === 'zh-TW' ? '出院' : '出院'}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                      <h4 className="font-semibold text-cyan-900 mb-2 text-sm">
                        {lang === 'ja' ? '注意事項' : lang === 'en' ? 'Important Notes' : lang === 'zh-TW' ? '注意事項' : '注意事项'}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-cyan-800">
                        <li>• {lang === 'ja' ? '治療頻度：一般的に3回治療で1クール、各回約2週間間隔' : lang === 'en' ? 'Frequency: Generally 3 treatments per course, approx. 2-week intervals' : lang === 'zh-TW' ? '治療頻度：一般3次治療為一個療程，每次間隔2週左右' : '治疗频度：一般3次治疗为一个疗程，每次间隔2周左右'}</li>
                        <li>• {lang === 'ja' ? '治療時間：各回2泊3日の入院が必要' : lang === 'en' ? 'Duration: 2 nights, 3 days hospitalization per treatment' : lang === 'zh-TW' ? '治療時間：每次治療需住院兩晚三天' : '治疗时间：每次治疗需住院两晚三天'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. 温热治疗 */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
              <button
                onClick={() => setExpandedProtocol(expandedProtocol === 1 ? null : 1)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Thermometer className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {lang === 'ja' ? '温熱治療' : lang === 'en' ? 'Hyperthermia Treatment' : lang === 'zh-TW' ? '溫熱治療' : '温热治疗'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {lang === 'ja' ? 'Thermotoron RF8 + 水素吸入' : lang === 'en' ? 'Thermotoron RF8 + Hydrogen Therapy' : lang === 'zh-TW' ? 'Thermotoron RF8 + 吸氫治療' : 'Thermotoron RF8 + 吸氢治疗'}
                    </p>
                  </div>
                </div>
                {expandedProtocol === 1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedProtocol === 1 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療概要' : lang === 'en' ? 'Overview' : lang === 'zh-TW' ? '治療概要' : '治疗概要'}
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {lang === 'ja' ? 'IGTでは温熱治療装置「Thermotoron RF8」を使用し、相対する2枚の平板電極で身体を挟み、高周波エネルギーを提供することで体内に高周波電流を流し、ジュール熱によってがん組織の温度を上昇させます。がん細胞は正常細胞より加温されやすく、熱に対して敏感な特性を持っているため、42.5℃以上で急速に死滅します。同時に水素吸入療法を併用することで、がん細胞の増殖を抑制し、細胞の変性・アポトーシスを促進します。' : lang === 'en' ? 'IGT uses Thermotoron RF8, employing opposing flat electrodes to deliver high-frequency energy that flows through the body, heating cancer tissue via Joule heat. Cancer cells are more heat-sensitive than normal cells and rapidly die above 42.5°C. Combined with hydrogen inhalation therapy to inhibit cancer cell proliferation and promote apoptosis.' : lang === 'zh-TW' ? 'IGT使用熱療裝置「Thermotoron RF8」，採用相對朝向的兩個平板電極夾住身體，通過提供高頻能量使高頻電流在體內流動，通過焦耳熱升高癌組織的溫度。癌細胞具有比正常細胞更容易升溫且對熱更為敏感的特性，癌細胞在達到42.5℃以上時會迅速死亡。同時結合吸氫治療，有研究表明可抑制癌細胞增殖、促進細胞凋亡。' : 'IGT使用热疗装置"Thermotoron RF8"，采用相对朝向的两个平板电极夹住身体，通过提供高频能量使高频电流在体内流动，通过焦耳热升高癌组织的温度。癌细胞具有比正常细胞更容易升温且对热更为敏感的特性，癌细胞在达到42.5℃以上时会迅速死亡。同时结合吸氢治疗，有研究表明可抑制癌细胞增殖、促进细胞凋亡。'}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                      <h4 className="font-semibold text-orange-900 mb-2 text-sm">
                        {lang === 'ja' ? '注意事項' : lang === 'en' ? 'Important Notes' : lang === 'zh-TW' ? '注意事項' : '注意事项'}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-orange-800">
                        <li>• {lang === 'ja' ? '医師診察後、個別治療計画を策定' : lang === 'en' ? 'Individual treatment plan after medical consultation' : lang === 'zh-TW' ? '醫生診察後制定指定治療計劃' : '医生诊察后制定指定治疗计划'}</li>
                        <li>• {lang === 'ja' ? '治療頻度：週1-2回、腫瘍血管内介入治療と併用可能' : lang === 'en' ? 'Frequency: 1-2 times/week, combinable with endovascular treatment' : lang === 'zh-TW' ? '治療頻度：每週1-2次，可結合腫瘤血管內介入治療' : '治疗频度：每周1-2次，可结合肿瘤血管内介入治疗'}</li>
                        <li>• {lang === 'ja' ? '治療時間：各回40分、温熱治療時に水素吸入を併用可能' : lang === 'en' ? 'Duration: 40 min/session, hydrogen therapy can be added' : lang === 'zh-TW' ? '治療時間：每次40分鐘；溫熱治療時可結合吸氫治療' : '治疗时间：每次40分钟；温热治疗时可结合吸氢治疗'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. AFTVac治疗 - 活化自体肿瘤反应T细胞 */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
              <button
                onClick={() => setExpandedProtocol(expandedProtocol === 2 ? null : 2)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {lang === 'ja' ? 'AFTVac治療' : lang === 'en' ? 'AFTVac Therapy' : lang === 'zh-TW' ? 'AFTVac治療' : 'AFTVac治疗'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {lang === 'ja' ? '活化自己腫瘍反応性T細胞療法' : lang === 'en' ? 'Activated Autologous Tumor-Reactive T Cell Therapy' : lang === 'zh-TW' ? '活化自體腫瘤反應性T細胞療法' : '活化自体肿瘤反应性T细胞疗法'}
                    </p>
                  </div>
                </div>
                {expandedProtocol === 2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedProtocol === 2 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療概要' : lang === 'en' ? 'Overview' : lang === 'zh-TW' ? '治療概要' : '治疗概要'}
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {lang === 'ja' ? 'AFTVacは患者自身のがん細胞を用いて作製したワクチンで免疫細胞を刺激し、体外で培養増殖させた後に体内に戻す治療法です。がん細胞特有の抗原に反応するT細胞を選択的に増やすことで、がん細胞を狙い撃ちする高い特異性を持ちます。副作用が少なく、QOL（生活の質）を維持しながらがん治療を進められます。' : lang === 'en' ? 'AFTVac stimulates immune cells using a vaccine created from the patient\'s own cancer cells, then returns cultured T cells to the body. By selectively increasing T cells that respond to cancer-specific antigens, it achieves high specificity in targeting cancer cells with minimal side effects while maintaining quality of life.' : lang === 'zh-TW' ? 'AFTVac是使用患者自身癌細胞製作的疫苗刺激免疫細胞，在體外培養增殖後重新注入體內的治療方法。透過選擇性增加對癌細胞特有抗原產生反應的T細胞，具有高度針對性地攻擊癌細胞的特性。副作用少，可在維持生活品質（QOL）的同時進行癌症治療。' : 'AFTVac是使用患者自身癌细胞制作的疫苗刺激免疫细胞，在体外培养增殖后重新注入体内的治疗方法。通过选择性增加对癌细胞特有抗原产生反应的T细胞，具有高度针对性地攻击癌细胞的特性。副作用少，可在维持生活质量（QOL）的同时进行癌症治疗。'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療フロー' : lang === 'en' ? 'Treatment Flow' : lang === 'zh-TW' ? '治療流程' : '治疗流程'}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold mt-0.5">第1步：</span>
                          <span>{lang === 'ja' ? '腫瘍組織採取（手術時または生検）' : lang === 'en' ? 'Tumor tissue collection (during surgery or biopsy)' : lang === 'zh-TW' ? '採取腫瘤組織（手術時或活檢）' : '采取肿瘤组织（手术时或活检）'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold mt-0.5">第2步：</span>
                          <span>{lang === 'ja' ? '採血（50ml）、腫瘤細胞からワクチン作製' : lang === 'en' ? 'Blood collection (50ml), vaccine creation from tumor cells' : lang === 'zh-TW' ? '抽血（50ml），從腫瘤細胞製作疫苗' : '抽血（50ml），从肿瘤细胞制作疫苗'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold mt-0.5">第3步：</span>
                          <span>{lang === 'ja' ? 'ワクチン投与（皮下注射、週1回×4週）' : lang === 'en' ? 'Vaccine administration (subcutaneous injection, once weekly × 4 weeks)' : lang === 'zh-TW' ? '疫苗施打（皮下注射，每週1次×4週）' : '疫苗施打（皮下注射，每周1次×4周）'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold mt-0.5">第4步：</span>
                          <span>{lang === 'ja' ? '採血、T細胞培養（約2週間）' : lang === 'en' ? 'Blood collection, T cell culture (approx. 2 weeks)' : lang === 'zh-TW' ? '抽血，T細胞培養（約2週）' : '抽血，T细胞培养（约2周）'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold mt-0.5">第5步：</span>
                          <span>{lang === 'ja' ? 'T細胞投与（点滴、1日入院）' : lang === 'en' ? 'T cell infusion (IV drip, 1-day hospitalization)' : lang === 'zh-TW' ? 'T細胞輸注（點滴，住院1天）' : 'T细胞输注（点滴，住院1天）'}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-900 mb-2 text-sm">
                        {lang === 'ja' ? '注意事項' : lang === 'en' ? 'Important Notes' : lang === 'zh-TW' ? '注意事項' : '注意事项'}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-purple-800">
                        <li>• {lang === 'ja' ? '総治療期間：約2-3ヶ月' : lang === 'en' ? 'Total duration: approx. 2-3 months' : lang === 'zh-TW' ? '總治療期間：約2-3個月' : '总治疗期间：约2-3个月'}</li>
                        <li>• {lang === 'ja' ? '適応：切除可能な固形がん（組織採取が必要）' : lang === 'en' ? 'Indication: Resectable solid tumors (tissue collection required)' : lang === 'zh-TW' ? '適應症：可切除的實體腫瘤（需採集組織）' : '适应症：可切除的实体肿瘤（需采集组织）'}</li>
                        <li>• {lang === 'ja' ? 'ワクチン投与時は通院、T細胞投与時は1日入院' : lang === 'en' ? 'Vaccine: outpatient; T cell infusion: 1-day hospitalization' : lang === 'zh-TW' ? '疫苗施打為門診，T細胞輸注需住院1天' : '疫苗施打为门诊，T细胞输注需住院1天'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. 免疫细胞治疗 */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
              <button
                onClick={() => setExpandedProtocol(expandedProtocol === 3 ? null : 3)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Beaker className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {lang === 'ja' ? '免疫細胞治療' : lang === 'en' ? 'Immune Cell Therapy' : lang === 'zh-TW' ? '免疫細胞治療' : '免疫细胞治疗'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {lang === 'ja' ? 'NK細胞・γδT細胞療法' : lang === 'en' ? 'NK Cell & γδT Cell Therapy' : lang === 'zh-TW' ? 'NK細胞・γδT細胞療法' : 'NK细胞·γδT细胞疗法'}
                    </p>
                  </div>
                </div>
                {expandedProtocol === 3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedProtocol === 3 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療概要' : lang === 'en' ? 'Overview' : lang === 'zh-TW' ? '治療概要' : '治疗概要'}
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {lang === 'ja' ? '患者自身の血液から採取した免疫細胞を体外で大量培養し、活性化させた後に体内に戻す治療法です。NK細胞はがん細胞を直接攻撃し、γδT細胞は幅広いがん細胞を認識して攻撃します。抗がん剤や放射線療法と併用でき、副作用が少なく、免疫力を高めながらがんと闘えます。再発予防にも効果が期待されます。' : lang === 'en' ? 'Immune cells collected from the patient\'s blood are cultured in large quantities, activated, and returned to the body. NK cells directly attack cancer cells, while γδT cells recognize and attack a wide range of cancer cells. Can be combined with chemotherapy or radiation with minimal side effects, boosting immunity while fighting cancer. Also expected to prevent recurrence.' : lang === 'zh-TW' ? '從患者自身血液中採集的免疫細胞在體外大量培養並活化後重新注入體內的治療方法。NK細胞直接攻擊癌細胞，γδT細胞能識別並攻擊廣泛的癌細胞。可與化療或放療併用，副作用少，可在提升免疫力的同時對抗癌症。也被期待具有預防復發的效果。' : '从患者自身血液中采集的免疫细胞在体外大量培养并活化后重新注入体内的治疗方法。NK细胞直接攻击癌细胞，γδT细胞能识别并攻击广泛的癌细胞。可与化疗或放疗并用，副作用少，可在提升免疫力的同时对抗癌症。也被期待具有预防复发的效果。'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療フロー' : lang === 'en' ? 'Treatment Flow' : lang === 'zh-TW' ? '治療流程' : '治疗流程'}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-0.5">第1步：</span>
                          <span>{lang === 'ja' ? '医師診察、治療計画決定' : lang === 'en' ? 'Medical consultation, treatment plan determination' : lang === 'zh-TW' ? '醫生診察，確定治療計劃' : '医生诊察，确定治疗计划'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-0.5">第2步：</span>
                          <span>{lang === 'ja' ? '採血（40-50ml）、細胞培養開始（約2週間）' : lang === 'en' ? 'Blood collection (40-50ml), cell culture starts (approx. 2 weeks)' : lang === 'zh-TW' ? '抽血（40-50ml），開始細胞培養（約2週）' : '抽血（40-50ml），开始细胞培养（约2周）'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-0.5">第3步：</span>
                          <span>{lang === 'ja' ? '免疫細胞投与（点滴、約1時間、通院）' : lang === 'en' ? 'Immune cell infusion (IV drip, approx. 1 hour, outpatient)' : lang === 'zh-TW' ? '免疫細胞輸注（點滴，約1小時，門診）' : '免疫细胞输注（点滴，约1小时，门诊）'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-0.5">第4步：</span>
                          <span>{lang === 'ja' ? '定期的に投与（週1回または2週に1回、6-12回）' : lang === 'en' ? 'Regular infusions (weekly or biweekly, 6-12 sessions)' : lang === 'zh-TW' ? '定期輸注（每週1次或每2週1次，6-12次）' : '定期输注（每周1次或每2周1次，6-12次）'}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                        {lang === 'ja' ? '注意事項' : lang === 'en' ? 'Important Notes' : lang === 'zh-TW' ? '注意事項' : '注意事项'}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-blue-800">
                        <li>• {lang === 'ja' ? '完全通院治療、入院不要' : lang === 'en' ? 'Fully outpatient treatment, no hospitalization required' : lang === 'zh-TW' ? '完全門診治療，無需住院' : '完全门诊治疗，无需住院'}</li>
                        <li>• {lang === 'ja' ? '投与後は通常の生活に戻れる、副作用極少' : lang === 'en' ? 'Can resume normal life after infusion, minimal side effects' : lang === 'zh-TW' ? '輸注後可恢復正常生活，副作用極少' : '输注后可恢复正常生活，副作用极少'}</li>
                        <li>• {lang === 'ja' ? '他の治療（化学療法、放射線）との併用可能' : lang === 'en' ? 'Can be combined with other treatments (chemotherapy, radiation)' : lang === 'zh-TW' ? '可與其他治療（化療、放療）併用' : '可与其他治疗（化疗、放疗）并用'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. 干细胞治疗 */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
              <button
                onClick={() => setExpandedProtocol(expandedProtocol === 4 ? null : 4)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Dna className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {lang === 'ja' ? '幹細胞治療' : lang === 'en' ? 'Stem Cell Therapy' : lang === 'zh-TW' ? '幹細胞治療' : '干细胞治疗'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {lang === 'ja' ? '自己脂肪由来間葉系幹細胞療法' : lang === 'en' ? 'Autologous Adipose-Derived MSC Therapy' : lang === 'zh-TW' ? '自體脂肪來源間質幹細胞療法' : '自体脂肪来源间充质干细胞疗法'}
                    </p>
                  </div>
                </div>
                {expandedProtocol === 4 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedProtocol === 4 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療概要' : lang === 'en' ? 'Overview' : lang === 'zh-TW' ? '治療概要' : '治疗概要'}
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {lang === 'ja' ? '患者自身の脂肪組織から採取した間葉系幹細胞（MSC）を培養増殖させ、体内に投与する再生医療です。MSCは抗炎症作用、組織修復促進、免疫調整などの機能を持ち、がん治療による副作用の軽減、体力回復、免疫力向上に役立ちます。また、MSCから分泌されるサイトカインが腫瘍微小環境を改善し、がん治療の効果を高める可能性があります。' : lang === 'en' ? 'Regenerative medicine using mesenchymal stem cells (MSC) harvested from the patient\'s adipose tissue, cultured, and administered. MSCs have anti-inflammatory, tissue repair, and immune-modulating functions, helping reduce cancer treatment side effects, restore vitality, and boost immunity. Cytokines secreted by MSCs may improve the tumor microenvironment and enhance cancer treatment efficacy.' : lang === 'zh-TW' ? '從患者自身脂肪組織中採集的間質幹細胞（MSC）經培養增殖後注入體內的再生醫療。MSC具有抗發炎、促進組織修復、免疫調節等功能，有助於減輕癌症治療的副作用、恢復體力、提升免疫力。此外，MSC分泌的細胞因子可改善腫瘤微環境，有可能提高癌症治療效果。' : '从患者自身脂肪组织中采集的间充质干细胞（MSC）经培养增殖后注入体内的再生医疗。MSC具有抗炎、促进组织修复、免疫调节等功能，有助于减轻癌症治疗的副作用、恢复体力、提升免疫力。此外，MSC分泌的细胞因子可改善肿瘤微环境，有可能提高癌症治疗效果。'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療フロー' : lang === 'en' ? 'Treatment Flow' : lang === 'zh-TW' ? '治療流程' : '治疗流程'}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold mt-0.5">第1步：</span>
                          <span>{lang === 'ja' ? '医師診察、適応判定、治療計画策定' : lang === 'en' ? 'Medical consultation, eligibility assessment, treatment planning' : lang === 'zh-TW' ? '醫生診察，適應症判定，制定治療計劃' : '医生诊察，适应症判定，制定治疗计划'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold mt-0.5">第2步：</span>
                          <span>{lang === 'ja' ? '脂肪採取（局所麻酔下、腹部から約10-20g、日帰り）' : lang === 'en' ? 'Fat harvesting (local anesthesia, 10-20g from abdomen, outpatient)' : lang === 'zh-TW' ? '採集脂肪（局部麻醉，從腹部採10-20g，當日往返）' : '采集脂肪（局部麻醉，从腹部采10-20g，当日往返）'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold mt-0.5">第3步：</span>
                          <span>{lang === 'ja' ? '幹細胞培養（約4-6週間）' : lang === 'en' ? 'Stem cell culture (approx. 4-6 weeks)' : lang === 'zh-TW' ? '幹細胞培養（約4-6週）' : '干细胞培养（约4-6周）'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold mt-0.5">第4步：</span>
                          <span>{lang === 'ja' ? 'MSC投与（点滴、約1時間、通院）' : lang === 'en' ? 'MSC infusion (IV drip, approx. 1 hour, outpatient)' : lang === 'zh-TW' ? 'MSC輸注（點滴，約1小時，門診）' : 'MSC输注（点滴，约1小时，门诊）'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold mt-0.5">第5步：</span>
                          <span>{lang === 'ja' ? '追加投与（必要に応じて2-4週間隔で複数回）' : lang === 'en' ? 'Additional infusions (as needed, 2-4 week intervals, multiple sessions)' : lang === 'zh-TW' ? '追加輸注（視需要每2-4週1次，多次治療）' : '追加输注（视需要每2-4周1次，多次治疗）'}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h4 className="font-semibold text-green-900 mb-2 text-sm">
                        {lang === 'ja' ? '注意事項' : lang === 'en' ? 'Important Notes' : lang === 'zh-TW' ? '注意事項' : '注意事项'}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-green-800">
                        <li>• {lang === 'ja' ? '脂肪採取は日帰り手術、投与は通院' : lang === 'en' ? 'Fat harvesting: outpatient surgery; infusion: outpatient' : lang === 'zh-TW' ? '脂肪採集為當日手術，輸注為門診' : '脂肪采集为当日手术，输注为门诊'}</li>
                        <li>• {lang === 'ja' ? '自己細胞使用のため拒絶反応リスク極めて低い' : lang === 'en' ? 'Autologous cells: extremely low rejection risk' : lang === 'zh-TW' ? '使用自體細胞，排斥反應風險極低' : '使用自体细胞，排斥反应风险极低'}</li>
                        <li>• {lang === 'ja' ? '培養期間中は他の治療継続可能' : lang === 'en' ? 'Other treatments can continue during culture period' : lang === 'zh-TW' ? '培養期間可繼續其他治療' : '培养期间可继续其他治疗'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. 干细胞上清液治疗 */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
              <button
                onClick={() => setExpandedProtocol(expandedProtocol === 5 ? null : 5)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Droplets className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {lang === 'ja' ? '幹細胞上清液治療' : lang === 'en' ? 'Stem Cell Supernatant Therapy' : lang === 'zh-TW' ? '幹細胞上清液治療' : '干细胞上清液治疗'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {lang === 'ja' ? 'エクソソーム・成長因子療法' : lang === 'en' ? 'Exosome & Growth Factor Therapy' : lang === 'zh-TW' ? '外泌體·生長因子療法' : '外泌体·生长因子疗法'}
                    </p>
                  </div>
                </div>
                {expandedProtocol === 5 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedProtocol === 5 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療概要' : lang === 'en' ? 'Overview' : lang === 'zh-TW' ? '治療概要' : '治疗概要'}
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {lang === 'ja' ? '幹細胞培養液から幹細胞を取り除いた上清液には、エクソソーム（細胞外小胞）や数百種類の成長因子、サイトカインが豊富に含まれています。これらの生理活性物質が抗炎症、組織修復、血管新生促進、免疫調整などの作用を発揮します。幹細胞そのものを投与するより安全性が高く、繰り返し投与が容易で、がん治療による体力低下や副作用の軽減、QOL向上に貢献します。' : lang === 'en' ? 'The supernatant from stem cell culture (with cells removed) is rich in exosomes, hundreds of growth factors, and cytokines. These bioactive substances provide anti-inflammatory, tissue repair, angiogenesis promotion, and immune-modulating effects. Safer than administering stem cells themselves, easier to administer repeatedly, helping reduce fatigue and side effects from cancer treatment while improving quality of life.' : lang === 'zh-TW' ? '從幹細胞培養液中去除幹細胞後的上清液，富含外泌體（細胞外囊泡）及數百種生長因子、細胞因子。這些生理活性物質發揮抗發炎、組織修復、促進血管新生、免疫調節等作用。比直接投予幹細胞更安全，易於重複施打，有助於減輕癌症治療導致的體力下降和副作用，提升生活品質。' : '从干细胞培养液中去除干细胞后的上清液，富含外泌体（细胞外囊泡）及数百种生长因子、细胞因子。这些生理活性物质发挥抗炎、组织修复、促进血管新生、免疫调节等作用。比直接投予干细胞更安全，易于重复施打，有助于减轻癌症治疗导致的体力下降和副作用，提升生活质量。'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lang === 'ja' ? '治療フロー' : lang === 'en' ? 'Treatment Flow' : lang === 'zh-TW' ? '治療流程' : '治疗流程'}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold mt-0.5">第1步：</span>
                          <span>{lang === 'ja' ? '医師診察、治療計画決定' : lang === 'en' ? 'Medical consultation, treatment plan determination' : lang === 'zh-TW' ? '醫生診察，確定治療計劃' : '医生诊察，确定治疗计划'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold mt-0.5">第2步：</span>
                          <span>{lang === 'ja' ? '上清液投与（点滴、約30-60分、通院）' : lang === 'en' ? 'Supernatant infusion (IV drip, 30-60 min, outpatient)' : lang === 'zh-TW' ? '上清液輸注（點滴，約30-60分鐘，門診）' : '上清液输注（点滴，约30-60分钟，门诊）'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold mt-0.5">第3步：</span>
                          <span>{lang === 'ja' ? '定期投与（週1回または2週に1回、医師指示に従う）' : lang === 'en' ? 'Regular infusions (weekly or biweekly, as directed by physician)' : lang === 'zh-TW' ? '定期輸注（每週1次或每2週1次，遵醫囑）' : '定期输注（每周1次或每2周1次，遵医嘱）'}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                      <h4 className="font-semibold text-teal-900 mb-2 text-sm">
                        {lang === 'ja' ? '注意事項' : lang === 'en' ? 'Important Notes' : lang === 'zh-TW' ? '注意事項' : '注意事项'}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-teal-800">
                        <li>• {lang === 'ja' ? '完全通院治療、入院不要、侵襲的処置なし' : lang === 'en' ? 'Fully outpatient, no hospitalization, non-invasive' : lang === 'zh-TW' ? '完全門診治療，無需住院，無侵入性處置' : '完全门诊治疗，无需住院，无侵入性处置'}</li>
                        <li>• {lang === 'ja' ? '投与後すぐ帰宅可能、日常生活制限なし' : lang === 'en' ? 'Can go home immediately after infusion, no daily life restrictions' : lang === 'zh-TW' ? '輸注後可立即返家，無日常生活限制' : '输注后可立即返家，无日常生活限制'}</li>
                        <li>• {lang === 'ja' ? '他の治療との併用に最適、副作用極めて少ない' : lang === 'en' ? 'Ideal for combination with other treatments, minimal side effects' : lang === 'zh-TW' ? '最適合與其他治療併用，副作用極少' : '最适合与其他治疗并用，副作用极少'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ========== CANCERS ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.cancerTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.cancerTitle, lang)}</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CANCERS.map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center border hover:border-cyan-300 transition">
                <c.icon size={24} className="text-cyan-600 mx-auto mb-2" />
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
            <span className="text-cyan-600 font-medium text-sm">{t(tr.advTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.advTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition">
                <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-4">
                  <a.icon size={24} className="text-cyan-600" />
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
            <span className="text-cyan-600 font-medium text-sm">{t(tr.teamTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.teamTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{t(tr.teamDesc, lang)}</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {DOCTORS.map((doctor, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition">
                <div className="aspect-[3/4] bg-gray-100">
                  <img
                    src={doctor.photo}
                    alt={t(doctor.name, lang)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="inline-block bg-cyan-600 text-white px-2.5 py-1 rounded-full text-xs font-medium mb-2">
                    {t(doctor.title, lang)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5">{t(doctor.name, lang)}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{t(doctor.specialty, lang)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PATIENT SUPPORT ========== */}


      {/* ========== OTHER SERVICES ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.otherServicesTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.otherServicesTitle, lang)}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Lymphedema Clinic */}
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 border border-cyan-200 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-cyan-600 rounded-2xl flex items-center justify-center">
                  <Heart size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t(tr.lymphedemaTitle, lang)}</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">{t(tr.lymphedemaDesc, lang)}</p>
              <div className="bg-cyan-100 rounded-lg p-4 mb-4">
                <p className="text-cyan-900 font-bold text-sm">{t(tr.lymphedemaPrice, lang)}</p>
                <p className="text-cyan-700 text-xs mt-1">
                  {lang === 'ja' ? '第1・第3土曜日 9:00～17:00（予約制）' : lang === 'en' ? '1st & 3rd Sat 9:00-17:00 (By appointment)' : lang === 'zh-TW' ? '每月第1、3週六 9:00-17:00（預約制）' : '每月第1、3周六 9:00-17:00（预约制）'}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                  <span>{lang === 'ja' ? '手術・放射線治療後のむくみに対応' : lang === 'en' ? 'Post-surgery & radiation edema care' : lang === 'zh-TW' ? '手術·放射治療後水腫護理' : '手术·放射治疗后水肿护理'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                  <span>{lang === 'ja' ? 'セラピスト（看護師）による専門ケア' : lang === 'en' ? 'Specialized care by therapist (RN)' : lang === 'zh-TW' ? '治療師（護士）專業護理' : '治疗师（护士）专业护理'}</span>
                </li>
              </ul>
            </div>

            {/* Cancer Screening */}
            <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl p-8 border border-sky-200 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-sky-600 rounded-2xl flex items-center justify-center">
                  <Microscope size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t(tr.cancerScreeningTitle, lang)}</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">{t(tr.cancerScreeningDesc, lang)}</p>
              <div className="bg-sky-100 rounded-lg p-4 mb-4">
                <p className="text-sky-900 font-bold text-sm">{t(tr.cancerScreeningPrice, lang)}</p>
                <p className="text-sky-700 text-xs mt-1">
                  {lang === 'ja' ? 'マイクロアレイ血液検査オプション：¥99,000' : lang === 'en' ? 'Microarray blood test option: ¥99,000' : lang === 'zh-TW' ? '微陣列血液檢測選項：¥99,000' : '微阵列血液检测选项：¥99,000'}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-sky-600 shrink-0 mt-0.5" />
                  <span>{lang === 'ja' ? 'CT検査と血液検査の組み合わせ' : lang === 'en' ? 'Combined CT & blood tests' : lang === 'zh-TW' ? 'CT檢查與血液檢查結合' : 'CT检查与血液检查结合'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-sky-600 shrink-0 mt-0.5" />
                  <span>{lang === 'ja' ? '当日に放射線診断専門医が結果説明' : lang === 'en' ? 'Same-day results by radiologist' : lang === 'zh-TW' ? '當天由放射診斷專科醫師說明' : '当天由放射诊断专科医师说明'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-sky-600 shrink-0 mt-0.5" />
                  <span>{lang === 'ja' ? 'スマホアプリ『MeDaCa』で結果確認' : lang === 'en' ? 'Results via MeDaCa app' : lang === 'zh-TW' ? '透過MeDaCa應用程式確認結果' : '通过MeDaCa应用程序确认结果'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TREATMENT RESULTS ========== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.resultsTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.resultsTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{t(tr.resultsDesc, lang)}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Treatments */}
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Activity size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">{t(tr.resultsMonthly, lang)}</h3>
              </div>
              <p className="text-cyan-50 leading-relaxed">{t(tr.resultsMonthlyDesc, lang)}</p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-4xl font-bold">60-70</p>
                    <p className="text-sm text-cyan-200 mt-1">{lang === 'ja' ? '件/月' : lang === 'en' ? 'cases/month' : '件/月'}</p>
                  </div>
                  <CheckCircle size={40} className="text-cyan-200" />
                </div>
              </div>
            </div>

            {/* Conference Presentations */}
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">{t(tr.resultsConference, lang)}</h3>
              </div>
              <p className="text-sky-50 leading-relaxed">{t(tr.resultsConferenceDesc, lang)}</p>
              <div className="mt-4 bg-white/10 rounded-lg p-4 border border-white/20">
                <p className="font-bold text-lg mb-1">🏆 {t(tr.resultsAward, lang)}</p>
                <p className="text-sm text-sky-100">{lang === 'ja' ? 'ポルトガル・リスボンで開催された国際学会CIRSEにて、乳がん治療の研究発表5件を実施し、最高賞を受賞。' : lang === 'en' ? 'Presented 5 breast cancer treatment studies at CIRSE in Lisbon, Portugal. Received highest award.' : lang === 'zh-TW' ? '於葡萄牙里斯本舉行的國際學會CIRSE發表5項乳腺癌治療研究，獲最高獎。' : '于葡萄牙里斯本举行的国际学会CIRSE发表5项乳腺癌治疗研究，获最高奖。'}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-4xl font-bold">{lang === 'ja' ? '継続中' : lang === 'en' ? 'Ongoing' : lang === 'zh-TW' ? '持續中' : '持续中'}</p>
                    <p className="text-sm text-sky-200 mt-1">{lang === 'ja' ? '国際学会・国内学会' : lang === 'en' ? 'International & Domestic' : lang === 'zh-TW' ? '國際及國內學會' : '国际及国内学会'}</p>
                  </div>
                  <Globe size={40} className="text-sky-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MEDIA COVERAGE ========== */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.mediaTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.mediaTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{t(tr.mediaDesc, lang)}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {MEDIA_COVERAGE.map((media, i) => (
              <a
                key={i}
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-6 border border-cyan-200 hover:border-cyan-400 hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Activity size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition">
                      {t(media.title, lang)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{t(media.desc, lang)}</p>
                    <div className="inline-flex items-center gap-1 text-cyan-600 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>{lang === 'ja' ? '動画を見る' : lang === 'en' ? 'Watch Video' : lang === 'zh-TW' ? '觀看影片' : '观看视频'}</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ACADEMIC ACHIEVEMENTS ========== */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 via-white to-sky-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.academicTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.academicTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{t(tr.academicDesc, lang)}</p>
          </div>

          <div className="space-y-6">
            {ACADEMIC_ACHIEVEMENTS.map((achievement, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-cyan-200 hover:border-cyan-400 hover:shadow-lg transition">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-sky-600 rounded-2xl flex items-center justify-center mb-2">
                      <achievement.icon size={32} className="text-white" />
                    </div>
                    <div className="text-cyan-600 font-bold text-lg">{achievement.year}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t(achievement.title, lang)}</h3>
                    <p className="text-gray-600 leading-relaxed">{t(achievement.desc, lang)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PATIENT TESTIMONIALS ========== */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.testimonialTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.testimonialTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{t(tr.testimonialDesc, lang)}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PATIENT_TESTIMONIALS.map((testimonial, i) => (
              <a
                key={i}
                href={testimonial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-sky-50 to-white rounded-2xl p-8 border border-sky-200 hover:border-sky-400 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-sky-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart size={28} className="text-white" />
                  </div>
                  <div className="text-sky-600 font-bold text-sm">
                    {lang === 'ja' ? `患者様 ${i + 1}` : lang === 'en' ? `Patient ${i + 1}` : `患者 ${i + 1}`}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t(testimonial.title, lang)}</h3>
                <div className="inline-flex items-center gap-2 text-sky-600 text-sm font-medium group-hover:gap-3 transition-all">
                  <span>{lang === 'ja' ? '動画を見る' : lang === 'en' ? 'Watch Video' : lang === 'zh-TW' ? '觀看影片' : '观看视频'}</span>
                  <ArrowRight size={16} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.faqTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.faqTitle, lang)}</h2>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl border overflow-hidden group">
                <summary className="px-8 py-6 cursor-pointer font-bold text-gray-900 hover:bg-gray-50 transition flex items-start gap-3">
                  <span className="text-cyan-600 text-lg shrink-0">Q{i + 1}</span>
                  <span className="flex-1">{t(faq.q, lang)}</span>
                  <ArrowRight size={20} className="text-gray-400 group-open:rotate-90 transition-transform shrink-0 mt-1" />
                </summary>
                <div className="px-8 py-6 bg-cyan-50/50 border-t">
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-600 font-bold text-lg shrink-0">A</span>
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
            <span className="text-cyan-600 font-medium text-sm">{t(tr.intlTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.intlTitle, lang)}</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{t(tr.intlDesc, lang)}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Excellent Access */}
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 border border-cyan-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-cyan-600 rounded-2xl flex items-center justify-center mb-4">
                <MapPin size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.intlLocation, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.intlLocationDesc, lang)}</p>
            </div>

            {/* Translation Support */}
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 border border-cyan-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                <Globe size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(tr.intlTranslation, lang)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(tr.intlTranslationDesc, lang)}</p>
            </div>

            {/* Medical Visa */}
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 border border-cyan-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-cyan-600 rounded-2xl flex items-center justify-center mb-4">
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
            <span className="text-cyan-600 font-medium text-sm">{t(tr.flowTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.flowTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FLOW_STEPS.map((s, i) => (
              <div key={i} className="relative bg-white rounded-xl p-5 border text-center">
                <div className="text-xs font-bold text-cyan-600 mb-2">STEP {s.step}</div>
                <s.icon size={28} className="text-cyan-600 mx-auto mb-2" />
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
            <span className="text-cyan-600 font-medium text-sm">{t(tr.accessTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.accessTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-cyan-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">〒598-0047</p>
                    <p className="text-gray-600 text-sm">{t(tr.accessAddress1, lang)}</p>
                    <p className="text-gray-600 text-sm">{t(tr.accessAddress2, lang)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Train size={20} className="text-cyan-600 shrink-0" />
                  <p className="text-gray-600 text-sm">{t(tr.accessStation, lang)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-cyan-600 shrink-0" />
                  <div>
                    <p className="text-gray-600 text-sm">{t(tr.accessHours, lang)}</p>
                    <p className="text-gray-500 text-xs">{t(tr.accessClosed, lang)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border">
              <img
                src="/images/igtc/access-map.png"
                alt="IGT Clinic Access Map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== ROUTE PHOTO GALLERY ========== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-600 font-medium text-sm">{t(tr.accessRouteTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t(tr.accessRouteTitle, lang)}</h2>
            <p className="text-gray-600 mt-4">{t(tr.accessRouteDesc, lang)}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACCESS_ROUTE_PHOTOS.map((photo, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition group">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <img
                    src={photo.src}
                    alt={t(photo.caption, lang)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-cyan-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {i + 1}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 font-medium leading-tight">{t(photo.caption, lang)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========== TREATMENT PRICING ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-cyan-600 text-xs tracking-widest uppercase font-bold">{t(tr.pricingTag, lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t(tr.pricingTitle, lang)}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t(tr.pricingDesc, lang)}</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {PRICING_CATEGORIES.map((cat, ci) => (
              <div key={ci} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-cyan-200 transition">
                <div className="bg-gradient-to-r from-cyan-50 to-sky-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900">{cat.name[lang]}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {cat.items.map((item) => {
                    const pkg = MEDICAL_PACKAGES[item.slug];
                    if (!pkg) return null;
                    return (
                      <div key={item.slug} className="flex items-center justify-between px-6 py-4 hover:bg-cyan-50/30 transition">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{item.label[lang]}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-black text-cyan-600">¥{pkg.priceJpy.toLocaleString()}</span>
                          <Link
                            href={`/medical-packages/${item.slug}`}
                            className="hidden sm:inline-flex items-center gap-1 bg-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
                          >
                            <ArrowRight size={14} />
                            {t(tr.pricingCta, lang)}
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
            <p className="text-cyan-600 font-bold text-sm mb-2">{lang === 'ja' ? '料金詳細をご覧ください' : lang === 'en' ? 'View Pricing Details' : lang === 'zh-TW' ? '查看價格詳情' : '查看价格详情'}</p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">{t(tr.pricingNote, lang)}</p>
        </div>
      </section>
      {/* ========== CTA ========== */}
      <section id="cta" className="py-16 bg-gradient-to-br from-cyan-500 to-cyan-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t(tr.ctaTitle, lang)}</h2>
          <p className="text-cyan-100 mb-10 max-w-2xl mx-auto">{t(tr.ctaDesc, lang)}</p>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href={guideSlug ? `/igtc/initial-consultation?guide=${guideSlug}` : '/igtc/initial-consultation'}
              className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition group"
            >
              <p className="text-sm text-cyan-600 font-medium mb-1">{t(tr.ctaInitial, lang)}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">¥221,000</p>
              <p className="text-gray-500 text-sm">{t(tr.ctaInitialDesc, lang)}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-cyan-600 font-medium text-sm group-hover:gap-2 transition-all">
                {lang === 'ja' ? '詳細を見る' : lang === 'en' ? 'Learn More' : '了解詳情'}
                <ArrowRight size={16} />
              </div>
            </Link>
            <Link
              href={guideSlug ? `/igtc/remote-consultation?guide=${guideSlug}` : '/igtc/remote-consultation'}
              className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition group"
            >
              <p className="text-sm text-cyan-600 font-medium mb-1">{t(tr.ctaRemote, lang)}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">¥243,000</p>
              <p className="text-gray-500 text-sm">{t(tr.ctaRemoteDesc, lang)}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-cyan-600 font-medium text-sm group-hover:gap-2 transition-all">
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
          <a href="https://igtc.jp" target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline mt-1 inline-block">
            igtc.jp
          </a>
        </footer>
      )}
    </div>
  );
}
