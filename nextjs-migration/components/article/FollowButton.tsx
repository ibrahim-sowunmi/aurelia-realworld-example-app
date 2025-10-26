'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/lib/services/profiles';
import { Profile } from '@/types';

interface FollowButtonProps {
  profile: Profile;
  onToggle: (following: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function FollowButton({ profile, onToggle, children, className = '' }: FollowButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      const newFollowing = !profile.following;
      if (newFollowing) {
        await profileService.followProfile(profile.username);
      } else {
        await profileService.unfollowProfile(profile.username);
      }
      onToggle(newFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass = profile.following
    ? 'btn-secondary'
    : 'btn-outline-secondary';

  return (
    <button
      className={`btn ${buttonClass} btn-sm ${className}`}
      onClick={handleToggleFollow}
      disabled={isLoading}
    >
      <i className="ion-plus-round"></i>
      {children}
    </button>
  );
}
