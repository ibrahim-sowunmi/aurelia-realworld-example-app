'use client';

interface TagListProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
}

export default function TagList({ tags, onTagSelect }: TagListProps) {
  if (tags.length === 0) {
    return <div className="tag-list">No tags are here... yet.</div>;
  }
  
  return (
    <div className="tag-list">
      {tags.map(tag => (
        <a 
          key={tag} 
          href="#" 
          className="tag-pill tag-default"
          onClick={(e) => {
            e.preventDefault();
            onTagSelect(tag);
          }}
        >
          {tag}
        </a>
      ))}
    </div>
  );
}
