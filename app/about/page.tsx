'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import {
  ArrowRight,
  Quote,
  Target,
  Eye,
  Heart,
  Users,
  Building2,
  Globe,
  Award,
  Handshake,
  Shield,
  Sparkles,
  ChevronRight,
  MapPin,
  Calendar,
  Star,
  CheckCircle2
} from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

// ===== 頁面翻譯 =====
const pageTranslations = {
  // Hero
  heroTitle: {
    ja: '心で世界と日本をつなぐ',
    'zh-TW': '用心連結世界與日本',
    'zh-CN': '用心连结世界与日本',
    en: 'Connecting the World with Japan'
  },
  heroSubtitle: {
    ja: '2018年の創業以来、華人旅行者のために\n比類なき日本のプレミアム旅行体験を創造しています',
    'zh-TW': '自 2018 年創立以來，我們致力於為華人旅客\n打造無與倫比的日本高端旅遊體驗',
    'zh-CN': '自 2018 年创立以来，我们致力于为华人旅客\n打造无与伦比的日本高端旅游体验',
    en: 'Since 2018, we have been dedicated to creating\nunparalleled premium travel experiences in Japan'
  },
  heroLocation: { ja: '大阪市中央区', 'zh-TW': '大阪市中央区', 'zh-CN': '大阪市中央区', en: 'Chuo-ku, Osaka' },
  heroFounded: { ja: '2018年創業', 'zh-TW': '創立於 2018 年', 'zh-CN': '创立于 2018 年', en: 'Founded in 2018' },
  heroLicense: { ja: '第二種旅行業登録', 'zh-TW': '第二種旅行業登録', 'zh-CN': '第二种旅行业登录', en: 'Type II Travel Agency License' },

  // CEO Message
  ceoSectionTitle: { ja: '社長挨拶', 'zh-TW': '社長致辭', 'zh-CN': '社长致辞', en: 'Message from CEO' },
  ceoTitle: { ja: '代表取締役', 'zh-TW': '代表取締役', 'zh-CN': '代表取缔役', en: 'Representative Director' },
  ceoName: { ja: '員 昊', 'zh-TW': '員 昊', 'zh-CN': '员 昊', en: 'Yuan Hao' },
  ceoGreeting: {
    ja: '新島交通にご関心をお寄せいただきありがとうございます。',
    'zh-TW': '感謝您對新島交通的關注。',
    'zh-CN': '感谢您对新岛交通的关注。',
    en: 'Thank you for your interest in Niijima Transport.'
  },
  ceoPara1: {
    ja: '私は日本で長年生活し、日本独自の「おもてなし」精神——心からの細やかなおもてなしを深く体感してきました。しかし同時に、多くの華人旅行者が言葉の壁や情報格差のために、日本の最高品質のサービスを真に享受できていない現状も目にしてきました。',
    'zh-TW': '我在日本生活多年，深刻體會到日本獨特的「おもてなし」精神——那種發自內心、細緻入微的待客之道。然而，我也看到許多華人旅客因語言障礙和資訊不對稱，無法真正享受到日本最優質的服務。',
    'zh-CN': '我在日本生活多年，深刻体会到日本独特的「おもてなし」精神——那种发自内心、细致入微的待客之道。然而，我也看到许多华人旅客因语言障碍和信息不对称，无法真正享受到日本最优质的服务。',
    en: 'Having lived in Japan for many years, I have deeply experienced Japan\'s unique "omotenashi" spirit—a heartfelt and meticulous approach to hospitality. However, I also observed that many Chinese-speaking travelers, due to language barriers and information asymmetry, cannot truly enjoy Japan\'s finest services.'
  },
  ceoPara2prefix: {
    ja: 'これが新島交通を創業した原点です：',
    'zh-TW': '這正是我創立新島交通的初衷：',
    'zh-CN': '这正是我创立新岛交通的初衷：',
    en: 'This is the founding purpose of Niijima Transport:'
  },
  ceoPara2bold: {
    ja: '華人世界と日本の高級リソースを結ぶ架け橋となること',
    'zh-TW': '成為連結華人世界與日本高端資源的橋樑',
    'zh-CN': '成为连结华人世界与日本高端资源的桥梁',
    en: 'to be the bridge connecting the Chinese-speaking world with Japan\'s premium resources'
  },
  ceoPara2suffix: {
    ja: '。世界トップレベルの精密検診、会員制名門ゴルフ、深度ビジネス視察のいずれも、すべてのお客様に「日本はこんな楽しみ方もできるのか」という驚きをお届けしたいと考えています。',
    'zh-TW': '。無論是世界頂級的精密體檢、會員制名門高爾夫、還是深度商務考察，我們都希望讓每一位客戶感受到「原來日本還可以這樣玩」的驚喜。',
    'zh-CN': '。无论是世界顶级的精密体检、会员制名门高尔夫、还是深度商务考察，我们都希望让每一位客户感受到「原来日本还可以这样玩」的惊喜。',
    en: '. Whether it\'s world-class health screenings, exclusive golf clubs, or in-depth business tours, we strive to give every client the delightful surprise of discovering Japan in a whole new way.'
  },
  ceoPara3: {
    ja: '2024年には「ガイドパートナープログラム」を開始し、在日華人ガイドの皆様に旅行会社レベルのリソースとテクノロジーサポートを提供することを目指しています。これはビジネスモデルの革新であるだけでなく、業界全体に対する私たちの責任と約束でもあります。',
    'zh-TW': '2024 年，我們推出了「導遊合夥人計劃」，希望賦能更多在日華人導遊，讓他們也能擁有旅行社級別的資源和技術支持。這不僅是商業模式的創新，更是我們對整個行業的責任與承諾。',
    'zh-CN': '2024 年，我们推出了「导游合伙人计划」，希望赋能更多在日华人导游，让他们也能拥有旅行社级别的资源和技术支持。这不仅是商业模式的创新，更是我们对整个行业的责任与承诺。',
    en: 'In 2024, we launched the "Guide Partner Program," aiming to empower more Chinese-speaking guides in Japan with travel agency-level resources and technology support. This is not just a business model innovation, but also our responsibility and commitment to the entire industry.'
  },
  ceoPara4: {
    ja: '今後も医療観光、ハイエンドカスタム、ビジネス視察の三大分野を深耕し、テクノロジーでサービスを強化し、誠意で心を動かし続けます。',
    'zh-TW': '未來，我們將持續深耕醫療觀光、高端定制、商務考察三大領域，以科技賦能服務，以真誠打動人心。',
    'zh-CN': '未来，我们将持续深耕医疗观光、高端定制、商务考察三大领域，以科技赋能服务，以真诚打动人心。',
    en: 'In the future, we will continue to deepen our expertise in medical tourism, premium customization, and business tours—empowering service through technology and moving hearts with sincerity.'
  },
  ceoCompany: { ja: '新島交通株式会社', 'zh-TW': '新島交通株式會社', 'zh-CN': '新岛交通株式会社', en: 'Niijima Transport Co., Ltd.' },
  ceoPosition: { ja: '代表取締役 員 昊', 'zh-TW': '代表取締役 員 昊', 'zh-CN': '代表取缔役 员 昊', en: 'Representative Director, Yuan Hao' },

  // Philosophy
  philosophyLabel: { ja: '企業理念', 'zh-TW': '企業理念', 'zh-CN': '企业理念', en: 'Corporate Philosophy' },
  missionSubtitle: { ja: '使命', 'zh-TW': '使命', 'zh-CN': '使命', en: 'Mission' },
  missionDesc: {
    ja: '情報格差を解消し、すべての華人旅行者が日本最高品質の観光資源とサービスを平等に享受できるようにする。',
    'zh-TW': '消除資訊不對稱，讓每一位華人旅客都能平等享有日本最優質的旅遊資源與服務。',
    'zh-CN': '消除信息不对称，让每一位华人旅客都能平等享有日本最优质的旅游资源与服务。',
    en: 'Eliminate information asymmetry so that every Chinese-speaking traveler can equally access Japan\'s finest tourism resources and services.'
  },
  visionSubtitle: { ja: '願景', 'zh-TW': '願景', 'zh-CN': '愿景', en: 'Vision' },
  visionDesc: {
    ja: 'アジア太平洋地域で最も信頼される日本ハイエンド旅行サービス事業者となり、10万人以上の富裕層と日本トップリソースを結ぶ。',
    'zh-TW': '成為亞太地區最值得信賴的日本高端旅遊服務商，連結 10 萬+ 高淨值客戶與日本頂級資源。',
    'zh-CN': '成为亚太地区最值得信赖的日本高端旅游服务商，连结 10 万+ 高净值客户与日本顶级资源。',
    en: 'Become the most trusted premium Japan travel service provider in the Asia-Pacific region, connecting 100,000+ high-net-worth clients with Japan\'s top resources.'
  },
  valuesSubtitle: { ja: '価値観', 'zh-TW': '價值觀', 'zh-CN': '价值观', en: 'Values' },
  value1: { ja: '顧客第一、誠心サービス', 'zh-TW': '客戶至上，真誠服務', 'zh-CN': '客户至上，真诚服务', en: 'Customer First, Sincere Service' },
  value2: { ja: '専門精進、卓越の追求', 'zh-TW': '專業精進，追求卓越', 'zh-CN': '专业精进，追求卓越', en: 'Professional Excellence' },
  value3: { ja: '協力共栄、パートナー支援', 'zh-TW': '合作共贏，賦能夥伴', 'zh-CN': '合作共赢，赋能伙伴', en: 'Win-Win Partnerships' },
  value4: { ja: '革新駆動、変化を受容', 'zh-TW': '創新驅動，擁抱變化', 'zh-CN': '创新驱动，拥抱变化', en: 'Innovation-Driven, Embracing Change' },

  // Key Figures
  figuresLabel: { ja: '主要データ', 'zh-TW': '關鍵數據', 'zh-CN': '关键数据', en: 'Key Figures' },
  figuresDesc: { ja: '数字が成長を証明し、実力が信頼を獲得', 'zh-TW': '數字見證成長，實力贏得信賴', 'zh-CN': '数字见证成长，实力赢得信赖', en: 'Numbers prove growth, strength earns trust' },
  statClients: { ja: '累計サービス顧客', 'zh-TW': '累計服務客戶', 'zh-CN': '累计服务客户', en: 'Clients Served' },
  statAgencies: { ja: '提携旅行社', 'zh-TW': '合作旅行社', 'zh-CN': '合作旅行社', en: 'Partner Agencies' },
  statMedical: { ja: '提携医療機関', 'zh-TW': '合作醫療機構', 'zh-CN': '合作医疗机构', en: 'Medical Partners' },
  statSatisfaction: { ja: '顧客満足度', 'zh-TW': '客戶滿意度', 'zh-CN': '客户满意度', en: 'Client Satisfaction' },
  extraFounded: { ja: '創業年', 'zh-TW': '創立年份', 'zh-CN': '创立年份', en: 'Founded' },
  extraFoundedVal: { ja: '2020年', 'zh-TW': '2020年', 'zh-CN': '2020年', en: '2020' },
  extraStaff: { ja: '従業員数', 'zh-TW': '員工人數', 'zh-CN': '员工人数', en: 'Staff' },
  extraStaffVal: { ja: '25名+', 'zh-TW': '25名+', 'zh-CN': '25名+', en: '25+' },
  extraCoverage: { ja: 'サービス範囲', 'zh-TW': '服務覆蓋', 'zh-CN': '服务覆盖', en: 'Coverage' },
  extraCoverageVal: { ja: '日本全国', 'zh-TW': '日本全國', 'zh-CN': '日本全国', en: 'All of Japan' },

  // History
  historyLabel: { ja: '沿革', 'zh-TW': '發展歷程', 'zh-CN': '发展历程', en: 'Our History' },
  historyDesc: { ja: '創業から今日まで、使命への一歩一歩の堅守', 'zh-TW': '從創立到今天，每一步都是對使命的堅守', 'zh-CN': '从创立到今天，每一步都是对使命的坚守', en: 'From founding to today, every step upholds our mission' },

  // Partners
  partnersLabel: { ja: 'パートナー', 'zh-TW': '合作夥伴', 'zh-CN': '合作伙伴', en: 'Partners' },
  partnersDesc: { ja: '業界トップブランドと手を携え、極上の体験を提供', 'zh-TW': '攜手行業頂尖品牌，為您提供極致體驗', 'zh-CN': '携手行业顶尖品牌，为您提供极致体验', en: 'Partnering with top brands to deliver ultimate experiences' },
  badgeLicense: { ja: '第二種旅行業登録', 'zh-TW': '第二種旅行業登録', 'zh-CN': '第二种旅行业登录', en: 'Type II Travel License' },
  badgeAssoc: { ja: '全国旅行業協会 正会員', 'zh-TW': '全国旅行業協会 正会員', 'zh-CN': '全国旅行业协会 正会员', en: 'ANTA Official Member' },
  badgeTIMC: { ja: 'TIMC 公式代理', 'zh-TW': 'TIMC 官方代理', 'zh-CN': 'TIMC 官方代理', en: 'Official TIMC Agent' },

  // CTA
  ctaTitle: { ja: '日本の旅を始める準備はできましたか？', 'zh-TW': '準備好開啟您的日本之旅了嗎？', 'zh-CN': '准备好开启您的日本之旅了吗？', en: 'Ready to Start Your Journey in Japan?' },
  ctaDesc: {
    ja: '精密検診、ゴルフの旅、ビジネス視察のいずれも、最もプロフェッショナルなサービスをご提供します',
    'zh-TW': '無論是精密體檢、高爾夫之旅還是商務考察，我們都將為您提供最專業的服務',
    'zh-CN': '无论是精密体检、高尔夫之旅还是商务考察，我们都将为您提供最专业的服务',
    en: 'Whether it\'s health screening, golf tours, or business inspections, we provide the most professional service'
  },
  ctaMedical: { ja: '医療サービスを見る', 'zh-TW': '了解醫療服務', 'zh-CN': '了解医疗服务', en: 'Explore Medical Services' },
  ctaPartner: { ja: 'パートナーになる', 'zh-TW': '成為合作夥伴', 'zh-CN': '成为合作伙伴', en: 'Become a Partner' },
};

