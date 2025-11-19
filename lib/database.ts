import Database from 'better-sqlite3';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const dbPath = resolve(process.cwd(), 'database/handcrafted-haven.sqlite3');
let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db || !db.open) {
    db = new Database(dbPath, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    });
    db.pragma('foreign_keys = ON');
    
    const initSql = readFileSync(resolve(process.cwd(), 'database/init.sql'), 'utf-8');
    db.exec(initSql);
  }
  return db;
}

export function closeDatabase(): void {
  db?.close();
}