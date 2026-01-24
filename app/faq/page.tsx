'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Mail, MessageCircle, X } from 'lucide-react';
import SmartBackLink from '@/components/SmartBackLink';

const WECHAT_QR_URL = '/wechat-qr.png';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

interface FAQItem {
  question: Record<Language, string>;
  answer: Record<Language, string>;
  category: string; // category key
}

// Category keys and labels
const CATEGORY_LABELS: Record<string, Record<Language, string>> = {
  all: { ja: 'すべて', 'zh-TW': '全部', 'zh-CN': '全部', en: 'All' },
  booking: { ja: '予約関連', 'zh-TW': '預約相關', 'zh-CN': '预约相关', en: 'Booking' },
  checkup: { ja: '健診関連', 'zh-TW': '體檢相關', 'zh-CN': '体检相关', en: 'Health Check' },
  payment: { ja: '支払い・返金', 'zh-TW': '付款與退款', 'zh-CN': '付款与退款', en: 'Payment & Refund' },
  packages: { ja: 'プラン選択', 'zh-TW': '套餐選擇', 'zh-CN': '套餐选择', en: 'Packages' },
  other: { ja: 'その他', 'zh-TW': '其他', 'zh-CN': '其他', en: 'Other' },
};

const CATEGORY_KEYS = ['all', 'booking', 'checkup', 'payment', 'packages', 'other'];

