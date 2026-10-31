import { productService } from "@/services/productService";
import { promoService } from "@/services/promoService";
import { getStoreSettingsAction } from "@/actions/settings";
import { HeroSection } from "@/components/HeroSection";
import { WavyDivider } from "@/components/WavyDivider";
import { MenuCardsRow } from "@/components/MenuCardsRow";
import { PromoSlider } from "@/components/PromoSlider";
import { CatalogGrid } from "@/components/CatalogGrid";
import { HowToOrderSection } from "@/components/HowToOrderSection";
import { AboutSection } from "@/components/AboutSection";
import { GallerySection } from "@/components/GallerySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";

// Revalidate page data every 30 seconds
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories, promotions, settings] = await Promise.all([
    productService.getProducts(),
    productService.getCategories(),
    promoService.getPromotions(),
    getStoreSettingsAction(),
  ]);

  // Pick hero featured product (first product or bestseller)
  const heroProduct =
    products.find((p) => p.is_bestseller) || products[0] || {
      id: "hero-default",
      name: "Jamur Crispy Original",
      description: "Jamur tiram segar pilihan dibalut tepung rempah rahasia 7 bumbu khas Nusantara, digoreng garing keemasan. Super renyah di luar, lembut di dalam. KRIUK-KRIUK NYA BIKIN NGILER!",
      price: 5000,
      original_price: null,
      image_url: "/products/jamur-crispy-original.webp",
      availability_status: "available",
      rating: 4.9,
      review_count: 521,
    };

  // 3 highlight menu items for the cards below the wave
  const highlightedProducts = products.slice(0, 3);

  // PRD Non-Fungsional: Emergency text mode if database is down or maintenance toggled
  if (settings.emergencyStaticMode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-amber-100 border border-amber-300 rounded-3xl p-8">
          <h1 className="text-2xl font-black text-amber-900 mb-2">
            MODE DARURAT OPERASIONAL — UMKM GURIH GACOR
          </h1>
          <p className="text-sm text-amber-800 mb-6 font-semibold">
            {settings.tagline}
          </p>
          <div className="bg-white rounded-2xl p-6 text-left space-y-4 mb-6 text-stone-800 text-sm">
            <h2 className="font-bold text-base border-b pb-2">Daftar Menu Cepat Saji:</h2>
            {products.map((p) => (
              <div key={p.id} className="flex justify-between border-b pb-2">
                <span>{p.name}</span>
                <span className="font-bold text-amber-700">Rp {p.price.toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=Halo%20Admin%2C%20saya%20ingin%20memesan%20makanan.`}
            className="inline-block px-8 py-3.5 rounded-full bg-emerald-600 text-white font-extrabold text-sm uppercase shadow-lg"
          >
            Pesan Cepat via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* 1. BERANDA (HERO SECTION: Logo, Slogan, Foto Produk Unggulan, Tombol Lihat Produk & Pesan Sekarang) */}
      <HeroSection featuredProduct={heroProduct} />

      {/* ORGANIC CURVE TRANSITION */}
      <WavyDivider />

      {/* 3 HIGHLIGHTED FAVORITE DISHES */}
      <MenuCardsRow products={products} />

      {/* PROMO BANNER SLIDER */}
      <PromoSlider promotions={promotions} />

      {/* 2 & 3. KATALOG PRODUK & DETAIL PRODUK (Foto, Nama, Harga, Ukuran/Berat, Varian Rasa, Deskripsi, Ketersediaan, Pesan via WA) */}
      <CatalogGrid products={products} categories={categories} />

      {/* 7. CARA PEMESANAN (4 Langkah: Pilih Produk -> Pesan -> Konfirmasi -> Kirim) */}
      <HowToOrderSection />

      {/* 4. TENTANG KAMI (Profil UMKM, Sejarah, Visi & Misi, Keunggulan Gurih Gacor) */}
      <AboutSection />

      {/* 5. GALERI (Foto Produk, Kemasan, Proses Produksi, Aktivitas UMKM) */}
      <GallerySection />

      {/* 6. TESTIMONI (Review dari Pelanggan & Skor Kepuasan) */}
      <TestimonialsSection />

      {/* 8. KONTAK (WhatsApp, Instagram, TikTok, Alamat, Google Maps, Jam Operasional) */}
      <ContactSection />
    </div>
  );
}
