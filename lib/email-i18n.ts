// ============================================
// 邮件多语言翻译表
// ============================================

export type EmailLocale = 'ja' | 'zh-CN' | 'zh-TW' | 'en';

/** 安全取翻译，fallback 到 ja */
export function t(
  map: Record<EmailLocale, string>,
  locale: EmailLocale
): string {
  return map[locale] || map['ja'];
}

// ============================================
// 共通 (Common)
// ============================================

export const common = {
  footerCompany: {
    ja: '新島交通株式会社',
    'zh-CN': '新島交通株式会社',
    'zh-TW': '新島交通株式會社',
    en: 'Niijima Kotsu Co., Ltd.',
  },
  footerDisclaimer: {
    ja: 'このメールはシステムから自動送信されています。直接返信しないでください。',
    'zh-CN': '此邮件由系统自动发送，请勿直接回复',
    'zh-TW': '此郵件由系統自動發送，請勿直接回覆',
    en: 'This email was sent automatically. Please do not reply directly.',
  },
  contactPrompt: {
    ja: 'ご不明な点がございましたら、お気軽にお問い合わせください',
    'zh-CN': '如有任何问题，欢迎联系我们',
    'zh-TW': '如有任何問題，歡迎聯繫我們',
    en: 'If you have any questions, please feel free to contact us',
  },
  lineButton: {
    ja: 'LINE でお問い合わせ',
    'zh-CN': 'LINE 即时咨询',
    'zh-TW': 'LINE 即時諮詢',
    en: 'Contact via LINE',
  },
  wechatButton: {
    ja: 'WeChat でお問い合わせ',
    'zh-CN': '微信扫码咨询',
    'zh-TW': '微信掃碼諮詢',
    en: 'Contact via WeChat',
  },
} as const;

// ============================================
// 1. 订单确认邮件 (Order Confirmation)
// ============================================

