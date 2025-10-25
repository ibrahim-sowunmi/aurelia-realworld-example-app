'use client';

import React, { useState, useEffect } from 'react';
import ArticlePreview from './ArticlePreview';

interface ArticleListProps {
  articles: Array<any>;
  totalCount: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
  isLoading?: boolean;
  limit?: number;
}

export default function ArticleList({ 
  articles, 
  totalCount, 
  currentPage, 
  onPageChange,
  isLoading = false,
  limit = 10
}: ArticleListProps) {
  const [totalPages, setTotalPages] = useState<number[]>([]);
  
  useEffect(() => {
    const pageCount = Math.ceil(totalCount / limit);
    setTotalPages(Array.from({ length: pageCount }, (_, i) => i + 1));
  }, [totalCount, limit]);

  const handleFavoriteToggle = (slug: string, favorited: boolean) => {
  };

  if (isLoading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map(article => (
        <ArticlePreview 
          key={article.slug} 
          article={article} 
          onFavoriteToggle={handleFavoriteToggle} 
        />
      ))}
      
      {totalPages.length > 1 && (
        <nav>
          <ul className="pagination">
            {totalPages.map(pageNumber => (
              <li 
                key={pageNumber} 
                className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(pageNumber)}
              >
                <a className="page-link" href="#">{pageNumber}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
