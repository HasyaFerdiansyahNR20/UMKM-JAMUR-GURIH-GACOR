"use client";

import React, { useState } from "react";
import { Camera, ZoomIn, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface GalleryItem {
  id: string;
  title: string;
  tag?: string;
  image: string;
  description: string;
}

export const GallerySection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: "gal-1",
      title: "Kemasan Standing Pouch Gurih Gacor",
      tag: "Kemasan Resmi",
      image: "/gallery/kemasan-jamur-crispy-tiga-varian.jpg",
      description: "Tampilan kemasan premium ziplock 60gr siap santap, menjaga kerenyahan jamur tahan lama dan higienis.",
    },
    {
      id: "gal-2",
      title: "Tampak Depan Pouch Jamur Tiram Crispy",
      tag: "Kemasan Depan",
      image: "/gallery/kemasan-depan-jamur-tiram-crispy.jpg",
      description: "Desain kemasan depan resmi dengan maskot Gurih Gacor, sertifikasi Halal Indonesia, dan pilihan varian rasa favorit.",
    },
    {
      id: "gal-3",
      title: "Informasi Komposisi & Cara Penyimpanan",
      tag: "Kemasan Belakang",
      image: "/gallery/kemasan-belakang-informasi-produk.jpg",
      description: "Keterangan komposisi alami jamur tiram, anjuran simpan di tempat sejuk & kering, serta tanggal kedaluwarsa.",
    },
    {
      id: "gal-4",
      title: "Jamur Crispy Original",
      tag: "Menu Favorit",
      image: "/products/jamur-crispy-original.jpg",
      description: "Jamur crispy original renyah keemasan dengan racikan 7 rempah Nusantara khas Gurih Gacor.",
    },
    {
      id: "gal-5",
      title: "Jamur Crispy Pedas",
      tag: "Varian Pedas",
      image: "/products/jamur-crispy-pedas.jpg",
      description: "Sensasi gurih renyah jamur berbalut taburan bumbu cabai pedas nikmat yang meresap sempurna.",
    },
    {
      id: "gal-6",
      title: "Jamur Crispy Manis",
      tag: "Varian Manis",
      image: "/products/jamur-crispy-manis.jpg",
      description: "Varian jamur crispy renyah dengan taburan bumbu manis gurih spesial yang legit dan nagih.",
    },
    {
      id: "gal-7",
      title: "Pedas Manis",
      tag: "Varian Best Seller",
      image: "/products/jamur-crispy-pedas-manis.jpg",
      description: "Perpaduan rasa pedas nendang dan manis gurih berpadu seimbang di atas jamur renyah.",
    },
    {
      id: "gal-8",
      title: "Maskot Resmi Gurih Gacor",
      tag: "Identitas Brand",
      image: "/logo-gurih-gacor.jpg",
      description: "Karakter maskot jamur bertopi koki sayap emas yang melambangkan kelezatan dan keramahan UMKM Gurih Gacor.",
    },
  ];

  return (
    <section id="galeri" className="py-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>Dokumentasi Visual</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            Galeri <span className="text-amber-600">Gurih Gacor</span>
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Intip kelezatan produk olahan jamur crispy kami beserta kemasan eksklusif resmi Gurih Gacor.
          </p>
        </div>

        {/* Gallery Grid (Clean tanpa tombol filter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-64 w-full overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Subtle Tag Badge */}
                {item.tag && (
                  <div className="absolute top-3 left-3 bg-stone-900/75 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wide">
                    {item.tag}
                  </div>
                )}

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <ZoomIn className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-extrabold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={Boolean(selectedPhoto)}
          onClose={() => setSelectedPhoto(null)}
          title={selectedPhoto.title}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-video flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain bg-stone-950"
              />
            </div>
            <div>
              {selectedPhoto.tag && (
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                  {selectedPhoto.tag}
                </span>
              )}
              <p className="text-stone-700 text-sm leading-relaxed">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
