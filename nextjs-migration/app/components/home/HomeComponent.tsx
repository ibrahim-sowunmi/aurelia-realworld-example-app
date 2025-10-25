'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/lib/services/articles';
import { tagService } from '@/lib/services/tags';
import type { Article } from '@/types';
import ArticleList from './ArticleList';

export default function HomeComponent() {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [shownList, setShownList] = useState<string>('all');
  const [tags, setTags] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const limit = 10;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getArticles();
    getTags();
  }, []);

  const getArticles = async () => {
    setIsLoading(true);
    try {
      const params: {
        limit: number;
        offset: number;
        tag?: string;
      } = {
        limit,
        offset: limit * (currentPage - 1)
      };
      
      if (filterTag !== undefined) {
        params.tag = filterTag;
      }
      
      const response = await articleService.getList(shownList as 'all' | 'feed', params);
      setArticles(response.articles);
      
      const pageCount = Math.ceil(response.articlesCount / limit);
      const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
      setTotalPages(pages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTags = async () => {
    try {
      const tagList = await tagService.getList();
      setTags(tagList);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const setListTo = (type: string, tag?: string) => {
    if (type === 'feed' && !isAuthenticated) return;
    
    setShownList(type);
    setFilterTag(tag);
    setCurrentPage(1); // Reset to first page when changing list type
    
    setTimeout(() => {
      getArticles();
    }, 0);
  };

  const getFeedLinkClass = () => {
    let className = '';
    if (!isAuthenticated) {
      className += ' disabled';
    }
    if (shownList === 'feed') {
      className += ' active';
    }
    return className;
  };

  const setPageTo = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      getArticles();
    }, 0);
  };

  useEffect(() => {
    getArticles();
  }, [currentPage, shownList, filterTag]);

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
                      className={`nav-link${shownList === 'feed' && !filterTag ? ' active' : ''}`}
                      onClick={() => setListTo('feed')}
                      role="button"
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a 
                    className={`nav-link${shownList === 'all' && !filterTag ? ' active' : ''}`}
                    onClick={() => setListTo('all')}
                    role="button"
                  >
                    Global Feed
                  </a>
                </li>
                {filterTag && (
                  <li className="nav-item">
                    <a className="nav-link active">
                      <i className="ion-pound"></i> {filterTag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

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

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tags.length === 0 ? (
                  <div>No tags are here... yet.</div>
                ) : (
                  tags.map(tag => (
                    <a 
                      key={tag} 
                      href="#"
                      className="tag-pill tag-default"
                      onClick={(e) => {
                        e.preventDefault();
                        setListTo('all', tag);
                      }}
                    >
                      {tag}
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
