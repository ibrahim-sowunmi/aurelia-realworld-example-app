"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { articleService } from "../lib/services/articles";
import { profileService } from "../lib/services/profiles";
import type { Article } from "../types";

interface ArticleMetaProps {
  article: Article;
}

export default function ArticleMeta({ article }: ArticleMetaProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canModify = isAuthenticated && user?.username === article.author.username;
  
  async function deleteArticle() {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    setIsSubmitting(true);
    try {
      await articleService.deleteArticle(article.slug);
      router.push("/");
    } catch (error) {
      console.error("Error deleting article:", error);
      setIsSubmitting(false);
    }
  }
  
  async function toggleFollowing() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (article.author.following) {
        await profileService.unfollowProfile(article.author.username);
      } else {
        await profileService.followProfile(article.author.username);
      }
      
      const updatedArticle = await articleService.getArticle(article.slug);
      article.author.following = updatedArticle.author.following;
      
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error toggling following:", error);
      setIsSubmitting(false);
    }
  }
  
  async function toggleFavorited() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (article.favorited) {
        await articleService.unfavoriteArticle(article.slug);
      } else {
        await articleService.favoriteArticle(article.slug);
      }
      
      const updatedArticle = await articleService.getArticle(article.slug);
      article.favorited = updatedArticle.favorited;
      article.favoritesCount = updatedArticle.favoritesCount;
      
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="article-meta">
      <Link href={`/${article.author.username}`}>
        <img src={article.author.image || "/placeholder.jpg"} alt={article.author.username} />
      </Link>
      <div className="info">
        <Link href={`/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {canModify ? (
        <span>
          <Link 
            href={`/editor/edit/${article.slug}`}
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="ion-edit"></i>&nbsp;Edit Article
          </Link>
          &nbsp;&nbsp;
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={deleteArticle}
            disabled={isSubmitting}
          >
            <i className="ion-trash-a"></i>&nbsp;Delete Article
          </button>
        </span>
      ) : (
        <span>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={toggleFollowing}
            disabled={isSubmitting}
          >
            <i className="ion-plus-round"></i>&nbsp;
            {article.author.following ? "Unfollow" : "Follow"} {article.author.username}
          </button>
          &nbsp;&nbsp;
          <button 
            className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`} 
            onClick={toggleFavorited}
            disabled={isSubmitting}
          >
            <i className="ion-heart"></i>&nbsp;
            {article.favorited ? "Unfavorite" : "Favorite"} Post <span className="counter">({article.favoritesCount})</span>
          </button>
        </span>
      )}
    </div>
  );
}
