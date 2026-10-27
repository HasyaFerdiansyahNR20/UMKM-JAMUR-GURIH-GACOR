"use client";

import React from "react";
import { Star, ShoppingBag, ArrowDown, Flame } from "lucide-react";
import { Product } from "@/types";

interface HeroSectionProps {
  featuredProduct?: Product;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ featuredProduct }) => {
  const handleScrollToCatalog = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("katalog") || document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#katalog";
    }
  };

  const productImage = featuredProduct?.image_url || "/products/jamur-crispy-original.webp";

  return (
    <section
      id="beranda"
      className="relative min-h-[85vh] bg-[#faf5ee] overflow-hidden flex items-center pt-24 pb-16 lg:py-20"
    >
      {/* 1. Latar Belakang Lengkungan Organik & Hiasan Doodle Garis */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        
        {/* Lengkungan Oranye Dinamis Pojok Kanan Atas */}
        <div className="absolute -top-10 -right-10 w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] bg-gradient-to-br from-amber-400/90 via-orange-500 to-amber-600 rounded-bl-[200px] sm:rounded-bl-[240px] opacity-90 shadow-2xl transform rotate-3" />
        
        {/* Floating Bubble Accent Top Right */}
        <div className="absolute top-28 right-72 w-8 h-8 rounded-full bg-amber-400/80 shadow-md hidden xl:block" />
        <div className="absolute top-44 right-80 w-5 h-5 rounded-full bg-orange-400/70 hidden xl:block" />
        <div className="absolute top-12 right-96 w-4 h-4 rounded-full bg-amber-300/80 hidden xl:block" />

        {/* Lengkungan Oranye Dinamis Pojok Kiri Bawah */}
        <div className="absolute -bottom-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 rounded-tr-[200px] sm:rounded-tr-[240px] opacity-90 shadow-2xl" />
        
        {/* Floating Bubble Accent Bottom Left */}
        <div className="absolute bottom-28 left-72 w-7 h-7 rounded-full bg-amber-400/80 hidden xl:block" />
        <div className="absolute bottom-40 left-80 w-4 h-4 rounded-full bg-orange-400/70 hidden xl:block" />

        {/* SVG Doodle Line Art: Jamur, Cabai, Bumbu Tabur */}
        <svg
          className="absolute inset-0 w-full h-full text-amber-900/25"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Doodle Jamur Tiram Kiri Atas */}
          <g transform="translate(40, 110) scale(0.75)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15,45 C10,18 65,15 70,45 C72,50 12,50 15,45 Z" />
            <path d="M30,48 L32,70 C33,75 50,75 52,70 L55,48" />
            <circle cx="28" cy="30" r="3" fill="currentColor" opacity="0.6" />
            <circle cx="50" cy="32" r="4" fill="currentColor" opacity="0.6" />
          </g>

          {/* Doodle Cabai Kiri Atas */}
          <g transform="translate(190, 85) rotate(-18) scale(0.7)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12,12 C28,22 45,58 24,80 C12,92 6,75 14,54 C20,38 18,22 12,12 Z" />
            <path d="M12,12 C10,6 7,3 4,2" strokeWidth="2.8" />
          </g>

          {/* Doodle Jamur Champignon Kiri Bawah */}
          <g transform="translate(140, 240) scale(0.65)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M10,35 C10,10 50,10 50,35 Z" />
            <path d="M22,35 L22,50 C22,55 38,55 38,50 L38,35" />
          </g>

          {/* Doodle Cabai Bawah Tengah */}
          <g transform="translate(560, 560) rotate(35) scale(0.7)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12,12 C28,22 45,58 24,80 C12,92 6,75 14,54 C20,38 18,22 12,12 Z" />
            <path d="M12,12 C10,6 7,3 4,2" strokeWidth="2.8" />
          </g>

          {/* Doodle Jamur Kanan Bawah */}
          <g transform="translate(760, 550) scale(0.75)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M15,45 C10,18 65,15 70,45 Z" />
            <path d="M30,48 L32,70 C33,75 50,75 52,70 L55,48" />
          </g>

          {/* Doodle Cabai Kanan Bawah */}
          <g transform="translate(1160, 510) rotate(-25) scale(0.75)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12,12 C28,22 45,58 24,80 C12,92 6,75 14,54 C20,38 18,22 12,12 Z" />
            <path d="M12,12 C10,6 7,3 4,2" strokeWidth="2.8" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* 2. SISI KIRI: Foto Piring Jamur Crispy & Badge Scalloped (order-1: Tampil di Atas pada Mobile) */}
          <div className="lg:col-span-6 relative flex justify-center order-1 lg:order-1 pt-4 sm:pt-0">
            <div
              className="relative w-full max-w-md sm:max-w-lg cursor-pointer"
              onClick={handleScrollToCatalog}
              title="Klik untuk melihat menu katalog"
            >
              
              {/* Foto Piring Jamur Crispy dengan Bayangan Alami */}
              <div className="relative z-10 rounded-[36px] overflow-hidden bg-white/40 p-2 border-2 border-white/80 shadow-2xl shadow-amber-900/15 transform hover:scale-[1.015] active:scale-98 transition-transform duration-500">
                <img
                  src={productImage}
                  alt="Jamur Crispy Original Gurih Gacor"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-auto object-cover rounded-[30px] shadow-sm"
                />
              </div>

              {/* Badge Lingkaran Gerigi Matahari (Scalloped Sunburst Stamp) */}
              <div className="absolute -top-6 -right-3 sm:-right-7 z-20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center filter drop-shadow-xl">
                  
                  {/* Bentuk Bintang Gerigi Matahari (SVG Sunburst) */}
                  <svg
                    className="w-full h-full text-gradient"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="sunburstGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                    {/* 24-point Scalloped Sunburst Path */}
                    <path
                      d="M50 0 L56 7 L65 5 L69 13 L78 13 L80 22 L89 25 L88 34 L96 39 L93 48 L99 55 L93 61 L97 70 L89 74 L90 83 L81 85 L79 94 L70 93 L66 100 L58 97 L52 100 L46 95 L39 99 L36 91 L27 92 L26 83 L17 82 L18 73 L10 71 L13 62 L6 57 L11 49 L6 42 L13 37 L10 28 L19 26 L19 17 L28 17 L31 9 L40 11 Z"
                      fill="url(#sunburstGrad)"
                    />
                  </svg>

                  {/* Border Putus-putus Putih Dalam */}
                  <div className="absolute inset-2 sm:inset-3 rounded-full border-2 border-dashed border-white/95 flex flex-col items-center justify-center text-center p-1.5 pointer-events-none select-none">
                    <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-white leading-tight">
                      MULAI DARI
                    </span>
                    <span className="text-sm sm:text-lg font-black text-white leading-tight mt-0.5 drop-shadow-sm">
                      5 Ribuan
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* 3. SISI KANAN: Tipografi Judul, Rating, dan Dual Tombol CTA (order-2: Tampil di Bawah Foto pada Mobile) */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left order-2 lg:order-2">
            
            {/* Tagline Motto Badge dengan Maskot Resmi */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/25">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20 shrink-0 flex items-center justify-center">
                <img
                  src="/logo-gurih-gacor.webp"
                  alt="Maskot"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-black tracking-wide uppercase">
                &ldquo;KRIUK-KRIUK NYA BIKIN NGILER!&rdquo;
              </span>
              <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 shrink-0" />
            </div>

            {/* Sub-heading & Judul Pahlawan */}
            <div>
              <p className="font-serif italic text-xl sm:text-2xl text-stone-800 font-semibold mb-1 tracking-tight">
                Gourmet Crispy Nusantara
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                <span className="text-stone-900">Jamur </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600">
                  Crispy
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 drop-shadow-sm">
                  Original
                </span>
              </h1>
            </div>

            {/* Rating Bintang & Ulasan Sosial */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-black text-stone-900 text-sm">4.8</span>
              <a
                href="#testimoni"
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline underline-offset-4 transition-colors"
              >
                150 Ulasan Pelanggan
              </a>
            </div>

            {/* DUAL CTA BUTTONS (Fungsi Teruji: Scroll Mulus Langsung ke #katalog) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              
              {/* Tombol Utama: PESAN SEKARANG */}
              <a
                href="#katalog"
                onClick={handleScrollToCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>PESAN SEKARANG</span>
              </a>

              {/* Tombol Sekunder: LIHAT PRODUK ↓ */}
              <a
                href="#katalog"
                onClick={handleScrollToCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/80 hover:bg-white text-stone-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider border-2 border-orange-200/90 hover:border-orange-500 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
              >
                <span>LIHAT PRODUK</span>
                <ArrowDown className="w-4 h-4 text-orange-600" />
              </a>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
