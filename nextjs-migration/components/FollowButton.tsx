'use client';

import React from 'react';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface FollowButtonProps {
  profile: Profile;
  onToggle: (profile: Profile) => void;
  className?: string;
}

export function FollowButton({ profile, onToggle, className = '' }: FollowButtonProps) {
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      onToggle(profile);
    }
  };

  const buttonClass = profile.following 
    ? 'btn btn-sm btn-secondary' 
    : 'btn btn-sm btn-outline-secondary';

  return (
    <button 
      className={`${buttonClass} ${className}`}
      onClick={handleClick}
      disabled={!isAuthenticated}
    >
      <i className="ion-plus-round"></i>
      &nbsp;
      {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
    </button>
  );
}
