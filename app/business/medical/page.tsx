'use client';

import React from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import MedicalTourismContent from './MedicalTourismContent';

export default function MedicalBusinessPage() {
  return (
    <CompanyLayout
      title={{ ja: '医療ツーリズム', 'zh-TW': '醫療旅遊', 'zh-CN': '医疗旅游', en: 'Medical Tourism' }}
      titleEn="Medical Tourism"
      breadcrumb={[
        { label: { ja: '事業領域', 'zh-TW': '事業領域', 'zh-CN': '业务领域', en: 'Business' }, path: '/business' },
        { label: { ja: '医療ツーリズム', 'zh-TW': '醫療旅遊', 'zh-CN': '医疗旅游', en: 'Medical Tourism' } }
      ]}
    >
      <MedicalTourismContent />
    </CompanyLayout>
  );
}
