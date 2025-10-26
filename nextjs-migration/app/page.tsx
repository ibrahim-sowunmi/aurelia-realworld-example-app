"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { articleService } from "@/lib/services/articles";
import { tagService } from "@/lib/services/tags";
import { Article } from "@/types";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [shownList, setShownList] = useState<'all' | 'feed'>('all');
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    getArticles();
    getTags();
  }, []);

  useEffect(() => {
    getArticles();
  }, [shownList, filterTag, currentPage]);

  async function getArticles() {
    const params: Record<string, any> = {
      limit,
      offset: limit * (currentPage - 1)
    };
    
    if (filterTag !== undefined) {
      params.tag = filterTag;
    }

    try {
      const response = await articleService.getList(shownList, params);
      setArticles(response.articles);
      
      const pages = Array.from(
        new Array(Math.ceil(response.articlesCount / limit)), 
        (val, index) => index + 1
      );
      setTotalPages(pages);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }

  async function getTags() {
    try {
      const response = await tagService.getList();
      setTags(response);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  function setListTo(type: 'all' | 'feed', tag?: string) {
    if (type === 'feed' && !isAuthenticated) return;
    setShownList(type);
    setFilterTag(tag);
    setCurrentPage(1);
  }

  function getFeedLinkClass() {
    let classes = '';
    if (!isAuthenticated) classes += ' disabled';
    if (shownList === 'feed') classes += ' active';
    return classes;
  }

  function setPageTo(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

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

            {/* Article List */}
            <div>
              {articles.length === 0 ? (
                <div className="article-preview">No articles are here... yet.</div>
              ) : (
                <>
                  {articles.map(article => (
                    <div className="article-preview" key={article.slug}>
                      <div className="article-meta">
                        <Link href={`/${article.author.username}`}>
                          <img src={article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} alt={article.author.username} />
                        </Link>
                        <div className="info">
                          <Link href={`/${article.author.username}`} className="author">
                            {article.author.username}
                          </Link>
                          <span className="date">
                            {new Date(article.createdAt).toDateString()}
                          </span>
                        </div>
                        <button className={`btn btn-sm pull-xs-right ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}>
                          <i className="ion-heart"></i> {article.favoritesCount}
                        </button>
                      </div>
                      <Link href={`/article/${article.slug}`} className="preview-link">
                        <h1>{article.title}</h1>
                        <p>{article.description}</p>
                        <span>Read more...</span>
                        {article.tagList.length > 0 && (
                          <ul className="tag-list">
                            {article.tagList.map(tag => (
                              <li className="tag-default tag-pill tag-outline" key={tag}>
                                {tag}
                              </li>
                            ))}
                          </ul>
                        )}
                      </Link>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages.length > 1 && (
                    <nav>
                      <ul className="pagination">
                        {totalPages.map(page => (
                          <li className={`page-item${currentPage === page ? ' active' : ''}`} key={page}>
                            <a 
                              className="page-link" 
                              onClick={() => setPageTo(page)}
                              style={{ cursor: 'pointer' }}
                            >
                              {page}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {tags.map(tag => (
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
