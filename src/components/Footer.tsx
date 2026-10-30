import React from "react";
import Link from "next/link";
import { Phone, Instagram, Clock, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "62895634949189";

  return (
    <footer className="bg-stone-900 text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Brand Logo & Slogan */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-50 p-1 border-2 border-amber-400 mb-3 shadow-lg">
            <img
              src="/logo-gurih-gacor.webp"
              alt="Logo Gurih Gacor"
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            GURIH<span className="text-amber-500">GACOR</span>
          </h3>
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-stone-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-stone-700">
            <span>&ldquo;KRIUK-KRIUK NYA BIKIN NGILER!&rdquo;</span>
          </div>
          <p className="text-stone-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            UMKM kuliner spesialis jamur crispy bumbu 7 rempah nusantara. Renyah tahan lama, higienis, dan terjangkau untuk semua penikmat kriuk.
          </p>
        </div>

        {/* Operating Hours & Location Summary */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-xs text-stone-300">
          <div className="flex items-center gap-2 bg-stone-800/80 px-4 py-2 rounded-full border border-stone-700">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Buka Setiap Hari: <strong>09.00 – 21.00 WIB</strong></span>
          </div>
          <a
            href="https://maps.app.goo.gl/3vqf68ptrZtxmxbo7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-stone-800/80 hover:bg-stone-700 px-4 py-2 rounded-full border border-stone-700 transition-colors"
          >
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Jl. Reni Jaya Utara 1 Gg. H. Muntir No.4, Tangerang Selatan</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <a
            href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-stone-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow border border-stone-700"
            aria-label="WhatsApp"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/gurih.gacor/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-stone-800 hover:bg-pink-600 text-white flex items-center justify-center transition-colors shadow border border-stone-700"
            aria-label="Instagram @gurih.gacor"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://www.tiktok.com/@gurih.gacor"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center transition-colors shadow border border-stone-700 text-xs font-black"
            aria-label="TikTok @gurih.gacor"
          >
            TT
          </a>
        </div>

        {/* Navigation Anchor Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-stone-400 mb-8">
          <a href="#beranda" className="hover:text-amber-400 transition-colors">
            Beranda
          </a>
          <span className="text-stone-700">•</span>
          <a href="#katalog" className="hover:text-amber-400 transition-colors">
            Katalog Menu
          </a>
          <span className="text-stone-700">•</span>
          <a href="#tentang-kami" className="hover:text-amber-400 transition-colors">
            Tentang Kami
          </a>
          <span className="text-stone-700">•</span>
          <a href="#cara-pesan" className="hover:text-amber-400 transition-colors">
            Cara Pesan
          </a>
          <span className="text-stone-700">•</span>
          <a href="#galeri" className="hover:text-amber-400 transition-colors">
            Galeri
          </a>
          <span className="text-stone-700">•</span>
          <a href="#testimoni" className="hover:text-amber-400 transition-colors">
            Testimoni
          </a>
          <span className="text-stone-700">•</span>
          <a href="#kontak" className="hover:text-amber-400 transition-colors">
            Kontak
          </a>
          <span className="text-stone-700">•</span>
          <Link href="/login" className="hover:text-amber-400 transition-colors">
            Staff Login
          </Link>
        </div>

        {/* Copyright notice */}
        <p className="text-[11px] text-stone-500 font-medium">
          Copyright &copy; 2026 UMKM Gurih Gacor. All rights reserved.
        </p>

      </div>
    </footer>
  );
};
