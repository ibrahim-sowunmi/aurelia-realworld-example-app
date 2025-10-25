import { notFound } from 'next/navigation';
import { render } from '@testing-library/react';
import ArticlePage from '../../../../app/article/[slug]/page';
import { articleService } from '../../../../lib/services/articles';
import { commentService } from '../../../../lib/services/comments';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('../../../../app/_components/Article/ArticleContent', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="article-content">Article Content</div>),
}));

jest.mock('../../../../lib/services/articles', () => ({
  articleService: {
    getArticle: jest.fn(),
  },
}));

jest.mock('../../../../lib/services/comments', () => ({
  commentService: {
    getComments: jest.fn(),
  },
}));

describe('ArticlePage', () => {
  const mockArticle = {
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

  const mockComments = [
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
    articleService.getArticle.mockResolvedValue(mockArticle);
    commentService.getComments.mockResolvedValue(mockComments);
  });

  it('renders ArticleContent with article and comments data', async () => {
    const params = { slug: 'test-article' };
    
    const ArticleComponent = await ArticlePage({ params });
    const { getByTestId } = render(ArticleComponent);
    
    expect(getByTestId('article-content')).toBeInTheDocument();
    
    expect(articleService.getArticle).toHaveBeenCalledWith('test-article');
    expect(commentService.getComments).toHaveBeenCalledWith('test-article');
  });

  it('calls notFound when article fetch fails', async () => {
    articleService.getArticle.mockRejectedValue(new Error('Article not found'));
    
    const params = { slug: 'non-existent-article' };
    
    await ArticlePage({ params });
    
    expect(notFound).toHaveBeenCalled();
  });
});
