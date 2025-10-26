'use client';

import React, { useState, useEffect } from 'react';
import { articleService } from '../../lib/services/articles';
import ArticleList from '../components/article/ArticleList';

interface ProfileFavoritesProps {
  username: string;
}

export default function ProfileFavorites({ username }: ProfileFavoritesProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (username) {
      loadFavorites();
    }
  }, [username, currentPage]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const { articles: fetchedArticles, articlesCount: count } = await articleService.getList('all', {
        favorited: username,
        limit: 10,
        offset: (currentPage - 1) * 10
      });
      setArticles(fetchedArticles);
      setArticlesCount(count);
    } catch (error) {
      console.error('Failed to load favorites:', error);
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
