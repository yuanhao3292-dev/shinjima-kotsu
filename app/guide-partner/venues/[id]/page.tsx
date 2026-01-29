'use client';

import { useState, useEffect, use, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import {
  generatePricingText,
  localeDisplayNames,
  localeFlags,
  type PricingLocale
} from '@/lib/utils/venue-pricing-i18n';
import {
  LayoutDashboard,
  Store,
  Calendar,
  Wallet,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  MapPin,
  Clock,
  Globe,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  Phone,
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
  business_hours: string | null;
  closed_days: string | null;
  service_charge: string | null;
  website: string | null;
  pricing_info: Record<string, unknown> | null;
  phone: string | null;
}

const LOCALES: PricingLocale[] = ['ja', 'zh-TW', 'zh-CN', 'en'];

export default function VenueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<PricingLocale>('zh-TW');
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const checkAuthAndLoadVenue = useCallback(async () => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: guide } = await supabase
        .from('guides')
        .select('status')
        .eq('auth_user_id', user.id)
        .single();

      if (!guide || guide.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();

      if (venueError || !venueData) {
        setError('店舖不存在或已下架');
        return;
      }

      setVenue(venueData as Venue);
    } catch (err) {
      console.error('Error:', err);
      setError('載入失敗，請稍後重試');
    } finally {
      setLoading(false);
    }
  }, [id, router, supabase]);

  useEffect(() => {
    checkAuthAndLoadVenue();
  }, [checkAuthAndLoadVenue]);

  const handleCopy = async () => {
    if (!venue) return;

    const text = generatePricingText(venue, selectedLocale);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner');
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">無法載入</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link
            href="/guide-partner/venues"
            className="inline-flex items-center gap-2 text-orange-600 hover:underline"
          >
            <ArrowLeft size={18} />
            返回店舖列表
          </Link>
        </div>
      </div>
    );
  }

  if (!venue) {
    return null;
  }

  const navItems = [
    { icon: LayoutDashboard, label: '控制台', href: '/guide-partner/dashboard' },
    { icon: Store, label: '店舖列表', href: '/guide-partner/venues', active: true },
    { icon: Calendar, label: '我的預約', href: '/guide-partner/bookings' },
    { icon: Wallet, label: '報酬結算', href: '/guide-partner/commission' },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals' },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings' },
  ];

  const pricingText = useMemo(
    () => generatePricingText(venue, selectedLocale),
    [venue, selectedLocale]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/guide-partner/venues" className="p-2 -ml-2">
            <ArrowLeft size={20} />
          </Link>
          <span className="font-bold truncate">{venue.name}</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-40 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <Logo className="w-8 h-8 text-orange-600" />
          <div>
            <span className="font-bold text-gray-900">NIIJIMA</span>
            <p className="text-xs text-gray-500">Guide Partner</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${item.active
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>退出登入</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Back Button (Desktop) */}
          <Link
            href="/guide-partner/venues"
            className="hidden lg:inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={18} />
            返回店舖列表
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Venue Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{venue.name}</h1>
                    {venue.name_ja && (
                      <p className="text-sm text-gray-400">{venue.name_ja}</p>
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${getCategoryColor(venue.category)}`}>
                    {getCategoryIcon(venue.category)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{venue.city} · {venue.area}</span>
                  </div>

                  {venue.business_hours && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">{venue.business_hours}</span>
                    </div>
                  )}

                  {venue.closed_days && (
                    <div className="flex items-center gap-3 text-sm">
                      <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">休: {venue.closed_days}</span>
                    </div>
                  )}

                  {venue.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">{venue.phone}</span>
                    </div>
                  )}

                  {venue.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:underline flex items-center gap-1"
                      >
                        官網 <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {venue.brand && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {venue.brand}
                    </span>
                  </div>
                )}

                {venue.features && venue.features.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">特色</p>
                    <div className="flex flex-wrap gap-1">
                      {venue.features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {venue.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">{venue.description}</p>
                  </div>
                )}
              </div>

              {/* Price Summary Card */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-4">消費參考</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">最低消費</p>
                    <p className="text-lg font-bold text-gray-900">¥{venue.min_spend?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">平均消費</p>
                    <p className="text-lg font-bold text-gray-900">¥{venue.avg_spend?.toLocaleString()}</p>
                  </div>
                </div>
                {venue.service_charge && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">服務費</p>
                    <p className="font-medium text-gray-900">{venue.service_charge}</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Link
                href={`/guide-partner/bookings/new?venue=${venue.id}`}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition"
              >
                <Calendar size={20} />
                預約此店舖
              </Link>
            </div>

            {/* Right Column - Pricing Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border overflow-hidden">
                {/* Language Selector */}
                <div className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">詳細價格表</h2>
                    <div className="flex gap-1">
                      {LOCALES.map((locale) => (
                        <button
                          key={locale}
                          onClick={() => setSelectedLocale(locale)}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition
                            ${selectedLocale === locale
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                          `}
                        >
                          {localeFlags[locale]} {localeDisplayNames[locale]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    選擇語言後點擊「複製」即可發送給客人
                  </p>
                </div>

                {/* Copy Button */}
                <div className="border-b p-4 bg-gray-50">
                  <button
                    onClick={handleCopy}
                    className={`
                      w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition
                      ${copied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                      }
                    `}
                  >
                    {copied ? (
                      <>
                        <Check size={20} />
                        已複製！可貼上發送給客人
                      </>
                    ) : (
                      <>
                        <Copy size={20} />
                        複製 {localeDisplayNames[selectedLocale]} 價格表
                      </>
                    )}
                  </button>
                </div>

                {/* Pricing Text Display */}
                <div className="p-6">
                  {venue.pricing_info ? (
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      {pricingText}
                    </pre>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>此店舖尚未設置詳細價格</p>
                      <p className="text-sm mt-1">請聯繫管理員更新價格資訊</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
