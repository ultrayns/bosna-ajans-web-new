import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

// Admin session cookie name
const AUTH_COOKIE_NAME = 'admin_session';

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection (except login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Basic token validation (timestamp check)
    try {
      const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
      const parts = decoded.split(':');
      if (parts.length >= 2) {
        const timestamp = parseInt(parts[1], 10);
        const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
        if (Date.now() - timestamp > SESSION_DURATION) {
          const response = NextResponse.redirect(new URL('/admin/login', request.url));
          response.cookies.delete(AUTH_COOKIE_NAME);
          return response;
        }
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  // Skip i18n middleware for admin routes and API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Apply i18n middleware for public routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except:
    // - Static files
    // - Internal Next.js paths
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