export const orderConfirmation = {
  fromName: {
    ja: 'TIMC 健診予約',
    'zh-CN': 'TIMC 体检预约',
    'zh-TW': 'TIMC 體檢預約',
    en: 'TIMC Medical Check-up',
  },
  subject: {
    ja: '【TIMC】ご予約が確認されました - 注文 #{{orderId}}',
    'zh-CN': '【TIMC】您的体检预约已确认 - 订单 #{{orderId}}',
    'zh-TW': '【TIMC】您的體檢預約已確認 - 訂單 #{{orderId}}',
    en: '【TIMC】Your Reservation Confirmed - Order #{{orderId}}',
  },
  statusTitle: {
    ja: '予約完了！',
    'zh-CN': '预约成功！',
    'zh-TW': '預約成功！',
    en: 'Reservation Confirmed!',
  },
  statusSubtitle: {
    ja: 'TIMC OSAKA をお選びいただきありがとうございます。ご予約を承りました。',
    'zh-CN': '感谢您选择 TIMC OSAKA，我们已收到您的预约',
    'zh-TW': '感謝您選擇 TIMC OSAKA，我們已收到您的預約',
    en: 'Thank you for choosing TIMC OSAKA. We have received your reservation.',
  },
  detailsTitle: {
    ja: '注文詳細',
    'zh-CN': '订单详情',
    'zh-TW': '訂單詳情',
    en: 'Order Details',
  },
  labelOrderId: {
    ja: '注文番号',
    'zh-CN': '订单编号',
    'zh-TW': '訂單編號',
    en: 'Order ID',
  },
  labelPackage: {
    ja: '健診プラン',
    'zh-CN': '体检套餐',
    'zh-TW': '體檢套餐',
    en: 'Package',
  },
  labelAmount: {
    ja: '金額',
    'zh-CN': '金额',
    'zh-TW': '金額',
    en: 'Amount',
  },
  labelCustomer: {
    ja: 'ご予約者名',
    'zh-CN': '预约人',
    'zh-TW': '預約人',
    en: 'Booked by',
  },
  labelDate: {
    ja: 'ご希望日',
    'zh-CN': '希望日期',
    'zh-TW': '希望日期',
    en: 'Preferred Date',
  },
  labelTime: {
    ja: 'ご希望時間帯',
    'zh-CN': '希望时段',
    'zh-TW': '希望時段',
    en: 'Preferred Time',
  },
  labelNotes: {
    ja: '備考',
    'zh-CN': '备注',
    'zh-TW': '備註',
    en: 'Notes',
  },
  nextStepsTitle: {
    ja: '📋 今後の流れ',
    'zh-CN': '📋 接下来的步骤',
    'zh-TW': '📋 接下來的步驟',
    en: '📋 Next Steps',
  },
  nextStep1: {
    ja: '当スタッフが <strong>1〜2営業日以内</strong> にご連絡し、健診日を確定いたします',
    'zh-CN': '我们的客服将在 <strong>1-2 个工作日内</strong> 与您联系确认体检日期',
    'zh-TW': '我們的客服將在 <strong>1-2 個工作日內</strong> 與您聯繫確認體檢日期',
    en: 'Our staff will contact you within <strong>1-2 business days</strong> to confirm your check-up date',
  },
  nextStep2: {
    ja: '確定後、<strong>健診のご案内</strong> と <strong>注意事項</strong> をお送りします',
    'zh-CN': '确认后会发送 <strong>体检须知</strong> 和 <strong>注意事项</strong>',
    'zh-TW': '確認後會發送 <strong>體檢須知</strong> 和 <strong>注意事項</strong>',
    en: 'After confirmation, we will send you <strong>preparation guidelines</strong> and <strong>important notices</strong>',
  },
  nextStep3: {
    ja: '健診前日に <strong>リマインダー通知</strong> をお送りします',
    'zh-CN': '体检前一天会收到 <strong>提醒通知</strong>',
    'zh-TW': '體檢前一天會收到 <strong>提醒通知</strong>',
    en: 'You will receive a <strong>reminder notification</strong> the day before your check-up',
  },
  nextStep4: {
    ja: '健診完了後 <strong>7〜10営業日</strong> で報告書をお届けします',
    'zh-CN': '体检完成后 <strong>7-10 个工作日</strong> 会收到报告',
    'zh-TW': '體檢完成後 <strong>7-10 個工作日</strong> 會收到中文報告',
    en: 'You will receive your report within <strong>7-10 business days</strong> after the check-up',
  },
  facilityTitle: {
    ja: '📍 健診会場',
    'zh-CN': '📍 体检地点',
    'zh-TW': '📍 體檢地點',
    en: '📍 Check-up Location',
  },
  facilityName: {
    ja: 'TOKUSHUKAI INTERNATIONAL Medical Check-up OSAKA（TIMC OSAKA）',
    'zh-CN': 'TOKUSHUKAI INTERNATIONAL Medical Check-up OSAKA（TIMC OSAKA）',
    'zh-TW': 'TOKUSHUKAI INTERNATIONAL Medical Check-up OSAKA（TIMC OSAKA）',
    en: 'TOKUSHUKAI INTERNATIONAL Medical Check-up OSAKA (TIMC OSAKA)',
  },
  facilityAddress: {
    ja: '〒530-0001\n大阪市北区梅田三丁目2番2号\nJP TOWER OSAKA 11階\nTEL: 06-7777-3353',
    'zh-CN': '〒530-0001\n大阪市北区梅田三丁目2番2号\nJP TOWER OSAKA 11楼\nTEL: 06-7777-3353',
    'zh-TW': '〒530-0001\n大阪市北区梅田三丁目２番２号\nJP TOWER OSAKA 11階\nTEL: 06-7777-3353',
    en: '〒530-0001\n2-2 Umeda 3-chome, Kita-ku, Osaka\nJP TOWER OSAKA 11F\nTEL: 06-7777-3353',
  },
  footerSubtitle: {
    ja: 'TIMC OSAKA 指定予約代理',
    'zh-CN': 'TIMC OSAKA 指定预约代理',
    'zh-TW': 'TIMC OSAKA 指定預約代理',
    en: 'Authorized Booking Agent for TIMC OSAKA',
  },
} as const;

// ============================================
// 1b. 订单确认（非 TIMC — 咨询/治疗等一般服务）
// ============================================

