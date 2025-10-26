'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/lib/services/articles';
import { tagService } from '@/lib/services/tags';
import { Article } from '@/types';
import ArticleList from './ArticleList';

export default function HomeClient() {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [shownList, setShownList] = useState<'all' | 'feed'>('all');
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const params = {
          limit,
          offset: limit * (currentPage - 1),
          tag: filterTag,
        };
        
        const response = await articleService.getList(
          shownList === 'feed' ? 'feed' : undefined,
          params
        );
        
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
  }, [shownList, filterTag, currentPage, isAuthenticated]);
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await tagService.getList();
        setTags(fetchedTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    
    fetchTags();
  }, []);
  
  const setListTo = (type: 'all' | 'feed', tag?: string) => {
    if (type === 'feed' && !isAuthenticated) return;
    
    setShownList(type);
    setFilterTag(tag);
    setCurrentPage(1); // Reset to first page when changing feeds
  };
  
  const getFeedLinkClass = () => {
    let classNames = 'nav-link';
    if (!isAuthenticated) classNames += ' disabled';
    if (shownList === 'feed') classNames += ' active';
    return classNames;
  };
  
  const setPageTo = (pageNumber: number) => {
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
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setListTo('feed');
                      }}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a 
                    className={`nav-link ${shownList === 'all' && !filterTag ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setListTo('all');
                    }}
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
              <div className="article-preview">Loading articles...</div>
            ) : (
              <ArticleList
                articles={articles}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setPageTo}
              />
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tags.length > 0 ? (
                  tags.map((tag) => (
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
