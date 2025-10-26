'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/lib/services/profiles';
import { articleService } from '@/lib/services/articles';
import { Profile, Article } from '@/types';
import { ArticleList } from '@/components/ArticleList';
import { FollowButton } from '@/components/FollowButton';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<'author' | 'favorited'>('author');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    loadProfile();
  }, [username]);

  useEffect(() => {
    loadArticles();
  }, [username, activeTab, currentPage]);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile(username);
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadArticles = async () => {
    try {
      const params: any = {
        limit,
        offset: limit * (currentPage - 1),
      };

      if (activeTab === 'author') {
        params.author = username;
      } else {
        params.favorited = username;
      }

      const response = await articleService.getList('all', params);
      setArticles(response.articles);

      const pages = Array.from(
        { length: Math.ceil(response.articlesCount / limit) },
        (_, i) => i + 1
      );
      setTotalPages(pages);
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  };

  const handleToggleFollow = async () => {
    if (!profile) return;
    
    try {
      if (profile.following) {
        const updated = await profileService.unfollowProfile(username);
        setProfile(updated);
      } else {
        const updated = await profileService.followProfile(username);
        setProfile(updated);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const handleToggleFavorite = async (article: Article) => {
    try {
      if (article.favorited) {
        await articleService.unfavoriteArticle(article.slug);
      } else {
        await articleService.favoriteArticle(article.slug);
      }
      await loadArticles();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (isLoading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="profile-page">Profile not found</div>;
  }

  const isOwnProfile = user && user.username === username;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image || '/images/smiley-cyrus.jpg'} className="user-img" alt={profile.username} />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {isOwnProfile ? (
                <Link href="/settings" className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </Link>
              ) : (
                <FollowButton profile={profile} onToggle={handleToggleFollow} className="action-btn" />
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
                    className={`nav-link ${activeTab === 'author' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('author');
                      setCurrentPage(1);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'favorited' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('favorited');
                      setCurrentPage(1);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            <ArticleList
              articles={articles}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
