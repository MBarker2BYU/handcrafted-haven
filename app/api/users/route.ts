import { NextResponse } from "next/server";
import { database } from "@/database/connect";
import { initDatabase } from "@/database/init";

// ensure DB ready for first call (idempotent)
await initDatabase();

export async function GET() {
  const rows = database.prepare("SELECT id, name, email, created_at FROM users ORDER BY id DESC").all();
  return NextResponse.json(rows);
}
