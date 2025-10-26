'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { Article } from '@/types';
import { FavoriteButton } from './FavoriteButton';
import { formatDate } from '@/lib/utils';

interface ArticlePreviewProps {
  article: Article;
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  
  const handleToggleFavorite = (favorited: boolean) => {
    setFavoritesCount(prevCount => favorited ? prevCount + 1 : prevCount - 1);
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link href={`/${article.author.username}`}>
          <img src={article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} alt={article.author.username} />
        </Link>
        <div className="info">
          <Link href={`/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">{formatDate(article.createdAt)}</span>
        </div>
        <FavoriteButton 
          article={article} 
          onToggle={handleToggleFavorite}
          className="pull-xs-right"
        >
          {favoritesCount}
        </FavoriteButton>
      </div>
      <Link href={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map(tag => (
            <li key={tag} className="tag-default tag-pill tag-outline">{tag}</li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
