'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/state/AuthContext';
import { articleService } from '@/lib/services/articles';
import Banner from './Banner';
import FeedToggle from './FeedToggle';
import ArticleList from '../ArticleList';
import TagList from './TagList';
import type { Article } from '@/types';

interface ArticleParams {
  limit: number;
  offset: number;
  tag?: string;
  author?: string;
  favorited?: string;
}

interface HomePageProps {
  initialArticles: Article[];
  initialArticlesCount: number;
  initialTags: string[];
}

export default function HomePage({
  initialArticles,
  initialArticlesCount,
  initialTags
}: HomePageProps) {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [currentFeed, setCurrentFeed] = useState<'all' | 'feed' | 'tag'>('all');
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [articlesCount, setArticlesCount] = useState(initialArticlesCount);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (currentFeed === 'all' && !currentTag && currentPage === 1) return;
    
    loadArticles();
  }, [currentFeed, currentTag, currentPage]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const params: ArticleParams = {
        limit,
        offset: (currentPage - 1) * limit,
      };
      
      if (currentTag) {
        params.tag = currentTag;
      }
      
      const response = await articleService.getList(
        currentFeed !== 'tag' ? currentFeed : 'all', 
        params
      );
      
      setArticles(response.articles);
      setArticlesCount(response.articlesCount);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedSelect = (feed: 'all' | 'feed', tag?: string) => {
    if (feed === 'feed' && !isAuthenticated) return;
    
    setCurrentFeed(tag ? 'tag' : feed);
    setCurrentTag(tag);
    setCurrentPage(1);
  };

  const handleTagSelect = (tag: string) => {
    handleFeedSelect('all', tag);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="home-page">
      <Banner />
      
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedToggle 
              isAuthenticated={isAuthenticated} 
              currentFeed={currentFeed} 
              currentTag={currentTag}
              onFeedSelect={handleFeedSelect} 
            />
            
            <ArticleList 
              articles={articles} 
              totalCount={articlesCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              isLoading={isLoading}
              limit={limit}
            />
          </div>
          
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <TagList tags={tags} onTagSelect={handleTagSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
