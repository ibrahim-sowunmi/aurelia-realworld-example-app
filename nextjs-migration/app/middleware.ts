import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const protectedPaths = ['/settings', '/editor'];
  const isProtectedPath = protectedPaths.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  const token = request.cookies.get('conduit_token')?.value;
  
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/settings/:path*',
    '/editor/:path*',
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
