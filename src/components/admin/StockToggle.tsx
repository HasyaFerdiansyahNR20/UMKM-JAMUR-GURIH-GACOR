"use client";

import React, { useState } from "react";
import { Product, AvailabilityStatus } from "@/types";
import { toggleStockAction } from "@/actions/products";
import { formatRupiahShort } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Plus } from "lucide-react";

interface StockToggleProps {
  initialProducts: Product[];
  onSwitchToProducts?: () => void;
}

export const StockToggle: React.FC<StockToggleProps> = ({ initialProducts, onSwitchToProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggle = async (productId: string, currentStatus: AvailabilityStatus | string) => {
    const nextStatus: AvailabilityStatus =
      currentStatus === "available" ? "unavailable" : "available";

    setUpdatingId(productId);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, availability_status: nextStatus } : p))
    );

    try {
      const res = await toggleStockAction(productId, nextStatus);
      if (!res.success) {
        // Rollback
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, availability_status: currentStatus } : p))
        );
        alert("Gagal mengubah status stok.");
      }
    } catch (err) {
      console.error(err);
      // Rollback
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, availability_status: currentStatus } : p))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-stone-900">
            Manual Toggle Ketersediaan Stok
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Klik toggle untuk mengubah status menu antara &ldquo;Tersedia&rdquo; atau &ldquo;Habis&rdquo; secara real-time.
          </p>
        </div>

        {onSwitchToProducts && (
          <button
            onClick={onSwitchToProducts}
            className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu Baru</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const isAvailable = product.availability_status === "available";
          const isUpdating = updatingId === product.id;

          return (
            <div
              key={product.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isAvailable
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-stone-200 bg-stone-50 opacity-75"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">{product.name}</h4>
                  <span className="text-[11px] font-semibold text-stone-600 block">
                    {formatRupiahShort(product.price)}
                  </span>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => handleToggle(product.id, product.availability_status)}
                disabled={isUpdating}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAvailable ? "bg-emerald-600" : "bg-stone-300"
                } ${isUpdating ? "opacity-50" : ""}`}
                aria-label={`Ubah status ${product.name}`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isAvailable ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
