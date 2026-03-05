'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, ChevronDown, ChevronUp,
  Shield, Zap, Target, CheckCircle, ArrowRight,
  Activity, Users, Award, Building2, Globe,
  Heart, Brain, Microscope, HelpCircle, Mail,
  Calendar, FileText, Stethoscope, Sparkles, Train,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// ======================================
// Hero image export (white-label mapping)
// ======================================
export const OSAKA_HIMAK_HERO_IMAGE =
  'https://www.osaka-himak.or.jp/cn/images/top/sec_slide01_mv_img01_pc.jpg';

// ======================================
// Official image URLs
// ======================================
const IMG = {
  hero1: 'https://www.osaka-himak.or.jp/cn/images/top/sec_slide01_mv_img01_pc.jpg',
  hero2: 'https://www.osaka-himak.or.jp/cn/images/top/sec_slide02_mv_img01_pc.jpg',
  hero3: 'https://www.osaka-himak.or.jp/cn/images/top/sec_slide03_mv_img01_pc.jpg',
  hero4: 'https://www.osaka-himak.or.jp/cn/images/top/sec_slide04_mv_img01_pc.jpg',
  logo: 'https://www.osaka-himak.or.jp/cn/images/common/site_logo.png',
};

// ======================================
// Multi-language translations
// ======================================
const t = {
  heroTag: { ja: '関西初の重粒子線がん治療', 'zh-TW': '關西首家重粒子線癌症治療', 'zh-CN': '关西首家重粒子线癌症治疗', en: 'Kansai\'s First Heavy Ion Therapy' } as Record<Language, string>,
  heroTitle: { ja: '大阪重粒子線センター', 'zh-TW': '大阪重粒子線中心', 'zh-CN': '大阪重粒子线中心', en: 'Osaka Heavy Ion Therapy Center' } as Record<Language, string>,
  heroSub: { ja: '立足大阪、面向全国、服务世界\n最先端のがん治療で、切らない・痛くない・体に優しい', 'zh-TW': '立足大阪、面向全國、服務世界\n最先進的癌症治療，無需開刀、沒有疼痛、對身體溫和', 'zh-CN': '立足大阪、面向全国、服务世界\n最先进的癌症治疗，无需开刀、没有疼痛、对身体温和', en: 'Based in Osaka, serving nationwide and globally\nCutting-edge cancer treatment — no surgery, painless, gentle on the body' } as Record<Language, string>,
  ctaConsult: { ja: '無料相談を予約する', 'zh-TW': '預約免費諮詢', 'zh-CN': '预约免费咨询', en: 'Book Free Consultation' } as Record<Language, string>,
  ctaLearn: { ja: '詳しく見る', 'zh-TW': '查看詳情', 'zh-CN': '查看详情', en: 'Learn More' } as Record<Language, string>,

  // Stats
  stat1: { ja: '世界最小型', 'zh-TW': '世界最小型', 'zh-CN': '世界最小型', en: 'World\'s Smallest' } as Record<Language, string>,
  stat1Label: { ja: '重粒子線装置', 'zh-TW': '重粒子線裝置', 'zh-CN': '重粒子线装置', en: 'Heavy Ion System' } as Record<Language, string>,
  stat2: { ja: '全室対応', 'zh-TW': '全室對應', 'zh-CN': '全室对应', en: 'All Rooms' } as Record<Language, string>,
  stat2Label: { ja: 'スキャン照射', 'zh-TW': '掃描照射', 'zh-CN': '扫描照射', en: 'Scanning Irradiation' } as Record<Language, string>,
  stat3: { ja: '短期集中', 'zh-TW': '短期集中', 'zh-CN': '短期集中', en: 'Short Course' } as Record<Language, string>,
  stat3Label: { ja: '1日～5週間', 'zh-TW': '1日～5週間', 'zh-CN': '1日～5周', en: '1 Day - 5 Weeks' } as Record<Language, string>,
  stat4: { ja: '公益財団', 'zh-TW': '公益財團', 'zh-CN': '公益财团', en: 'Public Interest' } as Record<Language, string>,
  stat4Label: { ja: '法人運営', 'zh-TW': '法人營運', 'zh-CN': '法人运营', en: 'Foundation' } as Record<Language, string>,

  // Intro
  introTag: { ja: '施設紹介', 'zh-TW': '設施介紹', 'zh-CN': '设施介绍', en: 'About the Center' } as Record<Language, string>,
  introTitle: { ja: '大阪重粒子線センターとは', 'zh-TW': '關於大阪重粒子線中心', 'zh-CN': '关于大阪重粒子线中心', en: 'About Osaka Heavy Ion Therapy Center' } as Record<Language, string>,
  introP1: { ja: '大阪重粒子線センターは、公益財団法人大阪国際がん治療財団が運営する関西初の重粒子線がん治療施設です。大阪市中央区大手前に位置し、世界最先端の小型化重粒子線治療装置を導入しています。', 'zh-TW': '大阪重粒子線中心是由公益財團法人大阪國際癌症治療財團營運的關西首家重粒子線癌症治療設施。位於大阪市中央區大手前,導入了世界最先進的小型化重粒子線治療裝置。', 'zh-CN': '大阪重粒子线中心是由公益财团法人大阪国际癌症治疗财团运营的关西首家重粒子线癌症治疗设施。位于大阪市中央区大手前,导入了世界最先进的小型化重粒子线治疗装置。', en: 'Osaka Heavy Ion Therapy Center is Kansai\'s first heavy ion cancer treatment facility, operated by the Public Interest Incorporated Foundation Osaka International Cancer Treatment Foundation. Located in Otemae, Chuo-ku, Osaka, featuring the world\'s most advanced miniaturized heavy ion therapy system.' } as Record<Language, string>,
  introP2: { ja: '全ての治療室で最新のスキャン照射治療を実施。体への負担が少なく、高齢者の方でも安心して治療を受けていただけます。通常の放射線治療では効果が限定的ながんや、手術が困難な腫瘍に対しても高い治療効果を発揮します。', 'zh-TW': '所有治療室均採用最新的掃描照射治療。對身體負擔小,高齡者也可以放心接受治療。對普通放射線治療效果有限的癌症,以及手術困難的腫瘤也能發揮高治療效果。', 'zh-CN': '所有治疗室均采用最新的扫描照射治疗。对身体负担小,高龄者也可以放心接受治疗。对普通放射线治疗效果有限的癌症,以及手术困难的肿瘤也能发挥高治疗效果。', en: 'All treatment rooms are equipped with the latest scanning irradiation technology. Gentle on the body, safe for elderly patients. Highly effective even for cancers with limited response to conventional radiation or tumors difficult to operate on.' } as Record<Language, string>,

  // Heavy Ion Therapy Advantages
  advTag: { ja: '重粒子線治療の特徴', 'zh-TW': '重粒子線治療的特色', 'zh-CN': '重粒子线治疗的特色', en: 'Heavy Ion Therapy Features' } as Record<Language, string>,
  advTitle: { ja: '3つの大きなメリット', 'zh-TW': '三大優勢', 'zh-CN': '三大优势', en: 'Three Major Advantages' } as Record<Language, string>,

  adv1Title: { ja: '切らない・痛くない治療', 'zh-TW': '無需開刀、沒有疼痛', 'zh-CN': '无需开刀、没有疼痛', en: 'No Surgery, Painless' } as Record<Language, string>,
  adv1Desc: { ja: '体に傷をつけることなく治療が可能です。照射自体に痛みや灼熱感はありません。高齢の方や体力に不安のある方でも安心して治療を受けていただけます。', 'zh-TW': '無需在身體上造成傷口即可進行治療。照射本身不會感到疼痛或灼熱感。高齡者或體力較弱者也可以放心接受治療。', 'zh-CN': '无需在身体上造成伤口即可进行治疗。照射本身不会感到疼痛或灼热感。高龄者或体力较弱者也可以放心接受治疗。', en: 'Treatment without any incisions. No pain or burning sensation during irradiation. Safe and suitable for elderly patients or those with physical concerns.' } as Record<Language, string>,

  adv2Title: { ja: '腫瘍部に集中照射', 'zh-TW': '集中照射腫瘤部位', 'zh-CN': '集中照射肿瘤部位', en: 'Targeted Tumor Irradiation' } as Record<Language, string>,
  adv2Desc: { ja: '重粒子線は腫瘍部分で大きなエネルギーを放出し、正常な組織への影響を最小限に抑えます。ブラッグピーク効果により、がん細胞を効果的に破壊しながら、周囲の重要臓器を守ります。', 'zh-TW': '重粒子線在腫瘤部位釋放大量能量,將對正常組織的影響降至最低。利用布拉格峰效應,在有效破壞癌細胞的同時,保護周圍重要器官。', 'zh-CN': '重粒子线在肿瘤部位释放大量能量,将对正常组织的影响降至最低。利用布拉格峰效应,在有效破坏癌细胞的同时,保护周围重要器官。', en: 'Heavy ions release maximum energy at the tumor site, minimizing impact on healthy tissue. The Bragg peak effect destroys cancer cells effectively while protecting surrounding vital organs.' } as Record<Language, string>,

  adv3Title: { ja: '短期集中治療', 'zh-TW': '短期集中治療', 'zh-CN': '短期集中治疗', en: 'Short Treatment Course' } as Record<Language, string>,
  adv3Desc: { ja: '従来の放射線治療と比べて、治療回数・日数が大幅に短縮。病状により1日～5週間程度で治療完了。日常生活への影響を最小限に抑え、通院での治療も可能です。', 'zh-TW': '與傳統放射線治療相比,治療次數和天數大幅縮短。根據病情1日～5週左右即可完成治療。將對日常生活的影響降至最低,也可以門診治療。', 'zh-CN': '与传统放射线治疗相比,治疗次数和天数大幅缩短。根据病情1日～5周左右即可完成治疗。将对日常生活的影响降至最低,也可以门诊治疗。', en: 'Significantly fewer sessions and shorter duration compared to conventional radiotherapy. Treatment completes in 1 day to 5 weeks depending on condition. Minimal impact on daily life, outpatient treatment possible.' } as Record<Language, string>,

  // Consultation Services
  consultTag: { ja: '相談サービス', 'zh-TW': '諮詢服務', 'zh-CN': '咨询服务', en: 'Consultation Services' } as Record<Language, string>,
  consultTitle: { ja: '治療開始までのサポート', 'zh-TW': '治療前支援服務', 'zh-CN': '治疗前支援服务', en: 'Pre-Treatment Support Services' } as Record<Language, string>,
  consultSubtitle: { ja: '専門スタッフが治療の可能性を一緒に探ります', 'zh-TW': '專業團隊與您共同探討治療可行性', 'zh-CN': '专业团队与您共同探讨治疗可行性', en: 'Our specialists work with you to explore treatment possibilities' } as Record<Language, string>,

  // Service 1: Initial Consultation
  service1Name: { ja: '前期相談サービス', 'zh-TW': '前期諮詢服務', 'zh-CN': '前期咨询服务', en: 'Initial Consultation' } as Record<Language, string>,
  service1Desc: { ja: '病歴資料翻訳、重粒子線治療適応性評価、治療計劃初步討論、費用概算', 'zh-TW': '病歷資料翻譯、重粒子線治療適應性評估、治療計劃初步討論、費用概算', 'zh-CN': '病历资料翻译、重粒子线治疗适应性评估、治疗计划初步讨论、费用概算', en: 'Medical record translation, suitability assessment, initial treatment planning, cost estimation' } as Record<Language, string>,
  service1Feature1: { ja: '診療情報の翻訳（中→日）', 'zh-TW': '病歷資料翻譯（中→日）', 'zh-CN': '病历资料翻译（中→日）', en: 'Medical record translation (CN→JP)' } as Record<Language, string>,
  service1Feature2: { ja: '重粒子線治療適応性評価', 'zh-TW': '重粒子線治療適應性評估', 'zh-CN': '重粒子线治疗适应性评估', en: 'Heavy ion therapy suitability assessment' } as Record<Language, string>,
  service1Feature3: { ja: '治療可能性評価レポート', 'zh-TW': '治療可行性評估報告', 'zh-CN': '治疗可行性评估报告', en: 'Treatment feasibility report' } as Record<Language, string>,
  service1Feature4: { ja: '費用概算のご説明', 'zh-TW': '費用概算說明', 'zh-CN': '费用概算说明', en: 'Cost estimation' } as Record<Language, string>,

  // Service 2: Remote Consultation
  service2Name: { ja: '遠隔会診サービス', 'zh-TW': '遠程會診服務', 'zh-CN': '远程会诊服务', en: 'Remote Consultation' } as Record<Language, string>,
  service2Desc: { ja: '重粒子線治療専門医とのビデオ診察、治療適応性と方案の討論、費用詳細說明', 'zh-TW': '與重粒子線治療專家遠程視頻會診、討論治療適應性與方案、費用詳細說明', 'zh-CN': '与重粒子线治疗专家远程视频会诊、讨论治疗适应性与方案、费用详细说明', en: 'Video consultation with specialists, treatment plan discussion, detailed cost breakdown' } as Record<Language, string>,
  service2Feature1: { ja: '専門医とのビデオ診察（30-60分）', 'zh-TW': '專科醫生視頻會診（30-60分鐘）', 'zh-CN': '专科医生视频会诊（30-60分钟）', en: 'Video consultation with specialist (30-60 mins)' } as Record<Language, string>,
  service2Feature2: { ja: '専門医療通訳が全行程同行', 'zh-TW': '專業醫療翻譯全程陪同', 'zh-CN': '专业医疗翻译全程陪同', en: 'Professional medical interpreter throughout' } as Record<Language, string>,
  service2Feature3: { ja: '詳細な治療計画のご説明', 'zh-TW': '詳細治療方案說明', 'zh-CN': '详细治疗方案说明', en: 'Detailed treatment plan explanation' } as Record<Language, string>,
  service2Feature4: { ja: '治療費用の明細見積', 'zh-TW': '治療費用明細報價', 'zh-CN': '治疗费用明细报价', en: 'Detailed cost quotation' } as Record<Language, string>,

  serviceLearnMore: { ja: '詳細を見る', 'zh-TW': '查看詳情', 'zh-CN': '查看详情', en: 'Learn More' } as Record<Language, string>,

  // Applicable Cancers
  cancerTag: { ja: '適応がん種', 'zh-TW': '適應癌症', 'zh-CN': '适应癌症', en: 'Applicable Cancers' } as Record<Language, string>,
  cancerTitle: { ja: '重粒子線治療の対象となる主ながん', 'zh-TW': '重粒子線治療的主要適應癌症', 'zh-CN': '重粒子线治疗的主要适应癌症', en: 'Main Cancer Types Treatable with Heavy Ion Therapy' } as Record<Language, string>,
  cancerNote: { ja: '※病状により適応可否が判断されます。詳しくはご相談ください。', 'zh-TW': '※根據病情判斷是否適用。詳情請諮詢。', 'zh-CN': '※根据病情判断是否适用。详情请咨询。', en: '※Applicability determined based on individual condition. Please consult for details.' } as Record<Language, string>,

  // Treatment Process
  processTag: { ja: '治療の流れ', 'zh-TW': '治療流程', 'zh-CN': '治疗流程', en: 'Treatment Process' } as Record<Language, string>,
  processTitle: { ja: '初診から治療完了まで', 'zh-TW': '從初診到治療完成', 'zh-CN': '从初诊到治疗完成', en: 'From First Consultation to Treatment Completion' } as Record<Language, string>,

  step1: { ja: '相談・初診', 'zh-TW': '諮詢・初診', 'zh-CN': '咨询·初诊', en: 'Consultation' } as Record<Language, string>,
  step1Desc: { ja: '現在の病状、検査結果をもとに治療の適応を判断します。', 'zh-TW': '根據目前病情和檢查結果判斷治療適應性。', 'zh-CN': '根据目前病情和检查结果判断治疗适应性。', en: 'Assess treatment applicability based on current condition and test results.' } as Record<Language, string>,

  step2: { ja: '治療計画CT', 'zh-TW': '治療計劃CT', 'zh-CN': '治疗计划CT', en: 'Treatment Planning CT' } as Record<Language, string>,
  step2Desc: { ja: '固定具を作成し、CT撮影で治療計画を立案します。', 'zh-TW': '製作固定器具,通過CT攝影制定治療計劃。', 'zh-CN': '制作固定器具,通过CT摄影制定治疗计划。', en: 'Create immobilization devices and CT imaging for treatment planning.' } as Record<Language, string>,

  step3: { ja: '治療開始', 'zh-TW': '開始治療', 'zh-CN': '开始治疗', en: 'Treatment Begins' } as Record<Language, string>,
  step3Desc: { ja: '1回約30分、通院または入院で治療を実施します。', 'zh-TW': '每次約30分鐘,可通過門診或住院進行治療。', 'zh-CN': '每次约30分钟,可通过门诊或住院进行治疗。', en: 'Approximately 30 minutes per session, outpatient or inpatient.' } as Record<Language, string>,

  step4: { ja: '経過観察', 'zh-TW': '追蹤觀察', 'zh-CN': '追踪观察', en: 'Follow-up' } as Record<Language, string>,
  step4Desc: { ja: '治療効果の確認と副作用のチェックを定期的に実施します。', 'zh-TW': '定期確認治療效果和檢查副作用。', 'zh-CN': '定期确认治疗效果和检查副作用。', en: 'Regular monitoring of treatment effects and side effect checks.' } as Record<Language, string>,

  // Facility
  facilityTag: { ja: '施設・設備', 'zh-TW': '設施・設備', 'zh-CN': '设施·设备', en: 'Facilities & Equipment' } as Record<Language, string>,
  facilityTitle: { ja: '世界最先端の小型化装置', 'zh-TW': '世界最先進的小型化裝置', 'zh-CN': '世界最先进的小型化装置', en: 'World\'s Most Advanced Miniaturized System' } as Record<Language, string>,
  facilityDesc: { ja: '従来の装置と比べて約1/3の設置面積を実現。全ての治療室で360度回転ガントリーによるスキャン照射が可能です。患者様の負担を最小限に抑える最新鋭の治療環境を提供します。', 'zh-TW': '與傳統裝置相比,安裝面積約為1/3。所有治療室均可進行360度旋轉機架的掃描照射。提供將患者負擔降至最低的最先進治療環境。', 'zh-CN': '与传统装置相比,安装面积约为1/3。所有治疗室均可进行360度旋转机架的扫描照射。提供将患者负担降至最低的最先进治疗环境。', en: 'Installation footprint approximately 1/3 of conventional systems. All treatment rooms equipped with 360-degree rotating gantry for scanning irradiation. State-of-the-art treatment environment minimizing patient burden.' } as Record<Language, string>,

  // Access
  accessTag: { ja: 'アクセス', 'zh-TW': '交通指南', 'zh-CN': '交通指南', en: 'Access' } as Record<Language, string>,
  accessTitle: { ja: '大阪重粒子線センター', 'zh-TW': '大阪重粒子線中心', 'zh-CN': '大阪重粒子线中心', en: 'Osaka Heavy Ion Therapy Center' } as Record<Language, string>,
  address: { ja: '〒540-0008 大阪府大阪市中央区大手前3丁目1番10号', 'zh-TW': '〒540-0008 大阪府大阪市中央區大手前3丁目1番10號', 'zh-CN': '〒540-0008 大阪府大阪市中央区大手前3丁目1番10号', en: '3-1-10 Otemae, Chuo-ku, Osaka 540-0008, Japan' } as Record<Language, string>,
  tel: { ja: '医療に関するお問い合わせ: +81-6-6947-3210', 'zh-TW': '醫療諮詢: +81-6-6947-3210', 'zh-CN': '医疗咨询: +81-6-6947-3210', en: 'Medical Inquiries: +81-6-6947-3210' } as Record<Language, string>,
  accessInfo: { ja: '地下鉄谷町線・京阪本線「天満橋」駅より徒歩約15分\n地下鉄谷町線・中央線「谷町四丁目」駅より徒歩約10分', 'zh-TW': '地鐵谷町線・京阪本線「天滿橋」站步行約15分鐘\n地鐵谷町線・中央線「谷町四丁目」站步行約10分鐘', 'zh-CN': '地铁谷町线·京阪本线「天满桥」站步行约15分钟\n地铁谷町线·中央线「谷町四丁目」站步行约10分钟', en: 'Approx. 15 min walk from Temmabashi Station (Subway Tanimachi Line / Keihan Main Line)\nApprox. 10 min walk from Tanimachi Yonchome Station (Subway Tanimachi Line / Chuo Line)' } as Record<Language, string>,

  // FAQ
  faqTag: { ja: 'よくある質問', 'zh-TW': '常見問題', 'zh-CN': '常见问题', en: 'FAQ' } as Record<Language, string>,
  faqTitle: { ja: 'よくいただくご質問', 'zh-TW': '常見問題', 'zh-CN': '常见问题', en: 'Frequently Asked Questions' } as Record<Language, string>,

  // CTA
  ctaTitle: { ja: 'まずは無料相談から', 'zh-TW': '從免費諮詢開始', 'zh-CN': '从免费咨询开始', en: 'Start with a Free Consultation' } as Record<Language, string>,
  ctaSub: { ja: '重粒子線治療に関するご相談は、専門スタッフが丁寧にご対応いたします', 'zh-TW': '關於重粒子線治療的諮詢,由專業人員為您細心解答', 'zh-CN': '关于重粒子线治疗的咨询,由专业人员为您细心解答', en: 'Our specialists will carefully guide you through your heavy ion therapy options' } as Record<Language, string>,
  ctaChinese: { ja: '中国語対応可能', 'zh-TW': '支援中文服務', 'zh-CN': '支持中文服务', en: 'Chinese Support Available' } as Record<Language, string>,
};

