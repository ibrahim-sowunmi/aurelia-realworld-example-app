'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { marked } from 'marked';
import { useAuth } from '@/contexts/AuthContext';
import ArticleMeta from '@/components/ArticleMeta';
import Comment from '@/components/Comment';
import { articleService } from '@/lib/services/articles';
import { commentService } from '@/lib/services/comments';
import { Article as ArticleType, Comment as CommentType } from '@/types';

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user, isAuthenticated } = useAuth();
  
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const articleData = await articleService.getArticle(slug);
        setArticle(articleData);
        
        const commentsData = await commentService.getComments(slug);
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const newComment = await commentService.createComment(slug, { body: commentBody });
      setComments(prevComments => [newComment, ...prevComments]);
      setCommentBody('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentService.deleteComment(slug, commentId);
      setComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentId)
      );
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  if (isLoading) {
    return (
      <div className="article-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-12">
              <p>Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-12">
              <p>{error || 'Article not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
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
            <div dangerouslySetInnerHTML={{ __html: marked(article.body) }} />
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta article={article} />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <form className="card comment-form" onSubmit={handlePostComment}>
                <div className="card-block">
                  <textarea 
                    className="form-control" 
                    placeholder="Write a comment..." 
                    rows={3} 
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="card-footer">
                  <img 
                    src={user?.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} 
                    className="comment-author-img" 
                    alt={user?.username}
                  />
                  <button 
                    className="btn btn-sm btn-primary" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            ) : null}

            {comments.map(comment => (
              <Comment 
                key={comment.id} 
                comment={comment} 
                onDelete={handleDeleteComment} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
