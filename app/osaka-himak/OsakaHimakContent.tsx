'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, ChevronDown, ChevronUp,
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
  heroTag: { ja: '関西初の重粒子線がん治療', 'zh-TW': '關西首家重粒子線癌症治療', 'zh-CN': '关西首家重粒子线癌症治疗', en: 'Kansai\'s First Heavy Ion Therapy', ko: '간사이 최초 중입자선 암 치료' } as Record<Language, string>,
  heroTitle: { ja: '大阪重粒子線センター', 'zh-TW': '大阪重粒子線中心', 'zh-CN': '大阪重粒子线中心', en: 'Osaka Heavy Ion Therapy Center', ko: '오사카 중입자선 센터' } as Record<Language, string>,
  heroSub: { ja: '立足大阪、面向全国、服务世界\n先進的ながん治療で、切らない・痛くない・体に優しい', 'zh-TW': '立足大阪、面向全國、服務世界\n先進的癌症治療，無需開刀、沒有疼痛、對身體溫和', 'zh-CN': '立足大阪、面向全国、服务世界\n先进的癌症治疗，无需开刀、没有疼痛、对身体温和', en: 'Based in Osaka, serving nationwide and globally\nAdvanced cancer treatment — no surgery, painless, gentle on the body', ko: '오사카를 거점으로, 전국 그리고 세계를 향하여\n첨단 암 치료 — 수술 없이, 통증 없이, 신체에 부담 없이' } as Record<Language, string>,
  ctaConsult: { ja: '無料相談を予約する', 'zh-TW': '預約免費諮詢', 'zh-CN': '预约免费咨询', en: 'Book Free Consultation', ko: '무료 상담 예약하기' } as Record<Language, string>,
  ctaLearn: { ja: '詳しく見る', 'zh-TW': '查看詳情', 'zh-CN': '查看详情', en: 'Learn More', ko: '자세히 보기' } as Record<Language, string>,
  ko: '자세히 보기',

  // Stats
  stat1: { ja: '世界最小クラス', 'zh-TW': '世界最小等級', 'zh-CN': '世界最小级别', en: 'Among World\'s Smallest', ko: '세계 최소 클래스' } as Record<Language, string>,
  stat1Label: { ja: '重粒子線装置', 'zh-TW': '重粒子線裝置', 'zh-CN': '重粒子线装置', en: 'Heavy Ion System', ko: '중입자선 장치' } as Record<Language, string>,
  stat2: { ja: '全室対応', 'zh-TW': '全室對應', 'zh-CN': '全室对应', en: 'All Rooms', ko: '전실 대응' } as Record<Language, string>,
  stat2Label: { ja: 'スキャン照射', 'zh-TW': '掃描照射', 'zh-CN': '扫描照射', en: 'Scanning Irradiation', ko: '스캔 조사' } as Record<Language, string>,
  stat3: { ja: '短期集中', 'zh-TW': '短期集中', 'zh-CN': '短期集中', en: 'Short Course', ko: '단기 집중' } as Record<Language, string>,
  stat3Label: { ja: '1日～5週間', 'zh-TW': '1日～5週間', 'zh-CN': '1日～5周', en: '1 Day - 5 Weeks', ko: '1일~5주' } as Record<Language, string>,
  stat4: { ja: '公益財団', 'zh-TW': '公益財團', 'zh-CN': '公益财团', en: 'Public Interest', ko: '공익 재단' } as Record<Language, string>,
  stat4Label: { ja: '法人運営', 'zh-TW': '法人營運', 'zh-CN': '法人运营', en: 'Foundation', ko: '법인 운영' } as Record<Language, string>,

  // Intro
  introTag: { ja: '施設紹介', 'zh-TW': '設施介紹', 'zh-CN': '设施介绍', en: 'About the Center', ko: '센터 소개' } as Record<Language, string>,
  introTitle: { ja: '大阪重粒子線センターとは', 'zh-TW': '關於大阪重粒子線中心', 'zh-CN': '关于大阪重粒子线中心', en: 'About Osaka Heavy Ion Therapy Center', ko: '오사카 중입자선 센터란' } as Record<Language, string>,
  introP1: { ja: '大阪重粒子線センターは、公益財団法人大阪国際がん治療財団が運営する関西初の重粒子線がん治療施設です。大阪市中央区大手前に位置し、先進的な小型化重粒子線治療装置を導入しています。', 'zh-TW': '大阪重粒子線中心是由公益財團法人大阪國際癌症治療財團營運的關西首家重粒子線癌症治療設施。位於大阪市中央區大手前,導入了先進的小型化重粒子線治療裝置。', 'zh-CN': '大阪重粒子线中心是由公益财团法人大阪国际癌症治疗财团运营的关西首家重粒子线癌症治疗设施。位于大阪市中央区大手前,导入了先进的小型化重粒子线治疗装置。', en: 'Osaka Heavy Ion Therapy Center is Kansai\'s first heavy ion cancer treatment facility, operated by the Public Interest Incorporated Foundation Osaka International Cancer Treatment Foundation. Located in Otemae, Chuo-ku, Osaka, featuring an advanced miniaturized heavy ion therapy system.', ko: '오사카 중입자선 센터는 공익재단법인 오사카 국제암치료재단이 운영하는 간사이 최초의 중입자선 암 치료 시설입니다. 오사카시 주오구 오테마에에 위치하며, 첨단 소형화 중입자선 치료 장치를 도입하고 있습니다.' } as Record<Language, string>,
  introP2: { ja: '全ての治療室で最新のスキャン照射治療を実施。体への負担が少なく、高齢者の方でも安心して治療を受けていただけます。通常の放射線治療では効果が限定的ながんや、手術が困難な腫瘍に対しても高い治療効果を発揮します。', 'zh-TW': '所有治療室均採用最新的掃描照射治療。對身體負擔小,高齡者也可以放心接受治療。對普通放射線治療效果有限的癌症,以及手術困難的腫瘤也能發揮高治療效果。', 'zh-CN': '所有治疗室均采用最新的扫描照射治疗。对身体负担小,高龄者也可以放心接受治疗。对普通放射线治疗效果有限的癌症,以及手术困难的肿瘤也能发挥高治疗效果。', en: 'All treatment rooms are equipped with the latest scanning irradiation technology. Gentle on the body, safe for elderly patients. Highly effective even for cancers with limited response to conventional radiation or tumors difficult to operate on.', ko: '모든 치료실에서 최신 스캔 조사 치료를 실시합니다. 신체에 대한 부담이 적어 고령자분도 안심하고 치료를 받으실 수 있습니다. 일반 방사선 치료로는 효과가 제한적인 암이나 수술이 어려운 종양에 대해서도 높은 치료 효과를 발휘합니다.' } as Record<Language, string>,

  // Science Behind Heavy Ion Therapy
  scienceTag: { ja: '重粒子線治療の科学', 'zh-TW': '重粒子線治療的科學原理', 'zh-CN': '重粒子线治疗的科学原理', en: 'Science of Heavy Ion Therapy', ko: '중입자선 치료의 과학' } as Record<Language, string>,
  scienceTitle: { ja: '炭素イオンが実現する精密ながん治療', 'zh-TW': '碳離子實現的精準癌症治療', 'zh-CN': '碳离子实现的精准癌症治疗', en: 'Precision Cancer Treatment with Carbon Ions', ko: '탄소이온이 실현하는 정밀 암 치료' } as Record<Language, string>,
  scienceIntro: { ja: '重粒子線治療は、炭素イオン（C12）を光速の約70%まで加速し、がん細胞をピンポイントで破壊する先進的な放射線治療です。通常のX線治療と比べて、約3倍の生物学的効果を持ちながら、正常組織への影響を大幅に低減します。', 'zh-TW': '重粒子線治療是將碳離子（C12）加速至光速約70%，精準破壞癌細胞的先進放射線治療。與普通X射線治療相比，具有約3倍的生物學效果，同時大幅降低對正常組織的影響。', 'zh-CN': '重粒子线治疗是将碳离子（C12）加速至光速约70%，精准破坏癌细胞的先进放射线治疗。与普通X射线治疗相比，具有约3倍的生物学效果，同时大幅降低对正常组织的影响。', en: 'Heavy ion therapy accelerates carbon ions (C12) to approximately 70% of light speed, precisely destroying cancer cells with advanced radiation treatment. Compared to conventional X-ray therapy, it delivers about 3 times the biological effect while significantly reducing impact on normal tissue.', ko: '중입자선 치료는 탄소이온(C12)을 광속의 약 70%까지 가속하여 암세포를 정밀하게 파괴하는 첨단 방사선 치료입니다. 일반 X선 치료에 비해 약 3배의 생물학적 효과를 가지면서도 정상 조직에 대한 영향을 대폭 저감합니다.' } as Record<Language, string>,

  braggPeakTitle: { ja: 'ブラッグピーク効果', 'zh-TW': '布拉格峰效應', 'zh-CN': '布拉格峰效应', en: 'Bragg Peak Effect', ko: '브래그 피크 효과' } as Record<Language, string>,
  braggPeakDesc: { ja: '重粒子線は体内を進む際、表面付近ではエネルギーをほとんど放出せず、設定した深さ（腫瘍位置）で最大エネルギーを集中放出します。この特性により、腫瘍の手前と奥の正常組織を保護しながら、がん細胞のみを強力に攻撃できます。', 'zh-TW': '重粒子線在體內行進時，表面附近幾乎不釋放能量，在設定深度（腫瘤位置）集中釋放最大能量。這一特性使得在保護腫瘤前後正常組織的同時，能夠強力攻擊癌細胞。', 'zh-CN': '重粒子线在体内行进时，表面附近几乎不释放能量，在设定深度（肿瘤位置）集中释放最大能量。这一特性使得在保护肿瘤前后正常组织的同时，能够强力攻击癌细胞。', en: 'Heavy ions deposit minimal energy near the body surface, concentrating maximum energy at the preset depth (tumor location). This property enables powerful attack on cancer cells while protecting normal tissue before and after the tumor.', ko: '중입자선은 체내를 진행할 때 표면 부근에서는 에너지를 거의 방출하지 않고, 설정한 깊이(종양 위치)에서 최대 에너지를 집중 방출합니다. 이 특성에 의해 종양 전후의 정상 조직을 보호하면서 암세포만을 강력하게 공격할 수 있습니다.' } as Record<Language, string>,

  carbonIonTitle: { ja: '炭素イオンの高い生物学的効果', 'zh-TW': '碳離子的高生物學效應', 'zh-CN': '碳离子的高生物学效应', en: 'High Biological Effectiveness of Carbon Ions', ko: '탄소이온의 높은 생물학적 효과' } as Record<Language, string>,
  carbonIonDesc: { ja: '炭素イオンは質量が重いため、がん細胞のDNA二重鎖を直接切断します。X線治療では抵抗性を示す低酸素がんや放射線抵抗性腫瘍に対しても、高い治療効果を発揮。相対生物学的効果（RBE）は通常の放射線の2～3倍に達します。', 'zh-TW': '碳離子質量較重，能直接切斷癌細胞的DNA雙鏈。對X射線治療具有抵抗性的低氧癌症和放射抗性腫瘤，也能發揮高治療效果。相對生物學效應（RBE）達到普通放射線的2～3倍。', 'zh-CN': '碳离子质量较重，能直接切断癌细胞的DNA双链。对X射线治疗具有抵抗性的低氧癌症和放射抗性肿瘤，也能发挥高治疗效果。相对生物学效应（RBE）达到普通放射线的2～3倍。', en: 'Carbon ions, due to their heavy mass, directly sever cancer cell DNA double strands. Highly effective even against hypoxic cancers and radioresistant tumors that show resistance to X-ray therapy. Relative Biological Effectiveness (RBE) reaches 2-3 times that of conventional radiation.', ko: '탄소이온은 질량이 무거워 암세포의 DNA 이중가닥을 직접 절단합니다. X선 치료에 저항성을 보이는 저산소 암이나 방사선 저항성 종양에 대해서도 높은 치료 효과를 발휘합니다. 상대생물학적효과(RBE)는 일반 방사선의 2~3배에 달합니다.' } as Record<Language, string>,

  // Clinical Comparison Data
  comparisonTag: { ja: '治療比較', 'zh-TW': '治療對比', 'zh-CN': '治疗对比', en: 'Treatment Comparison', ko: '치료 비교' } as Record<Language, string>,
  comparisonTitle: { ja: '従来の治療法との比較', 'zh-TW': '與傳統治療方法的對比', 'zh-CN': '与传统治疗方法的对比', en: 'Comparison with Conventional Treatments', ko: '기존 치료법과의 비교' } as Record<Language, string>,

  comp1Metric: { ja: '生物学的効果', 'zh-TW': '生物學效應', 'zh-CN': '生物学效应', en: 'Biological Effect', ko: '생물학적 효과' } as Record<Language, string>,
  comp1XRay: { ja: 'X線：1.0倍', 'zh-TW': 'X射線：1.0倍', 'zh-CN': 'X射线：1.0倍', en: 'X-ray: 1.0x', ko: 'X선: 1.0배' } as Record<Language, string>,
  comp1Proton: { ja: '陽子線：1.1倍', 'zh-TW': '質子線：1.1倍', 'zh-CN': '质子线：1.1倍', en: 'Proton: 1.1x', ko: '양자선: 1.1배' } as Record<Language, string>,
  comp1Carbon: { ja: '重粒子線：2～3倍', 'zh-TW': '重粒子線：2～3倍', 'zh-CN': '重粒子线：2～3倍', en: 'Carbon Ion: 2-3x', ko: '중입자선: 2~3배' } as Record<Language, string>,

  comp2Metric: { ja: '治療期間', 'zh-TW': '治療期間', 'zh-CN': '治疗期间', en: 'Treatment Duration', ko: '치료 기간' } as Record<Language, string>,
  comp2XRay: { ja: 'X線：6～8週間', 'zh-TW': 'X射線：6～8週', 'zh-CN': 'X射线：6～8周', en: 'X-ray: 6-8 weeks', ko: 'X선: 6~8주' } as Record<Language, string>,
  comp2Proton: { ja: '陽子線：4～6週間', 'zh-TW': '質子線：4～6週', 'zh-CN': '质子线：4～6周', en: 'Proton: 4-6 weeks', ko: '양자선: 4~6주' } as Record<Language, string>,
  comp2Carbon: { ja: '重粒子線：1日～5週間', 'zh-TW': '重粒子線：1日～5週', 'zh-CN': '重粒子线：1日～5周', en: 'Carbon Ion: 1 day-5 weeks', ko: '중입자선: 1일~5주' } as Record<Language, string>,

  comp3Metric: { ja: '副作用', 'zh-TW': '副作用', 'zh-CN': '副作用', en: 'Side Effects', ko: '부작용' } as Record<Language, string>,
  comp3XRay: { ja: 'X線：中程度', 'zh-TW': 'X射線：中度', 'zh-CN': 'X射线：中度', en: 'X-ray: Moderate', ko: 'X선: 중등도' } as Record<Language, string>,
  comp3Proton: { ja: '陽子線：軽度', 'zh-TW': '質子線：輕度', 'zh-CN': '质子线：轻度', en: 'Proton: Mild', ko: '양자선: 경도' } as Record<Language, string>,
  comp3Carbon: { ja: '重粒子線：最小限', 'zh-TW': '重粒子線：最小', 'zh-CN': '重粒子线：最小', en: 'Carbon Ion: Minimal', ko: '중입자선: 최소한' } as Record<Language, string>,

  comp4Metric: { ja: '低酸素腫瘍効果', 'zh-TW': '低氧腫瘤效果', 'zh-CN': '低氧肿瘤效果', en: 'Hypoxic Tumor Effect', ko: '저산소 종양 효과' } as Record<Language, string>,
  comp4XRay: { ja: 'X線：限定的', 'zh-TW': 'X射線：有限', 'zh-CN': 'X射线：有限', en: 'X-ray: Limited', ko: 'X선: 제한적' } as Record<Language, string>,
  comp4Proton: { ja: '陽子線：限定的', 'zh-TW': '質子線：有限', 'zh-CN': '质子线：有限', en: 'Proton: Limited', ko: '양자선: 제한적' } as Record<Language, string>,
  comp4Carbon: { ja: '重粒子線：効果的', 'zh-TW': '重粒子線：有效', 'zh-CN': '重粒子线：有效', en: 'Carbon Ion: Effective', ko: '중입자선: 효과적' } as Record<Language, string>,

  // Heavy Ion Therapy Advantages
  advTag: { ja: '重粒子線治療の特徴', 'zh-TW': '重粒子線治療的特色', 'zh-CN': '重粒子线治疗的特色', en: 'Heavy Ion Therapy Features', ko: '중입자선 치료의 특징' } as Record<Language, string>,
  advTitle: { ja: '3つの大きなメリット', 'zh-TW': '三大優勢', 'zh-CN': '三大优势', en: 'Three Major Advantages', ko: '3대 장점' } as Record<Language, string>,

  adv1Title: { ja: '切らない・痛くない治療', 'zh-TW': '無需開刀、沒有疼痛', 'zh-CN': '无需开刀、没有疼痛', en: 'No Surgery, Painless', ko: '수술 없이·통증 없이' } as Record<Language, string>,
  adv1Desc: { ja: '体に傷をつけることなく治療が可能です。照射自体に痛みや灼熱感はありません。高齢の方や体力に不安のある方でも安心して治療を受けていただけます。', 'zh-TW': '無需在身體上造成傷口即可進行治療。照射本身不會感到疼痛或灼熱感。高齡者或體力較弱者也可以放心接受治療。', 'zh-CN': '无需在身体上造成伤口即可进行治疗。照射本身不会感到疼痛或灼热感。高龄者或体力较弱者也可以放心接受治疗。', en: 'Treatment without any incisions. No pain or burning sensation during irradiation. Safe and suitable for elderly patients or those with physical concerns.', ko: '신체에 상처를 내지 않고 치료가 가능합니다. 조사 자체에 통증이나 작열감은 없습니다. 고령자분이나 체력에 불안이 있는 분도 안심하고 치료를 받으실 수 있습니다.' } as Record<Language, string>,

  adv2Title: { ja: '腫瘍部に集中照射', 'zh-TW': '集中照射腫瘤部位', 'zh-CN': '集中照射肿瘤部位', en: 'Targeted Tumor Irradiation', ko: '종양부에 집중 조사' } as Record<Language, string>,
  adv2Desc: { ja: '重粒子線は腫瘍部分で大きなエネルギーを放出し、正常な組織への影響を最小限に抑えます。ブラッグピーク効果により、がん細胞を効果的に破壊しながら、周囲の重要臓器を守ります。', 'zh-TW': '重粒子線在腫瘤部位釋放大量能量,將對正常組織的影響降至最低。利用布拉格峰效應,在有效破壞癌細胞的同時,保護周圍重要器官。', 'zh-CN': '重粒子线在肿瘤部位释放大量能量,将对正常组织的影响降至最低。利用布拉格峰效应,在有效破坏癌细胞的同时,保护周围重要器官。', en: 'Heavy ions release maximum energy at the tumor site, minimizing impact on healthy tissue. The Bragg peak effect destroys cancer cells effectively while protecting surrounding vital organs.', ko: '중입자선은 종양 부분에서 큰 에너지를 방출하여 정상 조직에 대한 영향을 최소한으로 억제합니다. 브래그 피크 효과에 의해 암세포를 효과적으로 파괴하면서 주위의 중요 장기를 보호합니다.' } as Record<Language, string>,

  adv3Title: { ja: '短期集中治療', 'zh-TW': '短期集中治療', 'zh-CN': '短期集中治疗', en: 'Short Treatment Course', ko: '단기 집중 치료' } as Record<Language, string>,
  adv3Desc: { ja: '従来の放射線治療と比べて、治療回数・日数が大幅に短縮。病状により1日～5週間程度で治療完了。日常生活への影響を最小限に抑え、通院での治療も可能です。', 'zh-TW': '與傳統放射線治療相比,治療次數和天數大幅縮短。根據病情1日～5週左右即可完成治療。將對日常生活的影響降至最低,也可以門診治療。', 'zh-CN': '与传统放射线治疗相比,治疗次数和天数大幅缩短。根据病情1日～5周左右即可完成治疗。将对日常生活的影响降至最低,也可以门诊治疗。', en: 'Significantly fewer sessions and shorter duration compared to conventional radiotherapy. Treatment completes in 1 day to 5 weeks depending on condition. Minimal impact on daily life, outpatient treatment possible.', ko: '기존 방사선 치료에 비해 치료 횟수와 일수가 대폭 단축됩니다. 병상에 따라 1일~5주 정도로 치료가 완료됩니다. 일상생활에 대한 영향을 최소한으로 억제하며, 통원 치료도 가능합니다.' } as Record<Language, string>,

  // Consultation Services
  consultTag: { ja: '相談サービス', 'zh-TW': '諮詢服務', 'zh-CN': '咨询服务', en: 'Consultation Services', ko: '상담 서비스' } as Record<Language, string>,
  consultTitle: { ja: '治療開始までのサポート', 'zh-TW': '治療前支援服務', 'zh-CN': '治疗前支援服务', en: 'Pre-Treatment Support Services', ko: '치료 개시까지의 지원' } as Record<Language, string>,
  consultSubtitle: { ja: '専門スタッフが治療の可能性を一緒に探ります', 'zh-TW': '專業團隊與您共同探討治療可行性', 'zh-CN': '专业团队与您共同探讨治疗可行性', en: 'Our specialists work with you to explore treatment possibilities', ko: '전문 스태프가 치료 가능성을 함께 탐색합니다' } as Record<Language, string>,

  // Service 1: Initial Consultation
  service1Name: { ja: '前期相談サービス', 'zh-TW': '前期諮詢服務', 'zh-CN': '前期咨询服务', en: 'Initial Consultation', ko: '초기 상담' } as Record<Language, string>,
  service1Desc: { ja: '病歴資料翻訳、重粒子線治療適応性評価、治療計劃初步討論、費用概算', 'zh-TW': '病歷資料翻譯、重粒子線治療適應性評估、治療計劃初步討論、費用概算', 'zh-CN': '病历资料翻译、重粒子线治疗适应性评估、治疗计划初步讨论、费用概算', en: 'Medical record translation, suitability assessment, initial treatment planning, cost estimation', ko: '병력 자료 번역, 중입자선 치료 적응성 평가, 치료 계획 초기 논의, 비용 개산' } as Record<Language, string>,
  service1Feature1: { ja: '診療情報の翻訳（中→日）', 'zh-TW': '病歷資料翻譯（中→日）', 'zh-CN': '病历资料翻译（中→日）', en: 'Medical record translation (CN→JP)', ko: '진료 기록 번역(중→일)' } as Record<Language, string>,
  service1Feature2: { ja: '重粒子線治療適応性評価', 'zh-TW': '重粒子線治療適應性評估', 'zh-CN': '重粒子线治疗适应性评估', en: 'Heavy ion therapy suitability assessment', ko: '중입자선 치료 적응성 평가' } as Record<Language, string>,
  service1Feature3: { ja: '治療可能性評価レポート', 'zh-TW': '治療可行性評估報告', 'zh-CN': '治疗可行性评估报告', en: 'Treatment feasibility report', ko: '치료 가능성 평가 보고서' } as Record<Language, string>,
  service1Feature4: { ja: '費用概算のご説明', 'zh-TW': '費用概算說明', 'zh-CN': '费用概算说明', en: 'Cost estimation', ko: '비용 개산 설명' } as Record<Language, string>,

  // Service 2: Remote Consultation
  service2Name: { ja: '遠隔会診サービス', 'zh-TW': '遠程會診服務', 'zh-CN': '远程会诊服务', en: 'Remote Consultation', ko: '원격 진료' } as Record<Language, string>,
  service2Desc: { ja: '重粒子線治療専門医とのビデオ診察、治療適応性と方案の討論、費用詳細說明', 'zh-TW': '與重粒子線治療專家遠程視頻會診、討論治療適應性與方案、費用詳細說明', 'zh-CN': '与重粒子线治疗专家远程视频会诊、讨论治疗适应性与方案、费用详细说明', en: 'Video consultation with specialists, treatment plan discussion, detailed cost breakdown', ko: '중입자선 치료 전문의와의 화상 진찰, 치료 적응성과 방안 논의, 비용 상세 설명' } as Record<Language, string>,
  service2Feature1: { ja: '専門医とのビデオ診察（30-60分）', 'zh-TW': '專科醫生視頻會診（30-60分鐘）', 'zh-CN': '专科医生视频会诊（30-60分钟）', en: 'Video consultation with specialist (30-60 mins)', ko: '전문의와의 화상 진찰(30-60분)' } as Record<Language, string>,
  service2Feature2: { ja: '専門医療通訳が全行程同行', 'zh-TW': '專業醫療翻譯全程陪同', 'zh-CN': '专业医疗翻译全程陪同', en: 'Professional medical interpreter throughout', ko: '전문 의료 통역이 전 과정 동행' } as Record<Language, string>,
  service2Feature3: { ja: '詳細な治療計画のご説明', 'zh-TW': '詳細治療方案說明', 'zh-CN': '详细治疗方案说明', en: 'Detailed treatment plan explanation', ko: '상세 치료 계획 설명' } as Record<Language, string>,
  service2Feature4: { ja: '治療費用の明細見積', 'zh-TW': '治療費用明細報價', 'zh-CN': '治疗费用明细报价', en: 'Detailed cost quotation', ko: '치료비 상세 견적' } as Record<Language, string>,

  serviceLearnMore: { ja: '詳細を見る', 'zh-TW': '查看詳情', 'zh-CN': '查看详情', en: 'Learn More', ko: '자세히 보기' } as Record<Language, string>,

  // Applicable Cancers
  cancerTag: { ja: '適応がん種', 'zh-TW': '適應癌症', 'zh-CN': '适应癌症', en: 'Applicable Cancers', ko: '적응 암종' } as Record<Language, string>,
  cancerTitle: { ja: '重粒子線治療の対象となる主ながん', 'zh-TW': '重粒子線治療的主要適應癌症', 'zh-CN': '重粒子线治疗的主要适应癌症', en: 'Main Cancer Types Treatable with Heavy Ion Therapy', ko: '중입자선 치료 대상 주요 암' } as Record<Language, string>,
  cancerNote: { ja: '※病状により適応可否が判断されます。詳しくはご相談ください。', 'zh-TW': '※根據病情判斷是否適用。詳情請諮詢。', 'zh-CN': '※根据病情判断是否适用。详情请咨询。', en: '※Applicability determined based on individual condition. Please consult for details.', ko: '※병상에 따라 적응 가부가 판단됩니다. 자세한 내용은 상담해 주십시오.' } as Record<Language, string>,

  // Treatment Process
  processTag: { ja: '治療の流れ', 'zh-TW': '治療流程', 'zh-CN': '治疗流程', en: 'Treatment Process', ko: '치료 프로세스' } as Record<Language, string>,
  processTitle: { ja: '初診から治療完了まで', 'zh-TW': '從初診到治療完成', 'zh-CN': '从初诊到治疗完成', en: 'From First Consultation to Treatment Completion', ko: '초진부터 치료 완료까지' } as Record<Language, string>,

  step1: { ja: '相談・初診', 'zh-TW': '諮詢・初診', 'zh-CN': '咨询·初诊', en: 'Consultation', ko: '상담·초진' } as Record<Language, string>,
  step1Desc: { ja: '現在の病状、検査結果をもとに治療の適応を判断します。', 'zh-TW': '根據目前病情和檢查結果判斷治療適應性。', 'zh-CN': '根据目前病情和检查结果判断治疗适应性。', en: 'Assess treatment applicability based on current condition and test results.', ko: '현재의 병상과 검사 결과를 토대로 치료 적응을 판단합니다.' } as Record<Language, string>,

  step2: { ja: '治療計画CT', 'zh-TW': '治療計劃CT', 'zh-CN': '治疗计划CT', en: 'Treatment Planning CT', ko: '치료 계획 CT' } as Record<Language, string>,
  step2Desc: { ja: '固定具を作成し、CT撮影で治療計画を立案します。', 'zh-TW': '製作固定器具,通過CT攝影制定治療計劃。', 'zh-CN': '制作固定器具,通过CT摄影制定治疗计划。', en: 'Create immobilization devices and CT imaging for treatment planning.', ko: '고정구를 제작하고, CT 촬영으로 치료 계획을 수립합니다.' } as Record<Language, string>,

  step3: { ja: '治療開始', 'zh-TW': '開始治療', 'zh-CN': '开始治疗', en: 'Treatment Begins', ko: '치료 개시' } as Record<Language, string>,
  step3Desc: { ja: '1回約30分、通院または入院で治療を実施します。', 'zh-TW': '每次約30分鐘,可通過門診或住院進行治療。', 'zh-CN': '每次约30分钟,可通过门诊或住院进行治疗。', en: 'Approximately 30 minutes per session, outpatient or inpatient.', ko: '1회 약 30분, 통원 또는 입원으로 치료를 실시합니다.' } as Record<Language, string>,

  step4: { ja: '経過観察', 'zh-TW': '追蹤觀察', 'zh-CN': '追踪观察', en: 'Follow-up', ko: '경과 관찰' } as Record<Language, string>,
  step4Desc: { ja: '治療効果の確認と副作用のチェックを定期的に実施します。', 'zh-TW': '定期確認治療效果和檢查副作用。', 'zh-CN': '定期确认治疗效果和检查副作用。', en: 'Regular monitoring of treatment effects and side effect checks.', ko: '치료 효과 확인과 부작용 점검을 정기적으로 실시합니다.' } as Record<Language, string>,

  // Facility
  facilityTag: { ja: '施設・設備', 'zh-TW': '設施・設備', 'zh-CN': '设施·设备', en: 'Facilities & Equipment', ko: '시설·설비' } as Record<Language, string>,
  facilityTitle: { ja: '先進的な小型化装置', 'zh-TW': '先進的小型化裝置', 'zh-CN': '先进的小型化装置', en: 'Advanced Miniaturized System', ko: '선진적 소형화 장치' } as Record<Language, string>,
  facilityDesc: { ja: '従来の装置と比べて約1/3の設置面積を実現。全ての治療室で360度回転ガントリーによるスキャン照射が可能です。患者様の負担を最小限に抑える先進的な治療環境を提供します。', 'zh-TW': '與傳統裝置相比,安裝面積約為1/3。所有治療室均可進行360度旋轉機架的掃描照射。提供將患者負擔降至最低的先進治療環境。', 'zh-CN': '与传统装置相比,安装面积约为1/3。所有治疗室均可进行360度旋转机架的扫描照射。提供将患者负担降至最低的先进治疗环境。', en: 'Installation footprint approximately 1/3 of conventional systems. All treatment rooms equipped with 360-degree rotating gantry for scanning irradiation. Advanced treatment environment minimizing patient burden.', ko: '기존 장치에 비해 약 1/3의 설치 면적을 실현하였습니다. 모든 치료실에서 360도 회전 갠트리에 의한 스캔 조사가 가능합니다. 환자분의 부담을 최소한으로 억제하는 첨단 치료 환경을 제공합니다.' } as Record<Language, string>,

  // Access
  accessTag: { ja: 'アクセス', 'zh-TW': '交通指南', 'zh-CN': '交通指南', en: 'Access', ko: '오시는 길' } as Record<Language, string>,
  accessTitle: { ja: '大阪重粒子線センター', 'zh-TW': '大阪重粒子線中心', 'zh-CN': '大阪重粒子线中心', en: 'Osaka Heavy Ion Therapy Center', ko: '오사카 중입자선 센터' } as Record<Language, string>,
  address: { ja: '〒540-0008 大阪府大阪市中央区大手前3丁目1番10号', 'zh-TW': '〒540-0008 大阪府大阪市中央區大手前3丁目1番10號', 'zh-CN': '〒540-0008 大阪府大阪市中央区大手前3丁目1番10号', en: '3-1-10 Otemae, Chuo-ku, Osaka 540-0008, Japan', ko: '〒540-0008 오사카부 오사카시 주오구 오테마에 3쵸메 1번 10호' } as Record<Language, string>,
  accessInfo: { ja: '地下鉄谷町線・京阪本線「天満橋」駅より徒歩約15分\n地下鉄谷町線・中央線「谷町四丁目」駅より徒歩約10分', 'zh-TW': '地鐵谷町線・京阪本線「天滿橋」站步行約15分鐘\n地鐵谷町線・中央線「谷町四丁目」站步行約10分鐘', 'zh-CN': '地铁谷町线·京阪本线「天满桥」站步行约15分钟\n地铁谷町线·中央线「谷町四丁目」站步行约10分钟', en: 'Approx. 15 min walk from Temmabashi Station (Subway Tanimachi Line / Keihan Main Line)\nApprox. 10 min walk from Tanimachi Yonchome Station (Subway Tanimachi Line / Chuo Line)', ko: '지하철 다니마치선·게이한 본선 「덴마바시」역에서 도보 약 15분\n지하철 다니마치선·주오선 「다니마치욘초메」역에서 도보 약 10분' } as Record<Language, string>,

  // FAQ
  faqTag: { ja: 'よくある質問', 'zh-TW': '常見問題', 'zh-CN': '常见问题', en: 'FAQ', ko: '자주 묻는 질문' } as Record<Language, string>,
  faqTitle: { ja: 'よくいただくご質問', 'zh-TW': '常見問題', 'zh-CN': '常见问题', en: 'Frequently Asked Questions', ko: '자주 묻는 질문' } as Record<Language, string>,

  // CTA
  ctaTitle: { ja: 'まずは無料相談から', 'zh-TW': '從免費諮詢開始', 'zh-CN': '从免费咨询开始', en: 'Start with a Free Consultation', ko: '먼저 무료 상담부터' } as Record<Language, string>,
  ctaSub: { ja: '重粒子線治療に関するご相談は、専門スタッフが丁寧にご対応いたします', 'zh-TW': '關於重粒子線治療的諮詢,由專業人員為您細心解答', 'zh-CN': '关于重粒子线治疗的咨询,由专业人员为您细心解答', en: 'Our specialists will carefully guide you through your heavy ion therapy options', ko: '중입자선 치료에 관한 상담은 전문 스태프가 정성껏 대응해 드립니다' } as Record<Language, string>,
  ctaChinese: { ja: '中国語対応可能', 'zh-TW': '支援中文服務', 'zh-CN': '支持中文服务', en: 'Chinese Support Available', ko: '중국어 대응 가능' } as Record<Language, string>,
};

