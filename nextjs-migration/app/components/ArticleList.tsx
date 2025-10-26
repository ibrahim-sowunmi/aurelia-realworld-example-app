'use client';

import { Article } from '@/types';
import ArticlePreview from './ArticlePreview';

interface ArticleListProps {
  articles: Article[];
  totalPages: number[];
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export default function ArticleList({ 
  articles, 
  totalPages, 
  currentPage, 
  onPageChange 
}: ArticleListProps) {
  const handleArticleUpdate = (updatedArticle: Article) => {
  };

  return (
    <>
      {articles.length === 0 ? (
        <div className="article-preview">
          No articles are here... yet.
        </div>
      ) : (
        articles.map((article) => (
          <ArticlePreview 
            key={article.slug} 
            article={article} 
            onToggleFavorite={handleArticleUpdate}
          />
        ))
      )}

      {totalPages.length > 1 && (
        <nav>
          <ul className="pagination">
            {totalPages.map((pageNumber) => (
              <li 
                key={pageNumber}
                className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(pageNumber)}
              >
                <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>
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
