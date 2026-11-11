"use client";

import React, { useState, useRef } from "react";
import { Promotion } from "@/types";
import { Plus, Trash2, CheckCircle2, XCircle, Upload, AlertCircle, TicketPercent } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { createPromotionAction, togglePromotionStatusAction, deletePromotionAction } from "@/actions/promotions";
import { uploadProductImageAction } from "@/actions/upload";
import { validateAndCompressImage } from "@/lib/imageCompressor";
import { parsePromotionRule } from "@/lib/promoParser";
import { formatRupiahShort } from "@/lib/utils";

interface BannerManagementProps {
  initialPromotions: Promotion[];
}

export const BannerManagement: React.FC<BannerManagementProps> = ({ initialPromotions }) => {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("PROMO SPESIAL");
  const [discountInfo, setDiscountInfo] = useState("Hemat Rp 5.000");
  const [discountNominal, setDiscountNominal] = useState<string>("5000");
  const [minQtyRule, setMinQtyRule] = useState<string>("2");
  const [variantRule, setVariantRule] = useState<string>("semua");
  const [bannerUrl, setBannerUrl] = useState("/gallery/kemasan-jamur-crispy-tiga-varian.webp");
  const [ctaText, setCtaText] = useState("Pesan Promo Sekarang");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const applyQuickRuleToText = (nominalStr: string, qtyStr: string, variantStr: string) => {
    const nominal = Math.max(0, parseInt(nominalStr || "0", 10) || 0);
    const qty = Math.max(1, parseInt(qtyStr || "1", 10) || 1);

    if (nominal > 0) {
      setDiscountInfo(`Hemat Rp ${nominal.toLocaleString("id-ID")}`);
    }

    const variantLabel =
      variantStr === "semua" ? "varian apa saja" : `varian ${variantStr}`;

    if (qty > 1) {
      setSubtitle(
        `Berlaku pembelian minimal ${qty} porsi ${variantLabel}${
          nominal > 0 ? ` diskon Rp ${nominal.toLocaleString("id-ID")}` : ""
        }`
      );
    } else {
      setSubtitle(
        `Berlaku untuk pembelian ${variantLabel}${
          nominal > 0 ? ` diskon Rp ${nominal.toLocaleString("id-ID")}` : ""
        }`
      );
    }
  };

  const handleOpenAdd = () => {
    setTitle("");
    setBadge("PROMO SPESIAL");
    setDiscountNominal("5000");
    setMinQtyRule("2");
    setVariantRule("Pedas Manis");
    setDiscountInfo("Hemat Rp 5.000");
    setSubtitle("Berlaku pembelian minimal 2 porsi varian Pedas Manis diskon Rp 5.000");
    setBannerUrl("/gallery/kemasan-jamur-crispy-tiga-varian.webp");
    setCtaText("Pesan Promo Sekarang");
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const compressed = await validateAndCompressImage(selectedFile, {
        maxWidth: 1200,
        maxHeight: 600,
        quality: 0.82,
      });

      setBannerUrl(compressed.dataUrl);

      const formData = new FormData();
      formData.append("file", compressed.file);
      formData.append("folder", "banners");

      const uploadRes = await uploadProductImageAction(formData);
      if (uploadRes.success && uploadRes.url) {
        setBannerUrl(uploadRes.url);
      }
    } catch (err: any) {
      setUploadError(err.message || "Gagal memproses gambar banner.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
        link_url: "#katalog",
        is_active: true,
      };

      const res = await createPromotionAction(payload);
      if (!res.success) {
        throw new Error(res.error || "Gagal menyimpan banner.");
      }
      setPromotions((prev) => [
        (res.data || { id: `promo-${Date.now()}`, ...payload }) as Promotion,
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
      const res = await togglePromotionStatusAction(id, !currentActive);
      if (!res.success) {
        alert("Gagal mengubah status banner.");
        return;
      }
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentActive } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status banner.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus banner promo ini?")) return;
    try {
      const res = await deletePromotionAction(id);
      if (!res.success) {
        alert("Gagal menghapus banner.");
        return;
      }
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus banner.");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-stone-900">
            Pengelolaan Promo Banner &amp; Diskon Keranjang
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Setiap banner promo yang <strong>Aktif</strong> otomatis muncul di halaman utama dan dapat dipilih pelanggan di dropdown <strong>Gunakan Promo / Diskon</strong> pada Keranjang Pesanan.
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
        {promotions.map((promo) => {
          const parsedRule = parsePromotionRule(promo);

          return (
            <div
              key={promo.id}
              className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 flex flex-col justify-between"
            >
              <div className="relative h-36 bg-stone-900">
                <img
                  src={promo.banner_url}
                  alt={promo.title}
                  width={600}
                  height={144}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-amber-700">
                    {promo.badge || "PROMO"}
                  </span>
                  {promo.discount_info && (
                    <span className="bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                      {promo.discount_info}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 mb-0.5">{promo.title}</h4>
                    <p className="text-xs text-stone-500 line-clamp-2">{promo.subtitle}</p>
                  </div>

                  {/* Preview Aturan Diskon Otomatis di Keranjang */}
                  <div className="px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                    <TicketPercent className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Potongan Keranjang:{" "}
                      <strong>
                        {parsedRule.discountType === "percentage"
                          ? `${parsedRule.discountValue}%`
                          : parsedRule.discountValue > 0
                          ? formatRupiahShort(parsedRule.discountValue)
                          : "Rp 0"}
                      </strong>
                      {" • "}Min. {parsedRule.minQuantity} porsi
                      {" • "}
                      {parsedRule.requiredVariant
                        ? `Khusus ${parsedRule.requiredVariant}`
                        : "Semua Varian"}
                    </span>
                  </div>
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
                    <span>{promo.is_active ? "Aktif di Keranjang" : "Non-aktif"}</span>
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
          );
        })}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Tambah Banner Promo & Diskon Keranjang"
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
                placeholder="Contoh: Promo Pedas Manis Gacor"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* PENGATURAN OTOMATIS POTONGAN HARGA & SYARAT KERANJANG */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950">
                <TicketPercent className="w-4 h-4 text-amber-600" />
                <span>Aturan Potongan Harga Otomatis di Keranjang</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Potongan (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={discountNominal}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDiscountNominal(val);
                      applyQuickRuleToText(val, minQtyRule, variantRule);
                    }}
                    placeholder="5000"
                    className="w-full px-2.5 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Min. Beli (Porsi)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={minQtyRule}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMinQtyRule(val);
                      applyQuickRuleToText(discountNominal, val, variantRule);
                    }}
                    className="w-full px-2.5 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Khusus Varian
                  </label>
                  <select
                    value={variantRule}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVariantRule(val);
                      applyQuickRuleToText(discountNominal, minQtyRule, val);
                    }}
                    className="w-full px-2 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="semua">Semua Varian</option>
                    <option value="Pedas Manis">Pedas Manis</option>
                    <option value="Pedas">Pedas</option>
                    <option value="Manis">Manis</option>
                    <option value="Original">Original</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Sub-Judul / Keterangan Syarat di Banner
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Contoh: Beli 2 varian Pedas Manis diskon Rp 5.000"
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
                  Info Diskon (Nominal Potongan)
                </label>
                <input
                  type="text"
                  value={discountInfo}
                  onChange={(e) => setDiscountInfo(e.target.value)}
                  placeholder="Contoh: Hemat Rp 5.000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* UPLOAD GAMBAR BANNER (Minimal & Clean) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                Gambar Background Banner *
              </label>

              <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/80 space-y-2.5">
                <div className="relative h-28 w-full rounded-xl overflow-hidden border border-stone-300 bg-stone-900">
                  <img
                    src={bannerUrl}
                    alt="Preview Banner"
                    width={600}
                    height={200}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingImage ? "MENGUPLOAD..." : "UPLOAD FOTO"}</span>
                  </button>

                  <span className="text-[11px] font-medium text-stone-500">
                    Upload Max 2 MB (JPG, PNG, WebP)
                  </span>
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-600 font-semibold">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
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
                disabled={isSubmitting || isUploadingImage}
                className="px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
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
