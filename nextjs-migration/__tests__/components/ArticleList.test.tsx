import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticleList from '@/app/_components/ArticleList';

jest.mock('@/app/_components/ArticlePreview', () => {
  return function MockArticlePreview({ article }: { article: any }) {
    return <div data-testid={`article-preview-${article.slug}`}>Mocked Article: {article.title}</div>;
  };
});

describe('ArticleList Component', () => {
  it('displays "No articles" message when empty', () => {
    render(
      <ArticleList
        articles={[]}
        totalCount={0}
        currentPage={1}
        onPageChange={() => {}}
      />
    );
    expect(screen.getByText('No articles are here... yet.')).toBeInTheDocument();
  });

  it('renders a list of articles when provided', () => {
    const mockArticles = [
      { 
        slug: 'test-article-1',
        title: 'Test Article 1',
        author: { username: 'testuser', image: '' },
        createdAt: '2023-01-01',
        favoritesCount: 5,
        tagList: ['test'],
        description: 'Test description'
      },
      { 
        slug: 'test-article-2',
        title: 'Test Article 2',
        author: { username: 'testuser2', image: '' },
        createdAt: '2023-01-02',
        favoritesCount: 10,
        tagList: ['test'],
        description: 'Test description 2'
      }
    ];
    
    render(
      <ArticleList
        articles={mockArticles}
        totalCount={2}
        currentPage={1}
        onPageChange={() => {}}
      />
    );
    
    expect(screen.getByTestId('article-preview-test-article-1')).toBeInTheDocument();
    expect(screen.getByTestId('article-preview-test-article-2')).toBeInTheDocument();
  });
});
