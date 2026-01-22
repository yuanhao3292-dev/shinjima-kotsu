'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import ContactButtons from '@/components/ContactButtons';
import {
  Users,
  Luggage,
  CheckCircle,
  ArrowLeft,
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

// 車輛類型篩選
type VehicleCategory = 'all' | 'taxi' | 'minibus' | 'mediumbus' | 'largebus';

const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  all: '全部車型',
  taxi: '高級出租車',
  minibus: '小型巴士',
  mediumbus: '中型巴士',
  largebus: '大型巴士'
};

// 車輛數據 - 參考日本バス会社的展示方式
interface Vehicle {
  id: string;
  name: string;
  nameJa: string;
  nameEn: string;
  category: VehicleCategory;
  image: string;
  interiorImage?: string;
  capacity: {
    passengers: number;
    maxPassengers?: number;  // 含補助席
    luggage: number;
  };
  dimensions: {
    length: number;  // mm
    width: number;
    height: number;
  };
  features: string[];
  suitableFor: string[];
  highlight: string;
  seatLayout: {
    rows: string[][];
    legend?: string;
  };
}

const VEHICLES: Vehicle[] = [
  // 高級出租車
  {
    id: 'alphard',
    name: '豐田埃爾法',
    nameJa: 'トヨタ アルファード',
    nameEn: 'Toyota Alphard',
    category: 'taxi',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/alphard.jpg',
    capacity: {
      passengers: 6,
      luggage: 4
    },
    dimensions: {
      length: 4950,
      width: 1850,
      height: 1950
    },
    features: ['真皮座椅', '獨立空調', '車載WiFi', 'USB充電', '寬敞腿部空間'],
    suitableFor: ['機場接送', 'VIP接待', '商務考察', '高爾夫出行'],
    highlight: '日本最受歡迎的高端商務MPV，舒適與品質的代名詞',
    seatLayout: {
      rows: [
        ['D', 'P'],
        ['P', 'P'],
        ['P', 'P', 'P']
      ],
      legend: '第三排可折疊增加行李空間'
    }
  },
  {
    id: 'hiace',
    name: '豐田海獅商務版',
    nameJa: 'トヨタ ハイエース グランドキャビン',
    nameEn: 'Toyota HiAce Grand Cabin',
    category: 'taxi',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/hiace.jpg',
    capacity: {
      passengers: 9,
      luggage: 8
    },
    dimensions: {
      length: 5380,
      width: 1880,
      height: 2285
    },
    features: ['高頂設計', '超大行李空間', '獨立冷氣', '車載WiFi', 'USB充電'],
    suitableFor: ['家庭旅行', '小團隊出行', '高爾夫球具運輸', '機場接送'],
    highlight: '超大空間商務車，特別適合攜帶大量行李的團隊',
    seatLayout: {
      rows: [
        ['D', 'P'],
        ['P', 'P'],
        ['P', 'P'],
        ['P', 'P', 'P']
      ],
      legend: '後部大型行李艙'
    }
  },
  // 小型巴士
  {
    id: 'coaster',
    name: '豐田考斯特',
    nameJa: 'トヨタ コースター',
    nameEn: 'Toyota Coaster',
    category: 'minibus',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/coaster.jpg',
    capacity: {
      passengers: 21,
      maxPassengers: 24,
      luggage: 21
    },
    dimensions: {
      length: 6990,
      width: 2080,
      height: 2635
    },
    features: ['豪華座椅', '獨立空調', '車載麥克風', 'DVD播放', '冰箱'],
    suitableFor: ['企業團建', '觀光旅遊', '婚禮接送', '機場團體接送'],
    highlight: '日本最經典的小型觀光巴士，穩定性與舒適性兼備',
    seatLayout: {
      rows: [
        ['D', '—', '🚪'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', '—', 'P', 'P'],
        ['P', 'P', 'P', 'P', 'P']
      ],
      legend: '正座席21席 + 補助席3席'
    }
  },
  // 中型巴士
  {
    id: 'melpha',
    name: '日野梅爾法',
    nameJa: '日野 メルファ',
    nameEn: 'Hino Melpha',
    category: 'mediumbus',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/melpha.jpg',
    capacity: {
      passengers: 27,
      luggage: 27
    },
    dimensions: {
      length: 8990,
      width: 2340,
      height: 3120
    },
    features: ['底部大型行李艙', '豪華可調座椅', '獨立空調', '衛生間（部分）', '音響系統'],
    suitableFor: ['中型團隊旅遊', '會議接送', '跨城市移動', '企業考察'],
    highlight: '中型巴士無補助席設計，每位乘客都享有舒適正座席',
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
      legend: '正座席27席（無補助席）'
    }
  },
  // 大型巴士
  {
    id: 'selega',
    name: '日野賽雷加',
    nameJa: '日野 セレガ ハイデッカ',
    nameEn: 'Hino S\'elega High Decker',
    category: 'largebus',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/selega.jpg',
    capacity: {
      passengers: 45,
      maxPassengers: 53,
      luggage: 45
    },
    dimensions: {
      length: 11990,
      width: 2490,
      height: 3500
    },
    features: ['4輪電子控制懸架', 'PCS預碰撞安全系統', '駕駛員監控系統', 'LED間接照明', '全自動空調', '7速AMT變速箱'],
    suitableFor: ['大型團隊旅遊', '會展接送', '長途跨城', '企業大型活動'],
    highlight: '日野旗艦大型觀光巴士，搭載先進安全系統，最小轉彎半徑8.7m',
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
      legend: '正座席45席 + 補助席8席 = 53席'
    }
  },
  {
    id: 'aeroqueen',
    name: '三菱扶桑艾洛皇后',
    nameJa: '三菱ふそう エアロクィーン',
    nameEn: 'Mitsubishi Fuso Aero Queen',
    category: 'largebus',
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/aeroqueen.jpg',
    capacity: {
      passengers: 49,
      maxPassengers: 60,
      luggage: 49
    },
    dimensions: {
      length: 11990,
      width: 2490,
      height: 3650
    },
    features: ['超大行李艙', '高級真皮座椅', '雙區空調', '車載衛生間', '高清娛樂', '腳踏板'],
    suitableFor: ['VIP大型團隊', '高端企業考察', '國際會議接送', '長途豪華遊'],
    highlight: '三菱旗艦大巴，頂級豪華配置',
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
      legend: '正座席49席 + 補助席11席 = 60席'
    }
  }
];

