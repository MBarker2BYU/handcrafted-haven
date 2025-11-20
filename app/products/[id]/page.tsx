// app/products/[id]/page.tsx — FINAL VERSION THAT WILL NEVER BREAK
import { getDatabase } from '@/lib/database';
import type { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductReviews from './reviews';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Turbopack requires await

  const db = getDatabase();

  const productId = Number(id);
  if (!productId || productId <= 0) notFound();

  const product = db.prepare(`
    SELECT p.*, s.shop_name, u.name as artisan_name, s.id as seller_id
    FROM products p
    JOIN sellers s ON p.seller_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE p.id = ? AND p.is_active = 1
  `).get(productId) as (Product & { shop_name: string; artisan_name: string; seller_id: number }) | undefined;

  if (!product) notFound();

  const images = JSON.parse(product.image_urls) as string[];
  const mainImage = images[0];
  const price = (product.price_cents / 100).toFixed(2);

  // Server Action — runs on server, no 'fs' issues
  const addToCart = async () => {
    'use server';
    await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id }),
    });
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <Link href="/" className="text-scarlet hover:underline mb-8 inline-block text-lg">
        ← Back to Home
      </Link>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{product.title}</h1>
            
            <div className="flex items-center gap-6 mb-8">
              <span className="text-5xl font-black text-[#BB0000] drop-shadow-md">
                ${price}
              </span>
              <span className="text-xl text-green-600 font-semibold">
                {product.stock} in stock
              </span>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-10">
              {product.description}
            </p>

            <form action={addToCart}>
              <button
                type="submit"
                className="w-full bg-scarlet text-white py-6 rounded-xl text-2xl font-bold университета hover:bg-red-700 transition shadow-xl"
              >
                Add to Cart
              </button>
            </form>
          </div>

          <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-scarlet mb-4">Handcrafted by</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-scarlet rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {product.artisan_name.charAt(0)}
              </div>
              <div>
                <p className="text-xl font-bold">{product.artisan_name}</p>
                <Link href={`/sellers/${product.seller_id}`} className="text-scarlet hover:underline">
                  {product.shop_name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductReviews productId={product.id} />      
    </div>
  );
}