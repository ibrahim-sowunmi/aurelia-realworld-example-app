'use client';

import React from 'react';
import { Article } from '../types';
import { ArticlePreview } from './ArticlePreview';

interface ArticleListProps {
  articles: Article[];
  totalPages: number[];
  currentPage: number;
  setPage: (pageNumber: number) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  totalPages,
  currentPage,
  setPage,
}) => {
  return (
    <>
      {articles.length === 0 ? (
        <div className="article-preview">
          No articles are here... yet.
        </div>
      ) : (
        articles.map((article) => (
          <ArticlePreview key={article.slug} article={article} />
        ))
      )}

      {totalPages.length > 1 && (
        <nav>
          <ul className="pagination">
            {totalPages.map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${
                  pageNumber === currentPage ? 'active' : ''
                }`}
                onClick={() => setPage(pageNumber)}
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
};
