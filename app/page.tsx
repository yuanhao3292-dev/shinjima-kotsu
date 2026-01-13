'use client';

import LandingPage from '@/components/LandingPage';
import { UserProfile } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLogin = (user: UserProfile, requestText?: string) => {
    // 存储用户信息到 sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(user));
      if (requestText) {
        sessionStorage.setItem('pendingRequest', requestText);
      }
    }
    // 跳转到 dashboard
    router.push('/dashboard');
  };

  return <LandingPage onLogin={handleLogin} />;
}
