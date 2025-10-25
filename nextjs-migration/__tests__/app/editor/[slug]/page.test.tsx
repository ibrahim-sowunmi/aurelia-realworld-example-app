import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

const mockPush = jest.fn();
const mockGetArticle = jest.fn();
const mockCreateArticle = jest.fn();
const mockUpdateArticle = jest.fn();

const mockParams = { slug: 'new' };
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => mockParams,
}));

jest.mock('@/lib/state/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

jest.mock('@/lib/services/articles', () => ({
  articleService: {
    getArticle: mockGetArticle,
    createArticle: mockCreateArticle,
    updateArticle: mockUpdateArticle,
  },
}));

import EditorPage from '../../../../app/editor/[slug]/page';

describe('EditorPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateArticle.mockResolvedValue({ slug: 'new-article-slug' });
    mockUpdateArticle.mockResolvedValue({ slug: 'updated-article-slug' });
    mockGetArticle.mockResolvedValue({
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: ['tag1', 'tag2'],
    });
  });

  test('renders editor form for new article', () => {
    mockParams.slug = 'new';
    render(<EditorPage />);
    
    expect(screen.getByPlaceholderText('Article Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What\'s this article about?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your article (in markdown)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter tags')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish article/i })).toBeInTheDocument();
    
    expect(mockGetArticle).not.toHaveBeenCalled();
  });

  test('loads and renders existing article data', async () => {
    mockParams.slug = 'existing-slug';
    render(<EditorPage />);
    
    await waitFor(() => {
      expect(mockGetArticle).toHaveBeenCalledWith('existing-slug');
    });
    
    expect(screen.getByDisplayValue('Test Article')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Body')).toBeInTheDocument();
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  test('adds tag when pressing Enter', async () => {
    mockParams.slug = 'new';
    render(<EditorPage />);
    
    const tagInput = screen.getByPlaceholderText('Enter tags');
    
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: 'newtag' } });
      fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    });
    
    expect(screen.getByText('newtag')).toBeInTheDocument();
    expect(tagInput).toHaveValue(''); // Input should clear after adding tag
  });

  test('removes tag when clicking remove icon', async () => {
    mockParams.slug = 'existing-slug';
    render(<EditorPage />);
    
    await waitFor(() => {
      expect(screen.getByText('tag1')).toBeInTheDocument();
    });
    
    const removeIcon = screen.getAllByRole('img', { hidden: true })[0]; // Get the first remove icon (ion-close-round)
    
    await act(async () => {
      fireEvent.click(removeIcon);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('tag1')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('tag2')).toBeInTheDocument(); // Other tags should remain
  });

  test('creates new article on form submission', async () => {
    mockParams.slug = 'new';
    render(<EditorPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Article Title'), {
        target: { value: 'New Title' },
      });
      fireEvent.change(screen.getByPlaceholderText('What\'s this article about?'), {
        target: { value: 'New Description' },
      });
      fireEvent.change(screen.getByPlaceholderText('Write your article (in markdown)'), {
        target: { value: 'New Body Content' },
      });
    });
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter tags'), {
        target: { value: 'newtag' },
      });
      fireEvent.keyDown(screen.getByPlaceholderText('Enter tags'), { key: 'Enter', code: 'Enter' });
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /publish article/i }));
    });
    
    expect(mockCreateArticle).toHaveBeenCalledWith({
      title: 'New Title',
      description: 'New Description',
      body: 'New Body Content',
      tagList: ['newtag'],
    });
    
    expect(mockPush).toHaveBeenCalledWith('/article/new-article-slug');
  });

  test('updates existing article on form submission', async () => {
    mockParams.slug = 'existing-slug';
    render(<EditorPage />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Article')).toBeInTheDocument();
    });
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Article Title'), {
        target: { value: 'Updated Title' },
      });
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /publish article/i }));
    });
    
    expect(mockUpdateArticle).toHaveBeenCalledWith('existing-slug', {
      title: 'Updated Title',
      description: 'Test Description',
      body: 'Test Body',
      tagList: ['tag1', 'tag2'],
    });
    
    expect(mockPush).toHaveBeenCalledWith('/article/updated-article-slug');
  });

  test('displays error message on save failure', async () => {
    mockParams.slug = 'new';
    mockCreateArticle.mockRejectedValue(new Error('Failed to create article'));
    
    render(<EditorPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Article Title'), {
        target: { value: 'New Title' },
      });
      fireEvent.change(screen.getByPlaceholderText('What\'s this article about?'), {
        target: { value: 'New Description' },
      });
      fireEvent.change(screen.getByPlaceholderText('Write your article (in markdown)'), {
        target: { value: 'New Body Content' },
      });
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /publish article/i }));
    });
    
    await screen.findByText('Failed to create article');
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('redirects to login if user is not authenticated', async () => {
    jest.spyOn(require('@/lib/state/AuthContext'), 'useAuth').mockReturnValue({
      isAuthenticated: false,
    });
    
    render(<EditorPage />);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
