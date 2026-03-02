import { Metadata } from 'next';
import HyogoMedicalContent from './HyogoMedicalContent';

export const metadata: Metadata = {
  title: '兵庫医科大学病院 | 兵庫県最大規模の特定機能病院',
  description: '兵庫医科大学病院は国指定の特定機能病院。963床、41診療科を擁する兵庫県最大規模の総合病院。最新医療機器と高度な医療技術で地域医療に貢献。',
  keywords: ['兵庫医科大学病院', '特定機能病院', '西宮市', '健診', '高度医療', 'がん治療'],
  openGraph: {
    title: '兵庫医科大学病院 | 兵庫県最大規模の特定機能病院',
    description: '963床、41診療科。国指定特定機能病院として高度な医療を提供。',
    type: 'website',
  },
};

export default function HyogoMedicalPage() {
  return <HyogoMedicalContent />;
}
