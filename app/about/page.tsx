// app/about/page.tsx — FULL & WORKING
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <h1 className="text-6xl font-black text-center text-scarlet mb-12">
        About Handcrafted Haven
      </h1>

      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
        <div className="text-9xl mb-8">🅾️</div>
        
        <p className="text-2xl text-gray-700 leading-relaxed mb-8">
          Handcrafted Haven was born from a love of Ohio State and the incredible talent of local artisans.
        </p>

        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          Every piece is made with passion, pride, and Buckeye spirit. From scarlet & gray ornaments to hand-painted signs, 
          we connect conscious consumers with creators who pour their heart into every detail.
        </p>

        <div className="text-5xl font-black text-scarlet mb-8">
          Go Bucks! Beat scUM!
        </div>

        <Link 
          href="/artisans" 
          className="inline-block bg-scarlet text-white px-12 py-6 rounded-xl text-2xl font-bold hover:bg-red-700 transition shadow-xl"
        >
          Meet Our Artisans
        </Link>
      </div>
    </div>
  );
}