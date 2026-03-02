import { getSaiClinicImages } from '@/lib/services/sai-clinic-images';
import SaiClinicContent from './SaiClinicContent';
import PublicLayout from '@/components/PublicLayout';

export const dynamic = 'force-dynamic';

export default async function SaiClinicPage() {
  const images = await getSaiClinicImages();

  return (
    <PublicLayout>
      <SaiClinicContent images={images} />
    </PublicLayout>
  );
}
