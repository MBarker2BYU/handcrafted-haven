import { NextResponse } from "next/server";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    id: randomUUID(),
    email,
    password: hashed,
  });

  return NextResponse.json({ success: true });
}
