'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function EditorPage({ params }: { params?: { slug?: string } }) {
  const { user } = useAuth();
  const isEditing = !!params?.slug;

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <h1 className="text-xs-center">{isEditing ? 'Edit Article' : 'New Article'}</h1>
            {user && (
              <p>Authenticated as {user.username}</p>
            )}
            {isEditing && (
              <p>Editing article with slug: {params.slug}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
