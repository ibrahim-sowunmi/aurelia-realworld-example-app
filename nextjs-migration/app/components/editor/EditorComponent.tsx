'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { articleService } from '../../../lib/services/articles';
import type { Article, CreateArticleData } from '../../../types';

export default function EditorComponent() {
  const router = useRouter();
  const { slug } = useParams();
  
  const [article, setArticle] = useState<CreateArticleData>({
    title: '',
    description: '',
    body: '',
    tagList: []
  });
  
  const [tagInput, setTagInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug || typeof slug !== 'string') {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const fetchedArticle = await articleService.getArticle(slug);
        setArticle({
          title: fetchedArticle.title,
          description: fetchedArticle.description,
          body: fetchedArticle.body,
          tagList: fetchedArticle.tagList
        });
      } catch (error) {
        console.error('Error loading article for editing:', error);
        setErrors({ 'Error': ['Could not load the article.'] });
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    
    if (article.tagList?.includes(tag)) return;
    
    setArticle(prev => ({
      ...prev,
      tagList: [...(prev.tagList || []), tag]
    }));
    setTagInput('');
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
      let savedArticle: Article;
      
      if (slug && typeof slug === 'string') {
        savedArticle = await articleService.updateArticle(slug, article);
      } else {
        savedArticle = await articleService.createArticle(article);
      }
      
      router.push(`/article/${savedArticle.slug}`);
    } catch (error: any) {
      console.error('Error publishing article:', error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ 'Error': ['An unexpected error occurred.'] });
      }
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="editor-page">Loading...</div>;
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <h1 className="text-xs-center">
              {slug ? 'Edit Article' : 'New Article'}
            </h1>

            {errors && (
              <ul className="error-messages">
                {Object.entries(errors).map(([key, messages]) => 
                  messages.map((message, index) => (
                    <li key={`${key}-${index}`}>
                      {key} {message}
                    </li>
                  ))
                )}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Article Title"
                    name="title"
                    value={article.title}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="What's this article about?"
                    name="description"
                    value={article.description}
                    onChange={handleInputChange}
                    required
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
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter tags"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    onBlur={() => addTag(tagInput)}
                  />
                  <div className="tag-list">
                    {article.tagList?.map(tag => (
                      <span className="tag-default tag-pill" key={tag}>
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
