'use client';

import React, { useState, useEffect } from 'react';
import { articleService } from '@/lib/services/articles';
import ArticleList from '../ArticleList';
import type { Article } from '@/types';

interface ProfileArticlesProps {
  username: string;
  favoritedMode?: boolean;
}

export default function ProfileArticles({ username, favoritedMode = false }: ProfileArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  useEffect(() => {
    loadArticles();
  }, [username, favoritedMode, currentPage]);
  
  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const queryParams = {
        limit,
        offset: (currentPage - 1) * limit,
        [favoritedMode ? 'favorited' : 'author']: username
      };
      
      const response = await articleService.getList('all', queryParams);
      setArticles(response.articles);
      setArticlesCount(response.articlesCount);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <ArticleList
      articles={articles}
      totalCount={articlesCount}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      limit={limit}
    />
  );
}
