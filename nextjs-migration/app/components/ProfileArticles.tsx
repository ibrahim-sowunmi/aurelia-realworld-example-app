'use client';

import React, { useState, useEffect } from 'react';
import { articleService } from '@/lib/services/articles';
import ArticleList from './ArticleList';
import { Article } from '@/types';

interface ProfileArticlesProps {
  username: string;
  favorited?: boolean;
}

export default function ProfileArticles({ username, favorited = false }: ProfileArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const limit = 5;

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const params = {
          limit,
          offset: (currentPage - 1) * limit,
          author: favorited ? undefined : username,
          favorited: favorited ? username : undefined,
        };
        
        const response = await articleService.getList(undefined, params);
        
        setArticles(response.articles);
        const pages = Array.from(
          new Array(Math.ceil(response.articlesCount / limit)),
          (_, index) => index + 1
        );
        setTotalPages(pages);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, [username, favorited, currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleArticleUpdate = (updatedArticle: Article) => {
    setArticles(articles.map(article => 
      article.slug === updatedArticle.slug ? updatedArticle : article
    ));
  };

  if (isLoading) {
    return <div className="article-preview">Loading articles...</div>;
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