const FAQ_DATA: FAQItem[] = [
  // Booking
  {
    category: 'booking',
    question: {
      ja: 'TIMCの健診はどのように予約しますか？',
      'zh-TW': '如何預約 TIMC 體檢？',
      'zh-CN': '如何预约 TIMC 体检？',
      en: 'How do I book a TIMC health check?',
    },
    answer: {
      ja: '当サイトでお好みのプランを選択し、予約情報を入力してオンライン決済を完了してください。決済完了後、1-2営業日以内にカスタマーサービスからご連絡し、具体的な健診日程を確認いたします。',
      'zh-TW': '您可以直接在本網站選擇心儀的套餐，填寫預約資訊後完成線上支付即可。支付成功後，我們的客服會在 1-2 個工作日內與您聯繫，確認具體的體檢日期。',
      'zh-CN': '您可以直接在本网站选择心仪的套餐，填写预约信息后完成线上支付即可。支付成功后，我们的客服会在 1-2 个工作日内与您联系，确认具体的体检日期。',
      en: 'Select your preferred package on our website, fill in your booking details, and complete the online payment. After payment, our customer service will contact you within 1-2 business days to confirm the checkup date.',
    },
  },
  {
    category: 'booking',
    question: {
      ja: '健診日を指定できますか？',
      'zh-TW': '可以指定體檢日期嗎？',
      'zh-CN': '可以指定体检日期吗？',
      en: 'Can I choose a specific checkup date?',
    },
    answer: {
      ja: 'はい。予約時にご希望の日程をご記入いただけます。できる限りご希望に沿うよう手配いたしますが、最終日程は病院の空き状況により確定いたします。',
      'zh-TW': '可以的。在預約時您可以填寫希望的體檢日期，我們會盡量為您安排。但最終日期需要根據醫院的實際排程來確認，我們的客服會與您溝通具體時間。',
      'zh-CN': '可以的。在预约时您可以填写希望的体检日期，我们会尽量为您安排。但最终日期需要根据医院的实际排程来确认，我们的客服会与您沟通具体时间。',
      en: 'Yes. You can specify your preferred date when booking. We will do our best to arrange it, but the final date depends on hospital availability and will be confirmed by our customer service.',
    },
  },
  {
    category: 'booking',
    question: {
      ja: '予約後、どのくらいで確認されますか？',
      'zh-TW': '預約後多久能確認？',
      'zh-CN': '预约后多久能确认？',
      en: 'How long does booking confirmation take?',
    },
    answer: {
      ja: '通常、お支払い完了後1-2営業日以内に、LINE、WeChat、またはメールにてご連絡し、健診日程と注意事項をお伝えいたします。',
      'zh-TW': '通常在您完成支付後的 1-2 個工作日內，我們的客服會透過 LINE、微信或電子郵件與您聯繫，確認體檢日期和相關注意事項。',
      'zh-CN': '通常在您完成支付后的 1-2 个工作日内，我们的客服会通过 LINE、微信或电子邮件与您联系，确认体检日期和相关注意事项。',
      en: 'Usually within 1-2 business days after payment, our customer service will contact you via LINE, WeChat, or email to confirm the checkup date and related instructions.',
    },
  },
  {
    category: 'booking',
    question: {
      ja: '家族や友人の分も予約できますか？',
      'zh-TW': '可以幫家人或朋友預約嗎？',
      'zh-CN': '可以帮家人或朋友预约吗？',
      en: 'Can I book for family members or friends?',
    },
    answer: {
      ja: 'はい。予約時に実際に受診される方のお名前と連絡先をご記入ください。複数名の場合は、個別にご注文いただくか、備考欄にご記載ください。',
      'zh-TW': '可以的。您在預約時填寫實際體檢者的姓名和聯繫方式即可。如有多人預約，建議分開下單或在備註中說明。',
      'zh-CN': '可以的。您在预约时填写实际体检者的姓名和联系方式即可。如有多人预约，建议分开下单或在备注中说明。',
      en: 'Yes. Simply fill in the name and contact information of the actual examinee when booking. For multiple people, we recommend placing separate orders or noting it in the remarks.',
    },
  },
  // Health Check
  {
    category: 'checkup',
    question: {
      ja: 'TIMC健診センターはどこにありますか？',
      'zh-TW': 'TIMC 體檢中心在哪裡？',
      'zh-CN': 'TIMC 体检中心在哪里？',
      en: 'Where is the TIMC Health Check Center?',
    },
    answer: {
      ja: 'TIMC OSAKA（徳洲会国際医療センター）は大阪市北区梅田三丁目2番2号 JP TOWER OSAKA 11階にあります。大阪駅から徒歩約5分の好立地です。',
      'zh-TW': 'TIMC OSAKA（德洲會國際醫療中心）位於大阪市北區梅田三丁目 2 番 2 號 JP TOWER OSAKA 11 樓。交通便利，從大阪站步行約 5 分鐘即可到達。',
      'zh-CN': 'TIMC OSAKA（德洲会国际医疗中心）位于大阪市北区梅田三丁目 2 番 2 号 JP TOWER OSAKA 11 楼。交通便利，从大阪站步行约 5 分钟即可到达。',
      en: 'TIMC OSAKA (Tokushukai International Medical Center) is located on the 11th floor of JP TOWER OSAKA, 3-2-2 Umeda, Kita-ku, Osaka. It is about a 5-minute walk from Osaka Station.',
    },
  },
  {
    category: 'checkup',
    question: {
      ja: '健診当日は空腹で来る必要がありますか？',
      'zh-TW': '體檢當天需要空腹嗎？',
      'zh-CN': '体检当天需要空腹吗？',
      en: 'Do I need to fast before the checkup?',
    },
    answer: {
      ja: 'はい。多くの検査項目は空腹状態で行う必要があります。通常、前日の21時以降は絶食し、少量の水のみ可となります。詳細は予約確認後にお送りする受診案内でご確認ください。',
      'zh-TW': '是的，大部分體檢項目需要空腹進行。通常要求體檢前一天晚上 9 點後禁食，只可飲用少量清水。具體要求會在確認預約後發送給您的體檢須知中詳細說明。',
      'zh-CN': '是的，大部分体检项目需要空腹进行。通常要求体检前一天晚上 9 点后禁食，只可饮用少量清水。具体要求会在确认预约后发送给您的体检须知中详细说明。',
      en: 'Yes, most checkup items require fasting. Typically, you should stop eating after 9 PM the night before and only drink small amounts of water. Detailed instructions will be sent after booking confirmation.',
    },
  },
  {
    category: 'checkup',
    question: {
      ja: '健診にはどのくらい時間がかかりますか？',
      'zh-TW': '體檢需要多長時間？',
      'zh-CN': '体检需要多长时间？',
      en: 'How long does the checkup take?',
    },
    answer: {
      ja: 'お選びのプランにより約3-6時間です。基本プランは約3時間、胃腸内視鏡を含むプランは約5-6時間かかります。余裕を持ったスケジュールをお勧めします。',
      'zh-TW': '根據您選擇的套餐不同，體檢時間約為 3-6 小時。基礎套餐約 3 小時，包含胃腸鏡的套餐約需 5-6 小時。我們建議您預留充足的時間。',
      'zh-CN': '根据您选择的套餐不同，体检时间约为 3-6 小时。基础套餐约 3 小时，包含胃肠镜的套餐约需 5-6 小时。我们建议您预留充足的时间。',
      en: 'Depending on your package, the checkup takes approximately 3-6 hours. Basic packages take about 3 hours, while packages including endoscopy take about 5-6 hours. We recommend allowing plenty of time.',
    },
  },
  {
    category: 'checkup',
    question: {
      ja: '中国語対応はありますか？',
      'zh-TW': '有中文服務嗎？',
      'zh-CN': '有中文服务吗？',
      en: 'Is Chinese language support available?',
    },
    answer: {
      ja: 'はい。TIMCには専門の中国語通訳スタッフが常駐しており、健診の全過程に付き添います。医師の問診時にも通訳が同席し、スムーズなコミュニケーションを確保します。',
      'zh-TW': '有的。TIMC 配備專業的中文翻譯人員，全程陪同您完成體檢。醫生問診時也會有翻譯在場，確保溝通順暢無障礙。',
      'zh-CN': '有的。TIMC 配备专业的中文翻译人员，全程陪同您完成体检。医生问诊时也会有翻译在场，确保沟通顺畅无障碍。',
      en: 'Yes. TIMC has professional Chinese interpreters who accompany you throughout the entire checkup. Interpreters are also present during doctor consultations to ensure smooth communication.',
    },
  },
  {
    category: 'checkup',
    question: {
      ja: '健診結果はいつ届きますか？',
      'zh-TW': '體檢報告什麼時候能拿到？',
      'zh-CN': '体检报告什么时候能拿到？',
      en: 'When will I receive the checkup report?',
    },
    answer: {
      ja: '健診完了後約30営業日で、中国語版の詳細な健診レポートをお届けします。国際郵便でお送りしますが、電子版をご希望の場合は事前にお知らせください。',
      'zh-TW': '體檢完成後約 30 個工作日，您會收到完整的中文版體檢報告。報告會以國際郵件發送，如需電子版可提前告知。',
      'zh-CN': '体检完成后约 30 个工作日，您会收到完整的中文版体检报告。报告会以国际邮件发送，如需电子版可提前告知。',
      en: 'You will receive a complete Chinese-translated checkup report approximately 30 business days after the checkup. It will be sent via international mail; please let us know in advance if you prefer a digital version.',
    },
  },
  // Payment & Refund
  {
    category: 'payment',
    question: {
      ja: 'どのような決済方法に対応していますか？',
      'zh-TW': '支持哪些付款方式？',
      'zh-CN': '支持哪些付款方式？',
      en: 'What payment methods are accepted?',
    },
    answer: {
      ja: 'クレジットカード（Visa、MasterCard、JCB、American Express）でのオンライン決済に対応しています。国際的に信頼されるStripe決済プラットフォームを使用しています。',
      'zh-TW': '我們支援信用卡（Visa、MasterCard、JCB、American Express）線上支付，透過國際知名的 Stripe 安全支付平台進行。',
      'zh-CN': '我们支持信用卡（Visa、MasterCard、JCB、American Express）线上支付，通过国际知名的 Stripe 安全支付平台进行。',
      en: 'We accept credit card payments (Visa, MasterCard, JCB, American Express) via the internationally trusted Stripe secure payment platform.',
    },
  },
  {
    category: 'payment',
    question: {
      ja: '予約をキャンセルできますか？',
      'zh-TW': '可以取消預約嗎？',
      'zh-CN': '可以取消预约吗？',
      en: 'Can I cancel my booking?',
    },
    answer: {
      ja: 'はい。ただしキャンセル時期により返金率が異なります：健診14日前まで全額返金、7-14日前は50%返金、7日以内のキャンセルは返金不可ですが日程変更は1回可能です。',
      'zh-TW': '可以的，但根據取消時間會有不同的退款政策：體檢前 14 天以上可全額退款；體檢前 7-14 天退還 50% 費用；體檢前 7 天內恕不接受取消，但可改期一次。',
      'zh-CN': '可以的，但根据取消时间会有不同的退款政策：体检前 14 天以上可全额退款；体检前 7-14 天退还 50% 费用；体检前 7 天内恕不接受取消，但可改期一次。',
      en: 'Yes, but refund policies vary by timing: full refund if cancelled 14+ days before; 50% refund for 7-14 days before; no refund within 7 days, but rescheduling is allowed once.',
    },
  },
  {
    category: 'payment',
    question: {
      ja: '日程変更はできますか？',
      'zh-TW': '可以改期嗎？',
      'zh-CN': '可以改期吗？',
      en: 'Can I reschedule?',
    },
    answer: {
      ja: 'はい。各ご予約につき1回まで無料で日程変更が可能です。元の健診日の3営業日前までにお申し出ください。カスタマーサービスまでご連絡ください。',
      'zh-TW': '可以的。每筆訂單可免費改期一次，需在原定體檢日期前 3 個工作日以上提出申請。請聯繫我們的客服處理改期事宜。',
      'zh-CN': '可以的。每笔订单可免费改期一次，需在原定体检日期前 3 个工作日以上提出申请。请联系我们的客服处理改期事宜。',
      en: 'Yes. Each booking allows one free reschedule, requested at least 3 business days before the original date. Please contact our customer service to arrange.',
    },
  },
  {
    category: 'payment',
    question: {
      ja: '返金にはどのくらいかかりますか？',
      'zh-TW': '退款需要多長時間？',
      'zh-CN': '退款需要多长时间？',
      en: 'How long does a refund take?',
    },
    answer: {
      ja: '返金承認後、5-10営業日以内にお支払い元の口座に返金されます。銀行の処理状況により多少前後する場合がございます。',
      'zh-TW': '申請退款通過後，款項會在 5-10 個工作日內退回您的原支付帳戶。具體到帳時間可能因銀行處理速度而有所不同。',
      'zh-CN': '申请退款通过后，款项会在 5-10 个工作日内退回您的原支付账户。具体到账时间可能因银行处理速度而有所不同。',
      en: 'After refund approval, the amount will be returned to your original payment account within 5-10 business days. Actual processing time may vary depending on your bank.',
    },
  },
  // Packages
  {
    category: 'packages',
    question: {
      ja: '各プランの違いは何ですか？',
      'zh-TW': '不同套餐有什麼區別？',
      'zh-CN': '不同套餐有什么区别？',
      en: 'What are the differences between packages?',
    },
    answer: {
      ja: 'TIMCでは基本のSTANDARDプランからハイエンドのVIPプランまで多彩なプランをご用意しています。主な違いは検査項目の充実度で、PET-CT、MRI、胃腸内視鏡などの高度検査の有無が異なります。プラン比較表で詳細をご確認いただけます。',
      'zh-TW': 'TIMC 提供多種套餐，從基礎的 STANDARD 套餐到高端的 VIP 套餐。主要區別在於檢查項目的全面程度，如是否包含 PET-CT、MRI、胃腸鏡等進階項目。您可以在套餐對比表中查看詳細差異。',
      'zh-CN': 'TIMC 提供多种套餐，从基础的 STANDARD 套餐到高端的 VIP 套餐。主要区别在于检查项目的全面程度，如是否包含 PET-CT、MRI、胃肠镜等进阶项目。您可以在套餐对比表中查看详细差异。',
      en: 'TIMC offers various packages from basic STANDARD to premium VIP. The main differences are in the comprehensiveness of examinations, such as whether PET-CT, MRI, and endoscopy are included. You can view detailed differences in the package comparison table.',
    },
  },
  {
    category: 'packages',
    question: {
      ja: '自分に合ったプランはどう選べばいいですか？',
      'zh-TW': '如何選擇適合我的套餐？',
      'zh-CN': '如何选择适合我的套餐？',
      en: 'How do I choose the right package for me?',
    },
    answer: {
      ja: '年齢、性別、家族歴、気になる健康項目を基準にお選びください。迷われる場合は、当サイトのプラン推薦機能をご利用いただくか、カスタマーサービスに直接ご相談ください。',
      'zh-TW': '建議根據您的年齡、性別、家族病史和健康關注點來選擇。如果您不確定，可以使用我們的套餐推薦功能，或直接聯繫客服獲取專業建議。',
      'zh-CN': '建议根据您的年龄、性别、家族病史和健康关注点来选择。如果您不确定，可以使用我们的套餐推荐功能，或直接联系客服获取专业建议。',
      en: 'We recommend choosing based on your age, gender, family medical history, and health concerns. If unsure, you can use our package recommendation tool or contact customer service for professional advice.',
    },
  },
  {
    category: 'packages',
    question: {
      ja: '個別の検査項目を追加できますか？',
      'zh-TW': '可以加購單獨的檢查項目嗎？',
      'zh-CN': '可以加购单独的检查项目吗？',
      en: 'Can I add individual examination items?',
    },
    answer: {
      ja: 'はい。プランに含まれない特定の検査項目を追加したい場合は、予約時の備考欄にご記入ください。お見積もりとスケジュール調整をいたします。',
      'zh-TW': '可以的。如果您需要在套餐基礎上增加特定檢查項目，請在預約時的備註中說明，我們會為您報價並安排。',
      'zh-CN': '可以的。如果您需要在套餐基础上增加特定检查项目，请在预约时的备注中说明，我们会为您报价并安排。',
      en: 'Yes. If you need specific items beyond your package, please note it in the remarks when booking. We will provide a quote and arrange accordingly.',
    },
  },
  // Other
  {
    category: 'other',
    question: {
      ja: '日本のビザは事前に取得する必要がありますか？',
      'zh-TW': '需要提前辦理日本簽證嗎？',
      'zh-CN': '需要提前办理日本签证吗？',
      en: 'Do I need a Japanese visa in advance?',
    },
    answer: {
      ja: 'はい。健診のために来日するには有効な日本ビザが必要です。観光ビザまたは医療ビザを申請できます。ビザ申請に必要な予約確認書等の書類提供もお手伝いいたします。',
      'zh-TW': '是的，您需要持有效的日本簽證才能入境進行體檢。台灣護照持有者可申請觀光簽證或醫療簽證。我們也可協助提供預約確認書等簽證所需材料。',
      'zh-CN': '是的，您需要持有效的日本签证才能入境进行体检。可申请观光签证或医疗签证。我们也可协助提供预约确认书等签证所需材料。',
      en: 'Yes, you need a valid Japanese visa for entry. You can apply for a tourist visa or medical visa. We can also provide booking confirmation documents needed for visa applications.',
    },
  },
  {
    category: 'other',
    question: {
      ja: '送迎サービスはありますか？',
      'zh-TW': '有接送服務嗎？',
      'zh-CN': '有接送服务吗？',
      en: 'Is airport/hotel transfer available?',
    },
    answer: {
      ja: '関西空港や大阪市内のホテルからTIMCまでの専用車送迎サービスを手配可能です（別途料金）。ご希望の場合は予約時の備考欄にご記入いただくか、カスタマーサービスまでご連絡ください。',
      'zh-TW': '我們可以為您安排從關西機場或大阪市區酒店到 TIMC 的專車接送服務（需另外收費）。如有需要，請在預約時的備註中說明或聯繫客服。',
      'zh-CN': '我们可以为您安排从关西机场或大阪市区酒店到 TIMC 的专车接送服务（需另外收费）。如有需要，请在预约时的备注中说明或联系客服。',
      en: 'We can arrange private car transfers from Kansai Airport or Osaka hotels to TIMC (additional fee applies). If needed, please mention it in booking remarks or contact customer service.',
    },
  },
  {
    category: 'other',
    question: {
      ja: 'ホテルの紹介はありますか？',
      'zh-TW': '可以推薦住宿嗎？',
      'zh-CN': '可以推荐住宿吗？',
      en: 'Can you recommend accommodation?',
    },
    answer: {
      ja: 'TIMCは大阪梅田の中心エリアに位置しており、周辺には多数のホテルがあります。宿泊先のご紹介や代行予約も承っております。カスタマーサービスまでお問い合わせください。',
      'zh-TW': 'TIMC 位於大阪梅田核心區域，周邊有眾多酒店可選。我們也可以為您推薦或代訂合適的住宿。如有需要，請聯繫客服獲取推薦。',
      'zh-CN': 'TIMC 位于大阪梅田核心区域，周边有众多酒店可选。我们也可以为您推荐或代订合适的住宿。如有需要，请联系客服获取推荐。',
      en: 'TIMC is located in central Umeda, Osaka, with many hotels nearby. We can also recommend or help book suitable accommodation. Please contact customer service for recommendations.',
    },
  },
];

