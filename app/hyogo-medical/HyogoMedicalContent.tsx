'use client';

import React from 'react';
import {
  Building, MapPin, Phone, Clock, Train,
  Award, Stethoscope, Activity, Users, Shield,
  Heart, Brain, Baby, Pill, Eye, Ear,
  Syringe, Microscope, Sparkles, CheckCircle,
  ExternalLink, FileText, Armchair, Flame,
  CircleDot, Zap, Bot, Cross, Gem, Star,
  TrendingUp, Hospital, HeartPulse, Scan
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import type { WhitelabelModuleProps } from '@/components/whitelabel-modules/types';
import WhitelabelContactSection from '@/components/whitelabel-modules/WhitelabelContactSection';

// ======================================
// 多语言翻译
// ======================================
const t = {
  // Hero
  heroTitle1: {
    ja: '兵庫医科大学病院',
    'zh-TW': '兵庫醫科大學病院',
    'zh-CN': '兵库医科大学病院',
    en: 'Hyogo Medical University Hospital',
  } as Record<Language, string>,
  heroTitle2: {
    ja: '兵庫県最大規模の特定機能病院',
    'zh-TW': '兵庫縣最大規模特定功能醫院',
    'zh-CN': '兵库县最大规模特定功能医院',
    en: "Hyogo's Largest Advanced Treatment Hospital",
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '患者さんに希望を、医学に進歩を',
    'zh-TW': '為患者帶來希望，為醫學帶來進步',
    'zh-CN': '为患者带来希望，为医学带来进步',
    en: 'Bringing Hope to Patients, Progress to Medicine',
  } as Record<Language, string>,
  heroText: {
    ja: '1972年開院。50年以上にわたり最先端の医療設備と\n高度な医療技術で兵庫県の地域医療に貢献し続ける国指定特定機能病院。\n全国わずか87施設、兵庫県内2施設のみ。',
    'zh-TW': '1972年開院。50多年來以最先進的醫療設備和\n高端醫療技術持續貢獻兵庫縣的地區醫療。\n國家指定特定功能醫院，全日本僅87家，兵庫縣內僅2家。',
    'zh-CN': '1972年开院。50多年来以最先进的医疗设备和\n高端医疗技术持续贡献兵库县的地区医疗。\n国家指定特定功能医院，全日本仅87家，兵库县内仅2家。',
    en: 'Founded in 1972. Over 50 years of cutting-edge equipment\nand advanced medical technology serving Hyogo Prefecture.\nNationally designated — only 87 in Japan, 2 in Hyogo.',
  } as Record<Language, string>,
  limitBadge: {
    ja: '2026年9月 新病院棟 開院予定',
    'zh-TW': '2026年9月 新病院大樓 即將開院',
    'zh-CN': '2026年9月 新病院大楼 即将开院',
    en: 'New Hospital Building Opening Sep 2026',
  } as Record<Language, string>,

  // Stats
  statsTag: {
    ja: '病院の実力',
    'zh-TW': '醫院實力',
    'zh-CN': '医院实力',
    en: 'Hospital Strength',
  } as Record<Language, string>,
  statsTitle: {
    ja: '数字で見る兵庫医大病院',
    'zh-TW': '數字看兵庫醫大病院',
    'zh-CN': '数字看兵库医大病院',
    en: 'Hyogo Medical by the Numbers',
  } as Record<Language, string>,

  // National #1
  nationalTag: {
    ja: '日本トップクラスの実績',
    'zh-TW': '日本頂級實績',
    'zh-CN': '日本顶级实绩',
    en: 'Japan-Leading Achievements',
  } as Record<Language, string>,
  nationalTitle: {
    ja: '日本一・全国トップの専門分野',
    'zh-TW': '日本第一・全國頂尖專科',
    'zh-CN': '日本第一・全国顶尖专科',
    en: 'National #1 Specialties',
  } as Record<Language, string>,

  // Robots
  robotTag: {
    ja: 'ロボット支援手術',
    'zh-TW': '機器人輔助手術',
    'zh-CN': '机器人辅助手术',
    en: 'Robotic Surgery',
  } as Record<Language, string>,
  robotTitle: {
    ja: '2台のロボットが支える精密手術',
    'zh-TW': '2台機器人支撐的精密手術',
    'zh-CN': '2台机器人支撑的精密手术',
    en: 'Dual-Robot Precision Surgery',
  } as Record<Language, string>,

  // Certifications
  certTag: {
    ja: '12の国・県指定資格',
    'zh-TW': '12項國家・縣指定資質',
    'zh-CN': '12项国家・县指定资质',
    en: '12 National & Prefectural Designations',
  } as Record<Language, string>,
  certTitle: {
    ja: '国・自治体が認めた高度医療機関',
    'zh-TW': '國家與地方認定的高端醫療機構',
    'zh-CN': '国家与地方认定的高端医疗机构',
    en: 'Government-Certified Advanced Medical Institution',
  } as Record<Language, string>,

  // Centers
  centersTag: {
    ja: '専門センター',
    'zh-TW': '專門中心',
    'zh-CN': '专门中心',
    en: 'Centers of Excellence',
  } as Record<Language, string>,
  centersTitle: {
    ja: '17以上の専門センター',
    'zh-TW': '17個以上專門中心',
    'zh-CN': '17个以上专门中心',
    en: '17+ Specialty Centers',
  } as Record<Language, string>,

  // Equipment
  equipTitle: {
    ja: '最先端の医療設備',
    'zh-TW': '最先進的醫療設備',
    'zh-CN': '最先进的医疗设备',
    en: 'Cutting-Edge Medical Equipment',
  } as Record<Language, string>,
  equipSub: {
    ja: '年間6万件以上の画像検査を支える世界レベルの医療機器群',
    'zh-TW': '支撐每年6萬件以上影像檢查的世界級醫療設備',
    'zh-CN': '支撑每年6万件以上影像检查的世界级医疗设备',
    en: 'World-class equipment supporting 60,000+ annual imaging studies',
  } as Record<Language, string>,

  // Facility / New Building
  newBuildTitle: {
    ja: '2026年9月 新病院棟開院',
    'zh-TW': '2026年9月 新病院大樓開院',
    'zh-CN': '2026年9月 新病院大楼开院',
    en: 'New Hospital Building — September 2026',
  } as Record<Language, string>,
  newBuildDesc: {
    ja: '「Human Centered Hospital」をコンセプトに、\n患者中心の未来型スマート病院が誕生。\n地上15階建て・801床・延床面積約71,000㎡。\nIT・AI活用のスマートホスピタル設計、\n免震構造＋屋上ヘリポート完備。',
    'zh-TW': '以「Human Centered Hospital」為理念，\n以患者為中心的未來型智慧醫院即將誕生。\n地上15層・801床・總建築面積約71,000㎡。\nIT・AI驅動智慧醫院設計，\n免震結構＋屋頂直升機坪。',
    'zh-CN': '以「Human Centered Hospital」为理念，\n以患者为中心的未来型智慧医院即将诞生。\n地上15层・801床・总建筑面积约71,000㎡。\nIT・AI驱动智慧医院设计，\n免震结构＋屋顶直升机坪。',
    en: '"Human Centered Hospital" concept —\nA future-oriented smart hospital putting patients first.\n15 stories, 801 beds, ~71,000㎡ total area.\nIT/AI-driven smart hospital design,\nseismic isolation + rooftop helipad.',
  } as Record<Language, string>,

  // Emergency
  emergTitle: {
    ja: '救命救急・災害医療',
    'zh-TW': '急救・災害醫療',
    'zh-CN': '急救・灾害医疗',
    en: 'Emergency & Disaster Medicine',
  } as Record<Language, string>,
  emergDesc: {
    ja: '阪神医療圏約190万人の命を守る砦。\n20床のEICU＋24床の救急病棟、ドクターヘリポート完備。\n救急車受入率約93%。\n熱傷センター・中毒センター・脳卒中センター・心臓センターを併設し、\n24時間365日、最重症の患者に即応できる体制を整えています。',
    'zh-TW': '守護阪神醫療圈約190萬人生命的堡壘。\n20床EICU＋24床急救病棟、直升機停機坪。\n急救車接收率約93%。\n設有燒傷中心・中毒中心・腦中風中心・心臟中心，\n24小時365天隨時應對最危重患者。',
    'zh-CN': '守护阪神医疗圈约190万人生命的堡垒。\n20床EICU＋24床急救病栋、直升机停机坪。\n急救车接收率约93%。\n设有烧伤中心・中毒中心・脑中风中心・心脏中心，\n24小时365天随时应对最危重患者。',
    en: 'Safeguarding 1.9 million lives in the Hanshin medical district.\n20-bed EICU + 24-bed emergency ward, helipad.\n~93% ambulance acceptance rate.\nBurn, Poison, Stroke, and Cardiac Centers on-site.\n24/7/365 readiness for the most critical patients.',
  } as Record<Language, string>,

  // Departments
  deptTitle: {
    ja: '全41診療科',
    'zh-TW': '全41診療科',
    'zh-CN': '全41诊疗科',
    en: 'All 41 Clinical Departments',
  } as Record<Language, string>,
  deptInternal: { ja: '内科系', 'zh-TW': '內科系', 'zh-CN': '内科系', en: 'Internal Medicine' } as Record<Language, string>,
  deptSurgical: { ja: '外科系', 'zh-TW': '外科系', 'zh-CN': '外科系', en: 'Surgical' } as Record<Language, string>,
  deptSpecialty: { ja: '専門科・その他', 'zh-TW': '專科・其他', 'zh-CN': '专科・其他', en: 'Specialty & Others' } as Record<Language, string>,

  // Access
  accessTitle: { ja: 'アクセス', 'zh-TW': '交通方式', 'zh-CN': '交通方式', en: 'Access' } as Record<Language, string>,
  accessAddress: { ja: '〒663-8501 兵庫県西宮市武庫川町1-1', 'zh-TW': '〒663-8501 兵庫縣西宮市武庫川町1-1', 'zh-CN': '〒663-8501 兵库县西宫市武库川町1-1', en: '1-1 Mukogawa-cho, Nishinomiya, Hyogo 663-8501' } as Record<Language, string>,
  accessTrain: { ja: '阪神電鉄「武庫川駅」西出口より徒歩5分', 'zh-TW': '阪神電鐵「武庫川站」西出口步行5分鐘', 'zh-CN': '阪神电铁「武库川站」西出口步行5分钟', en: '5-min walk from Hanshin Railway Mukogawa Station (West Exit)' } as Record<Language, string>,
  hoursWeekday: { ja: '月〜金 8:30-11:00（初診受付）', 'zh-TW': '週一至週五 8:30-11:00（初診掛號）', 'zh-CN': '周一至周五 8:30-11:00（初诊挂号）', en: 'Mon-Fri 8:30-11:00 (Initial Visit)' } as Record<Language, string>,
  hoursClosed: { ja: '休診：土日祝日・年末年始', 'zh-TW': '休診：週六日及國定假日', 'zh-CN': '休诊：周六日及法定节假日', en: 'Closed: Weekends & holidays' } as Record<Language, string>,
  officialSite: { ja: '病院公式サイト（外部リンク）', 'zh-TW': '醫院官方網站（外部連結）', 'zh-CN': '医院官方网站（外部链接）', en: 'Official Website (External Link)' } as Record<Language, string>,

  // CTA
  ctaTitle: {
    ja: '兵庫医科大学病院での受診・健診をご検討の方へ',
    'zh-TW': '考慮在兵庫醫科大學病院就診・健檢的您',
    'zh-CN': '考虑在兵库医科大学病院就诊・健检的您',
    en: 'Considering Medical Care at Hyogo Medical University Hospital?',
  } as Record<Language, string>,
  ctaDesc: {
    ja: '中国語対応スタッフが丁寧にサポートいたします。\n予約手配から通訳同行まで一括対応。お気軽にご相談ください。',
    'zh-TW': '中文服務人員為您提供全程支援。\n從預約安排到翻譯陪同一站式服務，歡迎隨時諮詢。',
    'zh-CN': '中文服务人员为您提供全程支援。\n从预约安排到翻译陪同一站式服务，欢迎随时咨询。',
    en: 'Chinese-speaking staff provide full support.\nFrom appointment arrangement to interpreter accompaniment. Feel free to consult us.',
  } as Record<Language, string>,
};

// ======================================
// 数据
// ======================================

// 核心数字
const HEADLINE_STATS = [
  {
    value: '963',
    label: { ja: '病床数', 'zh-TW': '病床數', 'zh-CN': '病床数', en: 'Hospital Beds' } as Record<Language, string>,
    sub: { ja: '兵庫県最大規模', 'zh-TW': '兵庫縣最大規模', 'zh-CN': '兵库县最大规模', en: "Hyogo's Largest" } as Record<Language, string>,
  },
  {
    value: '9,672',
    label: { ja: '年間手術件数', 'zh-TW': '年間手術件數', 'zh-CN': '年手术件数', en: 'Annual Surgeries' } as Record<Language, string>,
    sub: { ja: '2022年度実績', 'zh-TW': '2022年度實績', 'zh-CN': '2022年度实绩', en: 'FY2022' } as Record<Language, string>,
  },
  {
    value: '60,000+',
    label: { ja: '年間画像検査数', 'zh-TW': '年間影像檢查數', 'zh-CN': '年影像检查数', en: 'Annual Imaging Studies' } as Record<Language, string>,
    sub: { ja: 'CT・MRI・PET', 'zh-TW': 'CT・MRI・PET', 'zh-CN': 'CT・MRI・PET', en: 'CT, MRI & PET' } as Record<Language, string>,
  },
  {
    value: '2,200',
    label: { ja: '1日あたり外来患者数', 'zh-TW': '每日門診人數', 'zh-CN': '每日门诊人数', en: 'Daily Outpatients' } as Record<Language, string>,
    sub: { ja: '年間約58万人', 'zh-TW': '年間約58萬人', 'zh-CN': '年间约58万人', en: '~580K annually' } as Record<Language, string>,
  },
  {
    value: '17',
    label: { ja: '手術室', 'zh-TW': '手術室', 'zh-CN': '手术室', en: 'Operating Rooms' } as Record<Language, string>,
    sub: { ja: 'ハイブリッドOR含む', 'zh-TW': '含混合手術室', 'zh-CN': '含混合手术室', en: 'Including Hybrid OR' } as Record<Language, string>,
  },
  {
    value: '50+',
    label: { ja: '開院からの歴史', 'zh-TW': '開院歷史', 'zh-CN': '开院历史', en: 'Years of History' } as Record<Language, string>,
    sub: { ja: '1972年開院', 'zh-TW': '1972年開院', 'zh-CN': '1972年开院', en: 'Founded 1972' } as Record<Language, string>,
  },
];

// 日本一・全国トップの専門分野
const NATIONAL_FIRSTS = [
  {
    rank: { ja: '日本一', 'zh-TW': '日本第一', 'zh-CN': '日本第一', en: '#1 in Japan' } as Record<Language, string>,
    title: { ja: 'IBDセンター（炎症性腸疾患）', 'zh-TW': 'IBD中心（炎症性腸病）', 'zh-CN': 'IBD中心（炎症性肠病）', en: 'IBD Center' } as Record<Language, string>,
    desc: {
      ja: '潰瘍性大腸炎・クローン病の入院患者数で全国DPC統計第1位。累計患者約3,150人、累計手術4,140件以上。血球成分除去療法はこの病院で発明された。年間2,000件以上の生物学的製剤治療を実施。',
      'zh-TW': '潰瘍性大腸炎・克隆氏病住院患者數全國DPC統計第1名。累計患者約3,150人、累計手術4,140件以上。血球成分除去療法在此發明。年間2,000件以上生物製劑治療。',
      'zh-CN': '溃疡性大肠炎・克罗恩病住院患者数全国DPC统计第1名。累计患者约3,150人、累计手术4,140件以上。血球成分除去疗法在此发明。年间2,000件以上生物制剂治疗。',
      en: '#1 nationally in UC & Crohn\'s disease by DPC volume. ~3,150 cumulative patients, 4,140+ surgeries. Blood cell apheresis invented here. 2,000+ biologic treatments annually.',
    } as Record<Language, string>,
    icon: Activity,
    color: 'from-rose-500 to-orange-500',
  },
  {
    rank: { ja: '日本一', 'zh-TW': '日本第一', 'zh-CN': '日本第一', en: '#1 in Japan' } as Record<Language, string>,
    title: { ja: '中皮腫センター（悪性中皮腫）', 'zh-TW': '間皮瘤中心（惡性間皮瘤）', 'zh-CN': '间皮瘤中心（恶性间皮瘤）', en: 'Mesothelioma Center' } as Record<Language, string>,
    desc: {
      ja: '全国最多の悪性中皮腫症例数。年間800件以上を診療する日本随一の専門施設。呼吸器外科では年間50件以上の根治手術を実施。呼吸器外科全体で年間403件の手術。',
      'zh-TW': '全國最多惡性間皮瘤病例數。每年診療800件以上，日本首屈一指的專門設施。呼吸器外科每年50件以上根治手術。呼吸器外科全年403件手術。',
      'zh-CN': '全国最多恶性间皮瘤病例数。每年诊疗800件以上，日本首屈一指的专门设施。呼吸器外科每年50件以上根治手术。呼吸器外科全年403件手术。',
      en: 'Japan\'s highest mesothelioma caseload. 800+ cases/year. 50+ radical surgeries annually. 403 total thoracic surgeries per year.',
    } as Record<Language, string>,
    icon: Shield,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    rank: { ja: '兵庫県1位 / 全国トップクラス', 'zh-TW': '兵庫縣第1 / 全國頂級', 'zh-CN': '兵库县第1 / 全国顶级', en: '#1 in Hyogo / National Top' } as Record<Language, string>,
    title: { ja: '脳神経外科（血管内治療）', 'zh-TW': '腦神經外科（血管內治療）', 'zh-CN': '脑神经外科（血管内治疗）', en: 'Neurosurgery (Endovascular)' } as Record<Language, string>,
    desc: {
      ja: '脳血管内治療件数で兵庫県第1位。年間手術810件、血管内治療315件。フローダイバーターステント治療は全国でも数施設のみ。吉村紳一教授の累計症例約4,000件。24時間365日専門医常駐。',
      'zh-TW': '腦血管內治療件數兵庫縣第1。年間手術810件、血管內治療315件。Flow Diverter支架治療全國僅數家。吉村紳一教授累計約4,000例。24小時365天專科醫師常駐。',
      'zh-CN': '脑血管内治疗件数兵库县第1。年间手术810件、血管内治疗315件。Flow Diverter支架治疗全国仅数家。吉村绅一教授累计约4,000例。24小时365天专科医师常驻。',
      en: '#1 in Hyogo for cerebrovascular endovascular. 810 surgeries, 315 endovascular/yr. Flow Diverter at only a few hospitals. Prof. Yoshimura: ~4,000 cases. 24/7 specialist coverage.',
    } as Record<Language, string>,
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    rank: { ja: '全国1～2位', 'zh-TW': '全國第1～2名', 'zh-CN': '全国第1～2名', en: '#1-2 Nationally' } as Record<Language, string>,
    title: { ja: '耳鼻咽喉科（耳手術）', 'zh-TW': '耳鼻喉科（耳手術）', 'zh-CN': '耳鼻喉科（耳手术）', en: 'ENT (Ear Surgery)' } as Record<Language, string>,
    desc: {
      ja: '年間耳手術約350件は大学病院として全国1～2位。累計人工内耳手術190件以上。鼓室形成術の成功率・聴力改善率ともに全国トップレベル。内視鏡下副鼻腔手術208件、頭頸部がん手術91件。',
      'zh-TW': '年間耳手術約350件，大學醫院中全國第1～2。累計人工耳蝸190件以上。鼓室形成術成功率與聽力改善率全國頂級。內視鏡鼻竇手術208件、頭頸部癌手術91件。',
      'zh-CN': '年间耳手术约350件，大学医院中全国第1～2。累计人工耳蜗190件以上。鼓室形成术成功率与听力改善率全国顶级。内镜鼻窦手术208件、头颈部癌手术91件。',
      en: '~350 ear surgeries/yr — #1-2 among university hospitals. 190+ cochlear implants. Top success rates. 208 sinus surgeries, 91 head-neck cancer surgeries.',
    } as Record<Language, string>,
    icon: Ear,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    rank: { ja: '全国トップクラス', 'zh-TW': '全國頂級', 'zh-CN': '全国顶级', en: 'National Top-Tier' } as Record<Language, string>,
    title: { ja: '腎移植センター', 'zh-TW': '腎移植中心', 'zh-CN': '肾移植中心', en: 'Kidney Transplant Center' } as Record<Language, string>,
    desc: {
      ja: '1983年からの累計411件以上。10年生着率85%・10年患者生存率96%は全国トップレベル。ABO不適合移植・先行的移植にも対応。腹腔鏡ドナー手術200件以上の実績。',
      'zh-TW': '自1983年累計411件以上。10年移植存活率85%・10年患者存活率96%，全國頂級。可進行ABO不相容移植・先行性移植。腹腔鏡供體手術200件以上。',
      'zh-CN': '自1983年累计411件以上。10年移植存活率85%・10年患者存活率96%，全国顶级。可进行ABO不相容移植・先行性移植。腹腔镜供体手术200件以上。',
      en: '411+ transplants since 1983. 10-year graft survival 85%, patient survival 96%. ABO-incompatible and pre-emptive transplants. 200+ laparoscopic donor surgeries.',
    } as Record<Language, string>,
    icon: HeartPulse,
    color: 'from-amber-500 to-yellow-500',
  },
];

// 认定资质（12项）
const CERTIFICATIONS = [
  {
    title: { ja: '特定機能病院', 'zh-TW': '特定功能醫院', 'zh-CN': '特定功能医院', en: 'Specified Function Hospital' } as Record<Language, string>,
    desc: { ja: '1994年認定。全国87施設・兵庫県内2施設のみ', 'zh-TW': '1994年認定。全日本87家・兵庫縣內僅2家', 'zh-CN': '1994年认定。全日本87家・兵库县内仅2家', en: 'Since 1994. Only 87 in Japan, 2 in Hyogo' } as Record<Language, string>,
    icon: Award, color: 'blue',
  },
  {
    title: { ja: 'がん診療連携拠点病院（高度型）', 'zh-TW': '癌症診療據點醫院（高度型）', 'zh-CN': '癌症诊疗据点医院（高度型）', en: 'Advanced Cancer Base Hospital' } as Record<Language, string>,
    desc: { ja: '2008年指定、2020年高度型に昇格', 'zh-TW': '2008年指定、2020年升格為高度型', 'zh-CN': '2008年指定、2020年升格为高度型', en: 'Designated 2008, upgraded to Advanced 2020' } as Record<Language, string>,
    icon: Shield, color: 'purple',
  },
  {
    title: { ja: 'がんゲノム医療連携病院', 'zh-TW': '癌症基因體醫療合作醫院', 'zh-CN': '癌症基因组医疗合作医院', en: 'Cancer Genome Medicine Hospital' } as Record<Language, string>,
    desc: { ja: '2018年指定。大阪大学と連携', 'zh-TW': '2018年指定。與大阪大學合作', 'zh-CN': '2018年指定。与大阪大学合作', en: 'Since 2018. Partnered with Osaka University' } as Record<Language, string>,
    icon: Microscope, color: 'indigo',
  },
  {
    title: { ja: '総合周産期母子医療センター', 'zh-TW': '綜合周產期母子醫療中心', 'zh-CN': '综合周产期母子医疗中心', en: 'Perinatal Maternal-Child Center' } as Record<Language, string>,
    desc: { ja: '2015年指定。阪神地域唯一', 'zh-TW': '2015年指定。阪神地區唯一', 'zh-CN': '2015年指定。阪神地区唯一', en: 'Since 2015. Only one in Hanshin area' } as Record<Language, string>,
    icon: Baby, color: 'pink',
  },
  {
    title: { ja: '災害拠点病院', 'zh-TW': '災害據點醫院', 'zh-CN': '灾害据点医院', en: 'Disaster Base Hospital' } as Record<Language, string>,
    desc: { ja: '1996年指定。免震構造・ヘリポート完備', 'zh-TW': '1996年指定。免震結構・直升機坪', 'zh-CN': '1996年指定。免震结构・直升机坪', en: 'Since 1996. Seismic isolation + helipad' } as Record<Language, string>,
    icon: Flame, color: 'orange',
  },
  {
    title: { ja: '肝疾患診療連携拠点病院', 'zh-TW': '肝疾病診療據點醫院', 'zh-CN': '肝疾病诊疗据点医院', en: 'Liver Disease Base Hospital' } as Record<Language, string>,
    desc: { ja: '2008年指定。兵庫県唯一の拠点病院', 'zh-TW': '2008年指定。兵庫縣唯一的據點醫院', 'zh-CN': '2008年指定。兵库县唯一的据点医院', en: "Since 2008. Hyogo's sole liver disease base" } as Record<Language, string>,
    icon: Pill, color: 'green',
  },
  {
    title: { ja: '認知症疾患医療センター', 'zh-TW': '認知症疾病醫療中心', 'zh-CN': '认知症疾病医疗中心', en: 'Dementia Medical Center' } as Record<Language, string>,
    desc: { ja: '2009年兵庫県指定', 'zh-TW': '2009年兵庫縣指定', 'zh-CN': '2009年兵库县指定', en: 'Hyogo Prefecture designated 2009' } as Record<Language, string>,
    icon: Brain, color: 'teal',
  },
  {
    title: { ja: 'HIV/AIDS中核拠点病院', 'zh-TW': 'HIV/AIDS核心據點醫院', 'zh-CN': 'HIV/AIDS核心据点医院', en: 'HIV/AIDS Core Hospital' } as Record<Language, string>,
    desc: { ja: '2007年指定。専門治療体制', 'zh-TW': '2007年指定。專門治療體制', 'zh-CN': '2007年指定。专门治疗体制', en: 'Since 2007. Specialized treatment system' } as Record<Language, string>,
    icon: Cross, color: 'red',
  },
  {
    title: { ja: 'アレルギー疾患医療拠点病院', 'zh-TW': '過敏疾病醫療據點醫院', 'zh-CN': '过敏疾病医疗据点医院', en: 'Allergy Disease Base Hospital' } as Record<Language, string>,
    desc: { ja: '2018年兵庫県指定', 'zh-TW': '2018年兵庫縣指定', 'zh-CN': '2018年兵库县指定', en: 'Hyogo Prefecture designated 2018' } as Record<Language, string>,
    icon: Sparkles, color: 'amber',
  },
  {
    title: { ja: '難病診療連携拠点病院', 'zh-TW': '罕見病診療據點醫院', 'zh-CN': '罕见病诊疗据点医院', en: 'Rare Disease Base Hospital' } as Record<Language, string>,
    desc: { ja: '2019年兵庫県指定', 'zh-TW': '2019年兵庫縣指定', 'zh-CN': '2019年兵库县指定', en: 'Hyogo Prefecture designated 2019' } as Record<Language, string>,
    icon: Gem, color: 'violet',
  },
  {
    title: { ja: '小児がん連携病院', 'zh-TW': '小兒癌症合作醫院', 'zh-CN': '小儿癌症合作医院', en: 'Pediatric Cancer Hospital' } as Record<Language, string>,
    desc: { ja: '2019年指定。小児がんの集学的治療', 'zh-TW': '2019年指定。小兒癌症的集學治療', 'zh-CN': '2019年指定。小儿癌症的集学治疗', en: 'Since 2019. Multidisciplinary pediatric cancer care' } as Record<Language, string>,
    icon: Heart, color: 'rose',
  },
  {
    title: { ja: 'JCQHC認定 + ISO 15189', 'zh-TW': 'JCQHC認定 + ISO 15189', 'zh-CN': 'JCQHC认定 + ISO 15189', en: 'JCQHC + ISO 15189' } as Record<Language, string>,
    desc: { ja: '第4回更新認定(2024)。検査室ISO取得(2016)', 'zh-TW': '第4次更新認定(2024)。檢驗室ISO取得(2016)', 'zh-CN': '第4次更新认定(2024)。检验室ISO取得(2016)', en: '4th renewal (2024). Lab ISO certified (2016)' } as Record<Language, string>,
    icon: CheckCircle, color: 'sky',
  },
];

// 专门中心
const CENTERS = [
  {
    name: { ja: 'IBDセンター', 'zh-TW': 'IBD中心', 'zh-CN': 'IBD中心', en: 'IBD Center' } as Record<Language, string>,
    stat: { ja: '累計4,140件以上の手術', 'zh-TW': '累計4,140件以上手術', 'zh-CN': '累计4,140件以上手术', en: '4,140+ cumulative surgeries' } as Record<Language, string>,
    icon: Activity,
  },
  {
    name: { ja: '脳卒中センター', 'zh-TW': '腦中風中心', 'zh-CN': '脑中风中心', en: 'Stroke Center' } as Record<Language, string>,
    stat: { ja: '年間血管内治療315件', 'zh-TW': '年間血管內治療315件', 'zh-CN': '年间血管内治疗315件', en: '315 endovascular procedures/yr' } as Record<Language, string>,
    icon: Brain,
  },
  {
    name: { ja: 'アイセンター', 'zh-TW': '眼科中心', 'zh-CN': '眼科中心', en: 'Eye Center' } as Record<Language, string>,
    stat: { ja: '年間白内障手術1,718件', 'zh-TW': '年間白內障手術1,718件', 'zh-CN': '年间白内障手术1,718件', en: '1,718 cataract surgeries/yr' } as Record<Language, string>,
    icon: Eye,
  },
  {
    name: { ja: 'がんセンター', 'zh-TW': '癌症中心', 'zh-CN': '癌症中心', en: 'Cancer Center' } as Record<Language, string>,
    stat: { ja: 'がんゲノム・CAR-T・IMRT', 'zh-TW': '癌症基因組・CAR-T・IMRT', 'zh-CN': '癌症基因组・CAR-T・IMRT', en: 'Genome, CAR-T, IMRT' } as Record<Language, string>,
    icon: Microscope,
  },
  {
    name: { ja: '中皮腫センター', 'zh-TW': '間皮瘤中心', 'zh-CN': '间皮瘤中心', en: 'Mesothelioma Center' } as Record<Language, string>,
    stat: { ja: '年間800件以上の症例', 'zh-TW': '年間800件以上病例', 'zh-CN': '年间800件以上病例', en: '800+ cases/year' } as Record<Language, string>,
    icon: Shield,
  },
  {
    name: { ja: '腎移植センター', 'zh-TW': '腎移植中心', 'zh-CN': '肾移植中心', en: 'Renal Transplant Center' } as Record<Language, string>,
    stat: { ja: '累計411件・10年生存率96%', 'zh-TW': '累計411件・10年存活率96%', 'zh-CN': '累计411件・10年存活率96%', en: '411 transplants, 96% 10yr survival' } as Record<Language, string>,
    icon: HeartPulse,
  },
  {
    name: { ja: '内視鏡センター', 'zh-TW': '內視鏡中心', 'zh-CN': '内镜中心', en: 'Endoscopy Center' } as Record<Language, string>,
    stat: { ja: '年間13,734件の内視鏡検査', 'zh-TW': '年間13,734件內視鏡檢查', 'zh-CN': '年间13,734件内镜检查', en: '13,734 endoscopies/yr' } as Record<Language, string>,
    icon: Scan,
  },
  {
    name: { ja: '救命救急センター', 'zh-TW': '急救中心', 'zh-CN': '急救中心', en: 'Emergency Center' } as Record<Language, string>,
    stat: { ja: '190万人の命を守る・受入率93%', 'zh-TW': '守護190萬人・接收率93%', 'zh-CN': '守护190万人・接收率93%', en: '1.9M population, 93% acceptance' } as Record<Language, string>,
    icon: Zap,
  },
  {
    name: { ja: '周産期センター', 'zh-TW': '周產期中心', 'zh-CN': '周产期中心', en: 'Perinatal Center' } as Record<Language, string>,
    stat: { ja: 'NICU15床・阪神地域唯一', 'zh-TW': 'NICU15床・阪神地區唯一', 'zh-CN': 'NICU15床・阪神地区唯一', en: '15-bed NICU, only in Hanshin' } as Record<Language, string>,
    icon: Baby,
  },
  {
    name: { ja: 'PETセンター', 'zh-TW': 'PET中心', 'zh-CN': 'PET中心', en: 'PET Center' } as Record<Language, string>,
    stat: { ja: 'PET-CT 3台・専用サイクロトロン', 'zh-TW': 'PET-CT 3台・專用迴旋加速器', 'zh-CN': 'PET-CT 3台・专用回旋加速器', en: '3 PET-CTs + on-site cyclotron' } as Record<Language, string>,
    icon: CircleDot,
  },
];

// 色彩映射
const ICON_COLORS: Record<string, { bg: string; text: string; hoverBg: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', hoverBg: 'group-hover:bg-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', hoverBg: 'group-hover:bg-purple-600' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', hoverBg: 'group-hover:bg-indigo-600' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', hoverBg: 'group-hover:bg-pink-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', hoverBg: 'group-hover:bg-orange-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700', hoverBg: 'group-hover:bg-teal-600' },
  green: { bg: 'bg-green-100', text: 'text-green-700', hoverBg: 'group-hover:bg-green-600' },
  red: { bg: 'bg-red-100', text: 'text-red-700', hoverBg: 'group-hover:bg-red-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', hoverBg: 'group-hover:bg-amber-600' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-700', hoverBg: 'group-hover:bg-violet-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', hoverBg: 'group-hover:bg-rose-600' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-700', hoverBg: 'group-hover:bg-sky-600' },
};

// 诊疗科室
const DEPARTMENTS = {
  internal: [
    { ja: '循環器内科', 'zh-TW': '循環器內科', 'zh-CN': '循环器内科', en: 'Cardiovascular Medicine' },
    { ja: '呼吸器内科', 'zh-TW': '呼吸器內科', 'zh-CN': '呼吸器内科', en: 'Respiratory Medicine' },
    { ja: '脳神経内科', 'zh-TW': '腦神經內科', 'zh-CN': '脑神经内科', en: 'Neurology' },
    { ja: '腎・透析内科', 'zh-TW': '腎・透析內科', 'zh-CN': '肾・透析内科', en: 'Nephrology & Dialysis' },
    { ja: '血液内科', 'zh-TW': '血液內科', 'zh-CN': '血液内科', en: 'Hematology' },
    { ja: '糖尿病・内分泌・代謝内科', 'zh-TW': '糖尿病・內分泌・代謝內科', 'zh-CN': '糖尿病・内分泌・代谢内科', en: 'Diabetes & Endocrinology' },
    { ja: '肝・胆・膵内科', 'zh-TW': '肝・膽・胰內科', 'zh-CN': '肝・胆・胰内科', en: 'Hepatobiliary & Pancreatic' },
    { ja: '消化管内科', 'zh-TW': '消化道內科', 'zh-CN': '消化道内科', en: 'Gastroenterology' },
    { ja: 'アレルギー・リウマチ内科', 'zh-TW': '過敏・風濕內科', 'zh-CN': '过敏・风湿内科', en: 'Allergy & Rheumatology' },
    { ja: '総合内科', 'zh-TW': '綜合內科', 'zh-CN': '综合内科', en: 'General Internal Medicine' },
  ] as Record<Language, string>[],
  surgical: [
    { ja: '心臓血管外科', 'zh-TW': '心臟血管外科', 'zh-CN': '心脏血管外科', en: 'Cardiovascular Surgery' },
    { ja: '呼吸器外科', 'zh-TW': '呼吸器外科', 'zh-CN': '呼吸器外科', en: 'Thoracic Surgery' },
    { ja: '脳神経外科', 'zh-TW': '腦神經外科', 'zh-CN': '脑神经外科', en: 'Neurosurgery' },
    { ja: '肝・胆・膵外科', 'zh-TW': '肝・膽・胰外科', 'zh-CN': '肝・胆・胰外科', en: 'Hepatobiliary Surgery' },
    { ja: '上部消化管外科', 'zh-TW': '上消化道外科', 'zh-CN': '上消化道外科', en: 'Upper GI Surgery' },
    { ja: '下部消化管外科', 'zh-TW': '下消化道外科', 'zh-CN': '下消化道外科', en: 'Lower GI Surgery' },
    { ja: '乳腺・内分泌外科', 'zh-TW': '乳腺・內分泌外科', 'zh-CN': '乳腺・内分泌外科', en: 'Breast & Endocrine Surgery' },
    { ja: '炎症性腸疾患外科', 'zh-TW': '炎症性腸病外科', 'zh-CN': '炎症性肠病外科', en: 'IBD Surgery' },
    { ja: '泌尿器科', 'zh-TW': '泌尿科', 'zh-CN': '泌尿科', en: 'Urology' },
    { ja: '整形外科', 'zh-TW': '骨科', 'zh-CN': '骨科', en: 'Orthopedics' },
    { ja: '形成外科', 'zh-TW': '整形外科', 'zh-CN': '整形外科', en: 'Plastic Surgery' },
    { ja: '小児外科', 'zh-TW': '小兒外科', 'zh-CN': '小儿外科', en: 'Pediatric Surgery' },
  ] as Record<Language, string>[],
  other: [
    { ja: '産科婦人科', 'zh-TW': '產科婦科', 'zh-CN': '产科妇科', en: 'OB/GYN' },
    { ja: '小児科', 'zh-TW': '小兒科', 'zh-CN': '小儿科', en: 'Pediatrics' },
    { ja: '眼科', 'zh-TW': '眼科', 'zh-CN': '眼科', en: 'Ophthalmology' },
    { ja: '耳鼻咽喉科・頭頸部外科', 'zh-TW': '耳鼻喉科・頭頸部外科', 'zh-CN': '耳鼻喉科・头颈部外科', en: 'ENT & Head/Neck' },
    { ja: '皮膚科', 'zh-TW': '皮膚科', 'zh-CN': '皮肤科', en: 'Dermatology' },
    { ja: '精神科神経科', 'zh-TW': '精神神經科', 'zh-CN': '精神神经科', en: 'Psychiatry' },
    { ja: '放射線科', 'zh-TW': '放射科', 'zh-CN': '放射科', en: 'Radiology' },
    { ja: '麻酔科', 'zh-TW': '麻醉科', 'zh-CN': '麻醉科', en: 'Anesthesiology' },
    { ja: '救急科', 'zh-TW': '急診科', 'zh-CN': '急诊科', en: 'Emergency' },
    { ja: 'リハビリテーション科', 'zh-TW': '復健科', 'zh-CN': '康复科', en: 'Rehabilitation' },
    { ja: '歯科口腔外科', 'zh-TW': '口腔外科', 'zh-CN': '口腔外科', en: 'Oral Surgery' },
    { ja: '病理診断科', 'zh-TW': '病理診斷科', 'zh-CN': '病理诊断科', en: 'Pathology' },
    { ja: '臨床検査科', 'zh-TW': '臨床檢驗科', 'zh-CN': '临床检验科', en: 'Clinical Laboratory' },
  ] as Record<Language, string>[],
};

interface HyogoMedicalContentProps {
  whitelabel?: WhitelabelModuleProps;
}

export default function HyogoMedicalContent({ whitelabel }: HyogoMedicalContentProps) {
  const lang = useLanguage();

  return (
    <div className="animate-fade-in-up min-h-screen bg-white">

      {/* ========================================
          1. Hero Section - 全屏背景图 (TIMC 风格)
          ======================================== */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden text-white bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          alt="Hyogo Medical University Hospital"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
        <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif mb-4 md:mb-6 leading-[1.2]">
              {t.heroTitle1[lang]}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{t.heroTitle2[lang]}</span>
            </h1>
            <h2 className="text-base sm:text-lg md:text-2xl text-gray-300 font-light mb-6 md:mb-8 font-serif">
              {t.heroSubtitle[lang]}
            </h2>
            <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base border-l-2 border-blue-500 pl-4 md:pl-6 max-w-2xl whitespace-pre-line">
              {t.heroText[lang]}
            </p>
            <div className="mt-8 inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 px-5 py-3 rounded-full backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
              <span className="text-amber-200 text-sm font-medium">{t.limitBadge[lang]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          2. Headline Stats - 核心数字 (暗色背景过渡区)
          ======================================== */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-bold">{t.statsTag[lang]}</span>
            <h3 className="text-3xl font-serif text-white mt-3">{t.statsTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {HEADLINE_STATS.map((stat, i) => (
              <div key={i} className="text-center bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                <div className="text-3xl md:text-4xl font-bold text-white font-serif">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-2 font-medium">{stat.label[lang]}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.sub[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-24">

        {/* ========================================
            3. National #1 - 日本一の専門分野
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-red-500 text-xs tracking-widest uppercase font-bold">{t.nationalTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.nationalTitle[lang]}</h3>
          </div>
          <div className="space-y-6">
            {NATIONAL_FIRSTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition duration-300 overflow-hidden group">
                  <div className="flex flex-col md:flex-row items-stretch">
                    <div className={`bg-gradient-to-br ${item.color} p-6 md:p-8 flex items-center justify-center md:min-w-[200px]`}>
                      <div className="text-center text-white">
                        <Icon size={32} className="mx-auto mb-3" />
                        <div className="text-sm font-bold tracking-wide">{item.rank[lang]}</div>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{item.title[lang]}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc[lang]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================
            4. 手术机器人 - Da Vinci Xi + hinotori
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">{t.robotTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.robotTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Da Vinci Xi */}
            <div className="bg-gray-900 text-white rounded-2xl overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1551190822-a9ce113ac100?q=80&w=1200" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Da Vinci Xi" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-blue-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {lang === 'ja' ? '2017年導入' : lang === 'en' ? 'Since 2017' : '2017年引进'}
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-serif font-bold mb-3">Da Vinci Xi</h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {lang === 'ja'
                    ? '手ぶれ補正機能・多関節鉗子・立体3D映像を備えた最先端ロボット支援手術システム。泌尿器科、上部消化管外科、下部消化管外科、産科婦人科、呼吸器外科、耳鼻咽喉科の6科で活用。年間250件以上のロボット支援手術を実施。'
                    : lang === 'zh-TW'
                    ? '配備防手震功能、多關節鉗子、立體3D影像的最先進機器人輔助手術系統。在泌尿科、上消化道外科、下消化道外科、婦產科、呼吸器外科、耳鼻喉科6個科別使用。年間250件以上機器人輔助手術。'
                    : lang === 'zh-CN'
                    ? '配备防手抖功能、多关节钳子、立体3D影像的最先进机器人辅助手术系统。在泌尿科、上消化道外科、下消化道外科、妇产科、呼吸器外科、耳鼻喉科6个科室使用。年间250件以上机器人辅助手术。'
                    : 'Advanced robotic surgical system with anti-tremor, multi-jointed forceps, and stereoscopic 3D imaging. Used across 6 departments. 250+ robotic surgeries annually.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">6 Departments</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">250+ Cases/Year</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">3D Vision</span>
                </div>
              </div>
            </div>
            {/* hinotori */}
            <div className="bg-gray-900 text-white rounded-2xl overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="hinotori" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-rose-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {lang === 'ja' ? '2024年導入・日本製' : lang === 'en' ? '2024 / Made in Japan' : '2024年引进・日本制造'}
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-serif font-bold mb-3">hinotori™</h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {lang === 'ja'
                    ? '日本初の国産手術支援ロボット。2024年8月導入。泌尿器科で前立腺全摘術、産婦人科でロボット支援手術を実施。今後、肝胆膵外科・呼吸器外科へ拡大予定。'
                    : lang === 'zh-TW'
                    ? '日本首台國產手術支援機器人。2024年8月引進。在泌尿科進行前列腺根治術、婦產科進行機器人輔助手術。計劃擴展至肝膽胰外科・呼吸器外科。'
                    : lang === 'zh-CN'
                    ? '日本首台国产手术支援机器人。2024年8月引进。在泌尿科进行前列腺根治术、妇产科进行机器人辅助手术。计划扩展至肝胆胰外科・呼吸器外科。'
                    : "Japan's first domestically produced surgical robot. Introduced August 2024. Used in Urology and Ob/Gyn. Expanding to HPB and Thoracic Surgery."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">Made in Japan</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">2024 New</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">Expanding</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            5. 12项国家认证资质
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">{t.certTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.certTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((cert, i) => {
              const Icon = cert.icon;
              const colors = ICON_COLORS[cert.color];
              return (
                <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                  <div className={`w-10 h-10 ${colors.bg} ${colors.text} rounded-full flex items-center justify-center mb-4 ${colors.hoverBg} group-hover:text-white transition`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="text-base font-bold text-gray-800 mb-2 font-serif">{cert.title[lang]}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{cert.desc[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================
            6. 10+ 专门中心 (TIMC 深色圆角风格)
            ======================================== */}
        <div className="mb-24 bg-gray-900 text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
          <div className="relative z-10 text-center mb-12">
            <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-bold">{t.centersTag[lang]}</span>
            <h3 className="text-3xl font-serif mt-3">{t.centersTitle[lang]}</h3>
          </div>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CENTERS.map((center, i) => {
              const Icon = center.icon;
              return (
                <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition group text-center">
                  <div className="flex justify-center mb-3 text-blue-400 group-hover:scale-110 transition"><Icon size={28} /></div>
                  <h4 className="font-bold text-sm mb-1">{center.name[lang]}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{center.stat[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================
          7. 医疗设备 - 全宽图片区 (TIMC 双列风格)
          ======================================== */}
      <div className="mb-0">
        <div className="text-center py-16 bg-white">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-3">{t.equipTitle[lang]}</h3>
          <p className="text-gray-500 text-sm tracking-widest uppercase mb-4">Medical Equipment Lineup</p>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto px-4">{t.equipSub[lang]}</p>
        </div>
      </div>
      {/* Row 1: PET-CT + MRI */}
      <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="PET-CT" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">PET-CT × 3{lang === 'ja' ? '台' : lang === 'en' ? ' Units' : '台'}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {lang === 'ja'
                ? '専用サイクロトロン（加速器）を院内に設置し、PET用放射性薬剤を自家製造。年間4,719件のPET検査を実施する専門PETセンター（2006年開設）。全身のがん・病変を一度にスクリーニング。'
                : lang === 'zh-TW'
                ? '院內設置專用迴旋加速器，自行製造PET放射性藥劑。年間4,719件PET檢查的專門PET中心（2006年開設）。一次性全身癌症・病變篩查。'
                : lang === 'zh-CN'
                ? '院内设置专用回旋加速器，自行制造PET放射性药剂。年间4,719件PET检查的专门PET中心（2006年开设）。一次性全身癌症・病变筛查。'
                : 'On-site cyclotron for in-house radiopharmaceutical production. PET Center (est. 2006) performing 4,719 PET scans/yr. Full-body cancer screening.'}
            </p>
          </div>
        </div>
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="MRI" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">3.0T MRI × 3 + 1.5T × 1</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {lang === 'ja'
                ? '4台のMRI（3.0テスラ3台＋1.5テスラ1台）を配備。年間16,289件のMRI検査を実施。超高磁場による高精細画像で脳・脊髄・関節等の微細病変を検出。'
                : lang === 'zh-TW'
                ? '配備4台MRI（3.0T×3＋1.5T×1）。年間16,289件MRI檢查。超高磁場高精細影像檢測腦・脊髓・關節等微細病變。'
                : lang === 'zh-CN'
                ? '配备4台MRI（3.0T×3＋1.5T×1）。年间16,289件MRI检查。超高磁场高精细影像检测脑・脊髓・关节等微细病变。'
                : '4 MRI systems (3×3.0T + 1×1.5T). 16,289 annual exams. Ultra-high field imaging for minute lesions in brain, spine, joints.'}
            </p>
          </div>
        </div>
      </div>
      {/* Row 2: CT + Radiation Therapy */}
      <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1530497610245-b489b3085e3b?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="CT Scanner" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">128{lang === 'ja' ? '列マルチスライスCT × 3台' : lang === 'en' ? '-Slice CT × 3 Units' : '列多层CT × 3台'}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {lang === 'ja'
                ? '年間37,470件のCT検査を実施。高速撮影で心臓を1回転で撮影可能。低被ばくかつ高精細な画像診断を実現。'
                : lang === 'zh-TW'
                ? '年間37,470件CT檢查。高速拍攝可一次旋轉完成心臟掃描。低輻射高精度影像診斷。'
                : lang === 'zh-CN'
                ? '年间37,470件CT检查。高速拍摄可一次旋转完成心脏扫描。低辐射高精度影像诊断。'
                : '37,470 annual CT scans. Single-rotation cardiac imaging. Low-radiation, high-resolution diagnostics.'}
            </p>
          </div>
        </div>
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Radiation Therapy" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{lang === 'ja' ? '高精度放射線治療装置' : lang === 'zh-TW' ? '高精度放射治療裝置' : lang === 'zh-CN' ? '高精度放射治疗装置' : 'Precision Radiation Therapy'}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {lang === 'ja'
                ? 'Elekta Synergy高精度リニアック2台。IMRT・IGRT・定位放射線治療に対応。年間572名・12,322回照射。小線源治療（HDR/LDR）も完備。'
                : lang === 'zh-TW'
                ? 'Elekta Synergy高精度直線加速器2台。支援IMRT・IGRT・立體定位放射治療。年間572名・12,322次照射。近接治療（HDR/LDR）完備。'
                : lang === 'zh-CN'
                ? 'Elekta Synergy高精度直线加速器2台。支持IMRT・IGRT・立体定向放射治疗。年间572名・12,322次照射。近距离放疗（HDR/LDR）完备。'
                : '2 Elekta Synergy linacs. IMRT, IGRT, stereotactic radiotherapy. 572 patients, 12,322 sessions/yr. HDR/LDR brachytherapy.'}
            </p>
          </div>
        </div>
      </div>
      {/* Row 3: IVR + Endoscopy */}
      <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1551190822-a9ce113ac100?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="IVR Center" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{lang === 'ja' ? 'IVRセンター（10室）' : lang === 'zh-TW' ? 'IVR中心（10間）' : lang === 'zh-CN' ? 'IVR中心（10间）' : 'IVR Center (10 Suites)'}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {lang === 'ja'
                ? '血管造影装置10室（循環器4台・脳神経3台・腹部IVR-CT 1台・コーンビームCT 2台）。年間1,081件のインターベンション手術。ハイブリッド手術室完備。'
                : lang === 'zh-TW'
                ? '血管造影裝置10間（心臟4台・腦神經3台・腹部IVR-CT 1台・錐形束CT 2台）。年間1,081件介入手術。配備混合手術室。'
                : lang === 'zh-CN'
                ? '血管造影装置10间（心脏4台・脑神经3台・腹部IVR-CT 1台・锥形束CT 2台）。年间1,081件介入手术。配备混合手术室。'
                : '10 angiography suites (4 cardiac, 3 neuro, 1 abdominal IVR-CT, 2 cone-beam CT). 1,081 interventions/yr. Hybrid OR.'}
            </p>
          </div>
        </div>
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Endoscopy" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{lang === 'ja' ? '内視鏡センター（7室）' : lang === 'zh-TW' ? '內視鏡中心（7間）' : lang === 'zh-CN' ? '内镜中心（7间）' : 'Endoscopy Center (7 Rooms)'}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {lang === 'ja'
                ? '年間13,734件（上部6,869件・下部5,357件・ESD 248件）。NBI拡大内視鏡・カプセル内視鏡・ダブルバルーン内視鏡・EUS完備。早期がん内視鏡治療は全国屈指。'
                : lang === 'zh-TW'
                ? '年間13,734件（上部6,869件・下部5,357件・ESD 248件）。配備NBI放大內視鏡・膠囊內視鏡・雙氣囊內視鏡・EUS。早期癌內視鏡治療全國頂級。'
                : lang === 'zh-CN'
                ? '年间13,734件（上部6,869件・下部5,357件・ESD 248件）。配备NBI放大内镜・胶囊内镜・双气囊内镜・EUS。早期癌内镜治疗全国顶级。'
                : '13,734/yr (6,869 upper, 5,357 lower, 248 ESD). NBI, capsule, double-balloon, EUS. Nationally top early cancer endoscopic treatment.'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
          8. 新病院大楼 2026 (全屏展示)
          ======================================== */}
      <div className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="New Hospital Building 2026" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-amber-400" />
              <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">NEW BUILDING 2026</span>
            </div>
            <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.newBuildTitle[lang]}</h4>
            <p className="text-base text-white/80 leading-relaxed whitespace-pre-line">{t.newBuildDesc[lang]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">15F / ~73m</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">801 Beds</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">71,000㎡</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">{lang === 'ja' ? '免震構造' : lang === 'en' ? 'Seismic Isolation' : '免震结构'}</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">{lang === 'ja' ? '屋上ヘリポート' : lang === 'en' ? 'Rooftop Helipad' : '屋顶直升机坪'}</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Smart Hospital</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          9. 救急・災害 (右对齐全屏)
          ======================================== */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="Emergency Center" />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/90 via-slate-900/70 to-transparent" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-2xl ml-auto text-right">
            <div className="flex items-center justify-end gap-3 mb-4">
              <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">Emergency & Disaster</span>
              <div className="h-[1px] w-12 bg-amber-400" />
            </div>
            <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.emergTitle[lang]}</h4>
            <p className="text-base text-white/80 leading-relaxed whitespace-pre-line">{t.emergDesc[lang]}</p>
            <div className="mt-6 flex justify-end flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">20-bed EICU</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">24/7/365</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">{lang === 'ja' ? '190万人圏域' : lang === 'en' ? '1.9M Pop.' : '190万人口'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-24">

        {/* ========================================
            10. 全41诊疗科
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">41 Clinical Departments</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.deptTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center"><Heart size={20} /></div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">{t.deptInternal[lang]}</h4>
              </div>
              <div className="space-y-2">
                {DEPARTMENTS.internal.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />{dept[lang]}</div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center"><Syringe size={20} /></div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">{t.deptSurgical[lang]}</h4>
              </div>
              <div className="space-y-2">
                {DEPARTMENTS.surgical.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-purple-500 shrink-0 mt-0.5" />{dept[lang]}</div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"><Stethoscope size={20} /></div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">{t.deptSpecialty[lang]}</h4>
              </div>
              <div className="space-y-2">
                {DEPARTMENTS.other.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-gray-500 shrink-0 mt-0.5" />{dept[lang]}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            11. Access & Info Section
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">Hospital Information</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.accessTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-100 rounded-2xl h-80 md:h-[450px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.9!2d135.3802!3d34.7238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000f1a0d3e6f8e1%3A0x3b6b3b3b3b3b3b3b!2z5YW15bqr5Yy756eR5aSn5a2m55eF6Zmi!5e0!3m2!1sja!2sjp!4v1"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" className="rounded-2xl"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0"><MapPin size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{lang === 'ja' ? '所在地' : lang === 'en' ? 'Address' : '地址'}</h4>
                    <p className="text-sm text-gray-500">{t.accessAddress[lang]}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0"><Train size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{lang === 'ja' ? '電車でお越しの方' : lang === 'en' ? 'By Train' : '电车交通'}</h4>
                    <p className="text-sm text-gray-500">{t.accessTrain[lang]}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shrink-0"><Clock size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{lang === 'ja' ? '外来受付時間' : lang === 'en' ? 'Outpatient Hours' : '门诊时间'}</h4>
                    <p className="text-sm text-gray-500">{t.hoursWeekday[lang]}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.hoursClosed[lang]}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0"><Phone size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{lang === 'ja' ? '代表電話' : lang === 'en' ? 'Phone' : '电话'}</h4>
                    <p className="text-sm text-gray-500">0798-45-6111</p>
                  </div>
                </div>
              </div>
              <a href="https://www.hosp.hyo-med.ac.jp/" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition text-center">
                <ExternalLink size={16} />{t.officialSite[lang]}
              </a>
            </div>
          </div>
        </div>

        {/* ========================================
            12. CTA Section
            ======================================== */}
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-serif text-gray-900 mb-4">{t.ctaTitle[lang]}</h3>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto whitespace-pre-line">{t.ctaDesc[lang]}</p>
        </div>
      </div>

      {whitelabel && whitelabel.showContact !== false && (
        <WhitelabelContactSection
          brandColor={whitelabel.brandColor}
          brandName={whitelabel.brandName}
          contactInfo={whitelabel.contactInfo}
        />
      )}
    </div>
  );
}
