'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Users,
  Luggage,
  Star,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Ruler,
} from 'lucide-react';
import SeatLayoutModal from './SeatLayoutModal';
import { CATEGORY_LABELS } from '../data/translations';
import type { Vehicle, Language } from '../types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  lang: Language;
  t: (key: string) => string;
}

export default function VehicleCard({ vehicle, lang, t }: VehicleCardProps) {
  const [showSeatLayout, setShowSeatLayout] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleToggleExpand = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const handleShowSeatLayout = useCallback(() => {
    setShowSeatLayout(true);
  }, []);

  const handleCloseSeatLayout = useCallback(() => {
    setShowSeatLayout(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <>
      <article
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all group"
        aria-labelledby={`vehicle-${vehicle.id}-title`}
      >
        <div className="relative h-56 overflow-hidden bg-gray-200">
          {!imageError ? (
            <Image
              src={vehicle.image}
              alt={`${vehicle.name[lang]} - ${CATEGORY_LABELS[vehicle.category][lang]}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={handleImageError}
              priority={vehicle.id === 'alphard'} // Load first vehicle with priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <p className="text-gray-500 text-sm">{t('imageError')}</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 id={`vehicle-${vehicle.id}-title`} className="text-xl font-bold text-white">
              {vehicle.name[lang]}
            </h3>
            <p className="text-gray-300 text-sm">
              {vehicle.name.en !== vehicle.name[lang] ? vehicle.name.en : vehicle.name.ja}
            </p>
          </div>

          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
              {CATEGORY_LABELS[vehicle.category][lang]}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-around mb-5 py-4 bg-gray-50 rounded-xl" role="list">
            <div className="text-center" role="listitem">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users size={20} className="text-orange-500" aria-hidden="true" />
                <span className="text-2xl font-bold text-gray-900">
                  {vehicle.capacity.passengers}
                  {vehicle.capacity.maxPassengers && (
                    <span className="text-sm font-normal text-gray-400">~{vehicle.capacity.maxPassengers}</span>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500">{t('passengers')}</p>
            </div>
            <div className="w-px h-10 bg-gray-200" aria-hidden="true"></div>
            <div className="text-center" role="listitem">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Luggage size={20} className="text-blue-500" aria-hidden="true" />
                <span className="text-2xl font-bold text-gray-900">{vehicle.capacity.luggage}</span>
              </div>
              <p className="text-xs text-gray-500">{t('luggageCapacity')}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <Star size={14} className="text-orange-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-orange-700">{vehicle.highlight[lang]}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Ruler size={14} className="text-gray-400" aria-hidden="true" />
            <span>
              {(vehicle.dimensions.length / 1000).toFixed(1)}m × {(vehicle.dimensions.width / 1000).toFixed(2)}m × {(vehicle.dimensions.height / 1000).toFixed(2)}m
            </span>
          </div>

          <button
            onClick={handleToggleExpand}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
            aria-expanded={expanded}
            aria-controls={`vehicle-${vehicle.id}-details`}
          >
            {expanded ? t('collapseDetails') : t('expandDetails')}
            {expanded ? (
              <ChevronUp size={16} aria-hidden="true" />
            ) : (
              <ChevronDown size={16} aria-hidden="true" />
            )}
          </button>

          {expanded && (
            <div
              id={`vehicle-${vehicle.id}-details`}
              className="mt-4 pt-4 border-t space-y-4 animate-fade-in"
            >
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">{t('interiorConfig')}</h4>
                <div className="flex flex-wrap gap-2" role="list">
                  {vehicle.features[lang].map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      role="listitem"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">{t('suitableScenarios')}</h4>
                <div className="flex flex-wrap gap-2" role="list">
                  {vehicle.suitableFor[lang].map((use) => (
                    <span
                      key={use}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                      role="listitem"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleShowSeatLayout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <Maximize2 size={16} aria-hidden="true" />
                {t('viewSeatLayout')}
              </button>
            </div>
          )}
        </div>
      </article>

      {showSeatLayout && (
        <SeatLayoutModal
          vehicle={vehicle}
          lang={lang}
          t={t}
          onClose={handleCloseSeatLayout}
        />
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
