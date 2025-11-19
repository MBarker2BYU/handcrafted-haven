// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Handcrafted Haven – Unique Handmade Treasures',
  description: 'Discover artisan-crafted goods with Ohio State pride. Go Bucks! 🅾️',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Navbar />
        <main>{children}</main>
        {/* Simple footer */}
        <footer className="bg-scarlet text-white py-12 mt-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-lg">© 2025 Handcrafted Haven • Made with ❤️ and Buckeye Spirit</p>
            <p className="text-4xl mt-4">🅾️</p>
          </div>
        </footer>
      </body>
    </html>
  );
}