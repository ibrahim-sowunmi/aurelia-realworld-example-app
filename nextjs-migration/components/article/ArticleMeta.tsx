'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';
import { FavoriteButton } from './FavoriteButton';
import { FollowButton } from './FollowButton';
import { articleService } from '@/lib/services/articles';
import { Article } from '@/types';

interface ArticleMetaProps {
  article: Article;
}

export function ArticleMeta({ article }: ArticleMetaProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const canModify = user?.username === article.author.username;

  const handleDeleteArticle = async () => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }
    
    try {
      await articleService.deleteArticle(article.slug);
      router.push('/');
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleToggleFavorite = (favorited: boolean) => {
    article.favorited = favorited;
    article.favoritesCount = favorited 
      ? article.favoritesCount + 1 
      : article.favoritesCount - 1;
  };

  const handleToggleFollowing = (following: boolean) => {
    article.author.following = following;
  };

  return (
    <div className="article-meta">
      <Link href={`/${article.author.username}`}>
        <img src={article.author.image || '/placeholder.jpg'} alt={article.author.username} />
      </Link>
      
      <div className="info">
        <Link href={`/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">{formatDate(article.createdAt)}</span>
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
            onClick={handleDeleteArticle}
          >
            <i className="ion-trash-a"></i>&nbsp;Delete Article
          </button>
        </span>
      ) : (
        <span>
          <FollowButton 
            profile={article.author}
            onToggle={handleToggleFollowing}
          >
            &nbsp;
            {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
          </FollowButton>
          &nbsp;&nbsp;
          <FavoriteButton 
            article={article}
            onToggle={handleToggleFavorite}
            className="btn-sm"
          >
            &nbsp;
            {article.favorited ? 'Unfavorite' : 'Favorite'} Post <span className="counter">({article.favoritesCount})</span>
          </FavoriteButton>
        </span>
      )}
    </div>
  );
}
