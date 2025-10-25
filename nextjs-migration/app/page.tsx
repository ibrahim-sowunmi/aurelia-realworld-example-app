import { Suspense } from 'react';
import { articleService } from '@/lib/services/articles';
import { tagService } from '@/lib/services/tags';
import HomePage from './_components/Home/HomePage';
import type { Article } from '@/types';

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function Home() {
  const articlesPromise = articleService.getList('all', { limit: 10, offset: 0 });
  const tagsPromise = tagService.getList();
  
  const [articlesData, tags] = await Promise.all([articlesPromise, tagsPromise]);
  
  return (
    <Suspense fallback={<div className="article-preview">Loading articles...</div>}>
      <HomePage 
        initialArticles={articlesData.articles}
        initialArticlesCount={articlesData.articlesCount}
        initialTags={tags}
      />
    </Suspense>
  );
}
