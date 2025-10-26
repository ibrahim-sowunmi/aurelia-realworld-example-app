'use client';

import React, { useState, useEffect } from 'react';
import ArticleList from '../../components/ArticleList';
import { articleService } from '../../lib/services/articles';
import type { Article } from '../../types';

export default function ProfilePage({ 
  params 
}: { 
  params: { username: string } 
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const limit = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const queryParams = {
          limit,
          offset: limit * (currentPage - 1),
          author: params.username
        };
        
        const response = await articleService.getList('all', queryParams);
        setArticles(response.articles);
        
        const pageCount = Math.ceil(response.articlesCount / limit);
        setTotalPages(Array.from({ length: pageCount }, (_, i) => i + 1));
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch articles', err);
        setError('Could not load articles');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.username) {
      fetchArticles();
    }
  }, [params.username, currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  if (isLoading && articles.length === 0) {
    return <div className="article-preview">Loading articles...</div>;
  }
  
  if (error) {
    return <div className="article-preview">{error}</div>;
  }
  
  return (
    <ArticleList 
      articles={articles}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
  );
}
