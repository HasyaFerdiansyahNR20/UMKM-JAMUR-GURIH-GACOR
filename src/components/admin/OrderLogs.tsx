"use client";

import React, { useState } from "react";
import { Order, OrderLog } from "@/types";
import { formatRupiahShort } from "@/lib/utils";
import { updateOrderStatusAction } from "@/actions/orders";
import { Phone, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface OrderLogsProps {
  initialOrders: Order[];
  initialOrderLogs: OrderLog[];
}

export const OrderLogs: React.FC<OrderLogsProps> = ({
  initialOrders,
  initialOrderLogs,
}) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatusAction(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status pesanan.");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-black text-stone-900">
          Log Transaksi &amp; Pesanan Masuk
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Daftar pesanan dari alur Direct WhatsApp Order yang tersinkronisasi ke basis data Supabase
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <Clock className="w-10 h-10 text-stone-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-stone-600">Belum ada pesanan yang tercatat</p>
          <p className="text-[11px] text-stone-400">
            Pesanan pelanggan melalui WhatsApp checkout akan muncul di sini secara otomatis.
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
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {orders.map((o) => (
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
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === "completed" || o.status === "ready"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "preparing"
                          ? "bg-sky-100 text-sky-800"
                          : o.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-white font-medium focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Sedang Dimasak</option>
                      <option value="ready">Siap Diambil / Diantar</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Batal</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
