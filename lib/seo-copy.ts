/**
 * 各页面的标题与描述文案（四语言）。
 *
 * 背景：正文早已按 URL 前缀本地化，但 <title> / <description> 一直是同一份
 * 繁体中文 —— 日文版页面在 Google 结果里显示的是繁体标题。
 *
 * 这里集中放文案，便于人工校订措辞。改这里不需要动任何页面组件。
 *
 * ⚠️ 韩语不在此列：站内 54 个页面走 useLanguage4()，韩语文案缺失时回退日语，
 * /ko/* 因此也不进索引（见 lib/i18n-routing 的 HREFLANG_LOCALES）。
 * 韩语正文补齐后，这里同步加 ko 即可。
 */

export type MetaLocale = 'zh-TW' | 'zh-CN' | 'ja' | 'en';

export interface MetaCopy {
  title: string;
  description: string;
}

/** 站名后缀 —— 也要跟着语言变，否则日文标题末尾挂着繁体社名 */
export const SITE_NAME_BY_LOCALE: Record<MetaLocale, string> = {
  'zh-TW': '新島交通株式會社',
  'zh-CN': '新岛交通株式会社',
  ja: '新島交通株式会社',
  en: 'Niijima Kotsu Co., Ltd.',
};

/** 首页（根 layout 的默认标题）。
 *  ⚠️ 这里不要带社名 —— buildMetadata 会统一补 “| 站名”后缀，
 *  写进来会变成「新島交通株式會社 | … | 新島交通株式會社」。 */
export const HOME_COPY: Record<MetaLocale, MetaCopy> = {
  'zh-TW': {
    title: '日本高端體檢・癌症治療・名門高爾夫・商務考察',
    description:
      '新島交通株式會社 —— 日本醫療旅遊一站式服務。TIMC OSAKA 精密體檢、PET-CT 癌症篩查、日本綜合治療轉診、名門高爾夫與商務考察安排。全程中文陪同、專車接送、報告翻譯。',
  },
  'zh-CN': {
    title: '日本高端体检・癌症治疗・名门高尔夫・商务考察',
    description:
      '新岛交通株式会社 —— 日本医疗旅游一站式服务。TIMC OSAKA 精密体检、PET-CT 癌症筛查、日本综合治疗转诊、名门高尔夫与商务考察安排。全程中文陪同、专车接送、报告翻译。',
  },
  ja: {
    title: '日本の精密検診・がん治療・名門ゴルフ・ビジネス視察',
    description:
      '新島交通株式会社 —— 日本の医療ツーリズムをワンストップで。TIMC OSAKA の精密検診、PET-CTによるがん検診、がん治療のご紹介、名門ゴルフとビジネス視察の手配。多言語同行、専用車送迎、レポート翻訳まで対応します。',
  },
  en: {
    title: 'Medical Tourism, Golf and Business Travel in Japan',
    description:
      'Niijima Kotsu — one-stop medical tourism in Japan. Premium health checkups at TIMC OSAKA, PET-CT cancer screening, referrals for cancer treatment, prestige golf and corporate inspection tours. Multilingual escort, private transfers and report translation included.',
  },
};

