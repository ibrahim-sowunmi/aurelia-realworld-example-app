'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../lib/services/profiles';
import { articleService } from '../../../lib/services/articles';
import { useRouter } from 'next/navigation';
import type { Article } from '../../../types';

interface ArticleMetaProps {
  article: Article;
  onUpdate?: () => void;
}

export default function ArticleMeta({ article, onUpdate }: ArticleMetaProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = React.useState(article.author.following);
  const [isFavorite, setIsFavorite] = React.useState(article.favorited);
  const [favoriteCount, setFavoriteCount] = React.useState(article.favoritesCount);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const isAuthor = isAuthenticated && user?.username === article.author.username;

  const handleFollow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (isFollowing) {
        await profileService.unfollowProfile(article.author.username);
      } else {
        await profileService.followProfile(article.author.username);
      }
      setIsFollowing(!isFollowing);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      let updatedArticle;
      if (isFavorite) {
        updatedArticle = await articleService.unfavoriteArticle(article.slug);
      } else {
        updatedArticle = await articleService.favoriteArticle(article.slug);
      }
      
      setIsFavorite(updatedArticle.favorited);
      setFavoriteCount(updatedArticle.favoritesCount);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to favorite/unfavorite:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/editor/${article.slug}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    setIsSubmitting(true);
    try {
      await articleService.deleteArticle(article.slug);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="article-meta">
      <a href={`/profile/${article.author.username}`}>
        <img src={article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} alt={article.author.username} />
      </a>
      <div className="info">
        <a href={`/profile/${article.author.username}`} className="author">
          {article.author.username}
        </a>
        <span className="date">
          {new Date(article.createdAt).toLocaleDateString('en-US', {
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>
      
      {isAuthor ? (
        <>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={handleEdit}
            disabled={isSubmitting}
          >
            <i className="ion-edit"></i> Edit Article
          </button>
          {' '}
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </>
      ) : (
        <>
          <button 
            className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={handleFollow}
            disabled={isSubmitting}
          >
            <i className="ion-plus-round"></i>
            {' '}
            {isFollowing ? 'Unfollow' : 'Follow'} {article.author.username}
          </button>
          {' '}
          <button 
            className={`btn btn-sm ${isFavorite ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleFavorite}
            disabled={isSubmitting}
          >
            <i className="ion-heart"></i>
            {' '}
            {isFavorite ? 'Unfavorite' : 'Favorite'} Article <span className="counter">({favoriteCount})</span>
          </button>
        </>
      )}
    </div>
  );
}
