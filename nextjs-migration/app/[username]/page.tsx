'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../lib/services/profiles';
import { Profile } from '@/types';
import ProfileArticles from '../components/ProfileArticles';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'articles' | 'favorites'>('articles');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const username = typeof params?.username === 'string' ? params.username : '';
  
  useEffect(() => {
    if (!username) {
      router.push('/');
      return;
    }
    
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const fetchedProfile = await profileService.getProfile(username);
        setProfile(fetchedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [username, router]);
  
  const isUser = user?.username === profile?.username;
  
  const handleToggleFollow = async () => {
    if (!isAuthenticated || !profile) {
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      let updatedProfile;
      
      if (profile.following) {
        updatedProfile = await profileService.unfollowProfile(username);
      } else {
        updatedProfile = await profileService.followProfile(username);
      }
      
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsSubmitting(false);
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
              <p>Profile not found.</p>
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
              <img src={profile.image || '/placeholder-user.png'} className="user-img" alt={profile.username} />
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
                  <a 
                    className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('articles');
                    }}
                  >
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('favorites');
                    }}
                  >
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>
            
            {activeTab === 'articles' ? (
              <ProfileArticles username={username} />
            ) : (
              <ProfileArticles username={username} favorited />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
