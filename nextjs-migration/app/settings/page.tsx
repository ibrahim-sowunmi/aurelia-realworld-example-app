'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            {user && (
              <p>Authenticated as {user.username}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
