'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Comment as CommentType } from '@/types';

interface CommentProps {
  comment: CommentType;
  onDelete: (commentId: number) => void;
}

export default function Comment({ comment, onDelete }: CommentProps) {
  const { user } = useAuth();
  
  const canModify = user?.username === comment.author.username;
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
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
            src={comment.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
            className="comment-author-img"
            alt={comment.author.username}
          />
        </Link>
        {' '}
        <Link href={`/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">
          {new Date(comment.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
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
