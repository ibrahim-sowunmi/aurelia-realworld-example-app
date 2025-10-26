'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Article } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { articleService } from '../../../lib/services/articles';
import { profileService } from '../../../lib/services/profiles';

interface ArticleMetaProps {
  article: Article;
  showActionsButtons?: boolean;
}

export default function ArticleMeta({ article, showActionsButtons = true }: ArticleMetaProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [following, setFollowing] = useState(article.author.following);
  const [favorited, setFavorited] = useState(article.favorited);
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount);
  
  const canModify = user && user.username === article.author.username;

  const handleDeleteArticle = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    setIsDeleting(true);
    try {
      await articleService.deleteArticle(article.slug);
      router.push('/');
    } catch (error) {
      console.error('Error deleting article:', error);
      setIsDeleting(false);
    }
  };

  const handleToggleFollowing = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isTogglingFollow) return;
    
    setIsTogglingFollow(true);
    try {
      if (following) {
        await profileService.unfollowProfile(article.author.username);
      } else {
        await profileService.followProfile(article.author.username);
      }
      setFollowing(!following);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsTogglingFollow(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    try {
      if (favorited) {
        await articleService.unfavoriteArticle(article.slug);
        setFavoritesCount(favoritesCount - 1);
      } else {
        await articleService.favoriteArticle(article.slug);
        setFavoritesCount(favoritesCount + 1);
      }
      setFavorited(!favorited);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="article-meta">
      <Link href={`/${article.author.username}`}>
        <img src={article.author.image || '/placeholder.png'} alt={article.author.username} />
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
      
      {showActionsButtons && (
        canModify ? (
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
              onClick={handleDeleteArticle}
              disabled={isDeleting}
            >
              <i className="ion-trash-a"></i>&nbsp;Delete Article
            </button>
          </span>
        ) : (
          <span>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={handleToggleFollowing}
              disabled={isTogglingFollow}
            >
              <i className="ion-plus-round"></i>
              &nbsp;
              {following ? 'Unfollow' : 'Follow'} {article.author.username}
            </button>
            &nbsp;&nbsp;
            <button 
              className={`btn btn-sm ${favorited ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
            >
              <i className="ion-heart"></i>
              &nbsp;
              {favorited ? 'Unfavorite' : 'Favorite'} Post <span className="counter">({favoritesCount})</span>
            </button>
          </span>
        )
      )}
    </div>
  );
}
