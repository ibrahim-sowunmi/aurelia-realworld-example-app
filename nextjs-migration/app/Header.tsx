'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" href="/">
          conduit
        </Link>
        
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link 
              className={`nav-link${pathname === '/' ? ' active' : ''}`} 
              href="/"
            >
              Home
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link 
                  className={`nav-link${pathname.startsWith('/editor') ? ' active' : ''}`}
                  href="/editor"
                >
                  <i className="ion-compose"></i>&nbsp;New Article
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link${pathname === '/settings' ? ' active' : ''}`}
                  href="/settings"
                >
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link${pathname === `/${user?.username}` ? ' active' : ''}`}
                  href={`/${user?.username || ''}`}
                >
                  <img 
                    src={user?.image || '/placeholder.png'} 
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
                <Link 
                  className={`nav-link${pathname === '/login' ? ' active' : ''}`}
                  href="/login"
                >
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link${pathname === '/register' ? ' active' : ''}`}
                  href="/register"
                >
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
