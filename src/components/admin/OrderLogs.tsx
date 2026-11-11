"use client";

import React, { useState, useEffect, useRef } from "react";
import { Order, OrderLog } from "@/types";
import { formatRupiahShort } from "@/lib/utils";
import { updateOrderStatusAction } from "@/actions/orders";
import { Phone, Clock, CheckCircle2, Timer, PlusCircle } from "lucide-react";

interface OrderLogsProps {
  initialOrders: Order[];
  initialOrderLogs: OrderLog[];
}

const TEN_MINUTES_MS = 10 * 60 * 1000;

function formatCountdown(msRemaining: number): string {
  const totalSec = Math.max(0, Math.floor(msRemaining / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export const OrderLogs: React.FC<OrderLogsProps> = ({
  initialOrders,
}) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const autoCancellingIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cancel pending orders that exceed 10 minutes without payment confirmation
  useEffect(() => {
    orders.forEach((order) => {
      if (order.status !== "pending" || !order.created_at) return;
      const createdMs = new Date(order.created_at).getTime();
      if (isNaN(createdMs)) return;

      const remaining = createdMs + TEN_MINUTES_MS - nowMs;
      if (remaining <= 0 && !autoCancellingIds.current.has(order.id)) {
        autoCancellingIds.current.add(order.id);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, status: "cancelled" } : o
          )
        );
        updateOrderStatusAction(order.id, "cancelled").catch(() => {});
      }
    });
  }, [nowMs, orders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (!orderId.startsWith("sim-")) {
        await updateOrderStatusAction(orderId, newStatus);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status pesanan.");
    }
  };

  // Helper to simulate a fresh pending order so the user can test the 10-min auto-cancel timer
  const handleAddSimulationOrder = () => {
    const simOrder: Order = {
      id: `sim-${Date.now()}`,
      order_number: `SIM-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: "Pelanggan Tes (Simulasi Timer)",
      customer_phone: "081234567890",
      order_type: "takeaway",
      total_amount: 15000,
      status: "pending",
      payment_method: "Direct WhatsApp",
      created_at: new Date().toISOString(),
    };
    setOrders((prev) => [simOrder, ...prev]);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-stone-900">
            Log Transaksi &amp; Pesanan Masuk (Auto-Cancel 10 Menit)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Pesanan berstatus <strong>Pending</strong> otomatis dibatalkan jika belum ada konfirmasi pembayaran dalam <strong>10 menit</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddSimulationOrder}
          className="px-4 py-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-amber-700" />
          <span>Tes Simulasi Pesanan (10 Menit)</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <Clock className="w-10 h-10 text-stone-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-stone-600">Belum ada pesanan yang tercatat</p>
          <p className="text-[11px] text-stone-400">
            Pesanan pelanggan melalui WhatsApp/Telegram checkout akan muncul di sini secara otomatis.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-extrabold text-[10px]">
              <tr>
                <th className="py-3 px-4">No. Pesanan</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Tipe &amp; Alamat</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status &amp; Batas Waktu Bayar</th>
                <th className="py-3 px-4 text-right">Konfirmasi / Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {orders.map((o) => {
                const createdMs = o.created_at ? new Date(o.created_at).getTime() : 0;
                const remainingMs = createdMs ? createdMs + TEN_MINUTES_MS - nowMs : 0;
                const isPendingActive = o.status === "pending" && remainingMs > 0;
                const isUrgent = isPendingActive && remainingMs < 2 * 60 * 1000;

                return (
                  <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-black text-stone-900">
                      #{o.order_number || o.id.slice(0, 8)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 block">{o.customer_name}</span>
                      <a
                        href={`https://wa.me/${o.customer_phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Phone className="w-3 h-3" />
                        {o.customer_phone}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold uppercase text-[10px] bg-stone-100 px-2 py-0.5 rounded-full block w-fit mb-1">
                        {o.order_type || "takeaway"}
                      </span>
                      <span className="text-[11px] text-stone-500 line-clamp-1">
                        {o.delivery_address || (o.table_number ? `Meja ${o.table_number}` : "-")}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-amber-600">
                      {formatRupiahShort(o.total_amount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.status === "completed" || o.status === "ready"
                              ? "bg-emerald-100 text-emerald-800"
                              : o.status === "preparing"
                              ? "bg-sky-100 text-sky-800"
                              : o.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {o.status === "cancelled" ? "Cancelled (Batal)" : o.status}
                        </span>

                        {isPendingActive && (
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                              isUrgent
                                ? "bg-red-600 text-white animate-pulse"
                                : "bg-amber-50 text-amber-900 border border-amber-300"
                            }`}
                          >
                            <Timer className="w-3 h-3" />
                            <span>Auto-Cancel: {formatCountdown(remainingMs)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {o.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(o.id, "preparing")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                            title="Konfirmasi Pembayaran Diterima"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Sudah Bayar</span>
                          </button>
                        )}

                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-white font-medium focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="pending">Pending (Menunggu Bayar)</option>
                          <option value="preparing">Sedang Dimasak</option>
                          <option value="ready">Siap Diambil / Diantar</option>
                          <option value="completed">Selesai</option>
                          <option value="cancelled">Batal</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
