'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import {
  ArrowLeft, ArrowRight, CheckCircle, Shield, Activity,
  Target, Dna, Stethoscope,
  FileText, Mail, Clock, Users, Building, Globe,
  MessageSquare,
  Atom, Pill, Radio, FlaskConical, HeartPulse, Leaf, CreditCard,
  MapPin, Award, Info, ExternalLink
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
const pageTranslations = {
  // Hero
  heroBadge: { ja: '日本がん治療', 'zh-TW': '日本癌症治療', 'zh-CN': '日本癌症治疗', en: 'Japan Cancer Treatment' } as Record<Language, string>,
  heroTitle1: { ja: '日本がん治療', 'zh-TW': '日本癌症治療', 'zh-CN': '日本癌症治疗', en: 'Japan Cancer Treatment' } as Record<Language, string>,
  heroTitle2: { ja: '5年生存率が国際的に高水準', 'zh-TW': '五年存活率達國際高水準', 'zh-CN': '五年存活率达国际高水准', en: '5-Year Survival Rate at Internationally High Standards' } as Record<Language, string>,
  heroStat: { ja: 'Lancet研究によると日本のがん5年生存率は', 'zh-TW': '柳葉刀研究顯示日本癌症五年存活率達', 'zh-CN': '柳叶刀研究显示日本癌症五年存活率达', en: 'Lancet research shows Japan cancer 5-year survival rate reaches' } as Record<Language, string>,
  heroDesc: { ja: '先進的な治療法が日本に集結', 'zh-TW': '先進療法匯聚日本', 'zh-CN': '先进疗法汇聚日本', en: 'Advanced treatments converge in Japan' } as Record<Language, string>,
  heroCTA: { ja: '治療プランを相談', 'zh-TW': '諮詢治療方案', 'zh-CN': '咨询治疗方案', en: 'Consult Treatment Plan' } as Record<Language, string>,
  heroFlow: { ja: '治療の流れを見る', 'zh-TW': '了解治療流程', 'zh-CN': '了解治疗流程', en: 'View Treatment Process' } as Record<Language, string>,
  statGastric: { ja: '胃がん5年生存率', 'zh-TW': '胃癌五年存活率', 'zh-CN': '胃癌五年存活率', en: 'Gastric Cancer 5-Year Survival' } as Record<Language, string>,
  statProstate: { ja: '先進治療技術の種類', 'zh-TW': '先進治療技術種類', 'zh-CN': '先进治疗技术种类', en: 'Advanced Treatment Types' } as Record<Language, string>,
  statProstateSub: { ja: '質子・重粒子・免疫・BNCT 等', 'zh-TW': '質子、重離子、免疫、BNCT 等', 'zh-CN': '质子、重离子、免疫、BNCT 等', en: 'Proton, Heavy Ion, Immuno, BNCT, etc.' } as Record<Language, string>,
  statCost: { ja: '費用は米国の', 'zh-TW': '費用僅為美國', 'zh-CN': '费用仅为美国', en: 'Cost Only 1/3 of US' } as Record<Language, string>,
  statCostSub: { ja: '参考概算', 'zh-TW': '參考估算', 'zh-CN': '参考估算', en: 'Reference Estimate' } as Record<Language, string>,
  dataSource: { ja: '*データ出典：Lancet Oncology 2018; 各医療機関公開資料。個人の治療効果は症状により異なります。参考情報としてご利用ください。', 'zh-TW': '*數據來源：Lancet Oncology 2018; 各醫療機構公開資料。個人療效因病情而異，僅供參考。', 'zh-CN': '*数据来源：Lancet Oncology 2018; 各医疗机构公开资料。个人疗效因病情而异，仅供参考。', en: '*Data source: Lancet Oncology 2018; public data from medical institutions. Individual results vary.' } as Record<Language, string>,
  trustEarly: { ja: '精密スクリーニングによる早期発見', 'zh-TW': '精密篩查助力早期發現', 'zh-CN': '精密筛查助力早期发现', en: 'Precision screening for early detection' } as Record<Language, string>,
  trustTranslator: { ja: '専門医療通訳が全行程同行', 'zh-TW': '專業醫療翻譯全程陪同', 'zh-CN': '专业医疗翻译全程陪同', en: 'Professional medical interpreter throughout' } as Record<Language, string>,
  trustRemote: { ja: '遠隔診療確認後に来日', 'zh-TW': '遠程會診確認後再赴日', 'zh-CN': '远程会诊确认后再赴日', en: 'Visit Japan after remote consultation confirmation' } as Record<Language, string>,
  // Institutions Section
  instTitle: { ja: '日本の著名ながん治療医療機関', 'zh-TW': '日本知名癌症治療醫療機構', 'zh-CN': '日本知名癌症治疗医疗机构', en: 'Renowned Cancer Treatment Institutions in Japan' } as Record<Language, string>,
  instDesc: { ja: '各医療機関の特色と先進治療技術をご参考ください', 'zh-TW': '以下資訊旨在幫助您了解日本各大醫療機構的特色與先進治療技術，供您參考選擇', 'zh-CN': '以下资讯旨在帮助您了解日本各大医疗机构的特色与先进治疗技术，供您参考选择', en: 'Learn about the specialties and advanced treatments at major Japanese medical institutions' } as Record<Language, string>,
  instDisclaimer: { ja: '以下の情報は参考用です。実際の治療は医院の診断に基づきます', 'zh-TW': '以下信息僅供參考，實際治療需以醫院診斷為準', 'zh-CN': '以下信息仅供参考，实际治疗需以医院诊断为准', en: 'Information is for reference only. Actual treatment depends on hospital diagnosis' } as Record<Language, string>,
  instSpecialty: { ja: '得意分野', 'zh-TW': '擅長領域', 'zh-CN': '擅长领域', en: 'Specialties' } as Record<Language, string>,
  instFeatures: { ja: '機関の特色', 'zh-TW': '機構特色', 'zh-CN': '机构特色', en: 'Features' } as Record<Language, string>,
  instTreatments: { ja: '特色治療', 'zh-TW': '特色治療', 'zh-CN': '特色治疗', en: 'Featured Treatments' } as Record<Language, string>,
  instWebsite: { ja: '病院公式サイト（外部リンク）', 'zh-TW': '醫院官網（外部連結）', 'zh-CN': '医院官网（外部链接）', en: 'Hospital Website (External Link)' } as Record<Language, string>,
  instBottomNote: { ja: '以上の情報は各医療機関の公開資料に基づきます。受診をご希望の場合、患者様の病状に最適な医療機関をご推薦いたします。', 'zh-TW': '以上資訊來源於各醫療機構公開資料，僅供患者了解日本癌症治療資源。如需就診，我們將根據您的病情為您推薦最適合的醫療機構。', 'zh-CN': '以上资讯来源于各医疗机构公开资料，仅供患者了解日本癌症治疗资源。如需就诊，我们将根据您的病情为您推荐最适合的医疗机构。', en: 'Information sourced from public data. We will recommend the most suitable institution based on your condition.' } as Record<Language, string>,
  // Treatment Flow Section
  flowTitle: { ja: 'がん患者の来日治療フロー', 'zh-TW': '癌症患者赴日治療流程', 'zh-CN': '癌症患者赴日治疗流程', en: 'Cancer Patient Treatment Process in Japan' } as Record<Language, string>,
  flowDesc: { ja: '初回相談から治療完了まで、全行程プロフェッショナルサポート', 'zh-TW': '從前期諮詢到治療完成，全程專業支援，讓您安心治療', 'zh-CN': '从前期咨询到治疗完成，全程专业支援，让您安心治疗', en: 'Professional support from initial consultation to treatment completion' } as Record<Language, string>,
  flowDuration: { ja: '目安期間', 'zh-TW': '預估時間', 'zh-CN': '预估时间', en: 'Est. Duration' } as Record<Language, string>,
  flowYouDo: { ja: 'お客様にしていただくこと', 'zh-TW': '您需要做的', 'zh-CN': '您需要做的', en: 'What You Do' } as Record<Language, string>,
  flowWeHandle: { ja: '私たちが担当すること', 'zh-TW': '我們為您處理', 'zh-CN': '我们为您处理', en: 'What We Handle' } as Record<Language, string>,
  flowStepDetail: { ja: '詳細ステップ', 'zh-TW': '詳細步驟', 'zh-CN': '详细步骤', en: 'Detailed Steps' } as Record<Language, string>,
  flowClickPhase: { ja: 'フェーズをクリックして詳細を確認', 'zh-TW': '點擊階段查看詳情', 'zh-CN': '点击阶段查看详情', en: 'Click a phase to see details' } as Record<Language, string>,
  // Standard Treatment Section
  stdTitle: { ja: 'がん標準治療', 'zh-TW': '癌症標準治療', 'zh-CN': '癌症标准治疗', en: 'Standard Cancer Treatments' } as Record<Language, string>,
  stdDesc: { ja: '安全性重視、精密な治療、QOL重視、EBMと多職種連携を強調', 'zh-TW': '重視安全性、治療精準、重視生活質量（QOL）、強調循證醫學與多學科協作', 'zh-CN': '重视安全性、治疗精准、重视生活质量（QOL）、强调循证医学与多学科协作', en: 'Safety-focused, precision treatment, QOL-focused, evidence-based multidisciplinary approach' } as Record<Language, string>,
  // Regenerative Section
  regenTitle: { ja: '再生医療等の補助治療', 'zh-TW': '再生醫療等輔助治療', 'zh-CN': '再生医疗等辅助治疗', en: 'Regenerative Medicine & Supportive Treatments' } as Record<Language, string>,
  regenDesc: { ja: '再生医療分野の技術を活用した補助的アプローチ（※標準治療ではありません。効果には個人差があります）', 'zh-TW': '運用再生醫療領域技術的輔助性方案（※非標準治療，效果因人而異）', 'zh-CN': '运用再生医疗领域技术的辅助性方案（※非标准治疗，效果因人而异）', en: 'Supplementary approaches using regenerative medicine (※Not standard treatment. Results vary by individual)' } as Record<Language, string>,
  regenRecovery: { ja: '身体回復', 'zh-TW': '身體恢復', 'zh-CN': '身体恢复', en: 'Body Recovery' } as Record<Language, string>,
  regenHealth: { ja: '長期健康管理', 'zh-TW': '長期健康管理', 'zh-CN': '长期健康管理', en: 'Long-term Health' } as Record<Language, string>,
  regenPrevention: { ja: '治療後の経過観察', 'zh-TW': '治療後追蹤觀察', 'zh-CN': '治疗后追踪观察', en: 'Post-treatment Monitoring' } as Record<Language, string>,
  // Partner Section
  partnerTitle: { ja: '相談可能な医療機関タイプ', 'zh-TW': '可協助諮詢的醫療機構類型', 'zh-CN': '可协助咨询的医疗机构类型', en: 'Types of Partner Medical Institutions' } as Record<Language, string>,
  partnerDesc: { ja: '日本各地の主要ながん治療施設をご案内', 'zh-TW': '涵蓋日本各地主要癌症治療設施', 'zh-CN': '涵盖日本各地主要癌症治疗设施', en: 'Covering major cancer treatment facilities across Japan' } as Record<Language, string>,
  // Service Section
  svcTitle: { ja: 'サービスご予約', 'zh-TW': '諮詢服務預約', 'zh-CN': '咨询服务预约', en: 'Book Consultation Service' } as Record<Language, string>,
  svcDesc: { ja: 'ご希望のサービスを選択し、お支払い後24時間以内にご連絡いたします', 'zh-TW': '選擇您需要的服務，在線支付後我們將在 24 小時內與您聯繫', 'zh-CN': '选择您需要的服务，在线支付后我们将在 24 小时内与您联系', en: 'Select your service, we will contact you within 24 hours after payment' } as Record<Language, string>,
  svcTaxIncl: { ja: '日円（税込）', 'zh-TW': '日圓（含稅）', 'zh-CN': '日元（含税）', en: 'JPY (tax incl.)' } as Record<Language, string>,
  svcBookNow: { ja: '今すぐ予約', 'zh-TW': '立即預約', 'zh-CN': '立即预约', en: 'Book Now' } as Record<Language, string>,
  svcInitial1: { ja: '診療情報の翻訳（中→日）', 'zh-TW': '病歷資料翻譯（中→日）', 'zh-CN': '病历资料翻译（中→日）', en: 'Medical record translation (CN→JP)' } as Record<Language, string>,
  svcInitial2: { ja: '日本の病院への初期相談', 'zh-TW': '日本醫院初步諮詢', 'zh-CN': '日本医院初步咨询', en: 'Initial hospital consultation' } as Record<Language, string>,
  svcInitial3: { ja: '治療可能性評価レポート', 'zh-TW': '治療可行性評估報告', 'zh-CN': '治疗可行性评估报告', en: 'Treatment feasibility report' } as Record<Language, string>,
  svcInitial4: { ja: '費用概算のご説明', 'zh-TW': '費用概算說明', 'zh-CN': '费用概算说明', en: 'Cost estimation explanation' } as Record<Language, string>,
  svcRemote1: { ja: '日本専門医とのビデオ診察', 'zh-TW': '日本專科醫生視頻會診', 'zh-CN': '日本专科医生视频会诊', en: 'Video consultation with Japanese specialist' } as Record<Language, string>,
  svcRemote2: { ja: '専門医療通訳が全行程同行', 'zh-TW': '專業醫療翻譯全程陪同', 'zh-CN': '专业医疗翻译全程陪同', en: 'Professional medical interpreter throughout' } as Record<Language, string>,
  svcRemote3: { ja: '詳細な治療計画のご説明', 'zh-TW': '詳細治療方案說明', 'zh-CN': '详细治疗方案说明', en: 'Detailed treatment plan explanation' } as Record<Language, string>,
  svcRemote4: { ja: '治療費用の明細見積', 'zh-TW': '治療費用明細報價', 'zh-CN': '治疗费用明细报价', en: 'Detailed treatment cost quotation' } as Record<Language, string>,
  memberTitle: { ja: '会員制度のご案内', 'zh-TW': '會員體系說明', 'zh-CN': '会员体系说明', en: 'Membership System' } as Record<Language, string>,
  memberDesc: { ja: 'がん治療相談サービスはTIMC健診と同じ会員制度を共有しています。いずれかのサービスご購入後、NIIJIMA会員となり「マイオーダー」から全予約をご確認いただけます。', 'zh-TW': '癌症治療諮詢服務與 TIMC 體檢服務共用同一會員體系。購買任一服務後，您將自動成為 NIIJIMA 會員，可在「我的訂單」中查看所有預約記錄，並享受會員專屬服務。', 'zh-CN': '癌症治疗咨询服务与 TIMC 体检服务共用同一会员体系。购买任一服务后，您将自动成为 NIIJIMA 会员，可在「我的订单」中查看所有预约记录，并享受会员专属服务。', en: 'Cancer consultation shares the same membership system with TIMC health screening. After purchasing any service, you become a NIIJIMA member with access to all booking records.' } as Record<Language, string>,
  contactTitle: { ja: 'お支払い前のご質問はお気軽に', 'zh-TW': '付款前有疑問？歡迎諮詢', 'zh-CN': '付款前有疑问？欢迎咨询', en: 'Questions before payment? Contact us' } as Record<Language, string>,
  contactLine: { ja: 'LINEで相談', 'zh-TW': 'LINE 諮詢', 'zh-CN': 'LINE 咨询', en: 'LINE Chat' } as Record<Language, string>,
  contactEmail: { ja: 'メールで相談', 'zh-TW': '郵件諮詢', 'zh-CN': '邮件咨询', en: 'Email Us' } as Record<Language, string>,
  contactWechat: { ja: 'WeChatで相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat' } as Record<Language, string>,
  medicalDisclaimer: {
    ja: '※ 当社（新島交通株式会社）は旅行業者であり、医療機関ではありません。本ページの情報は各医療機関の公開資料および学術論文に基づく参考情報であり、医療行為の勧誘や治療効果の保証を目的とするものではありません。実際の治療方針は担当医師の診断に基づきます。渡航前に必ず主治医にご相談ください。',
    'zh-TW': '※ 本公司（新島交通株式會社）為旅行業者，非醫療機構。本頁面資訊來源於各醫療機構公開資料及學術論文，僅供參考，不構成醫療行為的招攬或治療效果的保證。實際治療方案以主治醫師診斷為準。赴日前請務必諮詢您的主治醫師。',
    'zh-CN': '※ 本公司（新岛交通株式会社）为旅行业者，非医疗机构。本页面信息来源于各医疗机构公开资料及学术论文，仅供参考，不构成医疗行为的招揽或治疗效果的保证。实际治疗方案以主治医师诊断为准。赴日前请务必咨询您的主治医师。',
    en: '※ Our company (NIIJIMA KOUTSU Co., Ltd.) is a registered travel agency, not a medical institution. Information on this page is sourced from publicly available institutional data and academic publications for reference only, and does not constitute solicitation of medical treatment or guarantee of treatment outcomes. Actual treatment plans are determined by the attending physician. Please consult your doctor before traveling to Japan.'
  } as Record<Language, string>,
  backHome: { ja: 'ホームに戻る', 'zh-TW': '返回首頁', 'zh-CN': '返回首页', en: 'Back to Home' } as Record<Language, string>,
  wechatTitle: { ja: 'WeChat相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat Consultation' } as Record<Language, string>,
  wechatScan: { ja: 'QRコードをスキャンして追加', 'zh-TW': '掃描二維碼添加客服微信', 'zh-CN': '扫描二维码添加客服微信', en: 'Scan QR code to add us' } as Record<Language, string>,
  wechatNote: { ja: '追加後「がん治療相談」とお伝えください', 'zh-TW': '添加後請注明：癌症治療諮詢', 'zh-CN': '添加后请注明：癌症治疗咨询', en: 'Please note: Cancer treatment consultation' } as Record<Language, string>,
};
// 咨询服务产品定义（使用统一配置）
const CONSULTATION_SERVICES = {
  initial: {
    id: MEDICAL_PACKAGES['cancer-initial-consultation'].slug,
    slug: MEDICAL_PACKAGES['cancer-initial-consultation'].slug,
    name: {
      ja: MEDICAL_PACKAGES['cancer-initial-consultation'].nameJa,
      'zh-TW': MEDICAL_PACKAGES['cancer-initial-consultation'].nameZhTw,
      'zh-CN': '癌症治疗 - 前期咨询服务',
      en: MEDICAL_PACKAGES['cancer-initial-consultation'].nameEn
    } as Record<Language, string>,
    nameEn: MEDICAL_PACKAGES['cancer-initial-consultation'].nameEn,
    price: MEDICAL_PACKAGES['cancer-initial-consultation'].priceJpy,
    description: {
      ja: '資料翻訳・病院相談・治療プラン初期評価',
      'zh-TW': MEDICAL_PACKAGES['cancer-initial-consultation'].descriptionZhTw,
      'zh-CN': '资料翻译、医院咨询、治疗方案初步评估',
      en: 'Document translation, hospital consultation, initial treatment assessment'
    } as Record<Language, string>,
  },
  remote: {
    id: MEDICAL_PACKAGES['cancer-remote-consultation'].slug,
    slug: MEDICAL_PACKAGES['cancer-remote-consultation'].slug,
    name: {
      ja: MEDICAL_PACKAGES['cancer-remote-consultation'].nameJa,
      'zh-TW': MEDICAL_PACKAGES['cancer-remote-consultation'].nameZhTw,
      'zh-CN': '癌症治疗 - 远程会诊服务',
      en: MEDICAL_PACKAGES['cancer-remote-consultation'].nameEn
    } as Record<Language, string>,
    nameEn: MEDICAL_PACKAGES['cancer-remote-consultation'].nameEn,
    price: MEDICAL_PACKAGES['cancer-remote-consultation'].priceJpy,
    description: {
      ja: '日本の医師とのビデオ診察・治療方針相談・費用概算',
      'zh-TW': MEDICAL_PACKAGES['cancer-remote-consultation'].descriptionZhTw,
      'zh-CN': '与日本医生远程视频会诊、讨论治疗方案、费用概算',
      en: 'Video consultation with Japanese doctors, treatment planning, cost estimation'
    } as Record<Language, string>,
  },
};
// 治疗流程步骤数据
const TREATMENT_FLOW = [
  { step: 1, title: { ja: '初期相談', 'zh-TW': '前期咨詢', 'zh-CN': '前期咨询', en: 'Initial Consultation' } as Record<Language, string>, subtitle: { ja: '申請提出・資料提供', 'zh-TW': '提交申請・提供資料', 'zh-CN': '提交申请・提供资料', en: 'Submit Application & Documents' } as Record<Language, string>, fee: '221,000', feeLabel: { ja: '円', 'zh-TW': '日元', 'zh-CN': '日元', en: 'JPY' } as Record<Language, string>, from: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient' } as Record<Language, string>, to: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent' } as Record<Language, string>, desc: { ja: '治療情報提供書、血液/病理レポート、CT/MRI/PETデータ、手術記録等', 'zh-TW': '治療信息提供書、血液/病理報告、CT/MRI/PET數據、手術記錄等', 'zh-CN': '治疗信息提供书、血液/病理报告、CT/MRI/PET数据、手术记录等', en: 'Treatment info, blood/pathology reports, CT/MRI/PET data, surgical records' } as Record<Language, string>, serviceKey: 'initial' as const },
  { step: 2, title: { ja: '初期相談料お支払い', 'zh-TW': '支付前期諮詢費', 'zh-CN': '支付前期咨询费', en: 'Pay Initial Consultation Fee' } as Record<Language, string>, subtitle: { ja: '最適な病院・医師の選定', 'zh-TW': '選擇合適的醫院與醫生', 'zh-CN': '选择合适的医院与医生', en: 'Select Suitable Hospital & Doctor' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient' } as Record<Language, string>, to: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent' } as Record<Language, string>, desc: null, serviceKey: null },
  { step: 3, title: { ja: '資料翻訳', 'zh-TW': '資料翻譯', 'zh-CN': '资料翻译', en: 'Document Translation' } as Record<Language, string>, subtitle: { ja: '病院への相談', 'zh-TW': '諮詢醫院', 'zh-CN': '咨询医院', en: 'Hospital Consultation' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent' } as Record<Language, string>, to: { ja: '病院/患者', 'zh-TW': '醫院/患者', 'zh-CN': '医院/患者', en: 'Hospital/Patient' } as Record<Language, string>, desc: null, serviceKey: null },
  { step: 4, title: { ja: '来日前遠隔診療', 'zh-TW': '赴日前遠程會診', 'zh-CN': '赴日前远程会诊', en: 'Pre-visit Remote Consultation' } as Record<Language, string>, subtitle: { ja: '治療方針の相談', 'zh-TW': '討論治療方案', 'zh-CN': '讨论治疗方案', en: 'Discuss Treatment Plan' } as Record<Language, string>, fee: '243,000', feeLabel: { ja: '円', 'zh-TW': '日元', 'zh-CN': '日元', en: 'JPY' } as Record<Language, string>, from: { ja: '病院', 'zh-TW': '醫院', 'zh-CN': '医院', en: 'Hospital' } as Record<Language, string>, to: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient' } as Record<Language, string>, desc: { ja: '治療方針の相談、治療計画の提供、治療費概算の提示', 'zh-TW': '討論治療方案，提供治療計劃，提示治療費概算金額', 'zh-CN': '讨论治疗方案，提供治疗计划，提示治疗费概算金额', en: 'Discuss treatment plan, provide cost estimation' } as Record<Language, string>, serviceKey: 'remote' as const },
  { step: 5, title: { ja: '来日治療の決定', 'zh-TW': '決定來日治療', 'zh-CN': '决定来日治疗', en: 'Decide to Visit Japan' } as Record<Language, string>, subtitle: { ja: '治療保証金のお支払い', 'zh-TW': '支付治療保證金', 'zh-CN': '支付治疗保证金', en: 'Pay Treatment Deposit' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient' } as Record<Language, string>, to: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent' } as Record<Language, string>, desc: null, serviceKey: null },
  { step: 6, title: { ja: '来日日程の確定', 'zh-TW': '確定來日日期', 'zh-CN': '确定来日日期', en: 'Confirm Visit Date' } as Record<Language, string>, subtitle: { ja: '必要に応じて医療ビザ申請', 'zh-TW': '如需要申請醫療簽證', 'zh-CN': '如需要申请医疗签证', en: 'Apply for Medical Visa if Needed' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient' } as Record<Language, string>, to: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent' } as Record<Language, string>, desc: null, serviceKey: null },
  { step: 7, title: { ja: '受診予約', 'zh-TW': '預約就診', 'zh-CN': '预约就诊', en: 'Book Appointment' } as Record<Language, string>, subtitle: { ja: '通訳の手配', 'zh-TW': '安排翻譯', 'zh-CN': '安排翻译', en: 'Arrange Interpreter' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent' } as Record<Language, string>, to: { ja: '病院/患者', 'zh-TW': '醫院/患者', 'zh-CN': '医院/患者', en: 'Hospital/Patient' } as Record<Language, string>, desc: { ja: '経験と資格を有する専門医療通訳を手配', 'zh-TW': '安排有經驗及資格的專業醫療翻譯', 'zh-CN': '安排有经验及资格的专业医疗翻译', en: 'Arrange experienced professional medical interpreter' } as Record<Language, string>, serviceKey: null },
  { step: 8, title: { ja: '来日治療', 'zh-TW': '來日治療', 'zh-CN': '来日治疗', en: 'Treatment in Japan' } as Record<Language, string>, subtitle: { ja: '受診サポート', 'zh-TW': '就診支援', 'zh-CN': '就诊支援', en: 'Visit Support' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '仲介/病院', 'zh-TW': '中介/醫院', 'zh-CN': '中介/医院', en: 'Agent/Hospital' } as Record<Language, string>, to: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient' } as Record<Language, string>, desc: null, serviceKey: null },
  { step: 9, title: { ja: '治療完了', 'zh-TW': '治療結束', 'zh-CN': '治疗结束', en: 'Treatment Completed' } as Record<Language, string>, subtitle: { ja: '費用精算', 'zh-TW': '費用結算', 'zh-CN': '费用结算', en: 'Final Settlement' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '仲介/病院', 'zh-TW': '中介/醫院', 'zh-CN': '中介/医院', en: 'Agent/Hospital' } as Record<Language, string>, to: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient' } as Record<Language, string>, desc: null, serviceKey: null },
  { step: 10, title: { ja: 'アフターサポート', 'zh-TW': '後續支持', 'zh-CN': '后续支持', en: 'Follow-up Support' } as Record<Language, string>, subtitle: { ja: '遠隔フォローアップ', 'zh-TW': '遠程隨訪', 'zh-CN': '远程随访', en: 'Remote Follow-up' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '病院', 'zh-TW': '醫院', 'zh-CN': '医院', en: 'Hospital' } as Record<Language, string>, to: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient' } as Record<Language, string>, desc: { ja: '病歴および中国の医師への治療まとめと提案を提供。必要に応じてオンライン経過観察や遠隔相談を実施', 'zh-TW': '提供病歷以及給中國醫生的治療總結與建議，必要時做線上隨訪或遠程諮詢', 'zh-CN': '提供病历以及给中国医生的治疗总结与建议，必要时做线上随访或远程咨询', en: 'Provide medical records and treatment summary for home doctors, with online follow-up if needed' } as Record<Language, string>, serviceKey: null },
];

// 治疗阶段分组（将 10 步归纳为 4 大阶段，便于患者理解）
const TREATMENT_PHASES = [
  {
    id: 'pre-assessment', phaseNumber: 1, icon: FileText, color: 'blue' as const,
    title: { ja: '前期評価', 'zh-TW': '前期評估', 'zh-CN': '前期评估', en: 'Pre-Assessment' } as Record<Language, string>,
    subtitle: { ja: '資料提出から病院相談まで', 'zh-TW': '從提交資料到醫院諮詢', 'zh-CN': '从提交资料到医院咨询', en: 'From document submission to hospital consultation' } as Record<Language, string>,
    duration: { ja: '約1〜2週間', 'zh-TW': '約 1-2 週', 'zh-CN': '约 1-2 周', en: '~1-2 weeks' } as Record<Language, string>,
    stepRange: [1, 3] as [number, number],
    patientActions: [
      { ja: '診療情報の提出', 'zh-TW': '提交診療資料', 'zh-CN': '提交诊疗资料', en: 'Submit medical records' } as Record<Language, string>,
      { ja: '初期相談料のお支払い', 'zh-TW': '支付前期諮詢費', 'zh-CN': '支付前期咨询费', en: 'Pay consultation fee' } as Record<Language, string>,
    ],
    weHandle: [
      { ja: '資料翻訳（中→日）', 'zh-TW': '資料翻譯（中→日）', 'zh-CN': '资料翻译（中→日）', en: 'Document translation (CN→JP)' } as Record<Language, string>,
      { ja: '最適な病院・医師の選定', 'zh-TW': '選擇合適的醫院與醫生', 'zh-CN': '选择合适的医院与医生', en: 'Select suitable hospital & doctor' } as Record<Language, string>,
      { ja: '病院への初期相談', 'zh-TW': '向醫院初步諮詢', 'zh-CN': '向医院初步咨询', en: 'Initial hospital consultation' } as Record<Language, string>,
    ],
    feeSummary: { ja: '¥221,000（税込）', 'zh-TW': '¥221,000（含稅）', 'zh-CN': '¥221,000（含税）', en: '¥221,000 (tax incl.)' } as Record<Language, string>,
  },
  {
    id: 'remote-consultation', phaseNumber: 2, icon: Globe, color: 'purple' as const,
    title: { ja: '遠隔会診', 'zh-TW': '遠程會診', 'zh-CN': '远程会诊', en: 'Remote Consultation' } as Record<Language, string>,
    subtitle: { ja: '日本専門医とのビデオ診察', 'zh-TW': '與日本專科醫生視頻會診', 'zh-CN': '与日本专科医生视频会诊', en: 'Video consultation with Japanese specialist' } as Record<Language, string>,
    duration: { ja: '約1〜2週間', 'zh-TW': '約 1-2 週', 'zh-CN': '约 1-2 周', en: '~1-2 weeks' } as Record<Language, string>,
    stepRange: [4, 5] as [number, number],
    patientActions: [
      { ja: '遠隔診療に参加', 'zh-TW': '參加遠程會診', 'zh-CN': '参加远程会诊', en: 'Attend remote consultation' } as Record<Language, string>,
      { ja: '来日治療の最終判断', 'zh-TW': '最終決定是否赴日', 'zh-CN': '最终决定是否赴日', en: 'Final decision to visit Japan' } as Record<Language, string>,
    ],
    weHandle: [
      { ja: '専門医のスケジュール調整', 'zh-TW': '協調專科醫生時間', 'zh-CN': '协调专科医生时间', en: 'Coordinate specialist schedule' } as Record<Language, string>,
      { ja: '医療通訳の手配', 'zh-TW': '安排醫療翻譯', 'zh-CN': '安排医疗翻译', en: 'Arrange medical interpreter' } as Record<Language, string>,
      { ja: '治療計画・費用概算の提示', 'zh-TW': '提供治療計劃與費用概算', 'zh-CN': '提供治疗计划与费用概算', en: 'Provide treatment plan & cost estimate' } as Record<Language, string>,
      { ja: '治療保証金額のご案内', 'zh-TW': '告知治療保證金金額', 'zh-CN': '告知治疗保证金金额', en: 'Advise deposit amount for treatment' } as Record<Language, string>,
    ],
    feeSummary: { ja: '¥243,000（税込）', 'zh-TW': '¥243,000（含稅）', 'zh-CN': '¥243,000（含税）', en: '¥243,000 (tax incl.)' } as Record<Language, string>,
  },
  {
    id: 'treatment-japan', phaseNumber: 3, icon: Activity, color: 'amber' as const,
    title: { ja: '赴日治療', 'zh-TW': '赴日治療', 'zh-CN': '赴日治疗', en: 'Treatment in Japan' } as Record<Language, string>,
    subtitle: { ja: '保証金お支払い後、日程確定から治療完了まで', 'zh-TW': '支付保證金後，從確定日程到完成治療', 'zh-CN': '支付保证金后，从确定日程到完成治疗', en: 'After deposit payment, from schedule confirmation to treatment completion' } as Record<Language, string>,
    duration: { ja: '症状により異なる', 'zh-TW': '依病情而定', 'zh-CN': '依病情而定', en: 'Varies by condition' } as Record<Language, string>,
    stepRange: [6, 8] as [number, number],
    patientActions: [
      { ja: '治療保証金のお支払い', 'zh-TW': '支付治療保證金', 'zh-CN': '支付治疗保证金', en: 'Pay treatment deposit' } as Record<Language, string>,
      { ja: '来日スケジュールの確認', 'zh-TW': '確認赴日行程', 'zh-CN': '确认赴日行程', en: 'Confirm travel schedule' } as Record<Language, string>,
      { ja: '医療ビザの申請（必要な場合）', 'zh-TW': '申請醫療簽證（如需要）', 'zh-CN': '申请医疗签证（如需要）', en: 'Apply for medical visa (if needed)' } as Record<Language, string>,
    ],
    weHandle: [
      { ja: '病院予約・通訳手配', 'zh-TW': '醫院預約、翻譯安排', 'zh-CN': '医院预约、翻译安排', en: 'Hospital booking & interpreter arrangement' } as Record<Language, string>,
      { ja: '全行程の受診サポート', 'zh-TW': '全程就診支援', 'zh-CN': '全程就诊支援', en: 'Full visit support' } as Record<Language, string>,
      { ja: '追加費用発生時の即時ご連絡', 'zh-TW': '如有追加費用即時通知', 'zh-CN': '如有追加费用即时通知', en: 'Immediate notification of any additional costs' } as Record<Language, string>,
      { ja: 'ビザ申請サポート', 'zh-TW': '簽證申請協助', 'zh-CN': '签证申请协助', en: 'Visa application support' } as Record<Language, string>,
    ],
    feeSummary: null,
  },
  {
    id: 'followup', phaseNumber: 4, icon: HeartPulse, color: 'green' as const,
    title: { ja: '治療完了・随訪', 'zh-TW': '治療完成與隨訪', 'zh-CN': '治疗完成与随访', en: 'Completion & Follow-up' } as Record<Language, string>,
    subtitle: { ja: '保証金による精算からアフターサポートまで', 'zh-TW': '保證金結算至後續支持', 'zh-CN': '保证金结算至后续支持', en: 'From deposit settlement to ongoing support' } as Record<Language, string>,
    duration: { ja: '継続的サポート', 'zh-TW': '持續支援', 'zh-CN': '持续支援', en: 'Ongoing support' } as Record<Language, string>,
    stepRange: [9, 10] as [number, number],
    patientActions: [
      { ja: '帰国後の報告', 'zh-TW': '歸國後告知狀況', 'zh-CN': '归国后告知状况', en: 'Report status after returning home' } as Record<Language, string>,
    ],
    weHandle: [
      { ja: '保証金から全治療費をお支払い・差額精算', 'zh-TW': '以保證金支付全部醫療費、多退少補', 'zh-CN': '以保证金支付全部医疗费、多退少补', en: 'Settle all medical costs from deposit, refund or charge difference' } as Record<Language, string>,
      { ja: '治療まとめの提供', 'zh-TW': '提供治療總結', 'zh-CN': '提供治疗总结', en: 'Provide treatment summary' } as Record<Language, string>,
      { ja: '遠隔フォローアップの手配', 'zh-TW': '安排遠程隨訪', 'zh-CN': '安排远程随访', en: 'Arrange remote follow-up' } as Record<Language, string>,
    ],
    feeSummary: null,
  },
];

// 阶段颜色映射（提取为静态常量，避免每次渲染重建）
type PhaseColor = 'blue' | 'purple' | 'amber' | 'green';
const PHASE_COLOR_MAP: Record<PhaseColor, { bg: string; light: string; border: string; text: string; ring: string }> = {
  blue:   { bg: 'bg-brand-700',   light: 'bg-brand-50',   border: 'border-brand-700',   text: 'text-brand-700',   ring: 'ring-brand-200' },
  purple: { bg: 'bg-brand-600', light: 'bg-brand-50', border: 'border-brand-600', text: 'text-brand-600', ring: 'ring-brand-200' },
  amber:  { bg: 'bg-gold-500',  light: 'bg-gold-50',  border: 'border-gold-500',  text: 'text-gold-600',  ring: 'ring-gold-200' },
  green:  { bg: 'bg-brand-600',  light: 'bg-brand-50',  border: 'border-brand-600',  text: 'text-brand-600',  ring: 'ring-brand-200' },
};
const PHASE_GRADIENT_MAP: Record<PhaseColor, string> = {
  blue:   'from-brand-700 to-brand-800',
  purple: 'from-brand-600 to-brand-700',
  amber:  'from-gold-500 to-gold-600',
  green:  'from-brand-600 to-brand-700',
};
const PHASE_LIGHT_BG_MAP: Record<PhaseColor, string> = {
  blue:   'bg-brand-50 border-brand-100',
  purple: 'bg-brand-50 border-brand-100',
  amber:  'bg-gold-50 border-gold-100',
  green:  'bg-brand-50 border-brand-100',
};
const PHASE_DOT_MAP: Record<PhaseColor, string> = {
  blue: 'bg-brand-500',
  purple: 'bg-brand-500',
  amber: 'bg-gold-500',
  green: 'bg-brand-500',
};

// 標準治療方式
const STANDARD_TREATMENTS = [
  {
    id: 'surgery',
    icon: Stethoscope,
    title: { ja: '手術', 'zh-TW': '手術', 'zh-CN': '手术', en: 'Surgery' } as Record<Language, string>,
    color: 'blue',
    features: [
      { ja: '低侵襲アプローチで創傷が小さく、回復が早い', 'zh-TW': '微創手術，創傷小、恢復快', 'zh-CN': '微创手术，创伤小、恢复快', en: 'Minimally invasive approach with reduced trauma and faster recovery' } as Record<Language, string>,
      { ja: '生存率だけでなく、術後のQOLを重視', 'zh-TW': '不僅追求生存率，更重視術後生活質量', 'zh-CN': '不仅追求生存率，更重视术后生活质量', en: 'Prioritizes post-surgery quality of life' } as Record<Language, string>,
      { ja: '食事・排尿・会話等の機能保護', 'zh-TW': '進食、排尿、說話等功能保護', 'zh-CN': '进食、排尿、说话等功能保护', en: 'Protects eating, urinary, speech functions' } as Record<Language, string>,
    ],
    desc: { ja: '日本の低侵襲手術技術は高い水準を有し、治療効果を追求しながらQOLの保護を重視しています。', 'zh-TW': '日本微創手術技術水準高，在追求治療效果的同時重視保護患者的生活質量。', 'zh-CN': '日本微创手术技术水准高，在追求治疗效果的同时重视保护患者的生活质量。', en: 'Japanese minimally invasive surgery maintains high standards, emphasizing quality of life alongside treatment outcomes.' } as Record<Language, string>,
  },
  {
    id: 'chemo',
    icon: Pill,
    title: { ja: '化学療法', 'zh-TW': '化學治療', 'zh-CN': '化学治疗', en: 'Chemotherapy' } as Record<Language, string>,
    color: 'green',
    features: [
      { ja: '患者の年齢・体力・合併症に応じて投与量を調整', 'zh-TW': '根據患者年齡、體力、合併症調整劑量', 'zh-CN': '根据患者年龄、体力、合并症调整剂量', en: 'Dosage adjusted for age, fitness, comorbidities' } as Record<Language, string>,
      { ja: 'プロトコルに基づく副作用モニタリング', 'zh-TW': '基於規範的副作用監測管理', 'zh-CN': '基于规范的副作用监测管理', en: 'Protocol-based side effect monitoring' } as Record<Language, string>,
      { ja: '高齢患者や慢性腫瘍患者に最適', 'zh-TW': '適合高齡患者、慢性腫瘤患者', 'zh-CN': '适合高龄患者、慢性肿瘤患者', en: 'Suitable for elderly and chronic tumor patients' } as Record<Language, string>,
    ],
    desc: { ja: '最大投与量を追求せず、個体差に基づき最適な方案を策定し、副作用の軽減を目指します。', 'zh-TW': '不一味追求最大劑量，而是根據個體差異制定方案，力求減輕副作用。', 'zh-CN': '不一味追求最大剂量，而是根据个体差异制定方案，力求减轻副作用。', en: 'Plans tailored to individual differences, aiming to reduce side effects rather than maximizing dosage.' } as Record<Language, string>,
  },
  {
    id: 'radiation',
    icon: Radio,
    title: { ja: '放射線治療', 'zh-TW': '放射線治療', 'zh-CN': '放射线治疗', en: 'Radiation Therapy' } as Record<Language, string>,
    color: 'purple',
    features: [
      { ja: '陽子線・重粒子線治療の実績が豊富', 'zh-TW': '陽子線、重離子線治療經驗豐富', 'zh-CN': '质子线、重离子线治疗经验丰富', en: 'Extensive proton and heavy ion therapy experience' } as Record<Language, string>,
      { ja: '定位放射線治療技術が成熟', 'zh-TW': '立體定向放射治療技術成熟', 'zh-CN': '立体定向放射治疗技术成熟', en: 'Mature stereotactic radiation technology' } as Record<Language, string>,
      { ja: '正常組織への影響を抑え、合併症リスクの低減を目指す', 'zh-TW': '旨在降低對正常組織的影響，減少併發症風險', 'zh-CN': '旨在降低对正常组织的影响，减少并发症风险', en: 'Aims to reduce impact on normal tissue and lower complication risk' } as Record<Language, string>,
    ],
    desc: { ja: '高精度放射線技術で腫瘍細胞を狙い、周囲の正常組織への影響を抑えることを目指します。', 'zh-TW': '高精度放射線技術旨在精準瞄準腫瘤細胞，盡可能減少對周圍正常組織的影響。', 'zh-CN': '高精度放射线技术旨在精准瞄准肿瘤细胞，尽可能减少对周围正常组织的影响。', en: 'High-precision radiation targets tumor cells, aiming to reduce impact on surrounding tissue.' } as Record<Language, string>,
  },
  {
    id: 'immune',
    icon: Shield,
    title: { ja: '免疫療法', 'zh-TW': '免疫治療', 'zh-CN': '免疫治疗', en: 'Immunotherapy' } as Record<Language, string>,
    color: 'orange',
    features: [
      { ja: '適応症の厳格なスクリーニング', 'zh-TW': '嚴格篩選適應症', 'zh-CN': '严格筛选适应症', en: 'Strict indication screening' } as Record<Language, string>,
      { ja: '免疫関連有害事象に高度に警戒', 'zh-TW': '高度警惕免疫相關不良反應', 'zh-CN': '高度警惕免疫相关不良反应', en: 'Highly vigilant of immune-related adverse events' } as Record<Language, string>,
      { ja: '正常臓器への影響を抑える管理体制', 'zh-TW': '管控對正常器官的影響', 'zh-CN': '管控对正常器官的影响', en: 'Protocols to manage impact on normal organs' } as Record<Language, string>,
    ],
    desc: { ja: '免疫療法の効果を発揮しながら、精密な管理で免疫系統による正常臓器への攻撃を防ぎます。', 'zh-TW': '在發揮免疫治療效果的同時，通過精細管理避免免疫系統攻擊正常器官。', 'zh-CN': '在发挥免疫治疗效果的同时，通过精细管理避免免疫系统攻击正常器官。', en: 'Leveraging immunotherapy while preventing immune attacks on normal organs through precise management.' } as Record<Language, string>,
  },
  {
    id: 'targeted',
    icon: Target,
    title: { ja: '標的治療', 'zh-TW': '靶向治療', 'zh-CN': '靶向治疗', en: 'Targeted Therapy' } as Record<Language, string>,
    color: 'red',
    features: [
      { ja: 'がん細胞の特定遺伝子に対する精密治療', 'zh-TW': '針對癌細胞特定基因進行精準治療', 'zh-CN': '针对癌细胞特定基因进行精准治疗', en: 'Precision treatment targeting specific cancer genes' } as Record<Language, string>,
      { ja: '「遺伝子エビデンスなければ安易に投薬せず」', 'zh-TW': '「無基因證據，不輕易用藥」', 'zh-CN': '"无基因证据，不轻易用药"', en: '"No genetic evidence, no hasty medication"' } as Record<Language, string>,
      { ja: '無効な治療と不必要な副作用を回避', 'zh-TW': '避免無效治療和不必要副作用', 'zh-CN': '避免无效治疗和不必要副作用', en: 'Avoid ineffective treatment and unnecessary side effects' } as Record<Language, string>,
    ],
    desc: { ja: '遺伝子検査結果に基づき最適な標的薬を選択し、真のプレシジョン・メディシンを実現します。', 'zh-TW': '基於基因檢測結果選擇最適合的靶向藥物，真正做到精準醫療。', 'zh-CN': '基于基因检测结果选择最适合的靶向药物，真正做到精准医疗。', en: 'Selecting optimal targeted drugs based on genetic testing for true precision medicine.' } as Record<Language, string>,
  },
];
// 再生醫療輔助治療
const REGENERATIVE_TREATMENTS = [
  {
    id: 'msc',
    icon: Dna,
    title: { ja: '間葉系幹細胞', 'zh-TW': '間充質幹細胞', 'zh-CN': '间充质干细胞', en: 'Mesenchymal Stem Cells' } as Record<Language, string>,
    subtitle: 'MSC Therapy',
    purpose: { ja: '身体回復', 'zh-TW': '身體恢復', 'zh-CN': '身体恢复', en: 'Body Recovery' } as Record<Language, string>,
    color: 'blue',
    features: [
      { ja: '抗炎症・免疫調節', 'zh-TW': '抗炎與免疫調節', 'zh-CN': '抗炎与免疫调节', en: 'Anti-inflammation & immune regulation' } as Record<Language, string>,
      { ja: '化学療法・放射線治療後の身体ケア', 'zh-TW': '化療、放療後的身體調理', 'zh-CN': '化疗、放疗后的身体调理', en: 'Post-chemo/radiation body care' } as Record<Language, string>,
      { ja: '組織修復へのアプローチ', 'zh-TW': '組織修復的輔助探索', 'zh-CN': '组织修复的辅助探索', en: 'Approach to tissue repair support' } as Record<Language, string>,
    ],
  },
  {
    id: 'exosome',
    icon: Atom,
    title: { ja: 'エクソソーム', 'zh-TW': '外泌體', 'zh-CN': '外泌体', en: 'Exosomes' } as Record<Language, string>,
    subtitle: 'Exosome Therapy',
    purpose: { ja: '長期健康管理', 'zh-TW': '長期健康管理', 'zh-CN': '长期健康管理', en: 'Long-term Health' } as Record<Language, string>,
    color: 'purple',
    features: [
      { ja: '細胞修復へのアプローチ', 'zh-TW': '細胞修復的輔助探索', 'zh-CN': '细胞修复的辅助探索', en: 'Approach to cell repair support' } as Record<Language, string>,
      { ja: '治療後の健康管理を目指す', 'zh-TW': '著眼於治療後的健康管理', 'zh-CN': '着眼于治疗后的健康管理', en: 'Aimed at post-treatment health management' } as Record<Language, string>,
      { ja: 'アンチエイジングケア', 'zh-TW': '抗衰老調理', 'zh-CN': '抗衰老调理', en: 'Anti-aging care' } as Record<Language, string>,
    ],
  },
  {
    id: 'nk',
    icon: Shield,
    title: { ja: 'NK等免疫細胞', 'zh-TW': 'NK等免疫細胞', 'zh-CN': 'NK等免疫细胞', en: 'NK Immune Cells' } as Record<Language, string>,
    subtitle: 'NK Cell Therapy',
    purpose: { ja: '免疫サポート', 'zh-TW': '免疫支持', 'zh-CN': '免疫支持', en: 'Immune Support' } as Record<Language, string>,
    color: 'green',
    features: [
      { ja: '免疫機能へのアプローチ', 'zh-TW': '免疫功能的輔助探索', 'zh-CN': '免疫功能的辅助探索', en: 'Approach to immune function support' } as Record<Language, string>,
      { ja: '体の自然防御力に着目したケア', 'zh-TW': '著眼於身體自然防禦力的調理', 'zh-CN': '着眼于身体自然防御力的调理', en: 'Care focused on natural defense capacity' } as Record<Language, string>,
      { ja: '治療後の健康管理の一環', 'zh-TW': '治療後健康管理的一環', 'zh-CN': '治疗后健康管理的一环', en: 'Part of post-treatment health management' } as Record<Language, string>,
    ],
  },
];
// 合作醫療機構類型
const PARTNER_INSTITUTIONS = [
  { icon: Building, label: { ja: '大学病院・総合病院', 'zh-TW': '大學醫院、綜合醫院', 'zh-CN': '大学医院、综合医院', en: 'University & General Hospitals' } as Record<Language, string> },
  { icon: Atom, label: { ja: '重粒子線・陽子線治療施設', 'zh-TW': '重粒子線、陽子線治療設施', 'zh-CN': '重粒子线、质子线治疗设施', en: 'Heavy Ion & Proton Therapy Facilities' } as Record<Language, string> },
  { icon: Stethoscope, label: { ja: '専門クリニック', 'zh-TW': '專門診所', 'zh-CN': '专门诊所', en: 'Specialized Clinics' } as Record<Language, string> },
  { icon: FlaskConical, label: { ja: '再生医療クリニック', 'zh-TW': '再生醫療診所', 'zh-CN': '再生医疗诊所', en: 'Regenerative Medicine Clinics' } as Record<Language, string> },
];
// 医疗机构 i18n 辅助函数
const L = (ja: string, tw: string, cn: string, en: string): Record<Language, string> => ({ ja, 'zh-TW': tw, 'zh-CN': cn, en });
// 日本知名癌症治疗医疗机构介绍（纯信息展示，非合作声明）— 关西地区优先置顶
const JAPAN_MEDICAL_INSTITUTIONS = [
  {
    category: L('関西地域 がん専門病院', '關西地區癌症專門醫院', '关西地区癌症专门医院', 'Kansai Cancer Specialty Hospitals'),
    color: 'red',
    institutions: [
      {
        name: '大阪国際がんセンター',
        nameLocal: L('大阪国際がんセンター', '大阪國際癌症中心', '大阪国际癌症中心', 'Osaka International Cancer Center'),
        location: L('大阪府大阪市中央区', '大阪府大阪市中央區', '大阪府大阪市中央区', 'Chuo-ku, Osaka City, Osaka'),
        website: 'https://oici.jp/',
        specialty: [
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('乳がん', '乳癌', '乳癌', 'Breast Cancer'),
          L('血液腫瘍', '血液腫瘤', '血液肿瘤', 'Hematologic Tumors'),
          L('婦人科腫瘍', '婦科腫瘤', '妇科肿瘤', 'Gynecologic Tumors'),
        ],
        features: [
          L('大阪府立がん専門病院（2017年新築）', '大阪府立癌症專門醫院（2017年新建）', '大阪府立癌症专门医院（2017年新建）', 'Osaka prefectural cancer hospital (rebuilt 2017)'),
          L('年間手術件数 5,000例超', '年間手術量超 5,000 例', '年间手术量超 5,000 例', 'Over 5,000 surgeries per year'),
          L('先進がん治療設備完備', '先進癌症治療設備完備', '先进癌症治疗设备完备', 'Advanced cancer treatment equipment'),
          L('がんゲノム医療中核拠点', '癌症基因組醫療核心據點', '癌症基因组医疗核心据点', 'Core hub for cancer genomic medicine'),
          L('国際患者支援窓口あり', '國際患者支援窗口', '国际患者支援窗口', 'International patient support desk'),
        ],
        treatments: [
          L('ダヴィンチ手術', '達芬奇機器人手術', '达芬奇机器人手术', 'Da Vinci Robotic Surgery'),
          L('免疫療法', '免疫治療', '免疫治疗', 'Immunotherapy'),
          L('遺伝子標的治療', '基因靶向治療', '基因靶向治疗', 'Gene-targeted Therapy'),
          L('放射線治療', '放射線治療', '放射线治疗', 'Radiation Therapy'),
        ],
      },
      {
        name: '兵庫県立がんセンター',
        nameLocal: L('兵庫県立がんセンター', '兵庫縣立癌症中心', '兵库县立癌症中心', 'Hyogo Prefectural Cancer Center'),
        location: L('兵庫県明石市', '兵庫縣明石市', '兵库县明石市', 'Akashi, Hyogo'),
        website: 'https://www.hyogo-cc.jp/',
        specialty: [
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('乳がん', '乳癌', '乳癌', 'Breast Cancer'),
          L('頭頸部がん', '頭頸部癌', '头颈部癌', 'Head & Neck Cancer'),
        ],
        features: [
          L('兵庫県がん治療の中核病院', '兵庫縣癌症治療核心醫院', '兵库县癌症治疗核心医院', 'Core cancer hospital of Hyogo'),
          L('多職種チーム医療体制', '多學科協作治療體制', '多学科协作治疗体制', 'Multidisciplinary team approach'),
          L('緩和ケアが充実', '緩和醫療充實', '缓和医疗充实', 'Comprehensive palliative care'),
          L('臨床試験に積極参加', '臨床試驗積極參與', '临床试验积极参与', 'Active clinical trial participation'),
        ],
        treatments: [
          L('低侵襲手術', '微創手術', '微创手术', 'Minimally Invasive Surgery'),
          L('化学療法', '化學療法', '化学疗法', 'Chemotherapy'),
          L('放射線治療', '放射線治療', '放射线治疗', 'Radiation Therapy'),
          L('緩和ケア', '緩和醫療', '缓和医疗', 'Palliative Care'),
        ],
      },
      {
        name: '神戸大学医学部附属病院',
        nameLocal: L('神戸大学医学部附属病院', '神戶大學醫學部附屬醫院', '神户大学医学部附属医院', 'Kobe University Hospital'),
        location: L('兵庫県神戸市', '兵庫縣神戶市', '兵库县神户市', 'Kobe, Hyogo'),
        website: 'https://www.hosp.kobe-u.ac.jp/',
        specialty: [
          L('肝胆膵がん', '肝膽胰癌', '肝胆胰癌', 'Hepatobiliary & Pancreatic Cancer'),
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('乳がん', '乳癌', '乳癌', 'Breast Cancer'),
          L('血液腫瘍', '血液腫瘤', '血液肿瘤', 'Hematologic Tumors'),
        ],
        features: [
          L('神戸医療産業都市の中核病院', '神戶醫療產業都市核心醫院', '神户医疗产业都市核心医院', 'Core hospital of Kobe Biomedical Innovation Cluster'),
          L('肝胆膵外科に強みを有する', '肝膽胰外科為強項', '肝胆胰外科为强项', 'Strength in hepatobiliary & pancreatic surgery'),
          L('先進医療設備完備', '先進醫療設備完備', '先进医疗设备完备', 'Advanced medical equipment'),
          L('国際医療交流が活発', '國際醫療交流活躍', '国际医疗交流活跃', 'Active international medical exchange'),
        ],
        treatments: [
          L('高難度肝胆膵手術', '高難度肝膽胰手術', '高难度肝胆胰手术', 'Complex Hepatobiliary Surgery'),
          L('免疫療法', '免疫治療', '免疫治疗', 'Immunotherapy'),
          L('ゲノム医療', '基因組醫療', '基因组医疗', 'Genomic Medicine'),
        ],
      },
      {
        name: '奈良県立医科大学附属病院',
        nameLocal: L('奈良県立医科大学附属病院', '奈良縣立醫科大學附屬醫院', '奈良县立医科大学附属医院', 'Nara Medical University Hospital'),
        location: L('奈良県橿原市', '奈良縣橿原市', '奈良县橿原市', 'Kashihara, Nara'),
        website: 'https://www.naramed-u.ac.jp/hospital/',
        specialty: [
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('婦人科腫瘍', '婦科腫瘤', '妇科肿瘤', 'Gynecologic Tumors'),
          L('血液腫瘍', '血液腫瘤', '血液肿瘤', 'Hematologic Tumors'),
        ],
        features: [
          L('奈良県唯一の特定機能病院', '奈良縣唯一的特定機能醫院', '奈良县唯一的特定机能医院', 'Only advanced treatment hospital in Nara'),
          L('がん診療連携拠点病院', '癌症診療連攜據點醫院', '癌症诊疗连携据点医院', 'Designated regional cancer care hospital'),
          L('地域医療支援が充実', '地域醫療支援完善', '地域医疗支援完善', 'Strong regional medical support'),
          L('多職種チーム医療', '多職種團隊醫療', '多职种团队医疗', 'Multidisciplinary team medicine'),
        ],
        treatments: [
          L('腹腔鏡手術', '腹腔鏡手術', '腹腔镜手术', 'Laparoscopic Surgery'),
          L('化学療法', '化學療法', '化学疗法', 'Chemotherapy'),
          L('放射線治療', '放射線治療', '放射线治疗', 'Radiation Therapy'),
        ],
      },
      {
        name: '和歌山県立医科大学附属病院',
        nameLocal: L('和歌山県立医科大学附属病院', '和歌山縣立醫科大學附屬醫院', '和歌山县立医科大学附属医院', 'Wakayama Medical University Hospital'),
        location: L('和歌山県和歌山市', '和歌山縣和歌山市', '和歌山县和歌山市', 'Wakayama City, Wakayama'),
        website: 'https://www.wakayama-med.ac.jp/hospital/',
        specialty: [
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('乳がん', '乳癌', '乳癌', 'Breast Cancer'),
          L('泌尿器がん', '泌尿器癌', '泌尿器癌', 'Urologic Cancer'),
        ],
        features: [
          L('和歌山県がん診療の中核病院', '和歌山縣癌症診療核心醫院', '和歌山县癌症诊疗核心医院', 'Core cancer hospital of Wakayama'),
          L('内視鏡治療技術が精鍛', '內視鏡治療技術精湛', '内视镜治疗技术精湛', 'Exceptional endoscopic treatment skills'),
          L('がんゲノム医療拠点', '癌症基因組醫療據點', '癌症基因组医疗据点', 'Cancer genomic medicine hub'),
          L('緩和ケアチーム完備', '緩和醫療團隊完備', '缓和医疗团队完备', 'Full palliative care team'),
        ],
        treatments: [
          L('内視鏡手術', '內視鏡手術', '内视镜手术', 'Endoscopic Surgery'),
          L('化学療法', '化學療法', '化学疗法', 'Chemotherapy'),
          L('ゲノム医療', '基因組醫療', '基因组医疗', 'Genomic Medicine'),
          L('緩和ケア', '緩和醫療', '缓和医疗', 'Palliative Care'),
        ],
      },
      {
        name: '国立循環器病研究センター',
        nameLocal: L('国立循環器病研究センター', '國立腦心血管疾病研究中心', '国立脑心血管疾病研究中心', 'National Cerebral and Cardiovascular Center'),
        location: L('大阪府吹田市', '大阪府吹田市', '大阪府吹田市', 'Suita, Osaka'),
        website: 'https://www.ncvc.go.jp/',
        specialty: [
          L('心臓腫瘍', '心臟腫瘤', '心脏肿瘤', 'Cardiac Tumors'),
          L('脳腫瘍（脳血管関連）', '腦腫瘤（腦血管相關）', '脑肿瘤（脑血管相关）', 'Brain Tumors (Cerebrovascular)'),
          L('循環器合併がん', '合併循環系統疾病之癌症', '合并循环系统疾病的癌症', 'Cancer with Cardiovascular Complications'),
          L('腫瘍循環器学', '腫瘤心臟學', '肿瘤心脏学', 'Cardio-Oncology'),
        ],
        features: [
          L('循環器疾患の国立研究拠点', '循環系統疾病國家級研究據點', '循环系统疾病国家级研究据点', 'National research hub for cardiovascular diseases'),
          L('がん治療と循環器管理の統合医療', '癌症治療與循環系統管理的整合醫療', '癌症治疗与循环系统管理的整合医疗', 'Integrated cancer treatment with cardiovascular management'),
          L('脳卒中・心疾患合併がん患者に強い', '擅長腦中風及心臟病合併癌症患者', '擅长脑卒中及心脏病合并癌症患者', 'Specialized in cancer patients with stroke/heart disease'),
          L('高精度の画像診断・カテーテル技術', '高精度影像診斷及導管技術', '高精度影像诊断及导管技术', 'High-precision imaging diagnostics & catheter technology'),
        ],
        treatments: [
          L('腫瘍循環器外来（Onco-Cardiology）', '腫瘤心臟科門診（Onco-Cardiology）', '肿瘤心脏科门诊（Onco-Cardiology）', 'Onco-Cardiology Clinic'),
          L('心臓手術併施がん摘出', '心臟手術同步腫瘤切除', '心脏手术同步肿瘤切除', 'Concurrent cardiac surgery & tumor resection'),
          L('脳血管内治療', '腦血管介入治療', '脑血管介入治疗', 'Endovascular Neurosurgery'),
        ],
      },
    ],
  },
  {
    category: L('関西地域 大学付属病院', '關西地區大學附屬醫院', '关西地区大学附属医院', 'Kansai University Hospitals'),
    color: 'green',
    institutions: [
      {
        name: '大阪大学医学部附属病院',
        nameLocal: L('大阪大学医学部附属病院', '大阪大學醫學部附屬醫院', '大阪大学医学部附属医院', 'Osaka University Hospital'),
        location: L('大阪府吹田市', '大阪府吹田市', '大阪府吹田市', 'Suita, Osaka'),
        website: 'https://www.hosp.med.osaka-u.ac.jp/',
        specialty: [
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('血液腫瘍', '血液腫瘤', '血液肿瘤', 'Hematologic Tumors'),
          L('皮膚がん', '皮膚癌', '皮肤癌', 'Skin Cancer'),
        ],
        features: [
          L('関西を代表する医療機関', '關西地區代表性醫療機構', '关西地区代表性医疗机构', 'Leading medical institution in Kansai'),
          L('光免疫療法の臨床研究で先行', '光免疫療法臨床研究領先', '光免疫疗法临床研究领先', 'Pioneer in photoimmunotherapy research'),
          L('幹細胞治療研究の先駆者', '幹細胞治療研究先驅', '干细胞治疗研究先驱', 'Pioneer in stem cell therapy research'),
        ],
        treatments: [
          L('光免疫療法', '光免疫療法', '光免疫疗法', 'Photoimmunotherapy'),
          L('再生医療', '再生醫療', '再生医疗', 'Regenerative Medicine'),
          L('CAR-T療法', 'CAR-T 療法', 'CAR-T 疗法', 'CAR-T Therapy'),
        ],
      },
      {
        name: '京都大学医学部附属病院',
        nameLocal: L('京都大学医学部附属病院', '京都大學醫學部附屬醫院', '京都大学医学部附属医院', 'Kyoto University Hospital'),
        location: L('京都府京都市', '京都府京都市', '京都府京都市', 'Kyoto City, Kyoto'),
        website: 'https://www.kuhp.kyoto-u.ac.jp/',
        specialty: [
          L('血液腫瘍', '血液腫瘤', '血液肿瘤', 'Hematologic Tumors'),
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('脳腫瘍', '腦腫瘤', '脑肿瘤', 'Brain Tumors'),
          L('乳がん', '乳癌', '乳癌', 'Breast Cancer'),
        ],
        features: [
          L('iPS細胞研究発祥の地（山中伸弥教授）', 'iPS 細胞研究發源地（山中伸彌教授）', 'iPS 细胞研究发源地（山中伸弥教授）', 'Birthplace of iPS cell research (Prof. Yamanaka)'),
          L('再生医療研究に注力', '再生醫療研究領域活躍', '再生医疗研究领域活跃', 'Active in regenerative medicine research'),
          L('がんゲノム医療中核拠点', '癌症基因組醫療核心據點', '癌症基因组医疗核心据点', 'Core hub for cancer genomic medicine'),
          L('関西医学研究の重鎮', '關西醫學研究重鎮', '关西医学研究重镇', 'Leading medical research center in Kansai'),
        ],
        treatments: [
          L('iPS細胞治療', 'iPS 細胞治療', 'iPS 细胞治疗', 'iPS Cell Therapy'),
          L('ゲノム医療', '基因組醫療', '基因组医疗', 'Genomic Medicine'),
          L('CAR-T療法', 'CAR-T 療法', 'CAR-T 疗法', 'CAR-T Therapy'),
          L('免疫療法', '免疫治療', '免疫治疗', 'Immunotherapy'),
        ],
      },
      {
        name: '近畿大学医学部附属病院',
        nameLocal: L('近畿大学医学部附属病院', '近畿大學醫學部附屬醫院', '近畿大学医学部附属医院', 'Kindai University Hospital'),
        location: L('大阪府大阪狭山市', '大阪府大阪狹山市', '大阪府大阪狭山市', 'Osakasayama, Osaka'),
        website: 'https://www.med.kindai.ac.jp/',
        specialty: [
          L('肝がん', '肝癌', '肝癌', 'Liver Cancer'),
          L('腎がん', '腎癌', '肾癌', 'Kidney Cancer'),
          L('膀胱がん', '膀胱癌', '膀胱癌', 'Bladder Cancer'),
          L('前立腺がん', '前列腺癌', '前列腺癌', 'Prostate Cancer'),
        ],
        features: [
          L('近大病院（完全養殖マグロで有名）', '近大醫院（世界首創完全養殖黑鮪魚聞名）', '近大医院（世界首创完全养殖蓝鳍金枪鱼闻名）', 'Kindai Hospital (famed for pioneering farmed bluefin tuna)'),
          L('泌尿器科腫瘍治療に強み', '泌尿器科腫瘤治療強項', '泌尿器科肿瘤治疗强项', 'Strong in urologic cancer treatment'),
          L('ダヴィンチ手術の経験が豊富', '達芬奇機器人手術經驗豐富', '达芬奇机器人手术经验丰富', 'Extensive Da Vinci surgery experience'),
          L('がん免疫療法研究が活発', '癌症免疫治療研究活躍', '癌症免疫治疗研究活跃', 'Active cancer immunotherapy research'),
        ],
        treatments: [
          L('ダヴィンチ手術', '達芬奇機器人手術', '达芬奇机器人手术', 'Da Vinci Robotic Surgery'),
          L('免疫チェックポイント阻害剤', '免疫檢查點抑制劑', '免疫检查点抑制剂', 'Immune Checkpoint Inhibitors'),
          L('精密放射線治療', '精準放射治療', '精准放射治疗', 'Precision Radiation Therapy'),
        ],
      },
      {
        name: '兵庫医科大学病院',
        nameLocal: L('兵庫医科大学病院', '兵庫醫科大學醫院', '兵库医科大学医院', 'Hyogo Medical University Hospital'),
        location: L('兵庫県西宮市', '兵庫縣西宮市', '兵库县西宫市', 'Nishinomiya, Hyogo'),
        website: 'https://www.hosp.hyo-med.ac.jp/',
        specialty: [
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('乳がん', '乳癌', '乳癌', 'Breast Cancer'),
          L('肝がん', '肝癌', '肝癌', 'Liver Cancer'),
        ],
        features: [
          L('病床数963床の大規模総合病院', '963張病床的大型綜合醫院', '963张病床的大型综合医院', 'Large general hospital with 963 beds'),
          L('41の診療科を擁する', '擁有41個診療科', '拥有41个诊疗科', '41 clinical departments'),
          L('ダヴィンチ手術導入', '引進達芬奇機器人手術', '引进达芬奇机器人手术', 'Da Vinci robotic surgery available'),
          L('2026年新キャンパス開設（801床）', '2026年新院區開設（801床）', '2026年新院区开设（801床）', 'New campus opening 2026 (801 beds)'),
        ],
        treatments: [
          L('ダヴィンチ手術', '達芬奇機器人手術', '达芬奇机器人手术', 'Da Vinci Robotic Surgery'),
          L('化学療法', '化學療法', '化学疗法', 'Chemotherapy'),
          L('放射線治療', '放射治療', '放射治疗', 'Radiation Therapy'),
          L('内視鏡手術', '內視鏡手術', '内视镜手术', 'Endoscopic Surgery'),
        ],
      },
    ],
  },
  {
    category: L('BNCT ホウ素中性子捕捉療法（関西）', 'BNCT 硼中子俘獲治療（關西）', 'BNCT 硼中子俘获治疗（关西）', 'BNCT Boron Neutron Capture Therapy (Kansai)'),
    color: 'orange',
    institutions: [
      {
        name: '大阪医科薬科大学病院',
        nameLocal: L('大阪医科薬科大学病院', '大阪醫科藥科大學醫院', '大阪医科药科大学医院', 'Osaka Medical & Pharmaceutical University Hospital'),
        location: L('大阪府高槻市', '大阪府高槻市', '大阪府高槻市', 'Takatsuki, Osaka'),
        website: 'https://hospital.ompu.ac.jp/',
        specialty: [
          L('頭頸部がん（再発）', '頭頸部癌（復發）', '头颈部癌（复发）', 'Recurrent Head & Neck Cancer'),
          L('脳腫瘍', '腦腫瘤', '脑肿瘤', 'Brain Tumors'),
          L('悪性黒色腫', '惡性黑色素瘤', '恶性黑色素瘤', 'Malignant Melanoma'),
        ],
        features: [
          L('世界初の院内BNCT設備設置', '全球首個醫院內設置 BNCT 設備', '全球首个医院内设置 BNCT 设备', "World's first in-hospital BNCT facility"),
          L('手術困難・再発がんへの治療実績あり', '對手術困難、復發癌症具有治療實績', '对手术困难、复发癌症具有治疗实绩', 'Treatment track record for inoperable & recurrent cancers'),
          L('1回の照射で治療完了可能', '單次照射即可完成治療', '单次照射即可完成治疗', 'Treatment possible in a single session'),
        ],
        treatments: [
          L('BNCT ホウ素中性子捕捉療法', 'BNCT 硼中子俘獲治療', 'BNCT 硼中子俘获治疗', 'BNCT (Boron Neutron Capture Therapy)'),
        ],
      },
    ],
  },
  {
    category: L('重粒子線・陽子線治療施設（関西）', '重粒子線・質子線治療設施（關西）', '重粒子线・质子线治疗设施（关西）', 'Heavy Ion & Proton Therapy (Kansai)'),
    color: 'purple',
    institutions: [
      {
        name: '兵庫県立粒子線医療センター',
        nameLocal: L('兵庫県立粒子線医療センター', '兵庫縣立粒子線醫療中心', '兵库县立粒子线医疗中心', 'Hyogo Ion Beam Medical Center'),
        location: L('兵庫県たつの市', '兵庫縣龍野市', '兵库县龙野市', 'Tatsuno, Hyogo'),
        website: 'https://www.hibmc.shingu.hyogo.jp/',
        specialty: [
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('肝がん', '肝癌', '肝癌', 'Liver Cancer'),
          L('前立腺がん', '前列腺癌', '前列腺癌', 'Prostate Cancer'),
          L('膵がん', '胰臟癌', '胰腺癌', 'Pancreatic Cancer'),
        ],
        features: [
          L('世界初の陽子線・重粒子線両方を備えた施設', '全球首個同時擁有質子線和重粒子線的設施', '全球首个同时拥有质子线和重粒子线的设施', "World's first dual proton & heavy ion facility"),
          L('治療適応症の範囲が広い', '治療適應症範圍廣泛', '治疗适应症范围广泛', 'Wide range of treatable cancers'),
          L('がんの種類に応じた最適な粒子線を選択', '可根據癌症類型選擇最佳粒子線', '可根据癌症类型选择最佳粒子线', 'Optimal particle beam selected per cancer type'),
        ],
        treatments: [
          L('陽子線治療', '質子線治療', '质子线治疗', 'Proton Beam Therapy'),
          L('重粒子線治療', '重粒子線治療', '重粒子线治疗', 'Heavy Ion Therapy'),
        ],
      },
      {
        name: '大阪重粒子線センター',
        nameLocal: L('大阪重粒子線センター', '大阪重粒子線中心', '大阪重粒子线中心', 'Osaka Heavy Ion Therapy Center'),
        location: L('大阪府大阪市', '大阪府大阪市', '大阪府大阪市', 'Osaka City, Osaka'),
        website: 'https://www.osaka-himak.or.jp/',
        specialty: [
          L('前立腺がん', '前列腺癌', '前列腺癌', 'Prostate Cancer'),
          L('膵がん', '胰臟癌', '胰腺癌', 'Pancreatic Cancer'),
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('肝がん', '肝癌', '肝癌', 'Liver Cancer'),
          L('骨軟部腫瘍', '骨軟部肉瘤', '骨软部肉瘤', 'Bone & Soft Tissue Sarcoma'),
        ],
        features: [
          L('炭素イオン線による精密照射', '碳離子線精準照射', '碳离子线精准照射', 'Precision carbon ion beam irradiation'),
          L('手術困難ながんに有効', '對手術困難的癌症有效', '对手术困难的癌症有效', 'Effective for inoperable tumors'),
          L('周辺正常組織へのダメージが少ない', '對周圍正常組織損傷小', '对周围正常组织损伤小', 'Minimal damage to surrounding normal tissue'),
          L('大阪市内のアクセス利便性', '位於大阪市內交通便利', '位于大阪市内交通便利', 'Conveniently located in central Osaka'),
        ],
        treatments: [
          L('重粒子線治療（炭素イオン線）', '重粒子線治療（碳離子線）', '重粒子线治疗（碳离子线）', 'Heavy Ion Therapy (Carbon Ion)'),
        ],
      },
    ],
  },
  {
    category: L('国立がんセンター（東京）', '國立癌症中心（東京）', '国立癌症中心（东京）', 'National Cancer Center (Tokyo)'),
    color: 'blue',
    institutions: [
      {
        name: '国立がん研究センター中央病院',
        nameLocal: L('国立がん研究センター中央病院', '國立癌症研究中心中央醫院', '国立癌症研究中心中央医院', 'National Cancer Center Hospital'),
        location: L('東京都中央区', '東京都中央區', '东京都中央区', 'Chuo-ku, Tokyo'),
        website: 'https://www.ncc.go.jp/jp/ncch/',
        specialty: [
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('乳がん', '乳癌', '乳癌', 'Breast Cancer'),
          L('血液腫瘍', '血液腫瘤', '血液肿瘤', 'Hematologic Tumors'),
        ],
        features: [
          L('日本がん研究の最高学府', '日本癌症研究最高學府', '日本癌症研究最高学府', "Japan's top cancer research institution"),
          L('年間手術件数 8,000例超', '年手術量超 8,000 例', '年手术量超 8,000 例', 'Over 8,000 surgeries per year'),
          L('最新臨床試験に優先参加', '最新臨床試驗優先參與', '最新临床试验优先参与', 'Priority access to latest clinical trials'),
          L('多職種チーム合同カンファレンス', '多學科團隊會診制度', '多学科团队会诊制度', 'Multidisciplinary team conferences'),
        ],
        treatments: [
          L('ダヴィンチ手術', '達芬奇機器人手術', '达芬奇机器人手术', 'Da Vinci Robotic Surgery'),
          L('免疫チェックポイント阻害剤', '免疫檢查點抑制劑', '免疫检查点抑制剂', 'Immune Checkpoint Inhibitors'),
          L('遺伝子標的治療', '基因靶向治療', '基因靶向治疗', 'Gene-targeted Therapy'),
        ],
      },
      {
        name: '国立がん研究センター東病院',
        nameLocal: L('国立がん研究センター東病院', '國立癌症研究中心東醫院', '国立癌症研究中心东医院', 'National Cancer Center Hospital East'),
        location: L('千葉県柏市', '千葉縣柏市', '千叶县柏市', 'Kashiwa, Chiba'),
        website: 'https://www.ncc.go.jp/jp/ncce/',
        specialty: [
          L('頭頸部がん', '頭頸部癌', '头颈部癌', 'Head & Neck Cancer'),
          L('食道がん', '食道癌', '食道癌', 'Esophageal Cancer'),
          L('肝胆膵がん', '肝膽胰癌', '肝胆胰癌', 'Hepatobiliary & Pancreatic Cancer'),
        ],
        features: [
          L('陽子線治療の先駆者', '質子線治療先驅', '质子线治疗先驱', 'Pioneer in proton beam therapy'),
          L('頭頸部がん治療に強みを有する', '頭頸部癌治療為強項', '头颈部癌治疗为强项', 'Strength in head & neck cancer treatment'),
          L('消化器内視鏡治療技術に定評あり', '消化器內視鏡治療技術享有盛譽', '消化器内视镜治疗技术享有盛誉', 'Renowned GI endoscopic treatment expertise'),
          L('国際患者支援体制が充実', '國際患者支援體制完善', '国际患者支援体制完善', 'Comprehensive international patient support'),
        ],
        treatments: [
          L('陽子線治療', '質子線治療', '质子线治疗', 'Proton Beam Therapy'),
          L('光免疫療法', '光免疫療法', '光免疫疗法', 'Photoimmunotherapy'),
          L('内視鏡的粘膜下層剥離術(ESD)', '內視鏡黏膜下剝離術(ESD)', '内视镜黏膜下剥离术(ESD)', 'Endoscopic Submucosal Dissection (ESD)'),
        ],
      },
    ],
  },
  {
    category: L('首都圏 大学付属病院', '首都圈大學附屬醫院', '首都圈大学附属医院', 'Greater Tokyo University Hospitals'),
    color: 'blue',
    institutions: [
      {
        name: '東京大学医学部附属病院',
        nameLocal: L('東京大学医学部附属病院', '東京大學醫學部附屬醫院', '东京大学医学部附属医院', 'The University of Tokyo Hospital'),
        location: L('東京都文京区', '東京都文京區', '东京都文京区', 'Bunkyo-ku, Tokyo'),
        website: 'https://www.h.u-tokyo.ac.jp/',
        specialty: [
          L('全がん', '全科癌症', '全科癌症', 'All Cancer Types'),
          L('希少がん', '罕見癌症', '罕见癌症', 'Rare Cancers'),
          L('再発難治がん', '復發難治癌症', '复发难治癌症', 'Refractory / Recurrent Cancers'),
        ],
        features: [
          L('日本医学の最高学府', '日本醫學最高學府', '日本医学最高学府', "Japan's top medical university"),
          L('最新治療技術の臨床応用', '最新治療技術臨床應用', '最新治疗技术临床应用', 'Clinical application of cutting-edge treatments'),
          L('難病診断能力に優れる', '疑難雜症診斷能力強', '疑难杂症诊断能力强', 'Exceptional diagnostics for complex cases'),
        ],
        treatments: [
          L('CAR-T細胞療法', 'CAR-T 細胞療法', 'CAR-T 细胞疗法', 'CAR-T Cell Therapy'),
          L('精密医療', '精準醫療', '精准医疗', 'Precision Medicine'),
          L('臨床試験', '臨床試驗', '临床试验', 'Clinical Trials'),
        ],
      },
      {
        name: '慶應義塾大学病院',
        nameLocal: L('慶應義塾大学病院', '慶應義塾大學醫院', '庆应义塾大学医院', 'Keio University Hospital'),
        location: L('東京都新宿区', '東京都新宿區', '东京都新宿区', 'Shinjuku-ku, Tokyo'),
        website: 'https://www.hosp.keio.ac.jp/',
        specialty: [
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('消化器がん', '消化器癌', '消化器癌', 'GI Cancer'),
          L('婦人科腫瘍', '婦科腫瘤', '妇科肿瘤', 'Gynecologic Tumors'),
        ],
        features: [
          L('名門私立大学付属病院', '私立醫學名校附屬醫院', '私立医学名校附属医院', 'Prestigious private university hospital'),
          L('腫瘍内科の実力が強い', '腫瘤內科實力強勁', '肿瘤内科实力强劲', 'Strong medical oncology department'),
          L('国際患者の受入経験が豊富', '國際患者接待經驗豐富', '国际患者接待经验丰富', 'Extensive international patient experience'),
        ],
        treatments: [
          L('分子標的治療', '分子靶向治療', '分子靶向治疗', 'Molecular Targeted Therapy'),
          L('免疫療法', '免疫治療', '免疫治疗', 'Immunotherapy'),
          L('低侵襲手術', '微創手術', '微创手术', 'Minimally Invasive Surgery'),
        ],
      },
    ],
  },
  {
    category: L('その他の先進施設', '其他地區先進設施', '其他地区先进设施', 'Other Advanced Facilities'),
    color: 'purple',
    institutions: [
      {
        name: '量子科学技術研究開発機構 QST病院',
        nameLocal: L('QST病院（旧放医研）', 'QST醫院（原放醫研）', 'QST医院（原放医研）', 'QST Hospital (formerly NIRS)'),
        location: L('千葉県千葉市', '千葉縣千葉市', '千叶县千叶市', 'Chiba City, Chiba'),
        website: 'https://www.qst.go.jp/',
        specialty: [
          L('骨軟部腫瘍', '骨軟部肉瘤', '骨软部肉瘤', 'Bone & Soft Tissue Sarcoma'),
          L('頭頸部がん', '頭頸部癌', '头颈部癌', 'Head & Neck Cancer'),
          L('前立腺がん', '前列腺癌', '前列腺癌', 'Prostate Cancer'),
          L('肝がん', '肝癌', '肝癌', 'Liver Cancer'),
        ],
        features: [
          L('世界の重粒子線治療発祥の地', '世界重粒子線治療發源地', '世界重粒子线治疗发源地', 'Birthplace of heavy ion therapy worldwide'),
          L('治療経験 14,000例超', '治療經驗超 14,000 例', '治疗经验超 14,000 例', 'Over 14,000 cases treated'),
          L('放射線抵抗性がんへの治療実績あり', '對放射線抵抗性癌症具有治療實績', '对放射线抵抗性癌症具有治疗实绩', 'Treatment track record for radiation-resistant cancers'),
          L('短い治療期間（約3〜4週）', '短療程（約 3-4 週）', '短疗程（约 3-4 周）', 'Short treatment course (~3-4 weeks)'),
        ],
        treatments: [
          L('重粒子線治療（炭素イオン線）', '重粒子線治療（碳離子線）', '重粒子线治疗（碳离子线）', 'Heavy Ion Therapy (Carbon Ion)'),
        ],
      },
      {
        name: '静岡県立静岡がんセンター',
        nameLocal: L('静岡県立静岡がんセンター', '靜岡縣立靜岡癌症中心', '静冈县立静冈癌症中心', 'Shizuoka Cancer Center'),
        location: L('静岡県長泉町', '靜岡縣長泉町', '静冈县长泉町', 'Nagaizumi, Shizuoka'),
        website: 'https://www.scchr.jp/',
        specialty: [
          L('肺がん', '肺癌', '肺癌', 'Lung Cancer'),
          L('食道がん', '食道癌', '食道癌', 'Esophageal Cancer'),
          L('縦隔腫瘍', '縱隔腫瘤', '纵隔肿瘤', 'Mediastinal Tumors'),
        ],
        features: [
          L('陽子線治療の経験が豊富', '質子線治療經驗豐富', '质子线治疗经验丰富', 'Extensive proton therapy experience'),
          L('自然環境に恵まれ療養に最適', '環境優美，康復氛圍佳', '环境优美，康复氛围佳', 'Beautiful surroundings ideal for recovery'),
          L('多職種統合治療', '多學科整合治療', '多学科整合治疗', 'Integrated multidisciplinary treatment'),
        ],
        treatments: [
          L('陽子線治療', '質子線治療', '质子线治疗', 'Proton Beam Therapy'),
          L('定位放射線治療', '立體定向放射治療', '立体定向放射治疗', 'Stereotactic Radiation Therapy'),
        ],
      },
      {
        name: '南東北BNCT研究センター',
        nameLocal: L('南東北BNCT研究センター', '南東北BNCT研究中心', '南东北BNCT研究中心', 'Southern Tohoku BNCT Research Center'),
        location: L('福島県郡山市', '福島縣郡山市', '福岛县郡山市', 'Koriyama, Fukushima'),
        website: 'https://www.southerntohoku-bnct.com/',
        specialty: [
          L('頭頸部がん', '頭頸部癌', '头颈部癌', 'Head & Neck Cancer'),
          L('脳腫瘍', '腦腫瘤', '脑肿瘤', 'Brain Tumors'),
          L('悪性黒色腫', '惡性黑色素瘤', '恶性黑色素瘤', 'Malignant Melanoma'),
        ],
        features: [
          L('BNCT治療の先駆機関', 'BNCT 治療先驅機構', 'BNCT 治疗先驱机构', 'Pioneering BNCT institution'),
          L('加速器型BNCTシステム', '加速器型 BNCT 治療系統', '加速器型 BNCT 治疗系统', 'Accelerator-based BNCT system'),
          L('原子炉不要で安全性が高い', '無需核反應爐，安全性高', '无需核反应炉，安全性高', 'No nuclear reactor needed; high safety'),
        ],
        treatments: [
          L('BNCT ホウ素中性子捕捉療法', 'BNCT 硼中子俘獲治療', 'BNCT 硼中子俘获治疗', 'BNCT (Boron Neutron Capture Therapy)'),
        ],
      },
    ],
  },
];

interface CancerTreatmentContentProps {
  isGuideEmbed?: boolean;
  guideSlug?: string;
}

export default function CancerTreatmentContent({ isGuideEmbed, guideSlug }: CancerTreatmentContentProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState<number>(1);
  const [showWechatQR, setShowWechatQR] = useState(false);
  const currentLang = useLanguage();

  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][currentLang];
  return (
    <>
      {/* Hero Section - hide in guide embed mode */}
      {!isGuideEmbed && (
      <section className="relative min-h-screen flex items-center bg-brand-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1587010580103-fd86b8ea14ca?q=80&w=2080&auto=format&fit=crop"
            alt="Cancer Treatment"
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={75}
            priority
          />
          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/85 to-brand-900/70"></div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
          <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-gold-400"></div>
              <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">CANCER TREATMENT</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
              {t('heroDesc')}
              <br />
              <span className="text-gold-400">{t('heroTitle2')}</span>
            </h1>
            <p className="text-xl text-neutral-300 mb-8 leading-relaxed font-light max-w-2xl">
              {t('heroStat')} <span className="text-white font-bold">57.4%</span>
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-400 text-brand-900 text-sm font-medium tracking-wider hover:bg-gold-300 transition-colors"
              >
                <MessageSquare size={20} />
                {t('heroCTA')}
              </a>
              <a
                href="#treatment-flow"
                className="inline-flex items-center px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm tracking-wider hover:bg-white/20 transition-colors"
              >
                {t('heroFlow')}
              </a>
            </div>
            {/* Key Stats - Data Driven */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">74.9%</div>
                <div className="text-sm text-neutral-300">{t('statGastric')}</div>
                <div className="text-xs text-neutral-400 mt-1">Lancet 2018*</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">7+</div>
                <div className="text-sm text-neutral-300">{t('statProstate')}</div>
                <div className="text-xs text-neutral-400 mt-1">{t('statProstateSub')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">1/3</div>
                <div className="text-sm text-neutral-300">{t('statCost')}</div>
                <div className="text-xs text-neutral-400 mt-1">{t('statCostSub')}</div>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mb-4">{t('dataSource')}</p>
            {/* Trust Points */}
            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-gold-400" />
                <span className="text-sm">{t('trustEarly')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-gold-400" />
                <span className="text-sm">{t('trustTranslator')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-gold-400" />
                <span className="text-sm">{t('trustRemote')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}
      {/* Japan Medical Institutions Introduction - 關西優先置頂 */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-brand-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-700 text-xs tracking-widest uppercase font-bold">Japan Medical Institutions</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mt-3 mb-4">
              {t('instTitle')}
            </h2>
            <p className="text-neutral-500 max-w-3xl mx-auto mb-6">
              {t('instDesc')}
            </p>
            {/* 免責聲明 */}
            <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 px-4 py-2 rounded-lg text-sm text-gold-700">
              <Info size={16} />
              <span>{t('instDisclaimer')}</span>
            </div>
          </div>
          <div className="space-y-12 max-w-6xl mx-auto">
            {JAPAN_MEDICAL_INSTITUTIONS.map((category, catIndex) => {
              const colorClasses: Record<string, {
                headerBg: string;
                headerText: string;
                cardBorder: string;
                badge: string;
                tagBg: string;
                tagText: string;
              }> = {
                blue: {
                  headerBg: 'bg-brand-700',
                  headerText: 'text-white',
                  cardBorder: 'border-brand-200',
                  badge: 'bg-brand-100 text-brand-700',
                  tagBg: 'bg-brand-50',
                  tagText: 'text-brand-700',
                },
                purple: {
                  headerBg: 'bg-brand-600',
                  headerText: 'text-white',
                  cardBorder: 'border-brand-200',
                  badge: 'bg-brand-100 text-brand-700',
                  tagBg: 'bg-brand-50',
                  tagText: 'text-brand-600',
                },
                green: {
                  headerBg: 'bg-brand-600',
                  headerText: 'text-white',
                  cardBorder: 'border-brand-200',
                  badge: 'bg-brand-100 text-brand-700',
                  tagBg: 'bg-brand-50',
                  tagText: 'text-brand-600',
                },
                orange: {
                  headerBg: 'bg-gold-500',
                  headerText: 'text-white',
                  cardBorder: 'border-gold-200',
                  badge: 'bg-gold-100 text-gold-700',
                  tagBg: 'bg-gold-50',
                  tagText: 'text-gold-600',
                },
                red: {
                  headerBg: 'bg-brand-800',
                  headerText: 'text-white',
                  cardBorder: 'border-brand-200',
                  badge: 'bg-brand-100 text-brand-700',
                  tagBg: 'bg-brand-50',
                  tagText: 'text-brand-700',
                },
              };
              const colors = colorClasses[category.color];
              return (
                <div key={catIndex}>
                  {/* Category Header */}
                  <div className={`${colors.headerBg} ${colors.headerText} px-6 py-4 rounded-t-2xl flex items-center gap-3`}>
                    <Award size={24} />
                    <h3 className="text-xl font-bold">{category.category[currentLang]}</h3>
                  </div>
                  {/* Institutions Grid */}
                  <div className={`bg-white border-2 ${colors.cardBorder} border-t-0 rounded-b-2xl p-6`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {category.institutions.map((inst, instIndex) => (
                        <div
                          key={instIndex}
                          className="bg-neutral-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                        >
                          {/* Hospital Name */}
                          <div className="mb-4">
                            <h4 className="text-lg font-bold text-brand-900 mb-1">{inst.name}</h4>
                            <p className="text-sm text-neutral-500">{inst.nameLocal[currentLang]}</p>
                            <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                              <MapPin size={12} />
                              {inst.location[currentLang]}
                            </div>
                          </div>
                          {/* Specialty Tags */}
                          <div className="mb-4">
                            <p className="text-xs text-neutral-500 mb-2">{t('instSpecialty')}</p>
                            <div className="flex flex-wrap gap-1">
                              {inst.specialty.map((spec, i) => (
                                <span key={i} className={`${colors.badge} text-xs px-2 py-1 rounded-full`}>
                                  {spec[currentLang]}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* Features */}
                          <div className="mb-4">
                            <p className="text-xs text-neutral-500 mb-2">{t('instFeatures')}</p>
                            <ul className="space-y-1">
                              {inst.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                                  <CheckCircle size={14} className={`${colors.tagText} mt-0.5 flex-shrink-0`} />
                                  <span>{feature[currentLang]}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Treatments */}
                          <div className="mb-4">
                            <p className="text-xs text-neutral-500 mb-2">{t('instTreatments')}</p>
                            <div className="flex flex-wrap gap-1">
                              {inst.treatments.map((treatment, i) => (
                                <span key={i} className={`${colors.tagBg} ${colors.tagText} text-xs px-2 py-1 rounded border border-current/20`}>
                                  {treatment[currentLang]}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* Website Link */}
                          {inst.website && (
                            <a
                              href={inst.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 text-xs ${colors.tagText} hover:underline mt-2 pt-3 border-t border-neutral-200`}
                            >
                              <ExternalLink size={12} />
                              <span>{t('instWebsite')}</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Bottom Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500 max-w-2xl mx-auto">
              {t('instBottomNote')}
            </p>
          </div>
        </div>
      </section>
      {/* Treatment Flow Section */}
      <section id="treatment-flow" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-brand-700 text-xs tracking-widest uppercase font-bold">Treatment Process</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mt-3 mb-4">
              {t('flowTitle')}
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              {t('flowDesc')}
            </p>
          </div>

          {/* Phase Navigation */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TREATMENT_PHASES.map((phase) => {
                const PhaseIcon = phase.icon;
                const isActive = activePhase === phase.phaseNumber;
                const c = PHASE_COLOR_MAP[phase.color];
                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.phaseNumber)}
                    className={`relative rounded-2xl p-4 text-left transition-all ${
                      isActive
                        ? `${c.light} ${c.border} border-2 shadow-md ring-4 ${c.ring}`
                        : 'bg-neutral-50 border border-neutral-200 hover:shadow-sm hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? c.bg : 'bg-neutral-200'}`}>
                        <PhaseIcon size={16} className={isActive ? 'text-white' : 'text-neutral-500'} />
                      </div>
                      <span className={`text-xs font-bold ${isActive ? c.text : 'text-neutral-400'}`}>
                        PHASE {phase.phaseNumber}
                      </span>
                    </div>
                    <h3 className={`text-sm font-bold ${isActive ? 'text-brand-900' : 'text-neutral-600'}`}>
                      {phase.title[currentLang]}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {phase.duration[currentLang]}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-neutral-400 mt-4">{t('flowClickPhase')}</p>
          </div>

          {/* Active Phase Detail */}
          {(() => {
            const phase = TREATMENT_PHASES.find(p => p.phaseNumber === activePhase)!;
            const PhaseIcon = phase.icon;
            const phaseSteps = TREATMENT_FLOW.filter(
              s => s.step >= phase.stepRange[0] && s.step <= phase.stepRange[1]
            );

            return (
              <div className="max-w-5xl mx-auto">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-neutral-100">
                  {/* Phase Header */}
                  <div className={`bg-gradient-to-r ${PHASE_GRADIENT_MAP[phase.color]} p-6 md:p-8 text-white`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                          <PhaseIcon size={24} />
                        </div>
                        <div>
                          <div className="text-white/70 text-xs font-bold tracking-wider">PHASE {phase.phaseNumber}</div>
                          <h3 className="text-xl md:text-2xl font-bold">{phase.title[currentLang]}</h3>
                          <p className="text-white/80 text-sm mt-1">{phase.subtitle[currentLang]}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                          <Clock size={14} /> {phase.duration[currentLang]}
                        </span>
                        {phase.feeSummary && (
                          <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                            <CreditCard size={14} /> {phase.feeSummary[currentLang]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Two-column: You Do vs We Handle */}
                  <div className="p-6 md:p-8 bg-white">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {/* Patient Actions */}
                      <div className={`rounded-xl p-5 border ${PHASE_LIGHT_BG_MAP[phase.color]}`}>
                        <div className="flex items-center gap-2 mb-4">
                          <Users size={18} className="text-neutral-600" />
                          <h4 className="font-bold text-brand-900 text-sm">{t('flowYouDo')}</h4>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.patientActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                              <CheckCircle size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
                              <span>{action[currentLang]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* We Handle */}
                      <div className="rounded-xl p-5 border bg-neutral-50 border-neutral-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield size={18} className="text-neutral-600" />
                          <h4 className="font-bold text-brand-900 text-sm">{t('flowWeHandle')}</h4>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.weHandle.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                              <CheckCircle size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
                              <span>{item[currentLang]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Sub-step Timeline */}
                    <div>
                      <h4 className="font-bold text-brand-900 text-sm mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-neutral-400" />
                        {t('flowStepDetail')}
                      </h4>
                      <div className="relative">
                        <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${PHASE_DOT_MAP[phase.color]} opacity-20`}></div>
                        <div className="space-y-3">
                          {phaseSteps.map((step) => (
                            <div
                              key={step.step}
                              className="relative flex gap-4 group cursor-pointer"
                              onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                            >
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 ${PHASE_DOT_MAP[phase.color]}`}>
                                {step.step}
                              </div>
                              <div className={`flex-grow rounded-xl p-4 border transition-all ${
                                expandedStep === step.step ? 'bg-white shadow-md border-neutral-200' : 'bg-neutral-50 border-neutral-100 hover:bg-white hover:shadow-sm'
                              }`}>
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="text-sm font-bold text-brand-900">{step.title[currentLang]}</h5>
                                      {step.fee && (
                                        <span className="bg-gold-100 text-gold-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                          ¥{step.fee}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-neutral-500">{step.subtitle[currentLang]}</p>
                                    {expandedStep === step.step && step.desc && (
                                      <div className="mt-3 pt-3 border-t border-neutral-200">
                                        <p className="text-xs text-neutral-600 leading-relaxed">{step.desc[currentLang]}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                    <span className="bg-neutral-200 px-1.5 py-0.5 rounded text-xs">{step.from[currentLang]}</span>
                                    <ArrowRight size={10} />
                                    <span className="bg-neutral-200 px-1.5 py-0.5 rounded text-xs">{step.to[currentLang]}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
      {/* Standard Treatments Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-brand-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-600 text-xs tracking-widest uppercase font-bold">Standard Treatment</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mt-3 mb-4">
              {t('stdTitle')}
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              {t('stdDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {STANDARD_TREATMENTS.map((treatment) => {
              const Icon = treatment.icon;
              const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
                blue: { bg: 'bg-brand-50', text: 'text-brand-700', border: 'border-brand-200' },
                green: { bg: 'bg-brand-50', text: 'text-brand-600', border: 'border-brand-200' },
                purple: { bg: 'bg-brand-50', text: 'text-brand-600', border: 'border-brand-200' },
                orange: { bg: 'bg-gold-50', text: 'text-gold-600', border: 'border-gold-200' },
                red: { bg: 'bg-gold-50', text: 'text-gold-600', border: 'border-gold-200' },
              };
              const colors = colorClasses[treatment.color];
              return (
                <div
                  key={treatment.id}
                  className={`bg-white rounded-2xl p-8 border ${colors.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
                >
                  <div className={`w-14 h-14 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-brand-900 mb-4">{treatment.title[currentLang]}</h3>
                  <ul className="space-y-2 mb-4">
                    {treatment.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                        <CheckCircle size={14} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                        <span>{feature[currentLang]}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-neutral-500 text-sm leading-relaxed border-t border-neutral-100 pt-4">
                    {treatment.desc[currentLang]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Regenerative Medicine Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-600 text-xs tracking-widest uppercase font-bold">Regenerative Medicine</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mt-3 mb-4">
              {t('regenTitle')}
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              {t('regenDesc')}
            </p>
          </div>
          {/* Purpose Tags */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-bold">
              <HeartPulse size={16} />
              {t('regenRecovery')}
            </div>
            <div className="flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-bold">
              <Leaf size={16} />
              {t('regenHealth')}
            </div>
            <div className="flex items-center gap-2 bg-gold-100 text-gold-700 px-4 py-2 rounded-full text-sm font-bold">
              <Shield size={16} />
              {t('regenPrevention')}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {REGENERATIVE_TREATMENTS.map((treatment) => {
              const Icon = treatment.icon;
              const colorClasses: Record<string, { gradient: string; bg: string; text: string }> = {
                blue: { gradient: 'from-brand-600 to-brand-400', bg: 'bg-brand-50', text: 'text-brand-700' },
                purple: { gradient: 'from-brand-700 to-brand-500', bg: 'bg-brand-50', text: 'text-brand-600' },
                green: { gradient: 'from-brand-500 to-brand-400', bg: 'bg-brand-50', text: 'text-brand-600' },
              };
              const colors = colorClasses[treatment.color];
              return (
                <div key={treatment.id} className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-8 border border-neutral-100 hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon size={32} />
                  </div>
                  <div className={`inline-block ${colors.bg} ${colors.text} text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                    {treatment.purpose[currentLang]}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-brand-900 mb-1">{treatment.title[currentLang]}</h3>
                  <p className="text-neutral-400 text-sm mb-4">{treatment.subtitle}</p>
                  <ul className="space-y-2">
                    {treatment.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                        <CheckCircle size={14} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                        <span>{feature[currentLang]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Partner Institutions */}
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-800 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">{t('partnerTitle')}</h2>
            <p className="text-neutral-300">{t('partnerDesc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {PARTNER_INSTITUTIONS.map((inst, i) => {
              const Icon = inst.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="text-sm text-white/90">{inst.label[currentLang]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Service / Contact Section - hidden in guide embed mode */}
      {!isGuideEmbed && (<>
      <section id="contact-form" className="py-24 bg-gradient-to-br from-brand-50 to-gold-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-brand-700 text-xs tracking-widest uppercase font-bold">Book Service</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mt-3 mb-4">
                {t('svcTitle')}
              </h2>
              <p className="text-neutral-500 mb-4">
                {t('svcDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Service Card 1: Initial Consultation */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 hover:shadow-2xl transition-all group">
                <div className="bg-gradient-to-r from-brand-700 to-brand-800 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{CONSULTATION_SERVICES.initial.name[currentLang]}</h3>
                      <p className="text-brand-200 text-sm">{CONSULTATION_SERVICES.initial.nameEn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">¥{CONSULTATION_SERVICES.initial.price.toLocaleString()}</p>
                      <p className="text-xs text-brand-200">{t('svcTaxIncl')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-neutral-600 text-sm mb-6">{CONSULTATION_SERVICES.initial.description[currentLang]}</p>
                  <ul className="space-y-2 mb-6 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcInitial1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcInitial2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcInitial3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcInitial4')}</span>
                    </li>
                  </ul>
                  <Link
                    href={guideSlug ? `/cancer-treatment/initial-consultation?guide=${guideSlug}` : '/cancer-treatment/initial-consultation'}
                    className="block w-full py-3 bg-gradient-to-r from-brand-700 to-brand-800 text-white text-center font-bold rounded-xl hover:from-brand-800 hover:to-brand-900 transition shadow-lg"
                  >
                    {t('svcBookNow')}
                  </Link>
                </div>
              </div>
              {/* Service Card 2: Remote Consultation */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 hover:shadow-2xl transition-all group">
                <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{CONSULTATION_SERVICES.remote.name[currentLang]}</h3>
                      <p className="text-brand-200 text-sm">{CONSULTATION_SERVICES.remote.nameEn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">¥{CONSULTATION_SERVICES.remote.price.toLocaleString()}</p>
                      <p className="text-xs text-brand-200">{t('svcTaxIncl')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-neutral-600 text-sm mb-6">{CONSULTATION_SERVICES.remote.description[currentLang]}</p>
                  <ul className="space-y-2 mb-6 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcRemote1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcRemote2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcRemote3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcRemote4')}</span>
                    </li>
                  </ul>
                  <Link
                    href={guideSlug ? `/cancer-treatment/remote-consultation?guide=${guideSlug}` : '/cancer-treatment/remote-consultation'}
                    className="block w-full py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-center font-bold rounded-xl hover:from-brand-700 hover:to-brand-800 transition shadow-lg"
                  >
                    {t('svcBookNow')}
                  </Link>
                </div>
              </div>
            </div>
            {/* Member System Notice */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-brand-700" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-900 mb-2">{t('memberTitle')}</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {t('memberDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Medical Disclaimer */}
      <div className="bg-neutral-50 border-t border-neutral-200 py-8">
        <div className="container mx-auto px-6">
          <p className="text-xs text-neutral-400 leading-relaxed max-w-4xl mx-auto text-center">
            {t('medicalDisclaimer')}
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-4xl mx-auto text-center mt-2">
            <a href="/legal/medical-disclaimer" className="underline hover:text-neutral-600">{currentLang === 'ja' ? '医療免責事項の詳細' : currentLang === 'en' ? 'Medical Disclaimer Details' : '醫療免責聲明詳情'}</a>
            {' | '}
            <a href="/legal/tokushoho" className="underline hover:text-neutral-600">{currentLang === 'ja' ? '特定商取引法に基づく表記' : currentLang === 'en' ? 'Specified Commercial Transactions' : '特定商取引法標示'}</a>
            {' | '}
            <a href="/legal/privacy" className="underline hover:text-neutral-600">{currentLang === 'ja' ? 'プライバシーポリシー' : currentLang === 'en' ? 'Privacy Policy' : '隱私政策'}</a>
          </p>
        </div>
      </div>
      {/* Back to Home */}
      <div className="py-8 bg-white text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition"
        >
          <ArrowLeft size={16} />
          {t('backHome')}
        </Link>
      </div>
      {/* WeChat QR Modal */}
      {showWechatQR && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowWechatQR(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWechatQR(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-16 h-16 bg-[#07C160] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-brand-900 mb-2">{t('wechatTitle')}</h3>
            <p className="text-neutral-500 text-sm mb-6">{t('wechatScan')}</p>
            <div className="bg-neutral-50 rounded-xl p-4 mb-4">
              <Image
                src="https://i.ibb.co/3yBrDKW5/wechat-qr.jpg"
                alt="WeChat QR Code"
                width={192}
                height={192}
                quality={75}
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-xs text-neutral-400">
              {t('wechatNote')}
            </p>
          </div>
        </div>
      )}
      </>)}
    </>
  );
}
