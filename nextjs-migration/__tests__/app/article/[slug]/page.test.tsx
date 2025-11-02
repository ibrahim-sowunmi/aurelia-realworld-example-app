import { notFound } from 'next/navigation';
import { render } from '@testing-library/react';
import ArticlePage from '../../../../app/article/[slug]/page';
import { articleService } from '../../../../lib/services/articles';
import { commentService } from '../../../../lib/services/comments';
import type { Article, Comment } from '@/types';

const mockNotFound = jest.fn();
const mockGetArticle = jest.fn() as jest.Mock<Promise<Article>, [string]>;
const mockGetComments = jest.fn() as jest.Mock<Promise<Comment[]>, [string]>;

jest.mock('next/navigation', () => ({
  notFound: mockNotFound,
}));

jest.mock('../../../../app/_components/Article/ArticleContent', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="article-content">Article Content</div>),
}));

jest.mock('../../../../lib/services/articles', () => ({
  articleService: {
    getArticle: mockGetArticle,
  },
}));

jest.mock('../../../../lib/services/comments', () => ({
  commentService: {
    getComments: mockGetComments,
  },
}));

describe('ArticlePage', () => {
  const mockArticle: Article = {
    slug: 'test-article',
    title: 'Test Article',
    body: 'Test body content',
    description: 'Test description',
    tagList: ['tag1', 'tag2'],
    createdAt: '2023-01-01T12:00:00.000Z',
    updatedAt: '2023-01-01T12:00:00.000Z',
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'testuser',
      bio: 'Test bio',
      image: 'https://example.com/image.jpg',
      following: false,
    },
  };

  const mockComments: Comment[] = [
    {
      id: 1,
      body: 'Test comment',
      createdAt: '2023-01-02T12:00:00.000Z',
      updatedAt: '2023-01-02T12:00:00.000Z',
      author: {
        username: 'commentuser',
        bio: 'Commenter bio',
        image: 'https://example.com/commenter.jpg',
        following: false,
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetArticle.mockResolvedValue(mockArticle);
    mockGetComments.mockResolvedValue(mockComments);
  });

  it('renders ArticleContent with article and comments data', async () => {
    const params = { slug: 'test-article' };
    
    const ArticleComponent = await ArticlePage({ params });
    const { getByTestId } = render(ArticleComponent);
    
    expect(getByTestId('article-content')).toBeInTheDocument();
    
    expect(mockGetArticle).toHaveBeenCalledWith('test-article');
    expect(mockGetComments).toHaveBeenCalledWith('test-article');
  });

  it('calls notFound when article fetch fails', async () => {
    mockGetArticle.mockRejectedValue(new Error('Article not found'));
    
    const params = { slug: 'non-existent-article' };
    
    await ArticlePage({ params });
    
    expect(mockNotFound).toHaveBeenCalled();
  });
});
