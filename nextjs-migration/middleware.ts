import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/settings',
  '/editor'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jwtToken')?.value;

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/settings',
    '/editor/:path*'
  ]
};
