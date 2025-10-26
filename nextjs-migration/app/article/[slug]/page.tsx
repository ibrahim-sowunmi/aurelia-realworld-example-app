'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/lib/services/articles';
import { commentService } from '@/lib/services/comments';
import { profileService } from '@/lib/services/profiles';
import { Article as ArticleType, Comment as CommentType } from '@/types';
import { Comment } from '@/components/Comment';
import { FollowButton } from '@/components/FollowButton';
import { FavoriteButton } from '@/components/FavoriteButton';

export default function Article() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user, isAuthenticated } = useAuth();

  const [article, setArticle] = useState<ArticleType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    loadArticle();
    loadComments();
  }, [slug]);

  const loadArticle = async () => {
    try {
      const data = await articleService.getArticle(slug);
      setArticle(data);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(slug);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleDeleteArticle = async () => {
    if (!article) return;
    
    try {
      await articleService.deleteArticle(slug);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!article) return;
    
    try {
      if (article.favorited) {
        const updated = await articleService.unfavoriteArticle(slug);
        setArticle(updated);
      } else {
        const updated = await articleService.favoriteArticle(slug);
        setArticle(updated);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleToggleFollow = async () => {
    if (!article) return;
    
    try {
      if (article.author.following) {
        const updated = await profileService.unfollowProfile(article.author.username);
        setArticle({ ...article, author: updated });
      } else {
        const updated = await profileService.followProfile(article.author.username);
        setArticle({ ...article, author: updated });
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setIsSubmittingComment(true);
    try {
      await commentService.createComment(slug, { body: commentBody });
      setCommentBody('');
      await loadComments();
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentService.deleteComment(slug, commentId);
      await loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (isLoading) {
    return <div className="article-page">Loading article...</div>;
  }

  if (!article) {
    return <div className="article-page">Article not found</div>;
  }

  const canModify = user && user.username === article.author.username;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

          <div className="article-meta">
            <Link href={`/${article.author.username}`}>
              <img src={article.author.image || '/images/smiley-cyrus.jpg'} alt={article.author.username} />
            </Link>
            <div className="info">
              <Link href={`/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">
                {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {canModify ? (
              <>
                <Link href={`/editor/${article.slug}`} className="btn btn-sm btn-outline-secondary">
                  <i className="ion-edit"></i> Edit Article
                </Link>
                &nbsp;
                <button className="btn btn-sm btn-outline-danger" onClick={handleDeleteArticle}>
                  <i className="ion-trash-a"></i> Delete Article
                </button>
              </>
            ) : (
              <>
                <FollowButton profile={article.author} onToggle={handleToggleFollow} />
                &nbsp;
                <FavoriteButton article={article} onToggle={handleToggleFavorite} className="btn btn-sm btn-outline-primary" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={{ __html: article.body }} />
            <ul className="tag-list">
              {article.tagList.map((tag, index) => (
                <li key={index} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link href={`/${article.author.username}`}>
              <img src={article.author.image || '/images/smiley-cyrus.jpg'} alt={article.author.username} />
            </Link>
            <div className="info">
              <Link href={`/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">
                {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {canModify ? (
              <>
                <Link href={`/editor/${article.slug}`} className="btn btn-sm btn-outline-secondary">
                  <i className="ion-edit"></i> Edit Article
                </Link>
                &nbsp;
                <button className="btn btn-sm btn-outline-danger" onClick={handleDeleteArticle}>
                  <i className="ion-trash-a"></i> Delete Article
                </button>
              </>
            ) : (
              <>
                <FollowButton profile={article.author} onToggle={handleToggleFollow} />
                &nbsp;
                <FavoriteButton article={article} onToggle={handleToggleFavorite} className="btn btn-sm btn-outline-primary" />
              </>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <form className="card comment-form" onSubmit={handleSubmitComment}>
                <div className="card-block">
                  <textarea
                    className="form-control"
                    placeholder="Write a comment..."
                    rows={3}
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    disabled={isSubmittingComment}
                  />
                </div>
                <div className="card-footer">
                  <img src={user?.image || '/images/smiley-cyrus.jpg'} className="comment-author-img" alt={user?.username} />
                  <button className="btn btn-sm btn-primary" type="submit" disabled={isSubmittingComment}>
                    Post Comment
                  </button>
                </div>
              </form>
            ) : (
              <p>
                <Link href="/login">Sign in</Link> or <Link href="/register">sign up</Link> to add comments on this article.
              </p>
            )}

            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} onDelete={handleDeleteComment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