// ===== 历史沿革数据（多语言） =====
const historyTimeline: { year: string; title: Record<Language, string>; description: Record<Language, string>; icon: typeof Building2 }[] = [
  {
    year: '2018',
    title: { ja: '新島交通株式会社 創立', 'zh-TW': '新島交通株式會社 創立', 'zh-CN': '新岛交通株式会社 创立', en: 'Niijima Transport Founded' },
    description: {
      ja: '「ハイエンド日本旅行体験をより身近に」を使命に、大阪にて正式創業',
      'zh-TW': '以「讓高端日本旅遊體驗更易觸及」為使命，在大阪正式創業',
      'zh-CN': '以「让高端日本旅游体验更易触及」为使命，在大阪正式创业',
      en: 'Founded in Osaka with the mission to make premium Japan travel experiences more accessible'
    },
    icon: Building2,
  },
  {
    year: '2019',
    title: { ja: '第二種旅行業登録取得', 'zh-TW': '取得第二種旅行業登録', 'zh-CN': '取得第二种旅行业登录', en: 'Type II Travel License Acquired' },
    description: {
      ja: '日本観光庁認可の旅行業許可を正式取得、完全な旅行サービスの提供を開始',
      'zh-TW': '正式獲得日本觀光廳核發的旅行業許可，開始提供完整旅遊服務',
      'zh-CN': '正式获得日本观光厅核发的旅行业许可，开始提供完整旅游服务',
      en: 'Officially licensed by Japan Tourism Agency, began providing full travel services'
    },
    icon: Award,
  },
  {
    year: '2020',
    title: { ja: '医療観光事業部設立', 'zh-TW': '醫療觀光事業部成立', 'zh-CN': '医疗观光事业部成立', en: 'Medical Tourism Division Established' },
    description: {
      ja: '徳洲会国際医療センター（TIMC）と戦略提携を締結、精密検診市場を開拓',
      'zh-TW': '與德洲會國際醫療中心（TIMC）建立戰略合作，開拓精密體檢市場',
      'zh-CN': '与德洲会国际医疗中心（TIMC）建立战略合作，开拓精密体检市场',
      en: 'Strategic partnership with TIMC established, expanding into precision health screening market'
    },
    icon: Heart,
  },
  {
    year: '2021',
    title: { ja: '名門ゴルフ事業開始', 'zh-TW': '名門高爾夫事業啟動', 'zh-CN': '名门高尔夫事业启动', en: 'Premium Golf Business Launched' },
    description: {
      ja: '関西地区20以上のトップ会員制ゴルフ場と独占提携を構築',
      'zh-TW': '與日本關西地區 20+ 頂級會員制球場建立獨家合作關係',
      'zh-CN': '与日本关西地区 20+ 顶级会员制球场建立独家合作关系',
      en: 'Exclusive partnerships with 20+ top membership golf courses in Kansai region'
    },
    icon: Star,
  },
  {
    year: '2023',
    title: { ja: 'AI見積システム稼働', 'zh-TW': 'AI 報價系統上線', 'zh-CN': 'AI 报价系统上线', en: 'AI Quotation System Launched' },
    description: {
      ja: '自社開発LinkQuote AIスマート見積エンジン、24時間即時見積を実現',
      'zh-TW': '自主研發 LinkQuote AI 智能報價引擎，實現 24 小時即時報價',
      'zh-CN': '自主研发 LinkQuote AI 智能报价引擎，实现 24 小时即时报价',
      en: 'In-house developed LinkQuote AI smart quotation engine, enabling 24/7 instant quotes'
    },
    icon: Sparkles,
  },
  {
    year: '2024',
    title: { ja: 'ガイドパートナープログラム発表', 'zh-TW': '導遊合夥人計劃發布', 'zh-CN': '导游合伙人计划发布', en: 'Guide Partner Program Released' },
    description: {
      ja: 'ホワイトラベルソリューションを開始、3000人以上の在日華人ガイドのDX化を支援',
      'zh-TW': '推出白標解決方案，賦能 3000+ 在日華人導遊數位轉型',
      'zh-CN': '推出白标解决方案，赋能 3000+ 在日华人导游数字转型',
      en: 'White-label solution launched, empowering 3000+ Chinese-speaking guides in Japan with digital transformation'
    },
    icon: Users,
  },
  {
    year: '2025',
    title: { ja: '総合医療事業拡大', 'zh-TW': '綜合醫療事業拓展', 'zh-CN': '综合医疗事业拓展', en: 'Comprehensive Medical Services Expanded' },
    description: {
      ja: 'がん治療（陽子線/光免疫/BNCT）紹介サービスを追加、医療事業を深化',
      'zh-TW': '新增癌症治療（質子重離子/光免疫/BNCT）轉介服務，深化醫療版圖',
      'zh-CN': '新增癌症治疗（质子重离子/光免疫/BNCT）转介服务，深化医疗版图',
      en: 'Added cancer treatment referral services (proton/photoimmunotherapy/BNCT), deepening medical portfolio'
    },
    icon: Globe,
  },
];

