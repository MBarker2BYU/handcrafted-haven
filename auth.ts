// /auth.ts   ← final version, no more TS errors

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { db } from '@/database/db';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { connect } from '@/database/db';

await connect();

async function getUser(email: string): Promise<User | undefined> {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      password: users.password,
      role: users.role,                    // ← can be string | null
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const row = result[0];
  if (!row) return undefined;

  return {
    id: row.id,
    email: row.email,
    password: row.password,
    role: row.role ?? 'user',   // ← convert null → 'user' here
  };
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user) return null;

        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,                   // now guaranteed to be string
        };
      },
    }),
  ],
});