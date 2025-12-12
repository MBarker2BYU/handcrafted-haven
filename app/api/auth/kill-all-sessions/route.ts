// app/api/auth/kill-all-sessions/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({
    success: true,
    message: 'All Handcrafted Haven sessions cleared – isolated & safe',
  });

  // Clear ONLY our custom cookies
  response.cookies.set('handcrafted-haven.session-token', '', { maxAge: -1, path: '/' });
  response.cookies.set('handcrafted-haven.csrf-token', '', { maxAge: -1, path: '/' });
  response.cookies.set('handcrafted-haven.callback-url', '', { maxAge: -1, path: '/' });

  // Also clear old default ones (for existing sessions)
  response.cookies.set('authjs.session-token', '', { maxAge: -1, path: '/' });
  response.cookies.set('authjs.csrf-token', '', { maxAge: -1, path: '/' });
  response.cookies.set('authjs.callback-url', '', { maxAge: -1, path: '/' });

  return response;
}