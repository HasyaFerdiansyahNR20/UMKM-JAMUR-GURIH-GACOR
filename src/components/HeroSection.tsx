"use client";

import React from "react";
import { Star, ShoppingBag, ArrowDown, MessageCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";
import { formatRupiahShort } from "@/lib/utils";

interface HeroSectionProps {
  featuredProduct: Product;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ featuredProduct }) => {
  const { addItem, openCart } = useCart();

  const handleOrderNow = () => {
    handleScrollToCatalog();
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById("katalog") || document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="beranda" className="relative pt-6 pb-16 lg:py-16 overflow-hidden bg-[#faf8f5]">
      {/* Decorative ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Featured Dish Presentation */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            
            {/* Visual presentation wrapper */}
            <div className="relative w-full max-w-lg lg:max-w-xl group">
              
              {/* Circular Price Badge */}
              <div className="absolute -top-4 right-4 sm:right-8 z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-[#5b7b28] bg-white shadow-xl flex flex-col items-center justify-center p-2 transform rotate-6 hover:rotate-0 transition-transform">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-tight leading-none">
                  MULAI DARI
                </span>
                <span className="text-base sm:text-lg font-black text-[#5b7b28] leading-tight mt-0.5">
                  5 Ribuan
                </span>
              </div>

              {/* Takeaway Container with Crispy Dish */}
              <div className="relative z-10 bg-stone-900 rounded-3xl p-3 sm:p-4 shadow-2xl shadow-stone-900/30 border-4 border-stone-800 transform hover:scale-[1.01] transition-transform duration-300">
                <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-stone-950">
                  <img
                    src={featuredProduct.image_url}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle steam / depth gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Typography & Order Callouts */}
          <div className="lg:col-span-5 text-left">
            
            {/* Tagline Motto Badge with Official Mascot */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-100 border border-amber-300 shadow-sm shrink-0">
                <img
                  src="/logo-gurih-gacor.jpg"
                  alt="Mascot Gurih Gacor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wide uppercase shadow-sm">
                <span>&ldquo;KRIUK-KRIUK NYA BIKIN NGILER!&rdquo;</span>
              </div>
            </div>

            {/* Subtitle Category */}
            <p className="font-serif italic text-2xl sm:text-3xl text-stone-700 font-semibold mb-1">
              Gourmet Crispy Nusantara
            </p>

            {/* Bold Giant Food Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-none mb-4">
              {featuredProduct.name.split(" ")[0]}{" "}
              <span className="text-amber-600">
                {featuredProduct.name.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            {/* Star Rating & Reviews */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-extrabold text-stone-900">
                {featuredProduct.rating || 4.8}
              </span>
              <span className="text-xs text-stone-500 font-medium underline cursor-pointer">
                {featuredProduct.review_count || 521} Ulasan Pelanggan
              </span>
            </div>

            {/* Action Buttons matching owner requirements (Lihat Produk & Pesan Sekarang) */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleOrderNow}
                className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                PESAN SEKARANG
              </button>

              <button
                onClick={handleScrollToCatalog}
                className="px-7 py-3.5 rounded-full border-2 border-stone-300 hover:border-stone-800 text-stone-700 hover:text-stone-950 font-bold text-xs sm:text-sm tracking-wider uppercase bg-transparent transition-all flex items-center gap-2 active:scale-95"
              >
                <span>LIHAT PRODUK</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
