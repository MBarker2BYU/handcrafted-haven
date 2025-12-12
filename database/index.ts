// /database/index.ts

import { getDatabase } from "./connect";
import { runSeedIfNeeded } from "./seed";

export async function initializeDatabase() {
  await getDatabase();
  await runSeedIfNeeded();
}
