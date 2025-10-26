'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { articleService } from '../../../lib/services/articles';
import { commentService } from '../../../lib/services/comments';
import { Article, Comment as CommentType } from '../../../types';
import { markdownToHtml } from '../../../lib/markdown';
import ArticleMeta from '../../components/article/ArticleMeta';
import Comment from '../../components/article/Comment';

export default function ArticlePage() {
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [myComment, setMyComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [articleHtml, setArticleHtml] = useState('');
  
  useEffect(() => {
    const fetchArticleData = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const articleData = await articleService.getArticle(slug);
        setArticle(articleData);
        setArticleHtml(markdownToHtml(articleData.body));
        
        const commentsData = await commentService.getComments(slug);
        setComments(commentsData);
      } catch (error: any) {
        console.error('Error fetching article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleData();
  }, [slug]);

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!myComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const newComment = await commentService.createComment(slug, { body: myComment });
      setComments([...comments, newComment]);
      setMyComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await commentService.deleteComment(slug, commentId);
      const updatedComments = await commentService.getComments(slug);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="article-page">
        <div className="container page">
          <div className="row">
            <div className="col-xs-12">
              <p>Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-page">
        <div className="container page">
          <div className="row">
            <div className="col-xs-12">
              <p>Article not found</p>
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
            <div dangerouslySetInnerHTML={{ __html: articleHtml }}></div>
          </div>
        </div>
        
        <hr />
        
        <div className="article-actions">
          <ArticleMeta article={article} />
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
                  ></textarea>
                </div>
                <div className="card-footer">
                  <img 
                    src={user?.image || '/placeholder.png'} 
                    className="comment-author-img" 
                    alt={user?.username} 
                  />
                  <button 
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={isSubmitting || !myComment.trim()}
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
                onDelete={deleteComment} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
