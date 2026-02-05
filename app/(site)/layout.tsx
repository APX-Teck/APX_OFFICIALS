import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="bg-blobs">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>

      <Navbar />
      <main className="pt-16 relative z-[1]">{children}</main>
      <Footer />
    </div>
  );
}
