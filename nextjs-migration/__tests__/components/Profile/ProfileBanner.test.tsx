import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProfileBanner from '../../../app/_components/Profile/ProfileBanner';
import { profileService } from '../../../lib/services/profiles';
import { useAuth } from '../../../lib/state/AuthContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../lib/services/profiles', () => ({
  profileService: {
    followProfile: jest.fn(),
    unfollowProfile: jest.fn(),
  }
}));

jest.mock('../../../lib/state/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ProfileBanner', () => {
  const mockProfile = {
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/image.jpg',
    following: false,
  };

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        username: 'currentuser',
      }
    });
    (profileService.followProfile as jest.Mock).mockResolvedValue({ ...mockProfile, following: true });
    (profileService.unfollowProfile as jest.Mock).mockResolvedValue({ ...mockProfile, following: false });
  });

  test('renders profile information correctly', () => {
    render(<ProfileBanner profile={mockProfile} />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Test bio')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
    
    expect(screen.getByText(/follow testuser/i)).toBeInTheDocument();
  });

  test('shows edit profile button for own profile', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        username: 'testuser', // Same as profile
      }
    });
    
    render(<ProfileBanner profile={mockProfile} />);
    
    expect(screen.getByText('Edit Profile Settings')).toBeInTheDocument();
    expect(screen.queryByText(/follow testuser/i)).not.toBeInTheDocument();
  });

  test('redirects to login when unauthenticated user tries to follow', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    
    render(<ProfileBanner profile={mockProfile} />);
    
    fireEvent.click(screen.getByText(/follow testuser/i));
    
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
    expect(profileService.followProfile).not.toHaveBeenCalled();
  });

  test('toggles follow state when follow button is clicked', async () => {
    render(<ProfileBanner profile={mockProfile} />);
    
    fireEvent.click(screen.getByText(/follow testuser/i));
    
    expect(profileService.followProfile).toHaveBeenCalledWith('testuser');
    
    await waitFor(() => {
      expect(screen.getByText(/unfollow testuser/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText(/unfollow testuser/i));
    
    expect(profileService.unfollowProfile).toHaveBeenCalledWith('testuser');
    
    await waitFor(() => {
      expect(screen.getByText(/follow testuser/i)).toBeInTheDocument();
    });
  });
});