// FAQ data
const faqData: { q: Record<Language, string>; a: Record<Language, string> }[] = [
  {
    q: { ja: '重粒子線治療とは何ですか？', 'zh-TW': '什麼是重粒子線治療？', 'zh-CN': '什么是重粒子线治疗？', en: 'What is heavy ion therapy?' },
    a: { ja: '炭素イオンを光速の約70%まで加速し、がん細胞にピンポイントで照射する治療法です。通常の放射線（X線）と比べて約3倍の生物学的効果があり、正常組織への影響を抑えながら、がん細胞を効果的に破壊できます。', 'zh-TW': '將碳離子加速至光速約70%,對癌細胞進行精準照射的治療方法。與普通放射線(X射線)相比具有約3倍的生物學效果,在抑制對正常組織影響的同時,能有效破壞癌細胞。', 'zh-CN': '将碳离子加速至光速约70%,对癌细胞进行精准照射的治疗方法。与普通放射线(X射线)相比具有约3倍的生物学效果,在抑制对正常组织影响的同时,能有效破坏癌细胞。', en: 'A treatment method that accelerates carbon ions to approximately 70% of light speed and precisely irradiates cancer cells. Compared to conventional radiation (X-rays), it has about 3 times the biological effect, effectively destroying cancer cells while minimizing impact on healthy tissue.' },
  },
  {
    q: { ja: '治療期間はどのくらいですか？', 'zh-TW': '治療期間是多久？', 'zh-CN': '治疗期间是多久？', en: 'How long is the treatment period?' },
    a: { ja: '病状により異なりますが、1日から5週間程度です。例えば前立腺がんは約4週間（12回）、肝臓がんは約2週間（2-8回）、肺がんは約1-2週間（1-4回）が標準的です。初診からCT撮影・治療計画までに約1-2週間かかります。', 'zh-TW': '根據病情不同,從1日到5週左右。例如前列腺癌約4週(12次),肝癌約2週(2-8次),肺癌約1-2週(1-4次)為標準。從初診到CT攝影・治療計劃約需1-2週。', 'zh-CN': '根据病情不同,从1日到5周左右。例如前列腺癌约4周(12次),肝癌约2周(2-8次),肺癌约1-2周(1-4次)为标准。从初诊到CT摄影·治疗计划约需1-2周。', en: 'Varies by condition, ranging from 1 day to 5 weeks. For example, prostate cancer typically requires about 4 weeks (12 sessions), liver cancer about 2 weeks (2-8 sessions), lung cancer about 1-2 weeks (1-4 sessions). Initial consultation to CT imaging and treatment planning takes approximately 1-2 weeks.' },
  },
  {
    q: { ja: '痛みはありますか？', 'zh-TW': '會有疼痛嗎？', 'zh-CN': '会有疼痛吗？', en: 'Is there any pain?' },
    a: { ja: '照射自体に痛みや灼熱感はありません。治療中は治療台に横になっているだけで、体に何も感じません。ただし、固定具の装着や長時間同じ姿勢を保つことで、多少の不快感を感じる場合があります。', 'zh-TW': '照射本身不會感到疼痛或灼熱感。治療中只需躺在治療台上,身體不會感到任何不適。但是,佩戴固定器具和長時間保持同一姿勢可能會感到些許不適。', 'zh-CN': '照射本身不会感到疼痛或灼热感。治疗中只需躺在治疗台上,身体不会感到任何不适。但是,佩戴固定器具和长时间保持同一姿势可能会感到些许不适。', en: 'The irradiation itself causes no pain or burning sensation. During treatment, you simply lie on the treatment table and feel nothing in your body. However, you may experience slight discomfort from wearing immobilization devices or maintaining the same position for an extended period.' },
  },
  {
    q: { ja: '副作用はありますか？', 'zh-TW': '有副作用嗎？', 'zh-CN': '有副作用吗？', en: 'Are there side effects?' },
    a: { ja: '照射部位により異なりますが、通常の放射線治療と比べて副作用は軽度です。主な副作用として、照射部位の皮膚炎、倦怠感、照射部位近くの臓器の炎症（肺炎、食道炎など）があります。多くは一時的で、治療終了後に改善します。', 'zh-TW': '根據照射部位不同,但與普通放射線治療相比副作用較輕。主要副作用包括照射部位的皮膚炎、倦怠感、照射部位附近器官的炎症(肺炎、食道炎等)。大多是暫時性的,治療結束後會改善。', 'zh-CN': '根据照射部位不同,但与普通放射线治疗相比副作用较轻。主要副作用包括照射部位的皮肤炎、倦怠感、照射部位附近器官的炎症(肺炎、食道炎等)。大多是暂时性的,治疗结束后会改善。', en: 'Varies by irradiation site, but side effects are generally milder than conventional radiotherapy. Main side effects include dermatitis at the irradiation site, fatigue, and inflammation of organs near the irradiation site (pneumonitis, esophagitis, etc.). Most are temporary and improve after treatment completion.' },
  },
  {
    q: { ja: 'どのような人が治療を受けられますか？', 'zh-TW': '什麼樣的人可以接受治療？', 'zh-CN': '什么样的人可以接受治疗？', en: 'Who can receive treatment?' },
    a: { ja: '基本条件は以下の通りです: ①局所性固形腫瘍であること ②同一部位への放射線治療歴がないこと ③約30分間安静に横たわれること ④PS（全身状態）が0-2であること ⑤患者様ご自身ががんの診断を認識していること。詳しい適応判断は初診時に行います。', 'zh-TW': '基本條件如下: ①局部性實體腫瘤 ②同一部位無放射線治療史 ③能安靜躺臥約30分鐘 ④PS(全身狀態)為0-2 ⑤患者本人知曉癌症診斷。詳細適應性判斷在初診時進行。', 'zh-CN': '基本条件如下: ①局部性实体肿瘤 ②同一部位无放射线治疗史 ③能安静躺卧约30分钟 ④PS(全身状态)为0-2 ⑤患者本人知晓癌症诊断。详细适应性判断在初诊时进行。', en: 'Basic conditions: ① Localized solid tumor ② No prior radiation therapy to the same site ③ Ability to lie still for approximately 30 minutes ④ Performance Status (PS) 0-2 ⑤ Patient awareness of cancer diagnosis. Detailed applicability assessment conducted during initial consultation.' },
  },
  {
    q: { ja: '費用はどのくらいですか？', 'zh-TW': '費用是多少？', 'zh-CN': '费用是多少？', en: 'What is the cost?' },
    a: { ja: '重粒子線治療は先進医療として実施されており、治療費は全額自己負担となります。費用は病状により異なりますが、一般的に300万円前後です。ただし、診察・検査・入院費用などは健康保険が適用されます。また、一部のがん種は保険診療として認められています。', 'zh-TW': '重粒子線治療作為先進醫療實施,治療費用全額自費。費用根據病情不同,一般約300萬日元左右。但是,診察・檢查・住院費用等可使用健康保險。此外,部分癌症已被認定為保險診療。', 'zh-CN': '重粒子线治疗作为先进医疗实施,治疗费用全额自费。费用根据病情不同,一般约300万日元左右。但是,诊察·检查·住院费用等可使用健康保险。此外,部分癌症已被认定为保险诊疗。', en: 'Heavy ion therapy is provided as advanced medical treatment, with treatment costs fully self-paid. Costs vary by condition but typically around 3 million yen. However, consultations, tests, and hospitalization costs are covered by health insurance. Additionally, some cancer types are approved for insurance coverage.' },
  },
  {
    q: { ja: '海外からの受診は可能ですか？', 'zh-TW': '可以從海外就診嗎？', 'zh-CN': '可以从海外就诊吗？', en: 'Can international patients receive treatment?' },
    a: { ja: 'はい、可能です。事前に診療情報（病理診断、画像検査など）を提出いただき、適応可否を判断します。中国語対応スタッフがおりますので、言語の心配はありません。ビザ取得、宿泊先手配などのサポートも可能です。', 'zh-TW': '是的,可以。請事先提交診療資訊(病理診斷、影像檢查等),我們將判斷適應性。有中文對應人員,無需擔心語言問題。也可支援簽證取得、住宿安排等。', 'zh-CN': '是的,可以。请事先提交诊疗信息(病理诊断、影像检查等),我们将判断适应性。有中文对应人员,无需担心语言问题。也可支援签证取得、住宿安排等。', en: 'Yes, it is possible. Please submit medical information (pathology diagnosis, imaging tests, etc.) in advance for applicability assessment. Chinese-speaking staff are available, so language is not a concern. We can also assist with visa acquisition and accommodation arrangements.' },
  },
  {
    q: { ja: '治療後の生活はどうなりますか？', 'zh-TW': '治療後的生活會如何？', 'zh-CN': '治疗后的生活会如何？', en: 'What is life like after treatment?' },
    a: { ja: '治療終了後は定期的な経過観察が必要です。CT/MRI/PETなどの画像検査と血液検査により、治療効果の確認と副作用のチェックを行います。多くの患者様は治療終了後も通常の日常生活を送ることができます。仕事への復帰も可能です。', 'zh-TW': '治療結束後需要定期追蹤觀察。通過CT/MRI/PET等影像檢查和血液檢查,確認治療效果和檢查副作用。大多數患者在治療結束後可以過正常的日常生活。也可以重返工作。', 'zh-CN': '治疗结束后需要定期追踪观察。通过CT/MRI/PET等影像检查和血液检查,确认治疗效果和检查副作用。大多数患者在治疗结束后可以过正常的日常生活。也可以重返工作。', en: 'Regular follow-up is required after treatment completion. CT/MRI/PET imaging and blood tests are performed to confirm treatment effects and check for side effects. Most patients can resume normal daily life after treatment. Return to work is also possible.' },
  },
];

