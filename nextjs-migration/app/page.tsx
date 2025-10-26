'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/lib/services/articles';
import { tagService } from '@/lib/services/tags';
import type { Article } from '@/types';

interface ArticleListProps {
  articles: Article[];
  totalPages: number[];
  currentPage: number;
  setPage: (pageNumber: number) => void;
}

function ArticleList({ articles, totalPages, currentPage, setPage }: ArticleListProps) {
  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <div className="article-preview" key={article.slug}>
          <div className="article-meta">
            <Link href={`/${article.author.username}`}>
              <img src={article.author.image || '/placeholder.png'} alt={article.author.username} />
            </Link>
            <div className="info">
              <Link href={`/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{new Date(article.createdAt).toDateString()}</span>
            </div>
            <button className={`btn btn-sm pull-xs-right ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}>
              <i className="ion-heart"></i> {article.favoritesCount}
            </button>
          </div>
          <Link href={`/article/${article.slug}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <span>Read more...</span>
            <ul className="tag-list">
              {article.tagList.map(tag => (
                <li className="tag-default tag-pill tag-outline" key={tag}>{tag}</li>
              ))}
            </ul>
          </Link>
        </div>
      ))}

      {totalPages.length > 1 && (
        <nav>
          <ul className="pagination">
            {totalPages.map(pageNumber => (
              <li 
                key={pageNumber}
                className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
              >
                <a 
                  className="page-link" 
                  onClick={() => setPage(pageNumber)}
                  style={{ cursor: 'pointer' }}
                >
                  {pageNumber}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [shownList, setShownList] = useState<'all' | 'feed'>('all');
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [limit] = useState(10);

  const getArticles = async () => {
    const params: {
      limit: number;
      offset: number;
      tag?: string;
    } = {
      limit,
      offset: limit * (currentPage - 1)
    };
    
    if (filterTag) {
      params.tag = filterTag;
    }
    
    try {
      const response = await articleService.getList(shownList, params);
      setArticles(response.articles);
      
      const pageCount = Math.ceil(response.articlesCount / limit);
      setTotalPages(Array.from({ length: pageCount }, (_, i) => i + 1));
    } catch (error) {
      console.error('Failed to fetch articles:', error);
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

  useEffect(() => {
    getArticles();
    getTags();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    getArticles();
  }, [shownList, filterTag, currentPage]);

  const setListTo = (type: 'all' | 'feed', tag?: string) => {
    if (type === 'feed' && !isAuthenticated) return;
    setShownList(type);
    setFilterTag(tag);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const setPageTo = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getFeedLinkClass = (type: 'all' | 'feed') => {
    let className = 'nav-link';
    
    if (type === 'feed') {
      if (!isAuthenticated) {
        className += ' disabled';
      }
      if (shownList === 'feed' && !filterTag) {
        className += ' active';
      }
    } else if (type === 'all') {
      if (shownList === 'all' && !filterTag) {
        className += ' active';
      }
    }
    
    return className;
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
                      className={getFeedLinkClass('feed')}
                      onClick={() => setListTo('feed', undefined)}
                      style={{ cursor: 'pointer' }}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a 
                    className={getFeedLinkClass('all')}
                    onClick={() => setListTo('all', undefined)}
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

            <ArticleList 
              articles={articles}
              totalPages={totalPages}
              currentPage={currentPage}
              setPage={setPageTo}
            />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tags.map(tag => (
                  <a 
                    key={tag} 
                    className="tag-pill tag-default"
                    onClick={() => setListTo('all', tag)}
                    style={{ cursor: 'pointer' }}
                  >
                    {tag}
                  </a>
                ))}
                {tags.length === 0 && <div>No tags are here... yet.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