export const orderConfirmationGeneric = {
  fromName: {
    ja: 'NIIJIMA 医療サービス',
    'zh-CN': '新岛交通 医疗服务',
    'zh-TW': '新島交通 醫療服務',
    en: 'NIIJIMA Medical Services',
  },
  subject: {
    ja: 'ご予約が確認されました - 注文 #{{orderId}}',
    'zh-CN': '您的预约已确认 - 订单 #{{orderId}}',
    'zh-TW': '您的預約已確認 - 訂單 #{{orderId}}',
    en: 'Your Reservation Confirmed - Order #{{orderId}}',
  },
  statusSubtitle: {
    ja: 'ご予約を承りました。スタッフが速やかにご連絡いたします。',
    'zh-CN': '我们已收到您的预约，工作人员将尽快与您联系。',
    'zh-TW': '我們已收到您的預約，工作人員將盡快與您聯繫。',
    en: 'We have received your reservation. Our staff will contact you shortly.',
  },
  labelPackage: {
    ja: 'サービス内容',
    'zh-CN': '服务内容',
    'zh-TW': '服務內容',
    en: 'Service',
  },
  nextStep1: {
    ja: '当スタッフが <strong>24時間以内</strong> にご連絡いたします',
    'zh-CN': '我们的工作人员将在 <strong>24 小时内</strong> 与您联系',
    'zh-TW': '我們的工作人員將在 <strong>24 小時內</strong> 與您聯繫',
    en: 'Our staff will contact you within <strong>24 hours</strong>',
  },
  nextStep2: {
    ja: 'お客様のご要望をヒアリングし、<strong>最適なプラン</strong> をご提案いたします',
    'zh-CN': '了解您的需求后，为您制定 <strong>最合适的方案</strong>',
    'zh-TW': '了解您的需求後，為您制定 <strong>最合適的方案</strong>',
    en: 'After understanding your needs, we will propose the <strong>best plan</strong> for you',
  },
  nextStep3: {
    ja: '<strong>詳細なお見積もり</strong> と <strong>スケジュール</strong> をお知らせいたします',
    'zh-CN': '为您提供 <strong>详细报价</strong> 和 <strong>日程安排</strong>',
    'zh-TW': '為您提供 <strong>詳細報價</strong> 和 <strong>日程安排</strong>',
    en: 'We will provide you with a <strong>detailed quote</strong> and <strong>schedule</strong>',
  },
  footerSubtitle: {
    ja: '日本医療コーディネーター',
    'zh-CN': '日本医疗协调服务',
    'zh-TW': '日本醫療協調服務',
    en: 'Japan Medical Coordinator',
  },
} as const;

// ============================================
// 2. 白标订阅成功 (Whitelabel Subscription)
// ============================================