/** 按路径查文案。键是无语言前缀的路径。 */
export const PAGE_COPY: Record<string, Record<MetaLocale, MetaCopy>> = {
  '/medical': {
    'zh-TW': {
      title: 'TIMC OSAKA 精密體檢 | PET-CT・全身MRI・胃腸內視鏡',
      description:
        '德州會 TIMC OSAKA 官方預約代理。VIP 會員套餐、DWIBS 癌症篩查、PET-CT、上下消化道內視鏡。中文專屬禮賓全程陪同，報告翻譯與後續方案一站式安排。',
    },
    'zh-CN': {
      title: 'TIMC OSAKA 精密体检 | PET-CT・全身MRI・胃肠内视镜',
      description:
        '德州会 TIMC OSAKA 官方预约代理。VIP 会员套餐、DWIBS 癌症筛查、PET-CT、上下消化道内视镜。中文专属礼宾全程陪同，报告翻译与后续方案一站式安排。',
    },
    ja: {
      title: 'TIMC OSAKA 精密検診 | PET-CT・全身MRI・上下部内視鏡',
      description:
        '徳洲会 TIMC OSAKA の検診予約代行。VIP会員コース、DWIBSがん検診、PET-CT、上下部内視鏡。多言語コンシェルジュが全行程に同行し、レポート翻訳とその後のご提案まで一括で手配します。',
    },
    en: {
      title: 'TIMC OSAKA Premium Health Checkup | PET-CT, Whole-Body MRI, Endoscopy',
      description:
        'Official booking agent for TIMC OSAKA (Tokushukai). VIP member course, DWIBS cancer screening, PET-CT and upper/lower endoscopy. Multilingual concierge throughout, with report translation and follow-up arranged end to end.',
    },
  },
  '/cancer-treatment': {
    'zh-TW': {
      title: '日本癌症治療轉診 | 關西癌症專門醫院・遠程會診',
      description:
        '對接關西地區癌症專門醫院：兵庫醫科大學、近畿大學醫院、大阪國際癌症中心、IGT 診所。病歷翻譯、遠程會診、赴日治療全程安排。',
    },
    'zh-CN': {
      title: '日本癌症治疗转诊 | 关西癌症专门医院・远程会诊',
      description:
        '对接关西地区癌症专门医院：兵库医科大学、近畿大学医院、大阪国际癌症中心、IGT 诊所。病历翻译、远程会诊、赴日治疗全程安排。',
    },
    ja: {
      title: '日本のがん治療紹介 | 関西のがん専門病院・遠隔相談',
      description:
        '関西のがん専門医療機関（兵庫医科大学病院、近畿大学病院、大阪国際がんセンター、IGTクリニック）へのご紹介。診療記録の翻訳、遠隔相談、来日治療の全行程を手配します。',
    },
    en: {
      title: 'Cancer Treatment in Japan | Kansai Specialist Hospitals, Remote Consultation',
      description:
        'Referrals to leading cancer centres in Kansai — Hyogo Medical University Hospital, Kindai University Hospital, Osaka International Cancer Institute and IGT Clinic. Records translation, remote consultation and full treatment coordination.',
    },
  },
  '/golf': {
    'zh-TW': {
      title: '日本名門高爾夫預約 | 關西名門球場代訂・會員制球場引薦',
      description:
        '日本關西名門高爾夫球場預約代訂。會員制球場引薦、專車接送、球僮與翻譯安排，可與體檢或商務行程合併規劃。',
    },
    'zh-CN': {
      title: '日本名门高尔夫预约 | 关西名门球场代订・会员制球场引荐',
      description:
        '日本关西名门高尔夫球场预约代订。会员制球场引荐、专车接送、球童与翻译安排，可与体检或商务行程合并规划。',
    },
    ja: {
      title: '名門ゴルフ場の予約代行 | 関西の名門コース・メンバー制コース',
      description:
        '関西の名門ゴルフコースの予約代行。メンバー制コースのご紹介、専用車送迎、キャディと通訳の手配。検診やビジネス視察との組み合わせも承ります。',
    },
    en: {
      title: 'Prestige Golf in Japan | Kansai Championship and Members-Only Courses',
      description:
        "Booking service for Japan's prestige golf courses in Kansai, including members-only clubs. Private transfers, caddie and interpreter arranged; combinable with a health checkup or business itinerary.",
    },
  },
  '/business': {
    'zh-TW': {
      title: '日本商務考察 | 企業參訪・產業考察行程規劃',
      description:
        '面向企業客戶的日本商務考察安排：產業參訪對接、日程規劃、翻譯與專車、住宿與宴請一站式落地。',
    },
    'zh-CN': {
      title: '日本商务考察 | 企业参访・产业考察行程规划',
      description:
        '面向企业客户的日本商务考察安排：产业参访对接、日程规划、翻译与专车、住宿与宴请一站式落地。',
    },
    ja: {
      title: '日本ビジネス視察 | 企業訪問・産業視察の行程設計',
      description:
        '法人向けの日本ビジネス視察手配。企業訪問のアポイント取得、日程設計、通訳と専用車、宿泊と会食まで一括で対応します。',
    },
    en: {
      title: 'Business Inspection Tours in Japan | Corporate Visits and Industry Study',
      description:
        'Corporate inspection tours in Japan — company visit arrangements, itinerary design, interpreters and private transport, accommodation and dining handled end to end.',
    },
  },
  '/business/partner': {
    'zh-TW': {
      title: '同業合作 | 旅行社的日本醫療與高爾夫資源通道',
      description:
        '為旅行社與企業客戶提供日本醫療、高爾夫與商務考察的資源通道。靈活的合作模式與透明分潤，助傳統旅行社轉型高毛利醫療旅遊。',
    },
    'zh-CN': {
      title: '同业合作 | 旅行社的日本医疗与高尔夫资源通道',
      description:
        '为旅行社与企业客户提供日本医疗、高尔夫与商务考察的资源通道。灵活的合作模式与透明分润，助传统旅行社转型高毛利医疗旅游。',
    },
    ja: {
      title: '同業者アライアンス | 旅行会社向けの日本医療・ゴルフ手配',
      description:
        '旅行会社・法人向けに、日本の医療、ゴルフ、ビジネス視察の手配網を開放します。柔軟な提携形態と明快なレベニューシェアで、既存の旅行事業を高付加価値の医療ツーリズムへ。',
    },
    en: {
      title: 'Trade Partnerships | Japan Medical and Golf Sourcing for Travel Agencies',
      description:
        'Access our Japanese medical, golf and business-inspection network as a travel agency or corporate buyer. Flexible partnership models and transparent revenue share.',
    },
  },
  '/guide-partner': {
    'zh-TW': {
      title: '導遊合夥人招募 | 您帶客戶，我們出資源',
      description:
        '面向在日導遊與地接的合夥人計畫：您帶客戶，我們提供日本醫療與高爾夫資源並支付介紹手續費。專屬白標頁面、訂單追蹤、佣金結算。',
    },
    'zh-CN': {
      title: '导游合伙人招募 | 您带客户，我们出资源',
      description:
        '面向在日导游与地接的合伙人计划：您带客户，我们提供日本医疗与高尔夫资源并支付介绍手续费。专属白标页面、订单追踪、佣金结算。',
    },
    ja: {
      title: 'ガイドパートナー募集 | お客様はあなたが、手配は当社が',
      description:
        '在日ガイド・ランドオペレーター向けのパートナー制度。お客様をご紹介いただければ、医療とゴルフの手配は当社が行い、紹介手数料をお支払いします。専用ページ、予約状況の確認、報酬精算に対応。',
    },
    en: {
      title: 'Guide Partner Programme | You Bring the Client, We Bring the Access',
      description:
        'A partner programme for guides and land operators in Japan. Refer your clients and we handle the medical and golf arrangements, paying you a referral fee. Includes a branded page, booking tracking and commission settlement.',
    },
  },
  '/health-screening': {
    'zh-TW': {
      title: 'AI 智能健康問診 | 免費症狀初篩與就診科別建議',
      description:
        '輸入症狀，由多模型 AI 管線做初步分診：風險等級、建議就診科別、需要補充的檢查方向，並匹配日本合作醫療機構。僅供參考，不構成醫療診斷。',
    },
    'zh-CN': {
      title: 'AI 智能健康问诊 | 免费症状初筛与就诊科室建议',
      description:
        '输入症状，由多模型 AI 管线做初步分诊：风险等级、建议就诊科室、需要补充的检查方向，并匹配日本合作医疗机构。仅供参考，不构成医疗诊断。',
    },
    ja: {
      title: 'AI健康問診 | 症状の一次スクリーニングと受診科のご提案',
      description:
        '症状を入力すると、複数のAIモデルによる一次トリアージを行い、緊急度、受診をおすすめする診療科、追加で必要な検査の方向性を示し、提携医療機関をご案内します。参考情報であり、診断ではありません。',
    },
    en: {
      title: 'AI Health Screening | Free Symptom Triage and Specialty Guidance',
      description:
        'Describe your symptoms and a multi-model AI pipeline returns an initial triage: urgency level, the specialty to see, tests worth adding, and matching partner hospitals in Japan. For reference only; not a medical diagnosis.',
    },
  },
  '/faq': {
    'zh-TW': {
      title: '常見問題 | 赴日體檢與就醫流程說明',
      description:
        '赴日體檢與就醫的常見問題：預約流程、簽證與停留、費用與付款方式、報告與翻譯、陪同接送、退改規則。',
    },
    'zh-CN': {
      title: '常见问题 | 赴日体检与就医流程说明',
      description:
        '赴日体检与就医的常见问题：预约流程、签证与停留、费用与付款方式、报告与翻译、陪同接送、退改规则。',
    },
    ja: {
      title: 'よくあるご質問 | 来日検診・受診の流れ',
      description:
        '来日しての検診・受診に関するよくあるご質問。予約の流れ、ビザと滞在、費用とお支払い、レポートと翻訳、同行と送迎、変更・キャンセル規定について。',
    },
    en: {
      title: 'FAQ | Health Checkups and Medical Visits in Japan',
      description:
        'Common questions about health checkups and medical visits in Japan: booking process, visas and stay, fees and payment, reports and translation, escort and transfers, changes and cancellations.',
    },
  },
  '/news': {
    'zh-TW': {
      title: '最新消息 | 新島交通公告與醫療旅遊資訊',
      description: '新島交通株式會社的公告、合作醫療機構動態，以及赴日醫療旅遊相關資訊。',
    },
    'zh-CN': {
      title: '最新消息 | 新岛交通公告与医疗旅游资讯',
      description: '新岛交通株式会社的公告、合作医疗机构动态，以及赴日医疗旅游相关资讯。',
    },
    ja: {
      title: 'お知らせ | 新島交通からのご案内と医療ツーリズム情報',
      description: '新島交通株式会社からのお知らせ、提携医療機関の最新情報、来日医療に関する話題をお届けします。',
    },
    en: {
      title: 'News | Announcements and Medical Tourism Updates',
      description:
        'Announcements from Niijima Kotsu, updates from our partner hospitals, and news on medical travel to Japan.',
    },
  },
  '/company/about': {
    'zh-TW': {
      title: '公司簡介・會社概要',
      description:
        '新島交通株式會社 —— 立足日本的醫療旅遊與商務服務公司。提供精密體檢、綜合治療轉診、名門高爾夫與商務考察的一站式落地服務。',
    },
    'zh-CN': {
      title: '公司简介・会社概要',
      description:
        '新岛交通株式会社 —— 立足日本的医疗旅游与商务服务公司。提供精密体检、综合治疗转诊、名门高尔夫与商务考察的一站式落地服务。',
    },
    ja: {
      title: '会社概要',
      description:
        '新島交通株式会社 —— 日本を拠点とする医療ツーリズム・ビジネス手配会社。精密検診、がん治療のご紹介、名門ゴルフ、ビジネス視察をワンストップで手配します。',
    },
    en: {
      title: 'About Us',
      description:
        'Niijima Kotsu Co., Ltd. — a Japan-based medical tourism and business travel company, arranging premium health checkups, treatment referrals, prestige golf and corporate inspection tours end to end.',
    },
  },
  '/package-recommender': {
    'zh-TW': {
      title: '體檢套餐推薦 | 依年齡與關注項目挑選日本體檢方案',
      description: '回答幾個問題，依年齡、性別與關注的健康項目，推薦適合的日本精密體檢套餐與檢查組合。',
    },
    'zh-CN': {
      title: '体检套餐推荐 | 依年龄与关注项目挑选日本体检方案',
      description: '回答几个问题，依年龄、性别与关注的健康项目，推荐适合的日本精密体检套餐与检查组合。',
    },
    ja: {
      title: '検診コース診断 | 年齢と気になる項目からおすすめをご提案',
      description:
        'いくつかの質問にお答えいただくと、年齢・性別・気になる項目に応じて、適した日本の精密検診コースと検査の組み合わせをご提案します。',
    },
    en: {
      title: 'Find Your Checkup Package | Recommendations by Age and Concerns',
      description:
        'Answer a few questions and we suggest the Japanese health checkup package and test combination that fits your age, sex and health concerns.',
    },
  },
};
