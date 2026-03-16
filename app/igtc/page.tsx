import PublicLayout from '@/components/PublicLayout';
import IGTCContent from './IGTCContent';

export const metadata = {
  title: 'IGTクリニック - 血管内治療・温熱療法 | 新島交通',
  description: 'IGTクリニック（大阪泉佐野市）。がん血管内介入治療（IGT）とハイパーサーミア（温熱療法）の専門病院。20年以上の実績。関西空港すぐ。',
};

export default function IGTCPage() {
  return (
    <PublicLayout showFooter={true}>
      <IGTCContent />
    </PublicLayout>
  );
}
