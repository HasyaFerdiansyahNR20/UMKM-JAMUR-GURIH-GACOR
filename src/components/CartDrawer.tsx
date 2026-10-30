"use client";

import React, { useState } from "react";
import { X, Trash2, Send, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatRupiahShort } from "@/lib/utils";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import { checkoutSchema } from "@/lib/validations";
import { createOrderAction } from "@/actions/orders";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalAmount,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"takeaway" | "dine_in" | "delivery">("takeaway");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = getTotalAmount();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Keranjang Anda masih kosong.");
      return;
    }

    // Validate form with Zod
    const validation = checkoutSchema.safeParse({
      customerName,
      customerPhone,
      orderType,
      deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
      tableNumber: orderType === "dine_in" ? tableNumber : undefined,
      notes,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // 1. Log order asynchronously to Supabase
      const orderRes = await createOrderAction({
        customerName,
        customerPhone,
        orderType,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
        tableNumber: orderType === "dine_in" ? tableNumber : undefined,
        notes,
        items,
        totalAmount,
      });

      // 2. Generate WhatsApp URL
      const waUrl = generateWhatsAppUrl({
        customerName,
        customerPhone,
        orderType,
        deliveryAddress,
        tableNumber,
        notes,
        items,
        totalAmount,
        orderNumber: orderRes.orderNumber,
      });

      // 3. Clear cart & open WhatsApp
      clearCart();
      closeCart();
      window.open(waUrl, "_blank");
    } catch (err) {
      console.error("Checkout error:", err);
      // Fallback: still open WhatsApp even if DB logging fails
      const fallbackUrl = generateWhatsAppUrl({
        customerName,
        customerPhone,
        orderType,
        deliveryAddress,
        tableNumber,
        notes,
        items,
        totalAmount,
      });
      clearCart();
      closeCart();
      window.open(fallbackUrl, "_blank");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-[#faf8f5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900">Keranjang Pesanan</h3>
                <p className="text-[11px] font-medium text-stone-500">
                  {items.length} jenis menu dipilih
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <ShoppingBag className="w-16 h-16 mx-auto mb-3 stroke-[1.2]" />
                <h4 className="text-base font-bold text-stone-600">Keranjang masih kosong</h4>
                <p className="text-xs text-stone-400 mt-1">
                  Yuk pilih menu jamur gurih dan kuliner lezat favoritmu sekarang!
                </p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${idx}`}
                  className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex gap-3 relative group"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-extrabold text-xs text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedSambal)}
                        className="text-stone-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Options list */}
                    {item.selectedSambal && (
                      <p className="text-[11px] text-amber-700 font-medium">
                        🌶️ {item.selectedSambal}
                      </p>
                    )}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <p className="text-[10px] text-stone-500 truncate">
                        + {item.selectedAddons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-[10px] text-stone-400 italic truncate">
                        Catatan: {item.notes}
                      </p>
                    )}

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-200/80">
                      <span className="font-black text-xs text-stone-900">
                        {formatRupiahShort(item.itemTotal * item.quantity)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSambal)}
                          className="w-6 h-6 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center hover:bg-stone-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-900 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSambal)}
                          className="w-6 h-6 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center hover:bg-stone-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form & Direct WhatsApp Checkout Section */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-[#faf8f5] space-y-4">
              
              {/* Order Form */}
              <form onSubmit={handleCheckout} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Nama Anda *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        errors.customerName ? "border-red-500" : "border-stone-300"
                      }`}
                    />
                    {errors.customerName && (
                      <span className="text-[10px] text-red-500">{errors.customerName}</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="No. WhatsApp (08xxx) *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        errors.customerPhone ? "border-red-500" : "border-stone-300"
                      }`}
                    />
                    {errors.customerPhone && (
                      <span className="text-[10px] text-red-500">{errors.customerPhone}</span>
                    )}
                  </div>
                </div>

                {/* Order Type Selector */}
                <div className="grid grid-cols-3 gap-1 bg-stone-200/70 p-1 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setOrderType("takeaway")}
                    className={`py-1.5 rounded-lg transition-all ${
                      orderType === "takeaway" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
                    }`}
                  >
                    Takeaway
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("dine_in")}
                    className={`py-1.5 rounded-lg transition-all ${
                      orderType === "dine_in" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
                    }`}
                  >
                    Dine In
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("delivery")}
                    className={`py-1.5 rounded-lg transition-all ${
                      orderType === "delivery" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
                    }`}
                  >
                    Delivery
                  </button>
                </div>

                {orderType === "delivery" && (
                  <input
                    type="text"
                    placeholder="Alamat Pengiriman Lengkap..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                )}

                {orderType === "dine_in" && (
                  <input
                    type="text"
                    placeholder="Nomor Meja..."
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                )}

                <input
                  type="text"
                  placeholder="Catatan tambahan (opsional)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                {/* Subtotal & Checkout Button */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="font-bold text-stone-600">Total Pembayaran:</span>
                    <span className="font-black text-lg text-amber-600">
                      {formatRupiahShort(totalAmount)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>PESAN SEKARANG VIA WHATSAPP</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
