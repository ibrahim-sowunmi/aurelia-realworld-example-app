import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/services/user';
import { jwtService } from '@/lib/jwt';

jest.mock('@/lib/services/user', () => ({
  userService: {
    login: jest.fn(),
    register: jest.fn(),
    updateUser: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock('@/lib/jwt', () => ({
  jwtService: {
    getToken: jest.fn(),
    saveToken: jest.fn(),
    destroyToken: jest.fn(),
    getAuthorizationHeader: jest.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (jwtService.getToken as jest.Mock).mockReturnValue(null);
  });

  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should authenticate user on login', async () => {
    const mockUser = {
      email: 'test@example.com',
      token: 'mock-token',
      username: 'testuser',
      bio: 'Test bio',
      image: 'https://example.com/avatar.jpg',
    };

    (userService.login as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should clear user on logout', async () => {
    const mockUser = {
      email: 'test@example.com',
      token: 'mock-token',
      username: 'testuser',
      bio: 'Test bio',
      image: 'https://example.com/avatar.jpg',
    };

    (userService.login as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
