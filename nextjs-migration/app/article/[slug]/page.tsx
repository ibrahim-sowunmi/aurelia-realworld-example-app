import { articleService } from '@/lib/services/articles';
import { commentService } from '@/lib/services/comments';
import ArticleContent from '@/app/_components/Article/ArticleContent';
import { notFound } from 'next/navigation';
import type { Article, Comment } from '@/types';

export const revalidate = 300;

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  try {
    const [article, comments] = await Promise.all([
      articleService.getArticle(slug),
      commentService.getComments(slug)
    ]);
    
    return <ArticleContent article={article} initialComments={comments} />;
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}
