'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { articleService } from '../lib/services/articles';
import { profileService } from '../lib/services/profiles';
import type { Article } from '../types';

interface ArticleMetaProps {
  article: Article;
}

export default function ArticleMeta({ article }: ArticleMetaProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const canModify = user?.username === article.author.username;
  
  const handleDeleteArticle = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await articleService.deleteArticle(article.slug);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete article', error);
      setIsSubmitting(false);
    }
  };
  
  const handleFollow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      if (article.author.following) {
        await profileService.unfollowProfile(article.author.username);
      } else {
        await profileService.followProfile(article.author.username);
      }
      router.refresh();
    } catch (error) {
      console.error('Failed to follow/unfollow', error);
    }
  };
  
  const handleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      if (article.favorited) {
        await articleService.unfavoriteArticle(article.slug);
      } else {
        await articleService.favoriteArticle(article.slug);
      }
      router.refresh();
    } catch (error) {
      console.error('Failed to favorite/unfavorite', error);
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
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>
      
      {canModify ? (
        <span>
          <Link href={`/editor/${article.slug}`} className="btn btn-outline-secondary btn-sm">
            <i className="ion-edit"></i>&nbsp;Edit Article
          </Link>
          &nbsp;&nbsp;
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={handleDeleteArticle}
            disabled={isSubmitting}
          >
            <i className="ion-trash-a"></i>&nbsp;Delete Article
          </button>
        </span>
      ) : (
        <span>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={handleFollow}
          >
            <i className="ion-plus-round"></i>
            &nbsp;
            {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
          </button>
          &nbsp;&nbsp;
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={handleFavorite}
          >
            <i className="ion-heart"></i>
            &nbsp;
            {article.favorited ? 'Unfavorite' : 'Favorite'} Article <span className="counter">({article.favoritesCount})</span>
          </button>
        </span>
      )}
    </div>
  );
}
