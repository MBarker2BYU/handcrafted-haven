// lib/database.ts — FINAL VERSION WITH CART TABLE
import Database from 'better-sqlite3';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const dbPath = resolve(process.cwd(), 'database/handcrafted-haven.sqlite3');
let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!dbInstance || dbInstance.open === false) {
    dbInstance = new Database(dbPath, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    });

    dbInstance.pragma('foreign_keys = ON');

    // Run init if brand new
    const hasUsers = dbInstance.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (!hasUsers) {
      const initSql = readFileSync(resolve(process.cwd(), 'database/init.sql'), 'utf-8');
      dbInstance.exec(initSql);
    }

    // Auto-seed Scarlet
    const scarlet = dbInstance.prepare("SELECT id FROM users WHERE email = ?").get('scarlet@handcraftedhaven.com');
    if (!scarlet) {
      const seedSql = readFileSync(resolve(process.cwd(), 'database/seed-test-artisan.sql'), 'utf-8');
      dbInstance.exec(seedSql);
    }

    // ADD THIS: CREATE CART TABLE
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    // Reviews table
    const hasReviews = dbInstance.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='reviews'").get();
    if (!hasReviews) {
      const reviewsSql = readFileSync(resolve(process.cwd(), 'database/03-add-reviews.sql'), 'utf-8');
      dbInstance.exec(reviewsSql);
    }
  }

  return dbInstance;
}

export function closeDatabase() {
  dbInstance?.close();
  dbInstance = null;
}