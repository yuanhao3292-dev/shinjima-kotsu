'use client';

import React from 'react';
import Image from 'next/image';
import PublicLayout from '@/components/PublicLayout';
import {
  Award, Shield,
  Quote, Globe, Heart, Target,
  Brain, Hospital, HeartHandshake, TrendingUp, Rocket, Building2, Bot, Users
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// 页面翻译
const pageTranslations = {
  // Hero Section
  heroSubtitle: {
    ja: '',
    'zh-TW': '',
    'zh-CN': '',
    en: ''
  },

  // CEO Message Section
  ceoSectionLabel: {
    ja: 'Message from CEO',
    'zh-TW': 'Message from CEO',
    'zh-CN': 'Message from CEO',
    en: 'Message from CEO'
  },
  ceoSectionTitle: {
    ja: 'トップメッセージ',
    'zh-TW': '社長致辭',
    'zh-CN': '社长致辞',
    en: 'CEO Message'
  },
  ceoTitle: {
    ja: '代表取締役',
    'zh-TW': '代表取締役',
    'zh-CN': '代表取缔役',
    en: 'CEO & President'
  },
  ceoSlogan: {
    ja: '"用心連結世界與日本"',
    'zh-TW': '"用心連結世界與日本"',
    'zh-CN': '"用心连结世界与日本"',
    en: '"Connecting the World with Japan, Heart to Heart"'
  },
  ceoMessage1: {
    ja: '私は稲盛和夫氏の人生哲学を深く信じています——人生・仕事の結果＝考え方×熱意×能力。新島交通を創業する過程において、この信念が常に私たちの道標となってまいりました。',
    'zh-TW': '我深信稻盛和夫先生的人生哲學——人生與事業的成果，取決於思維方式、熱情與能力的乘積。在創立新島交通的過程中，這一信念始終指引著我們前行。',
    'zh-CN': '我深信稻盛和夫先生的人生哲学——人生与事业的成果，取决于思维方式、热情与能力的乘积。在创立新岛交通的过程中，这一信念始终指引着我们前行。',
    en: 'I deeply believe in the life philosophy of Mr. Kazuo Inamori — the results of life and work equal the product of mindset, passion, and ability. This belief has guided us throughout the founding and growth of NIIJIMA KOTSU.'
  },
  ceoMessage2: {
    ja: '私たちの事業は、ひとつの素朴な気づきから始まりました。日本には世界トップクラスの医療があるにもかかわらず、言語や情報の壁により、多くの海外の方々がその恩恵を受けられていません。この壁を打ち破り、助けを必要とするすべての方に日本の先端医療を届けること——これが私たちの使命であり、「愛」の実践です。他者の健康を自らの責任と捉えること。',
    'zh-TW': '我們的事業源於一個樸素的觀察：日本擁有世界頂級的醫療資源，卻因語言和信息的壁壘，讓無數海外患者望而卻步。打破這道壁壘，讓每一位需要幫助的人都能享受日本先端醫療——這是我們的使命，也是我們對「愛」的詮釋：把他人的健康視為自己的責任。',
    'zh-CN': '我们的事业源于一个朴素的观察：日本拥有世界顶级的医疗资源，却因语言和信息的壁垒，让无数海外患者望而却步。打破这道壁垒，让每一位需要帮助的人都能享受日本先端医疗——这是我们的使命，也是我们对「爱」的诠释：把他人的健康视为自己的责任。',
    en: 'Our business was born from a simple observation: Japan possesses world-class medical resources, yet language and information barriers deter countless international patients. Breaking down these barriers so everyone in need can access Japan\'s advanced healthcare — this is our mission and our interpretation of "love": treating others\' health as our own responsibility.'
  },
  ceoMessage3: {
    ja: '「真心」とは、一人ひとりのお客様への誓いです。AI問診による最適なマッチングから、多言語対応の付き添い通訳まで、テクノロジーでサービスを進化させ、真心でお客様の心を動かします。「調和」とは、チームと社会への願いです——企業の成功だけでなく、社員一人ひとりがこの舞台で自分自身の人生の価値を実現できることを目指しています。',
    'zh-TW': '所謂「真誠」，體現在我們對每一位客戶的承諾。從AI智能問診的精準匹配，到全程多語種陪診的細緻關懷，我們以科技賦能服務，以真心打動人心。所謂「和諧」，是我們對團隊與社會的期許——不僅追求企業的成功，更希望每一位員工都能在這個平台上實現各自的人生價值。',
    'zh-CN': '所谓「真诚」，体现在我们对每一位客户的承诺。从AI智能问诊的精准匹配，到全程多语种陪诊的细致关怀，我们以科技赋能服务，以真心打动人心。所谓「和谐」，是我们对团队与社会的期许——不仅追求企业的成功，更希望每一位员工都能在这个平台上实现各自的人生价值。',
    en: '"Sincerity" is embodied in our commitment to every client. From precise AI-powered medical matching to attentive multilingual support, we empower services with technology and touch hearts with genuine care. "Harmony" is our aspiration for team and society — pursuing not only business success, but ensuring every team member can realize their own life\'s value on this platform.'
  },
  ceoMessage4: {
    ja: '私たちは「人を大切にすること」「姿勢がすべてを決める」「細部が成否を分ける」という三つの原則を貫いています。医療ツーリズムを核に、AIテクノロジーを原動力として、世界をリードする赴日医療サービスブランドの構築を目指し、「日本で医療を受けたいのに、どうすればいいか分からない」という壁をなくしてまいります。',
    'zh-TW': '我們堅持以人為本、態度決定一切、細節決定成敗。以醫療旅遊為核心，以AI技術為驅動，我們立志打造全球領先的赴日醫療服務品牌，讓「想去日本看病，卻不知從何開始」成為歷史。',
    'zh-CN': '我们坚持以人为本、态度决定一切、细节决定成败。以医疗旅游为核心，以AI技术为驱动，我们立志打造全球领先的赴日医疗服务品牌，让「想去日本看病，却不知从何开始」成为历史。',
    en: 'We uphold three principles: people first, attitude determines everything, and details determine success. With medical tourism at our core and AI technology as our driving force, we aspire to build a globally leading medical travel brand for Japan, making "wanting Japanese healthcare but not knowing where to start" a thing of the past.'
  },
  ceoMessage5: {
    ja: '皆様のご支援を賜りますよう、何卒よろしくお願い申し上げます。',
    'zh-TW': '誠摯期待您的支持與指導。',
    'zh-CN': '诚挚期待您的支持与指导。',
    en: 'We sincerely look forward to your continued support.'
  },

  // Philosophy Section
  philosophyLabel: {
    ja: 'Philosophy',
    'zh-TW': 'Philosophy',
    'zh-CN': 'Philosophy',
    en: 'Philosophy'
  },
  philosophyTitle: {
    ja: '経営理念',
    'zh-TW': '經營理念',
    'zh-CN': '经营理念',
    en: 'Corporate Philosophy'
  },
  philosophy1Title: {
    ja: '用心',
    'zh-TW': '用心',
    'zh-CN': '用心',
    en: 'Sincerity'
  },
  philosophy1Desc: {
    ja: 'お客様の健康と人生に寄り添い、一人ひとりに最適な医療体験をお届けします',
    'zh-TW': '關注客戶的健康與人生，為每一位客戶提供最適合的醫療服務體驗',
    'zh-CN': '关注客户的健康与人生，为每一位客户提供最适合的医疗服务体验',
    en: 'Caring about each client\'s health and life, delivering the most personalized medical experience'
  },
  philosophy2Title: {
    ja: '連結',
    'zh-TW': '連結',
    'zh-CN': '连结',
    en: 'Connection'
  },
  philosophy2Desc: {
    ja: '世界と日本の医療・文化をつなぐ架け橋として、最高品質のサービスをお届けします',
    'zh-TW': '作為世界與日本醫療、文化的橋樑，提供最高品質的服務',
    'zh-CN': '作为世界与日本医疗、文化的桥梁，提供最高品质的服务',
    en: 'As a bridge connecting the world with Japan\'s healthcare and culture, delivering the highest quality service'
  },
  philosophy3Title: {
    ja: '革新',
    'zh-TW': '革新',
    'zh-CN': '革新',
    en: 'Innovation'
  },
  philosophy3Desc: {
    ja: 'AI問診技術で赴日医療の壁を打ち破り、誰もが日本の先端医療にアクセスできる未来を創ります',
    'zh-TW': '以AI問診技術打破赴日醫療的壁壘，讓每個人都能享受日本先端醫療',
    'zh-CN': '以AI问诊技术打破赴日医疗的壁垒，让每个人都能享受日本先端医疗',
    en: 'Breaking down barriers to Japanese healthcare with AI consultation technology, making advanced medicine accessible to all'
  },

  // Company Profile Section
  profileLabel: {
    ja: 'Company Profile',
    'zh-TW': 'Company Profile',
    'zh-CN': 'Company Profile',
    en: 'Company Profile'
  },
  profileTitle: {
    ja: '会社概要',
    'zh-TW': '公司概況',
    'zh-CN': '公司概况',
    en: 'Company Overview'
  },
  labelCompanyName: {
    ja: '商号',
    'zh-TW': '公司名稱',
    'zh-CN': '公司名称',
    en: 'Company Name'
  },
  labelCompanyNameEn: {
    ja: '英文商号',
    'zh-TW': '英文名稱',
    'zh-CN': '英文名称',
    en: 'English Name'
  },
  labelEstablished: {
    ja: '設立',
    'zh-TW': '成立日期',
    'zh-CN': '成立日期',
    en: 'Established'
  },
  labelCapital: {
    ja: '資本金',
    'zh-TW': '資本額',
    'zh-CN': '注册资本',
    en: 'Capital'
  },
  labelCEO: {
    ja: '代表者',
    'zh-TW': '代表人',
    'zh-CN': '代表人',
    en: 'Representative'
  },
  labelFax: {
    ja: 'FAX',
    'zh-TW': 'FAX',
    'zh-CN': 'FAX',
    en: 'FAX'
  },
  labelAddress: {
    ja: '本社所在地',
    'zh-TW': '總部地址',
    'zh-CN': '总部地址',
    en: 'Headquarters'
  },
  labelPhone: {
    ja: '電話番号',
    'zh-TW': '電話',
    'zh-CN': '电话',
    en: 'Phone'
  },
  labelEmail: {
    ja: 'メール',
    'zh-TW': '電子郵件',
    'zh-CN': '电子邮件',
    en: 'Email'
  },
  labelBusiness: {
    ja: '事業内容',
    'zh-TW': '業務範圍',
    'zh-CN': '业务范围',
    en: 'Business'
  },
  valueCompanyName: {
    ja: '新島交通株式会社',
    'zh-TW': '新島交通株式會社',
    'zh-CN': '新岛交通株式会社',
    en: 'NIIJIMA KOTSU Co., Ltd.'
  },
  valueEstablished: {
    ja: '2020年2月',
    'zh-TW': '2020年2月',
    'zh-CN': '2020年2月',
    en: 'February 2020'
  },
  valueCapital: {
    ja: '2,500万円',
    'zh-TW': '2,500萬日圓',
    'zh-CN': '2,500万日元',
    en: '25 Million JPY'
  },
  valueCEO: {
    ja: '代表取締役 員 昊',
    'zh-TW': '代表取締役 員 昊',
    'zh-CN': '代表取缔役 员 昊',
    en: 'CEO Yuan Hao'
  },
  valueFax: {
    ja: '06-6632-8826',
    'zh-TW': '06-6632-8826',
    'zh-CN': '06-6632-8826',
    en: '06-6632-8826'
  },
  valueAddress: {
    ja: '〒556-0014\n大阪府大阪市浪速区大国1-2-21\nNICビル602号',
    'zh-TW': '〒556-0014\n日本大阪府大阪市浪速區大國1-2-21\nNIC大樓602號',
    'zh-CN': '〒556-0014\n日本大阪府大阪市浪速区大国1-2-21\nNIC大楼602号',
    en: '〒556-0014\nNIC Building 602, 1-2-21 Daikoku,\nNaniwa-ku, Osaka, Japan'
  },
  valueBusiness: {
    ja: '・インバウンド旅行事業\n・医療ツーリズム事業\n・ゴルフツーリズム事業\n・ビジネス視察事業',
    'zh-TW': '・入境旅遊事業\n・醫療旅遊事業\n・高爾夫旅遊事業\n・商務考察事業',
    'zh-CN': '・入境旅游事业\n・医疗旅游事业\n・高尔夫旅游事业\n・商务考察事业',
    en: '・Inbound Travel Services\n・Medical Tourism\n・Golf Tourism\n・Business Inspection Tours'
  },

  // Licenses Section
  licensesLabel: {
    ja: 'Licenses',
    'zh-TW': 'Licenses',
    'zh-CN': 'Licenses',
    en: 'Licenses'
  },
  licensesTitle: {
    ja: '登録・許認可',
    'zh-TW': '資質認證',
    'zh-CN': '资质认证',
    en: 'Licenses & Certifications'
  },
  license1Title: {
    ja: '第二種旅行業',
    'zh-TW': '第二種旅行業',
    'zh-CN': '第二种旅行业',
    en: 'Type 2 Travel Agency'
  },
  license1Number: {
    ja: '大阪府知事登録',
    'zh-TW': '大阪府知事登錄',
    'zh-CN': '大阪府知事登录',
    en: 'Registered with Osaka Prefecture'
  },
  license1Desc: {
    ja: '国内旅行・海外旅行の手配旅行業務',
    'zh-TW': '國內及海外旅遊安排業務（手配旅行）',
    'zh-CN': '国内及海外旅游安排业务（手配旅行）',
    en: 'Domestic and international travel arrangement services'
  },
  license2Title: {
    ja: '日本旅行業協会',
    'zh-TW': '日本旅行業協會',
    'zh-CN': '日本旅行业协会',
    en: 'JATA Member'
  },
  license2Number: {
    ja: 'JATA 正会員',
    'zh-TW': 'JATA 正式會員',
    'zh-CN': 'JATA 正式会员',
    en: 'JATA Official Member'
  },
  license2Desc: {
    ja: '日本旅行業協会に加盟',
    'zh-TW': '日本旅行業協會會員',
    'zh-CN': '日本旅行业协会会员',
    en: 'Member of Japan Association of Travel Agents'
  },
  // Partners Section
  partnersLabel: {
    ja: 'Partners',
    'zh-TW': 'Partners',
    'zh-CN': 'Partners',
    en: 'Partners'
  },
  partnersTitle: {
    ja: '主要取引先',
    'zh-TW': '主要合作夥伴',
    'zh-CN': '主要合作伙伴',
    en: 'Key Partners'
  },
  partnersMedicalLabel: {
    ja: '医療パートナー',
    'zh-TW': '醫療合作機構',
    'zh-CN': '医疗合作机构',
    en: 'Medical Partners'
  },
  partnersServiceLabel: {
    ja: 'サービスパートナー',
    'zh-TW': '服務合作夥伴',
    'zh-CN': '服务合作伙伴',
    en: 'Service Partners'
  },

  // Medical Strengths Section
  medicalLabel: {
    ja: 'Medical Excellence',
    'zh-TW': 'Medical Excellence',
    'zh-CN': 'Medical Excellence',
    en: 'Medical Excellence'
  },
  medicalTitle: {
    ja: '医療の強み',
    'zh-TW': '醫療實力',
    'zh-CN': '医疗实力',
    en: 'Medical Strengths'
  },
  medicalAiTitle: {
    ja: 'AI問診システム',
    'zh-TW': 'AI智能問診系統',
    'zh-CN': 'AI智能问诊系统',
    en: 'AI Medical Consultation'
  },
  medicalAiDesc: {
    ja: '独自開発のAI問診技術で、言語・医療知識の壁を取り除き、最適な診療科と医療機関をご案内',
    'zh-TW': '自主研發AI問診技術，消除語言與醫療知識壁壘，精準推薦診療科與醫療機構',
    'zh-CN': '自主研发AI问诊技术，消除语言与医疗知识壁垒，精准推荐诊疗科与医疗机构',
    en: 'Proprietary AI consultation technology eliminates language and medical knowledge barriers, precisely matching patients with the right departments and hospitals'
  },
  medicalNetworkTitle: {
    ja: '幅広い医療領域',
    'zh-TW': '多元醫療領域',
    'zh-CN': '多元医疗领域',
    en: 'Comprehensive Medical Fields'
  },
  medicalNetworkDesc: {
    ja: '精密健診・がん治療・美容医療・再生医療など、大学病院から専門クリニックまで幅広くカバー',
    'zh-TW': '精密體檢、癌症治療、醫療美容、再生醫療等，從大學醫院到專科診所全面覆蓋',
    'zh-CN': '精密体检、癌症治疗、医疗美容、再生医疗等，从大学医院到专科诊所全面覆盖',
    en: 'From precision screenings to cancer treatment, aesthetic medicine, and regenerative therapy — covering university hospitals to specialized clinics'
  },
  medicalServiceTitle: {
    ja: 'フルサポート体制',
    'zh-TW': '全程服務體系',
    'zh-CN': '全程服务体系',
    en: 'Full Support System'
  },
  medicalServiceDesc: {
    ja: 'AI問診から予約手配、中国語通訳、術後フォローまで、ワンストップでサポート',
    'zh-TW': '從AI問診到預約安排、中文翻譯、術後跟進，一站式全程服務',
    'zh-CN': '从AI问诊到预约安排、中文翻译、术后跟进，一站式全程服务',
    en: 'One-stop support from AI consultation to appointment scheduling, interpretation, and post-treatment follow-up'
  },

  // IPO Vision Section
  ipoLabel: {
    ja: 'VISION 2030',
    'zh-TW': 'VISION 2030',
    'zh-CN': 'VISION 2030',
    en: 'VISION 2030'
  },
  ipoTitle: {
    ja: '日本上場を目指して',
    'zh-TW': '邁向日本上市',
    'zh-CN': '迈向日本上市',
    en: 'Toward Japan IPO'
  },
  ipoDesc: {
    ja: '赴日医療事業を中核に、2030年の日本市場上場を目指しています。AI医療技術と20以上の提携医療機関のネットワークを基盤に、アジアから日本への医療ツーリズムのリーディングカンパニーを目指します。',
    'zh-TW': '以赴日醫療業務為核心，目標2030年在日本上市。依託AI醫療技術與20餘家合作醫療機構網絡，致力成為亞洲赴日醫療旅遊的領軍企業。',
    'zh-CN': '以赴日医疗业务为核心，目标2030年在日本上市。依托AI医疗技术与20余家合作医疗机构网络，致力成为亚洲赴日医疗旅游的领军企业。',
    en: 'With inbound medical tourism as our core business, we aim to go public on the Japanese market by 2030. Leveraging AI medical technology and a network of 20+ partner hospitals, we strive to become the leading company in Asia-to-Japan medical tourism.'
  },
  ipoMilestone1Title: {
    ja: '2026',
    'zh-TW': '2026',
    'zh-CN': '2026',
    en: '2026'
  },
  ipoMilestone1Desc: {
    ja: 'AI問診システムが日本国内180医療機関をカバー',
    'zh-TW': 'AI問診系統覆蓋日本180家醫療機構',
    'zh-CN': 'AI问诊系统覆盖日本180家医疗机构',
    en: 'AI consultation system covers 180 hospitals in Japan'
  },
  ipoMilestone2Title: {
    ja: '2027',
    'zh-TW': '2027',
    'zh-CN': '2027',
    en: '2027'
  },
  ipoMilestone2Desc: {
    ja: 'AI問診対応 500施設以上に拡大\n業務の85%を無人化・自動化（販売前後）',
    'zh-TW': 'AI問診覆蓋醫療機構突破500家\n實現85%業務無人化自動售前售後',
    'zh-CN': 'AI问诊覆盖医疗机构突破500家\n实现85%业务无人化自动售前售后',
    en: 'AI coverage expands to 500+ hospitals\n85% business automation in pre & post sales'
  },
  ipoMilestone3Title: {
    ja: '2028',
    'zh-TW': '2028',
    'zh-CN': '2028',
    en: '2028'
  },
  ipoMilestone3Desc: {
    ja: '年間外国人入国患者数 20,000人突破',
    'zh-TW': '年均接診外國入境患者突破2萬人',
    'zh-CN': '年均接诊外国入境患者突破2万人',
    en: 'Annual inbound patients exceed 20,000'
  },
  ipoMilestone4Title: {
    ja: '2029',
    'zh-TW': '2029',
    'zh-CN': '2029',
    en: '2029'
  },
  ipoMilestone4Desc: {
    ja: '完全無人化の病状追跡を実現\nVIP専用AIメディカルアシスタント',
    'zh-TW': '實現全面無人化病情跟蹤\n打造VIP專屬AI醫療助理',
    'zh-CN': '实现全面无人化病情跟踪\n打造VIP专属AI医疗助理',
    en: 'Fully automated patient tracking\nVIP exclusive AI medical assistant'
  },
  ipoMilestone5Title: {
    ja: '2030',
    'zh-TW': '2030',
    'zh-CN': '2030',
    en: '2030'
  },
  ipoMilestone5Desc: {
    ja: '日本市場上場（IPO）',
    'zh-TW': '日本市場上市（IPO）',
    'zh-CN': '日本市场上市（IPO）',
    en: 'Japan Market IPO'
  },

};

export default function AboutPage() {
  const currentLang = useLanguage();

  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][currentLang];

  const medicalPartners = [
    { ja: '徳洲会グループ', 'zh-TW': '德州會集團', 'zh-CN': '德州会集团', en: 'Tokushukai Group' },
    { ja: 'TIMC OSAKA', 'zh-TW': 'TIMC OSAKA', 'zh-CN': 'TIMC OSAKA', en: 'TIMC OSAKA' },
  ];

  const servicePartners = [
    { ja: '株式会社南海国際旅行', 'zh-TW': '株式會社南海國際旅行', 'zh-CN': '株式会社南海国际旅行', en: 'Nankai International Travel Co., Ltd.' },
    { ja: '株式会社大丸松坂屋百貨店', 'zh-TW': '大丸松坂屋百貨', 'zh-CN': '大丸松坂屋百货', en: 'Daimaru Matsuzakaya Department Stores Co., Ltd.' },
    { ja: '株式会社近鉄百貨店', 'zh-TW': '近鐵百貨', 'zh-CN': '近铁百货', en: 'Kintetsu Department Store Co., Ltd.' },
    { ja: '海南航空', 'zh-TW': '海南航空', 'zh-CN': '海南航空', en: 'Hainan Airlines' },
    { ja: 'INSOUホールディングス株式会社', 'zh-TW': 'INSOU控股株式會社', 'zh-CN': 'INSOU控股株式会社', en: 'INSOU Holdings Co., Ltd.' },
    { ja: 'アリババ日本', 'zh-TW': '阿里巴巴日本', 'zh-CN': '阿里巴巴日本', en: 'Alibaba Japan' },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center bg-brand-900 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
            <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
          </div>

          <div className="relative container mx-auto px-6 py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-gold-400"></div>
                <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">NIIJIMA KOTSU Co., Ltd.</span>
                <div className="h-[1px] w-12 bg-gold-400"></div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
                {t('valueCompanyName')}
              </h1>
            </div>
          </div>
        </section>

        {/* CEO Message Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                  <span className="text-xs tracking-[0.3em] text-gold-500 uppercase">{t('ceoSectionLabel')}</span>
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                </div>
                <h2 className="text-3xl font-serif text-brand-900 mt-3">{t('ceoSectionTitle')}</h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* CEO Photo */}
                <div className="lg:w-1/3 flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold-400/20 transform translate-x-4 translate-y-4 rounded-2xl"></div>
                    <Image
                      src="https://i.ibb.co/B2mJDvq7/founder.jpg"
                      alt="Yuan Hao"
                      width={400}
                      height={533}
                      quality={75}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="relative rounded-2xl shadow-lg w-full aspect-[3/4] object-cover object-top"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-neutral-500">{t('ceoTitle')}</p>
                    <p className="text-2xl font-bold text-brand-900 mt-1">員 昊</p>
                    <p className="text-sm text-neutral-400">Yuan Hao</p>
                  </div>
                </div>

                {/* Message Content */}
                <div className="lg:w-2/3">
                  <div className="relative mb-8">
                    <Quote className="absolute -top-4 -left-6 text-neutral-100 w-20 h-20 transform -scale-x-100" />
                    <p className="text-2xl text-brand-900 relative z-10 italic font-serif pl-4 border-l-4 border-gold-400 leading-relaxed">
                      {t('ceoSlogan')}
                    </p>
                  </div>

                  <div className="space-y-5 text-neutral-600 leading-relaxed">
                    <p>{t('ceoMessage1')}</p>
                    <p>{t('ceoMessage2')}</p>
                    <p>
                      {t('ceoMessage3')}
                    </p>
                    <p>{t('ceoMessage4')}</p>
                    <p className="text-lg font-medium text-brand-900 pt-4">
                      {t('ceoMessage5')}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-200">
                    <p className="text-brand-900 font-bold">{t('valueCompanyName')}</p>
                    <p className="text-neutral-600">{t('valueCEO')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Philosophy */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                  <span className="text-xs tracking-[0.3em] text-gold-500 uppercase">{t('philosophyLabel')}</span>
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                </div>
                <h2 className="text-3xl font-serif text-brand-900 mt-3">{t('philosophyTitle')}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 border border-neutral-200 text-center hover:shadow-lg transition">
                  <div className="w-16 h-16 bg-brand-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-3">{t('philosophy1Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {t('philosophy1Desc')}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-neutral-200 text-center hover:shadow-lg transition">
                  <div className="w-16 h-16 bg-brand-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-3">{t('philosophy2Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {t('philosophy2Desc')}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-neutral-200 text-center hover:shadow-lg transition">
                  <div className="w-16 h-16 bg-brand-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-3">{t('philosophy3Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {t('philosophy3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Strengths */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                  <span className="text-xs tracking-[0.3em] text-gold-500 uppercase">{t('medicalLabel')}</span>
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                </div>
                <h2 className="text-3xl font-serif text-brand-900 mt-3">{t('medicalTitle')}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="relative flex flex-col bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-8 text-white">
                  <Brain className="w-10 h-10 text-gold-400 mb-5" />
                  <h3 className="text-lg font-bold mb-3">{t('medicalAiTitle')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed flex-1">{t('medicalAiDesc')}</p>
                  <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gold-400">4</span>
                      <span className="text-white/60 text-sm">{currentLang === 'en' ? 'languages supported' : currentLang === 'ja' ? '言語対応' : '语言支持'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition">
                  <Hospital className="w-10 h-10 text-brand-900 mb-5" />
                  <h3 className="text-lg font-bold text-brand-900 mb-3">{t('medicalNetworkTitle')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed flex-1">{t('medicalNetworkDesc')}</p>
                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-brand-900">20+</span>
                      <span className="text-neutral-400 text-sm">{currentLang === 'en' ? 'partner hospitals' : currentLang === 'ja' ? '提携医療機関' : currentLang === 'zh-TW' ? '合作醫院' : '合作医院'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition">
                  <HeartHandshake className="w-10 h-10 text-brand-900 mb-5" />
                  <h3 className="text-lg font-bold text-brand-900 mb-3">{t('medicalServiceTitle')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed flex-1">{t('medicalServiceDesc')}</p>
                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-brand-900">4 AI</span>
                      <span className="text-neutral-400 text-sm">{currentLang === 'en' ? 'joint consultation' : currentLang === 'ja' ? '連合会診' : currentLang === 'zh-TW' ? '聯合會診' : '联合会诊'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Profile Table */}
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                  <span className="text-xs tracking-[0.3em] text-gold-500 uppercase">{t('profileLabel')}</span>
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                </div>
                <h2 className="text-3xl font-serif text-brand-900 mt-3">{t('profileTitle')}</h2>
              </div>

              <div className="bg-neutral-50 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-neutral-200">
                    {[
                      { label: t('labelCompanyName'), value: t('valueCompanyName') },
                      { label: t('labelCompanyNameEn'), value: 'NIIJIMA KOTSU Co., Ltd.' },
                      { label: t('labelEstablished'), value: t('valueEstablished') },
                      { label: t('labelCapital'), value: t('valueCapital') },
                      { label: t('labelCEO'), value: t('valueCEO') },
                      { label: t('labelAddress'), value: t('valueAddress') },
                      { label: t('labelPhone'), value: '06-6632-8807' },
                      { label: t('labelFax'), value: t('valueFax') },
                      { label: t('labelEmail'), value: 'haoyuan@niijima-koutsu.jp' },
                      { label: t('labelBusiness'), value: t('valueBusiness') },
                    ].map((row, index) => (
                      <tr key={index} className="flex flex-col md:table-row hover:bg-white transition">
                        <th className="py-5 px-6 text-left font-bold text-brand-900 bg-neutral-100 md:bg-transparent md:w-44">
                          {row.label}
                        </th>
                        <td className="py-5 px-6 text-neutral-600 whitespace-pre-line">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Licenses & Certifications */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                  <span className="text-xs tracking-[0.3em] text-gold-500 uppercase">{t('licensesLabel')}</span>
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                </div>
                <h2 className="text-3xl font-serif text-brand-900 mt-3">{t('licensesTitle')}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Award,
                    title: t('license1Title'),
                    number: t('license1Number'),
                    desc: t('license1Desc'),
                  },
                  {
                    icon: Shield,
                    title: t('license2Title'),
                    number: t('license2Number'),
                    desc: t('license2Desc'),
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-md transition">
                      <div className="w-14 h-14 bg-brand-900 rounded-xl flex items-center justify-center mb-4">
                        <Icon size={24} className="text-gold-400" />
                      </div>
                      <h3 className="font-bold text-brand-900 text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-neutral-500 mb-2">{item.number}</p>
                      <p className="text-sm text-neutral-600">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* IPO Vision 2030 */}
        <section className="py-20 bg-brand-900 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                  <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">{t('ipoLabel')}</span>
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                </div>
                <h2 className="text-3xl font-serif text-white mt-3">{t('ipoTitle')}</h2>
                <p className="text-neutral-300 text-sm leading-relaxed mt-4 max-w-2xl mx-auto">{t('ipoDesc')}</p>
              </div>

              <div className="max-w-2xl mx-auto relative">
                {/* 中间竖线 */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/20" />

                {[
                  { icon: Building2, year: t('ipoMilestone1Title'), desc: t('ipoMilestone1Desc'), active: true },
                  { icon: Hospital, year: t('ipoMilestone2Title'), desc: t('ipoMilestone2Desc'), active: false },
                  { icon: Users, year: t('ipoMilestone3Title'), desc: t('ipoMilestone3Desc'), active: false },
                  { icon: Bot, year: t('ipoMilestone4Title'), desc: t('ipoMilestone4Desc'), active: false },
                  { icon: TrendingUp, year: t('ipoMilestone5Title'), desc: t('ipoMilestone5Desc'), active: false },
                ].map((item, index) => {
                  const Icon = item.icon;
                  const isLeft = index % 2 === 0;
                  return (
                    <div key={index} className={`relative flex items-center mb-8 last:mb-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* 内容卡片 */}
                      <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-0 md:text-right' : 'md:pl-0 md:text-left'}`}>
                        <div className={`p-5 border ${item.active ? 'border-gold-400 bg-white/5' : 'border-white/10'}`}>
                          <h3 className={`text-xl font-bold mb-1 ${item.active ? 'text-gold-400' : 'text-white'}`}>{item.year}</h3>
                          <p className="text-sm text-neutral-300 whitespace-pre-line">{item.desc}</p>
                        </div>
                      </div>
                      {/* 中间节点 */}
                      <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center z-10 ${item.active ? 'bg-gold-400 text-brand-900' : 'bg-brand-800 border border-white/20 text-gold-400'}`}>
                        <Icon size={20} />
                      </div>
                      {/* 占位 */}
                      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                  <span className="text-xs tracking-[0.3em] text-gold-500 uppercase">{t('partnersLabel')}</span>
                  <div className="h-[1px] w-12 bg-gold-400"></div>
                </div>
                <h2 className="text-3xl font-serif text-brand-900 mt-3">{t('partnersTitle')}</h2>
              </div>

              {/* Medical Partners */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold-400 rounded-full" />
                  {t('partnersMedicalLabel')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {medicalPartners.map((partner, index) => (
                    <div key={index} className="p-5 bg-brand-900/5 rounded-xl text-center font-medium text-brand-900 border border-brand-900/10 hover:bg-brand-900 hover:text-white transition cursor-default">
                      {partner[currentLang]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Partners */}
              <div>
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-neutral-300 rounded-full" />
                  {t('partnersServiceLabel')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {servicePartners.map((partner, index) => (
                    <div key={index} className="p-5 bg-neutral-50 rounded-xl text-center font-medium text-neutral-700 hover:bg-brand-900 hover:text-white transition cursor-default">
                      {partner[currentLang]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
