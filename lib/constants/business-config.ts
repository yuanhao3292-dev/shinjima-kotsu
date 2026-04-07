import type { Language } from '@/hooks/useLanguage';
import { Stethoscope, Globe, Briefcase, Users } from 'lucide-react';

export interface BusinessItemConfig {
  id: string;
  title: Record<Language, string>;
  titleEn: string;
  description: Record<Language, string>;
  link: string;
  image: string;
  stats: Record<Language, string[]>;
  icon: typeof Stethoscope;
}

/**
 * 页面级翻译（intro 等全局文本）
 */
export const pageTranslations = {
  intro: {
    ja: '新島交通は、医療ツーリズム、ゴルフツーリズム、ビジネス視察、ガイドパートナーの四大領域で、華人旅客と日本の高品質な資源をつなぐサービスを提供しています。',
    'zh-TW': '新島交通在醫療旅遊、高爾夫旅遊、商務考察、導遊合夥人四大領域，提供連結華人旅客與日本高品質資源的服務。',
    'zh-CN': '新岛交通在医疗旅游、高尔夫旅游、商务考察、导游合伙人四大领域，提供连接华人旅客与日本高品质资源的服务。',
    en: 'NIIJIMA KOTSU provides services connecting Chinese-speaking travelers with Japan\'s premium resources across four major domains: medical tourism, golf tourism, business inspections, and guide partnerships.',
    ko: '니지마 교통은 의료 관광, 골프 관광, 비즈니스 시찰, 가이드 파트너의 4대 영역에서 해외 여행객과 일본의 고품질 자원을 연결하는 서비스를 제공하고 있습니다.',
  },
} as const;

/**
 * 业务卡片配置（使用占位图片，建议替换为本地托管）
 */
