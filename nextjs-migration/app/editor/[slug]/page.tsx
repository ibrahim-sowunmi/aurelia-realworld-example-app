'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { articleService } from '../../../../lib/services/articles';

export default function EditorPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [article, setArticle] = useState({
    title: '',
    description: '',
    body: '',
    tagList: [] as string[]
  });

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setIsLoading(true);

    if (!slug || slug === 'new') {
      setArticle({
        title: '',
        description: '',
        body: '',
        tagList: []
      });
      setIsLoading(false);
      return;
    }

    try {
      const loadedArticle = await articleService.getArticle(slug);
      setArticle(loadedArticle);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (!currentTag.trim()) return;
    
    if (!article.tagList.includes(currentTag)) {
      setArticle(prev => ({
        ...prev,
        tagList: [...prev.tagList, currentTag]
      }));
    }
    setCurrentTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tagList: prev.tagList.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let savedArticle;
      if (slug && slug !== 'new') {
        savedArticle = await articleService.updateArticle(slug, article);
      } else {
        savedArticle = await articleService.createArticle(article);
      }
      router.push(`/article/${savedArticle.slug}`);
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
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
            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    name="title"
                    value={article.title}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    disabled={isSubmitting}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    value={currentTag}
                    onChange={handleTagChange}
                    onBlur={addTag}
                    onKeyDown={handleTagKeyDown}
                    disabled={isSubmitting}
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
