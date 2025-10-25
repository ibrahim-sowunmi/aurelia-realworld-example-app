import { render } from '@testing-library/react';
import { notFound } from 'next/navigation';
import ProfilePage from '../../../app/[username]/page';
import { profileService } from '../../../lib/services/profiles';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('../../../lib/services/profiles', () => ({
  profileService: {
    getProfile: jest.fn(),
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
  const mockProfile = {
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/image.jpg',
    following: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    profileService.getProfile.mockResolvedValue(mockProfile);
  });

  it('renders profile components with profile data', async () => {
    const params = { username: 'testuser' };
    
    const ProfileComponent = await ProfilePage({ params });
    const { getByTestId } = render(ProfileComponent);
    
    expect(getByTestId('profile-banner')).toBeInTheDocument();
    expect(getByTestId('profile-tabs')).toBeInTheDocument();
    expect(getByTestId('profile-articles')).toBeInTheDocument();
    
    expect(profileService.getProfile).toHaveBeenCalledWith('testuser');
  });

  it('calls notFound when profile fetch fails', async () => {
    profileService.getProfile.mockRejectedValue(new Error('Profile not found'));
    
    const params = { username: 'non-existent-user' };
    
    await ProfilePage({ params });
    
    expect(notFound).toHaveBeenCalled();
  });
});
