import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { config as appConfig } from '../lib/config';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(appConfig.token_key)?.value;
  const isAuthenticated = !!token;
  
  const protectedRoutes = ['/settings', '/editor'];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/settings/:path*',
    '/editor/:path*',
  ],
};
