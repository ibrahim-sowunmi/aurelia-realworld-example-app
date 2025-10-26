'use client';

import React from 'react';
import { Article } from '../../../types';
import ArticlePreview from './ArticlePreview';

interface ArticleListProps {
  articles: Article[];
  totalPages: number[];
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export default function ArticleList({ 
  articles, 
  totalPages, 
  currentPage, 
  onPageChange 
}: ArticleListProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    );
  }

  return (
    <>
      {articles.map(article => (
        <ArticlePreview key={article.slug} article={article} />
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
