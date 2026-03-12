'use client';

import LandingPage from '@/components/LandingPage';
import { UserProfile } from '@/types';
import { useRouter } from 'next/navigation';

export default function BusinessPage() {
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
