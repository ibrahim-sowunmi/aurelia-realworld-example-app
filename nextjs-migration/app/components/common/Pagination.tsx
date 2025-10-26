'use client';

import React from 'react';

interface PaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  itemsCount,
  itemsPerPage,
  currentPage,
  onPageChange
}: PaginationProps) {
  const pageCount = Math.ceil(itemsCount / itemsPerPage);
  
  if (pageCount <= 1) {
    return null;
  }
  
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="pagination">
        {pages.map(page => (
          <li 
            key={page} 
            className={`page-item ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>
              {page}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
