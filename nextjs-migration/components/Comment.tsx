"use client";

import Link from "next/link";
import type { Comment as CommentType } from "../types";

interface CommentProps {
  comment: CommentType;
  canDelete: boolean;
  onDelete: () => void;
}

export default function Comment({ comment, canDelete, onDelete }: CommentProps) {
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link href={`/${comment.author.username}`} className="comment-author">
          <img 
            src={comment.author.image || "/placeholder.jpg"} 
            className="comment-author-img" 
            alt={comment.author.username}
          />
        </Link>
        &nbsp;
        <Link href={`/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
        {canDelete && (
          <span className="mod-options">
            <i className="ion-trash-a" onClick={onDelete}></i>
          </span>
        )}
      </div>
    </div>
  );
}
