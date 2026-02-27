'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, Train,
  Award, Shield, Heart, Brain,
  Syringe, Microscope, Sparkles, CheckCircle,
  ArrowRight, Globe, Activity,
  Dna, FlaskConical, Beaker, ShieldCheck, Droplets,
  GraduationCap, Building2, CircleDot,
  Zap, Leaf, Users, Star,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// ======================================
// Hero 图片（白标首图映射用）
// ======================================
export const CELL_MEDICINE_HERO_IMAGE = 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2000&auto=format&fit=crop';

// ======================================
// 多语言翻译
// ======================================
const t = {
  // Hero
  heroTagline: {
    ja: '兵庫医科大学発 先端細胞医療',
    'zh-TW': '兵庫醫科大學 先端細胞醫療',
    'zh-CN': '兵库医科大学 先端细胞医疗',
    en: 'Hyogo Medical University - Advanced Cell Medicine',
  } as Record<Language, string>,
  heroTitle: {
    ja: '先端細胞医療センター',
    'zh-TW': '先端細胞醫療中心',
    'zh-CN': '先端细胞医疗中心',
    en: 'Advanced Cell Medicine Center',
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '兵庫医科大学 · 自己がんワクチン × iPS細胞バンキング',
    'zh-TW': '兵庫醫科大學 · 自體癌症疫苗 × iPS細胞儲存',
    'zh-CN': '兵库医科大学 · 自体癌症疫苗 × iPS细胞储存',
    en: 'Hyogo Medical Univ. · Autologous Cancer Vaccine × iPS Cell Banking',
  } as Record<Language, string>,
  heroText: {
    ja: '理化学研究所・筑波大学発ベンチャー「セルメディシン」の\n自己がんワクチン療法（累計4,000例以上）と、\n山中伸弥教授共同研究者が創業したiPeaceの\niPS細胞バンキングサービスを提供。',
    'zh-TW': '由理化學研究所・筑波大學創投企業「Cell-Medicine」提供\n自體癌症疫苗療法（累計4,000例以上），\n以及山中伸彌教授共同研究者創辦的iPeace\niPS細胞儲存服務。',
    'zh-CN': '由理化学研究所·筑波大学创投企业「Cell-Medicine」提供\n自体癌症疫苗疗法（累计4,000例以上），\n以及山中伸弥教授共同研究者创办的iPeace\niPS细胞储存服务。',
    en: 'Offering Cell-Medicine autologous cancer vaccine therapy\n(4,000+ cumulative cases) from RIKEN & Tsukuba University venture,\nand iPeace iPS cell banking service co-founded by\nProf. Yamanaka\'s research collaborator.',
  } as Record<Language, string>,
  heroBadge: {
    ja: '理研・筑波大発ベンチャー技術',
    'zh-TW': '理研・筑波大創投技術',
    'zh-CN': '理研·筑波大创投技术',
    en: 'RIKEN & Tsukuba University Venture Technology',
  } as Record<Language, string>,

  // Stats
  statCases: { ja: '累計症例', 'zh-TW': '累計病例', 'zh-CN': '累计病例', en: 'Cumulative Cases' } as Record<Language, string>,
  statHospitals: { ja: '契約医療機関', 'zh-TW': '合作醫療機構', 'zh-CN': '合作医疗机构', en: 'Partner Hospitals' } as Record<Language, string>,
  statHistory: { ja: '研究開発歴', 'zh-TW': '研發歷史', 'zh-CN': '研发历史', en: 'R&D History' } as Record<Language, string>,
  statSafety: { ja: '重篤副作用', 'zh-TW': '重大副作用', 'zh-CN': '重大副作用', en: 'Serious Side Effects' } as Record<Language, string>,

  // Cancer Vaccine Section
  vaccineTag: {
    ja: '自己がんワクチン',
    'zh-TW': '自體癌症疫苗',
    'zh-CN': '自体癌症疫苗',
    en: 'Autologous Cancer Vaccine',
  } as Record<Language, string>,
  vaccineTitle: {
    ja: 'Cell-Medicine 自己がんワクチン療法',
    'zh-TW': 'Cell-Medicine 自體癌症疫苗療法',
    'zh-CN': 'Cell-Medicine 自体癌症疫苗疗法',
    en: 'Cell-Medicine Autologous Cancer Vaccine Therapy',
  } as Record<Language, string>,
  vaccineDesc: {
    ja: '患者自身のがん組織（ホルマリン固定パラフィン包埋検体）からワクチンを作製し、免疫システムを活性化させてがん細胞を攻撃する個別化免疫療法です。2001年の設立以来、累計4,000例以上の実績があります。',
    'zh-TW': '從患者自身的癌症組織（福爾馬林固定石蠟包埋標本）中製備疫苗，激活免疫系統攻擊癌細胞的個性化免疫療法。自2001年成立以來，累計已有4,000例以上的治療實績。',
    'zh-CN': '从患者自身的癌症组织（福尔马林固定石蜡包埋标本）中制备疫苗，激活免疫系统攻击癌细胞的个性化免疫疗法。自2001年成立以来，累计已有4,000例以上的治疗实绩。',
    en: 'A personalized immunotherapy that creates a vaccine from the patient\'s own cancer tissue (formalin-fixed paraffin-embedded specimen) to activate the immune system against cancer cells. Over 4,000 cumulative cases since 2001.',
  } as Record<Language, string>,

  // Mechanism
  mechanismTitle: {
    ja: '作用メカニズム',
    'zh-TW': '作用機制',
    'zh-CN': '作用机制',
    en: 'Mechanism of Action',
  } as Record<Language, string>,
  mechanism1Title: { ja: 'がん組織からワクチン作製', 'zh-TW': '從癌組織製備疫苗', 'zh-CN': '从癌组织制备疫苗', en: 'Vaccine from Cancer Tissue' } as Record<Language, string>,
  mechanism1Desc: { ja: '患者自身のがん組織（手術・生検で採取済み）から個別化ワクチンを作製', 'zh-TW': '從患者自身的癌組織（手術/活檢已採取）製備個性化疫苗', 'zh-CN': '从患者自身的癌组织（手术/活检已采取）制备个性化疫苗', en: 'Create personalized vaccine from patient\'s own cancer tissue (from surgery/biopsy)' } as Record<Language, string>,
  mechanism2Title: { ja: '免疫活性化', 'zh-TW': '免疫激活', 'zh-CN': '免疫激活', en: 'Immune Activation' } as Record<Language, string>,
  mechanism2Desc: { ja: 'ワクチンが樹状細胞を刺激し、がん抗原特異的なキラーT細胞を誘導', 'zh-TW': '疫苗刺激樹突狀細胞，誘導癌症抗原特異性的殺手T細胞', 'zh-CN': '疫苗刺激树突状细胞，诱导癌症抗原特异性的杀手T细胞', en: 'Vaccine stimulates dendritic cells to induce cancer antigen-specific killer T cells' } as Record<Language, string>,
  mechanism3Title: { ja: 'がん細胞攻撃', 'zh-TW': '攻擊癌細胞', 'zh-CN': '攻击癌细胞', en: 'Attack Cancer Cells' } as Record<Language, string>,
  mechanism3Desc: { ja: '活性化されたキラーT細胞ががん細胞を認識・攻撃', 'zh-TW': '活化的殺手T細胞識別並攻擊癌細胞', 'zh-CN': '活化的杀手T细胞识别并攻击癌细胞', en: 'Activated killer T cells recognize and attack cancer cells' } as Record<Language, string>,

  // Clinical Evidence
  evidenceTitle: {
    ja: '臨床エビデンス',
    'zh-TW': '臨床實證',
    'zh-CN': '临床实证',
    en: 'Clinical Evidence',
  } as Record<Language, string>,
  evidenceLiver: { ja: '肝細胞がん：再発リスク81%低減', 'zh-TW': '肝細胞癌：復發風險降低81%', 'zh-CN': '肝细胞癌：复发风险降低81%', en: 'Hepatocellular carcinoma: 81% recurrence risk reduction' } as Record<Language, string>,
  evidenceBrain: { ja: '脳腫瘍：3年生存率38%（通常の約3倍）', 'zh-TW': '腦瘤：3年存活率38%（約為常規的3倍）', 'zh-CN': '脑肿瘤：3年生存率38%（约为常规的3倍）', en: 'Brain tumor: 38% 3-year survival (approx. 3x standard)' } as Record<Language, string>,
  evidenceSafety: { ja: '3,000例以上で重篤な副作用報告なし', 'zh-TW': '3,000例以上無嚴重副作用報告', 'zh-CN': '3,000例以上无严重副作用报告', en: 'No serious adverse effects reported in 3,000+ cases' } as Record<Language, string>,
  evidencePublished: { ja: '国際学術誌に臨床試験結果を発表', 'zh-TW': '臨床試驗結果發表於國際學術期刊', 'zh-CN': '临床试验结果发表于国际学术期刊', en: 'Clinical trial results published in international journals' } as Record<Language, string>,

  // Applicable Cancers
  cancerTitle: {
    ja: '対象となるがん種',
    'zh-TW': '適用癌症類型',
    'zh-CN': '适用癌症类型',
    en: 'Applicable Cancer Types',
  } as Record<Language, string>,
  cancerList: {
    ja: '肝臓がん、脳腫瘍、乳がん、膵臓がん、肺がん、胃がん、大腸がん、子宮がん、尿路上皮がん、胆管がん 等',
    'zh-TW': '肝癌、腦瘤、乳癌、胰臟癌、肺癌、胃癌、大腸癌、子宮癌、泌尿上皮癌、膽管癌 等',
    'zh-CN': '肝癌、脑肿瘤、乳腺癌、胰腺癌、肺癌、胃癌、大肠癌、子宫癌、泌尿上皮癌、胆管癌 等',
    en: 'Liver, brain, breast, pancreatic, lung, gastric, colorectal, uterine, urothelial, bile duct cancers, etc.',
  } as Record<Language, string>,
  cancerNote: {
    ja: '※ 手術または生検で採取されたがん組織（ホルマリン固定パラフィン包埋検体）が必要です',
    'zh-TW': '※ 需要手術或活檢採取的癌組織（福爾馬林固定石蠟包埋標本）',
    'zh-CN': '※ 需要手术或活检采取的癌组织（福尔马林固定石蜡包埋标本）',
    en: '※ Requires cancer tissue from surgery or biopsy (formalin-fixed paraffin-embedded specimen)',
  } as Record<Language, string>,

  // Treatment Flow
  flowTitle: {
    ja: '治療の流れ',
    'zh-TW': '治療流程',
    'zh-CN': '治疗流程',
    en: 'Treatment Flow',
  } as Record<Language, string>,
  flow1: { ja: 'がん組織の提出', 'zh-TW': '提交癌組織', 'zh-CN': '提交癌组织', en: 'Submit Cancer Tissue' } as Record<Language, string>,
  flow1Desc: { ja: '手術・生検で採取済みのがん組織を提出', 'zh-TW': '提交手術/活檢已採取的癌組織', 'zh-CN': '提交手术/活检已采取的癌组织', en: 'Submit cancer tissue from surgery/biopsy' } as Record<Language, string>,
  flow2: { ja: 'ワクチン製造', 'zh-TW': '疫苗製造', 'zh-CN': '疫苗制造', en: 'Vaccine Manufacturing' } as Record<Language, string>,
  flow2Desc: { ja: 'Cell-Medicine社で個別化ワクチンを約2-3週間で作製', 'zh-TW': 'Cell-Medicine公司約2-3週製備個性化疫苗', 'zh-CN': 'Cell-Medicine公司约2-3周制备个性化疫苗', en: 'Cell-Medicine creates personalized vaccine in ~2-3 weeks' } as Record<Language, string>,
  flow3: { ja: '皮内接種（3回）', 'zh-TW': '皮內注射（3次）', 'zh-CN': '皮内注射（3次）', en: 'Intradermal Injection (3 times)' } as Record<Language, string>,
  flow3Desc: { ja: '約2週間間隔で計3回、外来で皮内接種', 'zh-TW': '約每2週一次，共3次門診皮內注射', 'zh-CN': '约每2周一次，共3次门诊皮内注射', en: 'Outpatient injection every ~2 weeks, 3 times total' } as Record<Language, string>,
  flow4: { ja: '効果評価', 'zh-TW': '效果評估', 'zh-CN': '效果评估', en: 'Efficacy Evaluation' } as Record<Language, string>,
  flow4Desc: { ja: '遅延型過敏反応(DTH)等で免疫応答を確認', 'zh-TW': '通過遲發型過敏反應(DTH)等確認免疫反應', 'zh-CN': '通过迟发型过敏反应(DTH)等确认免疫反应', en: 'Confirm immune response via delayed-type hypersensitivity (DTH), etc.' } as Record<Language, string>,

  // Pricing
  vaccinePriceTitle: {
    ja: '治療費用目安',
    'zh-TW': '治療費用參考',
    'zh-CN': '治疗费用参考',
    en: 'Treatment Cost Reference',
  } as Record<Language, string>,
  vaccinePriceRange: {
    ja: '¥1,650,000 ~ ¥1,900,000',
    'zh-TW': '¥1,650,000 ~ ¥1,900,000',
    'zh-CN': '¥1,650,000 ~ ¥1,900,000',
    en: '¥1,650,000 ~ ¥1,900,000',
  } as Record<Language, string>,
  vaccinePriceNote: {
    ja: '※ 1コース（3回接種）あたり。がん種・状態により異なります',
    'zh-TW': '※ 每療程（3次注射）。因癌症類型和狀態而異',
    'zh-CN': '※ 每疗程（3次注射）。因癌症类型和状态而异',
    en: '※ Per course (3 injections). Varies by cancer type and condition',
  } as Record<Language, string>,

  // iPeace Section
  ipeaceTag: {
    ja: 'iPS細胞バンキング',
    'zh-TW': 'iPS細胞儲存',
    'zh-CN': 'iPS细胞储存',
    en: 'iPS Cell Banking',
  } as Record<Language, string>,
  ipeaceTitle: {
    ja: 'iPeace iPS細胞バンキングサービス',
    'zh-TW': 'iPeace iPS細胞儲存服務',
    'zh-CN': 'iPeace iPS细胞储存服务',
    en: 'iPeace iPS Cell Banking Service',
  } as Record<Language, string>,
  ipeaceDesc: {
    ja: '山中伸弥教授の共同研究者・田辺剛士氏が共同創業したiPeace社が提供する「My Peace」iPS細胞バンキングサービス。わずか5mLの採血からiPS細胞を作製し、将来の再生医療に備えて保存します。FDA cGMP認証の京都製造施設「Peace Engine Kyoto」で品質管理。',
    'zh-TW': '由山中伸彌教授共同研究者田邊剛士先生聯合創辦的iPeace公司提供的「My Peace」iPS細胞儲存服務。僅需5mL採血即可製備iPS細胞，為未來的再生醫療做好準備。在FDA cGMP認證的京都製造設施「Peace Engine Kyoto」進行品質管理。',
    'zh-CN': '由山中伸弥教授共同研究者田边刚士先生联合创办的iPeace公司提供的「My Peace」iPS细胞储存服务。仅需5mL采血即可制备iPS细胞，为未来的再生医疗做好准备。在FDA cGMP认证的京都制造设施「Peace Engine Kyoto」进行品质管理。',
    en: 'My Peace iPS cell banking service by iPeace, co-founded by Koji Tanabe, collaborator of Prof. Shinya Yamanaka. Create iPS cells from just 5mL of blood, stored for future regenerative medicine. Quality-managed at FDA cGMP-certified "Peace Engine Kyoto" facility.',
  } as Record<Language, string>,

  // iPeace Features
  ipeaceFeature1Title: { ja: '採血わずか5mL', 'zh-TW': '僅需5mL採血', 'zh-CN': '仅需5mL采血', en: 'Only 5mL Blood Draw' } as Record<Language, string>,
  ipeaceFeature1Desc: { ja: '通常の血液検査と同程度の負担で、iPS細胞の元となる血液を採取', 'zh-TW': '與普通血液檢查相當的負擔，採集製備iPS細胞的血液', 'zh-CN': '与普通血液检查相当的负担，采集制备iPS细胞的血液', en: 'Blood collection with minimal burden, similar to a standard blood test' } as Record<Language, string>,
  ipeaceFeature2Title: { ja: 'FDA cGMP認証施設', 'zh-TW': 'FDA cGMP認證設施', 'zh-CN': 'FDA cGMP认证设施', en: 'FDA cGMP Certified Facility' } as Record<Language, string>,
  ipeaceFeature2Desc: { ja: '京都のPeace Engine Kyotoで国際基準の品質管理下で製造・保存', 'zh-TW': '在京都Peace Engine Kyoto以國際標準品質管理製造和保存', 'zh-CN': '在京都Peace Engine Kyoto以国际标准品质管理制造和保存', en: 'Manufactured and stored at Peace Engine Kyoto under international quality standards' } as Record<Language, string>,
  ipeaceFeature3Title: { ja: '将来の再生医療に備える', 'zh-TW': '為未來再生醫療做準備', 'zh-CN': '为未来再生医疗做准备', en: 'Prepare for Future Regenerative Medicine' } as Record<Language, string>,
  ipeaceFeature3Desc: { ja: '若い細胞の状態で保存し、将来の心臓病・神経疾患・糖尿病等の治療に活用', 'zh-TW': '以年輕細胞狀態保存，未來可用於心臟病、神經疾病、糖尿病等治療', 'zh-CN': '以年轻细胞状态保存，未来可用于心脏病、神经疾病、糖尿病等治疗', en: 'Store cells in young state for future treatment of heart disease, neurological disorders, diabetes, etc.' } as Record<Language, string>,
  ipeaceFeature4Title: { ja: 'ノーベル賞技術', 'zh-TW': '諾貝爾獎技術', 'zh-CN': '诺贝尔奖技术', en: 'Nobel Prize Technology' } as Record<Language, string>,
  ipeaceFeature4Desc: { ja: '山中伸弥教授のiPS細胞技術を基盤とし、共同研究者が直接創業', 'zh-TW': '基於山中伸彌教授iPS細胞技術，由共同研究者直接創辦', 'zh-CN': '基于山中伸弥教授iPS细胞技术，由共同研究者直接创办', en: 'Based on Prof. Yamanaka\'s iPS cell technology, founded directly by his collaborator' } as Record<Language, string>,

  // Why iPS
  whyIpsTitle: {
    ja: 'なぜ今、iPS細胞を保存するのか',
    'zh-TW': '為什麼現在就要保存iPS細胞',
    'zh-CN': '为什么现在就要保存iPS细胞',
    en: 'Why Bank iPS Cells Now?',
  } as Record<Language, string>,
  whyIps1: { ja: '細胞は年齢とともに老化する。若い状態の細胞を保存するなら「今」がベスト', 'zh-TW': '細胞會隨年齡老化。要保存年輕狀態的細胞，「現在」就是最佳時機', 'zh-CN': '细胞会随年龄老化。要保存年轻状态的细胞，「现在」就是最佳时机', en: 'Cells age with time. The best time to store young cells is NOW' } as Record<Language, string>,
  whyIps2: { ja: '再生医療の臨床応用が急速に進展中。心臓・角膜・パーキンソン病等で実用化', 'zh-TW': '再生醫療臨床應用正快速進展中。心臟、角膜、帕金森症等已實用化', 'zh-CN': '再生医疗临床应用正快速进展中。心脏、角膜、帕金森症等已实用化', en: 'Regenerative medicine advancing rapidly. Heart, cornea, Parkinson\'s treatments becoming clinical reality' } as Record<Language, string>,
  whyIps3: { ja: '自己由来のiPS細胞なら拒絶反応のリスクが最小限', 'zh-TW': '自身來源的iPS細胞可將排斥反應風險降至最低', 'zh-CN': '自身来源的iPS细胞可将排斥反应风险降至最低', en: 'Self-derived iPS cells minimize rejection risk' } as Record<Language, string>,

  // Team
  teamTag: {
    ja: '技術背景',
    'zh-TW': '技術背景',
    'zh-CN': '技术背景',
    en: 'Technology Background',
  } as Record<Language, string>,
  teamTitle: {
    ja: '技術チーム・研究背景',
    'zh-TW': '技術團隊與研究背景',
    'zh-CN': '技术团队与研究背景',
    en: 'Technology Team & Research Background',
  } as Record<Language, string>,
  team1Name: { ja: 'Cell-Medicine 株式会社', 'zh-TW': 'Cell-Medicine 株式會社', 'zh-CN': 'Cell-Medicine 株式会社', en: 'Cell-Medicine, Inc.' } as Record<Language, string>,
  team1Role: { ja: '自己がんワクチン開発・製造', 'zh-TW': '自體癌症疫苗開發/製造', 'zh-CN': '自体癌症疫苗开发/制造', en: 'Autologous Cancer Vaccine R&D & Manufacturing' } as Record<Language, string>,
  team1Desc: { ja: '2001年設立。理化学研究所・筑波大学発ベンチャー。CEO 大野忠夫（東京大学薬学博士）。全国80以上の医療機関と契約。', 'zh-TW': '2001年成立。理化學研究所・筑波大學創投。CEO 大野忠夫（東京大學藥學博士）。與全國80多家醫療機構合作。', 'zh-CN': '2001年成立。理化学研究所·筑波大学创投。CEO 大野忠夫（东京大学药学博士）。与全国80多家医疗机构合作。', en: 'Founded 2001. RIKEN & Tsukuba Univ. venture. CEO Tadao Ohno (PhD in Pharmacy, Univ. of Tokyo). Contracted with 80+ hospitals nationwide.' } as Record<Language, string>,
  team2Name: { ja: 'iPeace, Inc.', 'zh-TW': 'iPeace, Inc.', 'zh-CN': 'iPeace, Inc.', en: 'iPeace, Inc.' } as Record<Language, string>,
  team2Role: { ja: 'iPS細胞バンキングサービス', 'zh-TW': 'iPS細胞儲存服務', 'zh-CN': 'iPS细胞储存服务', en: 'iPS Cell Banking Service' } as Record<Language, string>,
  team2Desc: { ja: '2015年設立。本社 パロアルト（米国）。田辺剛士氏（山中伸弥教授の共同研究者）が共同創業。京都に製造施設「Peace Engine Kyoto」保有。FDA cGMP認証。', 'zh-TW': '2015年成立。總部 帕羅奧圖（美國）。田邊剛士（山中伸彌教授共同研究者）聯合創辦。京都設有製造設施「Peace Engine Kyoto」。FDA cGMP認證。', 'zh-CN': '2015年成立。总部 帕罗奥图（美国）。田边刚士（山中伸弥教授共同研究者）联合创办。京都设有制造设施「Peace Engine Kyoto」。FDA cGMP认证。', en: 'Founded 2015. HQ in Palo Alto, USA. Co-founded by Koji Tanabe (Prof. Yamanaka\'s collaborator). Kyoto manufacturing facility "Peace Engine Kyoto". FDA cGMP certified.' } as Record<Language, string>,

  // Location
  locationTag: {
    ja: 'アクセス',
    'zh-TW': '交通資訊',
    'zh-CN': '交通信息',
    en: 'Access',
  } as Record<Language, string>,
  locationTitle: {
    ja: '診療拠点',
    'zh-TW': '診療據點',
    'zh-CN': '诊疗据点',
    en: 'Medical Center Location',
  } as Record<Language, string>,
  locationName: {
    ja: '兵庫医科大学 教育研究棟 8F',
    'zh-TW': '兵庫醫科大學 教育研究棟 8F',
    'zh-CN': '兵库医科大学 教育研究栋 8F',
    en: 'Hyogo Medical University, Education & Research Bldg. 8F',
  } as Record<Language, string>,
  locationAddress: {
    ja: '〒663-8501 兵庫県西宮市武庫川町1-1',
    'zh-TW': '〒663-8501 兵庫縣西宮市武庫川町1-1',
    'zh-CN': '〒663-8501 兵库县西宫市武库川町1-1',
    en: '1-1 Mukogawa-cho, Nishinomiya, Hyogo 663-8501',
  } as Record<Language, string>,
  locationAccess: {
    ja: '阪神「武庫川」駅より徒歩約5分',
    'zh-TW': '阪神「武庫川」站步行約5分鐘',
    'zh-CN': '阪神「武库川」站步行约5分钟',
    en: 'Approx. 5 min walk from Hanshin "Mukogawa" Station',
  } as Record<Language, string>,

  // CTA
  ctaTitle: {
    ja: '先端細胞医療のご相談',
    'zh-TW': '先端細胞醫療諮詢',
    'zh-CN': '先端细胞医疗咨询',
    en: 'Consult About Advanced Cell Medicine',
  } as Record<Language, string>,
  ctaDesc: {
    ja: '自己がんワクチン療法やiPS細胞バンキングに関するご質問、治療適応の確認、費用概算など、お気軽にご相談ください。',
    'zh-TW': '關於自體癌症疫苗療法或iPS細胞儲存的任何問題、治療適應性確認、費用概算等，歡迎隨時諮詢。',
    'zh-CN': '关于自体癌症疫苗疗法或iPS细胞储存的任何问题、治疗适应性确认、费用概算等，欢迎随时咨询。',
    en: 'Feel free to consult about autologous cancer vaccine therapy, iPS cell banking, treatment suitability, cost estimates, etc.',
  } as Record<Language, string>,
  ctaInitial: {
    ja: '前期相談サービス',
    'zh-TW': '前期諮詢服務',
    'zh-CN': '前期咨询服务',
    en: 'Initial Consultation',
  } as Record<Language, string>,
  ctaRemote: {
    ja: '遠隔診療サービス',
    'zh-TW': '遠程診斷服務',
    'zh-CN': '远程诊断服务',
    en: 'Remote Consultation',
  } as Record<Language, string>,
  ctaInitialDesc: {
    ja: '資料翻訳・初期相談・治療適応評価',
    'zh-TW': '資料翻譯・初步諮詢・治療適應評估',
    'zh-CN': '资料翻译·初步咨询·治疗适应评估',
    en: 'Document translation, initial consultation, suitability assessment',
  } as Record<Language, string>,
  ctaRemoteDesc: {
    ja: '専門医ビデオ診察・治療計画策定',
    'zh-TW': '專科醫生視頻會診・治療計劃制定',
    'zh-CN': '专科医生视频会诊·治疗计划制定',
    en: 'Specialist video consultation, treatment planning',
  } as Record<Language, string>,

  // Legal
  legalTitle: {
    ja: '重要事項',
    'zh-TW': '重要事項',
    'zh-CN': '重要事项',
    en: 'Important Notice',
  } as Record<Language, string>,
  legal1: {
    ja: '自己がんワクチン療法は自由診療です。公的医療保険の適用外となります。',
    'zh-TW': '自體癌症疫苗療法為自費醫療。不適用公共醫療保險。',
    'zh-CN': '自体癌症疫苗疗法为自费医疗。不适用公共医疗保险。',
    en: 'Autologous cancer vaccine therapy is a self-pay treatment. Not covered by public health insurance.',
  } as Record<Language, string>,
  legal2: {
    ja: '治療効果には個人差があり、すべての患者に同様の効果を保証するものではありません。',
    'zh-TW': '治療效果因人而異，不保證所有患者均能獲得相同效果。',
    'zh-CN': '治疗效果因人而异，不保证所有患者均能获得相同效果。',
    en: 'Treatment effects vary by individual and are not guaranteed for all patients.',
  } as Record<Language, string>,
  legal3: {
    ja: '旅行サービスの契約は新島交通株式会社（大阪府知事登録旅行業 第2-3115号）との間で締結されます。',
    'zh-TW': '旅行服務契約由新島交通株式會社（大阪府知事登錄旅行業 第2-3115號）簽訂。',
    'zh-CN': '旅行服务合同由新岛交通株式会社（大阪府知事登录旅行业 第2-3115号）签订。',
    en: 'Travel service contracts are concluded with Niijima Kotsu Co., Ltd. (Osaka Registered Travel Agency No. 2-3115).',
  } as Record<Language, string>,
};

