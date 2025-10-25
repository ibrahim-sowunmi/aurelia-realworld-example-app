import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArticleContent from '../../../app/_components/Article/ArticleContent';
import { commentService } from '@/lib/services/comments';

jest.mock('@/lib/state/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      username: 'testuser',
    }
  }),
}));

jest.mock('@/lib/services/comments', () => ({
  commentService: {
    createComment: jest.fn(),
    deleteComment: jest.fn(),
  }
}));

const mockCreateComment = commentService.createComment as jest.Mock;
const mockDeleteComment = commentService.deleteComment as jest.Mock;

describe('ArticleContent', () => {
  const mockArticle = {
    slug: 'test-article',
    title: 'Test Article',
    description: 'Test Description',
    body: '# Test Body\n\nWith markdown content',
    tagList: ['tag1', 'tag2'],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    favorited: false,
    favoritesCount: 5,
    author: {
      username: 'author',
      bio: 'Author Bio',
      image: 'https://example.com/avatar.jpg',
      following: false
    }
  };

  const mockComments = [
    {
      id: 1,
      body: 'Test comment 1',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
      author: {
        username: 'commenter1',
        bio: 'Commenter 1 Bio',
        image: 'https://example.com/commenter1.jpg',
        following: false
      }
    },
    {
      id: 2,
      body: 'Test comment 2',
      createdAt: '2023-01-03T00:00:00.000Z',
      updatedAt: '2023-01-03T00:00:00.000Z',
      author: {
        username: 'testuser', // Same as logged in user
        bio: 'Commenter 2 Bio',
        image: 'https://example.com/commenter2.jpg',
        following: false
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateComment.mockResolvedValue({
      id: 3,
      body: 'New comment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        username: 'testuser',
        bio: 'Test user Bio',
        image: 'https://example.com/testuser.jpg',
        following: false
      }
    });
    mockDeleteComment.mockResolvedValue({});
  });

  test('renders article content correctly', () => {
    render(<ArticleContent article={mockArticle} initialComments={mockComments} />);
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    
    expect(screen.getByRole('heading', { level: 1, name: 'Test Body' })).toBeInTheDocument();
    expect(screen.getByText('With markdown content')).toBeInTheDocument();
    
    expect(screen.getByText('Test comment 1')).toBeInTheDocument();
    expect(screen.getByText('Test comment 2')).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
  });

  test('adds a new comment when submitted', async () => {
    render(<ArticleContent article={mockArticle} initialComments={mockComments} />);
    
    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    fireEvent.change(commentInput, { target: { value: 'New comment' } });
    
    const submitButton = screen.getByRole('button', { name: /post comment/i });
    fireEvent.click(submitButton);
    
    expect(mockCreateComment).toHaveBeenCalledWith('test-article', { body: 'New comment' });
    
    await waitFor(() => {
      expect(screen.getByText('New comment')).toBeInTheDocument();
    });
  });

  test('deletes a comment when delete button is clicked', async () => {
    render(<ArticleContent article={mockArticle} initialComments={mockComments} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete comment/i });
    expect(deleteButtons.length).toBe(1); // Only the comment by current user should have delete button
    
    fireEvent.click(deleteButtons[0]);
    
    expect(mockDeleteComment).toHaveBeenCalledWith('test-article', 2);
    
    await waitFor(() => {
      expect(screen.queryByText('Test comment 2')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Test comment 1')).toBeInTheDocument();
  });

  test('handles empty comments array correctly', () => {
    render(<ArticleContent article={mockArticle} initialComments={[]} />);
    
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
  });

  test('renders correctly when user is not authenticated', () => {
    jest.spyOn(require('@/lib/state/AuthContext'), 'useAuth').mockReturnValue({
      isAuthenticated: false,
      user: null
    });
    
    render(<ArticleContent article={mockArticle} initialComments={mockComments} />);
    
    expect(screen.queryByPlaceholderText(/write a comment/i)).not.toBeInTheDocument();
    
    expect(screen.getByText(/sign in or sign up to add comments/i)).toBeInTheDocument();
  });
});
