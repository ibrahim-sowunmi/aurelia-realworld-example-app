'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/lib/services/articles';
import { profileService } from '@/lib/services/profiles';
import type { Article } from '@/types';

interface ArticleMetaProps {
  article: Article;
}

export default function ArticleMeta({ article }: ArticleMetaProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const [following, setFollowing] = useState(article.author.following);

  const canModify = user?.username === article.author.username;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (favorited) {
        await articleService.unfavoriteArticle(article.slug);
        setFavorited(false);
        setFavoritesCount(prev => prev - 1);
      } else {
        await articleService.favoriteArticle(article.slug);
        setFavorited(true);
        setFavoritesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling favorite', error);
    }
  };

  const handleToggleFollow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (following) {
        await profileService.unfollowProfile(article.author.username);
        setFollowing(false);
      } else {
        await profileService.followProfile(article.author.username);
        setFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow', error);
    }
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articleService.deleteArticle(article.slug);
      router.push('/');
    } catch (error) {
      console.error('Error deleting article', error);
    }
  };

  return (
    <div className="article-meta">
      <Link href={`/${article.author.username}`}>
        <img src={article.author.image || '/placeholder.png'} alt={article.author.username} />
      </Link>
      <div className="info">
        <Link href={`/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">{formatDate(article.createdAt)}</span>
      </div>

      {canModify ? (
        <span>
          <Link 
            href={`/editor/${article.slug}`}
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="ion-edit"></i> Edit Article
          </Link>
          {' '}
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={handleDeleteArticle}
          >
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </span>
      ) : (
        <span>
          <button 
            className={`btn btn-sm ${following ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={handleToggleFollow}
          >
            <i className="ion-plus-round"></i>
            &nbsp;
            {following ? 'Unfollow' : 'Follow'} {article.author.username}
          </button>
          {' '}
          <button 
            className={`btn btn-sm ${favorited ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleToggleFavorite}
          >
            <i className="ion-heart"></i>
            &nbsp;
            {favorited ? 'Unfavorite' : 'Favorite'} Article <span className="counter">({favoritesCount})</span>
          </button>
        </span>
      )}
    </div>
  );
}
