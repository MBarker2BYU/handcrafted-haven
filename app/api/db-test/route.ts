// /app/api/db-test/route.ts

import { initializeDatabase } from "@/database";
import { getUsersCollection } from "@/database/collections/user";

export async function GET() {
  await initializeDatabase();

  const users = await getUsersCollection();
  const list = await users.find().toArray();

  return Response.json({
    ok: true,
    users: list,
  });
}