// Page UI translations
const pageTranslations = {
  headerTitle: { ja: 'よくある質問', 'zh-TW': '常見問題', 'zh-CN': '常见问题', en: 'FAQ' },
  heroTitle: { ja: 'よくある質問 FAQ', 'zh-TW': '常見問題 FAQ', 'zh-CN': '常见问题 FAQ', en: 'Frequently Asked Questions' },
  heroSubtitle: {
    ja: 'TIMC健診予約に関するよくある質問',
    'zh-TW': '關於 TIMC 體檢預約的常見問題解答',
    'zh-CN': '关于 TIMC 体检预约的常见问题解答',
    en: 'Common questions about TIMC health check bookings',
  },
  contactTitle: {
    ja: 'その他のご質問がありますか？',
    'zh-TW': '還有其他問題？',
    'zh-CN': '还有其他问题？',
    en: 'Have more questions?',
  },
  contactSubtitle: {
    ja: '上記のリストに回答がない場合は、お気軽にカスタマーサービスへお問い合わせください。',
    'zh-TW': '如果您的問題未在上述列表中找到答案，歡迎直接聯繫我們的客服團隊。',
    'zh-CN': '如果您的问题未在上述列表中找到答案，欢迎直接联系我们的客服团队。',
    en: 'If your question is not answered above, feel free to contact our customer service team directly.',
  },
  lineConsult: { ja: 'LINEで相談', 'zh-TW': 'LINE 諮詢', 'zh-CN': 'LINE 咨询', en: 'LINE Chat' },
  wechatConsult: { ja: 'WeChatで相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat' },
  emailConsult: { ja: 'メール送信', 'zh-TW': '發送郵件', 'zh-CN': '发送邮件', en: 'Send Email' },
  wechatTitle: { ja: 'WeChat相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat' },
  wechatScanQR: { ja: 'QRコードをスキャンして追加', 'zh-TW': '請用微信掃描二維碼添加客服', 'zh-CN': '请用微信扫描二维码添加客服', en: 'Scan QR code to add our service' },
  wechatOnline: { ja: 'WeChat オンライン', 'zh-TW': '微信客服在線', 'zh-CN': '微信客服在线', en: 'WeChat Online' },
  footerText: {
    ja: 'TIMC OSAKA（徳洲会国際医療センター）健診予約サービスは新島交通株式会社が提供',
    'zh-TW': 'TIMC OSAKA（德洲會國際醫療中心）體檢預約服務由新島交通株式会社提供',
    'zh-CN': 'TIMC OSAKA（德洲会国际医疗中心）体检预约服务由新岛交通株式会社提供',
    en: 'TIMC OSAKA health check booking service provided by Niijima Transport Co., Ltd.',
  },
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [showWechatQR, setShowWechatQR] = useState(false);
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

  const filteredFAQs = activeCategory === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <SmartBackLink />
          <h1 className="text-xl font-bold text-gray-900">{t('headerTitle')}</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('heroTitle')}</h1>
          <p className="text-xl text-gray-600">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORY_KEYS.map(key => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === key
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {CATEGORY_LABELS[key][currentLang]}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => {
            const globalIndex = FAQ_DATA.indexOf(faq);
            const isOpen = openItems.includes(globalIndex);

            return (
              <div
                key={globalIndex}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(globalIndex)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 pr-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                      Q
                    </span>
                    <span className="font-medium text-gray-900">{faq.question[currentLang]}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <div className="flex gap-4 pl-0 md:pl-12">
                      <span className="hidden md:flex flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full items-center justify-center font-bold text-sm">
                        A
                      </span>
                      <p className="text-gray-600 leading-relaxed">{faq.answer[currentLang]}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('contactTitle')}</h2>
          <p className="text-gray-600 mb-8">
            {t('contactSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://line.me/ti/p/j3XxBP50j9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#05b34c] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <MessageCircle size={20} />
              {t('lineConsult')}
            </a>
            <button
              onClick={() => setShowWechatQR(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#07C160] hover:bg-[#06ad56] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
              </svg>
              {t('wechatConsult')}
            </button>
            <a
              href="mailto:haoyuan@niijima-koutsu.jp"
              className="inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <Mail size={20} />
              {t('emailConsult')}
            </a>
          </div>
        </div>

        {/* WeChat QR Modal */}
        {showWechatQR && (
          <div
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowWechatQR(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">{t('wechatTitle')}</h3>
                <button
                  onClick={() => setShowWechatQR(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex justify-center">
                <img
                  src={WECHAT_QR_URL}
                  alt="WeChat QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>

              <p className="text-center text-gray-600 mt-4 text-sm">
                {t('wechatScanQR')}
              </p>

              <div className="mt-4 text-center text-xs px-3 py-2 rounded-lg bg-[#07C160]/10 text-[#07C160]">
                {t('wechatOnline')}
              </div>
            </div>
          </div>
        )}

        {/* SEO Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>{t('footerText')}</p>
        </div>
      </main>
    </div>
  );
}
