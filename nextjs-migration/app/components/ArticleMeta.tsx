'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { articleService } from '../../lib/services/articles';
import { profileService } from '../../lib/services/profiles';
import { Article } from '../../types';

interface ArticleMetaProps {
  article: Article;
  onArticleUpdate?: (article: Article) => void;
}

export default function ArticleMeta({ article, onArticleUpdate }: ArticleMetaProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canModify = user?.username === article.author.username;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await articleService.deleteArticle(article.slug);
      router.push('/');
    } catch (error) {
      console.error('Error deleting article:', error);
      setIsSubmitting(false);
    }
  };
  
  const handleFollowToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const username = article.author.username;
      let updatedProfile;
      
      if (article.author.following) {
        updatedProfile = await profileService.unfollowProfile(username);
      } else {
        updatedProfile = await profileService.followProfile(username);
      }
      
      if (onArticleUpdate) {
        onArticleUpdate({
          ...article,
          author: updatedProfile
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFavoriteToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      let updatedArticle;
      
      if (article.favorited) {
        updatedArticle = await articleService.unfavoriteArticle(article.slug);
      } else {
        updatedArticle = await articleService.favoriteArticle(article.slug);
      }
      
      if (onArticleUpdate) {
        onArticleUpdate(updatedArticle);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="article-meta">
      <Link href={`/${article.author.username}`}>
        <img src={article.author.image || '/placeholder-user.png'} alt={article.author.username} />
      </Link>
      <div className="info">
        <Link href={`/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>
      
      {canModify ? (
        <span>
          <Link 
            href={`/editor/${article.slug}`} 
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="ion-edit"></i>&nbsp;Edit Article
          </Link>
          &nbsp;&nbsp;
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            <i className="ion-trash-a"></i>&nbsp;Delete Article
          </button>
        </span>
      ) : (
        <span>
          <button 
            className={`btn btn-sm ${article.author.following ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={handleFollowToggle}
            disabled={isSubmitting}
          >
            <i className="ion-plus-round"></i>&nbsp;
            {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
          </button>
          &nbsp;&nbsp;
          <button 
            className={`btn btn-sm ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleFavoriteToggle}
            disabled={isSubmitting}
          >
            <i className="ion-heart"></i>&nbsp;
            {article.favorited ? 'Unfavorite' : 'Favorite'} Post <span className="counter">({article.favoritesCount})</span>
          </button>
        </span>
      )}
    </div>
  );
}
