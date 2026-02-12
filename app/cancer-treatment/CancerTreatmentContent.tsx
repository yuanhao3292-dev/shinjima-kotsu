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
  heroTitle2: { ja: '5年生存率世界トップ', 'zh-TW': '五年存活率領先全球', 'zh-CN': '五年存活率领先全球', en: '5-Year Survival Rate Leads Globally' } as Record<Language, string>,
  heroStat: { ja: 'Lancet研究によると日本のがん5年生存率は', 'zh-TW': '柳葉刀研究顯示日本癌症五年存活率達', 'zh-CN': '柳叶刀研究显示日本癌症五年存活率达', en: 'Lancet research shows Japan cancer 5-year survival rate reaches' } as Record<Language, string>,
  heroDesc: { ja: '陽子線・重粒子線、光免疫療法、BNCT——世界最先端の治療法が日本に集結', 'zh-TW': '質子重離子、光免疫療法、BNCT 硼中子俘獲——世界前沿療法匯聚日本', 'zh-CN': '质子重离子、光免疫疗法、BNCT 硼中子俘获——世界前沿疗法汇聚日本', en: 'Proton/Heavy Ion, Photoimmunotherapy, BNCT — Cutting-edge treatments converge in Japan' } as Record<Language, string>,
  heroCTA: { ja: '治療プランを相談', 'zh-TW': '諮詢治療方案', 'zh-CN': '咨询治疗方案', en: 'Consult Treatment Plan' } as Record<Language, string>,
  heroFlow: { ja: '治療の流れを見る', 'zh-TW': '了解治療流程', 'zh-CN': '了解治疗流程', en: 'View Treatment Process' } as Record<Language, string>,
  heroLimit: { ja: '治療品質確保のため、月10名様限定', 'zh-TW': '為保證治療品質，每月僅限 10 位患者接診', 'zh-CN': '为保证治疗品质，每月仅限 10 位患者接诊', en: 'Limited to 10 patients per month to ensure quality' } as Record<Language, string>,
  statGastric: { ja: '胃がん5年生存率', 'zh-TW': '胃癌五年存活率', 'zh-CN': '胃癌五年存活率', en: 'Gastric Cancer 5-Year Survival' } as Record<Language, string>,
  statProstate: { ja: '前立腺がん陽子線治療', 'zh-TW': '前列腺癌質子治療', 'zh-CN': '前列腺癌质子治疗', en: 'Prostate Cancer Proton Therapy' } as Record<Language, string>,
  statProstateSub: { ja: '5年生存率*', 'zh-TW': '五年存活率*', 'zh-CN': '五年存活率*', en: '5-Year Survival*' } as Record<Language, string>,
  statCost: { ja: '費用は米国の', 'zh-TW': '費用僅為美國', 'zh-CN': '费用仅为美国', en: 'Cost Only 1/3 of US' } as Record<Language, string>,
  statCostSub: { ja: '参考概算', 'zh-TW': '參考估算', 'zh-CN': '参考估算', en: 'Reference Estimate' } as Record<Language, string>,
  dataSource: { ja: '*データ出典：Lancet Oncology 2018; 各医療機関公開資料。個人の治療効果は症状により異なります。参考情報としてご利用ください。', 'zh-TW': '*數據來源：Lancet Oncology 2018; 各醫療機構公開資料。個人療效因病情而異，僅供參考。', 'zh-CN': '*数据来源：Lancet Oncology 2018; 各医疗机构公开资料。个人疗效因病情而异，仅供参考。', en: '*Data source: Lancet Oncology 2018; public data from medical institutions. Individual results vary.' } as Record<Language, string>,
  trustEarly: { ja: '超早期精密スクリーニング、5mm腫瘍検出可能', 'zh-TW': '超早期精密篩查，5mm 腫瘤可檢出', 'zh-CN': '超早期精密筛查，5mm 肿瘤可检出', en: 'Ultra-early screening, 5mm tumors detectable' } as Record<Language, string>,
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
  stdDesc: { ja: '高い安全性、精密な治療、QOL重視、EBMと多職種連携を強調', 'zh-TW': '安全性高、治療精準、重視生活質量（QOL）、強調循證醫學與多學科協作', 'zh-CN': '安全性高、治疗精准、重视生活质量（QOL）、强调循证医学与多学科协作', en: 'High safety, precision treatment, QOL-focused, evidence-based multidisciplinary approach' } as Record<Language, string>,
  // Regenerative Section
  regenTitle: { ja: '再生医療等の補助治療', 'zh-TW': '再生醫療等輔助治療', 'zh-CN': '再生医疗等辅助治疗', en: 'Regenerative Medicine & Supportive Treatments' } as Record<Language, string>,
  regenDesc: { ja: '最新の再生医療技術で身体回復と再発予防をサポート', 'zh-TW': '結合最新再生醫療技術，幫助患者身體恢復並預防癌症復發', 'zh-CN': '结合最新再生医疗技术，帮助患者身体恢复并预防癌症复发', en: 'Supporting recovery and recurrence prevention with regenerative medicine' } as Record<Language, string>,
  regenRecovery: { ja: '身体回復', 'zh-TW': '身體恢復', 'zh-CN': '身体恢复', en: 'Body Recovery' } as Record<Language, string>,
  regenHealth: { ja: '長期健康管理', 'zh-TW': '長期健康管理', 'zh-CN': '长期健康管理', en: 'Long-term Health' } as Record<Language, string>,
  regenPrevention: { ja: '再発予防', 'zh-TW': '預防復發', 'zh-CN': '预防复发', en: 'Recurrence Prevention' } as Record<Language, string>,
  // Partner Section
  partnerTitle: { ja: '相談可能な医療機関タイプ', 'zh-TW': '可協助諮詢的醫療機構類型', 'zh-CN': '可协助咨询的医疗机构类型', en: 'Types of Partner Medical Institutions' } as Record<Language, string>,
  partnerDesc: { ja: '日本各種トップクラスのがん治療施設を網羅', 'zh-TW': '涵蓋日本各類頂尖癌症治療設施', 'zh-CN': '涵盖日本各类顶尖癌症治疗设施', en: 'Covering top cancer treatment facilities across Japan' } as Record<Language, string>,
  // Service Section
  svcTitle: { ja: 'サービスご予約', 'zh-TW': '諮詢服務預約', 'zh-CN': '咨询服务预约', en: 'Book Consultation Service' } as Record<Language, string>,
  svcDesc: { ja: 'ご希望のサービスを選択し、お支払い後24時間以内にご連絡いたします', 'zh-TW': '選擇您需要的服務，在線支付後我們將在 24 小時內與您聯繫', 'zh-CN': '选择您需要的服务，在线支付后我们将在 24 小时内与您联系', en: 'Select your service, we will contact you within 24 hours after payment' } as Record<Language, string>,
  svcLimit: { ja: '月10名様限定・残りわずか', 'zh-TW': '每月僅限 10 位 · 名額有限', 'zh-CN': '每月仅限 10 位 · 名额有限', en: 'Limited to 10/month · Spots available' } as Record<Language, string>,
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
  blue:   { bg: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-600',   text: 'text-blue-600',   ring: 'ring-blue-200' },
  purple: { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-600', text: 'text-purple-600', ring: 'ring-purple-200' },
  amber:  { bg: 'bg-amber-500',  light: 'bg-amber-50',  border: 'border-amber-500',  text: 'text-amber-600',  ring: 'ring-amber-200' },
  green:  { bg: 'bg-green-600',  light: 'bg-green-50',  border: 'border-green-600',  text: 'text-green-600',  ring: 'ring-green-200' },
};
const PHASE_GRADIENT_MAP: Record<PhaseColor, string> = {
  blue:   'from-blue-600 to-blue-700',
  purple: 'from-purple-600 to-purple-700',
  amber:  'from-amber-500 to-amber-600',
  green:  'from-green-600 to-green-700',
};
const PHASE_LIGHT_BG_MAP: Record<PhaseColor, string> = {
  blue:   'bg-blue-50 border-blue-100',
  purple: 'bg-purple-50 border-purple-100',
  amber:  'bg-amber-50 border-amber-100',
  green:  'bg-green-50 border-green-100',
};
const PHASE_DOT_MAP: Record<PhaseColor, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
};

