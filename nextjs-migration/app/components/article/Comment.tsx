'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { Comment } from '@/types';

interface CommentProps {
  comment: Comment;
  deleteComment: (commentId: number) => Promise<void>;
}

export default function CommentComponent({ comment, deleteComment }: CommentProps) {
  const { user } = useAuth();
  
  const canModify = user?.username === comment.author.username;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(comment.id);
    }
  };
  
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link href={`/${comment.author.username}`} className="comment-author">
          <img 
            src={comment.author.image || '/placeholder.png'} 
            className="comment-author-img" 
            alt={comment.author.username}
          />
        </Link>
        &nbsp;
        <Link href={`/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">
          {formatDate(comment.createdAt)}
        </span>
        {canModify && (
          <span className="mod-options">
            <i className="ion-trash-a" onClick={handleDelete}></i>
          </span>
        )}
      </div>
    </div>
  );
}
