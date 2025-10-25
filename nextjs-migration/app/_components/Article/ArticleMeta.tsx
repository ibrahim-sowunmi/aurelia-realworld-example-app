'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/state/AuthContext';
import { articleService } from '@/lib/services/articles';
import { formatDate } from '@/lib/utils';
import { profileService } from '@/lib/services/profiles';
import type { Article } from '@/types';

interface ArticleMetaProps {
  article: Article;
  onToggleFavorite?: (value: boolean) => void;
  onToggleFollow?: (value: boolean) => void;
}

export default function ArticleMeta({ article, onToggleFavorite, onToggleFollow }: ArticleMetaProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(article.author.following);
  const [isFavorited, setIsFavorited] = useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  
  const canModify = user?.username === article.author.username;

  const handleDeleteArticle = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    setIsSubmitting(true);
    try {
      await articleService.deleteArticle(article.slug);
      router.push('/');
    } catch (error) {
      console.error('Error deleting article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFollow = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isFollowing) {
        await profileService.unfollowProfile(article.author.username);
        setIsFollowing(false);
      } else {
        await profileService.followProfile(article.author.username);
        setIsFollowing(true);
      }
      onToggleFollow?.(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isFavorited) {
        await articleService.unfavoriteArticle(article.slug);
        setIsFavorited(false);
        setFavoritesCount(prev => prev - 1);
      } else {
        await articleService.favoriteArticle(article.slug);
        setIsFavorited(true);
        setFavoritesCount(prev => prev + 1);
      }
      onToggleFavorite?.(isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
          >
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </span>
      ) : (
        <span>
          <button 
            className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={handleToggleFollow}
            disabled={isSubmitting}
          >
            <i className="ion-plus-round"></i>
            {' '}
            {isFollowing ? 'Unfollow' : 'Follow'} {article.author.username}
          </button>
          {' '}
          <button 
            className={`btn btn-sm ${isFavorited ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleToggleFavorite}
            disabled={isSubmitting}
          >
            <i className="ion-heart"></i>
            {' '}
            {isFavorited ? 'Unfavorite' : 'Favorite'} Article <span className="counter">({favoritesCount})</span>
          </button>
        </span>
      )}
    </div>
  );
}
