/**
 * Admin Authentication Utility
 * Simple cookie-based authentication for admin panel
 */
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bosna2025';
const AUTH_SECRET = process.env.AUTH_SECRET || 'bosna-ajans-admin-secret-key-2025';

const AUTH_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Simple hash function for password
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Create session token
 */
function createToken(username: string): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}:${AUTH_SECRET}`;
  return Buffer.from(payload).toString('base64');
}

/**
 * Verify session token
 */
function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, timestamp, secret] = decoded.split(':');
    
    if (secret !== AUTH_SECRET) {
      return { valid: false };
    }
    
    const tokenTime = parseInt(timestamp, 10);
    if (Date.now() - tokenTime > SESSION_DURATION) {
      return { valid: false };
    }
    
    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}

/**
 * Login with username and password
 */
export async function login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  if (username !== ADMIN_USERNAME) {
    return { success: false, error: 'Geçersiz kullanıcı adı' };
  }
  
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Geçersiz şifre' };
  }
  
  const token = createToken(username);
  return { success: true, token };
}

/**
 * Check if request is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  
  if (!sessionCookie) {
    return false;
  }
  
  const { valid } = verifyToken(sessionCookie.value);
  return valid;
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  
  if (!sessionCookie) {
    return null;
  }
  
  const { valid, username } = verifyToken(sessionCookie.value);
  return valid ? username || null : null;
}

/**
 * Set auth cookie in response
 */
export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });
  return response;
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}

/**
 * Middleware to protect admin routes
 */
export async function adminAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  const { valid } = verifyToken(sessionCookie.value);
  
  if (!valid) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }
  
  return null; // Continue to the route
}

/**
 * API route protection wrapper
 */
export async function requireAuth(request: NextRequest): Promise<{ authenticated: boolean; response?: NextResponse }> {
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
  
  if (!sessionCookie) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  
  const { valid } = verifyToken(sessionCookie.value);
  
  if (!valid) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'Session expired' }, { status: 401 }),
    };
  }
  
  return { authenticated: true };
}
