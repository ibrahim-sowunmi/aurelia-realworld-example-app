'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ArticleList from '@/components/ArticleList';
import { getProfile, followProfile, unfollowProfile } from '@/lib/services/profiles';
import { getList as getArticlesList } from '@/lib/services/articles';
import { Profile } from '@/types';

export default function ProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const username = params?.username as string;
  const tab = searchParams.get('tab') || 'articles';
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      setIsLoading(true);
      try {
        const profileResponse = await getProfile(username);
        setProfile(profileResponse.profile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [username]);

  const { user } = useAuth();
  const isUser = user?.username === profile?.username;
  
  const handleToggleFollowing = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!profile) return;
    
    try {
      if (profile.following) {
        await unfollowProfile(profile.username);
        setProfile({ ...profile, following: false });
      } else {
        await followProfile(profile.username);
        setProfile({ ...profile, following: true });
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const changeTab = (newTab: string) => {
    router.push(`/${username}?tab=${newTab}`);
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
  
  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <p>{error || 'Profile not found'}</p>
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
              
              {isUser ? (
                <Link href="/settings" className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </Link>
              ) : (
                <button 
                  className="btn btn-sm btn-outline-secondary action-btn" 
                  onClick={handleToggleFollowing}
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
                  <button 
                    className={`nav-link ${tab === 'articles' ? 'active' : ''}`}
                    onClick={() => changeTab('articles')}
                  >
                    My Posts
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${tab === 'favorites' ? 'active' : ''}`}
                    onClick={() => changeTab('favorites')}
                  >
                    Favorited Posts
                  </button>
                </li>
              </ul>
            </div>

            {tab === 'articles' ? (
              <ArticleList 
                predicate={{ author: username }}
                key={`articles-${username}`}
              />
            ) : (
              <ArticleList 
                predicate={{ favorited: username }}
                key={`favorites-${username}`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
