'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/state/AuthContext';
import { formatDate } from '@/lib/utils';
import type { Comment as CommentType } from '@/types';

interface CommentProps {
  comment: CommentType;
  onDelete: (id: number) => void;
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
            src={comment.author.image || '/placeholder.png'} 
            className="comment-author-img" 
            alt={comment.author.username}
          />
        </Link>
        {' '}
        <Link href={`/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">{formatDate(comment.createdAt)}</span>
        {canModify && (
          <span className="mod-options">
            <i className="ion-trash-a" onClick={handleDelete}></i>
          </span>
        )}
      </div>
    </div>
  );
}
