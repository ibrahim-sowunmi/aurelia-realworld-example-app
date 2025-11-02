import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
const mockLogin = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../../../lib/state/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

import LoginPage from '../../../app/login/page';

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin.mockResolvedValue(undefined);
  });

  test('renders login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/need an account/i)).toBeInTheDocument();
  });

  test('submit button is disabled when fields are empty', () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    expect(submitButton).not.toBeDisabled();
  });

  test('calls login and redirects on successful submission', async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await screen.findByText('Invalid credentials');
    expect(mockPush).not.toHaveBeenCalled();
  });
});
