'use client';

import React, { useState, useEffect } from 'react';
import { articleService } from '@/lib/services/articles';
import type { Article } from '@/types';
import ArticleList from '../home/ArticleList';

interface ProfileArticlesProps {
  username: string;
  favorites?: boolean;
}

export default function ProfileArticles({ username, favorites = false }: ProfileArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const limit = 10;

  useEffect(() => {
    loadArticles();
  }, [username, favorites, currentPage]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const params = {
        limit,
        offset: limit * (currentPage - 1)
      };

      let response;
      if (favorites) {
        response = await articleService.getList('all', { ...params, favorited: username });
      } else {
        response = await articleService.getList('all', { ...params, author: username });
      }

      setArticles(response.articles);
      
      const pageCount = Math.ceil(response.articlesCount / limit);
      const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
      setTotalPages(pages);
    } catch (error) {
      console.error('Failed to fetch profile articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setPageTo = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {isLoading ? (
        <div className="article-preview">Loading...</div>
      ) : articles.length === 0 ? (
        <div className="article-preview">No articles are here... yet.</div>
      ) : (
        <ArticleList 
          articles={articles}
          totalPages={totalPages}
          currentPage={currentPage}
          setPageTo={setPageTo}
        />
      )}
    </div>
  );
}
