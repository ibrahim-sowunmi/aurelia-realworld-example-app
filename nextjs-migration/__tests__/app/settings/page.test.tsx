import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

const mockPush = jest.fn();
const mockUpdateUser = jest.fn();
const mockLogout = jest.fn();
const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  bio: 'Test bio',
  image: 'https://example.com/avatar.jpg'
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../../../lib/state/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    updateUser: mockUpdateUser,
    logout: mockLogout
  }),
}));

import SettingsPage from '../../../app/settings/page';

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateUser.mockResolvedValue(undefined);
  });

  test('renders settings form with user data', () => {
    render(<SettingsPage />);
    
    expect(screen.getByRole('heading', { name: /your settings/i })).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('URL of profile picture')).toHaveValue(mockUser.image);
    expect(screen.getByPlaceholderText('Username')).toHaveValue(mockUser.username);
    expect(screen.getByPlaceholderText('Short bio about you')).toHaveValue(mockUser.bio);
    expect(screen.getByPlaceholderText('Email')).toHaveValue(mockUser.email);
    
    expect(screen.getByPlaceholderText('New Password')).toHaveValue('');
    
    expect(screen.getByRole('button', { name: /update settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('submit button is disabled when required fields are empty', async () => {
    render(<SettingsPage />);
    
    const submitButton = screen.getByRole('button', { name: /update settings/i });
    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    
    expect(submitButton).not.toBeDisabled();
    
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: '' } });
    });
    
    expect(submitButton).toBeDisabled();
    
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    });
    
    expect(usernameInput).toHaveValue('testuser');
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: '' } });
    });
    
    expect(submitButton).toBeDisabled();
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    });
    
    expect(submitButton).not.toBeDisabled();
  });

  test('calls updateUser and redirects to profile on successful submission', async () => {
    render(<SettingsPage />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'newusername' } });
    });
    
    expect(usernameInput).toHaveValue('newusername');
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /update settings/i }));
    });
    
    expect(mockUpdateUser).toHaveBeenCalledWith({
      image: 'https://example.com/avatar.jpg',
      username: 'newusername',
      bio: 'Test bio',
      email: 'test@example.com'
    });
    
    expect(mockPush).toHaveBeenCalledWith('/newusername');
  });

  test('includes password in update when provided', async () => {
    render(<SettingsPage />);
    
    fireEvent.change(screen.getByPlaceholderText('New Password'), {
      target: { value: 'newpassword123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /update settings/i }));
    
    expect(mockUpdateUser).toHaveBeenCalledWith({
      image: 'https://example.com/avatar.jpg',
      username: 'testuser',
      bio: 'Test bio',
      email: 'test@example.com',
      password: 'newpassword123'
    });
  });

  test('displays error message on update failure', async () => {
    mockUpdateUser.mockRejectedValue(new Error('Username already taken'));
    
    render(<SettingsPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /update settings/i }));
    
    await screen.findByText('Username already taken');
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('calls logout and redirects when logout button is clicked', async () => {
    render(<SettingsPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    
    expect(mockLogout).toHaveBeenCalled();
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
