'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArticleList } from '@/components/article/ArticleList';
import { articleService } from '@/lib/services/articles';
import { tagService } from '@/lib/services/tags';
import { Article } from '@/types';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [tagList, setTagList] = useState<string[]>([]);
  const [shownList, setShownList] = useState<'all' | 'feed'>('all');
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const params = {
          limit,
          offset: limit * (currentPage - 1),
          ...(filterTag && { tag: filterTag })
        };
        
        const response = await articleService.getList(shownList, params);
        setArticleList(response.articles);
        setArticlesCount(response.articlesCount);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [shownList, filterTag, currentPage]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.getList();
        setTagList(response);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleSetListTo = (type: 'all' | 'feed', tag?: string) => {
    if (type === 'feed' && !isAuthenticated) return;
    setShownList(type);
    setFilterTag(tag);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isAuthenticated && (
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${shownList === 'feed' && !filterTag ? 'active' : ''}`}
                      onClick={() => handleSetListTo('feed')}
                      href="#"
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a 
                    className={`nav-link ${shownList === 'all' && !filterTag ? 'active' : ''}`}
                    onClick={() => handleSetListTo('all')}
                    href="#"
                  >
                    Global Feed
                  </a>
                </li>
                {filterTag && (
                  <li className="nav-item">
                    <a className="nav-link active" href="#">
                      <i className="ion-pound"></i> {filterTag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {isLoading ? (
              <div className="article-preview">Loading articles...</div>
            ) : (
              <ArticleList
                articles={articleList}
                articlesCount={articlesCount}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                limit={limit}
              />
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tagList.length > 0 ? (
                  tagList.map(tag => (
                    <a
                      key={tag}
                      href="#"
                      className="tag-pill tag-default"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSetListTo('all', tag);
                      }}
                    >
                      {tag}
                    </a>
                  ))
                ) : (
                  <div>No tags are here... yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
