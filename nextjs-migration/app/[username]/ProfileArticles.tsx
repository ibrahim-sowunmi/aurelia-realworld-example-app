'use client';

import React, { useState, useEffect } from 'react';
import { articleService } from '../../lib/services/articles';
import ArticleList from '../components/article/ArticleList';

interface ProfileArticlesProps {
  username: string;
}

export default function ProfileArticles({ username }: ProfileArticlesProps) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (username) {
      loadArticles();
    }
  }, [username, currentPage]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const { articles: fetchedArticles, articlesCount: count } = await articleService.getArticles({
        author: username,
        limit: 10,
        offset: (currentPage - 1) * 10
      });
      setArticles(fetchedArticles);
      setArticlesCount(count);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ArticleList 
      articles={articles}
      articlesCount={articlesCount}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      isLoading={isLoading}
    />
  );
}
