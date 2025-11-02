'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/state/AuthContext';
import { commentService } from '@/lib/services/comments';
import ArticleMeta from './ArticleMeta';
import Comment from './Comment';
import CommentForm from './CommentForm';
import MarkdownRenderer from './MarkdownRenderer';
import type { Article, Comment as CommentType } from '@/types';

interface ArticleContentProps {
  article: Article;
  initialComments: CommentType[];
}

export default function ArticleContent({ article, initialComments }: ArticleContentProps) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  
  const handleAddComment = async (body: string) => {
    const comment = await commentService.createComment(article.slug, { body });
    setComments(prev => [comment, ...prev]);
  };
  
  const handleDeleteComment = async (id: number) => {
    await commentService.deleteComment(article.slug, id);
    setComments(prev => prev.filter(comment => comment.id !== id));
  };
  
  const handleToggleFavorite = (value: boolean) => {
  };
  
  const handleToggleFollow = (value: boolean) => {
  };
  
  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta 
            article={article}
            onToggleFavorite={handleToggleFavorite}
            onToggleFollow={handleToggleFollow}
          />
        </div>
      </div>
      
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <MarkdownRenderer content={article.body} />
          </div>
        </div>
        
        <hr />
        
        <div className="article-actions">
          <ArticleMeta 
            article={article}
            onToggleFavorite={handleToggleFavorite}
            onToggleFollow={handleToggleFollow}
          />
        </div>
        
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <CommentForm 
                slug={article.slug}
                onAddComment={handleAddComment}
              />
            ) : (
              <p className="text-center">
                <a href="/login">Sign in</a> or <a href="/register">sign up</a> to add comments on this article.
              </p>
            )}
            
            {comments.length > 0 ? (
              comments.map(comment => (
                <Comment 
                  key={comment.id}
                  comment={comment}
                  onDelete={user && user.username === comment.author.username ? handleDeleteComment : undefined}
                />
              ))
            ) : (
              <p className="text-center">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
