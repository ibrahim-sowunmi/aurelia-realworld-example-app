'use client';

import React, { useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../lib/services/profiles';
import { Profile } from '../../types';

export default function ProfilePage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  
  const username = params.username as string;
  const isArticlesTab = !pathname.includes('/favorites');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const profileData = await profileService.getProfile(username);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const isUser = user && profile?.username === user.username;

  const handleToggleFollowing = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!profile || isTogglingFollow) return;
    
    setIsTogglingFollow(true);
    
    try {
      let updatedProfile;
      if (profile.following) {
        updatedProfile = await profileService.unfollowProfile(profile.username);
      } else {
        updatedProfile = await profileService.followProfile(profile.username);
      }
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsTogglingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <p>Profile not found</p>
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
              <img src={profile.image || '/placeholder.png'} alt={profile.username} className="user-img" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              
              {isUser ? (
                <Link href="/settings" className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </Link>
              ) : (
                <button 
                  className="btn btn-sm btn-outline-secondary action-btn" 
                  onClick={handleToggleFollowing}
                  disabled={isTogglingFollow}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp;
                  {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
                </button>
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
                    href={`/${username}`} 
                    className={`nav-link ${isArticlesTab ? 'active' : ''}`}
                  >
                    My Articles
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href={`/${username}/favorites`}
                    className={`nav-link ${!isArticlesTab ? 'active' : ''}`}
                  >
                    Favorited Articles
                  </Link>
                </li>
              </ul>
            </div>

            {/* Articles will be loaded in nested routes */}
          </div>
        </div>
      </div>
    </div>
  );
}