// FAQ data
const faqData: { q: Record<Language, string>; a: Record<Language, string> }[] = [
  {
    q: { ja: '重粒子線治療とは何ですか？', 'zh-TW': '什麼是重粒子線治療？', 'zh-CN': '什么是重粒子线治疗？', en: 'What is heavy ion therapy?', ko: '중입자선 치료란 무엇입니까?' },
    a: { ja: '炭素イオンを光速の約70%まで加速し、がん細胞にピンポイントで照射する治療法です。通常の放射線（X線）と比べて約3倍の生物学的効果があり、正常組織への影響を抑えながら、がん細胞を効果的に破壊できます。', 'zh-TW': '將碳離子加速至光速約70%,對癌細胞進行精準照射的治療方法。與普通放射線(X射線)相比具有約3倍的生物學效果,在抑制對正常組織影響的同時,能有效破壞癌細胞。', 'zh-CN': '将碳离子加速至光速约70%,对癌细胞进行精准照射的治疗方法。与普通放射线(X射线)相比具有约3倍的生物学效果,在抑制对正常组织影响的同时,能有效破坏癌细胞。', en: 'A treatment method that accelerates carbon ions to approximately 70% of light speed and precisely irradiates cancer cells. Compared to conventional radiation (X-rays), it has about 3 times the biological effect, effectively destroying cancer cells while minimizing impact on healthy tissue.', ko: '탄소이온을 광속의 약 70%까지 가속하여 암세포에 정밀하게 조사하는 치료법입니다. 일반 방사선(X선)에 비해 약 3배의 생물학적 효과가 있으며, 정상 조직에 대한 영향을 억제하면서 암세포를 효과적으로 파괴할 수 있습니다.' },
  },
  {
    q: { ja: '治療期間はどのくらいですか？', 'zh-TW': '治療期間是多久？', 'zh-CN': '治疗期间是多久？', en: 'How long is the treatment period?', ko: '치료 기간은 얼마나 됩니까?' },
    a: { ja: '病状により異なりますが、1日から5週間程度です。例えば前立腺がんは約4週間（12回）、肝臓がんは約2週間（2-8回）、肺がんは約1-2週間（1-4回）が標準的です。初診からCT撮影・治療計画までに約1-2週間かかります。', 'zh-TW': '根據病情不同,從1日到5週左右。例如前列腺癌約4週(12次),肝癌約2週(2-8次),肺癌約1-2週(1-4次)為標準。從初診到CT攝影・治療計劃約需1-2週。', 'zh-CN': '根据病情不同,从1日到5周左右。例如前列腺癌约4周(12次),肝癌约2周(2-8次),肺癌约1-2周(1-4次)为标准。从初诊到CT摄影·治疗计划约需1-2周。', en: 'Varies by condition, ranging from 1 day to 5 weeks. For example, prostate cancer typically requires about 4 weeks (12 sessions), liver cancer about 2 weeks (2-8 sessions), lung cancer about 1-2 weeks (1-4 sessions). Initial consultation to CT imaging and treatment planning takes approximately 1-2 weeks.', ko: '병상에 따라 다르지만, 1일에서 5주 정도입니다. 예를 들어 전립선암은 약 4주(12회), 간암은 약 2주(2~8회), 폐암은 약 1~2주(1~4회)가 표준적입니다. 초진부터 CT 촬영 및 치료 계획 수립까지 약 1~2주가 소요됩니다.' },
  },
  {
    q: { ja: '痛みはありますか？', 'zh-TW': '會有疼痛嗎？', 'zh-CN': '会有疼痛吗？', en: 'Is there any pain?', ko: '통증이 있습니까?' },
    a: { ja: '照射自体に痛みや灼熱感はありません。治療中は治療台に横になっているだけで、体に何も感じません。ただし、固定具の装着や長時間同じ姿勢を保つことで、多少の不快感を感じる場合があります。', 'zh-TW': '照射本身不會感到疼痛或灼熱感。治療中只需躺在治療台上,身體不會感到任何不適。但是,佩戴固定器具和長時間保持同一姿勢可能會感到些許不適。', 'zh-CN': '照射本身不会感到疼痛或灼热感。治疗中只需躺在治疗台上,身体不会感到任何不适。但是,佩戴固定器具和长时间保持同一姿势可能会感到些许不适。', en: 'The irradiation itself causes no pain or burning sensation. During treatment, you simply lie on the treatment table and feel nothing in your body. However, you may experience slight discomfort from wearing immobilization devices or maintaining the same position for an extended period.', ko: '조사 자체에 통증이나 작열감은 없습니다. 치료 중에는 치료대에 누워 계시기만 하면 되며, 신체에 아무런 느낌이 없습니다. 다만 고정구 착용이나 장시간 같은 자세를 유지하는 것에 의해 다소 불편함을 느끼실 수 있습니다.' },
  },
  {
    q: { ja: '副作用はありますか？', 'zh-TW': '有副作用嗎？', 'zh-CN': '有副作用吗？', en: 'Are there side effects?', ko: '부작용이 있습니까?' },
    a: { ja: '照射部位により異なりますが、通常の放射線治療と比べて副作用は軽度です。主な副作用として、照射部位の皮膚炎、倦怠感、照射部位近くの臓器の炎症（肺炎、食道炎など）があります。多くは一時的で、治療終了後に改善します。', 'zh-TW': '根據照射部位不同,但與普通放射線治療相比副作用較輕。主要副作用包括照射部位的皮膚炎、倦怠感、照射部位附近器官的炎症(肺炎、食道炎等)。大多是暫時性的,治療結束後會改善。', 'zh-CN': '根据照射部位不同,但与普通放射线治疗相比副作用较轻。主要副作用包括照射部位的皮肤炎、倦怠感、照射部位附近器官的炎症(肺炎、食道炎等)。大多是暂时性的,治疗结束后会改善。', en: 'Varies by irradiation site, but side effects are generally milder than conventional radiotherapy. Main side effects include dermatitis at the irradiation site, fatigue, and inflammation of organs near the irradiation site (pneumonitis, esophagitis, etc.). Most are temporary and improve after treatment completion.', ko: '조사 부위에 따라 다르지만, 일반 방사선 치료에 비해 부작용은 경미합니다. 주요 부작용으로는 조사 부위의 피부염, 권태감, 조사 부위 인근 장기의 염증(폐렴, 식도염 등)이 있습니다. 대부분 일시적이며, 치료 종료 후 개선됩니다.' },
  },
  {
    q: { ja: 'どのような人が治療を受けられますか？', 'zh-TW': '什麼樣的人可以接受治療？', 'zh-CN': '什么样的人可以接受治疗？', en: 'Who can receive treatment?', ko: '어떤 분이 치료를 받을 수 있습니까?' },
    a: { ja: '基本条件は以下の通りです: ①局所性固形腫瘍であること ②同一部位への放射線治療歴がないこと ③約30分間安静に横たわれること ④PS（全身状態）が0-2であること ⑤患者様ご自身ががんの診断を認識していること。詳しい適応判断は初診時に行います。', 'zh-TW': '基本條件如下: ①局部性實體腫瘤 ②同一部位無放射線治療史 ③能安靜躺臥約30分鐘 ④PS(全身狀態)為0-2 ⑤患者本人知曉癌症診斷。詳細適應性判斷在初診時進行。', 'zh-CN': '基本条件如下: ①局部性实体肿瘤 ②同一部位无放射线治疗史 ③能安静躺卧约30分钟 ④PS(全身状态)为0-2 ⑤患者本人知晓癌症诊断。详细适应性判断在初诊时进行。', en: 'Basic conditions: ① Localized solid tumor ② No prior radiation therapy to the same site ③ Ability to lie still for approximately 30 minutes ④ Performance Status (PS) 0-2 ⑤ Patient awareness of cancer diagnosis. Detailed applicability assessment conducted during initial consultation.', ko: '기본 조건은 다음과 같습니다: ①국소성 고형종양일 것 ②동일 부위에 방사선 치료 이력이 없을 것 ③약 30분간 안정적으로 누워 있을 수 있을 것 ④PS(전신상태)가 0~2일 것 ⑤환자 본인이 암 진단을 인지하고 있을 것. 상세한 적응 판단은 초진 시에 실시합니다.' },
  },
  {
    q: { ja: '費用はどのくらいですか？', 'zh-TW': '費用是多少？', 'zh-CN': '费用是多少？', en: 'What is the cost?', ko: '비용은 얼마입니까?' },
    a: { ja: '重粒子線治療は先進医療として実施されており、治療費は全額自己負担となります。費用は病状により異なりますが、一般的に300万円前後です。ただし、診察・検査・入院費用などは健康保険が適用されます。また、一部のがん種は保険診療として認められています。', 'zh-TW': '重粒子線治療作為先進醫療實施,治療費用全額自費。費用根據病情不同,一般約300萬日元左右。但是,診察・檢查・住院費用等可使用健康保險。此外,部分癌症已被認定為保險診療。', 'zh-CN': '重粒子线治疗作为先进医疗实施,治疗费用全额自费。费用根据病情不同,一般约300万日元左右。但是,诊察·检查·住院费用等可使用健康保险。此外,部分癌症已被认定为保险诊疗。', en: 'Heavy ion therapy is provided as advanced medical treatment, with treatment costs fully self-paid. Costs vary by condition but typically around 3 million yen. However, consultations, tests, and hospitalization costs are covered by health insurance. Additionally, some cancer types are approved for insurance coverage.', ko: '중입자선 치료는 선진의료로서 시행되고 있으며, 치료비는 전액 자기부담입니다. 비용은 병상에 따라 다르지만, 일반적으로 약 300만 엔 정도입니다. 다만 진찰·검사·입원 비용 등에는 건강보험이 적용됩니다. 또한 일부 암종은 보험진료로 인정되고 있습니다.' },
  },
  {
    q: { ja: '海外からの受診は可能ですか？', 'zh-TW': '可以從海外就診嗎？', 'zh-CN': '可以从海外就诊吗？', en: 'Can international patients receive treatment?', ko: '해외에서의 진료가 가능합니까?' },
    a: { ja: 'はい、可能です。事前に診療情報（病理診断、画像検査など）を提出いただき、適応可否を判断します。中国語対応スタッフがおりますので、言語の心配はありません。ビザ取得、宿泊先手配などのサポートも可能です。', 'zh-TW': '是的,可以。請事先提交診療資訊(病理診斷、影像檢查等),我們將判斷適應性。有中文對應人員,無需擔心語言問題。也可支援簽證取得、住宿安排等。', 'zh-CN': '是的,可以。请事先提交诊疗信息(病理诊断、影像检查等),我们将判断适应性。有中文对应人员,无需担心语言问题。也可支援签证取得、住宿安排等。', en: 'Yes, it is possible. Please submit medical information (pathology diagnosis, imaging tests, etc.) in advance for applicability assessment. Chinese-speaking staff are available, so language is not a concern. We can also assist with visa acquisition and accommodation arrangements.', ko: '네, 가능합니다. 사전에 진료 정보(병리 진단, 영상 검사 등)를 제출해 주시면 적응 가부를 판단합니다. 중국어 대응 직원이 있으므로 언어 걱정은 없습니다. 비자 취득, 숙소 수배 등의 지원도 가능합니다.' },
  },
  {
    q: { ja: '治療後の生活はどうなりますか？', 'zh-TW': '治療後的生活會如何？', 'zh-CN': '治疗后的生活会如何？', en: 'What is life like after treatment?', ko: '치료 후 생활은 어떻습니까?' },
    a: { ja: '治療終了後は定期的な経過観察が必要です。CT/MRI/PETなどの画像検査と血液検査により、治療効果の確認と副作用のチェックを行います。多くの患者様は治療終了後も通常の日常生活を送ることができます。仕事への復帰も可能です。', 'zh-TW': '治療結束後需要定期追蹤觀察。通過CT/MRI/PET等影像檢查和血液檢查,確認治療效果和檢查副作用。大多數患者在治療結束後可以過正常的日常生活。也可以重返工作。', 'zh-CN': '治疗结束后需要定期追踪观察。通过CT/MRI/PET等影像检查和血液检查,确认治疗效果和检查副作用。大多数患者在治疗结束后可以过正常的日常生活。也可以重返工作。', en: 'Regular follow-up is required after treatment completion. CT/MRI/PET imaging and blood tests are performed to confirm treatment effects and check for side effects. Most patients can resume normal daily life after treatment. Return to work is also possible.', ko: '치료 종료 후에는 정기적인 경과 관찰이 필요합니다. CT/MRI/PET 등의 영상 검사와 혈액 검사를 통해 치료 효과 확인 및 부작용 점검을 실시합니다. 대부분의 환자분은 치료 종료 후에도 정상적인 일상생활을 영위하실 수 있습니다. 직장 복귀도 가능합니다.' },
  },
];

