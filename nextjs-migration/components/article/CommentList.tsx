'use client';

import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Comment, User } from '@/types';

interface CommentListProps {
  comments: Comment[];
  currentUser: User | null;
  onDelete: (id: number) => void;
}

export function CommentList({ comments, currentUser, onDelete }: CommentListProps) {
  if (comments.length === 0) {
    return <div className="no-comments">No comments yet</div>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <div className="card" key={comment.id}>
          <div className="card-block">
            <p className="card-text">{comment.body}</p>
          </div>
          <div className="card-footer">
            <Link href={`/${comment.author.username}`} className="comment-author">
              <img 
                src={comment.author.image || '/placeholder.jpg'} 
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
            {currentUser?.username === comment.author.username && (
              <span className="mod-options">
                <i 
                  className="ion-trash-a" 
                  onClick={() => onDelete(comment.id)}
                />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
