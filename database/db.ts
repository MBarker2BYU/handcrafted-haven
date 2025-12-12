// database/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env" });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Connect once when the module loads
client.connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

export const db = drizzle(client);