'use client';

import PublicLayout from '@/components/PublicLayout';
import OICIContent from './OICIContent';

export default function OICIPage() {
  return (
    <PublicLayout showFooter={true} activeNav="cancer">
      <OICIContent />
    </PublicLayout>
  );
}
