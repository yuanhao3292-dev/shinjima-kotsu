'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';

interface SmartBackLinkProps {
  defaultHref?: string;
  defaultLabel?: string;
  memberHref?: string;
  memberLabel?: string;
  className?: string;
}

/**
 * 智能返回链接组件
 * - 已登录用户：返回会员中心
 * - 未登录用户：返回首页或指定页面
 */
export default function SmartBackLink({
  defaultHref = '/',
  defaultLabel = '返回首頁',
  memberHref = '/my-account',
  memberLabel = '返回會員中心',
  className = '',
}: SmartBackLinkProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // 加载中显示默认链接，避免闪烁
  const href = isLoading ? defaultHref : (isLoggedIn ? memberHref : defaultHref);
  const label = isLoading ? defaultLabel : (isLoggedIn ? memberLabel : defaultLabel);

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <ArrowLeft size={18} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
