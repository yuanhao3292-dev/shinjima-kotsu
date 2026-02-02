'use client';

import PublicLayout from '@/components/PublicLayout';
import CancerTreatmentContent from './CancerTreatmentContent';

export default function CancerTreatmentPage() {
  return (
    <PublicLayout showFooter={true} activeNav="cancer">
      <CancerTreatmentContent />
    </PublicLayout>
  );
}
