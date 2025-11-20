// app/cart/page.tsx — FULL FILE
import { getDatabase } from '@/lib/database';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function CartPage() {
  const db = getDatabase();

  const cartItems = db
    .prepare(`
      SELECT c.id, c.product_id, c.quantity,
             p.title, p.price_cents, p.image_urls
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE p.is_active = 1
    `)
    .all() as {
      id: number;
      product_id: number;
      quantity: number;
      title: string;
      price_cents: number;
      image_urls: string;
    }[];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);
  const total = (subtotal / 100).toFixed(2);

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <h1 className="text-5xl font-black text-scarlet mb-10">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-600 mb-8">Your cart is empty</p>
          <Link href="/" className="bg-scarlet text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-red-700 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {cartItems.map((item) => {
              const imageUrl = JSON.parse(item.image_urls)[0];
              const price = (item.price_cents / 100).toFixed(2);
              const lineTotal = (item.price_cents * item.quantity / 100).toFixed(2);

              return (
                <div key={item.id} className="flex items-center gap-6 p-6 border-b border-gray-200">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image src={imageUrl} alt={item.title} width={128} height={128} className="object-cover" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-scarlet font-bold">${price} each</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold">{item.quantity}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-scarlet">${lineTotal}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-right">
            <p className="text-3xl font-black text-gray-900">
              Total: <span className="text-scarlet">${total}</span>
            </p>
            <button className="mt-6 bg-scarlet text-white px-12 py-5 rounded-xl text-2xl font-bold hover:bg-red-700 transition shadow-xl">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}