'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link href="/home" className="navbar-brand">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link href="/home" className="nav-link">
              Home
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link href="/editor" className="nav-link">
                  <i className="ion-compose"></i>&nbsp;New Article
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/settings" className="nav-link">
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`/profile/${user?.username}`} className="nav-link">
                  <img 
                    src={user?.image || undefined} 
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
                <Link href="/login" className="nav-link">
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/register" className="nav-link">
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
