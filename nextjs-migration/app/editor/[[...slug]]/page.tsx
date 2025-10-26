'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { articleService } from '@/lib/services/articles';

export default function Editor() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug?.[0];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagList, setTagList] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    if (!slug) return;
    
    setIsLoading(true);
    try {
      const article = await articleService.getArticle(slug);
      setTitle(article.title);
      setDescription(article.description);
      setBody(article.body);
      setTagList(article.tagList.join(' '));
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setIsSubmitting(true);

    try {
      const tags = tagList
        .split(' ')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      const articleData = {
        title,
        description,
        body,
        tagList: tags,
      };

      let article;
      if (slug) {
        article = await articleService.updateArticle(slug, articleData);
      } else {
        article = await articleService.createArticle(articleData);
      }

      router.push(`/article/${article.slug}`);
    } catch (error: any) {
      setErrors(error.errors || { error: ['Failed to save article. Please try again.'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <p>Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {errors && (
              <ul className="error-messages">
                {Object.entries(errors).map(([key, messages]) =>
                  messages.map((message, idx) => (
                    <li key={`${key}-${idx}`}>
                      {key} {message}
                    </li>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags (separated by spaces)"
                    value={tagList}
                    onChange={(e) => setTagList(e.target.value)}
                    disabled={isSubmitting}
                  />
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
