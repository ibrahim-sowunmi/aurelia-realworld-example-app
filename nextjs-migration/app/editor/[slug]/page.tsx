'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Editor from '../../../components/Editor';
import { withAuth } from '../../../components/withAuth';

function EditArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  return <Editor slug={slug} />;
}

export default withAuth(EditArticlePage);
