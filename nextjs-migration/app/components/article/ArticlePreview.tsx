'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Article } from '../../../types';
import { articleService } from '../../../lib/services/articles';
import { useAuth } from '../../../contexts/AuthContext';

interface ArticlePreviewProps {
  article: Article;
}

export default function ArticlePreview({ article }: ArticlePreviewProps) {
  const { isAuthenticated } = useAuth();
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const [favorited, setFavorited] = useState(article.favorited);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    if (isFavoriting) return;
    
    setIsFavoriting(true);
    
    try {
      if (favorited) {
        await articleService.unfavoriteArticle(article.slug);
        setFavoritesCount(count => count - 1);
        setFavorited(false);
      } else {
        await articleService.favoriteArticle(article.slug);
        setFavoritesCount(count => count + 1);
        setFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite', error);
    } finally {
      setIsFavoriting(false);
    }
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
          <span className="date">
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <button
          className={`btn btn-sm pull-xs-right ${favorited ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={handleToggleFavorite}
          disabled={isFavoriting}
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
