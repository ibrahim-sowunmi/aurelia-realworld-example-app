'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Article } from '../../types';
import { articleService } from '../../lib/services/articles';

interface ArticlePreviewProps {
  article: Article;
  onToggleFavorite?: (article: Article) => void;
}

export default function ArticlePreview({ article, onToggleFavorite }: ArticlePreviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleToggleFavorite = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const updatedArticle = article.favorited
        ? await articleService.unfavoriteArticle(article.slug)
        : await articleService.favoriteArticle(article.slug);
        
      if (onToggleFavorite) {
        onToggleFavorite(updatedArticle);
      }
    } catch (error) {
      console.error('Error toggling favorite', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link href={`/${article.author.username}`}>
          <img src={article.author.image || '/placeholder-user.png'} alt={article.author.username} />
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
          className={`btn btn-sm ${article.favorited ? 'btn-primary' : 'btn-outline-primary'} pull-xs-right`}
          onClick={handleToggleFavorite}
          disabled={isSubmitting}
        >
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>
      <Link href={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">{tag}</li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
