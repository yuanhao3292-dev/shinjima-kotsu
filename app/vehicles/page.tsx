'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import ContactButtons from '@/components/ContactButtons';
import {
  Users,
  Luggage,
  CheckCircle,
  Car,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Ruler,
  Clock,
  Phone,
  HeartHandshake,
  Award,
  Sparkles,
  MapPin,
  Headphones,
  FileCheck,
  BadgeCheck,
  ArrowRight
} from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

// ===== 頁面翻譯 =====
const pageTranslations = {
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
  passengerSeat: { ja: '乗客席', 'zh-TW': '乘客座位', 'zh-CN': '乘客座位', en: 'Passenger Seat' },
  door: { ja: 'ドア', 'zh-TW': '車門', 'zh-CN': '车门', en: 'Door' },
  aisle: { ja: '通路', 'zh-TW': '走道', 'zh-CN': '走道', en: 'Aisle' },
  seatDisclaimer: { ja: '※ 座席配置は車両によって異なる場合があります', 'zh-TW': '* 座位配置可能因具體車輛略有不同，以實際車輛為準', 'zh-CN': '* 座位配置可能因具体车辆略有不同，以实际车辆为准', en: '* Seat layout may vary slightly depending on the actual vehicle' },
  driverShort: { ja: '運', 'zh-TW': '司', 'zh-CN': '司', en: 'D' },
  doorShort: { ja: '扉', 'zh-TW': '門', 'zh-CN': '门', en: '🚪' },
  seatLabel: { ja: '座席', 'zh-TW': '座位', 'zh-CN': '座位', en: 'Seat' },
};

// ===== 車輛分類翻譯 =====
const CATEGORY_LABELS: Record<VehicleCategory, Record<Language, string>> = {
  all: { ja: 'すべて', 'zh-TW': '全部車型', 'zh-CN': '全部车型', en: 'All' },
  taxi: { ja: 'ハイヤー', 'zh-TW': '高級出租車', 'zh-CN': '高级出租车', en: 'Premium Taxi' },
  minibus: { ja: '小型バス', 'zh-TW': '小型巴士', 'zh-CN': '小型巴士', en: 'Minibus' },
  mediumbus: { ja: '中型バス', 'zh-TW': '中型巴士', 'zh-CN': '中型巴士', en: 'Medium Bus' },
  largebus: { ja: '大型バス', 'zh-TW': '大型巴士', 'zh-CN': '大型巴士', en: 'Large Bus' }
};

// ===== 車輛類型篩選 =====
type VehicleCategory = 'all' | 'taxi' | 'minibus' | 'mediumbus' | 'largebus';

