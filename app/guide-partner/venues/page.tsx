'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  Store,
  Calendar,
  Search,
  MapPin,
  Loader2,
  Wine,
  ChevronRight
} from 'lucide-react';

const translations = {
  pageTitle: {
    ja: 'ナイトクラブ一覧',
    'zh-CN': '夜总会列表',
    'zh-TW': '夜總會列表',
    en: 'Nightclub List',
  },
  heading: {
    ja: 'ナイトクラブ一覧',
    'zh-CN': '夜总会列表',
    'zh-TW': '夜總會列表',
    en: 'Nightclub List',
  },
  subtitle: {
    ja: 'お客様のためにナイトクラブを閲覧・予約',
    'zh-CN': '浏览并为客户预约夜总会',
    'zh-TW': '瀏覽並為客戶預約夜總會',
    en: 'Browse and book nightclubs for your clients',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  searchPlaceholder: {
    ja: '店舗名、ブランド、エリアで検索...',
    'zh-CN': '搜索店铺名称、品牌、地区...',
    'zh-TW': '搜尋店舖名稱、品牌、地區...',
    en: 'Search by venue name, brand, area...',
  },
  allFilter: {
    ja: 'すべて',
    'zh-CN': '全部',
    'zh-TW': '全部',
    en: 'All',
  },
  minSpend: {
    ja: '最低消費',
    'zh-CN': '最低消费',
    'zh-TW': '最低消費',
    en: 'Min. Spend',
  },
  avgSpend: {
    ja: '平均消費',
    'zh-CN': '平均消费',
    'zh-TW': '平均消費',
    en: 'Avg. Spend',
  },
  viewPriceDetails: {
    ja: '料金詳細を見る',
    'zh-CN': '查看价格详情',
    'zh-TW': '查看價格詳情',
    en: 'View Price Details',
  },
  bookVenue: {
    ja: 'このクラブを予約',
    'zh-CN': '预约此夜总会',
    'zh-TW': '預約此夜總會',
    en: 'Book This Nightclub',
  },
  noVenuesFound: {
    ja: 'ナイトクラブが見つかりません',
    'zh-CN': '没有找到夜总会',
    'zh-TW': '沒有找到夜總會',
    en: 'No Nightclubs Found',
  },
  tryOtherSearch: {
    ja: '他の検索条件をお試しください',
    'zh-CN': '请尝试其他搜索条件',
    'zh-TW': '請嘗試其他搜尋條件',
    en: 'Please try other search criteria',
  },
  venuesFound: {
    ja: '件のナイトクラブ',
    'zh-CN': '家夜总会',
    'zh-TW': '家夜總會',
    en: 'nightclubs found',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

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

const ALL_CITY = '__all__';
const CITIES = [ALL_CITY, '東京', '大阪', '名古屋', '福岡', '京都', '神戶'];

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(ALL_CITY);
  const router = useRouter();
  const supabase = createClient();
  const lang = useLanguage();

  useEffect(() => {
    checkAuthAndLoadVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [venues, searchTerm, selectedCity]);

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
        .eq('category', 'nightclub')
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

    if (selectedCity !== ALL_CITY) {
      filtered = filtered.filter(v => v.city === selectedCity);
    }

    setFilteredVenues(filtered);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nightclub': return <Wine className="w-5 h-5" />;
      default: return <Store className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nightclub': return 'bg-brand-100 text-brand-600';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">{t('loading', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold font-serif text-brand-900">{t('heading', lang)}</h1>
            <p className="text-neutral-500 mt-1">{t('subtitle', lang)}</p>
          </div>

          {/* Filters */}
          <div className="bg-white border p-4 mb-6">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder', lang)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* City Filter */}
            <div className="flex flex-wrap gap-2">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`
                    px-4 py-2 text-sm font-medium transition
                    ${selectedCity === city
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }
                  `}
                >
                  {city === ALL_CITY ? t('allFilter', lang) : city}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-neutral-500 mb-4">
            {filteredVenues.length} {t('venuesFound', lang)}
          </p>

          {/* Venues Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white border hover:border-brand-300 transition overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-brand-900">{venue.name}</h3>
                      {venue.name_ja && (
                        <p className="text-xs text-neutral-400">{venue.name_ja}</p>
                      )}
                    </div>
                    <div className={`p-2 ${getCategoryColor(venue.category)}`}>
                      {getCategoryIcon(venue.category)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <MapPin size={14} />
                    <span>{venue.city} · {venue.area}</span>
                  </div>

                  {venue.brand && (
                    <span className="inline-block mt-2 px-2 py-1 bg-neutral-100 text-xs text-neutral-600">
                      {venue.brand}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {venue.description && (
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{venue.description}</p>
                  )}

                  {venue.features && venue.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-brand-50 text-brand-600 text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-neutral-500">{t('minSpend', lang)}</span>
                      <p className="font-bold text-neutral-900">¥{venue.min_spend?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-500">{t('avgSpend', lang)}</span>
                      <p className="font-bold text-neutral-900">¥{venue.avg_spend?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="p-4 border-t bg-neutral-50 space-y-2">
                  <Link
                    href={`/guide-partner/venues/${venue.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 transition"
                  >
                    <ChevronRight size={18} />
                    {t('viewPriceDetails', lang)}
                  </Link>
                  <Link
                    href={`/guide-partner/bookings/new?venue=${venue.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 transition"
                  >
                    <Calendar size={18} />
                    {t('bookVenue', lang)}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredVenues.length === 0 && (
            <div className="bg-white border p-12 text-center">
              <Store className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="font-bold text-brand-900 mb-2">{t('noVenuesFound', lang)}</h3>
              <p className="text-neutral-500">{t('tryOtherSearch', lang)}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
