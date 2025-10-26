'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { articleService } from '../../../lib/services/articles';
import { commentService } from '../../../lib/services/comments';
import type { Article, Comment } from '../../../types';
import ArticleMeta from '../../components/article/ArticleMeta';
import CommentComponent from '../../components/article/Comment';
import { marked } from 'marked';

export default function ArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [myComment, setMyComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    if (!slug) return;

    setIsLoading(true);
    try {
      const loadedArticle = await articleService.getArticle(slug);
      setArticle(loadedArticle);
      loadComments();
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    if (!slug) return;

    try {
      const loadedComments = await commentService.getComments(slug);
      setComments(loadedComments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myComment.trim() || !slug) return;

    setIsSubmitting(true);
    try {
      await commentService.createComment(slug, { body: myComment });
      setMyComment('');
      loadComments();
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!slug) return;

    try {
      await commentService.deleteComment(slug, commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (isLoading || !article) {
    return <div className="article-page">Loading...</div>;
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta article={article} onUpdate={loadArticle} />
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={{ __html: marked.parse(article.body) }}></div>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <ArticleMeta article={article} onUpdate={loadArticle} />
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <form className="card comment-form" onSubmit={postComment}>
                <div className="card-block">
                  <textarea 
                    className="form-control" 
                    placeholder="Write a comment..." 
                    rows={3} 
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
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
            ) : (
              <p>
                <a href="/login">Sign in</a> or <a href="/register">sign up</a> to add comments on this article.
              </p>
            )}

            {comments.map(comment => (
              <CommentComponent 
                key={comment.id} 
                comment={comment} 
                onDelete={deleteComment} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
