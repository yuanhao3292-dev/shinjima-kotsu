/**
 * 套餐详情页的 metadata 与面包屑。
 *
 * 这批 URL 此前没有任何自己的 metadata，全部继承根 layout —— 几百个套餐页
 * 共用同一个标题。名称与描述取自 lib/config/medical-packages 的配置，
 * 与页面上渲染的是同一份数据。
 */
import type { Metadata } from 'next';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import { pageMetadata, buildMetadata } from '@/lib/seo';
import { metaLocale } from '@/lib/seo-server';
import JsonLd from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = MEDICAL_PACKAGES[slug];

  if (!pkg) {
    // 配置里没有的 slug —— 页面本身会走它自己的兜底，这里只保证不被索引
    return pageMetadata({
      title: '套餐詳情',
      description: '套餐詳情頁面。',
      path: `/medical-packages/${slug}`,
      noIndex: true,
    });
  }

  // 套餐名按语言取。配置里有 nameJa / nameEn / nameZhTw ——
  // 唯独没有简体名，zh-CN 只能沿用繁体（descriptionZhTw 同理）。
  // 要彻底解决需要给 lib/config/medical-packages 补 nameZhCn 字段。
  const locale = await metaLocale();
  const name =
    locale === 'ja' ? pkg.nameJa : locale === 'en' ? pkg.nameEn : pkg.nameZhTw;
  const desc: Record<typeof locale, string> = {
    'zh-TW': `${name} —— ${pkg.descriptionZhTw}。由新島交通代辦預約，全程中文陪同、報告翻譯。`,
    'zh-CN': `${name} —— ${pkg.descriptionZhTw}。由新岛交通代办预约，全程中文陪同、报告翻译。`,
    ja: `${name}。新島交通が予約を代行し、全行程の同行とレポート翻訳まで対応します。`,
    en: `${name}. Booking arranged by Niijima Kotsu, with escort throughout and report translation included.`,
  };
  return buildMetadata({ title: name, description: desc[locale] }, locale);
}

export default async function MedicalPackageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = MEDICAL_PACKAGES[slug];

  return (
    <>
      {pkg && (
        <JsonLd
          data={breadcrumbJsonLd([
            { name: '日本精密體檢', path: '/medical' },
            { name: pkg.nameZhTw, path: `/medical-packages/${slug}` },
          ])}
        />
      )}
      {children}
    </>
  );
}
