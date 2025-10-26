'use client';

import React from 'react';
import ArticlePreview from './ArticlePreview';
import Pagination from '../common/Pagination';

interface ArticleListProps {
  articles: any[];
  articlesCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function ArticleList({ 
  articles, 
  articlesCount, 
  currentPage, 
  onPageChange,
  isLoading = false
}: ArticleListProps) {
  if (isLoading) {
    return <div className="article-preview">Loading...</div>;
  }

  if (articles.length === 0) {
    return (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    );
  }

  return (
    <div>
      {articles.map(article => (
        <ArticlePreview 
          key={article.slug} 
          article={article}
        />
      ))}

      <Pagination 
        itemsCount={articlesCount}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
