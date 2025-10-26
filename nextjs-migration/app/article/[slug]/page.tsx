'use client';

import { useParams } from 'next/navigation';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>Article placeholder for: {slug}</h1>
          <p>This is a placeholder for the article component migration.</p>
        </div>
      </div>
    </div>
  );
}
