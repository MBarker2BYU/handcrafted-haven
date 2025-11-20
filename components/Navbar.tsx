// components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
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
          {/* <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="text-white font-semibold hover:text-gray-200 transition">
              Home
            </Link>
            <Link href="/artisans" className="text-white font-semibold hover:text-gray-200 transition">
              Artisans
            </Link>
            <Link href="/categories" className="text-white font-semibold hover:text-gray-200 transition">
              Categories
            </Link>
            <Link href="/about" className="text-white font-semibold hover:text-gray-200 transition">
              About
            </Link>
          </div> */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="text-white font-bold hover:text-gray-200 transition">Home</Link>
            <Link href="/artisans" className="text-white font-bold hover:text-gray-200 transition">Artisans</Link>
            <Link href="/categories" className="text-white font-bold hover:text-gray-200 transition">Categories</Link>
            <Link href="/about" className="text-white font-bold hover:text-gray-200 transition">About</Link>
            <Link href="/cart" className="text-white font-bold hover:text-gray-200 transition">Cart</Link>
          </div>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-6">
            <button
              aria-label="Shopping cart - 0 items"
              className="text-white hover:text-gray-200 transition relative"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-white text-scarlet text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile menu button (will add functionality later) */}
            <button
              aria-label="Open menu"
              className="md:hidden text-white hover:text-gray-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}