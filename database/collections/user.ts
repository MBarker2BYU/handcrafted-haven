// /database/collections/users.ts

import { getDatabase } from "../connect";

export async function getUsersCollection() {
  const db = await getDatabase();
  return db.collection("users");
}
