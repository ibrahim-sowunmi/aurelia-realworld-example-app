import { api } from '../api';
import { jwtService } from '../jwt';
import type {
  User,
  UserResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateUserData,
} from '@/types';

export const userService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get<UserResponse>('/user');
    return response.user;
  },

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post<UserResponse>('/users/login', {
      user: credentials,
    });
    jwtService.saveToken(response.user.token);
    return response.user;
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    const response = await api.post<UserResponse>('/users', {
      user: credentials,
    });
    jwtService.saveToken(response.user.token);
    return response.user;
  },

  async updateUser(userData: UpdateUserData): Promise<User> {
    const response = await api.put<UserResponse>('/user', {
      user: userData,
    });
    return response.user;
  },

  logout(): void {
    jwtService.destroyToken();
  },
};
