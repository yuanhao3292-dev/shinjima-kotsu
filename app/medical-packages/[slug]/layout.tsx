/**
 * 套餐详情页的 metadata 与面包屑。
 *
 * 这批 URL 此前没有任何自己的 metadata，全部继承根 layout —— 几百个套餐页
 * 共用同一个标题。名称与描述取自 lib/config/medical-packages 的配置，
 * 与页面上渲染的是同一份数据。
 */
import type { Metadata } from 'next';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import { pageMetadata } from '@/lib/seo';
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

  return pageMetadata({
    title: pkg.nameZhTw,
    description: `${pkg.nameZhTw} —— ${pkg.descriptionZhTw}。由新島交通代辦預約，全程中文陪同、報告翻譯。`,
    path: `/medical-packages/${slug}`,
  });
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
