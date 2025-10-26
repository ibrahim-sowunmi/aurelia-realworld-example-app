'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { articleService } from '../lib/services/articles';
import { SingleArticleResponse } from '@/types';

interface ArticleForm {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

interface EditorProps {
  slug?: string;
}

export default function Editor({ slug }: EditorProps) {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  const [article, setArticle] = useState<ArticleForm>({
    title: '',
    description: '',
    body: '',
    tagList: []
  });

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      articleService.getArticle(slug)
        .then((article) => {
          setArticle({
            title: article.title,
            description: article.description,
            body: article.body,
            tagList: article.tagList
          });
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.error('Failed to fetch article:', error);
          setErrors({ 'Article': ['Could not be found'] });
          setIsLoading(false);
        });
    }
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag) {
      e.preventDefault();
      addTag(currentTag);
    }
  };

  const handleTagBlur = () => {
    if (currentTag) {
      addTag(currentTag);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !article.tagList.includes(tag)) {
      setArticle(prev => ({
        ...prev,
        tagList: [...prev.tagList, tag]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setArticle(prev => ({
      ...prev,
      tagList: prev.tagList.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrors(null);

    try {
      let response;
      
      if (slug) {
        const updateResponse = await articleService.updateArticle(slug, article);
        response = { article: updateResponse };
      } else {
        const createResponse = await articleService.createArticle(article);
        response = { article: createResponse };
      }
      
      router.push(`/article/${response.article.slug}`);
    } catch (error: any) {
      setErrors(error.errors || { 'Error': ['Something went wrong'] });
      setIsLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {errors && (
              <ul className="error-messages">
                {Object.keys(errors).map(key => (
                  <li key={key}>
                    {key} {errors[key].join(', ')}
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isLoading}>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    name="title"
                    value={article.title}
                    onChange={handleInputChange}
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
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    value={currentTag}
                    onChange={handleTagChange}
                    onKeyDown={handleTagKeyDown}
                    onBlur={handleTagBlur}
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
