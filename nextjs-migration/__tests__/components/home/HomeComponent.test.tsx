import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/lib/services/articles';
import { tagService } from '@/lib/services/tags';
import HomeComponent from '@/app/components/home/HomeComponent';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/services/articles', () => ({
  articleService: {
    getList: jest.fn(),
  },
}));

jest.mock('@/lib/services/tags', () => ({
  tagService: {
    getList: jest.fn(),
  },
}));

describe('HomeComponent', () => {
  const mockArticles = {
    articles: [
      {
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test description',
        body: 'Test body',
        tagList: ['test'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'testuser',
          bio: 'Test bio',
          image: 'https://example.com/avatar.jpg',
          following: false,
        },
      },
    ],
    articlesCount: 1,
  };

  const mockTags = ['test', 'react', 'nextjs'];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    (articleService.getList as jest.Mock).mockResolvedValue(mockArticles);
    (tagService.getList as jest.Mock).mockResolvedValue(mockTags);
  });

  it('should render home page banner', async () => {
    render(<HomeComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('conduit')).toBeInTheDocument();
      expect(screen.getByText('A place to share your knowledge.')).toBeInTheDocument();
    });
  });

  it('should display Global Feed by default', async () => {
    render(<HomeComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Global Feed')).toBeInTheDocument();
    });
  });

  it('should load and display articles', async () => {
    render(<HomeComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
  });

  it('should load and display popular tags', async () => {
    render(<HomeComponent />);
    
    await waitFor(() => {
      const testTags = screen.getAllByText('test');
      const reactTags = screen.getAllByText('react');
      const nextjsTags = screen.getAllByText('nextjs');
      
      expect(testTags.length).toBeGreaterThan(0);
      expect(reactTags.length).toBeGreaterThan(0);
      expect(nextjsTags.length).toBeGreaterThan(0);
    });
  });

  it('should show Your Feed when authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { username: 'testuser' },
    });

    render(<HomeComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Your Feed')).toBeInTheDocument();
      expect(screen.getByText('Global Feed')).toBeInTheDocument();
    });
  });
});
