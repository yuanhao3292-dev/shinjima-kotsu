'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { UserProfile } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pendingRequest, setPendingRequest] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 sessionStorage 读取用户信息
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      const requestStr = sessionStorage.getItem('pendingRequest');

      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        // 未登录，跳转回首页
        router.push('/');
      }

      if (requestStr) {
        setPendingRequest(requestStr);
        sessionStorage.removeItem('pendingRequest');
      }

      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('pendingRequest');
    }
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      initialRequestText={pendingRequest}
    />
  );
}
