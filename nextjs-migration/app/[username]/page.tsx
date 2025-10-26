'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../lib/services/profiles';
import ProfileArticles from './ProfileArticles';
import ProfileFavorites from './ProfileFavorites';

export default function ProfilePage() {
  const params = useParams();
  const username = typeof params.username === 'string' ? params.username : '';
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('articles');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const profileData = await profileService.getProfile(username);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFollowing = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      if (profile.following) {
        await profileService.unfollowProfile(profile.username);
      } else {
        await profileService.followProfile(profile.username);
      }
      
      setProfile(prev => ({
        ...prev,
        following: !prev.following
      }));
    } catch (error) {
      console.error('Failed to toggle following:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !profile) {
    return <div className="profile-page">Loading...</div>;
  }

  const isUser = isAuthenticated && user?.username === profile.username;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} className="user-img" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              
              {isUser ? (
                <a 
                  href="/settings" 
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </a>
              ) : (
                <button 
                  className={`btn btn-sm btn-outline-secondary action-btn ${profile.following ? 'active' : ''}`}
                  onClick={handleToggleFollowing}
                  disabled={isSubmitting}
                >
                  <i className="ion-plus-round"></i>
                  {' '}
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
                  <button 
                    className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('articles')}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

            {activeTab === 'articles' ? (
              <ProfileArticles username={username} />
            ) : (
              <ProfileFavorites username={username} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
