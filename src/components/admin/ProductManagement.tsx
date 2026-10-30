"use client";

import React, { useState, useRef } from "react";
import { Product, Category } from "@/types";
import { formatRupiahShort } from "@/lib/utils";
import { Plus, Edit2, Trash2, Upload, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { createProductAction, updateProductAction, deleteProductAction } from "@/actions/products";
import { uploadProductImageAction } from "@/actions/upload";
import { validateAndCompressImage } from "@/lib/imageCompressor";

interface ProductManagementProps {
  initialProducts: Product[];
  categories: Category[];
}

const PRESET_PRODUCT_PHOTOS = [
  { label: "Original", url: "/products/jamur-crispy-original.webp" },
  { label: "Pedas", url: "/products/jamur-crispy-pedas.webp" },
  { label: "Manis", url: "/products/jamur-crispy-manis.webp" },
  { label: "Pedas Manis", url: "/products/jamur-crispy-pedas-manis.webp" },
];

export const ProductManagement: React.FC<ProductManagementProps> = ({
  initialProducts,
  categories,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("/products/jamur-crispy-original.webp");
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const [spicyLevel, setSpicyLevel] = useState<number>(0);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload & auto-compression states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<{
    originalKB: number;
    compressedKB: number;
    width: number;
    height: number;
  } | null>(null);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setCategoryId(categories[0]?.id || "");
    setPrice(5000);
    setOriginalPrice(undefined);
    setImageUrl("/products/jamur-crispy-original.webp");
    setAvailabilityStatus("available");
    setSpicyLevel(0);
    setIsBestseller(false);
    setIsPromo(false);
    setUploadError(null);
    setCompressionInfo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setCategoryId(p.category_id || categories[0]?.id || "");
    setPrice(Number(p.price));
    setOriginalPrice(p.original_price ? Number(p.original_price) : undefined);
    setImageUrl(p.image_url);
    setAvailabilityStatus(p.availability_status);
    setSpicyLevel(p.spicy_level || 0);
    setIsBestseller(Boolean(p.is_bestseller));
    setIsPromo(Boolean(p.is_promo));
    setUploadError(null);
    setCompressionInfo(null);
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      // 1. Validate size (max 2MB) & auto-compress to lightweight WebP (max 800x800, quality 0.82)
      const compressed = await validateAndCompressImage(selectedFile, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.82,
      });

      setCompressionInfo({
        originalKB: compressed.originalSizeKB,
        compressedKB: compressed.compressedSizeKB,
        width: compressed.width,
        height: compressed.height,
      });

      // Immediately show local WebP preview
      setImageUrl(compressed.dataUrl);

      // 2. Upload compressed WebP to Supabase Storage bucket
      const formData = new FormData();
      formData.append("file", compressed.file);
      formData.append("folder", "menus");

      const uploadRes = await uploadProductImageAction(formData);
      if (uploadRes.success && uploadRes.url) {
        setImageUrl(uploadRes.url);
      }
      // If Supabase storage isn't reachable, compressed.dataUrl (<80KB WebP) remains set as safe fallback!
    } catch (err: any) {
      setUploadError(err.message || "Gagal memproses foto produk.");
      setCompressionInfo(null);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Nama produk dan harga wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Product> = {
        name,
        description: description.trim() || `${name} gurih renyah khas UMKM Gurih Gacor.`,
        category_id: categoryId || categories[0]?.id,
        price,
        original_price: originalPrice || null,
        image_url: imageUrl || "/products/jamur-crispy-original.webp",
        availability_status: availabilityStatus,
        spicy_level: spicyLevel,
        is_bestseller: isBestseller,
        is_promo: isPromo,
      };

      if (editingProduct) {
        await updateProductAction(editingProduct.id, payload);
        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? { ...item, ...payload } : item))
        );
      } else {
        const res = await createProductAction(payload);
        if (res.data) {
          setProducts((prev) => [res.data, ...prev]);
        } else {
          // Optimistic local add
          setProducts((prev) => [
            { id: `prod-${prev.length + 1}`, ...payload } as Product,
            ...prev,
          ]);
        }
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;
    try {
      await deleteProductAction(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk.");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-stone-900">
            Manajemen Produk &amp; Harga (CRUD)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Tambah menu baru, unggah foto produk otomatis ringan (WebP), dan atur harga
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-extrabold text-[10px]">
            <tr>
              <th className="py-3 px-4">Menu</th>
              <th className="py-3 px-4">Harga</th>
              <th className="py-3 px-4">Harga Coret</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">{p.name}</span>
                    <span className="text-[11px] text-stone-400 line-clamp-1">{p.description}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-black text-amber-600">
                  {formatRupiahShort(p.price)}
                </td>
                <td className="py-3 px-4 text-stone-400">
                  {p.original_price ? formatRupiahShort(p.original_price) : "-"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.availability_status === "available"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {p.availability_status === "available" ? "Tersedia" : "Habis"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      aria-label="Edit menu"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                      aria-label="Hapus menu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? "Edit Menu Kuliner" : "Tambah Menu Baru"}
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Nama Produk *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Jamur Crispy Saus Tartar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Level Pedas
                </label>
                <select
                  value={spicyLevel}
                  onChange={(e) => setSpicyLevel(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value={0}>Tidak Pedas (Level 0)</option>
                  <option value={1}>Sedang (Level 1)</option>
                  <option value={2}>Pedas Gurih (Level 2)</option>
                  <option value={3}>Super Pedas (Level 3)</option>
                  <option value={5}>Gacor Mampus (Level 5)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Harga Jual (Rp) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Harga Coret / Asli (Opsional)
                </label>
                <input
                  type="number"
                  value={originalPrice || ""}
                  onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* UPLOAD FOTO PRODUK + AUTO WEBP COMPRESSOR */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                Foto Produk *
              </label>

              <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/80 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3.5">
                  {/* Live Thumbnail Preview */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-300 bg-white shrink-0 shadow-sm relative">
                    <img
                      src={imageUrl || "/products/jamur-crispy-original.webp"}
                      alt="Preview Foto Menu"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Upload Controls & Size Specification */}
                  <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {isUploadingImage ? "Mengoptimasi & Upload..." : "Upload Foto dari HP / Laptop"}
                      </span>
                    </button>

                    {/* Ketentuan Ukuran Foto */}
                    <div className="text-[11px] text-stone-600 leading-relaxed bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5">
                      <p className="font-bold text-amber-900 flex items-center justify-center sm:justify-start gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Ketentuan Ukuran Foto (Agar Website Tidak Berat):</span>
                      </p>
                      <ul className="mt-1 space-y-0.5 text-stone-600 list-disc list-inside text-[10px] sm:text-[11px]">
                        <li>
                          <strong>Ukuran File Maksimal:</strong> <span className="font-bold text-stone-900">Maks. 2 MB</span> (Format: JPG, PNG, atau WebP)
                        </li>
                        <li>
                          <strong>Resolusi Rekomendasi:</strong> <span className="font-bold text-stone-900">800 × 600 px</span> (Rasio 4:3 atau 1:1)
                        </li>
                        <li>
                          <strong>Auto-Kompresi Ringan:</strong> Foto otomatis diperkecil ke format <strong>WebP (&lt; 100 KB)</strong> saat di-upload.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Hasil Optimasi WebP */}
                {compressionInfo && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Foto berhasil dioptimasi! Ukuran asli <strong>{compressionInfo.originalKB} KB</strong> → dikompres menjadi <strong>{compressionInfo.compressedKB} KB (WebP {compressionInfo.width}×{compressionInfo.height}px)</strong> ⚡
                    </span>
                  </div>
                )}

                {/* Error Message if file > 2MB or invalid format */}
                {uploadError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-600 font-semibold">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Quick Pick Preset Photos */}
                <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-500 uppercase mr-1">
                    Atau pakai foto bawaan:
                  </span>
                  {PRESET_PRODUCT_PHOTOS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.url);
                        setCompressionInfo(null);
                        setUploadError(null);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        imageUrl === preset.url
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Deskripsi Menu
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat kelezatan dan bumbu menu..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Tandai Bestseller</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                <input
                  type="checkbox"
                  checked={isPromo}
                  onChange={(e) => setIsPromo(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Tandai Promo Diskon</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
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
                {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