// 座位圖組件
const SeatLayoutModal = ({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) => {
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
            <h3 className="font-bold text-lg text-gray-900">{vehicle.name}</h3>
            <p className="text-sm text-gray-500">座席配置圖</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-4">
            <div className="inline-block bg-gray-800 text-white text-xs px-4 py-1 rounded-full">
              車頭 ▲
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
                    content = '司';
                    title = '司機';
                  } else if (seat === 'P') {
                    bgColor = 'bg-orange-100 border border-orange-300';
                    textColor = 'text-orange-600';
                    content = String(rowIndex * row.filter(s => s === 'P').length + row.slice(0, seatIndex).filter(s => s === 'P').length + 1);
                    title = `座位 ${content}`;
                  } else if (seat === '🚪') {
                    bgColor = 'bg-green-100 border border-green-300';
                    textColor = 'text-green-600';
                    content = '門';
                    title = '車門';
                  } else if (seat === '—') {
                    bgColor = 'bg-transparent';
                    content = '';
                    title = '走道';
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
              車尾 ▼
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-blue-500 rounded"></span> 司機
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></span> 乘客座位
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-green-100 border border-green-300 rounded"></span> 車門
            </span>
          </div>

          {vehicle.seatLayout.legend && (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">{vehicle.seatLayout.legend}</p>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4">
          <p className="text-xs text-gray-400 text-center">
            * 座位配置可能因具體車輛略有不同，以實際車輛為準
          </p>
        </div>
      </div>
    </div>
  );
};

// 車輛卡片組件
const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const [showSeatLayout, setShowSeatLayout] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all group">
        <div className="relative h-56 overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
            <p className="text-gray-300 text-sm">{vehicle.nameJa}</p>
          </div>

          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
              {CATEGORY_LABELS[vehicle.category]}
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
              <p className="text-xs text-gray-500">乘客定員</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Luggage size={20} className="text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">{vehicle.capacity.luggage}</span>
              </div>
              <p className="text-xs text-gray-500">行李容量</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <Star size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-700">{vehicle.highlight}</p>
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
            {expanded ? '收起詳情' : '查看詳情'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expanded && (
            <div className="mt-4 pt-4 border-t space-y-4 animate-fade-in">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">車內配置</h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">適用場景</h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.suitableFor.map((use) => (
                    <span
                      key={use}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                    >
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
                查看座席配置圖
              </button>
            </div>
          )}
        </div>
      </div>

      {showSeatLayout && (
        <SeatLayoutModal vehicle={vehicle} onClose={() => setShowSeatLayout(false)} />
      )}
    </>
  );
};

export default function VehiclesPage() {
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('all');

  const filteredVehicles = selectedCategory === 'all'
    ? VEHICLES
    : VEHICLES.filter(v => v.category === selectedCategory);

  return (
    <PublicLayout showFooter={true} activeNav="vehicles">
      {/* Hero Section - 全新设计 */}
      <div className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-ebd3fee29dbf?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-orange-500/10 rounded-full filter blur-[100px] -top-20 -left-40"></div>
          <div className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full filter blur-[80px] bottom-0 right-20"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-5xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
              <Car size={16} className="text-orange-400" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Premium Vehicle Fleet</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              陸地頭等艙<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                為您的日本之旅保駕護航
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              從4人精英小團到60人大型企業考察，新島交通提供全系列日本正規綠牌營運車輛。
              每一位司機都經過嚴格篩選，為您帶來安全、舒適、尊貴的出行體驗。
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">6+</div>
                <div className="text-sm text-gray-400">車型選擇</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">4-60</div>
                <div className="text-sm text-gray-400">人數覆蓋</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">綠牌營運</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white">24h</div>
                <div className="text-sm text-gray-400">緊急支援</div>
              </div>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: BadgeCheck, text: '日本正規綠牌' },
                { icon: Shield, text: '全額商業保險' },
                { icon: Award, text: '專業持證司機' },
                { icon: Headphones, text: '中文客服支援' }
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

      {/* 服務理念區塊 - 新增 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <HeartHandshake size={16} />
              Our Philosophy
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              不只是交通工具<br/>
              <span className="text-orange-500">更是您旅途中的移動空間</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              我們深知，對於遠道而來的貴賓而言，車輛不僅是從A點到B點的工具，
              更是旅途中休息、交流、欣賞風景的重要空間。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: '舒適至上',
                desc: '每一輛車都經過精心挑選，確保座椅舒適、空間寬敞。長途行程也能保持最佳狀態，讓您抵達目的地時依然精神飽滿。',
                color: 'orange'
              },
              {
                icon: Shield,
                title: '安全第一',
                desc: '所有車輛定期保養檢修，司機持有正規營運資格並通過背景審查。我們為每一趟行程投保足額商業保險，讓您安心出行。',
                color: 'blue'
              },
              {
                icon: Clock,
                title: '準時守信',
                desc: '日本式的時間觀念深植於我們的服務DNA。提前抵達、絕不遲到，這是我們對每一位客戶的承諾，也是對專業的堅持。',
                color: 'green'
              }
            ].map(item => (
              <div key={item.title} className="group">
                <div className={`bg-${item.color}-50 rounded-2xl p-8 h-full border border-${item.color}-100 hover:shadow-xl transition-all`}>
                  <div className={`w-14 h-14 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} className={`text-${item.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 服務流程區塊 - 新增 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <FileCheck size={16} />
              Service Flow
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              輕鬆四步<br/>
              <span className="text-blue-600">即刻啟程</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: '需求溝通',
                desc: '告訴我們您的行程日期、人數和特殊需求',
                icon: Phone
              },
              {
                step: '02',
                title: '車型推薦',
                desc: '根據您的需求，我們推薦最適合的車型',
                icon: Car
              },
              {
                step: '03',
                title: '確認預約',
                desc: '確認報價後，支付訂金鎖定車輛',
                icon: CheckCircle
              },
              {
                step: '04',
                title: '安心出行',
                desc: '司機準時到達，開啟您的日本之旅',
                icon: MapPin
              }
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="text-5xl font-bold text-gray-100 mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <item.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
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
                {CATEGORY_LABELS[cat]}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">營運車輛一覽</h2>
            <p className="text-gray-500">全部為日本正規綠牌營運車輛，配備專業持證司機</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">暫無此類車型</p>
            </div>
          )}
        </div>
      </section>

      {/* 車型快速對比 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">車型快速對比</h2>
            <p className="text-gray-500">根據團隊人數選擇合適車型</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-l-lg">車型</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">定員</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">行李</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">車長</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-r-lg">推薦場景</th>
                </tr>
              </thead>
              <tbody>
                {VEHICLES.map((v, index) => (
                  <tr key={v.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{v.name}</p>
                        <p className="text-xs text-gray-400">{v.nameEn}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-orange-600">{v.capacity.passengers}</span>
                      {v.capacity.maxPassengers && (
                        <span className="text-gray-400 text-sm">~{v.capacity.maxPassengers}</span>
                      )}
                      <span className="text-gray-500 text-sm">名</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium text-gray-700">{v.capacity.luggage}</span>
                      <span className="text-gray-500 text-sm">件</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {(v.dimensions.length / 1000).toFixed(1)}m
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.suitableFor.slice(0, 2).map(s => (
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

      {/* 客戶承諾區塊 - 新增 */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Award size={16} className="text-orange-400" />
              Our Promise
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              <span className="text-orange-400">六大承諾</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              我們以最高標準要求自己，為每一位貴賓提供超越期待的服務體驗
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BadgeCheck, title: '100% 綠牌營運', desc: '所有車輛均為日本國土交通省核發的正規營運車輛，合法合規' },
              { icon: Shield, title: '全額商業保險', desc: '為每一趟行程投保足額商業保險，保障金額最高可達1億日元' },
              { icon: Users, title: '專業持證司機', desc: '司機均持有正規營運資格，經過嚴格背景審查和禮儀培訓' },
              { icon: Clock, title: '準時到達', desc: '提前15分鐘抵達約定地點，若因我方原因遲到，車費減免' },
              { icon: Headphones, title: '24小時支援', desc: '旅途中遇到任何問題，中文客服團隊全天候待命協助' },
              { icon: Star, title: '服務反饋機制', desc: '服務結束後收集反饋，針對服務問題提供改進方案或協商處理' }
            ].map(item => (
              <div key={item.title} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
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
              準備好開始您的日本之旅了嗎？
            </h2>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
              無論是機場接送、城市觀光還是跨城市移動，我們都能為您提供最合適的車輛和服務
            </p>
            <ContactButtons className="max-w-2xl mx-auto" />
          </div>
        </div>
      </section>

      {/* 隱藏滾動條的樣式 */}
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
