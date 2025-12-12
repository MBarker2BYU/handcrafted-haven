// app/layout.tsx
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Handcrafted Haven",
  description: "Ohio State themed artisan marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray">
        <Navigation />

        {/* Removed pt-[150px] - forms now center properly */}
        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}