import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
const mockRegister = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../../../lib/state/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

import RegisterPage from '../../../app/register/page';

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister.mockResolvedValue(undefined);
  });

  test('renders register form', () => {
    render(<RegisterPage />);
    
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/have an account/i)).toBeInTheDocument();
  });

  test('submit button is disabled when fields are empty', () => {
    render(<RegisterPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    expect(submitButton).not.toBeDisabled();
  });

  test('calls register and redirects on successful submission', async () => {
    render(<RegisterPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(mockRegister).toHaveBeenCalledWith({ 
      username: 'testuser', 
      email: 'test@example.com', 
      password: 'password' 
    });
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message on registration failure', async () => {
    mockRegister.mockRejectedValue(new Error('Email already taken'));
    
    render(<RegisterPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await screen.findByText('Email already taken');
    expect(mockPush).not.toHaveBeenCalled();
  });
});
