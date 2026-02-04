'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { ROUTES } from '@/lib/constants/routes';
import type { WhitelabelModuleProps } from '@/components/whitelabel-modules/types';
import WhitelabelContactSection from '@/components/whitelabel-modules/WhitelabelContactSection';

interface StatItem {
  value: string;
  label: string;
  ariaLabel: string;
}

interface ServiceItem {
  id: string;
  title: string;
  features: string[];
}

interface GolfContentProps {
  whitelabel?: WhitelabelModuleProps;
}

export default function GolfContent({ whitelabel }: GolfContentProps) {
  const { t } = useTranslations('business.golf');
  const bc = whitelabel?.brandColor;

  const stats: StatItem[] = useMemo(() => [
    { value: '20+', label: t('stats.courses'), ariaLabel: `${t('stats.courses')}: 20以上` },
    { value: 'VIP', label: t('stats.vip'), ariaLabel: `${t('stats.vip')}: VIP` },
    { value: '1,000+', label: t('stats.users'), ariaLabel: `${t('stats.users')}: 1,000人以上` },
    { value: '98%+', label: t('stats.booking'), ariaLabel: `${t('stats.booking')}: 98%以上` },
  ], [t]);

  const services: ServiceItem[] = useMemo(() => [
    { id: 'course', title: t('features.course.title'), features: t('features.course.items') as string[] },
    { id: 'vip', title: t('features.vip.title'), features: t('features.vip.items') as string[] },
    { id: 'transfer', title: t('features.transfer.title'), features: t('features.transfer.items') as string[] },
    { id: 'language', title: t('features.language.title'), features: t('features.language.items') as string[] },
  ], [t]);

  return (
    <div className="space-y-12">
      {/* 介绍文本 */}
      <section aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="sr-only">{t('title')}</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t('intro')}
        </p>
      </section>

      {/* 统计数据 */}
      <section aria-labelledby="stats-heading" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <h2 id="stats-heading" className="sr-only">服务数据统计</h2>
        {stats.map((stat) => (
          <div
            key={stat.value}
            role="figure"
            aria-label={stat.ariaLabel}
            className={`p-4 rounded-xl text-center ${!bc ? 'bg-green-50' : ''}`}
            style={bc ? { backgroundColor: `${bc}15` } : undefined}
          >
            <div
              className={`text-2xl font-bold ${!bc ? 'text-green-600' : ''}`}
              style={bc ? { color: bc } : undefined}
              aria-hidden="true"
            >
              {stat.value}
            </div>
            <div className="text-sm text-gray-600" aria-hidden="true">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* 服务特色 */}
      <section aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className={`text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 ${!bc ? 'border-green-600' : ''}`}
          style={bc ? { borderColor: bc } : undefined}
        >
          {t('features.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="p-5 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3">{service.title}</h3>
              <ul className="space-y-2" role="list">
                {service.features.map((feature, index) => (
                  <li
                    key={`${service.id}-${index}`}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle2
                      size={14}
                      className={`flex-shrink-0 ${!bc ? 'text-green-600' : ''}`}
                      style={bc ? { color: bc } : undefined}
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {whitelabel && whitelabel.showContact !== false ? (
        <WhitelabelContactSection
          brandColor={whitelabel.brandColor}
          brandName={whitelabel.brandName}
          contactInfo={whitelabel.contactInfo}
        />
      ) : !whitelabel ? (
        <section
          aria-labelledby="cta-heading"
          className="text-center py-8 bg-green-50 rounded-2xl"
        >
          <h3 id="cta-heading" className="text-xl font-bold text-gray-900 mb-4">
            {t('cta.title')}
          </h3>
          <Link
            href={ROUTES.GOLF_INQUIRY}
            aria-label={`${t('cta.title')} - ${t('cta.button')}`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition"
          >
            <span>{t('cta.button')}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      ) : null}
    </div>
  );
}
