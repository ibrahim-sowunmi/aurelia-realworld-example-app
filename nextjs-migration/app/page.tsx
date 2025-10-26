'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/lib/services/articles';
import { tagService } from '@/lib/services/tags';
import { Article } from '@/types';
import { ArticleList } from '@/components/ArticleList';

export default function Home() {
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
    loadArticles();
  }, [shownList, filterTag, currentPage]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const params = {
        limit,
        offset: limit * (currentPage - 1),
        ...(filterTag && { tag: filterTag }),
      };

      const response = await articleService.getList(shownList, params);
      setArticles(response.articles);
      
      const pages = Array.from(
        { length: Math.ceil(response.articlesCount / limit) },
        (_, i) => i + 1
      );
      setTotalPages(pages);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tagList = await tagService.getList();
      setTags(tagList);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleSetListTo = (type: 'all' | 'feed', tag?: string) => {
    if (type === 'feed' && !isAuthenticated) return;
    setShownList(type);
    setFilterTag(tag);
    setCurrentPage(1);
  };

  const handleToggleFavorite = async (article: Article) => {
    try {
      if (article.favorited) {
        await articleService.unfavoriteArticle(article.slug);
      } else {
        await articleService.favoriteArticle(article.slug);
      }
      await loadArticles();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
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
                      style={{ cursor: 'pointer' }}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a
                    className={`nav-link ${shownList === 'all' && !filterTag ? 'active' : ''}`}
                    onClick={() => handleSetListTo('all')}
                    style={{ cursor: 'pointer' }}
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
                onPageChange={setCurrentPage}
                onToggleFavorite={handleToggleFavorite}
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
                  tags.map((tag) => (
                    <a
                      key={tag}
                      className="tag-pill tag-default"
                      onClick={() => handleSetListTo('all', tag)}
                      style={{ cursor: 'pointer' }}
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
