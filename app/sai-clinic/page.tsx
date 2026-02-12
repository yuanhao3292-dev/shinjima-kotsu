import { getSaiClinicImages } from '@/lib/services/sai-clinic-images';
import SaiClinicContent from './SaiClinicContent';

export const dynamic = 'force-dynamic';

export default async function SaiClinicPage() {
  const images = await getSaiClinicImages();

  return (
    <div className="min-h-screen bg-white">
      <SaiClinicContent images={images} />
    </div>
  );
}
