'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { FavoriteButton } from './FavoriteButton';

interface ArticlePreviewProps {
  article: Article;
  onToggleFavorite: (article: Article) => void;
}

export function ArticlePreview({ article, onToggleFavorite }: ArticlePreviewProps) {
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link href={`/${article.author.username}`}>
          <img src={article.author.image || '/images/smiley-cyrus.jpg'} alt={article.author.username} />
        </Link>
        <div className="info">
          <Link href={`/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <FavoriteButton article={article} onToggle={onToggleFavorite} />
      </div>
      <Link href={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag, index) => (
            <li key={index} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
