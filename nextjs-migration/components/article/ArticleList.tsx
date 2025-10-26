'use client';

import React from 'react';
import { useState } from 'react';
import { Article } from '@/types';
import { ArticlePreview } from './ArticlePreview';

interface ArticleListProps {
  articles: Article[];
  articlesCount: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
  limit?: number;
}

export function ArticleList({ 
  articles, 
  articlesCount, 
  currentPage, 
  onPageChange,
  limit = 10
}: ArticleListProps) {
  const totalPages = Array.from(
    new Array(Math.ceil(articlesCount / limit)), 
    (_, index) => index + 1
  );

  return (
    <>
      {articles.length === 0 ? (
        <div className="article-preview">
          No articles are here... yet.
        </div>
      ) : (
        articles.map(article => (
          <ArticlePreview key={article.slug} article={article} />
        ))
      )}

      {totalPages.length > 1 && (
        <nav>
          <ul className="pagination">
            {totalPages.map(pageNumber => (
              <li 
                key={pageNumber}
                className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(pageNumber)}
              >
                <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>
                  {pageNumber}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
