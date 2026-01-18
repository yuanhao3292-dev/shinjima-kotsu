'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
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
  Ruler
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
    // 自定義圖片 - 從 Supabase Storage 獲取
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
    // 自定義圖片 - 從 Supabase Storage 獲取
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
    // 自定義圖片 - 從 Supabase Storage 獲取
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
    // 自定義圖片 - 從 Supabase Storage 獲取
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
    // 自定義圖片 - 從 Supabase Storage 獲取
    image: 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/selega.jpg',
    capacity: {
      passengers: 45,
      maxPassengers: 53,
      luggage: 45
    },
    dimensions: {
      length: 11990,  // 官方規格: 12m車
      width: 2490,
      height: 3500    // 官方規格: 3.5m
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
    // 自定義圖片 - 從 Supabase Storage 獲取
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

// 座位圖組件 - 參考日本バス会社的座席表設計
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
        {/* Header */}
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

        {/* Seat Layout */}
        <div className="p-6">
          {/* 車頭標示 */}
          <div className="text-center mb-4">
            <div className="inline-block bg-gray-800 text-white text-xs px-4 py-1 rounded-full">
              車頭 ▲
            </div>
          </div>

          {/* 座席圖 */}
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

          {/* 車尾標示 */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gray-300 text-gray-600 text-xs px-4 py-1 rounded-full">
              車尾 ▼
            </div>
          </div>

          {/* 圖例 */}
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

          {/* 說明 */}
          {vehicle.seatLayout.legend && (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">{vehicle.seatLayout.legend}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <p className="text-xs text-gray-400 text-center">
            * 座位配置可能因具體車輛略有不同，以實際車輛為準
          </p>
        </div>
      </div>
    </div>
  );
};

// 車輛卡片組件 - 參考 hiretaxijapan.com 的設計
const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const [showSeatLayout, setShowSeatLayout] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all group">
        {/* 車輛圖片 */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* 車型名稱 */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
            <p className="text-gray-300 text-sm">{vehicle.nameJa}</p>
          </div>

          {/* 類別標籤 */}
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
              {CATEGORY_LABELS[vehicle.category]}
            </span>
          </div>
        </div>

        {/* 核心信息 - 參考 CAB STATION 的圖標+數字設計 */}
        <div className="p-5">
          {/* 容量信息 - 醒目展示 */}
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

          {/* 亮點 */}
          <div className="flex items-start gap-2 mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <Star size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-700">{vehicle.highlight}</p>
          </div>

          {/* 車輛尺寸 - 簡潔顯示 */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Ruler size={14} className="text-gray-400" />
            <span>
              {(vehicle.dimensions.length / 1000).toFixed(1)}m × {(vehicle.dimensions.width / 1000).toFixed(2)}m × {(vehicle.dimensions.height / 1000).toFixed(2)}m
            </span>
          </div>

          {/* 展開/收起詳情 */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            {expanded ? '收起詳情' : '查看詳情'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* 展開內容 */}
          {expanded && (
            <div className="mt-4 pt-4 border-t space-y-4 animate-fade-in">
              {/* 車內配置 */}
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

              {/* 適用場景 */}
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

              {/* 查看座席圖按鈕 */}
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

      {/* 座席圖彈窗 */}
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
      {/* Hero Section */}
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-ebd3fee29dbf?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70"></div>
        </div>

        {/* Decorative */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
          <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
              <Car size={16} className="text-orange-400" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Vehicle Fleet</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              營運車輛一覽
            </h1>
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300 font-bold mb-4">
              全部為日本正規綠牌營運車輛
            </p>

            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              從4人小團到60人大團，新島交通提供全系列營運車型，所有司機持有正規營運資格
            </p>

            {/* Trust Points */}
            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm">綠牌營運車</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm">專業司機</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm">全額保險</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs - 參考 CAB STATION 的分類篩選 */}
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

      {/* 快速參考表 - 參考日本バスなび的規格對比 */}
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

      {/* Safety Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">安全與品質保障</h2>
            <p className="text-gray-400">新島交通的每一輛車都經過嚴格把關</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: '綠牌營運', desc: '日本正規營運牌照' },
              { icon: Users, title: '專業司機', desc: '經驗豐富持證上崗' },
              { icon: Car, title: '定期保養', desc: '確保最佳運行狀態' },
              { icon: Star, title: '全額保險', desc: '商業保險全面保障' }
            ].map(item => (
              <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-5 text-center border border-white/20">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">需要預約車輛？</h2>
          <p className="text-gray-500 mb-6">聯繫我們獲取詳細報價</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition shadow"
            >
              聯繫我們
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
            >
              <ArrowLeft size={16} />
              返回首頁
            </Link>
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
