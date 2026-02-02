'use client';

import PublicLayout from '@/components/PublicLayout';
import VehiclesContent from './VehiclesContent';

export default function VehiclesPage() {
  return (
    <PublicLayout showFooter={true} activeNav="vehicles">
      <VehiclesContent />
    </PublicLayout>
  );
}
