import { NextRequest, NextResponse } from 'next/server';

const AUTH_TOKEN_KEY = 'auth-token';

const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  );
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check auth cookie
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check token expiry
  if (isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(AUTH_TOKEN_KEY);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - _next (static files, images, etc.)
     * - Static assets (images, fonts, etc.)
     */
    '/((?!api|_next|icons|images|logo\\.svg|favicon\\.ico).*)',
  ],
};
