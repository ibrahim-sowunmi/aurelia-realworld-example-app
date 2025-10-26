'use client';

import React from 'react';
import { Article } from '@/types';
import { ArticlePreview } from './ArticlePreview';

interface ArticleListProps {
  articles: Article[];
  totalPages: number[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleFavorite: (article: Article) => void;
}

export function ArticleList({ articles, totalPages, currentPage, onPageChange, onToggleFavorite }: ArticleListProps) {
  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticlePreview 
          key={article.slug} 
          article={article} 
          onToggleFavorite={onToggleFavorite}
        />
      ))}

      {totalPages.length > 1 && (
        <ul className="pagination">
          {totalPages.map((page) => (
            <li 
              key={page} 
              className={currentPage === page ? 'page-item active' : 'page-item'}
              onClick={() => onPageChange(page)}
            >
              <a className="page-link">{page}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
