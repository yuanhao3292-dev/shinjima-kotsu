'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import {
  Store,
  Calendar,
  Search,
  MapPin,
  Loader2,
  Wine,
  Stethoscope,
  Heart
} from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  name_ja: string;
  brand: string;
  city: string;
  area: string;
  category: string;
  min_spend: number;
  avg_spend: number;
  description: string;
  features: string[];
}

const CITIES = ['全部', '東京', '大阪', '名古屋', '福岡', '京都', '神戶'];
const CATEGORIES = [
  { value: 'all', label: '全部', icon: Store },
  { value: 'nightclub', label: '夜總會', icon: Wine },
  { value: 'medical', label: '醫療檢查', icon: Stethoscope },
  { value: 'treatment', label: '綜合治療', icon: Heart },
];

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuthAndLoadVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [venues, searchTerm, selectedCity, selectedCategory]);

  const checkAuthAndLoadVenues = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      // 驗證是否是已審核導遊
      const { data: guide } = await supabase
        .from('guides')
        .select('status')
        .eq('auth_user_id', user.id)
        .single();

      if (!guide || guide.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      // 載入店舖
      const { data: venuesData } = await supabase
        .from('venues')
        .select('*')
        .eq('is_active', true)
        .order('city', { ascending: true });

      setVenues(venuesData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVenues = () => {
    let filtered = [...venues];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(term) ||
        v.name_ja?.toLowerCase().includes(term) ||
        v.brand?.toLowerCase().includes(term) ||
        v.area?.toLowerCase().includes(term)
      );
    }

    if (selectedCity !== '全部') {
      filtered = filtered.filter(v => v.city === selectedCity);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    setFilteredVenues(filtered);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nightclub': return <Wine className="w-5 h-5" />;
      case 'medical': return <Stethoscope className="w-5 h-5" />;
      case 'treatment': return <Heart className="w-5 h-5" />;
      default: return <Store className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nightclub': return 'bg-purple-100 text-purple-600';
      case 'medical': return 'bg-blue-100 text-blue-600';
      case 'treatment': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle="店铺列表" />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">店舖列表</h1>
            <p className="text-gray-500 mt-1">瀏覽並為客戶預約服務</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border p-4 mb-6">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜尋店舖名稱、品牌、地區..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
                    ${selectedCategory === cat.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* City Filter */}
            <div className="flex flex-wrap gap-2">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition
                    ${selectedCity === city
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-500 mb-4">
            找到 {filteredVenues.length} 家店舖
          </p>

          {/* Venues Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-xl border hover:border-orange-300 hover:shadow-lg transition overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{venue.name}</h3>
                      {venue.name_ja && (
                        <p className="text-xs text-gray-400">{venue.name_ja}</p>
                      )}
                    </div>
                    <div className={`p-2 rounded-lg ${getCategoryColor(venue.category)}`}>
                      {getCategoryIcon(venue.category)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>{venue.city} · {venue.area}</span>
                  </div>

                  {venue.brand && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {venue.brand}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {venue.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{venue.description}</p>
                  )}

                  {venue.features && venue.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500">最低消費</span>
                      <p className="font-bold text-gray-900">¥{venue.min_spend?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500">平均消費</span>
                      <p className="font-bold text-gray-900">¥{venue.avg_spend?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="p-4 border-t bg-gray-50 space-y-2">
                  <Link
                    href={`/guide-partner/venues/${venue.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition"
                  >
                    <ChevronRight size={18} />
                    查看價格詳情
                  </Link>
                  <Link
                    href={`/guide-partner/bookings/new?venue=${venue.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition"
                  >
                    <Calendar size={18} />
                    預約此店舖
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredVenues.length === 0 && (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">沒有找到店舖</h3>
              <p className="text-gray-500">請嘗試其他搜尋條件</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
