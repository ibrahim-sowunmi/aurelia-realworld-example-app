'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../lib/services/profiles';
import type { Profile } from '../../types';

export default function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isCurrentUser = user?.username === profile?.username;
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await profileService.getProfile(params.username);
        setProfile(profile);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Could not load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.username) {
      fetchProfile();
    }
  }, [params.username]);
  
  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      if (!profile) return;
      
      if (profile.following) {
        const updatedProfile = await profileService.unfollowProfile(profile.username);
        setProfile(updatedProfile);
      } else {
        const updatedProfile = await profileService.followProfile(profile.username);
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error('Failed to toggle follow', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <p>Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <p>{error || 'Profile not found'}</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => router.push('/')}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img 
                src={profile.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} 
                className="user-img" 
                alt={profile.username}
              />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              
              {!isCurrentUser ? (
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
                    className={`nav-link ${!router.pathname?.includes('favorites') ? 'active' : ''}`}
                  >
                    My Posts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href={`/${profile.username}/favorites`}
                    className={`nav-link ${router.pathname?.includes('favorites') ? 'active' : ''}`}
                  >
                    Favorited Posts
                  </Link>
                </li>
              </ul>
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
