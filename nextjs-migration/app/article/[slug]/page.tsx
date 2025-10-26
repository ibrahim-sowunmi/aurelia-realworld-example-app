'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { articleService } from '@/lib/services/articles';
import { commentService } from '@/lib/services/comments';
import { useAuth } from '@/contexts/AuthContext';
import { ArticleMeta } from '@/components/article/ArticleMeta';
import { CommentForm } from '@/components/article/CommentForm';
import { CommentList } from '@/components/article/CommentList';
import { Article, Comment } from '@/types';

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const slug = params?.slug ? String(params.slug) : '';
  
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [myComment, setMyComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadArticleAndComments = async () => {
      if (!slug) {
        router.push('/');
        return;
      }

      try {
        setIsLoading(true);
        const articleData = await articleService.getArticle(slug);
        setArticle(articleData);
        
        const commentsData = await commentService.getComments(slug);
        setComments(commentsData);
      } catch (error) {
        console.error('Error loading article:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticleAndComments();
  }, [slug, router]);

  const postComment = async () => {
    if (!myComment.trim() || !slug || !isAuthenticated) return;
    
    try {
      setIsSubmitting(true);
      const newComment = await commentService.createComment(slug, { body: myComment });
      setComments(prev => [...prev, newComment]);
      setMyComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await commentService.deleteComment(commentId, slug);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (isLoading) {
    return <div className="article-page">Loading...</div>;
  }

  if (!article) {
    return <div className="article-page">Article not found</div>;
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta article={article} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(marked(article.body)) 
              }} 
            />
          </div>
        </div>
        
        <hr />
        
        <div className="article-actions">
          <ArticleMeta article={article} />
        </div>
        
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <CommentForm 
                user={user}
                comment={myComment}
                onChange={setMyComment}
                onSubmit={postComment}
                isSubmitting={isSubmitting}
              />
            ) : (
              <p>
                <a href="/login">Sign in</a> or <a href="/register">sign up</a> to add comments on this article.
              </p>
            )}
            
            <CommentList 
              comments={comments}
              currentUser={user}
              onDelete={deleteComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
