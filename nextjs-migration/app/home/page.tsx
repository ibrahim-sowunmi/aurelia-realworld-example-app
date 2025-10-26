'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [shownList, setShownList] = useState<'all' | 'feed'>('all');
  const [tags, setTags] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const limit = 10;

  useEffect(() => {
    getArticles();
    getTags();
  }, []);

  useEffect(() => {
    getArticles();
  }, [currentPage, shownList, filterTag]);

  const getArticles = async () => {
    const params: any = {
      limit,
      offset: limit * (currentPage - 1)
    };
    if (filterTag !== undefined) {
      params.tag = filterTag;
    }
    setArticles([]);
    setTotalPages([]);
  };

  const getTags = async () => {
    setTags([]);
  };

  const setListTo = (type: 'feed' | 'all', tag?: string) => {
    if (type === 'feed' && !isAuthenticated) return;
    setShownList(type);
    setFilterTag(tag);
    setCurrentPage(1);
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
                      <i className="ion-pound"></i>
                      {filterTag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div className="article-preview" key="loading">
              {articles.length === 0 ? (
                <div>No articles are here... yet.</div>
              ) : (
                articles.map((article, index) => (
                  <div key={index} className="article-preview">
                    <div className="article-meta">
                      <a href={`/profile/${article.author?.username}`}>
                        <img src={article.author?.image} alt={article.author?.username} />
                      </a>
                      <div className="info">
                        <a href={`/profile/${article.author?.username}`} className="author">
                          {article.author?.username}
                        </a>
                        <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button className={`btn btn-sm pull-xs-right ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}>
                        <i className="ion-heart"></i> {article.favoritesCount}
                      </button>
                    </div>
                    <a href={`/article/${article.slug}`} className="preview-link">
                      <h1>{article.title}</h1>
                      <p>{article.description}</p>
                      <span>Read more...</span>
                      {article.tagList && article.tagList.length > 0 && (
                        <ul className="tag-list">
                          {article.tagList.map((tag: string, tagIndex: number) => (
                            <li key={tagIndex} className="tag-default tag-pill tag-outline">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </a>
                  </div>
                ))
              )}
            </div>

            {totalPages.length > 1 && (
              <nav>
                <ul className="pagination">
                  {totalPages.map((page) => (
                    <li
                      key={page}
                      className={`page-item${page === currentPage ? ' active' : ''}`}
                      onClick={() => setPageTo(page)}
                      style={{ cursor: 'pointer' }}
                    >
                      <a className="page-link">{page}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {tags.map((tag) => (
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
