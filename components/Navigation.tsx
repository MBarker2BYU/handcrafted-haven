'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Artisans', href: '/artisans' },
    { name: 'Cart', href: '/cart' },
    { name: 'About', href: '/about' },
  ];

  // Robust check for Handcrafted Haven session cookie (handles possible prefixes)
  useEffect(() => {
    const checkSession = () => {
      const cookies = document.cookie.split(';');
      const hasSession = cookies.some((item) => {
        const cookie = item.trim();
        return cookie.startsWith('handcrafted-haven.session-token=') ||
               cookie.startsWith('__Secure-handcrafted-haven.session-token=') ||
               cookie.startsWith('__Host-handcrafted-haven.session-token=');
      });
      setIsLoggedIn(hasSession);
    };

    checkSession();

    // Re-check on navigation (post-login/logout redirect) + light polling fallback
    const interval = setInterval(checkSession, 1000);

    return () => clearInterval(interval);
  }, [pathname]);

  const linkClasses = (href: string) =>
    `relative hover:scale-120 transition ${
      pathname === href
        ? 'after:absolute after:bottom-[-10px] after:left-0 after:w-full after:h-1 after:bg-white after:scale-x-100'
        : 'after:absolute after:bottom-[-10px] after:left-0 after:w-full after:h-1 after:bg-white after:scale-x-0 hover:after:scale-x-100'
    } after:transition-transform after:duration-300`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-37.5 bg-scarlet shadow-2xl">
        <div className="flex h-full items-center justify-between px-8 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <span className="text-2xl font-black text-scarlet">HH</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Handcrafted Haven
              </h1>
              <p className="text-xs text-white/80 -mt-1">Go Bucks!</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-12 text-white text-lg font-semibold">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className={linkClasses(item.href)}>
                {item.name}
              </a>
            ))}
            {/* Login/Logout - Desktop */}            
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white"
            aria-label="Open menu"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-0 top-37.5 bg-scarlet shadow-2xl transition-all duration-300 z-40 ${
          mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <nav className="flex flex-col items-center py-16 gap-12 text-white text-3xl font-bold">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={linkClasses(item.href).replace('-bottom-2.5', '-bottom-4')}
            >
              {item.name}
            </a>
          ))}          
          <p className="text-7xl mt-8">O-H!</p>
        </nav>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 z-30 md:hidden"
        />
      )}
    </>
  );
}