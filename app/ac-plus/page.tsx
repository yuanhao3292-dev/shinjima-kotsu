import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';
import ACPlusContent from './ACPlusContent';

export const metadata: Metadata = {
  title: 'ACセルクリニック - 再生医療・幹細胞治療 | 大阪',
  description: 'AC Cell Clinic - 大阪の再生医療専門クリニック。自家脂肪由来幹細胞治療、NK細胞療法、幹細胞培養上清液、ACRS療法、血液浄化。京都大学・大阪大学と連携。30,000名以上の治療実績。',
};

export default function ACPlusPage() {
  return (
    <PublicLayout showFooter={true}>
      <ACPlusContent />
    </PublicLayout>
  );
}
