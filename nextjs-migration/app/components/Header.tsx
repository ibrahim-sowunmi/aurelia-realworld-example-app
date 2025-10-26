'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  
  const getNavItemClass = (path: string) => {
    return `nav-item${pathname === path ? ' active' : ''}`;
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/" className="navbar-brand">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className={getNavItemClass('/')}>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>
          
          {isAuthenticated && (
            <li className={getNavItemClass('/editor/new')}>
              <Link href="/editor/new" className="nav-link">
                <i className="ion-compose"></i>&nbsp;New Post
              </Link>
            </li>
          )}
          
          {isAuthenticated && (
            <li className={getNavItemClass('/settings')}>
              <Link href="/settings" className="nav-link">
                <i className="ion-gear-a"></i>&nbsp;Settings
              </Link>
            </li>
          )}
          
          {!isAuthenticated && (
            <li className={getNavItemClass('/login')}>
              <Link href="/login" className="nav-link">
                Sign in
              </Link>
            </li>
          )}
          
          {!isAuthenticated && (
            <li className={getNavItemClass('/register')}>
              <Link href="/register" className="nav-link">
                Sign up
              </Link>
            </li>
          )}
          
          {isAuthenticated && user && (
            <li className={getNavItemClass(`/${user.username}`)}>
              <Link 
                href={`/${user.username}`} 
                className="nav-link"
              >
                {user.username}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
