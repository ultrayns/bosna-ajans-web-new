/**
 * Admin Logout API Route
 * POST /api/admin/auth/logout
 */
import { clearAuthCookie } from '@/lib/admin/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  return clearAuthCookie(response);
}
