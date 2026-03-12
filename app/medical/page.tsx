'use client';

import LandingPage from '@/components/LandingPage';
import { UserProfile } from '@/types';
import { useRouter } from 'next/navigation';

/**
 * /medical 页面
 *
 * 之前通过 next.config.js rewrite 实现（/medical → /?page=medical），
 * 但 rewrite 在 App Router RSC prefetch 时会 404。
 * 改为独立页面，LandingPage 通过 pathname='/medical' 自动切换到医疗板块。
 */
export default function MedicalPage() {
  const router = useRouter();

  const handleLogin = (user: UserProfile, requestText?: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(user));
      if (requestText) {
        sessionStorage.setItem('pendingRequest', requestText);
      }
    }
    router.push('/dashboard');
  };

  return <LandingPage onLogin={handleLogin} />;
}
