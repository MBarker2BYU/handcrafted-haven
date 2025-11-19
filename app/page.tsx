import { getDatabase } from '@/lib/database';

// Add proper TypeScript interfaces right here
interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  price_cents: number;
  category: string | null;
  image_urls: string;
  stock: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const db = getDatabase();

  // Now TypeScript knows exactly what we're getting
  const users = db.prepare('SELECT * FROM users').all() as User[];
  const products = db.prepare('SELECT * FROM products').all() as Product[];

  return (
    <main className="min-h-screen bg-scarlet p-12">
      <h1 className="text-4xl font-bold text-white mb-8">Database Verification – Success!</h1>
      
      <div className="bg-white rounded-lg p-8 max-w-4xl shadow-lg">
        <h2 className="text-2xl font-bold text-scarlet mb-4">
          Users Found: {users.length}
        </h2>
        {users.map((u) => (
          <div key={u.id} className="mb-3 p-3 bg-gray-50 rounded">
            {u.name} – <span className="text-gray-600">{u.email}</span>
          </div>
        ))}

        <h2 className="text-2xl font-bold text-scarlet mt-10 mb-4">
          Products Found: {products.length}
        </h2>
        {products.map((p) => (
          <div key={p.id} className="border-l-4 border-scarlet pl-4 mb-6">
            <strong className="text-xl">{p.title}</strong>
            <p className="text-gray-700 mt-1">{p.description}</p>
            <p className="text-scarlet font-bold text-lg mt-2">
              ${(p.price_cents / 100).toFixed(2)} • {p.stock} in stock
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}