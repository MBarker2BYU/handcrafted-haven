// /database/seed.ts

import { getUsersCollection } from "./collections/user";

let seeded = false;

export async function runSeedIfNeeded() {
  if (seeded) return; // Prevent double-seeding
  seeded = true;

  const shouldSeed = process.env.DATABASE_SEED === "true";

  if (!shouldSeed) return;

  console.log("🌱 DATABASE_SEED=true → Seeding database...");

  const users = await getUsersCollection();
  const count = await users.countDocuments();

  if (count > 0) {
    console.log("➡️ Users already exist, skipping seed.");
    return;
  }

  await users.insertOne({
    email: "admin@example.com",
    name: "Admin",
    createdAt: new Date(),
  });

  console.log("✅ Seed complete");
}
