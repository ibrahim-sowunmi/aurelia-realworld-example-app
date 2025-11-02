'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProfileTabsProps {
  username: string;
}

export default function ProfileTabs({ username }: ProfileTabsProps) {
  const pathname = usePathname();
  const isFavoritesTab = pathname?.includes('/favorites');
  
  return (
    <div className="articles-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link 
            href={`/${username}`} 
            className={`nav-link ${!isFavoritesTab ? 'active' : ''}`}
          >
            My Articles
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            href={`/${username}/favorites`} 
            className={`nav-link ${isFavoritesTab ? 'active' : ''}`}
          >
            Favorited Articles
          </Link>
        </li>
      </ul>
    </div>
  );
}
