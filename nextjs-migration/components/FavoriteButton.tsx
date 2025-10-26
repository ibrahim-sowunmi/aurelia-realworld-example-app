'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Article } from '../types';
import { articleService } from '../lib/services/articles';

interface FavoriteButtonProps {
  article: Article;
  className?: string;
  children?: React.ReactNode;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  article,
  className = '',
  children,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const [favorited, setFavorited] = useState(article.favorited);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onToggleFavorited = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const newFavorited = !favorited;
      setFavorited(newFavorited);
      
      if (newFavorited) {
        setFavoritesCount(prev => prev + 1);
        await articleService.favoriteArticle(article.slug);
      } else {
        setFavoritesCount(prev => prev - 1);
        await articleService.unfavoriteArticle(article.slug);
      }
    } catch (error) {
      setFavorited(favorited);
      setFavoritesCount(article.favoritesCount);
      console.error('Error toggling favorite:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${
        favorited ? 'btn-primary' : 'btn-outline-primary'
      } ${className}`}
      onClick={onToggleFavorited}
      disabled={isSubmitting}
    >
      <i className="ion-heart"></i> {children || favoritesCount}
    </button>
  );
};
