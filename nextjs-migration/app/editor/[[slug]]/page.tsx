'use client';

import React from 'react';
import { withAuth } from '@/components/withAuth';

function EditorPage() {
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <h1 className="text-xs-center">Editor</h1>
            
            {/* Editor form will be implemented in a future step */}
            <p>Editor page content will be added in a future migration step.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(EditorPage);
