"use client";

import ProtectedRoute from "../../../components/ProtectedRoute";

export default function EditorPage() {
  return (
    <ProtectedRoute>
      {/* Editor page content will go here */}
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <h1 className="text-xs-center">Editor</h1>
              {/* Editor form will be implemented in the next step */}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
