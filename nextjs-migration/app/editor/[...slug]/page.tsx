'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { articleService } from '../../../lib/services/articles';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [article, setArticle] = useState({
    title: '',
    description: '',
    body: '',
    tagList: [] as string[]
  });
  const [tag, setTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const slug = params?.slug && Array.isArray(params.slug) && params.slug.length > 0 
    ? params.slug[0] 
    : undefined;
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (slug) {
      setIsLoading(true);
      articleService.getArticle(slug)
        .then(fetchedArticle => {
          setArticle(fetchedArticle);
        })
        .catch(error => {
          console.error('Error fetching article:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [slug, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  };
  
  const handleTagBlur = () => {
    if (tag && tag.trim() !== '') {
      addTag(tag);
      setTag('');
    }
  };
  
  const addTag = (tagToAdd: string) => {
    if (tagToAdd.trim() === '' || article.tagList.includes(tagToAdd)) return;
    
    setArticle(prev => ({
      ...prev,
      tagList: [...prev.tagList, tagToAdd]
    }));
  };
  
  const removeTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tagList: prev.tagList.filter(t => t !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);
    
    try {
      let savedArticle;
      if (slug) {
        savedArticle = await articleService.updateArticle(slug, article);
      } else {
        savedArticle = await articleService.createArticle(article);
      }
      router.push(`/article/${savedArticle.slug}`);
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        console.error('Error saving article:', error);
      }
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
                {Object.keys(errors).map(key =>
                  errors[key].map((error, idx) => (
                    <li key={`${key}-${idx}`}>{key} {error}</li>
                  ))
                )}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting}>
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
                    value={tag}
                    onChange={handleTagChange}
                    onBlur={handleTagBlur}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagBlur();
                      }
                    }}
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
