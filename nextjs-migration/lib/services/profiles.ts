import { api } from '../api';
import type { Profile, ProfileResponse } from '@/types';

export const profileService = {
  async getProfile(username: string): Promise<Profile> {
    const response = await api.get<ProfileResponse>(
      `/profiles/${username}`,
      undefined,
      { next: { revalidate: 120, tags: [`profile-${username}`] } }
    );
    return response.profile;
  },

  async followProfile(username: string): Promise<Profile> {
    const response = await api.post<ProfileResponse>(
      `/profiles/${username}/follow`
    );
    return response.profile;
  },

  async unfollowProfile(username: string): Promise<Profile> {
    const response = await api.delete<ProfileResponse>(
      `/profiles/${username}/follow`
    );
    return response.profile;
  },
};
