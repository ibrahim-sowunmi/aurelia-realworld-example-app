'use client';

import React from 'react';
import Link from 'next/link';
import { Comment as CommentType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface CommentProps {
  comment: CommentType;
  onDelete: (commentId: number) => void;
}

export function Comment({ comment, onDelete }: CommentProps) {
  const { user } = useAuth();

  const canModify = user && user.username === comment.author.username;

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link href={`/${comment.author.username}`} className="comment-author">
          <img src={comment.author.image || '/images/smiley-cyrus.jpg'} className="comment-author-img" alt={comment.author.username} />
        </Link>
        &nbsp;
        <Link href={`/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        {canModify && (
          <span className="mod-options">
            <i className="ion-trash-a" onClick={() => onDelete(comment.id)}></i>
          </span>
        )}
      </div>
    </div>
  );
}
