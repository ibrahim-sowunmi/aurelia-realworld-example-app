import { render } from '@testing-library/react';
import { notFound } from 'next/navigation';
import ProfilePage from '../../../app/[username]/page';
import { profileService } from '../../../lib/services/profiles';
import type { Profile } from '@/types';

const mockNotFound = jest.fn();
const mockGetProfile = jest.fn() as jest.Mock<Promise<Profile>, [string]>;

jest.mock('next/navigation', () => ({
  notFound: mockNotFound,
}));

jest.mock('../../../lib/services/profiles', () => ({
  profileService: {
    getProfile: mockGetProfile,
  },
}));

jest.mock('../../../app/_components/Profile/ProfileBanner', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="profile-banner">Profile Banner</div>),
}));

jest.mock('../../../app/_components/Profile/ProfileTabs', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="profile-tabs">Profile Tabs</div>),
}));

jest.mock('../../../app/_components/Profile/ProfileArticles', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="profile-articles">Profile Articles</div>),
}));

describe('ProfilePage', () => {
  const mockProfile: Profile = {
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/image.jpg',
    following: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProfile.mockResolvedValue(mockProfile);
  });

  it('renders profile components with profile data', async () => {
    const params = { username: 'testuser' };
    
    const ProfileComponent = await ProfilePage({ params });
    const { getByTestId } = render(ProfileComponent);
    
    expect(getByTestId('profile-banner')).toBeInTheDocument();
    expect(getByTestId('profile-tabs')).toBeInTheDocument();
    expect(getByTestId('profile-articles')).toBeInTheDocument();
    
    expect(mockGetProfile).toHaveBeenCalledWith('testuser');
  });

  it('calls notFound when profile fetch fails', async () => {
    mockGetProfile.mockRejectedValue(new Error('Profile not found'));
    
    const params = { username: 'non-existent-user' };
    
    await ProfilePage({ params });
    
    expect(mockNotFound).toHaveBeenCalled();
  });
});
