import { render, screen, fireEvent } from '@testing-library/react';
import ArticlePreview from '../ArticlePreview';
import { useAuth } from '../../../../contexts/AuthContext';
import { articleService } from '../../../../lib/services/articles';

jest.mock('../../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../../lib/services/articles', () => ({
  articleService: {
    favoriteArticle: jest.fn(),
    unfavoriteArticle: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('ArticlePreview', () => {
  const mockArticle = {
    slug: 'test-article',
    title: 'Test Article',
    description: 'This is a test article',
    body: 'Test body content',
    tagList: ['test', 'article'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'testauthor',
      bio: 'Test bio',
      image: 'https://example.com/image.jpg',
      following: false
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders article preview correctly', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(<ArticlePreview article={mockArticle} />);

    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('This is a test article')).toBeInTheDocument();
    expect(screen.getByText('testauthor')).toBeInTheDocument();
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
