'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import type { Comment as CommentType } from '../../../types';

interface CommentProps {
  comment: CommentType;
  onDelete: (id: number) => void;
}

export default function Comment({ comment, onDelete }: CommentProps) {
  const { user } = useAuth();
  const isAuthor = user && user.username === comment.author.username;

  const handleDelete = () => {
    onDelete(comment.id);
  };

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <a href={`/profile/${comment.author.username}`} className="comment-author">
          <img 
            src={comment.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} 
            className="comment-author-img" 
            alt={comment.author.username} 
          />
        </a>
        {' '}
        <a href={`/profile/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </a>
        <span className="date-posted">
          {new Date(comment.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        {isAuthor && (
          <span className="mod-options">
            <i className="ion-trash-a" onClick={handleDelete}></i>
          </span>
        )}
      </div>
    </div>
  );
}
