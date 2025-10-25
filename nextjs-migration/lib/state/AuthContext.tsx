'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '@/lib/services/user';
import { jwtService } from '@/lib/jwt';
import type { User, LoginCredentials, RegisterCredentials, UpdateUserData } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (userData: UpdateUserData) => Promise<void>;
  populate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const populate = useCallback(async () => {
    if (jwtService.getToken()) {
      try {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to populate user:', error);
        jwtService.destroyToken();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    populate();
  }, [populate]);

  const login = async (credentials: LoginCredentials) => {
    const loggedInUser = await userService.login(credentials);
    setUser(loggedInUser);
  };

  const register = async (credentials: RegisterCredentials) => {
    const registeredUser = await userService.register(credentials);
    setUser(registeredUser);
  };

  const logout = () => {
    userService.logout();
    setUser(null);
  };

  const updateUser = async (userData: UpdateUserData) => {
    const updatedUser = await userService.updateUser(userData);
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    populate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
