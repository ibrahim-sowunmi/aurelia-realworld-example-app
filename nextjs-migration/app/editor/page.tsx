'use client';

import React from 'react';
import Editor from '../../components/Editor';
import { withAuth } from '../../components/withAuth';

function EditorPage() {
  return <Editor />;
}

export default withAuth(EditorPage);
