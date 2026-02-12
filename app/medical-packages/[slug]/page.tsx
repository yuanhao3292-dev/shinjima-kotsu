'use client';

import { useParams } from 'next/navigation';
import CheckoutLayout from '@/components/CheckoutLayout';
import PackageDetailContent from './PackageDetailContent';

export default function PackageDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <CheckoutLayout>
      <PackageDetailContent packageSlug={slug} />
    </CheckoutLayout>
  );
}
