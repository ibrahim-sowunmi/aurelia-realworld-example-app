'use client';

import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <h4>Profile placeholder for: {username}</h4>
              <p>This is a placeholder for the profile component migration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
