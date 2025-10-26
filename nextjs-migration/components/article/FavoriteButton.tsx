'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/lib/services/articles';
import { Article } from '@/types';

interface FavoriteButtonProps {
  article: Article;
  onToggle: (favorited: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function FavoriteButton({ article, onToggle, children, className = '' }: FavoriteButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      const newFavorited = !article.favorited;
      if (newFavorited) {
        await articleService.favoriteArticle(article.slug);
      } else {
        await articleService.unfavoriteArticle(article.slug);
      }
      onToggle(newFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass = article.favorited
    ? 'btn-primary'
    : 'btn-outline-primary';

  return (
    <button
      className={`btn ${buttonClass} btn-sm ${className}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <i className="ion-heart"></i>
      {children}
    </button>
  );
}
