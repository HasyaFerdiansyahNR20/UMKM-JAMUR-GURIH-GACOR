"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from "lucide-react";
import { Promotion } from "@/types";

interface PromoSliderProps {
  promotions: Promotion[];
}

export const PromoSlider: React.FC<PromoSliderProps> = ({ promotions }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const activePromos = promotions.filter((p) => p.is_active);

  useEffect(() => {
    if (activePromos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activePromos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activePromos.length]);

  if (activePromos.length === 0) return null;

  const promo = activePromos[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white shadow-xl shadow-amber-900/10 min-h-[220px] flex items-center">
        
        {/* Background Image Overlay with Gradient */}
        {promo.banner_url && (
          <div className="absolute inset-0 z-0">
            <img
              src={promo.banner_url}
              alt={promo.title}
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10 w-full max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-black uppercase tracking-wider mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>{promo.badge || "PROMO SPESIAL"}</span>
            {promo.discount_info && (
              <span className="ml-1 bg-white text-amber-700 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                {promo.discount_info}
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            {promo.title}
          </h3>

          <p className="text-amber-100 text-xs sm:text-sm max-w-xl leading-relaxed mb-6 font-medium">
            {promo.subtitle || "Pesan sekarang dan nikmati sensasi renyah gurihnya!"}
          </p>

          <a
            href={promo.link_url || "#catalog"}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-stone-900 hover:bg-amber-50 font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <span>{promo.cta_text || "Klaim Promo"}</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </a>
        </div>

        {/* Navigation Arrows */}
        {activePromos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + activePromos.length) % activePromos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
              aria-label="Promo sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % activePromos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
              aria-label="Promo selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots Indicators */}
        {activePromos.length > 1 && (
          <div className="absolute bottom-3 right-6 z-20 flex gap-1.5">
            {activePromos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide ? "bg-white w-6" : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
