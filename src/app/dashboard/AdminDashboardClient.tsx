"use client";

import React, { useState } from "react";
import { Product, Category, Promotion, Order, OrderLog } from "@/types";
import { StockToggle } from "@/components/admin/StockToggle";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { BannerManagement } from "@/components/admin/BannerManagement";
import { OrderLogs } from "@/components/admin/OrderLogs";
import { StoreSettings, toggleEmergencyStaticModeAction } from "@/actions/settings";
import { ToggleLeft, Utensils, Image as ImageIcon, ClipboardList, AlertTriangle, ShieldCheck, Plus } from "lucide-react";

interface AdminDashboardClientProps {
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  orders: Order[];
  orderLogs: OrderLog[];
  initialSettings: StoreSettings;
}

export function AdminDashboardClient({
  products,
  categories,
  promotions,
  orders,
  orderLogs,
  initialSettings,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"stock" | "products" | "promos" | "orders">("stock");
  const [emergencyMode, setEmergencyMode] = useState(initialSettings.emergencyStaticMode);
  const [isTogglingEmergency, setIsTogglingEmergency] = useState(false);

  const handleToggleEmergency = async () => {
    const next = !emergencyMode;
    const confirmMsg = next
      ? "Aktifkan Mode Darurat Statis? Website publik akan menampilkan halaman teks statis sederhana saat basis data maintenance."
      : "Nonaktifkan Mode Darurat Statis dan kembali ke katalog penuh?";

    if (!confirm(confirmMsg)) return;

    setIsTogglingEmergency(true);
    try {
      await toggleEmergencyStaticModeAction(next);
      setEmergencyMode(next);
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah mode darurat.");
    } finally {
      setIsTogglingEmergency(false);
    }
  };

  const tabs = [
    { id: "stock", label: "Ketersediaan Stok", icon: ToggleLeft },
    { id: "products", label: "Katalog & Harga (Tambah Menu)", icon: Utensils, badge: products.length },
    { id: "promos", label: "Banner Promo", icon: ImageIcon, badge: promotions.length },
    { id: "orders", label: "Log Pesanan & Webhook", icon: ClipboardList, badge: orders.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Emergency Toggle & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-stone-900">Dasbor Pengelola Toko</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Motto Dagang: <span className="font-bold text-amber-600">&ldquo;{initialSettings.tagline}&rdquo;</span>
          </p>
        </div>

        {/* Quick Add Product & PRD Emergency Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setActiveTab("products")}
            className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu Baru</span>
          </button>

          <button
            onClick={handleToggleEmergency}
            disabled={isTogglingEmergency}
            className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              emergencyMode
                ? "bg-red-600 hover:bg-red-700 text-white shadow-lg animate-pulse"
                : "bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>
              {emergencyMode ? "Mode Darurat: AKTIF" : "Tombol Darurat (Statis)"}
            </span>
          </button>
        </div>
      </div>

      {/* Modular Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-stone-900 text-white shadow-lg shadow-stone-900/10"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-amber-500 text-stone-950" : "bg-stone-200 text-stone-800"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "stock" && (
          <StockToggle
            initialProducts={products}
            onSwitchToProducts={() => setActiveTab("products")}
          />
        )}
        {activeTab === "products" && (
          <ProductManagement initialProducts={products} categories={categories} />
        )}
        {activeTab === "promos" && <BannerManagement initialPromotions={promotions} />}
        {activeTab === "orders" && (
          <OrderLogs initialOrders={orders} initialOrderLogs={orderLogs} />
        )}
      </div>
    </div>
  );
}
