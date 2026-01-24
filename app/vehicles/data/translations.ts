import type { Language, PageTranslations, CategoryLabels } from '../types/vehicle';

export const pageTranslations: PageTranslations = {
  // Hero
  heroTitle1: {
    ja: '陸の\nファーストクラス',
    'zh-TW': '陸地頭等艙',
    'zh-CN': '陆地头等舱',
    en: 'First Class\non the Road'
  },
  heroTitle2: {
    ja: 'あなたの日本旅行を\nお守りします',
    'zh-TW': '為您的日本之旅保駕護航',
    'zh-CN': '为您的日本之旅保驾护航',
    en: 'Safeguarding Your\nJourney in Japan'
  },
  heroDesc: {
    ja: '4名の少人数から60名の大型団体まで、新島交通は全シリーズの日本正規緑ナンバー営業車両をご用意。すべてのドライバーは厳選され、安全・快適・上質な移動体験をお届けします。',
    'zh-TW': '從4人精英小團到60人大型企業考察，新島交通提供全系列日本正規綠牌營運車輛。每一位司機都經過嚴格篩選，為您帶來安全、舒適、尊貴的出行體驗。',
    'zh-CN': '从4人精英小团到60人大型企业考察，新岛交通提供全系列日本正规绿牌营运车辆。每一位司机都经过严格筛选，为您带来安全、舒适、尊贵的出行体验。',
    en: 'From intimate groups of 4 to large corporate delegations of 60, Niijima Transport offers a full range of officially licensed green-plate vehicles in Japan. Every driver is carefully selected to deliver a safe, comfortable, and premium travel experience.'
  },
  statVehicles: { ja: '車種選択', 'zh-TW': '車型選擇', 'zh-CN': '车型选择', en: 'Vehicle Types' },
  statCapacity: { ja: '乗車人数', 'zh-TW': '人數覆蓋', 'zh-CN': '人数覆盖', en: 'Capacity Range' },
  statLicense: { ja: '緑ナンバー', 'zh-TW': '綠牌營運', 'zh-CN': '绿牌营运', en: 'Licensed' },
  statSupport: { ja: '緊急サポート', 'zh-TW': '緊急支援', 'zh-CN': '紧急支援', en: 'Emergency Support' },
  trustGreenPlate: { ja: '日本正規緑ナンバー', 'zh-TW': '日本正規綠牌', 'zh-CN': '日本正规绿牌', en: 'Licensed Green Plate' },
  trustInsurance: { ja: '全額商業保険', 'zh-TW': '全額商業保險', 'zh-CN': '全额商业保险', en: 'Full Commercial Insurance' },
  trustDriver: { ja: 'プロ資格ドライバー', 'zh-TW': '專業持證司機', 'zh-CN': '专业持证司机', en: 'Certified Professional Drivers' },
  trustSupport: { ja: '中国語対応', 'zh-TW': '中文客服支援', 'zh-CN': '中文客服支援', en: 'Multilingual Support' },

  // Philosophy
  philosophyTitle1: { ja: '単なる移動手段ではなく', 'zh-TW': '不只是交通工具', 'zh-CN': '不只是交通工具', en: 'More Than Just Transportation' },
  philosophyTitle2: { ja: '旅の中の移動空間です', 'zh-TW': '更是您旅途中的移動空間', 'zh-CN': '更是您旅途中的移动空间', en: 'Your Mobile Space on the Journey' },
  philosophyDesc: {
    ja: '遠方からお越しのお客様にとって、車両はA地点からB地点への手段だけでなく、旅の途中で休息し、語らい、景色を楽しむ大切な空間であることを深く理解しています。',
    'zh-TW': '我們深知，對於遠道而來的貴賓而言，車輛不僅是從A點到B點的工具，更是旅途中休息、交流、欣賞風景的重要空間。',
    'zh-CN': '我们深知，对于远道而来的贵宾而言，车辆不仅是从A点到B点的工具，更是旅途中休息、交流、欣赏风景的重要空间。',
    en: 'We understand that for our guests traveling from afar, a vehicle is not just a means of getting from A to B—it is an important space for resting, conversing, and enjoying the scenery along the way.'
  },
  comfortTitle: { ja: '快適性を最優先', 'zh-TW': '舒適至上', 'zh-CN': '舒适至上', en: 'Supreme Comfort' },
  comfortDesc: {
    ja: 'すべての車両は厳選し、座席の快適さと広い空間を確保。長距離移動でも最高の状態を維持し、目的地に着いても元気いっぱいです。',
    'zh-TW': '每一輛車都經過精心挑選，確保座椅舒適、空間寬敞。長途行程也能保持最佳狀態，讓您抵達目的地時依然精神飽滿。',
    'zh-CN': '每一辆车都经过精心挑选，确保座椅舒适、空间宽敞。长途行程也能保持最佳状态，让您抵达目的地时依然精神饱满。',
    en: 'Every vehicle is carefully selected to ensure comfortable seating and spacious interiors. Even on long journeys, you arrive at your destination feeling refreshed and energized.'
  },
  safetyTitle: { ja: '安全第一', 'zh-TW': '安全第一', 'zh-CN': '安全第一', en: 'Safety First' },
  safetyDesc: {
    ja: 'すべての車両は定期メンテナンス済み、ドライバーは正規営業資格を持ち身元確認済み。毎回の運行に十分な商業保険をかけ、安心してご乗車いただけます。',
    'zh-TW': '所有車輛定期保養檢修，司機持有正規營運資格並通過背景審查。我們為每一趟行程投保足額商業保險，讓您安心出行。',
    'zh-CN': '所有车辆定期保养检修，司机持有正规营运资格并通过背景审查。我们为每一趟行程投保足额商业保险，让您安心出行。',
    en: 'All vehicles undergo regular maintenance. Drivers hold proper commercial licenses and pass background checks. We carry full commercial insurance for every trip, ensuring your peace of mind.'
  },
  punctualTitle: { ja: '時間厳守', 'zh-TW': '準時守信', 'zh-CN': '准时守信', en: 'Always Punctual' },
  punctualDesc: {
    ja: '日本式の時間意識は私たちのサービスDNAに深く根付いています。事前到着、絶対に遅刻しない——これはお客様への約束であり、プロとしてのこだわりです。',
    'zh-TW': '日本式的時間觀念深植於我們的服務DNA。提前抵達、絕不遲到，這是我們對每一位客戶的承諾，也是對專業的堅持。',
    'zh-CN': '日本式的时间观念深植于我们的服务DNA。提前抵达、绝不迟到，这是我们对每一位客户的承诺，也是对专业的坚持。',
    en: 'Japanese punctuality is deeply embedded in our service DNA. Arriving early, never late—this is our promise to every client and our commitment to professionalism.'
  },

  // Service Flow
  flowTitle1: { ja: '簡単4ステップ', 'zh-TW': '輕鬆四步', 'zh-CN': '轻松四步', en: 'Easy 4 Steps' },
  flowTitle2: { ja: 'すぐ出発', 'zh-TW': '即刻啟程', 'zh-CN': '即刻启程', en: 'Start Your Journey' },
  flowStep1Title: { ja: 'ヒアリング', 'zh-TW': '需求溝通', 'zh-CN': '需求沟通', en: 'Consultation' },
  flowStep1Desc: { ja: '日程・人数・ご要望をお伝えください', 'zh-TW': '告訴我們您的行程日期、人數和特殊需求', 'zh-CN': '告诉我们您的行程日期、人数和特殊需求', en: 'Tell us your travel dates, group size, and special requirements' },
  flowStep2Title: { ja: '車種ご提案', 'zh-TW': '車型推薦', 'zh-CN': '车型推荐', en: 'Vehicle Recommendation' },
  flowStep2Desc: { ja: 'ご要望に基づき最適な車種をご提案', 'zh-TW': '根據您的需求，我們推薦最適合的車型', 'zh-CN': '根据您的需求，我们推荐最适合的车型', en: 'We recommend the most suitable vehicle based on your needs' },
  flowStep3Title: { ja: 'ご予約確定', 'zh-TW': '確認預約', 'zh-CN': '确认预约', en: 'Confirm Booking' },
  flowStep3Desc: { ja: 'お見積確認後、デポジットで車両を確保', 'zh-TW': '確認報價後，支付訂金鎖定車輛', 'zh-CN': '确认报价后，支付订金锁定车辆', en: 'After confirming the quote, secure your vehicle with a deposit' },
  flowStep4Title: { ja: '安心出発', 'zh-TW': '安心出行', 'zh-CN': '安心出行', en: 'Travel with Ease' },
  flowStep4Desc: { ja: 'ドライバーが時間通りにお迎え、日本の旅へ', 'zh-TW': '司機準時到達，開啟您的日本之旅', 'zh-CN': '司机准时到达，开启您的日本之旅', en: 'Your driver arrives on time to start your journey in Japan' },

  // Vehicle Grid
  gridTitle: { ja: '営業車両一覧', 'zh-TW': '營運車輛一覽', 'zh-CN': '营运车辆一览', en: 'Our Vehicle Fleet' },
  gridDesc: { ja: 'すべて日本正規緑ナンバー営業車両、プロ資格ドライバー付き', 'zh-TW': '全部為日本正規綠牌營運車輛，配備專業持證司機', 'zh-CN': '全部为日本正规绿牌营运车辆，配备专业持证司机', en: 'All officially licensed green-plate vehicles with certified professional drivers' },
  noVehicles: { ja: 'この車種はありません', 'zh-TW': '暫無此類車型', 'zh-CN': '暂无此类车型', en: 'No vehicles in this category' },

  // Comparison Table
  compareTitle: { ja: '車種クイック比較', 'zh-TW': '車型快速對比', 'zh-CN': '车型快速对比', en: 'Quick Vehicle Comparison' },
  compareDesc: { ja: 'チーム人数に合わせて最適な車種を選択', 'zh-TW': '根據團隊人數選擇合適車型', 'zh-CN': '根据团队人数选择合适车型', en: 'Choose the right vehicle for your group size' },
  thModel: { ja: '車種', 'zh-TW': '車型', 'zh-CN': '车型', en: 'Model' },
  thCapacity: { ja: '定員', 'zh-TW': '定員', 'zh-CN': '定员', en: 'Capacity' },
  thLuggage: { ja: '荷物', 'zh-TW': '行李', 'zh-CN': '行李', en: 'Luggage' },
  thLength: { ja: '全長', 'zh-TW': '車長', 'zh-CN': '车长', en: 'Length' },
  thScenario: { ja: 'おすすめ', 'zh-TW': '推薦場景', 'zh-CN': '推荐场景', en: 'Recommended For' },
  unitPerson: { ja: '名', 'zh-TW': '名', 'zh-CN': '名', en: '' },
  unitPiece: { ja: '件', 'zh-TW': '件', 'zh-CN': '件', en: 'pcs' },

  // Promises
  promiseTitle: { ja: '六つのお約束', 'zh-TW': '六大承諾', 'zh-CN': '六大承诺', en: 'Our Six Promises' },
  promiseDesc: {
    ja: '最高水準で自らに求め、すべてのお客様に期待を超えるサービス体験を提供します',
    'zh-TW': '我們以最高標準要求自己，為每一位貴賓提供超越期待的服務體驗',
    'zh-CN': '我们以最高标准要求自己，为每一位贵宾提供超越期待的服务体验',
    en: 'We hold ourselves to the highest standards, delivering service experiences that exceed expectations for every guest'
  },
  promise1Title: { ja: '100% 緑ナンバー', 'zh-TW': '100% 綠牌營運', 'zh-CN': '100% 绿牌营运', en: '100% Licensed' },
  promise1Desc: { ja: 'すべての車両は国土交通省認可の正規営業車両', 'zh-TW': '所有車輛均為日本國土交通省核發的正規營運車輛，合法合規', 'zh-CN': '所有车辆均为日本国土交通省核发的正规营运车辆，合法合规', en: 'All vehicles are officially licensed by Japan\'s Ministry of Land, Infrastructure, Transport and Tourism' },
  promise2Title: { ja: '全額商業保険', 'zh-TW': '全額商業保險', 'zh-CN': '全额商业保险', en: 'Full Insurance' },
  promise2Desc: { ja: '毎回の運行に十分な商業保険、最高1億円保障', 'zh-TW': '為每一趟行程投保足額商業保險，保障金額最高可達1億日元', 'zh-CN': '为每一趟行程投保足额商业保险，保障金额最高可达1亿日元', en: 'Full commercial insurance for every trip, with coverage up to 100 million yen' },
  promise3Title: { ja: 'プロ資格ドライバー', 'zh-TW': '專業持證司機', 'zh-CN': '专业持证司机', en: 'Certified Drivers' },
  promise3Desc: { ja: '全ドライバーは正規営業資格保持、身元確認・マナー研修済み', 'zh-TW': '司機均持有正規營運資格，經過嚴格背景審查和禮儀培訓', 'zh-CN': '司机均持有正规营运资格，经过严格背景审查和礼仪培训', en: 'All drivers hold commercial licenses, pass background checks, and receive etiquette training' },
  promise4Title: { ja: '時間厳守', 'zh-TW': '準時到達', 'zh-CN': '准时到达', en: 'On-Time Guarantee' },
  promise4Desc: { ja: '約束の15分前到着、弊社都合の遅延は料金減免', 'zh-TW': '提前15分鐘抵達約定地點，若因我方原因遲到，車費減免', 'zh-CN': '提前15分钟抵达约定地点，若因我方原因迟到，车费减免', en: 'Arriving 15 minutes early. If we cause a delay, fare reduction applies' },
  promise5Title: { ja: '24時間サポート', 'zh-TW': '24小時支援', 'zh-CN': '24小时支援', en: '24/7 Support' },
  promise5Desc: { ja: '旅行中の問題は中国語対応チームが24時間サポート', 'zh-TW': '旅途中遇到任何問題，中文客服團隊全天候待命協助', 'zh-CN': '旅途中遇到任何问题，中文客服团队全天候待命协助', en: 'Our multilingual support team is available around the clock during your trip' },
  promise6Title: { ja: 'フィードバック制度', 'zh-TW': '服務反饋機制', 'zh-CN': '服务反馈机制', en: 'Feedback System' },
  promise6Desc: { ja: 'サービス後にフィードバックを収集、問題には改善案や協議対応を実施', 'zh-TW': '服務結束後收集反饋，針對服務問題提供改進方案或協商處理', 'zh-CN': '服务结束后收集反馈，针对服务问题提供改进方案或协商处理', en: 'We collect feedback after service and provide improvement plans or negotiate solutions for any issues' },

  // CTA
  ctaTitle: { ja: '日本の旅を始める準備はできましたか？', 'zh-TW': '準備好開始您的日本之旅了嗎？', 'zh-CN': '准备好开始您的日本之旅了吗？', en: 'Ready to Start Your Journey in Japan?' },
  ctaDesc: {
    ja: '空港送迎、都市観光、都市間移動のいずれも、最適な車両とサービスをご提供します',
    'zh-TW': '無論是機場接送、城市觀光還是跨城市移動，我們都能為您提供最合適的車輛和服務',
    'zh-CN': '无论是机场接送、城市观光还是跨城市移动，我们都能为您提供最合适的车辆和服务',
    en: 'Whether it\'s airport transfers, city tours, or intercity travel, we provide the perfect vehicle and service for you'
  },

  // Vehicle Card
  passengers: { ja: '乗客定員', 'zh-TW': '乘客定員', 'zh-CN': '乘客定员', en: 'Passengers' },
  luggageCapacity: { ja: '荷物容量', 'zh-TW': '行李容量', 'zh-CN': '行李容量', en: 'Luggage' },
  expandDetails: { ja: '詳細を見る', 'zh-TW': '查看詳情', 'zh-CN': '查看详情', en: 'View Details' },
  collapseDetails: { ja: '閉じる', 'zh-TW': '收起詳情', 'zh-CN': '收起详情', en: 'Collapse' },
  interiorConfig: { ja: '車内装備', 'zh-TW': '車內配置', 'zh-CN': '车内配置', en: 'Interior Features' },
  suitableScenarios: { ja: '適用シーン', 'zh-TW': '適用場景', 'zh-CN': '适用场景', en: 'Suitable For' },
  viewSeatLayout: { ja: '座席配置図を見る', 'zh-TW': '查看座席配置圖', 'zh-CN': '查看座席配置图', en: 'View Seat Layout' },

  // Seat Layout Modal
  seatConfig: { ja: '座席配置図', 'zh-TW': '座席配置圖', 'zh-CN': '座席配置图', en: 'Seat Layout' },
  front: { ja: '車両前方 ▲', 'zh-TW': '車頭 ▲', 'zh-CN': '车头 ▲', en: 'Front ▲' },
  rear: { ja: '車両後方 ▼', 'zh-TW': '車尾 ▼', 'zh-CN': '车尾 ▼', en: 'Rear ▼' },
  driver: { ja: 'ドライバー', 'zh-TW': '司機', 'zh-CN': '司机', en: 'Driver' },
  passengerSeat: { ja: '乘客席', 'zh-TW': '乘客座位', 'zh-CN': '乘客座位', en: 'Passenger Seat' },
  door: { ja: 'ドア', 'zh-TW': '車門', 'zh-CN': '车门', en: 'Door' },
  aisle: { ja: '通路', 'zh-TW': '走道', 'zh-CN': '走道', en: 'Aisle' },
  seatDisclaimer: { ja: '※ 座席配置は車両によって異なる場合があります', 'zh-TW': '* 座位配置可能因具體車輛略有不同，以實際車輛為準', 'zh-CN': '* 座位配置可能因具体车辆略有不同，以实际车辆为准', en: '* Seat layout may vary slightly depending on the actual vehicle' },
  driverShort: { ja: '運', 'zh-TW': '司', 'zh-CN': '司', en: 'D' },
  doorShort: { ja: '扉', 'zh-TW': '門', 'zh-CN': '门', en: '🚪' },
  seatLabel: { ja: '座席', 'zh-TW': '座位', 'zh-CN': '座位', en: 'Seat' },
  closeModal: { ja: '閉じる', 'zh-TW': '關閉', 'zh-CN': '关闭', en: 'Close' },

  // Loading states
  loading: { ja: '読み込み中...', 'zh-TW': '載入中...', 'zh-CN': '加载中...', en: 'Loading...' },
  imageError: { ja: '画像を読み込めませんでした', 'zh-TW': '無法載入圖片', 'zh-CN': '无法加载图片', en: 'Failed to load image' },
};

export const CATEGORY_LABELS: CategoryLabels = {
  all: { ja: 'すべて', 'zh-TW': '全部車型', 'zh-CN': '全部车型', en: 'All' },
  taxi: { ja: 'ハイヤー', 'zh-TW': '高級出租車', 'zh-CN': '高级出租车', en: 'Premium Taxi' },
  minibus: { ja: '小型バス', 'zh-TW': '小型巴士', 'zh-CN': '小型巴士', en: 'Minibus' },
  mediumbus: { ja: '中型バス', 'zh-TW': '中型巴士', 'zh-CN': '中型巴士', en: 'Medium Bus' },
  largebus: { ja: '大型バス', 'zh-TW': '大型巴士', 'zh-CN': '大型巴士', en: 'Large Bus' }
};
