import postgres from "postgres";
import bcrypt from "bcrypt";

const database = postgres(process.env.POSTGRES_URL, { ssl: "require" });

const email = "admin@example.com";
const password = "P@ssw0rd"; // CHANGE THIS
const hashed = await bcrypt.hash(password, 10);

await database`
  INSERT INTO users (email, password)
  VALUES (${email}, ${hashed})
  ON CONFLICT (email) DO NOTHING;
`;

console.log("Seed complete");
process.exit(0);
