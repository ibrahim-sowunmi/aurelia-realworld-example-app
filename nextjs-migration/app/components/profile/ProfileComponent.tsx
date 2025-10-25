'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/lib/services/profiles';
import ProfileArticles from './ProfileArticles';
import type { Profile as ProfileType } from '@/types';

export default function ProfileComponent() {
  const { username } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tab = searchParams.get('tab') || 'articles';
  const isFavoritesTab = tab === 'favorites';

  useEffect(() => {
    if (!username || typeof username !== 'string') {
      setError('Invalid username');
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await profileService.getProfile(username);
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  const isUser = user?.username === profile?.username;

  const handleToggleFollow = async () => {
    if (!profile || !isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      let updatedProfile;
      if (profile.following) {
        updatedProfile = await profileService.unfollowProfile(profile.username);
      } else {
        updatedProfile = await profileService.followProfile(profile.username);
      }
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (isLoading) {
    return <div className="profile-page">Loading...</div>;
  }

  if (error || !profile) {
    return <div className="profile-page">Error: {error || 'Profile not found'}</div>;
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image || '/placeholder.png'} className="user-img" alt={profile.username} />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              {!isUser ? (
                <button 
                  className="btn btn-sm btn-outline-secondary action-btn" 
                  onClick={handleToggleFollow}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp;
                  {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
                </button>
              ) : (
                <Link href="/settings" className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link 
                    href={`/${profile.username}`} 
                    className={`nav-link ${!isFavoritesTab ? 'active' : ''}`}
                  >
                    My Posts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href={`/${profile.username}?tab=favorites`} 
                    className={`nav-link ${isFavoritesTab ? 'active' : ''}`}
                  >
                    Favorited Posts
                  </Link>
                </li>
              </ul>
            </div>

            <ProfileArticles 
              username={profile.username}
              favorites={isFavoritesTab} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
