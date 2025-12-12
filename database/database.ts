import postgres from "postgres";

export const database = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});
