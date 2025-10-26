"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { articleService } from "../../../lib/services/articles";
import { commentService } from "../../../lib/services/comments";
import { marked } from "marked";
import ArticleMeta from "../../../components/ArticleMeta";
import Comment from "../../../components/Comment";
import type { Article, Comment as CommentType } from "../../../types";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const slug = params?.slug as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [myComment, setMyComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  useEffect(() => {
    async function loadArticleAndComments() {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const articleData = await articleService.get(slug);
        setArticle(articleData);
        
        const commentsData = await commentService.getList(slug);
        setComments(commentsData);
      } catch (error: any) {
        console.error("Error loading article:", error);
        if (error.errors) {
          setErrors(error.errors);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    loadArticleAndComments();
  }, [slug]);

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!myComment.trim() || !slug) return;
    
    setIsSubmitting(true);
    try {
      const comment = await commentService.add(slug, myComment);
      setComments(prev => [...prev, comment]);
      setMyComment(""); // Clear the comment input
    } catch (error: any) {
      console.error("Error posting comment:", error);
      if (error.errors) {
        setErrors(error.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteComment(commentId: number) {
    if (!slug) return;
    
    try {
      await commentService.destroy(commentId, slug);
      const commentsData = await commentService.getList(slug);
      setComments(commentsData);
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      if (error.errors) {
        setErrors(error.errors);
      }
    }
  }

  if (isLoading) {
    return (
      <div className="article-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-12">
              Loading article...
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
              Article not found.
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
                __html: marked(article.body || "") 
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
            {isAuthenticated && (
              <form className="card comment-form" onSubmit={postComment}>
                <div className="card-block">
                  <textarea 
                    className="form-control" 
                    placeholder="Write a comment..." 
                    rows={3} 
                    value={myComment}
                    onChange={e => setMyComment(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="card-footer">
                  <img src={user?.image} className="comment-author-img" alt="" />
                  <button 
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            )}
            
            {comments.map(comment => (
              <Comment 
                key={comment.id} 
                comment={comment} 
                canDelete={user?.username === comment.author.username}
                onDelete={() => deleteComment(comment.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
