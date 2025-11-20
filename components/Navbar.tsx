// components/Navbar.tsx — FINAL VERSION (CART COUNT ALWAYS VISIBLE)
import Link from 'next/link';
import { getDatabase } from '@/lib/database';

async function getCartCount() {
  'use server';
  try {
    const db = getDatabase();
    
    // This query will return 0 if table is empty or doesn't exist yet
    const result = db.prepare(`
      SELECT COALESCE(SUM(quantity), 0) as total 
      FROM cart 
      WHERE EXISTS (SELECT 1 FROM products WHERE id = cart.product_id)
    `).get() as { total: number };
    
    return result.total;
  } catch (error) {
    // If table doesn't exist yet, return 0
    return 0;
  }
}

export default async function Navbar() {
  const cartCount = await getCartCount();

  return (
    <header className="bg-scarlet shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <span className="text-2xl font-black text-scarlet">HH</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Handcrafted Haven
              </h1>
              <p className="text-xs text-white/80 -mt-1">Go Bucks! 🅾️</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="text-white font-bold hover:text-gray-200 transition">Home</Link>
            <Link href="/artisans" className="text-white font-bold hover:text-gray-200 transition">Artisans</Link>
            <Link href="/categories" className="text-white font-bold hover:text-gray-200 transition">Categories</Link>
            <Link href="/about" className="text-white font-bold hover:text-gray-200 transition">About</Link>
          </div>

          {/* Cart Icon with ALWAYS VISIBLE Count */}
          <Link 
            href="/cart" 
            className="relative"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <div className="relative">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              
              {/* ALWAYS SHOW BADGE - even if 0 */}
              <span className="absolute -top-3 -right-3 bg-white text-scarlet text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg ring-4 ring-scarlet/30">
                {cartCount}
              </span>
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}