"use client";

import React, { useState } from "react";
import { Flame, ShoppingBag, Plus, Star, Check, MessageCircle, X } from "lucide-react";
import { Product, Category } from "@/types";
import { formatRupiahShort } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { generateDirectProductWhatsAppUrl } from "@/lib/whatsapp";

interface CatalogGridProps {
  products: Product[];
  categories?: Category[];
}

interface SizeOption {
  label: string;
  price: number;
  description: string;
}

const SIZE_OPTIONS: SizeOption[] = [
  { label: "Small", price: 5000, description: "Porsi Pas / Camilan Ringan" },
  { label: "Medium", price: 10000, description: "Porsi Sedang Mantap" },
  { label: "Large", price: 15000, description: "Porsi Kenyang Maksimal" },
];

export const CatalogGrid: React.FC<CatalogGridProps> = ({ products }) => {
  const { addItem } = useCart();

  // Selected product for customization modal (Detail Produk)
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(SIZE_OPTIONS[0]);
  const [itemNotes, setItemNotes] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<number>(1);

  // HCI Feedback: Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenCustomize = (product: Product) => {
    setCustomizingProduct(product);
    setSelectedSize(SIZE_OPTIONS[0]);
    setItemNotes("");
    setItemQuantity(1);
  };

  // Unit price per porsi murni sesuai pilihan ukuran (Small 5k, Medium 10k, Large 15k)
  const currentUnitPrice = selectedSize.price;
  const grandTotal = currentUnitPrice * itemQuantity;

  // Aksi: Tambah ke Keranjang
  const handleConfirmAddToCart = () => {
    if (!customizingProduct) return;
    
    const sizeLabel = selectedSize.label.replace(/Large\s*\/\s*Reguler/gi, "Large");
    const formattedNotes = [
      `Ukuran: ${sizeLabel} (${formatRupiahShort(selectedSize.price)})`,
      itemNotes ? `Catatan: ${itemNotes}` : "",
    ].filter(Boolean).join(" | ");

    const adjustedProduct = {
      ...customizingProduct,
      price: currentUnitPrice,
    };

    addItem(adjustedProduct, itemQuantity, undefined, [], formattedNotes);
    showToast(`"${customizingProduct.name}" (${sizeLabel}) berhasil ditambahkan ke keranjang! 🛒`);
    setCustomizingProduct(null);
  };

  // Aksi: Pesan Langsung via WhatsApp
  const handleDirectWhatsAppOrder = () => {
    if (!customizingProduct) return;

    const sizeLabel = selectedSize.label.replace(/Large\s*\/\s*Reguler/gi, "Large");
    const waUrl = generateDirectProductWhatsAppUrl({
      productName: customizingProduct.name,
      price: selectedSize.price,
      quantity: itemQuantity,
      sizeWeight: `Ukuran ${sizeLabel} (${formatRupiahShort(selectedSize.price)})`,
      notes: itemNotes || undefined,
    });

    window.open(waUrl, "_blank");
    setCustomizingProduct(null);
  };

  return (
    <section id="katalog" className="py-20 bg-[#faf8f5] scroll-mt-16 relative">
      <div id="catalog" className="absolute -top-16 left-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bersih (Tanpa Fitur Search & Filter Kategori) */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Daftar Menu &amp; Katalog Lengkap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Katalog <span className="text-amber-600">Gurih Gacor</span>
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Pilih menu favoritmu, tentukan ukuran porsi, lalu pesan langsung via WhatsApp
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isAvailable = product.availability_status === "available";

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {!isAvailable ? (
                        <Badge variant="danger" size="sm">
                          Stok Habis
                        </Badge>
                      ) : (
                        <div className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                          Tersedia &amp; Fresh
                        </div>
                      )}

                      {product.is_bestseller && isAvailable && (
                        <Badge variant="gold" size="sm">
                          Bestseller
                        </Badge>
                      )}
                    </div>

                    {/* Spicy Flame Badge */}
                    {product.spicy_level && product.spicy_level > 0 ? (
                      <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                        <span>Pedas</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    {/* Price & Rating */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-semibold text-stone-500">Mulai</span>
                        <span className="text-lg font-black text-amber-600">
                          Rp 5.000
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">/ Small</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-stone-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating || 4.8}</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-stone-900 text-base leading-snug group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-stone-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleOpenCustomize(product)}
                    disabled={!isAvailable}
                    className={`w-full py-2.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isAvailable
                        ? "bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-md shadow-amber-500/20"
                        : "bg-stone-200 text-stone-400 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Detail &amp; Pesan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Produk & Modal Pilihan Ukuran (Sesuai Permintaan) */}
      {customizingProduct && (
        <Modal
          isOpen={Boolean(customizingProduct)}
          onClose={() => setCustomizingProduct(null)}
          title={`Detail Produk: ${customizingProduct.name}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            
            {/* 1. Header Produk & Foto */}
            <div className="flex flex-col sm:flex-row gap-4 items-start bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-stone-200">
                <img
                  src={customizingProduct.image_url}
                  alt={customizingProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Tersedia &amp; Fresh
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{customizingProduct.rating || 4.8} / 5.0</span>
                  </div>
                </div>
                <h4 className="font-black text-base text-stone-900">{customizingProduct.name}</h4>
                <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                  {customizingProduct.description}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-black text-amber-600">
                    {formatRupiahShort(currentUnitPrice)}
                  </span>
                  <span className="text-xs text-stone-500 font-semibold">
                    ({selectedSize.label})
                  </span>
                </div>
              </div>
            </div>

            {/* Info Pedas Standar */}
            {customizingProduct.name.toLowerCase().includes("pedas") && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                <Flame className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
                <span>
                  <strong>Info Pedas:</strong> Racikan tingkat kepedasan standar khas Gurih Gacor (saat ini belum bisa memilih level pedas).
                </span>
              </div>
            )}

            {/* 2. Pilihan Ukuran & Harga (Small 5k, Medium 10k, Large 15k) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-2">
                ⚖️ Pilihan Ukuran Menu:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedSize(opt)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedSize.label === opt.label
                        ? "border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-500/20 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 text-stone-700 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-extrabold">{opt.label}</span>
                      {selectedSize.label === opt.label && (
                        <Check className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 block leading-tight">
                      {opt.description}
                    </span>
                    <span className="text-base font-black text-amber-700 mt-2 block">
                      {formatRupiahShort(opt.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Catatan Khusus */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1.5">
                📝 Catatan Khusus (Opsional):
              </label>
              <input
                type="text"
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="Contoh: Goreng agak kering, sambal jangan terlalu asin..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            {/* 4. Quantity Selector */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700">Jumlah Porsi:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                  className="w-9 h-9 rounded-full border border-stone-300 text-stone-700 font-bold flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  -
                </button>
                <span className="text-base font-black text-stone-900 min-w-8 text-center">
                  {itemQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                  className="w-9 h-9 rounded-full border border-stone-300 text-stone-700 font-bold flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* 5. Dual Action Buttons: Direct WhatsApp & Add to Cart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* WhatsApp Direct Order Button */}
              <button
                onClick={handleDirectWhatsAppOrder}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Pesan via WhatsApp ({formatRupiahShort(grandTotal)})</span>
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={handleConfirmAddToCart}
                className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah ke Keranjang</span>
              </button>
            </div>

          </div>
        </Modal>
      )}

      {/* HCI Feedback: Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </section>
  );
};
