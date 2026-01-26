'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import PublicLayout from '@/components/PublicLayout';
import ContactButtons from '@/components/ContactButtons';
import VehicleCard from './components/VehicleCard';
import {
  Car,
  Shield,
  Star,
  HeartHandshake,
  Award,
  Sparkles,
  Clock,
  Phone,
  CheckCircle,
  MapPin,
  Headphones,
  FileCheck,
  BadgeCheck,
  ArrowRight,
  Users,
  Luggage,
} from 'lucide-react';

import VEHICLES_DATA from './data/vehicles.json';
import { pageTranslations, CATEGORY_LABELS } from './data/translations';
import type { Language, VehicleCategory, Vehicle } from './types/vehicle';

// Type assertion for imported JSON data
const VEHICLES = VEHICLES_DATA as Vehicle[];

export default function VehiclesPage() {
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('all');
  const [currentLang, setCurrentLang] = useState<Language>('ja');
  const [isLoading, setIsLoading] = useState(true);

  // Language detection with better logic
  useEffect(() => {
    const detectLanguage = () => {
      // Check cookie first
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
          return value as Language;
        }
      }

      // Fallback to browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('ja')) return 'ja';
      if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') return 'zh-TW';
      if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) return 'zh-CN';
      if (browserLang.startsWith('en')) return 'en';

      return 'ja'; // Default
    };

    setCurrentLang(detectLanguage());
    setIsLoading(false);
  }, []);

  // Translation helper with memoization
  const t = useCallback((key: string): string => {
    return pageTranslations[key]?.[currentLang] || key;
  }, [currentLang]);

  // Filter vehicles by category with memoization
  const filteredVehicles = useMemo(() => {
    return selectedCategory === 'all'
      ? VEHICLES
      : VEHICLES.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

  // Category change handler
  const handleCategoryChange = useCallback((category: VehicleCategory) => {
    setSelectedCategory(category);
  }, []);

  // Philosophy section color classes (fixed Tailwind issue)
  const philosophyItems = useMemo(() => [
    {
      icon: Sparkles,
      titleKey: 'comfortTitle' as const,
      descKey: 'comfortDesc' as const,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: Shield,
      titleKey: 'safetyTitle' as const,
      descKey: 'safetyDesc' as const,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Clock,
      titleKey: 'punctualTitle' as const,
      descKey: 'punctualDesc' as const,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    }
  ], []);

  // Service flow steps
  const serviceFlowSteps = useMemo(() => [
    { step: '01', titleKey: 'flowStep1Title' as const, descKey: 'flowStep1Desc' as const, icon: Phone },
    { step: '02', titleKey: 'flowStep2Title' as const, descKey: 'flowStep2Desc' as const, icon: Car },
    { step: '03', titleKey: 'flowStep3Title' as const, descKey: 'flowStep3Desc' as const, icon: CheckCircle },
    { step: '04', titleKey: 'flowStep4Title' as const, descKey: 'flowStep4Desc' as const, icon: MapPin }
  ], []);

  // Promise items
  const promiseItems = useMemo(() => [
    { icon: BadgeCheck, titleKey: 'promise1Title' as const, descKey: 'promise1Desc' as const },
    { icon: Shield, titleKey: 'promise2Title' as const, descKey: 'promise2Desc' as const },
    { icon: Users, titleKey: 'promise3Title' as const, descKey: 'promise3Desc' as const },
    { icon: Clock, titleKey: 'promise4Title' as const, descKey: 'promise4Desc' as const },
    { icon: Headphones, titleKey: 'promise5Title' as const, descKey: 'promise5Desc' as const },
    { icon: Star, titleKey: 'promise6Title' as const, descKey: 'promise6Desc' as const }
  ], []);

  if (isLoading) {
    return (
      <PublicLayout showFooter={true} activeNav="vehicles">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-500">{t('loading')}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout showFooter={true} activeNav="vehicles">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden" aria-labelledby="hero-title">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-ebd3fee29dbf?q=80&w=2070&auto=format&fit=crop')` }}
          role="img"
          aria-label="Professional tour bus on highway"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute w-[600px] h-[600px] bg-orange-500/10 rounded-full filter blur-[100px] -top-20 -left-40"></div>
          <div className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full filter blur-[80px] bottom-0 right-20"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
              <Car size={16} className="text-orange-400" aria-hidden="true" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Premium Vehicle Fleet</span>
            </div>

            <h1 id="hero-title" className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {t('heroTitle1')}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                {t('heroTitle2')}
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              {t('heroDesc')}
            </p>

            <div className="flex flex-wrap gap-6 mb-8" role="list">
              {[
                { value: '6+', label: t('statVehicles') },
                { value: '4-60', label: t('statCapacity') },
                { value: '100%', label: t('statLicense') },
                { value: '24h', label: t('statSupport') }
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/20" role="listitem">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3" role="list">
              {[
                { icon: BadgeCheck, text: t('trustGreenPlate') },
                { icon: Shield, text: t('trustInsurance') },
                { icon: Award, text: t('trustDriver') },
                { icon: Headphones, text: t('trustSupport') }
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 border border-white/10" role="listitem">
                  <item.icon size={16} className="text-green-400" aria-hidden="true" />
                  <span className="text-sm text-white/90">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-20 z-30 bg-white border-b shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 py-4 overflow-x-auto hide-scrollbar" aria-label="Vehicle category filter">
            {(Object.keys(CATEGORY_LABELS) as VehicleCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-current={selectedCategory === cat ? 'true' : undefined}
              >
                {CATEGORY_LABELS[cat][currentLang]}
                <span className="ml-1 text-xs opacity-70">
                  ({cat === 'all' ? VEHICLES.length : VEHICLES.filter(v => v.category === cat).length})
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Vehicle Grid */}
      <section className="py-12 bg-gray-50" aria-labelledby="vehicle-grid-title">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 id="vehicle-grid-title" className="text-2xl font-bold text-gray-900 mb-2">{t('gridTitle')}</h2>
            <p className="text-gray-500">{t('gridDesc')}</p>
          </div>

          {filteredVehicles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} lang={currentLang} t={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('noVehicles')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white" aria-labelledby="comparison-title">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 id="comparison-title" className="text-2xl font-bold text-gray-900 mb-2">{t('compareTitle')}</h2>
            <p className="text-gray-500">{t('compareDesc')}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-l-lg">{t('thModel')}</th>
                  <th scope="col" className="px-4 py-3 text-center text-sm font-bold text-gray-700">{t('thCapacity')}</th>
                  <th scope="col" className="px-4 py-3 text-center text-sm font-bold text-gray-700">{t('thLuggage')}</th>
                  <th scope="col" className="px-4 py-3 text-center text-sm font-bold text-gray-700">{t('thLength')}</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-r-lg">{t('thScenario')}</th>
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
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" aria-labelledby="promises-title">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Award size={16} className="text-orange-400" aria-hidden="true" />
              Our Promise
            </div>
            <h2 id="promises-title" className="text-3xl md:text-4xl font-serif font-bold mb-4">
              <span className="text-orange-400">{t('promiseTitle')}</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('promiseDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promiseItems.map(item => (
              <div key={item.titleKey} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-orange-400" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white" aria-labelledby="cta-title">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-title" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
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
      `}</style>
    </PublicLayout>
  );
}
