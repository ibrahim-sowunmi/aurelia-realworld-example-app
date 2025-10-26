import { NextRequest, NextResponse } from 'next/server';
import { config as appConfig } from './lib/config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const protectedRoutes = ['/settings', '/editor'];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute) {
    const hasToken = request.cookies.has(appConfig.token_key);
    
    if (!hasToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/settings',
    '/editor', 
    '/editor/:slug*' // Handle optional slug parameter
  ],
};