// ===== 合作夥伴（多语言分类） =====
const partnerCategories: Record<Language, Record<string, string>> = {
  ja: { medical: '医療', golf: 'ゴルフ', hotel: 'ホテル', airline: '航空', transport: '交通' },
  'zh-TW': { medical: '醫療', golf: '高爾夫', hotel: '酒店', airline: '航空', transport: '交通' },
  'zh-CN': { medical: '医疗', golf: '高尔夫', hotel: '酒店', airline: '航空', transport: '交通' },
  en: { medical: 'Medical', golf: 'Golf', hotel: 'Hotel', airline: 'Airline', transport: 'Transport' },
};

const partners = [
  { name: 'TIMC OSAKA', categoryKey: 'medical' },
  { name: '德洲會醫療集團', categoryKey: 'medical' },
  { name: '関西名門ゴルフ倶楽部', categoryKey: 'golf' },
  { name: '大阪帝国ホテル', categoryKey: 'hotel' },
  { name: 'The Ritz-Carlton', categoryKey: 'hotel' },
  { name: 'ANA', categoryKey: 'airline' },
  { name: 'JAL', categoryKey: 'airline' },
  { name: 'JR西日本', categoryKey: 'transport' },
];

// ===== 动画计数器 Hook =====
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) setHasStarted(true);
  }, [startOnView]);

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
        { threshold: 0.3 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
};

