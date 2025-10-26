'use client';

import React from 'react';
import { User } from '@/types';

interface CommentFormProps {
  user: User | null;
  comment: string;
  onChange: (comment: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function CommentForm({ user, comment, onChange, onSubmit, isSubmitting }: CommentFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <form className="card comment-form" onSubmit={handleSubmit}>
      <div className="card-block">
        <textarea 
          className="form-control" 
          placeholder="Write a comment..." 
          rows={3}
          value={comment}
          onChange={(e) => onChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="card-footer">
        <img 
          src={user?.image || '/placeholder.jpg'} 
          className="comment-author-img" 
          alt={user?.username || 'User'}
        />
        <button 
          className="btn btn-sm btn-primary"
          type="submit"
          disabled={!comment.trim() || isSubmitting}
        >
          Post Comment
        </button>
      </div>
    </form>
  );
}
