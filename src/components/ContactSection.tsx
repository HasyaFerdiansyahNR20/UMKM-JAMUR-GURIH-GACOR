"use client";

import React, { useState } from "react";
import { Phone, MapPin, Clock, Instagram, Share2, Check, ExternalLink, MessageCircle } from "lucide-react";

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628981613310";
  const displayPhone = "0898-1613-310";
  const address = "Jl. Reni Jaya Utara 1 Gg. H. Muntir No.4, Pd. Petir, Kec. Bojongsari, Kota Tangerang Selatan, Banten 16517";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="kontak" className="py-20 bg-[#faf8f5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>Hubungi Kami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            Lokasi & Kontak <span className="text-amber-600">Gurih Gacor</span>
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Ada pertanyaan, pesanan jumlah banyak untuk acara, atau ingin mampir langsung ke outlet? Kami siap melayani!
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* WhatsApp Direct Order Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 fill-emerald-600 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                    Fast Response
                  </span>
                  <h3 className="text-lg font-black text-stone-900 mt-0.5">
                    WhatsApp Hotline
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 mb-3">
                    Pemesanan cepat, konsultasi menu catering, atau konfirmasi transfer.
                  </p>
                  <a
                    href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=Halo%20Gurih%20Gacor,%20saya%20ingin%20bertanya%20tentang%20menu.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-md active:scale-95 transition-all"
                  >
                    <span>Chat Sekarang ({displayPhone})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                    Buka Setiap Hari
                  </span>
                  <h3 className="text-lg font-black text-stone-900 mt-0.5">
                    Jam Operasional
                  </h3>
                  <div className="mt-2 space-y-1 text-xs sm:text-sm text-stone-600">
                    <p className="flex justify-between gap-4">
                      <span className="font-semibold text-stone-800">Senin – Minggu:</span>
                      <span className="font-black text-amber-700">09.00 – 21.00 WIB</span>
                    </p>
                    <p className="text-[11px] text-stone-400 italic mt-1">
                      *Menerima pesanan online & takeaway setiap hari.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Copy Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">
                    Outlet & Dapur Utama
                  </span>
                  <h3 className="text-lg font-black text-stone-900 mt-0.5">
                    Alamat Fisik
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                    {address}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Alamat Berhasil Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Salin Alamat Lengkap</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                Media Sosial Resmi
              </span>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-pink-200 text-pink-700 text-xs font-extrabold hover:shadow-sm transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@gurihgacor.id</span>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-100 border border-stone-200 text-stone-800 text-xs font-extrabold hover:shadow-sm transition-all"
                >
                  <span className="text-xs font-black">TikTok:</span>
                  <span>@gurihgacor.official</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps Embed Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-xl overflow-hidden flex flex-col h-full min-h-[480px]">
            <div className="flex items-center justify-between mb-4 px-2">
              <div>
                <h3 className="font-black text-lg text-stone-900">
                  Peta Lokasi Google Maps
                </h3>
                <p className="text-xs text-stone-500">
                  Mudah ditemukan lewat rute navigasi Google Maps
                </p>
              </div>
              <a
                href="https://maps.app.goo.gl/3vqf68ptrZtxmxbo7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full border border-stone-300 hover:border-amber-500 bg-stone-50 text-stone-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Buka di Aplikasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Google Maps iFrame */}
            <div className="relative flex-1 w-full min-h-[400px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
              <iframe
                title="Google Maps Lokasi Gurih Gacor"
                src="https://maps.google.com/maps?q=-6.3683611,106.7276389&hl=id&z=17&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
