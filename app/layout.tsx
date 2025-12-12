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
      <body className="flex flex-col min-h-screen">
        <Navigation/>

        {/* Main content grows to push footer down when needed */}
        <main className="flex-1 pt-[150px]">{children}</main>

        {/* Footer always sticks to bottom of viewport */}
        <Footer />
      </body>
    </html>
  );
}