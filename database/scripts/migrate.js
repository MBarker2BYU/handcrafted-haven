import fs from "fs";
import postgres from "postgres";

const database = postgres(process.env.POSTGRES_URL, { ssl: "require" });

const migrationDir = "./database/migrations";

for (const file of fs.readdirSync(migrationDir)) {
  const sql = fs.readFileSync(`${migrationDir}/${file}`, "utf8");
  await database`${database.unsafe(sql)}`;
}

console.log("Migrations complete");
process.exit(0);
