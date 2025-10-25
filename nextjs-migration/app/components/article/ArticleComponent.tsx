'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/lib/services/articles';
import { commentService } from '@/lib/services/comments';
import type { Article, Comment } from '@/types';
import ArticleMeta from './ArticleMeta';
import CommentComponent from './Comment';
import { marked } from 'marked';

export default function ArticleComponent() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [myComment, setMyComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug || typeof slug !== 'string') {
        setError('Invalid article slug');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedArticle = await articleService.getArticle(slug);
        setArticle(fetchedArticle);
        
        const fetchedComments = await commentService.getComments(slug);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const postComment = async () => {
    if (!slug || typeof slug !== 'string' || !myComment.trim()) return;

    try {
      const comment = await commentService.createComment(slug, { body: myComment });
      setComments(prevComments => [...prevComments, comment]);
      setMyComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!slug || typeof slug !== 'string') return;

    try {
      await commentService.deleteComment(slug, commentId);
      const fetchedComments = await commentService.getComments(slug);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (isLoading) {
    return <div className="article-page">Loading...</div>;
  }

  if (error || !article) {
    return <div className="article-page">Error: {error || 'Failed to load article'}</div>;
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
              <form className="card comment-form">
                <div className="card-block">
                  <textarea 
                    className="form-control" 
                    placeholder="Write a comment..." 
                    rows={3} 
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                  />
                </div>
                <div className="card-footer">
                  <img 
                    src={user?.image || '/placeholder.png'} 
                    className="comment-author-img" 
                    alt={user?.username}
                  />
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      postComment();
                    }}
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            ) : null}

            {comments.length === 0 ? (
              <p>No comments yet</p>
            ) : (
              comments.map(comment => (
                <CommentComponent 
                  key={comment.id} 
                  comment={comment} 
                  deleteComment={deleteComment}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
