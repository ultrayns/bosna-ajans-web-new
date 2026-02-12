/**
 * Admin Session Check API Route
 * GET /api/admin/auth/session
 */
import { getCurrentUser } from '@/lib/admin/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const username = await getCurrentUser();

  if (!username) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: { username },
  });
}