// ===== 車輛數據 =====
interface Vehicle {
  id: string;
  name: Record<Language, string>;
  category: VehicleCategory;
  image: string;
  capacity: {
    passengers: number;
    maxPassengers?: number;
    luggage: number;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  features: Record<Language, string[]>;
  suitableFor: Record<Language, string[]>;
  highlight: Record<Language, string>;
  seatLayout: {
    rows: string[][];
    legend?: Record<Language, string>;
  };
}

const VEHICLES: Vehicle[] = [
  {
    id: 'alphard',
    name: { ja: 'トヨタ アルファード', 'zh-TW': '豐田埃爾法', 'zh-CN': '丰田埃尔法', en: 'Toyota Alphard' },
    category: 'taxi',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/alphard.jpg',
    capacity: { passengers: 6, luggage: 4 },
    dimensions: { length: 4950, width: 1850, height: 1950 },
    features: {
      ja: ['本革シート', '独立エアコン', '車載WiFi', 'USB充電', 'ゆとりの足元空間'],
      'zh-TW': ['真皮座椅', '獨立空調', '車載WiFi', 'USB充電', '寬敞腿部空間'],
      'zh-CN': ['真皮座椅', '独立空调', '车载WiFi', 'USB充电', '宽敞腿部空间'],
      en: ['Leather Seats', 'Individual A/C', 'In-car WiFi', 'USB Charging', 'Spacious Legroom']
    },
    suitableFor: {
      ja: ['空港送迎', 'VIP接待', 'ビジネス視察', 'ゴルフ送迎'],
      'zh-TW': ['機場接送', 'VIP接待', '商務考察', '高爾夫出行'],
      'zh-CN': ['机场接送', 'VIP接待', '商务考察', '高尔夫出行'],
      en: ['Airport Transfer', 'VIP Reception', 'Business Tour', 'Golf Trip']
    },
    highlight: {
      ja: '日本で最も人気のハイエンドMPV、快適と品質の代名詞',
      'zh-TW': '日本最受歡迎的高端商務MPV，舒適與品質的代名詞',
      'zh-CN': '日本最受欢迎的高端商务MPV，舒适与品质的代名词',
      en: 'Japan\'s most popular premium MPV, synonymous with comfort and quality'
    },
    seatLayout: {
      rows: [['D', 'P'], ['P', 'P'], ['P', 'P', 'P']],
      legend: { ja: '3列目は折りたたみ可能（荷室拡大）', 'zh-TW': '第三排可折疊增加行李空間', 'zh-CN': '第三排可折叠增加行李空间', en: 'Third row foldable for extra luggage space' }
    }
  },
  {
    id: 'hiace',
    name: { ja: 'トヨタ ハイエース グランドキャビン', 'zh-TW': '豐田海獅商務版', 'zh-CN': '丰田海狮商务版', en: 'Toyota HiAce Grand Cabin' },
    category: 'taxi',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/hiace.jpg',
    capacity: { passengers: 9, luggage: 8 },
    dimensions: { length: 5380, width: 1880, height: 2285 },
    features: {
      ja: ['ハイルーフ', '大容量荷室', '独立エアコン', '車載WiFi', 'USB充電'],
      'zh-TW': ['高頂設計', '超大行李空間', '獨立冷氣', '車載WiFi', 'USB充電'],
      'zh-CN': ['高顶设计', '超大行李空间', '独立冷气', '车载WiFi', 'USB充电'],
      en: ['High Roof', 'Extra Luggage Space', 'Individual A/C', 'In-car WiFi', 'USB Charging']
    },
    suitableFor: {
      ja: ['家族旅行', '小グループ', 'ゴルフバッグ輸送', '空港送迎'],
      'zh-TW': ['家庭旅行', '小團隊出行', '高爾夫球具運輸', '機場接送'],
      'zh-CN': ['家庭旅行', '小团队出行', '高尔夫球具运输', '机场接送'],
      en: ['Family Travel', 'Small Groups', 'Golf Bag Transport', 'Airport Transfer']
    },
    highlight: {
      ja: '大容量商用バン、大量の荷物を持つグループに最適',
      'zh-TW': '超大空間商務車，特別適合攜帶大量行李的團隊',
      'zh-CN': '超大空间商务车，特别适合携带大量行李的团队',
      en: 'Spacious commercial van, perfect for groups with lots of luggage'
    },
    seatLayout: {
      rows: [['D', 'P'], ['P', 'P'], ['P', 'P'], ['P', 'P', 'P']],
      legend: { ja: '後部に大型荷室', 'zh-TW': '後部大型行李艙', 'zh-CN': '后部大型行李舱', en: 'Large rear luggage compartment' }
    }
  },
  {
    id: 'coaster',
    name: { ja: 'トヨタ コースター', 'zh-TW': '豐田考斯特', 'zh-CN': '丰田柯斯达', en: 'Toyota Coaster' },
    category: 'minibus',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/coaster.jpg',
    capacity: { passengers: 21, maxPassengers: 24, luggage: 21 },
    dimensions: { length: 6990, width: 2080, height: 2635 },
    features: {
      ja: ['豪華シート', '独立エアコン', '車載マイク', 'DVD再生', '冷蔵庫'],
      'zh-TW': ['豪華座椅', '獨立空調', '車載麥克風', 'DVD播放', '冰箱'],
      'zh-CN': ['豪华座椅', '独立空调', '车载麦克风', 'DVD播放', '冰箱'],
      en: ['Luxury Seats', 'Individual A/C', 'Onboard Mic', 'DVD Player', 'Refrigerator']
    },
    suitableFor: {
      ja: ['企業研修', '観光旅行', '結婚式送迎', '空港団体送迎'],
      'zh-TW': ['企業團建', '觀光旅遊', '婚禮接送', '機場團體接送'],
      'zh-CN': ['企业团建', '观光旅游', '婚礼接送', '机场团体接送'],
      en: ['Corporate Events', 'Sightseeing', 'Wedding Transfer', 'Airport Group Transfer']
    },
    highlight: {
      ja: '日本で最もクラシックな小型観光バス、安定性と快適性を兼備',
      'zh-TW': '日本最經典的小型觀光巴士，穩定性與舒適性兼備',
      'zh-CN': '日本最经典的小型观光巴士，稳定性与舒适性兼备',
      en: 'Japan\'s most classic minibus, combining stability and comfort'
    },
    seatLayout: {
      rows: [
        ['D', '—', '🚪'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P']
      ],
      legend: { ja: '正席21席 + 補助席3席', 'zh-TW': '正座席21席 + 補助席3席', 'zh-CN': '正座席21席 + 补助席3席', en: '21 regular seats + 3 auxiliary seats' }
    }
  },
  {
    id: 'melpha',
    name: { ja: '日野 メルファ', 'zh-TW': '日野梅爾法', 'zh-CN': '日野梅尔法', en: 'Hino Melpha' },
    category: 'mediumbus',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/melpha.jpg',
    capacity: { passengers: 27, luggage: 27 },
    dimensions: { length: 8990, width: 2340, height: 3120 },
    features: {
      ja: ['床下大型荷物庫', '豪華リクライニングシート', '独立エアコン', 'トイレ（一部）', '音響システム'],
      'zh-TW': ['底部大型行李艙', '豪華可調座椅', '獨立空調', '衛生間（部分）', '音響系統'],
      'zh-CN': ['底部大型行李舱', '豪华可调座椅', '独立空调', '卫生间（部分）', '音响系统'],
      en: ['Under-floor Luggage', 'Reclining Seats', 'Individual A/C', 'Restroom (some)', 'Audio System']
    },
    suitableFor: {
      ja: ['中型団体旅行', '会議送迎', '都市間移動', '企業視察'],
      'zh-TW': ['中型團隊旅遊', '會議接送', '跨城市移動', '企業考察'],
      'zh-CN': ['中型团队旅游', '会议接送', '跨城市移动', '企业考察'],
      en: ['Mid-size Group Tours', 'Conference Transfer', 'Intercity Travel', 'Corporate Inspection']
    },
    highlight: {
      ja: '中型バスは補助席なし設計、全乗客に快適な正席をご提供',
      'zh-TW': '中型巴士無補助席設計，每位乘客都享有舒適正座席',
      'zh-CN': '中型巴士无补助席设计，每位乘客都享有舒适正座席',
      en: 'Medium bus with no auxiliary seats—every passenger enjoys a comfortable regular seat'
    },
    seatLayout: {
      rows: [
        ['D', '—', '🚪'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P']
      ],
      legend: { ja: '正席27席（補助席なし）', 'zh-TW': '正座席27席（無補助席）', 'zh-CN': '正座席27席（无补助席）', en: '27 regular seats (no auxiliary seats)' }
    }
  },
  {
    id: 'selega',
    name: { ja: '日野 セレガ ハイデッカ', 'zh-TW': '日野賽雷加', 'zh-CN': '日野赛雷加', en: 'Hino S\'elega High Decker' },
    category: 'largebus',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/selega.jpg',
    capacity: { passengers: 45, maxPassengers: 53, luggage: 45 },
    dimensions: { length: 11990, width: 2490, height: 3500 },
    features: {
      ja: ['4輪電子制御サスペンション', 'PCSプリクラッシュセーフティ', 'ドライバーモニター', 'LED間接照明', 'フルオートA/C', '7速AMT'],
      'zh-TW': ['4輪電子控制懸架', 'PCS預碰撞安全系統', '駕駛員監控系統', 'LED間接照明', '全自動空調', '7速AMT變速箱'],
      'zh-CN': ['4轮电子控制悬架', 'PCS预碰撞安全系统', '驾驶员监控系统', 'LED间接照明', '全自动空调', '7速AMT变速箱'],
      en: ['4-Wheel Electronic Suspension', 'Pre-Crash Safety System', 'Driver Monitor', 'LED Ambient Lighting', 'Full Auto A/C', '7-Speed AMT']
    },
    suitableFor: {
      ja: ['大型団体旅行', 'MICE送迎', '長距離移動', '企業大型イベント'],
      'zh-TW': ['大型團隊旅遊', '會展接送', '長途跨城', '企業大型活動'],
      'zh-CN': ['大型团队旅游', '会展接送', '长途跨城', '企业大型活动'],
      en: ['Large Group Tours', 'MICE Transfer', 'Long Distance', 'Corporate Events']
    },
    highlight: {
      ja: '日野フラッグシップ大型観光バス、先進安全システム搭載、最小回転半径8.7m',
      'zh-TW': '日野旗艦大型觀光巴士，搭載先進安全系統，最小轉彎半徑8.7m',
      'zh-CN': '日野旗舰大型观光巴士，搭载先进安全系统，最小转弯半径8.7m',
      en: 'Hino flagship tour bus with advanced safety systems, 8.7m minimum turning radius'
    },
    seatLayout: {
      rows: [
        ['D', '—', '🚪'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P']
      ],
      legend: { ja: '正席45席 + 補助席8席 = 53席', 'zh-TW': '正座席45席 + 補助席8席 = 53席', 'zh-CN': '正座席45席 + 补助席8席 = 53席', en: '45 regular + 8 auxiliary = 53 seats' }
    }
  },
  {
    id: 'aeroqueen',
    name: { ja: '三菱ふそう エアロクィーン', 'zh-TW': '三菱扶桑艾洛皇后', 'zh-CN': '三菱扶桑艾洛皇后', en: 'Mitsubishi Fuso Aero Queen' },
    category: 'largebus',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/aeroqueen.jpg',
    capacity: { passengers: 49, maxPassengers: 60, luggage: 49 },
    dimensions: { length: 11990, width: 2490, height: 3650 },
    features: {
      ja: ['超大型荷物庫', '高級本革シート', 'デュアルゾーンA/C', '車載トイレ', 'HD娯楽システム', 'フットレスト'],
      'zh-TW': ['超大行李艙', '高級真皮座椅', '雙區空調', '車載衛生間', '高清娛樂', '腳踏板'],
      'zh-CN': ['超大行李舱', '高级真皮座椅', '双区空调', '车载卫生间', '高清娱乐', '脚踏板'],
      en: ['Extra Luggage Bay', 'Premium Leather', 'Dual-Zone A/C', 'Onboard Restroom', 'HD Entertainment', 'Footrests']
    },
    suitableFor: {
      ja: ['VIP大型団体', 'ハイエンド企業視察', '国際会議送迎', '長距離豪華旅行'],
      'zh-TW': ['VIP大型團隊', '高端企業考察', '國際會議接送', '長途豪華遊'],
      'zh-CN': ['VIP大型团队', '高端企业考察', '国际会议接送', '长途豪华游'],
      en: ['VIP Large Groups', 'Premium Corporate', 'International Conference', 'Long-distance Luxury']
    },
    highlight: {
      ja: '三菱フラッグシップ大型バス、最高級の豪華仕様',
      'zh-TW': '三菱旗艦大巴，頂級豪華配置',
      'zh-CN': '三菱旗舰大巴，顶级豪华配置',
      en: 'Mitsubishi flagship bus with top-tier luxury configuration'
    },
    seatLayout: {
      rows: [
        ['D', '—', '🚪'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P']
      ],
      legend: { ja: '正席49席 + 補助席11席 = 60席', 'zh-TW': '正座席49席 + 補助席11席 = 60席', 'zh-CN': '正座席49席 + 补助席11席 = 60席', en: '49 regular + 11 auxiliary = 60 seats' }
    }
  }
];

// ===== 座位圖組件 =====
const SeatLayoutModal = ({ vehicle, lang, t, onClose }: { vehicle: Vehicle; lang: Language; t: (key: keyof typeof pageTranslations) => string; onClose: () => void }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{vehicle.name[lang]}</h3>
            <p className="text-sm text-gray-500">{t('seatConfig')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-4">
            <div className="inline-block bg-gray-800 text-white text-xs px-4 py-1 rounded-full">
              {t('front')}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 mb-4">
            {vehicle.seatLayout.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 justify-center">
                {row.map((seat, seatIndex) => {
                  let bgColor = 'bg-gray-100';
                  let textColor = 'text-gray-400';
                  let content = '';
                  let title = '';

                  if (seat === 'D') {
                    bgColor = 'bg-blue-500';
                    textColor = 'text-white';
                    content = t('driverShort');
                    title = t('driver');
                  } else if (seat === 'P') {
                    bgColor = 'bg-orange-100 border border-orange-300';
                    textColor = 'text-orange-600';
                    content = String(rowIndex * row.filter(s => s === 'P').length + row.slice(0, seatIndex).filter(s => s === 'P').length + 1);
                    title = `${t('seatLabel')} ${content}`;
                  } else if (seat === '🚪') {
                    bgColor = 'bg-green-100 border border-green-300';
                    textColor = 'text-green-600';
                    content = t('doorShort');
                    title = t('door');
                  } else if (seat === '—') {
                    bgColor = 'bg-transparent';
                    content = '';
                    title = t('aisle');
                  }

                  return (
                    <div
                      key={seatIndex}
                      className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded ${bgColor} ${textColor}`}
                      title={title}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <div className="inline-block bg-gray-300 text-gray-600 text-xs px-4 py-1 rounded-full">
              {t('rear')}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-blue-500 rounded"></span> {t('driver')}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></span> {t('passengerSeat')}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-green-100 border border-green-300 rounded"></span> {t('door')}
            </span>
          </div>

          {vehicle.seatLayout.legend && (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">{vehicle.seatLayout.legend[lang]}</p>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4">
          <p className="text-xs text-gray-400 text-center">
            {t('seatDisclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};

// ===== 車輛卡片組件 =====
const VehicleCard = ({ vehicle, lang, t }: { vehicle: Vehicle; lang: Language; t: (key: keyof typeof pageTranslations) => string }) => {
  const [showSeatLayout, setShowSeatLayout] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all group">
        <div className="relative h-56 overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name[lang]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white">{vehicle.name[lang]}</h3>
            <p className="text-gray-300 text-sm">{vehicle.name.en !== vehicle.name[lang] ? vehicle.name.en : vehicle.name.ja}</p>
          </div>

          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
              {CATEGORY_LABELS[vehicle.category][lang]}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-around mb-5 py-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users size={20} className="text-orange-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {vehicle.capacity.passengers}
                  {vehicle.capacity.maxPassengers && (
                    <span className="text-sm font-normal text-gray-400">~{vehicle.capacity.maxPassengers}</span>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500">{t('passengers')}</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Luggage size={20} className="text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">{vehicle.capacity.luggage}</span>
              </div>
              <p className="text-xs text-gray-500">{t('luggageCapacity')}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <Star size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-700">{vehicle.highlight[lang]}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Ruler size={14} className="text-gray-400" />
            <span>
              {(vehicle.dimensions.length / 1000).toFixed(1)}m × {(vehicle.dimensions.width / 1000).toFixed(2)}m × {(vehicle.dimensions.height / 1000).toFixed(2)}m
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            {expanded ? t('collapseDetails') : t('expandDetails')}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expanded && (
            <div className="mt-4 pt-4 border-t space-y-4 animate-fade-in">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">{t('interiorConfig')}</h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features[lang].map((feature) => (
                    <span key={feature} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">{t('suitableScenarios')}</h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.suitableFor[lang].map((use) => (
                    <span key={use} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowSeatLayout(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-medium text-sm"
              >
                <Maximize2 size={16} />
                {t('viewSeatLayout')}
              </button>
            </div>
          )}
        </div>
      </div>

      {showSeatLayout && (
        <SeatLayoutModal vehicle={vehicle} lang={lang} t={t} onClose={() => setShowSeatLayout(false)} />
      )}
    </>
  );
};

// ===== 主頁面 =====
export default function VehiclesPage() {
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('all');
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

  const filteredVehicles = selectedCategory === 'all'
    ? VEHICLES
    : VEHICLES.filter(v => v.category === selectedCategory);

  return (
    <PublicLayout showFooter={true} activeNav="vehicles">
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-ebd3fee29dbf?q=80&w=2070&auto=format&fit=crop')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-orange-500/10 rounded-full filter blur-[100px] -top-20 -left-40"></div>
          <div className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full filter blur-[80px] bottom-0 right-20"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
              <Car size={16} className="text-orange-400" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Premium Vehicle Fleet</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {t('heroTitle1')}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                {t('heroTitle2')}
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              {t('heroDesc')}
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">6+</div>
                <div className="text-sm text-gray-400">{t('statVehicles')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">4-60</div>
                <div className="text-sm text-gray-400">{t('statCapacity')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">{t('statLicense')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">24h</div>
                <div className="text-sm text-gray-400">{t('statSupport')}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: BadgeCheck, text: t('trustGreenPlate') },
                { icon: Shield, text: t('trustInsurance') },
                { icon: Award, text: t('trustDriver') },
                { icon: Headphones, text: t('trustSupport') }
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 border border-white/10">
                  <item.icon size={16} className="text-green-400" />
                  <span className="text-sm text-white/90">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <HeartHandshake size={16} />
              Our Philosophy
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              {t('philosophyTitle1')}<br/>
              <span className="text-orange-500">{t('philosophyTitle2')}</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t('philosophyDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, titleKey: 'comfortTitle' as const, descKey: 'comfortDesc' as const, color: 'orange' },
              { icon: Shield, titleKey: 'safetyTitle' as const, descKey: 'safetyDesc' as const, color: 'blue' },
              { icon: Clock, titleKey: 'punctualTitle' as const, descKey: 'punctualDesc' as const, color: 'green' }
            ].map(item => (
              <div key={item.titleKey} className="group">
                <div className={`bg-${item.color}-50 rounded-2xl p-8 h-full border border-${item.color}-100 hover:shadow-xl transition-all`}>
                  <div className={`w-14 h-14 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} className={`text-${item.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t(item.titleKey)}</h3>
                  <p className="text-gray-600 leading-relaxed">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Flow */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <FileCheck size={16} />
              Service Flow
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              {t('flowTitle1')}<br/>
              <span className="text-blue-600">{t('flowTitle2')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', titleKey: 'flowStep1Title' as const, descKey: 'flowStep1Desc' as const, icon: Phone },
              { step: '02', titleKey: 'flowStep2Title' as const, descKey: 'flowStep2Desc' as const, icon: Car },
              { step: '03', titleKey: 'flowStep3Title' as const, descKey: 'flowStep3Desc' as const, icon: CheckCircle },
              { step: '04', titleKey: 'flowStep4Title' as const, descKey: 'flowStep4Desc' as const, icon: MapPin }
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="text-5xl font-bold text-gray-100 mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <item.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t(item.titleKey)}</h3>
                  <p className="text-sm text-gray-500">{t(item.descKey)}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight size={20} className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-20 z-30 bg-white border-b shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 py-4 overflow-x-auto hide-scrollbar">
            {(Object.keys(CATEGORY_LABELS) as VehicleCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {CATEGORY_LABELS[cat][currentLang]}
                <span className="ml-1 text-xs opacity-70">
                  ({cat === 'all' ? VEHICLES.length : VEHICLES.filter(v => v.category === cat).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('gridTitle')}</h2>
            <p className="text-gray-500">{t('gridDesc')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} lang={currentLang} t={t} />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('noVehicles')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('compareTitle')}</h2>
            <p className="text-gray-500">{t('compareDesc')}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-l-lg">{t('thModel')}</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">{t('thCapacity')}</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">{t('thLuggage')}</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">{t('thLength')}</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-r-lg">{t('thScenario')}</th>
                </tr>
              </thead>
              <tbody>
                {VEHICLES.map((v, index) => (
                  <tr key={v.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{v.name[currentLang]}</p>
                        <p className="text-xs text-gray-400">{v.name.en}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-orange-600">{v.capacity.passengers}</span>
                      {v.capacity.maxPassengers && (
                        <span className="text-gray-400 text-sm">~{v.capacity.maxPassengers}</span>
                      )}
                      <span className="text-gray-500 text-sm">{t('unitPerson')}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium text-gray-700">{v.capacity.luggage}</span>
                      <span className="text-gray-500 text-sm">{t('unitPiece')}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {(v.dimensions.length / 1000).toFixed(1)}m
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.suitableFor[currentLang].slice(0, 2).map(s => (
                          <span key={s} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Award size={16} className="text-orange-400" />
              Our Promise
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              <span className="text-orange-400">{t('promiseTitle')}</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('promiseDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BadgeCheck, titleKey: 'promise1Title' as const, descKey: 'promise1Desc' as const },
              { icon: Shield, titleKey: 'promise2Title' as const, descKey: 'promise2Desc' as const },
              { icon: Users, titleKey: 'promise3Title' as const, descKey: 'promise3Desc' as const },
              { icon: Clock, titleKey: 'promise4Title' as const, descKey: 'promise4Desc' as const },
              { icon: Headphones, titleKey: 'promise5Title' as const, descKey: 'promise5Desc' as const },
              { icon: Star, titleKey: 'promise6Title' as const, descKey: 'promise6Desc' as const }
            ].map(item => (
              <div key={item.titleKey} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('ctaTitle')}
            </h2>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
              {t('ctaDesc')}
            </p>
            <ContactButtons className="max-w-2xl mx-auto" />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </PublicLayout>
  );
}
