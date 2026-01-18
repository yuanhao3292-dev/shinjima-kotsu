import { redirect } from 'next/navigation';
import { getGuideBySlug, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideEntryPage({ params }: PageProps) {
  const { slug } = await params;

  // 验证导游是否存在且订阅有效
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    // 导游不存在，重定向到首页
    redirect('/');
  }

  // 检查订阅状态
  if (guide.subscriptionStatus !== 'active') {
    // 订阅未激活，重定向到首页（不设置 Cookie）
    redirect('/');
  }

  // 记录页面访问
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || undefined;
  const referer = headersList.get('referer') || undefined;

  // 异步记录，不阻塞重定向
  recordPageView(guide.id, {
    pagePath: `/p/${slug}`,
    referrer: referer,
    userAgent: userAgent,
  }).catch((err) => {
    console.error('Failed to record page view:', err);
  });

  // middleware 已经处理了 Cookie 设置和重定向
  // 这个页面作为备用处理
  redirect('/');
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide || guide.subscriptionStatus !== 'active') {
    return {
      title: '页面不存在',
    };
  }

  const brandName = guide.brandName || guide.name;

  return {
    title: `${brandName} - 日本高端定制旅行`,
    description: '专业日本高端体检、名门高尔夫、商务考察服务。中文服务、专属定制。',
    openGraph: {
      title: `${brandName} - 日本高端定制旅行`,
      description: '专业日本高端体检、名门高尔夫、商务考察服务。',
    },
  };
}