export const BUSINESS_ITEMS: readonly BusinessItemConfig[] = [
  {
    id: 'medical',
    title: {
      ja: '医療ツーリズム',
      'zh-TW': '醫療旅遊',
      'zh-CN': '医疗旅游',
      en: 'Medical Tourism',
      ko: '의료 관광',
    },
    titleEn: 'Medical Tourism',
    description: {
      ja: '世界最先端の日本の医療技術を活用した精密健診・がん治療サービス。TIMC（徳洲会国際医療センター）と提携し、PET-CT、MRI、内視鏡など高度な検査を提供。',
      'zh-TW': '運用日本世界領先的醫療技術提供精密健檢及癌症治療服務。與TIMC（德州會國際醫療中心）合作，提供PET-CT、MRI、內視鏡等高端檢查。',
      'zh-CN': '运用日本世界领先的医疗技术提供精密体检及癌症治疗服务。与TIMC（德州会国际医疗中心）合作，提供PET-CT、MRI、内视镜等高端检查。',
      en: 'Precision health screenings and cancer treatment services utilizing Japan\'s world-leading medical technology. Partnered with TIMC for PET-CT, MRI, endoscopy, and more.',
      ko: '일본의 세계 최첨단 의료 기술을 활용한 정밀 건강검진·암 치료 서비스. TIMC(도쿠슈카이 국제의료센터)와 제휴하여 PET-CT, MRI, 내시경 등 첨단 검사를 제공합니다.',
    },
    link: '/business/medical',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800',
    stats: {
      ja: ['累計5,000名+', 'TIMC公式代理', '中国語サポート'],
      'zh-TW': ['累計5,000名+', 'TIMC官方代理', '中文支援'],
      'zh-CN': ['累计5,000名+', 'TIMC官方代理', '中文支持'],
      en: ['5,000+ Served', 'Official TIMC Agent', 'Chinese Support'],
      ko: ['누적 5,000명+', 'TIMC 공식 대리점', '다국어 지원'],
    },
    icon: Stethoscope,
  },
  {
    id: 'golf',
    title: {
      ja: 'ゴルフツーリズム',
      'zh-TW': '高爾夫旅遊',
      'zh-CN': '高尔夫旅游',
      en: 'Golf Tourism',
      ko: '골프 관광',
    },
    titleEn: 'Golf Tourism',
    description: {
      ja: '会員制名門ゴルフ場への特別アクセス。関西・関東の20以上のプレミアムコースと提携。送迎、宿泊、食事まで完全サポート。',
      'zh-TW': '會員制名門高爾夫球場的特別通道。與關西及關東20多家頂級球場合作。接送、住宿、餐飲全程服務。',
      'zh-CN': '会员制名门高尔夫球场的特别通道。与关西及关东20多家顶级球场合作。接送、住宿、餐饮全程服务。',
      en: 'Exclusive access to prestigious membership golf courses. Partnered with over 20 premium courses in Kansai and Kanto. Full support including transfers, accommodation, and dining.',
      ko: '회원제 명문 골프장 특별 이용. 간사이·간토 20개 이상의 프리미엄 코스와 제휴. 픽업, 숙박, 식사까지 완벽 지원.',
    },
    link: '/business/golf',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800',
    stats: {
      ja: ['名門20コース+', 'VIP待遇', '専属キャディ'],
      'zh-TW': ['20+名門球場', 'VIP待遇', '專屬球僮'],
      'zh-CN': ['20+名门球场', 'VIP待遇', '专属球僮'],
      en: ['20+ Premium Courses', 'VIP Treatment', 'Dedicated Caddy'],
      ko: ['20+ 명문 코스', 'VIP 대우', '전속 캐디'],
    },
    icon: Globe,
  },
  {
    id: 'inspection',
    title: {
      ja: 'ビジネス視察',
      'zh-TW': '商務考察',
      'zh-CN': '商务考察',
      en: 'Business Inspections',
      ko: '비즈니스 시찰',
    },
    titleEn: 'Business Inspection',
    description: {
      ja: '日本企業・工場への視察ツアーをカスタマイズ。製造業、医療、テクノロジー分野での深い知見を提供。',
      'zh-TW': '客製化日本企業及工廠考察行程。提供製造業、醫療、科技領域的深入見解。',
      'zh-CN': '定制化日本企业及工厂考察行程。提供制造业、医疗、科技领域的深入见解。',
      en: 'Customized inspection tours to Japanese companies and factories. Deep insights in manufacturing, medical, and technology sectors.',
      ko: '일본 기업·공장 시찰 투어 맞춤 설계. 제조업, 의료, 테크놀로지 분야의 깊은 인사이트를 제공합니다.',
    },
    link: '/business/inspection',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800',
    stats: {
      ja: ['100社+視察実績', 'オーダーメイド', '通訳同行'],
      'zh-TW': ['100+企業考察', '量身定制', '翻譯隨行'],
      'zh-CN': ['100+企业考察', '量身定制', '翻译随行'],
      en: ['100+ Companies', 'Tailor-made', 'Interpreter Included'],
      ko: ['100+ 기업 시찰', '맞춤형 설계', '통역 동행'],
    },
    icon: Briefcase,
  },
  {
    id: 'partner',
    title: {
      ja: 'ガイドパートナー',
      'zh-TW': '導遊合夥人',
      'zh-CN': '导游合伙人',
      en: 'Guide Partner Program',
      ko: '가이드 파트너',
    },
    titleEn: 'Guide Partner Program',
    description: {
      ja: '在日華人ガイド向けのホワイトラベルソリューション。旅行会社レベルのリソースと技術を提供し、個人ガイドのビジネスをサポート。',
      'zh-TW': '在日華人導遊的白標解決方案。提供旅行社級別的資源與技術，支持個人導遊的業務發展。',
      'zh-CN': '在日华人导游的白标解决方案。提供旅行社级别的资源与技术，支持个人导游的业务发展。',
      en: 'White-label solutions for Chinese-speaking guides in Japan. Providing travel agency-level resources and technology to support individual guide businesses.',
      ko: '재일 가이드를 위한 화이트라벨 솔루션. 여행사 수준의 리소스와 기술을 제공하여 개인 가이드의 비즈니스를 지원합니다.',
    },
    link: '/business/partner',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
    stats: {
      ja: ['3,000名+ネットワーク', 'AIツール提供', '高還元率'],
      'zh-TW': ['3,000+人網絡', 'AI工具支援', '高回饋率'],
      'zh-CN': ['3,000+人网络', 'AI工具支持', '高回馈率'],
      en: ['3,000+ Network', 'AI Tools', 'High Returns'],
      ko: ['3,000+ 네트워크', 'AI 도구 제공', '높은 환원율'],
    },
    icon: Users,
  },
] as const;
