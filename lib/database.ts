// lib/database.ts — FULL FINAL VERSION
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

    // Auto-seed Scarlet if she doesn't exist
    const scarlet = dbInstance.prepare("SELECT id FROM users WHERE email = ?").get('scarlet@handcraftedhaven.com');
    if (!scarlet) {
      const seedSql = readFileSync(resolve(process.cwd(), 'database/seed-test-artisan.sql'), 'utf-8');
      dbInstance.exec(seedSql);
    }

    // ADD THIS BLOCK — RUN REVIEWS MIGRATION ONLY ONCE
    const hasReviewsTable = dbInstance.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='reviews'").get();
    if (!hasReviewsTable) {
      const reviewsMigration = readFileSync(resolve(process.cwd(), 'database/03-add-reviews.sql'), 'utf-8');
      dbInstance.exec(reviewsMigration);
    }

    // Seed a test review
    const hasReview = dbInstance.prepare("SELECT 1 FROM reviews LIMIT 1").get();
    if (!hasReview) {
      const reviewSeed = `
        INSERT INTO reviews (product_id, user_id, rating, review_text)
        SELECT 1, u.id, 5, 'Absolutely stunning! Perfect Buckeye gift! Go Bucks! 🅾️'
        FROM users u WHERE email = 'scarlet@handcraftedhaven.com';
      `;
      dbInstance.exec(reviewSeed);
    }
  }

  return dbInstance;
}

export function closeDatabase() {
  dbInstance?.close();
  dbInstance = null;
}