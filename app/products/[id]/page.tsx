// app/products/[id]/page.tsx
import { getDatabase } from '@/lib/database';
import type { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }: { params: { id: string } }) {
  const db = getDatabase();

  const product = db
    .prepare(`
      SELECT p.id, p.title, p.description, p.price_cents, p.image_urls, p.stock,
             s.shop_name, s.bio, u.name as artisan_name
      FROM products p
      JOIN sellers s ON p.seller_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE p.id = ? AND p.is_active = 1
    `)
    .get(params.id) as (Product & { shop_name: string; bio: string; artisan_name: string }) | undefined;

  if (!product) {
    notFound();
  }

  const images = JSON.parse(product.image_urls) as string[];
  const price = (product.price_cents / 100).toFixed(2);

  return (
    <>
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <Link href="/" className="text-scarlet hover:underline mb-8 inline-block">
          ← Back to Home
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center mb-6">
              <span className="text-8xl">🅾️</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="bg-gray-200 border-2 border-dashed rounded-lg h-24 flex items-center justify-center">
                  <span className="text-4xl">🅾️</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-scarlet">${price}</span>
              <span className="text-green-600 font-semibold">{product.stock} in stock</span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <button className="w-full bg-scarlet text-white py-4 rounded-lg text-xl font-bold hover:bg-red-700 transition shadow-lg">
              Add to Cart
            </button>

            {/* Artisan Card */}
            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-bold text-scarlet mb-3">Meet the Artisan</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-scarlet rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {product.artisan_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-lg">{product.artisan_name}</p>
                  <p className="text-gray-600">{product.shop_name}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700 italic">"{product.bio}"</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}