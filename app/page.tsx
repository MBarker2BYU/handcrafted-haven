export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-scarlet">
        <h1 className="text-5xl font-bold text-on-scarlet mb-4">Handcrafted Haven</h1>
        <p className="text-xl text-white text-muted max-w-md text-center">
          Connecting artisans with lovers of handmade treasures. Go Bucks! 🅾️
        </p>
        <button className="mt-6 px-6 py-3 bg-white text-scarlet font-semibold rounded focus-visible focus-ring">
          Explore Crafts
        </button>
      </main>
    </>
  );
}