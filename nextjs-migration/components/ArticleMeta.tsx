'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Article } from '@/types';
import { articleService } from '@/lib/services/articles';
import { profileService } from '@/lib/services/profiles';

interface ArticleMetaProps {
  article: Article;
}

export default function ArticleMeta({ article }: ArticleMetaProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const canModify = user?.username === article.author.username;

  const handleFollowToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (article.author.following) {
        const updatedProfile = await profileService.unfollowProfile(article.author.username);
        article.author.following = updatedProfile.following;
      } else {
        const updatedProfile = await profileService.followProfile(article.author.username);
        article.author.following = updatedProfile.following;
      }
      router.refresh();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (article.favorited) {
        const updatedArticle = await articleService.unfavoriteArticle(article.slug);
        article.favorited = updatedArticle.favorited;
        article.favoritesCount = updatedArticle.favoritesCount;
      } else {
        const updatedArticle = await articleService.favoriteArticle(article.slug);
        article.favorited = updatedArticle.favorited;
        article.favoritesCount = updatedArticle.favoritesCount;
      }
      router.refresh();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articleService.deleteArticle(article.slug);
      router.push('/');
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <div className="article-meta">
      <Link href={`/${article.author.username}`}>
        <img src={article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} alt={article.author.username} />
      </Link>
      
      <div className="info">
        <Link href={`/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
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
            onClick={handleDelete}
          >
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </span>
      ) : (
        <span>
          <button 
            className={`btn btn-sm ${article.author.following ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={handleFollowToggle}
          >
            <i className="ion-plus-round"></i>
            {' '}
            {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
          </button>
          {' '}
          <button 
            className={`btn btn-sm ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleFavoriteToggle}
          >
            <i className="ion-heart"></i>
            {' '}
            {article.favorited ? 'Unfavorite' : 'Favorite'} Post{' '}
            <span className="counter">({article.favoritesCount})</span>
          </button>
        </span>
      )}
    </div>
  );
}