export const whitelabelSubscription = {
  subject: {
    ja: '🎉 ホワイトラベル登録完了 - NIIJIMA ガイドパートナー',
    'zh-CN': '🎉 白标页面订阅成功 - NIIJIMA 导游合伙人',
    'zh-TW': '🎉 白標頁面訂閱成功 - NIIJIMA 導遊合夥人',
    en: '🎉 White Label Subscription Activated - NIIJIMA Guide Partner',
  },
  statusTitle: {
    ja: '登録完了！',
    'zh-CN': '订阅成功！',
    'zh-TW': '訂閱成功！',
    en: 'Subscription Activated!',
  },
  greeting: {
    ja: '{{name}} 様',
    'zh-CN': '{{name}}，您好',
    'zh-TW': '{{name}}，您好',
    en: 'Hello, {{name}}',
  },
  message: {
    ja: 'ホワイトラベルページの登録が完了しました！\nブランドページの設定を開始して、お客様にサービスをご紹介ください。',
    'zh-CN': '恭喜您成功订阅白标页面服务！\n现在可以开始设置您的专属品牌页面，向客户展示您的服务了。',
    'zh-TW': '恭喜您成功訂閱白標頁面服務！\n現在可以開始設置您的專屬品牌頁面，向客戶展示您的服務了。',
    en: 'Congratulations! Your white label page subscription is now active.\nYou can start customizing your branded page to showcase your services.',
  },
  detailsTitle: {
    ja: '📋 登録内容',
    'zh-CN': '📋 订阅详情',
    'zh-TW': '📋 訂閱詳情',
    en: '📋 Subscription Details',
  },
  labelPlan: {
    ja: 'プラン',
    'zh-CN': '订阅套餐',
    'zh-TW': '訂閱套餐',
    en: 'Plan',
  },
  labelFee: {
    ja: '月額料金',
    'zh-CN': '订阅费用',
    'zh-TW': '訂閱費用',
    en: 'Monthly Fee',
  },
  labelStatus: {
    ja: 'ステータス',
    'zh-CN': '订阅状态',
    'zh-TW': '訂閱狀態',
    en: 'Status',
  },
  statusActive: {
    ja: '有効',
    'zh-CN': '已激活',
    'zh-TW': '已激活',
    en: 'Active',
  },
  whitelabelUrlLabel: {
    ja: '🔗 あなた専用のホワイトラベルページ',
    'zh-CN': '🔗 您的专属白标页面',
    'zh-TW': '🔗 您的專屬白標頁面',
    en: '🔗 Your White Label Page',
  },
  nextStepsTitle: {
    ja: '🚀 次のステップ',
    'zh-CN': '🚀 接下来的步骤',
    'zh-TW': '🚀 接下來的步驟',
    en: '🚀 Next Steps',
  },
  step1: {
    ja: '<strong>URL スラッグ</strong>を設定（例：bespoketrip.jp/p/your-name）',
    'zh-CN': '设置您的 <strong>URL 标识</strong>（例如：bespoketrip.jp/p/your-name）',
    'zh-TW': '設置您的 <strong>URL 標識</strong>（例如：bespoketrip.jp/p/your-name）',
    en: 'Set up your <strong>URL slug</strong> (e.g., bespoketrip.jp/p/your-name)',
  },
  step2: {
    ja: '<strong>ブランド名</strong>と<strong>ブランドカラー</strong>をカスタマイズ',
    'zh-CN': '自定义 <strong>品牌名称</strong> 和 <strong>品牌颜色</strong>',
    'zh-TW': '自定義 <strong>品牌名稱</strong> 和 <strong>品牌顏色</strong>',
    en: 'Customize your <strong>brand name</strong> and <strong>brand color</strong>',
  },
  step3: {
    ja: '<strong>連絡先</strong>（WeChat、LINE、電話）を追加',
    'zh-CN': '添加您的 <strong>联系方式</strong>（微信、LINE、电话）',
    'zh-TW': '添加您的 <strong>聯繫方式</strong>（微信、LINE、電話）',
    en: 'Add your <strong>contact info</strong> (WeChat, LINE, phone)',
  },
  step4: {
    ja: 'ホワイトラベルリンクをお客様にシェア',
    'zh-CN': '将白标链接分享给您的客户',
    'zh-TW': '將白標連結分享給您的客戶',
    en: 'Share your white label link with your clients',
  },
  ctaText: {
    ja: 'ホワイトラベルを設定する',
    'zh-CN': '设置我的白标页面',
    'zh-TW': '設置我的白標頁面',
    en: 'Set Up My White Label Page',
  },
} as const;

// ============================================
// 3. 佣金通知 (Commission Notification)
// ============================================

