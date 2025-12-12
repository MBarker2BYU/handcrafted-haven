// app/api/test-auth/route.ts

import { NextResponse } from 'next/server';
import { signIn } from '@/auth';   // ← server version, NOT next-auth/react !!

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await signIn('credentials', {
    email: 'admin@example.com',
    password: 'password123',
    redirect: false,
  });

  return NextResponse.json(
    result?.error
      ? { success: false, message: 'Login failed — wrong email/password' }
      : { success: true, message: 'SUCCESS! Auth is working perfectly!' }
  );
}