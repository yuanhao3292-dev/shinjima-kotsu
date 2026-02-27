import { Metadata } from 'next';
import WClinicMensContent from './WClinicMensContent';

export const metadata: Metadata = {
  title: 'W CLINIC men\'s 梅田院 | ED·男性更年期·AGA·男性美容',
  description: '大阪梅田のメンズ専門クリニック。植村天受教授（日本泌尿科学会認定専門医）がED、男性更年期(LOH)、AGA、男性美容を総合的に診療。全予約制・完全個室。',
  keywords: ['ED', '男性更年期', 'AGA', '男性美容', 'W CLINIC', '梅田', '植村天受'],
  openGraph: {
    title: 'W CLINIC men\'s 梅田院 | W CLINIC Men\'s Umeda',
    description: 'メンズ専門クリニック。ED・男性更年期(LOH)・AGA・男性美容を総合的に診療。',
    type: 'website',
  },
};

export default function WClinicMensPage() {
  return <WClinicMensContent />;
}
