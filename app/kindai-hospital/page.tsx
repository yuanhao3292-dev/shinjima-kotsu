import { Metadata } from 'next';
import KindaiHospitalContent from './KindaiHospitalContent';

export const metadata: Metadata = {
  title: '近畿大学病院 | 南大阪唯一の大学附属医院 - 新岛交通医疗服务',
  description:
    '近畿大学病院は南大阪地域唯一の大学病院。800床、35診療科、14専門医療センターを有し、がん治療、心臓血管治療、脳卒中治療など高度先端医療を提供。最先端PET-CT完備。',
  keywords:
    '近畿大学病院,大学病院,がんセンター,PET-CT,多学科診療,MDT,堺市,南大阪,癌症中心,大学附属医院',
  openGraph: {
    title: '近畿大学病院 | 南大阪唯一の大学附属医院',
    description:
      '南大阪地域唯一の大学病院。がんセンターをはじめ14の専門医療センターで高度医療を提供。',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: '近畿大学病院',
      },
    ],
    type: 'website',
    locale: 'ja_JP',
  },
};

export default function KindaiHospitalPage() {
  return <KindaiHospitalContent />;
}
