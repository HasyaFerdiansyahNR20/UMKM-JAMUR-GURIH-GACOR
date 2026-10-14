"use client";

import React from "react";
import { ShoppingBag, MessageSquare, CheckSquare, Bike, ArrowRight } from "lucide-react";

export const HowToOrderSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: ShoppingBag,
      title: "Pilih Menu Favorit",
      desc: "Telusuri katalog jamur crispy, tentukan ukuran porsi dan pilihan bumbu/sambal favoritmu.",
      highlight: "Bebas pilih varian rasa",
    },
    {
      step: "02",
      icon: MessageSquare,
      title: "Pesan via WhatsApp",
      desc: "Klik tombol Pesan via WhatsApp di menu atau kumpulkan dulu belanjaan di Keranjang.",
      highlight: "Format pesan otomatis",
    },
    {
      step: "03",
      icon: CheckSquare,
      title: "Konfirmasi Pesanan",
      desc: "Admin kami akan memverifikasi total pesanan, ongkir, serta metode pembayaran Anda.",
      highlight: "Pelayanan ramah & cepat",
    },
    {
      step: "04",
      icon: Bike,
      title: "Goreng Fresh & Dikirim",
      desc: "Pesanan digoreng dadakan agar tiba di tempat Anda dalam kondisi panas dan super kriuk!",
      highlight: "Hangat & renyah maksimal",
    },
  ];

  const handleScrollToCatalog = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    const el = document.getElementById("katalog") || document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#katalog";
    }
  };

  return (
    <section id="cara-pesan" className="py-20 bg-white relative overflow-hidden border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Alur Pemesanan Praktis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            Cara Mudah Pesan di <span className="text-amber-600">Gurih Gacor</span>
          </h2>
          <p className="mt-3 text-stone-500 text-sm sm:text-base">
            Hanya 4 langkah mudah untuk menikmati sajian jamur crispy renyah langsung dari dapur kami ke meja Anda.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={index}
                className="relative bg-[#faf8f5] rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-stone-300 group-hover:text-amber-500 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-amber-600 shadow-sm group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-black text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                {/* Highlight Tag */}
                <div className="pt-3 border-t border-stone-200/60 flex items-center text-[11px] font-bold text-amber-700">
                  <span className="bg-amber-100/80 px-2.5 py-1 rounded-full">
                    {item.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a
            href="#katalog"
            onClick={handleScrollToCatalog}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>Mulai Pilih Menu Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
