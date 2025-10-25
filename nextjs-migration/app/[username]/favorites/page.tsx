import { profileService } from '@/lib/services/profiles';
import { notFound } from 'next/navigation';
import ProfileBanner from '@/app/_components/Profile/ProfileBanner';
import ProfileTabs from '@/app/_components/Profile/ProfileTabs';
import ProfileArticles from '@/app/_components/Profile/ProfileArticles';
import type { Profile } from '@/types';

export default async function ProfileFavoritesPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  try {
    const profile: Profile = await profileService.getProfile(username);
    
    return (
      <div className="profile-page">
        <ProfileBanner profile={profile} />
        
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <ProfileTabs username={username} />
              <ProfileArticles username={username} favoritedMode={true} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading profile:', error);
    notFound();
  }
}
