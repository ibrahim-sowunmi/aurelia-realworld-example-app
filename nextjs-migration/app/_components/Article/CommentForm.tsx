'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/state/AuthContext';

interface CommentFormProps {
  slug: string;
  onAddComment: (body: string) => Promise<void>;
}

export default function CommentForm({ slug, onAddComment }: CommentFormProps) {
  const { user } = useAuth();
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(body);
      setBody('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <form className="card comment-form" onSubmit={handleSubmit}>
      <div className="card-block">
        <textarea 
          className="form-control" 
          placeholder="Write a comment..." 
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
      </div>
      <div className="card-footer">
        <img 
          src={user.image || '/placeholder.png'} 
          className="comment-author-img"
          alt={user.username}
        />
        <button 
          className="btn btn-sm btn-primary"
          type="submit"
          disabled={isSubmitting || !body.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
