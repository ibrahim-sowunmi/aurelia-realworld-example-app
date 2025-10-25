'use client';

import React from 'react';
import ArticlePreview from './ArticlePreview';
import type { Article } from '@/types';

interface ArticleListProps {
  articles: Article[];
  totalPages: number[];
  currentPage: number;
  setPageTo: (pageNumber: number) => void;
}

export default function ArticleList({ 
  articles, 
  totalPages, 
  currentPage, 
  setPageTo 
}: ArticleListProps) {
  return (
    <div>
      {articles.map(article => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
      
      <nav>
        <ul className="pagination">
          {totalPages.map(pageNumber => (
            <li 
              key={pageNumber} 
              className={`page-item${pageNumber === currentPage ? ' active' : ''}`}
            >
              <a 
                className="page-link" 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setPageTo(pageNumber);
                }}
              >
                {pageNumber}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
