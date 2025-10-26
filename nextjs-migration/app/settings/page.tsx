'use client';

import React from 'react';
import { withAuth } from '../../../components/withAuth';

function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            
            {/* Settings form will be implemented in a future step */}
            <p>Settings page content will be added in a future migration step.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SettingsPage);
