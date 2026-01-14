import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is to an admin route
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check if user is logged in by looking for adminToken in cookies
    // Since we can't access localStorage in middleware, we'll use a cookie
    const isLoggedIn = request.cookies.get('isAdminLoggedIn');

    if (!isLoggedIn) {
      // Redirect to login if not logged in
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Allow other routes to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