export const guideCommission = {
  subject: {
    ja: '🎉 新しいコミッション +¥{{amount}} - {{orderType}}',
    'zh-CN': '🎉 新佣金到账！+¥{{amount}} - {{orderType}}',
    'zh-TW': '🎉 新佣金到帳！+¥{{amount}} - {{orderType}}',
    en: '🎉 New Commission +¥{{amount}} - {{orderType}}',
  },
  orderTypes: {
    medical: {
      ja: '医療健診',
      'zh-CN': '医疗体检',
      'zh-TW': '醫療體檢',
      en: 'Medical Check-up',
    },
    golf: {
      ja: 'ゴルフツアー',
      'zh-CN': '高尔夫旅游',
      'zh-TW': '高爾夫旅遊',
      en: 'Golf Tour',
    },
    business: {
      ja: 'ビジネス視察',
      'zh-CN': '商务考察',
      'zh-TW': '商務考察',
      en: 'Business Tour',
    },
  } as Record<string, Record<EmailLocale, string>>,
  statusTitle: {
    ja: '新コミッション発生！',
    'zh-CN': '新佣金到账！',
    'zh-TW': '新佣金到帳！',
    en: 'New Commission Earned!',
  },
  statusSubtitle: {
    ja: '{{name}} 様、ご紹介のお客様がお支払いを完了しました',
    'zh-CN': '恭喜 {{name}}，您的推荐客户已完成付款',
    'zh-TW': '恭喜 {{name}}，您的推薦客戶已完成付款',
    en: 'Congratulations {{name}}, your referred client has completed payment',
  },
  detailsTitle: {
    ja: 'コミッション明細',
    'zh-CN': '佣金明细',
    'zh-TW': '佣金明細',
    en: 'Commission Breakdown',
  },
  labelOrderType: {
    ja: '注文タイプ',
    'zh-CN': '订单类型',
    'zh-TW': '訂單類型',
    en: 'Order Type',
  },
  labelOrderAmount: {
    ja: '注文金額',
    'zh-CN': '订单金额',
    'zh-TW': '訂單金額',
    en: 'Order Amount',
  },
  labelCommissionRate: {
    ja: 'コミッション率',
    'zh-CN': '佣金率',
    'zh-TW': '佣金率',
    en: 'Commission Rate',
  },
  labelNewCustomerBonus: {
    ja: '🎁 新規顧客ボーナス',
    'zh-CN': '🎁 新客奖励',
    'zh-TW': '🎁 新客獎勵',
    en: '🎁 New Customer Bonus',
  },
  labelTotal: {
    ja: '今回のコミッション',
    'zh-CN': '本次佣金',
    'zh-TW': '本次佣金',
    en: 'This Commission',
  },
  bonusBanner: {
    ja: '🎁 <strong>新規顧客初回ボーナス +5%</strong> が自動適用されました！',
    'zh-CN': '🎁 <strong>新客首单奖励 +5%</strong> 已自动计入！',
    'zh-TW': '🎁 <strong>新客首單獎勵 +5%</strong> 已自動計入！',
    en: '🎁 <strong>New Customer First Order Bonus +5%</strong> has been automatically applied!',
  },
  ctaText: {
    ja: 'コミッション詳細を見る',
    'zh-CN': '查看佣金详情',
    'zh-TW': '查看佣金詳情',
    en: 'View Commission Details',
  },
} as const;

// ============================================
// 4. KYC 通知 (KYC Notification)
// ============================================

