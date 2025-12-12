// /database/connection.ts

import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI missing from environment");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "my_app";

let client: MongoClient | null = null;
let database: Db | null = null;

export async function getDatabase(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
  }

  if (!database) {
    await client.connect();
    database = client.db(dbName);
  }

  return database;
}
