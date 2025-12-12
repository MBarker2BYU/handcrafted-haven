// database/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env" });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(client);

export async function connect() {
  await client.connect();
}
