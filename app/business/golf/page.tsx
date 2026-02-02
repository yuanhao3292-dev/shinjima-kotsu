'use client';

import React, { useMemo } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { ROUTES } from '@/lib/constants/routes';
import GolfContent from './GolfContent';

/**
 * 名门高尔夫旅游页面
 *
 * 功能：
 * - 展示高尔夫旅游服务特色
 * - 多语言支持（日语、简体中文、繁体中文、英语）
 * - SEO 优化
 * - 无障碍访问支持
 */
export default function GolfBusinessPage() {
  const { t } = useTranslations('business.golf');

  const breadcrumb = useMemo(() => [
    {
      label: { ja: '事業領域', 'zh-TW': '事業領域', 'zh-CN': '业务领域', en: 'Business' },
      path: ROUTES.BUSINESS,
    },
    {
      label: { ja: 'ゴルフツーリズム', 'zh-TW': '高爾夫旅遊', 'zh-CN': '高尔夫旅游', en: 'Golf Tourism' },
    },
  ], []);

  return (
    <CompanyLayout
      title={{ ja: 'ゴルフツーリズム', 'zh-TW': '高爾夫旅遊', 'zh-CN': '高尔夫旅游', en: 'Golf Tourism' }}
      titleEn={t('titleEn')}
      breadcrumb={breadcrumb}
    >
      <GolfContent />
    </CompanyLayout>
  );
}
