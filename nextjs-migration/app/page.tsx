'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { articleService } from '../lib/services/articles';
import { tagService } from '../lib/services/tags';
import type { Article } from '../types';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [shownList, setShownList] = useState<'all' | 'feed'>('all');
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    loadArticles();
  }, [shownList, filterTag, currentPage]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
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
      const fetchedTags = await tagService.getList();
      setTags(fetchedTags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const setListTo = (type: 'all' | 'feed', tag?: string) => {
    if (type === 'feed' && !isAuthenticated) return;
    setShownList(type);
    setFilterTag(tag);
    setCurrentPage(1);
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
                      className={`nav-link${shownList === 'feed' && !filterTag ? ' active' : ''}`}
                      onClick={() => setListTo('feed')}
                      style={{ cursor: 'pointer' }}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a
                    className={`nav-link${shownList === 'all' && !filterTag ? ' active' : ''}`}
                    onClick={() => setListTo('all')}
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
            ) : articles.length === 0 ? (
              <div className="article-preview">No articles are here... yet.</div>
            ) : (
              <>
                {articles.map((article) => (
                  <div key={article.slug} className="article-preview">
                    <div className="article-meta">
                      <a href={`/profile/${article.author.username}`}>
                        <img src={article.author.image || ''} alt={article.author.username} />
                      </a>
                      <div className="info">
                        <a href={`/profile/${article.author.username}`} className="author">
                          {article.author.username}
                        </a>
                        <span className="date">
                          {new Date(article.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <button className="btn btn-outline-primary btn-sm pull-xs-right">
                        <i className="ion-heart"></i> {article.favoritesCount}
                      </button>
                    </div>
                    <a href={`/article/${article.slug}`} className="preview-link">
                      <h1>{article.title}</h1>
                      <p>{article.description}</p>
                      <span>Read more...</span>
                      <ul className="tag-list">
                        {article.tagList.map((tag) => (
                          <li key={tag} className="tag-default tag-pill tag-outline">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </a>
                  </div>
                ))}

                {totalPages.length > 1 && (
                  <ul className="pagination">
                    {totalPages.map((page) => (
                      <li
                        key={page}
                        className={`page-item${page === currentPage ? ' active' : ''}`}
                      >
                        <a
                          className="page-link"
                          onClick={() => setCurrentPage(page)}
                          style={{ cursor: 'pointer' }}
                        >
                          {page}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
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
                      onClick={() => setListTo('all', tag)}
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
