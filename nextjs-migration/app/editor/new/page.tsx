'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { articleService } from '../../../lib/services/articles';
import { CreateArticleData } from '../../../types';

export default function NewEditorPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [article, setArticle] = useState({
    title: '',
    description: '',
    body: '',
    tagList: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  const handleTagInputBlur = () => {
    if (tagInput.trim()) {
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
      setTagInput('');
    }
  };
  
  const addTag = (tag: string) => {
    if (!article.tagList.includes(tag)) {
      setArticle({
        ...article,
        tagList: [...article.tagList, tag]
      });
    }
  };
  
  const removeTag = (tag: string) => {
    setArticle({
      ...article,
      tagList: article.tagList.filter(t => t !== tag)
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle({
      ...article,
      [name]: value
    });
  };
  
  const publishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSaving) return;
    
    setIsSaving(true);
    setErrors({});
    
    try {
      const articleData = {
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList
      };
      
      const savedArticle = await articleService.createArticle(
        articleData as CreateArticleData
      );
      
      router.push(`/article/${savedArticle.slug}`);
    } catch (error: any) {
      console.error('Error saving article:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ 
          'server': ['An unexpected error occurred. Please try again.'] 
        });
      }
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form onSubmit={publishArticle}>
              {Object.keys(errors).length > 0 && (
                <ul className="error-messages">
                  {Object.entries(errors).map(([key, messages]) => (
                    messages.map((message, index) => (
                      <li key={`${key}-${index}`}>{key} {message}</li>
                    ))
                  ))}
                </ul>
              )}
              
              <fieldset>
                <fieldset className="form-group">
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Article Title" 
                    name="title"
                    value={article.title}
                    onChange={handleInputChange}
                    disabled={isSaving}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                  ></textarea>
                </fieldset>
                
                <fieldset className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter tags" 
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onBlur={handleTagInputBlur}
                    onKeyDown={handleTagInputKeyDown}
                    disabled={isSaving}
                  />
                  
                  <div className="tag-list">
                    {article.tagList.map(tag => (
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
                  disabled={isSaving}
                >
                  {isSaving ? 'Publishing...' : 'Publish Article'}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
