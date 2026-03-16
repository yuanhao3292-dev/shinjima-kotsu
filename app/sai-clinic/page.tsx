import { getSaiClinicImages } from '@/lib/services/sai-clinic-images';
import PublicLayout from '@/components/PublicLayout';
import SaiClinicContent from './SaiClinicContent';

export const dynamic = 'force-dynamic';

export default async function SaiClinicPage() {
  const images = await getSaiClinicImages();

  return (
    <PublicLayout showFooter={true}>
      <SaiClinicContent images={images} />
    </PublicLayout>
  );
}
