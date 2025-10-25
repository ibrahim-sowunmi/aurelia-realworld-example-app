import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AuthComponent from '@/app/components/auth/AuthComponent';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AuthComponent', () => {
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      isAuthenticated: false,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Login mode', () => {
    it('should render login form', () => {
      render(<AuthComponent type="login" />);
      
      expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('should have link to register', () => {
      render(<AuthComponent type="login" />);
      
      expect(screen.getByText('Need an account?')).toBeInTheDocument();
    });

    it('should call login on form submit', async () => {
      mockLogin.mockResolvedValue(undefined);
      
      render(<AuthComponent type="login" />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /Sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      });
    });
  });

  describe('Register mode', () => {
    it('should render register form', () => {
      render(<AuthComponent type="register" />);
      
      expect(screen.getByRole('heading', { name: /Sign up/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('should have link to login', () => {
      render(<AuthComponent type="register" />);
      
      expect(screen.getByText('Have an account?')).toBeInTheDocument();
    });

    it('should call register on form submit', async () => {
      mockRegister.mockResolvedValue(undefined);
      
      render(<AuthComponent type="register" />);
      
      const usernameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /Sign up/i });

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({ username: 'testuser', email: 'test@example.com', password: 'password123' });
      });
    });
  });
});
