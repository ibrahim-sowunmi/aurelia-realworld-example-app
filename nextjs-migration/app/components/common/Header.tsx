'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/" className="navbar-brand">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link href="/" className={`nav-link ${isActive('/')}`}>
              Home
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link href="/editor/new" className={`nav-link ${isActive('/editor/new')}`}>
                  <i className="ion-compose"></i>&nbsp;New Article
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/settings" className={`nav-link ${isActive('/settings')}`}>
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href={`/${user?.username}`}
                  className={`nav-link ${pathname === `/${user?.username}` ? 'active' : ''}`}
                >
                  <img 
                    src={user?.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} 
                    className="user-pic" 
                    alt={user?.username}
                  />
                  {user?.username}
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link href="/login" className={`nav-link ${isActive('/login')}`}>
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/register" className={`nav-link ${isActive('/register')}`}>
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
