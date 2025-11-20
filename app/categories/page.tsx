// app/categories/page.tsx — FULL & WORKING
import { getDatabase } from '@/lib/database';
import Link from 'next/link';

export default function CategoriesPage() {
  const db = getDatabase();

  const categories = db.prepare(`
    SELECT category, COUNT(*) as count
    FROM products
    WHERE category IS NOT NULL AND is_active = 1
    GROUP BY category
    ORDER BY count DESC
  `).all() as { category: string; count: number }[];

  const popular = ['Home Decor', 'Jewelry', 'Apparel', 'Accessories'];

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <h1 className="text-6xl font-black text-center text-scarlet mb-16">
        Shop by Category
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {popular.concat(categories.map(c => c.category)).filter((v, i, a) => a.indexOf(v) === i).map(cat => {
          const count = categories.find(c => c.category === cat)?.count || 0;
          return (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-4"
            >
              <div className="h-48 bg-linear-to-br from-scarlet to-red-700 flex items-center justify-center">
                <span className="text-6xl">🅾️</span>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-scarlet transition">
                  {cat}
                </h3>
                <p className="text-gray-600">{count} items</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}