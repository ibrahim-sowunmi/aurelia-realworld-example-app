'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { articleService } from '../../lib/services/articles';
import type { CreateArticleData } from '../../types';

export default function NewArticlePage() {
  const { user } = useAuth();
  const router = useRouter();
  const tagInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  
  const [article, setArticle] = useState<CreateArticleData>({
    title: '',
    description: '',
    body: '',
    tagList: []
  });
  
  const [tagInput, setTagInput] = useState('');
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  const addTag = (tag: string) => {
    if (!tag || article.tagList?.includes(tag)) return;
    
    setArticle(prev => ({
      ...prev,
      tagList: [...(prev.tagList || []), tag]
    }));
    setTagInput('');
    
    if (tagInputRef.current) {
      tagInputRef.current.focus();
    }
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      addTag(tagInput);
    }
  };
  
  const handleTagInputBlur = () => {
    if (tagInput) {
      addTag(tagInput);
    }
  };
  
  const removeTag = (tag: string) => {
    setArticle(prev => ({
      ...prev,
      tagList: prev.tagList?.filter(t => t !== tag) || []
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);
    
    try {
      const response = await articleService.createArticle(article);
      router.push(`/article/${response.slug}`);
    } catch (error: any) {
      console.error('Failed to save article', error);
      setErrors(error.errors || { 'error': ['Failed to save article'] });
      setLoading(false);
    }
  };
  
  if (!user) {
    return <div className="container page">Please sign in to continue</div>;
  }
  
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <h1 className="text-xs-center">New Article</h1>
            
            {errors && (
              <ul className="error-messages">
                {Object.entries(errors).map(([key, messages]) => 
                  messages.map((message, i) => (
                    <li key={`${key}-${i}`}>{key} {message}</li>
                  ))
                )}
              </ul>
            )}
            
            <form onSubmit={handleSubmit}>
              <fieldset disabled={loading}>
                <fieldset className="form-group">
                  <input 
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    name="title"
                    value={article.title}
                    onChange={handleChange}
                  />
                </fieldset>
                
                <fieldset className="form-group">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    name="description"
                    value={article.description}
                    onChange={handleChange}
                  />
                </fieldset>
                
                <fieldset className="form-group">
                  <textarea 
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    name="body"
                    value={article.body}
                    onChange={handleChange}
                  />
                </fieldset>
                
                <fieldset className="form-group">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    onBlur={handleTagInputBlur}
                    ref={tagInputRef}
                  />
                  
                  <div className="tag-list">
                    {article.tagList?.map(tag => (
                      <span key={tag} className="tag-default tag-pill">
                        <i 
                          className="ion-close-round" 
                          onClick={() => removeTag(tag)}
                        ></i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                
                <button 
                  className="btn btn-lg pull-xs-right btn-primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Publish Article'}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
