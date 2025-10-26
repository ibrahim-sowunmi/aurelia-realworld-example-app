'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { articleService } from '../../../lib/services/articles';
import { commentService } from '../../../lib/services/comments';
import ArticleMeta from '../../../components/ArticleMeta';
import CommentItem from '../../../components/CommentItem';
import type { Article, Comment } from '../../../types';
import { marked } from 'marked';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!params.slug) return;
    
    setIsLoading(true);
    setError(null);
    
    const fetchData = async () => {
      try {
        const articleData = await articleService.getArticle(params.slug);
        setArticle(articleData);
        
        const commentsData = await commentService.getComments(params.slug);
        setComments(commentsData);
      } catch (err) {
        console.error('Failed to fetch article data', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.slug]);
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      const newComment = await commentService.createComment(params.slug, { body: commentText });
      setComments(prevComments => [newComment, ...prevComments]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentService.deleteComment(params.slug, commentId);
      setComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentId)
      );
    } catch (err) {
      console.error('Failed to delete comment', err);
      setError('Failed to delete comment. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="article-page">
        <div className="container page">
          <div className="article-content">
            <div className="text-center">
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
          <div className="article-content">
            <div className="text-center">
              <p>{error || 'Article not found'}</p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => router.push('/')}
              >
                Back to Home
              </button>
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
            <div 
              dangerouslySetInnerHTML={{ 
                __html: marked(article.body) 
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
              <form className="card comment-form" onSubmit={handleCommentSubmit}>
                <div className="card-block">
                  <textarea 
                    className="form-control" 
                    placeholder="Write a comment..." 
                    rows={3}
                    value={commentText}
                    onChange={handleCommentChange}
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
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <p>
                <a href="/login">Sign in</a> or <a href="/register">sign up</a> to add comments on this article.
              </p>
            )}
            
            {comments.length === 0 ? (
              <p className="text-center mt-4">No comments yet</p>
            ) : (
              comments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onDelete={handleDeleteComment} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
