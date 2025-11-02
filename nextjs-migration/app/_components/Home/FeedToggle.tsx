'use client';

interface FeedToggleProps {
  isAuthenticated: boolean;
  currentFeed: 'feed' | 'all' | 'tag';
  currentTag?: string;
  onFeedSelect: (feed: 'feed' | 'all', tag?: string) => void;
}

export default function FeedToggle({ 
  isAuthenticated, 
  currentFeed, 
  currentTag,
  onFeedSelect 
}: FeedToggleProps) {
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {isAuthenticated && (
          <li className="nav-item">
            <a 
              className={`nav-link ${currentFeed === 'feed' && !currentTag ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onFeedSelect('feed');
              }}
            >
              Your Feed
            </a>
          </li>
        )}
        <li className="nav-item">
          <a 
            className={`nav-link ${currentFeed === 'all' && !currentTag ? 'active' : ''}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onFeedSelect('all');
            }}
          >
            Global Feed
          </a>
        </li>
        {currentTag && (
          <li className="nav-item">
            <a className="nav-link active" href="#">
              <i className="ion-pound"></i> {currentTag}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
