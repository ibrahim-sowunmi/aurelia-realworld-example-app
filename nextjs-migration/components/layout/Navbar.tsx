'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const pathname = usePathname() || '/';
  const { user, isAuthenticated } = useAuth();

  const isActive = (match: boolean) => (match ? 'nav-item active' : 'nav-item');

  const activeHome = pathname === '/';
  const activeEditor = pathname.startsWith('/editor');
  const activeSettings = pathname.startsWith('/settings');
  const activeLogin = pathname.startsWith('/login');
  const activeRegister = pathname.startsWith('/register');
  const activeProfile = !!user && pathname === `/${user.username}`;

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" href="/">conduit</Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className={isActive(activeHome)}>
            <Link className="nav-link" href="/">Home</Link>
          </li>

          {isAuthenticated && (
            <>
              <li className={isActive(activeEditor)}>
                <Link className="nav-link" href="/editor">
                  <i className="ion-compose"></i>&nbsp;New Post
                </Link>
              </li>
              <li className={isActive(activeSettings)}>
                <Link className="nav-link" href="/settings">
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </Link>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li className={isActive(activeLogin)}>
                <Link className="nav-link" href="/login">Sign in</Link>
              </li>
              <li className={isActive(activeRegister)}>
                <Link className="nav-link" href="/register">Sign up</Link>
              </li>
            </>
          )}

          {isAuthenticated && user && (
            <li className={isActive(activeProfile)}>
              <Link className="nav-link" href={`/${user.username}`}>
                {user.username}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
