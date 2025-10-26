import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticlePreview from '../ArticlePreview';
import { Article } from '../../../types';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the AuthContext
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
  }),
}));

describe('ArticlePreview Component', () => {
  const mockArticle: Article = {
    slug: 'test-article',
    title: 'Test Article',
    description: 'This is a test article',
    body: 'Test content',
    tagList: ['test', 'article'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'testuser',
      bio: null,
      image: null,
      following: false
    }
  };

  it('renders article title and description', () => {
    render(<ArticlePreview article={mockArticle} />);
    
    const titleElement = screen.getByText('Test Article');
    const descriptionElement = screen.getByText('This is a test article');
    expect(titleElement).toBeTruthy();
    expect(descriptionElement).toBeTruthy();
  });

  it('displays author information', () => {
    render(<ArticlePreview article={mockArticle} />);
    
    const usernameElement = screen.getByText('testuser');
    expect(usernameElement).toBeTruthy();
  });

  it('renders tags', () => {
    render(<ArticlePreview article={mockArticle} />);
    
    const testTag = screen.getByText('test');
    const articleTag = screen.getByText('article');
    expect(testTag).toBeTruthy();
    expect(articleTag).toBeTruthy();
  });
});
