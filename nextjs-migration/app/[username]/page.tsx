'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { profileService } from '@/lib/services/profiles';
import { articleService } from '@/lib/services/articles';
import { useAuth } from '@/contexts/AuthContext';
import { ArticleList } from '@/components/article/ArticleList';
import { Profile, Article } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const username = params?.username ? String(params.username) : '';
  const tab = searchParams?.get('tab') || 'articles';
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return;
      
      try {
        setIsLoading(true);
        const profileData = await profileService.getProfile(username);
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [username]);

  useEffect(() => {
    const loadArticles = async () => {
      if (!username) return;
      
      try {
        setIsLoading(true);
        let response;
        
        if (tab === 'favorites') {
          response = await articleService.getListWithFilters({
            favorited: username,
            limit: 10,
            offset: (currentPage - 1) * 10
          });
        } else {
          response = await articleService.getListWithFilters({
            author: username,
            limit: 10,
            offset: (currentPage - 1) * 10
          });
        }
        
        setArticles(response.articles);
        setArticlesCount(response.articlesCount);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, [username, tab, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleToggleFollow = async () => {
    if (!profile || !isAuthenticated) {
      if (!isAuthenticated) {
        router.push('/login');
      }
      return;
    }
    
    try {
      const isFollowing = profile.following;
      
      if (isFollowing) {
        await profileService.unfollowProfile(profile.username);
      } else {
        await profileService.followProfile(profile.username);
      }
      
      setProfile({
        ...profile,
        following: !isFollowing
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const isUser = user?.username === username;

  if (!profile && !isLoading) {
    return <div className="profile-page">User not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              {profile ? (
                <>
                  <img 
                    src={profile.image || '/placeholder.jpg'} 
                    className="user-img"
                    alt={profile.username} 
                  />
                  <h4>{profile.username}</h4>
                  <p>{profile.bio}</p>
                  
                  {isUser ? (
                    <Link 
                      href="/settings" 
                      className="btn btn-sm btn-outline-secondary action-btn"
                    >
                      <i className="ion-gear-a"></i> Edit Profile Settings
                    </Link>
                  ) : (
                    <button 
                      className="btn btn-sm btn-outline-secondary action-btn" 
                      onClick={handleToggleFollow}
                    >
                      <i className="ion-plus-round"></i>
                      &nbsp;
                      {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
                    </button>
                  )}
                </>
              ) : (
                <p>Loading profile...</p>
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
                    className={`nav-link ${tab === 'articles' ? 'active' : ''}`}
                  >
                    My Articles
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={`/${username}?tab=favorites`}
                    className={`nav-link ${tab === 'favorites' ? 'active' : ''}`}
                  >
                    Favorited Articles
                  </Link>
                </li>
              </ul>
            </div>

            <ArticleList
              articles={articles}
              articlesCount={articlesCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