// 標準治療方式
const STANDARD_TREATMENTS = [
  {
    id: 'surgery',
    icon: Stethoscope,
    title: { ja: '手術', 'zh-TW': '手術', 'zh-CN': '手术', en: 'Surgery' } as Record<Language, string>,
    color: 'blue',
    features: [
      { ja: '創傷が小さく、回復が早く、安全性が高い', 'zh-TW': '創傷小、恢復快、安全性高', 'zh-CN': '创伤小、恢复快、安全性高', en: 'Minimally invasive, fast recovery, high safety' } as Record<Language, string>,
      { ja: '生存率だけでなく、術後のQOLを重視', 'zh-TW': '不僅追求生存率，更重視術後生活質量', 'zh-CN': '不仅追求生存率，更重视术后生活质量', en: 'Prioritizes post-surgery quality of life' } as Record<Language, string>,
      { ja: '食事・排尿・会話等の機能保護', 'zh-TW': '進食、排尿、說話等功能保護', 'zh-CN': '进食、排尿、说话等功能保护', en: 'Protects eating, urinary, speech functions' } as Record<Language, string>,
    ],
    desc: { ja: '日本の低侵襲手術技術は世界をリードし、治癒を追求しながら最大限にQOLを保護します。', 'zh-TW': '日本微創手術技術世界領先，在追求治癒的同時最大限度保護患者的生活質量。', 'zh-CN': '日本微创手术技术世界领先，在追求治愈的同时最大限度保护患者的生活质量。', en: 'Japan leads in minimally invasive surgery, maximizing quality of life while pursuing cure.' } as Record<Language, string>,
  },
  {
    id: 'chemo',
    icon: Pill,
    title: { ja: '化学療法', 'zh-TW': '化學治療', 'zh-CN': '化学治疗', en: 'Chemotherapy' } as Record<Language, string>,
    color: 'green',
    features: [
      { ja: '患者の年齢・体力・合併症に応じて投与量を調整', 'zh-TW': '根據患者年齡、體力、合併症調整劑量', 'zh-CN': '根据患者年龄、体力、合并症调整剂量', en: 'Dosage adjusted for age, fitness, comorbidities' } as Record<Language, string>,
      { ja: '副作用管理が非常にきめ細かい', 'zh-TW': '副作用管理非常細緻', 'zh-CN': '副作用管理非常细致', en: 'Meticulous side effect management' } as Record<Language, string>,
      { ja: '高齢患者や慢性腫瘍患者に最適', 'zh-TW': '適合高齡患者、慢性腫瘤患者', 'zh-CN': '适合高龄患者、慢性肿瘤患者', en: 'Suitable for elderly and chronic tumor patients' } as Record<Language, string>,
    ],
    desc: { ja: '最大投与量を追求せず、個体差に基づき最適な方案を策定し、副作用を最小限に抑えます。', 'zh-TW': '不一味追求最大劑量，而是根據個體差異制定最適合的方案，把副作用降到最低。', 'zh-CN': '不一味追求最大剂量，而是根据个体差异制定最适合的方案，把副作用降到最低。', en: 'Optimized for individual differences, minimizing side effects rather than maximizing dosage.' } as Record<Language, string>,
  },
  {
    id: 'radiation',
    icon: Radio,
    title: { ja: '放射線治療', 'zh-TW': '放射線治療', 'zh-CN': '放射线治疗', en: 'Radiation Therapy' } as Record<Language, string>,
    color: 'purple',
    features: [
      { ja: '陽子線・重粒子線治療で世界をリード', 'zh-TW': '陽子線、重離子線治療世界領先', 'zh-CN': '质子线、重离子线治疗世界领先', en: 'World-leading proton and heavy ion therapy' } as Record<Language, string>,
      { ja: '定位放射線治療技術が成熟', 'zh-TW': '立體定向放射治療技術成熟', 'zh-CN': '立体定向放射治疗技术成熟', en: 'Mature stereotactic radiation technology' } as Record<Language, string>,
      { ja: '正常組織を最大限に保護し合併症を軽減', 'zh-TW': '最大限度保護正常組織，減少併發症', 'zh-CN': '最大限度保护正常组织，减少并发症', en: 'Maximum protection of normal tissue' } as Record<Language, string>,
    ],
    desc: { ja: '高精度放射線技術で腫瘍細胞を精確に攻撃し、周囲の正常組織への損傷を最小限に抑えます。', 'zh-TW': '高精度放射線技術可精準打擊腫瘤細胞，同時將對周圍正常組織的損傷降到最低。', 'zh-CN': '高精度放射线技术可精准打击肿瘤细胞，同时将对周围正常组织的损伤降到最低。', en: 'High-precision radiation precisely targets tumor cells while minimizing damage to surrounding tissue.' } as Record<Language, string>,
  },
  {
    id: 'immune',
    icon: Shield,
    title: { ja: '免疫療法', 'zh-TW': '免疫治療', 'zh-CN': '免疫治疗', en: 'Immunotherapy' } as Record<Language, string>,
    color: 'orange',
    features: [
      { ja: '適応症の厳格なスクリーニング', 'zh-TW': '嚴格篩選適應症', 'zh-CN': '严格筛选适应症', en: 'Strict indication screening' } as Record<Language, string>,
      { ja: '免疫関連有害事象に高度に警戒', 'zh-TW': '高度警惕免疫相關不良反應', 'zh-CN': '高度警惕免疫相关不良反应', en: 'Highly vigilant of immune-related adverse events' } as Record<Language, string>,
      { ja: '正常臓器への「誤爆」を最小限に', 'zh-TW': '把對正常器官的「誤傷」控制到最低', 'zh-CN': '把对正常器官的"误伤"控制到最低', en: 'Minimize "friendly fire" on normal organs' } as Record<Language, string>,
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
      { ja: '化学療法・放射線治療後の身体回復', 'zh-TW': '化療、放療後的身體恢復', 'zh-CN': '化疗、放疗后的身体恢复', en: 'Post-chemo/radiation body recovery' } as Record<Language, string>,
      { ja: '組織再生を促進', 'zh-TW': '促進組織再生', 'zh-CN': '促进组织再生', en: 'Promotes tissue regeneration' } as Record<Language, string>,
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
      { ja: '細胞修復を促進', 'zh-TW': '促進細胞修復', 'zh-CN': '促进细胞修复', en: 'Promotes cell repair' } as Record<Language, string>,
      { ja: '治療後の長期健康管理', 'zh-TW': '治療後的長期健康管理', 'zh-CN': '治疗后的长期健康管理', en: 'Long-term post-treatment health management' } as Record<Language, string>,
      { ja: 'アンチエイジングケア', 'zh-TW': '抗衰老調理', 'zh-CN': '抗衰老调理', en: 'Anti-aging care' } as Record<Language, string>,
    ],
  },
  {
    id: 'nk',
    icon: Shield,
    title: { ja: 'NK等免疫細胞', 'zh-TW': 'NK等免疫細胞', 'zh-CN': 'NK等免疫细胞', en: 'NK Immune Cells' } as Record<Language, string>,
    subtitle: 'NK Cell Therapy',
    purpose: { ja: '再発予防', 'zh-TW': '預防復發', 'zh-CN': '预防复发', en: 'Recurrence Prevention' } as Record<Language, string>,
    color: 'green',
    features: [
      { ja: '体の免疫機能を強化', 'zh-TW': '增強機體免疫功能', 'zh-CN': '增强机体免疫功能', en: 'Enhances immune function' } as Record<Language, string>,
      { ja: '抗腫瘍防御力を向上', 'zh-TW': '提高抗腫瘤防禦能力', 'zh-CN': '提高抗肿瘤防御能力', en: 'Improves anti-tumor defense' } as Record<Language, string>,
      { ja: 'がん再発を予防', 'zh-TW': '預防癌症復發', 'zh-CN': '预防癌症复发', en: 'Prevents cancer recurrence' } as Record<Language, string>,
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
// 日本知名癌症治療醫療機構介紹（純信息展示，非合作聲明）
// 關西地區優先置頂
const JAPAN_MEDICAL_INSTITUTIONS = [
  {
    category: '關西地區癌症專門醫院',
    color: 'red',
    institutions: [
      {
        name: '大阪国際がんセンター',
        nameZh: '大阪國際癌症中心',
        location: '大阪府大阪市中央區',
        website: 'https://oici.jp/',
        specialty: ['肺癌', '消化器癌', '乳癌', '血液腫瘤', '婦科腫瘤'],
        features: [
          '大阪府立癌症專門醫院（2017年新建）',
          '年間手術量超 5,000 例',
          '最先端癌症治療設備完備',
          '癌症基因組醫療核心拠點',
          '國際患者支援窗口',
        ],
        treatments: ['達芬奇機器人手術', '免疫治療', '基因靶向治療', '放射線治療'],
      },
      {
        name: '兵庫県立がんセンター',
        nameZh: '兵庫縣立癌症中心',
        location: '兵庫縣明石市',
        website: 'https://www.hyogo-cc.jp/',
        specialty: ['肺癌', '消化器癌', '乳癌', '頭頸部癌'],
        features: [
          '兵庫縣癌症治療核心醫院',
          '多學科協作治療體制',
          '緩和醫療充實',
          '臨床試驗積極參與',
        ],
        treatments: ['微創手術', '化學療法', '放射線治療', '緩和醫療'],
      },
      {
        name: '神戸大学医学部附属病院',
        nameZh: '神戶大學醫學部附屬醫院',
        location: '兵庫縣神戶市',
        website: 'https://www.hosp.kobe-u.ac.jp/',
        specialty: ['肝膽胰癌', '消化器癌', '乳癌', '血液腫瘤'],
        features: [
          '神戶醫療產業都市核心醫院',
          '肝膽胰外科日本領先',
          '先進醫療設備完備',
          '國際醫療交流活躍',
        ],
        treatments: ['高難度肝膽胰手術', '免疫治療', '基因組醫療'],
      },
      {
        name: '奈良県立医科大学附属病院',
        nameZh: '奈良縣立醫科大學附屬醫院',
        location: '奈良縣橿原市',
        website: 'https://www.naramed-u.ac.jp/hospital/',
        specialty: ['消化器癌', '肺癌', '婦科腫瘤', '血液腫瘤'],
        features: [
          '奈良縣唯一的特定機能醫院',
          '癌症診療連攜拠點醫院',
          '地域醫療支援完善',
          '多職種團隊醫療',
        ],
        treatments: ['腹腔鏡手術', '化學療法', '放射線治療'],
      },
      {
        name: '和歌山県立医科大学附属病院',
        nameZh: '和歌山縣立醫科大學附屬醫院',
        location: '和歌山縣和歌山市',
        website: 'https://www.wakayama-med.ac.jp/hospital/',
        specialty: ['消化器癌', '肺癌', '乳癌', '泌尿器癌'],
        features: [
          '和歌山縣癌症診療核心醫院',
          '內視鏡治療技術精湛',
          '癌症基因組醫療拠點',
          '緩和醫療團隊完備',
        ],
        treatments: ['內視鏡手術', '化學療法', '基因組醫療', '緩和醫療'],
      },
    ],
  },
  {
    category: '關西地區大學附屬醫院',
    color: 'green',
    institutions: [
      {
        name: '大阪大学医学部附属病院',
        nameZh: '大阪大學醫學部附屬醫院',
        location: '大阪府吹田市',
        website: 'https://www.hosp.med.osaka-u.ac.jp/',
        specialty: ['消化器癌', '血液腫瘤', '皮膚癌'],
        features: [
          '關西地區頂級醫療機構',
          '光免疫療法臨床研究領先',
          '幹細胞治療研究先驅',
        ],
        treatments: ['光免疫療法', '再生醫療', 'CAR-T 療法'],
      },
      {
        name: '京都大学医学部附属病院',
        nameZh: '京都大學醫學部附屬醫院',
        location: '京都府京都市',
        website: 'https://www.kuhp.kyoto-u.ac.jp/',
        specialty: ['血液腫瘤', '消化器癌', '腦腫瘤', '乳癌'],
        features: [
          'iPS 細胞研究發源地（山中伸彌教授）',
          '再生醫療世界領先',
          '癌症基因組醫療核心拠點',
          '關西醫學研究重鎮',
        ],
        treatments: ['iPS 細胞治療', '基因組醫療', 'CAR-T 療法', '免疫治療'],
      },
      {
        name: '近畿大学医学部附属病院',
        nameZh: '近畿大學醫學部附屬醫院',
        location: '大阪府大阪狹山市',
        website: 'https://www.med.kindai.ac.jp/',
        specialty: ['肝癌', '腎癌', '膀胱癌', '前列腺癌'],
        features: [
          '近大醫院（世界首創完全養殖黑鮪魚聞名）',
          '泌尿器科腫瘤治療強項',
          '達芬奇機器人手術經驗豐富',
          '癌症免疫治療研究活躍',
        ],
        treatments: ['達芬奇機器人手術', '免疫檢查點抑制劑', '精準放射治療'],
      },
    ],
  },
  {
    category: 'BNCT 硼中子俘獲治療（關西）',
    color: 'orange',
    institutions: [
      {
        name: '大阪医科薬科大学病院',
        nameZh: '大阪醫科藥科大學醫院',
        location: '大阪府高槻市',
        website: 'https://hospital.ompu.ac.jp/',
        specialty: ['頭頸部癌（復發）', '腦腫瘤', '惡性黑色素瘤'],
        features: [
          '全球首個醫院內設置 BNCT 設備',
          '對手術困難、復發癌症效果顯著',
          '單次照射即可完成治療',
        ],
        treatments: ['BNCT 硼中子俘獲治療'],
      },
    ],
  },
  {
    category: '重粒子線・質子線治療設施（關西）',
    color: 'purple',
    institutions: [
      {
        name: '兵庫県立粒子線医療センター',
        nameZh: '兵庫縣立粒子線醫療中心',
        location: '兵庫縣龍野市',
        website: 'https://www.hibmc.shingu.hyogo.jp/',
        specialty: ['肺癌', '肝癌', '前列腺癌', '胰臟癌'],
        features: [
          '全球首個同時擁有質子線和重粒子線的設施',
          '治療適應症最廣',
          '可根據癌症類型選擇最佳粒子線',
        ],
        treatments: ['質子線治療', '重粒子線治療'],
      },
    ],
  },
  {
    category: '國立癌症中心（東京）',
    color: 'blue',
    institutions: [
      {
        name: '国立がん研究センター中央病院',
        nameZh: '國立癌症研究中心中央醫院',
        location: '東京都中央區',
        website: 'https://www.ncc.go.jp/jp/ncch/',
        specialty: ['消化器癌', '肺癌', '乳癌', '血液腫瘤'],
        features: [
          '日本癌症研究最高學府',
          '年手術量超 8,000 例',
          '最新臨床試驗優先參與',
          '多學科團隊會診制度',
        ],
        treatments: ['達芬奇機器人手術', '免疫檢查點抑制劑', '基因靶向治療'],
      },
      {
        name: '国立がん研究センター東病院',
        nameZh: '國立癌症研究中心東醫院',
        location: '千葉縣柏市',
        website: 'https://www.ncc.go.jp/jp/ncce/',
        specialty: ['頭頸部癌', '食道癌', '肝膽胰癌'],
        features: [
          '質子線治療先驅',
          '頭頸部癌治療日本領先',
          '消化器內視鏡治療技術頂尖',
          '國際患者支援體制完善',
        ],
        treatments: ['質子線治療', '光免疫療法', '內視鏡黏膜下剝離術(ESD)'],
      },
    ],
  },
  {
    category: '首都圈大學附屬醫院',
    color: 'blue',
    institutions: [
      {
        name: '東京大学医学部附属病院',
        nameZh: '東京大學醫學部附屬醫院',
        location: '東京都文京區',
        website: 'https://www.h.u-tokyo.ac.jp/',
        specialty: ['全科癌症', '罕見癌症', '復發難治癌症'],
        features: [
          '日本醫學最高學府',
          '最新治療技術臨床應用',
          '疑難雜症診斷能力強',
        ],
        treatments: ['CAR-T 細胞療法', '精準醫療', '臨床試驗'],
      },
      {
        name: '慶應義塾大学病院',
        nameZh: '慶應義塾大學醫院',
        location: '東京都新宿區',
        website: 'https://www.hosp.keio.ac.jp/',
        specialty: ['肺癌', '消化器癌', '婦科腫瘤'],
        features: [
          '私立醫學名校附屬醫院',
          '腫瘤內科實力強勁',
          '國際患者接待經驗豐富',
        ],
        treatments: ['分子靶向治療', '免疫治療', '微創手術'],
      },
    ],
  },
  {
    category: '其他地區先進設施',
    color: 'purple',
    institutions: [
      {
        name: '量子科学技術研究開発機構 QST病院',
        nameZh: 'QST醫院（原放醫研）',
        location: '千葉縣千葉市',
        website: 'https://www.qst.go.jp/',
        specialty: ['骨軟部肉瘤', '頭頸部癌', '前列腺癌', '肝癌'],
        features: [
          '世界重粒子線治療發源地',
          '治療經驗超 14,000 例',
          '對放射線抵抗性癌症效果顯著',
          '短療程（約 3-4 週）',
        ],
        treatments: ['重粒子線治療（碳離子線）'],
      },
      {
        name: '静岡県立静岡がんセンター',
        nameZh: '靜岡縣立靜岡癌症中心',
        location: '靜岡縣長泉町',
        website: 'https://www.scchr.jp/',
        specialty: ['肺癌', '食道癌', '縱隔腫瘤'],
        features: [
          '質子線治療經驗豐富',
          '環境優美，康復氛圍佳',
          '多學科整合治療',
        ],
        treatments: ['質子線治療', '立體定向放射治療'],
      },
      {
        name: '南東北BNCT研究センター',
        nameZh: '南東北BNCT研究中心',
        location: '福島縣郡山市',
        website: 'https://www.southerntohoku-bnct.com/',
        specialty: ['頭頸部癌', '腦腫瘤', '惡性黑色素瘤'],
        features: [
          'BNCT 治療先驅機構',
          '加速器型 BNCT 治療系統',
          '無需核反應爐，安全性高',
        ],
        treatments: ['BNCT 硼中子俘獲治療'],
      },
    ],
  },
];
// ============================================================================
// 繁简转换配置（模块级缓存，避免每次渲染重新创建）
// ============================================================================
const TRAD_TO_SIMP_MAP: Record<string, string> = {
  '癌症': '癌症', '專門': '专门', '醫院': '医院', '醫療': '医疗', '機構': '机构',
  '國際': '国际', '縣': '县', '區': '区', '醫學': '医学', '療法': '疗法',
  '檢查': '检查', '診斷': '诊断', '診療': '诊疗', '診所': '诊所', '瘤': '瘤',
  '癥': '症', '臟': '脏', '體': '体', '質': '质', '離': '离', '線': '线',
  '藥': '药', '劑': '剂', '標': '标', '靶': '靶', '測': '测', '設': '设',
  '備': '备', '極': '极', '優': '优', '據': '据', '點': '点', '關': '关',
  '協': '协', '産': '产', '從': '从', '後': '后', '術': '术', '達': '达',
  '過': '过', '進': '进', '遠': '远', '還': '还', '這': '这', '個': '个',
  '專': '专', '為': '为', '與': '与', '業': '业', '義': '义', '開': '开',
  '際': '际', '復': '复', '發': '发', '當': '当', '護': '护',
  '細': '细', '組': '组', '織': '织', '導': '导', '團': '团', '難': '难',
  '類': '类', '約': '约', '經': '经', '緻': '致', '續': '续', '總': '总',
  '網': '网', '綫': '线', '給': '给', '統': '统', '維': '维', '縮': '缩',
  '積': '积', '穩': '稳', '築': '筑', '籤': '签',
  '籍': '籍', '糧': '粮', '紀': '纪', '紅': '红', '紙': '纸',
  '級': '级', '純': '纯', '紮': '扎', '納': '纳', '紛': '纷', '紹': '绍',
  '絡': '络', '綜': '综', '綠': '绿', '緊': '紧', '緣': '缘',
  '練': '练', '縱': '纵', '繁': '繁', '纖': '纤',
  '績': '绩', '繪': '绘', '繼': '继',
  '罐': '罐', '羅': '罗', '羣': '群', '習': '习',
  '膽': '胆', '臨': '临', '膜': '膜', '脈': '脉', '腦': '脑', '腸': '肠',
  '膀': '膀', '腎': '肾', '腺': '腺', '臓': '脏', '膚': '肤',
};

/**
 * 高性能繁简转换函数（O(n) 复杂度）
 *
 * 性能对比：
 * - 原实现：O(n × m)，50字符 × 100映射 = 5000次操作
 * - 新实现：O(n)，50字符 = 50次操作
 * - 性能提升：100倍
 *
 * @param text 繁体中文文本
 * @returns 简体中文文本
 */
function convertToSimplified(text: string): string {
  if (!text) return text;

  // 使用单次遍历的字符映射，复杂度为 O(n)
  // 避免使用正则表达式和多次字符串替换
  return Array.from(text)
    .map(char => TRAD_TO_SIMP_MAP[char] || char)
    .join('');
}

interface CancerTreatmentContentProps {
  isGuideEmbed?: boolean;
}

export default function CancerTreatmentContent({ isGuideEmbed }: CancerTreatmentContentProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState<number>(1);
  const [showWechatQR, setShowWechatQR] = useState(false);
  const currentLang = useLanguage();

  // 使用 useMemo 缓存本地化文本函数，避免每次渲染重新创建
  const getLocalizedText = React.useMemo(() => {
    return (text: string | string[]): string | string[] => {
      if (currentLang !== 'zh-CN') return text;
      if (Array.isArray(text)) {
        return text.map(t => convertToSimplified(t));
      }
      return convertToSimplified(text);
    };
  }, [currentLang]);
  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][currentLang];
  return (
    <>
      {/* Hero Section - hide in guide embed mode */}
      {!isGuideEmbed && (
      <div className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1587010580103-fd86b8ea14ca?q=80&w=2080&auto=format&fit=crop')`,
          }}
        >
          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/85 to-slate-900/70"></div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
          <div className="absolute w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <HeartPulse size={16} className="text-red-400" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{t('heroBadge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {t('heroTitle1')}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">{t('heroTitle2')}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4 leading-relaxed max-w-2xl">
              {t('heroStat')} <span className="text-white font-bold">57.4%</span>
            </p>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl">
              {t('heroDesc')}
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <MessageSquare size={20} />
                {t('heroCTA')}
                <ArrowRight size={18} />
              </a>
              <a
                href="#treatment-flow"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                {t('heroFlow')}
              </a>
            </div>
            {/* 限量營銷文案 */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 px-5 py-3 rounded-full backdrop-blur-md mb-12">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-amber-200 text-sm font-medium">{t('heroLimit')}</span>
            </div>
            {/* Key Stats - Data Driven */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">74.9%</div>
                <div className="text-sm text-gray-300">{t('statGastric')}</div>
                <div className="text-xs text-gray-400 mt-1">Lancet 2018*</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">95%+</div>
                <div className="text-sm text-gray-300">{t('statProstate')}</div>
                <div className="text-xs text-gray-400 mt-1">{t('statProstateSub')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">1/3</div>
                <div className="text-sm text-gray-300">{t('statCost')}</div>
                <div className="text-xs text-gray-400 mt-1">{t('statCostSub')}</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">{t('dataSource')}</p>
            {/* Trust Points */}
            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">{t('trustEarly')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">{t('trustTranslator')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">{t('trustRemote')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
      {/* Japan Medical Institutions Introduction - 關西優先置頂 */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 text-xs tracking-widest uppercase font-bold">Japan Medical Institutions</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              {t('instTitle')}
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto mb-6">
              {t('instDesc')}
            </p>
            {/* 免責聲明 */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg text-sm text-amber-700">
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
                  headerBg: 'bg-blue-600',
                  headerText: 'text-white',
                  cardBorder: 'border-blue-200',
                  badge: 'bg-blue-100 text-blue-700',
                  tagBg: 'bg-blue-50',
                  tagText: 'text-blue-600',
                },
                purple: {
                  headerBg: 'bg-purple-600',
                  headerText: 'text-white',
                  cardBorder: 'border-purple-200',
                  badge: 'bg-purple-100 text-purple-700',
                  tagBg: 'bg-purple-50',
                  tagText: 'text-purple-600',
                },
                green: {
                  headerBg: 'bg-green-600',
                  headerText: 'text-white',
                  cardBorder: 'border-green-200',
                  badge: 'bg-green-100 text-green-700',
                  tagBg: 'bg-green-50',
                  tagText: 'text-green-600',
                },
                orange: {
                  headerBg: 'bg-orange-600',
                  headerText: 'text-white',
                  cardBorder: 'border-orange-200',
                  badge: 'bg-orange-100 text-orange-700',
                  tagBg: 'bg-orange-50',
                  tagText: 'text-orange-600',
                },
                red: {
                  headerBg: 'bg-red-600',
                  headerText: 'text-white',
                  cardBorder: 'border-red-200',
                  badge: 'bg-red-100 text-red-700',
                  tagBg: 'bg-red-50',
                  tagText: 'text-red-600',
                },
              };
              const colors = colorClasses[category.color];
              return (
                <div key={catIndex}>
                  {/* Category Header */}
                  <div className={`${colors.headerBg} ${colors.headerText} px-6 py-4 rounded-t-2xl flex items-center gap-3`}>
                    <Award size={24} />
                    <h3 className="text-xl font-bold">{category.category}</h3>
                  </div>
                  {/* Institutions Grid */}
                  <div className={`bg-white border-2 ${colors.cardBorder} border-t-0 rounded-b-2xl p-6`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {category.institutions.map((inst, instIndex) => (
                        <div
                          key={instIndex}
                          className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                        >
                          {/* Hospital Name */}
                          <div className="mb-4">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{inst.name}</h4>
                            <p className="text-sm text-gray-500">{getLocalizedText(inst.nameZh)}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                              <MapPin size={12} />
                              {getLocalizedText(inst.location)}
                            </div>
                          </div>
                          {/* Specialty Tags */}
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">{t('instSpecialty')}</p>
                            <div className="flex flex-wrap gap-1">
                              {(getLocalizedText(inst.specialty) as string[]).map((spec, i) => (
                                <span key={i} className={`${colors.badge} text-xs px-2 py-1 rounded-full`}>
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* Features */}
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">{t('instFeatures')}</p>
                            <ul className="space-y-1">
                              {(getLocalizedText(inst.features) as string[]).map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                  <CheckCircle size={14} className={`${colors.tagText} mt-0.5 flex-shrink-0`} />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Treatments */}
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">{t('instTreatments')}</p>
                            <div className="flex flex-wrap gap-1">
                              {(getLocalizedText(inst.treatments) as string[]).map((treatment, i) => (
                                <span key={i} className={`${colors.tagBg} ${colors.tagText} text-xs px-2 py-1 rounded border border-current/20`}>
                                  {treatment}
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
                              className={`inline-flex items-center gap-1.5 text-xs ${colors.tagText} hover:underline mt-2 pt-3 border-t border-gray-200`}
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
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
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
            <span className="text-blue-600 text-xs tracking-widest uppercase font-bold">Treatment Process</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              {t('flowTitle')}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
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
                        : 'bg-gray-50 border border-gray-200 hover:shadow-sm hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? c.bg : 'bg-gray-200'}`}>
                        <PhaseIcon size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                      </div>
                      <span className={`text-xs font-bold ${isActive ? c.text : 'text-gray-400'}`}>
                        PHASE {phase.phaseNumber}
                      </span>
                    </div>
                    <h3 className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                      {phase.title[currentLang]}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {phase.duration[currentLang]}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">{t('flowClickPhase')}</p>
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
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
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
                          <Users size={18} className="text-gray-600" />
                          <h4 className="font-bold text-gray-900 text-sm">{t('flowYouDo')}</h4>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.patientActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{action[currentLang]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* We Handle */}
                      <div className="rounded-xl p-5 border bg-gray-50 border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield size={18} className="text-gray-600" />
                          <h4 className="font-bold text-gray-900 text-sm">{t('flowWeHandle')}</h4>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.weHandle.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                              <span>{item[currentLang]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Sub-step Timeline */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
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
                                expandedStep === step.step ? 'bg-white shadow-md border-gray-200' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-sm'
                              }`}>
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="text-sm font-bold text-gray-900">{step.title[currentLang]}</h5>
                                      {step.fee && (
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                          ¥{step.fee}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500">{step.subtitle[currentLang]}</p>
                                    {expandedStep === step.step && step.desc && (
                                      <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-xs text-gray-600 leading-relaxed">{step.desc[currentLang]}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">{step.from[currentLang]}</span>
                                    <ArrowRight size={10} />
                                    <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">{step.to[currentLang]}</span>
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
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-purple-600 text-xs tracking-widest uppercase font-bold">Standard Treatment</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              {t('stdTitle')}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t('stdDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {STANDARD_TREATMENTS.map((treatment) => {
              const Icon = treatment.icon;
              const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
                blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
                green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
                purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
                orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
                red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
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
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">{treatment.title[currentLang]}</h3>
                  <ul className="space-y-2 mb-4">
                    {treatment.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                        <span>{feature[currentLang]}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
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
            <span className="text-green-600 text-xs tracking-widest uppercase font-bold">Regenerative Medicine</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              {t('regenTitle')}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t('regenDesc')}
            </p>
          </div>
          {/* Purpose Tags */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
              <HeartPulse size={16} />
              {t('regenRecovery')}
            </div>
            <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold">
              <Leaf size={16} />
              {t('regenHealth')}
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
              <Shield size={16} />
              {t('regenPrevention')}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {REGENERATIVE_TREATMENTS.map((treatment) => {
              const Icon = treatment.icon;
              const colorClasses: Record<string, { gradient: string; bg: string; text: string }> = {
                blue: { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600' },
                purple: { gradient: 'from-purple-500 to-pink-600', bg: 'bg-purple-50', text: 'text-purple-600' },
                green: { gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50', text: 'text-green-600' },
              };
              const colors = colorClasses[treatment.color];
              return (
                <div key={treatment.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon size={32} />
                  </div>
                  <div className={`inline-block ${colors.bg} ${colors.text} text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                    {treatment.purpose[currentLang]}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">{treatment.title[currentLang]}</h3>
                  <p className="text-gray-400 text-sm mb-4">{treatment.subtitle}</p>
                  <ul className="space-y-2">
                    {treatment.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
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
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">{t('partnerTitle')}</h2>
            <p className="text-gray-300">{t('partnerDesc')}</p>
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
      <section id="contact-form" className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-blue-600 text-xs tracking-widest uppercase font-bold">Book Service</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
                {t('svcTitle')}
              </h2>
              <p className="text-gray-500 mb-4">
                {t('svcDesc')}
              </p>
              {/* 限量提示 */}
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-amber-700 text-sm">{t('svcLimit')}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Service Card 1: Initial Consultation */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{CONSULTATION_SERVICES.initial.name[currentLang]}</h3>
                      <p className="text-blue-200 text-sm">{CONSULTATION_SERVICES.initial.nameEn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">¥{CONSULTATION_SERVICES.initial.price.toLocaleString()}</p>
                      <p className="text-xs text-blue-200">{t('svcTaxIncl')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6">{CONSULTATION_SERVICES.initial.description[currentLang]}</p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcInitial1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcInitial2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcInitial3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcInitial4')}</span>
                    </li>
                  </ul>
                  <Link
                    href="/cancer-treatment/initial-consultation"
                    className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center font-bold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition shadow-lg"
                  >
                    {t('svcBookNow')}
                  </Link>
                </div>
              </div>
              {/* Service Card 2: Remote Consultation */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group">
                <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{CONSULTATION_SERVICES.remote.name[currentLang]}</h3>
                      <p className="text-purple-200 text-sm">{CONSULTATION_SERVICES.remote.nameEn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">¥{CONSULTATION_SERVICES.remote.price.toLocaleString()}</p>
                      <p className="text-xs text-purple-200">{t('svcTaxIncl')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6">{CONSULTATION_SERVICES.remote.description[currentLang]}</p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcRemote1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcRemote2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcRemote3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{t('svcRemote4')}</span>
                    </li>
                  </ul>
                  <Link
                    href="/cancer-treatment/remote-consultation"
                    className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white text-center font-bold rounded-xl hover:from-purple-700 hover:to-pink-800 transition shadow-lg"
                  >
                    {t('svcBookNow')}
                  </Link>
                </div>
              </div>
            </div>
            {/* Member System Notice */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{t('memberTitle')}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('memberDesc')}
                  </p>
                </div>
              </div>
            </div>
            {/* Contact Methods - For inquiries only */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-600" />
                {t('contactTitle')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="https://line.me/ti/p/j3XxBP50j9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#06C755] text-white p-3 rounded-xl hover:bg-[#05b04c] transition text-sm"
                >
                  <MessageSquare size={18} />
                  <span className="font-bold">{t('contactLine')}</span>
                </a>
                <a
                  href="mailto:info@niijima-koutsu.jp"
                  className="flex items-center gap-3 bg-gray-800 text-white p-3 rounded-xl hover:bg-gray-700 transition text-sm"
                >
                  <Mail size={18} />
                  <span className="font-bold">{t('contactEmail')}</span>
                </a>
                <button
                  onClick={() => setShowWechatQR(true)}
                  className="flex items-center gap-3 bg-[#07C160] text-white p-3 rounded-xl hover:bg-[#06ad56] transition text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
                  </svg>
                  <span className="font-bold">{t('contactWechat')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Back to Home */}
      <div className="py-8 bg-white text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
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
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('wechatTitle')}</h3>
            <p className="text-gray-500 text-sm mb-6">{t('wechatScan')}</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <Image
                src="https://i.ibb.co/3yBrDKW5/wechat-qr.jpg"
                alt="WeChat QR Code"
                width={192}
                height={192}
                quality={75}
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-xs text-gray-400">
              {t('wechatNote')}
            </p>
          </div>
        </div>
      )}
      </>)}
    </>
  );
}