// Cancer types
const cancerTypes = [
  { icon: <Brain size={18} />, ja: '頭頸部がん', tw: '頭頸部癌', cn: '头颈部癌', en: 'Head & Neck Cancer' },
  { icon: <Activity size={18} />, ja: '肺がん', tw: '肺癌', cn: '肺癌', en: 'Lung Cancer' },
  { icon: <Heart size={18} />, ja: '肝臓がん', tw: '肝癌', cn: '肝癌', en: 'Liver Cancer' },
  { icon: <Stethoscope size={18} />, ja: '前立腺がん', tw: '前列腺癌', cn: '前列腺癌', en: 'Prostate Cancer' },
  { icon: <Microscope size={18} />, ja: '膵臓がん', tw: '胰臟癌', cn: '胰脏癌', en: 'Pancreatic Cancer' },
  { icon: <Shield size={18} />, ja: '骨軟部腫瘍', tw: '骨軟部腫瘤', cn: '骨软部肿瘤', en: 'Bone/Soft Tissue Tumors' },
  { icon: <Target size={18} />, ja: '直腸がん', tw: '直腸癌', cn: '直肠癌', en: 'Rectal Cancer' },
  { icon: <Zap size={18} />, ja: '子宮がん', tw: '子宮癌', cn: '子宫癌', en: 'Uterine Cancer' },
];

