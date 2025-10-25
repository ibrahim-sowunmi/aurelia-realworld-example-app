'use client';

import React from 'react';
import Link from 'next/link';
import { articleService } from '@/lib/services/articles';
import { useAuth } from '@/contexts/AuthContext';
import type { Article } from '@/types';

interface ArticlePreviewProps {
  article: Article;
}

export default function ArticlePreview({ article }: ArticlePreviewProps) {
  const { isAuthenticated } = useAuth();
  const [favorited, setFavorited] = React.useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = React.useState(article.favoritesCount);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = '/login';
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
      console.error('Error favoriting article', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="article-preview">
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
        <button 
          className={`btn btn-sm pull-xs-right ${favorited ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={handleFavorite}
        >
          <i className="ion-heart"></i> {favoritesCount}
        </button>
      </div>
      <Link href={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map(tag => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
