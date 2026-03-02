import { Metadata } from 'next';
import GinzaPhoenixContent from './GinzaPhoenixContent';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: '銀座鳳凰クリニック | がん免疫療法専門 - WT1樹状細胞ワクチン・NK細胞療法',
  description: '銀座鳳凰クリニックは、がん免疫療法を専門とする医療機関です。WT1樹状細胞ワクチン療法、NK細胞療法、NKT細胞療法など、最先端の免疫細胞治療を提供。秋葉原駅近く。',
  keywords: ['がん免疫療法', '樹状細胞ワクチン', 'NK細胞', 'NKT細胞', '銀座鳳凰クリニック', '秋葉原'],
  openGraph: {
    title: '銀座鳳凰クリニック | Ginza Phoenix Clinic',
    description: 'がん免疫療法専門クリニック。WT1樹状細胞ワクチン・NK細胞療法・NKT細胞療法。',
    type: 'website',
  },
};

export default function GinzaPhoenixPage() {
  return (
    <PublicLayout activeNav="cancer">
      <GinzaPhoenixContent />
    </PublicLayout>
  );
}
