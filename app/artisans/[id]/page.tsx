// app/sellers/[id]/page.tsx
import { getDatabase } from '@/lib/database';
import type { Product } from '@/types/product';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ←←← REQUIRED FOR TURBOPACK
interface Props {
  params: Promise<{ id: string }>;
}

export default async function SellerPage({ params }: Props) {
  const { id } = await params; // ←←← THIS FIXES THE PROMISE ERROR

  const db = getDatabase();

  const sellerId = parseInt(id, 10);
  if (isNaN(sellerId) || sellerId <= 0) notFound();

  const seller = db
    .prepare(`
      SELECT s.id, s.shop_name, s.bio, s.profile_image_url, u.name as artisan_name
      FROM sellers s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `)
    .get(sellerId) as {
      id: number;
      shop_name: string;
      bio: string;
      profile_image_url: string;
      artisan_name: string;
    } | undefined;

  if (!seller) notFound();

  const products = db
    .prepare(`
      SELECT id, title, description, price_cents, image_urls, stock
      FROM products
      WHERE seller_id = ? AND is_active = 1
      ORDER BY created_at DESC
    `)
    .all(sellerId) as Product[];

  return (
    <>
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <Link href="/" className="text-scarlet hover:underline mb-8 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:w-1/3 bg-scarlet p-12 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-64 h-64 border-12 border-white/40 flex items-center justify-center">
                <span className="text-9xl font-black text-white">🅾️</span>
              </div>
            </div>
            <div className="md:w-2/3 p-12 flex flex-col justify-center">
              <h1 className="text-5xl font-bold text-scarlet mb-4">{seller.shop_name}</h1>
              <p className="text-2xl text-gray-700 mb-6">By {seller.artisan_name}</p>
              <p className="text-xl text-gray-700 leading-relaxed italic">"{seller.bio}"</p>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center text-scarlet mb-12">
          All Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-xl text-gray-600 py-20">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => {
              const price = (product.price_cents / 100).toFixed(2);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-64 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition">🅾️</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold group-hover:text-scarlet transition">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm my-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-scarlet">${price}</span>
                      <span className="text-sm text-green-600">{product.stock} in stock</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}