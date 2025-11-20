// app/api/cart/add/route.ts — FULL FILE
import { getDatabase } from '@/lib/database';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const db = getDatabase();
  const { productId } = await request.json();

  if (!productId || isNaN(Number(productId))) {
    return Response.json({ error: 'Invalid product' }, { status: 400 });
  }

  // Create cart table if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  // Add or increment
  const existing = db
    .prepare('SELECT id, quantity FROM cart WHERE product_id = ?')
    .get(productId) as { id: number; quantity: number } | undefined;

  if (existing) {
    db.prepare('UPDATE cart SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
  } else {
    db.prepare('INSERT INTO cart (product_id) VALUES (?)').run(productId);
  }

  return Response.json({ success: true });
}