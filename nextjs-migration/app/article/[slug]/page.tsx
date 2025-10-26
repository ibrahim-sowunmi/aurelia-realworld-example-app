'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { marked } from 'marked';
import { useAuth } from '../../../contexts/AuthContext';
import { articleService } from '../../../lib/services/articles';
import { commentService } from '../../../lib/services/comments';
import { Article, Comment } from '../../../types';
import ArticleMeta from '../../components/ArticleMeta';
import CommentComponent from '../../components/Comment';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [myComment, setMyComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  
  useEffect(() => {
    if (!slug) {
      router.push('/');
      return;
    }
    
    const fetchArticleAndComments = async () => {
      setIsLoading(true);
      try {
        const fetchedArticle = await articleService.getArticle(slug);
        setArticle(fetchedArticle);
        
        const fetchedComments = await commentService.getComments(slug);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching article or comments:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticleAndComments();
  }, [slug, router]);
  
  const handleArticleUpdate = (updatedArticle: Article) => {
    setArticle(updatedArticle);
  };
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMyComment(e.target.value);
  };
  
  const handleCommentSubmit = async () => {
    if (!myComment.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      const comment = await commentService.addComment(slug, { body: myComment });
      setComments([...comments, comment]);
      setMyComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCommentDelete = async (commentId: number) => {
    try {
      await commentService.deleteComment(commentId, slug);
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
            <div className="col-md-12">
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
            <div className="col-md-12">
              <p>Article not found.</p>
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
          <ArticleMeta article={article} onArticleUpdate={handleArticleUpdate} />
        </div>
      </div>
      
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div 
              dangerouslySetInnerHTML={{ __html: marked(article.body) }} 
            />
          </div>
        </div>
        
        <hr />
        
        <div className="article-actions">
          <ArticleMeta article={article} onArticleUpdate={handleArticleUpdate} />
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
                    onChange={handleCommentChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="card-footer">
                  <img 
                    src={user?.image || '/placeholder-user.png'} 
                    className="comment-author-img" 
                    alt={user?.username}
                  />
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={handleCommentSubmit}
                    type="button"
                    disabled={isSubmitting}
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            ) : null}
            
            {comments.map(comment => (
              <CommentComponent 
                key={comment.id}
                comment={comment}
                onDelete={handleCommentDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
