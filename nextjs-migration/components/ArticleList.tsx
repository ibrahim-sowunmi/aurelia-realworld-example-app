'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Article } from '../types';

interface ArticleListProps {
  articles: Article[];
  totalPages: number[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function ArticleList({ 
  articles, 
  totalPages, 
  currentPage, 
  onPageChange 
}: ArticleListProps) {
  const router = useRouter();

  if (articles.length === 0) {
    return (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    );
  }

  return (
    <div>
      {articles.map(article => (
        <div className="article-preview" key={article.slug}>
          <div className="article-meta">
            <Link href={`/${article.author.username}`}>
              <img 
                src={article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} 
                alt={article.author.username} 
              />
            </Link>
            <div className="info">
              <Link href={`/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <button 
              className={`btn btn-sm pull-xs-right ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={e => {
                e.preventDefault();
                router.push(`/article/${article.slug}`);
              }}
            >
              <i className="ion-heart"></i> {article.favoritesCount}
            </button>
          </div>
          <Link href={`/article/${article.slug}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <span>Read more...</span>
            <ul className="tag-list">
              {article.tagList.map(tag => (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </Link>
        </div>
      ))}

      {totalPages.length > 1 && (
        <nav>
          <ul className="pagination">
            {totalPages.map(page => (
              <li 
                className={`page-item ${page === currentPage ? 'active' : ''}`} 
                key={page}
              >
                <button 
                  className="page-link" 
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
