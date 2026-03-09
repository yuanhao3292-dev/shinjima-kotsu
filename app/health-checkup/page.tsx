'use client';

import MemberLayout from '@/components/MemberLayout';
import TIMCContent from '@/app/guide-partner/product-center/timc/TIMCContent';

export default function HealthCheckupPage() {
  return (
    <MemberLayout showFooter={false}>
      <TIMCContent />
    </MemberLayout>
  );
}
