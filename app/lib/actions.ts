// app/lib/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { hash } from 'bcrypt';
import { db } from '@/database/db';
import { users } from '@/database/schema';
import { signIn } from '@/auth';

export async function registerAction(prevState: { message: string } | undefined, formData: FormData) {
  const email = formData.get('email')?.toString().trim()?.toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password || password.length < 6) {
    return { message: 'Valid email and password (6+ characters) required' };
  }

  const hashed = await hash(password, 12);

  try {
    await db.insert(users).values({ email, password: hashed });
  } catch (error: any) {
    if (error?.code === '23505' || error.message.includes('duplicate key')) {
      return { message: 'Email already exists – try logging in instead' };
    }
    console.error('Registration DB error:', error);
    return { message: 'Database error – please try again later' };
  }

  // Correct syntax for Auth.js v5
  await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  redirect('/login');
}

export async function loginAction(prevState: { message: string } | undefined, formData: FormData) {
  const email = formData.get('email')?.toString().trim()?.toLowerCase();
  const password = formData.get('password')?.toString();

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error: any) {
    if (error.type === 'CredentialsSignin') {
      return { message: 'Invalid email or password' };
    }
    return { message: 'Login failed – please try again' };
  }

  redirect('/');
}