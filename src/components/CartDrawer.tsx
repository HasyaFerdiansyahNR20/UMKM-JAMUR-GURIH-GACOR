"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Send,
  ShoppingBag,
  Plus,
  Minus,
  MessageCircle,
  CheckCircle2,
  TicketPercent,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Promotion } from "@/types";
import { formatRupiahShort } from "@/lib/utils";
import {
  formatWhatsAppMessage,
  generateWhatsAppUrl,
  generateTelegramUrl,
} from "@/lib/whatsapp";
import { checkoutSchema } from "@/lib/validations";
import { createOrderAction } from "@/actions/orders";
import { fetchPromotionsAction } from "@/actions/promotions";
import { evaluatePromoForCart } from "@/lib/promoParser";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalAmount,
    selectedPromoId,
    setSelectedPromoId,
    checkoutInfo,
    setCheckoutInfo,
    lastSubmittedOrder,
    setLastSubmittedOrder,
  } = useCart();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoadingPromos, setIsLoadingPromos] = useState(false);

  // Fetch active promotions from Owner's Banner Promo whenever CartDrawer opens
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoadingPromos(true);
    fetchPromotionsAction()
      .then((data) => {
        if (!isMounted) return;
        const active = (data || []).filter((p) => p.is_active);
        setPromotions(active);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoadingPromos(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    customerName,
    customerPhone,
    orderType,
    deliveryAddress,
    tableNumber,
    notes,
  } = checkoutInfo;

  const subtotalAmount = getTotalAmount();

  // Evaluate all active promotions against current cart items
  const promoEvaluations = promotions.map((promo) => ({
    promo,
    evaluation: evaluatePromoForCart(promo, items, subtotalAmount),
  }));

  const selectedPromoEntry = promoEvaluations.find(
    (entry) => entry.promo.id === selectedPromoId
  );

  const activeEvaluation = selectedPromoEntry?.evaluation || null;
  const appliedDiscount =
    activeEvaluation && activeEvaluation.isEligible
      ? activeEvaluation.discountAmount
      : 0;
  const finalTotalAmount = Math.max(0, subtotalAmount - appliedDiscount);
  const appliedPromoTitle =
    activeEvaluation && activeEvaluation.isEligible
      ? activeEvaluation.rule.title
      : undefined;

  const handleCheckoutChannel = async (channel: "whatsapp" | "telegram") => {
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

    const paymentMethod = channel === "telegram" ? "Direct Telegram" : "Direct WhatsApp";

    try {
      // 1. Log order asynchronously to Supabase (with discounted total & promo info)
      const orderRes = await createOrderAction({
        customerName,
        customerPhone,
        orderType,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
        tableNumber: orderType === "dine_in" ? tableNumber : undefined,
        notes,
        items,
        totalAmount: finalTotalAmount,
        discountAmount: appliedDiscount,
        promoTitle: appliedPromoTitle,
        paymentMethod,
      });

      const orderPayload = {
        customerName,
        customerPhone,
        orderType,
        deliveryAddress,
        tableNumber,
        notes,
        items,
        subtotalAmount,
        discountAmount: appliedDiscount,
        promoTitle: appliedPromoTitle,
        totalAmount: finalTotalAmount,
        orderNumber: orderRes.orderNumber,
      };

      // 2. Generate both WhatsApp & Telegram URLs + copy formatted text to clipboard as fallback
      const waUrl = generateWhatsAppUrl(orderPayload);
      const tgUrl = generateTelegramUrl(orderPayload);
      const formattedText = formatWhatsAppMessage(orderPayload);

      try {
        await navigator.clipboard?.writeText(formattedText);
      } catch {
        // Ignore clipboard permission errors
      }

      // 3. Persist last submitted order WITHOUT wiping the cart so accidental close never loses items
      setLastSubmittedOrder({
        orderNumber: orderRes.orderNumber || `GCR-${Date.now().toString().slice(-6)}`,
        channel,
        whatsappUrl: waUrl,
        telegramUrl: tgUrl,
        createdAt: new Date().toISOString(),
      });

      const targetUrl = channel === "telegram" ? tgUrl : waUrl;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Checkout error:", err);
      const fallbackOrderNum = `GCR-${Date.now().toString().slice(-6)}`;
      const fallbackPayload = {
        customerName,
        customerPhone,
        orderType,
        deliveryAddress,
        tableNumber,
        notes,
        items,
        subtotalAmount,
        discountAmount: appliedDiscount,
        promoTitle: appliedPromoTitle,
        totalAmount: finalTotalAmount,
        orderNumber: fallbackOrderNum,
      };

      const waUrl = generateWhatsAppUrl(fallbackPayload);
      const tgUrl = generateTelegramUrl(fallbackPayload);

      setLastSubmittedOrder({
        orderNumber: fallbackOrderNum,
        channel,
        whatsappUrl: waUrl,
        telegramUrl: tgUrl,
        createdAt: new Date().toISOString(),
      });

      const targetUrl = channel === "telegram" ? tgUrl : waUrl;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCheckoutChannel("whatsapp");
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
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#faf8f5]">
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
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <ShoppingBag className="w-16 h-16 mx-auto mb-3 stroke-[1.2]" />
                <h4 className="text-base font-bold text-stone-600">Keranjang masih kosong</h4>
                <p className="text-xs text-stone-400 mt-1">
                  Yuk pilih menu jamur gurih dan kuliner lezat favoritmu sekarang!
                </p>
              </div>
            ) : (
              items.map((item, idx) => {
                const sizeBadgeText = item.selectedSambal
                  ? item.selectedSambal.replace(/^Ukuran\s*/i, "")
                  : "";

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSambal || ""}-${item.itemTotal}-${idx}`}
                    className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 flex gap-3 relative group"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-extrabold text-xs text-stone-900 leading-snug">
                            {item.product.name}
                            {sizeBadgeText ? (
                              <span className="ml-1.5 inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wide">
                                {sizeBadgeText}
                              </span>
                            ) : null}
                          </h4>
                          <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                            Harga Satuan: {formatRupiahShort(item.itemTotal)}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(
                              item.product.id,
                              item.selectedSambal,
                              item.notes,
                              item.itemTotal
                            )
                          }
                          className="text-stone-400 hover:text-red-500 transition-colors p-1 shrink-0"
                          aria-label="Hapus item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-stone-500 truncate mt-1">
                          + {item.selectedAddons.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[10px] text-stone-500 italic truncate mt-1">
                          Catatan: {item.notes}
                        </p>
                      )}

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-200/80">
                        <span className="font-black text-xs text-stone-900">
                          {formatRupiahShort(item.itemTotal * item.quantity)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedSambal,
                                item.notes,
                                item.itemTotal
                              )
                            }
                            className="w-6 h-6 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-stone-900 min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedSambal,
                                item.notes,
                                item.itemTotal
                              )
                            }
                            className="w-6 h-6 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center hover:bg-stone-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Form & Direct WhatsApp / Telegram Checkout Section */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-[#faf8f5] space-y-3 max-h-[60vh] overflow-y-auto">
              
              {/* Anti-Lost Order Recovery Banner */}
              {lastSubmittedOrder && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-extrabold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Pesanan #{lastSubmittedOrder.orderNumber} Tersimpan Aman</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Pesanan sudah terkirim? Kosongkan keranjang sekarang?")) {
                          clearCart();
                        }
                      }}
                      className="text-[10px] font-bold text-stone-500 hover:text-red-600 underline shrink-0"
                    >
                      Kosongkan Keranjang
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Jika WhatsApp/Telegram tidak sengaja tertutup, daftar pesanan Anda masih tersimpan di sini.
                  </p>
                </div>
              )}

              {/* DROPDOWN PILIHAN GUNAKAN PROMO / DISKON */}
              <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="cart-promo-select"
                    className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950"
                  >
                    <TicketPercent className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Gunakan Promo / Diskon</span>
                  </label>
                  {promotions.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                      {promotions.length} Promo Tersedia
                    </span>
                  )}
                </div>

                <select
                  id="cart-promo-select"
                  value={selectedPromoEntry ? selectedPromoId : ""}
                  onChange={(e) => setSelectedPromoId(e.target.value)}
                  disabled={isLoadingPromos || promotions.length === 0}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-amber-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-60"
                >
                  <option value="">
                    {isLoadingPromos
                      ? "Memuat daftar promo..."
                      : promotions.length === 0
                      ? "-- Belum ada promo aktif saat ini --"
                      : "-- Pilih Promo Diskon yang Berlaku --"}
                  </option>
                  {promoEvaluations.map(({ promo, evaluation }) => (
                    <option key={promo.id} value={promo.id}>
                      {evaluation.isEligible ? "✅ " : "🔒 "}
                      {evaluation.summaryLabel}
                    </option>
                  ))}
                </select>

                {/* Status Promo yang Dipilih */}
                {activeEvaluation && activeEvaluation.isEligible && (
                  <div className="flex items-start gap-2 px-2.5 py-2 rounded-xl bg-emerald-100/90 border border-emerald-300 text-[11px] text-emerald-900 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span>
                        Promo <strong>{activeEvaluation.rule.title}</strong> aktif! Harga otomatis dipotong{" "}
                        <strong className="text-emerald-700">
                          -{formatRupiahShort(activeEvaluation.discountAmount)}
                        </strong>
                        .
                      </span>
                      {activeEvaluation.rule.subtitle && (
                        <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                          Info: {activeEvaluation.rule.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeEvaluation && !activeEvaluation.isEligible && (
                  <div className="flex items-start gap-2 px-2.5 py-2 rounded-xl bg-amber-100/80 border border-amber-300 text-[11px] text-amber-900 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{activeEvaluation.reasonIfIneligible}</span>
                  </div>
                )}
              </div>

              {/* Order Form (Auto-persisted in localStorage) */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Nama Anda *"
                      value={customerName}
                      onChange={(e) => setCheckoutInfo({ customerName: e.target.value })}
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
                      onChange={(e) => setCheckoutInfo({ customerPhone: e.target.value })}
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
                    onClick={() => setCheckoutInfo({ orderType: "takeaway" })}
                    className={`py-1.5 rounded-lg transition-all ${
                      orderType === "takeaway" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
                    }`}
                  >
                    Takeaway
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutInfo({ orderType: "dine_in" })}
                    className={`py-1.5 rounded-lg transition-all ${
                      orderType === "dine_in" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
                    }`}
                  >
                    Dine In
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutInfo({ orderType: "delivery" })}
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
                    onChange={(e) => setCheckoutInfo({ deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                )}

                {orderType === "dine_in" && (
                  <input
                    type="text"
                    placeholder="Nomor Meja..."
                    value={tableNumber}
                    onChange={(e) => setCheckoutInfo({ tableNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                )}

                <input
                  type="text"
                  placeholder="Catatan tambahan (opsional)..."
                  value={notes}
                  onChange={(e) => setCheckoutInfo({ notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                {/* Subtotal, Promo Deduction & Dual Checkout Buttons */}
                <div className="pt-1.5 space-y-2">
                  {appliedDiscount > 0 && (
                    <div className="space-y-1 pb-1.5 border-b border-stone-200 text-xs">
                      <div className="flex items-center justify-between text-stone-500 font-semibold">
                        <span>Subtotal Pesanan:</span>
                        <span>{formatRupiahShort(subtotalAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-700 font-extrabold">
                        <span>Diskon ({appliedPromoTitle}):</span>
                        <span>-{formatRupiahShort(appliedDiscount)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-stone-600">Total Pembayaran:</span>
                    <div className="flex items-center gap-2">
                      {appliedDiscount > 0 && (
                        <span className="text-xs font-bold text-stone-400 line-through">
                          {formatRupiahShort(subtotalAmount)}
                        </span>
                      )}
                      <span className="font-black text-lg text-amber-600">
                        {formatRupiahShort(finalTotalAmount)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>PESAN SEKARANG VIA WHATSAPP</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleCheckoutChannel("telegram")}
                    className="w-full py-2.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>PESAN VIA TELEGRAM (@GurihGacorBot)</span>
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