// ======================================
// 组件
// ======================================
interface Props {
  isGuideEmbed?: boolean;
}

export default function CellMedicineContent({ isGuideEmbed }: Props) {
  const lang = useLanguage();

  const tr = (key: keyof typeof t): string => {
    return t[key][lang] || t[key]['zh-CN'];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ━━━━━━━━ Hero Section ━━━━━━━━ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src={CELL_MEDICINE_HERO_IMAGE}
          alt="Advanced Cell Medicine"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/80 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-sm text-emerald-200 mb-6">
              <Dna className="w-4 h-4" />
              {tr('heroBadge')}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-emerald-400/40" />
              <span className="text-xs tracking-[0.3em] text-emerald-300/70 uppercase">
                {tr('heroTagline')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {tr('heroTitle')}
            </h1>
            <p className="text-lg text-emerald-200/80 mb-6">
              {tr('heroSubtitle')}
            </p>

            <p className="text-base text-white/70 leading-relaxed mb-10 whitespace-pre-line max-w-xl">
              {tr('heroText')}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10">
              <div>
                <div className="text-3xl font-bold text-white">4,000<span className="text-emerald-300/60 text-xl ml-1">+</span></div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{tr('statCases')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">80<span className="text-emerald-300/60 text-xl ml-1">+</span></div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{tr('statHospitals')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24<span className="text-emerald-300/60 text-xl ml-1">{lang === 'en' ? 'yr' : '年'}</span></div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{tr('statHistory')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">0<span className="text-emerald-300/60 text-xl ml-1">{lang === 'en' ? 'cases' : '件'}</span></div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{tr('statSafety')}</div>
              </div>
            </div>

            <Link
              href={isGuideEmbed ? '#vaccine-detail' : '/cell-medicine/initial-consultation'}
              className="inline-flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-400 transition-all shadow-lg hover:shadow-xl"
            >
              {tr('ctaInitial')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Cancer Vaccine Overview ━━━━━━━━ */}
      <section id="vaccine-detail" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-emerald-500" />
            <span className="text-sm tracking-[0.2em] text-emerald-600 uppercase font-medium">
              {tr('vaccineTag')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {tr('vaccineTitle')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mb-12">
            {tr('vaccineDesc')}
          </p>

          {/* Mechanism */}
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Microscope className="w-5 h-5 text-emerald-600" />
            {tr('mechanismTitle')}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: <FlaskConical className="w-6 h-6" />, title: tr('mechanism1Title'), desc: tr('mechanism1Desc'), step: '01' },
              { icon: <Zap className="w-6 h-6" />, title: tr('mechanism2Title'), desc: tr('mechanism2Desc'), step: '02' },
              { icon: <ShieldCheck className="w-6 h-6" />, title: tr('mechanism3Title'), desc: tr('mechanism3Desc'), step: '03' },
            ].map((item, idx) => (
              <div key={idx} className="relative bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6">
                <div className="absolute top-4 right-4 text-4xl font-bold text-emerald-100">{item.step}</div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Clinical Evidence */}
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            {tr('evidenceTitle')}
          </h3>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-4">
              {[tr('evidenceLiver'), tr('evidenceBrain'), tr('evidenceSafety'), tr('evidencePublished')].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Applicable Cancers */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              {tr('cancerTitle')}
            </h3>
            <p className="text-gray-700 mb-3">{tr('cancerList')}</p>
            <p className="text-sm text-gray-500">{tr('cancerNote')}</p>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Treatment Flow ━━━━━━━━ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {tr('flowTitle')}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Syringe className="w-6 h-6" />, title: tr('flow1'), desc: tr('flow1Desc'), step: 'STEP 1' },
              { icon: <Beaker className="w-6 h-6" />, title: tr('flow2'), desc: tr('flow2Desc'), step: 'STEP 2' },
              { icon: <CircleDot className="w-6 h-6" />, title: tr('flow3'), desc: tr('flow3Desc'), step: 'STEP 3' },
              { icon: <Star className="w-6 h-6" />, title: tr('flow4'), desc: tr('flow4Desc'), step: 'STEP 4' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs font-bold text-emerald-600 tracking-wider mb-3">{item.step}</div>
                <div className="w-16 h-16 mx-auto bg-white border-2 border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block mt-4">
                    <ArrowRight className="w-5 h-5 text-emerald-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="mt-16 bg-white border border-emerald-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{tr('vaccinePriceTitle')}</h3>
            <p className="text-3xl font-bold text-emerald-700 mb-2">{tr('vaccinePriceRange')}</p>
            <p className="text-sm text-gray-500">{tr('vaccinePriceNote')}</p>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ iPeace iPS Cell Banking ━━━━━━━━ */}
      <section className="py-20 bg-gradient-to-br from-teal-900 via-emerald-900 to-green-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-teal-400/40" />
            <span className="text-sm tracking-[0.2em] text-teal-300 uppercase font-medium">
              {tr('ipeaceTag')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {tr('ipeaceTitle')}
          </h2>
          <p className="text-lg text-white/70 leading-relaxed max-w-4xl mb-12">
            {tr('ipeaceDesc')}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              { icon: <Droplets className="w-6 h-6" />, title: tr('ipeaceFeature1Title'), desc: tr('ipeaceFeature1Desc') },
              { icon: <ShieldCheck className="w-6 h-6" />, title: tr('ipeaceFeature2Title'), desc: tr('ipeaceFeature2Desc') },
              { icon: <Heart className="w-6 h-6" />, title: tr('ipeaceFeature3Title'), desc: tr('ipeaceFeature3Desc') },
              { icon: <GraduationCap className="w-6 h-6" />, title: tr('ipeaceFeature4Title'), desc: tr('ipeaceFeature4Desc') },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center text-teal-300 mb-4">
                  {item.icon}
                </div>
                <h4 className="font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Why Bank Now */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-300" />
              {tr('whyIpsTitle')}
            </h3>
            <div className="space-y-4">
              {[tr('whyIps1'), tr('whyIps2'), tr('whyIps3')].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Technology Team ━━━━━━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-emerald-500" />
            <span className="text-sm tracking-[0.2em] text-emerald-600 uppercase font-medium">
              {tr('teamTag')}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            {tr('teamTitle')}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: tr('team1Name'), role: tr('team1Role'), desc: tr('team1Desc'), icon: <FlaskConical className="w-6 h-6" /> },
              { name: tr('team2Name'), role: tr('team2Role'), desc: tr('team2Desc'), icon: <Dna className="w-6 h-6" /> },
            ].map((member, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                  {member.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-emerald-600 font-medium mb-4">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Location ━━━━━━━━ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-emerald-500" />
            <span className="text-sm tracking-[0.2em] text-emerald-600 uppercase font-medium">
              {tr('locationTag')}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {tr('locationTitle')}
          </h2>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tr('locationName')}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{tr('locationAddress')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-gray-400" />
                    <span>{tr('locationAccess')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ CTA Section ━━━━━━━━ */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {tr('ctaTitle')}
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            {tr('ctaDesc')}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href={isGuideEmbed ? '#' : '/cell-medicine/initial-consultation'}
              className="bg-white text-gray-900 px-8 py-6 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-center"
            >
              <div className="text-lg mb-1">{tr('ctaInitial')}</div>
              <div className="text-sm text-gray-500 font-normal">{tr('ctaInitialDesc')}</div>
              <div className="text-emerald-600 font-bold mt-2">¥221,000</div>
            </Link>
            <Link
              href={isGuideEmbed ? '#' : '/cell-medicine/remote-consultation'}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-6 rounded-2xl font-bold hover:bg-white/20 transition-all text-center"
            >
              <div className="text-lg mb-1">{tr('ctaRemote')}</div>
              <div className="text-sm text-white/60 font-normal">{tr('ctaRemoteDesc')}</div>
              <div className="text-emerald-300 font-bold mt-2">¥243,000</div>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ Legal Footer ━━━━━━━━ */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h4 className="text-sm font-bold text-gray-700 mb-3">{tr('legalTitle')}</h4>
          <ul className="space-y-1.5 text-xs text-gray-500 leading-relaxed">
            <li>• {tr('legal1')}</li>
            <li>• {tr('legal2')}</li>
            <li>• {tr('legal3')}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