export const kycNotification = {
  subjectApproved: {
    ja: '🎉 本人確認が承認されました - NIIJIMA ガイドパートナー',
    'zh-CN': '🎉 恭喜！您的身份验证已通过 - NIIJIMA 导游合伙人',
    'zh-TW': '🎉 恭喜！您的身份驗證已通過 - NIIJIMA 導遊合夥人',
    en: '🎉 Identity Verified - NIIJIMA Guide Partner',
  },
  subjectRejected: {
    ja: '⚠️ 本人確認が承認されませんでした - NIIJIMA ガイドパートナー',
    'zh-CN': '⚠️ 身份验证未通过 - NIIJIMA 导游合伙人',
    'zh-TW': '⚠️ 身份驗證未通過 - NIIJIMA 導遊合夥人',
    en: '⚠️ Identity Verification Failed - NIIJIMA Guide Partner',
  },
  statusApproved: {
    ja: '認証完了',
    'zh-CN': '验证通过',
    'zh-TW': '驗證通過',
    en: 'Verified',
  },
  statusRejected: {
    ja: '認証未完了',
    'zh-CN': '验证未通过',
    'zh-TW': '驗證未通過',
    en: 'Verification Failed',
  },
  messageApproved: {
    ja: '本人確認が承認されました。ホワイトラベルページを使って集客を始めましょう。',
    'zh-CN': '恭喜您！您的身份验证已通过审核，现在可以开始使用白标页面推广业务了。',
    'zh-TW': '恭喜您！您的身份驗證已通過審核，現在可以開始使用白標頁面推廣業務了。',
    en: 'Congratulations! Your identity verification has been approved. You can now start using your white label page.',
  },
  messageRejected: {
    ja: '申し訳ございません。本人確認が承認されませんでした。提出書類をご確認の上、再申請してください。',
    'zh-CN': '很抱歉，您的身份验证未能通过审核。请检查提交的资料并重新申请。',
    'zh-TW': '很抱歉，您的身份驗證未能通過審核。請檢查提交的資料並重新申請。',
    en: 'We\'re sorry, your identity verification was not approved. Please review your submitted documents and reapply.',
  },
  reviewNoteLabel: {
    ja: '審査メモ',
    'zh-CN': '审核备注',
    'zh-TW': '審核備註',
    en: 'Review Note',
  },
  ctaApproved: {
    ja: 'ホワイトラベルを設定する',
    'zh-CN': '设置我的白标页面',
    'zh-TW': '設置我的白標頁面',
    en: 'Set Up My White Label Page',
  },
  ctaRejected: {
    ja: '資料を再提出する',
    'zh-CN': '重新提交资料',
    'zh-TW': '重新提交資料',
    en: 'Resubmit Documents',
  },
  contactNote: {
    ja: 'ご不明な点がございましたら、サポートチームまでお問い合わせください',
    'zh-CN': '如有任何问题，请联系我们的客服团队',
    'zh-TW': '如有任何問題，請聯繫我們的客服團隊',
    en: 'If you have any questions, please contact our support team',
  },
} as const;

// ============================================
// 5. 导游注册成功 (Guide Registration)
// ============================================

export const guideRegistration = {
  subject: {
    ja: '登録完了！NIIJIMA ガイドパートナーへようこそ',
    'zh-CN': '注册成功！欢迎加入 NIIJIMA 导游合伙人',
    'zh-TW': '註冊成功！歡迎加入 NIIJIMA 導遊合夥人',
    en: 'Registration Complete! Welcome to NIIJIMA Guide Partner',
  },
  statusTitle: {
    ja: '登録完了！',
    'zh-CN': '注册成功！',
    'zh-TW': '註冊成功！',
    en: 'Registration Complete!',
  },
  greeting: {
    ja: '{{name}} 様、ガイドパートナープログラムへようこそ',
    'zh-CN': '{{name}}，欢迎加入导游合伙人计划',
    'zh-TW': '{{name}}，歡迎加入導遊合夥人計劃',
    en: '{{name}}, welcome to the Guide Partner Program',
  },
  detailsTitle: {
    ja: 'アカウント情報',
    'zh-CN': '您的账户信息',
    'zh-TW': '您的帳戶資訊',
    en: 'Your Account Info',
  },
  labelEmail: {
    ja: 'ログインメール',
    'zh-CN': '登录邮箱',
    'zh-TW': '登入郵箱',
    en: 'Login Email',
  },
  labelReferralCode: {
    ja: '紹介コード',
    'zh-CN': '专属推荐码',
    'zh-TW': '專屬推薦碼',
    en: 'Referral Code',
  },
  labelAccountStatus: {
    ja: 'アカウント状態',
    'zh-CN': '账户状态',
    'zh-TW': '帳戶狀態',
    en: 'Account Status',
  },
  statusActive: {
    ja: '有効',
    'zh-CN': '已激活',
    'zh-TW': '已激活',
    en: 'Active',
  },
  nextStepsTitle: {
    ja: 'ご利用開始',
    'zh-CN': '开始使用',
    'zh-TW': '開始使用',
    en: 'Getting Started',
  },
  step1: {
    ja: 'ログイン後、<strong>ガイドパートナーダッシュボード</strong>にアクセス',
    'zh-CN': '登录后进入 <strong>导游合伙人面板</strong>',
    'zh-TW': '登入後進入 <strong>導遊合夥人面板</strong>',
    en: 'After logging in, access the <strong>Guide Partner Dashboard</strong>',
  },
  step2: {
    ja: '<strong>紹介コード {{code}}</strong> をお客様にシェア',
    'zh-CN': '将您的 <strong>推荐码 {{code}}</strong> 分享给客户',
    'zh-TW': '將您的 <strong>推薦碼 {{code}}</strong> 分享給客戶',
    en: 'Share your <strong>referral code {{code}}</strong> with clients',
  },
  step3: {
    ja: 'お客様がご紹介リンクからご予約すると<strong>コミッション</strong>が発生',
    'zh-CN': '客户通过您的推荐链接预约即可获得 <strong>佣金收益</strong>',
    'zh-TW': '客戶通過您的推薦連結預約即可獲得 <strong>佣金收益</strong>',
    en: 'Earn <strong>commission</strong> when clients book through your referral link',
  },
  step4: {
    ja: '<strong>ホワイトラベルページ</strong>を開設して専用ブランドを構築',
    'zh-CN': '开通 <strong>白标页面</strong> 打造您的专属品牌',
    'zh-TW': '開通 <strong>白標頁面</strong> 打造您的專屬品牌',
    en: 'Set up a <strong>White Label Page</strong> to build your own brand',
  },
  ctaText: {
    ja: 'ログインする',
    'zh-CN': '立即登录',
    'zh-TW': '立即登入',
    en: 'Log In Now',
  },
} as const;