export default function AboutPage() {
  const [currentLang, setCurrentLang] = useState<Language>('ja');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setCurrentLang(value as Language);
        return;
      }
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
  }, []);

  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][currentLang];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">

        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2000&auto=format&fit=crop')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
          </div>

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 container mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">About Us</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 whitespace-pre-line">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-400" />
                <span>{t('heroLocation')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                <span>{t('heroFounded')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-blue-400" />
                <span>{t('heroLicense')}</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* CEO Message Section */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              <div className="relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://i.ibb.co/B2mJDvq7/founder.jpg"
                    alt={t('ceoName')}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-sm text-gray-300 mb-1">{t('ceoTitle')}</p>
                    <p className="text-2xl font-serif font-bold">{t('ceoName')}</p>
                    <p className="text-sm text-gray-300">Yuan Hao</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-blue-200 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full -z-10" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
                  <Quote size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider">Message from CEO</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">
                  {t('ceoSectionTitle')}
                </h2>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p className="text-lg">{t('ceoGreeting')}</p>
                  <p>{t('ceoPara1')}</p>
                  <p>
                    {t('ceoPara2prefix')}<strong className="text-gray-900">{t('ceoPara2bold')}</strong>{t('ceoPara2suffix')}
                  </p>
                  <p>{t('ceoPara3')}</p>
                  <p className="text-lg font-medium text-gray-900">{t('ceoPara4')}</p>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200">
                  <p className="text-gray-900 font-serif text-lg">{t('ceoCompany')}</p>
                  <p className="text-gray-500">{t('ceoPosition')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">Our Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4">{t('philosophyLabel')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-400">MISSION</h3>
                <h4 className="text-2xl font-serif font-bold mb-4">{t('missionSubtitle')}</h4>
                <p className="text-gray-300 leading-relaxed">{t('missionDesc')}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Eye size={32} className="text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-amber-400">VISION</h3>
                <h4 className="text-2xl font-serif font-bold mb-4">{t('visionSubtitle')}</h4>
                <p className="text-gray-300 leading-relaxed">{t('visionDesc')}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-16 h-16 bg-rose-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={32} className="text-rose-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-rose-400">VALUES</h3>
                <h4 className="text-2xl font-serif font-bold mb-4">{t('valuesSubtitle')}</h4>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-rose-400 flex-shrink-0" /><span>{t('value1')}</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-rose-400 flex-shrink-0" /><span>{t('value2')}</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-rose-400 flex-shrink-0" /><span>{t('value3')}</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-rose-400 flex-shrink-0" /><span>{t('value4')}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Figures */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Key Figures</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-4">{t('figuresLabel')}</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">{t('figuresDesc')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: 5000, suffix: '+', labelKey: 'statClients' as const, icon: Users, color: 'blue' },
                { value: 200, suffix: '+', labelKey: 'statAgencies' as const, icon: Handshake, color: 'amber' },
                { value: 50, suffix: '+', labelKey: 'statMedical' as const, icon: Heart, color: 'rose' },
                { value: 98, suffix: '%', labelKey: 'statSatisfaction' as const, icon: Star, color: 'green' },
              ].map((stat, index) => {
                const { count, ref } = useCountUp(stat.value);
                const Icon = stat.icon;
                const colorMap: Record<string, string> = {
                  blue: 'bg-blue-50 text-blue-600',
                  amber: 'bg-amber-50 text-amber-600',
                  rose: 'bg-rose-50 text-rose-600',
                  green: 'bg-green-50 text-green-600',
                };
                return (
                  <div key={index} ref={ref} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className={`w-14 h-14 ${colorMap[stat.color]} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon size={28} />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      {count.toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-gray-500">{t(stat.labelKey)}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { labelKey: 'extraFounded' as const, valueKey: 'extraFoundedVal' as const, icon: Calendar },
                { labelKey: 'extraStaff' as const, valueKey: 'extraStaffVal' as const, icon: Users },
                { labelKey: 'extraCoverage' as const, valueKey: 'extraCoverageVal' as const, icon: Globe },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Icon size={24} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t(item.labelKey)}</div>
                      <div className="text-xl font-bold text-gray-900">{t(item.valueKey)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Our History</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-4">{t('historyLabel')}</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">{t('historyDesc')}</p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 hidden md:block" />

              {historyTimeline.map((item, index) => {
                const Icon = item.icon;
                const isLeft = index % 2 === 0;

                return (
                  <div key={index} className={`relative flex items-center mb-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className={`inline-flex items-center gap-2 text-blue-600 mb-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                          <span className="text-2xl font-bold">{item.year}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title[currentLang]}</h3>
                        <p className="text-gray-500 text-sm">{item.description[currentLang]}</p>
                      </div>
                    </div>

                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full items-center justify-center shadow-lg z-10">
                      <Icon size={20} className="text-white" />
                    </div>

                    <div className="hidden md:block w-5/12" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Partners</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-4">{t('partnersLabel')}</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">{t('partnersDesc')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <div key={index} className="group p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 text-center">
                  <div className="text-xs text-blue-600 font-medium mb-2">
                    {partnerCategories[currentLang][partner.categoryKey]}
                  </div>
                  <div className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {partner.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8">
              {[
                { labelKey: 'badgeLicense' as const, icon: Shield },
                { labelKey: 'badgeAssoc' as const, icon: Award },
                { labelKey: 'badgeTIMC' as const, icon: CheckCircle2 },
              ].map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-full">
                    <Icon size={20} />
                    <span className="font-medium">{t(badge.labelKey)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{t('ctaTitle')}</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">{t('ctaDesc')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/?page=medical"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg"
              >
                {t('ctaMedical')} <ArrowRight size={18} />
              </Link>
              <Link
                href="/business/partner"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                {t('ctaPartner')} <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
