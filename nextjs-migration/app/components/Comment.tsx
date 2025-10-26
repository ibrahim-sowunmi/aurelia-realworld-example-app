'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface CommentProps {
  comment: {
    id: number;
    body: string;
    createdAt: string;
    author: {
      username: string;
      image: string;
    };
  };
  onDelete: (commentId: number) => void;
}

export default function Comment({ comment, onDelete }: CommentProps) {
  const { user } = useAuth();
  const canModify = user?.username === comment.author.username;
  
  const handleDelete = () => {
    onDelete(comment.id);
  };
  
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link href={`/${comment.author.username}`} className="comment-author">
          <img 
            src={comment.author.image || '/placeholder-user.png'} 
            className="comment-author-img" 
            alt={comment.author.username}
          />
        </Link>
        &nbsp;
        <Link href={`/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">
          {new Date(comment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
