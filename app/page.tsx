import { getDatabase } from '@/lib/database';
import type { Product } from '@/types/product';

interface Artisan {
  shop_name: string;
  bio: string;
  profile_image_url: string;
}

export default function Home() {
  const db = getDatabase();

  // Featured artisan — Scarlet Weaver
  const artisan = db
    .prepare(`
      SELECT s.shop_name, s.bio, s.profile_image_url
      FROM sellers s
      JOIN users u ON s.user_id = u.id
      WHERE u.email = ?
    `)
    .get('scarlet@handcraftedhaven.com') as Artisan | undefined;

  // Her active products
  const products = db
    .prepare(`
      SELECT p.id, p.title, p.description, p.price_cents,
             p.image_urls, p.stock
      FROM products p
      JOIN sellers s ON p.seller_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE u.email = ?
        AND p.is_active = 1
    `)
    .all('scarlet@handcraftedhaven.com') as Product[];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-scarlet text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Handcrafted Haven</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Discover unique treasures made with passion by artisans who love what they do
          </p>
        </div>
      </section>

      {/* Featured Artisan */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-scarlet mb-16">
            Featured Artisan
          </h2>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto md:flex">
            <div className="md:w-1/3 bg-scarlet p-12 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-48 h-48 border-8 border-white/40 flex items-center justify-center">
                <span className="text-6xl">🅾️</span>
              </div>
            </div>

            <div className="md:w-2/3 p-10">
              <h3 className="text-3xl font-bold text-scarlet mb-3">
                {artisan?.shop_name ?? 'Loading...'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {artisan?.bio ?? 'A passionate artisan crafting Buckeye-inspired treasures.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-scarlet mb-16">
            Shop the Collection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.length === 0 ? (
              <p className="col-span-full text-center text-gray-600 text-xl">
                No products available yet. Check back soon!
              </p>
            ) : (
              products.map((product) => {
                const price = (product.price_cents / 100).toFixed(2);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    {/* Placeholder image — replace with real images later */}
                    <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-64 flex items-center justify-center">
                      <span className="text-6xl">🅾️</span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-scarlet">
                          ${price}
                        </span>
                        <button className="bg-scarlet text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                          View Item
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
}