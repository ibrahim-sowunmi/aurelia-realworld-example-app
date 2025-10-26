"use client";

import ProtectedRoute from "../../components/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      {/* Settings page content will go here */}
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>
              {/* Settings form will be implemented in the next step */}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
