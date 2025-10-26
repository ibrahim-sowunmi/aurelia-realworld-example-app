'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path: string): boolean => {
    if (path === '/' && pathname === '/') {
      return true;
    }
    if (path !== '/' && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/" className="navbar-brand">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className={`nav-item${isActive('/') ? ' active' : ''}`}>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>
          
          {isAuthenticated && (
            <li className={`nav-item${isActive('/editor') ? ' active' : ''}`}>
              <Link href="/editor" className="nav-link">
                <i className="ion-compose"></i>&nbsp;New Post
              </Link>
            </li>
          )}
          
          {isAuthenticated && (
            <li className={`nav-item${isActive('/settings') ? ' active' : ''}`}>
              <Link href="/settings" className="nav-link">
                <i className="ion-gear-a"></i>&nbsp;Settings
              </Link>
            </li>
          )}
          
          {!isAuthenticated && (
            <li className={`nav-item${isActive('/login') ? ' active' : ''}`}>
              <Link href="/login" className="nav-link">
                Sign in
              </Link>
            </li>
          )}
          
          {!isAuthenticated && (
            <li className={`nav-item${isActive('/register') ? ' active' : ''}`}>
              <Link href="/register" className="nav-link">
                Sign up
              </Link>
            </li>
          )}
          
          {isAuthenticated && user && (
            <li className={`nav-item${isActive(`/${user.username}`) ? ' active' : ''}`}>
              <Link href={`/${user.username}`} className="nav-link">
                {user.username}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
