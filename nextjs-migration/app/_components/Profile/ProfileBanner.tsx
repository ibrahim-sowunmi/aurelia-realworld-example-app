'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/state/AuthContext';
import { profileService } from '@/lib/services/profiles';
import Link from 'next/link';

interface ProfileBannerProps {
  profile: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}

export default function ProfileBanner({ profile }: ProfileBannerProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(profile.following);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isUser = user?.username === profile.username;
  
  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isFollowing) {
        await profileService.unfollowProfile(profile.username);
        setIsFollowing(false);
      } else {
        await profileService.followProfile(profile.username);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <img src={profile.image || '/placeholder.png'} className="user-img" alt={profile.username} />
            <h4>{profile.username}</h4>
            <p>{profile.bio}</p>
            
            {isUser ? (
              <Link href="/settings" className="btn btn-sm btn-outline-secondary action-btn">
                <i className="ion-gear-a"></i> Edit Profile Settings
              </Link>
            ) : (
              <button 
                className="btn btn-sm btn-outline-secondary action-btn"
                onClick={handleToggleFollow}
                disabled={isSubmitting}
              >
                <i className="ion-plus-round"></i>
                {' '}
                {isFollowing ? 'Unfollow' : 'Follow'} {profile.username}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
