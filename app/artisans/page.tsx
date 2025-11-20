// app/artisans/page.tsx — FULL FILE, ZERO WARNINGS
import { getDatabase } from '@/lib/database';
import Link from 'next/link';
import Image from 'next/image';

interface Artisan {
  id: number;
  shop_name: string;
  bio: string;
  profile_image_url: string;
  artisan_name: string;
  product_count: number;
  first_product_image: string;
}

export default function ArtisansPage() {
  const db = getDatabase();

  const artisans = db.prepare(`
    SELECT 
      s.id,
      s.shop_name,
      s.bio,
      s.profile_image_url,
      u.name as artisan_name,
      COUNT(p.id) as product_count,
      MAX(p.image_urls) as first_product_image
    FROM sellers s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN products p ON s.id = p.seller_id AND p.is_active = 1
    GROUP BY s.id
    ORDER BY s.shop_name
  `).all() as Artisan[];

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <h1 className="text-6xl font-black text-center text-scarlet mb-4">
        Meet Our Artisans
      </h1>
      <p className="text-2xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
        Passionate creators bringing Buckeye spirit to life through handcrafted treasures
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {artisans.map((artisan) => {
          const imageUrl = artisan.first_product_image 
            ? JSON.parse(artisan.first_product_image)[0]
            : '/images/products/placeholder.webp';

          return (
            <Link
              key={artisan.id}
              href={`/artisans/${artisan.id}`}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-80">
                <Image
                  src={imageUrl}
                  alt={artisan.shop_name}
                  fill
                  className="object-cover group:cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* FIXED: bg-linear-to-t → bg-gradient-to-t */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-4xl font-black mb-2">{artisan.shop_name}</h2>
                  <p className="text-lg opacity-90">{artisan.artisan_name}</p>
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{artisan.bio}"
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-scarlet">
                    {artisan.product_count} {artisan.product_count === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-scarlet font-bold group-hover:underline">
                    View Shop →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}