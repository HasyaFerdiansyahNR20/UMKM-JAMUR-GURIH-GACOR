"use client";

import React, { useState } from "react";
import { Product, Category } from "@/types";
import { formatRupiahShort } from "@/lib/utils";
import { Plus, Edit2, Trash2, Image as ImageIcon, Flame } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { createProductAction, updateProductAction, deleteProductAction } from "@/actions/products";

interface ProductManagementProps {
  initialProducts: Product[];
  categories: Category[];
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  initialProducts,
  categories,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const [spicyLevel, setSpicyLevel] = useState<number>(0);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setCategoryId(categories[0]?.id || "");
    setPrice(18000);
    setOriginalPrice(22000);
    setImageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80");
    setAvailabilityStatus("available");
    setSpicyLevel(2);
    setIsBestseller(false);
    setIsPromo(false);
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
    setIsModalOpen(true);
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
        description,
        category_id: categoryId || categories[0]?.id,
        price,
        original_price: originalPrice || null,
        image_url: imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
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
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan produk.");
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
            Tambah menu baru, edit harga, perbarui foto dan deskripsi kuliner
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

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                URL Gambar Produk *
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Deskripsi Menu
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                disabled={isSubmitting}
                className="px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md"
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
