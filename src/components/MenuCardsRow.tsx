"use client";

import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Product } from "@/types";

interface MenuCardsRowProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

// 3 Signature Card Theme Styles Matching Reference Mockup
const CARD_THEMES = [
  {
    // 1. Original: Warm Sunburst (Golden Amber to Deep Orange)
    gradient: "bg-gradient-to-b from-[#f59e0b] via-[#f97316] to-[#ea580c]",
    badgeGradient: "url(#badgeGradOriginal)",
    crumbsColor: "text-amber-200",
    shadow: "shadow-orange-950/20",
  },
  {
    // 2. Pedas: Fiery Chili Red-Orange
    gradient: "bg-gradient-to-b from-[#ea580c] via-[#dc2626] to-[#b91c1c]",
    badgeGradient: "url(#badgeGradPedas)",
    crumbsColor: "text-red-300",
    shadow: "shadow-red-950/25",
  },
  {
    // 3. Manis: Caramel Amber to Savory Brown
    gradient: "bg-gradient-to-b from-[#d97706] via-[#b45309] to-[#92400e]",
    badgeGradient: "url(#badgeGradManis)",
    crumbsColor: "text-amber-200",
    shadow: "shadow-amber-950/25",
  },
];

export const MenuCardsRow: React.FC<MenuCardsRowProps> = ({ products }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollToCatalog = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById("katalog") || document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#katalog";
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Curate the 3 primary cards to display
  const displayItems = products.slice(0, 3);

  return (
    <section className="relative bg-[#faf5ee] pt-8 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* 1. Latar Belakang Doodle Garis Halus (Jamur, Cabai, Daun Rempah) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full text-amber-900/15"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Doodle Kiri Atas */}
          <g transform="translate(30, 30) scale(0.65)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M15,45 C10,18 65,15 70,45 C72,50 12,50 15,45 Z" />
            <path d="M30,48 L32,70 C33,75 50,75 52,70 L55,48" />
          </g>
          <g transform="translate(110, 60) rotate(-15) scale(0.6)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M12,12 C28,22 45,58 24,80 C12,92 6,75 14,54 C20,38 18,22 12,12 Z" />
          </g>

          {/* Doodle Kanan Atas */}
          <g transform="translate(1180, 40) rotate(20) scale(0.65)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M12,12 C28,22 45,58 24,80 C12,92 6,75 14,54 C20,38 18,22 12,12 Z" />
          </g>
          <g transform="translate(1260, 80) scale(0.6)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M15,45 C10,18 65,15 70,45 C72,50 12,50 15,45 Z" />
            <path d="M30,48 L32,70 C33,75 50,75 52,70 L55,48" />
          </g>

          {/* Doodle Bawah Kiri & Kanan */}
          <g transform="translate(20, 480) scale(0.65)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M10,35 C10,10 50,10 50,35 Z" />
            <path d="M22,35 L22,50 C22,55 38,55 38,50 L38,35" />
          </g>
          <g transform="translate(1240, 470) scale(0.65)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M10,35 C10,10 50,10 50,35 Z" />
            <path d="M22,35 L22,50 C22,55 38,55 38,50 L38,35" />
          </g>
        </svg>

        {/* SVG Gradients for Badges */}
        <svg className="w-0 h-0 absolute">
          <defs>
            <linearGradient id="badgeGradOriginal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="badgeGradPedas" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="badgeGradManis" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 2. Subtitle Tagline Bersih Sesuai Gambar Acuan */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-stone-800 text-sm sm:text-base font-bold tracking-tight">
            Sensasi kriuk renyah di setiap gigitan dengan bumbu rempah khas Nusantara
          </p>
        </div>

        {/* 3. Carousel Wrapper dengan Navigasi Panah Kiri & Kanan */}
        <div className="relative">
          
          {/* Tombol Panah Kiri (<) */}
          <button
            type="button"
            onClick={() => scroll("left")}
            className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 border border-stone-200/80 items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Tombol Panah Kanan (>) */}
          <button
            type="button"
            onClick={() => scroll("right")}
            className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 border border-stone-200/80 items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Grid Container */}
          <div
            ref={scrollContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 lg:gap-8 pt-16 pb-8 overflow-x-auto no-scrollbar"
          >
            {displayItems.map((product, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              
              // Extract Name Parts
              const nameParts = product.name.split(" ");
              const prefix = nameParts[0] || "Jamur";
              const title = nameParts.slice(1).join(" ") || "Crispy";

              // Unique ingredient visuals per card
              const isOriginal = idx === 0 || product.name.toLowerCase().includes("original");
              const isPedas = idx === 1 || product.name.toLowerCase().includes("pedas");
              const isManis = idx === 2 || product.name.toLowerCase().includes("manis");

              return (
                <div key={product.id} className="relative pt-12 flex justify-center group">
                  
                  {/* The Gradient Card Container */}
                  <div
                    className={`${theme.gradient} w-full max-w-sm rounded-[32px] pt-24 pb-8 px-6 text-white shadow-2xl ${theme.shadow} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between`}
                  >
                    
                    {/* Floating Plate Visual (Melayang Menembus Atas Kartu) */}
                    <div
                      onClick={handleScrollToCatalog}
                      className="absolute -top-16 left-1/2 -translate-x-1/2 w-[85%] z-20 cursor-pointer transition-transform duration-500 group-hover:scale-105"
                      title="Klik untuk memilih ukuran & pesan"
                    >
                      <div className="relative">
                        
                        {/* Piring Makanan Oval Putih dengan Bayangan Lembut */}
                        <div className="relative rounded-[28px] overflow-hidden bg-white/30 p-1.5 border border-white/60 shadow-xl shadow-stone-950/30">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-40 sm:h-44 object-cover rounded-[22px] shadow-sm"
                          />
                        </div>

                        {/* Floating Price Badge (Scalloped Sunburst Stamp) */}
                        <div className="absolute -top-3 -right-3 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center filter drop-shadow-lg transform rotate-6 group-hover:rotate-0 transition-transform">
                          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                            <path
                              d="M50 0 L56 7 L65 5 L69 13 L78 13 L80 22 L89 25 L88 34 L96 39 L93 48 L99 55 L93 61 L97 70 L89 74 L90 83 L81 85 L79 94 L70 93 L66 100 L58 97 L52 100 L46 95 L39 99 L36 91 L27 92 L26 83 L17 82 L18 73 L10 71 L13 62 L6 57 L11 49 L6 42 L13 37 L10 28 L19 26 L19 17 L28 17 L31 9 L40 11 Z"
                              fill={theme.badgeGradient}
                            />
                          </svg>
                          <div className="absolute inset-1.5 rounded-full border border-dashed border-white/95 flex flex-col items-center justify-center text-center p-0.5">
                            <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-tight text-white leading-tight">
                              MULAI DARI
                            </span>
                            <span className="text-[10px] sm:text-xs font-black text-white leading-tight drop-shadow-sm">
                              5 Ribuan
                            </span>
                          </div>
                        </div>

                        {/* Hiasan Garnish Melayang Khusus Per Varian */}
                        {isPedas && (
                          <>
                            <span className="absolute -top-4 left-2 text-xl select-none animate-pulse">🌶️</span>
                            <span className="absolute -bottom-2 -right-2 text-base select-none">🌶️</span>
                          </>
                        )}
                        {isOriginal && (
                          <span className="absolute -bottom-2 left-1 text-sm select-none">🌿</span>
                        )}
                        {isManis && (
                          <span className="absolute -top-3 left-4 text-xs select-none">✨</span>
                        )}

                      </div>
                    </div>

                    {/* Card Content Details */}
                    <div className="mt-4 text-left">
                      {/* Cursive Subtitle / Category (Jamur) */}
                      <p className="font-serif italic text-lg sm:text-xl text-white/95 font-medium leading-none mb-1">
                        {prefix}
                      </p>

                      {/* Bold Display Food Title */}
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight line-clamp-1 mb-2">
                        {title}
                      </h3>

                      {/* 5 Stars Rating & Score */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex text-amber-300">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          ))}
                        </div>
                        <span className="text-xs font-black text-white">
                          {product.rating || 4.8}
                        </span>
                      </div>

                      {/* Short Description */}
                      <p className="text-white/90 text-xs line-clamp-2 leading-relaxed mb-6 font-normal">
                        {product.description}
                      </p>
                    </div>

                    {/* Bottom Golden 3D "ORDER NOW" Button (Fungsi Teruji: Scroll Mulus ke #katalog) */}
                    <div>
                      <a
                        href="#katalog"
                        onClick={handleScrollToCatalog}
                        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] hover:from-[#fde047] hover:to-[#ea580c] text-stone-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-amber-950/20 active:translate-y-0.5 active:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-amber-500/30"
                      >
                        <ShoppingBag className="w-4 h-4 text-stone-950 shrink-0" />
                        <span>ORDER NOW</span>
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
