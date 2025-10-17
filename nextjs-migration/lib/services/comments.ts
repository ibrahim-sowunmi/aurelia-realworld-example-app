import { api } from '../api';
import type { Comment, CommentsResponse, CreateCommentData } from '@/types';

export const commentService = {
  async getComments(slug: string): Promise<Comment[]> {
    const response = await api.get<CommentsResponse>(
      `/articles/${slug}/comments`
    );
    return response.comments;
  },

  async createComment(slug: string, data: CreateCommentData): Promise<Comment> {
    const response = await api.post<{ comment: Comment }>(
      `/articles/${slug}/comments`,
      { comment: data }
    );
    return response.comment;
  },

  async deleteComment(slug: string, commentId: number): Promise<void> {
    await api.delete(`/articles/${slug}/comments/${commentId}`);
  },
};
