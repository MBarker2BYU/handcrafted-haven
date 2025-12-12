import { db, connect } from "./db";
import { users } from "./schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function seed() {
  await connect();

  console.log("Checking for existing admin...");

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@example.com"));

  if (existing.length === 0) {
    console.log("Creating admin user...");

    await db.insert(users).values({
      email: "admin@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "admin",
    });

    console.log("Admin user created.");
  } else {
    console.log("Admin already exists.");
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
