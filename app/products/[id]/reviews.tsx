// app/products/[id]/reviews.tsx — FULL FILE
import { getDatabase } from '@/lib/database';

interface Review {
  id: number;
  rating: number;
  review_text: string;
  created_at: string;
  name: string;
}

export default function ProductReviews({ productId }: { productId: number }) {
  const db = getDatabase();

  const reviews = db.prepare(`
    SELECT r.*, u.name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `).all(productId) as Review[];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="mt-20 border-t pt-16">
      <h2 className="text-4xl font-bold text-center text-scarlet mb-12">
        Customer Reviews ({reviews.length})
      </h2>

      <div className="text-center mb-12">
        <div className="text-6xl font-black text-[#BB0000]">{avgRating} ★</div>
        <p className="text-xl text-gray-600 mt-4">Average Rating</p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-xl text-gray-600">Be the first to review this item!</p>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xl font-bold">{review.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-3xl font-black text-[#BB0000]">
                  {review.rating} ★
                </div>
              </div>
              {review.review_text && (
                <p className="text-lg text-gray-700 italic">"{review.review_text}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}