"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { articleService } from "../../../lib/services/articles";
import type { Article } from "../../../types";

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string | undefined;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  useEffect(() => {
    async function loadArticle() {
      if (slug) {
        try {
          const article = await articleService.getArticle(slug);
          setTitle(article.title || "");
          setDescription(article.description || "");
          setBody(article.body || "");
          setTagList(article.tagList || []);
        } catch (error: any) {
          console.error("Error loading article:", error);
          if (error.errors) {
            setErrors(error.errors);
          }
        }
      }
    }
    
    loadArticle();
  }, [slug]);

  function addTag(tag: string) {
    if (tag.trim() && !tagList.includes(tag)) {
      setTagList([...tagList, tag]);
    }
    setTagInput(""); // Clear the input field
  }

  function removeTag(tag: string) {
    setTagList(tagList.filter(t => t !== tag));
  }

  function handleTagInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  }

  function handleTagInputBlur() {
    if (tagInput) {
      addTag(tagInput);
    }
  }

  async function publishArticle(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      const articleData: Partial<Article> = {
        title,
        description,
        body,
        tagList
      };

      const article = slug 
        ? await articleService.updateArticle(slug, articleData)
        : await articleService.createArticle(articleData);
      router.push(`/article/${article.slug}`);
    } catch (error: any) {
      console.error("Error publishing article:", error);
      if (error.errors) {
        setErrors(error.errors);
      }
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              {errors && (
                <ul className="error-messages">
                  {Object.keys(errors).map(key => (
                    <li key={key}>{key} {errors[key]}</li>
                  ))}
                </ul>
              )}

              <form onSubmit={publishArticle}>
                <fieldset disabled={isSubmitting}>
                  <fieldset className="form-group">
                    <input 
                      type="text" 
                      className="form-control form-control-lg" 
                      placeholder="Article Title" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </fieldset>
                  
                  <fieldset className="form-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="What's this article about?" 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required
                    />
                  </fieldset>
                  
                  <fieldset className="form-group">
                    <textarea 
                      className="form-control" 
                      rows={8} 
                      placeholder="Write your article (in markdown)" 
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      required
                    />
                  </fieldset>
                  
                  <fieldset className="form-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter tags" 
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      onBlur={handleTagInputBlur}
                    />
                    <div className="tag-list">
                      {tagList.map(tag => (
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
    </ProtectedRoute>
  );
}