// ============================================
// 5b. 退款通知 (Refund Notification)
// ============================================

export const refundNotification = {
  subject: {
    ja: '返金処理完了 - 注文 #{{orderId}}',
    'zh-CN': '退款已处理 - 订单 #{{orderId}}',
    'zh-TW': '退款已處理 - 訂單 #{{orderId}}',
    en: 'Refund Processed - Order #{{orderId}}',
  },
  statusTitle: {
    ja: '返金処理完了',
    'zh-CN': '退款已处理',
    'zh-TW': '退款已處理',
    en: 'Refund Processed',
  },
  statusSubtitle: {
    ja: 'ご注文の返金処理が完了いたしました',
    'zh-CN': '您的订单退款已完成处理',
    'zh-TW': '您的訂單退款已完成處理',
    en: 'Your order refund has been processed',
  },
  detailsTitle: {
    ja: '返金詳細',
    'zh-CN': '退款详情',
    'zh-TW': '退款詳情',
    en: 'Refund Details',
  },
  labelOrderId: {
    ja: '注文番号',
    'zh-CN': '订单编号',
    'zh-TW': '訂單編號',
    en: 'Order ID',
  },
  labelPackage: {
    ja: 'サービス内容',
    'zh-CN': '服务内容',
    'zh-TW': '服務內容',
    en: 'Service',
  },
  labelRefundAmount: {
    ja: '返金額',
    'zh-CN': '退款金额',
    'zh-TW': '退款金額',
    en: 'Refund Amount',
  },
  labelRefundMethod: {
    ja: '返金方法',
    'zh-CN': '退款方式',
    'zh-TW': '退款方式',
    en: 'Refund Method',
  },
  refundMethodCard: {
    ja: 'クレジットカードへ返金（5〜10営業日）',
    'zh-CN': '退回信用卡（5-10个工作日）',
    'zh-TW': '退回信用卡（5-10個工作日）',
    en: 'Refund to credit card (5-10 business days)',
  },
  labelReason: {
    ja: '返金理由',
    'zh-CN': '退款原因',
    'zh-TW': '退款原因',
    en: 'Reason',
  },
  labelRefundId: {
    ja: '返金参照番号',
    'zh-CN': '退款参考号',
    'zh-TW': '退款參考號',
    en: 'Refund Reference',
  },
  labelRefundTimeline: {
    ja: '返金予定',
    'zh-CN': '退款预期',
    'zh-TW': '退款預期',
    en: 'Expected Timeline',
  },
  refundTimeline: {
    ja: 'クレジットカード会社の処理に5〜10営業日',
    'zh-CN': '信用卡公司处理需5-10个工作日',
    'zh-TW': '信用卡公司處理需5-10個工作日',
    en: '5-10 business days for credit card processing',
  },
  footerNote: {
    ja: '返金はカード会社の処理に5〜10営業日かかる場合がございます',
    'zh-CN': '退款可能需要5-10个工作日才能显示在您的信用卡账单中',
    'zh-TW': '退款可能需要5-10個工作日才能顯示在您的信用卡帳單中',
    en: 'Refunds may take 5-10 business days to appear on your credit card statement',
  },
  contactNote: {
    ja: 'ご不明な点は新島交通カスタマーサポートまでお問い合わせください（TEL: 06-7777-3353）',
    'zh-CN': '如有疑问请联系新岛交通客服（TEL: 06-7777-3353）',
    'zh-TW': '如有疑問請聯繫新島交通客服（TEL: 06-7777-3353）',
    en: 'For questions, contact Niijima Kotsu support (TEL: 06-7777-3353)',
  },
} as const;

