'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { articleService } from '@/lib/services/articles';

interface ArticlePreviewProps {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: {
      username: string;
      bio: string;
      image: string;
      following: boolean;
    };
  };
  onFavoriteToggle?: (slug: string, favorited: boolean) => void;
}

export default function ArticlePreview({ article, onFavoriteToggle }: ArticlePreviewProps) {
  const [favorited, setFavorited] = useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (favorited) {
        await articleService.unfavoriteArticle(article.slug);
        setFavorited(false);
        setFavoritesCount(prevCount => prevCount - 1);
      } else {
        await articleService.favoriteArticle(article.slug);
        setFavorited(true);
        setFavoritesCount(prevCount => prevCount + 1);
      }
      onFavoriteToggle?.(article.slug, !favorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsSubmitting(false);
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
          <span className="date">{formatDate(article.createdAt)}</span>
        </div>
        <button 
          className={`btn btn-sm pull-xs-right ${favorited ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={handleFavoriteToggle}
          disabled={isSubmitting}
        >
          <i className="ion-heart"></i> {favoritesCount}
        </button>
      </div>
      <Link href={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        {article.tagList.length > 0 && (
          <ul className="tag-list">
            {article.tagList.map(tag => (
              <li key={tag} className="tag-default tag-pill tag-outline">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </div>
  );
}
