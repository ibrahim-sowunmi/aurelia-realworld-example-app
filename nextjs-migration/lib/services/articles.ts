import { api } from '../api';
import type {
  Article,
  ArticlesResponse as ArticleListResponse,
  SingleArticleResponse,
  CreateArticleData,
  UpdateArticleData,
} from '../../types';

export const articleService = {
  async getList(
    type: 'all' | 'feed' = 'all',
    params?: {
      limit?: number;
      offset?: number;
      tag?: string;
      author?: string;
      favorited?: string;
    }
  ): Promise<ArticleListResponse> {
    const endpoint = type === 'feed' ? '/articles/feed' : '/articles';
    return api.get<ArticleListResponse>(endpoint, params);
  },

  async getArticle(slug: string): Promise<Article> {
    const response = await api.get<SingleArticleResponse>(`/articles/${slug}`);
    return response.article;
  },

  async createArticle(articleData: CreateArticleData): Promise<Article> {
    const response = await api.post<SingleArticleResponse>('/articles', {
      article: articleData,
    });
    return response.article;
  },

  async updateArticle(
    slug: string,
    articleData: UpdateArticleData
  ): Promise<Article> {
    const response = await api.put<SingleArticleResponse>(
      `/articles/${slug}`,
      { article: articleData }
    );
    return response.article;
  },

  async deleteArticle(slug: string): Promise<void> {
    await api.delete(`/articles/${slug}`);
  },

  async favoriteArticle(slug: string): Promise<Article> {
    const response = await api.post<SingleArticleResponse>(
      `/articles/${slug}/favorite`
    );
    return response.article;
  },

  async unfavoriteArticle(slug: string): Promise<Article> {
    const response = await api.delete<SingleArticleResponse>(
      `/articles/${slug}/favorite`
    );
    return response.article;
  },
};