// Cancer types
const cancerTypes = [
  { icon: <Brain size={18} />, ja: '頭頸部がん', tw: '頭頸部癌', cn: '头颈部癌', en: 'Head & Neck Cancer', ko: '두경부암' },
  { icon: <Activity size={18} />, ja: '肺がん', tw: '肺癌', cn: '肺癌', en: 'Lung Cancer', ko: '폐암' },
  { icon: <Heart size={18} />, ja: '肝臓がん', tw: '肝癌', cn: '肝癌', en: 'Liver Cancer', ko: '간암' },
  { icon: <Stethoscope size={18} />, ja: '前立腺がん', tw: '前列腺癌', cn: '前列腺癌', en: 'Prostate Cancer', ko: '전립선암' },
  { icon: <Microscope size={18} />, ja: '膵臓がん', tw: '胰臟癌', cn: '胰脏癌', en: 'Pancreatic Cancer', ko: '췌장암' },
  { icon: <Shield size={18} />, ja: '骨軟部腫瘍', tw: '骨軟部腫瘤', cn: '骨软部肿瘤', en: 'Bone/Soft Tissue Tumors', ko: '골·연부종양' },
  { icon: <Target size={18} />, ja: '直腸がん', tw: '直腸癌', cn: '直肠癌', en: 'Rectal Cancer', ko: '직장암' },
  { icon: <Zap size={18} />, ja: '子宮がん', tw: '子宮癌', cn: '子宫癌', en: 'Uterine Cancer', ko: '자궁암' },
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

      {/* ===== 3.5 SCIENCE BEHIND HEAVY ION THERAPY ===== */}
      <section className="py-20 bg-gradient-to-b from-[#f6f6f6] to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.scienceTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-4">{t.scienceTitle[lang]}</h2>
            <p className="text-[#555] max-w-4xl mx-auto leading-relaxed">{t.scienceIntro[lang]}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bragg Peak Effect */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#0056b3]">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#0056b3]/10 p-3 rounded-lg">
                  <Target size={28} className="text-[#0056b3]" />
                </div>
                <h3 className="text-xl font-bold text-[#333]">{t.braggPeakTitle[lang]}</h3>
              </div>
              <p className="text-[#555] leading-relaxed">{t.braggPeakDesc[lang]}</p>
            </div>

            {/* Carbon Ion Biological Effectiveness */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#00A6E0]">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#00A6E0]/10 p-3 rounded-lg">
                  <Microscope size={28} className="text-[#00A6E0]" />
                </div>
                <h3 className="text-xl font-bold text-[#333]">{t.carbonIonTitle[lang]}</h3>
              </div>
              <p className="text-[#555] leading-relaxed">{t.carbonIonDesc[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3.6 CLINICAL COMPARISON DATA ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0056b3]/10 text-[#0056b3] text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {t.comparisonTag[lang]}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-2">{t.comparisonTitle[lang]}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Biological Effect */}
            <div className="bg-gradient-to-br from-[#f6f6f6] to-white rounded-xl shadow-md p-6 border-t-4 border-[#0056b3]">
              <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                <Activity size={20} className="text-[#0056b3]" />
                {t.comp1Metric[lang]}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-[#555]">{t.comp1XRay[lang]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-[#555]">{t.comp1Proton[lang]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0056b3]"></div>
                  <span className="text-sm font-bold text-[#0056b3]">{t.comp1Carbon[lang]}</span>
                </div>
              </div>
            </div>

            {/* Treatment Duration */}
            <div className="bg-gradient-to-br from-[#f6f6f6] to-white rounded-xl shadow-md p-6 border-t-4 border-[#00A6E0]">
              <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                <Clock size={20} className="text-[#00A6E0]" />
                {t.comp2Metric[lang]}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-[#555]">{t.comp2XRay[lang]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-[#555]">{t.comp2Proton[lang]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00A6E0]"></div>
                  <span className="text-sm font-bold text-[#00A6E0]">{t.comp2Carbon[lang]}</span>
                </div>
              </div>
            </div>

            {/* Side Effects */}
            <div className="bg-gradient-to-br from-[#f6f6f6] to-white rounded-xl shadow-md p-6 border-t-4 border-[#28a745]">
              <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                <Shield size={20} className="text-[#28a745]" />
                {t.comp3Metric[lang]}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-[#555]">{t.comp3XRay[lang]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-[#555]">{t.comp3Proton[lang]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#28a745]"></div>
                  <span className="text-sm font-bold text-[#28a745]">{t.comp3Carbon[lang]}</span>
                </div>
              </div>
            </div>

            {/* Hypoxic Tumor Effect */}
            <div className="bg-gradient-to-br from-[#f6f6f6] to-white rounded-xl shadow-md p-6 border-t-4 border-[#ff6b6b]">
              <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                <Heart size={20} className="text-[#ff6b6b]" />
                {t.comp4Metric[lang]}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-[#555]">{t.comp4XRay[lang]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-[#555]">{t.comp4Proton[lang]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b6b]"></div>
                  <span className="text-sm font-bold text-[#ff6b6b]">{t.comp4Carbon[lang]}</span>
                </div>
              </div>
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
              { icon: <Zap size={24} />, label: { ja: 'スキャン照射', 'zh-TW': '掃描照射', 'zh-CN': '扫描照射', en: 'Scanning Irradiation', ko: '스캔 조사' } },
              { icon: <Award size={24} />, label: { ja: '小型化装置', 'zh-TW': '小型化裝置', 'zh-CN': '小型化装置', en: 'Miniaturized System', ko: '소형화 장치' } },
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

      {/* ===== 10. CTA (standalone only) ===== */}
      {!isGuideEmbed && (
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
      )}

      {/* ━━━━━━━━ Medical Disclaimer ━━━━━━━━ */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <ul className="space-y-1.5 text-xs text-gray-500 leading-relaxed">
            <li>※ {{ ja: '重粒子線治療は先進医療に該当し、技術料は自己負担（約314万円）となります。診察・検査・入院費は保険適用です。', 'zh-TW': '重粒子線治療屬於先進醫療，技術費需自費（約314萬日圓）。診察・檢查・住院費適用保險。', 'zh-CN': '重粒子线治疗属于先进医疗，技术费需自费（约314万日元）。诊察・检查・住院费适用保险。', en: 'Carbon-ion therapy is classified as advanced medicine. The technical fee (approx. ¥3.14M) is self-pay; consultation, testing, and hospitalization are insurance-covered.' }[lang]}</li>
            <li>※ {{ ja: '治療効果には個人差があり、すべての患者に同様の効果を保証するものではありません。', 'zh-TW': '治療效果因人而異，不保證所有患者均能獲得相同效果。', 'zh-CN': '治疗效果因人而异，不保证所有患者均能获得相同效果。', en: 'Treatment effects vary by individual and are not guaranteed for all patients.' }[lang]}</li>
            <li>※ {{ ja: '当社（新島交通株式会社・大阪府知事登録旅行業 第2-3115号）は旅行業者であり、医療機関ではありません。医療行為は各提携医療機関が提供します。', 'zh-TW': '本公司（新島交通株式會社・大阪府知事登錄旅行業 第2-3115號）為旅行業者，非醫療機構。醫療行為由各合作醫療機構提供。', 'zh-CN': '本公司（新岛交通株式会社・大阪府知事登录旅行业 第2-3115号）为旅行业者，非医疗机构。医疗行为由各合作医疗机构提供。', en: 'Niijima Kotsu Co., Ltd. (Osaka Gov. Registered Travel Agency No. 2-3115) is a travel agency, not a medical institution. Medical services are provided by partner facilities.' }[lang]}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
