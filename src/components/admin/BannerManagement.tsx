"use client";

import React, { useState } from "react";
import { Promotion } from "@/types";
import { Plus, Trash2, Tag, CheckCircle2, XCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { createPromotionAction, togglePromotionStatusAction, deletePromotionAction } from "@/actions/promotions";

interface BannerManagementProps {
  initialPromotions: Promotion[];
}

export const BannerManagement: React.FC<BannerManagementProps> = ({ initialPromotions }) => {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("PROMO SPESIAL");
  const [discountInfo, setDiscountInfo] = useState("Hemat Rp 5.000");
  const [bannerUrl, setBannerUrl] = useState("");
  const [ctaText, setCtaText] = useState("Pesan Promo Sekarang");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setTitle("");
    setSubtitle("");
    setBadge("PROMO SPESIAL");
    setDiscountInfo("Hemat Rp 5.000");
    setBannerUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80");
    setCtaText("Pesan Promo Sekarang");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !bannerUrl) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<Promotion> = {
        title,
        subtitle,
        badge,
        discount_info: discountInfo,
        banner_url: bannerUrl,
        cta_text: ctaText,
        link_url: "#catalog",
        is_active: true,
      };

      await createPromotionAction(payload);
      setPromotions((prev) => [
        { id: `promo-${Date.now()}`, ...payload } as Promotion,
        ...prev,
      ]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      await togglePromotionStatusAction(id, !currentActive);
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentActive } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus banner promo ini?")) return;
    try {
      await deletePromotionAction(id);
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-stone-900">
            Pengelolaan Promo Banner Slider
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Atur slider promo di halaman utama website untuk menarik pelanggan
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Banner Promo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 flex flex-col justify-between"
          >
            <div className="relative h-36 bg-stone-900">
              <img
                src={promo.banner_url}
                alt={promo.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-amber-700">
                {promo.badge || "PROMO"}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900 mb-1">{promo.title}</h4>
                <p className="text-xs text-stone-500 line-clamp-2">{promo.subtitle}</p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-200">
                <button
                  onClick={() => handleToggle(promo.id, promo.is_active)}
                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors ${
                    promo.is_active
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {promo.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{promo.is_active ? "Aktif" : "Non-aktif"}</span>
                </button>

                <button
                  onClick={() => handleDelete(promo.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                  aria-label="Hapus banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Tambah Banner Promo Baru"
          maxWidth="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Judul Promo *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: DISKON SPESIAL GAJIAN GACOR"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Sub-Judul / Keterangan
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Contoh: Berlaku setiap pembelian 2 porsi jamur crispy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Info Diskon
                </label>
                <input
                  type="text"
                  value={discountInfo}
                  onChange={(e) => setDiscountInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                URL Gambar Background *
              </label>
              <input
                type="url"
                required
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-full border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Banner"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
