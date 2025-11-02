import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../../../app/_components/Home/HomePage';
import { articleService } from '../../../lib/services/articles';
import { useAuth } from '../../../lib/state/AuthContext';

jest.mock('../../../lib/services/articles', () => ({
  articleService: {
    getList: jest.fn(),
  }
}));

jest.mock('../../../lib/state/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../app/_components/Home/Banner', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="home-banner">Banner</div>),
}));

jest.mock('../../../app/_components/Home/FeedToggle', () => ({
  __esModule: true,
  default: jest.fn(({ onFeedSelect }) => (
    <div data-testid="feed-toggle">
      <button data-testid="global-feed" onClick={() => onFeedSelect('all')}>Global Feed</button>
      <button data-testid="your-feed" onClick={() => onFeedSelect('feed')}>Your Feed</button>
      <button data-testid="tag-feed" onClick={() => onFeedSelect('all', 'tag1')}>Tag Feed</button>
    </div>
  )),
}));

jest.mock('../../../app/_components/ArticleList', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="article-list">Article List</div>),
}));

jest.mock('../../../app/_components/Home/TagList', () => ({
  __esModule: true,
  default: jest.fn(({ onTagSelect }) => (
    <div data-testid="tag-list">
      <button onClick={() => onTagSelect('tag1')}>tag1</button>
    </div>
  )),
}));

describe('HomePage', () => {
  const mockArticles = [
    {
      slug: 'test-article-1',
      title: 'Test Article 1',
      description: 'Test description 1',
      body: 'Test body 1',
      tagList: ['tag1', 'tag2'],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      favorited: false,
      favoritesCount: 5,
      author: {
        username: 'author1',
        bio: 'Author 1 Bio',
        image: 'https://example.com/author1.jpg',
        following: false
      }
    }
  ];

  const mockTags = ['tag1', 'tag2', 'tag3'];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });
    (articleService.getList as jest.Mock).mockResolvedValue({
      articles: mockArticles,
      articlesCount: 1
    });
  });

  test('renders homepage with all components', () => {
    render(<HomePage initialArticles={mockArticles} initialArticlesCount={1} initialTags={mockTags} />);
    
    expect(screen.getByTestId('home-banner')).toBeInTheDocument();
    expect(screen.getByTestId('feed-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('article-list')).toBeInTheDocument();
    expect(screen.getByTestId('tag-list')).toBeInTheDocument();
  });

  test('loads articles when initialized without data', async () => {
    render(<HomePage />);
    
    expect(articleService.getList).toHaveBeenCalledWith('all', {
      limit: 10,
      offset: 0,
    });
  });

  test('changes feed when feed toggle is clicked', () => {
    render(<HomePage initialArticles={mockArticles} initialArticlesCount={1} initialTags={mockTags} />);
    
    expect(screen.getByText('Global Feed')).toBeInTheDocument();
    expect(screen.getByText('Your Feed')).toBeInTheDocument();
    expect(screen.getByText('Tag Feed')).toBeInTheDocument();
  });

  test('adds tag parameter when tag is selected', async () => {
    render(<HomePage initialArticles={mockArticles} initialArticlesCount={1} initialTags={mockTags} />);
    
    fireEvent.click(screen.getByText('tag1'));
    
    await waitFor(() => {
      expect(articleService.getList).toHaveBeenCalledWith('all', {
        limit: 10,
        offset: 0,
        tag: 'tag1'
      });
    });
  });

  test('does not allow unauthenticated users to access personal feed', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });
    
    render(<HomePage initialArticles={mockArticles} initialArticlesCount={1} initialTags={mockTags} />);
    
    fireEvent.click(screen.getByText('Your Feed'));
    
    expect(articleService.getList).not.toHaveBeenCalledWith('feed', expect.anything());
  });
});
