import { Metadata } from 'next';
import HeleneClinicContent from './HeleneClinicContent';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: '表参道ヘレネクリニック | 日本初の合法幹細胞治療専門機関',
  description: '表参道ヘレネクリニックは厚生労働省認可の幹細胞治療専門機関。独自3D培養技術で22.5億個のMSCを培養。16,000名以上の治療実績。ケンブリッジ大学教授監修。',
  keywords: ['表参道ヘレネクリニック', 'HELENE CLINIC', '幹細胞治療', '再生医療', 'MSC', 'エクソソーム', '東京', '表参道'],
  openGraph: {
    title: '表参道ヘレネクリニック | HELENE CLINIC',
    description: '日本初の合法幹細胞治療専門機関。16,000名以上の治療実績。厚生労働省認可。',
    type: 'website',
  },
};

export default function HeleneClinicPage() {
  return (
    <PublicLayout activeNav="cancer">
      <HeleneClinicContent />
    </PublicLayout>
  );
}
