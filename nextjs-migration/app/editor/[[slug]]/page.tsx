'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

export default function EditorPage() {
  const params = useParams();
  const { user } = useAuth();
  const slug = params.slug ? 
    (Array.isArray(params.slug) ? params.slug[0] : params.slug) 
    : null;
  
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <h1 className="text-xs-center">{slug ? 'Edit Article' : 'New Article'}</h1>
            {/* Editor form will be implemented in a future step */}
            <p>Editor page protected by authentication</p>
            {user && <p>Logged in as: {user.username}</p>}
            {slug && <p>Editing article: {slug}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