// Treatment steps
const treatmentSteps = [
  { step: 1, icon: <FileText size={24} />, title: t.step1, desc: t.step1Desc },
  { step: 2, icon: <Microscope size={24} />, title: t.step2, desc: t.step2Desc },
  { step: 3, icon: <Zap size={24} />, title: t.step3, desc: t.step3Desc },
  { step: 4, icon: <Activity size={24} />, title: t.step4, desc: t.step4Desc },
];

// ======================================
// Component
// ======================================
interface OsakaHimakContentProps {
  isGuideEmbed?: boolean;
  guideSlug?: string;
}

export default function OsakaHimakContent({ isGuideEmbed, guideSlug }: OsakaHimakContentProps) {
  const lang = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const checkoutHref = (path: string) => {
    if (isGuideEmbed) return '#consultation';
    return guideSlug ? `${path}?guide=${guideSlug}` : path;
  };

  return (
    <div className="min-h-screen bg-white text-[#333]">

      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        <img src={IMG.hero1} alt="Osaka Heavy Ion Therapy Center" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="max-w-2xl">
            <span className="inline-block bg-[#0056b3]/90 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
              {t.heroTag[lang]}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t.heroTitle[lang]}
            </h1>
            <p className="text-lg md:text-xl text-white/85 whitespace-pre-line mb-8 leading-relaxed">
              {t.heroSub[lang]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={checkoutHref('/osaka-himak/initial-consultation')}
                className="inline-flex items-center justify-center gap-2 bg-[#0056b3] text-white px-8 py-4 rounded-full font-bold hover:bg-[#004494] transition-all shadow-lg hover:shadow-xl"
              >
                {t.ctaConsult[lang]} <ArrowRight size={18} />
              </Link>
              <a
                href="#advantages"
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white px-8 py-4 rounded-full font-bold hover:bg-white/25 transition-all border border-white/30 backdrop-blur-sm"
              >
                {t.ctaLearn[lang]}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. STATS BAR ===== */}
      <section className="bg-[#0056b3] py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: t.stat1[lang], label: t.stat1Label[lang], icon: <Target size={20} /> },
            { val: t.stat2[lang], label: t.stat2Label[lang], icon: <Zap size={20} /> },
            { val: t.stat3[lang], label: t.stat3Label[lang], icon: <Clock size={20} /> },
            { val: t.stat4[lang], label: t.stat4Label[lang], icon: <Shield size={20} /> },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="opacity-80">{s.icon}</div>
              <div className="text-2xl md:text-3xl font-bold">{s.val}</div>
              <div className="text-sm text-white/80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 3. INTRODUCTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.introTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-2">{t.introTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <p className="text-[#555] leading-relaxed">{t.introP1[lang]}</p>
              <p className="text-[#555] leading-relaxed">{t.introP2[lang]}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src={IMG.hero2} alt="Treatment room" className="rounded-xl shadow-md w-full h-48 object-cover" />
              <img src={IMG.hero3} alt="Equipment" className="rounded-xl shadow-md w-full h-48 object-cover" />
              <img src={IMG.hero4} alt="Facility" className="rounded-xl shadow-md w-full h-48 object-cover col-span-2" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. ADVANTAGES ===== */}
      <section id="advantages" className="py-20 bg-[#f6f6f6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.advTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.advTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Heart size={32} />, title: t.adv1Title, desc: t.adv1Desc, color: '#0056b3' },
              { icon: <Target size={32} />, title: t.adv2Title, desc: t.adv2Desc, color: '#00a8e1' },
              { icon: <Zap size={32} />, title: t.adv3Title, desc: t.adv3Desc, color: '#00c389' },
            ].map((adv, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all">
                <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: `${adv.color}15` }}>
                  <div style={{ color: adv.color }}>{adv.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-[#333] mb-3">{adv.title[lang]}</h3>
                <p className="text-[#555] leading-relaxed">{adv.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. APPLICABLE CANCERS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.cancerTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-4">{t.cancerTitle[lang]}</h2>
            <p className="text-[#666] text-sm">{t.cancerNote[lang]}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cancerTypes.map((cancer, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#f6f6f6] rounded-lg px-4 py-3 hover:bg-[#0056b3]/10 transition-all">
                <div className="text-[#0056b3]">{cancer.icon}</div>
                <span className="text-sm font-medium text-[#333]">
                  {lang === 'ja' ? cancer.ja : lang === 'zh-TW' ? cancer.tw : lang === 'zh-CN' ? cancer.cn : cancer.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5.5 CONSULTATION SERVICES ===== */}
      <section className="py-20 bg-gradient-to-b from-white to-[#f6f6f6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.consultTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-4">{t.consultTitle[lang]}</h2>
            <p className="text-[#666]">{t.consultSubtitle[lang]}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Service 1: Initial Consultation */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-t-4 border-[#0056b3]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#333] mb-2">{t.service1Name[lang]}</h3>
                  <p className="text-sm text-[#666]">{t.service1Desc[lang]}</p>
                </div>
                <div className="text-[#0056b3] flex-shrink-0 ml-4">
                  <FileText size={40} />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[t.service1Feature1[lang], t.service1Feature2[lang], t.service1Feature3[lang], t.service1Feature4[lang]].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#0056b3] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#555]">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[#0056b3]">¥221,000</p>
                  <p className="text-xs text-gray-500 mt-1">{lang === 'ja' ? '税込' : lang === 'zh-CN' ? '含税' : lang === 'zh-TW' ? '税込' : 'tax incl.'}</p>
                </div>
                <Link
                  href={checkoutHref('/osaka-himak/initial-consultation')}
                  className="inline-flex items-center gap-2 bg-[#0056b3] text-white px-6 py-3 rounded-full font-bold hover:bg-[#004494] transition-all"
                >
                  {t.serviceLearnMore[lang]} <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Service 2: Remote Consultation */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-t-4 border-[#00A6E0]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#333] mb-2">{t.service2Name[lang]}</h3>
                  <p className="text-sm text-[#666]">{t.service2Desc[lang]}</p>
                </div>
                <div className="text-[#00A6E0] flex-shrink-0 ml-4">
                  <Globe size={40} />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[t.service2Feature1[lang], t.service2Feature2[lang], t.service2Feature3[lang], t.service2Feature4[lang]].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#00A6E0] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#555]">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[#00A6E0]">¥243,000</p>
                  <p className="text-xs text-gray-500 mt-1">{lang === 'ja' ? '税込' : lang === 'zh-CN' ? '含税' : lang === 'zh-TW' ? '税込' : 'tax incl.'}</p>
                </div>
                <Link
                  href={checkoutHref('/osaka-himak/remote-consultation')}
                  className="inline-flex items-center gap-2 bg-[#00A6E0] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0095C8] transition-all"
                >
                  {t.serviceLearnMore[lang]} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. TREATMENT PROCESS ===== */}
      <section className="py-20 bg-[#f6f6f6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.processTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.processTitle[lang]}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {treatmentSteps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md relative">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0056b3] text-white font-bold text-xl mb-4 mx-auto">
                  {step.step}
                </div>
                <div className="flex items-center justify-center text-[#0056b3] mb-3">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-[#333] mb-2 text-center">{step.title[lang]}</h3>
                <p className="text-sm text-[#555] text-center leading-relaxed">{step.desc[lang]}</p>
                {i < treatmentSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight size={20} className="text-[#0056b3]/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. FACILITY ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.facilityTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-4">{t.facilityTitle[lang]}</h2>
            <p className="text-[#555] max-w-3xl mx-auto leading-relaxed">{t.facilityDesc[lang]}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Target size={24} />, label: { ja: '360度回転ガントリー', 'zh-TW': '360度旋轉機架', 'zh-CN': '360度旋转机架', en: '360° Rotating Gantry' } },
              { icon: <Zap size={24} />, label: { ja: 'スキャン照射', 'zh-TW': '掃描照射', 'zh-CN': '扫描照射', en: 'Scanning Irradiation' } },
              { icon: <Award size={24} />, label: { ja: '小型化装置', 'zh-TW': '小型化裝置', 'zh-CN': '小型化装置', en: 'Miniaturized System' } },
            ].map((feat, i) => (
              <div key={i} className="bg-[#f6f6f6] rounded-xl p-6 text-center">
                <div className="flex items-center justify-center text-[#0056b3] mb-3">
                  {feat.icon}
                </div>
                <p className="font-semibold text-[#333]">{feat.label[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. ACCESS ===== */}
      <section className="py-20 bg-[#f6f6f6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.accessTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.accessTitle[lang]}</h2>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-md space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-[#0056b3] mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#333] mb-1">Address</p>
                <p className="text-[#555]">{t.address[lang]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-[#0056b3] mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#333] mb-1">Contact</p>
                <p className="text-[#555]">{t.tel[lang]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Train size={20} className="text-[#0056b3] mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#333] mb-1">Access</p>
                <p className="text-[#555] whitespace-pre-line">{t.accessInfo[lang]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 9. FAQ ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.faqTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333]">{t.faqTitle[lang]}</h2>
          </div>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="bg-[#f6f6f6] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#e6e6e6] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={20} className="text-[#0056b3] flex-shrink-0" />
                    <span className="font-semibold text-[#333]">{faq.q[lang]}</span>
                  </div>
                  {openFaq === i ? <ChevronUp size={20} className="text-[#666]" /> : <ChevronDown size={20} className="text-[#666]" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 pt-2">
                    <p className="text-[#555] leading-relaxed pl-8">{faq.a[lang]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10. CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-[#0056b3] to-[#003d82]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle[lang]}</h2>
          <p className="text-lg text-white/90 mb-6">{t.ctaSub[lang]}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full backdrop-blur-sm">
              <Globe size={18} />
              <span className="text-sm font-medium">{t.ctaChinese[lang]}</span>
            </div>
          </div>
          <Link
            href={checkoutHref('/osaka-himak/initial-consultation')}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#0056b3] px-10 py-4 rounded-full font-bold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
          >
            {t.ctaConsult[lang]} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
