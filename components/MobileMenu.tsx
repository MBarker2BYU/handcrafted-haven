'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Artisans', href: '/artisans' },
    { name: 'Cart', href: '/cart' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-37.5 bg-scarlet shadow-2xl overflow-visible">
        <div className="flex h-full items-center justify-between px-8 max-w-7xl mx-auto">

          <Link href="/" className="flex items-center space-x-4 group">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
              <span className="text-3xl font-black text-scarlet">HH</span>
            </div>
            <div className="leading-tight">
              <h1 className="text-3xl font-black text-white tracking-wider drop-shadow-lg">
                Handcrafted Haven
              </h1>
              <p className="text-sm text-white/90">Go Bucks! 🅾️</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-12 text-white text-xl font-bold">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-white after:transition-transform after:duration-300 ${
                  pathname === item.href ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu – NOW WITH PERFECT UNDERLINES */}
      <div className={`fixed inset-x-0 top-37.5 bg-scarlet shadow-2xl transition-all duration-300 z-40 ${
        mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}>
        <nav className="flex flex-col items-center py-20 gap-16 text-white text-4xl font-black">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`relative pb-3 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1.5 after:rounded-full after:bg-white after:transition-transform after:duration-300 ${
                pathname === item.href ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
              }`}
            >
              {item.name}
            </a>
          ))}
          <p className="text-8xl mt-12">O-H!</p>
        </nav>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/80 z-30 md:hidden" />
      )}
    </>
  );
}