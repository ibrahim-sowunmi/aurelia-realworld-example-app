'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { articleService } from '../../../lib/services/articles';

interface ArticlePreviewProps {
  article: any;
}

export default function ArticlePreview({ article }: ArticlePreviewProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(article.favorited);
  const [favoriteCount, setFavoriteCount] = useState(article.favoritesCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToArticle = () => {
    router.push(`/article/${article.slug}`);
  };

  return (
    <div className="article-preview" onClick={navigateToArticle}>
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
        <button 
          className={`btn btn-sm pull-xs-right ${isFavorite ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={handleFavoriteToggle}
          disabled={isSubmitting}
        >
          <i className="ion-heart"></i> {favoriteCount}
        </button>
      </div>
      <a href={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag: string) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </a>
    </div>
  );
}
