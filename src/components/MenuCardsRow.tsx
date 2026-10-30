"use client";

import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatRupiahShort } from "@/lib/utils";

interface MenuCardsRowProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const MenuCardsRow: React.FC<MenuCardsRowProps> = ({ products, onSelectProduct }) => {
  const { addItem } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollToCatalog = () => {
    const el = document.getElementById("katalog") || document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Take first 3-6 featured products
  const displayItems = products.slice(0, 6);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Card background theme classes matching the 3 cards in reference image
  const themeStyles = {
    green: {
      cardBg: "bg-[#5b7b28]",
      badgeBorder: "border-[#435d1c]",
      priceText: "text-[#5b7b28]",
    },
    amber: {
      cardBg: "bg-[#e48e38]",
      badgeBorder: "border-[#c27123]",
      priceText: "text-[#e48e38]",
    },
    olive: {
      cardBg: "bg-[#65a30d]",
      badgeBorder: "border-[#4d7c0f]",
      priceText: "text-[#65a30d]",
    },
  };

  return (
    <section className="relative bg-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading & Tagline */}
        <div className="text-center mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-600 uppercase block mb-1">
            MENU FAVORIT JUARA
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Pilihan Spesial Gurih &amp; Renyah
          </h2>
          <p className="text-stone-500 text-sm mt-2 max-w-xl mx-auto font-medium">
            Sensasi kriuk renyah di setiap gigitan dengan bumbu rempah khas Nusantara
          </p>
        </div>

        {/* Carousel Wrapper with Navigation Arrows */}
        <div className="relative">
          
          {/* Left Arrow Button matching reference image circle arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 border border-stone-200 text-stone-700 items-center justify-center shadow-lg hover:bg-stone-50 hover:scale-105 active:scale-95 transition-all"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button matching reference image circle arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 border border-stone-200 text-stone-700 items-center justify-center shadow-lg hover:bg-stone-50 hover:scale-105 active:scale-95 transition-all"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 pt-16 pb-8 overflow-x-auto no-scrollbar"
          >
            {displayItems.map((product, idx) => {
              // Cycle through the 3 themes (green, amber, olive)
              const themeKey = (product.card_theme || (idx % 3 === 0 ? "green" : idx % 3 === 1 ? "amber" : "olive")) as "green" | "amber" | "olive";
              const currentTheme = themeStyles[themeKey] || themeStyles.green;

              return (
                <div key={product.id} className="relative pt-12 flex justify-center">
                  
                  {/* The Colored Card Box */}
                  <div
                    className={`${currentTheme.cardBg} w-full max-w-sm rounded-[2rem] pt-20 pb-8 px-6 text-white shadow-xl shadow-stone-900/10 hover:shadow-2xl transition-all duration-300 relative flex flex-col justify-between`}
                  >
                    
                    {/* Takeaway Food Box (Popping out over the top of the card) */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-4/5 z-10 group cursor-pointer"
                      onClick={handleScrollToCatalog}
                    >
                      <div className="relative bg-stone-900 rounded-2xl p-2 shadow-2xl shadow-stone-950/40 border-2 border-stone-700/80 transform group-hover:scale-105 transition-transform duration-300">
                        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-stone-950">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>

                        {/* Top-Right Circular Price Badge on the Takeaway Box */}
                        <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-white border-2 border-dashed border-stone-300 shadow-md flex flex-col items-center justify-center p-1 text-center">
                          <span className="text-[7px] font-black text-stone-400 uppercase tracking-tight leading-none">
                            MULAI DARI
                          </span>
                          <span className={`text-[11px] font-black ${currentTheme.priceText} leading-tight mt-0.5`}>
                            5 Ribuan
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content Area */}
                    <div className="mt-6 text-left">
                      {/* Cursive Subtitle / Category matching reference image (e.g. Jeera / Kadai / Palak) */}
                      <p className="font-serif italic text-lg sm:text-xl text-white/90 leading-none mb-1">
                        {product.name.split(" ")[0]}
                      </p>

                      {/* Bold Food Title matching reference image */}
                      <h3 className="text-2xl font-black text-white tracking-tight leading-tight line-clamp-1 mb-2">
                        {product.name.split(" ").slice(1).join(" ") || product.name}
                      </h3>

                      {/* 5 Stars Rating & Score matching reference image */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex text-amber-300">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          ))}
                        </div>
                        <span className="text-xs font-black text-white/90">
                          {product.rating || 4.5}
                        </span>
                      </div>

                      {/* Short Description matching reference image */}
                      <p className="text-white/80 text-xs line-clamp-2 leading-relaxed mb-6 font-normal">
                        {product.description}
                      </p>
                    </div>

                    {/* Bottom Dark "ORDER NOW" Button matching reference image */}
                    <div>
                      <button
                        onClick={handleScrollToCatalog}
                        className="w-full py-3 rounded-full bg-[#1c1917] hover:bg-black text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                        ORDER NOW
                      </button>
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
