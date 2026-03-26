import type { Metadata } from 'next';
import PublicLayout from '@/components/PublicLayout';
import OsakaHimakContent from './OsakaHimakContent';

export const metadata: Metadata = {
  title: '大阪重粒子線センター - 重粒子線がん治療 | 大阪',
  description: 'Osaka Heavy Ion Therapy Center - 関西初の重粒子線がん治療施設。切らない・痛くない・体に優しい先進的ながん治療。世界最小型の装置で短期集中治療を実現。公益財団法人大阪国際がん治療財団運営。',
};

export default function OsakaHimakPage() {
  return (
    <PublicLayout showFooter={true}>
      <OsakaHimakContent />
    </PublicLayout>
  );
}
