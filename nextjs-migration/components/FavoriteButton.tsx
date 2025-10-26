'use client';

import React from 'react';
import { Article } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface FavoriteButtonProps {
  article: Article;
  onToggle: (article: Article) => void;
  className?: string;
}

export function FavoriteButton({ article, onToggle, className = '' }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      onToggle(article);
    }
  };

  const buttonClass = article.favorited 
    ? 'btn btn-sm btn-primary' 
    : 'btn btn-sm btn-outline-primary';

  return (
    <button 
      className={`${buttonClass} ${className}`}
      onClick={handleClick}
      disabled={!isAuthenticated}
    >
      <i className="ion-heart"></i> {article.favoritesCount}
    </button>
  );
}
