"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatRupiahShort } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { getTotalItems, getTotalAmount, toggleCart } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalItems = isMounted ? getTotalItems() : 0;
  const totalAmount = isMounted ? getTotalAmount() : 0;

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628981613310";

  const navLinks = [
    { label: "Beranda", href: "#beranda" },
    { label: "Katalog", href: "#katalog" },
    { label: "Tentang Kami", href: "#tentang-kami" },
    { label: "Cara Pesan", href: "#cara-pesan" },
    { label: "Galeri", href: "#galeri" },
    { label: "Testimoni", href: "#testimoni" },
    { label: "Kontak", href: "#kontak" },
  ];

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo with Official Uploaded Mascot Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-amber-50 border-2 border-amber-300 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src="/logo-gurih-gacor.jpg"
                alt="Logo Gurih Gacor"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="block font-black text-xl sm:text-2xl tracking-tight text-stone-900 leading-none">
                GURIH<span className="text-amber-600">GACOR</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-amber-700 uppercase mt-0.5 block">
                Kriuk-Kriuk Nya Bikin Ngiler!
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavLinkClick(e, item.href)}
                className="text-xs font-bold text-stone-700 hover:text-amber-600 transition-colors uppercase tracking-wider py-1 hover:border-b-2 hover:border-amber-500 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions: PESAN, Keranjang, LOGIN */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Direct WhatsApp PESAN Button (Clean, compact, no raw phone number) */}
            <a
              href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=Halo%20Admin%20Gurih%20Gacor,%20saya%20ingin%20memesan%20makanan.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm hover:shadow transition-all active:scale-95"
              title="Pesan Langsung via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>PESAN</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-md active:scale-95"
              aria-label="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">
                {totalItems > 0 ? formatRupiahShort(totalAmount) : "Keranjang"}
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Direct WhatsApp Button */}
            <a
              href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=Halo%20Admin%20Gurih%20Gacor,%20saya%20ingin%20memesan%20makanan.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider active:scale-95 shadow-sm"
              title="Pesan WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>PESAN</span>
            </a>

            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl bg-stone-900 text-white active:scale-95"
              aria-label="Keranjang"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col gap-2 mb-4">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavLinkClick(e, item.href)}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-stone-800 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-stone-200">
              <a
                href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=Halo%20Admin%20Gurih%20Gacor,%20saya%20ingin%20memesan%20makanan.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Pesan via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
