"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { profileService } from "../../lib/services/profiles";
import { articleService } from "../../lib/services/articles";
import type { Profile, Article } from "../../types";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const username = params?.username as string;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "favorited">("my");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const limit = 10;

  const isUser = isAuthenticated && user?.username === profile?.username;

  useEffect(() => {
    async function loadProfile() {
      if (!username) return;
      
      setIsLoading(true);
      try {
        const profileData = await profileService.getProfile(username);
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
  }, [username]);

  useEffect(() => {
    async function loadArticles() {
      if (!username) return;
      
      try {
        const queryParams = {
          limit,
          offset: limit * (currentPage - 1),
          ...(activeTab === "my" ? { author: username } : { favorited: username })
        };
        
        const response = await articleService.getList("all", queryParams);
        setArticles(response.articles);
        
        const pages = Array.from(
          new Array(Math.ceil(response.articlesCount / limit)),
          (val, index) => index + 1
        );
        setTotalPages(pages);
      } catch (error) {
        console.error("Error loading articles:", error);
      }
    }
    
    loadArticles();
  }, [username, activeTab, currentPage]);

  async function toggleFollowing() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    if (!profile) return;
    
    setIsSubmitting(true);
    try {
      if (profile.following) {
        await profileService.unfollowProfile(profile.username);
        setProfile({ ...profile, following: false });
      } else {
        await profileService.followProfile(profile.username);
        setProfile({ ...profile, following: true });
      }
    } catch (error) {
      console.error("Error toggling following:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleFavorite(slug: string) {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    try {
      const article = articles.find(a => a.slug === slug);
      if (!article) return;
      
      if (article.favorited) {
        await articleService.unfavoriteArticle(slug);
      } else {
        await articleService.favoriteArticle(slug);
      }
      
      const updatedArticle = await articleService.getArticle(slug);
      setArticles(articles.map(a => 
        a.slug === slug ? updatedArticle : a
      ));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-12">
              Loading profile...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-12">
              Profile not found.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image || "/placeholder.jpg"} className="user-img" alt={profile.username} />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {!isUser && (
                <button 
                  className="btn btn-sm btn-outline-secondary action-btn" 
                  onClick={toggleFollowing}
                  disabled={isSubmitting}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp;
                  {profile.following ? "Unfollow" : "Follow"} {profile.username}
                </button>
              )}
              {isUser && (
                <Link href="/settings" className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === "my" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("my");
                      setCurrentPage(1);
                    }}
                  >
                    My Posts
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === "favorited" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("favorited");
                      setCurrentPage(1);
                    }}
                  >
                    Favorited Posts
                  </button>
                </li>
              </ul>
            </div>

            {articles.length === 0 ? (
              <div className="article-preview">
                No articles are here... yet.
              </div>
            ) : (
              <>
                {articles.map(article => (
                  <div key={article.slug} className="article-preview">
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
                      <button 
                        className={`btn btn-sm pull-xs-right ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => toggleFavorite(article.slug)}
                      >
                        <i className="ion-heart"></i> {article.favoritesCount}
                      </button>
                    </div>
                    <Link href={`/article/${article.slug}`} className="preview-link">
                      <h1>{article.title}</h1>
                      <p>{article.description}</p>
                      <span>Read more...</span>
                      <ul className="tag-list">
                        {article.tagList.map(tag => (
                          <li key={tag} className="tag-default tag-pill tag-outline">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </Link>
                  </div>
                ))}

                {totalPages.length > 1 && (
                  <nav>
                    <ul className="pagination">
                      {totalPages.map(pageNumber => (
                        <li 
                          key={pageNumber} 
                          className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                        >
                          <button 
                            className="page-link"
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