// ============================================
// 6. 健康复查提醒 (Health Checkup Reminder)
// ============================================

export const healthCheckupReminder = {
  subject: {
    ja: '🏥 年次ヘルスチェックのお知らせ（前回から{{months}}ヶ月）',
    'zh-CN': '🏥 年度健康筛查提醒（距上次{{months}}个月）',
    'zh-TW': '🏥 年度健康篩查提醒（距上次{{months}}個月）',
    en: '🏥 Annual Health Screening Reminder ({{months}} months since last visit)',
  },
  subjectHighRisk: {
    ja: '⚠️ 健康フォローアップが必要です（前回から{{months}}ヶ月）',
    'zh-CN': '⚠️ 健康复查提醒（距上次{{months}}个月）',
    'zh-TW': '⚠️ 健康複查提醒（距上次{{months}}個月）',
    en: '⚠️ Health Follow-up Needed ({{months}} months since last visit)',
  },
  statusTitle: {
    ja: '定期健康チェックの時期です',
    'zh-CN': '是时候进行定期健康检查了',
    'zh-TW': '是時候進行定期健康檢查了',
    en: 'Time for Your Regular Health Check',
  },
  statusTitleHighRisk: {
    ja: 'フォローアップ検査をお勧めします',
    'zh-CN': '建议进行复查',
    'zh-TW': '建議進行複查',
    en: 'Follow-up Examination Recommended',
  },
  message: {
    ja: '定期的なヘルスチェックは最良の予防策です。前回のチェックからしばらく経ちました。最新の健康状態を確認しましょう。',
    'zh-CN': '定期健康筛查是最好的预防。距离您上次筛查已有一段时间，建议您进行新一轮检查，了解最新健康状况。',
    'zh-TW': '定期健康篩查是最好的預防。距離您上次篩查已有一段時間，建議您進行新一輪檢查，了解最新健康狀況。',
    en: 'Regular health screenings are the best form of prevention. It has been a while since your last checkup. Check your latest health status.',
  },
  messageHighRisk: {
    ja: '前回のヘルスチェックで健康リスクの上昇が検出されました。年次フォローアップ検査を強くお勧めします。',
    'zh-CN': '您上次筛查检测到较高的健康风险。我们强烈建议您进行年度复查。',
    'zh-TW': '您上次篩查檢測到較高的健康風險。我們強烈建議您進行年度複查。',
    en: 'Your previous screening detected elevated health risks. We strongly recommend scheduling your annual follow-up checkup.',
  },
  monthsLabel: {
    ja: '前回から',
    'zh-CN': '距上次',
    'zh-TW': '距上次',
    en: 'Since last screening',
  },
  monthsUnit: {
    ja: 'ヶ月',
    'zh-CN': '个月',
    'zh-TW': '個月',
    en: 'months',
  },
  lastScoreLabel: {
    ja: '前回のスコア',
    'zh-CN': '上次评分',
    'zh-TW': '上次評分',
    en: 'Last Score',
  },
  ctaText: {
    ja: '今すぐヘルスチェックを受ける',
    'zh-CN': '立即开始健康筛查',
    'zh-TW': '立即開始健康篩查',
    en: 'Start Health Screening Now',
  },
} as const;
