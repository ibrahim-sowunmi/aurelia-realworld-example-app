'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { articleService } from '../../../lib/services/articles';
import { Article } from '../../../types';
import ArticleList from '../../components/article/ArticleList';

export default function ProfileArticlesPage() {
  const params = useParams();
  const username = params.username as string;
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const limit = 10;

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const queryParams = {
        limit,
        offset: limit * (currentPage - 1),
        author: username
      };
      
      const response = await articleService.getList('all', queryParams);
      setArticles(response.articles);
      
      const totalPagesCount = Math.ceil(response.articlesCount / limit);
      setTotalPages(Array.from({ length: totalPagesCount }, (_, i) => i + 1));
    } catch (error) {
      console.error('Error fetching articles', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchArticles();
    }
  }, [username, currentPage]);

  const setPageTo = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {isLoading ? (
        <div className="article-preview">Loading articles...</div>
      ) : (
        <ArticleList 
          articles={articles}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setPageTo}
        />
      )}
    </>
  );
}
