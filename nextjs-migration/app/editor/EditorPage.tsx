'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { articleService } from '@/lib/services/articles';
import { useAuth } from '@/contexts/AuthContext';
import type { Article } from '@/types';

export function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const slug = params?.slug ? String(params.slug) : undefined;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  
  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    description: '',
    body: '',
    tagList: [],
  });

  useEffect(() => {
    const loadArticle = async () => {
      if (slug) {
        try {
          const loadedArticle = await articleService.getArticle(slug);
          setArticle({
            title: loadedArticle.title,
            description: loadedArticle.description,
            body: loadedArticle.body,
            tagList: loadedArticle.tagList,
          });
        } catch (error) {
          console.error('Failed to load article:', error);
          router.push('/');
        }
      }
    };

    if (isAuthenticated) {
      loadArticle();
    } else {
      router.push('/login');
    }
  }, [slug, isAuthenticated, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (!currentTag.trim()) return;
    
    if (!article.tagList?.includes(currentTag)) {
      setArticle(prev => ({
        ...prev,
        tagList: [...(prev.tagList || []), currentTag]
      }));
    }
    setCurrentTag('');
  };

  const removeTag = (tag: string) => {
    setArticle(prev => ({
      ...prev,
      tagList: prev.tagList?.filter(t => t !== tag) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      const savedArticle = await articleService.saveArticle(article, slug);
      router.push(`/article/${savedArticle.slug}`);
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ 'Error': ['An unexpected error occurred'] });
      }
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Middleware will redirect
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {errors && (
              <ul className="error-messages">
                {Object.entries(errors).map(([key, messages]) => 
                  messages.map((message, index) => (
                    <li key={`${key}-${index}`}>{key} {message}</li>
                  ))
                )}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Article Title" 
                    name="title"
                    value={article.title}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                
                <fieldset className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="What's this article about?" 
                    name="description"
                    value={article.description}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                
                <fieldset className="form-group">
                  <textarea 
                    className="form-control" 
                    rows={8} 
                    placeholder="Write your article (in markdown)" 
                    name="body"
                    value={article.body}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                
                <fieldset className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter tags" 
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onBlur={addTag}
                    onKeyDown={handleTagKeyDown}
                    disabled={isSubmitting}
                  />
                  
                  <div className="tag-list">
                    {article.tagList?.map(tag => (
                      <span key={tag} className="tag-default tag-pill">
                        <i 
                          className="ion-close-round"
                          onClick={() => removeTag(tag)}
                        />
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                
                <button 
                  className="btn btn-lg pull-xs-right btn-primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
