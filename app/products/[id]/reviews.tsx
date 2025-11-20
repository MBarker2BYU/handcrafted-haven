// app/products/[id]/reviews.tsx
import { getDatabase } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function addReview(formData: FormData) {
  'use server';

  const db = getDatabase();
  const productId = formData.get('productId') as string;
  const rating = Number(formData.get('rating'));
  const comment = formData.get('comment') as string;
  const reviewerName = (formData.get('name') as string)?.trim() || 'Anonymous';

  db.prepare(`
    INSERT INTO reviews (product_id, rating, comment, reviewer_name, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).run(productId, rating, comment, reviewerName);

  revalidatePath(`/products/${productId}`);
}

export default function Reviews({ productId }: { productId: string }) {
  const db = getDatabase();
  const reviews = db.prepare(`
    SELECT * FROM reviews 
    WHERE product_id = ? 
    ORDER BY created_at DESC
  `).all(productId);

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold mb-8" style={{ color: '#BB0000' }}>
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-400 italic">No reviews yet — be the first!</p>
      ) : (
        <div className="space-y-6 mb-12">
          {reviews.map((r: any) => (
            <div key={r.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-3">
                <span className="font-semibold">{r.reviewer_name}</span>
                <span className="text-yellow-400">{'⭐'.repeat(r.rating)}</span>
              </div>
              <p className="text-gray-200">{r.comment}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <form action={addReview} className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
        <input name="productId" value={productId} readOnly hidden />

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Your Name (optional)</label>
          <input
            name="name"
            placeholder="Leave blank for Anonymous"
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#BB0000]"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Rating</label>
          <select
            name="rating"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#BB0000]"
          >
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <textarea
            name="comment"
            required
            rows={4}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#BB0000]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#BB0000] hover:bg-[#990000] text-white font-bold py-4 rounded-lg transition"
        >
          Submit Review
        </button>
      </form>
    </section>
  );
}