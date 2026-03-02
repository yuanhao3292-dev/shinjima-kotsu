import { Metadata } from 'next';
import CellMedicineContent from './CellMedicineContent';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: '先端細胞医療 | Cell-Medicine 自己がんワクチン × iPeace iPS細胞バンキング',
  description: '兵庫医科大学拠点の先端細胞医療。Cell-Medicine自己がんワクチン療法（累計4,000例以上）とiPeace iPS細胞バンキングサービスを提供。理化学研究所・筑波大学発ベンチャー技術。',
  keywords: ['自己がんワクチン', 'Cell-Medicine', 'iPS細胞', 'iPeace', '兵庫医科大学', '免疫療法', '再生医療'],
  openGraph: {
    title: '先端細胞医療センター | Advanced Cell Medicine',
    description: '自己がんワクチン療法 × iPS細胞バンキング。兵庫医科大学拠点。',
    type: 'website',
  },
};

export default function CellMedicinePage() {
  return (
    <PublicLayout activeNav="cancer">
      <CellMedicineContent />
    </PublicLayout>
  );
}
