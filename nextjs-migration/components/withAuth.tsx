'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthProtected(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, isLoading, router]);
    
    if (isLoading) {
      return <div className="loading-container">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return null; // will redirect in the useEffect
    }
    
    return <Component {...props} />;
  };
}
