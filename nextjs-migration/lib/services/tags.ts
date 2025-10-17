import { api } from '../api';
import type { TagsResponse } from '@/types';

export const tagService = {
  async getList(): Promise<string[]> {
    const response = await api.get<TagsResponse>('/tags');
    return response.tags;
  },
};
