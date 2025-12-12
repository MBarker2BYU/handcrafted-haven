import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/database/db";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email));

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email };
        },
    }),
  ],
  session: { strategy: "jwt" },
});
