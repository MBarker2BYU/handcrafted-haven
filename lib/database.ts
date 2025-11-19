import Database from 'better-sqlite3';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';

const dbPath = resolve(process.cwd(), 'database/handcrafted-haven.sqlite3');
let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!dbInstance || dbInstance.open === false) {
    dbInstance = new Database(dbPath, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    });

    dbInstance.pragma('foreign_keys = ON');

    // Run schema if brand new
    const hasUsers = dbInstance.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (!hasUsers) {
      const initSql = readFileSync(resolve(process.cwd(), 'database/init.sql'), 'utf-8');
      dbInstance.exec(initSql);
    }

    // Auto-seed Scarlet if she doesn't exist
    const scarlet = dbInstance.prepare("SELECT id FROM users WHERE email = ?").get('scarlet@handcraftedhaven.com');
    if (!scarlet) {
      const seedSql = readFileSync(resolve(process.cwd(), 'database/seed-test-artisan.sql'), 'utf-8');
      dbInstance.exec(seedSql);
    }
  }

  return dbInstance;
}

export function closeDatabase() {
  dbInstance?.close();
  dbInstance = null;
}